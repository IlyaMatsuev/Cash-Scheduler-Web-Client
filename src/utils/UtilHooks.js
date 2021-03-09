import {useMutation} from '@apollo/client';
import {useHistory} from 'react-router-dom';
import userMutations from '../mutations/users';
import errorDefs from './ErrorDefinitions';
import {auth, global, pages, server} from '../config';


export function useLogin(variables, onError) {
    const history = useHistory();
    return useMutation(userMutations.LOGIN_USER, {
        update(proxy, result) {
            localStorage.setItem(auth.accessTokenName, result.data.login.accessToken);
            if (variables.remember) {
                localStorage.setItem(auth.emailName, variables.email);
                localStorage.setItem(auth.refreshTokenName, result.data.login.refreshToken);
            } else {
                localStorage.removeItem(auth.emailName);
                localStorage.removeItem(auth.refreshTokenName);
            }
            history.push(pages.homeUrl);
        },
        onError,
        variables: variables
    });
}

export function onUIErrors(error, setErrors, errors) {
    if (error.graphQLErrors?.length > 0 && error.graphQLErrors[0].extensions?.data.fields) {
        const newError = error.graphQLErrors[0];
        if (newError.data.fields) {
            newError.data.fields.forEach(fieldName => {
                errors[fieldName] = newError.message;
            });
        } else {
            errors['general'] = newError.message;
        }
    } else if (Object.keys(error.networkError).length > 0 && error.networkError.result.errors[0].extensions) {
        const newError = error.networkError.result.errors[0];
        if (newError.extensions.fields) {
            newError.extensions.fields.forEach(fieldName => {
                errors[fieldName] = newError.message;
            });
        } else {
            errors['general'] = newError.message;
        }
    } else {
        Object.keys(errors).forEach(errorField => {
            errors[errorField] = errorDefs.CONNECTION_ERROR;
        });
    }
    setErrors({...errors});
}

export function createEntityCache(cache, entity, methods, fragment, variables = {}, firstInList = false) {
    const fields = {};
    methods.forEach(method => fields[method] = existingRefs => {
        const newRef = cache.writeFragment({
            data: entity,
            fragment,
            variables: variables[method] || {}
        });
        return firstInList ? [newRef, ...existingRefs] : [...existingRefs, newRef];
    });
    cache.modify({fields});
}

export function updateEntityCache(cache, entity, fragment, data) {
    cache.writeFragment({
        id: cache.identify(entity),
        fragment,
        data
    });
}

export function removeEntityCache(cache, entity, methods) {
    const fields = {};
    methods.forEach(method => fields[method] = (existingRefs, {readField}) => {
        return existingRefs.filter(r => entity.id !== readField('id', r));
    });
    cache.modify({fields});
}

export function isUrlAbsolute(url) {
    const link = document.createElement('a');
    link.href = url;
    return `${link.origin}${link.pathname}${link.search}${link.hash}` === url;
}

export function convertToValidIconUrl(url) {
    return isUrlAbsolute(url) ? url : `${server.root}${url}`
}

export function isValidNumber(value) {
    return global.numberInputRegExp.test(value) && !isNaN(Number(value));
}

export function onNumberInput(event) {
    if (!isValidNumber(event.target.value)) {
        event.target.value = event.target.value.slice(0, -1);
    }
}

export function toFloat(value) {
    return Number(Number(value).toFixed(2));
}

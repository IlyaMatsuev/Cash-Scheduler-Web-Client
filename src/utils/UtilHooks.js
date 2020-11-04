import {useMutation} from '@apollo/client';
import {useHistory} from 'react-router-dom';
import mutations from '../mutations';
import errorDefs from './ErrorDefinitions';
import {auth, pages} from '../config';


export function useLogin(variables, onError) {
    const history = useHistory();
    return useMutation(mutations.LOGIN_USER, {
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

export function onLoginUIErrors(error, setErrors, errors) {
    if (error.graphQLErrors?.length > 0 && error.graphQLErrors[0].extensions?.data.fields) {
        const newError = error.graphQLErrors[0];
        newError.extensions.data.fields.forEach(fieldName => {
            errors[fieldName] = newError.message;
        });
    } else if (Object.keys(error.networkError).length > 0 && error.networkError.result.errors[0].extensions?.data) {
        const newError = error.networkError.result.errors[0];
        newError.extensions.data.fields.forEach(fieldName => {
            errors[fieldName] = newError.message;
        });
    } else {
        Object.keys(errors).forEach(errorField => {
            errors[errorField] = errorDefs.CONNECTION_ERROR;
        });
    }
    setErrors({...errors});
}

import {useMutation} from '@apollo/client';
import {useHistory} from 'react-router-dom';
import mutations from '../mutations';
import errorDefs from './ErrorDefinitions';


export function useLogin(variables, onError) {
    const history = useHistory();
    return useMutation(mutations.LOGIN_USER, {
        update(proxy, result) {
            localStorage.setItem('accessToken', result.data.login.accessToken);
            if (variables.remember) {
                localStorage.setItem('email', variables.email);
                localStorage.setItem('refreshToken', result.data.login.refreshToken);
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('refreshToken');
            }

            history.push('/home');
        },
        onError,
        variables: variables
    });
}

export function handleGraphQLError(error, setErrors, errors) {
    if (error.graphQLErrors?.length > 0 && error.graphQLErrors[0].extensions?.data.fields) {
        const newError = error.graphQLErrors[0];
        newError.extensions.data.fields.forEach(fieldName => {
            errors[fieldName] = newError.message;
        });
    } else {
        Object.keys(errors).forEach(errorField => {
            errors[errorField] = errorDefs.CONNECTION_ERROR
        });
    }
    setErrors({...errors});
}

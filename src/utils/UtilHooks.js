import {useMutation} from '@apollo/client';
import {useHistory} from 'react-router-dom';
import mutations from '../mutations';


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

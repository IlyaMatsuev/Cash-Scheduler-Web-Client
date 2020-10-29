import React, {useState} from 'react';
import {Button, Container, Form, Header, Segment} from 'semantic-ui-react';
import {useLazyQuery} from '@apollo/client';
import {useSpring, animated} from 'react-spring';
import queries from '../../../queries';
import errorDefs from '../../../utils/ErrorDefinitions';
import ErrorsList from '../ErrorsList/ErrorsList';


const testUser = {
    email: 'sglasscott5i@example.com'
};

const ForgotPasswordForm = ({goToResetPassword, goBackToLogin}) => {

    const [errors, setErrors] = useState({});
    const [state, setState] = useState({
        email: testUser.email,
        code: '',
        emailSent: false
    });

    const [codeFieldAnimation, setCodeFieldAnimation] = useSpring(() => ({opacity: 0, height: '0rem', display: 'none'}));

    const onError = error => {
        if (error.graphQLErrors?.length > 0) {
            const newError = error.graphQLErrors[0];
            newError.extensions.data.fields.forEach(fieldName => {
                errors[fieldName] = newError.message;
            });
            setErrors({...errors});
        } else if (Object.keys(error.networkError).length === 0 || !error.networkError.result.errors[0].extensions?.data) {
            setErrors({email: errorDefs.CONNECTION_ERROR});
        }
    };

    const [checkEmail, {loading: checkEmailLoading}] = useLazyQuery(queries.CHECK_EMAIL, {
        onCompleted(data) {
            setState({...state, email: data.checkEmail, emailSent: true});
            setCodeFieldAnimation({
                to: async next => {
                    await next({display: 'block'});
                    await next({height: '3rem', config: {duration: 150}});
                    await next({opacity: 1, config: {duration: 200}});
                }
            });
        },
        onError
    });
    const [checkCode, {loading: codeVerifyingLoading}] = useLazyQuery(queries.CHECK_CODE, {
        onCompleted(data) {
            goToResetPassword(data.checkCode, state.code);
        },
        onError
    });

    const onSubmit = event => {
        event.preventDefault();
        setErrors({});

        if (state.emailSent) {
            checkCode({variables: state});
        } else {
            checkEmail({variables: state});
        }
    };

    const onChange = event => {
        const {name, value} = event.target;
        setState({...state, [name]: value});
        setErrors({...errors, [name]: undefined});
    };

    const onBack = event => {
        goBackToLogin(event, 50);
    };


    return (
        <Container>
            <Form size="large" noValidate error onSubmit={onSubmit}>
                <Segment stacked>
                    <Header as="h1" color="violet" textAlign="center">
                        Restore Password
                    </Header>
                    <Form.Input fluid icon="mail" iconPosition="left" placeholder="Email" type="email"
                                name="email" value={state.email} error={!!errors.email} disabled={state.emailSent}
                                onChange={onChange}/>

                    <animated.div style={codeFieldAnimation}>
                        <Form.Input fluid icon="key" iconPosition="left" placeholder="Verification Code" type="text"
                                    name="code" value={state.code} error={!!errors.code} onChange={onChange}/>
                    </animated.div>

                    <ErrorsList errors={errors}/>

                    <Button color="violet" fluid className="mt-3" size="large" loading={checkEmailLoading || codeVerifyingLoading}>
                        {state.emailSent ? 'Reset Password' : 'Send Code'}
                    </Button>

                    <Button color="violet" inverted fluid className="mt-3" size="large" onClick={onBack}>
                        Go Back
                    </Button>
                </Segment>
            </Form>
        </Container>
    );
};

export default ForgotPasswordForm;

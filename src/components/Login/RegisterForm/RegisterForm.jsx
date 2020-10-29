import React, {useState} from 'react';
import {useMutation} from '@apollo/client';
import {Form, Button, Container, Segment, Header, Message} from 'semantic-ui-react';
import mutations from '../../../mutations';
import ErrorsList from '../ErrorsList/ErrorsList';
import errorDefs from '../../../utils/ErrorDefinitions';
import {useLogin} from '../../../utils/UtilHooks';
import SecretField from '../../../utils/SecretField';


const RegisterForm = ({goToLogin}) => {

    const [errors, setErrors] = useState({});
    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        balance: 0,
        email: '',
        password: '',
        confirmPassword: ''
    });

    const validate = () => {
        let noErrors = true;
        if (state.password !== state.confirmPassword) {
            setErrors({
                ...errors,
                password: errorDefs.PASSWORDS_DO_NOT_MATCH_ERROR,
                confirmPassword: errorDefs.PASSWORDS_DO_NOT_MATCH_ERROR
            });
            noErrors = false;
        }

        return noErrors;
    };

    const onError = err => {
        if (Object.keys(err.networkError).length === 0 || !err.networkError.result.errors[0].extensions?.data) {
            setErrors({
                email: errorDefs.CONNECTION_ERROR,
                password: errorDefs.CONNECTION_ERROR,
                confirmPassword: errorDefs.CONNECTION_ERROR
            });
        } else {
            const newError = err.networkError.result.errors[0];
            newError.extensions.data.fields.forEach(fieldName => {
                errors[fieldName] = newError.message;
            });
            setErrors({...errors});
        }
    }

    const [login, {loading: loginLoading}] = useLogin({email: state.email, password: state.password}, onError);

    const [register, {loading: registerLoading}] = useMutation(mutations.REGISTER_USER, {
        update() {
            login();
        },
        onError,
        variables: state
    });

    const onSubmit = event => {
        event.preventDefault();
        setErrors({});
        if (validate()) {
            register();
        }
    };

    const onChange = event => {
        const {name, value} = event.target;
        setState({...state, [name]: value});
        setErrors({...errors, [name]: undefined});
    };

    return (
        <Container>
            <Form size="large" noValidate error onSubmit={onSubmit}>
                <Segment stacked>
                    <Header as="h1" color="violet" textAlign="center">
                        Sign Up
                    </Header>
                    <Form.Input fluid icon="user" iconPosition="left" placeholder="First Name" type="text"
                                name="firstName" value={state.firstName} error={!!errors.lastName} onChange={onChange}/>
                    <Form.Input fluid icon="user" iconPosition="left" placeholder="Last Name" type="text"
                                name="lastName" value={state.lastName} error={!!errors.lastName} onChange={onChange}/>
                    <Form.Input fluid icon="dollar" iconPosition="left" placeholder="Current Balance" type="currency"
                                name="balance" value={state.balance} error={!!errors.balance} onChange={onChange}/>

                    <Form.Input fluid icon="mail" iconPosition="left" placeholder="Email" type="email"
                                name="email" value={state.email} error={!!errors.email} onChange={onChange}/>
                    <SecretField value={state.password} error={!!errors.password} onChange={onChange}/>
                    <Form.Input fluid icon="lock" iconPosition="left" placeholder="Confirm Password" type="password"
                                name="confirmPassword" value={state.confirmPassword} error={!!errors.confirmPassword}
                                onChange={onChange}/>

                    <ErrorsList errors={errors}/>

                    <Button color="violet" fluid size="large" loading={registerLoading || loginLoading}>
                        Register
                    </Button>
                </Segment>
            </Form>
            <Message>
                Already registered? <Button color="violet" inverted className="compact ml-2" onClick={goToLogin}>Sign In</Button>
            </Message>
        </Container>
    );
};


export default RegisterForm;

import React, {useState} from 'react';
import {Button, Container, Form, Grid, Header, Icon, Message, Segment} from 'semantic-ui-react';
import errorDefs from '../../../utils/ErrorDefinitions';
import ErrorsList from '../ErrorsList/ErrorsList';
import {useLogin} from '../../../utils/UtilHooks';
import SecretField from "../../../utils/SecretField";


const testUser = {
    email: 'sglasscott5i@example.com',
    password: 'adminAdmin1@'
};

const LoginForm = ({goToRegister, goToRestorePassword}) => {

    const [errors, setErrors] = useState({});
    const [state, setState] = useState({
        email: testUser.email,
        password: testUser.password,
        remember: false,
        passwordShown: false
    });

    const onError = err => {
        if (Object.keys(err.networkError).length === 0 || !err.networkError.result.errors[0].extensions?.data) {
            setErrors({
                email: errorDefs.CONNECTION_ERROR,
                password: errorDefs.CONNECTION_ERROR
            });
        } else {
            const newError = err.networkError.result.errors[0];
            newError.extensions.data.fields.forEach(fieldName => {
                errors[fieldName] = newError.message;
            });
            setErrors({...errors});
        }
    }

    const [login, {loading}] = useLogin(state, onError);

    const onSubmit = event => {
        event.preventDefault();
        setErrors({});
        login();
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
                        Sign In
                    </Header>
                    <Form.Input fluid icon="mail" iconPosition="left" placeholder="Email" type="email"
                                name="email" value={state.email} error={!!errors.email} onChange={onChange}/>
                    <SecretField value={state.password} error={!!errors.password} onChange={onChange}/>
                    <Grid padded="vertically">
                        <Grid.Column width={7}>
                            <Form.Checkbox label="Remember" type="checkbox" className="mt-2" name="remember"
                                           onChange={onChange}/>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Button color="purple" basic className="compact" onClick={goToRestorePassword} animated>
                                <Button.Content visible>Forgot?</Button.Content>
                                <Button.Content hidden>
                                    Reset <Icon name="arrow right"/>
                                </Button.Content>
                            </Button>
                        </Grid.Column>
                    </Grid>

                    <ErrorsList errors={errors}/>

                    <Button color="violet" fluid size="large" loading={loading}>
                        Login
                    </Button>
                </Segment>
            </Form>
            <Message>
                New to us? <Button color="violet" inverted className="compact ml-2" onClick={goToRegister}>Sign
                Up</Button>
            </Message>
        </Container>
    );
};

export default LoginForm;
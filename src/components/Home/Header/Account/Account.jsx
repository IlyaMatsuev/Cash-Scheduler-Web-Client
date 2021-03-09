import React, {useState} from 'react';
import {Header, Button, Container, Popup, Divider, Segment} from 'semantic-ui-react';
import UserForm from './UserForm/UserForm';
import {useMutation} from '@apollo/client';
import {isValidNumber, onUIErrors, toFloat} from '../../../../utils/UtilHooks';
import userQueries from '../../../../queries/users';
import walletQueries from '../../../../queries/wallets';
import userMutations from '../../../../mutations/users';


const Account = ({user, balance}) => {
    const initState = {
        user: {
            ...user,
            balance
        }
    };
    const [state, setState] = useState(initState);

    const [errors, setErrors] = useState({});

    const [updateUser, {loading: updateUserLoading}] = useMutation(userMutations.UPDATE_USER, {
        onError: error => onUIErrors(error, setErrors, errors),
        variables: {
            user: {
                id: state.user.id,
                firstName: state.user.firstName,
                lastName: state.user.lastName,
                balance: toFloat(state.user.balance)
            }
        },
        refetchQueries: [
            {query: userQueries.GET_USER_WITH_BALANCE},
            {query: walletQueries.GET_WALLETS},
        ]
    });

    const getAccountHeader = () => {
        if (state.user.firstName && state.user.lastName) {
            return `${state.user.firstName} ${state.user.lastName}`;
        } else {
            return state.user.email;
        }
    }

    const onUserChange = (event, {name, type, value}) => {
        if (type === 'number' && !isValidNumber(value)) {
            return;
        }
        setState({...state, user: {...state.user, [name]: value}});
    };

    const onUserUpdate = event => {
        event.preventDefault();
        setErrors({});
        updateUser();
    };


    return (
        <Container fluid>
            <Popup trigger={<Button icon="user" circular size="medium"/>}
                   on="click" position="bottom left" flowing>
                <Popup.Header>
                    <Header as="h3" textAlign="center">{getAccountHeader()}</Header>
                    <Divider/>
                </Popup.Header>
                <Popup.Content>
                    <Segment basic loading={updateUserLoading}>
                        <UserForm user={state.user} errors={errors} onUserChange={onUserChange} onUserUpdate={onUserUpdate}/>
                    </Segment>
                </Popup.Content>
            </Popup>
        </Container>
    );
};

export default Account;

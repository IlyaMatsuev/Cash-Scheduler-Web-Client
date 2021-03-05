import React, {useState} from 'react';
import {Header, Button, Container, Popup, Grid, Divider, Segment} from 'semantic-ui-react';
import styles from './Account.module.css';
import UserForm from './UserForm/UserForm';
import {useMutation, useQuery} from '@apollo/client';
import {isValidNumber, onUIErrors, toFloat} from '../../../utils/UtilHooks';
import NotificationsList from './NotificationsList/NotificationsList';
import userQueries from '../../../queries/users';
import walletQueries from '../../../queries/wallets';
import userMutations from '../../../mutations/users';
import settingQueries from '../../../queries/settings';


const Account = ({user, balance}) => {
    const initState = {
        accountPopupOpen: false,
        user: {
            ...user,
            balance
        }
    };
    const [state, setState] = useState(initState);

    const [errors, setErrors] = useState({});


    const {data: settingQueryData} = useQuery(settingQueries.GET_SETTING, {
        variables: {
            name: 'TurnNotificationsOn'
        }
    });

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

    const onAccountPopupToggle = () => {
        setState({...state, accountPopupOpen: !state.accountPopupOpen});
    };


    return (
        <Container fluid>
            <Popup trigger={<Button icon="user" circular size="medium" onClick={onAccountPopupToggle}/>}
                   open={state.accountPopupOpen}
                   position="bottom left" flowing>
                <Popup.Header>
                    <Header as="h3" textAlign="center">{getAccountHeader()}</Header>
                    <Divider/>
                </Popup.Header>
                <Popup.Content className={styles.accountPopupContainer}>
                    <Grid columns={(settingQueryData?.setting && settingQueryData.setting.value === 'true') ? 2 : 1}>
                        <Grid.Column>
                            <Segment loading={updateUserLoading}>
                                <UserForm user={state.user} errors={errors} onUserChange={onUserChange} onUserUpdate={onUserUpdate}/>
                            </Segment>
                        </Grid.Column>
                        {settingQueryData?.setting && settingQueryData.setting.value === 'true' &&
                            <Grid.Column>
                                <NotificationsList/>
                            </Grid.Column>
                        }
                    </Grid>
                </Popup.Content>
            </Popup>
        </Container>
    );
};

export default Account;

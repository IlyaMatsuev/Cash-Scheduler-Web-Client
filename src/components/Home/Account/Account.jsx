import React, {useState} from 'react';
import {Header, Button, Container, Popup, Grid, Divider, Segment} from 'semantic-ui-react';
import styles from './Account.module.css';
import UserForm from './UserForm/UserForm';
import {useMutation, useQuery} from '@apollo/client';
import mutations from '../../../mutations';
import queries from '../../../queries';
import {onUIErrors} from '../../../utils/UtilHooks';
import NotificationsList from './NotificationsList/NotificationsList';
import NotificationReadModal from './NotificationReadModal/NotificationReadModal';


const Account = ({user, settings, onUserChange}) => {
    const initState = {
        selectedNotification: {},
        notificationReadModalOpened: false
    };
    const [state, setState] = useState(initState);

    const initErrorsState = {};
    const [errors, setErrors] = useState({});

    // TODO: move it in some particular place with all mutations for all model types
    const [updateUser, {loading: updateUserLoading}] = useMutation(mutations.UPDATE_USER, {
        onError: error => onUIErrors(error, setErrors, errors),
        variables: {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                balance: user.balance
            }
        },
        refetchQueries: [{query: queries.GET_USER}]
    });


    const {data: notifications, loading: notificationsLoading, error: notificationsError} = useQuery(queries.GET_NOTIFICATIONS);

    // TODO: read - unread can be as one method
    const [readNotification] = useMutation(mutations.READ_NOTIFICATION, {
        refetchQueries: [{query: queries.GET_NOTIFICATIONS}]
    });

    const [unreadNotification] = useMutation(mutations.UNREAD_NOTIFICATION, {
        refetchQueries: [{query: queries.GET_NOTIFICATIONS}]
    });

    const getAccountHeader = () => {
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        } else {
            return user.email;
        }
    }

    const onUserUpdate = event => {
        event.preventDefault();
        setErrors(initErrorsState);
        updateUser();
    };

    const onNotificationRead = selectedNotification => {
        if (!selectedNotification.read) {
            readNotification({variables: {id: selectedNotification.id}});
        }
        setState({...state, notificationReadModalOpened: true, selectedNotification});
    };

    const onNotificationUnread = () => {
        unreadNotification({variables: {id: state.selectedNotification.id}});
        onNotificationReadModalToggle();
    };

    const onNotificationReadModalToggle = () => {
        setState({...state, notificationReadModalOpened: !state.notificationReadModalOpened});
    };


    return (
        <Container fluid>
            <Popup trigger={<Button icon="user" circular size="medium"/>} on="click" flowing>
                <Popup.Header>
                    <Header as="h3" textAlign="center">{getAccountHeader()}</Header>
                    <Divider/>
                </Popup.Header>
                <Popup.Content className={styles.accountPopupContainer}>
                    <Grid columns={settings.TurnNotificationsOn ? 2 : 1}>
                        <Grid.Column>
                            <Segment loading={updateUserLoading}>
                                <UserForm user={user} errors={errors} onUserChange={onUserChange} onUserUpdate={onUserUpdate}/>
                            </Segment>
                        </Grid.Column>
                        {settings.TurnNotificationsOn && <Grid.Column>
                            <Segment basic className="content scrolling" loading={notificationsLoading || notificationsError}>
                                <NotificationsList notifications={notifications && notifications.getAllNotifications}
                                                   onNotificationRead={onNotificationRead}/>
                            </Segment>
                        </Grid.Column>}
                    </Grid>
                </Popup.Content>
            </Popup>

            <NotificationReadModal open={state.notificationReadModalOpened} notification={state.selectedNotification}
                                   onModalToggle={onNotificationReadModalToggle} onUnread={onNotificationUnread}/>
        </Container>
    );
};

export default Account;

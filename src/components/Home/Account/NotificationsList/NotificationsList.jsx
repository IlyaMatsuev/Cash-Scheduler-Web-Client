import React, {useState} from 'react';
import {Container, Divider, Header, Segment} from 'semantic-ui-react';
import styles from './NotificationsList.module.css';
import {useMutation, useQuery} from '@apollo/client';
import notificationQueries from '../../../../queries/notifications';
import notificationMutations from '../../../../mutations/notifications';
import NotificationReadModal from '../NotificationReadModal/NotificationReadModal';


const NotificationsList = () => {
    const initState = {
        selectedNotification: {},
        notificationModalOpen: false
    };
    const [state, setState] = useState(initState);


    const {
        data: notifications,
        loading: notificationsLoading,
        error: notificationsError
    } = useQuery(notificationQueries.GET_NOTIFICATIONS);

    const [toggleReadNotification] = useMutation(notificationMutations.TOGGLE_READ_NOTIFICATION, {
        refetchQueries: [{query: notificationQueries.GET_NOTIFICATIONS}]
    });


    const onNotificationRead = selectedNotification => {
        if (!selectedNotification.isRead) {
            toggleReadNotification({
                variables: {
                    id: selectedNotification.id,
                    read: true
                }
            });
        }
        setState({...state, notificationModalOpen: true, selectedNotification});
    };

    const onNotificationUnread = () => {
        toggleReadNotification({
            variables: {
                id: state.selectedNotification.id,
                read: false
            }
        });
        onNotificationModalToggle();
    };

    const onNotificationModalToggle = () => {
        setState({...state, notificationModalOpen: !state.notificationModalOpen});
    };


    return (
        <Container fluid className={styles.notificationsListContainer}>
            <Segment basic className="content scrolling" loading={notificationsLoading || !!notificationsError}>
                <Header as="h3" textAlign="center">Notifications</Header>
                <Divider/>
                {notifications?.allNotifications && notifications.allNotifications.map(notification => (
                    <Segment key={notification.id} inverted={!notification.isRead}
                             color="grey" textAlign="center" className={styles.notificationEntry}
                             onClick={() => onNotificationRead(notification)}>
                        <Header as="h4">{notification.title}</Header>
                    </Segment>
                ))}
            </Segment>

            <NotificationReadModal open={state.notificationModalOpen} notification={state.selectedNotification}
                                   onModalToggle={onNotificationModalToggle} onUnread={onNotificationUnread}/>
        </Container>
    );
};

export default NotificationsList;

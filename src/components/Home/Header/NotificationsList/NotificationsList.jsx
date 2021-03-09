import React, {useState} from 'react';
import {Button, Container, Divider, Header, Icon, Label, Popup, Segment} from 'semantic-ui-react';
import styles from './NotificationsList.module.css';
import {useMutation, useQuery} from '@apollo/client';
import notificationQueries from '../../../../queries/notifications';
import notificationMutations from '../../../../mutations/notifications';
import notificationFragments from '../../../../fragments/notifications';
import NotificationReadModal from './NotificationReadModal/NotificationReadModal';


const NotificationsList = () => {
    const initState = {
        selectedNotification: {},
        notificationsListOpen: false,
        notificationModalOpen: false
    };
    const [state, setState] = useState(initState);


    const {
        data: notifications,
        loading: notificationsLoading,
        error: notificationsError
    } = useQuery(notificationQueries.GET_NOTIFICATIONS);

    const [toggleReadNotification] = useMutation(notificationMutations.TOGGLE_READ_NOTIFICATION, {
        update: (cache, result) => {
            if (result?.data) {
                const updatedNotification = result.data.toggleReadNotification;
                cache.writeFragment({
                    id: `UserNotification:${updatedNotification.id}`,
                    fragment: notificationFragments.TOGGLE_NOTIFICATION,
                    data: {isRead: updatedNotification.isRead}
                });
                cache.modify({
                    fields: {
                        unreadNotificationsCount(currentValueRef) {
                            return currentValueRef + (updatedNotification.isRead ? -1 : 1);
                        }
                    }
                });
            }
        }
    });


    const toggleNotification = (id, read) => {
        toggleReadNotification({variables: {id, read}});
    };

    const onNotificationRead = selectedNotification => {
        if (!selectedNotification.isRead) {
            toggleNotification(selectedNotification.id, true);
        }
        setState({...state, notificationModalOpen: true, selectedNotification});
    };

    const onNotificationUnread = () => {
        toggleNotification(state.selectedNotification.id, false);
        onNotificationModalToggle();
    };

    const onNotificationsListToggle = () => {
        setState({...state, notificationsListOpen: !state.notificationsListOpen});
    };

    const onNotificationModalToggle = () => {
        setState({...state, notificationModalOpen: !state.notificationModalOpen});
    };


    return (
        <Popup open={state.notificationsListOpen} position="bottom left" flowing
            trigger={<Label className={styles.notificationsListPopup} onClick={onNotificationsListToggle}>
                <Icon name="mail"/>
                {notifications?.unreadNotificationsCount > 0 ? notifications.unreadNotificationsCount : ''}
            </Label>}>
            <Popup.Content>
                <Container fluid className={styles.notificationsListContainer}>
                    <Segment basic className="content scrolling" loading={notificationsLoading || !!notificationsError}>
                        <Header as="h3" textAlign="center">Notifications</Header>
                        <Divider/>
                        {notifications && notifications.notifications.map(notification => (
                            <Segment key={notification.id} inverted={!notification.isRead}
                                     color="grey" textAlign="center"
                                     className={styles.notificationEntry}>
                                <Header as="div" size="small" onClick={() => onNotificationRead(notification)}
                                        className={styles.notificationTitle}>
                                    {notification.title}
                                </Header>
                                <Button inverted={!notification.isRead} size="tiny"
                                        icon={notification.isRead ? 'envelope' : 'envelope open'}
                                        onClick={() => toggleNotification(notification.id, !notification.isRead)}
                                />
                            </Segment>
                        ))}
                    </Segment>

                    <NotificationReadModal open={state.notificationModalOpen} notification={state.selectedNotification}
                                           onModalToggle={onNotificationModalToggle} onUnread={onNotificationUnread}/>
                </Container>
            </Popup.Content>
        </Popup>
    );
};

export default NotificationsList;

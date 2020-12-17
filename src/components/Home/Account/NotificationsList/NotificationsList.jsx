import React from 'react';
import {Container, Divider, Header, Segment} from 'semantic-ui-react';
import styles from './NotificationsList.module.css';


const NotificationsList = ({notifications, onNotificationRead}) => {

    return (
        <Container fluid className={styles.notificationsListContainer}>
            <Header as="h3" textAlign="center">Notifications</Header>
            <Divider/>
            {notifications.length > 0 && notifications.map(notification => (
                <Segment key={notification.id} inverted={!notification.read} color="grey" textAlign="center"
                         className={styles.notificationEntry} onClick={() => onNotificationRead(notification)}>
                    <Header as="h4">{notification.title}</Header>
                </Segment>
            ))}
        </Container>
    );
};

export default NotificationsList;

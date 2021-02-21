import {gql} from '@apollo/client';

export default {
    GET_NOTIFICATIONS: gql`
        query {
            allNotifications {
                id
                title
                content
                isRead
            }
        }
    `
};

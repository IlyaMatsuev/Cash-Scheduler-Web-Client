import {gql} from '@apollo/client';

export default {
    NOTIFICATIONS_SUBSCRIPTION: gql`
        subscription {
            notificationAdded {
                id
                title
                content
                read
            }
        }
    `
};

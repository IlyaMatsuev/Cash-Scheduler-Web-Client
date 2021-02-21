import {gql} from '@apollo/client';

export default {
    GET_TRANSACTION_TYPES: gql`
        query {
            transactionTypes {
                name
                iconUrl
            }
        }
    `
};

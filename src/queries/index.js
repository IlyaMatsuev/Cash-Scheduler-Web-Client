import {gql} from '@apollo/client';

export default {
    GET_USER: gql`
        query {
            getUser {
                id
                firstName
                lastName
                balance
            }
        }
    `,
    CHECK_EMAIL: gql`
        query($email: String!) {
            checkEmail(email: $email)
        }
    `,
    CHECK_CODE: gql`
        query($email: String!, $code: String!) {
            checkCode(email: $email, code: $code)
        }
    `,
    GET_TRANSACTIONS_BY_MONTH: gql`
        query($month: Int!, $size: Int!) {
            getTransactionsByMonth(month: $month) {
                id
                title
                category {
                    id
                    name
                    transactionType {
                        typeName
                        iconUrl
                    }
                    iconUrl
                }
                amount
                date
            }
            getAllRegularTransactions(size: $size) {
                id
                title
                category {
                    id
                    name
                    transactionType {
                        typeName
                        iconUrl
                    }
                    iconUrl
                }
                amount
                date
                nextTransactionDate
            }
        }
    `,
    GET_TRANSACTION_TYPES: gql`
        query {
            getTransactionTypes {
                typeName
                iconUrl
            }
        }
    `,
    GET_USER_CATEGORIES: gql`
        query($typeName: String) {
            getAllCategories(transactionType: $typeName) {
                id
                name
                iconUrl
            }
        }
    `,
    GET_SETTINGS: gql`
        query($unitName: String) {
            getUserSettings(unitName: $unitName) {
                id
                name
                value
                unitName
            }
        }
    `
};

import {gql} from '@apollo/client';

// TODO: split all queries by folders by objects they work with

export default {
    GET_USER: gql`
        query {
            getUser {
                id
                firstName
                lastName
                email
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
    GET_DASHBOARD_TRANSACTIONS: gql`
        query($month: Int!, $year: Int!) {
            getDashboardTransactions(month: $month, year: $year) {
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
            getDashboardRegularTransactions(month: $month, year: $year) {
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
                interval
            }
        }
    `,
    GET_TRANSACTIONS_BY_MONTH: gql`
        query($month: Int!, $year: Int!) {
            getTransactionsByMonth(month: $month, year: $year) {
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
            getRegularTransactionsByMonth(month: $month, year: $year) {
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
                interval
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
    `,
    GET_CATEGORIES_BY_TYPES: gql`
        query {
            getCustomCategories {
                id
                name
                transactionTypeName
                isCustom
                iconUrl
            }
            getStandardCategories {
                id
                name
                transactionTypeName
                isCustom
                iconUrl
            }
        }
    `,
    GET_NOTIFICATIONS: gql`
        query {
            getAllNotifications { 
                id
                title
                content
                read
            }
        }
    `
};

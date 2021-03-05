import {gql} from '@apollo/client';

export default {
    GET_DASHBOARD_TRANSACTIONS: gql`
        query($month: Int!, $year: Int!) {
            dashboardTransactions(month: $month, year: $year) {
                id
                title
                category {
                    id
                    name
                    type {
                        name
                        iconUrl
                    }
                    iconUrl
                }
                amount
                date
            }
            dashboardRecurringTransactions(month: $month, year: $year) {
                id
                title
                category {
                    id
                    name
                    type {
                        name
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
            transactionsByMonth(month: $month, year: $year) {
                id
                title
                category {
                    id
                    name
                    type {
                        name
                        iconUrl
                    }
                    iconUrl
                }
                wallet {
                    id
                    name
                    currency {
                        abbreviation
                        iconUrl
                    }
                }
                amount
                date
            }
            recurringTransactionsByMonth(month: $month, year: $year) {
                id
                title
                category {
                    id
                    name
                    type {
                        name
                        iconUrl
                    }
                    iconUrl
                }
                wallet {
                    id
                    name
                    currency {
                        abbreviation
                        iconUrl
                    }
                }
                amount
                date
                nextTransactionDate
                interval
            }
        }
    `
};
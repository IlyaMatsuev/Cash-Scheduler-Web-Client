import {gql} from '@apollo/client';

export default {
    CREATE_TRANSACTION: gql`
        mutation($transaction: NewTransactionInput!) {
            createTransaction(transaction: $transaction) {
                id
                amount
                date
            }
        }
    `,
    UPDATE_TRANSACTION: gql`
        mutation($transaction: UpdateTransactionInput!) {
            updateTransaction(transaction: $transaction) {
                id
                date
            }
        }
    `,
    DELETE_TRANSACTION: gql`
        mutation($id: Int!) {
            deleteTransaction(id: $id) {
                id
            }
        }
    `,
    CREATE_RECURRING_TRANSACTION: gql`
        mutation($transaction: NewRecurringTransactionInput!) {
            createRegularTransaction(transaction: $transaction) {
                id
                amount
                nextTransactionDate
                category {
                    type {
                        name
                    }
                }
            }
        }
    `,
    UPDATE_RECURRING_TRANSACTION: gql`
        mutation($transaction: UpdateRecurringTransactionInput!) {
            updateRegularTransaction(transaction: $transaction) {
                id
                date
                nextTransactionDate
            }
        }
    `,
    DELETE_RECURRING_TRANSACTION: gql`
        mutation($id: Int!) {
            deleteRegularTransaction(id: $id) {
                id
            }
        }
    `
};

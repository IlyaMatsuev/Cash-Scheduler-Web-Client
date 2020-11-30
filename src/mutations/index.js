import {gql} from '@apollo/client';

export default {
    REGISTER_USER: gql`
        mutation(
            $firstName: String,
            $lastName: String,
            $balance: Float
            $email: String!,
            $password: String!
        ) {
            register(user: {
                firstName: $firstName
                lastName: $lastName
                balance: $balance
                email: $email
                password: $password
            }) {
                id
                email
            }
        }
    `,
    LOGIN_USER: gql`
        mutation($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                accessToken
                refreshToken
            }
        }
    `,
    RESET_PASSWORD: gql`
        mutation($email: String!, $code: String!, $password: String!) {
            resetPassword(email: $email, code: $code, password: $password) {
                id
                email
            }
        }
    `,
    REFRESH_TOKEN: gql`
        mutation($email: String!, $refreshToken: String!) {
            token(email: $email, refreshToken: $refreshToken) {
                accessToken
                refreshToken
            }
        }
    `,
    LOGOUT_USER: gql`
        mutation { logout {id} }
    `,
    CREATE_TRANSACTION: gql`
        mutation($transaction: NewTransactionInput!) {
            createTransaction(transaction: $transaction) {
                id
                amount
                date
            }
        }
    `,
    CREATE_RECURRING_TRANSACTION: gql`
        mutation($transaction: NewRegularTransactionInput!) {
            createRegularTransaction(transaction: $transaction) {
                id
                amount
                nextTransactionDate
                category {
                    transactionType {
                        typeName
                    }
                }
            }
        }
    `,
    UPDATE_SETTING: gql`
        mutation($setting: UpdateUserSettingInput!) {
            updateUserSetting(setting: $setting) {
                id
                name
                value
                unitName
            }
        }
    `,
    UPDATE_SETTINGS: gql`
        mutation($settings: [UpdateUserSettingInput!]) {
            updateUserSettings(settings: $settings) {
                id
                name
                value
                unitName
            }
        }
    `
};

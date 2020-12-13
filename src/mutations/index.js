import {gql} from '@apollo/client';

// TODO: split all mutations by folders by objects they work with

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
    UPDATE_RECURRING_TRANSACTION: gql`
        mutation($transaction: UpdateRegularTransactionInput!) {
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
    `,
    CREATE_CATEGORY: gql`
        mutation($category: NewCategoryInput!) {
            createCategory(category: $category) {
                id
            }
        }
    `,
    UPDATE_CATEGORY: gql`
        mutation($category: UpdateCategoryInput!) {
            updateCategory(category: $category) {
                id
            }
        }
    `,
    DELETE_CATEGORY: gql`
        mutation($id: Int!) {
            deleteCategory(id: $id) {
                id
            }
        }
    `
};

import {gql} from '@apollo/client';

export default {
    GET_ALL_USER_CATEGORIES_WITH_TYPES_AND_WALLETS: gql`
        query($typeName: String) {
            transactionTypes {
                name
                iconUrl
            }
            allCategories(transactionType: $typeName) {
                id
                name
                iconUrl
            }
            wallets {
                id
                name
                currency {
                    abbreviation
                    iconUrl
                }
            }
        }
    `,
    GET_CATEGORIES_WITH_TYPES: gql`
        query {
            transactionTypes {
                name
                iconUrl
            }
            customCategories {
                id
                name
                type {
                    name
                }
                isCustom
                iconUrl
            }
            standardCategories {
                id
                name
                type {
                    name
                }
                isCustom
                iconUrl
            }
        }
    `
};

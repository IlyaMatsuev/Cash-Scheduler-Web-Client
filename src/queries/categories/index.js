import {gql} from '@apollo/client';

export default {
    GET_USER_CATEGORIES: gql`
        query($typeName: String) {
            allCategories(transactionType: $typeName) {
                id
                name
                iconUrl
            }
        }
    `,
    GET_CATEGORIES_BY_TYPES: gql`
        query {
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

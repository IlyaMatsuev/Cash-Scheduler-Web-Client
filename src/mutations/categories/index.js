import {gql} from '@apollo/client';

export default {
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

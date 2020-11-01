import {gql} from '@apollo/client';

export default {
    GET_USER: gql`
        query {
            getUser {
                id
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
    `
};

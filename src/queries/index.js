import {gql} from '@apollo/client';

export default {
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

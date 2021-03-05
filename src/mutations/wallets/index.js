import {gql} from '@apollo/client';

export default {
    CREATE_WALLET: gql`
        mutation($wallet: NewWalletInput!) {
            createWallet(wallet: $wallet) {
                id
            }
        }
    `,
    UPDATE_WALLET: gql`
        mutation($wallet: UpdateWalletInput!) {
            updateWallet(wallet: $wallet) {
                id
            }
        }
    `,
    DELETE_WALLET: gql`
        mutation($id: Int!) {
            deleteWallet(id: $id) {
                id
            }
        }
    `
};

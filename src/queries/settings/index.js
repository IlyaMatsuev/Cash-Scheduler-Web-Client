import {gql} from '@apollo/client';

export default {
    GET_SETTINGS: gql`
        query($unitName: String) {
            settings(unitName: $unitName) {
                id
                name
                value
                unitName
            }
        }
    `
};

import {gql} from '@apollo/client';

export default {
    UPDATE_SETTINGS: gql`
        mutation($settings: [UpdateUserSettingInput!]!) {
            updateUserSettings(settings: $settings) {
                id
                name
                value
                unitName
            }
        }
    `
};

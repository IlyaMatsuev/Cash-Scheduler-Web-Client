import React from 'react';
import {Menu, Grid, Segment, Button} from 'semantic-ui-react';
import GeneralTab from './General/GeneralTab';
import NotificationsTab from './Notifications/NotificationsTab';
import DevelopersTab from './Developers/DevelopersTab';
import styles from './Settings.module.css';
import {useMutation} from '@apollo/client';
import settingQueries from '../../../../queries/settings';
import settingMutations from '../../../../mutations/settings';


const Settings = ({settings, onSettingChange, onCancelChanges}) => {
    const state = {
        general: {
            ShowBalance: settings.ShowBalance,
            settingDescriptionStyle: styles.settingDescription
        },
        notifications: {
            TurnNotificationsOn: settings.TurnNotificationsOn,
            DuplicateToEmail: settings.DuplicateToEmail,
            TurnNotificationsSoundOn: settings.TurnNotificationsSoundOn,
            settingDescriptionStyle: styles.settingDescription
        },
        developers: {
            settingDescriptionStyle: styles.settingDescription
        }
    };


    const [
        updateSettings,
        {loading: settingsUpdateLoading, error: settingsUpdateError}
    ] = useMutation(settingMutations.UPDATE_SETTINGS, {
        update() {
            onSettingChange({name: 'changesMade', checked: false});
        },
        variables: {
            settings: [
                {name: 'ShowBalance', unitName: 'General', value: String(state.general.ShowBalance)},
                {
                    name: 'TurnNotificationsOn',
                    unitName: 'Notifications',
                    value: String(state.notifications.TurnNotificationsOn)
                },
                {
                    name: 'DuplicateToEmail',
                    unitName: 'Notifications',
                    value: String(state.notifications.DuplicateToEmail)
                },
                {
                    name: 'TurnNotificationsSoundOn',
                    unitName: 'Notifications',
                    value: String(state.notifications.TurnNotificationsSoundOn)
                }
            ]
        },
        refetchQueries: [{query: settingQueries.GET_SETTINGS}]
    });


    const onMenuItem = (event, {name}) => {
        onSettingChange({name: 'activeUnit', value: name});
    };

    const onSettingCheck = (event, {name, checked}) => {
        onSettingChange({name, checked});
    };

    const onSaveChanges = () => {
        updateSettings();
    };


    let CurrentTab;
    if (settings.activeUnit === 'general') {
        CurrentTab = () => <GeneralTab settings={state.general} onSettingCheck={onSettingCheck}/>;
    } else if (settings.activeUnit === 'notifications') {
        CurrentTab = () => <NotificationsTab settings={state.notifications} onSettingCheck={onSettingCheck}/>;
    } else if (settings.activeUnit === 'developers') {
        CurrentTab = () => <DevelopersTab settings={state.developers}/>;
    }

    return (
        <Grid centered padded className="fullHeight">
            <Grid.Column width={2}>
                <Menu color="blue" fluid pointing size="large" stackable secondary vertical>
                    <Menu.Item
                        name="general"
                        active={settings.activeUnit === 'general'}
                        onClick={onMenuItem}
                    />
                    <Menu.Item
                        name="notifications"
                        active={settings.activeUnit === 'notifications'}
                        onClick={onMenuItem}
                    />
                    <Menu.Item
                        name="developers"
                        active={settings.activeUnit === 'developers'}
                        onClick={onMenuItem}
                    />
                </Menu>
            </Grid.Column>
            <Grid.Column width={12}>
                <Segment loading={settingsUpdateLoading || settingsUpdateError}>
                    <CurrentTab/>
                    <Segment>
                        <Button disabled={!settings.changesMade} color="red" inverted onClick={onCancelChanges}>
                            Cancel Changes
                        </Button>
                        <Button disabled={!settings.changesMade} primary onClick={onSaveChanges}>Save Changes</Button>
                    </Segment>
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default Settings;

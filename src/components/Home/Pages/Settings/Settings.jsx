import React from 'react';
import {Menu, Grid, Segment, Button} from 'semantic-ui-react';
import GeneralTab from './General/GeneralTab';
import NotificationsTab from './Notifications/NotificationsTab';
import DevelopersTab from './Developers/DevelopersTab';
import styles from './Settings.module.css';
import {useMutation} from '@apollo/client';
import queries from '../../../../queries';
import mutations from '../../../../mutations';


const Settings = ({settings, onSettingChange, onCancelChanges}) => {
    const state = {
        general: {
            showBalance: settings.showBalance,
            settingDescriptionStyle: styles.settingDescription
        },
        notifications: {
            turnNotificationsOn: settings.turnNotificationsOn,
            duplicateToEmail: settings.duplicateToEmail,
            turnSoundOn: settings.turnSoundOn,
            settingDescriptionStyle: styles.settingDescription
        },
        developers: {
            settingDescriptionStyle: styles.settingDescription
        }
    };


    const [updateSettings, {loading: settingsUpdateLoading, error: settingsUpdateError}] = useMutation(mutations.UPDATE_SETTINGS, {
        update() {
            onSettingChange({name: 'changesMade', checked: false});
        },
        variables: {
            settings: [
                {name: 'showBalance', unitName: 'general', value: String(state.general.showBalance)},
                {name: 'turnNotificationsOn', unitName: 'notifications', value: String(state.notifications.turnNotificationsOn)},
                {name: 'duplicateToEmail', unitName: 'notifications', value: String(state.notifications.duplicateToEmail)},
                {name: 'turnSoundOn', unitName: 'notifications', value: String(state.notifications.turnSoundOn)}
            ]
        },
        refetchQueries: [{query: queries.GET_SETTINGS}]
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
                <Menu color="blue" fluid pointing size="large" stackable  secondary vertical>
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
                        <Button disabled={!settings.changesMade} color="red" inverted onClick={onCancelChanges}>Cancel Changes</Button>
                        <Button disabled={!settings.changesMade} primary onClick={onSaveChanges}>Save Changes</Button>
                    </Segment>
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default Settings;

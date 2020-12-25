import React from 'react';
import {Checkbox, Container, Divider} from 'semantic-ui-react';


const NotificationsTab = ({settings, onSettingCheck}) => {
    return (
        <Container fluid>
            <h2>Management</h2>
            <Divider/>
            <div>
                <Checkbox toggle name="TurnNotificationsOn" label="Turn on notifications"
                          checked={settings.TurnNotificationsOn} onChange={onSettingCheck}/>
                <div className={settings.settingDescriptionStyle}>
                    {/*TODO: move setting description to the DB model*/}
                    You'll receive a lot of messages from us notifying you about your transactions tendencies and where
                    you spend money more. And many other things
                </div>
            </div>
            <div>
                <Checkbox toggle name="DuplicateToEmail" label="Duplicate notifications to your email"
                          checked={settings.DuplicateToEmail} onChange={onSettingCheck}/>
                <div className={settings.settingDescriptionStyle}>
                    {/*TODO: move setting description to the DB model*/}
                    Send notifications about your account to your email as well
                </div>
            </div>

            <Divider hidden/>

            <h2>Sound</h2>
            <Divider/>
            <div>
                <Checkbox toggle name="TurnNotificationsSoundOn" label="Play sound when a new notification arrives"
                          checked={settings.TurnNotificationsSoundOn} onChange={onSettingCheck}/>
                <div className={settings.settingDescriptionStyle}>
                    {/*TODO: move setting description to the DB model*/}
                    Play sound when a new notification arrives
                </div>
            </div>

        </Container>
    );
};

export default NotificationsTab;

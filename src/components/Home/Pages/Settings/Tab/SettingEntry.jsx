import React from 'react';
import {Checkbox, Container, Divider, Input} from 'semantic-ui-react';
import ConnectedAppsSetting from './ConnectedAppsSetting/ConnectedAppsSetting';
import styles from './SettingsEntry.module.css';


const SettingEntry = ({setting, onSettingUpdate}) => {

    const onChangeHandler = (event, target) => {
        onSettingUpdate(event, target, setting);
    };

    const inputsBySettingValueTypes = {
        'Checkbox': () => <Checkbox toggle name={setting.setting.name} label={setting.setting.label}
                                  checked={setting.value === 'true'} onChange={onChangeHandler}/>,
        'Text': () => <Input type="text" name={setting.setting.name} label={setting.setting.label}
                           value={setting.value} onChange={onChangeHandler}/>,
        'Custom': () => <ConnectedAppsSetting/>
    };

    const SettingInput = inputsBySettingValueTypes[setting.setting.valueType];

    return (
        <Container fluid>
            <SettingInput/>
            <div className={styles.settingDescription}>
                {setting.setting.description}
            </div>
            <Divider hidden/>
        </Container>
    );
};

export default SettingEntry;

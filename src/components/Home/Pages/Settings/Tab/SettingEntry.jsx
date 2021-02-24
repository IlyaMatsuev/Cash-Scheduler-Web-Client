import React from 'react';
import {Checkbox, Container, Divider, Header, Input} from 'semantic-ui-react';
import styles from './SettingsEntry.module.css';


const SettingEntry = ({setting, onSettingUpdate}) => {

    const onChangeHandler = (event, target) => {
        onSettingUpdate(event, target, setting);
    };

    const inputsBySettingValueTypes = {
        'Checkbox': () => <Checkbox toggle name={setting.setting.name} label={setting.setting.label}
                                  checked={setting.value === 'true'} onChange={onChangeHandler}/>,
        'Text': () => <Input type="text" name={setting.setting.name} label={setting.setting.label}
                           value={setting.value} onChange={onChangeHandler}/>
    };

    const SettingInput = inputsBySettingValueTypes[setting.setting.valueType];

    return (
        <Container fluid>
            <Header as="h2">{setting.setting.sectionName}</Header>
            <Divider/>
            <SettingInput/>
            <div className={styles.settingDescription}>
                {setting.setting.description}
            </div>
            <Divider hidden/>
        </Container>
    );
};

export default SettingEntry;

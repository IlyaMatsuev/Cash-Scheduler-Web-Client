import React from 'react';
import {Container, Divider, Header} from 'semantic-ui-react';
import SettingEntry from './SettingEntry';


function groupSettingsBySections(settings) {
    return settings?.reduce((grouped, setting) => {
        grouped[setting.setting.sectionName] = grouped[setting.setting.sectionName] || [];
        grouped[setting.setting.sectionName].push(setting);
        return grouped;
    }, Object.create(null));
}

const SettingTab = ({settingsQueryData, onSettingUpdate}) => {

    const groupedSettings = groupSettingsBySections(settingsQueryData?.settings) || [];

    return (
        <Container fluid>
            {settingsQueryData && settingsQueryData.settingSections?.map(sectionName =>
                groupedSettings[sectionName]?.length > 0 &&
                <Container key={sectionName} fluid>
                    <Header as="h2">{sectionName}</Header>
                    <Divider/>
                    {groupedSettings[sectionName]?.map(setting =>
                        <SettingEntry key={setting.setting.name}
                                      setting={setting}
                                      onSettingUpdate={onSettingUpdate}
                        />)}
                </Container>
            )}
        </Container>
    );
};

export default SettingTab;

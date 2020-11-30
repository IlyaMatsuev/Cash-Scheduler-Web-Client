import React from 'react';
import {Checkbox, Container, Divider} from 'semantic-ui-react';


const GeneralTab = ({settings, onSettingCheck}) => {
    return (
        <Container fluid>
            <h2>Balance</h2>
            <Divider/>
            <Checkbox toggle name="showBalance" label="Always show balance in the header"
                      checked={settings.showBalance} onChange={onSettingCheck}/>
            <div className={settings.settingDescriptionStyle}>
                {/*TODO: move setting description to the DB model*/}
                You'll be able to see your actual balance all the time at the right top corner of the website
            </div>
        </Container>
    );
};

export default GeneralTab;

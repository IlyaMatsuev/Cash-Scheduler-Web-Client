import React from 'react';
import {Button, Container, Divider} from 'semantic-ui-react';

const DevelopersTab = ({settings}) => {

    const copyAPIToken = () => {
        navigator.clipboard.writeText(window.localStorage.getItem('accessToken'));
    };

    return (
        <Container fluid>
            <h2>CashScheduler API</h2>
            <Divider/>
            <Button inverted color="blue" onClick={copyAPIToken}>Click here to copy the token</Button>
            <div className={settings.settingDescriptionStyle}>
                The full documentation of the CashScheduler API you can find in
                <a href="https://github.com/IlyaMatsuev/Cash-Scheduler-Web">our GitHub repository</a>
            </div>
        </Container>
    );
}

export default DevelopersTab;

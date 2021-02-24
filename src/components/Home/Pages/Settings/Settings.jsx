import React, {useState} from 'react';
import {Menu, Grid, Segment} from 'semantic-ui-react';
import SettingTab from './Tab/SettingTab';
import {useMutation, useQuery} from '@apollo/client';
import settingQueries from '../../../../queries/settings';
import settingMutations from '../../../../mutations/settings';


const Settings = () => {
    const initState = {
        activeUnit: 'General'
    };
    const [state, setState] = useState(initState);

    const {
        loading: settingsQueryLoading,
        error: settingsQueryError,
        data: settingsQueryData
    } = useQuery(settingQueries.GET_ALL_USER_SETTINGS, {
        variables: {
            unitName: state.activeUnit
        }
    });

    const [
        updateSetting,
        {loading: updateSettingLoading, error: updateSettingError}
    ] = useMutation(settingMutations.UPDATE_SETTING);


    const onMenuItem = (event, {name}) => {
        setState({...state, activeUnit: name});
    };

    const onSettingUpdate = (event, {name, checked, value}, setting) => {
        updateSetting({
            variables: {
                setting: {
                    name: setting.setting.name,
                    value: String(checked)
                }
            },
            refetchQueries: [{
                query: settingQueries.GET_ALL_USER_SETTINGS,
                variables: {unitName: state.activeUnit}
            }, {
                query: settingQueries.GET_SETTINGS,
                variables: {unitName: state.activeUnit}
            }, {
                query: settingQueries.GET_SETTING,
                variables: {name: setting.setting.name}
            }]
        })
    };


    return (
        <Segment basic loading={settingsQueryLoading || !!settingsQueryError}>
            <Grid centered padded className="fullHeight">
                <Grid.Column width={2}>
                    <Menu color="blue" fluid pointing size="large" stackable secondary vertical>
                        {settingsQueryData && settingsQueryData.settingUnits?.map(unitName =>
                            <Menu.Item key={unitName} name={unitName}
                                       active={state.activeUnit === unitName}
                                       onClick={onMenuItem}/>)}
                    </Menu>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Segment loading={updateSettingLoading || !!updateSettingError}>
                        <SettingTab settingsQueryData={settingsQueryData} onSettingUpdate={onSettingUpdate}/>
                    </Segment>
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default Settings;

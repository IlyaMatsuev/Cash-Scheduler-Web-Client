import React, {useState} from 'react';
import {Icon, Menu, Segment, Sidebar} from 'semantic-ui-react';
import HomeHeader from '../Header/Header';
import styles from './HomeWrapper.module.css';
import CurrentPage from '../Pages/CurrentPage/CurrentPage';
import {useQuery} from "@apollo/client";
import queries from "../../../queries";


const pagesByIndexes = {
    dashboard: 0,
    transactions: 1,
    categories: 2,
    settings: 3
};

const HomeWrapper = () => {
    const initialState = {
        visible: false,
        pageIndex: 2,
        user: null,
        settings: {
            activeUnit: 'general',
            changesMade: false,
            showBalance: false,
            turnNotificationsOn: false,
            duplicateToEmail: false,
            turnSoundOn: false
        }
    };
    const [state, setState] = useState(initialState);

    useQuery(queries.GET_SETTINGS, {
        onCompleted({getUserSettings: settings}) {
            settings.forEach(setting => {
                state.settings[setting.name] = setting.value === 'true';
            });
            setState({...state, settings: state.settings});
        }
    });

    useQuery(queries.GET_USER, {
        onCompleted({getUser: user}) {
            setState({...state, user});
        }
    });

    const onToggleMenu = () => setState({...state, visible: !state.visible});

    const onHideMenu = () => setState({...state, visible: false});

    const onMenuItemSelected = (event, data) => {
        setState({...state, visible: false, pageIndex: pagesByIndexes[data.name]});
    };

    const onSettingChange = ({name, checked, value}) => {
        if (checked !== undefined) {
            setState({...state, settings: {...state.settings, changesMade: true, [name]: checked}});
        } else if (value !== undefined) {
            setState({...state, settings: {...state.settings, [name]: value}});
        }
    };

    const onCancelSettingsChanges = () => {
        setState({...state, settings: {...initialState.settings, activeUnit: state.settings.activeUnit}});
    };


    return (
        <Sidebar.Pushable as={Segment} className={styles.sidebar}>
            <Sidebar as={Menu} animation="slide along" inverted width="wide" vertical dimmed="true"
                     visible={state.visible} onHide={onHideMenu}>
                <Menu.Item as="a" className="text-center" name="dashboard" onClick={onMenuItemSelected}>
                    Dashboard
                    <Icon name="calendar check outline"/>
                </Menu.Item>
                <Menu.Item as="a" className="text-center" name="transactions" onClick={onMenuItemSelected}>
                    Transactions
                    <Icon name="money bill alternate outline"/>
                </Menu.Item>
                <Menu.Item as="a" className="text-center" name="categories" onClick={onMenuItemSelected}>
                    Categories
                    <Icon name="th"/>
                </Menu.Item>
                <Menu.Item as="a" className="text-center" name="settings" onClick={onMenuItemSelected}>
                    Settings
                    <Icon name="setting"/>
                </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher dimmed={state.visible} className="fullHeight">
                <Segment basic className="fullHeight p-0">
                    <HomeHeader onToggleMenu={onToggleMenu} showBalance={state.settings.showBalance} user={state.user}/>
                    <CurrentPage index={state.pageIndex}
                                 settings={state.settings} onSettingChange={onSettingChange}
                                 onCancelSettingsChanges={onCancelSettingsChanges}/>
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
};

export default HomeWrapper;

import React, {useState} from 'react';
import {Icon, Menu, Segment, Sidebar} from 'semantic-ui-react';
import Header from '../Header/Header';
import CurrentPage from '../Pages/CurrentPage/CurrentPage';
import {useQuery} from '@apollo/client';
import moment from 'moment';
import queries from '../../../queries';
import styles from './HomeWrapper.module.css';


const pagesByIndexes = {
    dashboard: 0,
    transactions: 1,
    categories: 2,
    settings: 3
};

const HomeWrapper = () => {
    const initialState = {
        visible: false,
        pageIndex: 0,
        transactions: {
            currentDate: moment(),
            isRecurringView: false
        },
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

    const {data: userData} = useQuery(queries.GET_USER);

    const onBalanceClick = () => {
        setState({
            ...state,
            transactions: {...state.transactions, currentDate: moment()},
            pageIndex: pagesByIndexes['transactions']
        });
    };

    const onToggleMenu = () => setState({...state, visible: !state.visible});

    const onHideMenu = () => setState({...state, visible: false});

    const onMenuItemSelected = (event, data) => {
        setState({
            ...state,
            visible: false,
            transactions: {...state.transactions, currentDate: moment()},
            pageIndex: pagesByIndexes[data.name]
        });
    };

    const onSettingChange = ({name, checked, value}) => {
        if (checked !== undefined) {
            setState({...state, settings: {...state.settings, changesMade: true, [name]: checked}});
        } else if (value !== undefined) {
            setState({...state, settings: {...state.settings, [name]: value}});
        }
    };

    const onCancelSettingsChange = () => {
        setState({...state, settings: {...initialState.settings, activeUnit: state.settings.activeUnit}});
    };

    const onTransactionPropsChange = ({name, value}) => {
        setState({...state, transactions: {...state.transactions, [name]: value}});
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
                    <Header onToggleMenu={onToggleMenu} showBalance={state.settings.showBalance}
                                user={userData && userData.getUser} onBalanceClick={onBalanceClick}/>
                    <CurrentPage index={state.pageIndex}
                                 settings={state.settings} onSettingChange={onSettingChange} onCancelSettingsChange={onCancelSettingsChange}
                                 transactionsProps={state.transactions} onTransactionPropsChange={onTransactionPropsChange}/>
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
};

export default HomeWrapper;

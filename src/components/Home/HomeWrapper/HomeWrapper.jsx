import React, {useState} from 'react';
import {Icon, Menu, Segment, Sidebar} from 'semantic-ui-react';
import Header from '../Header/Header';
import CurrentPage from '../Pages/CurrentPage/CurrentPage';
import moment from 'moment';
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
        }
    };
    const [state, setState] = useState(initialState);


    const onBalanceClick = () => {
        setState({...state, pageIndex: pagesByIndexes['transactions']});
    };

    const onToggleMenu = () => setState({...state, visible: !state.visible});

    const onHideMenu = () => setState({...state, visible: false});

    const onMenuItemSelected = (event, data) => {
        setState({...state, visible: false, pageIndex: pagesByIndexes[data.name]});
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
                    <Header onToggleMenu={onToggleMenu} onBalanceClick={onBalanceClick}/>
                    <CurrentPage index={state.pageIndex}
                                 transactionsProps={state.transactions} onTransactionPropsChange={onTransactionPropsChange}/>
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
};

export default HomeWrapper;

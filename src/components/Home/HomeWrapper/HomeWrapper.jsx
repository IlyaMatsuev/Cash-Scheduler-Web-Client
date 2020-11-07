import React, {useState} from 'react';
import {Icon, Menu, Segment, Sidebar} from 'semantic-ui-react';
import HomeHeader from '../Header/Header';
import styles from './HomeWrapper.module.css';
import CurrentPage from '../Pages/CurrentPage/CurrentPage';


const initialState = {
    visible: false,
    pageIndex: 0
};

const pagesByIndexes = {
    dashboard: 0,
    transactions: 1,
    categories: 2,
    settings: 3
};

const HomeWrapper = () => {
    const [state, setState] = useState(initialState);

    const onToggleMenu = () => setState({...state, visible: !state.visible});

    const onHideMenu = () => setState({...state, visible: false});

    const onMenuItemSelected = (event, data) => {
        setState({...state, pageIndex: pagesByIndexes[data.name]});
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
                    <HomeHeader onToggleMenu={onToggleMenu}/>
                    <CurrentPage index={state.pageIndex}/>
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
};

export default HomeWrapper;

import React from 'react';
import styles from './Header.module.css';
import {Button} from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import mutations from '../../../mutations';
import {withApollo} from '@apollo/client/react/hoc';
import {logout} from '../../../utils/Auth';


const Header = ({client, onToggleMenu}) => {

    const [logoutFromServer, {loading}] = useMutation(mutations.LOGOUT_USER);

    const onLogOut = () => logoutFromServer().then(() => logout(client));

    return (
        <nav className={styles.navbar + ' navbar navbar-dark'}>
            <div className="ml-3">
                <Button onClick={onToggleMenu} icon="ellipsis horizontal" size="large" inverted/>
                <a className="navbar-brand ml-3" href="/home">Cash Scheduler</a>
            </div>
            <div>
                <Button fluid inverted color="grey" onClick={onLogOut} loading={loading}>
                    Log Out
                </Button>
            </div>
        </nav>
    );
};

export default withApollo(Header);

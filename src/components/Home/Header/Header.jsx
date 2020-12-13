import React from 'react';
import styles from './Header.module.css';
import {Button, Grid} from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import mutations from '../../../mutations';
import {withApollo} from '@apollo/client/react/hoc';
import {logout} from '../../../utils/Auth';


const Header = ({client, showBalance, user, onToggleMenu, onBalanceClick}) => {

    const [logoutFromServer, {loading}] = useMutation(mutations.LOGOUT_USER);

    const onLogOut = () => logoutFromServer().then(() => logout(client));

    return (
        <nav className={styles.navbar + ' navbar navbar-dark'}>
            <div className="ml-3">
                <Button onClick={onToggleMenu} icon="ellipsis horizontal" size="large" inverted/>
                <a className="navbar-brand ml-3" href="/home">Cash Scheduler</a>
            </div>
            <div>
                <Grid columns={2}>
                    <Grid.Column>
                        {showBalance && user && <div className={styles.balanceContainer} onClick={onBalanceClick}>
                            Balance: <span>{user.balance}</span>
                        </div>}
                    </Grid.Column>
                    <Grid.Column>
                        <Button inverted color="grey" onClick={onLogOut} loading={loading}>
                            Log Out
                        </Button>
                    </Grid.Column>
                </Grid>
            </div>
        </nav>
    );
};

export default withApollo(Header);

import React from 'react';
import styles from './Header.module.css';
import {Button, Grid} from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import userMutations from '../../../mutations/users';
import {withApollo} from '@apollo/client/react/hoc';
import {logout} from '../../../utils/Auth';
import Account from '../Account/Account';


const Header = ({client, showBalance, actualUser, user, settings, onToggleMenu, onBalanceClick, onUserChange}) => {

    const [logoutFromServer, {loading}] = useMutation(userMutations.LOGOUT_USER);

    const onLogOut = () => logoutFromServer().then(() => logout(client));

    return (
        <nav className={styles.navbar + ' navbar navbar-dark'}>
            <div className="ml-3">
                <Button onClick={onToggleMenu} icon="ellipsis horizontal" size="large" inverted/>
                <a className="navbar-brand ml-3" href="/home">Cash Scheduler</a>
            </div>
            <div>
                <Grid columns={3}>
                    <Grid.Column>
                        {showBalance && actualUser && <div className={styles.balanceContainer} onClick={onBalanceClick}>
                            Balance: <span>{actualUser.balance}</span>
                        </div>}
                    </Grid.Column>
                    <Grid.Column>
                        {user && <Account user={user} onUserChange={onUserChange} settings={settings}/>}
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

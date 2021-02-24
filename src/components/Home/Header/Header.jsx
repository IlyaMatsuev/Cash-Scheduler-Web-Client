import React from 'react';
import styles from './Header.module.css';
import {Button, Grid} from 'semantic-ui-react';
import {useMutation, useQuery} from '@apollo/client';
import userMutations from '../../../mutations/users';
import {withApollo} from '@apollo/client/react/hoc';
import {logout} from '../../../utils/Auth';
import Account from '../Account/Account';
import userQueries from '../../../queries/users';
import settingQueries from '../../../queries/settings';
import {pages} from '../../../config';


const Header = ({client, onToggleMenu, onBalanceClick}) => {

    const {data: userQueryData} = useQuery(userQueries.GET_USER);

    const {data: settingQueryData} = useQuery(settingQueries.GET_SETTING, {
        variables: {
            name: 'ShowBalance'
        }
    });

    const [logoutFromServer, {loading}] = useMutation(userMutations.LOGOUT_USER);

    const onLogOut = () => logoutFromServer().then(() => logout(client));

    return (
        <nav className={styles.navbar + ' navbar navbar-dark'}>
            <div className="ml-3">
                <Button onClick={onToggleMenu} icon="ellipsis horizontal" size="large" inverted/>
                <a className="navbar-brand ml-3" href={pages.homeUrl}>Cash Scheduler</a>
            </div>
            <div>
                <Grid columns={3}>
                    <Grid.Column>
                        {userQueryData?.user && settingQueryData?.setting && settingQueryData.setting.value === 'true' &&
                            <div className={styles.balanceContainer} onClick={onBalanceClick}>
                                Balance: <span>{userQueryData.user.balance}</span>
                            </div>
                        }
                    </Grid.Column>
                    <Grid.Column>
                        {userQueryData?.user && <Account user={userQueryData.user}/>}
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

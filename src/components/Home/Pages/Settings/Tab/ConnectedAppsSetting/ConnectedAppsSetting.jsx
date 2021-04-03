import React, {useState} from 'react';
import {Button, Confirm, Input, Segment} from 'semantic-ui-react';
import {useQuery, useMutation} from '@apollo/client';
import userQueries from '../../../../../../graphql/queries/users';
import userMutations from '../../../../../../graphql/mutations/users';
import styles from './ConnectedAppsSetting.module.css';
import {toast} from 'react-semantic-toasts';
import {notifications} from '../../../../../../config';


const ConnectedAppsSetting = () => {
    const initState = {
        isTokenCopied: false,
        isTokenHidden: true,
        appsLogoutConfirmModalOpen: false
    };
    const [state, setState] = useState(initState);

    const {
        loading: appTokenQueryLoading,
        error: appTokenQueryError,
        data: appTokenQueryData,
        refetch: refetchAppToken
    } = useQuery(userQueries.GET_APP_TOKEN);

    const [
        appsLogout,
        {loading: appsLogoutLoading, error: appsLogoutError}
    ] = useMutation(userMutations.LOGOUT_CONNECTED_APPS, {
        onCompleted: () => {
            toast({
                title: 'Success',
                description: 'You\'ve successfully logged out from all connected apps that used your token.',
                type: 'success',
                icon: 'check',
                color: 'green',
                time: notifications.toastDuration
            });
        }
    });


    const onCopyToken = () => {
        if (appTokenQueryLoading || appTokenQueryError) {
            return;
        }
        if (appTokenQueryData?.appToken) {
            navigator.clipboard.writeText(appTokenQueryData.appToken);
        }
        if (!state.isTokenCopied) {
            setState({...state, isTokenCopied: !state.isTokenCopied});
            setTimeout(() => {
                setState({...state, isTokenCopied: false});
            }, 3000);
        }
    };

    const onRevivalToken = () => {
        setState({...state, isTokenHidden: !state.isTokenHidden});
    };

    const onRefreshToken = () => {
        refetchAppToken();
    };

    const onAppsLogOut = () => {
        onAppsLogOutConfirmToggle();
        appsLogout();
    };

    const onAppsLogOutConfirmToggle = () => {
        setState({...state, appsLogoutConfirmModalOpen: !state.appsLogoutConfirmModalOpen});
    };

    return (
        <Segment basic fluid loading={appTokenQueryLoading || appTokenQueryError}>
            <Input actionPosition="left"
                   value={appTokenQueryData?.appToken}
                   type={state.isTokenHidden ? 'password' : 'text'}
                   className={styles.input}
                   readOnly
                   action={
                       <Button color="teal"
                               labelPosition="left"
                               content="Copy"
                               icon={state.isTokenCopied ? 'check' : 'copy'}
                               onClick={onCopyToken}
                       />
                   }
            />
            <Button.Group>
                <Button className={styles.revivalButton}
                        onClick={onRevivalToken}
                        icon={state.isTokenHidden ? 'eye' : 'eye slash'}
                        content={state.isTokenHidden ? 'Revival' : 'Hide'}
                />
                <Button color="grey" icon="refresh" content="Refresh"
                        loading={appTokenQueryLoading}
                        onClick={onRefreshToken}
                />
                <Button inverted color="red"
                        icon="plug" content="Log Out From All Connected Apps"
                        loading={appsLogoutLoading || appsLogoutError}
                        onClick={onAppsLogOutConfirmToggle}
                />
                <Confirm open={state.appsLogoutConfirmModalOpen}
                         header="Log out from all connected apps"
                         content="You're about to log out from all connected apps that are linked to your account. Do you want to proceed?"
                         onCancel={onAppsLogOutConfirmToggle}
                         onConfirm={onAppsLogOut}
                         className="modalContainer"
                         confirmButton={<Button basic negative content="Log Out"/>}
                />
            </Button.Group>
        </Segment>
    );
};

export default ConnectedAppsSetting;

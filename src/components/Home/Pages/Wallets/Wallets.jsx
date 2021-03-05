import React, {useState} from 'react';
import {Grid, Segment} from 'semantic-ui-react';
import walletQueries from '../../../../queries/wallets';
import {useQuery} from '@apollo/client';
import WalletItem from './WalletItem/WalletItem';
import colors from './colors';
import WalletEditModal from './WalletEditModal/WalletEditModal';
import {isValidNumber} from '../../../../utils/UtilHooks';
import NewWalletButton from './NewWalletButton/NewWalletButton';
import {global} from '../../../../config';


const Wallets = () => {
    const initState = {
        walletModalOpen: false,
        isWalletEditing: true,
        newWalletSpinnerActive: false,
        selectedWallet: {}
    };
    const [state, setState] = useState(initState);

    const {
        data: walletsQueryData,
        loading: walletsQueryLoading,
        error: walletsQueryError
    } = useQuery(walletQueries.GET_WALLETS);

    const getItemColor = i => {
        while (colors.length < i) {
            i -= colors.length;
        }
        return colors[i];
    }

    const onWalletModalToggle = (wallet = {}, isEditing = true) => {
        setState({
            ...state,
            selectedWallet: {
                ...wallet,
                originalCurrency: wallet.currency?.abbreviation,
                originallyDefault: wallet.isDefault
            },
            walletModalOpen: !state.walletModalOpen,
            isWalletEditing: isEditing,
            newWalletSpinnerActive: !isEditing && !state.walletModalOpen
        });
    };

    const onWalletChange = (event, {name, type, value, checked}) => {
        const selectedWallet = {
            ...state.selectedWallet,
            [name]: (value || checked)
        };
        if (name === 'currencyAbbreviation') {
            if (!state.currencyChanged) {
                selectedWallet.currencyChanged = true;
                selectedWallet.convertBalance = true;
            }
            if (selectedWallet.originalCurrency === value) {
                selectedWallet.currencyChanged = false;
                selectedWallet.convertBalance = false;
            }
        }
        if (type === 'number' && !isValidNumber(value)) {
            return;
        }
        setState({...state, selectedWallet});
    };

    const onWalletActionComplete = () => {
        setState({...state, walletModalOpen: false, selectedWallet: {}});
    };

    const onNewWallet = () => {
        onWalletModalToggle(
            {
                name: '',
                balance: 0,
                currency: global.defaultCurrency,
                isDefault: false
            },
            false
        );
    };


    return (
        <Segment loading={walletsQueryLoading || !!walletsQueryError}
                 className="fullHeight"
                 padded="very"
        >
            <Grid columns={6}>
                <NewWalletButton onClick={onNewWallet} loading={state.newWalletSpinnerActive}/>
                {walletsQueryData && walletsQueryData.wallets.map((wallet, i) => (
                    <WalletItem key={wallet.id} color={getItemColor(i)}
                                wallet={wallet} onWalletSelected={onWalletModalToggle}
                    />))
                }
            </Grid>

            <WalletEditModal open={state.walletModalOpen}
                             isEditing={state.isWalletEditing}
                             wallet={state.selectedWallet}
                             onWalletChange={onWalletChange}
                             onWalletActionComplete={onWalletActionComplete}
                             onModalToggle={onWalletModalToggle}
            />
        </Segment>
    );
};

export default Wallets;

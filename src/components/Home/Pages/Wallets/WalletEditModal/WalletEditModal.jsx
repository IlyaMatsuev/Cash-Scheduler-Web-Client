import React, {useState} from 'react';
import {Button, Confirm, Modal} from 'semantic-ui-react';
import WalletForm from './WalletForm/WalletForm';
import walletQueries from '../../../../../queries/wallets';
import userQueries from '../../../../../queries/users';
import walletMutations from '../../../../../mutations/wallets';
import {useMutation} from '@apollo/client';
import {onUIErrors, removeEntityCache, toFloat} from '../../../../../utils/UtilHooks';


const WalletEditModal = ({open, isEditing, wallet, onWalletChange, onWalletActionComplete, onModalToggle}) => {
    const initState = {
        deleteConfirmationModalOpen: false
    };
    const [state, setState] = useState(initState);
    const [errors, setErrors] = useState({});


    const [createWallet, {loading: createWalletLoading}] = useMutation(walletMutations.CREATE_WALLET, {
        onCompleted: () => onWalletActionComplete(),
        onError: error => onUIErrors(error, setErrors, errors),
        variables: {
            wallet: {
                name: wallet.name,
                balance: toFloat(wallet.balance),
                currencyAbbreviation: wallet.currencyAbbreviation,
                isDefault: wallet.isDefault
            }
        }
    });

    const [updateWallet, {loading: updateWalletLoading}] = useMutation(walletMutations.UPDATE_WALLET, {
        onCompleted: () => onWalletActionComplete(),
        onError: error => onUIErrors(error, setErrors, errors),
        variables: {
            wallet: {
                id: wallet.id,
                name: wallet.name,
                balance: toFloat(wallet.balance),
                currencyAbbreviation: wallet.currencyAbbreviation,
                isDefault: wallet.isDefault,
                convertBalance: wallet.convertBalance,
                exchangeRate: toFloat(wallet.exchangeRate)
            }
        }
    });

    const [deleteWallet, {loading: deleteWalletLoading}] = useMutation(walletMutations.DELETE_WALLET, {
        onCompleted: () => onWalletActionComplete(),
        onError: error => onUIErrors(error, setErrors, errors),
        update: (cache, result) => {
            if (result?.data) {
                removeEntityCache(cache, result.data.deleteWallet, ['wallets']);
            }
        },
        variables: {id: wallet.id}
    });


    const onDeleteModalToggle = () => {
        setState({...state, deleteConfirmationModalOpen: !state.deleteConfirmationModalOpen});
    };

    const onDelete = () => {
        deleteWallet();
    };

    const onChange = (event, target) => {
        onWalletChange(event, target);
        setErrors({...errors, general: undefined, [target.name]: undefined});
    };

    const onToggle = () => {
        onModalToggle();
        setErrors({});
    };

    const onSave = () => {
        const refetchQueries = [{query: walletQueries.GET_WALLETS}];
        if (wallet.isDefault) {
            refetchQueries.push({query: userQueries.GET_USER_WITH_BALANCE});
        }
        if (isEditing) {
            updateWallet({refetchQueries});
        } else {
            createWallet({refetchQueries});
        }
        setErrors({});
    };


    return (
        <Modal dimmer size="small" closeOnEscape
               closeOnDimmerClick className="modalContainer"
               open={open} onClose={onToggle}
        >
            <Modal.Header>
                {(isEditing ? 'Edit' : 'New') + ' Wallet'}
            </Modal.Header>
            <Modal.Content>
                <WalletForm wallet={wallet} errors={errors} onChange={onChange} isEditing={isEditing}/>
            </Modal.Content>
            <Modal.Actions>
                <Button basic onClick={onToggle}>
                    Cancel
                </Button>
                {isEditing &&
                <Button basic color="red" onClick={onDeleteModalToggle} loading={deleteWalletLoading}>
                    Delete
                    <Confirm className="modalContainer" open={state.deleteConfirmationModalOpen}
                             content={`Are you sure you want to delete the wallet? All associated transactions will be attached to your default wallet.`}
                             confirmButton={<Button basic negative>Yes, delete it</Button>}
                             onCancel={onDeleteModalToggle} onConfirm={onDelete}
                    />
                </Button>}
                <Button primary onClick={onSave} loading={createWalletLoading || updateWalletLoading}>
                    Save
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default WalletEditModal;

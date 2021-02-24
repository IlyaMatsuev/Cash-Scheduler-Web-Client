import React from 'react';
import styles from './TransactionModal.module.css';
import {Button, Confirm, Modal} from 'semantic-ui-react';
import TransactionForm from '../TransactionForm/TransactionForm';


const TransactionModal = ({
                              open,
                              isRecurring,
                              transaction,
                              errors,
                              onModalToggle,
                              deleteModalOpen,
                              onDeleteModalToggle,
                              deleteLoading,
                              saveLoading,
                              onChange,
                              onSave,
                              onDelete
}) => {


    return (
        <Modal dimmer size="small" className={styles.transactionModal + ' modalContainer'}
               closeOnEscape closeOnDimmerClick
               open={open} onClose={onModalToggle}>
            <Modal.Header>Edit {isRecurring && 'Recurring'} Transaction</Modal.Header>
            <Modal.Content>
                <TransactionForm transaction={transaction} errors={errors} isEditing
                                 isRecurring={isRecurring} onChange={onChange}/>
            </Modal.Content>
            <Modal.Actions>
                <Button basic onClick={onModalToggle}>
                    Cancel
                </Button>
                <Button basic color="red" onClick={onDeleteModalToggle} loading={deleteLoading}>
                    Delete
                    <Confirm className="modalContainer"
                             content={`Are you sure you want to delete the transaction?`}
                             confirmButton={<Button basic negative>Yes, delete it</Button>}
                             open={deleteModalOpen}
                             onCancel={onDeleteModalToggle} onConfirm={onDelete}
                    />
                </Button>
                <Button primary loading={saveLoading} onClick={onSave}>
                    Save
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default TransactionModal;

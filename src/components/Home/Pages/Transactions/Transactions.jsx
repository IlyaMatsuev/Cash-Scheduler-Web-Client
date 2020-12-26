import React, {useState} from 'react';
import {Button, Confirm, Dimmer, Grid, Loader, Modal, Segment} from 'semantic-ui-react';
import moment from 'moment';
import {useMutation, useQuery} from '@apollo/client';
import LineTransactions from './Charts/LineTransactions/LineTransactions';
import DoughnutTransactions from './Charts/DoughnutTransactions/DoughnutTransactions';
import TransactionList from './TransactionList/TransactionList';
import TransactionForm from './TransactionForm/TransactionForm';
import {onUIErrors} from '../../../../utils/UtilHooks';
import queries from '../../../../queries';
import mutations from '../../../../mutations';
import styles from './Transactions.module.css';
import errorDefs from '../../../../utils/ErrorDefinitions';
import {global} from '../../../../config';


// TODO: add more charts
// TODO: add list & charts for recurring transactions
const Transactions = ({currentDate, isRecurringView, onTransactionPropsChange}) => {
    const initialState = {
        recurringTransactions: [],
        transactionModalOpened: false,
        transactionDeleteModalOpened: false,
        isRecurringView: false,
        selectedTransaction: {}
    };
    const [state, setState] = useState(initialState);

    const initialErrorsState = {};
    const [errors, setErrors] = useState(initialErrorsState);

    const refetchQueries = [
        {
            query: queries.GET_TRANSACTIONS_BY_MONTH,
            variables: {
                month: currentDate.month() + 1,
                year: currentDate.year(),
            },
        }, {
            query: queries.GET_TRANSACTIONS_BY_MONTH,
            variables: {
                month: moment(state.selectedTransaction.date).month() + 1,
                year: moment(state.selectedTransaction.date).year(),
            }
        },
        {query: queries.GET_USER}
    ];


    const {
        loading: transactionsLoading,
        error: transactionsError,
        data: transactionsData
    } = useQuery(queries.GET_TRANSACTIONS_BY_MONTH, {
        variables: {
            month: currentDate.month() + 1,
            year: currentDate.year()
        }
    });


    const [updateTransaction, {loading: updateTransactionLoading}] = useMutation(mutations.UPDATE_TRANSACTION, {
        onCompleted: () => onSelectedTransactionToggle(),
        onError: error => onUIErrors(error, setErrors, errors),
        refetchQueries,
        variables: {
            transaction: {
                id: state.selectedTransaction.id,
                title: state.selectedTransaction.title,
                amount: state.selectedTransaction.amount,
                date: state.selectedTransaction.date
            }
        }
    });

    const [updateRecurringTransaction, {loading: updateRecurringTransactionLoading}] = useMutation(mutations.UPDATE_RECURRING_TRANSACTION, {
        onCompleted: () => onSelectedTransactionToggle(),
        onError: error => onUIErrors(error, setErrors, errors),
        refetchQueries,
        variables: {
            transaction: {
                id: state.selectedTransaction.id,
                title: state.selectedTransaction.title,
                amount: state.selectedTransaction.amount
            }
        }
    });

    const [deleteTransaction, {loading: deleteTransactionLoading}] = useMutation(mutations.DELETE_TRANSACTION, {
        onCompleted: () => onSelectedTransactionToggle(),
        onError: error => onUIErrors(error, setErrors, errors),
        refetchQueries,
        variables: {id: state.selectedTransaction.id}
    });

    const [deleteRecurringTransaction, {loading: deleteRecurringTransactionLoading}] = useMutation(mutations.DELETE_RECURRING_TRANSACTION, {
        onCompleted: () => onSelectedTransactionToggle(),
        onError: error => onUIErrors(error, setErrors, errors),
        refetchQueries,
        variables: {id: state.selectedTransaction.id}
    });


    const validateTransaction = () => {
        let valid = true;
        if (!state.selectedTransaction.date
            || moment(state.selectedTransaction.date, global.dateFormat).format(global.dateFormat) !== state.selectedTransaction.date) {
            setErrors({
                ...errors,
                date: errorDefs.INVALID_TRANSACTION_DATE_ERROR
            });
            valid = false;
        }
        return valid;
    };


    const onPrevMonth = () => {
        onTransactionPropsChange({name: 'currentDate', value: currentDate.subtract(1, 'month')});
    };

    const onNextMonth = () => {
        onTransactionPropsChange({name: 'currentDate', value: currentDate.add(1, 'month')});
    };

    const onTransactionsViewChange = () => {
        onTransactionPropsChange({name: 'isRecurringView', value: !isRecurringView});
    };

    const onSelectedTransactionToggle = transaction => {
        if (transaction) {
            state.selectedTransaction = transaction;
        }
        setState({...state, transactionModalOpened: !state.transactionModalOpened});
        setErrors(initialErrorsState);
    };

    const onSelectedTransactionChange = (event, {name, value}) => {
        setState({...state, selectedTransaction: {...state.selectedTransaction, [name]: value}});
        setErrors({...errors, [name]: undefined});
    };

    const onSelectedTransactionSave = () => {
        setErrors(initialErrorsState);
        if (validateTransaction()) {
            if (isRecurringView) {
                updateRecurringTransaction();
            } else {
                updateTransaction();
            }
        }
    };

    const onSelectedTransactionDelete = () => {
        if (isRecurringView) {
            deleteRecurringTransaction();
        } else {
            deleteTransaction();
        }
        onTransactionDeleteToggle();
    };

    const onTransactionDeleteToggle = () => {
        setState({...state, transactionDeleteModalOpened: !state.transactionDeleteModalOpened});
    };


    return (
        <Grid padded centered columns={2}>
            <Grid.Column width={10}>
                <Segment>
                    <LineTransactions transactions={transactionsData && transactionsData.getTransactionsByMonth}
                                      recurringTransactions={transactionsData && transactionsData.getRegularTransactionsByMonth}
                                      transactionsLoading={transactionsLoading} transactionsError={transactionsError}
                                      isRecurring={isRecurringView}/>
                </Segment>
                <Segment>
                    <DoughnutTransactions transactions={transactionsData && transactionsData.getTransactionsByMonth}
                                          recurringTransactions={transactionsData && transactionsData.getRegularTransactionsByMonth}
                                          transactionsLoading={transactionsLoading} transactionsError={transactionsError}
                                          isRecurring={isRecurringView}/>
                </Segment>
            </Grid.Column>
            <Grid.Column width={6}>
                <Dimmer inverted
                        active={updateTransactionLoading || deleteTransactionLoading || updateRecurringTransactionLoading || deleteRecurringTransactionLoading}>
                    <Loader inverted/>
                </Dimmer>
                <TransactionList date={currentDate} isRecurring={isRecurringView}
                                 transactions={transactionsData && transactionsData.getTransactionsByMonth}
                                 recurringTransactions={transactionsData && transactionsData.getRegularTransactionsByMonth}
                                 transactionsLoading={transactionsLoading} transactionsError={transactionsError}
                                 onPrevMonth={onPrevMonth} onNextMonth={onNextMonth}
                                 onTransactionSelected={onSelectedTransactionToggle}
                                 onTransactionsViewChange={onTransactionsViewChange}/>

                <div>
                    <Modal dimmer size="small" className={styles.transactionModal + ' modalContainer'}
                           closeOnEscape closeOnDimmerClick
                           open={state.transactionModalOpened} onClose={onSelectedTransactionToggle}>
                        <Modal.Header>Edit {isRecurringView && 'Recurring'} Transaction</Modal.Header>
                        <Modal.Content>
                            <TransactionForm transaction={state.selectedTransaction} errors={errors}
                                             isRecurring={isRecurringView} onChange={onSelectedTransactionChange}/>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic onClick={onSelectedTransactionToggle}>
                                Cancel
                            </Button>
                            <Button basic color="red" disabled={state.category && !state.category.isCustom}
                                    onClick={onTransactionDeleteToggle}>
                                Delete
                                <Confirm className="modalContainer"
                                         content={`Are you sure you want to delete the transaction?`}
                                         confirmButton={<Button basic negative>Yes, delete it</Button>}
                                         open={state.transactionDeleteModalOpened}
                                         onCancel={onTransactionDeleteToggle} onConfirm={onSelectedTransactionDelete}
                                />
                            </Button>
                            <Button primary loading={updateTransactionLoading} onClick={onSelectedTransactionSave}>
                                Save
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </div>
            </Grid.Column>
        </Grid>
    );
};

export default Transactions;

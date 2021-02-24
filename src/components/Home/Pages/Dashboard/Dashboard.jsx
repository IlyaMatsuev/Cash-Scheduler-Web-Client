import React, {useState} from 'react';
import Calendar from './Calendar/Calendar';
import {Button, Container, Segment, Modal} from 'semantic-ui-react';
import TransactionForm from '../Transactions/TransactionForm/TransactionForm';
import styles from './Dashboard.module.css';
import moment from 'moment';
import {useMutation, useQuery} from '@apollo/client';
import {onUIErrors} from '../../../../utils/UtilHooks';
import errorDefs from '../../../../utils/ErrorDefinitions';
import {global} from '../../../../config';
import userQueries from '../../../../queries/users';
import transactionQueries from '../../../../queries/transactions';
import transactionMutations from '../../../../mutations/transactions';


const Dashboard = ({currentDate, onTransactionPropsChange}) => {
    const initialState = {
        transactionModalOpened: false,
        recurringTransactionModalOpened: false,
        transaction: {
            title: '',
            amount: 0,
            date: moment().format(global.dateFormat),
            nextTransactionDate: moment().add(1, 'month').format(global.dateFormat),
            categoryId: 0,
            type: 'Expense',
            interval: 'month'
        }
    };
    const initialTransactionErrors = {};
    const [state, setState] = useState(initialState);
    const [transactionErrors, setTransactionErrors] = useState(initialTransactionErrors);

    const {
        loading: transactionsLoading,
        error: transactionsError,
        data: transactions
    } = useQuery(transactionQueries.GET_DASHBOARD_TRANSACTIONS, {
        variables: {month: currentDate.month() + 1, year: currentDate.year()}
    });

    const [createTransaction, {loading: createTransactionLoading}] = useMutation(transactionMutations.CREATE_TRANSACTION, {
        onCompleted() {
            setState({...state, transactionModalOpened: false, transaction: initialState.transaction});
        },
        onError(error) {
            onUIErrors(error, setTransactionErrors, transactionErrors);
        },
        refetchQueries: [{
            query: transactionQueries.GET_DASHBOARD_TRANSACTIONS,
            variables: {month: currentDate.month() + 1, year: currentDate.year()}
        }, {query: userQueries.GET_USER}],
        variables: {
            transaction: {
                title: state.transaction.title,
                amount: Number(state.transaction.amount),
                categoryId: state.transaction.categoryId,
                date: state.transaction.date
            }
        }
    });

    const [
        createRecurringTransaction,
        {loading: createRecurringTransactionLoading}
    ] = useMutation(transactionMutations.CREATE_RECURRING_TRANSACTION, {
        onCompleted() {
            setState({...state, recurringTransactionModalOpened: false, transaction: initialState.transaction});
        },
        onError(error) {
            onUIErrors(error, setTransactionErrors, transactionErrors);
        },
        refetchQueries: [{
            query: transactionQueries.GET_DASHBOARD_TRANSACTIONS,
            variables: {month: currentDate.month() + 1, year: currentDate.year()}
        }, {query: userQueries.GET_USER}],
        variables: {
            transaction: {
                title: state.transaction.title,
                amount: Number(state.transaction.amount),
                categoryId: state.transaction.categoryId,
                nextTransactionDate: state.transaction.nextTransactionDate,
                interval: state.transaction.interval
            }
        }
    });


    const validateTransaction = () => {
        let valid = true;
        if (!state.transaction.date || moment(state.transaction.date, global.dateFormat).format(global.dateFormat) !== state.transaction.date) {
            setTransactionErrors({
                ...initialTransactionErrors,
                date: errorDefs.INVALID_TRANSACTION_DATE_ERROR
            });
            valid = false;
        }
        return valid;
    };


    const onToday = () => {
        onTransactionPropsChange({name: 'currentDate', value: moment()});
    };

    const onTurnLeft = () => {
        onTransactionPropsChange({name: 'currentDate', value: currentDate.subtract(1, 'month')});
    };

    const onTurnRight = () => {
        onTransactionPropsChange({name: 'currentDate', value: currentDate.add(1, 'month')});
    };

    const onTransactionToggle = () => {
        setTransactionErrors(initialTransactionErrors);
        setState({
            ...state,
            transactionModalOpened: !state.transactionModalOpened,
            transaction: initialState.transaction
        });
    };

    const onRecurringTransactionToggle = () => {
        setTransactionErrors(initialTransactionErrors);
        setState({
            ...state,
            recurringTransactionModalOpened: !state.recurringTransactionModalOpened,
            transaction: initialState.transaction
        });
    };

    const onTransactionSave = () => {
        setTransactionErrors(initialTransactionErrors);
        if (validateTransaction()) {
            createTransaction();
        }
    };

    const onRecurringTransactionSave = () => {
        setTransactionErrors(initialTransactionErrors);
        if (validateTransaction()) {
            createRecurringTransaction();
        }
    };

    const onTransactionChange = (event, {name, value}) => {
        if (name === 'type') {
            state.transaction.category = '';
        }
        if (name === 'interval') {
            state.transaction.nextTransactionDate = moment().add(1, value).format(global.dateFormat);
        }
        setTransactionErrors({...transactionErrors, [name]: undefined});
        setState({...state, transaction: {...state.transaction, [name]: value}})
    };


    return (
        <div className="fullHeight">
            <Segment>
                <Container>
                    <Button active={currentDate.isSame(moment(), 'month')} onClick={onToday}>Today</Button>
                    <Button icon="chevron left" className="ml-2 mr-3" onClick={onTurnLeft}/>
                    <span className={styles.displayedDate}>{currentDate.format('MMMM, YYYY')}</span>
                    <Button icon="chevron right" className="ml-3 mr-2" onClick={onTurnRight}/>

                    <Button.Group color="blue" floated="right">
                        <Button onClick={onTransactionToggle}>Transaction</Button>
                        <Button onClick={onRecurringTransactionToggle}>Recurring Transaction</Button>
                    </Button.Group>
                </Container>
            </Segment>
            <Segment padded textAlign="center" className={styles.calendarWrapper}
                     loading={transactionsLoading || !!transactionsError}>
                {transactions && (
                    <Calendar targetDate={currentDate} transactions={transactions.dashboardTransactions}
                              recurringTransactions={transactions.dashboardRecurringTransactions}/>
                )}
            </Segment>

            <div>
                <Modal dimmer size="small" className={styles.transactionModal + ' modalContainer'}
                       closeOnEscape={true} closeOnDimmerClick={true}
                       open={state.transactionModalOpened} onClose={onTransactionToggle}>
                    <Modal.Header>New Transaction</Modal.Header>
                    <Modal.Content className="modalContainer">
                        <TransactionForm transaction={state.transaction} errors={transactionErrors}
                                         onChange={onTransactionChange}/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic onClick={onTransactionToggle}>
                            Cancel
                        </Button>
                        <Button primary loading={createTransactionLoading} onClick={onTransactionSave}>
                            Save
                        </Button>
                    </Modal.Actions>
                </Modal>

                <Modal dimmer size="small" className={styles.transactionModal + ' modalContainer'}
                       closeOnEscape={true} closeOnDimmerClick={true}
                       open={state.recurringTransactionModalOpened} onClose={onRecurringTransactionToggle}>
                    <Modal.Header>New Recurring Transaction</Modal.Header>
                    <Modal.Content className="modalContainer">
                        <TransactionForm transaction={state.transaction} errors={transactionErrors}
                                         onChange={onTransactionChange} isRecurring/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic onClick={onRecurringTransactionToggle}>
                            Cancel
                        </Button>
                        <Button primary loading={createRecurringTransactionLoading}
                                onClick={onRecurringTransactionSave}>
                            Save
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        </div>
    );
};

export default Dashboard;

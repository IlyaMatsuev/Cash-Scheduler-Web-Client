import React, {useState} from 'react';
import Calendar from './Calendar/Calendar';
import {Button, Container, Segment, Modal} from 'semantic-ui-react';
import TransactionForm from './Transactions/TransactionForm';
import styles from './Dashboard.module.css';
import moment from 'moment';
import {useMutation, useQuery} from '@apollo/client';
import queries from '../../../../queries';
import mutations from '../../../../mutations';
import {onUIErrors} from '../../../../utils/UtilHooks';
import errorDefs from '../../../../utils/ErrorDefinitions';


const DATE_FORMAT = 'YYYY-MM-DD';

const Dashboard = () => {
    const initialState = {
        targetDate: moment(),
        transactionModalOpened: false,
        recurringTransactionModalOpened: false,
        transaction: {
            title: '',
            amount: 0,
            date: moment().format(DATE_FORMAT),
            nextTransactionDate: moment().add(1, 'month').format(DATE_FORMAT),
            categoryId: 0,
            type: 'Expense',
            interval: 'month'
        }
    };
    const initialTransactionErrors = {};
    const [state, setState] = useState(initialState);
    const [transactionErrors, setTransactionErrors] = useState(initialTransactionErrors);

    const {loading: transactionsLoading, error: transactionsError, data: transactions} = useQuery(queries.GET_TRANSACTIONS_BY_MONTH, {
        variables: {month: state.targetDate.month() + 1, size: 100}
    });

    const [createTransaction, {loading: createTransactionLoading}] = useMutation(mutations.CREATE_TRANSACTION, {
        update() {
            setState({...state, transactionModalOpened: false, transaction: initialState.transaction});
        },
        onError(error) {
            onUIErrors(error, setTransactionErrors, transactionErrors);
        },
        refetchQueries: [{query: queries.GET_TRANSACTIONS_BY_MONTH, variables: {month: state.targetDate.month() + 1, size: 100}}],
        variables: {
            transaction: {
                title: state.transaction.title,
                amount: state.transaction.amount,
                categoryId: state.transaction.categoryId,
                date: state.transaction.date
            }
        }
    });

    const [createRecurringTransaction, {loading: createRecurringTransactionLoading}] = useMutation(mutations.CREATE_RECURRING_TRANSACTION, {
        update() {
            // TODO: try to update cache instead of refetching the query
            setState({...state, recurringTransactionModalOpened: false, transaction: initialState.transaction});
        },
        onError(error) {
            console.log(JSON.stringify(error, null, '  '));
            onUIErrors(error, setTransactionErrors, transactionErrors);
        },
        refetchQueries: [{query: queries.GET_TRANSACTIONS_BY_MONTH, variables: {month: state.targetDate.month() + 1, size: 100}}],
        variables: {
            transaction: {
                title: state.transaction.title,
                amount: state.transaction.amount,
                categoryId: state.transaction.categoryId,
                nextTransactionDate: state.transaction.nextTransactionDate,
                interval: state.transaction.interval
            }
        }
    });


    const validateTransaction = () => {
        let valid = true;
        if (!state.transaction.date || moment(state.transaction.date, DATE_FORMAT).format(DATE_FORMAT) !== state.transaction.date) {
            setTransactionErrors({
                ...initialTransactionErrors,
                date: errorDefs.INVALID_TRANSACTION_DATE_ERROR
            });
            valid = false;
        }
        return valid;
    };


    const onToday = () => {
        setState({...initialState});
    };

    const onTurnLeft = () => {
        setState({...state, targetDate: state.targetDate.add(-1, 'month')});
    };

    const onTurnRight = () => {
        setState({...state, targetDate: state.targetDate.add(1, 'month')});
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
            state.transaction.nextTransactionDate = moment().add(1, value).format(DATE_FORMAT);
        }
        setTransactionErrors({...transactionErrors, [name]: undefined});
        setState({...state, transaction: {...state.transaction, [name]: value}})
    };


    return (
        <div className="fullHeight">
            <Segment>
                <Container>
                    <Button active={state.targetDate.isSame(moment(), 'month')} onClick={onToday}>Today</Button>
                    <Button icon="chevron left" className="ml-2 mr-3" onClick={onTurnLeft}/>
                    <span className={styles.displayedDate}>{state.targetDate.format('MMMM, YYYY')}</span>
                    <Button icon="chevron right" className="ml-3 mr-2" onClick={onTurnRight}/>

                    <Button.Group color="blue" floated="right">
                        <Button onClick={onTransactionToggle}>Transaction</Button>
                        <Button onClick={onRecurringTransactionToggle}>Recurring Transaction</Button>
                    </Button.Group>
                </Container>
            </Segment>
            <Segment padded textAlign="center" className={styles.calendarWrapper}
                     loading={transactionsLoading || transactionsError}>
                {transactions && (
                    <Calendar targetDate={state.targetDate} transactions={transactions.getTransactionsByMonth}
                              recurringTransactions={transactions.getAllRegularTransactions}/>
                )}
            </Segment>

            <div>
                <Modal dimmer size="small" className={styles.transactionModal}
                       closeOnEscape={true} closeOnDimmerClick={true}
                       open={state.transactionModalOpened} onClose={onTransactionToggle}>
                    <Modal.Header>New Transaction</Modal.Header>
                    <Modal.Content className={styles.transactionModalBody}>
                        <TransactionForm transaction={state.transaction} errors={transactionErrors}
                                         onChange={onTransactionChange} isRecurring={false}/>
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

                <Modal dimmer size="small" className={styles.recurringTransactionModal}
                       closeOnEscape={true} closeOnDimmerClick={true}
                       open={state.recurringTransactionModalOpened} onClose={onRecurringTransactionToggle}>
                    <Modal.Header>New Recurring Transaction</Modal.Header>
                    <Modal.Content className={styles.recurringTransactionModalBody}>
                        <TransactionForm transaction={state.transaction} errors={transactionErrors}
                                         onChange={onTransactionChange} isRecurring={true}/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic onClick={onRecurringTransactionToggle}>
                            Cancel
                        </Button>
                        <Button primary loading={createRecurringTransactionLoading} onClick={onRecurringTransactionSave}>
                            Save
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        </div>
    );
};

export default Dashboard;

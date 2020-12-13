import React from 'react';
import {Grid, Input, Dropdown, Button} from 'semantic-ui-react';
import {DateInput} from 'semantic-ui-calendar-react';
import {useQuery} from '@apollo/client';
import queries from '../../../../../queries';
import ErrorsList from '../../../../../utils/ErrorsList/ErrorsList';
import styles from './TransactionForm.module.css';

// TODO: there is already a modal form for creating new transactions. It can be improved to be utilized for editing as well
const recurringTransactionIntervals = [
    {key: 1, value: 'day', text: 'Daily'},
    {key: 2, value: 'week', text: 'Weekly'},
    {key: 3, value: 'month', text: 'Monthly'},
    {key: 4, value: 'year', text: 'Yearly'}
];

// TODO: there is already a modal form for creating new transactions. It can be improved to be utilized for editing as well
const TransactionForm = ({isRecurring, transaction, errors, onChange}) => {

    // TODO: THIS CAN BE MOVED IN A SINGLE CALL RETRIEVING TRANSACTION TYPES AND ALL USER'S RELATED CATEGORIES
    const {data: types} = useQuery(queries.GET_TRANSACTION_TYPES);
    const {data: categories} = useQuery(queries.GET_USER_CATEGORIES, {
        variables: {typeName: transaction.type}
    });

    return (
        <Grid columns={2} padded centered>
            <Grid.Row>
                <Grid.Column>
                    <Input type="text" name="title" placeholder="Title"
                           error={!!errors.title} value={transaction.title || ''} onChange={onChange}/>
                </Grid.Column>
                <Grid.Column>
                    <Input type="number" name="amount" placeholder="Amount"
                           error={!!errors.amount} value={transaction.amount} onChange={onChange}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    {!isRecurring &&
                    <DateInput placeholder="Date" iconPosition="left" dateFormat="YYYY-MM-DD" name="date"
                               className={errors.date ? 'dateFieldError' : ''}
                               value={transaction.date} onChange={onChange}/>}

                    {isRecurring &&
                    <DateInput placeholder="Next Transaction Date" iconPosition="left" dateFormat="YYYY-MM-DD"
                               name="nextTransactionDate" disabled
                               className={errors.nextTransactionDate ? 'dateFieldError' : ''}
                               value={transaction.nextTransactionDate} onChange={onChange}/>}
                </Grid.Column>
                <Grid.Column>
                    <Button.Group>
                        <Dropdown className={styles.categoriesDropdown} button deburr fluid scrolling
                                  search selection placeholder="Category" name="categoryId" error={!!errors.categoryId}
                                  value={transaction.category.id} onChange={onChange} disabled
                                  options={
                                      (categories && categories.getAllCategories.map(category => ({
                                          key: category.id,
                                          value: category.id,
                                          text: category.name,
                                          image: {avatar: true, src: category.iconUrl}
                                      }))) || []}/>
                        <Dropdown button floating name="type" disabled
                                  value={transaction.category.transactionType.typeName} onChange={onChange}
                                  options={
                                      types && types.getTransactionTypes.map(type => ({
                                          key: type.typeName,
                                          text: type.typeName,
                                          value: type.typeName
                                      }))
                                  }/>
                    </Button.Group>
                </Grid.Column>
            </Grid.Row>
            {isRecurring &&
            <Grid.Row centered>
                <Dropdown search selection name="interval" disabled
                          error={!!errors.interval} value={transaction.interval} onChange={onChange}
                          options={recurringTransactionIntervals}/>
            </Grid.Row>}
            <Grid.Row>
                <ErrorsList errors={errors}/>
            </Grid.Row>
        </Grid>
    );
};

export default TransactionForm;

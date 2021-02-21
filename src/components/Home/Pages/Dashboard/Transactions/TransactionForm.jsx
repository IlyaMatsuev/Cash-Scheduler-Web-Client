import React from 'react';
import {Grid, Input, Dropdown, Button} from 'semantic-ui-react';
import {DateInput} from 'semantic-ui-calendar-react';
import {useQuery} from '@apollo/client';
import styles from './TransactionForm.module.css';
import ErrorsList from '../../../../../utils/ErrorsList/ErrorsList';
import categoriesQueries from '../../../../../queries/categories';
import transactionTypesQueries from '../../../../../queries/transactionTypes';
import {convertToValidIconUrl} from '../../../../../utils/UtilHooks';


const recurringTransactionIntervals = [
    {key: 1, value: 'day', text: 'Daily'},
    {key: 2, value: 'week', text: 'Weekly'},
    {key: 3, value: 'month', text: 'Monthly'},
    {key: 4, value: 'year', text: 'Yearly'}
];

const TransactionForm = ({isRecurring, transaction, errors, onChange}) => {

    // TODO: THIS CAN BE MOVED IN A SINGLE CALL RETRIEVING TRANSACTION TYPES AND ALL USER'S RELATED CATEGORIES
    const {data: types} = useQuery(transactionTypesQueries.GET_TRANSACTION_TYPES);
    const {data: categories} = useQuery(categoriesQueries.GET_USER_CATEGORIES, {
        variables: {typeName: transaction.type}
    });

    return (
        <Grid columns={2} padded centered>
            <Grid.Row>
                <Grid.Column>
                    <Input type="text" name="title" placeholder="Title"
                           error={!!errors.title} value={transaction.title} onChange={onChange}/>
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
                               name="nextTransactionDate"
                               className={errors.nextTransactionDate ? 'dateFieldError' : ''}
                               value={transaction.nextTransactionDate} onChange={onChange}/>}
                </Grid.Column>
                <Grid.Column>
                    <Button.Group>
                        {/*TODO: add opportunity to add categories right here*/}
                        <Dropdown className={styles.categoriesDropdown} button deburr fluid scrolling
                                  search selection placeholder="Category" name="categoryId" error={!!errors.categoryId}
                                  value={transaction.categoryId} onChange={onChange}
                                  options={
                                      (categories && categories.allCategories.map(category => ({
                                          key: category.id,
                                          value: category.id,
                                          text: category.name,
                                          image: {avatar: true, src: convertToValidIconUrl(category.iconUrl)}
                                      }))) || []}/>
                        <Dropdown button floating name="type"
                                  value={transaction.type} onChange={onChange}
                                  options={
                                      types && types.transactionTypes.map(type => ({
                                          key: type.name,
                                          text: type.name,
                                          value: type.name
                                      }))
                                  }/>
                    </Button.Group>
                </Grid.Column>
            </Grid.Row>
            {isRecurring &&
            <Grid.Row centered>
                <Dropdown search selection name="interval"
                          error={!!errors.interval} value={transaction.interval} onChange={onChange}
                          options={recurringTransactionIntervals}/>
            </Grid.Row>
            }
            <Grid.Row>
                <ErrorsList errors={errors}/>
            </Grid.Row>
        </Grid>
    );
};

export default TransactionForm;

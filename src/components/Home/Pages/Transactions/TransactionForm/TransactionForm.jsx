import React from 'react';
import {Grid, Input, Dropdown, Button, Header} from 'semantic-ui-react';
import {DateInput} from 'semantic-ui-calendar-react';
import {useQuery} from '@apollo/client';
import ErrorsList from '../../../../../utils/ErrorsList/ErrorsList';
import styles from './TransactionForm.module.css';
import categoriesQueries from '../../../../../queries/categories';
import {convertToValidIconUrl, onNumberInput, toFloat} from '../../../../../utils/UtilHooks';
import {global} from '../../../../../config';


const recurringTransactionIntervals = [
    {key: 1, value: 'day', text: 'Daily'},
    {key: 2, value: 'week', text: 'Weekly'},
    {key: 3, value: 'month', text: 'Monthly'},
    {key: 4, value: 'year', text: 'Yearly'}
];

const TransactionForm = ({isRecurring = false, isEditing = false, transaction, errors, onChange}) => {

    const {
        data: categoriesWithTypesAndWallets,
        loading: categoriesWithTypesAndWalletsLoading,
        error: categoriesWithTypesAndWalletsError
    } = useQuery(categoriesQueries.GET_ALL_USER_CATEGORIES_WITH_TYPES_AND_WALLETS, {
        variables: {typeName: transaction.type || transaction.category?.type?.name}
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
                           error={!!errors.amount} value={toFloat(transaction.amount)} onChange={onChange}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    {!isRecurring &&
                    <DateInput placeholder="Date" iconPosition="left" dateFormat={global.dateFormat} name="date"
                               className={errors.date ? 'dateFieldError' : ''}
                               value={transaction.date} onChange={onChange}/>}

                    {isRecurring &&
                    <DateInput placeholder="Next Transaction Date" iconPosition="left" dateFormat={global.dateFormat}
                               name="nextTransactionDate" disabled={isEditing}
                               className={errors.nextTransactionDate ? 'dateFieldError' : ''}
                               value={transaction.nextTransactionDate} onChange={onChange}/>}
                </Grid.Column>
                <Grid.Column>
                    <Button.Group>
                        <Dropdown className={styles.categoriesDropdown} button deburr fluid scrolling
                                  search selection placeholder="Category" name="categoryId" error={!!errors.categoryId}
                                  value={transaction.category?.id} onChange={onChange} disabled={isEditing}
                                  options={
                                      (categoriesWithTypesAndWallets && categoriesWithTypesAndWallets.allCategories.map(category => ({
                                          key: category.id,
                                          value: category.id,
                                          text: category.name,
                                          image: {avatar: true, src: convertToValidIconUrl(category.iconUrl)}
                                      }))) || []}/>
                        <Dropdown button floating name="type" disabled={isEditing}
                                  value={transaction.type || transaction.category?.type?.name} onChange={onChange}
                                  options={
                                      categoriesWithTypesAndWallets && categoriesWithTypesAndWallets.transactionTypes.map(type => ({
                                          key: type.name,
                                          text: type.name,
                                          value: type.name
                                      }))
                                  }/>
                    </Button.Group>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Dropdown deburr scrolling search selection
                              loading={categoriesWithTypesAndWalletsLoading || categoriesWithTypesAndWalletsError}
                              disabled={isEditing} className={styles.walletsDropdown}
                              placeholder="Wallet" name="walletId"
                              error={!!errors.walletId}
                              value={transaction.walletId || transaction.wallet?.id}
                              onChange={onChange}
                              options={
                                  (categoriesWithTypesAndWallets && categoriesWithTypesAndWallets.wallets.map(wallet => ({
                                      key: wallet.id,
                                      value: wallet.id,
                                      text: `${wallet.currency.abbreviation} - ${wallet.name}`,
                                      content: (
                                          <Header as="span" size="tiny" textAlign="center">
                                              {wallet.currency.abbreviation} - {wallet.name}
                                          </Header>
                                      ),
                                      image: {avatar: true, src: convertToValidIconUrl(wallet.currency.iconUrl)}
                                  }))) || []}
                    />
                </Grid.Column>
                <Grid.Column>
                    {isRecurring &&
                    <Dropdown search selection name="interval" disabled={isEditing}
                              error={!!errors.interval} value={transaction.interval} onChange={onChange}
                              options={recurringTransactionIntervals}
                    />}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <ErrorsList errors={errors}/>
            </Grid.Row>
        </Grid>
    );
};

export default TransactionForm;

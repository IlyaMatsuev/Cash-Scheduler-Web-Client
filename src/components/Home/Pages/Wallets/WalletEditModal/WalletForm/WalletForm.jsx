import React from 'react';
import {Checkbox, Dropdown, Grid, Input} from 'semantic-ui-react';
import ErrorsList from '../../../../../../utils/ErrorsList/ErrorsList';
import {convertToValidIconUrl, toFloat} from '../../../../../../utils/UtilHooks';
import currencyQueries from '../../../../../../graphql/queries/currencies';
import {useQuery} from '@apollo/client';
import styles from './WalletForm.module.css';
import ExchangeRatesDropdown from '../../ExchangeRatesDropdown/ExchangeRatesDropdown';


const WalletForm = ({wallet, errors, onChange, isEditing}) => {
    const {
        data: currenciesQueryData,
        loading: currenciesQueryLoading,
        error: currenciesQueryError,
    } = useQuery(currencyQueries.GET_CURRENCIES);

    return (
        <Grid columns={2} padded centered>
            <Grid.Row>
                <Grid.Column>
                    <Input type="text" name="name" placeholder="Name"
                           error={!!errors.name} value={wallet.name} onChange={onChange}/>
                </Grid.Column>
                <Grid.Column>
                    <Input type="number" name="balance" placeholder="Balance"
                           error={!!errors.balance} value={toFloat(wallet.balance)} onChange={onChange}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Dropdown deburr scrolling search selection lazyLoad className={styles.currencyDropdown}
                              loading={currenciesQueryLoading || !!currenciesQueryError}
                              placeholder="Currency" name="currencyAbbreviation"
                              error={!!errors.currencyAbbreviation}
                              value={wallet.currencyAbbreviation || wallet.currency?.abbreviation}
                              onChange={onChange}
                              options={
                                  (currenciesQueryData && currenciesQueryData.currencies.map(currency => ({
                                      key: currency.abbreviation,
                                      value: currency.abbreviation,
                                      text: currency.abbreviation,
                                      image: {avatar: true, src: convertToValidIconUrl(currency.iconUrl)}
                                  }))) || []}/>
                </Grid.Column>
                <Grid.Column>
                    <Checkbox toggle label="Is Default?" name="isDefault" disabled={wallet.originallyDefault}
                              checked={wallet.isDefault} onChange={onChange}
                    />
                </Grid.Column>
            </Grid.Row>
            {isEditing &&
            <Grid.Row>
                <Grid.Column>
                    {wallet.convertBalance
                    && <ExchangeRatesDropdown value={wallet.exchangeRate} error={!!errors.exchangeRate}
                                              sourceCurrency={wallet.originalCurrency}
                                              targetCurrency={wallet.currencyAbbreviation}
                                              onChange={onChange}
                    />}
                </Grid.Column>
                <Grid.Column>
                    {wallet.currencyChanged
                    && <Checkbox toggle label="Convert Balance?" name="convertBalance"
                                 checked={wallet.convertBalance} onChange={onChange}
                    />}
                </Grid.Column>
            </Grid.Row>}
            <Grid.Row>
                <ErrorsList errors={errors}/>
            </Grid.Row>
        </Grid>
    )
};

export default WalletForm;

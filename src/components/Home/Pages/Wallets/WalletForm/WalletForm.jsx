import React from 'react';
import moment from 'moment';
import {Checkbox, Dropdown, Grid, Input} from 'semantic-ui-react';
import ErrorsList from '../../../../../utils/ErrorsList/ErrorsList';
import {convertToValidIconUrl, onNumberInput, toFloat} from '../../../../../utils/UtilHooks';
import currencyQueries from '../../../../../queries/currencies';
import currencyMutations from '../../../../../mutations/currencies';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import styles from './WalletForm.module.css';
import {global} from '../../../../../config';


const WalletForm = ({wallet, errors, onChange, isEditing}) => {
    const {
        data: currenciesQueryData,
        loading: currenciesQueryLoading,
        error: currenciesQueryError,
    } = useQuery(currencyQueries.GET_CURRENCIES);

    const [
        getRates,
        {data: ratesQueryData, loading: ratesQueryLoading, error: ratesQueryError, called}
    ] = useLazyQuery(currencyQueries.GET_RATES_BY_SOURCE_AND_TARGET, {
        variables: {
            source: wallet.originalCurrency,
            target: wallet.currencyAbbreviation
        }
    });

    const [
        createExchangeRate,
        {loading: createExchangeRateLoading, error: createExchangeRateError}
    ] = useMutation(currencyMutations.CREATE_EXCHANGE_RATE);


    const onNewRateAdd = (event, {value}) => {
        createExchangeRate({
            variables: {
                exchangeRate: {
                    sourceCurrencyAbbreviation: wallet.originalCurrency,
                    targetCurrencyAbbreviation: wallet.currencyAbbreviation,
                    exchangeRate: Number(Number(value)?.toFixed(2)),
                    validFrom: moment().format(global.dateFormat),
                    validTo: moment().format(global.dateFormat)
                }
            },
            refetchQueries: [{
                query: currencyQueries.GET_RATES_BY_SOURCE_AND_TARGET,
                variables: {
                    source: wallet.originalCurrency,
                    target: wallet.currencyAbbreviation
                }
            }]
        })
    };

    if (isEditing && wallet.convertBalance && !called) {
        getRates();
    }

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
                    && <Dropdown deburr scrolling search selection lazyLoad
                                 loading={
                                     ratesQueryLoading || createExchangeRateLoading
                                     || !!ratesQueryError || !!createExchangeRateError}
                                 placeholder="Exchange Rate" name="exchangeRate"
                                 allowAdditions additionLabel="Add Exchange Rate: " onAddItem={onNewRateAdd}
                                 error={!!errors.exchangeRate}
                                 value={wallet.exchangeRate}
                                 onChange={onChange} onInput={onNumberInput}
                                 options={
                                     (ratesQueryData && ratesQueryData.exchangeRates.map(rate => ({
                                         key: rate.id,
                                         text: rate.exchangeRate.toFixed(2),
                                         value: rate.exchangeRate.toFixed(2)
                                     }))) || []}
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

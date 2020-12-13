import React from 'react';
import {Container, Dimmer, Loader} from 'semantic-ui-react';
import {Line} from 'react-chartjs-2';
import moment from 'moment';


const lineChartColorByType = {
    'Income': '#7eb3ff',
    'Expense': '#FF7272'
};


const LineTransactions = ({transactions = [], recurringTransactions = [], transactionsLoading, transactionsError, isRecurring}) => {

    const sortTransactionsByDate = (transactions, dateField = 'date') => {
        const transactionsByDate = {};
        if (transactions) {
            transactions.forEach(transaction => {
                if (transactionsByDate[transaction[dateField]]) {
                    transactionsByDate[transaction[dateField]].push(transaction);
                } else {
                    transactionsByDate[transaction[dateField]] = [transaction];
                }
            });
        }
        return transactionsByDate;
    };

    const getDatasetByTransactionType = (dates, transactionsByDate, type) => {
        const summary = dates.filter(date => transactionsByDate[date]).map(date => transactionsByDate[date].reduce((a, b) => {
            return b.category.transactionType.typeName === type ? a + b.amount : a;
        }, 0).toFixed(2));
        return {
            data: summary,
            label: type,
            borderColor: lineChartColorByType[type]
        };
    };

    const getChartData = transactions => {
        const transactionsByDate = sortTransactionsByDate(transactions, isRecurring ? 'nextTransactionDate' : 'date');
        const transactionDates = Object.keys(transactionsByDate).sort();
        const dates = [];
        const beginInterval = moment(transactionDates[0]).startOf('month');
        const endInterval = moment(transactionDates[transactionDates.length - 1]).endOf('month').add(1, 'days');

        for (let date = beginInterval.clone(); !date.isSame(endInterval, 'day'); date.add(1, 'days')) {
            const formattedDate = date.format('YYYY-MM-DD');
            dates.push(formattedDate);
            if (!transactionsByDate[formattedDate]) {
                transactionsByDate[formattedDate] = [];
            }
        }
        return {
            labels: dates,
            datasets: [
                getDatasetByTransactionType(dates, transactionsByDate, 'Income'),
                getDatasetByTransactionType(dates, transactionsByDate, 'Expense')
            ]
        };
    };


    const options = {
        title: {
            text: (isRecurring ? 'Recurring: ' : '') + 'Income - Expenses',
            display: true,
            fontSize: 22,
            fontColor: 'rgba(0, 0, 0, .54)'
        },
        legend: {
            position: 'top'
        }
    };

    return (
        <Container fluid>
            <Dimmer active={transactionsLoading || transactionsError} inverted>
                <Loader inverted>Loading</Loader>
            </Dimmer>
            {!isRecurring && <Line data={getChartData(transactions)} options={options} height={125}/>}
            {isRecurring && <Line data={getChartData(recurringTransactions)} options={options} height={125}/>}
        </Container>
    );
};

export default LineTransactions;

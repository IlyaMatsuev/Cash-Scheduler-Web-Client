import React from 'react';
import * as serviceWorker from './serviceWorker';
import {render} from 'react-dom';
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import 'semantic-ui-css/semantic.min.css';
import Routes from './routes';

const httpLink = createHttpLink({
    uri: 'https://localhost:8001/graphql',
});

const authLink = setContext((_, { headers }) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        headers.authorization = `Bearer ${accessToken}`;
    }
    return headers;
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const App = () => (
    <ApolloProvider client={client}>
        <Routes/>
    </ApolloProvider>
);

render(<App/>, document.getElementById('root'));
serviceWorker.unregister();

import React from 'react';
import * as serviceWorker from './serviceWorker';
import {render} from 'react-dom';
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import 'semantic-ui-css/semantic.min.css';
import Routes from './routes';
import {onError} from "@apollo/client/link/error";
import {refreshTokens, setAuthHeaders} from './utils/Auth';


let apolloClient;

const httpLink = createHttpLink({uri: 'https://localhost:8001/graphql'});

const setTokensLink = setContext((_, {headers}) => setAuthHeaders(headers));

const errorLink = onError(({networkError, operation, forward}) => {
    if (networkError?.statusCode === 401) {
        return refreshTokens(apolloClient, operation, forward);
    }
});


apolloClient = new ApolloClient({
    link: ApolloLink.from([setTokensLink, errorLink, httpLink]),
    cache: new InMemoryCache()
});

const App = () => (
    <ApolloProvider client={apolloClient}>
        <Routes/>
    </ApolloProvider>
);

render(<App/>, document.getElementById('root'));
serviceWorker.unregister();

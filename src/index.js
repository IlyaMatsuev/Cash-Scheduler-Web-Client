import React from 'react';
import * as serviceWorker from './serviceWorker';
import {render} from 'react-dom';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import 'semantic-ui-css/semantic.min.css';
import Routes from './routes';


const client = new ApolloClient({
    uri: 'https://localhost:8001/graphql',
    cache: new InMemoryCache()
});

const App = () => (
    <ApolloProvider client={client}>
        <Routes/>
    </ApolloProvider>
);

render(<App/>, document.getElementById('root'));
serviceWorker.unregister();

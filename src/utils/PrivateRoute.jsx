import React from 'react';
import {Redirect, Route} from 'react-router-dom';


const PrivateRoute = ({component: Component, ...props}) => {

    const isAuthenticated = () => {
        // TODO: verify the user has access with the tokens
        const accessToken = localStorage.getItem('accessToken');
        return accessToken;
    };

    let destination;
    if (isAuthenticated()) {
        destination = <Component {...props} />;
    } else {
        destination = <Redirect to={{pathname: '/'}}/>
    }

    return <Route {...props} render={() => destination}/>
};

export default PrivateRoute;

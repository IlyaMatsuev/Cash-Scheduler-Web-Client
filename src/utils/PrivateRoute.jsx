import React from 'react';
import {Redirect, Route} from 'react-router-dom';


const PrivateRoute = ({component: Component, ...props}) => {

    const isAuthenticated = () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

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

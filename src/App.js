import React from 'react';
import './App.css';

import Header from "./components/Header";
import LoginPageContent from "./components/LoginPageContent";

class App extends React.Component {
  render() {
    return (
        <div>
            <Header/>
            <LoginPageContent/>
        </div>
    );
  }
}

export default App;

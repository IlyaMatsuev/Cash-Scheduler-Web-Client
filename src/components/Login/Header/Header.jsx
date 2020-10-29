import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <header>
                <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
                    <a className="navbar-brand" href="/">
                        <strong>Cash Scheduler</strong>
                    </a>
                </nav>
            </header>
        );
    }
}

export default Header;

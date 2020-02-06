import React from "react";
import './Header.css';

class Header extends React.Component {
    render() {
        return (
            <header>
                <nav className="navbar fixed-top navbar-expand-lg navbar-dark scrolling-navbar">
                    <a className="navbar-brand" href="#"><strong>Cash Scheduler</strong></a>

                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="nav navbar-nav mr-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Download the App</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link1</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link2</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Header;

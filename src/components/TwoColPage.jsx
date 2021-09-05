import React, {Component} from 'react';
import Navbar from "./Navbar";
import './TwoColPage.scss'

class TwoColPage extends Component {
    render() {
        return (
            <div className={"page"}>
                <Navbar />
                <div className="page-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default TwoColPage;

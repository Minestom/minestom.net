import React, { Component } from 'react'
import NavbarLink from './NavbarLink'
import './Navbar.scss';
import ExternalLinks from '../resources/external-links.json'
import InternalLinks from '../resources/internal-links.json'

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this)
        this.state = {
            toggled: false
        }
    }

    render() {
        return (
            <div className="navbar">
                <span>
                    <i className="fas fa-bars" onClick={this.toggle} />
                    <span className={`toggle-container ${this.state.toggled ? "on" : "off"}`}>
                        {InternalLinks.map(link => (<NavbarLink {...link} />))}
                    </span>
                </span>
                {ExternalLinks.map(link => (<NavbarLink {...link} />))}
            </div>
        )
    }

    toggle() {
        this.setState({toggled: !this.state.toggled})
    }
}

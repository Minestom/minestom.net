import React, { Component } from 'react'
import NavbarLink from './NavbarLink'
import './Navbar.scss';
import ExternalLinks from '../resources/external-links.json'
import InternalLinks from '../resources/internal-links.json'

export default class Navbar extends Component {

    render() {
        return (
            <div className="navbar">
                <span>
                    {InternalLinks.map(link => (<NavbarLink {...link} />))}
                </span>
                {ExternalLinks.map(link => (<NavbarLink {...link} />))}
            </div>
        )
    }
}

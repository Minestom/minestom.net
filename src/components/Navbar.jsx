import React, { Component } from 'react'
import NavbarLink from './NavbarLink'
import './Navbar.scss';
import ExternalLinks from '../resources/external-links.json'

export default class Navbar extends Component {

    render() {
        return (
            <div class="navbar">
                {ExternalLinks.map(link => (<NavbarLink {...link} />))}
            </div>
        )
    }
}

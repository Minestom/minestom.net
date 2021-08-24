import React, { Component } from 'react'
import "./NavbarLink.scss"

export default class NavbarLink extends Component {
    render() {
        return (
            <a href={this.props.href} className="navbar-link">
                <i className={this.props.icon} style={this.props.style}></i>
                {this.props.name}
            </a>
        )
    }
}

import React, { Component } from 'react'
import "./NavbarLink.scss"

export default class NavbarLink extends Component {
    render() {
        return (
            <a href={this.props.href} className="navbar-link">
                {this.props.icon !== undefined && (<i className={this.props.icon} style={this.props.style}/>)}
                {this.props.name}
            </a>
        )
    }
}

import React, { Component } from 'react'
import './Callout.scss'

export class Error extends Component {
    render() {
        return (
            <p className="error" dangerouslySetInnerHTML={{__html: this.props.text}} />
        )
    }
}

export class Warn extends Component {
    render() {
        return (
            <p className="warn" dangerouslySetInnerHTML={{__html: this.props.text}} />
        )
    }
}

export class Info extends Component {
    render() {
        return (
            <p className="info" dangerouslySetInnerHTML={{__html: this.props.text}} />
        )
    }
}
import React, { Component } from 'react'
import './Callout.scss'

export class Error extends Component {
    render() {
        return (
            <p class="error" dangerouslySetInnerHTML={{__html: this.props.text}} />
        )
    }
}

export class Warn extends Component {
    render() {
        return (
            <p class="warn" dangerouslySetInnerHTML={{__html: this.props.text}} />
        )
    }
}

export class Info extends Component {
    render() {
        return (
            <p class="info" dangerouslySetInnerHTML={{__html: this.props.text}} />
        )
    }
}
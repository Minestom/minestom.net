import React, { Component } from 'react'
import './Callout.scss'
import './WikiReference.scss'

export default class WikiReference extends Component {
    wikiBaseURL = "https://wiki.minestom.net"
    render() {
        return (
            <a className="wiki info" href={this.wikiBaseURL + this.props.path} dangerouslySetInnerHTML={{__html: this.props.text}} />
        )
    }
}

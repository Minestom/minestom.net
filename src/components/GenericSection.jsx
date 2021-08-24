import React, { Component } from 'react'
import './GenericSection.scss'
import WikiReference from './WikiReference'
import { Warn, Error } from './Callout'

export default class GenericSection extends Component {
    render() {
        return (
            <div className="generic-section">
                <div>
                    <img src={this.props.img.src} alt={this.props.img.alt} loading="lazy" />
                </div>
                <div>
                    <div>
                        <h3>{this.props.title}</h3>
                        {this.props.paragraphs.map(p => (<p dangerouslySetInnerHTML={{__html: p}}/>))}
                        {this.props.warn !== undefined && <Warn text={this.props.warn} />}
                        {this.props.error !== undefined && <Error text={this.props.error} />}
                        {this.props.wiki !== undefined && <WikiReference {...this.props.wiki} />}
                    </div>
                </div>
            </div>
        )
    }
}

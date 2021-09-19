import React, { Component } from 'react'
import './GenericSection.scss'
import WikiReference from './WikiReference'
import { Warn, Error } from './Callout'
import hljs from "highlight.js";

export default class GenericSection extends Component {
    constructor(props) {
        super(props);
        this.codeBlock = React.createRef()
    }

    render() {
        return (
            <div className="generic-section">
                <div>
                    <pre>
                        {this.props.codeUrl !== undefined && <a href={this.props.codeUrl} rel={"nofollow"}><i className="fas fa-link"/></a>}
                        <code ref={this.codeBlock} className={"language-java"}>{this.props.code}</code>
                    </pre>
                </div>
                <div>
                    <div>
                        <h3>{this.props.title}</h3>
                        {this.props.paragraphs.map(p => (<p key={p.substr(0,30)} dangerouslySetInnerHTML={{__html: p}}/>))}
                        {this.props.warn !== undefined && <Warn text={this.props.warn} />}
                        {this.props.error !== undefined && <Error text={this.props.error} />}
                        {this.props.wiki !== undefined && <WikiReference {...this.props.wiki} />}
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        hljs.highlightElement(this.codeBlock.current);
    }
}

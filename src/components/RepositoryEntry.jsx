import React, {Component} from 'react';
import './RepositoryEntry.scss'

export default class RepositoryEntry extends Component {
    render() {
        return (
            <li className="repository-entry">
                <div className={`${this.props.owner === "Minestom" ? "official" : ""} ${this.props.preRelease ? "pre-release" : ""}`}>
                    <a href={`/${this.props.page}?id=${this.props.owner}/${this.props.name}`} rel="nofollow">
                        <h3>{this.props.name}</h3>
                        <h4>by <a rel="nofollow" href={"https://github.com/"+this.props.owner}>{this.props.owner}</a></h4>
                        <a className={"direct-link"} href={"https://github.com/"+this.props.owner+"/"+this.props.name}><i className="fab fa-github"/></a>
                        <p>{this.props.description}</p>
                    </a>
                </div>
            </li>
        );
    }
}
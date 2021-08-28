import React, {Component} from 'react';
import './ExtensionEntry.scss'

export default class ExtensionEntry extends Component {
    render() {
        return (
            <li className="extension-entry">
                <div>
                    <a href={"/extension?id="+this.props.owner.login+"/"+this.props.name} rel="nofollow">
                        <h3>
                            {this.props.owner.login === "Minestom" && (<img src="/static/img/icon_transparent.png" height="16px" style={{display: "inline-block", marginRight: "4px"}} />)}
                            {this.props.name}
                        </h3>
                        <h4>by <a rel="nofollow" href={"https://github.com/"+this.props.owner.login}>{this.props.owner.login}</a></h4>
                        <p>{this.props.description}</p>
                    </a>
                </div>
            </li>
        );
    }
}
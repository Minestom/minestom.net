import React, {Component} from 'react';
import './Loading.scss'

class Loading extends Component {
    render() {
        return (
            <p className={"loading"}>
                <i className="fas fa-spinner fa-spin" />
                Loading {this.props.text}...
            </p>
        );
    }
}

export default Loading;

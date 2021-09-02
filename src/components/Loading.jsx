import React, {Component} from 'react';

class Loading extends Component {
    render() {
        return (
            <p>
                Loading {this.props.text}...
            </p>
        );
    }
}

export default Loading;

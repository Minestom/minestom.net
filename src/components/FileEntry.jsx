import React, {Component} from 'react';
import './FileEntry.scss'

class FileEntry extends Component {
    render() {
        return (
            <a download href={this.props.browser_download_url} className={"fileEntry"}>
                <i className="fas fa-file-archive" />
                <p>{this.props.name}</p>
                <p>{this.props.size} Bytes</p>
            </a>
        );
    }
}

export default FileEntry;
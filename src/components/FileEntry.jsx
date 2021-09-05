import React, {Component} from 'react';
import './FileEntry.scss'
import filesize from "filesize";

class FileEntry extends Component {
    render() {
        return (
            <a download href={this.props.browser_download_url} className={"fileEntry"}>
                <i className="fas fa-file-archive" />
                <p>{this.props.name}</p>
                <p>{filesize(this.props.size)}</p>
            </a>
        );
    }
}

export default FileEntry;
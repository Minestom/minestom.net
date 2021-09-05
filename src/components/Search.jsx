import React, {Component} from 'react';
import Fuse from "fuse.js";
import './Search.scss'

class Search extends Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this)

        this.fuse = null
        if (this.props.data !== undefined) {
            this.fuse = new Fuse(this.props.data, {
                keys: this.props.keys,
                threshold: .25
            })
        }
    }

    render() {
        return (
            <div className={"search"}>
                <i className="fas fa-search"/>
                <input type={"text"} placeholder={"Search"} onInput={this.handleInput}/>
            </div>
        );
    }

    handleInput(event) {
        const value = event.target.value;

        if(value.length === 0 || this.fuse === null) {
            this.props.onResult({
                useResults: false
            })
            return
        }

        this.props.onResult({
            useResults: true,
            results: this.fuse.search(value).map(x => x.item)
        })
    }
}

export default Search;

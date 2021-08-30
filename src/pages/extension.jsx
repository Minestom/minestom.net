import React, {Component} from 'react';
import GeneralHeader from "../components/GeneralHeader";
import {Helmet} from "react-helmet";
import Navbar from "../components/Navbar";
import FileEntry from "../components/FileEntry";
import './two-col-page.scss'
import {Warn} from "../components/Callout";
import './extension.scss'
import {MDXRenderer} from "gatsby-plugin-mdx";

class Extension extends Component {
    constructor(props) {
        super(props);

        if (typeof window !== "undefined") {
            let id = new URLSearchParams(window.location.search).get("id");
            if (id === null) {
                window.location.href = "/extensions"
                return
            }
            this.state = {}
            let split = id.split('/');
            fetch("https://minestom.net/api/extension?id=" + id).then(response => response.json())
                .then(result => this.setState({
                    ...result,
                    name: split[1],
                    owner: split[0],
                    url: "https://github.com/" + id,
                    id: id
                }))
        }
    }

    render() {
        return (
            <div>
                <GeneralHeader/>
                <Helmet>
                    <title>Loading extension data... | Minestom</title>
                </Helmet>
                <div>
                    <Navbar/>
                    <div className="page-container">
                        <div>
                            {this.state.name === undefined ? (<p>Loading...</p>) : (
                                <div style={{overflow: "auto"}}>
                                    <Helmet>
                                        <title>{this.state.name} | Minestom</title>
                                    </Helmet>
                                    <h1>{this.state.name}</h1>
                                    <p>{this.state.description}</p>
                                    <table>
                                        <tr>
                                            <th colSpan={2}>Links</th>
                                        </tr>
                                        <tr>
                                            <td>Owner</td>
                                            <td><a
                                                href={"https://github.com/" + this.state.owner}>{this.state.owner}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Repository</td>
                                            <td><a href={this.state.url}>{this.state.id}</a></td>
                                        </tr>
                                        <tr>
                                            <th colSpan={2}>Statistics</th>
                                        </tr>
                                        <tr>
                                            <td>Stars</td>
                                            <td>{this.state.stargazerCount}</td>
                                        </tr>
                                        <tr>
                                            <td>Forks</td>
                                            <td>{this.state.forkCount}</td>
                                        </tr>
                                        <tr>
                                            <td>Created at</td>
                                            <td>{new Date(this.state.createdAt).toUTCString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Last push</td>
                                            <td>{new Date(this.state.pushedAt).toUTCString()}</td>
                                        </tr>
                                        <tr>
                                            <th colSpan={2}>Release</th>
                                        </tr>
                                        {
                                            this.state.release.assets === undefined ?
                                                (<tr>
                                                    <td colSpan={2}>
                                                        <Warn text={"This extension has no releases"}/>
                                                    </td>
                                                </tr>)
                                                :
                                                (<tr>
                                                    <td colSpan={2}>
                                                        <table className={"sub-table"}>
                                                            <tr>
                                                                <td>Version</td>
                                                                <td>{this.state.release.tag_name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Created at</td>
                                                                <td>{this.state.release.created_at}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Files</td>
                                                                <td>{this.state.release.assets.map(asset => (<FileEntry {...asset} />))}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>)
                                        }
                                    </table>
                                </div>
                            )}
                        </div>
                        <div id={"readme"}>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Extension;
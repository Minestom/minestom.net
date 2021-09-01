import React, {Component} from 'react';
import GeneralHeader from "../components/GeneralHeader";
import {Helmet} from "react-helmet";
import Navbar from "../components/Navbar";
import FileEntry from "../components/FileEntry";
import './two-col-page.scss'
import {Error, Warn} from "../components/Callout";
import './extension.scss'
import ReactDOM from "react-dom";
import marked from "marked";

const README = "/README.md"

class Extension extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        if (typeof window !== "undefined") {
            let id = new URLSearchParams(window.location.search).get("id");
            if (id === null) {
                window.location.href = "/extensions"
                return
            }
            this.readme = React.createRef()
            let split = id.split('/');
            fetch("https://minestom.net/api/extension?id=" + id).then(response => response.json())
                .then(result => {
                    this.setState({
                        ...result,
                        name: split[1],
                        owner: split[0],
                        url: "https://github.com/" + id,
                        id: id
                    })
                    const BASE_URL = "https://raw.githubusercontent.com/" + id + "/" + this.state.defaultBranch
                    const useResult = (result) => {
                        if (!result.ok) throw new Error("Not OK")

                        result.text().then(rawMd => {
                            const html = marked(rawMd)
                            const span = document.createElement("span")
                            span.style.overflow = "auto"
                            span.innerHTML = html
                            const images = span.getElementsByTagName("img");
                            for (let i = 0; i < images.length; i++) {
                                let img = images[i]
                                let src = img.getAttribute("src")
                                if (!src.startsWith("http://") && !src.startsWith("https://")) {
                                    img.src = BASE_URL + (src.startsWith("/") ? "" : "/") + src
                                }
                            }
                            const readmeContainer = document.getElementById("readme")
                            readmeContainer.innerHTML = ""
                            readmeContainer.appendChild(span)
                        })
                    }
                    // Find readme.md
                    fetch(BASE_URL + README)
                        .then(useResult)
                        .catch(err =>
                            fetch(BASE_URL + "/docs" + README)
                                .then(useResult)
                                .catch(err1 => fetch(BASE_URL + "/.github" + README)
                                    .then(useResult)
                                    .catch(err2 => {
                                        // No readme
                                        ReactDOM.render(<Error text={"This extension doesn't have a README.md or we couldn't access it."} />, this.readme.current)
                                    })))
                })
        }
    }

    render() {
        return (
            <div>
                <GeneralHeader/>
                <Helmet>
                    <title>Loading extension data... | Minestom</title>
                </Helmet>
                <div style={{display: "flex", flexFlow: "column", height: "100vh"}}>
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
                        <div ref={this.readme} id={"readme"}>
                            Loading readme...
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Extension;
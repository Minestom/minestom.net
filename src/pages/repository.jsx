import React, {Component} from 'react';
import GeneralHeader from "../components/GeneralHeader";
import {Helmet} from "react-helmet";
import FileEntry from "../components/FileEntry";
import {Error, Warn} from "../components/Callout";
import './repository.scss'
import ReactDOM from "react-dom";
import marked from "marked";
import Loading from "../components/Loading";
import * as timeago from "timeago.js";
import TwoColPage from "../components/TwoColPage";
import hljs from "highlight.js";

const README = "/README.md"

class Repository extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        if (typeof window !== "undefined") {
            let id = new URLSearchParams(window.location.search).get("id");
            if (id === null) {
                window.location.href = "/404"
                return
            }
            this.readme = React.createRef()
            let split = id.split('/');
            fetch("https://minestom.net/api/v2/repository?id=" + id).then(response => response.json())
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
                            hljs.highlightAll();
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
                    <title>Loading repository data... | Minestom</title>
                </Helmet>
                <TwoColPage>
                    <div>
                        {this.state.name === undefined ? (<Loading text={"details"} />) : (
                            <div style={{overflow: "auto"}}>
                                <Helmet>
                                    <title>{this.state.name} | Minestom</title>
                                    <link rel="stylesheet"
                                          href="https://cdn.jsdelivr.net/npm/highlightjs-themes@1.0.0/androidstudio.css" />
                                </Helmet>
                                <h1>{this.state.name}</h1>
                                <p>{this.state.description}</p>
                                <table>
                                    <tr>
                                        <th colSpan={2}>Links</th>
                                    </tr>
                                    <tr>
                                        <td>Owner</td>
                                        <td>
                                            <a href={"https://github.com/" + this.state.owner}>
                                                {this.state.owner}
                                                <i className="fas fa-external-link-alt"/>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Repository</td>
                                        <td>
                                            <a href={this.state.url}>
                                                {this.state.id}
                                                <i className="fas fa-external-link-alt"/>
                                            </a>
                                        </td>
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
                                        <td>Created on</td>
                                        <td>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short', hour12: false, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }).format(new Date(this.state.createdAt))} (<time dateTime={this.state.createdAt} />)</td>
                                    </tr>
                                    <tr>
                                        <td>Last push</td>
                                        <td><time dateTime={this.state.pushedAt} /></td>
                                    </tr>
                                    <tr>
                                        <th colSpan={2}>Release</th>
                                    </tr>
                                    {
                                        this.state.release.assets === undefined ?
                                            (<tr>
                                                <td colSpan={2}>
                                                    <Warn text={"This repository has no releases"}/>
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
                                                            <td>Created</td>
                                                            <td><time dateTime={this.state.release.created_at} /></td>
                                                        </tr>
                                                        {this.state.release.assets.map(asset => (<tr key={asset.name}><td colSpan={2}><FileEntry {...asset} /></td></tr>))}
                                                    </table>
                                                </td>
                                            </tr>)
                                    }
                                </table>
                            </div>
                        )}
                    </div>
                    <div ref={this.readme} id={"readme"}>
                        <Loading text={"README.md"} />
                    </div>
                </TwoColPage>
            </div>
        );
    }

    componentDidUpdate(props, state, snapshot) {
        if (typeof window !== "undefined") {
            timeago.render(document.querySelectorAll("time"))
        }
    }
}

export default Repository;

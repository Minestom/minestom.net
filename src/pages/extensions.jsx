import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import './general.scss'
import GeneralHeader from '../components/GeneralHeader'
import { Helmet } from 'react-helmet'
import RepositoryEntry from "../components/RepositoryEntry";
import './two-col-page.scss'
import Loading from "../components/Loading";

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        if (typeof fetch !== "undefined") {
            fetch("https://minestom.net/api/extensions").then(response => response.json())
                .then(result => this.setState({
                    extensions: result.results
                }))
        }
    }

    render() {
        return (
            <div>
                <GeneralHeader />
                <Helmet>
                    <title>Extensions | Minestom</title>
                    <meta name="description" content="Open source extensions for Minestom" />
                    <link rel="canonical" href="https://minestom.net/extensions" />
                </Helmet>
                <div style={{display: "flex", flexFlow: "column", height: "100vh"}}>
                    <Navbar />
                    <div className="page-container">
                        <div>
                            <h1 className="page-title">Extensions</h1>
                            <h2>How can I submit my extension?</h2>
                            <p>You just need to add the <code>minestom-extension</code> topic to your repository on GitHub</p>
                        </div>
                        <div>
                            <ul style={{overflow: "auto"}}>
                                {this.state.extensions === undefined ?
                                    (<Loading text={"extension list"} />)
                                    :
                                    (this.state.extensions.map(extension => (<RepositoryEntry {... extension} />)))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

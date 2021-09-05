import React, { Component } from 'react'
import './general.scss'
import GeneralHeader from '../components/GeneralHeader'
import { Helmet } from 'react-helmet'
import RepositoryEntry from "../components/RepositoryEntry";
import Loading from "../components/Loading";
import TwoColPage from "../components/TwoColPage";
import './extensions.scss'
import Search from "../components/Search";

export default class index extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this)
        this.state = {
            useResults: false
        }

        const loadExtensionsPage = (end) => {
            let url = "https://minestom.net/api/extensions";
            if (end !== null) {
                url += `?end=${end}`
            }
            fetch(url)
                .then(response => response.json())
                .then(result => {
                    if (this.state.extensions === undefined) {
                        this.state.extensions = []
                    }
                    const extensions = [...this.state.extensions, ...result.results];
                    this.setState({
                        extensions: extensions,
                        displayData: this.state.useResults ? this.state.displayData : extensions
                    })

                    if (result.pageInfo.hasNextPage) {
                        loadExtensionsPage(result.pageInfo.endCursor)
                    }
                })
        }

        if (typeof window !== "undefined") {
            loadExtensionsPage(null)
        }
    }

    render() {
        return (
            <div className={"extensions-page"}>
                <GeneralHeader />
                <Helmet>
                    <title>Extensions | Minestom</title>
                    <meta name="description" content="Open source extensions for Minestom" />
                    <link rel="canonical" href="https://minestom.net/extensions" />
                </Helmet>
                <TwoColPage>
                    <div>
                        <div>
                            <h1 className="page-title">Extensions</h1>
                            <p>Extensions are a great way to share common functionalities across your projects or even share it with others.</p>
                            <p>Here you can find public extensions, official ones are highlighted with orange; work-in-progress extensions are opaque.</p>
                            <em>Note that the WIP state is determined automatically based on releases, if your extension is production ready be sure to create a release for it.</em>
                            <h2>How can I submit my extension?</h2>
                            <p>You just need to add the <code>minestom-extension</code> topic to your repository on GitHub.</p>
                            <em>Please not that after adding the topic it may take up to an hour for the extension to show up in this list.</em>
                        </div>
                    </div>
                    <div>
                        <h2 className={"only-small"}>Extension list</h2>
                        <ul className={"extension-list"}>
                            <Search data={this.state.extensions} keys={["owner", "name", "description"]} onResult={this.handleSearch} />
                            {this.state.extensions === undefined ?
                                (<Loading text={"extension list"} />)
                                :
                                (this.state.displayData.map(extension => (<RepositoryEntry {... extension} page={"extension"}  key={`${extension.owner}/${extension.name}`} />)))}
                        </ul>
                    </div>
                </TwoColPage>
            </div>
        )
    }

    handleSearch(result) {
        const newState = Object.assign({}, this.state)
        newState.useResults = result.useResults
        if (newState.useResults) {
            newState.displayData = result.results
        } else {
            newState.displayData = newState.extensions
        }
        this.setState(newState)
    }
}

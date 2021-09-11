import React, {Component} from 'react';
import GeneralHeader from "./GeneralHeader";
import {Helmet} from "react-helmet";
import TwoColPage from "./TwoColPage";
import Search from "./Search";
import Loading from "./Loading";
import RepositoryEntry from "./RepositoryEntry";
import {capitalizeFirstLetter} from "./common";
import './RepositoryListPage.scss'

class RepositoryListPage extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this)
        this.state = {
            useResults: false
        }

        const loadRepositoriesPage = (end) => {
            let url = this.props.api;
            if (end !== null) {
                url += `?end=${end}`
            }
            fetch(url)
                .then(response => response.json())
                .then(result => {
                    if (this.state.repositories === undefined) {
                        this.state.repositories = []
                    }
                    const repositories = [...this.state.repositories, ...result.results];
                    this.setState({
                        repositories: repositories,
                        displayData: this.state.useResults ? this.state.displayData : repositories
                    })

                    if (result.pageInfo.hasNextPage) {
                        loadRepositoriesPage(result.pageInfo.endCursor)
                    }
                })
        }

        if (typeof window !== "undefined") {
            loadRepositoriesPage(null)
        }
    }

    render() {
        return (
            <div className={"repositories-page"}>
                <GeneralHeader />
                <Helmet>
                    <title>{capitalizeFirstLetter(this.props.plural)} | Minestom</title>
                    <meta name="description" content={`Open source ${this.props.plural} for Minestom`} />
                    <link rel="canonical" href={`https://minestom.net/${this.props.plural}`} />
                </Helmet>
                <TwoColPage>
                    <div>
                        <div>
                            <h1 className="page-title">{capitalizeFirstLetter(this.props.plural)}</h1>
                            {this.props.children}
                            <p>Here you can find public {this.props.plural}, official ones are highlighted with orange; work-in-progress {this.props.plural} are opaque.</p>
                            <em>Note that the WIP state is determined automatically based on releases, if your {this.props.singular} is production ready be sure to create a release for it.</em>
                            <h2>How can I submit my {this.props.singular}?</h2>
                            <p>You just need to add the <code>minestom-{this.props.singular}</code> topic to your repository on GitHub.</p>
                            <em>Please note that after adding the topic it may take up to an hour for the {this.props.singular} to show up in this list.</em>
                        </div>
                    </div>
                    <div>
                        <h2 className={"only-small"}>{capitalizeFirstLetter(this.props.singular)} list</h2>
                        <div className={"search-wrapper"}>
                            <Search state={this.state} data={"repositories"} keys={["owner", "name", "description"]} onResult={this.handleSearch} />
                        </div>
                        <ul className={"repository-list"}>
                            {this.state.repositories === undefined ?
                                (<Loading text={`${this.props.singular} list`} />)
                                :
                                (this.state.displayData.map(repository => (<RepositoryEntry {... repository} key={`${repository.owner}/${repository.name}`} />)))}
                        </ul>
                    </div>
                </TwoColPage>
            </div>
        );
    }

    handleSearch(result) {
        const newState = Object.assign({}, this.state)
        newState.useResults = result.useResults
        if (newState.useResults) {
            newState.displayData = result.results
        } else {
            newState.displayData = newState.repositories
        }
        this.setState(newState)
    }
}

export default RepositoryListPage;

import React, { Component } from 'react'
import './general.scss'
import RepositoryListPage from "../components/RepositoryListPage";

export default class index extends Component {
    render() {
        return (
            <RepositoryListPage plural={"implementations"} singular={"implementation"} api={"https://minestom.net/api/v2/implementations"}>
                <p>These projects extend Minestom in order to include more functionalities. Some of the projects can be used as-is but other might require you to further extend it to be usable.</p>
            </RepositoryListPage>
        )
    }
}

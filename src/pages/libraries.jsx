import React, { Component } from 'react'
import './general.scss'
import RepositoryListPage from "../components/RepositoryListPage";

export default class index extends Component {
    render() {
        return (
            <RepositoryListPage plural={"libraries"} singular={"library"} api={"https://minestom.net/api/v2/libraries"}>
                <p>Libraries can be used to share code between multiple projects, the main difference between libraries and extensions is that the latter is a finished product that you just drop into the extensions folder and it's ready to use, while libraries are used to build on top of it.</p>
            </RepositoryListPage>
        )
    }
}

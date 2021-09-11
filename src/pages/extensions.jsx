import React, { Component } from 'react'
import './general.scss'
import RepositoryListPage from "../components/RepositoryListPage";

export default class index extends Component {
    render() {
        return (
            <RepositoryListPage plural={"extensions"} singular={"extension"} api={"https://minestom.net/api/v2/extensions"}>
                <p>Extensions are a great way to share common functionalities across your projects or even share it with others.</p>
            </RepositoryListPage>
        )
    }
}

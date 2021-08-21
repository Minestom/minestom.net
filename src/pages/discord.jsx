import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import GeneralHeader from '../components/GeneralHeader'

export default class discord extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Minestom - Discord</title>
                    <meta name="description" content="Invite to Minestom's Discord server" />
                    <meta http-equiv="refresh" content="0; URL=https://discord.gg/rV24CzG" />
                </Helmet>
                <GeneralHeader />
                <a href="https://discord.gg/rV24CzG">If you don't get redirected, use this link.</a>
            </div>
        )
    }
}

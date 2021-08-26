import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

export default class GeneralHeader extends Component {
    render() {
        return (
            <Helmet htmlAttributes={{lang: "en"}}>
                <meta name="theme-color" content="#2A3030" />
                <link href="static/img/icon_transparent_240.png" rel="icon" />
                <script async src="https://kit.fontawesome.com/7f109a5094.js" crossorigin="anonymous" />
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-BREZVMFMW6" />
                <script async src="/static/js/gtag.js" />
            </Helmet>
        )
    }
}

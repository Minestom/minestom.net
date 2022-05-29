import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import './404.scss'
import GeneralHeader from '../components/GeneralHeader'
import { Helmet } from 'react-helmet'
import image from '../resources/img/floating-land.webp'

export default class index extends Component {

    render() {
        return (
            <div>
                <GeneralHeader />
                <Helmet>
                    <title>404 Page not found | Minestom</title>
                </Helmet>
                <div style={{display: "flex", flexFlow: "column", height: "100vh"}}>
                    <Navbar />
                    <div className={"not-found"}>
                        <div>
                            <img src={image} />
                        </div>
                        <div>
                            <h1>Nothing to see here./h1>
                            <p>The requested page doesn't exist.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import './index.scss'
import './general.scss'
import Sections from '../resources/home-sections.json'
import GenericSection from '../components/GenericSection'
import GeneralHeader from '../components/GeneralHeader'
import { Helmet } from 'react-helmet'

export default class index extends Component {

    render() {
        return (
            <div>
                <GeneralHeader />
                <Helmet>
                    <title>Minestom: Fast and open source Minecraft server</title>
                    <meta name="description" content="A multithreaded, open-source library for developing high-performance Minecraft servers." />
                    <link rel="canonical" href="https://minestom.net/" />
                </Helmet>
                <div style={{display: "flex", flexFlow: "column", height: "100vh"}}>
                    <Navbar />
                    <div style={{overflow: "auto"}}>
                        <div class="header">
                            <span>
                                <h1>Minestom</h1>
                                <h2>A Minecraft server implementation,<br/> open-source and without any code from Mojang.</h2>
                            </span>
                        </div>
                        {Sections.map(section => (<GenericSection {...section} />))}
                    </div>
                </div>
            </div>
        )
    }
}

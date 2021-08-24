import React, { Component } from 'react'
import GeneralHeader from './GeneralHeader'
import Navbar from './Navbar'

export default class ServerLayout extends Component {
    render() {
        return (
            <div>
                <GeneralHeader />
                <Navbar />
                <h3>Test layout</h3>
                {console.log(this)}
            </div>
        )
    }
}

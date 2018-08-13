import React from 'react'
import './header.less'

let Header = React.createClass({
    render(){
        return (
            <div className="components-header row">
                <img src="/static/logo.png" width="40" alt="" className="-col-auto" height="50"/>
                <h1 className="caption">React Music Player</h1>
            </div>
        )
    }
})
export default Header;
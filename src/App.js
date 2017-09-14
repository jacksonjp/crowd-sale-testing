import React, { Component } from 'react'
import { Link } from 'react-router'

// Styles
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">Jack crowdsale</Link>
          <ul className="pure-menu-list navbar-right">
          </ul>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

export default App

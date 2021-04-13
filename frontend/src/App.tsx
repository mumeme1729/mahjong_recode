import React from 'react'
import {
    BrowserRouter as Router, 
    Route,
    Switch,
  } from "react-router-dom";
import Auth from './components/auth/Auth';
import Auth_done from './components/auth/Auth_done';
import Header from './components/home/Header';
import Home from './components/home/Home';


function App(){
    return (
        <div className="App">
            <Router basename = {process.env.PUBLIC_URL}>
                <Header/>
                <Switch>
                    <Route exact path="/" component={Auth}/>
                    <Route path="/create_done" component={Auth_done}/>
                    <Route path="/home" component={Home}/>
                </Switch>
            </Router>
        </div>
    )
}

export default App
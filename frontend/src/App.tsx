import React from 'react'
import {
    BrowserRouter as Router, 
    Route,
    Switch,
  } from "react-router-dom";
import Activate from './components/auth/Activate';
import Auth from './components/auth/Auth';
import Auth_done from './components/auth/Auth_done';
import PasswordConfirm from './components/auth/PasswordConfirm';
import PasswordReset from './components/auth/PasswordReset';
import Game from './components/group/Game';
import GroupHome from './components/group/GroupHome';
import GroupMember from './components/group/GroupMember';
import MatchRecord from './components/group/MatchRecord';
import MemberDetail from './components/group/MemberDetail';
import Contact from './components/home/Contact';
import Disclaimer from './components/home/Disclaimer';
import Footer from './components/home/Footer';
import Header from './components/home/Header';
import Home from './components/home/Home';


function App(){
    return (
        <div className="App">
            <Router basename = {process.env.PUBLIC_URL}>
                <Header/>
                <Switch>
                    <Route path='/activate/:token' component={Activate}/>
                    <Route path='/password/reset' component={PasswordReset}/>
                    <Route path='/password_confirm/:uid/:token'component={PasswordConfirm}/>
                    <Route path="/contact" component={Contact}/>
                    <Route path="/disclaimer" component={Disclaimer}/>
                    <Route exact path="/" component={Auth}/>
                    <Route path="/create_done" component={Auth_done}/>
                    <Route path="/home" component={Home}/>
                    <Route exact path="/group/:id" component={GroupHome}/>
                    <Route exact path="/group/:id/member" component={GroupMember}/>
                    <Route exact path="/group/:id/member/:user_id" component={MemberDetail}/>
                    <Route exact path="/group/:id/matchrecord" component={MatchRecord}/>
                    <Route path="/group/:id/game" component={Game}/>
                </Switch>
                <Footer/>
            </Router>
        </div>
    )
}

export default App
import React, { Component } from 'react';

import './styles/custom.css';
// import Routes from './routes';
// import Header from './components/Header/Header';
import Authentication from './components/Login/Authentication';
// import Footer from './components/Footer/Footer';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from "react-alert-template-basic";
import { Redirect } from 'react-router-dom'
// import MobileHeader from './components/MobileHeader/MobileHeader';
// import {Grid, Row} from 'react-bootstrap';
import '../src/styles/react-confirm-alert.css'

import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'
import 'font-awesome/css/font-awesome.min.css';
library.add(faStroopwafel)

const options = {
  timeout: 5000,
  position: "bottom center"
};

class App extends Component {

  constructor(){
    super();
    this.state={
      appName: "Transparente",
      home: false,
      redirectToLogout: false
    }
  }

  async logout(){
    document.getElementById('logoutBtn').click()
   }
   
  render() {
    if(this.state.redirectToLogout)
      return (<Redirect to={'/login'}/>)

    return (
      <AlertProvider template={AlertTemplate} {...options}>
          {/* {(!this.state.redirectToLogout) ? <Header name={this.state.appName} logout={this.logout.bind(this)}/> : null } */}
              {/* <Routes name={this.state.appName}/> */}
              {/* <Header/> */}
              <Authentication/>
          
         {/* <Footer/> */}
    </AlertProvider>
    );
  }
}

export default App;

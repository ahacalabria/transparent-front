import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import {RequestData} from '../../services/RequestData'

class Logout extends Component {
    constructor(props) {
        super(props)

        this.state = {
        redirectToLogout: false,
        }
    }

    componentDidMount() {
        this.logout()
    }

    async logout(){
      try {
        await RequestData('authenticate/logout', {}, "get")
        sessionStorage.setItem("user",'')
        sessionStorage.setItem("token",'')
        sessionStorage.clear()
        // window.history.push("/")
        this.setState( {redirectToLogout: true} ) 
      } catch (error) {
        console.log('trying to loggout...', error)
      }
        
    }
    

  render() {
    if (this.state.redirectToLogout) 
      return (<Redirect to={'/login'}/>)

    return (
      <div className="row small-up-2 medium-up-3 large-up-4">
      <div className="col-lg-12 text-center">
        <h2>Saindo do sistema...</h2>
      </div>
    </div>
    );
  }
}

export default Logout;
import React, {Component} from 'react';
// import {Redirect} from 'react-router-dom';
// import {PostData} from '../../services/PostData';
// import {GetData} from '../../services/GetData';
import { withAlert } from "react-alert"

import { handleRequest } from '../../services/RequestData';
import OngList from './OngList';

class Ongs extends Component {

  constructor(){
    super();
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     isLoading: false,
     redirectToCadastrar: false
    };

    this.ongs = this.ongs.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async ongs() {
      try {
        await handleRequest('pe_juridica',{}, 'GET', 'allOngs', this)
      } catch (error) {
        console.log(error)
      }
  
   }

   componentDidMount(){
       this.ongs()
   }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {

    //  if (this.state.redirectToReferrer) {
    //   return (<Redirect to={'/home'}/>)
    // }
   
    // if(sessionStorage.getItem('token')){
    //   return (<Redirect to={'/home'}/>)
    // }

    // if(this.state.allOngs)
    //   return (<Redirect to={'/cadastrar'}/>)

     return (
      <div>
          <div className="page-header"><h1>ONGS <small>cadastradas</small></h1></div>
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
       {(this.state.allOngs)? <OngList feedData={this.state.allOngs} view={()=> console.log('')} delete={()=>console.log('')} /> : null}
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default withAlert(Ongs);

import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
import {GetData} from '../../services/GetData';
import { withAlert } from "react-alert"

import './Login.css';

class Login extends Component {

  constructor(){
    super();
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     isLoading: false,
     redirectToCadastrar: false
    };

    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  login() {
    if(this.state.email && this.state.password){
      this.setState( isLoading => {
        return {isLoading: true}
      } )
      PostData('authenticate',this.state,true).then((result) => {
       let responseJson = result;
       if(responseJson.token){         
        sessionStorage.setItem('token',responseJson.token);//JSON.stringify(responseJson)
        GetData('users/me',this.state,true,'GET').then((result2) => {
          console.log(result2)
          sessionStorage.setItem('user',JSON.stringify(result2));//JSON.stringify(responseJson)
          this.setState({redirectToReferrer: true});
          this.setState( isLoading => {
            return {isLoading: false}
          } )
        }).catch(err => {
          console.log(err)
          if(err.length > 0){
            err.forEach(e => {
              this.props.alert.error(e.title+": "+e.message)
            })
          }else{
            this.props.alert.error("Erro no Servidor")
          }
          this.setState( isLoading => {
            return {isLoading: false}
          } )
        })
       }else{
        this.setState( isLoading => {
          return {isLoading: false}
        } )
       }
       
      }).catch(err => {
        console.log(err)
        this.setState( isLoading => {
          return {isLoading: false}
        } )
        if(err.length > 0){
          err.forEach(e => {
            this.props.alert.error(e.title+": "+e.message)
          })
        }else{
          this.props.alert.error("Erro no Servidor")
        }
      })
    }
    
   }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {

     if (this.state.redirectToReferrer) {
      return (<Redirect to={'/home'}/>)
    }
   
    if(sessionStorage.getItem('token')){
      return (<Redirect to={'/home'}/>)
    }

    if(this.state.redirectToCadastrar)
      return (<Redirect to={'/cadastrar'}/>)

     return (
      <div>
      <div className="form-signin shadow-sm">
        <h2 className="form-signin-heading text-center">Acesso Restrito</h2>
        <label className="sr-only">E-mail</label>
        <input type="text" name="email" className="form-control" placeholder="E-mail" onChange={ (e) => this.onChange(e)}/>
        <label className="sr-only">Senha</label>
        <input type="password" className="form-control" name="password"  placeholder="Senha" onChange={ (e) => this.onChange(e)}/>
        <button className="btn btn-lg btn-primary btn-block" disabled={this.state.isLoading} type="button" onClick={(e) => this.login(e)}>{(this.state.isLoading) ? (' CARREGANDO...') : 'Entrar' }</button>
        <button className="btn btn-lg btn-warning dropdown-toggle btn-block" onClick={ () => { this.setState({redirectToCadastrar: true}) }}>Nao Sou Credenciado</button>
      </div>
      </div>
    );
  }
}

export default withAlert(Login);

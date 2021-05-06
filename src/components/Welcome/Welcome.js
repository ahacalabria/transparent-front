import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Welcome.css';

class Welcome extends Component {
  constructor(props){
    super(props)

    this.state = {
      isLogged: false
    }
  }

  componentDidMount(){
    if(!this.state.isLogged && sessionStorage.getItem("token")!==null) this.setState(isLogged => { return {isLogged: true} })
    else if(this.state.isLogged && sessionStorage.getItem("token")===null) this.setState(isLogged => { return {isLogged: false} })
  }
  componentDidUpdate(){
    if(this.state.isLogged && sessionStorage.getItem("token")===null) this.setState(isLogged => { return {isLogged: false} })
  }


  render() {
    const hasFinished = sessionStorage.getItem("hasFinished")

    if( hasFinished==='false' ) return <Redirect to={'/cadastro_ong'} />
    return (
      <div className="row " id="Body">
        <div className="medium-12 columns">
          <h2 id="welcomeText">Bem Vindo(a) ao Sistema Transparente</h2>
          <p><strong>Cadastre e acompanhe sua ONG no programa municipal - Barbalha, Ceará</strong></p>
          <p>Acesse o menu para mais ações ou o menu rápido abaixo</p>
          
          { !this.state.isLogged && <a href="/login" className="btn btn-primary mr-3">Login</a> }
          
          { !this.state.isLogged && <a href="/cadastrar" className="btn btn-success mr-3">Novo Cadastro de Credenciador</a> }
          { !this.state.isLogged && <a href="/cadastrar_colaborador" className="btn btn-default">Novo Cadastro de Operador</a> }
          { (this.state.isLogged && hasFinished!=='false') &&
          <a href="/plano_trabalhos" className="btn btn-lg btn-primary"><span className="fa fa-list"></span> VER PLANOS DE TRABALHO</a>
          }
          <div className="page-header">
            <a href="/convenios" className="btn btn-lg btn-primary"><span className="fa fa-file"></span> VER CONÊNIOS DO MUNICÍPIO</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
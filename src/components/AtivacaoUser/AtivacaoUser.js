import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import './AtivacaoUser.css';
import {RequestData} from '../../services/RequestData'
import { withAlert } from "react-alert"

class AtivacaoUser extends Component {
    constructor(props){
        super(props);    
        
        this.state = {
            code: this.props.match.params.code,
            hasActived: false,
            invalidCode: false,
            redirectHome: false
        }
        this.activeUser = this.activeUser.bind(this)
      }

      componentDidMount(){
        //   console.log(this.state.code)
          const temp = Number.isInteger(parseInt(this.state.code))
        if(temp){
            if(this.activeUser())
                this.setState({redirectHome: true})
        }
      }

      async activeUser(){
          try {
            await RequestData('users/confirm/email/'+(this.state.code), {}, 'get')
            this.setState({hasActived: true,invalidCode: false})
            this.props.alert.success("Seu e-mail foi confirmado com sucesso!")
            return true
          } catch (err) {
            console.log(err)
            this.setState({invalidCode: true})
            if(err[0]!==null){
                if(err.length > 0){
                    err.forEach(e => {
                        this.props.alert.error(e.title+": "+e.message)
                    })
                }else{
                    this.props.alert.error("Erro no Servidor")
                }
                return false
            }
          }
        }

  render() {    
      if(this.state.redirectHome)  return (<Redirect to={{pathname: '/'}} />)

      if( (!this.state.invalidCode) && this.state.hasActived)
        return (<Redirect to={{pathname: '/login'}} />)

    return (
        <div className="row">
            <div className="col-lg-12 col-md-12 text-center">
                <h3>{(this.state.code>0)?'Redirencionando... Aguarde.':'Ative sua conta através do link no seu e-mail.'}</h3>
            </div>
        </div>
    )
  }
}

export default withAlert(AtivacaoUser)
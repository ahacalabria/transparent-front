import React, {Component} from 'react';
import { withAlert } from "react-alert"
import {Redirect} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' 
import { handleRequest } from '../../services/RequestData';
import UserList from './UserList';
import Loader from '../Providers/FormsHandle/Loader';
const config = require('../../config')
class User extends Component {

  constructor(props, context){
    super(props, context)
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     redirectToGrupos: false,
     isLoading: true,
     redirectToCadastrar: false,
     users: []
    };

    this.getUsers = this.getUsers.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.delete = this.delete.bind(this)
    this.edit = this.edit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.goToGrupos = this.goToGrupos.bind(this)
    this.activeUser = this.activeUser.bind(this)
  }

  goToGrupos(id, email, cb){
    // alert(id)
    this.setState({redirectToGrupos: true, selectedUser: id, email_user: email})
  }

  async getUsers() {
      try {
        await handleRequest('users',{}, 'get', 'users', this)
      } catch (error) {
        console.log(error)
        this.props.alert.error('Houve algum erro ao listar os usuários cadastrados!')
      }
   }

   async activeUser(id, status, callback){
    try{
      const resp = await handleRequest('users/habilitar/', {id: id, status: status}, 'POST', null, this)
      if(resp) {
          callback()
          const typeString = (status) ? 'habilitado' : 'desabilitado'
          this.props.alert.success(`Usuário ${typeString} com sucesso!`)
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao atuaizar o usuário!')
    }
   }

   async delete(id, callback){
    try{
      const resp = await handleRequest('user/'+id, {}, 'DELETE', null, this)
      if(resp.resp) {
          await callback()
          this.props.alert.success('Usuário deletado com sucesso!')
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao deletar o usuário!')
    }
   }

   async edit(id, callback){
    try{
      const objeto = await handleRequest('users/'+id, {}, 'GET', null, this)
      if(objeto) {
        this.setState({gotObj: true, objeto: objeto})
      }else{
        this.setState({gotObj: false, obj: null})
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao editar o user!')
    }
   }

   confirmDelete(id, callback){
    confirmAlert({
        title: 'ATENÇÃO',                        
        message: 'Você realmente deseja apagar esse registro?',               
        childrenElement: () => '',       
        confirmLabel: 'Apagar',                          
        cancelLabel: 'Cancelar',                         
        onConfirm: () => this.delete(id, callback),    
        onCancel: () => '',      
      })
   }

   componentDidMount(){
       this.getUsers()
   }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
       if(this.state.gotObj) //return (<UserForm edit={true} objeto={this.state.objeto}/>)
        return (<Redirect to={{ pathname: '/user/form', state: {edit: true, objeto: this.state.objeto}}}/>)
    if(this.state.redirectToGrupos)
        return (<Redirect to={{ pathname: '/user_grupos', state: {user_id: this.state.selectedUser, email_user: this.state.email_user}}}/>)
     return (
      <div>
          <Loader isLoading={this.state.isLoading}/>  
          <div className="page-header"><h1>Lista <small>USUÁRIOS ATIVOS</small><a className="btn btn-success pull-right" href="/user/form"><strong><i className="glyphicon glyphicon-plus"></i> NOVO USUÁRIO</strong></a></h1></div>
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
       <UserList serverUrl={config.server_url} feedData={this.state.users} activeUser={this.activeUser} grupos={this.goToGrupos} view={()=>console.log('')} delete={this.confirmDelete} edit={this.edit} callback={this.getUsers}/>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default withAlert(User);

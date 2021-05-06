import React, {Component} from 'react';
import { withAlert } from "react-alert"
import { Redirect } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' 
import { handleRequest } from '../../services/RequestData';
import SecretariaList from './SecretariaList';
import Loader from '../Providers/FormsHandle/Loader';
const config = require('../../config')
class Secretaria extends Component {

  constructor(props, context){
    super(props, context)
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     redirectToOperacoes: false,
     isLoading: true,
     redirectToCadastrar: false,
     secretarias: []
    };

    this.getSecretarias = this.getSecretarias.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.delete = this.delete.bind(this)
    this.edit = this.edit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.goToOperacoes = this.goToOperacoes.bind(this)
  }

  goToOperacoes(id){
    this.setState({redirectToOperacoes: true, selectedSecretaria: id})
  }

  async getSecretarias() {
      try {
        await handleRequest('secretaria',{}, 'GET', 'secretarias', this)
      } catch (error) {
        console.log(error)
        this.props.alert.error('Houve algum erro ao listar os secretarias cadastrados!')
      }
   }

   async delete(id, callback){
    try{
      const resp = await handleRequest('secretaria/'+id, {}, 'DELETE', null, this)
      if(resp.resp) {
          callback()
          this.props.alert.success('Secretaria deletado com sucesso!')
      }
    }catch(err){
        console.log(err)
        this.setState( {isLoading: false} )
        this.props.alert.error('Houve algum erro ao deletar o secretaria!')
    }
   }

   async edit(id, callback){
    try{
      const objeto = await handleRequest('secretaria/'+id, {}, 'GET', null, this)
      if(objeto) {
        this.setState({gotObj: true, objeto: objeto})
      }else{
        this.setState({gotObj: false, obj: null})
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao editar o secretaria!')
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
       this.getSecretarias()
   }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
       if(this.state.gotObj) //return (<SecretariaForm edit={true} objeto={this.state.objeto}/>)
        return (<Redirect to={{ pathname: '/secretaria/form', state: {edit: true, objeto: this.state.objeto}}}/>)
    if(this.state.redirectToOperacoes)
        return (<Redirect to={{ pathname: '/secretaria_operacao', state: {secretaria_id: this.state.selectedSecretaria}}}/>)
     return (
      <div>
          <Loader isLoading={this.state.isLoading}/>  
          <div className="page-header"><h1>Lista <small>SECRETARIAS</small><a className="btn btn-success pull-right" href="/secretaria/form"><strong><i className="glyphicon glyphicon-plus"></i> NOVA SECRETARIA</strong></a></h1></div>
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
       <SecretariaList serverUrl={config.server_url} feedData={this.state.secretarias} operacoes={this.goToOperacoes} view={() => console.log('')} delete={this.confirmDelete} edit={this.edit} callback={this.getSecretarias}/>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default withAlert(Secretaria);

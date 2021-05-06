import React, {Component} from 'react';
import { withAlert } from "react-alert"
import {Redirect} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' 
import { handleRequest } from '../../services/RequestData';
import ProgramaList from './ProgramaList';
import Loader from '../Providers/FormsHandle/Loader';
const config = require('../../config')
class Programa extends Component {

  constructor(props, context){
    super(props, context)
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     isLoading: true,
     redirectToCadastrar: false,
     programas: []
    };

    this.getProgramas = this.getProgramas.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.delete = this.delete.bind(this)
    this.edit = this.edit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  async getProgramas() {
      try {
        await handleRequest('programa',{}, 'get', 'programas', this)
      } catch (error) {
        console.log(error)
        this.props.alert.error('Houve algum erro ao listar os programas cadastrados!')
      }
  }

  async delete(id, callback){
    try{
      const resp = await handleRequest('programa/'+id, {}, 'DELETE', null, this)
      if(resp.resp) {
          callback()
          this.props.alert.success('Programa deletado com sucesso!')
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao deletar o programa!')
    }
  }

   async edit(id, callback){
    try{
      const objeto = await handleRequest('programa/'+id, {}, 'GET', null, this)
      if(objeto) {
        this.setState({gotObj: true, objeto: objeto})
      }else{
        this.setState({gotObj: false, obj: null})
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao editar o programa!')
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
       this.getProgramas()
   }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
       if( (this.location && this.location.state && this.location.state.gotObj) || this.state.gotObj) //return (<ProgramaForm edit={true} objeto={this.state.objeto}/>)
  return (<Redirect to={{ pathname: '/programa/form', state: {edit: true, objeto: this.state.objeto}}}/>)
     return (
      <div>
          <Loader isLoading={this.state.isLoading}/>  
          <div className="page-header"><h1>Lista <small>PROGRAMAS VIGENTES</small><a className="btn btn-success pull-right" href="/programa/form"><strong><i className="glyphicon glyphicon-plus"></i> NOVO PROGRAMA</strong></a></h1></div>
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
       <ProgramaList serverUrl={config.server_url} feedData={this.state.programas} view={()=>console.log('')} delete={this.confirmDelete} edit={this.edit} callback={this.getProgramas}/>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default withAlert(Programa);

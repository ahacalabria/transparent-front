import React, {Component} from 'react';
import { withAlert } from "react-alert"
import {Redirect} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' 
import { handleRequest } from '../../services/RequestData';
import ParecerList from './ParecerList';
import Loader from '../Providers/FormsHandle/Loader';
import BackHandle from '../Providers/BackHandle';
const config = require('../../config')
class Parecer extends Component {

  constructor(props, context){
    super(props, context)
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     isLoading: true,
     redirectToCadastrar: false,
     redirectToNewParecer: false,
     pareceres: [],
     nameOng: props.location.state && props.location.state.nameOng,
     descPlanoTrabalho: props.location.state && props.location.state.descPlanoTrabalho,
     idPlanoTrabalho: props.location.state && props.location.state.idPlanoTrabalho,
     ongId: props.location.state && props.location.state.ongId,
    };

    this.getPareceres = this.getPareceres.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.delete = this.delete.bind(this)
    this.edit = this.edit.bind(this)
    this.view = this.view.bind(this)
    this.onChange = this.onChange.bind(this)
    this.newParecer = this.newParecer.bind(this)
  }

  async getPareceres(id = this.state.idPlanoTrabalho) {
      try {
        await handleRequest('parecer/plano_trabalho/'+id,{}, 'GET', 'pareceres', this)
      } catch (error) {
        console.log(error)
        this.props.alert.error('Houve algum erro ao listar os pareceres cadastrados!')
      }
   }

   async delete(id, callback){
    try{
      const resp = await handleRequest('parecer/'+id, {}, 'DELETE', null, this)
      if(resp.resp) {
          callback()
          this.props.alert.success('Parecer deletado com sucesso!')
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao deletar o parecer!')
    }
   }

   async edit(id, callback){
    try{
      const objeto = await handleRequest('parecer/'+id, {}, 'GET', null, this)
      if(objeto) {
        this.setState({gotObj: true, objeto: objeto})
      }else{
        this.setState({gotObj: false, objeto: null})
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao editar o parecer!')
    }
   }

   async view(id, callback){
    try{
      const objeto = await handleRequest('parecer/'+id, {}, 'GET', null, this)
      console.log({objeto})
      if(objeto) {
        this.setState({viewObj: true, objeto: objeto})
      }else{
        this.setState({viewObj: false, objeto: null})
      }
    }catch(err){
        console.log({err})
        this.props.alert.error('Houve algum erro ao editar o parecer!')
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
   newParecer(){
    this.setState({redirectToNewParecer:true})
   }

   componentDidMount(){
       this.getPareceres()
   }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
       if( (this.location && this.location.state && this.location.state.gotObj) || this.state.viewObj){ //return (<ParecerForm edit={true} objeto={this.state.objeto}/>)
          return (<Redirect to={{ pathname: '/parecer/form', state: {view: true, objeto: this.state.objeto, idPlanoTrabalho: this.state.idPlanoTrabalho, descPlanoTrabalho: this.state.descPlanoTrabalho, nameOng: this.state.nameOng, ongId: this.state.ongId}}}/>)
      }

        if( this.state.redirectToNewParecer )
          return (<Redirect to={{ pathname: '/parecer/form', state: {idPlanoTrabalho: this.state.idPlanoTrabalho, descPlanoTrabalho: this.state.descPlanoTrabalho, nameOng: this.state.nameOng, ongId: this.state.ongId, isGestor: (this.props.location.state && this.props.location.state.isGestor)}}}/>)
     return (
      <div>
          <Loader isLoading={this.state.isLoading}/>  
          <div className="page-header">
            <h1>Lista <small>PARECERES EMITIDOS</small></h1>
          </div>
          <BackHandle prevPathname={'/plano_trabalhos'} prevState={this.state} newButton={(this.props.canCreate && <button className="btn btn-success pull-right" onClick={() => this.newParecer()}><strong><i className="glyphicon glyphicon-plus"></i> NOVO PARECER</strong></button>)}/>
          
        
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
       <ParecerList serverUrl={config.server_url} feedData={this.state.pareceres} view={this.view} delete={this.confirmDelete} edit={this.edit} callback={this.getPareceres}/>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default withAlert(Parecer);

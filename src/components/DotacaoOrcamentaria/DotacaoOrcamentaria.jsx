import React, {Component} from 'react';
import { withAlert } from "react-alert"
import { Redirect } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' 
import { handleRequest } from '../../services/RequestData';
import DotacaoOrcamentariaList from './DotacaoOrcamentariaList';
import Loader from '../Providers/FormsHandle/Loader';
const config = require('../../config')
class DotacaoOrcamentaria extends Component {

  constructor(props, context){
    super(props, context)
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     redirectToOperacoes: false,
     isLoading: true,
     redirectToCadastrar: false,
     dotacaoOrcamentarias: []
    };

    this.getDotacaoOrcamentarias = this.getDotacaoOrcamentarias.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.delete = this.delete.bind(this)
    this.edit = this.edit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.goToOperacoes = this.goToOperacoes.bind(this)
  }

  goToOperacoes(id){
    this.setState({redirectToOperacoes: true, selectedDotacaoOrcamentaria: id})
  }

  async getDotacaoOrcamentarias() {
      try {
        await handleRequest('dotacao_orcamentaria',{}, 'GET', 'dotacaoOrcamentarias', this)
      } catch (error) {
        console.log(error)
        this.props.alert.error('Houve algum erro ao listar as dotações orcamentarias cadastradas!')
      }
   }

   async delete(id, callback){
    try{
      const resp = await handleRequest('dotacao_orcamentaria/'+id, {}, 'DELETE', null, this)
      console.log({resp})
      if(resp) {
          callback()
          this.props.alert.success('Dotacao orcamentária deletada com sucesso!')
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao deletar a dotação orcamentária!')
    }
    this.setState( {isLoading: false} )
   }

   async edit(id, callback){
    try{
      const objeto = await handleRequest('dotacao_orcamentaria/'+id, {}, 'GET', null, this)
      if(objeto) {
        this.setState({gotObj: true, objeto: objeto})
      }else{
        this.setState({gotObj: false, obj: null})
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao editar a dotação orcamentária!')
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
       this.getDotacaoOrcamentarias()
   }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
       if(this.state.gotObj) //return (<DotacaoOrcamentariaForm edit={true} objeto={this.state.objeto}/>)
        return (<Redirect to={{ pathname: '/dotacao_orcamentaria/form', state: {edit: true, objeto: this.state.objeto}}}/>)
    // if(this.state.redirectToOperacoes)
        // return (<Redirect to={{ pathname: '/dotacao_orcamentaria_operacao', state: {dotacaoOrcamentaria_id: this.state.selectedDotacaoOrcamentaria}}}/>)
     return (
      <div>
          <Loader isLoading={this.state.isLoading}/>  
          <div className="page-header"><h1>Lista <small>DOTAÇÕES ORÇAMENTÁRIAS ATIVAS</small><a className="btn btn-success pull-right" href="/dotacao_orcamentaria/form"><strong><i className="glyphicon glyphicon-plus"></i> NOVA DOTAÇÃO</strong></a></h1></div>
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
       <DotacaoOrcamentariaList serverUrl={config.server_url} feedData={this.state.dotacaoOrcamentarias} operacoes={this.goToOperacoes} view={() => console.log('')} delete={this.confirmDelete} edit={this.edit} callback={this.getDotacaoOrcamentarias}/>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default withAlert(DotacaoOrcamentaria);

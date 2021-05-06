import React, {Component} from 'react';
import { withAlert } from "react-alert"
import { Redirect } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' 
import { handleRequest } from '../../services/RequestData';
import PrestacaoContaList from './PrestacaoContaList';
import Loader from '../Providers/FormsHandle/Loader';
import BackHandle from '../Providers/BackHandle';
const config = require('../../config')
class PrestacaoConta extends Component {

  constructor(props, context){
    super(props, context)
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     redirectToOperacoes: false,
     isLoading: true,
     redirectToCadastrar: false,
     goToForm: false,
     prestacoes: [],
     convenio_id: this.props.location.state && this.props.location.state.convenio_id,
     plano_trabalho_id: this.props.location.state && this.props.location.state.plano_trabalho_id,
     projeto_juridica_id: null
    };

    this.getPrestacoes = this.getPrestacoes.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.delete = this.delete.bind(this)
    this.edit = this.edit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.goToOperacoes = this.goToOperacoes.bind(this)
    
  }

  goToOperacoes(id){
    this.setState({redirectToOperacoes: true, selectedGrupo: id})
  }

  async getPlanoTrabalho() {
    try {
      const plano_trabalho = await handleRequest('plano_trabalho/'+this.state.plano_trabalho_id,{}, 'GET', null, this)
      console.log({plano_trabalho})
      const metasTemp = [].concat(plano_trabalho.Cronograma.Meta)
      console.log({metasTemp})
      this.setState({projeto_juridica_id: plano_trabalho.Projeto_juridica.id, plano_trabalho_nome: plano_trabalho.Projeto_juridica.Projeto.nome, metas: metasTemp})
    } catch (error) {
      console.log(error)
      this.props.alert.error('Houve algum erro ao listar os prestacoes cadastrados!')
    }
 }
 async getConvenio() {
  try {
    const convenio = await handleRequest('convenio/'+this.state.convenio_id,{}, 'GET', null, this)
    console.log({convenio})
    if(convenio){
      this.setState({numero_convenio: convenio.numero_convenio, pagamentos: convenio.Pagamentos})
    }
  } catch (error) {
    console.log(error)
    this.props.alert.error('Houve algum erro ao listar os prestacoes cadastrados!')
  }
}

  async getPrestacoes() {
      try {
        await handleRequest('prestacao_conta',{}, 'GET', 'prestacoes', this)
      } catch (error) {
        console.log(error)
        this.props.alert.error('Houve algum erro ao listar os prestacoes cadastrados!')
      }
   }

   async delete(id, callback){
    try{
      const resp = await handleRequest('grupo/'+id, {}, 'DELETE', null, this)
      if(resp.resp) {
          callback()
          this.props.alert.success('Grupo deletado com sucesso!')
      }
    }catch(err){
        console.log(err)
        this.setState( {isLoading: false} )
        this.props.alert.error('Houve algum erro ao deletar o grupo!')
    }
   }

   async edit(id, callback){
    try{
      const objeto = await handleRequest('grupo/'+id, {}, 'GET', null, this)
      if(objeto) {
        this.setState({gotObj: true, objeto: objeto})
      }else{
        this.setState({gotObj: false, obj: null})
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao editar o grupo!')
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
     this.getPlanoTrabalho()
     this.getConvenio()
      //  this.getPrestacoes()
   }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
       if(this.state.gotObj) //return (<GrupoForm edit={true} objeto={this.state.objeto}/>)
        return (<Redirect to={{ pathname: '/prestacaodecontas/form', state: {edit: true, objeto: this.state.objeto}}}/>)
    if(this.state.redirectToOperacoes)
        return (<Redirect to={{ pathname: '/prestacaodecontas_operacao', state: {prestacaodecontas_id: this.state.selectedGrupo}}}/>)
    if(this.state.goToForm)
      return (<Redirect to={{ pathname: '/prestacaodecontas/form', state: {dados: this.state}}}/>)
     return (
      <div>
          <Loader isLoading={this.state.isLoading}/>  
          <div className="page-header">
          <h1>Lista <small>PRESTAÇÕES DE CONTAS</small></h1>
          <h2>
           <small>Convênio: n° {this.state.numero_convenio}</small> - <small>Plano de trabalho: {this.state.plano_trabalho_nome}</small>
          </h2>
          </div>
          <BackHandle prevPathname={'/convenios'} prevState={this.state} 
                    callback={null} newButton={(<button className="btn btn-success pull-right" onClick={()=>this.setState({goToForm:true})}><strong><i className="glyphicon glyphicon-plus"></i> NOVA PRESTAÇÃO</strong></button>)}/>
                    
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
       <PrestacaoContaList serverUrl={config.server_url} feedData={this.state.prestacoes} operacoes={this.goToOperacoes} view={() => console.log('')} delete={this.confirmDelete} edit={this.edit} callback={this.getPrestacoes}/>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default withAlert(PrestacaoConta);

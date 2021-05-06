import React, {Component} from 'react';
import { withAlert } from "react-alert"
import { Redirect } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' 
import { handleRequest } from '../../services/RequestData';
import PagamentoList from './PagamentoList';
import Loader from '../Providers/FormsHandle/Loader';
import BackHandle from '../Providers/BackHandle';
const config = require('../../config')
class Pagamento extends Component {

  constructor(props, context){
    super(props, context)
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     redirectToPrestacao: false,
     isLoading: true,
     redirectToCadastrar: false,
     pagamentos: [],
     convenio_id: this.props.match.params.convenio_id || null
    };

    this.getPagamentos = this.getPagamentos.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.delete = this.delete.bind(this)
    this.edit = this.edit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.goToPrestacao = this.goToPrestacao.bind(this)
  }

  goToPrestacao(convenio_id,plano_trabalho_id){
    this.setState({redirectToPrestacao: true, convenio_id: convenio_id, plano_trabalho_id: plano_trabalho_id})
  }

  async getPagamentos() {
      try {
        if(this.state.convenio_id!==null)
          await handleRequest('pagamento/convenio/'+this.state.convenio_id,{}, 'GET', 'pagamentos', this)
        else
          await handleRequest('pagamento',{}, 'GET', 'pagamentos', this)
      } catch (error) {
        console.log(error)
        this.props.alert.error('Houve algum erro ao listar os pagamentos cadastrados!')
      }
   }

   async delete(id, callback){
    try{
      const resp = await handleRequest('pagamento/'+id, {}, 'DELETE', null, this)
      if(resp) {
          callback()
          this.props.alert.success('Pagamento deletado com sucesso!')
      }
    }catch(err){
        console.log(err)
        this.setState( {isLoading: false} )
        this.props.alert.error('Houve algum erro ao deletar o pagamento!')
    }
   }

   async edit(id, callback){
    try{
      const objeto = await handleRequest('pagamento/'+id, {}, 'GET', null, this)
      if(objeto) {
        this.setState({gotObj: true, objeto: objeto})
      }else{
        this.setState({gotObj: false, obj: null})
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao editar o pagamento!')
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
       this.getPagamentos()
   }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
       if(this.state.gotObj) //return (<PagamentoForm edit={true} objeto={this.state.objeto}/>)
        return (<Redirect to={{ pathname: '/pagamento/form', state: {edit: true, objeto: this.state.objeto}}}/>)
    if(this.state.redirectToPrestacao)
        return (<Redirect to={{ pathname: '/prestacaodecontas', state: {plano_trabalho_id: this.state.plano_trabalho_id, convenio_id: this.state.convenio_id}}}/>)
     return (
      <div>
          <Loader isLoading={this.state.isLoading}/>  
          <div className="page-header"><h1>Lista <small>PAGAMENTOS</small></h1>
          </div>
          <BackHandle prevPathname={'/convenios'} prevState={this.state} newButton={<a className="btn btn-success pull-right" href="/pagamento/form"><strong><i className="glyphicon glyphicon-plus"></i> NOVO PAGAMENTO</strong></a>}
                    callback={null}
                    />
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
       <PagamentoList serverUrl={config.server_url} feedData={this.state.pagamentos} goToPrestacao={this.goToPrestacao} view={() => console.log('')} delete={this.confirmDelete} edit={this.edit} callback={this.getPagamentos}/>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default withAlert(Pagamento);

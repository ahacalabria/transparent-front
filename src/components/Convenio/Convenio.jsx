import React, {Component} from 'react';
import { withAlert } from "react-alert"
import { Redirect } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' 
import { handleRequest } from '../../services/RequestData';
import ConvenioList from './ConvenioList';
import Loader from '../Providers/FormsHandle/Loader';
import {Button, Modal} from 'react-bootstrap'
import CurrencyFormat from 'react-currency-format'
import Moment from 'react-moment'
import BackHandle from '../Providers/BackHandle';
const config = require('../../config')
class Convenio extends Component {

  constructor(props, context){
    super(props, context)
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     redirectToPagamentos: false,
     isLoading: true,
     redirectToCadastrar: false,
     redirectToPrestacoes: false,
     convenios: [],
     show: false,
    };

    this.getConvenios = this.getConvenios.bind(this)
    this.getConvenio = this.getConvenio.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.delete = this.delete.bind(this)
    this.edit = this.edit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.goToPagamentos = this.goToPagamentos.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.prestacoes = this.prestacoes.bind(this)
  }
  handleClose() {
    this.setState({ show: false })
  }
  goToPagamentos(id){
    this.setState({redirectToPagamentos: true, selectedConvenio: id})
  }

  isUserLogged(){
    return sessionStorage.getItem("token")!==undefined && sessionStorage.getItem("token")!==null
  }
  async getConvenio(id) {
    try {
      await handleRequest('convenio/'+id,{}, 'GET', 'convenioModal', this)
      console.log(this.state.convenioModal)
      this.setState({show: true})
    } catch (error) {
      console.log(error)
      this.setState({isLoading: false})
      this.props.alert.error('Houve algum erro ao listar os convĂȘnios cadastrados!')
    }
 }

  async getConvenios() {
      try {
        await handleRequest('convenio',{}, 'GET', 'convenios', this)
      } catch (error) {
        console.log(error)
        this.setState({isLoading: false})
        this.props.alert.error('Houve algum erro ao listar os convĂȘnios cadastrados!')
      }
   }
   async prestacoes(convenio_id, plano_trabalho_id){
    console.log(convenio_id)
    console.log(plano_trabalho_id)
    this.setState({redirectToPrestacoes: true, convenio_id: convenio_id, plano_trabalho_id: plano_trabalho_id})
   }
   async delete(id, callback){
    try{
      const resp = await handleRequest('convenio/'+id, {}, 'DELETE', null, this)
      if(resp) {
          callback()
          this.props.alert.success('ConvĂȘnio deletado com sucesso!')
      }
    }catch(err){
        console.log(err)
        this.setState( {isLoading: false} )
        this.props.alert.error('Houve algum erro ao deletar o convĂȘnio!')
    }
   }

   async edit(id, callback){
    try{
      const objeto = await handleRequest('convenio/'+id, {}, 'GET', null, this)
      if(objeto) {
        this.setState({gotObj: true, objeto: objeto})
      }else{
        this.setState({gotObj: false, obj: null})
      }
    }catch(err){
        console.log(err)
        this.props.alert.error('Houve algum erro ao editar o convĂȘnio!')
    }
   }

   confirmDelete(id, callback){
    confirmAlert({
        title: 'ATENĂĂO',                        
        message: 'VocĂȘ realmente deseja apagar esse registro?',               
        childrenElement: () => '',       
        confirmLabel: 'Apagar',                          
        cancelLabel: 'Cancelar',                         
        onConfirm: () => this.delete(id, callback),    
        onCancel: () => '',      
      })
   }

   componentDidMount(){
       this.getConvenios()
   }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
       if(this.state.gotObj) //return (<ConvenioForm edit={true} objeto={this.state.objeto}/>)
        return (<Redirect to={{ pathname: '/convenio/form', state: {edit: true, objeto: this.state.objeto}}}/>)
    if(this.state.redirectToPagamentos)
        return (<Redirect to={{ pathname: '/pagamentos/'+this.state.selectedConvenio, state: {}}}/>)
      if(this.state.redirectToPrestacoes)
        return (<Redirect to={{ pathname: '/prestacaodecontas/', state: {convenio_id: this.state.convenio_id, plano_trabalho_id: this.state.plano_trabalho_id}}}/>)
     return (
      <div>
          <Loader isLoading={this.state.isLoading}/>  
          <div className="page-header"><h1>Lista <small>CONVĂNIOS</small>
          </h1>
          </div>
          <BackHandle prevPathname={'/plano_trabalhos'} prevState={this.state} newButton={((this.isUserLogged() && this.props.canCreate)? (<a className="btn btn-success pull-right" href="/convenio/form"><strong><i className="glyphicon glyphicon-plus"></i> NOVO CONVĂNIO</strong></a>) : '')}/>
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
       <ConvenioList prestacoes={this.prestacoes} canDelete={this.props.canCreate} serverUrl={config.server_url} isUserLogged={this.isUserLogged} feedData={this.state.convenios} goToPagamentos={this.goToPagamentos} view={this.getConvenio} delete={this.confirmDelete} edit={this.edit} callback={this.getConvenios}/>
      </div>
      </div>
      </div>
      <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Visualizando Convenio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {(this.state.convenioModal ? <div>
            <p>
              NĂșmero: <strong>{this.state.convenioModal.numero_convenio}</strong>
            </p>
            <p>
            Nome do Representante: <strong>{this.state.convenioModal.nome_representante}</strong>
            </p>
            <p>
              CPF do Representante: <strong>{this.state.convenioModal.cpf_representante}</strong>
            </p>
            <p>
              Cargo do Representante: <strong>{this.state.convenioModal.cargo_representante}</strong>
            </p>
            <p>
              Data VigĂȘncia: <strong>{this.state.convenioModal.data_vigencia}</strong>
            </p>
            <p>
              Qtd. dias para PrestaĂ§ĂŁo: <strong>{this.state.convenioModal.qtd_dias_max_prestacao}</strong>
            </p>
            <p>
              Valor Total do ConvĂȘnio: <strong>
              <CurrencyFormat value={parseFloat(this.state.convenioModal.valor_total_convenio)||0.0} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} />
              
              </strong>
            </p>
            <p>
              Data InĂ­cio: <strong><Moment format="DD/MM/YYYY">{this.state.convenioModal.data_inicio}</Moment></strong>
            </p>
            <p>
              Data TĂ©rmino: <strong><Moment format="DD/MM/YYYY">{this.state.convenioModal.data_termino}</Moment></strong>
            </p>
            <p>
              Programa: <strong>{(this.state.convenioModal.Plano_trabalho && this.state.convenioModal.Plano_trabalho.Programa) ? this.state.convenioModal.Plano_trabalho.Programa.descricao : 'CHAMAMENTO ONGS - NÂ° 02/2018'}</strong>
            </p>
            <p>
              ONG: <strong>{this.state.convenioModal.pe_juridica.razao_social}</strong>
            </p>
            <p>
              Plano de Trabalho: <strong>{this.state.convenioModal.Plano_trabalho && this.state.convenioModal.Plano_trabalho.Projeto_juridica.Projeto.nome}</strong>
            </p>
            <p>
              Secretaria: <strong>{this.state.convenioModal.Secretarium.nome || ''}</strong>
            </p>
            <p>
              DotaĂ§ĂŁo OrĂ§amentĂĄria: <strong>{this.state.convenioModal.Dotacao_orcamentarium.codigo}</strong>
            </p>
            </div> : null)}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Fechar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withAlert(Convenio);

import React, {Component} from 'react'
import {handleRequest} from '../../services/RequestData'
import {Redirect} from 'react-router-dom'
import { withAlert } from "react-alert"
import { confirmAlert } from 'react-confirm-alert' 
// import Required from '../Providers/FormsHandle/Required'
import Loader from '../Providers/FormsHandle/Loader'
// import InputMask from 'react-input-mask'
// import Moment from 'react-moment'
// import {ValidateForm} from '../../services/ValidateForm'
// import {DeleteData} from '../../services/DeleteData'
// import AnexoList from '../Anexo/AnexoList/AnexoList'
// import DirigenteList from '../Pessoa/Dirigente/DirigenteList'
// import Time from 'react-time'
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
// import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle'

// const config = require('../../config')

class UserGrupos extends Component {
  
  constructor(props){
    super(props)
    
    this.state = {
      redirectToReferrer: false,
      isLoading: false,
      nome_grupo: '',
      grupos: [],
      gruposSelected: [],
      user_id: this.props.location.state.user_id || null,
      email_user: this.props.location.state.email_user || null
    }
    
    this.saveUsuario = this.saveUsuario.bind(this)
    this.confirmBack = this.confirmBack.bind(this)
    this.onChange = this.onChange.bind(this)
    this.setFormToEdit = this.setFormToEdit.bind(this)
    this.getGrupos = this.getGrupos.bind(this)
    this.getGruposByUsuario = this.getGruposByUsuario.bind(this)
    this.onChangeGrupo = this.onChangeGrupo.bind(this)        
  }
  
  async setFormToEdit(){
    this.setState(this.props.location.state && this.props.location.state.objeto)
  }
  
  async getGrupos() {
    await handleRequest('grupo', {}, 'GET', 'grupos', this)
  }
  
  async getGruposByUsuario() {
    const result = await handleRequest('grupo_usuario/'+this.state.user_id, {}, 'GET', null, this)
    if(result)
      this.setState(() => { return {gruposSelected: result[0].grupos}})
  }
  
  async saveUsuario(e, dados) {
    e.preventDefault()
    this.setState( {isLoading: true} )
    const gpSalvos = this.state.gruposSelected.map( (e, key) => {
      return e.id
    })
    const method_action = "POST"
    const url_tratada = 'grupo_usuario/'+this.state.user_id
    const result = await handleRequest(url_tratada, {grupos_id: gpSalvos}, method_action, null, this)
    this.props.alert.success('Usuário atualizado com sucesso! É necessário logar novamente para alterações serem carregadas.')
    if(result) this.setState({grupos: result.data, redirectToReferrer: true})
    else console.log('erro', result)
  }

  confirmBack(e){
    e.preventDefault()
    confirmAlert({
      title: 'ATENÇÃO',                        
      message: 'Você realmente deseja cancelar o cadastro?',               
      childrenElement: () => '',       
      confirmLabel: 'Sim',                          
      cancelLabel: 'Não',                            
      onConfirm: () => {this.setState({redirectToReferrer: true})},    
      onCancel: () => '',      
    })
  }
  getDadosBasics(){
    this.getGrupos()
    this.getGruposByUsuario()
  }
  
  componentDidMount(){
    this.getDadosBasics()
  }
  onChange(e){
    this.setState({[e.target.name]:e.target.value})
  }
  onChangeGrupo(e){
    const tempValue = e.target.value 
    let tempLista = this.state.gruposSelected
    if(this.state.gruposSelected.find( x => x!==undefined && x.id!==undefined && (x.id).toString() === tempValue )===undefined ){
      tempLista.push({id: tempValue})
      document.getElementById('grupo-'+tempValue).checked = true
    }else{
      tempLista = this.state.gruposSelected.filter( x => x!==undefined && x.id!==undefined && (x.id).toString() !== tempValue )
      document.getElementById('grupo-'+tempValue).checked = false
    }
    
    this.setState(() => { return {gruposSelected:tempLista} })
  }
  
  render() {
    //redireciona para a rota de listagem
    if (this.state.redirectToReferrer) {
      return (<Redirect to={'/users'}/>)
    }
    let gruposOptions = []
    if( this.state.grupos.length > 0 && gruposOptions.length!==this.state.grupos.length){
      gruposOptions = this.state.grupos.map( (e, key) => {
        const comp = this.state.gruposSelected.find( x => x!==undefined && x.id!==undefined && (x.id).toString() === (e.id).toString())
        return <div key={key} className="col-md-12"><label className="checkbox-inline" title={e.nome_grupo}><input checked={ (comp !== undefined) } id={"grupo-"+e.id} name="gruposChecked" value={e.id} onChange={this.onChangeGrupo.bind(this)} type="checkbox"/>{e.nome_grupo} </label></div>
      })
    }
    
    
    return (
      <div className="row">
      <Loader isLoading={this.state.isLoading}/>  
      <div className="page-header">
      <h1>{this.props.location.state && this.props.location.state.objeto ? 'Editar' : 'Cadastrar'} <small>OPERAÇÕES NO GRUPO</small><button className="btn btn-default btn-small pull-right" onClick={e => this.confirmBack(e)}><strong><i className="glyphicon glyphicon-chevron-left"></i> CANCELAR E VOLTAR</strong></button></h1>
      </div>
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
      <form onSubmit={(e)=> this.saveUsuario(e,this.state)}>
      <div className="col-md-12">
      <FormGroup controlId="email_user" bsSize="large">
      <ControlLabel>Email do Usuário</ControlLabel>
      <FormControl type="text" name="email_user" readOnly value={this.state.email_user} />
      </FormGroup>
      </div>
      <div className="col-md-12 pb-5">
      <h2>Grupos</h2>
      {gruposOptions}
      </div>
      <div className="col-md-12">
      <br></br>
      <button type="submit" className="btn btn-primary"><strong><i className="glyphicon glyphicon-check"></i> SALVAR</strong></button>
      </div>
      </form>
      </div>
      </div>
      </div>
      </div>
      )
    }
  }
  
  export default withAlert(UserGrupos)
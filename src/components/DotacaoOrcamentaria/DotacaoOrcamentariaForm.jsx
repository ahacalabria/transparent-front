import React, {Component} from 'react'
import {handleRequest} from '../../services/RequestData'
import {Redirect} from 'react-router-dom'
import { withAlert } from "react-alert"
import { confirmAlert } from 'react-confirm-alert' 
import Required from '../Providers/FormsHandle/Required'
import Loader from '../Providers/FormsHandle/Loader'
// import InputMask from 'react-input-mask'
// import Moment from 'react-moment'
// import {ValidateForm} from '../../services/ValidateForm'
// import {DeleteData} from '../../services/DeleteData'
// import AnexoList from '../Anexo/AnexoList/AnexoList'
// import DirigenteList from '../Pessoa/Dirigente/DirigenteList'
// import Time from 'react-time'
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import BackHandle from '../Providers/BackHandle';
// import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle'

class DotacaoOrcamentariaForm extends Component {

    constructor(props){
        super(props)
       
        this.state = {
         redirectToReferrer: false,
         isLoading: false,
         dotacoes: []
        }
    
        this.saveDotacao = this.saveDotacao.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.setFormToEdit = this.setFormToEdit.bind(this)
        this.getSecretarias = this.getSecretarias.bind(this)
      }
    
      async setFormToEdit(){
          this.setState(this.props.location.state && this.props.location.state.objeto)
      }
    async getSecretarias(){
        await handleRequest('secretaria/', {}, 'GET', 'secretarias', this)
    }
      async saveDotacao(e, dados) {
        e.preventDefault()
            const method_action = (this.props.location.state && this.props.location.state.objeto) ? "PUT" : "POST"
            const url_tratada = (method_action==="PUT") ? 'dotacao_orcamentaria/'+this.state.id : 'dotacao_orcamentaria'
            try{
                const result = await handleRequest(url_tratada, {codigo: this.state.codigo,especificacao: this.state.especificacao,secretarium_id: this.state.secretarium_id}, method_action, null, this)
                this.props.alert.success('Dotacao salvo com sucesso!')
                if(result) this.setState({dotacoes: result.data, isLoading: false, redirectToReferrer: true})
                else console.log('erro', result)
            } catch (error) {
                this.setState( {isLoading: false} )
                console.log(error)
                this.props.alert.error('Houve algum erro ao salvar o grupo!')
            }
            
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
       componentDidMount(){
           this.getSecretarias()
           
           if(this.props.location.state && this.props.location.state.edit) this.setFormToEdit()
        //funcoes caso precise pegar algo do back
       }
      onChange(e){
        this.setState({[e.target.name]:e.target.value})
       }
    
      render() {
        //redireciona para a rota de listagem
         if (this.state.redirectToReferrer) {
          return (<Redirect to={'/dotacao_orcamentaria'}/>)
        }
    
        let secretariaOptions = []
        if(this.state.secretarias) secretariaOptions = this.state.secretarias.map( (e, key) => {return <option key={key} value={e.id}>{e.nome}</option>})

         return (
          <div className="row">
          <Loader isLoading={this.state.isLoading}/>  
            <div className="page-header">
                <h1>{this.props.location.state && this.props.location.state.objeto ? 'Editar' : 'Cadastrar'} <small>DOTAÇÃO ORÇAMENTÁRIA</small></h1>
            </div>
            <BackHandle prevPathname={'/dotacao_orcamentaria'} prevState={this.props.location.state} 
                    callback={ (!(this.props.location.state && this.props.location.state.objeto)) ? e => {console.log('ok')} : null}
                    />
  
            <div id="controlled-tab-example" className="p-top">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <form onSubmit={(e)=> this.saveDotacao(e,this.state)}>
                            <div className="col-md-4">
                                <FormGroup controlId="codigo" bsSize="large">
                                    <ControlLabel><Required/> Código</ControlLabel>
                                    <FormControl type="text" name="codigo" value={this.state.codigo || ''} autoFocus onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="especificacao" bsSize="large">
                                    <ControlLabel><Required/> Especificação</ControlLabel>
                                    <FormControl type="text" name="especificacao" value={this.state.especificacao || ''} onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="secretarium_id" bsSize="large">
                                    <ControlLabel><Required/> Secretaria</ControlLabel>
                                    <FormControl componentClass="select" name="secretarium_id" value={this.state.secretarium_id} onChange={this.onChange.bind(this)} required>
                                    <option value="">Selecione</option>
                                    {secretariaOptions}
                                    </FormControl>
                                </FormGroup>
                            </div>
                            <div className="col-md-12">
                                <Required label="Campos obrigatórios"/><br></br>
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

export default withAlert(DotacaoOrcamentariaForm)
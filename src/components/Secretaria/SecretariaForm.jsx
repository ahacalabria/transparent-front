import React, {Component} from 'react'
import {handleRequest} from '../../services/RequestData'
import {Redirect} from 'react-router-dom'
import { withAlert } from "react-alert"
import { confirmAlert } from 'react-confirm-alert' 
import Required from '../Providers/FormsHandle/Required'
import Loader from '../Providers/FormsHandle/Loader'
import InputMask from 'react-input-mask'
// import Moment from 'react-moment'
// import {ValidateForm} from '../../services/ValidateForm'
// import {DeleteData} from '../../services/DeleteData'
// import AnexoList from '../Anexo/AnexoList/AnexoList'
// import DirigenteList from '../Pessoa/Dirigente/DirigenteList'
// import Time from 'react-time'
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import BackHandle from '../Providers/BackHandle';
// import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle'

class SecretariaForm extends Component {

    constructor(props){
        super(props)
       
        this.state = {
         redirectToReferrer: false,
         isLoading: false,
         secretarias: [],
         dataCidade: [],
         dataUf: [],
         gotOrdenador: null
        }
    
        this.saveSecretaria = this.saveSecretaria.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.setFormToEdit = this.setFormToEdit.bind(this)
        this.getEstados = this.getEstados.bind(this)
        this.getCidades = this.getCidades.bind(this)
        
        this.findOrdenador = this.findOrdenador.bind(this)
      }

      findOrdenador = async cpf => {
        const gotOrdenador = await handleRequest(`ordenador/cpf/${cpf}`,{},'GET',null,this)
        if(gotOrdenador.length>0){
          this.setState(() => { return  {gotOrdenador: true, nome_completo: gotOrdenador[0].nome_completo} })
        }else
          this.setState(() => {return  { nome_completo: '', gotOrdenador: false}})
      }

      async getEstados(){    
        try {
          await handleRequest('estado', {}, 'GET', 'dataUf', this)  
        } catch(err) {
          this.handleErrors(err)
        }
      }
    
      async getCidades(estado_id){
        try {
          await handleRequest('cidade/estado/'+estado_id, {}, 'GET', 'dataCidade', this)
        } catch(err) {
          this.handleErrors(err)
        }
      }
      async setFormToEdit(){
          if(this.props.location.state){
              this.setState(this.props.location.state.objeto)
              this.setState({estado_id: this.props.location.state.objeto.cidade.estado_id, cidade_id: this.props.location.state.objeto.cidade.id })
          }
      }

      saveOrdenador = async () => {
        const newOrdenador = await handleRequest('ordenador', {nome_completo: this.state.nome_completo, cpf: this.state.cpf}, 'POST', null, this)
        if(newOrdenador)
          this.setState(() => { return {ordenador_id: newOrdenador.id} })
      }

      async saveSecretaria(e, dados) {
        e.preventDefault()
        

            const method_action = (this.props.location.state && this.props.location.state.objeto) ? "PUT" : "POST"
            const url_tratada = (method_action==="PUT") ? 'secretaria/'+this.state.id : 'secretaria'
            try{

              if(!this.setState.gotOrdenador) {
                await this.saveOrdenador()
              }

                const result = await handleRequest(url_tratada, this.state, method_action, null, this)
                this.props.alert.success('Secretaria salvo com sucesso!')
                if(result) this.setState({secretarias: result.data, redirectToReferrer: true})
                else console.log('erro', result)
            } catch (error) {
                console.log(error)
                this.props.alert.error('Houve algum erro ao salvar o secretaria!')
            }
            this.setState( {isLoading: false} )
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
            this.getEstados()
            this.getCidades(6)
           if(this.props.location.state && this.props.location.state.edit) this.setFormToEdit()
        //funcoes caso precise pegar algo do back
       }
       onChange(e){

        if(e.target.name === 'estado_id' && e.target.value !== ''){
          this.setState({estado_id_previous: e.target.value})
          this.getCidades(e.target.value)
         }

         if(e.target.name === 'cidade_id' && e.target.value === 720){
            this.setState({estado_id_previous: 6})
            this.getCidades(6)
         }
         
         if(e.target.name === 'cpf' && e.target.value.length === 14)
         this.findOrdenador(e.target.value)

        this.setState({[e.target.name]:e.target.value})
       }
    
      render() {
        //redireciona para a rota de listagem
         if (this.state.redirectToReferrer) {
          return (<Redirect to={'/secretarias'}/>)
        }
    
        let ufSelect = []
    let cidadeSelect = []
    if(this.state.dataUf)
      ufSelect = this.state.dataUf.map((e, key) => {return <option key={key} value={e.value}>{e.name}</option>})

    if(this.state.estado_id!=='' && this.state.estado_id===this.state.estado_id_previous){
      if(this.state.dataCidade.length === 0 && this.state.hasAccess) this.getCidades(this.state.estado_id)
      
      cidadeSelect = this.state.dataCidade.map((e, key) => { return <option key={key} value={e.value}>{e.name}</option>})
    }


         return (
          <div className="row">
          <Loader isLoading={this.state.isLoading}/>  
            <div className="page-header">
                <h1>{this.props.location.state && this.props.location.state.objeto ? 'Editar' : 'Cadastrar'} <small>SECRETARIA</small></h1>
            </div>
            <BackHandle prevPathname={'/secretarias'} prevState={this.props.location.state} 
                    callback={ () => {console.log('ok')} }
                    />
  
            <div id="controlled-tab-example" className="p-top">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <form onSubmit={(e)=> this.saveSecretaria(e,this.state)}>
                            <div className="col-md-6">
                                <FormGroup controlId="nome" bsSize="large">
                                    <ControlLabel><Required/> Nome do Secretaria</ControlLabel>
                                    <FormControl type="text" name="nome" value={this.state.nome || ''} autoFocus placeholder="Ex.: Financeiro" onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">                
                  {/* ESTADO */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> UF</ControlLabel>
                  <FormControl componentClass="select" name="estado_id" value={this.state.estado_id} onChange={this.onChange.bind(this)} required="required">
                    <option value="">Selecione</option>
                      {ufSelect}
                  </FormControl>
                </FormGroup> 
              </div>
              <div className="col-md-6">
                {/* MUNICIPIO */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Município</ControlLabel>
                  <FormControl componentClass="select" name="cidade_id" value={this.state.cidade_id} onChange={this.onChange.bind(this)} required="required">
                    <option value="">Selecione</option>
                      {cidadeSelect}
                  </FormControl>
                </FormGroup>    
              </div>

              <div className="col-md-6">
                { /* LOGRADOURO */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Logradouro</ControlLabel>
                  <FormControl type="text" name="logradouro" value={this.state.logradouro} onChange={this.onChange.bind(this)} required="required"/>
                </FormGroup>
              </div>

              <div className="col-md-6">
                { /* NUMERO */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Número</ControlLabel>
                  <FormControl type="text" name="numero" value={this.state.numero} onChange={this.onChange.bind(this)} required="required"/>
                </FormGroup>
              </div>

              <div className="col-md-6">
                { /* Bairro */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Bairro</ControlLabel>
                  <FormControl type="text" name="bairro" value={this.state.bairro} onChange={this.onChange.bind(this)} required="required"/>
                </FormGroup>
              </div>
              <div className="col-md-12">
                <label>Dados do Ordenador</label>
              </div>
              <div className="col-md-6">
                { /* CPF */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> CPF Ordernador</ControlLabel>
                  {/* <FormControl type="text" name="cpf_ordenador" value={this.state.cpf_ordenador} onChange={this.onChange.bind(this)} required="required"/> */}
                  <InputMask className="form-control" type="text" name="cpf" onChange={this.onChange} mask="999.999.999-99" maskChar={null} required/>
                </FormGroup>
              </div>

              <div className="col-md-6">
              { /* Nome Ordenador */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Nome Ordenador</ControlLabel>
                  <FormControl type="text" disabled={this.state.gotOrdenador} name="nome_completo" value={this.state.nome_completo} onChange={this.onChange.bind(this)} required="required"/>
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

export default withAlert(SecretariaForm)
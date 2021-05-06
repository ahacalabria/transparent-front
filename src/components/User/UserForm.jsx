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
import {FormGroup, ControlLabel, FormControl, Button, Glyphicon} from 'react-bootstrap'
import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle';
// import DatePicker from 'react-date-picker';
// import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle'


class UserForm extends Component {

    constructor(props){
        super(props)
       
        this.state = {
         redirectToReferrer: false,
         isLoading: false,
         users: [],
         instituicoes: [],
         dataCidade: [],
         dataUf: [],
        }
    
        this.saveUser = this.saveUser.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.setFormToEdit = this.setFormToEdit.bind(this)
        this.getInstituicoes = this.getInstituicoes.bind(this)
        this.getEstados = this.getEstados.bind(this)
        this.getCidades = this.getCidades.bind(this)
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
      async getInstituicoes(){
          try {
              await handleRequest('pe_juridica', {}, 'GET', 'instituicoes', this)
          } catch (error) {
              console.log({error})
          }
      }
      async setFormToEdit(){
          this.setState(this.props.location.state && this.props.location.state.objeto)
      }

      async saveUser(e, dados) {
        e.preventDefault()
            this.setState( {isLoading: true} )
            const method_action = (this.props.location.state && this.props.location.state.objeto) ? "PUT" : "POST"
            const url_tratada = (method_action==="PUT") ? 'users/create_simple/'+this.state.id : 'users/create_simple'
            const result = await handleRequest(url_tratada, this.state, method_action, null, this)
            console.log({result})
            if(result) {
              this.props.alert.success('Usuário salvo com sucesso!')
              this.setState({users: result.data, redirectToReferrer: true})
            }else{
              this.props.alert.error('Aconteceu algum erro, tente novamente!')
              console.log('erro', result)
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
            this.getInstituicoes()
            this.getEstados()

           if(this.props.location.state && this.props.location.state.edit) this.setFormToEdit()
        //funcoes caso precise pegar algo do back
       }
      onChange(e){

        if(e.target.name === 'estado_id' && e.target.value !== ''){
          this.setState({estado_id_previous: e.target.value})
          this.getCidades(e.target.value)
         }

        this.setState({[e.target.name]:e.target.value})
       }
    
      render() {
        //redireciona para a rota de listagem
         if (this.state.redirectToReferrer) return (<Redirect to={'/users'}/>)

    let ufSelect = []
    let cidadeSelect = []
    if(this.state.dataUf)
      ufSelect = this.state.dataUf.map((e, key) => {return <option key={key} value={e.value}>{e.name}</option>})

    if(this.state.estado_id!=='' && this.state.estado_id===this.state.estado_id_previous){
      if(this.state.dataCidade.length === 0 && this.state.hasAccess) this.getCidades(this.state.estado_id)
      
      cidadeSelect = this.state.dataCidade.map((e, key) => { return <option key={key} value={e.value}>{e.name}</option>})
    }

       let instituicoesOptions = []
        if(this.state.instituicoes) instituicoesOptions = this.state.instituicoes.map( (e, key) => {return <option key={key} value={e.id}>{e.razao_social}</option>})

        return (
            <div>
             <Loader isLoading={this.state.isLoading}/>  
             {(this.state.hasErrors) ? <ErrorsHandle errors={this.state.errors} clearErrors={this.clearErrors}/> : null}
            <div className="page-header">
        <h1>Cadastro de  <small>Usuário</small></h1>
      </div>
            <div id="controlled-tab-example" className="p-top">
            <div className="row">
            <form onSubmit={this.saveUser.bind(this)}>
              <div className="col-md-12 col-lg-12 col-sm-12">
              {/* <div className="form-group" onChange={this.setTipoPessoa.bind(this)}>
              <input defaultChecked={this.state.tipo_pessoa ==="pf"} type="radio" value="pf" name="tipo_pessoa"/> Pessoa Física{' '}
              <input defaultChecked={this.state.tipo_pessoa ==="pj"} type="radio" value="pj" name="tipo_pessoa"/> Pessoa Jurídica
            </div> */}
            {/* CNPJ */}
            <div className="col-md-12">
            <FormGroup controlId="cnpj" bsSize="large">
              <ControlLabel><Required/> Instituição</ControlLabel>
              <FormControl componentClass="select" name="pe_juridica_id" value={this.state.pe_juridica_id} onChange={this.onChange.bind(this)} required>
                                <option value="">Selecione</option>
                                {instituicoesOptions || ''}
                                </FormControl>
            </FormGroup>
            </div>
            {/* NOME */}
            <div className="col-md-6">
            <FormGroup controlId="nome" bsSize="large">
              <ControlLabel><Required/> Nome</ControlLabel>
              <FormControl type="text" name="nome" value={this.state.nome} onChange={this.onChange.bind(this)} required/>
              {/* <InputMask className="form-control" type="text" name="nome" onChange={this.onChange} mask="999.999.999-99" maskChar={null} /> */}
            </FormGroup>
            </div>
            {/* CPF */}
            <div className="col-md-6">
            <FormGroup controlId="cpf" bsSize="large">
              <ControlLabel><Required/> CPF</ControlLabel>
              {/* <FormControl type="text" name="cpf" value={this.state.cpf} onChange={this.onChange.bind(this)}/> */}
              <InputMask className="form-control" type="text" name="cpf" onChange={this.onChange} mask="999.999.999-99" maskChar={null} required/>
            </FormGroup>
            </div>
            {/* RG */}
            <div className="col-md-6">
            <FormGroup controlId="rg" bsSize="large">
              <ControlLabel><Required/> RG</ControlLabel>
              <FormControl type="text" name="rg" value={this.state.rg} onChange={this.onChange.bind(this)} required/>
            </FormGroup>
            </div>
            {/* ORGAO_EXPEDIDOR_RG */}
            <div className="col-md-3">
            <FormGroup controlId="orgao_expedidor_rg" bsSize="large">
              <ControlLabel><Required/> Órgão Expedidor RG</ControlLabel>
              <FormControl type="text" name="orgao_expedidor_rg" value={this.state.orgao_expedidor_rg} onChange={this.onChange.bind(this)} required/>
            </FormGroup>
            </div>
            {/* CELULAR */}
            <div className="col-md-3">
              <FormGroup controlId="celular" bsSize="large">
              <ControlLabel><Required/> Celular</ControlLabel>
              <InputMask className="form-control"type="text" name="celular" mask="(99) 999999999" maskChar={null} onChange={this.onChange.bind(this)} required/>
            </FormGroup>
            </div>
              <div className="col-md-6">
                { /* CEP */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> CEP</ControlLabel>
                  <InputMask id="cep" className="form-control" type="text" value={this.state.cep} name="cep_dirigente" onChange={this.onChange} mask="99999-999" maskChar={null} required="required"/>
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
            {/* EMAIL */}
            <div className="col-md-6">
            <FormGroup controlId="email" bsSize="large">
              <ControlLabel><Required/> E-mail</ControlLabel>
              <FormControl type="text" name="email" value={this.state.email} onChange={this.onChange.bind(this)} required/>
            </FormGroup>
            </div>
            {/* CONFIRMAR EMAIL */}
            <div className="col-md-6">
            <FormGroup controlId="confirmar-email" bsSize="large">
              <ControlLabel><Required/> Confirme E-mail</ControlLabel>
              <FormControl type="text" name="confirm_email" onChange={this.onChange.bind(this)} required/>
            </FormGroup>
            </div>
            {/* PASSWORD */}
            <div className="col-md-6">
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel><Required/> Senha de acesso</ControlLabel>
              <FormControl type="password" name="password" value={this.state.password} onChange={this.onChange.bind(this)} required/>
            </FormGroup>
            </div>
            {/* CONFIRMAR PASSWORD */}
            <div className="col-md-6">
            <FormGroup controlId="confirmar-senha" bsSize="large">
              <ControlLabel><Required/> Confirma senha</ControlLabel>
              <FormControl type="password" name="confirm_password" onChange={this.onChange.bind(this)} required/>
            </FormGroup>
            </div>     
            {/* <FormGroup controlId="captch" bsSize="large">
            <div className="col-md-3">
              {''}
              </div>
              <div className="col-md-9">
              <ControlLabel><Required /> Digite o texto que aparece na imagem ao lado</ControlLabel>
              <FormControl type="text" name="captcha_value" value={this.state.captcha_value} onChange={this.onChange.bind(this)}/>
              </div>
            </FormGroup> */}
            
             
            {/* <div className="col-md-6"> */}
              {/* EMAIL */}
              {/* <FormGroup bsSize="large">
                <ControlLabel><Required/> E-mail</ControlLabel>
                <FormControl type="text" id="email_dirigente" name="email_dirigente" value={this.state.email_dirigente} onChange={this.onChange.bind(this)} required="required"/>
              </FormGroup>
            </div>
            <div className="col-md-6"> */}
              {/* CONFIRMAR EMAIL */}
              {/* <FormGroup bsSize="large">
                <ControlLabel><Required/> Confirmação do E-mail</ControlLabel>
                <FormControl type="text" id="confirm_email_dirigente" name="confirm_email_dirigente" value={this.state.confirm_email_dirigente} onChange={this.onChange.bind(this)} required="required"/>
              </FormGroup>
              </div>
            <div className="col-md-6"> */}
              {/* EMAIL CORPORATIVO */}
              {/* <FormGroup bsSize="large">
                <ControlLabel><Required/> E-mail Corporativo</ControlLabel>
                <FormControl type="text" name="email_coorporativo_dirigente" value={this.state.email_coorporativo_dirigente || ''} onChange={this.onChange.bind(this)} required="required"/>
              </FormGroup>
            </div>
            <div className="col-md-6"> */}
              {/* CONFIRMAR EMAIL CORPORATIVO */}
              {/* <FormGroup bsSize="large">
                <ControlLabel><Required/> Confirmação do E-mail Corporativo</ControlLabel>
                <FormControl type="text" name="confirm_email_coorporativo_dirigente" value={this.state.confirm_email_coorporativo_dirigente || ''} onChange={this.onChange.bind(this)} required="required"/>
              </FormGroup>
              </div>
              <div className="col-md-6"> */}
                            {/* DATA ENTRADA NA DIRETORIA */}
                    {/* <FormGroup bsSize="large">
                        <ControlLabel><Required/> Data de entrada na diretoria</ControlLabel>
                        <InputMask className="form-control" type="text" name="data_entrada_diretoria_dirigente" value={this.state.data_entrada_diretoria_dirigente} onChange={this.onChange} mask="99/99/9999" maskChar={null} required="required"/> */}
                        {/* <DatePicker onChange={this.onChangeDate.bind(this, 'data_entrada_diretoria_dirigente')} name="data_entrada_diretoria_dirigente" value={this.state.data_entrada_diretoria_dirigente} locale="pt-br" calendarIcon={<span className="fa fa-calendar"></span>} className="form-control" showLeadingZeros={true} /> */}
                    {/* </FormGroup>
              </div>
              <div className="col-md-6"> */}
                            {/* DATA SAIDA PREVISTA */}
                    {/* <FormGroup bsSize="large">
                        <ControlLabel><Required/> Data prevista de saída da diretoria</ControlLabel>
                        <InputMask className="form-control" type="text" name="data_saida_diretoria_dirigente"  value={this.state.data_saida_diretoria_dirigente} onChange={this.onChange} mask="99/99/9999" maskChar={null} required="required"/> */}
                        {/* <DatePicker onChange={this.onChangeDate.bind(this, 'data_saida_diretoria_dirigente')} name="data_saida_diretoria_dirigente" value={this.state.data_saida_diretoria_dirigente} locale="pt-br" calendarIcon={<span className="fa fa-calendar"></span>} className="form-control" showLeadingZeros={true} /> */}
                    {/* </FormGroup>
              </div> */}
               {/* REQUIRE FIELD */}
               <div className="col-md-12">
               <p><Required label="Campos obrigatórios"/><br></br></p>
              {/* BUTTON SUBMIT */}
              <Button bsStyle="primary" type="submit"><Glyphicon glyph="check" /> CONFIRMAR OS DADOS</Button>
              </div>
              </div>
              </form>
              </div>
            </div>
            </div>
          )
      }
    }

export default withAlert(UserForm)

import React, {Component} from 'react'
import {RequestData, handleRequest} from '../../services/RequestData'
import {GetData} from '../../services/GetData'
import {Redirect} from 'react-router-dom'
import { withAlert } from "react-alert"
import Required from '../Providers/FormsHandle/Required'
import InputMask from 'react-input-mask'
import {Button, Glyphicon, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import Loader from '../Providers/FormsHandle/Loader'
import './Cadastrar.css'
import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle';
import fetchJsonp from 'fetch-jsonp'
const validarCpf = require('validar-cpf')

class Cadastrar extends Component {

  constructor(props){
    super(props)
   
    this.state = {

      celular: '',
      email: '',
      confirm_email: '',
      cpf: '',
      rg: '',
      orgao_expedidor_rg: '',
      // data_nascimento: new Date().toISOString(),
      result: '',
      cnpj: '',
      redirectToReferrer: false,
      redirectToNext: false,
      form_disabled: false,
      password: '',
      confirm_password: '',
      isLoading: false,
      sessionId: null,
      captcha: null,
      hasProblemOnSingUp: false,
      isLogged: false,
      hasErrors: false,
      errors: null
    }

    this.signup = this.signup.bind(this)
    this.onChange = this.onChange.bind(this)
    this.getCaptcha = this.getCaptcha.bind(this)
    this.handleErrors = this.handleErrors.bind(this)
    this.clearErrors = this.clearErrors.bind(this)
  }


 componentDidMount(){
   if(sessionStorage.getItem("user")!=null) this.setState({isLogged: true})
  // this.getCaptcha()
  this.setState( isLoading => {
    return {isLoading: false}
  } )
 }
 

 async validadeCaptcha(){
  if(validarCpf(this.state.cpf)){
  if( this.confirmPassword() && this.confirmEmail() ){
    try {
      this.setState( { isLoading: true} )
      const result = await RequestData('receitaCNPJ/basicInfos',{sessionId: this.state.sessionId, cnpj: this.state.cnpj, solvedCaptcha: this.state.captcha_value},"POST")
       console.log(result)
       if(result.situacao !== "ATIVA" ){
          this.setState( { isLoading: false} )
          this.props.alert.error("Segundo a Receita Federal a situação do CNPJ informado é: "+result.situacao+"!")  
      }else{
        this.setState({
          bairro: result.bairro,
          cep: result.cep,
          data_abertura: result.data_abertura,
          logradouro: result.logradouro,
          numero: result.numero,
          municipio_query: result.municipio,
          razao_social: result.razao_social,
          nome_fantasia: result.nome_fantasia,
          telefone: result.telefone
        })
        await this.signup()
    }
   } catch (error) {
      this.handleErrors(error, true)
      this.getCaptcha()
    }
    
        //  throw('erro')
       
      // if(responseJson.id>0) savePessoa(responseJson.id);
      //  this.props.alert.success("Pessoa cadastrada com sucesso!")
        // return true;
        
      // }
      // }).catch((err) => {
      //   console.log('err', err)
        
        // this.props.alert.error("Aconteceu algum erro ao tentar validar o CNPJ, por favor, tente novamente!")
        // this.setState( isLoading => {
        //   return {isLoading: false}
        // } )
        // await 
        // this.getCaptcha()
        // throw('erro')
        // return false
        // err.forEach(e => {
        //   this.props.alert.error(e.title+": "+e.message)
        // })
      // })
    }
  }else{
    this.props.alert.error("CPF Inválido!")
  }
 }

 async signup() {
    // let validadeCaptcha = this.validadeCaptcha()

      try{
        var pe_juridica = {}
        let newCnpj = this.state.cnpj.replace(/\//g,"").replace(/-/g,"").replace(/\./g,"")
        let result = await fetchJsonp(`https://www.receitaws.com.br/v1/cnpj/${newCnpj}`)
        let json = await result.json()
        
        if(json.status == "ERROR"){
          throw new Error('ERROR: '+ json.message)
        }else{
          // pe_juridica.razao_social = json.nome
          // pe_juridica.data_abertura = json.abertura
          // pe_juridica.nome_fantasia = json.fantasia
          // pe_juridica.porte = json.porte
          // pe_juridica.logradouro = json.logradouro
          // pe_juridica.numero = json.numero
          // pe_juridica.complemento = json.complemento
          // pe_juridica.cep = json.cep
          // pe_juridica.bairro = json.bairro
          // pe_juridica.municipio = json.municipio
          // pe_juridica.estado = json.uf
          // pe_juridica.telefone = json.telefone
          // pe_juridica.situacao = json.situacao
          await this.setState({
            bairro: json.bairro,
            cep: json.cep,
            data_abertura: json.abertura,
            logradouro: json.logradouro,
            numero: json.numero,
            municipio_query: json.municipio,
            razao_social: json.nome,
            nome_fantasia: json.fantasia,
            telefone: json.telefone
          })
        }

        // console.log('pe_juridica',pe_juridica)

        await handleRequest('pessoa',this.state, 'POST', 'new_person', this)      
        if(this.state.new_person){
          this.props.alert.success("Pessoa cadastrada com sucesso!")
          this.setState({redirectToNext:true})
        }

        // await handleRequest('pessoa',this.state, 'POST', null, this)      
        // this.props.alert.success("Pessoa cadastrada com sucesso!")
        // this.setState({redirectToNext:true})

      }catch(err){
        alert('erro!')
        console.log(err)
        console.log('signup',err)
        this.setState({isLoading: false, hasProblemOnSingUp: true})
        // this.handleErrors(err)
      }

  }

  handleErrors = (err, isLoadingCallback=false) => {
    this.setState({hasErrors: true, errors: err, isLoading: isLoadingCallback})
  }
  
  clearErrors = () => {
    this.setState({hasErrors: false, errors: null})
  }

 onChange(e){   
   this.setState({[e.target.name]:e.target.value})
 }
  confirmEmail(){
    if(this.state.confirm_email===this.state.email){
      return true
    } else{
      this.props.alert.error("Erro: E-mails não conferem. Tente novamente")
      return false
    }
  }
  confirmPassword(){
    if(this.state.confirm_password===this.state.password){
      return true
    } else{
      this.props.alert.error("Erro: Senhas não conferem. Tente novamente")
      return false
    }
  }

  async getCaptcha(){
    this.setState({isLoading: true})
    try{
      const resp = await GetData('receitaCNPJ/captcha',{},true)
      this.setState({sessionId: resp.sessionId, captcha: resp.captcha, captcha_value: ''})
    }catch(err){
      this.handleErrors(err)
      console.log('err', err)
      // intervalID = setInterval(()=>{
        // alert('nao encontrou')
        // this.getCaptcha()
      // },5000)
    }
    this.setState({isLoading: false})
   }

  render() {
    if(this.state.isLogged) return (<Redirect to={{pathname: '/'}} />)
    if(this.state.redirectToNext) return (<Redirect to={{pathname: '/ativacao_user/success'}} />)
    // if (this.state.redirectToReferrer || sessionStorage.getItem('userData')) {
    //   return (<Redirect to={'/home'}/>)
    // }
    // let imgCaptcha = ''
    // if(this.state.captcha) 
    //   imgCaptcha = <div><img alt="captcha" src={'data:image/png;base64,'+this.state.captcha}/><Button onClick={this.getCaptcha.bind(this)}><Glyphicon glyph="refresh"/></Button></div>
    // else
    //   imgCaptcha = <div><img alt="captcha" title={'Captcha não carregado. Clique ao lado para atualizar'}/><Button onClick={this.getCaptcha.bind(this)}><Glyphicon glyph="refresh"/></Button></div>


    return (
      <div>
       <Loader isLoading={this.state.isLoading}/>  
       {(this.state.hasErrors) ? <ErrorsHandle errors={this.state.errors} clearErrors={this.clearErrors}/> : null}
      <div className="page-header">
  <h1>Cadastro do  <small>Credenciador</small></h1>
</div>
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      
        <div className="col-md-12 col-lg-12 col-sm-12">
        {/* <div className="form-group" onChange={this.setTipoPessoa.bind(this)}>
        <input defaultChecked={this.state.tipo_pessoa ==="pf"} type="radio" value="pf" name="tipo_pessoa"/> Pessoa Física{' '}
        <input defaultChecked={this.state.tipo_pessoa ==="pj"} type="radio" value="pj" name="tipo_pessoa"/> Pessoa Jurídica
      </div> */}
      {/* CNPJ */}
      <div className="col-md-6">
      <FormGroup controlId="cnpj" bsSize="large">
        <ControlLabel><Required/> CNPJ da organização que será cadastrada</ControlLabel>
        <InputMask className="form-control" type="text" name="cnpj" mask="99.999.999/9999-99" maskChar={null} value={this.state.cnpj} onChange={this.onChange}/>
      </FormGroup>
      </div>
      {/* CPF */}
      <div className="col-md-6">
      <FormGroup controlId="cpf" bsSize="large">
        <ControlLabel><Required/> Seu CPF</ControlLabel>
        {/* <FormControl type="text" name="cpf" value={this.state.cpf} onChange={this.onChange.bind(this)}/> */}
        <InputMask className="form-control" type="text" name="cpf" onChange={this.onChange} mask="999.999.999-99" maskChar={null} />
      </FormGroup>
      </div>
      {/* RG */}
      <div className="col-md-6">
      <FormGroup controlId="rg" bsSize="large">
        <ControlLabel><Required/> Seu RG</ControlLabel>
        <FormControl type="text" name="rg" value={this.state.rg} onChange={this.onChange.bind(this)}/>
      </FormGroup>
      </div>
      {/* ORGAO_EXPEDIDOR_RG */}
      <div className="col-md-3">
      <FormGroup controlId="orgao_expedidor_rg" bsSize="large">
        <ControlLabel><Required/> Órgão Expedidor RG</ControlLabel>
        <FormControl type="text" name="orgao_expedidor_rg" value={this.state.orgao_expedidor_rg} onChange={this.onChange.bind(this)}/>
      </FormGroup>
      </div>
      {/* CELULAR */}
      <div className="col-md-3">
        <FormGroup controlId="celular" bsSize="large">
        <ControlLabel><Required/> Celular</ControlLabel>
        <InputMask className="form-control"type="text" name="celular" mask="(99) 999999999" maskChar={null} onChange={this.onChange.bind(this)}/>
      </FormGroup>
      </div>
      {/* EMAIL */}
      <div className="col-md-6">
      <FormGroup controlId="email" bsSize="large">
        <ControlLabel><Required/> Seu e-mail</ControlLabel>
        <FormControl type="text" name="email" value={this.state.email} onChange={this.onChange.bind(this)} />
      </FormGroup>
      </div>
      {/* CONFIRMAR EMAIL */}
      <div className="col-md-6">
      <FormGroup controlId="confirmar-email" bsSize="large">
        <ControlLabel><Required/> Confirme seu e-mail</ControlLabel>
        <FormControl type="text" name="confirm_email" onChange={this.onChange.bind(this)} />
      </FormGroup>
      </div>
      {/* PASSWORD */}
      <div className="col-md-6">
      <FormGroup controlId="password" bsSize="large">
        <ControlLabel><Required/> Sua senha de acesso</ControlLabel>
        <FormControl type="password" name="password" value={this.state.password} onChange={this.onChange.bind(this)} />
      </FormGroup>
      </div>
      {/* CONFIRMAR PASSWORD */}
      <div className="col-md-6">
      <FormGroup controlId="confirmar-senha" bsSize="large">
        <ControlLabel><Required/> Confirma sua senha</ControlLabel>
        <FormControl type="password" name="confirm_password" onChange={this.onChange.bind(this)}/>
      </FormGroup>
      </div>     
      <FormGroup controlId="captch" bsSize="large">
      {/* <div className="col-md-3">
        {imgCaptcha}
        </div>
        <div className="col-md-9">
        <ControlLabel><Required /> Digite o texto que aparece na imagem ao lado</ControlLabel>
        <FormControl type="text" name="captcha_value" value={this.state.captcha_value} onChange={this.onChange.bind(this)}/>
        </div> */}
      </FormGroup>
        {/* REQUIRE FIELD */}
        <p><Required label="Campos obrigatórios"/><br></br></p>
        {/* BUTTON SUBMIT */}
        <Button bsStyle="primary" type="submit" onClick={this.signup.bind(this)}><Glyphicon glyph="check" /> CONFIRMAR OS DADOS</Button>
        </div>

      </div></div>
      </div>
    )
  }
}

export default withAlert(Cadastrar)
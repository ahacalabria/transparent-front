import React, {Component} from 'react'
import {handleRequest} from '../../services/RequestData'
import {Redirect} from 'react-router-dom'
import { withAlert } from "react-alert"
import { confirmAlert } from 'react-confirm-alert' 
import Required from '../Providers/FormsHandle/Required'
import Loader from '../Providers/FormsHandle/Loader'
import InputMask from 'react-input-mask'
import Moment from 'react-moment'
// import {ValidateForm} from '../../services/ValidateForm'
import {DeleteData} from '../../services/DeleteData'
import AnexoList from '../Anexo/AnexoList/AnexoList'
import DirigenteList from '../Pessoa/Dirigente/DirigenteList'
import Time from 'react-time'
import {Alert, Checkbox, Panel, PanelGroup, Button, Glyphicon, FormGroup, ControlLabel, FormControl, Tabs, Tab, Badge, Modal} from 'react-bootstrap'
import './CadastroONG.css'
import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle';
import DatePicker from 'react-date-picker'
// import SimpleStorage, { clearStorage } from "react-simple-storage"

const config = require('../../config')
const validarCpf = require('validar-cpf')

class CadastroONG extends Component {

  constructor(props, context){
    super(props, context)
   
    this.state = {
      nome: '',
      nome_completo: '',
      nome_completo_dirigente: '',
      nome_fantasia: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cep: '',
      cidade_id: '',
      estado_id: '',
      pais_id: '1',
      telefone: '',
      celular: '',
      email: '',
      confirm_email: '',
      email_coorporativo_dirigente: null,
      confirm_email_coorporativo_dirigente: null,
      cpf: '',
      rg: '',
      orgao_expedidor_rg: '',
      razao_social: '',
      selectSubAreas: [],
      dirigentesList: [],
      cnpj: '',
      redirectToReferrer: false,
      // redirectToNext: false,
      form_disabled: false,
      filename: null,
      password: '',
      confirm_password: '',
      dataUf: [],
      dataCidade: [],
      isLoading: true,
      open: false,
      areasAtuacao: [],
      key: 1,
      subKey: 1,
      totalSteps: 4,
      canGoNext: true,
      canGoBack: false,
      canFinishForm: false,
      updateAnexos: [false, false],
      anexos_estatuto: [],
      anexos_ata: [],
      steps: {INTRO: 1, DADOS: 2, IDENTIFICACAO: 2.1, ESTATUTO: 3, DIRETORIA: 4},
      pe_juridica_id: 0,
      btnNextText: 'AVANÇAR PARA A ETAPA 1 - DADOS BÁSICOS',
      serverUrl: config.server_url,
      fl_em_exercicio: false,
      fl_credenciador: false,
      fl_responsavel_legal: false,
      dataTipoAnexo: [],
      hasAccess: false,
      user_credenciador: false,
      tipo_anexo_id: null,
      canSelectByClicking: false,
      show: false,
      logradouro_dirigente: '',
      cargo_funcao_dirigente: '',
      hasErrors: false,
      errors: null,
      redirectToPainel: false,
      telefone_contato: '',
      email_contato: '',
      estatuto_social: '',
      data_entrada_diretoria_dirigente: '',
      data_saida_diretoria_dirigente: '',
      mandato_inicio: '',
      mandato_termino: ''
    }
    // this.initialState = this.state
    this.tipoAnexoSelect = []
    this.areas = []
    this.deletarAnexo = this.deletarAnexo.bind(this)
    this.deletarAnexoConfirm = this.deletarAnexoConfirm.bind(this)
    this.deletarDirigente = this.deletarDirigente.bind(this)
    this.downloadAnexo = this.downloadAnexo.bind(this)
    this.setClass = this.setClass.bind(this)
    this.editONG = this.editONG.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onChangeDate = this.onChangeDate.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleInnerTabs = this.handleInnerTabs.bind(this)
    this.getDadosBasicos = this.getDadosBasicos.bind(this)
    this.goNextStep = this.goNextStep.bind(this)
    this.goBackStep = this.goBackStep.bind(this)
    this.controlSteps = this.controlSteps.bind(this)
    this.getEstados = this.getEstados.bind(this)
    this.getCidades = this.getCidades.bind(this)
    this.getAreas = this.getAreas.bind(this)
    this.getDirigentes = this.getDirigentes.bind(this)
    this.handleUploadFile = this.handleUploadFile.bind(this)
    this.getTipoAnexos = this.getTipoAnexos.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleErrors = this.handleErrors.bind(this)
    this.hasCadastroFinalizado = this.hasCadastroFinalizado.bind(this)
    this.showSuccessMessage = this.showSuccessMessage.bind(this)
    this.clearErros = this.clearErros.bind(this)
  }


 componentDidMount(){
  // this.setState( {isLoading: true} )    
  this.getDadosBasicos() 
  this.hasCadastroFinalizado()
  this.getEstados()
  if(this.state.estado_id>0) this.getCidades(this.state.estado_id)
  this.getAreas()
  this.getTipoAnexos()
 }

 showSuccessMessage(message){
  this.props.alert.success(message)
 }

 async hasCadastroFinalizado(){
   if(this.state.pe_juridica_id>0){
    try {
      const {resp} = await handleRequest('users/hasCadastroFinalizado/'+this.state.pe_juridica_id,{},'GET',null, this)
      if(resp) this.setState({redirectToPainel: true})
    } catch (error) {
      this.handleErrors(error)
    }
   }
 }

 populateTipoAnexo(){
  if(this.state.dataTipoAnexo.length!==0){
    this.tipoAnexoSelect = this.state.dataTipoAnexo.map((e, key) => {
      if(e.value !== 2 && e.value !== 3){
        return <option key={key} value={e.value}>{e.name}</option>
      }
      return <option key={key} disabled>{e.name}</option>
    })
  }
 }

 handleErrors = (err) => {
  this.setState({hasErrors: true, errors: err, isLoading: false})
}

 handleClose() {
  this.setState({ show: false })
}

async handleShow(id) {
  try {
     await handleRequest('users/'+id, {}, 'GET', 'currentDirigenteViewing', this)
    this.setState({ show: true })  
  } catch(error) {
    console.error('erro(getDirigenteById)',error)
    this.handleErrors(error)
  }
}

 handleSelect(key) {
  this.setState({ key })
  if(key === 2){
    this.setState({ subKey: 1 })
  }else if(key===3){
    this.setState({ subKey: 4 })
  }else if(key===4){
    this.setState(() => {return { subKey: 6 }})
  }
  this.controlSteps(key)
}

handleInnerTabs(subKey) {
  this.setState({ subKey })
  if(subKey===7)
    this.setState({canGoBack: true, canGoNext: false, canFinishForm: true})
  else
    this.setState({canGoBack: true, canGoNext: true, canFinishForm: false})
}

 controlSteps(key) {
   const subKeyTemp = this.state.subKey
  switch (key) {
    case this.state.steps.INTRO:
      this.setState({canGoBack: false, canGoNext: true, btnNextText: 'AVANÇAR PARA A ETAPA 1 - DADOS BÁSICOS', canFinishForm: false})
      break
    case this.state.steps.DIRETORIA:
      this.setState({canGoBack: true, canGoNext: (subKeyTemp<=6), btnNextText: 'AVANÇAR', canFinishForm: false})
      break         
    default:
      this.setState({canGoBack: true, canGoNext: true, btnNextText: 'AVANÇAR', canFinishForm: false})
      break
  }
 }

 goNextStep(){
  if(this.state.canGoNext){
    if(this.state.key === 2 && this.state.subKey !== 3){
      this.handleInnerTabs(parseInt(this.state.subKey+1))
    }else if(this.state.key === 3 && this.state.subKey !== 5){
      this.handleInnerTabs(parseInt(this.state.subKey+1))
    }else if(this.state.key === 4 && this.state.subKey !== 7){
      this.handleInnerTabs(parseInt(this.state.subKey+1))
    }else
      this.handleSelect(this.state.key+1)
  }
}

goBackStep(){
  if(this.state.canGoBack){
    if(this.state.key === 2 && this.state.subKey !== 1){
      this.handleInnerTabs(parseInt(this.state.subKey-1))
    }else if(this.state.key === 3 && this.state.subKey !== 4){
      this.handleInnerTabs(parseInt(this.state.subKey-1))
    }else if(this.state.key === 4 && this.state.subKey !== 6){
      this.handleInnerTabs(parseInt(this.state.subKey-1))
    }
    else
      this.handleSelect(this.state.key-1)
  }
}

 async editONG() {
    if( this.confirmEmails() ){
      const ongBody = {}
      ongBody.telefone_contato = this.state.telefone_contato || ''
      ongBody.email_contato = this.state.email_contato || ''
      ongBody.lista_sub_areas = this.state.selectSubAreas.map( (v, i) => {return v.id} )
      ongBody.estatuto_social = this.state.estatuto_social || ''
      ongBody.mandato_inicio = this.state.mandato_inicio || ''
      ongBody.mandato_fim = this.state.mandato_termino || ''
    try{
        await handleRequest('pe_juridica/'+this.state.pe_juridica_id,ongBody,'PUT', null, this)        
        this.showSuccessMessage("Cadastro finalizado com sucesso!")
        this.hasCadastroFinalizado()
      }catch(err){
        console.log(err)
        this.handleErrors(err)
      }
    }
  }

  async addDirigente(event){
    event.preventDefault()
    const dirigenteBody = {}
      dirigenteBody.cpf = this.state.cpf_dirigente
      dirigenteBody.nome_completo = this.state.nome_completo_dirigente
      dirigenteBody.rg = this.state.rg_dirigente
      dirigenteBody.orgao_expedidor_rg = this.state.orgao_expedidor_rg_dirigente
      dirigenteBody.cargo_funcao = this.state.cargo_funcao_dirigente
      dirigenteBody.cep = this.state.cep_dirigente
      dirigenteBody.celular = ''
      dirigenteBody.logradouro = this.state.logradouro_dirigente
      dirigenteBody.numero = this.state.numero_dirigente
      dirigenteBody.bairro = this.state.bairro_dirigente
      dirigenteBody.email = this.state.email_dirigente
      dirigenteBody.email_coorporativo = this.state.email_coorporativo_dirigente
      dirigenteBody.data_entrada_diretoria = this.state.data_entrada_diretoria_dirigente
      dirigenteBody.data_saida_diretoria = this.state.data_saida_diretoria_dirigente
      dirigenteBody.cidade_id = this.state.cidade_id
      dirigenteBody.estado_id = this.state.estado_id
      dirigenteBody.fl_credenciador = this.state.fl_credenciador || false
      dirigenteBody.fl_em_exercicio = this.state.fl_em_exercicio || false
      dirigenteBody.fl_responsavel_legal = this.state.fl_responsavel_legal || false
      
      // ValidateForm(dirigenteBody, ['cpf','nome_completo','rg','orgao_expedidor_rg', ])
    if(dirigenteBody.cpf && validarCpf(dirigenteBody.cpf)){
      // this.setState( {isLoading: true} )
      
        try {
          if(!dirigenteBody.fl_credenciador)
            await handleRequest('pessoa/dirigente',dirigenteBody,'POST',null,this)
          else
            await handleRequest('pessoa/dirigente/'+this.state.pe_juridica_id,dirigenteBody,'PUT',null,this)
          
          document.getElementById('cpf_dirigente_field').disabled = false
          document.getElementById('rg_dirigente_field').disabled = false
          document.getElementById('orgao_expedidor_rg_dirigente_field').disabled = false
          document.getElementById('email_dirigente').disabled = false
          document.getElementById('confirm_email_dirigente').disabled = false
          if(dirigenteBody.fl_credenciador) document.getElementById('fl_credenciador').click()
          if(dirigenteBody.fl_responsavel_legal) document.getElementById('fl_responsavel_legal').click()
          if(dirigenteBody.fl_em_exercicio) document.getElementById('fl_em_exercicio').click()
          this.setState({
            cpf_dirigente: '', nome_completo_dirigente: '', rg_dirigente: '', orgao_expedidor_rg_dirigente: '',
            cargo_funcao_dirigente: '', cep_dirigente: '', logradouro_dirigente: '', numero_dirigente: '',
            bairro_dirigente: '', email_dirigente: '', email_coorporativo_dirigente: '', data_entrada_diretoria_dirigente: '',
            data_saida_diretoria_dirigente: '', cidade_id: '', estado_id: '', fl_credenciador: false,
            fl_responsavel_legal: false, fl_em_exercicio: false, confirm_email_dirigente: '', confirm_email_coorporativo_dirigente: ''
          })
          this.showSuccessMessage("Pessoa cadastrada com sucesso!")
          if(dirigenteBody.fl_credenciador){
            await this.getCredenciador()
            await this.getDadosBasicos()
          } else {
            this.getDirigentes()
          }
        } catch(err) {
          this.handleErrors(err)          
        }
    }else{
      this.props.alert.error("CPF inválido ou inexistente!")
    }
  }

  async getCredenciador(){
    try {
      const credenciador = await handleRequest('users/me_full',{},'GET',null,this)
      sessionStorage.setItem('user',JSON.stringify(credenciador))
    } catch(err) {
      this.handleErrors(err)
    }
  }

  async getDadosBasicos() {
      const user = JSON.parse(sessionStorage.getItem('user'))
      await this.setState( { user_credenciador: user.fl_credenciador, cpf: (user.pe_fisica) ? user.pe_fisica.cpf : '' , rg: (user.pe_fisica) ? user.pe_fisica.rg : '', orgao_expedidor_rg: user.pe_fisica && user.pe_fisica.orgao_expedidor_rg, email: user.email, cidadeNome: user.pe_juridica.pessoa.cidade && user.pe_juridica.pessoa.cidade.ct_nome, estadoNome: user.pe_juridica.pessoa.cidade && user.pe_juridica.pessoa.cidade.estado.uf_uf } ) 
      await this.setState( { pe_juridica_id: user.pe_juridica.id, cnpj: user.pe_juridica.cnpj, razao_social: user.pe_juridica.razao_social, nome_fantasia: user.pe_juridica.nome_fantasia, data_abertura: user.pe_juridica.data_abertura } )
      await this.setState( { pessoa_id: user.pe_juridica.pessoa.id, logradouro: user.pe_juridica.pessoa.logradouro, numero: user.pe_juridica.pessoa.numero, bairro: user.pe_juridica.pessoa.bairro, cep: user.pe_juridica.pessoa.cep, telefone: user.pe_juridica.pessoa.telefone, celular: user.pe_juridica.pessoa.celular } )
      await this.getAnexos(1)
      await this.getAnexos(2)
      await this.getDirigentes()
      this.setState( {isLoading: false} )   
      
  }

 onChange(e){   
   const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  //  this.setState({[e.target.name]:((e.target.value+"").toUpperCase())})
   if(e.target.name === 'estado_id' && e.target.value !== ''){
    this.setState({estado_id_previous: e.target.value})
    this.getCidades(e.target.value)
   }
   
   if(e.target.name === 'fl_credenciador' && target.checked){
    this.setState({cpf_dirigente: this.state.cpf, rg_dirigente: this.state.rg, orgao_expedidor_rg_dirigente: this.state.orgao_expedidor_rg, email_dirigente: this.state.email, confirm_email_dirigente: this.state.email})
    document.getElementById('cpf_dirigente_field').disabled = true
    document.getElementById('rg_dirigente_field').disabled = true
    document.getElementById('orgao_expedidor_rg_dirigente_field').disabled = true
    document.getElementById('email_dirigente').disabled = true
    document.getElementById('confirm_email_dirigente').disabled = true
   }else if(e.target.name === 'fl_credenciador' && !target.checked){
     this.setState({cpf_dirigente: '', rg_dirigente: '', orgao_expedidor_rg_dirigente: '', email_dirigente: '', confirm_email_dirigente: ''})
    document.getElementById('cpf_dirigente_field').disabled = false
    document.getElementById('rg_dirigente_field').disabled = false
    document.getElementById('orgao_expedidor_rg_dirigente_field').disabled = false
    document.getElementById('email_dirigente').disabled = false
    document.getElementById('confirm_email_dirigente').disabled = false
   }
  }
  
  async getEstados(){    
    try {
      await handleRequest('estado', {}, 'GET', 'dataUf', this)  
    } catch(err) {
      this.handleErrors(err)
    }
  }

  async getCidades(estado_id){
    console.error('getCidades')
    try {
      await handleRequest('cidade/estado/'+estado_id, {}, 'GET', 'dataCidade', this)
    } catch(err) {
      this.handleErrors(err)
    }
  }

  async handleUploadFile(ev, tipo) {
    ev.preventDefault()    
    
    if((tipo === 1) && (this.state.tipo_anexo_id===null || this.state.tipo_anexo_id === "")){
      // this.props.alert.error("Error! A tipo do anexo é um campo obrigatório.")
      this.handleErrors([{message: "Error! A tipo do anexo é um campo obrigatório."}])
    }else if((this.state.filename === null) || (this.state.filename).trim() === ""){
      this.handleErrors([{message: "Error! A descrição do arquivo é um campo obrigatório."}])
    }else if((tipo !== 2 && (this.uploadInput1.files[0] === undefined)) || (tipo === 2 && (this.uploadInput2.files[0]===undefined))){
      this.handleErrors([{message: "Error! O arquivo é um campo obrigatório."}])
    }else{
      this.setState( {isLoading: true} )
      const data = new FormData()
      if(tipo !== 2) data.append('file', this.uploadInput1.files[0])
      else if(tipo === 2) data.append('file', this.uploadInput2.files[0])
      else throw(new Error({title: "ERROR", message: "PROBLEMA COM O ARQUIVO"}))
      tipo = ((tipo === 1) ? this.state.tipo_anexo_id : ((tipo === 2) ? tipo : 1))
      // this.setState( { tipo_anexo_id: tipo} )
      data.append('filename', this.state.filename)
      data.append('pessoa_id', this.state.pessoa_id)
      data.append('tipo_anexo_id', tipo)
      try{
        await fetch(config.server_url+'pessoa/upload', {method: 'POST', body: data})
        this.setState( {isLoading: false} )
        this.showSuccessMessage("Arquido enviado com sucesso!")
        this.resetForm( (tipo!==2 ? 1 : 2) )
        this.getAnexos( (tipo!==2 ? 1 : 2) )
      }catch(err){
        console.log('arquivos', err)
          this.handleErrors(err)
      }
    }
  }

  convertTime(created) {
    let date = new Date(created)
    return date
  }

  async getAnexos(tipo_anexo){
    try {
        if(tipo_anexo===1) tipo_anexo = -1
        const anexosTmp = await handleRequest('anexo/pessoa/'+this.state.pessoa_id+"/"+tipo_anexo, {}, 'GET', null, this)  
      if(tipo_anexo === -1){    
        this.setState((anexos_estatuto) => {
          return {anexos_estatuto: anexosTmp}
      })
      }else if(tipo_anexo === 2){
        this.setState((anexos_ata) => {
          return {anexos_ata: anexosTmp}
        })
      }
      let tempAnexos = this.state.updateAnexos
      tempAnexos[tipo_anexo-1] = false
      this.setState({updateAnexos: tempAnexos, isLoading: false})
    } catch (err) {
        this.handleErrors(err)
    }
  }

  async deletarAnexo(id, tipo){
    this.setState( {isLoading: true} )
    try{
      await DeleteData('anexo/'+id, {}, true)
      await this.getAnexos(tipo)
      this.setState( {isLoading: false} )
      this.showSuccessMessage("Arquivo deletado com sucesso!")
    }catch(err){
      this.handleErrors(err)
    }
  }

  async deletarDirigente(id, tipo){
    this.setState( {isLoading: true} )
    try{
      await DeleteData('users/dirigentes/'+id, {}, true)
      await this.getDirigentes()
      this.setState( {isLoading: false} )
      this.showSuccessMessage("Dirigente deletado com sucesso!")
    }catch(err){
      this.handleErrors(err)
    }
  }

  deletarAnexoConfirm(id, tipo){
    const id_tmp = id
    const tipo_tmp = tipo
    confirmAlert({
        title: 'ATENÇÃO',                        
        message: 'Você realmente deseja apagar esse registro?',               
        childrenElement: () => '',       
        confirmLabel: 'Apagar',                          
        cancelLabel: 'Cancelar',                            
        onConfirm: () => this.deletarAnexo(id_tmp, tipo_tmp),    
        onCancel: () => '',      
      })
    
  }

  async downloadAnexo(id){
    try {
      const result = await handleRequest('anexo/download/'+id, {}, 'GET', null, this)
      return result
    } catch (err) {
      this.handleErrors(err)
    }
  }
  clearErros(){
    this.setState({hasErrors: false, erros: null, isLoading: false})
  }

  onChangeDate = (name, date) => {
    this.setState({ [name]: date })
  }

  resetForm(tipo){
    document.getElementById('formUploadFile'+tipo).reset()
    if(tipo===1) 
      this.uploadInput1.value = ""
    else
      this.uploadInput2.value = ""
    this.setState({filename: '', tipo_anexo_id: ''})
  }

  async getAreas(){
    try {
      await handleRequest('area/', {}, 'GET', 'areasAtuacao', this)
      
      this.areas = this.state.areasAtuacao.map((elem, key) => {
        return <PanelGroup key={"areasAtuacao"+key} accordion id={'areas-'+elem.id}>
          <Panel eventKey={elem.id}>
            <Panel.Heading>
            <Panel.Title toggle>{elem.cod+" - "+elem.descricao} <Glyphicon glyph="chevron-down" className="text-primary pull-right"/><span className="primary badge pull-right mr5" id={'areaCount'+this.state.areasAtuacao[key].id}></span></Panel.Title>
            </Panel.Heading>
            <Panel.Body collapsible>
              {this.getSubAreas(elem.Sub_areas, key, elem.cod)}
            </Panel.Body>
          </Panel>
          </PanelGroup>
      })
    } catch (err) {
      this.handleErrors(err)
    }
}

async getTipoAnexos(){
  try {
    await handleRequest('tipo_anexo', {}, 'GET', 'dataTipoAnexo', this)
    await this.populateTipoAnexo()
  } catch(err) {
    this.handleErrors(err)
  }
  }

async getDirigentes(){
  try {
    const result = await handleRequest('users/dirigentes/'+this.state.pe_juridica_id, {}, 'GET', null, this)
    let listaDirigentesTMP = []
    result.forEach(e => {
      // if(e.pe_fisica.pessoa.nome !== "" && e.pe_fisica.pessoa.nome !== null && e.pe_fisica.pessoa.nome !== undefined)
        listaDirigentesTMP.push(e)
    })
    this.setState((dirigentesList) => {
      return {dirigentesList: listaDirigentesTMP}
    })
  } catch(err){
    this.handleErrors(err)
  }
}

showDirigente(){
  
}

  confirmEmails(){
    if(this.state.confirm_email_dirigente === this.state.email_dirigente){
      if(this.state.email_coorporativo_dirigente){
        if(this.state.confirm_email_coorporativo_dirigente === this.state.email_coorporativo_dirigente)
          return true
        else{
          this.props.alert.error("Erro: E-mails corporativos não conferem. Tente novamente.")
          return false
        }  
      } 
      return true
    } else{
      this.props.alert.error("Erro: E-mails não conferem. Tente novamente.")
      return false
    }
  }
  
  selectSubArea = async (areaKey, subAreaKey, event, callback) => {
    let selectSubAreaTmp = this.state.areasAtuacao[areaKey].Sub_areas[subAreaKey]
    
    let contObj = document.getElementById('areaCount'+this.state.areasAtuacao[areaKey].id)
    let cont = parseInt(contObj.innerText)

    if(selectSubAreaTmp){
      selectSubAreaTmp.title = this.state.areasAtuacao[areaKey].cod + '.' + (subAreaKey+1)
      var listaTmp = []
      if(this.state.selectSubAreas.length === 0) {
        listaTmp.push(selectSubAreaTmp)
        this.setState( (selectSubAreas) => {
          return {selectSubAreas: listaTmp}
        })
        contObj.innerText = (contObj.innerText === '') ? '1' : cont+1
        await callback("subarea"+selectSubAreaTmp.id, 'panel panel-success hover', true)
      }else {
        listaTmp = this.state.selectSubAreas.find( x => x.id === selectSubAreaTmp.id )
        if(listaTmp === undefined){
          listaTmp = this.state.selectSubAreas
          listaTmp.push(selectSubAreaTmp)
          contObj.innerText = (contObj.innerText === '') ? '1' : cont+1
          await callback("subarea"+selectSubAreaTmp.id, 'panel panel-success hover', true)
        }else{
          listaTmp = this.state.selectSubAreas.filter( x => x.id !== listaTmp.id )
          contObj.innerText = (contObj.innerText === '') ? '1' : (cont-1!==0 ? cont-1 : '')
          await callback("subarea"+selectSubAreaTmp.id, 'panel panel-default hover', false)
        }
        this.setState( (selectSubAreas) => {
          return {selectSubAreas: listaTmp} 
        })  
      }
    }
  }

  setClass(objId, className, flag){
    let objTemp = document.getElementById(objId)
    objTemp.className = className
    let objTemp2 = document.getElementById(objId+'Heading')
    let html = objTemp2.innerText
    objTemp2.innerHTML = (flag) ? '<span className="text-success glyphicon glyphicon-check"></span> ' + html : html    
  }

  getSubAreas = (lista, areaKey, areaCod) => {
    return lista.map( (elem, key) => {
      return <div id={'subarea'+elem.id} key={key} onClick={ el => this.selectSubArea(areaKey, key, el, this.setClass)} className="panel panel-default hover">
            <div id={'subarea'+elem.id+'Heading'} className="panel-heading">
              {(areaCod)+"."+(key+1)+" "+elem.descricao}
            </div>
          </div>
    })
  }

  render() {
    // if(this.state.redirectToUpload) return (<Redirect to={{pathname: '/pessoa_upload',  state: {pessoa_id: this.state.pessoa_id}}} />)
    // if(this.state.redirectToNext) return (<Redirect to={{pathname: '/ativacao_user/success'}} />)
    if (this.state.redirectToReferrer)// || sessionStorage.getItem('userData')) {
      return (<Redirect to={'/'}/>)    
    if(this.state.redirectToPainel) 
      return (<Redirect to={'/plano_trabalho/form'}/>)
    // if(this.state.redirectToUnauthorizationUser){
    //   RequestData('authenticate/logout', {}, "get")
    //   sessionStorage.setItem("user",'')
    //   sessionStorage.setItem("token",'')
    //   sessionStorage.clear()
    //   return (<Redirect to={'/login'}/>)
    // }

    if(this.state.updateAnexos){
      if(this.state.updateAnexos[0]){
        this.getAnexos(1)
      } 
      if(this.state.updateAnexos[1]) {
        this.getAnexos(2)
      }
    }

    let ufSelect = []
    let cidadeSelect = []
    let subAreas = []
    if(this.state.dataUf){
      ufSelect = this.state.dataUf.map((e, key) => {
        return <option key={key} value={e.value}>{e.name}</option>
      })
    }
    if(this.state.selectSubAreas){
      subAreas = this.state.selectSubAreas.map((elem, key) => {
        return <p key={"subAreasSelected"+key}><Glyphicon glyph="check" className="text-success"/> {elem.title+' - '+elem.descricao}</p>
      })
    }

    if(this.state.estado_id!=='' && this.state.estado_id===this.state.estado_id_previous){
      if(this.state.dataCidade.length === 0 && this.state.hasAccess) this.getCidades(this.state.estado_id)
      cidadeSelect = this.state.dataCidade.map((e, key) => {
        return <option key={key} value={e.value}>{e.name}</option>
      })
    }

    return (
      <div className="row">
        {/* <SimpleStorage parent={this} blacklist={['redirectToReferrer','redirectToPainel', 'redirectToUnauthorizationUser','mandato_inicio','mandato_termino','data_entrada_diretoria_dirigente','data_saida_diretoria_dirigente']}/> */}
        <Loader isLoading={this.state.isLoading}/>  
        {(this.state.hasErrors) ? <ErrorsHandle errors={this.state.errors} callback={this.clearErros}/> : null}
      <div className="page-header"><h1>Cadastro de Organização Não Governamental <small>(ONG)</small></h1>
      <h6><Badge className="primary">ONG</Badge> {this.state.cnpj} {this.state.razao_social}</h6>
      </div>
        {(subAreas.length>0 && this.state.key===2 && this.state.subKey===3) ? <Panel className="box-fixed">

          <Panel.Heading><b>Áreas de Atuações Selecionadas</b></Panel.Heading>
          <Panel.Body className="box-scrolling">{subAreas}</Panel.Body>
        </Panel> : null}
      <Tabs
        activeKey={this.state.key}
        onSelect={(this.state.canSelectByClicking ? this.handleSelect : null)}
        id="controlled-tab-example"
      >
        <Tab eventKey={1} title="Introdução">
        <div className="col-md-12 col-lg-12 col-sm-12">
          <h4><Badge className="primary"><Glyphicon glyph="pencil" /></Badge> VAMOS CADASTRAR UMA ONG?</h4>
          <p>Leia o processo a seguir:</p>

        <Button className="btn-primary" onClick={this.goNextStep}>JÁ CONHEÇO O PROCESSO, QUERO PROSSEGUIR</Button>
        <h3>Resumo do Processo de Cadastramento de uma ONG</h3>
        <p>Para o cadastro serão necessárias 03 etapas. Veja a descrição delas,
          assim como as informações e documentos que você deve ter em maõs
          para cada uma das etapas:</p>
          <div className="col-sm-6">
          <div className="well">
            <h5><Badge className="primary">1</Badge> Dados Básicos</h5>
            <p>Confirme ou informe os seguintes dados da ONG:</p>
            <ul>
              <li>Endereço</li>
              <li>Telefone e e-mail de contato</li>
              <li>Área(s) de atuação</li>
            </ul>
            <h5><Badge className="primary">2</Badge> Estatuto</h5>
            <ul>
              <li>Informar o Objeto do Estatuto Social da ONG</li>
              <li>Fazer o upload do estatuto</li>
            </ul>
            </div>
          </div>
          <div className="col-sm-6">
          <div className="well">          
          <h5><Badge className="primary">3</Badge> Diretoria</h5>
            <p>Cadastre a Diretoria e os direngentes que a compõe. Para isso você deverá:</p>
            <ul>
              <li>Informar datas de início e término do mandato da diretoria</li>
              <li>Fazer o upload da ata de eleição da diretoria</li>
              <li>Informar sobre os dirigentes:</li>
              <ul>
                <li>CPF</li>
                <li>RG</li>
                <li>Cargo ou função</li>
                <li>Email</li>
                <li>E-mail Corporativo</li>
                <li>Data de entrada e término na diretoria</li>
                <li>Indicar se dirigente é um Representante Legal.</li>
              </ul>
            </ul>
            <p>Um e-mail será enviado a cada dirigente para ativação da conta no sistema</p>
          </div>
          </div>
        </div>
        </Tab>
        <Tab eventKey={2} title="1. Dados Básicos">
        <div className="col-md-12 col-lg-12 col-sm-12">
        <Tabs id="tabs1" defaultActiveKey="1" activeKey={this.state.subKey} 
        onSelect={(this.state.canSelectByClicking ? this.handleInnerTabs : null)}
        >
          <Tab eventKey={1} title="1.1 Identificação">
            <div className="col-md-12">
              <h4>Confirme os dados extraídos da Receita Federal</h4>
              {/* CNPJ */}
              <FormGroup controlId="cnpj_view" bsSize="large">
                <ControlLabel className="text-primary">CNPJ:</ControlLabel>
                <p>{this.state.cnpj}</p>
              </FormGroup>
              {/* RAZAO SOCIAL */}
              <FormGroup controlId="razao_social_view" bsSize="large">
                <ControlLabel className="text-primary">Razão Social:</ControlLabel>
                <p>{this.state.razao_social}</p>
              </FormGroup>
              {/* NOME FANTASIA */}
              <FormGroup controlId="nome_fantasia_view" bsSize="large">
                <ControlLabel className="text-primary">Nome Fantasia:</ControlLabel>
                <p>{this.state.nome_fantasia}</p>
              </FormGroup>
              {/* DATA ABERTURA */}
              <FormGroup controlId="data_abertura_view" bsSize="large">
                <ControlLabel className="text-primary">Data de abertura do CNPJ:</ControlLabel>
                <Moment element="p" format="D/MM/Y">
                    {this.state.data_abertura}
                </Moment>
              </FormGroup>
              {/* <Alert variant="info">
                <p>
                  Se os dados estiverem desatualizados, dirija-se à Receita Federal para atualização.
                </p>
              </Alert> */}
            </div>
          </Tab>
          <Tab eventKey={2} title="1.2 Contato">
            <div className="col-md-12">
            <h4>Confirme o endereço e informe dados de contato</h4>
              {/* ENDERECO COMPLETO */}
              <FormGroup controlId="cnpj_view" bsSize="large">
                <ControlLabel className="text-primary">Endereço:</ControlLabel>
                <p>{this.state.logradouro+", "+this.state.numero+" - "+this.state.bairro+". " +this.state.cidadeNome+" - "+this.state.estadoNome+". CEP: "+this.state.cep}</p>
              </FormGroup>
            {/* <Alert variant="info">
                <p>
                  Se os dados estiverem desatualizados, clique aqui para atualizar.
                </p>
              </Alert> */}
              <h4>Informe telefone e e-mail para contato</h4>
              {/* TELEFONE CONTATO */}
              <FormGroup controlId="telefone_contato" bsSize="large">
                <ControlLabel><Required/> Telefone</ControlLabel>
                <InputMask className="form-control"type="text" name="telefone_contato" mask="(99) 99999-9999" maskChar={null} value={this.state.telefone_contato || ''} placeholder="Exemplo: (88) 99999-0000" onChange={this.onChange.bind(this)}/>
              </FormGroup>
              {/* EMAIL CONTATO */}
              <FormGroup controlId="email_contato" bsSize="large">
                <ControlLabel><Required/> E-mail</ControlLabel>
                <FormControl className="form-control" type="text" name="email_contato"value={this.state.email_contato || ''} placeholder="Exemplo: nomeemail@provedor.com.br" onChange={this.onChange.bind(this)}/>
              </FormGroup>       
      
        {/* REQUIRE FIELD */}
        <p><Required label="Campos obrigatórios"/><br></br></p>
        {/* BUTTON SUBMIT */}
        {/* <Button bsStyle="primary" type="button" disabled={this.state.isLoading} onClick={this.editONG.bind(this)}><Glyphicon glyph="check" /> {(this.state.isLoading) ? (' CARREGANDO...') : 'CONFIRMAR OS DADOS DESTE FORMULÁRIO' }</Button> */}
            </div>
          </Tab>
          <Tab eventKey={3} title="1.3 Áreas de Atuação">
            <h5>Selecione a(s) área(s) de atuação</h5>
            <div className="col-md-6">{this.areas}</div>
          </Tab>
        </Tabs>
      
        </div>
        </Tab>
        <Tab eventKey={3} title="2. Habilitação">
        <Tabs id="areas3" defaultActiveKey="4" activeKey={this.state.subKey} 
        onSelect={(this.state.canSelectByClicking ? this.handleInnerTabs : null)}
        >
        <Tab eventKey={4} title="2.1 Objeto do Estatuto Social">
            {/* Objeto do Estatuto */}
            <FormGroup controlId="estatuto_social" bsSize="large">
              <ControlLabel><Required/> Informe o Objeto do Estatuto Social</ControlLabel>
              <textarea name="estatuto_social" value={this.state.estatuto_social} className="form-control" onChange={this.onChange.bind(this)}></textarea>
            </FormGroup>
          </Tab>
          <Tab eventKey={5} title="2.2 Upload de Documentos">
            <div>
            <form id="formUploadFile1" onSubmit={event => this.handleUploadFile(event, 1)}>
            {/* Tipo de Anexos */}
            <FormGroup controlId="formControlsSelect" bsSize="large">
              <ControlLabel><Required/> Tipo Anexo</ControlLabel>
              <FormControl componentClass="select" name="tipo_anexo_id" onChange={this.onChange}>
                <option value="">Selecione o tipo de anexo</option>
                {this.tipoAnexoSelect}
              </FormControl>
               {/* Descricao do Arquivo */}
            <FormGroup controlId="descricao_arquivo" bsSize="large">
              <ControlLabel><Required/> Descrição do Arquivo</ControlLabel>
              <FormControl type="text" name="filename" onChange={this.onChange.bind(this)}/>
            </FormGroup>
            </FormGroup>
            {/* Descricao do Arquivo */}
            <FormGroup controlId="descricao_arquivo" bsSize="large">
              {/* <ControlLabel><Required/> Selecione o arquivo:</ControlLabel> */}
              <input id="file" ref={(ref) => { this.uploadInput1 = ref }} type="file" className="inputfile" onChange={this.onChange}/>
              <label className="btn" htmlFor="file">Selecione seu arquivo</label> {(this.uploadInput1 !== undefined && this.uploadInput1.files !==undefined && this.uploadInput1.files.length > 0 ) ? <i> {this.uploadInput1.files[0].name} </i> : 'Arquivo não selecionado'}
              <br></br><span>Os formatos permitidos são: PDF, JPG, GIF, PNG</span>
            </FormGroup>
               
        <div>
         {/* disabled={this.state.hasSubmited}  */}
          <Button bsStyle="primary" type="submit">Salvar Anexo</Button>
        </div>
        
      </form>
            {/* table */}
            {(this.state.anexos_estatuto) ? <AnexoList tipo={1} serverUrl={this.state.serverUrl} feedData={this.state.anexos_estatuto} convertTime={this.convertTime} deletarAnexo={this.deletarAnexoConfirm} downloadAnexo={this.downloadAnexo}/> : null}
            
            </div>
          </Tab>
        </Tabs>
        </Tab>
        <Tab eventKey={4} title="3. Diretoria">
        <Tabs id="areas4" defaultActiveKey="6" activeKey={this.state.subKey} 
        onSelect={(this.state.canSelectByClicking ? this.handleInnerTabs : null)}
        >
        <Tab eventKey={6} title="3.1 Mandato">
            <div>
              <h4>Informe os dados da diretoria</h4>
              <p>Informe a data de início e término do mandato atual:</p>
            {/* Data de Inicio Mandato */}
            <div className="col-md-6 col-sm-12 col-lg-6">
            <FormGroup controlId="mandato_inicio" bsSize="large">
                <ControlLabel><Required/> Início</ControlLabel>
                <InputMask className="form-control" type="text" name="mandato_inicio" onChange={this.onChange} mask="99/99/9999" maskChar={null}/>
                {/* <DatePicker onChange={this.onChangeDate.bind(this, 'mandato_inicio')} name="mandato_inicio" value={this.state.mandato_inicio} locale="pt-br" calendarIcon={<span className="fa fa-calendar"></span>} className="form-control" showLeadingZeros={true} /> */}
            </FormGroup>
            </div>
            <div className="col-md-6 col-sm-12 col-lg-6">
            {/* Data de Termino Mandato */}
            <FormGroup controlId="mandato_termino" bsSize="large">
                <ControlLabel><Required/> Término</ControlLabel>
                <InputMask className="form-control" type="text" name="mandato_termino" onChange={this.onChange} mask="99/99/9999" maskChar={null}/>
                {/* <DatePicker onChange={this.onChangeDate.bind(this, 'mandato_termino')} name="mandato_termino" value={this.state.mandato_termino} locale="pt-br" calendarIcon={<span className="fa fa-calendar"></span>} className="form-control" showLeadingZeros={true} /> */}
            </FormGroup>
            </div>
            <p>Faça o upload do arquivo digitalizado da ata de eleição:</p>
            <form id="formUploadFile2" onSubmit={event => this.handleUploadFile(event, 2)}>
             {/* Descricao do Arquivo */}
            <FormGroup controlId="descricao_arquivo" bsSize="large">
              <ControlLabel><Required/> Descrição do Arquivo</ControlLabel>
              <FormControl type="text" name="filename" onChange={this.onChange.bind(this)}/>
            </FormGroup>
            {/* Descricao do Arquivo */}
            <FormGroup controlId="descricao_arquivo" bsSize="large">
              {/* <ControlLabel><Required/> Selecione o arquivo:</ControlLabel> */}
              {/* <span>Os formatos permitidos são: PDF, JPG, GIF, PNG, MPG, MPEG, AVI, TXT, ZIP</span> */}
              <input id="file2" ref={(ref) => { this.uploadInput2 = ref }} type="file" className="inputfile" onChange={this.onChange}/>
              <label className="btn" htmlFor="file2">Selecione seu arquivo</label> {(this.uploadInput2 !== undefined && this.uploadInput2.files !==undefined && this.uploadInput2.files.length > 0 ) ? <i> {this.uploadInput2.files[0].name} </i> : 'Arquivo não selecionado'}
              <br></br><span>Os formatos permitidos são: PDF, JPG, GIF, PNG</span>
            </FormGroup>                         
        <div>
         {/* disabled={this.state.hasSubmited}  */}
          <Button bsStyle="primary" type="submit">Salvar Anexo</Button>
        </div>
        </form>
            {/* table */}
            {(this.state.anexos_ata) ? <AnexoList tipo={2} serverUrl={this.state.serverUrl} feedData={this.state.anexos_ata} convertTime={this.convertTime} deletarAnexo={this.deletarAnexoConfirm} downloadAnexo={this.downloadAnexo}/> : null}
            </div>
            </Tab>
          <Tab eventKey={7} title="3.2 Dirigentes">
          <h5>Informe os dados abaixo para cadastrar os dirigentes</h5>
            <form id="form-dirigente" onSubmit={this.addDirigente.bind(this)}>
            <div className="col-md-12">
              <p>Para cadastrar os dirigentes, precisamos das seguintes informações</p>
              <div className="col-md-12">
              { (!this.state.user_credenciador) ? 
              <div className="col-md-6">
                <Alert variant="info">
                  <Checkbox id="fl_credenciador" name="fl_credenciador" value={this.state.fl_crendenciador} onChange={this.onChange} inline>Buscar meus dados</Checkbox>
                </Alert>
              </div>
              : null }
              <div className="col-md-6">
                <Alert variant="info">
                  <Checkbox id="fl_responsavel_legal" name="fl_responsavel_legal" value={this.state.fl_responsavel_legal} onChange={this.onChange} inline>Responsável Legal</Checkbox>
                </Alert>
              </div>
              <div className="col-md-6">
                <Alert variant="info">
                  <Checkbox id="fl_em_exercicio" name="fl_em_exercicio" value={this.state.fl_em_exercicio} onChange={this.onChange} inline>Em Exercício</Checkbox>
                </Alert>
              </div>
              </div>
              <div className="col-md-12">
              <div className="col-md-6">
                { /* NOME COMPLETO */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Nome</ControlLabel>
                  <FormControl type="text" name="nome_completo_dirigente" value={this.state.nome_completo_dirigente} onChange={this.onChange.bind(this)} required="required"/>
                </FormGroup>
              </div>
              <div className="col-md-6">
                {/* CPF */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> CPF</ControlLabel>
                  <InputMask id="cpf_dirigente_field" className="form-control" type="text" name="cpf_dirigente" value={this.state.cpf_dirigente || ''} onChange={this.onChange} mask="999.999.999-99" maskChar={null}  required="required"/>
                </FormGroup>
              </div>
              <div className="col-md-6">
                { /* RG */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> RG</ControlLabel>
                  <FormControl id="rg_dirigente_field" type="text" name="rg_dirigente" value={this.state.rg_dirigente || ''} onChange={this.onChange.bind(this)} required="required"/>
                </FormGroup>
              </div>
              <div className="col-md-6">
                { /* ORGAO EXPEDIDOR RG */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Órgão Expedidor</ControlLabel>
                  <FormControl id="orgao_expedidor_rg_dirigente_field" type="text" name="orgao_expedidor_rg_dirigente" value={this.state.orgao_expedidor_rg_dirigente || ''} onChange={this.onChange.bind(this)} required="required"/>
                </FormGroup>
              </div>
              <div className="col-md-6">
                { /* CARGO / FUNCAO */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Cargo/Função</ControlLabel>
                  <FormControl type="text" name="cargo_funcao_dirigente" value={this.state.cargo_funcao_dirigente} onChange={this.onChange.bind(this)} required="required"/>
                </FormGroup>
              </div>
              
              <div className="col-md-6">
                { /* CEP */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> CEP</ControlLabel>
                  <InputMask id="cep_dirigente" className="form-control" type="text" value={this.state.cep_dirigente} name="cep_dirigente" onChange={this.onChange} mask="99999-999" maskChar={null} required="required"/>
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

              <div className="col-md-12">
                { /* LOGRADOURO */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Logradouro</ControlLabel>
                  <FormControl type="text" name="logradouro_dirigente" value={this.state.logradouro_dirigente} onChange={this.onChange.bind(this)} required="required"/>
                </FormGroup>
              </div>

              <div className="col-md-6">
                { /* NUMERO */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Número</ControlLabel>
                  <FormControl type="text" name="numero_dirigente" value={this.state.numero_dirigente} onChange={this.onChange.bind(this)} required="required"/>
                </FormGroup>
              </div>

              <div className="col-md-6">
                { /* Bairro */}
                <FormGroup bsSize="large">
                  <ControlLabel><Required/> Bairro</ControlLabel>
                  <FormControl type="text" name="bairro_dirigente" value={this.state.bairro_dirigente} onChange={this.onChange.bind(this)} required="required"/>
                </FormGroup>
              </div>
            <div className="col-md-6">
              {/* EMAIL */}
              <FormGroup bsSize="large">
                <ControlLabel><Required/> E-mail</ControlLabel>
                <FormControl type="text" id="email_dirigente" name="email_dirigente" value={this.state.email_dirigente} onChange={this.onChange.bind(this)} required="required"/>
              </FormGroup>
            </div>
            <div className="col-md-6">
              {/* CONFIRMAR EMAIL */}
              <FormGroup bsSize="large">
                <ControlLabel><Required/> Confirmação do E-mail</ControlLabel>
                <FormControl type="text" id="confirm_email_dirigente" name="confirm_email_dirigente" value={this.state.confirm_email_dirigente} onChange={this.onChange.bind(this)} required="required"/>
              </FormGroup>
              </div>
            <div className="col-md-6">
              {/* EMAIL CORPORATIVO */}
              <FormGroup bsSize="large">
                <ControlLabel><Required/> E-mail Corporativo</ControlLabel>
                <FormControl type="text" name="email_coorporativo_dirigente" value={this.state.email_coorporativo_dirigente || ''} onChange={this.onChange.bind(this)} required="required"/>
              </FormGroup>
            </div>
            <div className="col-md-6">
              {/* CONFIRMAR EMAIL CORPORATIVO */}
              <FormGroup bsSize="large">
                <ControlLabel><Required/> Confirmação do E-mail Corporativo</ControlLabel>
                <FormControl type="text" name="confirm_email_coorporativo_dirigente" value={this.state.confirm_email_coorporativo_dirigente || ''} onChange={this.onChange.bind(this)} required="required"/>
              </FormGroup>
              </div>
              <div className="col-md-6">
                            {/* DATA ENTRADA NA DIRETORIA */}
                    <FormGroup bsSize="large">
                        <ControlLabel><Required/> Data de entrada na diretoria</ControlLabel>
                        {/* <InputMask className="form-control" type="text" name="data_entrada_diretoria_dirigente" value={this.state.data_entrada_diretoria_dirigente} onChange={this.onChange} mask="99/99/9999" maskChar={null} required="required"/> */}
                        <DatePicker onChange={this.onChangeDate.bind(this, 'data_entrada_diretoria_dirigente')} name="data_entrada_diretoria_dirigente" value={this.state.data_entrada_diretoria_dirigente} locale="pt-br" calendarIcon={<span className="fa fa-calendar"></span>} className="form-control" showLeadingZeros={true} />
                    </FormGroup>
              </div>
              <div className="col-md-6">
                            {/* DATA SAIDA PREVISTA */}
                    <FormGroup bsSize="large">
                        <ControlLabel><Required/> Data prevista de saída da diretoria</ControlLabel>
                        {/* <InputMask className="form-control" type="text" name="data_saida_diretoria_dirigente"  value={this.state.data_saida_diretoria_dirigente} onChange={this.onChange} mask="99/99/9999" maskChar={null} required="required"/> */}
                        <DatePicker onChange={this.onChangeDate.bind(this, 'data_saida_diretoria_dirigente')} name="data_saida_diretoria_dirigente" value={this.state.data_saida_diretoria_dirigente} locale="pt-br" calendarIcon={<span className="fa fa-calendar"></span>} className="form-control" showLeadingZeros={true} />
                    </FormGroup>
              </div>
              </div>
            </div>
            <div className="col-md-12"><button className="btn btn-primary pull-right" type="submit">INCLUIR ESTE DIRIGENTE</button>
            <div style={{clear: 'both'}}></div>
            </div>
            </form>
            <div>
            { (this.state.dirigentesList) ? <DirigenteList feedData={this.state.dirigentesList} delete={this.deletarDirigente} view={this.handleShow}/> : null }
            </div>
          </Tab>
        </Tabs>
        </Tab>
        <span>
        {(this.state.canGoBack) ? <Button onClick={this.goBackStep} className="btn-primary mr5">{this.state.btnBackText || 'VOLTAR'} </Button> : null}
        {(this.state.canGoNext) ? <Button onClick={this.goNextStep} className="btn-primary">{this.state.btnNextText || 'AVANÇAR'}</Button> : null}
        {(this.state.canFinishForm) ? <Button onClick={this.editONG} className="btn-primary">FINALIZAR CADASTRO</Button> : null}
        <div style={{clear: 'both'}}></div>
        </span>
      </Tabs>        
      <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Visualizando Dirigente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.pessoa.nome : null)}</h4>
            <p>
            {(this.state.currentDirigenteViewing ? (this.state.currentDirigenteViewing.fl_credenciador ? <span className="primary badge mr5" id="info-user1">Credenciador</span> : null
            ) : null)} 
            {(this.state.currentDirigenteViewing ? (this.state.currentDirigenteViewing.fl_em_exercicio ? <span className="primary badge mr5" id="info-user2">Em Exercício</span> : null
            ) : null)} 
            {(this.state.currentDirigenteViewing ? (this.state.currentDirigenteViewing.fl_responsavel_legal ? <span className="primary badge mr5" id="info-user3">Responsável Legal</span> : null
            ) : null)} 
            </p>
            <div>
            <p>
              CPF: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.cpf : null)}
            </p>
            <p>
              RG: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.rg : null)}
              </p>
              <p>
              Órgão Expedidor: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.orgao_expedidor_rg : null)}
              </p>
              <p>
              Cargo/Função: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.cargo_funcao || '' : null)}
              </p>
              <p>
              CEP: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.pessoa.cep : null)}
              </p>
              <p>
              UF: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.pessoa.estado.uf_nome || '' : null)}
              </p>
              <p>
              Município: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.pessoa.cidade.ct_nome || '' : null)}
              </p>
              <p>
              Endereço: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.pessoa.logradouro || '' : null)}, {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.pessoa.numero || '' : null)}, {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.pessoa.bairro : null)}
              </p>
              <p>
              CEP: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.pe_fisica.pessoa.cep : null)}
              </p>
              <p>
              E-mail: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.email : null)}
              </p>
              <p>
              E-mail Corporativo: {(this.state.currentDirigenteViewing ? this.state.currentDirigenteViewing.email_coorporativo : null)}
              </p>
              <p>
              Data Entrada na Diretoria: {(this.state.currentDirigenteViewing ? <Time value={this.state.currentDirigenteViewing.data_entrada_diretoria} format="DD/MM/YYYY"/> : null)}
              </p>
              <p>
              Data Saída na Diretoria: {(this.state.currentDirigenteViewing ? <Time value={this.state.currentDirigenteViewing.data_saida_diretoria} format="DD/MM/YYYY" /> : null)}
              </p>
              </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Fechar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default withAlert(CadastroONG)
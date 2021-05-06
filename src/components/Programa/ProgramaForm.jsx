import React, {Component} from 'react'
// import {RequestData} from '../../services/RequestData'
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
// import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle'

const config = require('../../config')

class ProgramaForm extends Component {

    constructor(props){
        super(props)
       
        this.state = {
         redirectToReferrer: false,
         isLoading: false,
         programas: []
        }
    
        this.savePrograma = this.savePrograma.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.setFormToEdit = this.setFormToEdit.bind(this)
      }
    
      async setFormToEdit(){
          this.setState(this.props.location.state && this.props.location.state.objeto)
      }

      async savePrograma(e, dados) {
        e.preventDefault()
        if(!this.props.location.state && this.uploadInput1 && !this.uploadInput1.files[0]) this.props.alert.error("É obrigatório inserir um arquivo!")
        else{
            this.setState( {isLoading: true} )
            const data = new FormData()
            data.append('file', this.uploadInput1.files[0])
            // this.setState( { tipo_anexo_id: tipo} )
            data.append('descricao', dados.descricao)
            data.append('exercicio', dados.exercicio)
            const token_saved = sessionStorage.getItem('token')
            console.log('token_saved', token_saved)
            const method_action = (this.props.location.state && this.props.location.state.objeto) ? "PUT" : "POST"
            const url_tratada = (method_action==="PUT") ? config.server_url+'programa/'+this.state.id : config.server_url+'programa'
            try{
                const result = await fetch(url_tratada, {method: method_action, body: data, headers: {token: token_saved}})
                // const result = await RequestData('programa',{}, 'post')
                // console.log('programaSaved', result)
                this.props.alert.success('Programa salvo com sucesso!')
                if(result) this.setState({programas: result.data, redirectToReferrer: true})
                else console.log('erro', result)
            } catch (error) {
            console.log(error)
            this.props.alert.error('Houve algum erro ao salvar o programa!')
            }
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
           if(this.props.location.state && this.props.location.state.edit) this.setFormToEdit()
        //funcoes caso precise pegar algo do back
       }
      onChange(e){
        this.setState({[e.target.name]:e.target.value})
       }
    
      render() {
        //redireciona para a rota de listagem
         if (this.state.redirectToReferrer) {
          return (<Redirect to={{ pathname: '/programas', state: {gotObj: null}}}/>)
        }
    
         return (
          <div className="row">
          <Loader isLoading={this.state.isLoading}/>  
            <div className="page-header">
                <h1>{this.props.location.state && this.props.location.state.objeto ? 'Editar' : 'Cadastrar'} <small>PROGRAMA</small><button className="btn btn-default btn-small pull-right" onClick={e => this.confirmBack(e)}><strong><i className="glyphicon glyphicon-chevron-left"></i> CANCELAR E VOLTAR</strong></button></h1>
            </div>
            <div id="controlled-tab-example" className="p-top">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <form onSubmit={(e)=> this.savePrograma(e,this.state)}>
                            <div className="col-md-4">
                                <FormGroup controlId="descricaoPrograma" bsSize="large">
                                    <ControlLabel><Required/> Descrição do Programa</ControlLabel>
                                    <FormControl type="text" name="descricao" value={this.state.descricao || ''} autoFocus placeholder="Ex.: Edital 0001/2019" onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="arquivoPrograma" bsSize="large">
                                    <ControlLabel><Required/> Arquivo</ControlLabel><br></br>
                                    <input id="file" ref={(ref) => { this.uploadInput1 = ref }} type="file" className="inputfile" onChange={this.onChange}/>
                                    <label className="btn" htmlFor="file">{(this.props.location.state && this.props.location.state.objeto) ? 'Substituir arquivo' : 'Selecione'}</label><br></br>{(this.uploadInput1 !== undefined && this.uploadInput1.files !==undefined && this.uploadInput1.files.length > 0 ) ? <i> {this.uploadInput1.files[0].name} </i> : 'Arquivo não selecionado'}
                                    <br></br><small>Os formatos permitidos são: PDF, JPG, GIF, PNG</small>
                                </FormGroup>                
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="exercicioPrograma" bsSize="large">
                                    <ControlLabel><Required/> Exercício do Programa</ControlLabel>
                                    <InputMask className="form-control" type="text" placeholder="Ex.: 2019" value={this.state.exercicio || ''} name="exercicio" onChange={this.onChange.bind(this)} mask="9999" maskChar={null} required/>
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

export default withAlert(ProgramaForm)
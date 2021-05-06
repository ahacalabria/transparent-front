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
import * as moment from 'moment';
import 'moment/locale/pt-br';
import BackHandle from '../Providers/BackHandle';
import { hasAtLeastOneGroup } from '../Providers/PermissionHandle';
// import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle'

// const config = require('../../config')

class ParecerForm extends Component {

    constructor(props){
        super(props)
       
        this.state = {
         redirectToReferrer: false,
         isLoading: false,
         canGerarConvenio: false,
         pareceres: [],
         avaliacao: null,
         parecer: this.props.location.state && this.props.location.state.objeto && this.props.location.state.objeto.parecer,
         tipo_parecer: this.props.location.state && this.props.location.state.objeto && this.props.location.state.objeto.tipo_parecer,
         idPlanoTrabalho: props.location.state && props.location.state.idPlanoTrabalho,
         ongId: props.location.state && props.location.state.ongId,
         nameOng: props.location.state && props.location.state.nameOng,
         descPlanoTrabalho: props.location.state && props.location.state.descPlanoTrabalho
        }
    
        this.saveParecer = this.saveParecer.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.setFormToEdit = this.setFormToEdit.bind(this)
        
      }
    
      async setFormToEdit(){
          this.setState(this.props.location.state && this.props.location.state.objeto)
      }

      async saveParecer(e, dados) {
        e.preventDefault()
        if(!this.props.location.state && this.uploadInput1 && !this.uploadInput1.files[0]) this.props.alert.error("É obrigatório inserir um arquivo!")
        else{
            // const data = new FormData()
            // data.append('file', this.uploadInput1.files[0])
            // this.setState( { tipo_anexo_id: tipo} )
            const parace_data = {}
            parace_data.plano_trabalho_id = dados.idPlanoTrabalho
            parace_data.avaliacao = dados.avaliacao
            parace_data.parecer = dados.parecer
            parace_data.tipo_parecer = dados.tipo_parecer

            // const token_saved = sessionStorage.getItem('token')
            // console.log('token_saved', token_saved)
            // const method_action = (this.props.location.state && this.props.location.state.objeto) ? "PUT" : "POST"
            // const url_tratada = (method_action==="PUT") ? config.server_url+'parecer/'+this.state.id : config.server_url+'parecer'
            try{
                // const result = await fetch(url_tratada, {method: 'POST', body: data, headers: {token: token_saved}})
                const result = await handleRequest('parecer',parace_data, 'POST', null, this)
                this.props.alert.success('Parecer salvo com sucesso!')
                if(result) this.setState({pareceres: result.data, redirectToReferrer: true})
                else console.log('erro', result)
            } catch (error) {
                console.log(error)
                this.props.alert.error('Houve algum erro ao salvar o parecer!')
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

        const x = hasAtLeastOneGroup(['GESTOR'])
        if(x) this.setState({canGerarConvenio: x})

        //    if(this.props.location.state && this.props.location.state.view) this.setFormToEdit()
       }
      onChange(e){
        this.setState({[e.target.name]:e.target.value})
       }
    
      render() {
        //redireciona para a rota de listagem
         if (this.state.redirectToReferrer) {
          return (<Redirect to={{ pathname: '/pareceres', state: this.state}}/>)
        }
    
         return (
          <div className="row">
          <Loader isLoading={this.state.isLoading}/>  
            <div className="page-header">
                <h1>{this.props.location.state && this.props.location.state.objeto ? 'Visualizando' : 'Cadastrar'} <small>PARECER</small>
                
               {/* {(!(this.props.location.state && this.props.location.state.objeto)) && <button className="btn btn-default btn-small pull-right" onClick={e => this.confirmBack(e)}><strong><i className="glyphicon glyphicon-chevron-left"></i> CANCELAR E VOLTAR</strong></button>} */}
                </h1>
            </div>
                    <BackHandle prevPathname={'/pareceres'} prevState={this.state} 
                    callback={ (!(this.state && this.props.location.state.objeto)) ? e => {console.log('ok')} : null}
                    />
            <div id="controlled-tab-example" className="p-top">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <form onSubmit={(e)=> this.saveParecer(e,this.state)}>
                        <fieldset id="fieldset" disabled={this.props.location.state && this.props.location.state.objeto}>
                        <div className="col-md-6">
                                <FormGroup controlId="plano_trabalhoParecer" bsSize="large">
                                    <ControlLabel>Avaliando Plano de Trabalhando</ControlLabel>
                                    <input disabled name="plano_trabalho" value={this.props.location.state.descPlanoTrabalho || ''} className="form-control"/>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup controlId="ongParecer" bsSize="large">
                                    <ControlLabel>ONG Responsável</ControlLabel>
                                    <input disabled name="ong" value={this.props.location.state.nameOng || ''} className="form-control"/>
                                </FormGroup>
                            </div>
                            {/* <div className="col-md-12">
                                <FormGroup controlId="avaliacaoParecer" bsSize="large">
                                    <ControlLabel><Required/> Avaliação</ControlLabel>
                                    <textarea name="avaliacao" value={this.state.avaliacao} className="form-control" autoFocus onChange={this.onChange.bind(this)} required></textarea>
                                </FormGroup>
                            </div> */}
                            <div className="col-md-12">
                                <FormGroup controlId="parecerParecer" bsSize="large">
                                    <ControlLabel><Required/> Parecer</ControlLabel>
                                    <textarea name="parecer" value={this.state.parecer} className="form-control" onChange={this.onChange.bind(this)} required></textarea>
                                </FormGroup>
                            </div>
                            <div className="col-md-12">
                                <FormGroup controlId="tipoParecer" bsSize="large">
                                    <ControlLabel><Required/> Tipo do Parecer</ControlLabel>                                
                                <FormControl componentClass="select" name="tipo_parecer" value={this.state.tipo_parecer} onChange={this.onChange.bind(this)} required>
                                <option value="">Selecione</option>
                                        <option value="avaliacao">AVALIAÇÃO</option>
                                        <option value="parecer_juridico">PARECER JURÍDICO</option>
                                        <option value="parecer_contabil">PARECER CONTÁBIL</option>
                                        <option value="reprovado">REPROVADO</option>
                                        <option value="aprovado_com_ressalva">APROVADO COM RESSALVA</option>
                                        { this.props.location.state.isGestor && <option value="aprovado">APROVADO</option>}
                                </FormControl>
                                </FormGroup> 
                            </div>
                            <div className="col-md-6">
                                <FormGroup controlId="autorParecer" bsSize="large">
                                    <ControlLabel>Responsável</ControlLabel>
                                    <input disabled name="autor" value={JSON.parse(sessionStorage.getItem('user')).pe_fisica.pessoa.nome} className="form-control"/>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup controlId="dataParecer" bsSize="large">
                                    <ControlLabel>Data</ControlLabel>
                                    <input disabled name="data" value={moment().format('DD/MM/YYYY')} className="form-control"/>
                                </FormGroup>
                            </div>
                            {(this.props.location.state && this.props.location.state.objeto) ? null :
                            <div className="col-md-12">
                                <Required label="Campos obrigatórios"/><br></br>
                                <button type="submit" className="btn btn-primary" style={{marginRight: '1rem'}}><strong><i className="glyphicon glyphicon-check"></i> {!this.state.canGerarConvenio && 'APENAS '}SALVAR</strong></button>
                                {/* {this.state.canGerarConvenio && <button type="submit" disabled='disabled' className="btn btn-primary"><strong><i className="glyphicon glyphicon-book"></i> SALVAR E GERAR CONVENIO</strong></button>} */}
                            </div>}
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
          </div>
        )
      }
    }

export default withAlert(ParecerForm)

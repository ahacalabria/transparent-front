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
import BackHandle from '../Providers/BackHandle';
import Parecer from '../Parecer/Parecer';
// import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle'

// const config = require('../../config')

class PrestacaoContaParecer extends Parecer {

    constructor(props){
        super(props)
       
        this.state = {
         redirectToReferrer: false,
         isLoading: false,
         nome_grupo: '',
         operacoes: [],
         operacoesSelected: []
        }
    
        this.saveGrupo = this.saveGrupo.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.setFormToEdit = this.setFormToEdit.bind(this)
        this.getOperacoes = this.getOperacoes.bind(this)
        this.getGrupoOperacoes = this.getGrupoOperacoes.bind(this)
        this.onChangeOperacao = this.onChangeOperacao.bind(this)        
      }
    
      async setFormToEdit(){
          this.setState(this.props.location.state && this.props.location.state.objeto)
      }

      async getOperacoes() {
        try {
          await handleRequest('operacao',{}, 'get', 'operacoes', this)
        } catch (error) {
          console.log(error)
          this.props.alert.error('Houve algum erro ao listar os operacoes cadastrados!')
        }
     }

     async getGrupoOperacoes() {
        try {
          const result = await handleRequest('grupo_operacao/'+this.props.location.state.grupo_id,{}, 'GET', null, this)
          if(result){
            this.setState(() => { return {isLoading: false, id: result[0].id, nome_grupo: result[0].nome_grupo, operacoesSelected: result[0].operacao}})
          }
        } catch (error) {
          console.log(error)
          this.props.alert.error('Houve algum erro ao listar os operacoes por grupo cadastrados!')
        }
     }

      async saveGrupo(e, dados) {
        e.preventDefault()
            this.setState( {isLoading: true} )
            const opSalvas = this.state.operacoesSelected.map( (e, key) => {
                return e.id
            })
            console.log('opSalvas',opSalvas)
            const method_action = "POST"
            const url_tratada = (method_action==="POST") ? 'grupo_operacao/'+this.state.id : 'grupo'
            try{
                const result = await handleRequest(url_tratada, {operacoes_id: opSalvas}, method_action, null, this)
                this.props.alert.success('Grupo salvo com sucesso!')
                if(result) this.setState({operacoes: result.data, redirectToReferrer: true, isLoading: false})
                else console.log('erro', result)
            } catch (error) {
                console.log(error)
                this.setState( {isLoading: false} )
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
       getDadosBasics(){
        this.getOperacoes()
        this.getGrupoOperacoes()
       }
       
       componentDidMount(){
           this.getDadosBasics()
       }
      onChange(e){
        this.setState({[e.target.name]:e.target.value})
       }
       onChangeOperacao(e){
        console.log(e.target.value)
        const tempValue = e.target.value 
        let tempLista = this.state.operacoesSelected
        if(this.state.operacoesSelected.find( x => x!==undefined && x.id!==undefined && (x.id).toString() === tempValue )===undefined ){
            tempLista.push({id: tempValue})
            document.getElementById('operacao-'+tempValue).checked = true
        }else{
            tempLista = this.state.operacoesSelected.filter( x => x!==undefined && x.id!==undefined && (x.id).toString() !== tempValue )
            document.getElementById('operacao-'+tempValue).checked = false
        }

        this.setState(() => { return {operacoesSelected:tempLista} })
       }
        
      render() {
        //redireciona para a rota de listagem
         if (this.state.redirectToReferrer) {
          return (<Redirect to={'/grupo'}/>)
        }
        let operacaoesOptions = []
        if( this.state.operacoes.length > 0 && operacaoesOptions.length!==this.state.operacoes.length){
            operacaoesOptions = this.state.operacoes.map( (e, key) => {
                const comp = this.state.operacoesSelected.find( x => x!==undefined && x.id!==undefined && (x.id).toString() === (e.id).toString())
                return <div key={key} className="col-md-12"><label className="checkbox-inline" title={e.descricao+"/"+e.cod}><input checked={ (comp !== undefined) } id={"operacao-"+e.id} name="operacoesChecked" value={e.id} onChange={this.onChangeOperacao.bind(this)} type="checkbox"/>{e.descricao} <span className={ (comp !== undefined) ? "badge primary" : "badge"}>{(e.cod===801) ? 'LISTAR' : ((e.cod===802)? 'CRIAR' : ((e.cod===803)? 'EDITAR' : 'APAGAR'))}</span></label></div>
            })
        }
            

         return (
          <div className="row">
          <Loader isLoading={this.state.isLoading}/>  
            <div className="page-header">
                <h1>{this.props.location.state && this.props.location.state.objeto ? 'Editar' : 'Cadastrar'} <small>OPERAÇÕES NO GRUPO</small></h1>
                {/* <button className="btn btn-default btn-small pull-right" onClick={e => this.confirmBack(e)}><strong><i className="glyphicon glyphicon-chevron-left"></i> CANCELAR E VOLTAR</strong></button> */}
            </div>
                    <BackHandle prevPathname={'/grupo'} prevState={this.props.location.state} 
                    callback={ (!(this.props.location.state && this.props.location.state.objeto)) ? e => {console.log('ok')} : null}
                    />
            <div id="controlled-tab-example" className="p-top">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <form onSubmit={(e)=> this.saveGrupo(e,this.state)}>
                            <div className="col-md-12">
                                <FormGroup controlId="nome_grupo" bsSize="large">
                                    <ControlLabel>Nome do Grupo</ControlLabel>
                                    <FormControl type="text" name="nome_grupo" readOnly value={this.state.nome_grupo} />
                                </FormGroup>
                            </div>
                            <div className="col-md-12 pb-5">
                            <h2>Operações</h2>
                            {operacaoesOptions}
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

export default withAlert(PrestacaoContaParecer)
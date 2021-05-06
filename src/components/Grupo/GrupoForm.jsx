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

class GrupoForm extends Component {

    constructor(props){
        super(props)
       
        this.state = {
         redirectToReferrer: false,
         isLoading: false,
         grupos: []
        }
    
        this.saveGrupo = this.saveGrupo.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.setFormToEdit = this.setFormToEdit.bind(this)
      }
    
      async setFormToEdit(){
          this.setState(this.props.location.state && this.props.location.state.objeto)
      }

      async saveGrupo(e, dados) {
        e.preventDefault()
            const method_action = (this.props.location.state && this.props.location.state.objeto) ? "PUT" : "POST"
            const url_tratada = (method_action==="PUT") ? 'grupo/'+this.state.id : 'grupo'
            try{
                const result = await handleRequest(url_tratada, {nome_grupo: this.state.nome_grupo}, method_action, null, this)
                this.props.alert.success('Grupo salvo com sucesso!')
                if(result) this.setState({grupos: result.data, redirectToReferrer: true})
                else console.log('erro', result)
            } catch (error) {
                console.log(error)
                this.props.alert.error('Houve algum erro ao salvar o grupo!')
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
           if(this.props.location.state && this.props.location.state.edit) this.setFormToEdit()
        //funcoes caso precise pegar algo do back
       }
      onChange(e){
        this.setState({[e.target.name]:e.target.value})
       }
    
      render() {
        //redireciona para a rota de listagem
         if (this.state.redirectToReferrer) {
          return (<Redirect to={'/grupo'}/>)
        }
    
         return (
          <div className="row">
          <Loader isLoading={this.state.isLoading}/>  
            <div className="page-header">
                <h1>{this.props.location.state && this.props.location.state.objeto ? 'Editar' : 'Cadastrar'} <small>GRUPO</small></h1>
            </div>
            <BackHandle prevPathname={'/grupo'} prevState={this.props.location.state} 
                    callback={ (!(this.props.location.state && this.props.location.state.objeto)) ? e => {console.log('ok')} : null}
                    />
  
            <div id="controlled-tab-example" className="p-top">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <form onSubmit={(e)=> this.saveGrupo(e,this.state)}>
                            <div className="col-md-4">
                                <FormGroup controlId="nome_grupo" bsSize="large">
                                    <ControlLabel><Required/> Nome do Grupo</ControlLabel>
                                    <FormControl type="text" name="nome_grupo" value={this.state.nome_grupo || ''} autoFocus placeholder="Ex.: Financeiro" onChange={this.onChange.bind(this)} required/>
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

export default withAlert(GrupoForm)
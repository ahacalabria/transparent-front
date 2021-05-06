import React, {Component} from 'react'
import {handleRequest} from '../../services/RequestData'
import {Redirect} from 'react-router-dom'
import { withAlert } from "react-alert"
import { confirmAlert } from 'react-confirm-alert' 
import Required from '../Providers/FormsHandle/Required'
import Loader from '../Providers/FormsHandle/Loader'
import InputMask from 'react-input-mask'
import CurrencyFormat from 'react-currency-format'
// import Moment from 'react-moment'
// import {ValidateForm} from '../../services/ValidateForm'
// import {DeleteData} from '../../services/DeleteData'
// import AnexoList from '../Anexo/AnexoList/AnexoList'
// import DirigenteList from '../Pessoa/Dirigente/DirigenteList'
// import Time from 'react-time'
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import BackHandle from '../Providers/BackHandle';
// import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle'

class PagamentoForm extends Component {

    constructor(props){
        super(props)
       
        this.state = {
         redirectToReferrer: false,
         isLoading: false,
         pagamentos: [],
         instituicoes: [],
         convenios: [],
         secretarias: [],
         planoTrabalhos: [],
         dotacoes: []
        }
    
        this.savePagamento = this.savePagamento.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.setFormToEdit = this.setFormToEdit.bind(this)
        this.getConvenios = this.getConvenios.bind(this)
      }
    
      async setFormToEdit(){
          this.setState(this.props.location.state && this.props.location.state.objeto)
      }
    
    async getConvenios(){
            await handleRequest('convenio/', {}, 'GET', 'convenios', this)
    }
    
      async savePagamento(e, dados) {
        e.preventDefault()
            this.setState( {isLoading: true} )
            const method_action = (this.props.location.state && this.props.location.state.objeto) ? "PUT" : "POST"
            const url_tratada = (method_action==="PUT") ? 'pagamento/'+this.state.id : 'pagamento'
            const pagamentoData = {}
            pagamentoData.descricao = this.state.descricao
            pagamentoData.data_pg = this.state.data_pg
            pagamentoData.valor = this.state.valor
            pagamentoData.convenio_id = this.state.convenio_id
            
            try{
                const result = await handleRequest(url_tratada, pagamentoData, method_action, null, this)
                if(result) {
                    this.props.alert.success('Pagamento salvo com sucesso!')
                    this.setState({pagamentos: result.data, isLoading: false, redirectToReferrer: true})
                }else console.log('erro', result)
            } catch (error) {
                this.setState( {isLoading: false} )
                console.log(error)
                this.props.alert.error('Houve algum erro ao salvar o pagamento!')
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
        this.getConvenios()
           if(this.props.location.state && this.props.location.state.edit) this.setFormToEdit()
        //funcoes caso precise pegar algo do back
       }
      onChange(e){
        if(e.target.name === 'pe_juridica_id' && e.target.value !== ''){
            this.setState({pe_juridica_id_previous: e.target.value})
            this.getPlanoTrabalhoByOng(e.target.value)
        }else if(e.target.name === 'secretarium_id' && e.target.value !== ''){
            this.setState({secretarium_id_previous: e.target.value})
            this.getDotacoes(e.target.value)
        }
        this.setState({[e.target.name]:e.target.value})
       }
    
      render() {
        //redireciona para a rota de listagem
         if (this.state.redirectToReferrer) {
          return (<Redirect to={'/pagamentos'}/>)
        }

        
        let convenioOptions = []
        if(this.state.convenios) convenioOptions = this.state.convenios.map( (e, key) => {return <option key={key} value={e.id}>{e.numero_convenio} / {e.nome_representante}</option>})

        

         return (
          <div className="row">
          <Loader isLoading={this.state.isLoading}/>  
            <div className="page-header">
                <h1>{this.props.location.state && this.props.location.state.objeto ? 'Editar' : 'Cadastrar'} <small>PAGAMENTO</small></h1>
            </div>
            <BackHandle prevPathname={'/pagamentos'} prevState={this.state} 
                    callback={ (!(this.props.location.state && this.props.location.state.objeto)) ? e => {console.log('ok')} : null}
                    />
            <div id="controlled-tab-example" className="p-top">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <form onSubmit={(e)=> this.savePagamento(e,this.state)}>
                            <div className="col-md-4">
                                <FormGroup controlId="descricao" bsSize="large">
                                    <ControlLabel><Required/> Descrição</ControlLabel>
                                    <FormControl type="text" name="descricao" value={this.state.descricao || ''} onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="data_pg" bsSize="large">
                                    <ControlLabel><Required/> Data Pagamento</ControlLabel>
                                    <InputMask className="form-control" type="text" name="data_pg" value={this.state.data_pg || ''} onChange={this.onChange} mask="99/99/9999" maskChar={'_'} placeholder={'DD/MM/AAAA'} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="valor" bsSize="large">
                                    <ControlLabel><Required/> Valor</ControlLabel>
                                    <CurrencyFormat required className="text-right" name="valor" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.valor_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                        const {formattedValue, value} = values
                                        this.setState({valor: value, valor_f: formattedValue})
                                    }}/>
                                </FormGroup>
                            </div>
                            
                            <div className="col-md-12">
                                <FormGroup controlId="convenio_id" bsSize="large">
                                <ControlLabel><Required/> Convênio</ControlLabel>
                                <FormControl componentClass="select" name="convenio_id" value={this.state.convenio_id} onChange={this.onChange.bind(this)} required>
                                    <option value="">Selecione</option>
                                    {convenioOptions}
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

export default withAlert(PagamentoForm)
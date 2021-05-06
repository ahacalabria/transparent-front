import React, {Component} from 'react'
import {handleRequest} from '../../services/RequestData'
import {Redirect} from 'react-router-dom'
import { withAlert } from "react-alert"
import { confirmAlert } from 'react-confirm-alert' 
import Required from '../Providers/FormsHandle/Required'
import Loader from '../Providers/FormsHandle/Loader'
import CurrencyFormat from 'react-currency-format'
import InputMask from 'react-input-mask'
import Moment from 'react-moment'
// import {ValidateForm} from '../../services/ValidateForm'
// import {DeleteData} from '../../services/DeleteData'
// import AnexoList from '../Anexo/AnexoList/AnexoList'
// import DirigenteList from '../Pessoa/Dirigente/DirigenteList'
// import Time from 'react-time'
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import BackHandle from '../Providers/BackHandle';
// import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle'

class PrestacaoContaForm extends Component {

    constructor(props){
        super(props)
       
        this.state = {
         ong_id:JSON.parse(sessionStorage.getItem('user')).pe_juridica.id || null,
         redirectToReferrer: false,
         isLoading: false,
         prestacao_conta: [],
         projetos: [],
         plano_trabalhos: [],
         convenio_id: this.props.location.state && this.props.location.state.dados.convenio_id,
         plano_trabalho_id: this.props.location.state && this.props.location.state.dados.plano_trabalho_id,
         projeto_juridica_id: this.props.location.state && this.props.location.state.dados.projeto_juridica_id,
         pagamentos: this.props.location.state && this.props.location.state.dados.pagamentos,
         metas: this.props.location.state && this.props.location.state.dados.metas,
         numero_convenio: this.props.location.state && this.props.location.state.dados.numero_convenio,
         plano_trabalho_nome: this.props.location.state && this.props.location.state.dados.plano_trabalho_nome,
        }
    
        this.saveGrupo = this.saveGrupo.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onChangeQuantidade = this.onChangeQuantidade.bind(this)
        this.setFormToEdit = this.setFormToEdit.bind(this)
        //this.getPlanoTrabalhos = this.getPlanoTrabalhos.bind(this)
        this.getProjetos = this.getProjetos.bind(this)
        this.calculeRow = this.calculeRow.bind(this)
      }

    //   async getPlanoTrabalhos() {
    //     await handleRequest('projeto_juridica/plano_trabalhos/'+this.state.ong_id, {}, 'GET', 'plano_trabalhos', this)
    //    }

      async getProjetos(){    
        await handleRequest('projeto_juridica/plano_trabalhos/'+this.state.ong_id, {}, 'GET', 'plano_trabalhos', this)
      }
    
      async setFormToEdit(){
          this.setState(this.props.location.state && this.props.location.state.objeto)
      }

      async saveGrupo(e, dados) {
        e.preventDefault()
            this.setState( {isLoading: true} )
            const method_action = (this.props.location.state && this.props.location.state.objeto) ? "PUT" : "POST"
            const url_tratada = (method_action==="PUT") ? 'grupo/'+this.state.id : 'grupo'
            try{
                const result = await handleRequest(url_tratada, {nome_grupo: this.state.nome_grupo}, method_action, null, this)
                this.props.alert.success('Grupo salvo com sucesso!')
                if(result) this.setState({prestacao_conta: result.data, redirectToReferrer: true, isLoading: false})
                else console.log('erro', result)
            } catch (error) {
                console.log(error)
                this.setState( {isLoading: false} )
                this.props.alert.error('Houve algum erro ao salvar o grupo!')
            }
       }
       calculeRow(index){
           let valor_unit = this.state[`valor_unitario${index}`]
           let qtd = this.state[`quantidade${index}`]
           let valor_total = parseFloat(valor_unit)*parseFloat(qtd)
           console.log({valor_total})
           this.setState(() => { return {[`valor_total${index}`]: valor_total }})
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
        this.getProjetos()
       }
      onChange(e){
        this.setState({[e.target.name]:e.target.value})
       }
       onChangeQuantidade(index,e){
        let value_qtd = e.target.value
        let value_unit = parseFloat(this.state[`valor_unitario${index}`])
        let valor_total = value_unit*parseFloat(value_qtd)

        this.setState(() => { return {[`quantidade${index}`]: value_qtd, [`valor_total${index}`]: valor_total} })
       }
    
      render() {
        //redireciona para a rota de listagem
         if (this.state.redirectToReferrer) {
          return (<Redirect to={'/prestacao_conta'}/>)
        }
        
    let pagamentosTable = []
    if(this.state.pagamentos && this.state.pagamentos.length>0)
        pagamentosTable = this.state.pagamentos.map((e, key) => {return <tr key={key}><td><Moment format="DD/MM/YYYY">{e.data_pg}</Moment></td><td><CurrencyFormat value={parseFloat(e.valor)||0.0} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td></tr>})
    let metasTable = []
    const headerDespesa = (
        <thead>
            <tr>
                <th style={{textAlign: 'center', width: 'auto'}}>DISCRIMINAÇÃO</th>
                <th style={{textAlign: 'center', width: '120px'}}>UNT.</th>
                <th style={{textAlign: 'center', width: '150px'}}>QTD.</th>
                <th style={{textAlign: 'center', width: '150px'}}>VALOR UNT.</th>
                <th style={{textAlign: 'center', width: '150px'}}>VALOR TOTAL</th>
            </tr>
            <tr>
                <th>N° CHEQUE</th>
                <th>ORDEM BANCÁRIA</th>
                <th>DATA PAGAMENTO</th>
                <th>NOME FAVORECIDO</th>
                <th>ANEXO</th>
                {/* <th>Discriminação</th> */}
            </tr>
        </thead>)
    if(this.state.metas && this.state.metas.length>0)
        metasTable = this.state.metas.map((e, key) => {
            let arrayx = [].concat(e.Plano_aplicacaos)
            console.log('Plano_aplicacaos',arrayx)
            return (<table className="table table-responsive table-striped">{headerDespesa}
                {(arrayx && arrayx.length>0) && arrayx.map((e2, key2) => {
                    return (
                        <tbody>
                    <tr>
                        <td>
                            <FormGroup controlId={"disciminacao"+key2} bsSize="small">
                                <FormControl type="text" name={"disciminacao"+key2} value={e2 && e2.descricao} onChange={this.onChange.bind(this)} disabled/>
                            </FormGroup>
                        </td>
                        <td>
                            <FormGroup controlId={"unidade"+key2} bsSize="small">
                                <FormControl type="text" name={"unidade"+key2} onChange={this.onChange.bind(this)} placeholder="unt." required/>
                            </FormGroup>
                        </td>
                        <td>
                            <FormGroup controlId={"quantidade"+key2} bsSize="small">
                                <FormControl type="text" name={"quantidade"+key2} onChange={this.onChangeQuantidade.bind(this, key2)} placeholder="qtd." required/>
                            </FormGroup>
                        </td>
                        <td>
                            <FormGroup controlId={"valor_unitario"+key2} bsSize="small">
                                {/* <FormControl type="text" name={"valor_unitario"+key2} onChange={this.onChange.bind(this)} required/> */}
                                <CurrencyFormat required className="text-right" name={`valor_unitario${key2}`} customInput={FormControl} placeholder="val. unt." decimalScale={2} fixedDecimalScale={true} value={this.state[`valor_unitatiof${key2}`] || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                        const {formattedValue, value} = values

                                        
                                        this.setState(() => { 
                                            let valor_unit = value
                                            let qtd = parseFloat(this.state[`quantidade${key2}`])
                                            let valor_total = valor_unit*qtd
                                            return {[`valor_unitario${key2}`]: value, [`valor_unitatiof${key2}`]: formattedValue, [`valor_total${key2}`]: valor_total} 
                                        })
                                    }}/>
                            </FormGroup>
                        </td>
                        <td>
                            <FormGroup controlId={"valor_total"+key2} bsSize="small">
                                {/* <FormControl type="text" name={"valor_total"+key2} value={this.state[`valor_total${key2}`] || 0.00} onChange={this.onChange.bind(this)} readOnly={true}/> */}
                                <CurrencyFormat readOnly={true} className="text-right" name={`valor_total${key2}`} placeholder="valor total" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state[`valor_total${key2}`] || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                        const {formattedValue, value} = values

                                        // let valor_unit = value
                                        // let qtd = this.state[`quantidade${key2}`]
                                        // let valor_total = parseFloat(valor_unit)*parseFloat(qtd)

                                        this.setState(() => { return {[`valor_total${key2}`]: value, [`valor_totalf${key2}`]: formattedValue} })
                                    }}/>
                            </FormGroup>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <FormGroup controlId={"num_cheque"+key2} bsSize="small">
                                <FormControl type="text" name={"num_cheque"+key2} onChange={this.onChange.bind(this)} placeholder="num. cheque" required/>
                            </FormGroup>
                        </td>
                        <td>
                            <FormGroup controlId={"ordem_bancaria"+key2} bsSize="small">
                                <FormControl type="text" name={"ordem_bancaria"+key2} onChange={this.onChange.bind(this)} placeholder="ordem bancária" required/>
                            </FormGroup>
                        </td>
                        <td>
                            <FormGroup controlId={"data_pagamento"+key2} bsSize="small">
                                {/* <FormControl type="text" name={"data_pagamento"+key2} onChange={this.onChange.bind(this)} required/> */}
                                <InputMask id={"data_pagamento"+key2} className="form-control" type="text" name={"data_pagamento"+key2} placeholder="data pg." onChange={this.onChange} mask="99/99/9999" maskChar={'_'} placeholder={'DD/MM/AAAA'} required/>
                            </FormGroup>
                        </td>
                        <td>
                            <FormGroup controlId={"nome_favorecido"+key2} bsSize="small">
                                <FormControl type="text" name={"nome_favorecido"+key2} onChange={this.onChange.bind(this)} placeholder="nome favorecido" required/>
                            </FormGroup>
                        </td>
                        <td>
                            {/* <FormGroup controlId={"anexo"+key2} bsSize="small">
                                <FormControl type="text" name={"anexo"+key2} onChange={this.onChange.bind(this)} required/>
                            </FormGroup> */}
                            <FormGroup controlId={"anexo"+key2} bsSize="small" style={{maxWidth: '80px',wordBreak: 'break-all'}}>
                                    {/* <ControlLabel><Required/> Arquivo</ControlLabel><br></br> */}
                                    <input id="file" ref={(ref) => { this[`uploadInput1${key2}`] = ref }} type="file" className="inputfile" onChange={this.onChange}/>
                                    <label className="btn" htmlFor="file">{(this.props.location.state && this.props.location.state.objeto) ? 'Substituir arquivo' : (<i className="glyphicon glyphicon-file"></i>)}</label><br></br>{(this[`uploadInput1${key2}`] !== undefined && this[`uploadInput1${key2}`].files !==undefined && this[`uploadInput1${key2}`].files.length > 0 ) ? <i> {this[`uploadInput1${key2}`].files[0].name} </i> : ''}
                                    
                                    {/* <br></br><small>Os formatos permitidos são: PDF, JPG, GIF, PNG</small> */}
                                </FormGroup>   
                        </td>
                        
                    </tr></tbody>)
                }
                )}
            </table>)
            // <tr key={key}><td><Moment format="DD/MM/YYYY">{e.data_pg}</Moment></td><td><CurrencyFormat value={parseFloat(e.valor)||0.0} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td></tr>
        })


         return (
          <div className="row">
          <Loader isLoading={this.state.isLoading}/>  
            <div className="page-header">
                <h1>{this.props.location.state && this.props.location.state.objeto ? 'Editar' : 'Cadastrar'} <small>Prestação de Contas</small></h1>
            </div>
            <BackHandle prevPathname={'/prestacaodecontas'} prevState={{convenio_id: this.props.location.state.dados.convenio_id, plano_trabalho_id: this.props.location.state.dados.plano_trabalho_id}} 
                    callback={ (!(this.props.location.state && this.props.location.state.objeto)) ? e => {console.log('ok')} : null}
                    />
  
            <div id="controlled-tab-example" className="p-top">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <form id="general-form" onSubmit={(e)=> this.saveGrupo(e,this.state)}>
                            {/* <div className="col-md-6">
                                <FormGroup controlId="convenio_id" bsSize="large">
                                    <ControlLabel><Required/> Convenio</ControlLabel>
                                    <FormControl type="text" name="convenio_id" value={this.state.convenio_id + '-' + this.state.projeto_juridica_id} placeholder="Ex.: Financeiro" onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div> */}
                            <div className="form-group form-group-lg">
                                <div className="panel panel-default shadow-sm">
                                    <div className="panel-heading">BALANCETE FINANCEIRO: RECEITAS E DESPESAS</div>
                                </div>
                                <div className="col-md-12">
                                    <FormGroup controlId="numero_convenio" bsSize="large">
                                        <ControlLabel>Convênio: n° {this.state.numero_convenio}</ControlLabel>
                                    </FormGroup>
                                </div>
                                <div className="col-md-12">
                                    <FormGroup controlId="plano_trabalho_nome" bsSize="large">
                                        <ControlLabel>Plano de trabalho: {this.state.plano_trabalho_nome}</ControlLabel>
                                    </FormGroup>
                                </div>
                                
                            <div className="col-md-6">
                                <FormGroup controlId="tipo_prestacao" bsSize="large">
                                    <ControlLabel><Required/> Tipo de Prestação</ControlLabel>
                                    <FormControl componentClass="select" name="tipo_prestacao" onChange={this.onChange}>
                                        <option value="">Selecione</option>
                                        <option value="pacial">Parcial</option>
                                        <option value="completacao_anual">Complemento Anual</option>
                                        <option value="final">Final</option>
                                        <option value="substituicao">Substituição</option>
                                    </FormControl>
                                </FormGroup>
                            </div>
                            {/* <div className="col-md-6">
                                <FormGroup controlId="projeto_juridica_id" bsSize="large">
                                    <ControlLabel><Required/> Projeto</ControlLabel>
                                    <FormControl componentClass="select" name="projeto_juridica_id" value={this.state.projeto_juridica_id} onChange={this.onChange.bind(this)} required>
                                <option value="">Selecione</option>
                                {projetosSelect || ''}
                                </FormControl>
                                </FormGroup>
                            </div> */}

                            <div className="col-md-6">
                                <FormGroup controlId="nome_ordenador" bsSize="large">
                                    <ControlLabel><Required/> Nome do Ordenador</ControlLabel>
                                    <FormControl type="text" name="nome_ordenador" value={this.state.nome_ordenador || ''} placeholder="Ex.: Financeiro" onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            </div>
                            <div className="col-md-12">
                            <div className="form-group form-group-lg">
                                <div className="panel panel-default shadow-sm">
                                    <div className="panel-heading">DESPESAS (A):</div>
                                </div>
                                {metasTable}
                                </div>
                            </div>
                            <div className="col-md-12">
                            <div className="form-group form-group-lg">
                                <div className="panel panel-default shadow-sm">
                                    <div className="panel-heading">RECEITAS (B):</div>
                                </div>
                                <table className="table table-striped">
                                <thead>
                                    <tr>
                                    <th>Data</th>
                                    <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {pagamentosTable}
                                </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">
                                <FormGroup controlId="saldo_utilizado_devolvido" bsSize="large">
                                    <ControlLabel><Required/> Saldo Devolvido</ControlLabel>
                                    <CurrencyFormat required className="text-right" placeholder="Ex.: R$0,00" name="saldo_utilizado_devolvido" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.saldo_utilizado_devolvido_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                        const {formattedValue, value} = values
                                        this.setState({saldo_utilizado_devolvido: value, saldo_utilizado_devolvido_f: formattedValue})
                                    }}/>
                                </FormGroup>
                            </div>

                            <div className="col-md-6">
                                <FormGroup controlId="nome_contador_num_crc" bsSize="large">
                                    <ControlLabel><Required/> CRC do Contador</ControlLabel>
                                    <FormControl type="text" name="nome_contador_num_crc" value={this.state.nome_contador_num_crc || ''} placeholder="Ex.: Financeiro" onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
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

export default withAlert(PrestacaoContaForm)
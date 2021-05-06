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

class ConvenioForm extends Component {

    constructor(props){
        super(props)
       
        this.state = {
         blockFieldsRepresentante: false,
         blockFieldsValorTotalConvenio: false,
         blockFieldsCargoRepresentante: false,
         blockFieldsNomeRepresentante: false,
         blockFieldsDataTermino: false,
         blockFieldsDataInicio: false,
         redirectToReferrer: false,
         isLoading: false,
         convenios: [],
         instituicoes: [],
         programas: [],
         secretarias: [],
         planoTrabalhos: [],
         dotacoes: [],
         planoTrabalhoSelected: null,
         qtd_dias_max_prestacao: 30
        }
    
        this.saveConvenio = this.saveConvenio.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.setFormToEdit = this.setFormToEdit.bind(this)
        this.getInstituicoes = this.getInstituicoes.bind(this)
        this.getProgramas = this.getProgramas.bind(this)
        this.getDotacoes = this.getDotacoes.bind(this)
      }
    
      async setFormToEdit(){
          this.setState(this.props.location.state && this.props.location.state.objeto)
      }
      async getInstituicoes(){
        try {
            await handleRequest('pe_juridica', {}, 'GET', 'instituicoes', this)
        } catch (error) {
            console.log({error})
        }
    }
    async getSecretarias(){
        await handleRequest('secretaria/', {}, 'GET', 'secretarias', this)
    }

    async getDotacoes(id){
        await handleRequest('dotacao_orcamentaria/secretaria/'+id, {}, 'GET', 'dotacoes', this)
    }

    async getProgramas(){
            await handleRequest('programa/', {}, 'GET', 'programas', this)
    }
    
    async getPlanoTrabalhoByOng(ongId){
            await handleRequest('projeto_juridica/plano_trabalhos/'+ongId, {}, 'GET', 'planoTrabalhos', this)
    }
      async saveConvenio(e, dados) {
        e.preventDefault()
            this.setState( {isLoading: true} )
            const method_action = (this.props.location.state && this.props.location.state.objeto) ? "PUT" : "POST"
            const url_tratada = (method_action==="PUT") ? 'convenio/'+this.state.id : 'convenio'
            const convenioData = {}
            convenioData.numero_convenio = this.state.numero_convenio
            convenioData.nome_representante = this.state.nome_representante
            convenioData.cpf_representante = this.state.cpf_representante
            convenioData.cargo_representante = this.state.cargo_representante
            convenioData.data_vigencia = this.state.data_vigencia
            convenioData.qtd_dias_max_prestacao = this.state.qtd_dias_max_prestacao
            convenioData.valor_total_convenio = this.state.valor_total_convenio
            convenioData.data_inicio = this.state.data_inicio
            convenioData.data_termino = this.state.data_termino
            convenioData.secretarium_id = this.state.secretarium_id
            convenioData.plano_trabalho_id = this.state.plano_trabalho_id
            convenioData.pe_juridica_id = this.state.pe_juridica_id
            convenioData.programa_id = this.state.programa_id
            convenioData.agencia = this.state.agencia
            convenioData.conta_corrente = this.state.conta_corrente
            convenioData.conta_corrente_operacao = this.state.conta_corrente_operacao
            convenioData.nome_banco = this.state.nome_banco
            convenioData.tipo_convenio = this.state.tipo_convenio
            convenioData.dotacao_orcamentarium_id = this.state.dotacao_orcamentarium_id
            // console.log({convenioData})
            try{
                const result = await handleRequest(url_tratada, convenioData, method_action, null, this)
                if(result) {
                    this.props.alert.success('Convenio salvo com sucesso!')
                    this.setState({convenios: result.data, isLoading: false, redirectToReferrer: true})
                }else console.log('erro', result)
            } catch (error) {
                this.setState( {isLoading: false} )
                console.log(error)
                this.props.alert.error('Houve algum erro ao salvar o convenio!')
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
        this.getProgramas()
        this.getSecretarias()
           if(this.props.location.state && this.props.location.state.edit) this.setFormToEdit()
        //funcoes caso precise pegar algo do back
       }
      async onChange(e){
        let planoTrabalhoSelected = null
        if(e.target.name === 'pe_juridica_id' && e.target.value !== ''){
            this.setState({pe_juridica_id_previous: e.target.value})
            this.getPlanoTrabalhoByOng(e.target.value)
        }else if(e.target.name === 'secretarium_id' && e.target.value !== ''){
            this.setState({secretarium_id_previous: e.target.value})
            this.getDotacoes(e.target.value)
        }else if(e.target.name === 'plano_trabalho_id' && e.target.value !== ''){
            const val = e.target.value
            const plan = this.state.planoTrabalhos.filter(el => (parseInt(el.Plano_trabalho.id)===(parseInt(val))))
            if(plan && plan.length>0) {
                planoTrabalhoSelected = plan[0]

                console.log(planoTrabalhoSelected)
                // console.log({planoTrabalhoSelected})   
                // this.setState(planoTrabalhoSelected)
                // const name_temp = e.target.name
                this.setPlano(planoTrabalhoSelected)
                this.getRepresente(planoTrabalhoSelected.pe_juridica_id)
            }
        }
            this.setState({[e.target.name]:e.target.value, planoTrabalhoSelected})
       }
       

       async setPlano(plano){
            if(plano){
                let tempMeta = 0.0 

                const retorno = {}

                plano.Plano_trabalho.Cronograma.Meta.map((meta) => {
                   tempMeta += parseFloat(meta.Cronograma_desembolsos.map(cdem => {
                    if(cdem.concedente_mes_1 !== null && parseInt(cdem.concedente_mes_1)!==0) tempMeta+=parseFloat(cdem.concedente_mes_1)
                    if(cdem.concedente_mes_2 !== null && parseInt(cdem.concedente_mes_2)!==0) tempMeta+=parseFloat(cdem.concedente_mes_2)
                    if(cdem.concedente_mes_3 !== null && parseInt(cdem.concedente_mes_3)!==0) tempMeta+=parseFloat(cdem.concedente_mes_3)
                    if(cdem.concedente_mes_4 !== null && parseInt(cdem.concedente_mes_4)!==0) tempMeta+=parseFloat(cdem.concedente_mes_4)
                    if(cdem.concedente_mes_5 !== null && parseInt(cdem.concedente_mes_5)!==0) tempMeta+=parseFloat(cdem.concedente_mes_5)
                    if(cdem.concedente_mes_6 !== null && parseInt(cdem.concedente_mes_6)!==0) tempMeta+=parseFloat(cdem.concedente_mes_6)
                    if(cdem.concedente_mes_7 !== null && parseInt(cdem.concedente_mes_7)!==0) tempMeta+=parseFloat(cdem.concedente_mes_7)
                    if(cdem.concedente_mes_8 !== null && parseInt(cdem.concedente_mes_8)!==0) tempMeta+=parseFloat(cdem.concedente_mes_8)
                    if(cdem.concedente_mes_9 !== null && parseInt(cdem.concedente_mes_9)!==0) tempMeta+=parseFloat(cdem.concedente_mes_9)
                    if(cdem.concedente_mes_10 !== null && parseInt(cdem.concedente_mes_10)!==0) tempMeta+=parseFloat(cdem.concedente_mes_10)
                    if(cdem.concedente_mes_11 !== null && parseInt(cdem.concedente_mes_11)!==0) tempMeta+=parseFloat(cdem.concedente_mes_11)
                    if(cdem.concedente_mes_12 !== null && parseInt(cdem.concedente_mes_12)!==0) tempMeta+=parseFloat(cdem.concedente_mes_12)
                    // qtdParcelas.qtd_parcelas = tempMeta
                    retorno.tempMeta = tempMeta
                    return cdem
                   }))
                    // return meta
                })

                // console.log(retorno.tempMeta)
                this.setState(
                    {
                        valor_total_convenio_f: retorno.tempMeta, valor_total_convenio: retorno.tempMeta, blockFieldsValorTotalConvenio:true,
                        data_termino: new Date(plano.Projeto.periodo_termino).toLocaleDateString('pt-BR'), blockFieldsDataTermino:true,
                        data_inicio: new Date(plano.Projeto.periodo_inicio).toLocaleDateString('pt-BR'), blockFieldsDataInicio:true
                    }
                    )
            }
       }


       async getRepresente(id){
            const representante = await handleRequest('pe_juridica/representante/'+id, 'GET', {}, null, this)
            if(representante){
                //console.log(representante)
                this.setState(
                    {
                        nome_representante: representante.Users[0].pe_fisica.pessoa.nome, blockFieldsNomeRepresentante:true, 
                        cargo_representante: representante.Users[0].cargo_funcao, blockFieldsCargoRepresentante:true,
                        cpf_representante: representante.Users[0].pe_fisica.cpf, blockFieldsRepresentante:true
                    }
                    )
            }else{
                this.props.alert.error('ONG sem representante. Por Favor, cadastrar!')
            }
            
       }
    
      render() {
        //redireciona para a rota de listagem
         if (this.state.redirectToReferrer) {
          return (<Redirect to={'/convenios'}/>)
        }

        let instituicoesOptions = []
        if(this.state.instituicoes) instituicoesOptions = this.state.instituicoes.map( (e, key) => {return <option key={key} value={e.id}>{e.razao_social}</option>})

        let programasOptions = []
        if(this.state.programas) programasOptions = this.state.programas.map( (e, key) => {return <option key={key} value={e.id}>{e.descricao}</option>})

        let secretariasOptions = []
        if(this.state.secretarias) secretariasOptions = this.state.secretarias.map( (e, key) => {return <option key={key} value={e.id}>{e.nome}</option>})

        let planoTrabalhoOptions = []
        if(this.state.pe_juridica_id!=='' && this.state.pe_juridica_id===this.state.pe_juridica_id_previous){
            planoTrabalhoOptions = this.state.planoTrabalhos.filter(plan => (plan.Plano_trabalho!==null)).map((e, key) => { return <option key={key} value={e.Plano_trabalho.id}>{e.Projeto.nome}</option>})
        }
          
        
        let dotacoesOptions = []
        if(this.state.secretarium_id!=='' && this.state.secretarium_id===this.state.secretarium_id_previous)
            dotacoesOptions = this.state.dotacoes.map((e, key) => { return <option key={key} value={e.id}>{e.codigo} / {e.especificacao}</option>})

            // if(this.state.planoTrabalhoSelected){
            //     this.getRepresente(this.state.planoTrabalhoSelected.pe_juridica_id)
            // }
         return (
          <div className="row">
          <Loader isLoading={this.state.isLoading}/>  
            <div className="page-header">
                <h1>{this.props.location.state && this.props.location.state.objeto ? 'Editar' : 'Cadastrar'} <small>CONVÊNIO</small></h1>
            </div>
            <BackHandle prevPathname={'/convenios'} prevState={this.props.location.state} 
                    callback={ (!(this.props.location.state && this.props.location.state.objeto)) ? e => {console.log('ok')} : null}
                    />
            <div id="controlled-tab-example" className="p-top">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <form onSubmit={(e)=> this.saveConvenio(e,this.state)}>
                        <div className="col-md-4">
                                <FormGroup controlId="tipo_convenio" bsSize="large">
                                <ControlLabel><Required/> Tipo</ControlLabel>
                                <FormControl componentClass="select" name="tipo_convenio" value={this.state.tipo_convenio} onChange={this.onChange.bind(this)} required>
                                    {/* <option value="">Selecione</option> */}
                                    <option value="convenio">Convenio</option>
                                    <option value="termo_parceria">Termo de Parceria</option>
                                    </FormControl>
                                </FormGroup>
                            </div>
                        <div className="col-md-4">
                                <FormGroup controlId="programa_id" bsSize="large">
                                <ControlLabel><Required/> Programa</ControlLabel>
                                <FormControl componentClass="select" name="programa_id" value={this.state.programa_id} onChange={this.onChange.bind(this)} required>
                                    <option value="">Selecione</option>
                                    {programasOptions}
                                    </FormControl>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="pe_juridica_id" bsSize="large">
                                <ControlLabel><Required/> ONG</ControlLabel>
                                <FormControl componentClass="select" name="pe_juridica_id" value={this.state.pe_juridica_id} onChange={this.onChange.bind(this)} required>
                                    <option value="">Selecione</option>
                                    {instituicoesOptions}
                                    </FormControl>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup controlId="plano_trabalho_id" bsSize="large">
                                <ControlLabel><Required/> Plano Trabalho</ControlLabel>
                                <FormControl componentClass="select" name="plano_trabalho_id" value={this.state.plano_trabalho_id} onChange={this.onChange.bind(this)} required>
                                    <option value="">Selecione</option>
                                    {planoTrabalhoOptions}
                                    </FormControl>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup controlId="secretarium_id" bsSize="large">
                                <ControlLabel><Required/> Secretaria</ControlLabel>
                                <FormControl componentClass="select" name="secretarium_id" value={this.state.secretarium_id} onChange={this.onChange.bind(this)} required>
                                    <option value="">Selecione</option>
                                    {secretariasOptions}
                                    </FormControl>
                                </FormGroup>
                            </div>
                            <div className="col-md-12">
                                <FormGroup controlId="dotacao_orcamentarium_id" bsSize="large">
                                <ControlLabel><Required/> Dotações Orçamentárias</ControlLabel>
                                <FormControl componentClass="select" name="dotacao_orcamentarium_id" value={this.state.dotacao_orcamentarium_id} onChange={this.onChange.bind(this)} required>
                                    <option value="">Selecione</option>
                                    {dotacoesOptions}
                                    </FormControl>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="numero_convenio" bsSize="large">
                                    <ControlLabel><Required/> Número do Instrumento</ControlLabel>
                                    <FormControl type="text" name="numero_convenio" value={this.state.numero_convenio || ''} onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="qtd_dias_max_prestacao" bsSize="large">
                                    <ControlLabel><Required/> Qtd. dias para Prestação</ControlLabel>
                                    <FormControl readOnly={true} type="text" name="qtd_dias_max_prestacao" value={this.state.qtd_dias_max_prestacao || ''} onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="nome_representante" bsSize="large">
                                    <ControlLabel><Required/> Nome do Representante</ControlLabel>
                                    <FormControl type="text" name="nome_representante" value={this.state.nome_representante || ''} onChange={this.onChange.bind(this)} required disabled={this.state.blockFieldsNomeRepresentante}/>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="cpf_representante" bsSize="large">
                                    <ControlLabel><Required/> CPF do Representante</ControlLabel>
                                    {/* <FormControl type="text" name="cpf_representante" value={this.state.cpf_representante || ''} onChange={this.onChange.bind(this)} required/> */}
                                    <InputMask className="form-control" type="text" name="cpf_representante" onChange={this.onChange} value={this.state.cpf_representante || ''} mask="999.999.999-99" required disabled={this.state.blockFieldsRepresentante}/>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="cargo_representante" bsSize="large">
                                    <ControlLabel><Required/> Cargo do Representante</ControlLabel>
                                    <FormControl type="text" name="cargo_representante" value={this.state.cargo_representante || ''} onChange={this.onChange.bind(this)} required disabled={this.state.blockFieldsCargoRepresentante}/>
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="data_vigencia" bsSize="large">
                                    <ControlLabel><Required/> Data Vigência</ControlLabel>
                                    <InputMask className="form-control" type="text" name="data_vigencia" value={this.state.data_vigencia || ''} onChange={this.onChange} mask="99/99/9999" maskChar={'_'} placeholder={'DD/MM/AAAA'} required/>
                                    {/* <FormControl type="text" name="data_vigencia"  onChange={this.onChange.bind(this)} required/> */}
                                </FormGroup>
                            </div>
                            
                            <div className="col-md-4">
                                <FormGroup controlId="valor_total_convenio" bsSize="large">
                                    <ControlLabel><Required/> Valor Total do Convênio</ControlLabel>
                                    <CurrencyFormat className="text-right" name="valor_total_convenio" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.valor_total_convenio_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                        const {formattedValue, value} = values
                                        this.setState({valor_total_convenio: value, valor_total_convenio_f: formattedValue})
                                    }}  disabled={this.state.blockFieldsValorTotalConvenio}/>
                                    {/* <FormControl type="text" name="valor_total_convenio" value={this.state.valor_total_convenio || ''} onChange={this.onChange.bind(this)} required/> */}
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="data_inicio" bsSize="large">
                                    <ControlLabel><Required/> Data Início</ControlLabel>
                                    <InputMask className="form-control" type="text" name="data_inicio" value={this.state.data_inicio || ''} onChange={this.onChange} mask="99/99/9999" maskChar={'_'} placeholder={'DD/MM/AAAA'} required disabled={this.state.blockFieldsDataInicio}/>
                                    {/* <FormControl type="text" name="data_inicio" value={this.state.data_inicio || ''} onChange={this.onChange.bind(this)} required/> */}
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <FormGroup controlId="data_termino" bsSize="large">
                                    <ControlLabel><Required/> Data Término</ControlLabel>
                                    <InputMask className="form-control" type="text" name="data_termino" value={this.state.data_termino || ''} onChange={this.onChange} mask="99/99/9999" maskChar={'_'} placeholder={'DD/MM/AAAA'} required disabled={this.state.blockFieldsDataTermino}/>
                                    {/* <FormControl type="text" name="data_termino" value={this.state.data_termino || ''} onChange={this.onChange.bind(this)} required/> */}
                                </FormGroup>
                            </div>
                            <div className="col-md-3">
                                <FormGroup controlId="agencia" bsSize="large">
                                    <ControlLabel><Required/> Agência</ControlLabel>
                                    {/* <InputMask className="form-control" type="text" name="agencia" value={this.state.agencia || ''} onChange={this.onChange} mask="99/99/9999" maskChar={'_'} placeholder={'DD/MM/AAAA'} required disabled={this.state.blockFieldsDataTermino}/> */}
                                    <FormControl type="text" name="agencia" value={this.state.agencia || ''} onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-3">
                                <FormGroup controlId="conta_corrente" bsSize="large">
                                    <ControlLabel><Required/> Conta Corrente</ControlLabel>
                                    {/* <InputMask className="form-control" type="text" name="conta_corrente" value={this.state.conta_corrente || ''} onChange={this.onChange} mask="99/99/9999" maskChar={'_'} placeholder={'DD/MM/AAAA'} required disabled={this.state.blockFieldsDataTermino}/> */}
                                    <FormControl type="text" name="conta_corrente" value={this.state.conta_corrente || ''} onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-3">
                                <FormGroup controlId="conta_corrente_operacao" bsSize="large">
                                    <ControlLabel><Required/> Operação</ControlLabel>
                                    {/* <InputMask className="form-control" type="text" name="conta_corrente_operacao" value={this.state.conta_corrente_operacao || ''} onChange={this.onChange} mask="99/99/9999" maskChar={'_'} placeholder={'DD/MM/AAAA'} required disabled={this.state.blockFieldsDataTermino}/> */}
                                    <FormControl type="text" name="conta_corrente_operacao" value={this.state.conta_corrente_operacao || ''} onChange={this.onChange.bind(this)} required/>
                                </FormGroup>
                            </div>
                            <div className="col-md-3">
                                <FormGroup controlId="nome_banco" bsSize="large">
                                    <ControlLabel><Required/> Nome Banco</ControlLabel>
                                    {/* <InputMask className="form-control" type="text" name="nome_banco" value={this.state.nome_banco || ''} onChange={this.onChange} mask="99/99/9999" maskChar={'_'} placeholder={'DD/MM/AAAA'} required disabled={this.state.blockFieldsDataTermino}/> */}
                                    <FormControl type="text" name="nome_banco" value={this.state.nome_banco || ''} onChange={this.onChange.bind(this)} required/>
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

export default withAlert(ConvenioForm)
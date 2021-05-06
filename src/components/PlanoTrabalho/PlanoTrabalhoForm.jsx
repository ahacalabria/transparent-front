import React, {Component} from 'react'
import {RequestData, handleRequest} from '../../services/RequestData'
import {Redirect} from 'react-router-dom'
import { withAlert } from "react-alert"
import { confirmAlert } from 'react-confirm-alert' 
import Required from '../Providers/FormsHandle/Required'
import Loader from '../Providers/FormsHandle/Loader'
import InputMask from 'react-input-mask'
import {ValidateObject} from '../../services/ValidateForm'

// import Moment from 'react-moment'
// import {ValidateForm} from '../../services/ValidateForm'
// import {DeleteData} from '../../services/DeleteData'
// import AnexoList from '../Anexo/AnexoList/AnexoList'
// import DirigenteList from '../Pessoa/Dirigente/DirigenteList'
import Time from 'react-time'
import {FormGroup, ControlLabel, FormControl, Checkbox} from 'react-bootstrap'
import EtapaList from './EtapaList'
import AtividadeList from './AtividadeList'
import IndicadorList from './IndicadorList'
import CurrencyFormat from 'react-currency-format'
// import DatePicker from 'react-date-picker'
import CronogramaList from './CronogramaList'
import DespesaList from './DespesaList'
import FonteRecursosList from './FonteRecursosList';
import MetaList from './MetaList';
// import SimpleStorage, { clearStorage } from "react-simple-storage";
// import ErrorsHandle from '../Providers/ErrorsHandle/ErrorsHandle'

const config = require('../../config')
const _ = require('lodash')
class PlanoTrabalhoForm extends Component {
    
    constructor(props){
        super(props)
        
        this.state = {
            id: props.location.state ? props.location.state.plano_trabalho_id : '',
            redirectToReferrer: false,
            isLoading: false,
            programas: [],
            pe_juridica_id: pe_juridica_id,
            programa_id: null,
            dados_cadastrais: {},
            representante: {},
            etapasCriadas: [], 
            atividadesCriadas: [],
            metasCriadas: [],
            indicadoresCriados: [],
            cronogramasCriados: [],
            despesasCriadas: [],
            fonteRecursosCriadas: [],
            dataSubAreas: [],
            faseCount: 1,
            metaCount: 1,
            atividadeCount: 1,
            hasAddMeta: false,
            fl_segunda: false,
            fl_terca: false,
            fl_quarta: false,
            fl_quinta: false,
            fl_sexta: false,
            fl_sabado: false,
            fl_domingo: false,
            newPlanoTrabalho: false,
            hasPlanoCreated: false,
            viewingPlanoTrabalho: false,
            editPlanoTrabalho: (props.location.state && props.location.state.edit) ? props.location.state.edit : false,
            nome: '',
            monitoramento_avaliacao: '',
            demonstracao_forma: '',
            resultados_esperados: '',
            rh_envolvidos: '',
            infraestrutura_existente: '',
            objetivo_especifico: '',
            objeto_geral: '',
            hora_funcionamento: '',
            criterios_elegibilidade: '',
            justificativa_proposicao: '',
            sub_area_id: '',
            meta_prevista_atendimento: '',
            area_abrangencia: '',
            capacidade_atendimento: '',
            publico_alvo: '',
            descricao_servicos: ''
        }
        this.initialState = this.state
        
        this.savePlanoTrabalho = this.savePlanoTrabalho.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.onChangeDateMask = this.onChangeDateMask.bind(this)
        this.getPlanoTrabalhoById = this.getPlanoTrabalhoById.bind(this)
        this.getDadosCadastrais = this.getDadosCadastrais.bind(this)
        this.getRepresentante = this.getRepresentante.bind(this)
        this.getSubAreas = this.getSubAreas.bind(this)
        this.getProgramas = this.getProgramas.bind(this)
        this.savePlanoTrabalhoInicial = this.savePlanoTrabalhoInicial.bind(this)
        this.savePlanoTrabalho = this.savePlanoTrabalho.bind(this)
        this.getPlanoTrabalhoFinished = this.getPlanoTrabalhoFinished.bind(this)
        this.saveEtapa = this.saveEtapa.bind(this)
        this.deleteAtividade = this.deleteAtividade.bind(this)
        this.deleteIndicador = this.deleteIndicador.bind(this)
        this.deleteCronograma = this.deleteCronograma.bind(this)
        this.deleteDespesa = this.deleteDespesa.bind(this)
        this.deleteFonteRecurso = this.deleteFonteRecurso.bind(this)
        this.confirmDeleteEtapa = this.confirmDeleteEtapa.bind(this)
        this.confirmDeleteAtividade = this.confirmDeleteAtividade.bind(this)
        this.confirmDeleteMeta = this.confirmDeleteMeta.bind(this)
        this.confirmDeleteIndicador = this.confirmDeleteIndicador.bind(this)
        this.confirmDeleteCronograma = this.confirmDeleteCronograma.bind(this)
        this.confirmDeleteDespesa = this.confirmDeleteDespesa.bind(this)
        this.confirmDeleteFonteRecurso = this.confirmDeleteFonteRecurso.bind(this)
        this.addAtividade = this.addAtividade.bind(this)
        this.addMeta = this.addMeta.bind(this)
        this.saveAtividade = this.saveAtividade.bind(this)
        this.saveIndicador = this.saveIndicador.bind(this)
        this.saveCronograma = this.saveCronograma.bind(this)
        this.saveDespesa = this.saveDespesa.bind(this)
        this.saveFonteRecurso = this.saveFonteRecurso.bind(this)
        this.clearState = this.clearState.bind(this)
        // this.setFormToEdit = this.setFormToEdit.bind(this)
        
        
    }
    async getDadosCadastrais() {
        await handleRequest('pe_juridica/'+pe_juridica_id, {}, 'GET', 'dados_cadastrais', this)
        this.setState({cmas_numero: this.state.dados_cadastrais.cmas_numero, cmas_vigencia: this.state.dados_cadastrais.cmas_vigencia, cmdca_numero: this.state.dados_cadastrais.cmdca_numero, cmdca_vigencia: this.state.dados_cadastrais.cmdca_vigencia})
    }
    
    async getRepresentante() {
        const resp = await handleRequest('pe_juridica/representante/'+pe_juridica_id, {}, 'GET', null, this)
        console.log({resp})
        if((resp && resp.Users) && resp.Users.length>0){
            this.setState({representante: resp.Users && resp.Users[0]})
        }else{
            this.setState({representante: null})
            this.props.alert.error('Essa ONG não possui um dirigente representante cadastrado. Edite a ONG para adicioná-lo!')
        }
        
        // try {
        //     const result = await RequestData('pe_juridica/representante/'+pe_juridica_id,{}, 'get')
        //     this.setState({isLoading: false, representante: result.Users[0]})
        // } catch (error) {
        //     console.log(error)
        //     this.setState({isLoading: false})
        //     this.props.alert.error('Houve algum erro ao pegar os dados cadastrais!')
        // }
    }
    
    async getSubAreas(){    
        const resp = await handleRequest('pe_juridica/sub_areas/'+pe_juridica_id, {}, 'GET', null, this)
        this.setState({dataSubAreas:resp.sub_area})
        // try {
        //     const responseJson = await RequestData('pe_juridica/sub_areas/'+pe_juridica_id, {}, 'GET')  
        //     this.setState({dataSubAreas:responseJson.sub_area})
        // } catch(err) {
        //     console.log('getSubAreas', err)
        //     //   this.handleErrors(err)
        // }
    }
    
    async getProgramas(){
        const resp = await handleRequest('programa/', {}, 'GET', null, this)
        if(resp.length > 0){
            console.log(resp)
            this.setState({programas:resp, programa_edital: resp[0].file_path+"/#"})
        }else{
            this.setState({programas:null, programa_edital: "/#"})
        }
        // try {
        //     const responseJson = await RequestData('programa/', {}, 'GET')  
            // this.setState({programas:responseJson, programa_edital: responseJson[0].file_path})
        // } catch(err) {
        //     console.log('getSubAreas', err)
        //     //   this.handleErrors(err)
        // }
    }
    
    async setFormToEdit(){
        this.setState(this.props.location.state && this.props.location.state.objeto)
    }
    
    async savePlanoTrabalhoInicial(e){
        e.preventDefault()
        const plano_trabalho = await handleRequest('plano_trabalho/', this.state, 'POST', null, this)
        console.log({plano_trabalho})
        if(plano_trabalho){
            const cronograma = await handleRequest('cronograma/', {plano_trabalho_id: plano_trabalho.plTrabalho.id}, 'POST', null, this)  
            this.setState({id: plano_trabalho.plTrabalho.id, cronograma_id: cronograma.id, projeto_juridica_id: plano_trabalho.prJuridica.id, projeto_id: plano_trabalho.Projeto.id})
            this.setState(plano_trabalho.plTrabalho)
            this.setState(() => {return {newPlanoTrabalho: false, hasPlanoCreated: true, isLoading: false}})
            this.props.alert.success("Tudo ok! Continue o cadastro para finalizá-lo.")
        }
    }
    
    async saveEtapa(){
        this.setState({isLoading: true})
        try {
            let listaEtapas = this.state.etapasCriadas
            let etapaTmp = {} 
            etapaTmp.id = this.state.faseCount           
            etapaTmp.especificacao = this.state.especificacao
            etapaTmp.indicador_fisico_und = this.state.indicador_fisico_und
            etapaTmp.indicador_fisico_qtd = this.state.indicador_fisico_qtd
            etapaTmp.duracao_inicio = this.state.duracao_inicio
            etapaTmp.duracao_termino = this.state.duracao_termino
            etapaTmp.hasHorarios = false
            const boo = ValidateObject(etapaTmp)
            if(boo){
                if(this.state.faseCount===1){
                    const newMeta = await RequestData('meta/',{cronograma_id: this.state.cronograma_id, numero: this.state.metaCount, descricao: this.state.descricao, plano_trabalho_id: this.state.id},'POST')
                    this.addMeta(newMeta.Meta)
                }
                etapaTmp.meta_id = this.state.metaCurrent.numero
                const atividadeModel = {}
                atividadeModel.fase = etapaTmp.id
                atividadeModel.metum_id = this.state.metaCurrent.id
                atividadeModel.especificacao = etapaTmp.especificacao
                atividadeModel.indicador_fisico_und = etapaTmp.indicador_fisico_und
                atividadeModel.indicador_fisico_qtd = etapaTmp.indicador_fisico_qtd
                atividadeModel.indicador_fisico_inicio = etapaTmp.duracao_inicio
                atividadeModel.indicador_fisico_termino = etapaTmp.duracao_termino
                
                const newAtividade = await RequestData('atividade/',atividadeModel,'POST')
                
                etapaTmp.atividade_id = newAtividade.id
                listaEtapas.push(etapaTmp)
                this.setState(() => { return { hasAddMeta: true, etapasCriadas:listaEtapas, faseCount:(parseInt(etapaTmp.id+1)), especificacao: '', indicador_fisico_und: '', indicador_fisico_qtd: '', duracao_inicio: '', duracao_termino: ''} })
            }else{
                this.props.alert.error("Atenção! É necessário informar todos os dados da etapa.")
            }
            this.setState({isLoading: false})
        } catch(err) {
            console.log(err)
            this.setState({isLoading: false})
            this.props.alert.error("Error! Por favor tente novamente.")
            // this.handleErrors(err)
        } 
    }
    
    componentWillUnmount(){
        this.clearState()
    }
    
    async addMeta(metaParm){
        let meta_id = metaParm.id//this.state.metaCount
        let meta_count = this.state.metaCount//parseInt(metaParm.numero)
        const listaMeta = this.state.metasCriadas
        const meta = {}
        meta.id = meta_id
        meta.numero = parseInt(metaParm.numero)
        meta.etapas = this.state.etapasCriadas
        meta.atividade = this.state.atividadesCriadas
        meta.descricao = metaParm.descricao
        listaMeta.push(meta)
        // meta_count++
        this.setState( () => {return {metaCurrent: metaParm, metaCount: meta_count, metasCriadas: listaMeta, atividadeCount: 1, faseCount: 1, faseCurrent: 1} } )
        // this.props.alert.success('Meta salva! Agora você pode prosseguir no cadastro, ou se necessário adicionar etapas/atividades para uma nova meta')
    }
    incrementarMeta(){
        let meta_count = this.state.metaCount
        meta_count++
        this.setState( () => {return {metaCount: meta_count, descricao: '', atividadeCount: 1, faseCount: 1, faseCurrent: 1} } )
        this.props.alert.info('Meta salva! Agora você pode continuar.')
    }
    
    async addMetaConfirm(){
        confirmAlert({
            title: 'ATENÇÃO',                        
            message: 'Salvar a meta atual? Após isso você também poderá adicionar novas etapas e atividades a uma nova meta. Lembre-se de salvar cada nova meta.',               
            childrenElement: () => '',       
            confirmLabel: 'Sim',                          
            cancelLabel: 'Não',                         
            onConfirm: () => this.incrementarMeta(),
            onCancel: () => '',      
        })
    }
    
    async saveIndicador(){
        this.setState({isLoading: true})
        try {
            // const responseJson = await RequestData('pe_juridica/sub_areas/'+pe_juridica_id, {}, 'GET')  
            // this.setState({dataSubAreas:responseJson.sub_area})
            let listaIndicadores = this.state.indicadoresCriados
            let indicadorTmp = {}
            indicadorTmp.descricao = this.state.indicador
            indicadorTmp.meio_verificacao = this.state.meio_verificacao
            indicadorTmp.plano_trabalho_id = this.state.id
            const boo = ValidateObject(indicadorTmp)
            if(boo){
                const newIndicador = await RequestData('indicador/',indicadorTmp,'POST')
                indicadorTmp.id = newIndicador.id
                listaIndicadores.push(indicadorTmp)
                this.setState(() => { return { indicadoresCriados:listaIndicadores, indicador: '', meio_verificacao: ''} })
            }else{
                this.props.alert.error("Atenção! É necessário informar todos os dados dos indicadores.")
            }
        } catch(err) {
            console.log(err)
            // this.handleErrors(err)
        } 
        this.setState({isLoading: false})
    }
    
    async saveCronograma(){
        try {
            // const responseJson = await RequestData('pe_juridica/sub_areas/'+pe_juridica_id, {}, 'GET')  
            // this.setState({dataSubAreas:responseJson.sub_area})
            let listaCronogramas = this.state.cronogramasCriados
            let cronogramaTmp = {}
            cronogramaTmp.metum_id = this.state.cronograma_meta_id
            cronogramaTmp.concedente_mes_1 = this.state.concedente_mes_1
            cronogramaTmp.concedente_mes_2 = this.state.concedente_mes_2
            cronogramaTmp.concedente_mes_3 = this.state.concedente_mes_3
            cronogramaTmp.concedente_mes_4 = this.state.concedente_mes_4
            cronogramaTmp.concedente_mes_5 = this.state.concedente_mes_5
            cronogramaTmp.concedente_mes_6 = this.state.concedente_mes_6
            cronogramaTmp.concedente_mes_7 = this.state.concedente_mes_7
            cronogramaTmp.concedente_mes_8 = this.state.concedente_mes_8
            cronogramaTmp.concedente_mes_9 = this.state.concedente_mes_9
            cronogramaTmp.concedente_mes_10 = this.state.concedente_mes_10
            cronogramaTmp.concedente_mes_11 = this.state.concedente_mes_11
            cronogramaTmp.concedente_mes_12 = this.state.concedente_mes_12
            cronogramaTmp.proponente_mes_1 = this.state.proponente_mes_1
            cronogramaTmp.proponente_mes_2 = this.state.proponente_mes_2
            cronogramaTmp.proponente_mes_3 = this.state.proponente_mes_3
            cronogramaTmp.proponente_mes_4 = this.state.proponente_mes_4
            cronogramaTmp.proponente_mes_5 = this.state.proponente_mes_5
            cronogramaTmp.proponente_mes_6 = this.state.proponente_mes_6
            cronogramaTmp.proponente_mes_7 = this.state.proponente_mes_7
            cronogramaTmp.proponente_mes_8 = this.state.proponente_mes_8
            cronogramaTmp.proponente_mes_9 = this.state.proponente_mes_9
            cronogramaTmp.proponente_mes_10 = this.state.proponente_mes_10
            cronogramaTmp.proponente_mes_11 = this.state.proponente_mes_11
            cronogramaTmp.proponente_mes_12 = this.state.proponente_mes_12
            
            const boo = ValidateObject(cronogramaTmp)
            if(boo){
                const newCronograma = await handleRequest('cronograma_desembolso/',cronogramaTmp,'POST',null,this)
                cronogramaTmp.id = newCronograma.id//parseInt(listaCronogramas.length)+1
                listaCronogramas.push(cronogramaTmp)
                this.setState(() => { return { cronogramasCriados:listaCronogramas, 
                    cronograma_meta_id: '',
                    concedente_mes_1: '', concedente_mes_1_f: '',
                    concedente_mes_2: '', concedente_mes_2_f: '',
                    concedente_mes_3: '', concedente_mes_3_f: '',
                    concedente_mes_4: '', concedente_mes_4_f: '',
                    concedente_mes_5: '', concedente_mes_5_f: '',
                    concedente_mes_6: '', concedente_mes_6_f: '',
                    concedente_mes_7: '', concedente_mes_7_f: '',
                    concedente_mes_8: '', concedente_mes_8_f: '',
                    concedente_mes_9: '', concedente_mes_9_f: '',
                    concedente_mes_10: '', concedente_mes_10_f: '',
                    concedente_mes_11: '', concedente_mes_11_f: '',
                    concedente_mes_12: '', concedente_mes_12_f: '',
                    proponente_mes_1: '', proponente_mes_1_f: '',
                    proponente_mes_2: '', proponente_mes_2_f: '',
                    proponente_mes_3: '', proponente_mes_3_f: '',
                    proponente_mes_4: '', proponente_mes_4_f: '',
                    proponente_mes_5: '', proponente_mes_5_f: '',
                    proponente_mes_6: '', proponente_mes_6_f: '',
                    proponente_mes_7: '', proponente_mes_7_f: '',
                    proponente_mes_8: '', proponente_mes_8_f: '',
                    proponente_mes_9: '', proponente_mes_9_f: '',
                    proponente_mes_10: '', proponente_mes_10_f: '',
                    proponente_mes_11: '', proponente_mes_11_f: '',
                    proponente_mes_12: '', proponente_mes_12_f: ''
                } })
            }else{
                this.props.alert.error("Atenção! É necessário informar todos os dados do cronograma de desembolso.")
            }
        } catch(err) {
            console.log(err)
            // this.handleErrors(err)
        }
    }
    
    async saveDespesa(){
        this.setState({isLoading: true})
        
        if(!this.state.metaCurrent && this.state.metaCurrent===undefined && this.state.metasCriadas.length===0)
            this.props.alert.error("Atenção! É necessário salvar a meta atual para prosseguir.")
        else{
            try {
                // const responseJson = await RequestData('pe_juridica/sub_areas/'+pe_juridica_id, {}, 'GET')  
                // this.setState({dataSubAreas:responseJson.sub_area})
                let listaDespesas = this.state.despesasCriadas
                let despesaTmp = {}
                despesaTmp.especificacao = this.state.especificacao_despesa
                despesaTmp.quantidade = this.state.quantidade
                despesaTmp.unidade = this.state.unidade
                despesaTmp.valor_unt = this.state.valor_unt
                despesaTmp.metum_id = this.state.metaCurrent.numero
                // despesaTmp.valor_subtotal = this.state.valor_subtotal
                // console.log('save',despesaTmp)
                const boo = ValidateObject(despesaTmp)
                if(boo){
                    const planoApObj = {}
                    planoApObj.descricao = this.state.especificacao_despesa
                    planoApObj.qtd1 = this.state.quantidade
                    planoApObj.qtd2 = ''
                    planoApObj.unidade = this.state.unidade
                    planoApObj.vl_total = 0
                    planoApObj.vl_concedente = 0
                    planoApObj.vl_proponente = 0
                    planoApObj.vl_total_previsto = 0
                    planoApObj.vl_unitario = this.state.valor_unt
                    planoApObj.metum_id = this.state.metaCurrent.id
                    const despesa = await RequestData('plano_aplicacao/',planoApObj,'POST')
                    despesaTmp.id = despesa.id//parseInt(listaDespesas.length)+1
                    listaDespesas.push(despesaTmp)
                    this.setState(() => { return { despesasCriadas:listaDespesas, especificacao: '', quantidade: '', valor_unt: '', valor_unt_f: ''} })
                }else{
                    this.props.alert.error("Atenção! É necessário informar todos os dados para inserir uma despesa.")
                }
            } catch(err) {
                console.log(err)
                // this.handleErrors(err)
            }
        }
        this.setState({isLoading: false})
    }
    
    async saveFonteRecurso(){
        this.setState({isLoading: true})
        try {
            let listaFonteRecursos = this.state.fonteRecursosCriadas
            let fonteRecursoTMP = {}
            const metaTMP = await RequestData('meta/'+this.state.fonte_meta_id,{},'GET')
            
            fonteRecursoTMP.metum_id = this.state.fonte_meta_id
            fonteRecursoTMP.vl_municipal = this.state.vl_municipal
            fonteRecursoTMP.vl_estadual = this.state.vl_estadual
            fonteRecursoTMP.vl_federal = this.state.vl_federal
            fonteRecursoTMP.proprios_moeda_corrente = this.state.proprios_moeda_corrente
            fonteRecursoTMP.proprios_bens_servicos = this.state.proprios_bens_servicos
            fonteRecursoTMP.vl_total = parseFloat(parseFloat(fonteRecursoTMP.vl_municipal)+parseFloat(fonteRecursoTMP.vl_estadual)+parseFloat(fonteRecursoTMP.vl_federal)+parseFloat(fonteRecursoTMP.proprios_bens_servicos)+parseFloat(fonteRecursoTMP.proprios_moeda_corrente))
            // const metaTmp = this.state.metasCriadas.filter((v,i)=> {return (v.id===(parseInt(fonteRecursoTMP.metum_id)))} )[0]
            // console.log('metaTMP', fonteRecursoTMP)
            // alert()
            fonteRecursoTMP.meta_numero = metaTMP.numero
            // fonteRecursoTMP.valor_subtotal = this.state.valor_subtotal
            // console.log('save',fonteRecursoTMP)
            const boo = ValidateObject(fonteRecursoTMP)
            if(boo){
                const despesa = await RequestData('fonte_recurso/',fonteRecursoTMP,'POST')
                
                fonteRecursoTMP.id = despesa.id//parseInt(listaFonteRecursos.length)+1
                listaFonteRecursos.push(fonteRecursoTMP)
                this.setState(() => { return { fonteRecursosCriadas:listaFonteRecursos, fonte_meta_id: '', vl_municipal: '', vl_municipal_f: '', vl_estadual: '', vl_estadual_f: '', vl_federal: '', vl_federal_f: '', proprios_moeda_corrente: '', proprios_moeda_corrente_f: '', proprios_bens_servicos: '', proprios_bens_servicos_f: ''} })
            }else{
                this.props.alert.error("Atenção! É necessário informar todos os dados para inserir uma fonte de recursos.")
            }
        } catch(err) {
            console.log(err)
            // this.handleErrors(err)
        }
        this.setState({isLoading: false})
    }
    
    async deleteEtapa(id, callback){
        let listaEtapa = this.state.etapasCriadas.filter((v,i)=> {return (v.atividade_id!==id)} )
        let currentMetaCount = this.state.faseCount
        // callback()
        this.setState((faseCount) => { return { etapasCriadas:listaEtapa, faseCount:(parseInt(currentMetaCount-1)), faseCurrent: currentMetaCount} })
    }
    
    async deleteAtividade(id, callback){
        this.setState({isLoading: true})
        try {
            const deletingAtividade = await RequestData('atividade/'+id, {}, 'DELETE')
            console.log('deletandoAtividade',deletingAtividade)
            let listaAtividade = this.state.atividadesCriadas.filter((v,i)=> {return (v.atividade_id!==id)} )
            let currentAtividadeCount = this.state.atividadeCount
            if(currentAtividadeCount > 1) currentAtividadeCount = parseInt(currentAtividadeCount)-1
            
            let listaEtapasTmp = this.state.etapasCriadas.filter((v,i)=> {return (v.atividade_id!==id)} )
            
            // callback()
            this.setState((atividadeCount) => { return { atividadesCriadas: listaAtividade, atividadeCount: currentAtividadeCount, etapasCriadas: listaEtapasTmp} })
        } catch (error) {
            console.log('erroDeletarAtividade', error)
        }
        this.setState({isLoading: false})
    }
    
    async deleteCronograma(id, callback){
        this.setState({isLoading: true})
        try {
            const deletingCronograma = await RequestData('cronograma_desembolso/'+id, {}, 'DELETE')
            console.log('deletandoCronogramaDesembolso',deletingCronograma)
            let listaCronograma = this.state.cronogramasCriados.filter((v,i)=> {return (v.id!==id)} )
            // let currentAtividadeCount = this.state.atividadeCount
            // callback()
            this.setState(() => { return { cronogramasCriados:listaCronograma, isLoading: false} })
        } catch (error) {
            this.setState({isLoading: false})
            console.log('errodeletandoCronogramaDesembolso', error)
        }
    }
    
    async deleteIndicador(id, callback){
        
        this.setState({isLoading: true})
        try {
            const deletandoIndicador = await RequestData('indicador/'+id, {}, 'DELETE')
            console.log('deletandoIndicador',deletandoIndicador)
            let listaIndicadores = this.state.indicadoresCriados.filter((v,i)=> {return (v.id!==id)} )
            // callback()
            this.setState(() => { return { indicadoresCriados:listaIndicadores } })
        } catch (error) {
            this.setState({isLoading: false})
            console.log('erroDeletarindicador', error)
        }
    }
    
    async deleteDespesa(id, callback){
        this.setState({isLoading: true})
        try {
            const deletandoDespesa = await RequestData('plano_aplicacao/'+id, {}, 'DELETE')
            console.log('deletandoDespesa',deletandoDespesa)
            let listaDespesas = this.state.despesasCriadas.filter((v,i)=> {return (v.id!==id)} )
            // callback()
            this.setState(() => { return { despesasCriadas:listaDespesas } })
            
        } catch (error) {
            console.log('erroDeletarindicador', error)
        }
        this.setState({isLoading: false})
    }
    async deleteMeta(id, callback){
        console.log({id})
        const tempMeta = this.state.metasCriadas.filter(el=>el.numero===id)
        console.log({tempMeta})
        if( tempMeta && tempMeta.length>0 ){
            const tempId = tempMeta[0].id
            this.setState({isLoading: true})
            try {
                const deletingMeta = await RequestData('meta/'+tempId, {}, 'DELETE')
                console.log('deletingMeta',deletingMeta)
                let listaMetas = this.state.metasCriadas.filter((v,i)=> {return (v.id!==tempId)} )
                // callback()
                this.setState(() => { return { metasCriadas:listaMetas } })
                
            } catch (error) {
                console.log('erroDeletarindicador', error)
            }
            this.setState({isLoading: false})
        }
    }
    
    async deleteFonteRecurso(id, callback){
        this.setState({isLoading: true})
        try {
            const deletandoDespesa = await RequestData('fonte_recurso/'+id, {}, 'DELETE')
            console.log('deletandoDespesa',deletandoDespesa)
            let listaFonteRecursos = this.state.fonteRecursosCriadas.filter((v,i)=> {return (v.id!==id)} )
            // callback()
            this.setState(() => { return { fonteRecursosCriadas:listaFonteRecursos } })
        } catch (error) {
            console.log('erroDeletarindicador', error)
        }
        this.setState({isLoading: false})
    }
    
    async confirmDeleteEtapa(id, callback){
        confirmAlert({
            title: 'ATENÇÃO',                        
            message: 'Você realmente deseja apagar essa etapa/fase?',               
            childrenElement: () => '',       
            confirmLabel: 'Apagar',                          
            cancelLabel: 'Cancelar',                         
            onConfirm: () => this.deleteEtapa(id, callback),    
            onCancel: () => '',      
        })
    }
    async confirmDeleteMeta(id, callback){
        confirmAlert({
            title: 'ATENÇÃO',                        
            message: 'Você realmente deseja apagar essa meta?',               
            childrenElement: () => '',       
            confirmLabel: 'Apagar',                          
            cancelLabel: 'Cancelar',                         
            onConfirm: () => this.deleteMeta(id, callback),    
            onCancel: () => '',      
        })
    }
 
     async confirmDeleteAtividade(id, callback){
        confirmAlert({
            title: 'ATENÇÃO',                        
            message: 'Você realmente deseja apagar essa atividade?',               
            childrenElement: () => '',       
            confirmLabel: 'Apagar',                          
            cancelLabel: 'Cancelar',                         
            onConfirm: () => this.deleteAtividade(id, callback),    
            onCancel: () => '',      
        })
    }
    async confirmDeleteIndicador(id, callback){
        confirmAlert({
            title: 'ATENÇÃO',                        
            message: 'Você realmente deseja apagar esse indicador?',               
            childrenElement: () => '',       
            confirmLabel: 'Apagar',                          
            cancelLabel: 'Cancelar',                         
            onConfirm: () => this.deleteIndicador(id, callback),    
            onCancel: () => '',      
        })
    }
    async confirmDeleteDespesa(id, callback){
        confirmAlert({
            title: 'ATENÇÃO',                        
            message: 'Você realmente deseja apagar essa despesa?',               
            childrenElement: () => '',       
            confirmLabel: 'Apagar',                          
            cancelLabel: 'Cancelar',                         
            onConfirm: () => this.deleteDespesa(id, callback),    
            onCancel: () => '',      
        })
    }
    async confirmDeleteCronograma(id, callback){
        confirmAlert({
            title: 'ATENÇÃO',                        
            message: 'Você realmente deseja apagar todo esse cronograma? Isso irá apagar os valores para concedentes e proponentes!',               
            childrenElement: () => '',       
            confirmLabel: 'Apagar',                          
            cancelLabel: 'Cancelar',                         
            onConfirm: () => this.deleteCronograma(id, callback),    
            onCancel: () => '',      
        })
    }
    
    async confirmDeleteFonteRecurso(id, callback){
        confirmAlert({
            title: 'ATENÇÃO',                        
            message: 'Você realmente deseja apagar os valores dessa fonte de recurso?',
            childrenElement: () => '',       
            confirmLabel: 'Apagar',                          
            cancelLabel: 'Cancelar',                         
            onConfirm: () => this.deleteFonteRecurso(id, callback),    
            onCancel: () => '',      
        })
    }
    
    async addAtividade(id, callback){
        let listaAtividade = this.state.etapasCriadas.filter((v,i)=> {return (v.atividade_id===id)} )
        const faseCurrent = listaAtividade[0].id || 1
        const atividadeAtual = listaAtividade[0]
        atividadeAtual.hasHorarios = false
        this.setState({faseCurrent: faseCurrent, atividadeSelecionada: id, atividadeAtual: atividadeAtual, atividadeCurrent: [atividadeAtual.especificacao]})
        callback()
    }
    
    async saveAtividade(){
        try {
            // const responseJson = await RequestData('pe_juridica/sub_areas/'+pe_juridica_id, {}, 'GET')  
            this.setState({isLoading: true})
            let listaAtividade = this.state.atividadesCriadas
            let atividadeTmp = {}
            // atividadeTmp.meta_id = 
            const atividadeTmpCount = this.state.atividadeCount
            atividadeTmp.id = this.state.atividadeCount
            atividadeTmp.fase = this.state.faseCurrent
            atividadeTmp.especificacao = this.state.atividadeAtual.especificacao
            atividadeTmp.horarios = this.state.horarios
            atividadeTmp.hasHorarios = this.state.atividadeAtual.hasHorarios
            const boo = ValidateObject(atividadeTmp)
            console.log({atividadeTmp})
            if(boo){
                atividadeTmp.fl_segunda = this.state.fl_segunda
                atividadeTmp.fl_terca = this.state.fl_terca
                atividadeTmp.fl_quarta = this.state.fl_quarta
                atividadeTmp.fl_quinta = this.state.fl_quinta
                atividadeTmp.fl_sexta = this.state.fl_sexta
                atividadeTmp.fl_sabado = this.state.fl_sabado
                atividadeTmp.fl_domingo = this.state.fl_domingo
                let atividadeUpdate = null
                if(!atividadeTmp.hasHorarios){
                    atividadeUpdate = await RequestData('atividade/'+this.state.atividadeAtual.atividade_id,atividadeTmp,'PUT')
                    // atualizar etapasCriadas -> set hasHorario
                    this.state.etapasCriadas.forEach(element => {
                        if(element.id === this.state.atividadeAtual.id){
                            element.hasHorarios = true
                        }
                    });
                    // this.setState( () => { return {atividadeAtual: atividadeTmp}})
                    atividadeTmp.atividade_id = this.state.atividadeAtual.atividade_id
                    atividadeTmp.meta_numero = this.state.metaCount
                    listaAtividade.push(atividadeTmp)
                }else{
                    atividadeTmp.indicador_fisico_qtd = this.state.atividadeAtual.indicador_fisico_qtd
                    atividadeTmp.indicador_fisico_und = this.state.atividadeAtual.indicador_fisico_und
                    atividadeTmp.duracao_inicio = this.state.atividadeAtual.duracao_inicio
                    atividadeTmp.duracao_termino = this.state.atividadeAtual.duracao_termino
                    atividadeTmp.metum_id = this.state.metaCurrent.id
                    
                    atividadeUpdate = await RequestData('atividade/',atividadeTmp,'POST')
                    atividadeTmp.atividade_id = atividadeUpdate.id
                    atividadeTmp.meta_numero = this.state.metaCount
                    listaAtividade.push(atividadeTmp)
                }
                atividadeTmp.fl_segunda && document.getElementById('fl_segunda').click()
                atividadeTmp.fl_terca && document.getElementById('fl_terca').click()
                atividadeTmp.fl_quarta && document.getElementById('fl_quarta').click()
                atividadeTmp.fl_quinta && document.getElementById('fl_quinta').click()
                atividadeTmp.fl_sexta && document.getElementById('fl_sexta').click()
                atividadeTmp.fl_sabado && document.getElementById('fl_sabado').click()
                atividadeTmp.fl_domingo && document.getElementById('fl_domingo').click()
                // let especificacao = this.state.atividadeAtual.especificacao
                this.setState(() => { return { atividadesCriadas:listaAtividade, atividadeCurrent: '', atividadeCount:(parseInt(atividadeTmpCount+1)), horarios: '', fl_segunda: false, fl_terca: false, fl_quarta: false, fl_quinta: false, fl_sexta: false, fl_sabado: false, fl_domingo: false} })
            }else{
                this.props.alert.error("Atenção! É necessário informar todos os dados da atividade.")
            }
        } catch(err) {
            console.log(err)
            // this.handleErrors(err)
        } 
        this.setState({isLoading: false})
    }
    async getPlanoTrabalhoFinished(){
        if((this.props.location.state && this.props.location.state.newPlanoTrabalho) ) {
            this.setState({hasPlanoCreated: false})    
        }else{
            this.setState({hasPlanoCreated: true})
        }
        if(this.props.match.params && (this.props.match.params.id>0)){
            this.setState({hasPlanoCreated: true})
        }else if(this.props.location.state && this.props.location.state.edit && (this.props.location.state.plano_trabalho_id>0)){
            this.setState({hasPlanoCreated: true})
        }else{
            this.setState({hasPlanoCreated: false})
        }
    }
    
    async savePlanoTrabalho(e, dados) {
        e.preventDefault()
        if(!this.state.programa_id){
            this.props.alert.error('Você esqueceu de selecionar o edital no início do formulário!')
        }else{
            this.setState( {isLoading: true} )
            try{
                await RequestData('ctext_area/',{plano_trabalho_id: this.state.id,resultados_esperados: this.state.resultados_esperados, monitoramento_avaliacao: this.state.monitoramento_avaliacao, demonstracao_forma: this.state.demonstracao_forma},'POST')
                const result = await RequestData('plano_trabalho/'+this.state.id, this.state, 'PUT')//fetch(url_tratada, {method: method_action, body: data, headers: {token: token_saved}})
                // const result = await RequestData('programa',{}, 'post')
                // console.log('programaSaved', result)
                this.props.alert.success('Plano de trabalho salvo com sucesso! Em breve você seu plano receberá pareceres.')
                if(result) {
                    this.clearState()
                    this.setState({redirectToReferrer: true})
                }else console.log('erro', result)
            } catch (error) {
                console.log(error)
                this.setState( {isLoading: false} )
                this.props.alert.error('Houve algum erro ao salvar o plano!')
            }
        }
    }
    confirmBack(e){
        // (this.state.editPlanoTrabalho || !this.state.viewingPlanoTrabalho)
        if((!this.state.editPlanoTrabalho) && this.state.viewingPlanoTrabalho){
            this.cancelCadastro(e) 
        } else{
            e.preventDefault();
            confirmAlert({
                title: 'ATENÇÃO',                        
                message: 'Você realmente deseja cancelar o cadastro?',           
                childrenElement: () => '',       
                confirmLabel: 'Sim',                          
                cancelLabel: 'Não',                            
                onConfirm: () => this.cancelCadastro(),    
                onCancel: () => '',      
            })
        }
    }
    clearState(){
        this.setState((hasPlanoCreated) => {return {newPlanoTrabalho: true, hasPlanoCreated: false, viewingPlanoTrabalho:false, redirectToReferrer: true, etapasCriadas: [],atividadesCriadas: [], atividadeAtual: null, id:'' ,metasCriadas: [], indicadoresCriados: [], cronogramasCriados: [], despesasCriadas: [], fonteRecursosCriadas: [], faseCount: 1, metaCount: 1, atividadeCount: 1 }})
    }
    cancelCadastro(){
        // clearStorage(this)
        this.clearState()
    }
    async getPlanoTrabalhoById(id){
        try {
            const plano_trabalho = await RequestData('plano_trabalho/'+id,{},'GET')
            console.log('plano_trabalho',plano_trabalho)
            let cronogramaTMP = [], fonteRecursosCriadas = [], despesasCriadas = [], etapasCriadas = [], metasCriadas = [], atividadesCriadas = []
            plano_trabalho.Cronograma.Meta && plano_trabalho.Cronograma.Meta.forEach( el => {
                if(el.Cronograma_desembolsos)
                    if(el.Cronograma_desembolsos[0]) cronogramaTMP.push(el.Cronograma_desembolsos[0])
                if(el.Fonte_recursos){
                    fonteRecursosCriadas = el.Fonte_recursos.map( (obj,index) => {
                        let temp_o = obj
                        temp_o.meta_numero = obj.numero
                        return temp_o
                    })
                }
                if(el.Plano_aplicacaos){
                    // console.log('Plano_aplicacaos', el.Plano_aplicacaos)
                    // const temp_o2 = el.Plano_aplicacao
                    despesasCriadas = el.Plano_aplicacaos.map((obj, index) => {
                        let temp_o2 = obj
                        temp_o2.especificacao = temp_o2.descricao
                        temp_o2.quantidade = temp_o2.qtd1
                        temp_o2.vl_unit = temp_o2.vl_unitario
                        return temp_o2
                    })
                }
                // let etapasTemp = []
                if(el.Atividades && Array.isArray(el.Atividades)){
                    // const meta_id = el.id
                    const meta_numero = el.numero
                    // const meta_descricao = el.descricao
                    // let etapas_x = _.uniq( el.Atividades, function(etapa) { return etapa.indicador_fisico_qtd; })
                    el.Atividades.map((v,i)=>{
                        if(etapasCriadas.find(x => x.id === parseInt(v.fase))===undefined)
                            etapasCriadas.push({id: parseInt(v.fase), atividade_id: v.id, especificacao: v.especificacao, meta_id: meta_numero, indicador_fisico_qtd: v.indicador_fisico_qtd, indicador_fisico_und: v.indicador_fisico_und, duracao_inicio: v.indicador_fisico_inicio, duracao_termino: v.indicador_fisico_termino})
                        return null
                    })
                    let atividadesTemp = []
                    el.Atividades.map((v,i)=>{
                        // if(atividadesTemp.find(x => x.id === parseInt(v.fase))===undefined)
                        let hasHorarioChecked = true
                        if(v.fl_domingo===null && v.fl_segunda===null && v.fl_terca===null && v.fl_quarta===null && v.fl_quinta===null && v.fl_sexta===null && v.fl_sabado===null) hasHorarioChecked = false
                        atividadesTemp.push({id: parseInt(i), atividade_id: v.id, especificacao: v.especificacao, meta_numero: meta_numero, fase: v.fase, hasHorarios: hasHorarioChecked, horarios: v.horarios||'', indicador_fisico_qtd: v.indicador_fisico_qtd, indicador_fisico_und: v.indicador_fisico_und, duracao_inicio: v.indicador_fisico_inicio, duracao_termino: v.indicador_fisico_termino, fl_segunda: v.fl_segunda, fl_terca: v.fl_terca, fl_quarta: v.fl_quarta, fl_quinta: v.fl_quinta, fl_sexta: v.fl_sexta, fl_sabado: v.fl_sabado, fl_domingo: v.fl_domingo, metum_id: meta_numero})
                        return null
                    })
                    atividadesCriadas = atividadesCriadas.concat(atividadesTemp)
                }
                const temp_meta = {}
                temp_meta.id = el.id
                temp_meta.numero = el.numero
                temp_meta.descricao = el.descricao
                temp_meta.atividade = el.Atividades
                temp_meta.etapas = etapasCriadas
                this.addMeta(temp_meta)
                metasCriadas.push(temp_meta)
                // console.log({atividadesCriadas})
                // etapasCriadas.push(el.Atividades)
            })
            atividadesCriadas = _.sortBy(atividadesCriadas, 'atividade_id')
            // meta.id = meta_id
            // meta.numero = parseInt(metaParm.numero)
            // meta.etapas = this.state.etapasCriadas
            // meta.atividade = this.state.atividadesCriadas
            // meta.descricao = metaParm.descricao
            let canView = false, canEdit = false
            // if(){
                if(this.props.match.params.id){
                    canView = true
                    canEdit = false
                } 
                else if(this.props.location.state && this.props.location.state.plano_trabalho_id){
                    canView = true
                    canEdit = true
                } 
                else {
                    canView = false
                    canEdit = false
                }
            // } 
            this.setState({programa_id: plano_trabalho.programa_id, cronograma_id: plano_trabalho.Cronograma.id, viewingPlanoTrabalho: canView, editPlanoTrabalho: canEdit, descricao_servicos: plano_trabalho.descricao_servicos, capacidade_atendimento: plano_trabalho.capacidade_atendimento,
                criterios_elegibilidade: plano_trabalho.criterios_elegibilidade || '', finalidades_estatutarias: plano_trabalho.finalidades_estatutarias,
                hora_funcionamento: plano_trabalho.hora_funcionamento, id: plano_trabalho.id, infraestrutura_existente: plano_trabalho.infraestrutura_existente,
                justificativa_proposicao: plano_trabalho.justificativa_proposicao, area_abrangencia: plano_trabalho.area_abrangencia, meta_prevista_atendimento: plano_trabalho.meta_prevista_atendimento,
                objetivo_especifico: plano_trabalho.objetivo_especifico, objeto_geral: plano_trabalho.objeto_geral, publico_alvo: plano_trabalho.publico_alvo,
                rh_envolvidos: plano_trabalho.rh_envolvidos, sub_area_id: plano_trabalho.sub_area_id, indicadoresCriados: plano_trabalho.Indicadors,
                demonstracao_forma: (plano_trabalho['Ctext_area'] && plano_trabalho['Ctext_area'].demonstracao_forma), monitoramento_avaliacao: (plano_trabalho['Ctext_area'] && plano_trabalho['Ctext_area'].monitoramento_avaliacao),
                resultados_esperados: (plano_trabalho['Ctext_area'] && plano_trabalho['Ctext_area'].resultados_esperados), nome: plano_trabalho.Projeto_juridica.Projeto.nome, 
                periodo_inicio: new Date(plano_trabalho.Projeto_juridica.Projeto.periodo_inicio).toLocaleDateString('pt-BR'), periodo_termino: new Date(plano_trabalho.Projeto_juridica.Projeto.periodo_termino).toLocaleDateString('pt-BR'),
                cronogramasCriados: cronogramaTMP, fonteRecursosCriadas: fonteRecursosCriadas, despesasCriadas:despesasCriadas, metasCriadas:metasCriadas, etapasCriadas: etapasCriadas, atividadesCriadas: atividadesCriadas, projeto_id: plano_trabalho.Projeto_juridica.Projeto.id, projeto_juridica_id: plano_trabalho.Projeto_juridica.id,
                cmas_numero: plano_trabalho.Projeto_juridica.pe_juridica.cmas_numero || '', cmdca_numero: plano_trabalho.Projeto_juridica.pe_juridica.cmdca_numero || '',
                cmas_vigencia: plano_trabalho.Projeto_juridica.pe_juridica.cmas_vigencia || '', cmdca_vigencia: plano_trabalho.Projeto_juridica.pe_juridica.cmdca_vigencia || ''
             })
            } catch (error) {
                console.log('error ao pegar plano de trabalho',error)
            }
        }
        componentDidMount(){
            //    if(this.props.location.state && this.props.location.state.edit) this.setFormToEdit()
            // funcoes caso precise pegar algo do back
            if(this.props.location.state && this.props.location.state.plano_trabalho_id) this.setState({id: this.props.location.state.plano_trabalho_id})
            this.getDadosCadastrais()
            this.getRepresentante()
            this.getSubAreas()
            this.getProgramas()
            if(this.props.match.params.id) this.getPlanoTrabalhoById(this.props.match.params.id)
            else if(this.state.id !== undefined && this.state.id !== '') this.getPlanoTrabalhoById(this.state.id)
            this.getPlanoTrabalhoFinished() 
            if(this.state.editPlanoTrabalho) this.setState({viewingPlanoTrabalho: false})
            
        }
        onChange(e){
            
            const target = e.target
            const value = target.type === 'checkbox' ? target.checked : target.value
            const name = target.name
            if(name==="programa_id") {
                const obj = this.state.programas.filter(el => el.id===parseInt(value))
                console.log(this.state.programas)
                console.log({obj})
                this.setState({programa_edital: obj[0].file_path})
            }
            this.setState({
                [name]: value
            })
            // this.setState({[e.target.name]:e.target.value})
        }
        onChangeDate = (name, date) => {
            this.setState({ [name]: date })
        }
        onChangeDateMask = (e) => {
            const target = e.target
            const name = target.name
            const name_extract = name.substr(0,name.length-5)
            
            const date_temp = target.value.split('/')
            const date = new Date(parseInt(date_temp[2]),parseInt(date_temp[1])-1,parseInt(date_temp[0]))

            this.setState({ [name_extract]: date, [name]: target.value })
        }
        
        render() {
            //redireciona para a rota de listagem
            if (this.state.redirectToReferrer) {
                // clearStorage(this)
                return (<Redirect to={'/plano_trabalhos'} state={{nameOng: this.state.nameOng, ongId: this.state.ongId}}/>)
            }
            
            let selectSubAreas = []
            if(this.state.dataSubAreas.length>0){
                selectSubAreas = this.state.dataSubAreas.map((e, key) => <option key={key} value={e.id}>{e.descricao}</option>)
            }
            
            let programasOptions = []
            let isNotOnePrograma = false
            if(this.state.programas){
                isNotOnePrograma = this.state.programas.length!==1
                programasOptions = this.state.programas.map((e, key) => <option key={key} value={e.id}>{e.descricao}</option>)
            }
            
            let metaOptions = []
            if(this.state.metasCriadas){
                metaOptions = this.state.metasCriadas.map( (e, key) => <option key={key} value={e.id}>N° {++key} - {e.descricao}</option> )
            }
            let etapasOptions = []
            if(this.state.cronograma_meta_id>0){
                let id_temp = this.state.cronograma_meta_id
                console.log('id_temp',id_temp)
                let numero_meta = this.state.metasCriadas.filter((v,i)=> {return (parseInt(v.id)===parseInt(id_temp))} )
                // numero
                console.log('numero_meta',numero_meta)
                console.log('metasCriadas',this.state.metasCriadas)
                if(this.state.metasCriadas.length>0){
                    let etapasOptions1 = this.state.metasCriadas[0].etapas.filter((v,i)=> {return (parseInt(v.meta_id)===parseInt(numero_meta[0].numero))} )
                    // const numero_t = this.state.metasCriadas[0].numero
                    // let etapasOptions1 = this.state.metasCriadas[0].etapas.filter((v,i)=> {return (v.meta_id===numero_t)} )
                    // console.log('etapasOptions1',etapasOptions1)
                    if(etapasOptions1.length>0){
                        etapasOptions = etapasOptions1.map( (e, key) => {
                            return <option key={key} value={e.especificacao}>{e.especificacao}</option>
                        })
                    }
                }
            }
            // let form_cronograma_concedente = []
            // if(this.state.metasCriadas){
            //     form_cronograma_concedente = this.state.metasCriadas.map((e, key) => {
            //         return (
            //             <div>
            
            //             </div>
            //         )
            // <option key={key} value={e.id}>{e.descricao}</option>
            //       })
            // }
            
            return (
                <div className="row">
                {/* <SimpleStorage parent={this} blacklist={['viewingPlanoTrabalho','newPlanoTrabalho','redirectToReferrer', 'nome', 'monitoramento_avaliacao', 'demonstracao_forma', 'resultados_esperados', 'rh_envolvidos', 'infraestrutura_existente', 'objetivo_especifico', 'objeto_geral', 'hora_funcionamento', 'criterios_elegibilidade', 'justificativa_proposicao', 'sub_area_id', 'meta_prevista_atendimento', 'capacidade_atendimento', 'publico_alvo', 'descricao_servicos', 'area_abrangencia']}/> */}
                <Loader isLoading={this.state.isLoading}/>  
                <div className="page-header">
                <h1>{this.props.location.state && this.props.location.state.objeto ? 'Editar' : 'Cadastrar'} <small>PLANO DE TRABALHO</small><button className="btn btn-default btn-small pull-right" onClick={e => this.confirmBack(e)}><strong><i className="glyphicon glyphicon-chevron-left"></i> { (this.state.editPlanoTrabalho || !this.state.viewingPlanoTrabalho) && 'CANCELAR E'} VOLTAR</strong></button></h1>
                </div>
                <div id="controlled-tab-example" className="p-top">
                <div className="row">
                <div className="col-md-12 col-lg-12 col-sm-12">
                <form id="general-form" onSubmit={this.savePlanoTrabalhoInicial.bind(this)}>
                <fieldset id="fieldset" disabled={this.state.viewingPlanoTrabalho && !this.state.editPlanoTrabalho}>
                <div className="col-md-12">
                <FormGroup controlId="tituloDadosCadastrais" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">
                EDITAL/PROGRAMA:</div>
                </div>
                <FormControl componentClass="select" name="programa_id" value={this.state.programa_id} onChange={this.onChange.bind(this)} required>
                {(isNotOnePrograma) && <option>Selecione o edital</option>}
                {programasOptions}
                </FormControl>
                </FormGroup>
              </div>
               <div className="col-md-12">
                <FormGroup controlId="tituloDadosCadastrais" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">
                DADOS CADASTRAIS:</div>
                </div>
                <p>Órgão/entidade proponente:</p>
                <p>CNPJ: <strong>{this.state.dados_cadastrais.cnpj}</strong></p>
                <p>Endereço: <strong>{this.state.dados_cadastrais.pessoa && (this.state.dados_cadastrais.pessoa.logradouro +", "+ this.state.dados_cadastrais.pessoa.numero +", "+ this.state.dados_cadastrais.pessoa.bairro)}</strong></p>
                <p>Município: <strong>{(this.state.dados_cadastrais.pessoa!==undefined&&this.state.dados_cadastrais.pessoa.cidade!==null) && this.state.dados_cadastrais.pessoa.cidade.ct_nome}</strong></p>
                <p>CEP: <strong>{this.state.dados_cadastrais.pessoa && this.state.dados_cadastrais.pessoa.cep}</strong></p>
                <p>Telefone: <strong>{this.state.dados_cadastrais.pessoa && this.state.dados_cadastrais.pessoa.telefone}</strong></p>
                <p>E-mail: <strong>{this.state.dados_cadastrais.email_contato}</strong></p>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="tituloRepresentanteLegal" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">
                REPRESENTANTE LEGAL:</div>
                </div>
                <p>CPF: <strong>{this.state.representante && this.state.representante.pe_fisica && this.state.representante.pe_fisica.cpf}</strong></p>
                <p>Endereço: <strong>{this.state.representante && this.state.representante.pe_fisica && this.state.representante.pe_fisica.pessoa && (this.state.representante.pe_fisica.pessoa.logradouro+', '+this.state.representante.pe_fisica.pessoa.numero+', '+this.state.representante.pe_fisica.pessoa.bairro)}</strong></p>
                <p>Município: <strong>{(this.state.representante && this.state.representante.pe_fisica!==undefined) && this.state.representante.pe_fisica.pessoa && this.state.representante.pe_fisica.pessoa.cidade.ct_nome}</strong></p>
                <p>Cargo: <strong>{this.state.representante && this.state.representante.cargo_funcao}</strong></p>
                <p>Contato: <strong>{this.state.dados_cadastrais && this.state.dados_cadastrais.telefone_contato}</strong></p>
                <p>E-mail: <strong>{this.state.representante && this.state.representante.email}</strong></p>
                <p>Início do mandato: <strong><Time value={(this.state.representante && new Date(this.state.representante.data_entrada_diretoria)) || null} format="DD/MM/YYYY" /></strong></p>
                <p>Término do mandato: <strong><Time value={(this.state.representante && new Date(this.state.representante.data_saida_diretoria)) || null} format="DD/MM/YYYY" /></strong></p>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="tituloDadosCadastrais" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">
                INCRIÇÃO NO CONSELHO MUNICIPAL DE ASSISTÊNCIA SOCIAL - CMAS (SE HOUVER):</div>
                </div>
                </FormGroup>
                </div>
                <div className="col-md-6">
                <FormGroup controlId="cmas_numero" bsSize="large">
                <ControlLabel>N°:</ControlLabel>
                <FormControl type="text" name="cmas_numero" value={this.state.cmas_numero || ''} placeholder="" onChange={this.onChange.bind(this)}/>
                </FormGroup>
                </div>
                <div className="col-md-6">
                <FormGroup controlId="cmas_vigencia" bsSize="large">
                <ControlLabel> Vigência</ControlLabel>
                {/* <FormControl type="text" name="cmas_vigencia" value={this.state.cmas_vigencia || ''} placeholder="" onChange={this.onChange.bind(this)}/> */}
                <FormGroup controlId="data" bsSize="large">
                {/* <DatePicker onChange={this.onChangeDate.bind(this, 'cmas_vigencia')} name="cmas_vigencia" value={this.state.cmas_vigencia} locale="pt-br" calendarIcon={(!this.state.viewingPlanoTrabalho) && <span className="fa fa-calendar"></span>} className="form-control" showLeadingZeros={true} clearIcon={null} /> */}
                <InputMask className="form-control" type="text" placeholder="DD/MM/AAAA" value={this.state.cmas_vigencia || ''} name="cmas_vigencia" onChange={this.onChangeDateMask.bind(this)} mask="99/99/9999" maskChar={null}/>
                </FormGroup>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="tituloDadosCadastrais" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">
                INCRIÇÃO NO CONSELHO MUNICIPAL DOS DIREITOS DA CRIANÇA E DO ADOLESCENTE - CMDCA (SE HOUVER):</div>
                </div>
                </FormGroup>
                </div>
                <div className="col-md-6">
                <FormGroup controlId="cmdca_numero" bsSize="large">
                <ControlLabel>N°:</ControlLabel>
                <FormControl type="text" name="cmdca_numero" value={this.state.cmdca_numero || ''} placeholder="" onChange={this.onChange.bind(this)}/>
                </FormGroup>
                </div>
                <div className="col-md-6">
                <FormGroup controlId="cmdca_vigencia" bsSize="large">
                <ControlLabel> Vigência</ControlLabel>
                {/* <DatePicker onChange={this.onChangeDate.bind(this, 'cmdca_vigencia')} name="cmdca_vigencia" value={this.state.cmdca_vigencia} calendarIcon={(!this.state.viewingPlanoTrabalho) && <span className="fa fa-calendar"></span>} locale="pt-br" className="form-control" showLeadingZeros={true} clearIcon={null} /> */}
                <InputMask className="form-control" type="text" placeholder="DD/MM/AAAA" value={this.state.cmdca_vigencia || ''} name="cmdca_vigencia" onChange={this.onChangeDateMask.bind(this)} mask="99/99/9999" maskChar={null}/>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="tituloFinalidadesCadastrais" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">
                FINALIDADES ESTATUTÁRIAS:</div>
                </div>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="finalidades_estatutarias" bsSize="large">
                <ControlLabel>Resumo:</ControlLabel>
                <FormControl componentClass="textarea" name="estatuto_social" value={this.state.dados_cadastrais.estatuto_social || ''} placeholder="" readOnly/>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="tituloDescricaoProgramaTrabalho" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">
                DESCRIÇÃO DO PROGRAMA DE TRABALHO:</div>
                </div>
                </FormGroup>
                </div>
                <div className="col-md-6">
                <FormGroup controlId="nome" bsSize="large">
                <ControlLabel><Required/> Título do projeto:</ControlLabel>
                <FormControl type="text" name="nome" value={this.state.nome || ''} placeholder="" onChange={this.onChange.bind(this)} required/>
                </FormGroup>
                </div>
                <div className="col-md-3">
                <FormGroup controlId="periodo_inicio" bsSize="large">
                <ControlLabel><Required/> Período Execução - Início:</ControlLabel>
                {/* <DatePicker onChange={this.onChangeDate.bind(this, 'periodo_inicio')} name="periodo_inicio" value={this.state.periodo_inicio} calendarIcon={(!this.state.viewingPlanoTrabalho) && <span className="fa fa-calendar"></span>} locale="pt-br" className="form-control" showLeadingZeros={true} clearIcon={null} required/> */}
                <InputMask className="form-control" type="text" placeholder="DD/MM/AAAA" value={this.state.periodo_inicio || ''} name="periodo_inicio" onChange={this.onChangeDateMask.bind(this)} mask="99/99/9999" maskChar={null} required/>
                </FormGroup>
                </div>
                <div className="col-md-3">
                <FormGroup controlId="periodo_termino" bsSize="large">
                <ControlLabel><Required/> Período Execução - Término:</ControlLabel>
                {/* <DatePicker onChange={this.onChangeDate.bind(this, 'periodo_termino')} name="periodo_termino" value={this.state.periodo_termino} calendarIcon={(!this.state.viewingPlanoTrabalho) && <span className="fa fa-calendar"></span>} locale="pt-br" className="form-control" showLeadingZeros={true} clearIcon={null} required/> */}
                <InputMask className="form-control" type="text" placeholder="DD/MM/AAAA" value={this.state.periodo_termino || ''} name="periodo_termino" onChange={this.onChangeDateMask.bind(this)} mask="99/99/9999" maskChar={null} required/>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="tipo_programa" bsSize="large">
                <ControlLabel><Required/> Tipo de Programa/Proteção:</ControlLabel>
                <FormControl componentClass="select" name="sub_area_id" value={this.state.sub_area_id} onChange={this.onChange.bind(this)} required>
                <option value="">Selecione</option>
                {selectSubAreas}
                </FormControl>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="descricao_servicos" bsSize="large">
                <ControlLabel><Required/> Descrição dos Serviços:</ControlLabel>
                <FormControl componentClass="textarea" name="descricao_servicos" value={this.state.descricao_servicos || ''} placeholder="" onChange={this.onChange.bind(this)} required />
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="publico_alvo" bsSize="large">
                <ControlLabel><Required/> Público Alvo:</ControlLabel>
                <FormControl componentClass="textarea" name="publico_alvo" value={this.state.publico_alvo || ''} placeholder="" onChange={this.onChange.bind(this)} required />
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="capacidade_atendimento" bsSize="large">
                <ControlLabel><Required/> Capacidade de Atendimento:</ControlLabel>
                <FormControl componentClass="textarea" name="capacidade_atendimento" value={this.state.capacidade_atendimento || ''} placeholder="" onChange={this.onChange.bind(this)} required />
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="meta_prevista_atendimento" bsSize="large">
                <ControlLabel><Required/> Meta Prevista de Atendimento:</ControlLabel>
                <FormControl componentClass="textarea" name="meta_prevista_atendimento" value={this.state.meta_prevista_atendimento || ''} placeholder="" onChange={this.onChange.bind(this)} required />
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="area_abrangencia" bsSize="large">
                <ControlLabel><Required/> Área de Abrangência:</ControlLabel>
                <FormControl componentClass="textarea" name="area_abrangencia" value={this.state.area_abrangencia || ''} placeholder="" onChange={this.onChange.bind(this)}/>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="hora_funcionamento" bsSize="large">
                <ControlLabel><Required/> Hora de Funcionamento:</ControlLabel>
                <FormControl componentClass="textarea" name="hora_funcionamento" value={this.state.hora_funcionamento || ''} placeholder="" onChange={this.onChange.bind(this)} required />
                </FormGroup>
                </div>
                {/* <div className="col-md-12">
                <FormGroup controlId="criterios_elegibilidade" bsSize="large">
                <ControlLabel><Required/> Critérios de Elegibilidade:</ControlLabel>
                <FormControl componentClass="textarea" name="criterios_elegibilidade" value={this.state.criterios_elegibilidade || ''} placeholder="" onChange={this.onChange.bind(this)} required />
                </FormGroup>
            </div> */}
            <div className="col-md-12">
            <FormGroup controlId="justificativa_proposicao" bsSize="large">
            <ControlLabel><Required/> Justificativa da Proposição:</ControlLabel>
            <FormControl componentClass="textarea" name="justificativa_proposicao" value={this.state.justificativa_proposicao || ''} placeholder="" onChange={this.onChange.bind(this)} required />
            </FormGroup>
            </div>
            <div className="col-md-12">
            <FormGroup controlId="objeto_geral" bsSize="large">
            <ControlLabel><Required/> Objeto Geral:</ControlLabel>
            <FormControl componentClass="textarea" name="objeto_geral" value={this.state.objeto_geral || ''} placeholder="" onChange={this.onChange.bind(this)} required />
            </FormGroup>
            </div>
            <div className="col-md-12">
            <FormGroup controlId="objetivo_especifico" bsSize="large">
            <ControlLabel><Required/> Objetivo Específico:</ControlLabel>
            <FormControl componentClass="textarea" name="objetivo_especifico" value={this.state.objetivo_especifico || ''} placeholder="" onChange={this.onChange.bind(this)} required />
            </FormGroup>
            </div>
            <div className="col-md-12">
            <FormGroup controlId="infraestrutura_existente" bsSize="large">
            <ControlLabel><Required/> Infra-estrutura Existente:</ControlLabel>
            <FormControl componentClass="textarea" name="infraestrutura_existente" value={this.state.infraestrutura_existente || ''} placeholder="" onChange={this.onChange.bind(this)} required />
            </FormGroup>
            </div>
            <div className="col-md-12">
            <FormGroup controlId="rh_envolvidos" bsSize="large">
            <ControlLabel><Required/> Recursos Humanos Envolvidos:</ControlLabel>
            <FormControl componentClass="textarea" name="rh_envolvidos" value={this.state.rh_envolvidos || ''} placeholder="" onChange={this.onChange.bind(this)} required />
            </FormGroup>
            </div>
            {/* BUTTON SAVE 1 */}
            { !this.state.hasPlanoCreated ?
                <div className="col-md-12">
                <FormGroup controlId="buttonSaveTrabalhoInicial" bsSize="large">
                <button className="btn btn-primary" type="submit"><strong><i className="fa fa-save"></i> SALVAR E CONTINUAR</strong></button>
                </FormGroup>
                </div> : null
            }
            {(this.state.hasPlanoCreated) 
                ? <div>
                <div className="col-md-12">
                <FormGroup controlId="tituloCronogramaExecucao" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">CRONOGRAMA DE EXECUÇÃO (META, ETAPA OU FASE):</div></div>
                {/* <p className="border-black"><ControlLabel>CRONOGRAMA DE EXECUÇÃO (META, ETAPA OU FASE):</ControlLabel></p> */}
                </FormGroup>
                </div>
                {/*TABLE FOR CRONOGRAMA*/}
                {(this.state.editPlanoTrabalho || !this.state.viewingPlanoTrabalho) && (<div>
                    <div className="col-md-3">
                    {/* <FormGroup controlId="metalCount" bsSize="large">
                    <ControlLabel>META N°:{this.state.metaCount}</ControlLabel>
                </FormGroup> */}
                <FormGroup controlId="meta_numero" bsSize="large">
                <ControlLabel>META N°:</ControlLabel>
                <FormControl type="text" name="metaCount" value={this.state.metaCount} onChange={this.onChange.bind(this)}/>
                </FormGroup>
                </div>
                <div className="col-md-9">
                <FormGroup controlId="descricao_meta" bsSize="large">
                <ControlLabel>Descricao da Meta:</ControlLabel>
                <FormControl type="text" name="descricao" value={this.state.descricao} onChange={this.onChange.bind(this)}/>
                </FormGroup>
                </div>
                <div className="col-md-2">
                <FormGroup controlId="etapa" bsSize="large">
                <ControlLabel>Etapa/Fase:</ControlLabel>
                <FormControl type="text" name="faseCount" value={this.state.faseCount} onChange={this.onChange.bind(this)}/>
                </FormGroup>
                </div>
                <div className="col-md-4">
                <FormGroup controlId="especificao" bsSize="large">
                <ControlLabel><Required/> Especificação:</ControlLabel>
                <FormControl type="text" name="especificacao" value={this.state.especificacao || ''} onChange={this.onChange.bind(this)}/>
                </FormGroup>
                </div>
                <div className="col-md-3">
                <FormGroup controlId="indicador_fisico_und" bsSize="large">
                <ControlLabel><Required/> Indicador Físico Und.:</ControlLabel>
                <FormControl type="text" name="indicador_fisico_und" value={this.state.indicador_fisico_und || ''} onChange={this.onChange.bind(this)}/>
                </FormGroup>
                </div>
                <div className="col-md-3">
                <FormGroup controlId="indicador_fisico_qtd" bsSize="large">
                <ControlLabel><Required/> Indicador Físico Qtd.:</ControlLabel>
                <FormControl type="text" name="indicador_fisico_qtd" value={this.state.indicador_fisico_qtd || ''} onChange={this.onChange.bind(this)}/>
                </FormGroup>
                </div>
                <div className="col-md-3">
                <FormGroup controlId="duracao_inicio" bsSize="large">
                <ControlLabel><Required/> Duração Início:</ControlLabel>
                {/* <DatePicker onChange={this.onChangeDate.bind(this, 'duracao_inicio')} name="duracao_inicio" value={this.state.duracao_inicio} calendarIcon={<span className="fa fa-calendar"></span>} locale="pt-br" className="form-control" showLeadingZeros={true} clearIcon={null}/> */}
                <InputMask className="form-control" type="text" placeholder="DD/MM/AAAA" value={this.state.duracao_inicio || ''} name="duracao_inicio" onChange={this.onChangeDateMask.bind(this)} mask="99/99/9999" maskChar={null}/>
                </FormGroup>
                </div>
                <div className="col-md-3">
                <FormGroup controlId="duracao_termino" bsSize="large">
                <ControlLabel><Required/> Duração Término:</ControlLabel>
                {/* <DatePicker onChange={this.onChangeDate.bind(this, 'duracao_termino')} name="duracao_termino" value={this.state.duracao_termino} calendarIcon={<span className="fa fa-calendar"></span>} locale="pt-br" className="form-control" showLeadingZeros={true} clearIcon={null}/> */}
                <InputMask className="form-control" type="text" placeholder="DD/MM/AAAA" value={this.state.duracao_termino || ''} name="duracao_termino" onChange={this.onChangeDateMask.bind(this)} mask="99/99/9999" maskChar={null}/>
                </FormGroup>
                </div>
                <div className="col-md-6">
                <FormGroup controlId="salvarEtapa" bsSize="large">
                <ControlLabel>(clique abaixo para salvar etapa):</ControlLabel><br></br>
                <button className="btn btn-primary btn-lg" type="button" onClick={(e) => this.saveEtapa(e)}><strong><i className="fa fa-save"></i> SALVAR ETAPA N°:{this.state.faseCount}</strong></button>
                </FormGroup>
                </div>
                </div>)}
                <div className="col-md-12 col-lg-12 col-sm-12">
                <FormGroup controlId="etapasFasesSalvas" bsSize="large">
                <ControlLabel>Etapas/Fases Salvas:</ControlLabel>
                <EtapaList blockActions={this.state.viewingPlanoTrabalho && !this.state.editPlanoTrabalho} serverUrl={config.server_url} feedData={this.state.etapasCriadas}  addAtividade={this.addAtividade} view={() => console.log('')} delete={this.confirmDeleteEtapa} edit={()=>{}} callback={()=>{}}/>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="tituloGradeAtividades" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">GRADE DE ATIVIDADES:</div>
                </div>
                </FormGroup>
                </div>
                {/* GRADE DE ATIVIDADES */}
                {(this.state.editPlanoTrabalho || !this.state.viewingPlanoTrabalho) && (<div>
                    <div className="col-md-12">
                    <FormGroup controlId="metalCount" bsSize="large">
                    <ControlLabel>ETAPA/FASE N°:{this.state.faseCurrent || 1}</ControlLabel>
                    </FormGroup>
                    </div>
                    <div className="col-md-4">
                    <FormGroup controlId="atividades" bsSize="large">
                    <ControlLabel>Atividade N°:</ControlLabel>
                    <FormControl type="text" name="atividadeCount" value={this.state.atividadeCount || 1} readOnly onChange={this.onChange.bind(this)}/>
                    </FormGroup>
                    </div>
                    <div className="col-md-8">
                    <FormGroup controlId="atividade" bsSize="large">
                    <ControlLabel><Required/> Atividade:</ControlLabel>
                    <FormControl type="text" name="atividadeCurrent" value={this.state.atividadeCurrent || ''} onChange={this.onChange.bind(this)} readOnly/>
                    </FormGroup>
                    </div>
                    <div className="col-md-5">
                    <FormGroup controlId="horarios" bsSize="large">
                    <ControlLabel><Required/> Horários:</ControlLabel>
                    {/* <FormControl type="text" name="horarios" value={this.state.horarios || ''} onChange={this.onChange.bind(this)}/> */}
                    <InputMask className="form-control" type="text" placeholder="HH:MM às HH:MM" value={this.state.horarios || ''} name="horarios" onChange={this.onChange.bind(this)} mask="99:99 \à\s 99:99" maskChar={null} required/>
                    </FormGroup>
                    </div>
                    <div className="col-md-1">
                    <FormGroup controlId="fl_segunda" bsSize="large">
                    <ControlLabel></ControlLabel><br></br>
                    <div className="alert" role="alert">
                    <Checkbox id="fl_segunda" name="fl_segunda" value={this.state.fl_segunda} onChange={this.onChange} inline>SEG</Checkbox>
                    </div>
                    </FormGroup>
                    </div>
                    <div className="col-md-1">
                    <FormGroup controlId="fl_terca" bsSize="large">
                    <ControlLabel></ControlLabel><br></br>
                    <div className="alert" role="alert">
                    <Checkbox id="fl_terca" name="fl_terca" value={this.state.fl_terca} onChange={this.onChange} inline>TER</Checkbox>
                    </div>
                    </FormGroup>
                    </div>
                    <div className="col-md-1">
                    <FormGroup controlId="fl_quarta" bsSize="large">
                    <ControlLabel></ControlLabel><br></br>
                    <div className="alert" role="alert">
                    <Checkbox id="fl_quarta" name="fl_quarta" value={this.state.fl_quarta} onChange={this.onChange} inline>QUA</Checkbox>
                    </div>
                    </FormGroup>
                    </div>
                    <div className="col-md-1">
                    <FormGroup controlId="fl_quinta" bsSize="large">
                    <ControlLabel></ControlLabel><br></br>
                    <div className="alert" role="alert">
                    <Checkbox id="fl_quinta" name="fl_quinta" value={this.state.fl_quinta} onChange={this.onChange} inline>QUI</Checkbox>
                    </div>
                    </FormGroup>
                    </div>
                    <div className="col-md-1">
                    <FormGroup controlId="fl_sexta" bsSize="large">
                    <ControlLabel></ControlLabel><br></br>
                    <div className="alert" role="alert">
                    <Checkbox id="fl_sexta" name="fl_sexta" value={this.state.fl_sexta} onChange={this.onChange} inline>SEX</Checkbox>
                    </div>
                    </FormGroup>
                    </div>
                    <div className="col-md-1">
                    <FormGroup controlId="fl_sabado" bsSize="large">
                    <ControlLabel></ControlLabel><br></br>
                    <div className="alert" role="alert">
                    <Checkbox id="fl_sabado" name="fl_sabado" value={this.state.fl_sabado} onChange={this.onChange} inline>SAB</Checkbox>
                    </div>
                    </FormGroup>
                    </div>
                    <div className="col-md-1">
                    <FormGroup controlId="fl_domingo" bsSize="large">
                    <ControlLabel></ControlLabel><br></br>
                    <div className="alert" role="alert">
                    <Checkbox id="fl_domingo" name="fl_domingo" value={this.state.fl_domingo} onChange={this.onChange} inline>DOM</Checkbox>
                    </div>
                    </FormGroup>
                    </div>
                    <div className="col-md-12">
                    <FormGroup controlId="duracao_termino" bsSize="large">
                    <ControlLabel>(clique abaixo para salvar nova atividade):</ControlLabel><br></br>
                    <button className="btn btn-primary btn-lg" type="button" onClick={(e) => this.saveAtividade(e)}><strong><i className="fa fa-save"></i> SALVAR ATIVIDADE N°:{this.state.atividadeCount || 1}</strong></button>
                    </FormGroup>
                    </div>
                    </div>)}
                    <div className="col-md-12 col-lg-12 col-sm-12">
                    <FormGroup controlId="duracao_termino" bsSize="large">
                    <ControlLabel>Atividades Salvas:</ControlLabel>
                    <AtividadeList blockActions={this.state.viewingPlanoTrabalho && !this.state.editPlanoTrabalho} serverUrl={config.server_url} feedData={this.state.atividadesCriadas} view={() => console.log('')} delete={this.confirmDeleteAtividade} edit={()=>{}} callback={()=>{}}/>
                    </FormGroup>
                    </div>
                    <div className="col-md-12">
                    <FormGroup controlId="resultados_esperados" bsSize="large">
                    <ControlLabel><Required/> Resultados Esperados:</ControlLabel>
                    <FormControl componentClass="textarea" name="resultados_esperados" value={this.state.resultados_esperados || ''} placeholder="" onChange={this.onChange.bind(this)}/>
                    </FormGroup>
                    </div>
                    <div className="col-md-12">
                    <FormGroup controlId="tituloInidicadores" bsSize="large">
                    <div className="panel panel-default shadow-sm">
                    <div className="panel-heading">INDICADORES E MEIOS DE VERIFICAÇÃO:</div>
                    </div>
                    </FormGroup>
                    </div>
                    {/* TABLE FOR INDICADORES */}
                    {(this.state.editPlanoTrabalho || !this.state.viewingPlanoTrabalho) && (<div>
                        <div className="col-md-4">
                        <FormGroup controlId="indicadores" bsSize="large">
                        <ControlLabel><Required/> Indicador</ControlLabel>
                        <FormControl type="text" name="indicador" value={this.state.indicador || ''} onChange={this.onChange.bind(this)}/>
                        </FormGroup>
                        </div>
                        <div className="col-md-5">
                        <FormGroup controlId="meioVerficicacao" bsSize="large">
                        <ControlLabel><Required/> Meio de Verificação:</ControlLabel>
                        <FormControl type="text" name="meio_verificacao" value={this.state.meio_verificacao || ''} onChange={this.onChange.bind(this)}/>
                        </FormGroup>
                        </div>
                        <div className="col-md-3">
                        <FormGroup controlId="salvarIndicador" bsSize="large">
                        <ControlLabel>(clique abaixo para salvar indicador):</ControlLabel><br></br>
                        <button className="btn btn-primary btn-lg" type="button" onClick={(e) => this.saveIndicador(e)}><strong><i className="fa fa-save"></i> SALVAR INDICADOR</strong></button>
                        </FormGroup>
                        </div>
                        </div>)
                    }
                    <div className="col-md-12 col-lg-12 col-sm-12">
                    <FormGroup controlId="indicadoresSalvos" bsSize="large">
                    <ControlLabel>Indicadores Salvos:</ControlLabel>
                    <IndicadorList blockActions={this.state.viewingPlanoTrabalho && !this.state.editPlanoTrabalho} feedData={this.state.indicadoresCriados} view={() => console.log('')} delete={this.confirmDeleteIndicador} edit={()=>{}} callback={()=>{}}/>
                    </FormGroup>
                    </div>
                    {( !this.state.hasAddMeta || (this.state.viewingPlanoTrabalho && !this.state.editPlanoTrabalho) ) ? null :
                        <div className="col-md-12">
                        <FormGroup controlId="salvarMeta" bsSize="large">
                        <ControlLabel>(Caso tenham sido cadastradas todas as etapas/atividades para a meta n°: {this.state.metaCount}, clique abaixo para finalizá-la):</ControlLabel><br></br>
                        <button className="btn btn-primary btn-lg" type="button" onClick={(e) => this.addMetaConfirm(e)}><strong><i className="fa fa-save"></i> SALVAR META ATUAL</strong></button>
                        </FormGroup>
                        </div>
                    }
                    {/* <div className="col-md-12">
                    <FormGroup controlId="monitoramento_avaliacao" bsSize="large">
                    <ControlLabel><Required/> Monitoramento e Avaliação:</ControlLabel>
                    <FormControl componentClass="textarea" name="monitoramento_avaliacao" value={this.state.monitoramento_avaliacao || ''} placeholder="" onChange={this.onChange.bind(this)}/>
                    </FormGroup>
                </div> */}
                <div className="col-md-12">
                <ControlLabel>Metas Salvas:</ControlLabel>
                    <MetaList blockActions={this.state.viewingPlanoTrabalho && !this.state.editPlanoTrabalho} serverUrl={config.server_url} feedData={this.state.metasCriadas} view={() => console.log('')} delete={this.confirmDeleteMeta} edit={()=>{}} callback={()=>{}}/>
                    </div>
                <div className="col-md-12">
                <FormGroup controlId="tituloDemonstracao" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">DEMONSTRAÇÃO DA FORMA DE PARTICIPAÇÃO DOS USUÁRIOS E/OU ESTRATÉGIAS QUE SERÃO UTILIZADAS EM TODAS AS ETAPAS DO PLANO:</div>
                </div>
                </FormGroup>
                </div>
                <div className="col-md-12">
                <FormGroup controlId="demonstracaoPlano" bsSize="large">
                <ControlLabel><Required/> ELABORAÇÃO, EXECUÇÃO, AVALIAÇÃO E MONITORAMENTO:</ControlLabel>
                <FormControl componentClass="textarea" name="demonstracao_forma" value={this.state.demonstracao_forma || ''} onChange={this.onChange.bind(this)}/>
                </FormGroup>
                </div>
                
                <div className="col-md-12">
                <FormGroup controlId="tituloPlanoAplicacoes" bsSize="large">
                <div className="panel panel-default shadow-sm">
                <div className="panel-heading">PLANO DE APLICAÇÃO DOS RECURSOS HUMANOS/FINANCEIROS:</div>
                </div>
                </FormGroup>
                </div>
                {(this.state.editPlanoTrabalho || !this.state.viewingPlanoTrabalho) && (<div>
                    <div className="col-md-12">
                    <FormGroup controlId="naturezaDespesa" bsSize="large">
                    <ControlLabel><Required/> Natureza da despesa: </ControlLabel> custeio
                    </FormGroup>
                    </div>
                    <div className="col-md-6">
                    <FormGroup controlId="metalCountCronograma" bsSize="large">
                    <ControlLabel>META N°:</ControlLabel>
                    <FormControl name="cronograma_meta_id" value={this.state.cronograma_meta_id || ''} onChange={this.onChange.bind(this)} componentClass="select">
                    <option>Selecione uma meta</option>
                    {metaOptions}
                    </FormControl>
                    </FormGroup>
                    </div>
                    <div className="col-md-6">
                    <FormGroup controlId="etapaDespesaRh" bsSize="large">
                    <ControlLabel><Required/> Etapa: </ControlLabel>
                    {/* <FormControl type="text" name="especificacao_despesa" value={this.state.especificacao_despesa || ''} onChange={this.onChange.bind(this)}/> */}
                    <FormControl name="etapa_despesa" value={this.state.etapa_despesa || ''} onChange={this.onChange.bind(this)} componentClass="select">
                    <option>Selecione uma etapa</option>
                    {etapasOptions}
                    </FormControl>                                
                    </FormGroup>
                    </div>
                    <div className="col-md-4">
                    <FormGroup controlId="especificacaoDespesaRh" bsSize="large">
                    <ControlLabel><Required/> Especificação: </ControlLabel>
                    <FormControl type="text" name="especificacao_despesa" value={this.state.especificacao_despesa || ''} onChange={this.onChange.bind(this)}/>
                    {/* <FormControl name="especificacao_despesa" value={this.state.especificacao_despesa || ''} onChange={this.onChange.bind(this)} componentClass="select">
                    <option>Selecione uma etapa</option>
                    {etapasOptions}
                    </FormControl>                                 */}
                    </FormGroup>
                    </div>
                    <div className="col-md-3">
                    <FormGroup controlId="unidade" bsSize="large">
                    <ControlLabel><Required/> UND.:</ControlLabel>
                    <FormControl type="text" name="unidade" value={this.state.unidade || ''} onChange={this.onChange.bind(this)}/>
                    </FormGroup>
                    </div>
                    <div className="col-md-2">
                    <FormGroup controlId="quantidade" bsSize="large">
                    <ControlLabel><Required/> QTD.:</ControlLabel>
                    <FormControl type="text" name="quantidade" value={this.state.quantidade || ''} onChange={this.onChange.bind(this)}/>
                    </FormGroup>
                    </div>
                    <div className="col-md-3">
                    <FormGroup controlId="valor_unt" bsSize="large">
                    <ControlLabel><Required/> Valor Unt.:</ControlLabel>
                    <CurrencyFormat className="text-right" name="valor_unt" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.valor_unt_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                        const {formattedValue, value} = values
                        this.setState({valor_unt: value, valor_unt_f: formattedValue})
                    }}/>
                    </FormGroup>
                    </div>
                    <div className="col-md-12">
                    <FormGroup controlId="acaoInserirDespesaServicos" bsSize="large">
                    <ControlLabel>Ação: </ControlLabel><br></br>
                    <button type="button" className="btn btn-lg btn-primary" onClick={this.saveDespesa.bind(this)}><strong><i className="fa fa-save"></i> INSERIR DESPESA</strong></button>
                    </FormGroup>
                    </div>
                    </div>)}
                    <div className="col-md-12">
                    <DespesaList blockActions={this.state.viewingPlanoTrabalho && !this.state.editPlanoTrabalho} serverUrl={config.server_url} feedData={this.state.despesasCriadas} view={() => console.log('')} delete={this.confirmDeleteDespesa} edit={()=>{}} callback={()=>{}}/>
                    </div>
                    <div className="col-md-12">
                    <FormGroup controlId="tituloFonteRecursos" bsSize="large">
                    <div className="panel panel-default shadow-sm">
                    <div className="panel-heading">FONTES DE RECURSOS:</div>
                    </div>
                    </FormGroup>
                    </div>
                    {(this.state.editPlanoTrabalho || !this.state.viewingPlanoTrabalho) && (<div>
                        <div className="col-md-3">
                        <FormGroup controlId="fonte_meta" bsSize="large">
                        <ControlLabel><Required/> META: </ControlLabel>
                        <FormControl name="fonte_meta_id" value={this.state.fonte_meta_id || ''} onChange={this.onChange.bind(this)} componentClass="select">
                        <option>Selecione uma meta</option>
                        {metaOptions}
                        </FormControl>
                        </FormGroup>
                        </div>
                        
                        <div className="col-md-3">
                        <FormGroup controlId="vl_municipal" bsSize="large">
                        <ControlLabel><Required/> MUNICIPAL:</ControlLabel>
                        <CurrencyFormat className="text-right" name="vl_municipal" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.vl_municipal_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                            const {formattedValue, value} = values
                            this.setState({vl_municipal: value, vl_municipal_f: formattedValue})
                        }}/>
                        </FormGroup>
                        </div>
                        <div className="col-md-3">
                        <FormGroup controlId="vl_estadual" bsSize="large">
                        <ControlLabel><Required/> ESTADUAL:</ControlLabel>
                        <CurrencyFormat className="text-right" name="vl_estadual" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.vl_estadual_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                            const {formattedValue, value} = values
                            this.setState({vl_estadual: value, vl_estadual_f: formattedValue})
                        }}/>
                        </FormGroup>
                        </div>
                        <div className="col-md-3">
                        <FormGroup controlId="vl_federal" bsSize="large">
                        <ControlLabel><Required/> FEDERAL:</ControlLabel>
                        <CurrencyFormat className="text-right" name="vl_federal" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.vl_federal_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                            const {formattedValue, value} = values
                            this.setState({vl_federal: value, vl_federal_f: formattedValue})
                        }}/>
                        </FormGroup>
                        </div>
                        <div className="col-md-3">
                        <FormGroup controlId="proprios_moeda_corrente" bsSize="large">
                        <ControlLabel><Required/> PRÓPIOS (MOEDA):</ControlLabel>
                        <CurrencyFormat className="text-right" name="proprios_moeda_corrente" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proprios_moeda_corrente_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                            const {formattedValue, value} = values
                            this.setState({proprios_moeda_corrente: value, proprios_moeda_corrente_f: formattedValue})
                        }}/>
                        </FormGroup>
                        </div>
                        <div className="col-md-3">
                        <FormGroup controlId="proprios_bens_servicos" bsSize="large">
                        <ControlLabel><Required/> PRÓPIOS (BENS/SERVIÇOS):</ControlLabel>
                        <CurrencyFormat className="text-right" name="proprios_bens_servicos" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proprios_bens_servicos_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                            const {formattedValue, value} = values
                            this.setState({proprios_bens_servicos: value, proprios_bens_servicos_f: formattedValue})
                        }}/>
                        </FormGroup>
                        </div>
                        <div className="col-md-6">
                        <FormGroup controlId="acaoInserirFonte" bsSize="large">
                        <ControlLabel>Ação: </ControlLabel><br></br>
                        <button type="button" className="btn btn-lg btn-primary" onClick={this.saveFonteRecurso.bind(this)}><strong><i className="fa fa-save"></i> INSERIR FONTE DE RECURSO</strong></button>
                        </FormGroup>
                        </div>
                        </div>)}
                        <div className="col-md-12">
                        <FonteRecursosList blockActions={this.state.viewingPlanoTrabalho && !this.state.editPlanoTrabalho} serverUrl={config.server_url} feedData={this.state.fonteRecursosCriadas} view={() => console.log('')} delete={this.confirmDeleteFonteRecurso} edit={()=>{}} callback={()=>{}}/>
                        </div>
                        
                        <div className="col-md-12">
                        <FormGroup controlId="tituloCronogramaFinanceiro" bsSize="large">
                        <div className="panel panel-default shadow-sm">
                        <div className="panel-heading">CRONOGRAMA DE DESEMBOLSO FINANCEIRO:</div>
                        </div>
                        </FormGroup>
                        </div>
                        {/* {form_cronograma_concedente} */}
                        {(this.state.editPlanoTrabalho || !this.state.viewingPlanoTrabalho) && (<div>
                            <div className="col-md-12">
                            <FormGroup controlId="metalCountCronograma" bsSize="large">
                            <ControlLabel>META N°:</ControlLabel>
                            <FormControl name="cronograma_meta_id" value={this.state.cronograma_meta_id || ''} onChange={this.onChange.bind(this)} componentClass="select">
                            <option>Selecione uma meta</option>
                            {metaOptions}
                            </FormControl>
                            </FormGroup>
                            </div>
                            
                            <div className="col-md-12">
                            <FormGroup controlId="cronogramaFinanceiroConcedente" bsSize="large">
                            <ControlLabel>Concedente: <small>Para cada meta cadastrada informe o valor financeiro de cada mês dentro de um perído de 12 meses</small></ControlLabel>
                            </FormGroup>
                            </div>
                            {/* <div className="col-md-12"> */}
                            {/* <FormGroup controlId="cronogramaFinanceiroConcedente" bsSize="large"> */}
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes1" bsSize="large">
                            <ControlLabel><Required/> 1° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_1_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_1: value, concedente_mes_1_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes2" bsSize="large">
                            <ControlLabel><Required/> 2° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_2_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_2: value, concedente_mes_2_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes3" bsSize="large">
                            <ControlLabel><Required/> 3° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_3_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_3: value, concedente_mes_3_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes4" bsSize="large">
                            <ControlLabel><Required/> 4° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_4_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_4: value, concedente_mes_4_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes5" bsSize="large">
                            <ControlLabel><Required/> 5° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_5_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_5: value, concedente_mes_5_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes6" bsSize="large">
                            <ControlLabel><Required/> 6° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_6_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_6: value, concedente_mes_6_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes7" bsSize="large">
                            <ControlLabel><Required/> 7° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_7_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_7: value, concedente_mes_7_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes8" bsSize="large">
                            <ControlLabel><Required/> 8° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_8_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_8: value, concedente_mes_8_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes9" bsSize="large">
                            <ControlLabel><Required/> 9° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_9_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_9: value, concedente_mes_9_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes10" bsSize="large">
                            <ControlLabel><Required/> 10° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_10_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_10: value, concedente_mes_10_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes11" bsSize="large">
                            <ControlLabel><Required/> 11° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_11_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_11: value, concedente_mes_11_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes12" bsSize="large">
                            <ControlLabel><Required/> 12° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.concedente_mes_12_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({concedente_mes_12: value, concedente_mes_12_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            
                            {/* </FormGroup> */}
                            {/* </div> */}
                            <div className="col-md-12">
                            <FormGroup controlId="cronogramaFinanceiroProponente" bsSize="large">
                            <ControlLabel><Required/> Proponente (contrapartida): <small>Para cada meta cadastrada informe o valor financeiro de cada mês dentro de um perído de 12 meses</small></ControlLabel>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="concedente_mes1" bsSize="large">
                            <ControlLabel><Required/> 1° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_1_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_1: value, proponente_mes_1_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes2" bsSize="large">
                            <ControlLabel><Required/> 2° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_2_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_2: value, proponente_mes_2_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes3" bsSize="large">
                            <ControlLabel><Required/> 3° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_3_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_3: value, proponente_mes_3_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes4" bsSize="large">
                            <ControlLabel><Required/> 4° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_4_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_4: value, proponente_mes_4_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes5" bsSize="large">
                            <ControlLabel><Required/> 5° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_5_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_5: value, proponente_mes_5_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes6" bsSize="large">
                            <ControlLabel><Required/> 6° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_6_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_6: value, proponente_mes_6_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes7" bsSize="large">
                            <ControlLabel><Required/> 7° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_7_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_7: value, proponente_mes_7_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes8" bsSize="large">
                            <ControlLabel><Required/> 8° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_8_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_8: value, proponente_mes_8_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes9" bsSize="large">
                            <ControlLabel><Required/> 9° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_9_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_9: value, proponente_mes_9_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes10" bsSize="large">
                            <ControlLabel><Required/> 10° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_10_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_10: value, proponente_mes_10_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes11" bsSize="large">
                            <ControlLabel><Required/> 11° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_11_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_11: value, proponente_mes_11_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-2">
                            <FormGroup controlId="proponente_mes12" bsSize="large">
                            <ControlLabel><Required/> 12° mês</ControlLabel>
                            <CurrencyFormat className="text-right" customInput={FormControl} decimalScale={2} fixedDecimalScale={true} value={this.state.proponente_mes_12_f || ''} decimalSeparator={','} thousandSeparator={'.'} prefix={'R$'} onValueChange={(values) => {
                                const {formattedValue, value} = values
                                this.setState({proponente_mes_12: value, proponente_mes_12_f: formattedValue})
                            }}/>
                            </FormGroup>
                            </div>
                            <div className="col-md-12">
                            <FormGroup controlId="salvarCronogramaDesembolso" bsSize="large">
                            {/* <ControlLabel>(clique abaixo para salvar indicador):</ControlLabel><br></br> */}
                            <button className="btn btn-primary btn-lg" type="button" onClick={(e) => this.saveCronograma(e)}><strong><i className="fa fa-save"></i> SALVAR CRONOGRAMA</strong></button>
                            </FormGroup>
                            </div>
                            </div>
                            )}
                            <div className="col-md-12">
                            <CronogramaList blockActions={this.state.viewingPlanoTrabalho && !this.state.editPlanoTrabalho} serverUrl={config.server_url} feedData={this.state.cronogramasCriados} view={() => console.log('')} delete={this.confirmDeleteCronograma} edit={()=>{}} callback={()=>{}}/>
                            </div>
                            </div> : null }
                            {/* <div className="col-md-4">
                            <FormGroup controlId="descricaoPrograma" bsSize="large">
                            <ControlLabel><Required/> Descrição do Programa</ControlLabel>
                            <FormControl type="text" name="descricaotemp" value={this.state.descricao || ''} autoFocus placeholder="Ex.: Edital 0001/2019" onChange={this.onChange.bind(this)}/>
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
                        </div> */}
                        {(this.state.editPlanoTrabalho || !this.state.viewingPlanoTrabalho) && (<div>
                            <div className="col-md-12">
                            <Required label="Campos obrigatórios"/>
                            </div>
                            </div>)}
                            {(this.state.editPlanoTrabalho || !this.state.viewingPlanoTrabalho) && (<div>
                                { (this.state.hasPlanoCreated || this.state.editPlanoTrabalho) ? 
                                    <div className="col-md-12">
                                    <div className="alert alert-info" role="alert">
                                    <Checkbox id="fl_concorda_declaracao" name="fl_concorda_declaracao" value={this.state.fl_concorda_declaracao} onChange={this.onChange} inline>Eu declaro que li o <a href={(config.server_url+this.state.programa_edital).replace("api/v1/public/","")} target="_blank" rel="noopener noreferrer">edital</a> e concordo com todos os termos nele presentes.</Checkbox>
                                    </div>
                                    <button type="button" disabled={!this.state.fl_concorda_declaracao} onClick={(e)=> this.savePlanoTrabalho(e)} className="btn btn-lg btn-primary"><strong><i className="glyphicon glyphicon-check"></i> { this.state.editPlanoTrabalho ? 'ATUALIZAR PLANO DE TRABALHO' : 'CONCLUIR CADASTRO'}</strong></button></div> : null}
                                    </div>)}
                                    </fieldset>
                                    </form>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    )
                                }
                            }
                            const pe_juridica_id = sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).pe_juridica.id
                            export default withAlert(PlanoTrabalhoForm)
import React, {Component} from 'react';
import { withAlert } from "react-alert"
import {Redirect} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' 
import { handleRequest } from '../../services/RequestData';
import PlanoTrabalhoList from './PlanoTrabalhoList';
import Loader from '../Providers/FormsHandle/Loader';
import BackHandle from '../Providers/BackHandle';
const config = require('../../config')

class PlanoTrabalho extends Component {

  constructor(props, context){
    super(props, context)
   
    this.state = {
     email: '',
     password: '',
     redirectToReferrer: false,
     isLoading: false,
     redirectToCadastrar: false,
     plano_trabalhos: [],
     newPlanoTrabalho:false,
     redirectToParecer: false,
     ongId: this.props.location.state && this.props.location.state.ongId,
     nameOng: this.props.location.state && this.props.location.state.nameOng
    };
    
    this.getPlanoTrabalhos = this.getPlanoTrabalhos.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.delete = this.delete.bind(this)
    this.edit = this.edit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.getOng = this.getOng.bind(this)
    this.goToParecer = this.goToParecer.bind(this)
    // this.logout = this.logout.bind(this)
  }

  async getPlanoTrabalhos(ongId) {
    await handleRequest('projeto_juridica/plano_trabalhos/'+ongId, {}, 'GET', 'plano_trabalhos', this)
   }

   async getOng(ongId, name){
    let tempId = (ongId ? ongId : pe_juridica_id)
    let desc = (ongId ? name : null)
    this.setState(() => {return {pe_juridica_id: tempId, nameOng: desc} }) 
    this.getPlanoTrabalhos(tempId)
   }

   async delete(id, callback){
    const resp = await handleRequest('plano_trabalho/'+id, {}, 'DELETE', null, this)
    if(resp.resp) {
      this.props.alert.success('Plano de trabalho deletado com sucesso!')
      this.getPlanoTrabalhos(this.state.pe_juridica_id)
    }
   }

   async edit(id, callback){
    try{
      const objeto = await handleRequest('plano_trabalho/'+id, {}, 'GET', null, this)
      if(objeto) {
        this.setState({gotObj: true, objeto: objeto})
          // callback()
        //   this.props.alert.success('PlanoTrabalho deletado com sucesso!')
      }else{
        this.setState({gotObj: false, obj: null})
      }
      this.setState( {isLoading: false} )
    }catch(err){
        console.log(err)
        this.setState( {isLoading: false} )
        this.props.alert.error('Houve algum erro ao editar o plano_trabalho!')
    }
   }

   goToParecer(tempId, descPlanoTrabalho){
     this.setState({redirectToParecer: true, idPlanoTrabalho: tempId, descPlanoTrabalho: descPlanoTrabalho, nameOng: this.state.nameOng, ongId: this.state.ongId})
   }

   confirmDelete(id, callback){
    confirmAlert({
        title: 'ATENÇÃO',                        
        message: 'Você realmente deseja apagar esse plano de trabalho?',               
        childrenElement: () => '',       
        confirmLabel: 'Apagar',                          
        cancelLabel: 'Cancelar',                         
        onConfirm: () => this.delete(id, callback),    
        onCancel: () => '',      
      })
   }

   componentDidMount(){
    this.getOng(this.state.ongId, this.state.nameOng)
    // this.getPlanoTrabalhos()
   }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {

      if((!(this.props.location.state && this.props.location.state.gotObj)) && this.state.gotObj) //return (<PlanoTrabalhoForm edit={true} objeto={this.state.objeto}/>)
        return (<Redirect to={{ pathname: '/plano_trabalho/form', state: {edit: true, plano_trabalho_id: this.state.objeto.id}}}/>)
      else if(this.state.newPlanoTrabalho) //return (<PlanoTrabalhoForm edit={true} objeto={this.state.objeto}/>)
        return (<Redirect to={{ pathname: '/plano_trabalho/form', state: {newPlanoTrabalho: true}}}/>)

        if(this.state.redirectToParecer) //return (<PlanoTrabalhoForm edit={true} objeto={this.state.objeto}/>)
        return (<Redirect to={{ pathname: '/pareceres', state: {isGestor: this.props.isGestor, nameOng: this.state.nameOng, ongId: this.state.ongId, idPlanoTrabalho: this.state.idPlanoTrabalho, descPlanoTrabalho: this.state.descPlanoTrabalho}}}/>)
     return (
      <div>
          <Loader isLoading={this.state.isLoading}/>  
          <div className="page-header">
            <h1>PLANOS DE TRABALHO<small>{this.state.nameOng}</small></h1>
            <BackHandle prevPathname={'/lista_ongs'} prevState={this.props.location.state} 
                    callback={null}
                    newButton={(<button className="btn btn-success pull-right" type="button" onClick={() => this.setState({newPlanoTrabalho: true})}><strong><i className="glyphicon glyphicon-plus"></i> NOVO PLANO DE TRABALHO</strong></button>)}/>
            
          </div>
      <div id="controlled-tab-example" className="p-top">
      <div className="row">
      <div className="col-md-12 col-lg-12 col-sm-12">
       <PlanoTrabalhoList serverUrl={config.server_url} feedData={this.state.plano_trabalhos || []} view={() => console.log('')} delete={this.confirmDelete} edit={this.edit} callback={() => console.log('')} goToParecer={this.goToParecer}/>
      </div>
      </div>
      </div>
      </div>
    );
  }
}
const pe_juridica_id = sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).pe_juridica.id
export default withAlert(PlanoTrabalho);

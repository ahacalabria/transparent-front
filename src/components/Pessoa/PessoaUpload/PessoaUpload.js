import React, {Component} from 'react'
import {GetData} from '../../../services/GetData'
import {DeleteData} from '../../../services/DeleteData'
import {ValidateForm} from '../../../services/ValidateForm'
import Required from '../../Providers/FormsHandle/Required'
import AnexoList from '../../Anexo/AnexoList/AnexoList'
import { withAlert } from "react-alert"
import './PessoaUpload.css'
import {Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
const config = require('../../../config')

class PessoaUpload extends Component {
     constructor(props) {
    super(props)

    this.state = {
      imageURL: '',
      pessoa_id: (props.location.state) ? props.location.state.pessoa_id : 0,
      tipo_anexo_id: '',
      filename: '',
      dataTipoAnexo: [],
      anexos: [],
      updateAnexos: false,
      redirectToReferrer: false,
      hasSubmited: false
    }    

    this.handleUploadImage = this.handleUploadImage.bind(this)
    this.onChange = this.onChange.bind(this)
    this.deletarAnexo = this.deletarAnexo.bind(this)
    this.downloadAnexo = this.downloadAnexo.bind(this)
  }
  componentDidMount(){
    if(this.state.pessoa_id === 0) {
      this.setState({redirectToReferrer: true})
    }else {
      this.getTipoAnexos()
      this.getAnexos()
    }
  }
  onChange(e){   
   this.setState({[e.target.name]:e.target.value})
  }

  handleUploadImage(ev) {
    ev.preventDefault()
    if(ValidateForm(document.getElementById("formPessoaUpload"))){
      this.setState((hasSubmited) => {
        return {hasSubmited: true}
      })
    }else{
      this.props.alert.warning("Algum campo ficou em branco. Por favor, revise o formulário.")
    }
    const data = new FormData()
    data.append('file', this.uploadInput.files[0])
    data.append('filename', this.state.filename)
    data.append('pessoa_id', this.state.pessoa_id)
    data.append('tipo_anexo_id', this.state.tipo_anexo_id)
    fetch(config.server_url+'pessoa/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((result) => {
        this.props.alert.success("Arquido enviado com sucesso!")
        this.resetForm()
        this.getAnexos()
      }).catch((err) => {
        console.log('submitAnexos (erros)')
          console.log(err)
          this.setState({updateAnexos:false})
      })
    })
  }

  convertTime(created) {
    let date = new Date(created);
    return date;
  }

  getTipoAnexos(){
    GetData('tipo_anexo', {}, true).then((result) => {
      this.setState({dataTipoAnexo:result})
    }).catch((err) => {
      console.log('getTipoAnexos (erros)')
      console.log(err)
      if(err[0]){
        err.forEach(e => {
          this.props.alert.error(e.title+": "+e.message)
        })
      }else 
        this.props.alert.error("Error! Verifique a conexão com o servidor.")
    })  
  }

  getAnexos(){
    GetData('anexo/pessoa/'+this.state.pessoa_id, {}, true).then((result) => {
      console.log('getAnexos')
      console.log(result)
      this.setState((anexos) => {
        return {anexos: result}
      })
    }).catch((err) => {
      console.log('getAnexos (erros)')
      console.log(err)
      if(err[0]){
        err.forEach(e => {
          this.props.alert.error(e.title+": "+e.message)
        })
      }else
        this.props.alert.error("Error! Verifique a conexão com o servidor.")
      this.setState((updateAnexos) => {
        return {updateAnexos: false}
      })
    })
    
  }

  deletarAnexo(id){
    DeleteData('anexo/'+id, {}, true).then((result) => {
      console.log('deletarAnexo')
      console.log(result)
      this.getAnexos()
      this.props.alert.success("Arquivo deletado com sucesso!")
    }).catch((err) => {
      console.log('deletarAnexos (erros)')
      console.log(err)
      if(err[0]!=null){
        err.forEach(e => {
          this.props.alert.error(e.title+": "+e.message)
        })
      }else{
        this.props.alert.error("Error! Verifique a conexão com o servidor.")
      }
    })
  }

  downloadAnexo(id){
    GetData('anexo/download/'+id, {}, true).then((result) => {
      console.log('downloadAnexo')
      console.log(result)
      return result
    }).catch((err) => {
      console.log('downloadAnexos (erros)')
      console.log(err)
      if(err[0]!=null){
        err.forEach(e => {
          this.props.alert.error(e.title+": "+e.message)
        })
      }else{
        this.props.alert.error("Error! Verifique a conexão com o servidor.")
        // alert("Error")
      }
    })
  }

  resetForm(){
    document.getElementById('formPessoaUpload').reset()
  }


  render() {
    // if (this.state.redirectToReferrer) {
    //   return (<Redirect to={'/cadastrar'}/>)
    // }
    let tipoAnexoSelect = []
    if(this.state.dataTipoAnexo){
      tipoAnexoSelect = this.state.dataTipoAnexo.map((e, key) => {
        return <option key={key} value={e.value}>{e.name}</option>
      })
    }

    if(this.state.updateAnexos){
      this.getAnexos()
    }

    return (
      <div>
      <div className="row">
        <div className="col-md-12">
      <form id="formPessoaUpload" onSubmit={this.handleUploadImage}>
      <FormGroup controlId="formControlsSelect" bsSize="large">
        <ControlLabel><Required/> Tipo Anexo</ControlLabel>
        <FormControl componentClass="select" placeholder="" name="tipo_anexo_id" onChange={this.onChange}>
          <option value="">Selecione o tipo de anexo</option>
          {tipoAnexoSelect}
        </FormControl>
      </FormGroup>
        <div className="form-group form-group-lg">        
        <ControlLabel><Required/> Anexo</ControlLabel>
          <input ref={(ref) => { this.uploadInput = ref }} type="file" className="form-control"/>
        </div>
        <div className="form-group">
          <ControlLabel><Required/> Nome do Arquivo</ControlLabel>
          <input name="filename" onChange={this.onChange} className="form-control" type="text" />
        </div>        
        <div>
         {/* disabled={this.state.hasSubmited}  */}
          <Button bsStyle="primary" type="submit">Salvar Anexo</Button>
        </div>
        
      </form>
      {/* <Button id="button-update" onClick={ () => {this.setState({updateAnexos:true})} } bsStyle="link"><Glyphicon glyph="refresh" /></Button> */}
      </div>
      </div>
      <br></br>
      <div className="row">
      <div className="col-md-12">
        <AnexoList feedData={this.state.anexos} convertTime={this.convertTime} deletarAnexo={this.deletarAnexo} downloadAnexo={this.downloadAnexo}/>
      </div>
      </div>
      </div>
    )
  }
}


export default withAlert(PessoaUpload)

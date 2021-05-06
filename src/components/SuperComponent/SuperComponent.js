import {Component} from 'react'
// import './SuperComponent.css'
// const validarCpf = require('validar-cpf')

class SuperComponent extends Component {

  constructor(props){
    super(props)
   
    this.state = {
      isLoading: false,
      hasErrors: false,
      errors: null,
      afonso: 'HENRIQUE'
    }
    this.handleErrors = this.handleErrors.bind(this)
    this.clearErrors = this.clearErrors.bind(this)
    this.teste = this.teste.bind(this)
  }


 
  handleErrors = (err, isLoadingCallback=false) => {
      alert('chamou o super')
    this.setState({hasErrors: true, errors: err, isLoading: isLoadingCallback})
  }
  
  clearErrors = () => {
    this.setState({hasErrors: false, errors: null})
  }

  teste(){
      alert('teste')
  }
}

export default SuperComponent
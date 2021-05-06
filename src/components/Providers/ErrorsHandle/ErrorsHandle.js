import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
// import CustomAlert from '../AlertsHandle/CustomAlert'
// import {Modal} from 'react-bootstrap'
import './ErrorsHandle.css'
import CustomAlert from '../AlertsHandle/CustomAlert';

class ErrorsHandle extends Component {
    constructor(props) {
        super(props)
        this.state = {
          show: true,
          hasErrors: false,
          errors: null
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleShow = this.handleShow.bind(this)
    }
    handleShow() {
      this.setState({ show: true })
    }

    handleClose() {
      this.setState({ show: false, errors: null, hasErrors: false })
    }

    componentWillUnmount(){
      this.handleClose()
    }

    componentDidMount(){
      this.setState({ errors: this.props.errors.error, hasErrors: true })
    }

    componentDidUpdate(prevProps, prevState, snapshot){
      if(this.props.errors !== prevProps.errors){
        this.setState({ errors: this.props.errors.error, hasErrors: true })
      }
    }

    render() {
      if(this.props.errors.status===401 && this.props.location && this.props.location.pathname !== '/login') {
        return <Redirect to="/logout"/>
      }
      let errorsContent = null
      if(this.state.errors && this.state.errors.length>0){
        errorsContent = this
        .state
        .errors
        .map(function (err, index) {
              return (
                <CustomAlert key={index} tipoAlert="error" msg={err.message || err.msg} callback={this.handleClose}/>
              )
      }, this) //: null//<CustomAlert tipoAlert="error" msg={this.state.errors.message || this.state.errors.error.message || "Verifique sua conexão com o servidor!"} callback={this.handleClose}/>//<p>Verifique sua conexão com o servidor!</p>
      }
    
    return (
        // <Modal show={this.state.show} onHide={this.handleClose}>
        //   <Modal.Header closeButton>
        //     <Modal.Title>Erros Encontrados</Modal.Title>
        //   </Modal.Header>
        //   <Modal.Body>
        <div>
          {this.state.hasErrors && errorsContent}
          {/* <CustomAlert tipoAlert="error" msg={this.props.errors.message || this.props.errors[0].message || this.props.errors[0].msg} callback={() => {}}/> */}
        </div>
        //   </Modal.Body>
        //   {/* <Modal.Footer>
        //     <Button onClick={this.handleClose}>Fechar</Button>
        //   </Modal.Footer> */}
        // </Modal>
      )
    }
}

export default ErrorsHandle
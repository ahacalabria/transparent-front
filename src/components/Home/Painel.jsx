
import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
// import './Home.css'
// import {PostData} from '../../services/PostData'
// import {GetData} from '../../services/GetData'
// import CadastroONG from "../CadastroONG/CadastroONG"
// import { withAlert } from "react-alert"
// import { Alert } from 'react-alert'
// import '../../styles/react-confirm-alert.css'
import {Button, ButtonGroup, DropdownButton, MenuItem} from 'react-bootstrap'
class Painel extends Component {
 

  constructor(props) {
    super(props)

    this.state = {
      data:[],
      userFeed: '',
      redirectToReferrer: false,
      name:'',
      hasAlert: false,
      msgAlert: '',
      titleAlert: ''
    }

    // this.getUserFeed = this.getUserFeed.bind(this)
    // this.feedUpdate = this.feedUpdate.bind(this)
    this.onChange = this.onChange.bind(this)
    // this.deleteFeed = this.deleteFeed.bind(this)
    // this.deleteFeedAction = this.deleteFeedAction.bind(this)
    // this.convertTime = this.convertTime.bind(this)
    // this.logout = this.logout.bind(this)
  }

  componentWillMount() {

  //  if(sessionStorage.getItem("user")){
  //   this.getUserFeed()
  //  }
  
  //  else{
  //   this.setState({redirectToReferrer: true})
  //  }
   
  }

  componentDidMount() {
    // if (window.performance) {
      // if (performance.navigation.type == 1) {
        // this.feedUpdate()
      // } else {
        // alert( "This page is not reloaded")
      // }
    // }
}

  feedUpdate(e) {
    // e.preventDefault()
    // let data = JSON.parse(sessionStorage.getItem("user"))
    // let token = sessionStorage.getItem("token")
    // let postData = { user_id: data.id, token: token, feed: this.state.userFeed }
    // if (this.state.data) {
    //   GetData('grupo', {}, true).then((result) => {
    //     let responseJson = result
    //     this.setState({data: responseJson})
    //     console.log(this.state)
    //   }).catch((err) => {
    //     console.log("ERRO[]UPDATED")  
    //   })
    //   console.log("UPDATED")
    // }
  }

  convertTime(created) {
    let date = new Date(created)
    return date
  }


  onChange(e){
    this.setState({userFeed:e.target.value})
   }


  render() {
    // const { style, options, message, close } = this.props
 
    
    if (this.state.redirectToReferrer) {
      return (<Redirect to={'/login'}/>)
    }else{
      // this.feedUpdate(this)
    }

    if(this.state.hasAlert){
      // this.props.alert.show("Oh look, an alert!")
    }

    return (
      <div className="container">
      <div className="col-md-12">
<ButtonGroup vertical>
  {/* <a className="btn btn-default" href="/teste">Plano de Trabalho</a> */}
  {/* <Button>Button</Button> */}
  <DropdownButton title="Plano de Trabalho" id="bg-vertical-dropdown-1">
    <MenuItem href="/plano_trabalho">Listar planos de trabalhos</MenuItem>
    <MenuItem href="/plano_trabalho/new">Adicionar nova plano</MenuItem>
  </DropdownButton>
  <Button href="/cadastro_ong">Editar ONG</Button>
  <Button href="lista_ongs">Todas as ONGs</Button>
  {/* <DropdownButton title="Dropdown" id="bg-vertical-dropdown-2">
    <MenuItem eventKey="1">Dropdown link</MenuItem>
    <MenuItem eventKey="2">Dropdown link</MenuItem>
  </DropdownButton>
  <DropdownButton title="Dropdown" id="bg-vertical-dropdown-3">
    <MenuItem eventKey="1">Dropdown link</MenuItem>
    <MenuItem eventKey="2">Dropdown link</MenuItem>
  </DropdownButton> */}
</ButtonGroup>;      
</div>
      </div>
    )
  }
}

export default Painel

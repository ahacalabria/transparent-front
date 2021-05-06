import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import './Home.css'
// import {PostData} from '../../services/PostData'
import {GetData} from '../../services/GetData'
import CadastroONG from "../CadastroONG/CadastroONG"
import { withAlert } from "react-alert"
// import { Alert } from 'react-alert'
import '../../styles/react-confirm-alert.css'

class Home extends Component {
 

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

    this.getUserFeed = this.getUserFeed.bind(this)
    this.feedUpdate = this.feedUpdate.bind(this)
    this.onChange = this.onChange.bind(this)
    this.deleteFeed = this.deleteFeed.bind(this)
    this.deleteFeedAction = this.deleteFeedAction.bind(this)
    this.convertTime = this.convertTime.bind(this)
    // this.logout = this.logout.bind(this)
  }

  componentWillMount() {

   if(sessionStorage.getItem("user")){
    this.getUserFeed()
   }
  
   else{
    this.setState({redirectToReferrer: true})
   }
   
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

  // deleteFeedAction(e){

  // let updateIndex=e.target.getAttribute('value')
  // let feed_id=e.target.getAttribute('data')
  
  // let data = JSON.parse(sessionStorage.getItem("userData"))

  // let postData = { user_id: data.userData.user_id, token: data.userData.token, feed_id: feed_id }
  // if (postData) {
  //   PostData('feedDelete', postData).then((result) => {
  //    this
  //    .state
  //    .data.splice(updateIndex,1)
  //   this.setState({data:this
  //     .state
  //     .data})
  //   })
  // }
  // }

//   deleteFeed(e){
//       confirmAlert({
//         title: '',                        
//         message: 'Are you sure?',               
//         childrenElement: () => '',       
//         confirmLabel: 'Delete',                          
//         cancelLabel: 'Cancel',                            
//         onConfirm: () => this.deleteFeedAction(e),    
//         onCancel: () => '',      
//       })
// }

  getUserFeed() {
  
    let data = JSON.parse(sessionStorage.getItem("user"))
    // this.setState({name:data.userData.name})
    // let postData = { user_id: data.userData.user_id, token: data.userData.token} 

    if (data) {
      GetData('grupo', {}, true).then((result, err) => {
        let responseJson = result
        this.setState({data: responseJson})
      }).catch((err) => {
        this.props.alert.error(err[0].title+": "+err[0].message)
        // this.logout()
      })
    }
    
  }

  onChange(e){
    this.setState({userFeed:e.target.value})
   }
  //  logout(){
  //    sessionStorage.setItem("user",'')
  //    sessionStorage.setItem("token",'')
  //    sessionStorage.clear()
  //    this.setState({redirectToReferrer: true})
  //  }

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
      <div className="row">
        <div className="col-lg-12 col-md-12">
        {/* <a href="" onClick={this.logout} className="logout">Sair do Sistema</a> */}
        {/* <form onSubmit={this.feedUpdate} method="post">
            <input name="userFeed" onChange={this.onChange} value={this.state.userFeed} type="text" placeholder="What's up?"/>
            <input
              type="submit"
              value="Post"
              className="button"
              onClick={this.feedUpdate}/>
              </form> */}
        
        </div>
        {/* <UserFeed feedData = {this.state.data}  deleteFeed = {this.deleteFeed} convertTime={this.convertTime} name={this.state.name}/> */}
        {<CadastroONG></CadastroONG>}
      
      </div>
    )
  }
}

export default withAlert(Home)
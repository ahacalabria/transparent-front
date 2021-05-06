import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import Linkify from 'react-linkify'
import './UserFeed.css'
import TimeAgo from 'react-timeago'
import brStrings from 'react-timeago/lib/language-strings/pt'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
class UserFeed extends Component {

  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: '',
      redirectToReferrer: false
     }
 
     this.callOperacoes = this.callOperacoes.bind(this)
     this.onChange = this.onChange.bind(this)
  }

  componentWillMount() {

    // if(sessionStorage.getItem("user")){
    //  this.getUserFeed()
    // }
    let state = this.state
    if(state.redirectToReferrer){
     this.setState({redirectToReferrer: true})
    }
    
   }

   onChange(e){
    this.setState({[e.target.name]:e.target.value})
   }

  callOperacoes(e) {
    let id= e.target.getAttribute('data')
    this.routeChange = true
    this.setState({redirectToReferrer: true, grupo_id: id})
  }

  
  render() {
    
    if (this.state.redirectToReferrer) {
      return (<Redirect to={{pathname: '/operacao', state: {grupo_id: this.state.grupo_id}}} preserveQueryString="false" />)
    }
  
    const formatter = buildFormatter(brStrings)
  
    let userFeed = this
      .props
      .feedData
      .map(function (feedData, index) {
        return (
          <div className="medium-12 columns" key={index}>

          <div className="people-you-might-know">
         
          <div className="row add-people-section">
            <div className="small-12 medium-10 columns about-people">
              
              <div className="about-people-author">
                <p className="author-name">
                <b>{feedData.id}</b>
                <Linkify>{feedData.nome_grupo}</Linkify>
                <br/>
                
                <TimeAgo date={this.props.convertTime(feedData.created_at)}  formatter={formatter} />
                </p>
               
              </div>    
            </div>
            <div className="small-12 medium-2 columns add-friend">
              <div className="add-friend-action">
              <button className="button secondary small" onClick={this.props.deleteFeed} data={feedData.id} value={index} >
              <i className="fa fa-user-times" aria-hidden="true"></i>
              Delete
            </button>
              <button className="button primary small" onClick={this.callOperacoes} data={feedData.id}>VER OPERAÇÕES</button>
              </div>
            </div>
          </div>
          
          
        </div>
         
          </div>
         
        )
      }, this)

    return (
      <div>
        {userFeed}

      </div>
    )
  }

}

export default UserFeed
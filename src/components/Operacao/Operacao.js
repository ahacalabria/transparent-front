import React, {Component} from 'react';
// import Linkify from 'react-linkify';
// import './UserFeed.css';
// import TimeAgo from 'react-timeago';
// import brStrings from 'react-timeago/lib/language-strings/pt';
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const queryString = require('query-string');

class Operacao extends Component {

  constructor(props){
    super(props);    
    this.redirectTo = false;
    this.target = '';
    this.state = {
        grupo_id: (props.location.state) ? props.location.state.grupo_id : 0
    }
  }

  setRedirectTo(){
    this.redirectTo = true;
  }

  getOperacoes(e) {
    // let id= e.target.getAttribute('data');
    this.setRedirectTo();
  }
  
  render() {
      
  
    // const formatter = buildFormatter(brStrings);
  
    // let userFeed = this
    //   .props
    //   .feedData
    //   .map(function (feedData, index) {
    //     return (
    //       <div className="medium-12 columns" key={index}>

    //       <div className="people-you-might-know">
         
    //       <div className="row add-people-section">
    //         <div className="small-12 medium-10 columns about-people">
              
    //           <div className="about-people-author">
    //             <p className="author-name">
    //             <b>{feedData.id}</b>
    //             <Linkify>{feedData.nome_grupo}</Linkify>
    //             <br/>
                
    //             <TimeAgo date={this.props.convertTime(feedData.created_at)}  formatter={formatter} />
    //             </p>
               
    //           </div>    
    //         </div>
    //         <div className="small-12 medium-2 columns add-friend">
    //           <div className="add-friend-action">
    //           <button className="button secondary small" onClick={this.props.deleteFeed} data={feedData.id} value={index} >
    //           <i className="fa fa-user-times" aria-hidden="true"></i>
    //           Delete
    //         </button>
    //           <button className="butotn primary small" onClick={this.getOperacoes} data={feedData.id}>VER OPERAÇÕES</button>
    //           </div>
    //         </div>
    //       </div>
          
          
    //     </div>
         
    //       </div>
         
    //     )
    //   }, this);
    let teste = queryString.parse(this.props.location.search);
    return (
      <div>
        {/* {userFeed} */}
        { this.state.grupo_id }
        {teste.buscar}
      </div>
    );
  }

}

export default Operacao;
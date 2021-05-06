import React, { Component } from 'react';
// import brStrings from 'react-timeago/lib/language-strings/pt';
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {Redirect} from 'react-router-dom'
import { Glyphicon, Table } from 'react-bootstrap';
import Time from 'react-time';
import './OngList.css';


class OngList extends Component {

  constructor(props){
    super(props)

    this.state = {
      redirectToPlanos: false
    }
  }
  

  getPlanos = (id,desc) => {
    this.setState({ongId: id, nameOng: desc, redirectToPlanos: true})
  }

  render() {
 
    // const formatter = buildFormatter(brStrings);

    if(this.state.redirectToPlanos)
        return (<Redirect to={{ pathname: '/plano_trabalhos', state: {ongId: this.state.ongId, nameOng: this.state.nameOng}}}/>)
  
    let ongList = this
      .props
      .feedData
      .map(function (feedData, index) {
        return (
            <tr key={index}>
                <td>
                    <b>{feedData.id}</b>
                </td>
                <td>{feedData.razao_social}</td>
                <td>{feedData.cnpj}</td>
                <td><Time value={feedData.data_abertura||''} format="DD/MM/YYYY" /></td>
                <td>
                    <button className="btn btn-default btn-small" title="Ver planos de trabalho" onClick={this.getPlanos.bind(this,feedData.id, feedData.razao_social)}><Glyphicon glyph="th-list"/></button> 
                    {/* <button className="btn btn-default btn-small" title="Visualizar dados da ONG"><Glyphicon glyph="inbox"/></button> */}
                    {/* <button className="btn btn-default btn-small" title="Ver diretoria diretoria"><Glyphicon glyph="user"/></button> */}
                </td>
            </tr>         
        )
      }, this);
    

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <td>#</td>
            <td>Razao Social</td>
            <td>CNPJ</td>
            <td>Data Abertura</td>
            <td>Ação</td>
            </tr>
        </thead>
        <tbody>
        {(this.props.feedData.length > 0) ? (ongList) : (<tr><td colSpan="5">Sem dados cadastrados!</td></tr>)}
        </tbody>
      </Table>
    );
  }

}

export default OngList;
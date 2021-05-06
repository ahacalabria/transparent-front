import React, {Component} from 'react';
import './AnexoList.css';
import TimeAgo from 'react-timeago';
import brStrings from 'react-timeago/lib/language-strings/pt';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {Table, Glyphicon} from 'react-bootstrap';

class AnexoList extends Component {
  render() {
 
    const formatter = buildFormatter(brStrings);
  
    let anexoList = this
      .props
      .feedData
      .map(function (feedData, index) {
        return (
            <tr key={index}>
                <td>
                    <b>{index+1}</b>
                </td>
                <td>{feedData.filename}</td>
                <td>{(feedData.Tipo_anexo) ? (feedData.Tipo_anexo.tipo): ''}</td>
                <td><TimeAgo date={this.props.convertTime(feedData.created_at)} formatter={formatter} /></td>
                <td>
                  <a className="btn btn-primary btn-small" href={(this.props.serverUrl+feedData.path).replace("api/v1/public/","")} target="blank"><Glyphicon glyph="download"/></a> <button className="btn btn-primary btn-small" onClick={this.props.deletarAnexo.bind(this, feedData.id, this.props.tipo)}><Glyphicon glyph="trash"/></button></td>
            </tr>         
        )
      }, this);
    

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <td>#</td>
            <td>Nome Arquivo</td>
            <td>Tipo Anexo</td>
            <td>Data</td>
            <td>Ação</td>
            </tr>
        </thead>
        <tbody>
        {(this.props.feedData.length > 0) ? (anexoList) : (<tr><td colSpan="5">Sem dados cadastrados!</td></tr>)}
        </tbody>
      </Table>
    );
  }

}

export default AnexoList;
import React, {Component} from 'react';
import {Table, Glyphicon} from 'react-bootstrap';  

class DirigenteList extends Component {
  render() {
   
    let dirigenteList = this
      .props
      .feedData
      .map(function (feedData, index) {
        return (
            <tr key={index}>
                <td>
                    <b>{feedData.pe_fisica.cpf}</b>
                </td>
                <td>{feedData.pe_fisica.pessoa.nome}</td>
                <td>{feedData.cargo_funcao}</td>
                <td>{feedData.fl_responsavel_legal ? <Glyphicon glyph="check"/> : <Glyphicon glyph="minus"/> }</td>
                <td>{feedData.fl_em_exercicio ? <Glyphicon glyph="check"/> : <Glyphicon glyph="minus"/> }</td>
                <td>
                  <button className="btn btn-primary btn-small" onClick={this.props.view.bind(this,feedData.id)}><Glyphicon glyph="user"/></button> 
                </td>
                <td>
                  <button className="btn btn-primary btn-small" onClick={this.props.delete.bind(this,feedData.id)}><Glyphicon glyph="trash"/></button>
                </td>
            </tr>         
        )
      }, this);
    

    return (
      <div className="col-md-12">
      <Table striped bordered condensed hover>
        <thead>
        <tr>
            <td>CPF</td>
            <td>Nome</td>
            <td>Cargo/Função</td>
            <td>Responsável Legal</td>
            <td>Em Exercício</td>
            <td>Detalhar</td>
            <td>Excluir</td>
        </tr>
        </thead>
        <tbody>
        {(this.props.feedData.length > 0) ? (dirigenteList) : (<tr><td colSpan="7">Sem dados cadastrados!</td></tr>)}

        </tbody>
        </Table>
        </div>
    );
  }

}

export default DirigenteList;
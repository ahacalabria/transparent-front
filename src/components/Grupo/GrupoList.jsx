import React, {Component} from 'react';

import {Glyphicon} from 'react-bootstrap';
const FilterableTable = require('react-filterable-table')

class GrupoList extends Component {
  
  render() {
  const renderAction = (props) => {
    return (
      <span>
          <button title="Operações" className="btn btn-primary btn-small mr-3" onClick={this.props.operacoes.bind(this, props.value, this.props.callback)}><Glyphicon glyph="th-list"/></button> 
          <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, props.value, this.props.callback)}><Glyphicon glyph="pencil"/></button> 
          {/* <button title="Excluir" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, props.value, this.props.callback)}><Glyphicon glyph="trash"/></button> */}
      </span>
    );
  }
    // Fields to show in the table, and what object properties in the data they bind to
const fields = [
	{ name: 'id', displayName: "#", inputFilterable: true, sortable: true },
	{ name: 'nome_grupo', displayName: "Nome", inputFilterable: true, exactFilterable: true, sortable: true },
//   { name: 'file_path', displayName: "Anexo", inputFilterable: true, exactFilterable: true, sortable: true, render: renderFilePath},
//   { name: 'exercicio', displayName: "Exercício", inputFilterable: true, exactFilterable: true, sortable: true },
  { name: 'id', displayName: "Ação", inputFilterable: false, exactFilterable: false, sortable: false, render: renderAction }
];
    // let GrupoList = this
    //   .props
    //   .feedData
    //   .map(function (feedData, index) {
    //     return (
    //         <tr key={index}>
    //             <td>
    //                 <b>{feedData.id}</b>
    //             </td>
    //             <td>{feedData.descricao}</td>
    //             {/* se for mostrar data */}
    //             {/* <td><Time value={feedData.created_at||''} format="DD/MM/YYYY" /></td> */}
    //             <td><a href={(this.props.serverUrl+feedData.file_path).replace("api/v1/public/","")} target="_blank"><i className="glyphicon glyphicon-save"></i> Acessar arquivo</a></td>
    //             <td>{feedData.exercicio}</td>
    //             <td>
    //                 {/* <button title="Visualizar" className="btn btn-primary btn-small mr-3" ><Glyphicon glyph="eye-open"/></button>  */}
    //                 <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, feedData.id, this.props.callback)}><Glyphicon glyph="pencil"/></button> 
    //                 <button title="Excluir" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, feedData.id, this.props.callback)}><Glyphicon glyph="trash"/></button>
    //             </td>
    //         </tr>         
    //     )
    //   }, this);
    

    return (
      // <Table striped bordered condensed hover>
      //   <thead>
      //     <tr>
      //       <th>#</th>
      //       <th>Descricao</th>
      //       <th>Edital</th>
      //       <th>Exercício</th>
      //       <th>Ação</th>
      //       </tr>
      //   </thead>
      //   <tbody>
      //   {(this.props.feedData.length > 0) ? (GrupoList) : (<tr><td colSpan="5">Sem dados cadastrados!</td></tr>)}
      //   </tbody>
      // </Table>
      <FilterableTable
	namespace="Grupo"
  initialSort="id"
  initialSortDir={false}
	data={this.props.feedData}
	fields={fields}
	noRecordsMessage="Sem dados cadastrados"
  noFilteredRecordsMessage="Nenhum dado encontrado!"
  loadingMessage="Carregando"
  recordCountName="grupo"
  recordCountNamePlural="grupos"
  autofocusFilter={true}
  serverErrorMessage="Erro ao acessar servidor"
  pagerTitles={{ first: 'Início', last: 'Fim' }}
  pageSizes={null}
  topPagerVisible={false}
/>
    );
  }

}

export default GrupoList;
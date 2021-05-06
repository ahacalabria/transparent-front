import React, {Component} from 'react';

import {Glyphicon} from 'react-bootstrap';
import Moment from 'react-moment';
const FilterableTable = require('react-filterable-table')

class ParecerList extends Component {
  
  render() {
    // const user = JSON.parse(sessionStorage.getItem('user'))
    const renderTipo = (props) => {
      return (props.value === 'aprovado_com_ressalva') ? 'Aprovado com Ressalva'.toUpperCase() : props.value.toUpperCase();
    }
    const renderDate = (props) => {
      return (<Moment format="DD/MM/YYYY \à\s HH:mm">{props.value}</Moment>)
    }

  const renderAction = (props) => {
    return (
      <span>
          <button title="Visualizar" className="btn btn-primary btn-small mr-3" onClick={this.props.view.bind(this, props.value, this.props.callback)}><Glyphicon glyph="eye-open"/></button> 
          {/* {((props.record.User && props.record.User.id) === user.id) ?
          (<span><button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, props.value, this.props.callback)}><Glyphicon glyph="pencil"/></button> 
          <button title="Excluir" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, props.value, this.props.callback)}><Glyphicon glyph="trash"/></button></span>)
          : null}  */}
      </span>
    );
  }
    // Fields to show in the table, and what object properties in the data they bind to
const fields = [
	{ name: 'id', displayName: "#", inputFilterable: true, sortable: true },
	{ name: 'tipo_parecer', displayName: "TIPO PARECER", inputFilterable: true, exactFilterable: true, sortable: true, render: renderTipo},
  { name: 'created_at', displayName: "DATA", inputFilterable: true, exactFilterable: true, sortable: true, render: renderDate},
  // { name: 'exercicio', displayName: "Exercício", inputFilterable: true, exactFilterable: true, sortable: true },
  { name: 'id', displayName: "Ação", inputFilterable: false, exactFilterable: false, sortable: false, render: renderAction }
];
    // let ParecerList = this
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
      //   {(this.props.feedData.length > 0) ? (ParecerList) : (<tr><td colSpan="5">Sem dados cadastrados!</td></tr>)}
      //   </tbody>
      // </Table>
      <FilterableTable
	namespace="Parecer"
  initialSort="id"
  initialSortDir={false}
	data={this.props.feedData}
	fields={fields}
	noRecordsMessage="Sem dados cadastrados"
  noFilteredRecordsMessage="Nenhum dado encontrado!"
  loadingMessage="Carregando"
  recordCountName="parecer"
  recordCountNamePlural="pareceres"
  autofocusFilter={true}
  serverErrorMessage="Erro ao acessar servidor"
  pagerTitles={{ first: 'Início', last: 'Fim' }}
  pageSizes={null}
  topPagerVisible={false}
/>
    );
  }

}

export default ParecerList;
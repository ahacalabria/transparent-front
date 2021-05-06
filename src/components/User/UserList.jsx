import React, {Component} from 'react';
// import './UserList.css';
// import Time from 'react-time';
// import brStrings from 'react-timeago/lib/language-strings/pt';
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {Glyphicon} from 'react-bootstrap';
const FilterableTable = require('react-filterable-table')

class UserList extends Component {
  
  render() {
    console.log(this.props.feedData)
    // const renderFilePath = (props) => {
      /*
       * This props object looks like this:
       * {
       *   value:  (value of the field in the data. In this case, it's the person's age.),
       *   record: (the data record for the whole row, in this case it'd be: { name: "Steve", age: 27, job: "Sandwich Eater" }),
       *   field:  (the same field object that this render function was passed into. We'll have access to any props on it, including that 'someRandomProp' one we put on there. Those can be functions, too, so we can add custom onClick handlers to our return value)
       * }
       */
    
      // If they are over 60, use the "blind" icon, otherwise use a motorcycle
      // const iconClassName = "fa fa-" + (props.value > 60 ? "blind" : "motorcycle");
      // const url = (props.value).replace("api/v1/public/","")
    
    //   return (
    //     <span>
    //     <a href={(this.props.serverUrl+props.value).replace("api/v1/public/","")} target="_blank" rel="noopener noreferrer"><i className="glyphicon glyphicon-save"></i> Acessar arquivo</a>
    //     </span>
    //   );
    // };
     
    // const formatter = buildFormatter(brStrings);
    const renderStatus = props => {
      return (
        <span>{(props.value) ? 'HABILITADO' : 'NÃO HABILITADO'}</span>
      )
    }
  const renderAction = (props) => {
    return (
      <span>
          <button title="Grupos" className="btn btn-primary btn-small mr-3" onClick={this.props.grupos.bind(this, props.value, props.record.email, this.props.callback)}><Glyphicon glyph="wrench"/></button> 
          {/* <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, props.value, this.props.callback)}><Glyphicon glyph="pencil"/></button>  */}
          {props.record.id!==1 && <button title={props.record.status ? 'DESABILITAR' : 'HABILITAR'} className={props.record.status ? "btn btn-success btn-small mr-3" : "btn btn-warning btn-small mr-3"} onClick={this.props.activeUser.bind(this, props.value, !props.record.status, this.props.callback)}><Glyphicon glyph={props.record.status ? 'check' : 'unchecked'}/></button> }
          {/* {props.record.id!==1 && <button title="Excluir" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, props.value, this.props.callback)}><Glyphicon glyph="trash"/></button>} */}
      </span>
    );
  }
    // Fields to show in the table, and what object properties in the data they bind to
const fields = [
	{ name: 'id', displayName: "#", inputFilterable: true, sortable: true },
	{ name: 'email', displayName: "Email", inputFilterable: true, exactFilterable: true, sortable: true },
//   { name: 'file_path', displayName: "Anexo", inputFilterable: true, exactFilterable: true, sortable: true, render: renderFilePath},
  { name: 'status', displayName: "Habilitado", inputFilterable: true, exactFilterable: true, sortable: true, render: renderStatus },
    { name: 'id', displayName: "Ação", inputFilterable: false, exactFilterable: false, sortable: false, render: renderAction }
];
    // let UserList = this
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
      //   {(this.props.feedData.length > 0) ? (UserList) : (<tr><td colSpan="5">Sem dados cadastrados!</td></tr>)}
      //   </tbody>
      // </Table>
      <FilterableTable
	namespace="User"
  initialSort="id"
  initialSortDir={false}
	data={this.props.feedData}
	fields={fields}
	noRecordsMessage="Sem dados cadastrados"
  noFilteredRecordsMessage="Nenhum dado encontrado!"
  loadingMessage="Carregando"
  recordCountName="user"
  recordCountNamePlural="users"
  autofocusFilter={true}
  serverErrorMessage="Erro ao acessar servidor"
  pagerTitles={{ first: 'Início', last: 'Fim' }}
  pageSizes={null}
  topPagerVisible={false}
/>
    );
  }

}

export default UserList;
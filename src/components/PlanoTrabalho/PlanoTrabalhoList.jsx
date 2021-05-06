import React, {Component} from 'react';
// import './PlanoTrabalhoList.css';
// import Time from 'react-time';
// import brStrings from 'react-timeago/lib/language-strings/pt';
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {Glyphicon} from 'react-bootstrap';
import Moment from 'react-moment';
const FilterableTable = require('react-filterable-table')

class PlanoTrabalhoList extends Component {

  constructor(props){
    super(props)
    this.state = {
      canJudge: true
    }
  }
  
  render() {
    const renderDate = (props) => {
      return (<Moment format="DD/MM/YYYY \à\s HH:mm">{props.value}</Moment>)
    }
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
  const renderAction = (props) => {
    return (
      <span>
          {/* <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, props.value, this.props.callback)}><Glyphicon glyph="pencil"/></button> 
          <button title="Excluir" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, props.value, this.props.callback)}><Glyphicon glyph="trash"/></button> */}

          <a title="Visualizar" className="btn btn-primary btn-small mr-3" href={"/plano_trabalho/"+props.value}><Glyphicon glyph="eye-open"/></a> 
          {props.record.Plano_trabalho.fl_cadastrado_finalizado ? null : <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, props.value, this.props.callback)}><Glyphicon glyph="pencil"/></button>}
          {this.state.canJudge && <button title="Emitir parecer" className="btn btn-success btn-small mr-3" onClick={this.props.goToParecer.bind(this, props.value, props.record.Projeto.nome, this.props.callback)}><Glyphicon glyph="check"/></button> }
          <button title="Excluir" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, props.value, this.props.callback)}><Glyphicon glyph="trash"/></button>
      </span>
    );
  }
    // Fields to show in the table, and what object properties in the data they bind to
const fields = [
	{ name: 'id', displayName: "#", inputFilterable: true, sortable: true },
	{ name: 'Projeto.nome', displayName: "Descrição", inputFilterable: true, exactFilterable: true, sortable: true },
  // { name: 'file_path', displayName: "Anexo", inputFilterable: true, exactFilterable: true, sortable: true, render: renderFilePath},
  { name: 'Plano_trabalho.Sub_area.descricao', displayName: "Área de Abrangência", inputFilterable: true, exactFilterable: true, sortable: true },
  { name: 'created_at', displayName: "Data Criação", inputFilterable: true, exactFilterable: true, sortable: true, render: renderDate},
  { name: 'updated_at', displayName: "Data Edição", inputFilterable: true, exactFilterable: true, sortable: true, render: renderDate},
  { name: 'Plano_trabalho.id', displayName: "Ação", inputFilterable: false, exactFilterable: false, sortable: false, render: renderAction }
];
    // let PlanoTrabalhoList = this
    //   .props
    //   .feedData
    //   .map(function (feedData, index) {
    //     return (
    //         <tr key={index}>
    //             <td>
    //                 <b>{feedData.Plano_trabalho && feedData.Plano_trabalho.id}</b>
    //             </td>
    //             <td>{feedData.Projeto.nome}</td>
    //             {/* se for mostrar data */}
    //             {/* <td><Time value={feedData.created_at||''} format="DD/MM/YYYY" /></td> */}
    //             {/* <td><a href={(this.props.serverUrl+feedData.file_path).replace("api/v1/public/","")} target="_blank"><i className="glyphicon glyphicon-save"></i> Acessar arquivo</a></td> */}
    //             <td>{feedData.Plano_trabalho.Sub_area.descricao}</td>
    //             <td>
    //                 <a title="Visualizar" className="btn btn-primary btn-small mr-3" href={"/plano_trabalho/"+feedData.Plano_trabalho.id}><Glyphicon glyph="eye-open"/></a> 
    //                 <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, feedData.Plano_trabalho.id, this.props.callback)}><Glyphicon glyph="pencil"/></button> 
    //                 {this.state.canJudge && <button title="Emitir parecer" className="btn btn-success btn-small mr-3" onClick={this.props.goToParecer.bind(this, feedData.Plano_trabalho.id, feedData.Projeto.nome, this.props.callback)}><Glyphicon glyph="check"/></button> }
    //                 <button title="Excluir" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, feedData.Plano_trabalho.id, this.props.callback)}><Glyphicon glyph="trash"/></button>
    //             </td>
    //         </tr>         
    //     )
    //   }, this);
    return (
      // <Table striped bordered condensed hover>
      //   <thead>
      //     <tr>
      //       <th>#</th>
      //       <th>Projeto</th>
      //       {/* <th>Edital</th> */}
      //       <th>Área de Abragência</th>
      //       <th>Ação</th>
      //       </tr>
      //   </thead>
      //   <tbody>
      //   {(this.props.feedData.length > 0) ? (PlanoTrabalhoList) : (<tr><td colSpan="4">Sem planos cadastrados!</td></tr>)}
      //   </tbody>
      // </Table>
      <FilterableTable
	namespace="PlanoTrabalho"
  initialSort="id"
  initialSortDir={false}
	data={this.props.feedData}
	fields={fields}
	noRecordsMessage="Sem dados cadastrados"
  noFilteredRecordsMessage="Nenhum dado encontrado!"
  loadingMessage="Carregando..."
  recordCountName="plano de trabalho"
  recordCountNamePlural="planos de trabalho"
  autofocusFilter={true}
  serverErrorMessage="Erro ao acessar servidor"
  pagerTitles={{ first: 'Início', last: 'Fim' }}
  pageSizes={null}
  topPagerVisible={false}
/>
    );
  }

}

export default PlanoTrabalhoList;
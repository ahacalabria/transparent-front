import React, {Component} from 'react';
import CurrencyFormat from 'react-currency-format'
import {Glyphicon} from 'react-bootstrap';
import Moment from 'react-moment';
const FilterableTable = require('react-filterable-table')

class PagamentoList extends Component {
  
  render() {
    const renderDate = (props) => {
      return (<Moment format="DD/MM/YYYY">{props.value}</Moment>)
    }
    const renderMoney = (props) => {
      return (<CurrencyFormat value={parseFloat(props.value)||0.0} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} />)
    }

  const renderAction = (props) => {
    return (
      <span>
        <button title="Prestar Conta" className="btn btn-primary btn-small mr-3" onClick={this.props.goToPrestacao.bind(this, props.record.Convenio.id, props.record.Convenio.plano_trabalho_id, this.props.callback)}><Glyphicon glyph="lock"/></button> 
          {/* <button title="Detalhar" className="btn btn-primary btn-small mr-3" onClick={this.props.operacoes.bind(this, props.value, this.props.callback)}><Glyphicon glyph="lock"/></button>  */}
          {/* <button title="Realizar Pagamento" className="btn btn-success btn-small mr-3" onClick={this.props.operacoes.bind(this, props.value, this.props.callback)}><Glyphicon glyph="usd"/></button>  */}
          {/* <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, props.value, this.props.callback)}><Glyphicon glyph="pencil"/></button>  */}
          <button title="Excluir" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, props.value, this.props.callback)}><Glyphicon glyph="trash"/></button>
      </span>
    );
  }
    // Fields to show in the table, and what object properties in the data they bind to
const fields = [
	{ name: 'id', displayName: "#", inputFilterable: true, sortable: true },
    { name: 'descricao', displayName: "Descrição", inputFilterable: true, exactFilterable: true, sortable: true },
    { name: 'valor', displayName: "Valor", inputFilterable: true, exactFilterable: true, sortable: true, render: renderMoney },
    { name: 'data_pg', displayName: "Data", inputFilterable: true, exactFilterable: true, sortable: true, render: renderDate},
    { name: 'Convenio.numero_convenio', displayName: "N° Convênio", inputFilterable: true, exactFilterable: true, sortable: true},
//   { name: 'file_path', displayName: "Anexo", inputFilterable: true, exactFilterable: true, sortable: true, render: renderFilePath},
//   { name: 'exercicio', displayName: "Exercício", inputFilterable: true, exactFilterable: true, sortable: true },
  { name: 'id', displayName: "Ação", inputFilterable: false, exactFilterable: false, sortable: false, render: renderAction }
];
    // let PagamentoList = this
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
      //   {(this.props.feedData.length > 0) ? (PagamentoList) : (<tr><td colSpan="5">Sem dados cadastrados!</td></tr>)}
      //   </tbody>
      // </Table>
      <FilterableTable
	namespace="Pagamento"
  initialSort="id"
  initialSortDir={false}
	data={this.props.feedData}
	fields={fields}
	noRecordsMessage="Sem dados cadastrados"
  noFilteredRecordsMessage="Nenhum dado encontrado!"
  loadingMessage="Carregando"
  recordCountName="pagamento"
  recordCountNamePlural="pagamentos"
  autofocusFilter={true}
  serverErrorMessage="Erro ao acessar servidor"
  pagerTitles={{ first: 'Início', last: 'Fim' }}
  pageSizes={null}
  topPagerVisible={false}
/>
    );
  }

}

export default PagamentoList;
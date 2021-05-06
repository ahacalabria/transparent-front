import React, {Component} from 'react';
// import './PlanoTrabalhoList.css';
// import Time from 'react-time';
// import brStrings from 'react-timeago/lib/language-strings/pt';
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {Glyphicon, Table} from 'react-bootstrap';
// import Time from 'react-time/lib/Time';
// const FilterableTable = require('react-filterable-table')
import CurrencyFormat from 'react-currency-format'

class DespesaList extends Component {
  
  render() {
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
  // const renderAction = (props) => {
  //   return (
  //     <span>
  //         <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, props.value, this.props.callback)}><Glyphicon glyph="pencil"/></button> 
  //         <button title="Excluir" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, props.value, this.props.callback)}><Glyphicon glyph="trash"/></button>
  //     </span>
  //   );
  // }
    // Fields to show in the table, and what object properties in the data they bind to
// const fields = [
// 	{ name: 'id', displayName: "#", inputFilterable: true, sortable: true },
// 	{ name: 'descricao', displayName: "Descrição", inputFilterable: true, exactFilterable: true, sortable: true },
//   { name: 'file_path', displayName: "Anexo", inputFilterable: true, exactFilterable: true, sortable: true, render: renderFilePath},
//   { name: 'exercicio', displayName: "Exercício", inputFilterable: true, exactFilterable: true, sortable: true },
//   { name: 'id', displayName: "Ação", inputFilterable: false, exactFilterable: false, sortable: false, render: renderAction }
// ];
    let totalDespesas = 0
    let subtotal = 0
    let DespesaList = this
      .props
      .feedData
      .map(function (feedData, index) {
        let valor_unt = parseFloat((feedData.hasOwnProperty('vl_unitario')) ? feedData.vl_unitario : feedData.valor_unt)
        let qtd = parseFloat(feedData.hasOwnProperty('qtd1') ? feedData.qtd1 : feedData.quantidade)
        let id = feedData.metum_id
        subtotal = (parseFloat(valor_unt||0.0)*parseFloat(qtd||0.0))
        totalDespesas += parseFloat(subtotal)
        return (
            <tr key={index}>
                <td>{id || ''}</td>
                <td>{index+1}</td>
                <td>{feedData.especificacao||''}</td>
                <td className="text-right">{qtd||''}</td>
                <td className="text-right">{feedData.unidade||''}</td>
                <td className="text-right"><CurrencyFormat value={parseFloat(valor_unt)||0.0} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td className="text-right"><CurrencyFormat value={subtotal||0.0} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td>
                  {this.props.blockActions ? <small>-</small> : <button title="Excluir" type="button" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, feedData.id, this.props.callback)}><Glyphicon glyph="trash"/></button>}
                </td>
            </tr>         
        )
      }, this);
    

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Meta</th>
            <th>#</th>
            <th>ESPECIFICAÇÃO</th>
            <th className="text-right">QTD</th>
            <th className="text-right">UND</th>
            <th className="text-right">VALOR UNT.</th>
            <th className="text-right">VALOR SUBTOTAL</th>
            <th>AÇÃO</th>
            </tr>
        </thead>
        <tbody>
        {(this.props.feedData.length > 0) ? (DespesaList) : (<tr><td colSpan="8">Nenhuma despesa salva!</td></tr>)}
        </tbody>
        <tfoot>
            <tr><td colSpan="8"><strong className="pull-right">Total: <CurrencyFormat value={totalDespesas} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></strong></td></tr>
        </tfoot>
      </Table>
//       <FilterableTable
// 	namespace="Meta"
//   initialSort="id"
//   initialSortDir={false}
// 	data={this.props.feedData}
// 	fields={fields}
// 	noRecordsMessage="Sem dados cadastrados"
//   noFilteredRecordsMessage="Nenhum dado encontrado!"
//   loadingMessage="Carregando"
//   recordCountName="programa"
//   recordCountNamePlural="programas"
//   autofocusFilter={true}
//   serverErrorMessage="Erro ao acessar servidor"
//   pagerTitles={{ first: 'Início', last: 'Fim' }}
//   pageSizes={null}
//   topPagerVisible={false}
// />
    );
  }

}

export default DespesaList;
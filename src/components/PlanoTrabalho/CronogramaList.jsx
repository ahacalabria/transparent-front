import React, {Component} from 'react';
// import './PlanoTrabalhoList.css';
// import Time from 'react-time';
// import brStrings from 'react-timeago/lib/language-strings/pt';
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {Glyphicon, Table} from 'react-bootstrap';
// import Time from 'react-time/lib/Time';
// const FilterableTable = require('react-filterable-table')
import CurrencyFormat from 'react-currency-format'

class CronogramaList extends Component {
  
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
    //     <strong>
    //     <a href={(this.props.serverUrl+props.value).replace("api/v1/public/","")} target="_blank" rel="noopener noreferrer"><i className="glyphicon glyphicon-save"></i> Acessar arquivo</a>
    //     </strong>
    //   );
    // };
     
    // const formatter = buildFormatter(brStrings);
  // const renderAction = (props) => {
  //   return (
  //     <strong>
  //         <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, props.value, this.props.callback)}><Glyphicon glyph="pencil"/></button> 
  //         <button title="Excluir" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, props.value, this.props.callback)}><Glyphicon glyph="trash"/></button>
  //     </strong>
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
        let totalConcedente = 0.0
        let totalProponente = 0.0
    let CronogramaConcedenteList = this.props.feedData.length>0 && this
      .props
      .feedData
      .map(function (feedData, index) {
        // console.log({feedData})
        totalConcedente += parseFloat(feedData.concedente_mes_1||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_2||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_3||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_4||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_5||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_6||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_7||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_8||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_9||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_10||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_11||"0.0")
        totalConcedente += parseFloat(feedData.concedente_mes_12||"0.0")
        return (
          
            <tr key={index}>
                <td>{index+1}</td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_1)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_2)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_3)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_4)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_5)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_6)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_7)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_8)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_9)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_10)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_11)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.concedente_mes_12)||"0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td>
                    {this.props.blockActions ? <small>-</small> : <button title="Excluir" type="button" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, feedData.id, this.props.callback)}><Glyphicon glyph="trash"/></button>}
                </td>
            </tr>         
        )
      }, this)
    
    let CronogramaProponenteList = this.props.feedData.length>0 && this
      .props
      .feedData
      .map(function (feedData, index) {
        // console.log(feedData[index])
        totalProponente += parseFloat(feedData.proponente_mes_1 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_2 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_3 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_4 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_5 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_6 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_7 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_8 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_9 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_10 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_11 || "0.00")
        totalProponente += parseFloat(feedData.proponente_mes_12 || "0.00")
        return (
            <tr key={index}>
                <td>{++index}</td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_1)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_2)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_3)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_4)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_5)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_6)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_7)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_8)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_9)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_10)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_11)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td><CurrencyFormat value={parseFloat(feedData.proponente_mes_12)||"0.0"} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></td>
                <td>
                {this.props.blockActions ? <small>-</small> : <button title="Excluir" type="button" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, feedData.id, this.props.callback)}><Glyphicon glyph="trash"/></button>}
                </td>
            </tr>         
        )
      }, this)
    return (
        <div>
            <div className="col-md-12">
                <label>Concedente:</label>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>Meta</th>
                        <th>1° MÊS</th>
                        <th>2° MÊS</th>
                        <th>3° MÊS</th>
                        <th>4° MÊS</th>
                        <th>5° MÊS</th>
                        <th>6° MÊS</th>
                        <th>7° MÊS</th>
                        <th>8° MÊS</th>
                        <th>9° MÊS</th>
                        <th>10° MÊS</th>
                        <th>11° MÊS</th>
                        <th>12° MÊS</th>
                        <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                    {(this.props.feedData.length > 0) ? (CronogramaConcedenteList) : (<tr><td colSpan="14">Nenhum cronograma salvo!</td></tr>)}
                    </tbody>
                    <tfoot>
                        <tr><td colSpan="14"><strong className="pull-right">Total: <CurrencyFormat value={totalConcedente} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></strong></td></tr>
                    </tfoot>
                </Table>
                
            </div>
            {/* </div> */}
            <div className="col-md-12">
                <label>Proponente (contrapartida):</label>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>Meta</th>
                        <th>1° MÊS</th>
                        <th>2° MÊS</th>
                        <th>3° MÊS</th>
                        <th>4° MÊS</th>
                        <th>5° MÊS</th>
                        <th>6° MÊS</th>
                        <th>7° MÊS</th>
                        <th>8° MÊS</th>
                        <th>9° MÊS</th>
                        <th>10° MÊS</th>
                        <th>11° MÊS</th>
                        <th>12° MÊS</th>
                        <th>Ação</th> 
                        </tr>
                    </thead>
                    <tbody>
                    {(this.props.feedData.length > 0) ? (CronogramaProponenteList) : (<tr><td colSpan="14">Nenhum cronograma salvo!</td></tr>)}
                    </tbody>
                    <tfoot>
                        <tr><td colSpan="14"><strong className="pull-right">Total: <CurrencyFormat value={totalProponente} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} /></strong></td></tr>
                    </tfoot>
                </Table>
            </div>
        </div>
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

export default CronogramaList;
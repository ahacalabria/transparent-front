import React, {Component} from 'react';
import CurrencyFormat from 'react-currency-format'
import {Glyphicon} from 'react-bootstrap';
import { Redirect } from 'react-router-dom'

const FilterableTable = require('react-filterable-table')

class ConvenioList extends Component {
  constructor(){
    super();
   
    this.state = {

     redirectToReferrer: false,
     convenio_id: null,
    };

  }
  toConvenioHtml(id){
    this.setState({convenio_id:id})
    //this.setState({redirectToReferrer: true})
  }
  render() {
    // const renderDate = (props) => {
    //   return (<Moment format="DD/MM/YYYY \à\s HH:mm">{props.value}</Moment>)
    // }
    const renderMoney = (props) => {
      return (<CurrencyFormat value={parseFloat(props.value)||0.0} decimalScale={2} fixedDecimalScale={true} decimalSeparator={','} displayType={'text'} thousandSeparator={'.'} prefix={'R$'} />)
    }

  const renderAction = (props) => {
    return (
      <span>
          <button title="Prestação Contas" className="btn btn-primary btn-small mr-3" onClick={this.props.prestacoes.bind(this, props.value, props.record.plano_trabalho_id,this.props.callback)}><Glyphicon glyph="book"/></button> 
          <button title="Detalhes do Convênio" className="btn btn-warning btn-small mr-3" onClick={this.props.view.bind(this, props.value)}><Glyphicon glyph="eye-open"/></button> 
    {/* {this.props.isUserLogged() && <button title="Pagamentos" className="btn btn-success btn-small mr-3" onClick={this.props.goToPagamentos.bind(this, props.value, this.props.callback)}><Glyphicon glyph="usd"/></button> } */}
          {/* <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, props.value, this.props.callback)}><Glyphicon glyph="pencil"/></button>  */}

    {this.props.isUserLogged() &&  <button title="Imprimir Convênio" className="btn btn-success btn-small mr-3" onClick={this.toConvenioHtml.bind(this, props.value)}><Glyphicon glyph="print"/></button> }
    {(this.props.isUserLogged() && this.props.canDelete) &&  <button title="Excluir Convênio" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, props.value, this.props.callback)}><Glyphicon glyph="trash"/></button> }

      </span>
    );
  }
    // Fields to show in the table, and what object properties in the data they bind to
const fields = [
	{ name: 'id', displayName: "#", inputFilterable: true, sortable: true },
    { name: 'numero_convenio', displayName: "N° Convênio", inputFilterable: true, exactFilterable: true, sortable: true },
    { name: 'pe_juridica.razao_social', displayName: "ONG", inputFilterable: true, exactFilterable: true, sortable: true },
    { name: 'valor_total_convenio', displayName: "Valor total do Convênio", inputFilterable: true, exactFilterable: true, sortable: true, render: renderMoney},
//   { name: 'file_path', displayName: "Anexo", inputFilterable: true, exactFilterable: true, sortable: true, render: renderFilePath},
//   { name: 'exercicio', displayName: "Exercício", inputFilterable: true, exactFilterable: true, sortable: true },
  { name: 'id', displayName: "Ação", inputFilterable: false, exactFilterable: false, sortable: false, render: renderAction }
];
    // let ConvenioList = this
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
    
    if (this.state.convenio_id) {
      return (<Redirect to={{pathname: '/assinarconvenio', state: {convenio_id:this.state.convenio_id}}}/>)
    }
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
      //   {(this.props.feedData.length > 0) ? (ConvenioList) : (<tr><td colSpan="5">Sem dados cadastrados!</td></tr>)}
      //   </tbody>
      // </Table>
      <FilterableTable
	namespace="Convênio"
  initialSort="id"
  initialSortDir={false}
	data={this.props.feedData}
	fields={fields}
	noRecordsMessage="Sem convênios cadastrados"
  noFilteredRecordsMessage="Nenhum convênio encontrado!"
  loadingMessage="Carregando"
  recordCountName="convênio"
  recordCountNamePlural="convênios"
  autofocusFilter={true}
  serverErrorMessage="Erro ao acessar servidor"
  pagerTitles={{ first: 'Início', last: 'Fim' }}
  pageSizes={null}
  topPagerVisible={false}
/>
    );
  }

}

export default ConvenioList;
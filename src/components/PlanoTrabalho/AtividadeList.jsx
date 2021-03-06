import React, {Component} from 'react';
// import './PlanoTrabalhoList.css';
// import Time from 'react-time';
// import brStrings from 'react-timeago/lib/language-strings/pt';
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {Glyphicon, Table} from 'react-bootstrap';
// import Time from 'react-time/lib/Time';
// const FilterableTable = require('react-filterable-table')

class AtividadeList extends Component {
  
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
// 	{ name: 'descricao', displayName: "Descri????o", inputFilterable: true, exactFilterable: true, sortable: true },
//   { name: 'file_path', displayName: "Anexo", inputFilterable: true, exactFilterable: true, sortable: true, render: renderFilePath},
//   { name: 'exercicio', displayName: "Exerc??cio", inputFilterable: true, exactFilterable: true, sortable: true },
//   { name: 'id', displayName: "A????o", inputFilterable: false, exactFilterable: false, sortable: false, render: renderAction }
// ];
    let AtividadeList = this
      .props
      .feedData
      .map(function (feedData, index) {
        return (
            <tr key={index}>
                <td>{feedData.meta_numero}</td>
                <td>{feedData.fase||''}</td>
                {/* <td>{index+1}</td> */}
                <td>{feedData.atividade||feedData.especificacao||''}</td>
                <td>{feedData.horarios||''}</td>
                <td>{(feedData.fl_segunda) ? <i className="fa fa-check"></i> : null}</td>
                <td>{(feedData.fl_terca) ? <i className="fa fa-check"></i> : null}</td>
                <td>{(feedData.fl_quarta) ? <i className="fa fa-check"></i> : null}</td>
                <td>{(feedData.fl_quinta) ? <i className="fa fa-check"></i> : null}</td>
                <td>{(feedData.fl_sexta) ? <i className="fa fa-check"></i> : null}</td>
                <td>{(feedData.fl_sabado) ? <i className="fa fa-check"></i> : null}</td>
                <td>{(feedData.fl_domingo) ? <i className="fa fa-check"></i> : null}</td>
                {/* <td><Time value={feedData.duracao_termino||''} format="DD/MM/YYYY" /></td> */}
                {/* <td><a href={(this.props.serverUrl+feedData.file_path).replace("api/v1/public/","")} target="_blank"><i className="glyphicon glyphicon-save"></i> Acessar arquivo</a></td> */}
                {/* <td>{feedData.exercicio}</td> */}
                <td>
                    {/* <button title="Visualizar" className="btn btn-primary btn-small mr-3" ><Glyphicon glyph="eye-open"/></button>  */}
                    {/* <button title="Editar" className="btn btn-warning btn-small mr-3" onClick={this.props.edit.bind(this, feedData.id, this.props.callback)}><Glyphicon glyph="pencil"/></button>  */}
                    {this.props.blockActions ? <small>-</small> : <button title="Excluir" type="button" className="btn btn-danger btn-small" onClick={this.props.delete.bind(this, feedData.atividade_id, this.props.callback)}><Glyphicon glyph="trash"/></button>}
                </td>
            </tr>         
        )
      }, this);
    

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Meta</th>
            <th>Etapa/Fase</th>
            <th>Atividade</th>
            <th>Hor??rios</th>
            <th>SEG</th>
            <th>TER</th>
            <th>QUA</th>
            <th>QUI</th>
            <th>SEX</th>
            <th>SAB</th>
            <th>DOM</th>
            <th>A????o</th>
            </tr>
        </thead>
        <tbody>
        {(this.props.feedData.length > 0) ? (AtividadeList) : (<tr><td colSpan="12">Nenhuma atividade salvo!</td></tr>)}
        </tbody>
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
//   pagerTitles={{ first: 'In??cio', last: 'Fim' }}
//   pageSizes={null}
//   topPagerVisible={false}
// />
    );
  }

}

export default AtividadeList;
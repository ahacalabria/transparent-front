import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';

class BackHandle extends Component {
    constructor(props){
        super(props)
       
        this.state = {
         canBack: false,
        }
    
        this.back = this.back.bind(this)
        this.confirmBack = this.confirmBack.bind(this)
      }
      confirmBack(){
        // e.preventDefault()
        confirmAlert({
            title: 'ATENÇÃO',                        
            message: 'Você realmente deseja cancelar o cadastro?',               
            childrenElement: () => '',       
            confirmLabel: 'Sim',                          
            cancelLabel: 'Não',                            
            onConfirm: () => {this.props.callback();this.setState({canBack: true})},
            onCancel: () => '',      
          })
       }
    back(){
        if(this.props.callback) 
            this.confirmBack()
        else
            this.setState({canBack: true})
    }
    render() {
        if(this.state.canBack) return (<Redirect to={{pathname: this.props.prevPathname, state:this.props.prevState}}></Redirect>)
        return (
            <div className="row">
                <div className="col-md-12" style={{marginBottom: '1rem'}}>
                <button className="btn btn-default pull-left mr-3" title="Voltar" onClick={this.back}><i className="glyphicon glyphicon-menu-left"></i> {
                    (this.props.callback) ? <b>CANCELAR</b> : <b>VOLTAR</b>
                }</button>
                {this.props.newButton || null}
                </div>
            </div>
        );
    }
}

export default BackHandle;

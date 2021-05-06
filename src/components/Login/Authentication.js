import React, { Component } from 'react';
// import { withAlert } from "react-alert"
import { Grid, MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import { BrowserRouter, Link, Redirect, Route, Switch, withRouter } from "react-router-dom";
// import PessoaUpload from '../../components/Pessoa/PessoaUpload/PessoaUpload'
import AtivacaoUser from '../../components/AtivacaoUser/AtivacaoUser';
// import Logout from '../../components/Login/Logout'
import Cadastrar from '../../components/Cadastrar/Cadastrar';
import CadastroONG from '../../components/CadastroONG/CadastroONG';
import Footer from '../../components/Footer/Footer';
// import Home from '../../components/Home/Home'
import Painel from '../../components/Home/Painel';
import NotFound from '../../components/NotFound/NotFound';
import PlanoTrabalho from '../../components/PlanoTrabalho/PlanoTrabalho';
import PlanoTrabalhoForm from '../../components/PlanoTrabalho/PlanoTrabalhoForm';
import CustomAlert from '../../components/Providers/AlertsHandle/CustomAlert';
import Welcome from '../../components/Welcome/Welcome';
import { RequestData } from '../../services/RequestData';
import Grupo from '../Grupo/Grupo';
import GrupoForm from '../Grupo/GrupoForm';
import GrupoOperacao from '../Grupo/GrupoOperacao';
import Ongs from '../Ongs/Ongs';
import Programa from '../Programa/Programa';
import ProgramaForm from '../Programa/ProgramaForm';
// import ErrorsHandle from '../../components/Providers/ErrorsHandle/ErrorsHandle'
import Loader from '../Providers/FormsHandle/Loader';
import User from '../User/User';
import UserGrupos from '../User/UserGrupos'
import UserForm from '../User/UserForm';
import Parecer from '../Parecer/Parecer'
import ParecerForm from '../Parecer/ParecerForm'
import BackHandle from '../Providers/BackHandle';
import { hasAtLeastOneGroup } from '../Providers/PermissionHandle';
import Convenio from '../Convenio/Convenio';
import ConvenioForm from '../Convenio/ConvenioForm';

import DotacaoOrcamentaria from '../DotacaoOrcamentaria/DotacaoOrcamentaria';
import DotacaoOrcamentariaForm from '../DotacaoOrcamentaria/DotacaoOrcamentariaForm';

import PrestacaoContaForm from '../PrestacaoConta/PrestacaoContaForm';
// import Pagamento from '../Pagamento/Pagamento';
// import PagamentoForm from '../Pagamento/PagamentoForm';
import PrestacaoConta from '../PrestacaoConta/PrestacaoConta';
import Secretaria from '../Secretaria/Secretaria';
import SecretariaForm from '../Secretaria/SecretariaForm';
import CadastrarColaborador from '../Cadastrar/CadastrarColaborador';
import ConvenioHtml from '../Convenio/ConvenioHtml';


////////////////////////////////////////////////////////////
// 1. Click the public page
// 2. Click the protected page
// 3. Log in
// 4. Click the back button, note the URL each time

class Authentication extends Component {
  constructor(props){
    super(props)
   
    this.state = {
      isLoading: false,
      updateHeader: false,
      showMoreMenuOptions: false
      // hasFinished: false
    }
    this.updateHeader = this.updateHeader.bind(this)
    this.isLoadingFunction = this.isLoadingFunction.bind(this)
    this.hasCadastroFinalizado = this.hasCadastroFinalizado.bind(this)
    this.canShowMoreMenuOptions = this.canShowMoreMenuOptions.bind(this)
  }
  isLoadingFunction(boo){
    this.setState({isLoading: boo})
  }
  updateHeader(hasCadastroFinalizado){
    if(hasCadastroFinalizado)
    this.setState(() => {return {updateHeader: true, hasCadastroFinalizado: true} })
    else
      this.setState(() => { return {updateHeader: true} })
  }
  onlyAdmin = () => {
    if(auth.isAuthenticated)
     return hasAtLeastOneGroup(['GESTOR', 'ADMINISTRADOR'])
  }
  canShowMoreMenuOptions = () => {
    if(auth.isAuthenticated)
     return hasAtLeastOneGroup(['GESTOR', 'ADMINISTRADOR', 'GESTOR DO CONVÊNIO', 'ASSESSOR JURÍDICO', 'ASSESSOR CONTÁBIL', 'MEMBRO DA COMISSÃO'])
  }
  canEmitirConvenio = () => {
    if(auth.isAuthenticated)
     return hasAtLeastOneGroup(['GESTOR DO CONVÊNIO', 'GESTOR','ADMINISTRADOR'])
  }
  canEmitirParecer = () => {
    if(auth.isAuthenticated)
     return hasAtLeastOneGroup(['ADMINISTRADOR', 'GESTOR DO CONVÊNIO', 'ASSESSOR JURÍDICO', 'ASSESSOR CONTÁBIL', 'MEMBRO DA COMISSÃO'])
  }
  isGestor = () => {
    if(auth.isAuthenticated)
     return hasAtLeastOneGroup(['GESTOR DO CONVÊNIO'])
  }
  hasCadastroFinalizado(){
    this.setState({hasFinished: true})
  }

render () {
  const canShowMoreMenuOptions = this.canShowMoreMenuOptions()
  const canEmitirConvenio = this.canEmitirConvenio()
  const canEmitirParecer = this.canEmitirParecer()
  const onlyAdmin = this.onlyAdmin()
  const isGestor = this.isGestor()
  return (
    <BrowserRouter>   
  <div>
  <Loader isLoading={this.state.isLoading}/>  
  <Navbar inverse collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Transparente</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
        <Nav pullLeft>
            {/* <LinkContainer to="/lista_ongs">
              <NavItem>ONGS</NavItem>
            </LinkContainer>             */}
            {/* {auth.isAuthenticated && <LinkContainer to="/painel"><NavItem>Painel</NavItem></LinkContainer>} */}
            {auth.isAuthenticated && <NavDropdown title="Ações" id="painel-dropdown">
              {/* <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem> */}
              <MenuItem href="/cadastro_ong">Editar ONG</MenuItem>
                { canShowMoreMenuOptions && <MenuItem href="/lista_ongs">Todas as ONGs</MenuItem>}
                { canShowMoreMenuOptions && <MenuItem divider />}
                { onlyAdmin && <MenuItem href="/programas">Programas</MenuItem> }
                { canShowMoreMenuOptions && <MenuItem href="/convenios">Convênios</MenuItem> }
                { canShowMoreMenuOptions && <MenuItem href="/dotacao_orcamentaria">Dotações Orçamentárias</MenuItem> }
                {/* { canShowMoreMenuOptions && <MenuItem href="/pagamentos">Pagamentos</MenuItem> } */}
                {/* { canShowMoreMenuOptions && <MenuItem href="/prestacaodecontas">Prestação de Contas</MenuItem> } */}

                <MenuItem divider />
                  <MenuItem href="/plano_trabalhos">Listar planos de trabalhos</MenuItem>
              {/* <NavDropdown title="Plano de Trabalho" id="plano-trabalho-dropdown">
                <MenuItem href="/plano_trabalho/form">Adicionar nova plano</MenuItem>
                <MenuItem href="/plano_trabalhos">Listar planos de trabalhos</MenuItem>
              </NavDropdown> */}
            </NavDropdown>
            }
            {(auth.isAuthenticated && onlyAdmin) && <NavDropdown title="Setores" id="painel-dropdown">
                { onlyAdmin && <MenuItem href="/secretarias">Secretarias</MenuItem>}
                { onlyAdmin && <MenuItem divider />}
                { onlyAdmin && <MenuItem href="/grupo">Grupos</MenuItem>}
                { onlyAdmin && <MenuItem href="/users">Usuários</MenuItem>}
            </NavDropdown>}
          </Nav>
          
          <Nav pullRight>
          {/* {(auth.isAuthenticated && auth.hasFinished) && <MenuItem>Usuário: {sessionStorage.getItem('user').pe_fisica || 'ok'}</MenuItem>} */}
          {(auth.isAuthenticated && (sessionStorage.getItem('hasFishined')===false)) && <LinkContainer to="/cadastro_ong"><NavItem>Cadastro ONG</NavItem></LinkContainer>}
            <AuthLink isLoadingFunction={(loading) => this.isLoadingFunction(loading)}/>
          </Nav>
          {/* <MenuItem>{auth.hasFinished ? 'true' : 'false'}</MenuItem> */}
        </Navbar.Collapse>
      </Navbar>
      <Grid>
            {/* <Row className="show-grid"> */}
        <Switch>
         <Route exact path="/" component={Welcome}/>
          
          <Route exact path="/lista_ongs" isLoading={this.state.isLoading} component={Ongs}/>
          
          <PrivateRoute exact path="/assinarconvenio" isLoading={this.state.isLoading} component={(props) => <ConvenioHtml  {...props}/>}/>
          {onlyAdmin && <PrivateRoute exact path="/programas" isLoading={this.state.isLoading} component={(props) => <Programa  {...props}/>}/>}
          {onlyAdmin && <PrivateRoute exact path="/grupo" isLoading={this.state.isLoading} component={Grupo}/>}
          {onlyAdmin && <PrivateRoute exact path="/grupo/form" isLoading={this.state.isLoading} component={GrupoForm}/>}
          {onlyAdmin && <PrivateRoute exact path="/grupo_operacao" isLoading={this.state.isLoading} component={GrupoOperacao}/>}
          {onlyAdmin && <PrivateRoute exact path="/users" isLoading={this.state.isLoading} component={User}/>}
          {onlyAdmin && <PrivateRoute exact path="/user/form" isLoading={this.state.isLoading} component={UserForm}/>}
          {onlyAdmin && <PrivateRoute exact path="/user_grupos" isLoading={this.state.isLoading} component={UserGrupos}/>}
          {/* <PrivateRoute exact path="/programas" component={Programa}/> */}
          {onlyAdmin && <PrivateRoute exact path="/programas" isLoading={this.state.isLoading} component={(props) => <Programa  {...props}/>}/>}
          {onlyAdmin && <PrivateRoute exact path="/programa/form" isLoading={this.state.isLoading} component={ProgramaForm}/>}

          {onlyAdmin && <PrivateRoute exact path="/secretarias" isLoading={this.state.isLoading} component={(props) => <Secretaria  {...props}/>}/>}
          {onlyAdmin && <PrivateRoute exact path="/secretaria/form" isLoading={this.state.isLoading} component={SecretariaForm}/>}

          <Route exact path="/convenios" isLoading={this.state.isLoading} component={(props) => <Convenio  {...props} canCreate={canEmitirConvenio}/>}/>
          <PrivateRoute exact path="/convenio/form" isLoading={this.state.isLoading} component={ConvenioForm}/>

          <PrivateRoute exact path="/dotacao_orcamentaria" isLoading={this.state.isLoading} component={(props) => <DotacaoOrcamentaria  {...props}/>}/>
          <PrivateRoute exact path="/dotacao_orcamentaria/form" isLoading={this.state.isLoading} component={DotacaoOrcamentariaForm}/>
          <PrivateRoute exact path="/prestacaodecontas" isLoading={this.state.isLoading} component={PrestacaoConta}/>
          <PrivateRoute exact path="/prestacaodecontas/form" isLoading={this.state.isLoading} component={PrestacaoContaForm}/>
          {/* <PrivateRoute exact path="/pagamentos" isLoading={this.state.isLoading} component={Pagamento}/> */}
          {/* <PrivateRoute exact path="/pagamentos/:convenio_id" isLoading={this.state.isLoading} component={Pagamento}/> */}
          {/* <PrivateRoute exact path="/pagamento/form" isLoading={this.state.isLoading} component={PagamentoForm}/> */}
          {/* <PrivateRoute exact path="/pareceres" component={Parecer}/> */}
          <PrivateRoute exact path="/pareceres" isLoading={this.state.isLoading} component={(props) => <Parecer  {...props} canCreate={canEmitirParecer}/>}/>
          <PrivateRoute exact path="/parecer/form" isLoading={this.state.isLoading} component={ParecerForm}/>
          {/* <Route exact path="/operacao" isLoading={this.state.isLoading} component={Operacao}/> */}
          <Route exact path="/cadastrar" component={Cadastrar}/>
          <Route exact path="/cadastrar_colaborador" component={CadastrarColaborador}/>
          {/* <Route exact path="/pessoa_upload" component={PessoaUpload}/> */}
          <Route exact path="/ativacao_user/:code" component={AtivacaoUser}/>
          <PrivateRoute exact path="/plano_trabalhos/" isLoading={this.state.isLoading} component={props => <PlanoTrabalho {...props} isGestor={isGestor}/>}/>          
          <PrivateRoute exact path="/plano_trabalho/form" isLoading={this.state.isLoading} component={PlanoTrabalhoForm}/>          
          <PrivateRoute exact path="/plano_trabalho/:id" isLoading={this.state.isLoading} component={(props) => {return (<PlanoTrabalhoForm {...props}/>)}}/>          
          {/* <Route exact path="/logout" component={() => (<div>oi</div>)} /> */}
          <Route exact path="/login" component={(props) => <Login updateHeader={this.updateHeader} hasCadastroFinalizado={this.hasCadastroFinalizado} {...props}/> }/>
          <PrivateRoute exact path="/cadastro_ong" isLoading={this.state.isLoading} component={CadastroONG} />
          <PrivateRoute exact path="/painel" isLoading={this.state.isLoading} component={Painel} />
          <Route path="*" component={NotFound}/>
          <BackHandle/>
        </Switch>       
            {/* </Row> */}
          </Grid>
      <Footer/>
    </div>
  </BrowserRouter>
  )
}
}

const auth = {
  isAuthenticated: (sessionStorage.getItem("user")!=null),
  isLoading: false,
  showMoreMenuOptions: false,
  hasFinished: (sessionStorage.getItem("hasFinished")!=null),
  
  async authenticate(state, redirecionar, loading, callAlert) {
    if(state.email && state.password){
      try{
        loading(true)
        const token = await RequestData('authenticate',state,'POST')
        sessionStorage.setItem('token',token.token)
        const user = await RequestData('users/me',{},'GET')
        callAlert("success",("Acesso concedido!"), true)
        if(user.first) {
          const extraDados = await RequestData('users/me_full',{},'GET')
          console.log('userEXTRA-F',extraDados)
          sessionStorage.setItem('user',JSON.stringify(extraDados))
          const ong_cad_finished = await RequestData('users/hasCadastroFinalizado/'+extraDados.pe_juridica.id,{},'GET')
          sessionStorage.setItem('hasFinished',ong_cad_finished.resp)
          this.isAuthenticated = true
          redirecionar(true, true)  
        }else{
          const extraDados = await RequestData('users/me_full',{},'GET')
          sessionStorage.setItem('user',JSON.stringify(extraDados))
          // console.log('userEXTRA-NF',extraDados)
          const ong_cad_finished = await RequestData('users/hasCadastroFinalizado/'+extraDados.pe_juridica.id,{},'GET')
          sessionStorage.setItem('hasFinished',ong_cad_finished.resp)
          this.isAuthenticated = true
          redirecionar(true, false)  
        }
      }catch(err){
        console.log('login', err)
        this.isAuthenticated = false
        loading(false)
        redirecionar(false)
        if(err.length > 0){
          err.forEach(e => {
            callAlert("error",(e.title+": "+e.message), true)
          })
        }else{
          if(err.error){
            console.log(err)
            if( Array.isArray(err.error) ){
              err.error.forEach(e => {
                callAlert("error",(e.title+": "+e.message), true)
              })
            }else{
              callAlert("error","Aconteceu algum erro no servidor!", true)
              // window.location.reload()
            }
          }
            

        }
        
      }    
    }

  },
  async signout(elem, isLoadingFunction, clearHistory) {
    isLoadingFunction(true)
    try{
      await RequestData('authenticate/logout', {}, 'GET')
      sessionStorage.setItem("user",'')
      sessionStorage.setItem("token",'')
      sessionStorage.clear()
      this.isAuthenticated = false
      clearHistory()
    }catch(err){
      alert("Aconteceu algum erro ao acessar o servidor!")
      console.log('singout', err)
      this.isAuthenticated = false
    }    
    isLoadingFunction(false)
  }
}

const AuthLink = withRouter(
  ({ history, ...props }) =>
  {
    const username = 'ACESSO CONCEDIDO'//JSON.parse(sessionStorage.getItem('user')).pe_fisica.pessoa.nome
return auth.isAuthenticated ? (
  <NavDropdown title={username} id="user-dropdown">
              
  <NavItem id="logoutBtn"
      onClick={(e) => {
        auth.signout(e, props.isLoadingFunction, () => {
          history.push("/")
        })
      }}
    >
      Sair
    </NavItem>
    </NavDropdown>
) : (
  <LinkContainer to="/login">
    <NavItem>Acessar</NavItem>
  </LinkContainer>
)
  }
)

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        auth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}


class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      redirectToReferrer: false,
      redirectToHome: false,
      isLogged: false,
      email: '',
      password: '',
      isLoading: false,
      hasAlert: false,
      tipoAlert: '',
      msg: '',
      firstAcess: false,
      target: '/',
    }
    this.onChange = this.onChange.bind(this)
    this.loading = this.loading.bind(this)
    this.redirecionar = this.redirecionar.bind(this)
    this.callAlert = this.callAlert.bind(this)
  }

  componentDidMount = () => {
    if(this.props.location.pathname==="/login" && auth.isAuthenticated){
      this.setState({ redirectToReferrer: true });
    }
  }
  

  login = (elem, state, cb1, cb2, cb3, cb4) => {
    elem.preventDefault()
    auth.authenticate(state, cb1, cb2, cb3, cb4)
  }

  redirecionar(boo, foo){
    this.setState((redirectToReferrer, firstAcess) => { 
      return {redirectToReferrer: boo, firstAcess: foo}
    })
  }

  loading(boo){
    this.setState((isLoading) => { 
      return {isLoading: boo}
    })
  }
  callAlert(tipo, msg, boo){
    this.setState({tipoAlert: tipo, msg: msg, hasAlert: boo})
  }

  componentWillUnmount(){
    this.props.updateHeader(auth.hasFinished)
    // alert(auth.hasFinished)
    // this.props.hasCadastroFinalizado()
    // if(auth.hasFinished) this.props.hasCadastroFinalizado()
  }

  redirect() {
    this.setState({ redirectToReferrer: true });
  }

  onChange(e){
    this.setState({[e.target.name]:e.target.value})
  }

  render() {
    let { from } = this.props.location.state || { from: { pathname: "/" } }
    
    let redirectToReferrer = this.state.redirectToReferrer

    if (redirectToReferrer) return <Redirect to={(this.state.firstAcess) ? '/cadastro_ong' : ((this.props.location.pathname==="/login" && auth.isAuthenticated) ? '/' : from)} />
    let customAlert = null
    if(this.state.hasAlert){
      customAlert = (
      <CustomAlert tipoAlert={this.state.tipoAlert} msg={this.state.msg} hasAlert="true" callback={this.callAlert.bind(this)}/>
      )
    }

    return (
      <div className="form-signin shadow-sm">
      <Loader isLoading={this.state.isLoading}/>  
        <form onSubmit={(e) => this.login(e, this.state, this.redirecionar, this.loading, this.callAlert)}>
        <h2 className="form-signin-heading text-center">Acesso Restrito</h2>
        <label className="sr-only">E-mail</label>
        <input type="text" name="email" autoFocus className="form-control" placeholder="E-mail" onChange={ (e) => this.onChange(e)}/>
        <label className="sr-only">Senha</label>
        <input type="password" className="form-control" name="password"  placeholder="Senha" onChange={ (e) => this.onChange(e)}/>
        <button className="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>
        <a className="btn btn-lg btn-warning dropdown-toggle btn-block" href="/cadastrar">Nao Sou Credenciado</a>
        </form>
        {customAlert}
      </div>
    )
  }


}
export default Authentication
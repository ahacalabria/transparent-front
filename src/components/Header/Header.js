import React, { Component } from 'react'

import { LinkContainer } from "react-router-bootstrap";
import {BrowserRouter,  Route,  Switch} from 'react-router-dom'
import Welcome from '../../components/Welcome/Welcome'
import Home from '../../components/Home/Home'
import Footer from '../../components/Footer/Footer'
import Operacao from '../../components/UserFeed/Operacao'
import Login from '../../components/Login/Login'
import Logout from '../../components/Login/Logout'
import Cadastrar from '../../components/Cadastrar/Cadastrar'
import NotFound from '../../components/NotFound/NotFound'
import PessoaUpload from '../../components/Pessoa/PessoaUpload/PessoaUpload'
import AtivacaoUser from '../../components/AtivacaoUser/AtivacaoUser';
import CadastroONG from '../../components/CadastroONG/CadastroONG';
import {Grid, Nav, Navbar, NavItem} from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom'

import './Header.css'



class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      redirectToReferrer: false,
      redirectToHome: false,
      isLogged: props.isLogged
    }
  }

  componentDidMount = () => {
    this.setState({isLogged: this.isLogged()})
  }
  

  redirectToHome(){
    this.setState( redirectToHome => {
      return {redirectToHome: true}
    })
  }


  logout(){
    // alert('sair')
   
  }

  isLogged(){
    console.log('user', sessionStorage.getItem("user"))
    // const user = sessionStorage.getItem("user")
    // alert(user)
    return (sessionStorage.getItem("user")!=null)
  }

  render() {

    if(this.state.redirectToReferrer)
      return (<Redirect to={'/user'}/>)

    if(this.state.redirectToHome)
      return (<Redirect to={'/cadastrar'}/>)

    if(this.state.isLogged)
      alert('pode sair, usuario logado')

return (
  <BrowserRouter >       
  <div>
  <Navbar inverse collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Página Inicial</Link>
            {/* <Route exact path="/" component={Welcome}/> */}
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <LinkContainer to="/cadastrar">
              <NavItem>Signup</NavItem>
            </LinkContainer>
            <LinkContainer to={(!this.state.isLogged?'/login':'/logout')}>
              <NavItem>{(!this.state.isLogged?'Login':'Logout')}</NavItem>
            </LinkContainer>
            {/* <AuthButton /> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Grid>
            {/* <Row className="show-grid"> */}
  <Switch>
         <Route exact path="/" component={Welcome}/>
          <Route path="/home" component={Home}/>
          <Route path="/login" component={Login}/>
          <Route path="/logout" component={Logout}/>
          <Route path="/operacao" component={Operacao}/>
          <Route path="/cadastrar" component={Cadastrar}/>
          <Route path="/pessoa_upload" component={PessoaUpload}/>
          <Route path="/ativacao_user/:code" component={AtivacaoUser}/>
          <Route path="/cadastro_ong" component={CadastroONG}/>
          <Route path="*" component={NotFound}/>
          </Switch>       
            {/* </Row> */}
          </Grid>
      <Footer/>
    </div>
  </BrowserRouter>
)

    // return (
    //   <Navbar inverse collapseOnSelect fixedTop>
    //   <Navbar.Header>
    //     <Navbar.Brand>
    //       <a href="#brand">{this.props.name}</a>
    //     </Navbar.Brand>
    //     <Navbar.Toggle />
    //   </Navbar.Header>
    //   <Navbar.Collapse>
    //     <Nav>
    //       <NavItem eventKey={1} href="#">
    //         Link
    //       </NavItem>
    //       <NavItem eventKey={2} href="#">
    //         Link
    //       </NavItem>
    //       <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
    //         <MenuItem eventKey={3.1}>Action</MenuItem>
    //         <MenuItem eventKey={3.2}>Another action</MenuItem>
    //         <MenuItem eventKey={3.3}>Something else here</MenuItem>
    //         <MenuItem divider />
    //         <MenuItem eventKey={3.3}>Separated link</MenuItem>
    //       </NavDropdown>
    //     </Nav>
    //     <Nav pullRight>
    //       <NavItem eventKey={1} onClick={this.redirectToHome.bind(this)}>
    //         Link Right
    //       </NavItem>
    //        {/* onClick={this.props.logout} */}
    //       <NavItem eventKey={2} href="/logout" >
    //       Sair do Sistema
    //       </NavItem>
    //     </Nav>
    //   </Navbar.Collapse>
    // </Navbar>
    // )
  }
}

export default Header
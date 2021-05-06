import React from 'react'
import {BrowserRouter,  Route,  Switch} from 'react-router-dom'

import Welcome from '././components/Welcome/Welcome'
import Home from '././components/Home/Home'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Operacao from '././components/UserFeed/Operacao'
import Login from '././components/Login/Login'
import Logout from '././components/Login/Logout'
import Cadastrar from '././components/Cadastrar/Cadastrar'
import NotFound from '././components/NotFound/NotFound'
import PessoaUpload from './components/Pessoa/PessoaUpload/PessoaUpload'
import AtivacaoUser from './components/AtivacaoUser/AtivacaoUser';
import CadastroONG from './components/CadastroONG/CadastroONG';
import {Grid, Row, Nav, Navbar, NavItem} from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import { Redirect, Link } from 'react-router-dom'

const Routes = () => (
  <BrowserRouter >       
  <div>
  <Header/>
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

export default Routes
import React from 'react';
import ReactDOM from 'react-dom';
import Cadastrar from './Cadastrar';

it('Cadastrar renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Cadastrar />, div);
});
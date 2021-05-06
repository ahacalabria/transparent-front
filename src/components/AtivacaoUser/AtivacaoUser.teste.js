import React from 'react';
import ReactDOM from 'react-dom';
import AtivacaoUser from './AtivacaoUser';

it('AtivacaoUser renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AtivacaoUser />, div);
});
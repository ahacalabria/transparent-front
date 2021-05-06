import React from 'react';
import ReactDOM from 'react-dom';
import AnexoList from './AnexoList';

it('AnexoList renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AnexoList />, div);
});
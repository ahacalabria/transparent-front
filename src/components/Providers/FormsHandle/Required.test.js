import React from 'react';
import ReactDOM from 'react-dom';
import Required from './Required';

it('Required renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Required />, div);
});
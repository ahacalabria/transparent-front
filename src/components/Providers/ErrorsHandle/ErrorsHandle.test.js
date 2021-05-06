import React from 'react';
import ReactDOM from 'react-dom';
import ErrorsHandle from './ErrorsHandle';

it('ErrorsHandle renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ErrorsHandle />, div);
});
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const root = document.getElementById('root');

let render = () => {
  ReactDOM.render(
    <App/>,
    root
  );
};
render();

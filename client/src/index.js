import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {
  BandwidthThemeProvider
} from '@bandwidth/shared-components';

const root = document.getElementById('root');

let render = () => {
  ReactDOM.render(
    <BandwidthThemeProvider>
      <App>
      </App>
    </BandwidthThemeProvider>,
    root
  );
};
render();

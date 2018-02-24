import React from 'react';
import App from './App';
import {render} from 'enzyme';
import {
  BandwidthThemeProvider
} from '@bandwidth/shared-components';

test('test runs', () => {
  expect(true);
});

describe('App', () => {
  it('renders a customer number field', () => {
    const wrapper = render(
      <BandwidthThemeProvider>
        <App/>
      </BandwidthThemeProvider>
    );
    expect(wrapper.find('#customer-number').length).to.equal(1);
  });
});
import React from 'react';
import App from './App';
import {render, shallow} from 'enzyme';
import $ from 'jquery';

jest.mock('jquery', () => ({
  ajax: jest.fn()
}));

test('test runs', () => {
  expect(true);
});

describe('App', () => {
  it('renders a company number field', () => {
    const wrapper = render(<App/>);
    expect(wrapper.find('#company-number').length).toEqual(1);
  });
});

describe('App', () => {
  it('renders a customer number field', () => {
    const wrapper = render(<App/>);
    expect(wrapper.find('#customer-number').length).toEqual(1);
  });
});

describe('App', () => {
  it('renders a text message field', () => {
    const wrapper = render(<App/>);
    expect(wrapper.find('#text-message').length).toEqual(1);
  });
});

describe('App', () => {
  it('renders a text message field', () => {
    const wrapper = render(<App/>);
    expect(wrapper.find('#secret-key').length).toEqual(1);
  });
});

describe('App', () => {
  it('renders a submit button', () => {
    const wrapper = render(<App/>);
    expect(wrapper.find('#submit-button').length).toEqual(1);
  });
});

describe('App', () => {
  it('updates the company number on change event', () => {
    const wrapper = shallow(<App/>);
    const instance = wrapper.instance();
    instance.onCompanyNumberChange({
      target: {
        value: 'Test Company Number'
      }
    });

    expect(wrapper.state().companyNumber).toEqual('Test Company Number');
  });
});

describe('App', () => {
  it('updates the customer number on change event', () => {
    const wrapper = shallow(<App/>);
    const instance = wrapper.instance();
    instance.onCustomerNumberChange({
      target: {
        value: 'Test Customer Number'
      }
    });

    expect(wrapper.state().customerNumber).toEqual('Test Customer Number');
  });
});

describe('App', () => {
  it('updates the text message on change event', () => {
    const wrapper = shallow(<App/>);
    const instance = wrapper.instance();
    instance.onTextMessageChange({
      target: {
        value: 'Test Text Message'
      }
    });

    expect(wrapper.state().message).toEqual('Test Text Message');
  });
});

describe('App', () => {
  it('updates the secret on change event', () => {
    const wrapper = shallow(<App/>);
    const instance = wrapper.instance();
    instance.onSecretChange({
      target: {
        value: 'Test Secret'
      }
    });

    expect(wrapper.state().secret).toEqual('Test Secret');
  });
});

describe('App', () => {
  it('button is disabled when nothing is entered', () => {
    const wrapper = shallow(<App/>);
    const button = wrapper.find('#submit-button');
    expect(button.props().disabled).toEqual(true);
  });

  it('button is enabled when all fields are valid', () => {
    let wrapper = shallow(<App/>);
    // const instance = wrapper.instance();
    wrapper.setState({
      companyNumber: '+15555555556',
      validCompanyNumber: true,
      customerNumber: '+15555555555',
      validCustomerNumber: true,
      message: 'Test Msg',
      validMessage: true,
      secret: 'Test Secret',
      validSecret: true
    });

    const button = wrapper.find('#submit-button');
    expect(button.props().disabled).toEqual(false);
  });
});

describe('App', () => {
  it('submits and sends the field data', () => {
    const wrapper = shallow(<App/>);
    const instance = wrapper.instance();

    wrapper.setState({
      companyNumber: '+19875550100',
      validCompanyNumber: true,
      customerNumber: '+17895550100',
      validCustomerNumber: true,
      message: 'Test Message',
      validMessage: true,
      secret: 'Test Secret',
      validSecret: true
    });

    expect($.ajax.mock.calls.length).toEqual(0);
    instance.onTextSubmit({
      preventDefault: function() {
      }
    });
    expect($.ajax.mock.calls.length).toEqual(1);
    const expected = {
      companyNumber: '+19875550100',
      customerNumber: '+17895550100',
      message: 'Test Message',
      secret: 'Test Secret'
    };
    expect($.ajax.mock.calls[0][0].data).toEqual(JSON.stringify(expected));
  });
});

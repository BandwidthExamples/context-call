import React from 'react';
import App from './App';
import {shallow} from 'enzyme';
import $ from 'jquery';
import CallButton from './call-button/CallButton';
import {OrderService} from '../services/OrderService';

jest.mock('jquery', () => ({
  ajax: jest.fn()
}));
global.alert = jest.fn();

let wrapper;
let instance;

beforeEach(() => {
  const data = [
    {
      name: 'A',
      order: '1',
      eta: '2018-03-20T08:00:00',
      phone: '+19195550100'
    },
    {
      name: 'B',
      order: '2',
      eta: '2018-03-20T08:00:00',
      phone: '+19195550100'
    },
    {
      name: 'C',
      order: '3',
      eta: '2018-03-20T08:00:00',
      phone: '+19195550100'
    },
    {
      name: 'D',
      order: '4',
      eta: '2018-03-20T08:00:00',
      phone: '+19195550100'
    }
  ];
  $.ajax.mockClear();
  OrderService.getOrders = () => {
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };
  wrapper = shallow(<App data={data}/>);
  instance = wrapper.instance();
});

test('test runs', () => {
  expect(true);
});

describe('App', () => {
  it('defaults the data if none is entered', () => {
    wrapper = shallow(<App/>);
    instance = wrapper.instance();
    expect(instance.state.data).not.toBeUndefined();
  });
});

describe('App', () => {
  it('renders a company number field', () => {
    expect(wrapper.find('#company-number').length).toEqual(1);
  });
});

describe('App', () => {
  it('renders a customer table', () => {
    expect(wrapper.find('#customer-table').length).toEqual(1);
  });
});

describe('App', () => {
  it('renders a text message field', () => {
    expect(wrapper.find('#text-message').length).toEqual(1);
  });
});

describe('App', () => {
  it('renders a text message field', () => {
    expect(wrapper.find('#secret-key').length).toEqual(1);
  });
});

describe('App', () => {
  it('renders a submit button for each customer', () => {
    expect(wrapper.find(CallButton).length).toEqual(4);
  });
});

describe('App', () => {
  it('updates the company number on change event', () => {
    instance.onCompanyNumberChange({
      target: {
        value: 'Test Company Number'
      }
    });

    expect(wrapper.state().companyNumber).toEqual('Test Company Number');
  });
});

describe('App', () => {
  it('updates the text message on change event', () => {
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
    instance.onSecretChange({
      target: {
        value: 'Test Secret'
      }
    });
    expect(wrapper.state().secret).toEqual('Test Secret');
  });
});

describe('App', () => {
  it('buttons are disabled when nothing is entered', () => {
    wrapper.setState({
      companyNumber: '',
      message: '',
      secret: ''
    });
    const buttons = wrapper.find(CallButton);
    expect(buttons.length).toEqual(4);
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons.at(i).props().disabled).toEqual(true);
    }
  });

  it('buttons are disabled when the company number is not entered', () => {
    wrapper.setState({
      companyNumber: '',
      message: 'Test Msg',
      secret: 'Test Secret'
    });
    const buttons = wrapper.find(CallButton);
    expect(buttons.length).toEqual(4);
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons.at(i).props().disabled).toEqual(true);
    }
  });

  it('buttons are disabled when the message is not entered', () => {
    wrapper.setState({
      companyNumber: '+19875550100',
      message: '',
      secret: 'Test Secret'
    });
    const buttons = wrapper.find(CallButton);
    expect(buttons.length).toEqual(4);
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons.at(i).props().disabled).toEqual(true);
    }
  });

  it('buttons are disabled when the secret is not entered', () => {
    wrapper.setState({
      companyNumber: '+19875550100',
      message: 'Test Msg',
      secret: ''
    });
    const buttons = wrapper.find(CallButton);
    expect(buttons.length).toEqual(4);
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons.at(i).props().disabled).toEqual(true);
    }
  });

  it('buttons are enabled when all fields are valid', () => {
    wrapper.setState({
      companyNumber: '+19875550100',
      message: 'Test Msg',
      secret: 'Test Secret'
    });
    const buttons = wrapper.find(CallButton);
    expect(buttons.length).toEqual(4);
    for (let i = 0; i < buttons.length; i++) {
      expect(buttons.at(i).props().disabled).toEqual(false);
    }
  });
});

describe('App', () => {
  it('submits and sends the field data', () => {
    wrapper.setState({
      companyNumber: '+19875550120',
      message: 'Test Message',
      secret: 'Test Secret'
    });

    expect($.ajax.mock.calls.length).toEqual(0);
    instance.onSubmit('+19195550100');
    expect($.ajax.mock.calls.length).toEqual(1);
    const expected = {
      companyNumber: '+19875550120',
      customerNumber: '+19195550100',
      message: 'Test Message',
      secret: 'Test Secret'
    };
    expect($.ajax.mock.calls[0][0].data).toEqual(JSON.stringify(expected));

    try {
      $.ajax.mock.calls[0][0].success('Success');
      $.ajax.mock.calls[0][0].error('Error');
    } catch (error) {
      fail();
    }
  });
});

describe('App', () => {
  it('submits and sends the new customer data', () => {
    console.log('Call: ' + JSON.stringify($.ajax.mock.calls[0]));
    expect($.ajax.mock.calls.length).toEqual(0);
    wrapper.setState({
      secret: 'test-secret'
    });
    instance.onAddCustomer({
      name: 'test-name',
      orderId: 'test-order-id',
      eta: 'test-eta',
      phoneNumber: 'test-phone-number'
    });
    expect($.ajax.mock.calls.length).toEqual(1);
    const expected = 'https://dyrnp9j4tc.execute-api.us-west-2.amazonaws.com/beta/' +
      'orders?' +
      'name=test-name&' +
      'orderId=test-order-id&' +
      'eta=test-eta&' +
      'phoneNumber=test-phone-number&' +
      'secret=test-secret';
    expect($.ajax.mock.calls[0][0].url).toEqual(expected);

    try {
      $.ajax.mock.calls[0][0].success('Success');
      $.ajax.mock.calls[0][0].error('Error');
    } catch (error) {
      fail();
    }
  });
});

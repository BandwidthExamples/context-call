import React from 'react';
import {shallow} from 'enzyme';
import AddCustomerRow from './AddCustomerRow';

let wrapper;
let instance;
let mockSubmit = jest.fn();

beforeEach(() => {
  wrapper = shallow(<AddCustomerRow onSubmit={mockSubmit}/>);
  instance = wrapper.instance();
});

test('test runs', () => {
  expect(true);
});

describe('App', () => {
  it('renders a name field', () => {
    expect(wrapper.find('#new-customer-name').length).toEqual(1);
  });

  it('renders an order ID', () => {
    expect(wrapper.find('#new-customer-order-id').length).toEqual(1);
  });

  it('renders an ETA field', () => {
    expect(wrapper.find('#new-customer-eta').length).toEqual(1);
  });

  it('renders a phone number field', () => {
    expect(wrapper.find('#new-customer-phone').length).toEqual(1);
  });

  it('renders an add customer button', () => {
    expect(wrapper.find('#add-customer-btn').length).toEqual(1);
  });
});

describe('App', () => {
  it('updates the name on change event', () => {
    instance.onNameChange({
      target: {
        value: 'Test Name'
      }
    });

    expect(wrapper.state().customer.name).toEqual('Test Name');
  });

  it('updates the order ID on change event', () => {
    instance.onOrderIDChange({
      target: {
        value: 'Test Order ID'
      }
    });

    expect(wrapper.state().customer.orderId).toEqual('Test Order ID');
  });

  it('updates the ETA on change event', () => {
    instance.onETAChange({
      target: {
        value: 'Test ETA'
      }
    });

    expect(wrapper.state().customer.eta).toEqual('Test ETA');
  });

  it('updates the phone number on change event', () => {
    instance.onPhoneNumberChange({
      target: {
        value: 'Test Number'
      }
    });

    expect(wrapper.state().customer.phoneNumber).toEqual('Test Number');
  });
});

describe('App', () => {
  it('submits and sends the field data', () => {
    wrapper.setState({
      customer: {
        name: 'Test Name',
        orderId: 'Test ID',
        eta: 'Test ETA',
        phoneNumber: 'Test Number'
      }
    });

    expect(mockSubmit.mock.calls.length).toEqual(0);
    instance.onSubmit({
      preventDefault: () => {
      }
    });
    expect(mockSubmit.mock.calls.length).toEqual(1);
    const expected = {
      name: 'Test Name',
      orderId: 'Test ID',
      eta: 'Test ETA',
      phoneNumber: 'Test Number'
    };
    expect(mockSubmit.mock.calls[0][0]).toEqual(expected);
  });
});

import React from 'react';
import {shallow} from 'enzyme';
import {Button} from '@bandwidth/shared-components';
import CallButton from './CallButton';

jest.useFakeTimers();

let wrapper;
let instance;
let onSubmitMock = jest.fn();

beforeEach(() => {
  wrapper = shallow(
    <CallButton
      onSubmit={onSubmitMock}
      customerNumber={'+19875550120'}
      disabled={false}
    />
  );
  instance = wrapper.instance();
});

test('test runs', () => {
  expect(true);
});

describe('CallButton', () => {
  it('renders a button', () => {
    expect(wrapper.find(Button).length).toEqual(1);
  });

  it('is disabled when the property is true', () => {
    wrapper = shallow(<CallButton disabled={true}/>);
    instance = wrapper.instance();
    expect(wrapper.find(Button).props().disabled).toEqual(true);
  });

  it('is disabled when the property is false', () => {
    wrapper = shallow(<CallButton disabled={false}/>);
    instance = wrapper.instance();
    expect(wrapper.find(Button).props().disabled).toEqual(false);
  });

  it('calls the submit function on submit', () => {
    expect(onSubmitMock.mock.calls.length).toEqual(0);
    expect(setTimeout).toHaveBeenCalledTimes(0);
    expect(instance.state.sending).toEqual(false);
    instance.onSubmit({
      preventDefault: () => {
      }
    });
    expect(onSubmitMock.mock.calls.length).toEqual(1);
    expect(onSubmitMock.mock.calls[0][0]).toEqual('+19875550120');
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    expect(instance.state.sending).toEqual(true);
    jest.runAllTimers();
    expect(instance.state.sending).toEqual(false);
  });
});

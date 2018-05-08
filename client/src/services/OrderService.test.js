import React from 'react';
import $ from 'jquery';
import {OrderService} from '../services/OrderService';

let mockResponse;
jest.mock('jquery', () => ({
  ajax: jest.fn(body => {
    body.success(mockResponse);
  })
}));

beforeEach(() => {
  mockResponse = {
    message: [
      {
        name: 'A',
        orderId: '1',
        eta: '2018-03-20T08:00:00',
        phoneNumber: '+19195550100'
      },
      {
        name: 'B',
        orderId: '2',
        eta: '2018-03-20T08:00:00',
        phoneNumber: '9195550100'
      },
      {
        name: 'C',
        orderId: '3',
        eta: '2018-03-20T08:00:00',
        phoneNumber: '+19195550100'
      },
      {
        name: 'D',
        orderId: '4',
        eta: '2018-03-20T08:00:00',
        phoneNumber: '9195550100'
      }
    ]
  };
  $.ajax.mockClear();
});

test('test runs', () => {
  expect(true);
});

describe('Order Service', () => {
  it('rejects if there is an error', async () => {
    $.ajax.mockImplementation(body => {
        body.error('Error!');
    });

    await OrderService.getOrders()
      .then(() => {
        fail();
      })
      .catch(err => {
        expect(err).toEqual('Error!');
      });
  });

  it('returns the requested data', async () => {
    $.ajax.mockImplementation(body => {
      body.success(mockResponse);
    });

    await OrderService.getOrders().then(data => {
      expect(data).toEqual([
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
      ]);
    });
  });
});

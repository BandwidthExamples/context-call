let handler;

const mockScan = jest.fn((params, callback) => {
  console.log('Scanning...');
  callback(null, {
    Items: ['t1', 't2', 't3']
  });
});

const mockPut = jest.fn((params, callback) => {
  console.log('Putting...');
  callback(null, {});
});

const mockDelete = jest.fn((params, callback) => {
  console.log('Deleting...');
  callback(null, {});
});

beforeEach(() => {
  process.env.SECRET = 'test-secret';

  jest.mock('aws-sdk', () => {
    return {
      config: {
        update: () => {
        }
      },
      DynamoDB: {
        DocumentClient: class DocumentClient {
          constructor() {
            this.scan = mockScan;
            this.put = mockPut;
            this.delete = mockDelete;
          }
        }
      }
    };
  });

  jest.mock('aws-api-gateway-return', () => {
    return {
      create: (code, message) => {
        return {
          code: code,
          message: message
        };
      }
    };
  });

  handler = require('./index').handler;
});

afterEach(() => {
  delete process.env.SECRET;
});

test('test runs', () => {
  expect(true);
});

test('gets the orders', () => {
  const event = {
    httpMethod: 'GET'
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(200);
    expect(res.message).toEqual(['t1', 't2', 't3']);
  });
});

test('denies POST request without query parameters', () => {
  const event = {
    httpMethod: 'POST'
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(401);
    expect(res.message).not.toBeNull();
  });
});

test('denies POST request without a valid secret', () => {
  const event = {
    httpMethod: 'POST',
    queryStringParameters: {
      secret: 'bad-secret',
      orderId: 'test-order-id',
      name: 'test-name',
      phoneNumber: 'test-phone-number',
      eta: 'test-eta'
    }
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(401);
    expect(res.message).not.toBeNull();
  });
});

test('adds the order', () => {
  const event = {
    httpMethod: 'POST',
    queryStringParameters: {
      secret: 'test-secret',
      orderId: 'test-order-id',
      name: 'test-name',
      phoneNumber: 'test-phone-number',
      eta: 'test-eta'
    }
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(200);
    expect(res.message).not.toBeNull();

    expect(mockPut.mock.calls.length).toBe(1);
    expect(mockPut.mock.calls[0][0]).toEqual({
      TableName: 'orders',
      Item: {
        orderId: 'test-order-id',
        name: 'test-name',
        phoneNumber: 'test-phone-number',
        eta: 'test-eta'
      }
    });
  });
});

test('deletes the order', () => {
  const event = {
    httpMethod: 'DELETE',
    queryStringParameters: {
      orderId: 'test-order-id',
      secret: 'test-secret'
    }
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(200);
    expect(res.message).not.toBeNull();

    expect(mockDelete.mock.calls.length).toBe(1);
    expect(mockDelete.mock.calls[0][0]).toEqual({
      TableName: 'orders',
      Key: {
        orderId: 'test-order-id',
      }
    });
  });
});

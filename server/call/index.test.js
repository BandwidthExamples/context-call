let handler;

beforeEach(() => {
  process.env.SECRET = 'test-secret';

  jest.mock('simple-bandwidth-api', () => {
    return {
      post: (type, data, callback) => {
        callback(null, {
          type: type,
          data: data
        });
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

test('doesn\'t run while waiting', () => {
  const tag = JSON.stringify({
    secret: 'bad-secret',
    request: 'call',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101'
  });
  const eventBody = JSON.stringify({
    deliveryState: 'waiting',
    tag: tag,
    callId: 'test-call-id'
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(200);
    expect(res.message).not.toBeNull();
  });
});

test('is denied due to an invalid secret', () => {
  const tag = JSON.stringify({
    secret: 'bad-secret',
    request: 'call',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101'
  });
  const eventBody = JSON.stringify({
    deliveryState: 'delivered',
    tag: tag,
    callId: 'test-call-id'
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(401);
    expect(res.message).not.toBeNull();
  });
});

test('calls the given number', () => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'call',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101'
  });
  const eventBody = JSON.stringify({
    deliveryState: 'delivered',
    tag: tag,
    callId: 'test-call-id'
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.type).toBe('calls');

    expect(res.data).not.toBeNull();
    const data = JSON.parse(res.data);
    expect(data.to).toBe('+12345550100');

    expect(data.tag).not.toBeNull();
    const tag = JSON.parse(data.tag);
    expect(tag.request).toBe('call');
    expect(tag.customerNumber).toBe('+12345550101');
  });
});

test('bridges the given numbers', () => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'bridgeCalls',
    customerCallId: 'test-customer-call-id'
  });
  const eventBody = JSON.stringify({
    deliveryState: 'delivered',
    tag: tag,
    callId: 'test-call-id',
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.type).toBe('bridges');

    expect(res.data).not.toBeNull();
    const data = JSON.parse(res.data);
    expect(data.callIds).toEqual([
      'test-call-id',
      'test-customer-call-id'
    ]);
  });
});

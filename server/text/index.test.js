let handler;

const mockPost = jest.fn((type, data, callback) => {
  callback(null, {});
});

beforeEach(() => {
  process.env.SECRET = 'test-secret';
  process.env.PHONE_NUMBER = 'test-bandwidth-phone';
  process.env.CALLBACK_WAIT_URL = 'test-wait-url';

  jest.mock('simple-bandwidth-api', () => {
    return {
      post: mockPost
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

test('is denied due to an invalid secret', () => {
  const eventBody = JSON.stringify({
    secret: 'bad-secret',
    request: 'textCustomer',
    customerNumber: 'test-customer-number',
    message: 'test-message',
    companyNumber: 'test-company-number',
    waitType: 'test-wait-type',
    waitValue: 'test-wait-value'
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

test('returns 200 on ping', () => {
  const eventBody = JSON.stringify({
    secret: 'test-secret',
    request: 'ping'
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

test('texts the given number', () => {
  const eventBody = JSON.stringify({
    secret: 'test-secret',
    request: 'textCustomer',
    customerNumber: 'test-customer-number',
    message: 'test-message',
    companyNumber: 'test-company-number',
    waitType: 'test-wait-type',
    waitValue: 'test-wait-value'
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();

    expect(mockPost.mock.calls[0][0]).toBe('messages');

    const postData = JSON.parse(mockPost.mock.calls[0][1]);
    expect(postData.from).toBe('test-bandwidth-phone');
    expect(postData.to).toBe('test-customer-number');
    expect(postData.text).toBe('test-message');
    expect(postData.receiptRequested).toBe('all');
    expect(postData.callbackUrl).toBe('test-wait-url');

    const tag = JSON.parse(postData.tag);
    expect(tag.waitType).toBe('test-wait-type');
    expect(tag.waitValue).toBe('test-wait-value');
    expect(tag.companyNumber).toBe('test-company-number');
    expect(tag.customerNumber).toBe('test-customer-number');
    expect(tag.secret).toBe('test-secret');
    expect(tag.request).toBe('call');
  });
});

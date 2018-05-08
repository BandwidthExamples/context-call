let handler;

const mockPost = jest.fn((type, data, callback) => {
  callback(null, {});
});

const AWS = require("aws-sdk");
const mockStartExecution = jest.fn((params, err_function) => {

});

const mockStepFunctions = jest.fn(() => ({
  startExecution: mockStartExecution
}));

AWS.StepFunctions = mockStepFunctions;

beforeEach(() => {
  process.env.SECRET = 'test-secret';
  process.env.PHONE_NUMBER = 'test-bandwidth-phone';
  process.env.CALLBACK_TEXT_URL = 'test-wait-url';

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
  
  jest.mock('aws-sdk', () => {
    return {
      StepFunctions: mockStepFunctions
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
  const tag = JSON.stringify({
    secret: 'bad-secret',
    request: 'message_customer',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'test-message'
  });
  const eventBody = JSON.stringify({
    deliveryState: 'delivered',
    tag: tag
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

test('texts the given number', () => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'message_customer',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'test-message'
  });
  const eventBody = JSON.stringify({
    tag: tag
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
    expect(postData.to).toBe('+12345550101');
    expect(postData.text).toBe('test-message');
    expect(postData.receiptRequested).toBe('all');
    expect(postData.callbackUrl).toBe('test-wait-url');

    const tag = JSON.parse(postData.tag);
    expect(tag.waitType).toBe('seconds');
    expect(tag.waitValue).toBe('30');
    expect(tag.companyNumber).toBe('+12345550100');
    expect(tag.customerNumber).toBe('+12345550101');
    expect(tag.secret).toBe('test-secret');
    expect(tag.request).toBe('ensure_message_delivery');
  });
});

test('ensures message delivery', () => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'ensure_message_delivery',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'test-message'
  });
  const eventBody = JSON.stringify({
    deliveryState: 'delivered',
    tag: tag
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();

    const tag = JSON.parse(mockStartExecution.mock.params[0][0]);
    const err_function = JSON.parse(mockStartExecution.mock.params[0][1]);

    expect(tag).not.toBeNull();
    expect(err_function).not.toBeNull();

    expect(tag.waitType).toBe('seconds');
    expect(tag.waitValue).toBe('30');
    expect(tag.companyNumber).toBe('+12345550100');
    expect(tag.customerNumber).toBe('+12345550101');
    expect(tag.secret).toBe('test-secret');
    expect(tag.request).toBe('ensure_message_delivery');

    handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(200);
    expect(res.message).not.toBeNull();
  });
  });
});

test('returns 200 when message is waiting', () => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'ensure_message_delivery',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'test-message'
  });
  const eventBody = JSON.stringify({
    deliveryState: 'waiting',
    tag: tag
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();

    handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(200);
    expect(res.message).not.toBeNull();
  });
  });
});

test('returns 400 when deliveryState is invalid', () => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'ensure_message_delivery',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'test-message'
  });
  const eventBody = JSON.stringify({
    tag: tag
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();

    handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(400);
    expect(res.message).not.toBeNull();
  });
  });
});

test('returns 400 when request is invalid', () => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'bad-request-state',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'test-message'
  });
  const eventBody = JSON.stringify({
    deliveryState: 'waiting',
    tag: tag
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();

    handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(400);
    expect(res.message).not.toBeNull();
  });
  });
})

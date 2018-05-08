let handler;

const mockPost = jest.fn((type, data, callback) => {
  callback(null, {});
});

const mockStartExecution = jest.fn((params, err_function) => {

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

  jest.mock('aws-sdk', () => {
    return {
      StepFunctions: class StepFunctions {
        constructor() {
          this.startExecution = mockStartExecution;
        }
      }
    };
  });

  handler = require('./index').handler;
});

afterEach(() => {
  delete process.env.SECRET;
});

test('is denied due to an invalid secret', done => {
  const tag = JSON.stringify({
    secret: 'bad-secret',
    request: 'message_customer',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'This is a test',
    companyCallId: 'test-call-id'
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
    done();
  });
});

test('texts the given number', done => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'message_customer',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'This is a test',
    companyCallId: 'test-call-id'
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
    done();
  });
});

test('ensures message delivery', done => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'ensure_message_delivery',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'This is a test',
    companyCallId: 'test-call-id'
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

    expect(mockStartExecution.mock.params[0][0]).not.toBeNull();
    expect(mockStartExecution.mock.params[0][1]).not.toBeNull();
    done();
  });
});

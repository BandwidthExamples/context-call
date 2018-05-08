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

test('is denied due to an invalid secret', done => {
  const tag = JSON.stringify({
    secret: 'bad-secret',
    request: 'call_customer',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'This is a test'
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
    done();
  });
});

test('is denied due to an invalid tag', done => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'call_customer',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'This is a test'
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
    expect(res.code).toBe(400);
    expect(res.message).not.toBeNull();
    done();
  });
});

test('calls the company number', done => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'call_company',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'This is a test'
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
    expect(tag.request).toBe('ensure_company_answer');
    expect(tag.customerNumber).toBe('+12345550101');
    done();
  });
});

test('calls the customer number', done => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'ensure_company_answer',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'This is a test'
  });
  const eventBody = JSON.stringify({
    eventType: 'answer',
    tag: tag,
    callId: 'test-call-id-2'
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
    expect(data.to).toBe('+12345550101');

    expect(data.tag).not.toBeNull();
    const tag = JSON.parse(data.tag);
    expect(tag.request).toBe('ensure_customer_answer');
    done();
  });
});

test('fails to call the customer number if the company doesn\'t answer', done => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'ensure_company_answer',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'This is a test'
  });
  const eventBody = JSON.stringify({
    tag: tag,
    callId: 'test-call-id-2'
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(400);
    expect(res.message).not.toBeNull();
    done();
  });
});

test('bridges the given calls', done => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'ensure_customer_answer',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'This is a test',
    companyCallId: 'test-company-id'
  });
  const eventBody = JSON.stringify({
    eventType: 'answer',
    tag: tag,
    callId: 'test-customer-id',
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
      'test-customer-id',
      'test-company-id'
    ]);
    done();
  });
});

test('fails to bridge the given calls if the customer doesn\'t answer', done => {
  const tag = JSON.stringify({
    secret: 'test-secret',
    request: 'ensure_customer_answer',
    companyNumber: '+12345550100',
    customerNumber: '+12345550101',
    waitType: 'seconds',
    waitValue: '30',
    message: 'This is a test',
    companyCallId: 'test-company-id'
  });
  const eventBody = JSON.stringify({
    tag: tag,
    callId: 'test-customer-id',
  });
  const event = {
    body: eventBody
  };
  handler(event, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).not.toBeNull();
    expect(res.code).toBe(400);
    expect(res.message).not.toBeNull();
    done();
  });
});

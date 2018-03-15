import React from 'react';
import $ from 'jquery';
import {BrowserRouter} from 'react-router-dom';
import {
  BandwidthThemeProvider,
  Flow,
  Form,
  Input,
  Label,
  Table
} from '@bandwidth/shared-components';
import CallButton from './call-button/CallButton';

class App extends React.Component {

  static isValidPhoneNumber(number) {
    return number.match(new RegExp('^[+][0-9]{11}$'));
  }

  static isValidText(text) {
    return text.length > 0;
  }

  constructor() {
    super();
    this.state = {
      companyNumber: '',
      customerNumber: '',
      message: '',
      secret: ''
    };

    this.onCompanyNumberChange = this.onCompanyNumberChange.bind(this);
    this.onCustomerNumberChange = this.onCustomerNumberChange.bind(this);
    this.onTextMessageChange = this.onTextMessageChange.bind(this);
    this.onSecretChange = this.onSecretChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onCompanyNumberChange(event) {
    const number = event.target.value;
    this.setState({
      ...this.state,
      companyNumber: number,
      validCompanyNumber: number.match(new RegExp('^[+][0-9]{11}$'))
    });
  }

  onCustomerNumberChange(event) {
    const number = event.target.value;
    this.setState({
      ...this.state,
      customerNumber: number,
      validCustomerNumber: number.match(new RegExp('^[+][0-9]{11}$'))
    });
  }

  onTextMessageChange(event) {
    const msg = event.target.value;
    this.setState({
      ...this.state,
      message: msg,
      validMessage: msg.length > 0
    });
  }

  onSecretChange(event) {
    const secret = event.target.value;
    this.setState({
      ...this.state,
      secret: secret,
      validSecret: secret.length > 0
    });
  }

  onSubmit(customerNumber) {
    const data = {
      companyNumber: this.state.companyNumber,
      customerNumber: customerNumber,
      message: this.state.message,
      secret: this.state.secret
    };
    $.ajax({
      type: 'POST',
      url: 'https://aed46gt651.execute-api.us-west-2.amazonaws.com/prod/ContextCallV1',
      data: JSON.stringify(data),
      dataType: 'json',
      crossDomain: true,
      success: (res) => {
        console.log('Success: ' + JSON.stringify(res));
      },
      error: (err) => {
        console.log('Error: ' + JSON.stringify(err));
      }
    });
  }

  render() {
    const data = [
      {
        name: 'David Davidson I',
        order: 'ABCDEF–123',
        eta: '2018-03-20T08:00:00',
        phone: '+19195550100'
      },
      {
        name: 'Karl Karlson',
        order: 'ABCDEF–124',
        eta: '2018-03-20T10:00:00',
        phone: '+19195550101'
      },
      {
        name: 'James Jameson',
        order: 'ABCDEF–125',
        eta: '2018-03-20T12:00:00',
        phone: '+19195550102'
      },
      {
        name: 'Jack Jackson',
        order: 'ABCDEF–126',
        eta: '2018-03-21T11:00:00',
        phone: '+19195550103'
      },
      {
        name: 'David Davidson II',
        order: 'ABCDEF–127',
        eta: '2018-03-21T18:30:00',
        phone: '+19195550104'
      },
      {
        name: 'John Johnson',
        order: 'ABCDEF–128',
        eta: '2018-03-21T19:00:00',
        phone: '+19195550105'
      }
    ];

    const headers = (
      <Table.Row>
        <Table.Header>Name</Table.Header>
        <Table.Header>Order Number</Table.Header>
        <Table.Header>ETA</Table.Header>
        <Table.Header>Phone Number</Table.Header>
        <Table.Header>Text and Call</Table.Header>
      </Table.Row>
    );

    const tableBody = data.map((customer) =>
      <Table.Row key={customer.order}>
        <Table.Cell>{customer.name}</Table.Cell>
        <Table.Cell>{customer.order}</Table.Cell>
        <Table.Cell>{customer.eta}</Table.Cell>
        <Table.Cell>{customer.phone}</Table.Cell>
        <Table.Cell>
          <CallButton
            onSubmit={this.onSubmit}
            customerNumber={customer.phone}
            disabled={
              !App.isValidPhoneNumber(this.state.companyNumber) ||
              !App.isValidText(this.state.message) ||
              !App.isValidText(this.state.secret)
            }
          />
        </Table.Cell>
      </Table.Row>
    );

    return (
      <BrowserRouter>
        <BandwidthThemeProvider>
          <div>
            <Form>
              <Flow>
                <Flow.Row>
                  <Flow.Item>
                    <Label>
                      Company Phone Number
                    </Label>
                  </Flow.Item>
                  <Flow.Item>
                    <Input
                      id="company-number"
                      type="text"
                      value={this.state.companyNumber}
                      onChange={this.onCompanyNumberChange}
                      placeholder="Phone Number"
                    />
                  </Flow.Item>
                </Flow.Row>
                <Flow.Row>
                  <Flow.Item>
                    <Label>
                      Text Message
                    </Label>
                  </Flow.Item>
                  <Flow.Item>
                    <Input
                      id="text-message"
                      type="text"
                      value={this.state.message}
                      onChange={this.onTextMessageChange}
                      placeholder="Message"
                    />
                  </Flow.Item>
                </Flow.Row>
                <Flow.Row>
                  <Flow.Item>
                    <Label>
                      Secret
                    </Label>
                  </Flow.Item>
                  <Flow.Item>
                    <Input
                      id="secret-key"
                      type="password"
                      value={this.state.secret}
                      onChange={this.onSecretChange}
                      placeholder="Secret"
                    />
                  </Flow.Item>
                </Flow.Row>
              </Flow>
            </Form>

            <Table headers={headers}>
              {tableBody}
            </Table>
          </div>
        </BandwidthThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;

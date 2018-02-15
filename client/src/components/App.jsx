import React from 'react';
import $ from 'jquery';
import {
  Button,
  Flow,
  Form,
  Input,
  Label
} from '@bandwidth/shared-components';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      companyNumber: '',
      message: ''
    };

    this.customers = [
      {
        name: 'Customer A',
        phone: '+19194755313'
      },
      {
        name: 'Customer B',
        phone: '+19194755313'
      },
      {
        name: 'Customer C',
        phone: '+19194755313'
      },
      {
        name: 'Customer D',
        phone: '+19194755313'
      },
      {
        name: 'Customer E',
        phone: '+19194755313'
      }
    ];

    this.onCompanyNumberChange = this.onCompanyNumberChange.bind(this);
    this.onTextMessageChange = this.onTextMessageChange.bind(this);
    this.onTextSubmit = this.onTextSubmit.bind(this);
  }

  onCompanyNumberChange(event) {
    const number = event.target.value;
    this.setState({
      ...this.state,
      companyNumber: number,
      validCompanyNumber: number.match(new RegExp('^[+][0-9]{11}$'))
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

  onTextSubmit(event) {
    event.preventDefault();
    const data = {
      companyNumber: this.state.companyNumber,
      customerNumber: this.state.customerNumber,
      message: this.state.message
    };
    $.ajax({
      type: 'POST',
      url: 'https://jxguino42f.execute-api.us-west-2.amazonaws.com/prod/NodeJS-random-number-generator',
      data: JSON.stringify(data),
      dataType: 'json',
      crossDomain: true,
      success: (res) => {
        console.log(res);
      }
    });
  }

  render() {
    const customerList = this.customers.map(customer =>
      <Flow.Row>
        <Flow.Item>
          <Label>{customer.name}</Label>
        </Flow.Item>
        <Flow.Item>
          <Label>{customer.phone}</Label>
        </Flow.Item>
        <Flow.Item>
          <Button
            onClick={this.onTextSubmit}
            disabled={
              !this.state.validCompanyNumber ||
              !this.state.validMessage
            }
          >
            Text
          </Button>
        </Flow.Item>
      </Flow.Row>
    );

    return (
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
                  type="text"
                  value={this.state.message}
                  onChange={this.onTextMessageChange}
                  placeholder="Message"
                />
              </Flow.Item>
            </Flow.Row>
            {customerList}
          </Flow>
        </Form>
      </div>
    );
  }
}

export default App;

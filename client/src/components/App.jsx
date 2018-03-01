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
      customerNumber: '',
      message: '',
      secret: ''
    };

    this.onCompanyNumberChange = this.onCompanyNumberChange.bind(this);
    this.onCustomerNumberChange = this.onCustomerNumberChange.bind(this);
    this.onTextMessageChange = this.onTextMessageChange.bind(this);
    this.onSecretChange = this.onSecretChange.bind(this);
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

  onTextSubmit(event) {
    event.preventDefault();
    const data = {
      companyNumber: this.state.companyNumber,
      customerNumber: this.state.customerNumber,
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
        console.log(res);
      }
    });
  }

  render() {
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
                  Customer Phone Number
                </Label>
              </Flow.Item>
              <Flow.Item>
                <Input
                  type="text"
                  value={this.state.customerNumber}
                  onChange={this.onCustomerNumberChange}
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
            <Flow.Row>
              <Flow.Item>
                <Label>
                  Secret
                </Label>
              </Flow.Item>
              <Flow.Item>
                <Input
                  type="text"
                  value={this.state.secret}
                  onChange={this.onSecretChange}
                  placeholder="Secret"
                />
              </Flow.Item>
            </Flow.Row>
            <Flow.Row>
              <Flow.Item>
                <Button
                  onClick={this.onTextSubmit}
                  disabled={
                    !this.state.validCompanyNumber ||
                    !this.state.validCustomerNumber ||
                    !this.state.validMessage ||
                    !this.state.validSecret
                  }
                >
                  Text
                </Button>
              </Flow.Item>
            </Flow.Row>
          </Flow>
        </Form>
      </div>
    );
  }
}

export default App;

import React from 'react';
import $ from 'jquery';
import {
  Button,
  Flow,
  Form,
  Input
} from '@bandwidth/shared-components';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      textState: {
        phoneNumber: '',
        message: ''
      },
      callState: {
        phoneNumber: ''
      }
    };

    this.onTextNumberChange = this.onTextNumberChange.bind(this);
    this.onTextMessageChange = this.onTextMessageChange.bind(this);
    this.onCallNumberChange = this.onCallNumberChange.bind(this);
    this.onTextSubmit = this.onTextSubmit.bind(this);
    this.onCallSubmit = this.onCallSubmit.bind(this);
  }

  onTextNumberChange(event) {
    const number = event.target.value;
    this.setState({
      textState: {
        ...this.state.textState,
        phoneNumber: number,
        validNumber: number.match(new RegExp('^[+]?[0-9]{11}$'))
      }
    });
  }

  onTextMessageChange(event) {
    const msg = event.target.value;
    this.setState({
      textState: {
        ...this.state.textState,
        message: msg,
        validMessage: msg.length > 0
      }
    });
  }

  onCallNumberChange(event) {
    const number = event.target.value;
    this.setState({
      callState: {
        ...this.state.callState,
        phoneNumber: number,
        validNumber: number.match(new RegExp('^[+]?[0-9]{11}$'))
      }
    });
  }

  onTextSubmit(event) {
    event.preventDefault();
    const data = {
      number: this.state.textState.phoneNumber,
      message: this.state.textState.message
    };
    // url: 'http://my-req-bin.herokuapp.com/1lwq6nl1',
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

  onCallSubmit(event) {
    event.preventDefault();
    const data = JSON.stringify({
      number: this.state.callState.phoneNumber
    });
    // url: 'http://my-req-bin.herokuapp.com/1lwq6nl1',
    $.ajax({
      type: 'POST',
      url: 'https://jxguino42f.execute-api.us-west-2.amazonaws.com/prod/NodeJS-random-number-generator',
      data: data,
      dataType: 'json'
    });
  }

  render() {
    return (
      <div>
        <Form>
          <Flow>
            <Flow.Row>
              <Flow.Item>
                <Input
                  type="text"
                  value={this.state.textState.phoneNumber}
                  onChange={this.onTextNumberChange}
                  placeholder="Phone Number"
                />
              </Flow.Item>
              <Flow.Item>
                <Input
                  type="text"
                  value={this.state.textState.message}
                  onChange={this.onTextMessageChange}
                  placeholder="Message"
                />
              </Flow.Item>
              <Flow.Item>
                <Button
                  onClick={this.onTextSubmit}
                  disabled={
                    !this.state.textState.validNumber ||
                    !this.state.textState.validMessage
                  }
                >
                  Text
                </Button>
              </Flow.Item>
            </Flow.Row>
          </Flow>
        </Form>
        <Form>
          <Flow>
            <Flow.Row>
              <Flow.Item>
                <Input
                  type="text"
                  value={this.state.callState.phoneNumber}
                  onChange={this.onCallNumberChange}
                  placeholder="Phone Number"
                />
              </Flow.Item>
              <Flow.Item>
              </Flow.Item>
              <Flow.Item>
                <Button
                  onClick={this.onCallSubmit}
                  disabled={!this.state.callState.validNumber}
                >
                  Call
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

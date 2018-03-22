import React from 'react';
import {Button} from '@bandwidth/shared-components';

class CallButton extends React.Component {

  constructor() {
    super();
    this.state = {
      sending: false
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({
      sending: true
    });
    setTimeout(() => {
      this.setState({
        sending: false
      });
    }, 1000);
    this.props.onSubmit(this.props.customerNumber);
  }

  render() {
    return <Button
      onClick={this.onSubmit}
      disabled={
        this.props.disabled ||
        this.state.sending
      }
    >
      Text and Call
    </Button>;
  }
}

export default CallButton;

import React from 'react';
import $ from 'jquery';
import {Button} from '@bandwidth/shared-components';

class CallButton extends React.Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  static isValidPhoneNumber(number) {
    return number.match(new RegExp('^[+][0-9]{11}$'));
  }

  static isValidText(text) {
    return text.length > 0;
  }

  onSubmit(event) {
    event.preventDefault();
    const data = {
      companyNumber: this.props.companyNumber,
      customerNumber: this.props.customerNumber,
      message: this.props.message,
      secret: this.props.secret
    };
    $.ajax({
      type: 'POST',
      url: 'https://requestb.in/1kioddk1',
      data: JSON.stringify(data),
      dataType: 'json',
      crossDomain: true
    });
  }

  render() {
    return <Button
      id="submit-button"
      onClick={this.onSubmit}
      disabled={
        !CallButton.isValidPhoneNumber(this.props.companyNumber) ||
        !CallButton.isValidText(this.props.message) ||
        !CallButton.isValidText(this.props.secret)
      }
    >
      Text
    </Button>;
  }
}

export default CallButton;

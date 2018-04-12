import React from 'react';
import {
  Button,
  Icon,
  Input,
  Table
} from '@bandwidth/shared-components';

class AddCustomerRow extends React.Component {

  constructor() {
    super();
    this.state = {
      customer: {
        name: '',
        orderId: '',
        eta: '',
        phoneNumber: ''
      },
      sending: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onOrderIDChange = this.onOrderIDChange.bind(this);
    this.onETAChange = this.onETAChange.bind(this);
    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
  }

  onNameChange(event) {
    this.setState({
      ...this.state,
      customer: {
        ...this.state.customer,
        name: event.target.value
      }
    });
  }

  onOrderIDChange(event) {
    this.setState({
      ...this.state,
      customer: {
        ...this.state.customer,
        orderId: event.target.value
      }
    });
  }

  onETAChange(event) {
    this.setState({
      ...this.state,
      customer: {
        ...this.state.customer,
        eta: event.target.value
      }
    });
  }

  onPhoneNumberChange(event) {
    this.setState({
      ...this.state,
      customer: {
        ...this.state.customer,
        phoneNumber: event.target.value
      }
    });
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
    this.props.onSubmit(this.state.customer);
  }

  render() {
    return (
      <Table.Row>
        <Table.Cell>
          <Input
            id="new-customer-name"
            type="text"
            value={this.state.customer.name}
            onChange={this.onNameChange}
            placeholder="Name"
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            id="new-customer-order-id"
            type="text"
            value={this.state.customer.orderId}
            onChange={this.onOrderIDChange}
            placeholder="Order ID"
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            id="new-customer-eta"
            type="text"
            value={this.state.customer.eta}
            onChange={this.onETAChange}
            placeholder="ETA"
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            id="new-customer-phone"
            type="text"
            value={this.state.customer.phoneNumber}
            onChange={this.onPhoneNumberChange}
            placeholder="Phone Number"
          />
        </Table.Cell>
        <Table.Cell>
          <Button
            onClick={this.onSubmit}
            disabled={
              this.props.disabled ||
              this.state.sending
            }
          >
            Add Customer
          </Button>
        </Table.Cell>
      </Table.Row>);
  }
}

export default AddCustomerRow;

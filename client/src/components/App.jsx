import React from 'react';
import $ from 'jquery';
import {
  BrowserRouter
} from 'react-router-dom';
import {
  BandwidthThemeProvider,
  Button,
  Flow,
  Form,
  Input,
  Label,
  Table,
  SimpleTable,
  Spacing
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

    this.setState = this.setState.bind(this);
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
      crossDomain: true
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

    const columns = [
      {name: 'Name'},
      {name: 'Order Number'},
      {name: 'ETA'},
      {name: 'Phone Number'},
      {name: 'Call'}
    ];

    const renderRow = (item) => (
      <Table.Row>
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell>{item.order}</Table.Cell>
        <Table.Cell>{item.eta}</Table.Cell>
        <Table.Cell>{item.phone}</Table.Cell>
        <Table.Cell>
          <Button
            id="submit-button"
            onClick={this.onTextSubmit}
            disabled={
              !this.state.validCompanyNumber ||
              !this.state.validMessage ||
              !this.state.validSecret
            }
          >
            Text
          </Button>
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

            <SimpleTable
              items={data}
              columns={columns}
              renderRow={renderRow}
              renderDetails={(item) => <Spacing>{JSON.stringify(item, null,
                '\t')}</Spacing>}
            />
          </div>
        </BandwidthThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;

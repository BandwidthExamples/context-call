import $ from 'jquery';

export class OrderService {

  static addOrder(name, orderId, eta, phoneNumber) {

  }

  static getOrders() {
    console.log('Requesting customers.');
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'GET',
        url: 'https://dyrnp9j4tc.execute-api.us-west-2.amazonaws.com/beta/orders',
        success: (res) => {
          const orders = [];
          for (let i = 0; i < res.message.length; i++) {
            const order = res.message[i];
            orders[i] = {
              name: order['name'],
              order: order['orderId'],
              eta: order['eta'],
              phone: order['phoneNumber']
            };
            if ((orders[i].phone + '').match(new RegExp('^[0-9]{10}$'))) {
              orders[i].phone = '+1' + orders[i].phone;
            }
          }
          resolve(orders);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

}
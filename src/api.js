import axios from 'axios';

export class ApiClient {
  constructor() {
    this.baseURL = '/api/fixedfloat'; // Point to your backend proxy
  }

  async getExchangeRate(fromCurrency, toCurrency, amount) {
    try {
      const response = await axios.post(`${this.baseURL}/getPrice`, {
        fromCcy: fromCurrency,
        toCcy: toCurrency,
        amount: amount,
        direction: 'from'
      });
      return response.data;
    } catch (error) {
      console.error('Exchange Rate Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async createOrder(fromCurrency, toCurrency, amount, address, extra = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/createOrder`, {
        fromCcy: fromCurrency,
        toCcy: toCurrency,
        amount: amount,
        address: address,
        ...extra
      });
      return response.data;
    } catch (error) {
      console.error('Create Order Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

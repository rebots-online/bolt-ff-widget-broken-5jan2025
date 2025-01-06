import { CryptoWidget } from './widget';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById('crypto-converter-widget');
  if (element) {
    new CryptoWidget(element);
  }
});

(function() {
  class CryptoWidget {
    constructor(element) {
      this.element = element;
      this.currencies = [
        { value: 'AVAX', label: 'Avalanche (AVAX)', fee: 'low' },
        { value: 'SOL', label: 'Solana (SOL)', fee: 'low' },
        { value: 'TRX', label: 'TRON (TRX)', fee: 'low' },
        { value: 'XRP', label: 'Ripple (XRP)', fee: 'low' },
        { value: 'BTC', label: 'Bitcoin (BTC)', fee: 'medium' },
        { value: 'BTCLN', label: 'Bitcoin Lightning ⚡', fee: 'low' },
        { value: 'ETH', label: 'Ethereum (ETH)', fee: 'medium' },
        { value: 'USDT', label: 'Tether (USDT)', fee: 'medium' }
      ];
      
      this.defaultPair = {
        from: 'AVAX',
        to: 'BTCLN'
      };

      this.SATS_PER_BTC = 100000000;
      this.showSats = false;
      
      this.injectStyles();
      this.render();
      this.attachEventListeners();
    }

    injectStyles() {
      if (!document.getElementById('crypto-widget-styles')) {
        const styles = `
          .crypto-widget {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            background: white;
          }

          .conversion-layout {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 20px;
            align-items: start;
          }

          .currency-column {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
          }

          .column-header {
            font-size: 1.1em;
            font-weight: 600;
            margin-bottom: 15px;
            color: #2c3e50;
          }

          .currency-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .currency-option {
            display: flex;
            align-items: center;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .currency-option:hover:not(.disabled) {
            background: #e9ecef;
          }

          .currency-option.disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .currency-option input[type="radio"] {
            display: none;
          }

          .currency-option label {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            cursor: pointer;
          }

          .currency-option.disabled label {
            cursor: not-allowed;
          }

          .radio-custom {
            width: 18px;
            height: 18px;
            border: 2px solid #6c757d;
            border-radius: 50%;
            display: inline-block;
            position: relative;
          }

          input[type="radio"]:checked + label .radio-custom::after {
            content: '';
            width: 10px;
            height: 10px;
            background: #0066cc;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .currency-name {
            flex-grow: 1;
          }

          .fee-tag {
            font-size: 0.8em;
            padding: 2px 6px;
            border-radius: 4px;
            background: #e9ecef;
          }

          .fee-tag.low {
            color: #198754;
            background: #d1e7dd;
          }

          .fee-tag.medium {
            color: #fd7e14;
            background: #fff3cd;
          }

          .direction-column {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
          }

          .switch-direction {
            width: 40px;
            height: 40px;
            background: #0066cc;
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
          }

          .switch-direction:hover {
            background: #0052a3;
          }

          .amount-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }

          .input-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .input-group input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
          }

          .usd-amount {
            font-size: 0.9em;
            color: #6c757d;
          }

          .convert-button {
            background: #0066cc;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            width: 100%;
            margin-top: 20px;
          }

          .convert-button:hover {
            background: #0052a3;
          }

          .lightning-input {
            margin-top: 15px;
            display: none;
          }

          .lightning-input.visible {
            display: block;
          }

          .lightning-input textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            min-height: 60px;
          }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'crypto-widget-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
      }
    }

    render() {
      this.element.innerHTML = `
        <div class="crypto-widget">
          <div class="conversion-layout">
            <div class="currency-column">
              <div class="column-header">From:</div>
              <div class="currency-list" id="fromList">
                ${this.currencies.map(curr => `
                  <div class="currency-option">
                    <input type="radio" 
                      name="fromCurrency" 
                      id="from_${curr.value}" 
                      value="${curr.value}"
                      ${curr.value === this.defaultPair.from ? 'checked' : ''}
                    >
                    <label for="from_${curr.value}">
                      <span class="radio-custom"></span>
                      <span class="currency-name">${curr.label}</span>
                      <span class="fee-tag ${curr.fee}">${curr.fee} fee</span>
                    </label>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="direction-column">
              <button class="switch-direction" title="Switch direction">⇄</button>
            </div>

            <div class="currency-column">
              <div class="column-header">To:</div>
              <div class="currency-list" id="toList">
                ${this.currencies.map(curr => `
                  <div class="currency-option">
                    <input type="radio" 
                      name="toCurrency" 
                      id="to_${curr.value}" 
                      value="${curr.value}"
                      ${curr.value === this.defaultPair.to ? 'checked' : ''}
                    >
                    <label for="to_${curr.value}">
                      <span class="radio-custom"></span>
                      <span class="currency-name">${curr.label}</span>
                      <span class="fee-tag ${curr.fee}">${curr.fee} fee</span>
                    </label>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="amount-inputs">
            <div class="input-group">
              <input type="number" id="fromAmount" placeholder="You send">
              <div class="usd-amount" id="fromUsdAmount"></div>
            </div>
            <div class="input-group">
              <input type="number" id="toAmount" placeholder="You receive" readonly>
              <div class="usd-amount" id="toUsdAmount"></div>
            </div>
          </div>

          <div class="lightning-input" id="lightningInput">
            <textarea 
              placeholder="Enter Lightning Invoice, LNURL, or Lightning Address"
              id="lightningAddress"
            ></textarea>
          </div>

          <button class="convert-button">Get Exchange Rate</button>
        </div>
      `;
    }

    updateDisabledOptions() {
      const fromValue = document.querySelector('input[name="fromCurrency"]:checked').value;
      const toValue = document.querySelector('input[name="toCurrency"]:checked').value;

      // Enable all options first
      document.querySelectorAll('.currency-option').forEach(option => {
        option.classList.remove('disabled');
      });

      // Disable the selected "from" currency in the "to" list
      const toOption = document.querySelector(`#to_${fromValue}`).closest('.currency-option');
      toOption.classList.add('disabled');

      // Disable the selected "to" currency in the "from" list
      const fromOption = document.querySelector(`#from_${toValue}`).closest('.currency-option');
      fromOption.classList.add('disabled');
    }

    attachEventListeners() {
      // Radio button change handlers
      document.querySelectorAll('input[name="fromCurrency"]').forEach(radio => {
        radio.addEventListener('change', () => {
          this.updateDisabledOptions();
          this.updateConversion();
          this.updateLightningInputVisibility();
        });
      });

      document.querySelectorAll('input[name="toCurrency"]').forEach(radio => {
        radio.addEventListener('change', () => {
          this.updateDisabledOptions();
          this.updateConversion();
          this.updateLightningInputVisibility();
        });
      });

      // Switch direction button
      const switchButton = this.element.querySelector('.switch-direction');
      switchButton.addEventListener('click', () => this.switchDirection());

      // Amount input
      const fromAmount = this.element.querySelector('#fromAmount');
      fromAmount.addEventListener('input', () => this.updateConversion());

      // Initialize disabled options
      this.updateDisabledOptions();
      this.updateLightningInputVisibility();
    }

    switchDirection() {
      const fromChecked = document.querySelector('input[name="fromCurrency"]:checked').value;
      const toChecked = document.querySelector('input[name="toCurrency"]:checked').value;

      document.querySelector(`#from_${toChecked}`).checked = true;
      document.querySelector(`#to_${fromChecked}`).checked = true;

      this.updateDisabledOptions();
      this.updateConversion();
      this.updateLightningInputVisibility();
    }

    updateLightningInputVisibility() {
      const toValue = document.querySelector('input[name="toCurrency"]:checked').value;
      const lightningInput = this.element.querySelector('#lightningInput');
      
      if (toValue === 'BTCLN') {
        lightningInput.classList.add('visible');
      } else {
        lightningInput.classList.remove('visible');
      }
    }

    // Rest of the methods (getUsdPrice, updateConversion, etc.) remain the same...
  }

  window.CryptoWidget = CryptoWidget;

  document.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('crypto-converter-widget');
    if (element) {
      new CryptoWidget(element);
    }
  });
})();

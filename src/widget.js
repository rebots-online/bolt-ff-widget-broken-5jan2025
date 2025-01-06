// Add at the top of the file
const FIXEDFLOAT_CONFIG = {
  apiKey: 'YOUR_API_KEY',    // Replace with your FixedFloat API key
  apiSecret: 'YOUR_SECRET'   // Replace with your FixedFloat API secret
};

// Update the constructor
constructor(element) {
  this.element = element;
  this.api = new ApiClient(FIXEDFLOAT_CONFIG.apiKey, FIXEDFLOAT_CONFIG.apiSecret);
  // ... rest of constructor
}

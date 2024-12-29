import code from '@code-wallet/elements'; // Import the GetCode elements library

export default class GetCodePaywallTool {
  static get toolbox() {
    return {
      title: 'Paywall',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A6 6 0 0 0 6 8v4H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V8a6 6 0 0 0-6-6m0 2a4 4 0 0 1 4 4v4H8V8a4 4 0 0 1 4-4m-8 8h16v8H4Z"/></svg>',
    };
  }

  constructor({ data }) {
    this.data = data;
    this.depositAddress = 'DEVeLKdf2SNpY5xVPyv8odUb6XdVzPGw6B7v8YL9uasC'; // Replace with your GetCode wallet deposit address
  }

  render() {
    const container = document.createElement('div');
    container.classList.add('paywall-block');

    const message = document.createElement('p');
    message.innerText = 'Paywall here';
    container.appendChild(message);

    // // This is where the GetCode payment button will be mounted
    // const buttonContainer = document.createElement('div');
    // buttonContainer.classList.add('getcode-button-container');
    // container.appendChild(buttonContainer);

    // // Mount the GetCode wallet button after the container is added to the DOM
    // setTimeout(() => this.renderGetCodeButton(buttonContainer), 0); 

    return container;
  }

  renderGetCodeButton(buttonContainer) {
    const { button } = code.elements.create('button', {
      currency: 'usd',
      destination: this.depositAddress, // Replace this with your deposit address
      amount: 0.05 // Set the payment amount
    });

    button?.mount(buttonContainer);

    // Event listeners for payment actions
    button?.on('invoke', async () => {
      console.log('Payment has been started.');
    });

    button?.on('success', async (event) => {
      console.log('Payment was successful!', event);
      alert('Payment Successful! Unlocking content...');
      this.unlockContent();
    });

    button?.on('cancel', async (event) => {
      console.log('Payment was cancelled.', event);
    });
  }

  unlockContent() {
    // Find all elements after the paywall and unlock them
    const container = document.querySelectorAll('.paywall-block ~ *');
    container.forEach((el) => {
      el.classList.remove('paywall-block');
      el.classList.add('unlocked-content');
    });
  }

  save() {
    return {};
  }
}

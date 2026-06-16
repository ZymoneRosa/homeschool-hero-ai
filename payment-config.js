/*
  Homeschool Hero AI payment flow
  Pricing buttons now send families to checkout.html first.
  checkout.html collects parent + child info, saves it in the browser, then sends them to Stripe.
*/
const PAYMENT_LINKS = {
  free: 'index.html#generator',
  basic: 'https://buy.stripe.com/9B6aEZaj0fUYfnE1x1gjC00',
  premium: 'https://buy.stripe.com/5kQeVf9eWdMQgrI7VpgjC01',
  family: 'https://buy.stripe.com/cNibJ362KaAE5N4a3xgjC02'
};

const PLAN_NAMES = {
  free: 'Free',
  basic: 'Basic',
  premium: 'Premium',
  family: 'Family'
};

const PLAN_PRICES = {
  free: '$0/month',
  basic: '$9.99/month',
  premium: '$19.99/month',
  family: '$29.99/month'
};

function goToPayment(planName) {
  if (planName === 'free') {
    window.location.href = PAYMENT_LINKS.free;
    return;
  }

  if (!PAYMENT_LINKS[planName]) {
    alert('Payment link not found for this plan.');
    return;
  }

  window.location.href = `checkout.html?plan=${encodeURIComponent(planName)}`;
}

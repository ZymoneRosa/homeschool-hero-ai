# Stripe Setup for Homeschool Hero AI

Your Stripe links have already been added to `payment-config.js`:

- Basic: https://buy.stripe.com/9B6aEZaj0fUYfnE1x1gjC00
- Premium: https://buy.stripe.com/5kQeVf9eWdMQgrI7VpgjC01
- Family: https://buy.stripe.com/cNibJ362KaAE5N4a3xgjC02

## Optional but recommended

Inside each Stripe Payment Link, set:

- Success URL: `https://YOURDOMAIN.com/thank-you.html`
- Cancel URL: `https://YOURDOMAIN.com/cancelled.html`

Replace `YOURDOMAIN.com` with your real domain after you publish the website.

## Important

These buttons collect payment through Stripe. They do not yet automatically create user accounts or unlock paid features. For automatic upgrades, you will need Stripe webhooks and a user account system.

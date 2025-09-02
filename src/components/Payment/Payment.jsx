import "./Payment.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "***REMOVED***"
);

const Payment = ({ product, onClose }) => {
  const options = {
    mode: "payment",

    amount: Math.round(product.product_price * 100),

    currency: "eur",

    appearance: {
      /*...*/
    },
  };
  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Paiement sécurisé</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm product={product} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;

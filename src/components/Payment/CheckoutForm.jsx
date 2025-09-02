import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import "./CheckoutForm.css";

const CheckoutForm = ({ product }) => {
  const stripe = useStripe();
  const elements = useElements();

  // State qui gère les messages d'erreurs
  const [errorMessage, setErrorMessage] = useState(null);
  // State qui gère le fait que le paiement a été effectué
  const [completed, setCompleted] = useState(false);
  // State qui gère le fait qu'on est en train de payer
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (elements == null || !stripe) {
      setIsLoading(false);
      return;
    }

    try {
      // Vérification et validation des infos entrées dans les inputs
      const { error: submitError } = await elements.submit();
      if (submitError) {
        // Affiche l'erreur en question
        setErrorMessage(submitError.message);
        setIsLoading(false);
        return;
      }

      // Demande au backend de créer l'intention de paiement, il nous renvoie le clientSecret
      const response = await axios.post(`${API_URL}/payment`, {
        productId: product._id,
        amount: Math.round(product.product_price * 100), // Prix en centimes une galère
        title: product.product_name,
      });

      const clientSecret = response.data.client_secret;

      // Requête à Stripe pour valider le paiement
      const stripeResponse = await stripe.confirmPayment({
        // elements contient les infos et la configuration du paiement
        elements,
        clientSecret,
        // Éventuelle redirection
        confirmParams: {
          return_url: window.location.origin,
        },
        // Bloque la redirections
        redirect: "if_required",
      });

      // Si une erreur a lieu pendant la confirmation
      if (stripeResponse.error) {
        // On la montre au client
        setErrorMessage(stripeResponse.error.message);
      } else if (
        stripeResponse.paymentIntent &&
        stripeResponse.paymentIntent.status === "succeeded"
      ) {
        // Si on reçois un status succeeded on fais passer completed à true
        setCompleted(true);
      }
    } catch (error) {
      console.error("Erreur de paiement:", error);
      setErrorMessage("Une erreur est survenue lors du paiement");
    } finally {
      setIsLoading(false);
    }
  };

  return completed ? (
    <div className="success-message">
      <p>✅ Paiement effectué avec succès !</p>
      <p>Merci pour votre achat de "{product.product_name}"</p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="payment-summary">
        <h3>Récapitulatif de commande</h3>
        <div className="order-item">
          <span>{product.product_name}</span>
          <span>{Number(product.product_price).toFixed(2)} €</span>
        </div>
        <div className="order-total">
          <strong>
            <span>Total à payer</span>
            <span>{Number(product.product_price).toFixed(2)} €</span>
          </strong>
        </div>
      </div>

      <div className="payment-element">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="payment-button"
      >
        {isLoading
          ? "Traitement en cours..."
          : `Payer ${Number(product.product_price).toFixed(2)} €`}
      </button>

      {/* Éventuel message d'erreur si il y en a */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;

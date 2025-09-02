import { useLocation, Link } from "react-router-dom";
import "./Success.css";

const SuccessPublish = () => {
  const location = useLocation();
  const offer = location.state?.offer;

  console.log("📋 Données de l'offre reçues:", offer);

  return (
    <div className="success-publish">
      <h1>Félicitations !</h1>
      <p>Votre article a bien été publié.</p>
      {offer && (
        <div className="offer-details">
          {offer.product_image?.secure_url && (
            <img
              src={offer.product_image.secure_url}
              alt="image produit"
              className="success-image"
            />
          )}
          <p>
            <span>Titre:</span> {offer.product_name}
          </p>
          <p>
            <span>Prix:</span> {offer.product_price}€
          </p>
        </div>
      )}
      <div className="success-buttons">
        <Link to={`/offer/${offer?._id}`}>
          <button>Voir l'article</button>
        </Link>
        <Link to="/">
          <button>Retour à l'accueil</button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessPublish;

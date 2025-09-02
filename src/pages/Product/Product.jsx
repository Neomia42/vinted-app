import { Link, useParams } from "react-router-dom";
import { useState, useEffect, use } from "react";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { TbZoomInArea } from "react-icons/tb";
import { IoHome } from "react-icons/io5";
import { API_URL } from "../../config/api";
import Payment from "../../components/Payment/Payment";

import "./Product.css";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/offer/${id}`);
        setProduct(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyClick = () => {
    setShowPayment(true);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
  };

  return isLoading ? (
    <div className="loader-container">
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={["#057984", "#057984", "#057984", "#057984", "#057984"]}
      />
    </div>
  ) : (
    <main className="main-container">
      <div className="product-main">
        <Link to="/">
          <IoHome /> Retour aux produits
        </Link>
        <div className="product-container">
          <div className="product-image">
            <div className="img-left">
              <img
                src={product.product_image.secure_url}
                alt={product.product_name}
                className="img-product-main"
              />{" "}
              <span className="zoom-icon">
                <TbZoomInArea />
              </span>
            </div>
            <div className="img-rig-container">
              {Array.isArray(product.product_pictures) &&
                product.product_pictures.length > 0 &&
                product.product_pictures.map((pict, index) => (
                  <div className="img-rigth" key={index}>
                    <img
                      src={pict.secure_url}
                      alt="Photo additionnelle"
                      className="img-product-additional"
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="product-details">
            <div className="price-item">
              {Number(product.product_price).toFixed(2)} €
            </div>
            <div className="product-info">
              {product.product_details.map((detail, index) => (
                <div className="prod-details-block" key={index}>
                  <span className="detail-key">{Object.keys(detail)} :</span>
                  <span className="detail-value">{Object.values(detail)}</span>
                </div>
              ))}
              <div className="divider-card"></div>
              <div className="product-description-section">
                <div className="product-name">
                  <h2>Nom du Produit:</h2>
                  {product.product_name}
                </div>
                <div className="product-description">
                  <h2>Description:</h2>
                  {product.product_description}
                </div>
              </div>
            </div>
            <div className="buy-btn">
              <button onClick={handleBuyClick}>Acheter</button>
            </div>

            {/* <div className="product-owner">
              <div className="owner-avatar">
                <img
                  src={product.owner.account.avatar.secure_url}
                  alt="Avatar du propriétaire"
                  className="avatar-image"
                />
              </div>
              <div className="owner-info">
                <p>{product.owner.account.username}</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Affichage conditionnel du composant Payment */}
      {showPayment && (
        <Payment product={product} onClose={handleClosePayment} />
      )}
    </main>
  );
};
export default Product;

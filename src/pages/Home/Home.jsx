import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import { ColorRing } from "react-loader-spinner";
import heroImg from "../../assets/img/hero-24963eb2.jpg";
import { API_URL } from "../../config/api";
import "./Home.css";

const Home = () => {
  const [data, setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/offers`);
        setdata(response.data.offers);
        setIsLoading(false);
        // console.log(response.data.offers.);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
    <main>
      <div
        className="Home-img-baner"
        style={{ backgroundImage: `url(${heroImg})` }}
      ></div>

      <div className="cards-container">
        {data.map((offers, index) => {
          // console.log(offers.owner.account.avatar),
          return (
            <Link to={`/offer/${offers._id}`} key={offers._id + index}>
              <div className="cards-offers">
                <div
                  className="cards-offers-user"
                  key={offers.owner.account.avatar + index}
                >
                  {offers.owner.account.avatar ? (
                    <img
                      src={offers.owner.account.avatar.url}
                      alt="Avatar utilisateur"
                    />
                  ) : (
                    <FaUserAlt className="default-avatar-icon" />
                  )}
                  <p>{offers.owner.account.username}</p>
                </div>
                <div className="cards-offers" key={offers._id + index}>
                  <div className="img-product">
                    <img
                      src={offers.product_image.secure_url}
                      alt="Image du produit"
                      className="img-product"
                    />
                  </div>
                </div>
                <div className="info-product">
                  <p className="price-product">
                    {Number(offers.product_price).toFixed(2)}€
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
};
export default Home;

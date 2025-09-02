import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import { ColorRing } from "react-loader-spinner";
import heroImg from "../../assets/img/hero-24963eb2.jpg";
import { API_URL } from "../../config/api";
import "./Home.css";

const Home = ({
  searchFilters,
  currentPage,
  onPageChange,
  onTotalPagesChange,
}) => {
  const [data, setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Construction des paramètres de requête
        const params = new URLSearchParams();
        if (searchFilters?.title) params.append("title", searchFilters.title);
        if (searchFilters?.priceMin)
          params.append("priceMin", searchFilters.priceMin);
        if (searchFilters?.priceMax)
          params.append("priceMax", searchFilters.priceMax);
        if (searchFilters?.sort) params.append("sort", searchFilters.sort);
        if (currentPage) params.append("page", currentPage);
        params.append("limit", "20"); // 20 articles par page c'est dejà bien ;)

        const queryString = params.toString();
        const url = `${API_URL}/offers${queryString ? `?${queryString}` : ""}`;

        // console.log(" URL de la requête:", url);

        const response = await axios.get(url);
        setdata(response.data.offers || []);

        // Calculer le nombre total de pages
        const total =
          response.data.nombreAnnonces ||
          response.data.count ||
          response.data.offers?.length ||
          0;
        const calculatedTotalPages = Math.ceil(total / 20);
        setTotalPages(calculatedTotalPages);

        // Informer le parent du nombre total de pages
        if (onTotalPagesChange) {
          onTotalPagesChange(calculatedTotalPages);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchFilters, currentPage, onTotalPagesChange]);

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
      <div className="Home-img-baner">
        <img src={heroImg} alt="banière" />
      </div>

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

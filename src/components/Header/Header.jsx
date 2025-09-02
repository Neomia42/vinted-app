import { Link } from "react-router-dom";
import { useState } from "react";
import vintedLogo from "../../assets//img/Vinted_logo.png";
import Cookie from "js-cookie";
import { FaUserAlt, FaSearch } from "react-icons/fa";
import "./Header.css";

const Header = ({
  isConnected,
  setIsConnected,
  onSearch,
  onPageChange,
  currentPage,
  totalPages,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const handleSearch = (event) => {
    if (event) event.preventDefault();
    if (onSearch) {
      onSearch({
        title: searchTerm,
        priceMin: priceMin,
        priceMax: priceMax,
        sort: sortOrder,
      });
    }
  };

  const handleSortChange = (event) => {
    const newSortOrder = event.target.value;
    setSortOrder(newSortOrder);

    // Déclencher automatiquement la recherche avec le nouveau tri
    if (onSearch) {
      onSearch({
        title: searchTerm,
        priceMin: priceMin,
        priceMax: priceMax,
        sort: newSortOrder,
      });
    }
  };

  const handlePageChange = (page) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <header>
      <div className="header-container">
        <div>
          <Link to="/">
            <img src={vintedLogo} alt="Vinted Logo" className="header-logo" />
          </Link>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Recherche des articles"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <FaSearch />
              </button>
            </div>

            <div className="filters-container">
              <div className="price-filters">
                <input
                  type="number"
                  placeholder="Prix min"
                  value={priceMin}
                  onChange={(event) => setPriceMin(event.target.value)}
                  className="price-input"
                />
                <input
                  type="number"
                  placeholder="Prix max"
                  value={priceMax}
                  onChange={(event) => setPriceMax(event.target.value)}
                  className="price-input"
                />
              </div>

              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="">Trier par</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </form>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ←
            </button>

            <span className="pagination-info">
              Page {currentPage} sur {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              →
            </button>
          </div>
        )}

        <div className="btn-header">
          {isConnected ? (
            <div className="isconnected-buttons">
              <Link to="/publish">
                <button className="sell-your-items">Vends tes articles</button>
              </Link>
              <button
                className="logout-btn"
                onClick={() => {
                  Cookie.remove("token");
                  setIsConnected(false);
                }}
              >
                Se Déconnecter
              </button>
              <FaUserAlt className="default-avatar-profil" />
            </div>
          ) : (
            <div className="header-buttons">
              <Link to="/signup">
                <button className="btn-signup-login">S'Incrire</button>
              </Link>
              <Link to="/login">
                <button className="btn-signup-login">Se Connecter</button>
              </Link>
              <Link to="/publish">
                <button className="sell-your-items">Vends tes articles</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

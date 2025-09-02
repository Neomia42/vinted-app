import { Link } from "react-router-dom";
import vintedLogo from "../../assets//img/Vinted_logo.png";
import Cookie from "js-cookie";
import { FaUserAlt } from "react-icons/fa";
import "./Header.css";

const Header = ({ isConnected, setIsConnected }) => {
  return (
    <header>
      <div className="header-container">
        <div>
          <Link to="/">
            <img src={vintedLogo} alt="Vinted Logo" className="header-logo" />
          </Link>
        </div>

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

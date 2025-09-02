//import react
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import icons
import { IoEyeOffSharp } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";

//Import utils
import handleChange from "../../assets/utils/handleChange";
import handleToken from "../../assets/utils/handleToken";
//Import URL API
import { API_URL } from "../../config/api";
// import CCS
import "./SignUp.css";
// import logo
import vintedLogo from "../../assets/img/Vinted_logo.png";

const SignUp = ({ setIsConnected }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <main className="signup-container">
      <div className="title-top">
        <h1>S'inscrire</h1>
        <h2>sur</h2>
        <img src={vintedLogo} alt="Logo Vinted" />
      </div>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          //   verifier que les deux mdp sont identiques
          if (password === confirmPassword) {
            try {
              // envoyer les données au serveur
              const response = await axios.post(`${API_URL}/user/signup`, {
                username,
                email,
                password,
                newsletter,
              });
              // stocker le token dans un cookie si il est pas présent
              handleToken(response.data.token, setIsConnected);
              // rediriger l'utilisateur vers la page d'accueil
              navigate("/");
            } catch (error) {
              console.log(error);
              if (error.response && error.response.status === 409) {
                setMessageError(true);
                return;
              }
            }
          } else {
            setPasswordError(true);
          }
        }}
      >
        <div className="signup-form">
          <input
            type="text"
            id="username"
            name="name"
            placeholder="Nom d'utilisateur"
            required
            value={username}
            onChange={(event) => handleChange(event, setUsername)}
          />

          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(event) => handleChange(event, setEmail)}
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Mot de passe"
              required
              value={password}
              onChange={(event) => {
                handleChange(event, setPassword);
                if (event.target.value === confirmPassword) {
                  setPasswordError(false);
                }
              }}
              style={passwordError ? { borderBottom: "2px solid red" } : {}}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeSharp /> : <IoEyeOffSharp />}
            </span>
          </div>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              required
              value={confirmPassword}
              onChange={(event) => {
                handleChange(event, setConfirmPassword);
                if (event.target.value === password) {
                  setPasswordError(false);
                }
              }}
              style={passwordError ? { borderBottom: "2px solid red" } : {}}
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <IoEyeSharp /> : <IoEyeOffSharp />}
            </span>
          </div>
          <div className="checkbox-container">
            <div>
              <input
                type="checkbox"
                value={newsletter}
                id="newsletter"
                onChange={(event) => {
                  setNewsletter(event.target.checked);
                }}
              />
              <span>S'inscrire à notre newsletter</span>
            </div>
            <p>
              En m'inscrivant je confirme avoir lu et accepté les Termes &
              Conditions et Politique de Confidentialité de Vinted. Je confirme
              avoir au moins 18 ans.
            </p>
          </div>
          <button className="btn-gen">Register</button>
          {messageError && (
            <div style={{ color: "red", marginTop: "8px" }}>
              Impossible de créer le compte. Veuillez vérifier vos informations.
            </div>
          )}
          {passwordError && (
            <div style={{ color: "red", marginTop: "8px" }}>
              Les mots de passe ne correspondent pas.
            </div>
          )}
        </div>
      </form>
    </main>
  );
};

export default SignUp;

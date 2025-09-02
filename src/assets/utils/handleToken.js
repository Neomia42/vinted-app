import Cookie from "js-cookie";

const handleToken = (token, setIsConnected) => {
  // Si on veut se déconnecter (token false)
  if (!token) {
    Cookie.remove("token");
    setIsConnected(false);
    return false;
  }
  // Si on passe un token, on le sauvegarde (nouveau ou existant)
  Cookie.set("token", token, { expires: 7 });
  setIsConnected(true);
  console.log("Token stocké:", Cookie.get("token"));
  return token;
};
export default handleToken;

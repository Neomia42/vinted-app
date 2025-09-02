//Import react
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { useDropzone } from "react-dropzone";
//import utils
import handleChange from "../../assets/utils/handleChange";
//import Url API
import { API_URL } from "../../config/api";
// import logo
import vintedLogo from "../../assets/img/Vinted_logo.png";
//Import icons
import { FaTrashAlt } from "react-icons/fa";

// import CCS
import "./Publish.css";
// Get token from cookie, import cookie
const token = Cookie.get("token");
const Publish = ({ isConnected, setIsConnected }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [picture, setPicture] = useState(null);
  const [picturesAdd, setPicturesAdd] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("");
  const [picturePreview, setPicturePreview] = useState(null);
  const [picturesAddPreview, setPicturesAddPreview] = useState([]);

  // États pour la gestion des erreurs
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction pour nettoyer les erreurs
  const clearFieldError = (fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];

      // Si plus d'erreurs de champs, supprimer aussi l'erreur globale
      const hasFieldErrors = Object.keys(newErrors).some(
        (key) => key !== "submit" && key !== "global"
      );
      if (!hasFieldErrors) {
        delete newErrors.global;
      }

      return newErrors;
    });
  };

  // Fonction de validation
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Le titre est obligatoire";
    if (!description.trim())
      newErrors.description = "La description est obligatoire";
    if (!price || isNaN(price) || parseFloat(price) <= 0)
      newErrors.price = "Le prix doit être un nombre positif";
    if (!brand.trim()) newErrors.brand = "La marque est obligatoire";
    if (!size.trim()) newErrors.size = "La taille est obligatoire";
    if (!color.trim()) newErrors.color = "La couleur est obligatoire";
    if (!condition.trim()) newErrors.condition = "L'état est obligatoire";
    if (!city.trim()) newErrors.city = "Le lieu est obligatoire";
    if (!picture) newErrors.picture = "Une photo principale est obligatoire";

    // Message global si des éléments sont manquants
    if (Object.keys(newErrors).length > 0) {
      newErrors.global =
        "Des éléments obligatoires sont manquants pour poster votre annonce.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Dropzone pour l'image principale
  const {
    getRootProps: getMainRootProps,
    getInputProps: getMainInputProps,
    isDragActive: isMainDragActive,
  } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setPicture(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPicturePreview(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPicturePreview(null);
      }
    },
  });
  // Dropzone pour les images supplémentaires
  const {
    getRootProps: getMultipleRootProps,
    getInputProps: getMultipleInputProps,
    isDragActive: isMultipleDragActive,
  } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      const allFiles = [...picturesAdd, ...acceptedFiles].slice(0, 5);
      setPicturesAdd(allFiles);
      if (allFiles.length === 0) {
        setPicturesAddPreview([]);
        return;
      }
      const previews = [];
      let loadedCount = 0;
      allFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          previews[index] = event.target.result;
          loadedCount++;
          if (loadedCount === allFiles.length) {
            setPicturesAddPreview(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    },
  });

  return (
    <main className="main-publish-container">
      <div className="publish-items-container">
        {isConnected ? (
          <div className="main-publish">
            <h1>Vend ton articles</h1>

            <form
              className="publish-form"
              onSubmit={async (event) => {
                event.preventDefault();

                // Validation côté client
                if (!validateForm()) {
                  console.log("❌ Validation échouée:", errors);
                  return;
                }

                setIsSubmitting(true);
                setErrors({}); // Reset des erreurs

                try {
                  const formData = new FormData();
                  formData.append("title", title);
                  formData.append("description", description);
                  formData.append("price", price);
                  formData.append("brand", brand);
                  formData.append("size", size);
                  formData.append("condition", condition);
                  formData.append("couleur", color);
                  formData.append("city", city);
                  formData.append("picture", picture);
                  if (picturesAdd) {
                    for (let i = 0; i < picturesAdd.length && i < 5; i++) {
                      formData.append("pictures", picturesAdd[i]);
                    }
                  }

                  const response = await axios.post(
                    `${API_URL}/offer/publish`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );

                  if (response.status === 201 || response.status === 200) {
                    navigate("/publish/success", {
                      state: { offer: response.data },
                    });
                  }
                } catch (error) {
                  console.error(" Erreur lors de la publication:", error);

                  if (error.response?.status === 400) {
                    setErrors({
                      submit: "Données invalides. Vérifiez vos informations.",
                    });
                  } else {
                    setErrors({
                      submit: "Une erreur est survenue. Réessayez plus tard.",
                    });
                  }
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div className="cards-publish">
                <div className="card-publish-picture">
                  <h2>Photo principale de votre produit</h2>
                  {picturePreview ? (
                    <div className="picture-preview">
                      <img src={picturePreview} alt="Preview" />
                      <button
                        type="button"
                        className="delete-btn-preview"
                        onClick={() => {
                          setPicturePreview(null);
                          setPicture(null);
                        }}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ) : (
                    <div
                      {...getMainRootProps()}
                      className={`dropzone-main ${
                        isMainDragActive ? "drag-active" : ""
                      }`}
                    >
                      <input {...getMainInputProps()} />
                      <label htmlFor="picture" className="label-picture">
                        +
                      </label>
                    </div>
                  )}
                </div>
                <div className="multiple-dropzone">
                  <h2>Vous pouvez ajouter 5 photos supplémentaire</h2>

                  <div
                    {...getMultipleRootProps()}
                    className={`dropzone-multiple ${
                      isMultipleDragActive ? "drag-active" : ""
                    }`}
                  >
                    <input {...getMultipleInputProps()} />
                    <div className="picture-preview-container">
                      <label
                        htmlFor="picturesAdd"
                        className="label-picture-multiple"
                      >
                        +
                      </label>
                    </div>
                  </div>
                  <div className="picture-preview-container">
                    {picturesAddPreview.map((preview, index) => (
                      <div key={index} className="picture-preview-multiple">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="delete-btn-preview"
                          onClick={() => {
                            setPicturesAddPreview(
                              picturesAddPreview.filter((_, i) => i !== index)
                            );
                            setPicturesAdd(
                              picturesAdd.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cards-publish">
                <div className="card-publish-title">
                  <label htmlFor="title" className="label-input-gen">
                    Titre
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="ex: Robe Zara verte"
                    value={title}
                    onChange={(event) => {
                      handleChange(event, setTitle);
                      clearFieldError("title");
                    }}
                    className={errors.title ? "input-error" : ""}
                    // required
                  />
                  {errors.title && (
                    <span className="error-message">{errors.title}</span>
                  )}
                </div>
                <div className="card-publish-desc">
                  {" "}
                  <label htmlFor="description" className="label-input-gen">
                    Décris ton article
                  </label>
                  <textarea
                    type="text"
                    name="description"
                    id="description"
                    placeholder="ex: Robe portée quelques fois, trés bonne état ..."
                    value={description}
                    onChange={(event) => {
                      handleChange(event, setDescription);
                      if (errors.description)
                        setErrors((prev) => ({ ...prev, description: "" }));
                    }}
                    className={errors.description ? "input-error" : ""}
                    rows="4"
                    maxLength="300"
                    // required
                  />
                  {errors.description && (
                    <span className="error-message">{errors.description}</span>
                  )}
                </div>
              </div>
              <div className="cards-publish">
                <div className="card-publish-product-details">
                  <div className="details-brand">
                    <label htmlFor="brand" className="label-input-gen">
                      Marque
                    </label>
                    <input
                      type="text"
                      name="brand"
                      id="brand"
                      placeholder="ex: Nike, Zara, H&M ..."
                      value={brand}
                      onChange={(event) => {
                        handleChange(event, setBrand);
                        if (errors.brand)
                          setErrors((prev) => ({ ...prev, brand: "" }));
                      }}
                      className={errors.brand ? "input-error" : ""}
                      // required
                    />
                    {errors.brand && (
                      <span className="error-message">{errors.brand}</span>
                    )}
                  </div>

                  <div className="details-size">
                    <label htmlFor="size" className="label-input-gen">
                      Taille
                    </label>
                    <input
                      type="text"
                      name="size"
                      id="size"
                      placeholder="ex: XL, 36, 40 ..."
                      value={size}
                      onChange={(event) => {
                        handleChange(event, setSize);
                        if (errors.size)
                          setErrors((prev) => ({ ...prev, size: "" }));
                      }}
                      className={errors.size ? "input-error" : ""}
                      // required
                    />
                    {errors.size && (
                      <span className="error-message">{errors.size}</span>
                    )}
                  </div>

                  <div className="details-color">
                    <label htmlFor="color" className="label-input-gen">
                      Couleur
                    </label>
                    <input
                      type="text"
                      name="color"
                      id="color"
                      placeholder="ex: Rouge, Noir, Bleu ..."
                      value={color}
                      onChange={(event) => {
                        handleChange(event, setColor);
                        if (errors.color)
                          setErrors((prev) => ({ ...prev, color: "" }));
                      }}
                      className={errors.color ? "input-error" : ""}
                      // required
                    />
                    {errors.color && (
                      <span className="error-message">{errors.color}</span>
                    )}
                  </div>

                  <div className="details-condition">
                    <label htmlFor="condition" className="label-input-gen">
                      État
                    </label>
                    <input
                      type="text"
                      name="condition"
                      id="condition"
                      placeholder="ex: Neuf avec étiquette ..."
                      value={condition}
                      onChange={(event) => {
                        handleChange(event, setCondition);
                        if (errors.condition)
                          setErrors((prev) => ({ ...prev, condition: "" }));
                      }}
                      className={errors.condition ? "input-error" : ""}
                      // required
                    />
                    {errors.condition && (
                      <span className="error-message">{errors.condition}</span>
                    )}
                  </div>

                  <div className="details-city">
                    <label htmlFor="city" className="label-input-gen">
                      Lieu
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      placeholder="ex: Paris, Lyon, Marseille ..."
                      value={city}
                      onChange={(event) => {
                        handleChange(event, setCity);
                        if (errors.city)
                          setErrors((prev) => ({ ...prev, city: "" }));
                      }}
                      className={errors.city ? "input-error" : ""}
                      // required
                    />
                    {errors.city && (
                      <span className="error-message">{errors.city}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="cards-publish">
                <div className="details-price">
                  <label htmlFor="price" className="label-input-gen">
                    Prix
                  </label>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    placeholder="ex: 0.00 €"
                    value={price}
                    onChange={(event) => {
                      handleChange(event, setPrice);
                      if (errors.price)
                        setErrors((prev) => ({ ...prev, price: "" }));
                    }}
                    className={errors.price ? "input-error" : ""}
                    // required
                  />
                  <span> €</span>
                  {errors.price && (
                    <span className="error-message">{errors.price}</span>
                  )}
                </div>
              </div>

              {/* Affichage des erreurs généralesbas page */}
              {errors.global && (
                <div className="error-message-global">⚠️ {errors.global}⚠️</div>
                // ⚠️ Alexis adore les warning alors on en met !!!!⚠️
              )}
              {errors.submit && (
                <div className="error-message-general">{errors.submit}</div>
              )}
              {errors.picture && (
                <div className="error-message-general">{errors.picture}</div>
              )}

              <div className="container-btn-add">
                <button className="btn-add" disabled={isSubmitting}>
                  {isSubmitting ? "Publication..." : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="main-content-disconected">
            <div className="block-top">
              <h1>Vous devez posséder un compte </h1>
              <Link to="/signup">
                <button>S'Incrire</button>s
              </Link>
              <h1>Ou vous connecter pour vendre</h1>
              <Link to="/login">
                <button>Se Connecter</button>
              </Link>
              <h2>sur</h2>
              <img src={vintedLogo} alt="Logo Vinted" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
export default Publish;

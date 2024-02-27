import React, { useState } from "react";
import { Container } from "react-bootstrap";

import "./IdentityValidation.css";

export const IdentityValidation = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [partyId, setPartyId] = useState("14855954");
  const [sessionKey, setSessionKey] = useState("DSKJFHSKD15165132165DSFSF15S32F1DS5");
  const [dni, setDni] = useState(24587759);
  const [imageName, setImageName] = useState("defaultImageName");

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).slice(0, 5); // Limitamos a seleccionar hasta 5 archivos
    setSelectedFiles(files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setThumbnails((prevThumbnails) => [...prevThumbnails, base64Image]);
      };
      reader.readAsDataURL(file);
    });

    // Mostrar las imágenes seleccionadas en la consola
    console.log("Imágenes seleccionadas:", files);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();

      const promises = selectedFiles.map(file => readFileAsBase64(file));

      Promise.all(promises)
        .then(base64Images => {
          base64Images.forEach((base64Image, index) => {
            formData.append(`base64Image${index + 1}`, base64Image);
          });

          formData.append("partyId", partyId);
          formData.append("sessionKey", sessionKey);
          formData.append("dni", dni);
          formData.append("imageName", imageName);

          return fetch("/api/v1/kyc", {
            method: "POST",
            body: formData,
          });
        })
        .then(response => {
          if (response.ok) {
            console.log("Archivos enviados con éxito a la API");
            // Aquí puedes realizar cualquier otra acción después de enviar los archivos
          } else {
            console.error("Error al enviar los archivos a la API:", response.statusText);
          }
        })
        .catch(error => {
          console.error("Error al enviar los archivos:", error.message);
        });
    } else {
      console.log("Debes seleccionar al menos un archivo.");
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };


  return (
    <Container fluid className="IdentityValidation">
      <div className="IdentityValidationContent">
        <div className="IdentityTitle">
          <h3>PRUEBA DE CARGA DE IMÁGENES</h3>
          <p>Selecciona hasta 5 archivos para realizar la prueba</p>
        </div>
        <div className="formLoginContain">
          <form>
            <input type="file" onChange={handleFileChange} multiple accept="image/*" />
          </form>
          <div className="thumbnails">
            {thumbnails.map((thumbnail, index) => (
              <img key={index} src={thumbnail} alt={`Thumbnail ${index}`} />
            ))}
          </div>
          <button onClick={handleSubmit}>Enviar Archivos</button>
        </div>
      </div>
    </Container>
  );
};


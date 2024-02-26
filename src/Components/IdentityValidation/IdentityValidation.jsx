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
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);

    const fileThumbnails = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setThumbnails((prevThumbnails) => [...prevThumbnails, reader.result]);
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`file${index + 1}`, file);
      });
      formData.append("partyId", partyId);
      formData.append("sessionKey", sessionKey);
      formData.append("dni", dni);
      formData.append("imageName", imageName);

      try {
        const response = await fetch("/api/v1/kyc", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Archivos enviados con éxito a la API");
          // Aquí puedes realizar cualquier otra acción después de enviar los archivos
        } else {
          console.error("Error al enviar los archivos a la API:", response.statusText);
        }
      } catch (error) {
        console.error("Error al enviar los archivos:", error.message);
      }
    } else {
      console.log("Debes seleccionar al menos un archivo.");
    }
  };

  return (
    <Container fluid className="IdentityValidation">
      <div className="IdentityValidationContent">
        <div className="IdentityTitle">
          <h3>PRUEBA DE CARGA DE IMÁGENES</h3>
          <p>Selecciona 5 archivos para realizar la prueba</p>
        </div>
        <div className="formLoginContain">
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} multiple />
            <div className="thumbnails">
              {thumbnails.map((thumbnail, index) => (
                <img
                  key={index}
                  src={thumbnail}
                  alt={`Thumbnail ${index}`}
                  className="thumbnail"
                />
              ))}
            </div>
            <button type="submit">Subir Archivos</button>
          </form>
        </div>
      </div>
    </Container>
  );
};

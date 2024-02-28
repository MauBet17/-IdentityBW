import React, { useState, useRef } from "react";
import { Container } from "react-bootstrap";

import "./IdentityValidation.css";

export const IdentityValidation = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [partyId, setPartyId] = useState("14855954");
  const [sessionKey, setSessionKey] = useState("DSKJFHSKD15165132165DSFSF15S32F1DS5");
  const [dni, setDni] = useState(24587759);
  const [imageName, setImageName] = useState("defaultImageName");
  const [sending, setSending] = useState(false);
  const stopRef = useRef(null);
  const [counter, setCounter] = useState(0); // Estado para el contador

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).slice(0, 50); // Limitamos a seleccionar hasta 5 archivos
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
    if (!sending && selectedFiles.length > 0) {
      setSending(true);
      selectedFiles.forEach(async (file) => {
        const formData = new FormData();
        const base64Image = await readFileAsBase64(file);
        formData.append('base64Image', base64Image);
        formData.append('partyId', partyId);
        formData.append('sessionKey', sessionKey);
        formData.append('dni', dni);
        formData.append('imageName', imageName);

        try {
          const response = await fetch("https://middlelayer-dev.betwarrior.com/api/v1/kyc", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.fromEntries(formData)), // Convertir FormData a objeto y luego a JSON
          });

          if (response.ok) {
            console.log(`Imagen ${file.name} enviada con éxito a la API`);
            setCounter((prevCounter) => prevCounter + 1);
            // Aquí puedes realizar cualquier otra acción después de enviar la imagen
          } else {
            console.error(`Error al enviar la imagen ${file.name} a la API:`, response.statusText);
          }
        } catch (error) {
          console.error(`Error al enviar la imagen ${file.name}:`, error.message);
        }
      });
      stopRef.current = setTimeout(() => {
        handleSubmit();
      }, 1000);
    } else {
      console.log("Debes seleccionar al menos un archivo o ya se está enviando la información.");
    }
  };

  const handleStop = () => {
    clearTimeout(stopRef.current);
    setSending(false);
    setThumbnails([]);
    setSelectedFiles([]);
    setCounter(0);
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
          <p>Selecciona hasta 50 archivos para realizar la prueba</p>
        </div>
        <div className="formLoginContain">
          <form>
            <label htmlFor="fileInput" className="custom-file-upload">Seleccionar archivos</label>
            <input type="file" id="fileInput" onChange={handleFileChange} multiple accept="image/*" />
          </form>
          <div className="thumbnails">
            {thumbnails.map((thumbnail, index) => (
              <img key={index} src={thumbnail} alt={`Thumbnail ${index}`} />
            ))}
          </div>
          <button className="enviar" onClick={handleSubmit}>Enviar</button>
          <button className="detener" onClick={handleStop}>Detener</button>

          <div className="counterBox">
            <p className="conteo">
              {counter}
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};



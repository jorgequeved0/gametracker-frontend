import { useState } from "react";
import './FormularioJuego.css';

function FormularioJuego({ onAgregarJuego }) {
  // Estado que almacena todos los datos del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    plataforma: '',
    genero: '',
    añoLanzamiento: '',
    desarrollador: '',
    imagenportada: '',
    descripcion: '',
    completado: false,
  });

  // Función que se ejecuta cada vez que se escribe en un input
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    
    // Actualizamos solo el campo que cambio
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, //Actualiza solo el campo modificado
    }));
  }

  // Función que se ejecuta al enviar el formulario
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Hacemos la petición POST al backend
      const respuesta = await fetch('/api/juegos', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData), 
      });

      if (!respuesta.ok) throw new Error('Error al guardar el juego');
      const data = await respuesta.json();

      // Limpiamos el formulario después de guardar exitosamente
      setFormData({
        titulo: '',
        plataforma: '',
        genero: '',
        añoLanzamiento: '',
        desarrollador: '',
        imagenportada: '',
        descripcion: '',
        completado: false,
      });
    } catch (error) {
      console.error(error);
      alert('Hubo un error al guardar el juego');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="h2_form">Crear nuevo juego</h2>
      <input id="comencemos" className="input_form"
        name="titulo" 
        value={formData.titulo} 
        onChange={handleChange} 
        placeholder="Nombre del juego" 
        required 
      />
      <input className="input_form"
        name="plataforma" 
        value={formData.plataforma} 
        onChange={handleChange} 
        placeholder="Plataforma: PC/Mac/Android/iOS/Consola" 
        required 
      />
      <input className="input_form"
        name="genero" 
        value={formData.genero} 
        onChange={handleChange} 
        placeholder="Género: MOBA/Shooter/Survival..." 
        required 
      />
      <input className="input_form"
        name="añoLanzamiento" 
        value={formData.añoLanzamiento} 
        onChange={handleChange} 
        placeholder="Año: 2009" 
        required 
      />
      <input className="input_form"
        name="desarrollador" 
        value={formData.desarrollador} 
        onChange={handleChange} 
        placeholder="Desarrollador: RiotGames/EpicGames/Nintendo..." 
        required 
      />
      <input className="input_form"
        name="imagenportada" 
        value={formData.imagenportada} 
        onChange={handleChange} 
        placeholder="URL de imagen de portada (opcional)" 
      />
      <input 
        name="descripcion" className="input_form"
        value={formData.descripcion} 
        onChange={handleChange} 
        placeholder="Descripción corta del juego (opcional)" 
      />
      <label>
        Juego Completado?
        <input className="input_checkbox_form"
          name="completado" 
          type="checkbox" 
          checked={formData.completado} 
          onChange={handleChange} 
        />
      </label>
      <button type="submit">Agregar juego</button>
    </form>
  );
}

export default FormularioJuego;
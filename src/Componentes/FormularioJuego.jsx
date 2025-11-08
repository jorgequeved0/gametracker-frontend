import { useState } from "react";
import './FormularioJuego.css';

function FormularioJuego({ onAgregarJuego }) {
  // ESTADOS
  const [formData, setFormData] = useState({
    titulo: '',
    plataforma: '',
    genero: '',
    añoLanzamiento: '',
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    completado: false,
  });

  // Estado para manejar la carga y mensajes
  const [cargando,setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' }) // success o error

  // Funcion que maneja los cambios en los inputs
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Limpia el mensaje cuando el usuario empieza a escribir
    if (mensaje.texto) {
      setMensaje({ texto: '', tipo: '' });
    }
  }

  // Limpia el formulario
  function LimpiarFormulario() {
    setFormData({
      titulo: '',
      plataforma: '',
      genero: '',
      añoLanzamiento: '',
      desarrollador: '',
      imagenPortada: '',
      descripcion: '',
      completado: false,
    });
  }

  // Muestra un mensaje temporal
  function mostrarMensaje(texto, tipo) {
    setMensaje({ texto, tipo });

    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 4000);
  }

  // Función que maneja el envío del formulario
  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);

    try {
      console.log('Enviando datos:', formData);

      const respuesta = await fetch('/api/juegos', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData), 
      });

      console.log('Respuesta del servidor:', {
        status: respuesta.status,
        ok: respuesta.ok,
        statusText: respuesta.statusText,
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({ error: 'Error desconocido'}));
        throw new Error(errorData.error || `Error del servidor (${respuesta.status})`);
      }

      const juegoGuardado = await respuesta.json();
      console.log('Datos recibidos:', juegoGuardado);

      //Modifica al componente padre sobre el nuevo juego
      if (onAgregarJuego) {
        onAgregarJuego(juegoGuardado);
      }
      mostrarMensaje('¡Juego agregado exitosamente!', 'success');
      LimpiarFormulario();

    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('Error al guardar el juego. Inténtalo de nuevo.', 'error');
    } finally {
      setCargando(false); // Desactiva el estado de carga
    }
  }

  return (
    <form id="form" className="formulario-juego" onSubmit={handleSubmit}>
      <h2 className="h2_form">Agregar Nuevo Juego</h2>
      {mensaje.texto && (
        <div className={`mensaje mensaje-${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}
      
      <div className="form-grupo">
        <input 
          id="comencemos"
          className="input_form"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Nombre del juego *"
          required
          disabled={cargando} 
        />
      </div>

      <div className="form-grupo">
        <input 
          className="input_form"
          name="plataforma"
          value={formData.plataforma}
          onChange={handleChange}
          placeholder="Plataforma (PC, PS5, XBOX, Switch...) *"
          required
          disabled={cargando}
        />
      </div>

      <div className="form-grupo">
        <input 
        type="text"
        className="input_form"
        name="genero"
        value={formData.genero}
        onChange={handleChange}
        placeholder="Género (MOBA, RPG, Shooter...) *"
        required
        disabled={cargando} 
        />
      </div>

      <div className="form-grupo">
        <input 
        className="input_form"
        type="number"
        name="añoLanzamiento"
        value={formData.añoLanzamiento}
        onChange={handleChange}
        placeholder="Año de Lanzamiento (2024) *"
        min={1970}
        max={new Date().getFullYear() + 1}
        required
        disabled={cargando}
        />
      </div>
        <input 
        className="input_form"
        name="desarrollador"
        value={formData.desarrollador}
        onChange={handleChange}
        placeholder="Desarrollador (Epic Games, Nintendo...) *" 
        required
        disabled={cargando}
        />
      <div className="form-grupo">
        <input 
          className="input_form"
          name="imagenPortada"
          value={formData.imagenPortada}
          onChange={handleChange}
          placeholder="URL de imagen de portada"
          disabled={cargando}
        />
        {formData.imagenPortada && (
          <div className="preview-imagen">
            <img 
            src={formData.imagenPortada} 
            alt="Vista Previa" 
            onError={(e) => {
              e.target.style.display = 'block';
              e.target.nextSibling.style.display = 'block';
            }}
            />
            <span className="error-imagen" style={{ display: 'none' }}>
              ⚠️ URL de imagen inválida
            </span>
          </div>
        )}
      </div>

      <div className="form-grupo">
        <textarea 
          className="input_form textarea-form"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción breve del juego"
          rows="3"
          disabled={cargando}
        />
      </div>
      
      <label className="checkbox-label">
        <input 
          className="input_checkbox_form"
          name="completado"
          type="checkbox"
          checked={formData.completado}
          onChange={handleChange}
          disabled={cargando}
        />
        <span>¿Lo completaste?</span>
      </label>

      {/* Botón de envío */}
      <button type="submit" className="btn-submit" disabled={cargando}>
        {cargando ? (
          <>
            <span className="circulo"></span>
            Guardando...
          </>
        ) : (
          'Agregar Juego'
        )}
      </button>

      <p className="form-nota">* Campos Obligatorios</p>
    </form>
  );
}

export default FormularioJuego;
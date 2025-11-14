import { useState, useEffect } from 'react';
import './ModalEditarJuego.css';

function ModalEditarJuego({ juego, onCerrar, onActualizar }) {
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

    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    // Cargar datos del juego al abrir el modal
    useEffect(() => {
        if (juego) {
            setFormData({
                titulo: juego.titulo || '',
                plataforma: juego.plataforma || '',
                genero: juego.genero || '',
                añoLanzamiento: juego.añoLanzamiento || '',
                desarrollador: juego.desarrollador || '',
                imagenPortada: juego.imagenPortada || '',
                descripcion: juego.descripcion || '',
                completado: juego.completado || false,
            });
        }
    }, [juego]);

    // Bloquear scroll del body
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        const cerrarConEsc = (e) => {
            if (e.key === 'Escape') onCerrar();
        };
        
        document.addEventListener('keydown', cerrarConEsc);
        
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', cerrarConEsc);
        };
    }, [onCerrar]);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (mensaje.texto) {
            setMensaje({ texto: '', tipo: '' });
        }
    }

    function mostrarMensaje(texto, tipo) {
        setMensaje({ texto, tipo });
        setTimeout(() => {
            setMensaje({ texto: '', tipo: '' });
        }, 4000);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setCargando(true);

        try {
            const respuesta = await fetch(`/api/juegos/${juego._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al actualizar el juego');
            }

            const juegoActualizado = await respuesta.json();
            
            mostrarMensaje('¡Juego actualizado exitosamente!', 'success');
            
            // Notificar al padre y cerrar después de 1 segundo
            if (onActualizar) {
                onActualizar(juegoActualizado);
            }
            
            setTimeout(() => {
                onCerrar();
            }, 1000);

        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al actualizar el juego. Inténtalo de nuevo.', 'error');
        } finally {
            setCargando(false);
        }
    }

    // Click en el overlay para cerrar
    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) {
            onCerrar();
        }
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-contenido">
                <button 
                    className="modal-btn-cerrar" 
                    onClick={onCerrar}
                    aria-label="Cerrar modal"
                    type="button"
                >
                    ✕
                </button>

                <h2 className="modal-titulo">Editar Juego</h2>

                {mensaje.texto && (
                    <div className={`mensaje mensaje-${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-formulario">
                    <div className="form-grupo">
                        <label htmlFor="titulo">Título *</label>
                        <input
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Nombre del juego"
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-grupo">
                        <label htmlFor="plataforma">Plataforma *</label>
                        <input
                            id="plataforma"
                            name="plataforma"
                            value={formData.plataforma}
                            onChange={handleChange}
                            placeholder="PC, PS5, Xbox..."
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-grupo">
                        <label htmlFor="genero">Género *</label>
                        <input
                            id="genero"
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            placeholder="RPG, FPS, MOBA..."
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-grupo">
                        <label htmlFor="añoLanzamiento">Año de Lanzamiento *</label>
                        <input
                            id="añoLanzamiento"
                            type="number"
                            name="añoLanzamiento"
                            value={formData.añoLanzamiento}
                            onChange={handleChange}
                            placeholder="2024"
                            min={1970}
                            max={new Date().getFullYear() + 1}
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-grupo">
                        <label htmlFor="desarrollador">Desarrollador *</label>
                        <input
                            id="desarrollador"
                            name="desarrollador"
                            value={formData.desarrollador}
                            onChange={handleChange}
                            placeholder="Epic Games, Nintendo..."
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-grupo">
                        <label htmlFor="imagenPortada">URL de Imagen</label>
                        <input
                            id="imagenPortada"
                            name="imagenPortada"
                            value={formData.imagenPortada}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            disabled={cargando}
                        />
                        {formData.imagenPortada && (
                            <div className="preview-imagen-modal">
                                <img
                                    src={formData.imagenPortada}
                                    alt="Vista previa"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
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
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción breve del juego"
                            rows="3"
                            disabled={cargando}
                        />
                    </div>

                    <label className="checkbox-label-modal">
                        <input
                            type="checkbox"
                            name="completado"
                            checked={formData.completado}
                            onChange={handleChange}
                            disabled={cargando}
                        />
                        <span>¿Lo completaste?</span>
                    </label>

                    <div className="modal-botones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={onCerrar}
                            disabled={cargando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-guardar"
                            disabled={cargando}
                        >
                            {cargando ? (
                                <>
                                    <span className="circulo"></span>
                                    Guardando...
                                </>
                            ) : (
                                '💾 Guardar Cambios'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalEditarJuego;
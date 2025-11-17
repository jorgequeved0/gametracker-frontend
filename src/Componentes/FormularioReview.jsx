import { useState } from "react";
import { useEffect } from "react";
import './FormularioReview.css';
import Estrellas from "./Estrellas";

function FormularioReview({ juegoId, review, onCerrar, onGuardar }) {
    const [formData, setFormData] = useState({
        puntuacion: 3,
        textoReseña: '',
        horasJugadas: '',
        dificultad: 'Normal',
        recomendaria: true,
    });

    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState({texto: '', tipo: ''});

    //Si se está editando, cargar datos existentes
    useEffect(() => {
        if (review) {
            setFormData({
                puntuacion: review.puntuacion || 3,
                textoReseña: review.textoReseña || '',
                horasJugadas: review.horasJugadas || '',
                dificultad: review.dificultad || 'Normal',
                recomendaria: review.recomendaria !== undefined ? review.recomendaria : true
            });
        }
    }, [review]);

    // Bloquear Scroll
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
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev, [name]: type === 'checkbox' ? checked : value
        }));

        if (mensaje.texto) {
            setMensaje({texto: '', tipo: ''});
        }
    }

    function mostrarMensaje(texto, tipo) {
        setMensaje({texto, tipo});
        setTimeout(() => {
            setMensaje({texto: '', tipo: ''});
        }, 3000);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setGuardando(true);

        try {
            const url = review ? `/api/reviews/${review._id}` : `/api/reviews`;

            const method = review ? 'PUT' : 'POST';

            const dataToSend = {...formData, juegoId: juegoId, horasJugadas: formData.horasJugadas ? parseInt(formData.horasJugadas) : 0, fechaActualizacion: review ? new Date() : undefined};

            const respuesta = await fetch(url, {method, headers: {'Content-Type': `application/json`}, body: JSON.stringify(dataToSend)});

            if (!respuesta.ok) {
                const errorData = await respuesta.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al guardar la reseña');
            }

            const reviewGuardada = await respuesta.json();

            mostrarMensaje(review ? 'Reseña actualizada' : 'Reseña agregada', 'success');

            if (onGuardar) {
                onGuardar(reviewGuardada);
            }

            setTimeout(() => {
                onCerrar();
            }, 1000);

        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al guardar la reseña. Inténtalo de nuevo.', 'error');
        } finally {
            setGuardando(false);
        }
    }

    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) {
            onCerrar();
        }
    }

    return (
        <div className="review-overlay" onClick={handleOverlayClick}>
            <div className="review-modal">
                <button className="review-btn-cerrar" onClick={onCerrar}></button>
                <h3 className="review-titulo">
                    {review ? 'Editar Reseña' : 'Agregar Reseña'}
                </h3>

                {mensaje.texto && (
                    <div className={`review-mensaje review-mensaje-${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                <form className="review-form" onSubmit={handleSubmit}>
                    {/* Puntuacion */}
                    <div className="review-grupo">
                        <label>Puntuación *</label>
                        <Estrellas puntuacion={formData.puntuacion} onChange={(valor) => setFormData(prev => ({...prev, puntuacion: valor }))} tamaño="large"/>
                        <span className="review-puntuacion-texto">
                            {formData.puntuacion} de 5 estrellas
                        </span>
                    </div>

                    {/* Texto de la reseña */}
                    <div className="review-grupo">
                        <label htmlFor="textoReseña">Tu Reseña</label>
                        <textarea name="textoReseña" id="textoReseña" value={formData.textoReseña} onChange={handleChange} placeholder="¿Qué te pareció este juego? Comparte tu experiencia..." rows="5" disabled={guardando}></textarea>
                        </div>

                    {/*Horas jugadas */}
                    <div className="review-grupo">
                        <label htmlFor="horasJugadas">Horas Jugadas</label>
                        <input type="number" id="horasJugadas" name="horasJugadas" value={formData.horasJugadas} onChange={handleChange} placeholder="Ej: 50" min="0" disabled={guardando}/>
                    </div>

                    {/*Dificultad */}
                    <div className="review-grupo">
                        <label htmlFor="dificultad">Dificultad *</label>
                        <select name="dificultad" id="dificultad" value={formData.dificultad} onChange={handleChange} required disabled={guardando}>
                            <option value="Fácil">Fácil</option>
                            <option value="Normal">Normal</option>
                            <option value="Difícil">Difícil</option>
                        </select>
                    </div>

                    {/*Recomendar */}
                    <label className="review-checkbox-label">
                        <input type="checkbox" name="recomendaria" checked={formData.recomendaria} onChange={handleChange} disabled={guardando}/>
                        <span>¿Recomendarías este juego?</span>
                    </label>

                    {/* Botones */}
                    <div className="review-botones">
                        <button className="review-btn-cancelar" type="button" onClick={onCerrar} disabled={guardando}>Cancelar</button>
                        <button className="review-btn-guardar" type="submit" disabled={guardando}>
                            {guardando ? (
                                <>
                                    <span className="review-spinner"></span>
                                    Guardando...
                                </>
                            ) : (
                                review ? 'Actualizar' : 'Guardar Reseña'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormularioReview;
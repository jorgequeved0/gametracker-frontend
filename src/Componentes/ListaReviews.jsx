import { useState } from 'react';
import { useEffect } from 'react';
import Estrellas from './Estrellas';
import FormularioReview from './FormularioReview';
import './ListaReviews.css';

function ListaReviews({ juegoId }) {
    const [reviews, setReviews] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [reviewAEditar, setReviewAEditar] = useState(null);

    useEffect(() => {
        cargarReviews();
    }, [juegoId]);

    async function cargarReviews() {
        try {
            setCargando(true);
            const respuesta = await fetch('/api/reviews');
            
            if (!respuesta.ok) {
                throw new Error('Error al cargar reviews');
            }

            const todasLasReviews = await respuesta.json();
            // Filtrar solo las reviews de este juego
            const reviewsDelJuego = todasLasReviews.filter(r => r.juegoId === juegoId);
            setReviews(reviewsDelJuego);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setCargando(false);
        }
    }

    function handleAgregarReview() {
        setReviewAEditar(null);
        setFormularioAbierto(true);
    }

    function handleEditarReview(review) {
        setReviewAEditar(review);
        setFormularioAbierto(true);
    }

    async function handleEliminarReview(reviewId) {
        if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) {
            return;
        }

        try {
            const respuesta = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE'
            });

            if (!respuesta.ok) {
                throw new Error('Error al eliminar review');
            }

            setReviews(prev => prev.filter(r => r._id !== reviewId));
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo eliminar la reseña');
        }
    }

    function handleGuardarReview(reviewGuardada) {
        if (reviewAEditar) {
            // Actualizar
            setReviews(prev => prev.map(r => 
                r._id === reviewGuardada._id ? reviewGuardada : r
            ));
        } else {
            // Agregar nueva
            setReviews(prev => [reviewGuardada, ...prev]);
        }
    }

    if (cargando) {
        return (
            <div className="reviews-cargando">
                <div className="reviews-spinner"></div>
                <p>Cargando reseñas...</p>
            </div>
        );
    }

    return (
        <div className="reviews-contenedor">
            <div className="reviews-header">
                <h4>Reseñas ({reviews.length})</h4>
                <button 
                    type="button"
                    className="btn-agregar-review"
                    onClick={handleAgregarReview}
                >
                    + Agregar Reseña
                </button>
            </div>

            {reviews.length === 0 ? (
                <div className="reviews-vacio">
                    <p>No hay reseñas aún. ¡Sé el primero en agregar una!</p>
                </div>
            ) : (
                <div className="reviews-lista">
                    {reviews.map(review => (
                        <div key={review._id} className="review-card">
                            <div className="review-card-header">
                                <Estrellas 
                                    puntuacion={review.puntuacion} 
                                    soloLectura 
                                    tamaño="small"
                                />
                                <div className="review-acciones">
                                    <button 
                                        className="review-btn-editar"
                                        onClick={() => handleEditarReview(review)}
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        className="review-btn-eliminar"
                                        onClick={() => handleEliminarReview(review._id)}
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {review.textoReseña && (
                                <p className="review-texto">{review.textoReseña}</p>
                            )}

                            <div className="review-detalles">
                                {review.horasJugadas > 0 && (
                                    <span className="review-detalle">
                                        {review.horasJugadas}h jugadas
                                    </span>
                                )}
                                <span className="review-detalle">
                                    {review.dificultad}
                                </span>
                                {review.recomendaria && (
                                    <span className="review-detalle recomendado">
                                        Recomendado
                                    </span>
                                )}
                            </div>

                            <div className="review-fecha">
                                {new Date(review.fechaCreacion).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal del formulario */}
            {formularioAbierto && (
                <FormularioReview
                    juegoId={juegoId}
                    review={reviewAEditar}
                    onCerrar={() => setFormularioAbierto(false)}
                    onGuardar={handleGuardarReview}
                />
            )}
        </div>
    );
}

export default ListaReviews;
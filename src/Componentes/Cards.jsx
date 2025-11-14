import { useState, useEffect } from "react";
import './Cards.css';
import ModalEditarJuego from './ModalEditarJuego';

function Cards({ juegos, onEliminar, onActualizar }) {
    const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    const [juegoAEditar, setJuegoAEditar] = useState(null);

    // Bloquear Scroll cuando el overlay esta abierto
    useEffect(() => {
        if (juegoSeleccionado) {
            document.body.style.overflow = 'hidden';

            // Cerrar con tecla esc
            const cerrarEsc = (e) => {
                if (e.key === 'Escape') {
                    cerrarOverlay();
                }
            };

            document.addEventListener('keydown', cerrarEsc);
            return () => {
                document.body.style.overflow = 'unset';
                document.removeEventListener('keydown', cerrarEsc);
            };
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [juegoSeleccionado]);
    
    const abrirOverlay = (juego) => {
        setJuegoSeleccionado(juego);
    };

    const cerrarOverlay = () => {
        setJuegoSeleccionado(null);
    };

    // Función para eliminar juego
    const juegoEliminar = async (idJuego) => {
        // Confirmación antes de eliminar
        if (!window.confirm('¿Estás seguro de que deseas eliminar este juego?')) {
            return;
        }

        setEliminando(true);

        try {
            const respuesta = await fetch(`/api/juegos/${idJuego}`, {
                method: 'DELETE',
            });

            if (!respuesta.ok) {
                throw new Error('Error al eliminar el juego');
            }

            // Notificar al componente padre
            if (onEliminar) {
                onEliminar(idJuego);
            }

            cerrarOverlay();

        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo eliminar el juego. Inténtalo de nuevo.');
        } finally {
            setEliminando(false);
        }
    };

    if (!juegos || juegos.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>
                <p>No hay juegos disponibles. ¡Agrega tu primer juego!</p>
            </div>
        );
    }

    return (
        <div id="lista_juegos" className="cards">
            <div className="contenedor_juegos">
                {juegos.map((juego) => (
                    <div className="card_juegos" key={juego._id} onClick={() => abrirOverlay(juego)}>
                        <img 
                            className="portada-juego" 
                            src={juego.imagenPortada || '/placeholder.jpg'} 
                            alt={`Portada de ${juego.titulo}`}
                        />
                        <div className="elementos-card">
                            <h3>{juego.titulo}</h3>
                            <p>Plataforma: {juego.plataforma}</p>
                            <p>Género: {juego.genero}</p>
                            <p>Año: {juego.añoLanzamiento}</p>
                            <p>Desarrollador: {juego.desarrollador}</p>
                            {juego.completado && <p style={{ color: '#4caf50' }}>✓ Completado</p>}
                        </div>
                    </div>
                ))}
            </div>

            {juegoSeleccionado && (
                <div className="vista-superpuesta">
                    <div className="contenido-superpuesto">
                        <button onClick={cerrarOverlay} className="btn-cerrar" aria-label="Cerrar">
                            ✕
                        </button>
                        
                        <img 
                            src={juegoSeleccionado.imagenPortada || '/placeholder.jpg'} 
                            alt={`Portada de ${juegoSeleccionado.titulo}`} 
                            style={{ borderRadius: "10px", marginBottom: "10px", width: "100%", objectFit: "cover" }} 
                        />
                        
                        <h3>{juegoSeleccionado.titulo}</h3>
                        <p><strong>Plataforma:</strong> {juegoSeleccionado.plataforma}</p>
                        <p><strong>Género:</strong> {juegoSeleccionado.genero}</p>
                        <p><strong>Año de Lanzamiento:</strong> {juegoSeleccionado.añoLanzamiento}</p>
                        <p><strong>Desarrollador:</strong> {juegoSeleccionado.desarrollador}</p>
                        {juegoSeleccionado.descripcion && (
                            <p><strong>Descripción:</strong> {juegoSeleccionado.descripcion}</p>
                        )}
                        <p><strong>Completado:</strong> {juegoSeleccionado.completado ? 'Sí' : 'No'}</p>
                        
                        <div className="botones-acciones">
                            <button 
                                className="btn-editar" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setJuegoAEditar(juegoSeleccionado);
                                }} 
                                disabled={eliminando}
                            >
                                ✏️ Editar
                            </button>
                            
                            <button 
                                className="btn-eliminar" 
                                onClick={() => juegoEliminar(juegoSeleccionado._id)} 
                                disabled={eliminando}
                            >
                                {eliminando ? 'Eliminando...' : '🗑️ Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de edición */}
            {juegoAEditar && (
                <ModalEditarJuego
                    juego={juegoAEditar}
                    onCerrar={() => {
                        setJuegoAEditar(null);
                        cerrarOverlay();
                    }}
                    onActualizar={onActualizar}
                />
            )}
        </div>
    );
}

export default Cards;
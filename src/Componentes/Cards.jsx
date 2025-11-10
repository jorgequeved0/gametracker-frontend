import { useState } from "react";
import { useEffect } from "react";
import './Cards.css';

function Cards() {
    const [juegos, setJuegos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);

    useEffect(() => {
        const obtenerJuegos = async() => {
            try {
                const respuesta = await fetch('/api/juegos');
                const datos = await respuesta.json();
                setJuegos(datos);
                setLoading(false);
            } catch(error) {
                setError('Error al cargar los juegos');
                setLoading(false);
            }
        };

        obtenerJuegos();
    }, []);

    const abrirOverlay = (juego) => {
        setJuegoSeleccionado(juego);
    };
    const cerrarOverlay = () => {
        setJuegoSeleccionado(null);
    }
    if (loading) return <p>Cargando juegos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div id="lista_juegos" className="cards">
            
            {juegos.length === 0 ? (<p>No hay juegos disponibles.</p>) : (
                <div className="contenedor_juegos">
                    {juegos.map((juego) => (
                        <div className="card_juegos" key={juego._id} onClick={() => abrirOverlay(juego)}>
                            <div className="elementos-card">
                                <img className="portada-juego" src={juego.imagenPortada} alt={`Portada del videojuego ${juego.titulo} (${juego.plataforma})`}/>
                                <h3>{juego.titulo}</h3>
                                <p>Plataforma: {juego.plataforma}</p>
                                <p>Género: {juego.genero}</p>
                                <p>Año: {juego.añoLanzamiento}</p>
                                <p>Desarrollador: {juego.desarrollador}</p>
                                <p>Descripción: {juego.descripcion}</p>
                                <p>Completado: {juego.completado ? 'Sí' : 'No'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {juegoSeleccionado && (
                <div className="vista-superpuesta" onClick={cerrarOverlay}>
                    <div className="contenido-superpuesto" onClick={(e) => e.stopPropagation()}>
                        <button onClick={cerrarOverlay}>x</button>
                        <h3>{juegoSeleccionado.titulo}</h3>
                        <img src={juegoSeleccionado.imagenPortada} alt={`Portada del videojuego ${juegoSeleccionado.titulo}`} style={{borderRadius: "10px", marginBottom: "10px"}} />
                        <p><strong>Plataforma:</strong> {juegoSeleccionado.plataforma}</p>
                        <p><strong>Género:</strong> {juegoSeleccionado.genero}</p>
                        <p><strong>Año de Lanzamiento</strong> {juegoSeleccionado.añoLanzamiento}</p>
                        <p><strong>Desarrollador:</strong> {juegoSeleccionado.desarrollador}</p>
                        <p><strong>Descripción:</strong> {juegoSeleccionado.descripcion}</p>
                        <p><strong>Completado:</strong> {juegoSeleccionado.completado ? 'Si' : 'No'}</p>
                        
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cards;
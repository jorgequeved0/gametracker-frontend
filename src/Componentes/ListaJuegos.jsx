import { useState } from "react";
import { useEffect } from "react";
import './ListaJuegos.css';

function ListaJuegos() {
    const [juegos, setJuegos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    
    if (loading) return <p>Cargando juegos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div id="lista_juegos" className="cards">
            <h2 className="h2_lista">Lista de Juegos</h2>
            
            {juegos.length === 0 ? (<p>No hay juegos disponibles.</p>) : (
                <ul className="ul_juegos">
                    {juegos.map((juego) => (
                        <li className="li_juegos" key={juego._id}>
                            <h3>{juego.titulo}</h3>
                            <p>Plataforma: {juego.plataforma}</p>
                            <p>Género: {juego.genero}</p>
                            <p>Año: {juego.añoLanzamiento}</p>
                            <p>Desarrollador: {juego.desarrollador}</p>
                            <p>Descripción: {juego.descripcion}</p>
                            <p>Completado: {juego.completado ? 'Sí' : 'No'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListaJuegos;
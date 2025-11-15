import { useState, useEffect } from "react";
import './ListaJuegos.css';
import Cards from "./Cards";
import FiltrosBusqueda from "./FiltrosBusqueda";

function ListaJuegos({ juegos, onActualizar, onEliminar }) {
    const [juegosFiltrados, setJuegosFiltrados] = useState([]);

    // Inicializar juegos filtrados cuando cambien los juegos originales
    useEffect(() => {
        console.log('Juegos actualizados:', juegos?.length); // Debug
        setJuegosFiltrados(juegos || []);
    }, [juegos]);

    // Esta función se ejecuta cuando los filtros cambian
    function handleFiltrar(juegosResultado) {
        console.log('Filtros aplicados, resultados:', juegosResultado?.length); // Debug
        setJuegosFiltrados(juegosResultado || []);
    }

    return (
        <div id="lista_juegos" className="contenedor-lista-juegos">
            <h2 className="h2_lista">Lista de Juegos</h2>
            
            {/* Componente de filtros */}
            {juegos && juegos.length > 0 && (
                <>
                    <FiltrosBusqueda 
                        juegos={juegos} 
                        onFiltrar={handleFiltrar}
                    />
                    
                    {/* Contador de resultados */}
                    <div className="contador-resultados">
                        <p>
                            {juegosFiltrados.length === juegos.length ? (
                                <span>Mostrando <strong>{juegos.length}</strong> {juegos.length === 1 ? 'juego' : 'juegos'}</span>
                            ) : (
                                <span>
                                    Mostrando <strong>{juegosFiltrados.length}</strong> de <strong>{juegos.length}</strong> {juegos.length === 1 ? 'juego' : 'juegos'}
                                </span>
                            )}
                        </p>
                    </div>
                </>
            )}
            
            {/* Lista de juegos filtrados */}
            <Cards 
                juegos={juegosFiltrados} 
                onEliminar={onEliminar}
                onActualizar={onActualizar}
            />
        </div>
    );
}

export default ListaJuegos;
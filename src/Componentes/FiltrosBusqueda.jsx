import { useState, useEffect } from 'react';
import './FiltrosBusqueda.css';

function FiltrosBusqueda({ juegos, onFiltrar }) {
    const [filtros, setFiltros] = useState({
        busqueda: '',
        plataforma: 'todas',
        genero: 'todos',
        completado: 'todos'
    });

    const [plataformas, setPlataformas] = useState([]);
    const [generos, setGeneros] = useState([]);

    // Extraer plataformas y géneros únicos de los juegos
    useEffect(() => {
        if (juegos && juegos.length > 0) {
            const plataformasUnicas = [...new Set(juegos.map(j => j.plataforma))].sort();
            const generosUnicos = [...new Set(juegos.map(j => j.genero))].sort();
            
            setPlataformas(plataformasUnicas);
            setGeneros(generosUnicos);
        }
    }, [juegos]);

    // Aplicar filtros cada vez que cambien
    useEffect(() => {
        console.log('Aplicando filtros...', filtros); // Debug
        aplicarFiltros();
    }, [filtros, juegos]);

    function aplicarFiltros() {
        if (!juegos || juegos.length === 0) {
            console.log('No hay juegos para filtrar'); // Debug
            onFiltrar([]);
            return;
        }

        let juegosFiltrados = [...juegos];
        console.log('Juegos iniciales:', juegosFiltrados.length); // Debug

        // Filtro de búsqueda por título
        if (filtros.busqueda.trim() !== '') {
            const busquedaLower = filtros.busqueda.toLowerCase();
            juegosFiltrados = juegosFiltrados.filter(juego =>
                juego.titulo.toLowerCase().includes(busquedaLower) ||
                juego.desarrollador.toLowerCase().includes(busquedaLower)
            );
        }

        // Filtro por plataforma
        if (filtros.plataforma !== 'todas') {
            juegosFiltrados = juegosFiltrados.filter(
                juego => juego.plataforma === filtros.plataforma
            );
        }

        // Filtro por género
        if (filtros.genero !== 'todos') {
            juegosFiltrados = juegosFiltrados.filter(
                juego => juego.genero === filtros.genero
            );
        }

        // Filtro por estado completado
        if (filtros.completado !== 'todos') {
            const estaCompletado = filtros.completado === 'completados';
            juegosFiltrados = juegosFiltrados.filter(
                juego => juego.completado === estaCompletado
            );
        }

        onFiltrar(juegosFiltrados);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function limpiarFiltros() {
        setFiltros({
            busqueda: '',
            plataforma: 'todas',
            genero: 'todos',
            completado: 'todos'
        });
    }

    const hayFiltrosActivos = 
        filtros.busqueda !== '' ||
        filtros.plataforma !== 'todas' ||
        filtros.genero !== 'todos' ||
        filtros.completado !== 'todos';

    return (
        <div className="filtros-contenedor">
            <div className="filtros-header">
                <h3 className="filtros-titulo">Buscar y Filtrar</h3>
                {hayFiltrosActivos && (
                    <button 
                        className="btn-limpiar-filtros"
                        onClick={limpiarFiltros}
                        title="Limpiar todos los filtros"
                    >
                        ✕ Limpiar
                    </button>
                )}
            </div>

            <div className="filtros-grid">
                {/* Barra de búsqueda */}
                <div className="filtro-grupo busqueda-grupo">
                    <label htmlFor="busqueda">
                        <span className="icono-busqueda">🔎</span>
                        Buscar
                    </label>
                    <input
                        id="busqueda"
                        type="text"
                        name="busqueda"
                        value={filtros.busqueda}
                        onChange={handleChange}
                        placeholder="Buscar por título o desarrollador..."
                        className="input-busqueda"
                    />
                </div>

                {/* Filtro de plataforma */}
                <div className="filtro-grupo">
                    <label htmlFor="plataforma">
                        Plataforma
                    </label>
                    <select
                        id="plataforma"
                        name="plataforma"
                        value={filtros.plataforma}
                        onChange={handleChange}
                        className="select-filtro"
                    >
                        <option value="todas">Todas las plataformas</option>
                        {plataformas.map(plataforma => (
                            <option key={plataforma} value={plataforma}>
                                {plataforma}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro de género */}
                <div className="filtro-grupo">
                    <label htmlFor="genero">
                        Género
                    </label>
                    <select
                        id="genero"
                        name="genero"
                        value={filtros.genero}
                        onChange={handleChange}
                        className="select-filtro"
                    >
                        <option value="todos">Todos los géneros</option>
                        {generos.map(genero => (
                            <option key={genero} value={genero}>
                                {genero}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro de completado */}
                <div className="filtro-grupo">
                    <label htmlFor="completado">
                        Estado
                    </label>
                    <select
                        id="completado"
                        name="completado"
                        value={filtros.completado}
                        onChange={handleChange}
                        className="select-filtro"
                    >
                        <option value="todos">Todos</option>
                        <option value="completados">Completados</option>
                        <option value="pendientes">Pendientes</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default FiltrosBusqueda;
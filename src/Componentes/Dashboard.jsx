import { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ juegos, onCerrar }) {
    const [estadisticas, setEstadisticas] = useState({
        total: 0,
        completados: 0,
        pendientes: 0,
        porcentajeCompletado: 0,
        plataformas: {},
        generos: {},
        añoMasReciente: null,
        añoMasAntiguo: null
    });

    // Bloquear scroll cuando el dashboard está abierto
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

    useEffect(() => {
        calcularEstadisticas();
    }, [juegos]);

    function calcularEstadisticas() {
        if (!juegos || juegos.length === 0) {
            setEstadisticas({
                total: 0,
                completados: 0,
                pendientes: 0,
                porcentajeCompletado: 0,
                plataformas: {},
                generos: {},
                añoMasReciente: null,
                añoMasAntiguo: null
            });
            return;
        }

        const total = juegos.length;
        const completados = juegos.filter(j => j.completado).length;
        const pendientes = total - completados;
        const porcentajeCompletado = total > 0 ? Math.round((completados / total) * 100) : 0;

        // Contar por plataforma
        const plataformas = {};
        juegos.forEach(juego => {
            plataformas[juego.plataforma] = (plataformas[juego.plataforma] || 0) + 1;
        });

        // Contar por género
        const generos = {};
        juegos.forEach(juego => {
            generos[juego.genero] = (generos[juego.genero] || 0) + 1;
        });

        // Encontrar años extremos
        const años = juegos.map(j => parseInt(j.añoLanzamiento)).filter(a => !isNaN(a));
        const añoMasReciente = años.length > 0 ? Math.max(...años) : null;
        const añoMasAntiguo = años.length > 0 ? Math.min(...años) : null;

        setEstadisticas({
            total,
            completados,
            pendientes,
            porcentajeCompletado,
            plataformas,
            generos,
            añoMasReciente,
            añoMasAntiguo
        });
    }

    // Ordenar y obtener top 5
    const topPlataformas = Object.entries(estadisticas.plataformas)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const topGeneros = Object.entries(estadisticas.generos)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Click en el overlay para cerrar
    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) {
            onCerrar();
        }
    }

    if (estadisticas.total === 0) {
        return (
            <div className="dashboard-overlay" onClick={handleOverlayClick}>
                <div className="dashboard-contenedor">
                    <button 
                        className="dashboard-btn-cerrar" 
                        onClick={onCerrar}
                        aria-label="Cerrar dashboard"
                    >
                        ✕
                    </button>
                    <div className="dashboard-vacio">
                        <div className="dashboard-vacio-icono">🕹️</div>
                        <h3>Sin Estadísticas</h3>
                        <p>Agrega juegos a tu colección para ver tus estadísticas</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-overlay" onClick={handleOverlayClick}>
            <div className="dashboard-contenedor">
                <button 
                    className="dashboard-btn-cerrar" 
                    onClick={onCerrar}
                    aria-label="Cerrar dashboard"
                >
                    X
                </button>
                
                <h2 className="dashboard-titulo">🕹️ Dashboard</h2>
                
                {/* Tarjetas de resumen */}
                <div className="stats-grid">
                    <div className="stat-card stat-total">
                        <div className="stat-info">
                            <h3>{estadisticas.total}</h3>
                            <p>Total de Juegos</p>
                        </div>
                    </div>

                    <div className="stat-card stat-completados">
                        <div className="stat-info">
                            <h3>{estadisticas.completados}</h3>
                            <p>Completados</p>
                        </div>
                    </div>

                    <div className="stat-card stat-pendientes">
                        <div className="stat-info">
                            <h3>{estadisticas.pendientes}</h3>
                            <p>Pendientes</p>
                        </div>
                    </div>

                    <div className="stat-card stat-porcentaje">
                        <div className="stat-info">
                            <h3>{estadisticas.porcentajeCompletado}%</h3>
                            <p>Progreso</p>
                        </div>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="progreso-contenedor">
                    <div className="progreso-header">
                        <span>Progreso de Completado</span>
                        <span className="progreso-texto">
                            {estadisticas.completados} de {estadisticas.total}
                        </span>
                    </div>
                    <div className="progreso-barra">
                        <div 
                            className="progreso-relleno"
                            style={{ width: `${estadisticas.porcentajeCompletado}%` }}
                        >
                            <span className="progreso-label">{estadisticas.porcentajeCompletado}%</span>
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="graficos-grid">
                    {/* Top Plataformas */}
                    <div className="grafico-card">
                        <h3 className="grafico-titulo">Top Plataformas</h3>
                        <div className="grafico-barras">
                            {topPlataformas.map(([plataforma, cantidad]) => {
                                const porcentaje = (cantidad / estadisticas.total) * 100;
                                return (
                                    <div key={plataforma} className="barra-item">
                                        <div className="barra-label">
                                            <span className="barra-nombre">{plataforma}</span>
                                            <span className="barra-valor">{cantidad}</span>
                                        </div>
                                        <div className="barra-fondo">
                                            <div 
                                                className="barra-relleno barra-plataforma"
                                                style={{ width: `${porcentaje}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Géneros */}
                    <div className="grafico-card">
                        <h3 className="grafico-titulo">Top Géneros</h3>
                        <div className="grafico-barras">
                            {topGeneros.map(([genero, cantidad]) => {
                                const porcentaje = (cantidad / estadisticas.total) * 100;
                                return (
                                    <div key={genero} className="barra-item">
                                        <div className="barra-label">
                                            <span className="barra-nombre">{genero}</span>
                                            <span className="barra-valor">{cantidad}</span>
                                        </div>
                                        <div className="barra-fondo">
                                            <div 
                                                className="barra-relleno barra-genero"
                                                style={{ width: `${porcentaje}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Datos adicionales */}
                <div className="info-adicional">
                    <div className="info-item">
                        <div className="info-texto">
                            <strong>Juego Más Reciente</strong>
                            <p>{estadisticas.añoMasReciente || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-texto">
                            <strong>Juego Más Antiguo</strong>
                            <p>{estadisticas.añoMasAntiguo || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-texto">
                            <strong>Plataformas Diferentes</strong>
                            <p>{Object.keys(estadisticas.plataformas).length}</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-texto">
                            <strong>Géneros Diferentes</strong>
                            <p>{Object.keys(estadisticas.generos).length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
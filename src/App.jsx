import { useEffect, useState } from 'react';
import ListaJuegos from './Componentes/ListaJuegos';
import FormularioJuego from './Componentes/FormularioJuego';
import NavBar from './Componentes/NavBar';
import Dashboard from './Componentes/Dashboard';
import './App.css';

// Imagenes importadas para el fondo animado de la pagina
import img1 from './assets/3550-videojuegos.jpg';

function App() {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardAbierto, setDashboardAbierto] = useState(false);
  const [indiceImagen, setIndiceImagen] = useState(0);

  // Array de imágenes para el fondo
  const imagenesGaming = [
    img1,
    'https://4kwallpapers.com/images/walls/thumbs_3t/24476.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/24321.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/24507.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/23545.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/23426.jpg',
    'https://4kwallpapers.com/images/walls/thumbs_3t/16044.jpeg',
  ];

  useEffect(() => {
    cargarJuegos();
  }, []);

  // Efecto para cambiar el fondo automáticamente
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceImagen(prev => (prev + 1) % imagenesGaming.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(intervalo);
  }, [imagenesGaming.length]);

  // Obtiene todos los juegos del backend
  async function cargarJuegos() {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch('/api/juegos');

      if (!respuesta.ok) {
        throw new Error('Error al cargar los juegos');
      }

      const data = await respuesta.json();
      setJuegos(data);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar los juegos. Verifica tu conexión.');
    } finally {
      setCargando(false);
    }
  }

  // Agrega un nuevo juego a la lista
  function agregarJuego(nuevoJuego) {
    setJuegos(prev => [nuevoJuego, ...prev]);
  }

  // Actualiza un juego existente
  function actualizarJuego(juegoActualizado) {
    setJuegos(prev =>
      prev.map(juego =>
        juego._id === juegoActualizado._id ? juegoActualizado : juego
      )
    );
  }

  // Elimina un juego de la lista
  function eliminarJuego(idJuego) {
    setJuegos(prev => prev.filter(juego => juego._id !== idJuego));
  }

  // Función scroll suave
  function scrollToForm() {
    const form = document.getElementById('form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const firstInput = form.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 500);
    }
  }

  return (
    <>
      {/* Contenedor del fondo animado */}
      <div className="background-slider">
        {imagenesGaming.map((imagen, index) => (
          <div
            key={index}
            className={`background-slide ${index === indiceImagen ? 'active' : ''}`}
            style={{ backgroundImage: `url(${imagen})` }}
          />
        ))}
      </div>

      <div className='app-contenedor'>
        <NavBar onAbrirDashboard={() => setDashboardAbierto(true)} />

        {/* Sección hero */}
        <section className='inicio' id='inicio'>
          <div className="hero-contenido">
            <h1 className="hero-titulo">GameTracker</h1>
            <p className="descripcion">¿Listo/a para organizar tu colección de juegos?</p>
            <button 
              className='comencemos' 
              onClick={scrollToForm} 
              aria-label="Ir al formulario"
            >
              ¡Comencemos!
            </button>
          </div>

          <FormularioJuego onAgregarJuego={agregarJuego}/>
        </section>

        {/* Sección lista de juegos */}
        <section className='seccion-juegos'>
          {error && (
            <div className="mensaje-error-app">
              <p>{error}</p>
              <button onClick={cargarJuegos} className='btn-reintentar'>Reintentar</button>
            </div>
          )}

          {cargando ? (
            <div className="cargando-contenedor">
              <div className="cargando-circulo"></div>
              <p>Cargando juegos...</p>
            </div>
          ) : (
            <ListaJuegos 
              juegos={juegos}
              onActualizar={actualizarJuego}
              onEliminar={eliminarJuego}
            />
          )}
        </section>

        {/* Dashboard como overlay */}
        {dashboardAbierto && (
          <Dashboard 
            juegos={juegos} 
            onCerrar={() => setDashboardAbierto(false)}
          />
        )}

        {/* Footer */}
        <footer className="app-footer">
          <p>GameTracker © 2025 - organiza tu pasión por los videojuegos</p>
        </footer>
      </div>
    </>
  );
}

export default App;
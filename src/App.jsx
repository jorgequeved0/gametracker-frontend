import { useEffect, useState } from 'react';
import ListaJuegos from './Componentes/ListaJuegos';
import FormularioJuego from './Componentes/FormularioJuego';
import NavBar from './Componentes/NavBar';
import Dashboard from './Componentes/Dashboard';
import './App.css';

function App() {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardAbierto, setDashboardAbierto] = useState(false);

  useEffect(() => {
    cargarJuegos();
  }, []);

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
  );
}

export default App;
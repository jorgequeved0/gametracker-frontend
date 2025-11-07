import { useState } from 'react';
import ListaJuegos from './Componentes/ListaJuegos';
import FormularioJuego from './Componentes/FormularioJuego';
import NavBar from './Componentes/NavBar';
import './App.css'

function App() {
  const [juegos, setJuegos] = useState([]);

  function agregarJuego(nuevoJuego) {
    setJuegos(prev => [...prev, nuevoJuego]);
  }

  return (
    <div>
      <NavBar/>
      <section className='inicio'>
        <div>
          <h1>GameTracker</h1>
          <p className='descripcion'>¿Listo/a para recorrer tus juegos?</p>
          <label className='comencemos' htmlFor="comencemos">¡Comencemos!</label>
        </div>
          <FormularioJuego onAgregarJuego={agregarJuego}/>
      </section>
      <ListaJuegos juegos={juegos}/>
    </div>
  );
}

export default App;

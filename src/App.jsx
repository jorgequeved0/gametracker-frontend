import { useState } from 'react';
import ListaJuegos from './Componentes/ListaJuegos';
import FormularioJuego from './Componentes/FormularioJuego';

function App() {
  const [juegos, setJuegos] = useState([]);

  function agregarJuego(nuevoJuego) {
    setJuegos(prev => [...prev, nuevoJuego]);
  }

  return (
    <div>
      <h1>GameTracker</h1>
      <FormularioJuego onAgregarJuego={agregarJuego}/>
      <ListaJuegos juegos={juegos}/>
    </div>
  );
}

export default App;

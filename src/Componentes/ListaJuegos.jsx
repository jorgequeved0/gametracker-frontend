import { useState } from "react";
import { useEffect } from "react";
import './ListaJuegos.css';
import Cards from "./Cards";

function ListaJuegos({juegos, onEliminar, onActualizar}) {

    return (
        <div id="lista_juegos" className="contenedor-lista-juegos">
            <h2 className="h2_lista">Lista de Juegos</h2>
            <Cards juegos={juegos} onEliminar={onEliminar} onActualizar={onActualizar}/>
        </div>
    );
}

export default ListaJuegos;
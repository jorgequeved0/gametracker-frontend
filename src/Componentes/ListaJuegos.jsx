import { useState } from "react";
import { useEffect } from "react";
import './ListaJuegos.css';
import Cards from "./Cards";

function ListaJuegos() {

    return (
        <div id="lista_juegos" className="contenedor-lista-juegos">
            <h2 className="h2_lista">Lista de Juegos</h2>
            <Cards/>
        </div>
    );
}

export default ListaJuegos;
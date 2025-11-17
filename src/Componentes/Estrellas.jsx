import './Estrellas.css';

function Estrellas({ puntuacion, onChange, soloLectura = false, tamaño = 'medium' }) {
    const estrellas = [1, 2, 3, 4, 5];

    function handleClick(valor) {
        if (!soloLectura && onChange) {
            onChange(valor);
        }
    }

    function handleKeyPress(e, valor) {
        if (!soloLectura && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick(valor);
        }
    }

    return (
        <div 
            className={`estrellas-contenedor ${soloLectura ? 'solo-lectura' : 'interactivo'} tamaño-${tamaño}`}
            aria-label={`Puntuación: ${puntuacion} de 5 estrellas`}
        >
            {estrellas.map((estrella) => (
                <span 
                    key={estrella}
                    className={`estrella ${estrella <= puntuacion ? 'estrella-llena' : 'estrella-vacia'}`}
                    onClick={() => handleClick(estrella)}
                    onKeyPress={(e) => handleKeyPress(e, estrella)}
                    role={soloLectura ? 'img' : 'button'}
                    tabIndex={soloLectura ? -1 : 0}
                    aria-label={`${estrella} estrella${estrella > 1 ? 's' : ''}`}
                >
                    {estrella <= puntuacion ? '★' : '☆'}
                </span>
            ))}
        </div>
    );
}

export default Estrellas;
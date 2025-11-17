import './Estrellas.css';

function Estrellas({puntuacion, onChange, soloLectura = false, tamaño = medium}) {
    const estrellas = [1, 2,3 , 4, 5];

    function handleClick(valor) {
        if (!soloLectura && onChange) {
            onChange(valor);
        }
    }

    return (
        <div className={`estrellas-contenedor ${soloLectura ? 'solo-lectura' : 'interactivo'} tamaño-${tamaño}`}>
            {estrellas.map((estrella) => (
                <span key={estrella} className={`estrella ${estrella <= puntuacion ? 'llena' : 'vacia'}`} onClick={() => handleClick(estrella)} onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClick(estrella);
                }} role={soloLectura ? 'img' : 'button'}>
                    {estrella <= puntuacion ? '★' : '☆'}
                </span>
            ))}
        </div>
    )
}

export default Estrellas;
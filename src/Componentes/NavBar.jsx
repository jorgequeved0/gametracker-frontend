import './NavBar.css'

function NavBar() {
    return (
        <nav className="navbar">
            <h2 className='h2_navbar'>GameTracker</h2>
            <ul className="ul_navbar">
                
                <li className='li_navbar'><a href="#inicio">Inicio</a></li>
                <li className='li_navbar'><a href="#nuevo-juego">Nuevo Juego</a></li>
                <li className='li_navbar'><a href="#lista-juegos">Juegos</a></li>
            </ul>
        </nav>
    );
}

export default NavBar;
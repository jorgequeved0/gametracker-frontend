import './NavBar.css';

function NavBar({ onAbrirDashboard }) {
    return (
        <nav className="navbar">
            <ul className="ul_navbar">
                <li className='li_navbar'>
                    <a href="#inicio">
                        <h2>GameTracker</h2>
                    </a>
                </li>
                {onAbrirDashboard && (
                    <li className='li_navbar'>
                        <button className='btn-navbar-dashboard' onClick={onAbrirDashboard}>
                            Estadísticas
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default NavBar;
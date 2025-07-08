import { Outlet, NavLink } from "react-router-dom"
import styles from './Layout.module.css'

function Layout() {

    return (
        <div>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <NavLink className={({ isActive }) => isActive ? styles['active-nav-link'] : styles['default-nav-link']} to='/'>Translate</NavLink>
                    <span className={styles.separator}> & </span>
                    <NavLink
                        to="/dictionary"
                        className={({ isActive }) => `${styles['default-nav-link']} ${isActive ? styles['active-nav-link'] : ''} ${styles.teachDop}`}>Teach</NavLink>
                </nav>
            </header>
            <div className={styles['outlet-container']}><Outlet></Outlet></div>
            <footer className={styles.footer}>
                <p className={styles.author}>Ivan Vasilev</p>
            </footer>
        </div>
    )
}

export default Layout
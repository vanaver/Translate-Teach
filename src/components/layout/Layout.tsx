import { Outlet, NavLink } from "react-router-dom"
import styles from './Layout.module.css'

function Layout() {

    return(
        <div>
           <header className={styles.header}>
                <nav className={styles.nav}>
                    <NavLink className={({isActive})=>  isActive ? styles['active-nav-link'] : styles['default-nav-link']} to='/'>Translate</NavLink>
                    <span className={styles.separator}> & </span>
                    <NavLink className={({isActive})=>  isActive ? styles['active-nav-link'] : styles['default-nav-link']} to='/dictionary'>Teach</NavLink>
                </nav>
           </header>
           <Outlet></Outlet>
        </div>
    )
}

export default Layout
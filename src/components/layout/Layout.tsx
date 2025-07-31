// Layout.tsx
import { Outlet, NavLink } from "react-router-dom"
import styles from './Layout.module.css'

function Layout() {
  return (
    <div>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <NavLink 
            to='/' 
            className={({ isActive }) => 
              `${styles['default-nav-link']} ${isActive ? styles['active-nav-link'] : ''}`
            }
          >
            <span className="material-icons">translate</span>
            &nbsp;Переводчик
          </NavLink>
          <span className={styles.separator}> | </span>
          <NavLink
            to="/dictionaries"
            className={({ isActive }) => 
              `${styles['default-nav-link']} ${isActive ? styles['active-nav-link'] : ''}`
            }
          >
            <span className="material-icons">menu_book</span>
            &nbsp;Мои словари
          </NavLink>
        </nav>
      </header>
      <div className={styles['outlet-container']}>
        <Outlet />
      </div>
      <footer className={styles.footer}>
        <p className={styles.author}>LinguaFlow © 2023 | Инструмент для изучения языков</p>
      </footer>
    </div>
  )
}

export default Layout
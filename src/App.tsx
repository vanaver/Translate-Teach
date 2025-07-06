import './App.css'
import { Routes, Route, } from 'react-router-dom'
import Layout from './components/layout/Layout'
import MainPage from './components/mainPage/MainPage'
import Slovariki from './components/slovariki/Slovariki'



function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<MainPage/>}></Route>
          <Route path='/dictionary' element={<Slovariki/>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App

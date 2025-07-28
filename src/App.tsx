// app.tsx
import './App.css'
import { Routes, Route, } from 'react-router-dom'
import Layout from './components/layout/Layout'
import MainPage from './components/mainPage/MainPage'
import Slovariki from './components/slovariki/Slovariki'
import SinglePage from './components/singlePage/SinglePage'



function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<MainPage/>}></Route>
          <Route path='/dictionaries' element={<Slovariki/>}></Route>
          <Route path='/dictionaries/:slovarik' element={<SinglePage/>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App

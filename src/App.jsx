

import { IdentityValidation } from './Components/IdentityValidation/IdentityValidation'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
        <Route exact path='/'element={< IdentityValidation  />} />

    </Routes>
    </BrowserRouter>
  )
}

export default App

import React from 'react'
import Header from './components/Header'
import Hero from './sections/Hero'
import Cardapio from './sections/Cardapio'
import Personalize from './sections/Personalize'
import SobreNos from './sections/SobreNos'
import Delivery from './sections/Delivery'
import Footer from './sections/Footer'
import AcaiFlight3D from './components/AcaiFlight3D'

function App() {
  return (
    <div className="app">
      <Header />
      <AcaiFlight3D />
      <main>
        <Hero />
        <Cardapio />
        <Personalize />
        <SobreNos />
        <Delivery />
      </main>
      <Footer />
    </div>
  )
}

export default App

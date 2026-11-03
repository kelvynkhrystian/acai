import React, { useState, useCallback } from 'react'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Hero from './sections/Hero'
import Cardapio from './sections/Cardapio'
import Personalize from './sections/Personalize'
import SobreNos from './sections/SobreNos'
import Delivery from './sections/Delivery'
import Footer from './sections/Footer'
import AcaiFlight3D from './components/AcaiFlight3D'

function App() {
  const [isReady, setIsReady] = useState(false)
  const [bufferReady, setBufferReady] = useState(false)

  const handleStartExit = useCallback(() => {
    setIsReady(true)
  }, [])

  const handleBufferReady = useCallback(() => {
    setBufferReady(true)
  }, [])

  return (
    <div className="app">
      <Preloader
        bufferReady={bufferReady}
        onStartExit={handleStartExit}
      />
      <Header isReady={isReady} />
      <AcaiFlight3D />
      <main>
        <Hero
          isReady={isReady}
          onBufferReady={handleBufferReady}
        />
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

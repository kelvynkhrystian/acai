import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AcaiFlight3D.css'

gsap.registerPlugin(ScrollTrigger)

export default function AcaiFlight3D() {
  const flightWrapRef = useRef(null)

  useEffect(() => {
    let tl = null
    let st = null

    // Aguarda o carregamento e renderização estável dos elementos no DOM
    const timer = setTimeout(() => {
      const sourceImg = document.getElementById('cardapio-acai-img')
      const targetImg = document.getElementById('personalize-acai-img')
      const flightWrap = flightWrapRef.current
      const appEl = document.querySelector('.app')

      if (!sourceImg || !targetImg || !flightWrap || !appEl) return

      const setupFlight = () => {
        if (tl) tl.kill()
        if (st) st.kill()

        const appRect = appEl.getBoundingClientRect()
        const sRect = sourceImg.getBoundingClientRect()
        const tRect = targetImg.getBoundingClientRect()

        // Posição central exata de onde o copo já fica (Card 1)
        const startX = sRect.left - appRect.left + sRect.width / 2
        const startY = sRect.top - appRect.top + sRect.height / 2

        // Posição central exata de chegada (Personalize)
        const endX = tRect.left - appRect.left + tRect.width / 2
        const endY = tRect.top - appRect.top + tRect.height / 2

        // Largura e altura idênticas às do card original
        const width = sRect.width
        const height = sRect.height

        // Escala final proporcional ao copo do Personalize
        const targetScale = tRect.width / (sRect.width || 1)

        // Posiciona no mesmo ponto milimétrico onde ele já fica em repouso
        gsap.set(flightWrap, {
          width: `${width}px`,
          height: `${height}px`,
          x: startX,
          y: startY,
          xPercent: -50,
          yPercent: -50,
          rotation: 0,
          scale: 1,
          opacity: 0,
          transformOrigin: '50% 50%',
        })

        // Timeline: o açaí normal gira suavemente 360° e cai perfeitamente no destino
        tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'power1.inOut' },
        })

        tl.fromTo(
          flightWrap,
          {
            x: startX,
            y: startY,
            rotation: 0,
            scale: 1,
          },
          {
            x: endX,
            y: endY,
            rotation: 360, // Gira o açaí normal no próprio eixo
            scale: targetScale,
            duration: 1,
            ease: 'power1.inOut',
          }
        )

        // "Onde ele já fica, girou o mouse vai saindo"
        st = ScrollTrigger.create({
          trigger: '#cardapio-acai-source',
          start: 'center center', // Começa no momento exato em que o copo está no centro
          endTrigger: '#personalize-acai-target',
          end: 'center center', // Pousa quando o alvo chega ao centro
          scrub: 1.1, // Rastreamento sedoso do scroll do mouse
          animation: tl,
          onUpdate: (self) => {
            const p = self.progress

            // Transição 100% contínua e sem trancos (zero descolamento)
            if (p <= 0.0) {
              sourceImg.style.opacity = '1'
              targetImg.style.opacity = '0'
              gsap.set(flightWrap, { opacity: 0 })
            } else if (p < 0.05) {
              // Micro-crossfade imperceptível na saída
              const t = p / 0.05
              sourceImg.style.opacity = String(1 - t)
              targetImg.style.opacity = '0'
              gsap.set(flightWrap, { opacity: 1 })
            } else if (p > 0.95) {
              // Micro-crossfade imperceptível no pouso final
              const t = (p - 0.95) / 0.05
              sourceImg.style.opacity = '0'
              targetImg.style.opacity = String(t)
              gsap.set(flightWrap, { opacity: String(1 - t) })
            } else {
              // Voo pleno com rotação
              sourceImg.style.opacity = '0'
              targetImg.style.opacity = '0'
              gsap.set(flightWrap, { opacity: 1 })
            }
          },
        })
      }

      setupFlight()

      const handleResize = () => {
        setupFlight()
      }

      window.addEventListener('resize', handleResize)
      ScrollTrigger.addEventListener('refresh', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        ScrollTrigger.removeEventListener('refresh', handleResize)
        if (st) st.kill()
        if (tl) tl.kill()
      }
    }, 350)

    return () => {
      clearTimeout(timer)
      if (st) st.kill()
      if (tl) tl.kill()
    }
  }, [])

  return (
    <div className="acai-flight-container" aria-hidden="true">
      <div className="acai-flight-cup" ref={flightWrapRef}>
        <img
          src="/products/acai1.png"
          alt="Açaí Tradicional"
          className="acai-flight-img"
        />
      </div>
    </div>
  )
}

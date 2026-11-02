import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AcaiFlight3D.css'

gsap.registerPlugin(ScrollTrigger)

export default function AcaiFlight3D() {
  const containerRef = useRef(null)
  const cupRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const sourceEl = document.getElementById('cardapio-acai-source')
      const targetEl = document.getElementById('personalize-acai-target')
      const sourceImg = document.getElementById('cardapio-acai-img')
      const targetImg = document.getElementById('personalize-acai-img')

      if (!sourceEl || !targetEl || !cupRef.current || !containerRef.current) {
        return
      }

      let tl = null
      let st = null

      const setupFlight = () => {
        if (st) st.kill()
        if (tl) tl.kill()

        const scrollY = window.scrollY || window.pageYOffset

        const sourceRect = sourceEl.getBoundingClientRect()
        const targetRect = targetEl.getBoundingClientRect()

        const startX = sourceRect.left + sourceRect.width / 2
        const startY = sourceRect.top + scrollY + sourceRect.height / 2

        const endX = targetRect.left + targetRect.width / 2
        const endY = targetRect.top + scrollY + targetRect.height / 2

        // Escala proporcional elegante (cerca da metade da anterior, sem ficar gigante)
        const scaleFactor = Math.min(Math.max(targetRect.width / (sourceRect.width || 1), 1.08), 1.25)

        // Posiciona no Card 1
        gsap.set(cupRef.current, {
          left: startX,
          top: startY,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          rotationY: 0,
          rotationZ: 0,
          rotationX: 0,
          opacity: 0,
          transformPerspective: 1200,
          transformOrigin: '50% 50%',
        })

        // Timeline de voo 3D suave com rotação no mesmo eixo vertical (Y)
        tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'power1.inOut' },
        })

        tl.to(cupRef.current, {
          left: endX,
          top: endY,
          scale: scaleFactor,
          rotationY: 360, // Gira 360° em 3D no próprio eixo vertical
          rotationZ: 0,   // Mantém o eixo reto e estável
          rotationX: 0,
          filter: 'drop-shadow(0 25px 40px rgba(0, 0, 0, 0.65))',
          duration: 1,
          ease: 'power2.inOut',
        })

        // Ativa um pouco depois que o cardápio já passou do centro da tela
        st = ScrollTrigger.create({
          trigger: '#cardapio',
          start: 'center 42%', // Inicia suavemente quando o cardápio já passou um pouco do centro
          endTrigger: '#promocoes',
          end: 'center 50%',  // Finaliza suavemente com o Personalize no centro
          scrub: 1.2,
          animation: tl,
          onUpdate: (self) => {
            const p = self.progress

            // Transição invisível: esconde o copo do card e acende o copo 3D viajante
            if (p > 0.03 && p < 0.97) {
              if (sourceImg) sourceImg.style.opacity = '0'
              if (targetImg) targetImg.style.opacity = '0'
              gsap.set(cupRef.current, { opacity: 1 })
            } else if (p <= 0.03) {
              if (sourceImg) sourceImg.style.opacity = '1'
              if (targetImg) targetImg.style.opacity = '0'
              gsap.set(cupRef.current, { opacity: 0 })
            } else if (p >= 0.97) {
              if (sourceImg) sourceImg.style.opacity = '0'
              if (targetImg) targetImg.style.opacity = '1'
              gsap.set(cupRef.current, { opacity: 0 })
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
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="acai-flight-container" ref={containerRef} aria-hidden="true">
      <div className="acai-flight-cup" ref={cupRef}>
        <img
          src="/products/acai1.png"
          alt=""
          className="acai-flight-img"
        />
      </div>
    </div>
  )
}

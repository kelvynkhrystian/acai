import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AcaiFlight3D.css'

gsap.registerPlugin(ScrollTrigger)

export default function AcaiFlight3D() {
  const containerRef = useRef(null)
  const cupRef = useRef(null)

  useEffect(() => {
    // Aguarda o carregamento e renderização dos elementos do DOM
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
        // Limpa animações anteriores caso seja recalculo de resize
        if (st) st.kill()
        if (tl) tl.kill()

        const scrollY = window.scrollY || window.pageYOffset

        const sourceRect = sourceEl.getBoundingClientRect()
        const targetRect = targetEl.getBoundingClientRect()

        const startX = sourceRect.left + sourceRect.width / 2
        const startY = sourceRect.top + scrollY + sourceRect.height / 2

        const endX = targetRect.left + targetRect.width / 2
        const endY = targetRect.top + scrollY + targetRect.height / 2

        // Razão de escala entre o cardápio (~220px) e o palco do Personalize (~520px a 620px)
        const scaleFactor = Math.min(Math.max(targetRect.width / (sourceRect.width || 1), 1.6), 2.6)

        // Posiciona o container inicial no ponto do Card 2
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

        // Timeline de voo 3D conectando as duas seções
        tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'power1.inOut' },
        })

        // Trajetória cinemática em arco com rotação nos 3 eixos espaciais (X, Y, Z)
        tl.to(cupRef.current, {
          left: endX,
          top: endY,
          scale: scaleFactor,
          rotationY: 34, // Vira em 3D mostrando volume
          rotationZ: 14, // Inclinação dinâmica de velocidade no ar
          rotationX: -10, // Leve ângulo superior mostrando morangos
          filter: 'drop-shadow(0 45px 55px rgba(0, 0, 0, 0.75))',
          duration: 0.7,
          ease: 'power2.inOut',
        })
        .to(cupRef.current, {
          rotationY: 0, // Alinha de volta ao chegar no palco
          rotationZ: 0,
          rotationX: 0,
          filter: 'drop-shadow(0 25px 45px rgba(0, 0, 0, 0.7))',
          duration: 0.3,
          ease: 'power2.out',
        })

        // ScrollTrigger com scrub contínuo de 1.2 segundos para física natural
        st = ScrollTrigger.create({
          trigger: '#cardapio',
          start: 'top 20%', // Inicia quando o Cardápio está bem visível
          endTrigger: '#promocoes',
          end: 'top 20%', // Termina quando o Personalize assume a tela
          scrub: 1.2,
          animation: tl,
          onUpdate: (self) => {
            const p = self.progress

            // Passagem de bastão: oculta o copo estático no card e acende o copo 3D voador
            if (p > 0.03 && p < 0.96) {
              if (sourceImg) sourceImg.style.opacity = '0'
              if (targetImg) targetImg.style.opacity = '0'
              gsap.set(cupRef.current, { opacity: 1 })
            } else if (p <= 0.03) {
              if (sourceImg) sourceImg.style.opacity = '1'
              if (targetImg) targetImg.style.opacity = '0'
              gsap.set(cupRef.current, { opacity: 0 })
            } else if (p >= 0.96) {
              if (sourceImg) sourceImg.style.opacity = '0'
              if (targetImg) targetImg.style.opacity = '1'
              gsap.set(cupRef.current, { opacity: 0 })
            }
          },
        })
      }

      setupFlight()

      // Recalcula posições caso o usuário mude o tamanho da tela
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
          src="/products/acai2.png"
          alt=""
          className="acai-flight-img"
        />
      </div>
    </div>
  )
}

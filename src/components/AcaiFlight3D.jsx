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
    let resizeTimer = null

    const flightWrap = flightWrapRef.current
    if (flightWrap) {
      // Estado seguro no mount (visibilidade desligada, zero reflow de display)
      flightWrap.style.visibility = 'hidden'
      flightWrap.style.opacity = '0'
    }

    const setupFlight = () => {
      const sourceImg = document.getElementById('cardapio-acai-img')
      const targetImg = document.getElementById('personalize-acai-img')
      const sourceWrap = document.getElementById('cardapio-acai-source')
      const targetWrap = document.getElementById('personalize-acai-target')
      const appEl = document.querySelector('.app')

      if (!sourceImg || !targetImg || !sourceWrap || !targetWrap || !flightWrap || !appEl) {
        return
      }

      const sRect = sourceImg.getBoundingClientRect()
      const tRect = targetImg.getBoundingClientRect()

      if (sRect.width === 0 || tRect.width === 0) {
        setTimeout(setupFlight, 150)
        return
      }

      if (tl) tl.kill()
      if (st) st.kill()

      const appRect = appEl.getBoundingClientRect()

      // Posição central de onde o copo do Card 1 já fica
      const startX = sRect.left - appRect.left + sRect.width / 2
      const startY = sRect.top - appRect.top + sRect.height / 2

      // Posição central do alvo do Personalize
      const endX = tRect.left - appRect.left + tRect.width / 2
      const endY = tRect.top - appRect.top + tRect.height / 2

      const width = sRect.width
      const height = sRect.height
      const targetScale = Math.max(tRect.width / (sRect.width || 1), 0.1)

      // Configuração inicial rápida sem layout thrashing
      gsap.set(flightWrap, {
        width: `${width}px`,
        height: `${height}px`,
        x: startX,
        y: startY,
        xPercent: -50,
        yPercent: -50,
        rotation: 0,
        scale: 1,
        transformOrigin: '50% 50%',
        force3D: true, // Aceleração por GPU direta
      })

      // Timeline de voo e rotação 360° no próprio eixo
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
          rotation: 360,
          scale: targetScale,
          duration: 1,
          ease: 'power1.inOut',
        }
      )

      // Rastreamento sedoso otimizado para mobile (zero toggling de display:none para evitar reflows)
      st = ScrollTrigger.create({
        trigger: sourceWrap,
        start: 'center center',
        endTrigger: targetWrap,
        end: 'center center',
        scrub: 1.0, // Responsivo e fluido no toque
        animation: tl,
        onToggle: (self) => {
          if (self.isActive) {
            flightWrap.style.visibility = 'visible'
            flightWrap.style.opacity = '1'
            sourceImg.style.opacity = '0'
            targetImg.style.opacity = '0'
          } else {
            flightWrap.style.visibility = 'hidden'
            flightWrap.style.opacity = '0'

            if (self.progress <= 0) {
              sourceImg.style.opacity = '1'
              targetImg.style.opacity = '0'
            } else if (self.progress >= 1) {
              sourceImg.style.opacity = '0'
              targetImg.style.opacity = '1'
            }
          }
        },
        onUpdate: (self) => {
          const p = self.progress

          if (p <= 0) {
            flightWrap.style.visibility = 'hidden'
            flightWrap.style.opacity = '0'
            sourceImg.style.opacity = '1'
            targetImg.style.opacity = '0'
          } else if (p >= 1) {
            flightWrap.style.visibility = 'hidden'
            flightWrap.style.opacity = '0'
            sourceImg.style.opacity = '0'
            targetImg.style.opacity = '1'
          } else {
            flightWrap.style.visibility = 'visible'
            flightWrap.style.opacity = '1'
            sourceImg.style.opacity = '0'
            targetImg.style.opacity = '0'
          }
        },
      })
    }

    const sourceImg = document.getElementById('cardapio-acai-img')
    const targetImg = document.getElementById('personalize-acai-img')

    if (sourceImg && !sourceImg.complete) {
      sourceImg.addEventListener('load', () => setupFlight(), { once: true })
    }
    if (targetImg && !targetImg.complete) {
      targetImg.addEventListener('load', () => setupFlight(), { once: true })
    }

    const timer = setTimeout(setupFlight, 180)

    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setupFlight()
      }, 200)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    ScrollTrigger.addEventListener('refresh', setupFlight)

    return () => {
      clearTimeout(timer)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.removeEventListener('refresh', setupFlight)
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

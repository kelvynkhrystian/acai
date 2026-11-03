import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo2 from '../assets/logo2.png'
import './Preloader.css'

export default function Preloader({ onStartExit, onComplete, bufferReady = true }) {
  const [progress, setProgress] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const preloaderRef = useRef(null)
  const contentRef = useRef(null)
  const hasTriggeredExitRef = useRef(false)
  const bufferReadyRef = useRef(bufferReady)

  useEffect(() => {
    bufferReadyRef.current = bufferReady
  }, [bufferReady])

  useEffect(() => {
    // Trava o scroll da página durante o carregamento
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const startTime = performance.now()
    const DURATION = 2000 // 2.0 segundos de carregamento mínimo
    const MAX_WAIT_TIMEOUT = 3800 // Timeout máximo absoluto de segurança

    let animFrame

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime

      // Calcula o progresso baseado no tempo (0 a 1)
      let rawProgress = Math.min(elapsed / DURATION, 1)

      // Se o tempo de 2s terminou mas o buffer do vídeo ainda está carregando em conexão móvel,
      // segura em 96% até os frames estarem prontos ou atingir o timeout de segurança
      if (rawProgress >= 1 && !bufferReadyRef.current && elapsed < MAX_WAIT_TIMEOUT) {
        rawProgress = 0.96
      }

      // Easing cúbico suave no avanço da porcentagem
      const easeProgress = 1 - Math.pow(1 - rawProgress, 2.5)
      const currentPercent = Math.min(Math.round(easeProgress * 100), 100)

      setProgress(currentPercent)

      const isReadyToExit = rawProgress >= 1 && (bufferReadyRef.current || elapsed >= MAX_WAIT_TIMEOUT)

      if (!isReadyToExit) {
        animFrame = requestAnimationFrame(updateCounter)
      } else {
        if (hasTriggeredExitRef.current) return
        hasTriggeredExitRef.current = true

        // Libera o vídeo do Hero para começar a tocar exatamente no momento da saída
        if (onStartExit) onStartExit()

        const tl = gsap.timeline({
          onComplete: () => {
            setIsFinished(true)
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
            ScrollTrigger.refresh()
            if (onComplete) onComplete()
          },
        })

        tl.to(contentRef.current, {
          scale: 0.96,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
        })
        tl.to(
          preloaderRef.current,
          {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          '-=0.15'
        )
      }
    }

    animFrame = requestAnimationFrame(updateCounter)

    return () => {
      cancelAnimationFrame(animFrame)
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [onStartExit, onComplete])

  if (isFinished) return null

  return (
    <div className="preloader" ref={preloaderRef} aria-label="Carregando Açaí City">
      {/* Brilho radial de fundo */}
      <div className="preloader__glow" aria-hidden="true" />

      <div className="preloader__content" ref={contentRef}>
        {/* Logotipo Açaí City com pulsação suave */}
        <div className="preloader__logo-wrap">
          <img src={logo2} alt="Açaí City" className="preloader__logo" />
        </div>

        {/* Barra de Progresso com Gradiente */}
        <div className="preloader__bar-track">
          <div
            className="preloader__bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Porcentagem e Mensagem Apetite Appeal */}
        <div className="preloader__footer">
          <span className="preloader__percent">{progress}%</span>
          <p className="preloader__tagline">Preparando o açaí mais cremoso da região...</p>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import './Hero.css'

const TOTAL_FRAMES = 78 // frames 0 a 77
const FAST_DURATION = 2.8 // Fase de subida suave (0 a 2.8s)
const SLOW_DURATION = 3.8 // Câmera lenta gradual (2.8s a 6.6s)
const TOTAL_DURATION = FAST_DURATION + SLOW_DURATION // 6.6s total
const FAST_END_FRAME = 72
const FINAL_FRAME = 77
const BUFFER_THRESHOLD = 24 // Buffer seguro para início instantâneo e 100% fluido

export default function Hero({ isReady = false, onBufferReady }) {
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const rafRef = useRef(null)
  const startTimeRef = useRef(null)
  const isLoadedRef = useRef(false)
  const isVisibleRef = useRef(true)
  const isPlayingRef = useRef(false)
  const bufferNotifiedRef = useRef(false)

  // Cache de dimensões para evitar layout thrashing (zero getBoundingClientRect no rAF)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1, isMobile: false })

  // GSAP animation refs
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)
  const ctaBtnRef = useRef(null)
  const mobileTopRef = useRef(null)
  const mobileBottomRef = useRef(null)

  const handleScrollTo = (e, targetId) => {
    e.preventDefault()
    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  /* ─── Atualização do Tamanho do Canvas (Apenas no Resize / Mount) ─── */
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    const isMobile = window.innerWidth < 900

    // Capping de DPR inteligente: mobile usa 1.25x (70% menos pixels, zero jank)
    const maxDpr = isMobile ? 1.25 : 1.75
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)

    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    if (ctx) {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = isMobile ? 'medium' : 'high'
    }

    sizeRef.current = { w, h, dpr, isMobile }
  }, [])

  /* ─── Renderização Otimizada a 60 FPS (Zero Reflow e Cover Cinematográfico) ─── */
  const drawInterpolatedFrame = useCallback((exactFrame) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { w, h, dpr, isMobile } = sizeRef.current
    if (w === 0 || h === 0) return

    ctx.save()
    ctx.scale(dpr, dpr)

    const clamped = Math.max(0, Math.min(exactFrame, FINAL_FRAME))
    const indexA = Math.floor(clamped)
    const indexB = Math.min(indexA + 1, FINAL_FRAME)
    const blend = clamped - indexA

    // No mobile, renderiza o frame direto mais próximo (corta esforço de GPU pela metade)
    const targetIndex = isMobile ? Math.round(clamped) : indexA
    const imgA = imagesRef.current[targetIndex] || imagesRef.current[indexA]

    if (imgA && imgA.complete && imgA.naturalWidth) {
      const iw = imgA.naturalWidth
      const ih = imgA.naturalHeight

      // Modo cover cinematográfico completo
      const scale = Math.max(w / iw, h / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = (w - dw) / 2
      const dy = (h - dh) / 2

      ctx.drawImage(imgA, dx, dy, dw, dh)

      // No desktop, interpolação entre frames para fluidez máxima
      if (!isMobile && blend > 0.005) {
        const imgB = imagesRef.current[indexB]
        if (imgB && imgB.complete && imgB.naturalWidth && indexA !== indexB) {
          ctx.globalAlpha = blend
          ctx.drawImage(imgB, dx, dy, dw, dh)
          ctx.globalAlpha = 1.0
        }
      }
    }

    ctx.restore()
  }, [])

  /* ─── Loop de Animação do Vídeo com Pausa Inteligente fora da tela ─── */
  const animate = useCallback((timestamp) => {
    if (!isVisibleRef.current) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    if (!startTimeRef.current) startTimeRef.current = timestamp
    const elapsed = (timestamp - startTimeRef.current) / 1000

    if (elapsed < FAST_DURATION) {
      const p1 = elapsed / FAST_DURATION
      const frame = p1 * FAST_END_FRAME
      drawInterpolatedFrame(frame)
      rafRef.current = requestAnimationFrame(animate)
    } else if (elapsed < TOTAL_DURATION) {
      const p2 = (elapsed - FAST_DURATION) / SLOW_DURATION
      const easeOutP2 = Math.sin((p2 * Math.PI) / 2)
      const frame = FAST_END_FRAME + easeOutP2 * (FINAL_FRAME - FAST_END_FRAME)
      drawInterpolatedFrame(frame)
      rafRef.current = requestAnimationFrame(animate)
    } else {
      drawInterpolatedFrame(FINAL_FRAME)
    }
  }, [drawInterpolatedFrame])

  /* ─── Pré-carregamento Prioritário: Frame 0 primeiro, depois os demais ─── */
  const preloadFrames = useCallback(() => {
    let loadedCount = 0
    const total = TOTAL_FRAMES

    // 1. Carrega o frame 0 prioritariamente
    const img0 = new Image()
    img0.decoding = 'async'
    img0.src = '/frames/frame-000.jpg'
    imagesRef.current[0] = img0

    img0.onload = () => {
      // Pinta o frame 0 imediatamente no canvas para a tela já ficar pronta e nítida atrás do loading
      drawInterpolatedFrame(0)
      if (img0.decode) img0.decode().catch(() => {})
      loadedCount++

      // 2. Inicia o carregamento e decodificação em ordem dos frames seguintes
      for (let i = 1; i < total; i++) {
        const num = String(i).padStart(3, '0')
        const img = new Image()
        img.decoding = 'async'
        img.src = `/frames/frame-${num}.jpg`
        imagesRef.current[i] = img

        img.onload = img.onerror = () => {
          loadedCount++
          if (img.decode) img.decode().catch(() => {})

          if (loadedCount >= BUFFER_THRESHOLD && !bufferNotifiedRef.current) {
            bufferNotifiedRef.current = true
            isLoadedRef.current = true
            if (onBufferReady) onBufferReady()
          }
        }
      }
    }

    img0.onerror = () => {
      if (!bufferNotifiedRef.current) {
        bufferNotifiedRef.current = true
        isLoadedRef.current = true
        if (onBufferReady) onBufferReady()
      }
    }

    // Fallback de segurança para liberar o buffer em conexões instáveis
    setTimeout(() => {
      if (!bufferNotifiedRef.current) {
        bufferNotifiedRef.current = true
        isLoadedRef.current = true
        if (onBufferReady) onBufferReady()
      }
    }, 2200)
  }, [drawInterpolatedFrame, onBufferReady])

  /* ─── Observer e Redimensionamento ─── */
  useEffect(() => {
    updateCanvasSize()

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0.05 }
    )

    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    const handleResize = () => {
      updateCanvasSize()
      if (!isReady || !isPlayingRef.current) {
        drawInterpolatedFrame(0)
      } else if (isLoadedRef.current) {
        drawInterpolatedFrame(FINAL_FRAME)
      }
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleResize, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [updateCanvasSize, drawInterpolatedFrame, isReady])

  /* ─── Animações GSAP de Entrada dos Textos (Equilibradas e Polidas) ─── */
  const runGsapAnimations = useCallback(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Habilita os wrappers para exibição dos filhos
    if (leftColRef.current) gsap.set(leftColRef.current, { opacity: 1 })
    if (rightColRef.current) gsap.set(rightColRef.current, { opacity: 1 })
    if (mobileTopRef.current) gsap.set(mobileTopRef.current, { opacity: 1 })
    if (mobileBottomRef.current) gsap.set(mobileBottomRef.current, { opacity: 1 })

    // Animações Desktop
    if (leftColRef.current && window.innerWidth >= 900) {
      tl.fromTo(
        leftColRef.current.children,
        { opacity: 0, x: -25 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.12 },
        0.1
      )
    }

    if (rightColRef.current && window.innerWidth >= 900) {
      tl.fromTo(
        rightColRef.current.children,
        { opacity: 0, x: 25 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.12 },
        0.2
      )
    }

    if (ctaBtnRef.current && window.innerWidth >= 900) {
      tl.fromTo(
        ctaBtnRef.current,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.5)' },
        0.6
      )
    }

    // Animações Mobile
    if (mobileTopRef.current && window.innerWidth < 900) {
      tl.fromTo(
        mobileTopRef.current.children,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 },
        0.1
      )
    }

    if (mobileBottomRef.current && window.innerWidth < 900) {
      tl.fromTo(
        mobileBottomRef.current.children,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 },
        0.35
      )
    }
  }, [])

  /* ─── 1. Inicia o Pré-carregamento dos Frames Imediatamente no Mount ─── */
  useEffect(() => {
    preloadFrames()
  }, [preloadFrames])

  /* ─── 2. IMPEDE O VÍDEO DE COMEÇAR até que isReady seja true (término do preloader) ─── */
  useEffect(() => {
    if (!isReady) {
      // Enquanto o carregamento está ativo, o vídeo fica congelado no frame 0
      drawInterpolatedFrame(0)
      return
    }

    if (isPlayingRef.current) return
    isPlayingRef.current = true

    // Começa exatamente do tempo zero assim que o loading termina
    startTimeRef.current = null
    rafRef.current = requestAnimationFrame(animate)

    // Inicia a entrada suave dos textos sincronizada com a saída do preloader
    runGsapAnimations()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isReady, animate, drawInterpolatedFrame, runGsapAnimations])

  return (
    <section className="hero" id="hero">
      {/* ── Background: Canvas dos 78 frames 1080p ── */}
      <canvas ref={canvasRef} className="hero__canvas-bg" />

      {/* ── Camada de Vinheta e Luz ── */}
      <div className="hero__darken-overlay" />

      {/* =========================================================
          1. ESTRUTURA MOBILE (Compacta, Sem Overflow e 100% Enquadrada)
          ========================================================= */}
      <div className="hero__mobile-view">
        
        {/* Bloco de Texto Superior */}
        <div className="hero__mobile-top" ref={mobileTopRef} style={{ opacity: 0 }}>
          
          <div className="hero__mobile-badge">
            <span className="hero__badge-dot" />
            <span>100% Puro & Artesanal</span>
          </div>

          <div className="hero__mobile-title-wrap">
            <p className="hero__mobile-intro">O AÇAÍ MAIS</p>
            
            <div className="hero__mobile-cremoso-wrap">
              <h1 className="hero__mobile-cremoso">CREMOSO</h1>
              
              <div className="hero__mobile-rays" aria-hidden="true">
                <span className="hero__mobile-ray hero__mobile-ray--1" />
                <span className="hero__mobile-ray hero__mobile-ray--2" />
                <span className="hero__mobile-ray hero__mobile-ray--3" />
              </div>
            </div>

            <h2 className="hero__mobile-regiao">da região!</h2>
          </div>

          <p className="hero__mobile-subtitle">
            Sabor autêntico, cremosidade inconfundível e combinações irresistíveis.
          </p>
        </div>

        {/* Bloco de Ações Inferior */}
        <div className="hero__mobile-bottom" ref={mobileBottomRef} style={{ opacity: 0 }}>
          
          {/* Botão 1: Peça agora no WhatsApp */}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hero__mobile-btn-whatsapp"
          >
            <div className="hero__mobile-btn-left">
              <WhatsAppIcon />
              <span>Peça agora no WhatsApp</span>
            </div>
            <ChevronRightIcon />
          </a>

          {/* Botão 2: Ver cardápio */}
          <a
            href="#cardapio"
            onClick={(e) => handleScrollTo(e, '#cardapio')}
            className="hero__mobile-btn-cardapio"
          >
            <BowlIcon />
            <span>Ver cardápio</span>
          </a>

        </div>

      </div>

      {/* =========================================================
          2. ESTRUTURA DESKTOP (Equilibrada, Sem Ocultar o Copo)
          ========================================================= */}
      <div className="hero__desktop-view">
        <div className="hero__frame">

          {/* Lado Esquerdo */}
          <div className="hero__left-box" ref={leftColRef} style={{ opacity: 0 }}>
            <div className="hero__pill-tag">
              <span className="hero__pill-dot" />
              <span>100% Puro & Artesanal</span>
            </div>

            <p className="hero__intro">HOJE É DIA DE</p>
            <h1 className="hero__acai-title">AÇAÍ</h1>

            <p className="hero__left-desc">
              Descubra a cremosidade do <strong>autêntico açaí</strong> da Amazônia, batido no ponto ideal de sabor.
            </p>
          </div>

          {/* Lado Direito */}
          <div className="hero__right-box" ref={rightColRef} style={{ opacity: 0 }}>
            <h2 className="hero__cremoso-title">
              <span className="hero__title-white">CREMOSO,</span>
              <span className="hero__title-white">REFRESCANTE,</span>
              <span className="hero__title-gradient">IRRESISTÍVEL!</span>
            </h2>

            <p className="hero__right-desc">
              Peça agora seu açaí favorito e aproveite cada colherada!
            </p>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hero__cta-green"
              ref={ctaBtnRef}
              style={{ opacity: 0 }}
            >
              <WhatsAppIcon />
              <span>Faça seu pedido agora!</span>
              <span className="hero__cta-shimmer" aria-hidden="true" />
            </a>
          </div>

        </div>
      </div>

    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="hero__cta-icon" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hero__mobile-chevron" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function BowlIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="hero__mobile-bowl-icon" aria-hidden="true">
      <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <path d="M12 4v4" />
    </svg>
  )
}

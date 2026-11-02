import React, { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import './Hero.css'

const TOTAL_FRAMES = 78 // frames 0 a 77
const FAST_DURATION = 2.8 // Fase de subida e explosão mais suave e perceptível (0 a 2.8s)
const SLOW_DURATION = 3.8 // Câmera lenta gradual e prolongada (2.8s a 6.6s)
const TOTAL_DURATION = FAST_DURATION + SLOW_DURATION // 6.6s total
const FAST_END_FRAME = 72
const FINAL_FRAME = 77

const WHATSAPP_URL = 'https://wa.me/5598988759846?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido%20agora!'

export default function Hero() {
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const rafRef = useRef(null)
  const startTimeRef = useRef(null)
  const isLoadedRef = useRef(false)

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

  /* ─── Renderização no Canvas com Escala Balanceada (Nítido e não gigante no Mobile) ─── */
  const drawInterpolatedFrame = useCallback((exactFrame) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    ctx.clearRect(0, 0, w, h)

    const clamped = Math.max(0, Math.min(exactFrame, FINAL_FRAME))
    const indexA = Math.floor(clamped)
    const indexB = Math.min(indexA + 1, FINAL_FRAME)
    const blend = clamped - indexA

    const imgA = imagesRef.current[indexA]
    const imgB = imagesRef.current[indexB]

    if (imgA && imgA.complete && imgA.naturalWidth) {
      const iw = imgA.naturalWidth
      const ih = imgA.naturalHeight

      // Modo cover cinematográfico completo (preenche 100% da tela)
      const scale = Math.max(w / iw, h / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = (w - dw) / 2
      const dy = (h - dh) / 2

      // Desenha frame base
      ctx.drawImage(imgA, dx, dy, dw, dh)

      // Se houver fração decimal, interpola suavemente para 60 FPS
      if (blend > 0.005 && imgB && imgB.complete && imgB.naturalWidth && indexA !== indexB) {
        ctx.globalAlpha = blend
        ctx.drawImage(imgB, dx, dy, dw, dh)
        ctx.globalAlpha = 1.0
      }
    }

    ctx.restore()
  }, [])

  /* ─── Loop com Câmera Lenta Desacelerada ─── */
  const animate = useCallback((timestamp) => {
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

  /* ─── Pré-carregamento dos 78 frames 1080p ─── */
  const preloadFrames = useCallback(() => {
    return new Promise((resolve) => {
      let loaded = 0
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const num = String(i).padStart(3, '0')
        const img = new Image()
        img.src = `/frames/frame-${num}.jpg`
        img.onload = img.onerror = () => {
          loaded++
          if (loaded === 1) {
            drawInterpolatedFrame(0)
          }
          if (loaded === TOTAL_FRAMES) {
            isLoadedRef.current = true
            resolve()
          }
        }
        imagesRef.current[i] = img
      }
    })
  }, [drawInterpolatedFrame])

  /* ─── Redimensionamento ─── */
  useEffect(() => {
    const handleResize = () => {
      if (isLoadedRef.current) {
        drawInterpolatedFrame(FINAL_FRAME)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawInterpolatedFrame])

  /* ─── Animações GSAP de Entrada dos Textos ─── */
  const runGsapAnimations = useCallback(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Animações Desktop
    if (leftColRef.current) {
      tl.fromTo(
        leftColRef.current.children,
        { opacity: 0, x: -35 },
        { opacity: 1, x: 0, duration: 0.9, stagger: 0.15 },
        0.3
      )
    }

    if (rightColRef.current) {
      tl.fromTo(
        rightColRef.current.children,
        { opacity: 0, x: 35 },
        { opacity: 1, x: 0, duration: 0.9, stagger: 0.15 },
        0.5
      )
    }

    if (ctaBtnRef.current) {
      tl.fromTo(
        ctaBtnRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
        1.1
      )
    }

    // Animações Mobile
    if (mobileTopRef.current) {
      tl.fromTo(
        mobileTopRef.current.children,
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
        0.3
      )
    }

    if (mobileBottomRef.current) {
      tl.fromTo(
        mobileBottomRef.current.children,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
        0.7
      )
    }
  }, [])

  /* ─── Inicialização ─── */
  useEffect(() => {
    preloadFrames().then(() => {
      startTimeRef.current = null
      rafRef.current = requestAnimationFrame(animate)
      runGsapAnimations()
    })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [preloadFrames, animate, runGsapAnimations])

  return (
    <section className="hero" id="hero">
      {/* ── Background: Canvas dos 78 frames 1080p ── */}
      <canvas ref={canvasRef} className="hero__canvas-bg" />

      {/* ── Camada de Vinheta e Luz (Sem escurecer o centro no mobile) ── */}
      <div className="hero__darken-overlay" />

      {/* =========================================================
          1. ESTRUTURA MOBILE (Exata à imagem de referência anexada)
          ========================================================= */}
      <div className="hero__mobile-view">
        
        {/* Bloco de Texto Superior */}
        <div className="hero__mobile-top" ref={mobileTopRef}>
          <p className="hero__mobile-intro">O açaí mais</p>
          
          <div className="hero__mobile-title-wrap">
            <h1 className="hero__mobile-cremoso">CREMOSO</h1>
            <div className="hero__mobile-rays" aria-hidden="true">
              <span className="hero__mobile-ray hero__mobile-ray--1" />
              <span className="hero__mobile-ray hero__mobile-ray--2" />
              <span className="hero__mobile-ray hero__mobile-ray--3" />
            </div>
          </div>

          <h2 className="hero__mobile-regiao">da região!</h2>

          <p className="hero__mobile-subtitle">
            Sabor, qualidade e combinações irresistíveis para o seu dia.
          </p>
        </div>

        {/* Bloco de Ações Inferior (Botões e Dots) */}
        <div className="hero__mobile-bottom" ref={mobileBottomRef}>
          
          {/* Botão 1: Peça agora no WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
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
          2. ESTRUTURA DESKTOP (Layout Lateral com Enquadramento)
          ========================================================= */}
      <div className="hero__desktop-view">
        <div className="hero__frame">

          {/* Lado Esquerdo */}
          <div className="hero__left-box" ref={leftColRef}>
            <p className="hero__intro">Hoje é dia de</p>

            <h1 className="hero__acai-title">AÇAÍ</h1>

            <p className="hero__left-desc">
              Descubra o sabor<br />
              do açaí <strong>mais gostoso</strong><br />
              da região.
            </p>
          </div>

          {/* Lado Direito */}
          <div className="hero__right-box" ref={rightColRef}>
            <h2 className="hero__cremoso-title">
              <span>CREMOSO,</span>
              <span>REFRESCANTE,</span>
              <span className="hero__highlight-yellow">IRRESISTÍVEL!</span>
            </h2>

            <p className="hero__right-desc">
              Peça agora seu açaí<br />
              favorito e aproveite<br />
              cada colherada!
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__cta-green"
              ref={ctaBtnRef}
            >
              <WhatsAppIcon />
              <span>Faça seu pedido agora!</span>
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

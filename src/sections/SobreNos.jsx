import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './SobreNos.css'

gsap.registerPlugin(ScrollTrigger)

export default function SobreNos() {
  const sectionRef = useRef(null)
  const imgRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrada suave da imagem
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, scale: 0.9, x: -50 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      // Efeito de Parallax contínuo no scroll para a imagem do cesto
      gsap.to(imgRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // Entrada suave do conteúdo
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="essencia" id="sobre" ref={sectionRef}>
      <div className="essencia__container">
        
        {/* Lado Esquerdo: Imagem da Essência Bem Maior com Círculo Dourado Atrás */}
        <div className="essencia__left" ref={imgRef} style={{ opacity: 0 }}>
          <div className="essencia__img-wrap">
            {/* Círculo/Arco dourado decorativo da referência */}
            <div className="essencia__decor-ring" aria-hidden="true" />
            <img
              src="/sections/site1.png"
              alt="Frutos frescos de açaí artesanal"
              className="essencia__img"
            />
          </div>
        </div>

        {/* Lado Direito: Texto e Badges */}
        <div className="essencia__right" ref={contentRef} style={{ opacity: 0 }}>
          <div className="essencia__eyebrow">
            <span className="essencia__line" />
            <span>Nossa Essência</span>
            <span className="essencia__line" />
          </div>

          <h2 className="essencia__title">
            Qualidade e<br />
            <span className="essencia__title-purple">sabor de verdade</span>
          </h2>

          <p className="essencia__desc">
            Açaí 100% artesanal, cremoso, selecionado e preparado com ingredientes de qualidade para oferecer sempre a melhor experiência.
          </p>

          {/* 3 Badges de Valor */}
          <div className="essencia__badges">
            
            <div className="essencia__badge-item">
              <div className="essencia__badge-icon essencia__badge-icon--green">
                <LeafIcon />
              </div>
              <span className="essencia__badge-name">Açaí<br />Premium</span>
            </div>

            <div className="essencia__badge-item">
              <div className="essencia__badge-icon essencia__badge-icon--purple">
                <HeartIcon />
              </div>
              <span className="essencia__badge-name">Receitas<br />Exclusivas</span>
            </div>

            <div className="essencia__badge-item">
              <div className="essencia__badge-icon essencia__badge-icon--gold">
                <MedalIcon />
              </div>
              <span className="essencia__badge-name">Qualidade<br />Garantida</span>
            </div>

          </div>
        </div>

      </div>

      {/* Onda de Transição Inferior para a Seção Delivery (roxo escuro) */}
      <div className="essencia__wave-bottom" aria-hidden="true">
        <svg viewBox="0 0 1440 65" preserveAspectRatio="none">
          <path d="M0,20 C360,65 720,15 1080,50 C1260,70 1380,30 1440,35 L1440,65 L0,65 Z" fill="#200336" />
        </svg>
      </div>

    </section>
  )
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}

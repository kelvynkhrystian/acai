import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Personalize.css'

gsap.registerPlugin(ScrollTrigger)

const WHATSAPP_PERSONALIZE = 'https://wa.me/5598988759846?text=Olá!%20Gostaria%20de%20montar%20meu%20açaí%20personalizado.'

export default function Personalize() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const bowlRef = useRef(null)
  const stepsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrada suave do texto da esquerda
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -50 },
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

      // Revelação suave do palco da tigela
      gsap.fromTo(
        bowlRef.current,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      // Revelação em cascata dos 3 passos sobrepostos
      gsap.fromTo(
        stepsRef.current,
        { opacity: 0, y: 35, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="personalize" id="promocoes" ref={sectionRef}>
      
      {/* Folha decorativa com parallax */}
      <div className="personalize__leaf personalize__leaf--top-right" aria-hidden="true">
        <LeafDecor />
      </div>

      <div className="personalize__container">
        
        {/* Lado Esquerdo: Conteúdo */}
        <div className="personalize__left" ref={leftRef} style={{ opacity: 0 }}>
          <div className="personalize__eyebrow">
            <span className="personalize__line" />
            <span>Monte do seu jeito</span>
          </div>

          <h2 className="personalize__title">
            Personalize<br />
            <span className="personalize__title-yellow">o seu açaí</span>
          </h2>

          <p className="personalize__desc">
            Escolha o tamanho, os acompanhamentos e crie a combinação perfeita para o seu momento.
          </p>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="personalize__btn"
          >
            <WhatsAppIcon />
            <span>Montar meu açaí</span>
          </a>
        </div>

        {/* Lado Direito: Palco Visual com Tigela Atrás + 3 Passos Maiores Sobrepostos na Frente */}
        <div className="personalize__stage">
          
          {/* Raios Amarelos Decorativos no Topo da Tigela (Fiel à referência) */}
          <div className="personalize__rays" aria-hidden="true">
            <span className="personalize__ray personalize__ray--1" />
            <span className="personalize__ray personalize__ray--2" />
            <span className="personalize__ray personalize__ray--3" />
          </div>

          {/* Copo de Açaí Tradicional que recebe o voo 3D do Cardápio (fica ATRÁS dos ícones) */}
          <div
            className="personalize__bowl-wrap"
            id="personalize-acai-target"
            ref={bowlRef}
          >
            <img
              src="/products/acai1.png"
              alt="Açaí Tradicional"
              id="personalize-acai-img"
              className="personalize__bowl-img"
            />
          </div>

          {/* Arco conector conectando os 3 passos */}
          <div className="personalize__arc-wrap" aria-hidden="true">
            <svg className="personalize__arc-svg" viewBox="0 0 500 70" preserveAspectRatio="none">
              <path d="M 50 35 Q 250 65 450 35" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.6" />
            </svg>
          </div>

          {/* 3 Passos Numéricos BEM MAIORES sobrepostos na frente */}
          <div className="personalize__steps">
            
            <div
              className="personalize__step"
              ref={(el) => { if (el) stepsRef.current[0] = el }}
              style={{ opacity: 0 }}
            >
              <div className="personalize__step-num">1</div>
              <div className="personalize__step-circle">
                <CupIcon />
              </div>
              <span className="personalize__step-label">Escolha<br />o tamanho</span>
            </div>

            <div
              className="personalize__step"
              ref={(el) => { if (el) stepsRef.current[1] = el }}
              style={{ opacity: 0 }}
            >
              <div className="personalize__step-num">2</div>
              <div className="personalize__step-circle">
                <ToppingIcon />
              </div>
              <span className="personalize__step-label">Adicione<br />seus toppings</span>
            </div>

            <div
              className="personalize__step"
              ref={(el) => { if (el) stepsRef.current[2] = el }}
              style={{ opacity: 0 }}
            >
              <div className="personalize__step-num">3</div>
              <div className="personalize__step-circle">
                <HeartIcon />
              </div>
              <span className="personalize__step-label">Finalize<br />e peça no WhatsApp</span>
            </div>

          </div>

        </div>

      </div>

      {/* Divisor de onda orgânica conectando ao Sobre Nós (bege) */}
      <div className="personalize__wave-bottom" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,0 C320,65 680,85 1040,40 C1240,15 1360,35 1440,50 L1440,80 L0,80 Z" fill="#FAF6EE" />
        </svg>
      </div>

    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22 }} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function CupIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  )
}

function ToppingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <path d="M12 2a9 9 0 0 0-9 9c0 4 3 7 7 8l2 3 2-3c4-1 7-4 7-8a9 9 0 0 0-9-9Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function LeafDecor() {
  return (
    <svg viewBox="0 0 120 120" fill="none" style={{ width: '100%', height: '100%' }}>
      <path d="M10 110 C20 40, 80 10, 115 15 C110 80, 70 115, 10 110 Z" fill="#22c55e" opacity="0.35" />
      <path d="M10 110 Q65 60 115 15" stroke="#15803d" strokeWidth="2.5" opacity="0.4" />
    </svg>
  )
}

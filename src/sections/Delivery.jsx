import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Delivery.css'

gsap.registerPlugin(ScrollTrigger)

const WHATSAPP_DELIVERY = 'https://wa.me/5598988759846?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido%20para%20entrega.'

export default function Delivery() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrada suave da sacola
      gsap.fromTo(
        leftRef.current,
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

      // Parallax contínuo da sacola no scroll
      gsap.to(leftRef.current, {
        y: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // Entrada suave do texto
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 50 },
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
    <section className="delivery" id="delivery" ref={sectionRef}>
      <div className="delivery__container">
        
        {/* Lado Esquerdo: Sacola Kraft (imagem original já inclui o selo de entrega) */}
        <div className="delivery__left" ref={leftRef} style={{ opacity: 0 }}>
          <div className="delivery__img-wrap">
            <img
              src="/sections/site3.png"
              alt="Açaí City Delivery"
              className="delivery__img"
            />
          </div>
        </div>

        {/* Lado Direito: Chamada e Benefícios */}
        <div className="delivery__right" ref={rightRef} style={{ opacity: 0 }}>
          <h2 className="delivery__title">
            Bateu a vontade?<br />
            <span className="delivery__title-yellow">A City entrega pra você!</span>
          </h2>

          <p className="delivery__desc">
            Peça agora pelo WhatsApp e receba o seu açaí favorito no conforto da sua casa.
          </p>

          <a
            href={WHATSAPP_DELIVERY}
            target="_blank"
            rel="noopener noreferrer"
            className="delivery__btn"
          >
            <WhatsAppIcon />
            <span>Pedir agora no WhatsApp</span>
          </a>

          {/* 3 Indicadores de Confiança */}
          <div className="delivery__features">
            
            <div className="delivery__feature-item">
              <div className="delivery__feature-icon">
                <TruckIcon />
              </div>
              <div className="delivery__feature-text">
                <strong>Entrega Rápida</strong>
                <span>Seu açaí fresquinho</span>
              </div>
            </div>

            <div className="delivery__feature-item">
              <div className="delivery__feature-icon">
                <CardIcon />
              </div>
              <div className="delivery__feature-text">
                <strong>Pagamento Fácil</strong>
                <span>Pix ou Cartão</span>
              </div>
            </div>

            <div className="delivery__feature-item">
              <div className="delivery__feature-icon">
                <PinIcon />
              </div>
              <div className="delivery__feature-text">
                <strong>Toda a Região</strong>
                <span>Consulte seu bairro</span>
              </div>
            </div>

          </div>
        </div>

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


function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18.5" r="2.5" />
      <circle cx="7" cy="18.5" r="2.5" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

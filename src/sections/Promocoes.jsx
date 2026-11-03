import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Promocoes.css'

gsap.registerPlugin(ScrollTrigger)

const promos = [
  {
    icon: '🎉',
    titulo: 'Combo Duplo',
    descricao: '2 açaís grandes com até 3 complementos cada por um preço incrível!',
    destaque: 'R$ 39,90',
    antes: 'De R$ 55,80',
    tag: 'Mais Popular',
    cor: '#7c3aed',
  },
  {
    icon: '⚡',
    titulo: 'Segunda Fitness',
    descricao: 'Todas as segundas-feiras, 20% OFF no Açaí Power com qualquer proteína!',
    destaque: '20% OFF',
    antes: 'Toda Segunda-feira',
    tag: 'Semanal',
    cor: '#059669',
  },
  {
    icon: '🎂',
    titulo: 'Aniversariante',
    descricao: 'No seu aniversário, ganhe um açaí médio completamente grátis!',
    destaque: 'GRÁTIS',
    antes: 'No seu aniversário',
    tag: 'Especial',
    cor: '#d97706',
  },
]

export default function Promocoes() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
        }
      )

      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 70, rotation: -2 },
        {
          opacity: 1, y: 0, rotation: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="promocoes" id="promocoes" ref={sectionRef}>
      <div className="section-container">
        <div ref={titleRef} style={{ opacity: 0 }}>
          <p className="section-eyebrow">🔥 Ofertas Especiais</p>
          <h2 className="section-title">
            Nossas <span className="yellow-text">Promoções</span>
          </h2>
          <p className="section-subtitle">
            Aproveite nossas ofertas exclusivas e economize com muito sabor
          </p>
        </div>

        <div className="promocoes__grid">
          {promos.map((p, i) => (
            <div
              key={p.titulo}
              className="promo-card"
              style={{ opacity: 0, '--card-color': p.cor }}
              ref={(el) => { if (el) cardsRef.current[i] = el }}
            >
              <div className="promo-card__tag">{p.tag}</div>
              <div className="promo-card__icon">{p.icon}</div>
              <h3 className="promo-card__titulo">{p.titulo}</h3>
              <p className="promo-card__desc">{p.descricao}</p>
              <div className="promo-card__price">
                <span className="promo-card__antes">{p.antes}</span>
                <span className="promo-card__destaque">{p.destaque}</span>
              </div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="btn-whatsapp promo-card__btn"
              >
                <WhatsAppIcon />
                Aproveitar
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

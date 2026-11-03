import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Cardapio.css'

gsap.registerPlugin(ScrollTrigger)

const WHATSAPP_BASE = 'https://wa.me/5598988759846?text='

const PRODUTOS = [
  {
    id: 'tradicional',
    nome: 'Tradicional',
    descricao: 'Açaí cremoso com banana e granola.',
    preco: 'A partir de R$ 14,90',
    imagem: '/products/acai1.png',
    badge: null,
  },
  {
    id: 'morango',
    nome: 'Morango com Chocolate',
    descricao: 'Açaí, morango, chocolate e granola.',
    preco: 'A partir de R$ 17,90',
    imagem: '/products/acai2.png',
    badge: null,
  },
  {
    id: 'especial',
    nome: 'Especial da City',
    descricao: 'Açaí, confeitos, chocolate, banana e granola.',
    preco: 'A partir de R$ 19,90',
    imagem: '/products/acai3.png',
    badge: null,
  },
  {
    id: 'tropical',
    nome: 'Tropical',
    descricao: 'Açaí, manga, coco ralado e granola.',
    preco: 'A partir de R$ 17,90',
    imagem: '/products/acai4.png',
    badge: null,
  },
]

export default function Cardapio() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Efeito de subida sobre o Hero (Stacking card reveal)
      gsap.fromTo(
        sectionRef.current,
        { y: 60, opacity: 0.95 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            end: 'top 60%',
            scrub: 1,
          },
        }
      )

      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        }
      )

      // Slide suave dos cards (vertical puro, sem deslocamento horizontal para precisão milimétrica do voo 3D)
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="destaques" id="cardapio" ref={sectionRef}>
      <div className="destaques__container">
        
        {/* Cabeçalho da Seção */}
        <div className="destaques__header" ref={headerRef} style={{ opacity: 0 }}>
          <div className="destaques__eyebrow">
            <span className="destaques__line" />
            <span>Nossos Destaques</span>
            <span className="destaques__line" />
          </div>

          <h2 className="destaques__title">
            Os queridinhos <span className="destaques__title-purple">da City</span>
          </h2>

          <p className="destaques__subtitle">
            Combinações deliciosas que são sucesso por aqui!
          </p>
        </div>

        {/* Grid / Slider dos Cards com Copos Saindo pra Cima */}
        <div className="destaques__grid-wrap">
          <div className="destaques__grid" ref={gridRef}>
            {PRODUTOS.map((item, index) => (
              <div
                key={item.id}
                className={`destaque-card ${item.badge ? 'destaque-card--featured' : ''}`}
                style={{ opacity: 0 }}
                ref={(el) => { if (el) cardsRef.current[index] = el }}
              >
                {item.badge && (
                  <div className="destaque-card__badge">{item.badge}</div>
                )}

                {/* Copo de Açaí saindo para fora do card no topo */}
                <div
                  className="destaque-card__img-wrap"
                  id={item.id === 'tradicional' ? 'cardapio-acai-source' : undefined}
                >
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    id={item.id === 'tradicional' ? 'cardapio-acai-img' : undefined}
                    className="destaque-card__img"
                  />
                </div>

                <div className="destaque-card__body">
                  <h3 className="destaque-card__name">{item.nome}</h3>
                  <p className="destaque-card__desc">{item.descricao}</p>

                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="destaque-card__btn-price"
                  >
                    {item.preco}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transição Orgânica de Onda para a Seção Personalize (roxo) */}
      <div className="destaques__wave-bottom" aria-hidden="true">
        <svg viewBox="0 0 1440 65" preserveAspectRatio="none">
          <path d="M0,25 C320,60 680,10 1040,45 C1240,65 1360,35 1440,30 L1440,65 L0,65 Z" fill="#200336" />
        </svg>
      </div>

    </section>
  )
}

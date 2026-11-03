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
        { opacity: 0, scale: 0.9, x: -40 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

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
        
        {/* Lado Esquerdo: Imagem Antiga */}
        <div className="essencia__left" ref={imgRef} style={{ opacity: 0 }}>
          <div className="essencia__img-wrap">
            <div className="essencia__decor-ring" aria-hidden="true" />
            <img
              src="/sections/site1.png"
              alt="Frutos frescos de açaí artesanal"
              className="essencia__img"
            />
          </div>
        </div>

        {/* Lado Direito: Texto Limpo sem os itens selecionados */}
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
        </div>

      </div>

      {/* Onda de Transição Inferior para a Seção Delivery */}
      <div className="essencia__wave-bottom" aria-hidden="true">
        <svg viewBox="0 0 1440 65" preserveAspectRatio="none">
          <path d="M0,20 C360,65 720,15 1080,50 C1260,70 1380,30 1440,35 L1440,65 L0,65 Z" fill="#200336" />
        </svg>
      </div>

    </section>
  )
}

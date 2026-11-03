import './sanctuary-backdrop.css'

/** Fundo do Santuário do Conhecimento: a nave em pixel art, na mesma linguagem das artes dos
 *  heróis — arcos ogivais, pilares, cornija e o piso de lajes em perspectiva, com a brasa
 *  acesa do lado em que a fogueira fica.
 *
 *  O desenho é gerado por `scripts/cena-santuario.py` e sai só de geometria: nada foi copiado.
 *  A imagem é pequena de propósito (480 × 168) e aparece ampliada sem suavização, para o pixel
 *  ficar à mostra. Por cima vai um véu da cor do tema, para o fundo acompanhar quem trocou de
 *  tema na loja. É decorativo: o texto fica por cima, com o seu próprio véu de contraste. */
export function SanctuaryBackdrop() {
  return (
    <div className="sanctuary-backdrop" aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}assets/santuario.png`} alt="" width={480} height={168} decoding="async" />
      <span className="sanctuary-backdrop-tinta" />
    </div>
  )
}

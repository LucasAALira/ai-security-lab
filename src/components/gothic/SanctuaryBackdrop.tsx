import './sanctuary-backdrop.css'

/** Fundo do Santuário do Conhecimento: as ruínas góticas em pixel art — arcos ogivais cobertos de
 *  musgo, pilares, a escadaria e o piso de lajes, com a névoa e a catedral ao longe e uma tocha
 *  acesa em cada ponta.
 *
 *  A imagem (1536 × 1024) vem da arte fornecida pelo autor do projeto (veja `public/assets/CREDITS.md`)
 *  e aparece sem suavização, para o pixel ficar à mostra. A cena ancora na base: é o piso que
 *  recebe a fogueira e o personagem.
 *
 *  Por cima vão duas camadas: a luz da tocha, que segue o ponteiro, e um véu da cor do tema,
 *  para o fundo acompanhar quem trocou de tema na loja. Tudo decorativo: o texto fica por cima,
 *  com o seu próprio véu de contraste. */
export function SanctuaryBackdrop() {
  return (
    <div className="sanctuary-backdrop" aria-hidden="true">
      <img className="sanctuary-backdrop-nave" src={`${import.meta.env.BASE_URL}assets/cursemark/ruinas.png`} alt="" width={1536} height={1024} decoding="async" />
      <span className="sanctuary-backdrop-tocha" />
      <span className="sanctuary-backdrop-tinta" />
    </div>
  )
}

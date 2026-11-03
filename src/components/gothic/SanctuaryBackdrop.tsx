import type React from 'react'
import './sanctuary-backdrop.css'

/** Fundo do Santuário do Conhecimento: a nave em pixel art, na mesma linguagem das artes dos
 *  heróis — arcos ogivais, pilares, cornija e o piso de lajes em perspectiva, com a brasa
 *  acesa do lado em que a fogueira fica.
 *
 *  O desenho é gerado por `scripts/cena-santuario.py` e sai só de geometria: nada foi copiado.
 *  A imagem é pequena de propósito (480 × 168) e aparece ampliada sem suavização, para o pixel
 *  ficar à mostra.
 *
 *  Por cima vão três camadas: as nuvens, que passam devagar e só aparecem dentro dos vidros
 *  (a máscara recorta o caixilho fora); a luz da tocha, que segue o ponteiro; e um véu da cor
 *  do tema, para o fundo acompanhar quem trocou de tema na loja. Tudo decorativo: o texto fica
 *  por cima, com o seu próprio véu de contraste. */
export function SanctuaryBackdrop() {
  // Os caminhos vêm daqui, e não do CSS, porque o site pode ser publicado de qualquer subpasta.
  // O endereço vai absoluto de propósito: dentro de uma variável, o navegador resolve o caminho
  // relativo a partir da folha de estilo, não da página, e o arquivo acabaria procurado em
  // `assets/assets/`.
  const arquivo = (nome: string) => `url("${new URL(`${import.meta.env.BASE_URL}assets/${nome}`, document.baseURI).href}")`
  const arquivos = { '--vidros': arquivo('santuario-vidros.png'), '--nuvens': arquivo('santuario-nuvens.png') } as React.CSSProperties
  return (
    <div className="sanctuary-backdrop" style={arquivos} aria-hidden="true">
      <img className="sanctuary-backdrop-nave" src={`${import.meta.env.BASE_URL}assets/santuario.png`} alt="" width={480} height={168} decoding="async" />
      <span className="sanctuary-backdrop-ceu">
        <span className="sanctuary-backdrop-nuvens" />
      </span>
      <span className="sanctuary-backdrop-tocha" />
      <span className="sanctuary-backdrop-tinta" />
    </div>
  )
}

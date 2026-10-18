"""Gera as relíquias originais (SVG) da Sala de Troféus em public/assets/relics.
Uso: python3 scripts/make-relics.py public/assets/relics
Estilo souls sombrio: ferro, obsidiana, brasa e veneno. Desenho próprio, sem assets de terceiros."""
import sys, os
out = sys.argv[1]
DEFS = '''<defs>
<linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a9fa8"/><stop offset=".42" stop-color="#3d4047"/><stop offset="1" stop-color="#111215"/></linearGradient>
<linearGradient id="iron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c6068"/><stop offset="1" stop-color="#17181b"/></linearGradient>
<linearGradient id="obsidian" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#34363d"/><stop offset=".5" stop-color="#0d0e10"/><stop offset="1" stop-color="#1e2024"/></linearGradient>
<linearGradient id="rust" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7d8083"/><stop offset=".5" stop-color="#3a3b3c"/><stop offset="1" stop-color="#141515"/></linearGradient>
<linearGradient id="blood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a4a"/><stop offset=".55" stop-color="#b3121a"/><stop offset="1" stop-color="#3a0407"/></linearGradient>
<linearGradient id="venom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2ff8a"/><stop offset=".45" stop-color="#78e03f"/><stop offset="1" stop-color="#1f6a1b"/></linearGradient>
<radialGradient id="ember"><stop offset="0" stop-color="#fff2c4"/><stop offset=".35" stop-color="#ffa040"/><stop offset=".7" stop-color="#ff3333" stop-opacity=".55"/><stop offset="1" stop-color="#ff3333" stop-opacity="0"/></radialGradient>
<radialGradient id="void" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4a1420"/><stop offset=".6" stop-color="#14060a"/><stop offset="1" stop-color="#050203"/></radialGradient>
<filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="haze" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
</defs>'''
EDGE = 'stroke="#d9dce2" stroke-opacity=".5" stroke-width="1" stroke-linejoin="round"'

def svg(name, title, body):
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>{title}</title>{DEFS}{body}</svg>\n'
    open(os.path.join(out, name + '.svg'), 'w').write(s)

def wraps(x, y0, y1, w, step=4):
    return ''.join(f'<path d="M{x} {y} l{w} 3" stroke="#4a4d55" stroke-width="1.2"/>' for y in range(y0, y1, step))

# 1. Espada Negra da IA
svg('black-blade', 'Espada Negra da IA', f'''
<g transform="rotate(-36 64 64)">
<ellipse cx="64" cy="50" rx="10" ry="46" fill="#ff3333" opacity=".18" filter="url(#haze)"/>
<path d="M64 3 L72.5 20 L71 86 H57 L55.5 20 Z" fill="url(#obsidian)" {EDGE}/>
<path d="M64 3 L55.5 20 L57 86 H64 Z" fill="#fff" opacity=".07"/>
<g stroke="#ff3333" stroke-width="1.3" fill="none" filter="url(#glow)" stroke-linecap="square">
<path d="M64 24 V80 M64 32 H67.5 V37 M64 45 H60.5 V50 M64 58 H67.5 V63 M64 70 H60.5 V75"/>
</g>
<g fill="#ffb3a8"><circle cx="67.5" cy="37" r="1.2"/><circle cx="60.5" cy="50" r="1.2"/><circle cx="67.5" cy="63" r="1.2"/><circle cx="60.5" cy="75" r="1.2"/></g>
<path d="M64 84 L80 82 L95 72 L92 84 L80 90.5 L64 91.5 L48 90.5 L36 84 L33 72 L48 82 Z" fill="url(#steel)" {EDGE}/>
<path d="M95 72 L99 66 M33 72 L29 66" stroke="#9a9fa8" stroke-width="1.6" stroke-linecap="round"/>
<path d="M64 84 l4 4 l-4 4 l-4 -4 Z" fill="url(#blood)" filter="url(#glow)"/>
<rect x="60.5" y="91" width="7" height="20" fill="#18191c" {EDGE}/>
{wraps(60.5, 92, 110, 7)}
<path d="M64 110 L70.5 116 L64 125 L57.5 116 Z" fill="url(#steel)" {EDGE}/>
<path d="M64 113.5 l2.6 2.6 l-2.6 3.4 l-2.6 -3.4 Z" fill="#ff3333" filter="url(#glow)"/>
</g>''')

# 2. Montante Envenenado
svg('venom-greatsword', 'Montante Envenenado', f'''
<g transform="rotate(34 64 64)">
<ellipse cx="64" cy="34" rx="16" ry="26" fill="#78e03f" opacity=".2" filter="url(#haze)"/>
<path d="M64 2 L77 17 L78 22 L74.5 29 L78 33 L77 84 H51 L50 33 L53.5 29 L50 22 L51 17 Z" fill="url(#rust)" {EDGE}/>
<path d="M64 2 L51 17 L50 22 L53.5 29 L50 33 L51 84 H64 Z" fill="#fff" opacity=".06"/>
<path d="M64 20 V80" stroke="#0c0d0e" stroke-width="2.4"/>
<path d="M58 60 l3 2 M70 68 l-3 1 M60 74 l2 -2" stroke="#0c0d0e" stroke-width="1"/>
<path d="M64 2 L77 17 L78 22 L74.5 29 L78 33 L77.6 46 Q73 51 70.5 46 Q67.5 55 64 48 Q60 57 57.5 46 Q54 52 50.4 46 L50 33 L53.5 29 L50 22 L51 17 Z" fill="url(#venom)" opacity=".88" filter="url(#glow)"/>
<path d="M70.5 46 q1.6 7 0 12 q-1.6 -5 0 -12 Z M57.5 46 q2 10 0 17 q-2 -7 0 -17 Z M64 48 q1.2 4 0 7 q-1.2 -3 0 -7 Z" fill="#9cf05a"/>
<circle cx="57.5" cy="71" r="2" fill="#9cf05a" filter="url(#glow)"/><circle cx="70.5" cy="64" r="1.5" fill="#9cf05a"/>
<g fill="#eaffb0" opacity=".85"><circle cx="61" cy="18" r="1.4"/><circle cx="67" cy="28" r="1.1"/><circle cx="59" cy="36" r="1"/><circle cx="70" cy="40" r="1.3"/></g>
<path d="M36 84 H92 L96 88 L92 92 H36 L32 88 Z" fill="url(#steel)" {EDGE}/>
<path d="M36 92 L33 99 M92 92 L95 99" stroke="#8a8e96" stroke-width="2.2" stroke-linecap="round"/>
<circle cx="64" cy="88" r="3.2" fill="url(#venom)" filter="url(#glow)"/>
<rect x="60" y="92" width="8" height="25" fill="#1d1b19" {EDGE}/>
{wraps(60, 93, 116, 8)}
<circle cx="64" cy="120.5" r="5" fill="url(#steel)" {EDGE}/>
<circle cx="64" cy="120.5" r="1.8" fill="#9cf05a"/>
</g>
<g fill="none" stroke="#9cf05a" stroke-opacity=".35" stroke-width="1.2" stroke-linecap="round">
<path d="M88 30 q6 -6 2 -12 q-3 -4 2 -8"/><path d="M98 44 q5 -4 2 -9"/>
</g>''')

# 3. Brasa (lanterna de ferro)
svg('burning-embers', 'Brasa do Primeiro Passo', f'''
<circle cx="64" cy="70" r="40" fill="url(#ember)" opacity=".6"/>
<circle cx="64" cy="9" r="5" fill="none" stroke="url(#steel)" stroke-width="3"/>
<path d="M64 14 V20" stroke="#6b6f78" stroke-width="2.4"/>
<path d="M44 36 L64 18 L84 36 Z" fill="url(#steel)" {EDGE}/>
<path d="M46 36 H82 V96 H46 Z" fill="#0b0b0d" fill-opacity=".55" stroke="url(#iron)" stroke-width="3"/>
<path d="M46 50 Q64 38 82 50" fill="none" stroke="url(#iron)" stroke-width="2.4"/>
<circle cx="64" cy="76" r="18" fill="url(#ember)"/>
<polygon points="64,50 72,66 69.5,80 64,84 58.5,80 56,66" fill="#ff4a33" filter="url(#glow)"/>
<polygon points="64,60 67.5,69 66,79 64,81 62,79 60.5,69" fill="#ffb340"/>
<polygon points="64,68 65.6,74 64,79 62.4,74" fill="#fff2c4"/>
<path d="M53 88 L59 82 L66 86 L74 81 L77 88 Z" fill="#141416"/>
<path d="M57 86 l3 -2 M68 84 l3 1" stroke="#ff7a3a" stroke-width="1"/>
<path d="M55 36 V96 M73 36 V96" stroke="url(#iron)" stroke-width="2.6"/>
<path d="M40 96 H88 L81 107 H47 Z" fill="url(#steel)" {EDGE}/>
<g fill="#ffb340" filter="url(#glow)"><rect x="62" y="40" width="2.4" height="2.4" transform="rotate(45 63 41)"/><rect x="70" y="44" width="1.8" height="1.8" transform="rotate(45 71 45)"/><rect x="57" y="45" width="1.8" height="1.8" transform="rotate(45 58 46)"/></g>''')

# 4. Chave do Guardião
svg('key', 'Chave do Guardião', f'''
<g transform="rotate(-38 64 64)">
<circle cx="64" cy="28" r="17" fill="none" stroke="url(#steel)" stroke-width="7"/>
<circle cx="64" cy="28" r="17" fill="none" {EDGE}/>
<path d="M64 15 Q72 23 72 32 V37 H56 V32 Q56 23 64 15 Z" fill="url(#blood)" filter="url(#glow)"/>
<path d="M64 20 V34 M60 30 H68" stroke="#ffd0c8" stroke-width=".9" stroke-opacity=".8"/>
<path d="M50 14 l-6 -6 M78 14 l6 -6 M64 9 V3" stroke="#8a8e96" stroke-width="2.2" stroke-linecap="round"/>
<rect x="60.5" y="45" width="7" height="62" fill="url(#iron)" {EDGE}/>
<rect x="57" y="46" width="14" height="5" fill="url(#steel)" {EDGE}/><rect x="58" y="57" width="12" height="4" fill="url(#steel)" {EDGE}/>
<path d="M64 64 V100" stroke="#ff3333" stroke-width="1" filter="url(#glow)"/>
<path d="M67.5 86 H83 V92 H77 V97 H83 V103 H77 V108 H67.5 Z" fill="url(#steel)" {EDGE}/>
<circle cx="64" cy="100" r="1.4" fill="#ff8a7a"/>
</g>''')

# 5. Orbe da Vigilância
svg('crystal-ball', 'Orbe da Vigilância', f'''
<circle cx="64" cy="58" r="34" fill="#ff3333" opacity=".14" filter="url(#haze)"/>
<circle cx="64" cy="58" r="26" fill="url(#void)" {EDGE}/>
<path d="M44 58 Q64 44 84 58 Q64 72 44 58 Z" fill="url(#blood)" filter="url(#glow)"/>
<circle cx="64" cy="58" r="7.5" fill="none" stroke="#ffb3a8" stroke-width="1" stroke-opacity=".7"/>
<ellipse cx="64" cy="58" rx="2.2" ry="9" fill="#050505"/>
<path d="M48 44 Q55 36 66 35" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>
<path d="M40 112 H88 L80 99 H48 Z" fill="url(#steel)" {EDGE}/>
<path d="M50 100 C36 92 34 70 42 56 L45 60 C40 72 44 88 54 96 Z" fill="url(#steel)" {EDGE}/>
<path d="M78 100 C92 92 94 70 86 56 L83 60 C88 72 84 88 74 96 Z" fill="url(#steel)" {EDGE}/>
<path d="M60 99 L64 80 L68 99 Z" fill="url(#steel)" {EDGE}/>
<path d="M50 106 H78" stroke="#ff3333" stroke-width="1" stroke-opacity=".7"/>''')

# 6. Elo Inquebrável (coração acorrentado)
links = ''.join(f'<ellipse cx="{24+i*14}" cy="{36+i*9.2}" rx="8.5" ry="4.6" transform="rotate(33 {24+i*14} {36+i*9.2})" fill="none" stroke="url(#steel)" stroke-width="3.6"/>' for i in range(7))
svg('chained-heart', 'Elo Inquebrável', f'''
<path d="M64 108 C30 84 24 58 38 45 C49 35 60 39 64 50 C68 39 79 35 90 45 C104 58 98 84 64 108 Z" fill="#ff3333" opacity=".18" filter="url(#haze)"/>
<path d="M64 104 C33 82 28 59 40 48 C50 39 60 43 64 53 C68 43 78 39 88 48 C100 59 95 82 64 104 Z" fill="url(#blood)" {EDGE}/>
<path d="M64 53 L60 66 L67 74 L61 86 M48 56 L55 64 M80 58 L72 66 L75 76" fill="none" stroke="#ffb3a8" stroke-width="1.1" filter="url(#glow)"/>
<path d="M40 52 Q46 46 54 47" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>
{links}
<rect x="57" y="68" width="14" height="12" fill="url(#iron)" {EDGE}/>
<path d="M60 68 V64 Q64 58 68 64 V68" fill="none" stroke="url(#steel)" stroke-width="2.4"/>
<circle cx="64" cy="73" r="1.6" fill="#ff3333"/>''')

# 7. Anel das Fronteiras
svg('ring', 'Anel das Fronteiras', f'''
<ellipse cx="64" cy="80" rx="36" ry="21" fill="none" stroke="#2a2c31" stroke-width="11"/>
<path d="M28 80 A36 21 0 0 0 100 80" fill="none" stroke="url(#steel)" stroke-width="11"/>
<ellipse cx="64" cy="80" rx="41" ry="26" fill="none" {EDGE}/>
<ellipse cx="64" cy="80" rx="31" ry="16" fill="none" stroke="#d9dce2" stroke-opacity=".25"/>
<path d="M40 92 l3 -3 M50 98 l2 -4 M64 101 v-4 M78 98 l-2 -4 M88 92 l-3 -3" stroke="#ff3333" stroke-width="1.2" stroke-opacity=".8"/>
<path d="M52 58 L48 46 M76 58 L80 46 M58 60 L56 40 M70 60 L72 40" stroke="url(#steel)" stroke-width="3" stroke-linecap="round"/>
<circle cx="64" cy="44" r="18" fill="#ff3333" opacity=".22" filter="url(#haze)"/>
<path d="M64 24 L77 42 L64 60 L51 42 Z" fill="url(#blood)" filter="url(#glow)" {EDGE}/>
<path d="M64 24 L64 60 M51 42 H77 M57 33 L71 51 M71 33 L57 51" stroke="#ffd0c8" stroke-opacity=".35" stroke-width=".8"/>''')

# 8. Códice do Arquiteto
spokes = ''.join(f'<path d="M0 -6 V-12 l4 -4" transform="rotate({a})"/>' for a in range(0, 360, 45))
svg('spell-book', 'Códice do Arquiteto', f'''
<path d="M38 18 H96 V110 H38 Z" fill="#0d0e10"/>
<path d="M92 20 H98 V108 H92 Z" fill="#c9ccd4" opacity=".55"/>
<path d="M93 26 H97 M93 40 H97 M93 54 H97 M93 68 H97 M93 82 H97 M93 96 H97" stroke="#5b5f68" stroke-width=".8"/>
<rect x="30" y="16" width="62" height="96" fill="url(#obsidian)" {EDGE}/>
<rect x="30" y="16" width="9" height="96" fill="url(#iron)" {EDGE}/>
<path d="M30 16 h12 l-12 12 Z M92 16 h-12 l12 12 Z M30 112 h12 l-12 -12 Z M92 112 h-12 l12 -12 Z" fill="url(#steel)" {EDGE}/>
<path d="M65 30 Q80 40 80 58 V92 H50 V58 Q50 40 65 30 Z" fill="none" stroke="#ff3333" stroke-width="1.3" filter="url(#glow)"/>
<g transform="translate(65 60)" fill="none" stroke="#ff3333" stroke-width="1.1" filter="url(#glow)"><circle r="6"/><circle r="16" stroke-opacity=".7"/>{spokes}</g>
<path d="M65 76 V92 M57 84 H73" stroke="#ff3333" stroke-opacity=".6"/>
<path d="M86 52 H102 V70 H86" fill="none" stroke="url(#steel)" stroke-width="4"/>
<rect x="98" y="56" width="8" height="10" fill="url(#steel)" {EDGE}/>''')

# 9. Cofre das Memórias
svg('locked-chest', 'Cofre das Memórias', f'''
<ellipse cx="64" cy="62" rx="44" ry="10" fill="#ff3333" opacity=".25" filter="url(#haze)"/>
<path d="M24 62 V50 Q24 28 64 22 Q104 28 104 50 V62 Z" fill="url(#obsidian)" {EDGE}/>
<rect x="24" y="62" width="80" height="44" fill="url(#obsidian)" {EDGE}/>
<path d="M24 62 H104" stroke="#ff3333" stroke-width="1.4" filter="url(#glow)"/>
<path d="M38 25 V106 M90 25 V106" stroke="url(#steel)" stroke-width="6"/>
<path d="M24 98 H104" stroke="url(#steel)" stroke-width="4"/>
<g fill="#b9bdc5"><circle cx="38" cy="40" r="1.6"/><circle cx="90" cy="40" r="1.6"/><circle cx="38" cy="80" r="1.6"/><circle cx="90" cy="80" r="1.6"/></g>
<path d="M54 56 H74 V82 L64 90 L54 82 Z" fill="url(#steel)" {EDGE}/>
<path d="M64 64 a4 4 0 1 1 0.01 0 Z M62 67 L60.5 78 H67.5 L66 67 Z" fill="#ffb340" filter="url(#glow)"/>
<path d="M18 106 H110 L104 112 H24 Z" fill="url(#iron)" {EDGE}/>''')

# 10. Relíquia do Dragão (crânio frontal)
L = [(64,28),(54,30),(46,36),(42,46),(41,56),(31,60),(39,66),(46,70),(50,82),(54,96),(58,108),(64,114)]
R = [(128-x,y) for x,y in reversed(L[1:-1])]
skull = 'M' + ' L'.join(f'{x} {y}' for x,y in L + R) + ' Z'
teeth = ''.join(f'<path d="M{x} {y} l1.5 4 l1.5 -4 Z M{128-x-3} {y} l1.5 4 l1.5 -4 Z" fill="#d9dce2"/>' for x,y in [(50,84),(52,90),(54,96)])
svg('dragon-head', 'Relíquia do Dragão', f'''
<ellipse cx="64" cy="58" rx="40" ry="30" fill="#ff3333" opacity=".16" filter="url(#haze)"/>
<path d="M47 37 C36 32 28 21 27 4 C35 16 43 22 55 30 Z" fill="url(#steel)" {EDGE}/>
<path d="M81 37 C92 32 100 21 101 4 C93 16 85 22 73 30 Z" fill="url(#steel)" {EDGE}/>
<path d="M41 56 L22 62 L38 64 Z M87 56 L106 62 L90 64 Z" fill="url(#iron)" {EDGE}/>
<path d="{skull}" fill="url(#iron)" {EDGE}/>
<path d="M64 28 V60" stroke="#0b0b0d" stroke-width="1.4"/>
<path d="M58 32 L64 26 L70 32 M60 40 L64 36 L68 40" fill="none" stroke="#9a9fa8" stroke-width="1.2"/>
<path d="M45 47 L57 51 L55 59 L45 55 Z M83 47 L71 51 L73 59 L83 55 Z" fill="#050505"/>
<path d="M47.5 50.5 L54 53 L53 56 L47.5 54 Z M80.5 50.5 L74 53 L75 56 L80.5 54 Z" fill="#ff3333" filter="url(#glow)"/>
<path d="M60 102 l2 4 M68 102 l-2 4" stroke="#050505" stroke-width="2" stroke-linecap="round"/>
{teeth}''')

# 11. Coroa (de espinhos, ferro)
spikes = [(34,76,30,50),(47,80,44,40),(64,82,64,26),(81,80,84,40),(94,76,98,50)]
sp = ''.join(f'<path d="M{x-6} {y} L{tx} {ty} L{x+6} {y} Z" fill="url(#steel)" {EDGE}/>' for x,y,tx,ty in spikes)
gems = ''.join(f'<path d="M{tx} {ty+10} l2.5 3 l-2.5 3.5 l-2.5 -3.5 Z" fill="#ff3333" filter="url(#glow)"/>' for x,y,tx,ty in spikes if tx!=64)
svg('crown', 'Coroa', f'''
<ellipse cx="64" cy="84" rx="44" ry="18" fill="#ff3333" opacity=".15" filter="url(#haze)"/>
{sp}
<path d="M28 76 Q64 90 100 76 L98 92 Q64 106 30 92 Z" fill="url(#iron)" {EDGE}/>
<path d="M30 84 Q64 98 98 84" fill="none" stroke="#ff3333" stroke-width="1" stroke-opacity=".7"/>
<path d="M64 40 l6 7 l-6 9 l-6 -9 Z" fill="url(#blood)" filter="url(#glow)"/>
{gems}''')
print('ok')

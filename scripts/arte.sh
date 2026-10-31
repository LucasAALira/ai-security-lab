#!/bin/sh
# Desenho de abertura do AI Security Lab. Gerado por `npm run arte:gerar` a partir de scripts/arte.mjs. Não edite à mão.
#
# Uso:  sh scripts/arte.sh            (sorteia)
#       sh scripts/arte.sh cadeado    (escolhe pelo nome)
#       sh scripts/arte.sh --lista    (mostra os nomes)
#
# Para ver o desenho ao abrir o terminal, acrescente ao ~/.bashrc ou ~/.zshrc:
#   [ -t 1 ] && sh "$HOME/ai-security-lab/scripts/arte.sh"

NOMES='hacker cadeado chave escudo bug terminal dragao caveira fogueira'

if [ "$1" = "--lista" ]; then
  for n in $NOMES; do echo "$n"; done
  exit 0
fi

# Cor só quando o terminal aceita: sem TTY, com NO_COLOR ou TERM=dumb, texto puro.
# FORCE_COLOR força a cor mesmo sem TTY, como no `arte.mjs`.
COR_BRASA=""; COR_OURO=""; COR_TITANIO=""; COR_FIM=""
if { [ -t 1 ] || [ -n "$FORCE_COLOR" ]; } && [ -z "$NO_COLOR" ] && [ "$TERM" != "dumb" ]; then
  COR_BRASA=$(printf '\033[38;5;203m')
  COR_OURO=$(printf '\033[38;5;180m')
  COR_TITANIO=$(printf '\033[38;5;245m')
  COR_FIM=$(printf '\033[0m')
fi

figura_0() {
  INSCRICAO='Todo dado que vem de fora é entrada não confiável.'
  COR="$COR_BRASA"
  cat <<'DESENHO'
         ,--------.
       ,'  ,----.  `.
      /   /      \   \
     |   |  o  o  |   |
     |   |   __   |   |
      \   \ `--' /   /
       `.  `----'  ,'
     ____`--------'____
    /  [#][#][#][#][#]  \
   '---------------------'
DESENHO
}
figura_1() {
  INSCRICAO='Autenticado não é o mesmo que autorizado.'
  COR="$COR_OURO"
  cat <<'DESENHO'
         .-------.
       .'         '.
      /   .-----.   \
     |   |       |   |
   .-+---+-------+---+-.
   |                   |
   |        .---.      |
   |        | o |      |
   |        '-|-'      |
   |          |        |
   '-------------------'
DESENHO
}
figura_2() {
  INSCRICAO='Segredo no código acompanha cada cópia do repositório.'
  COR="$COR_OURO"
  cat <<'DESENHO'
      .-""-.
     /  .-. \
    |  ( o )  |
     \  '-'  /
      '-..-'
        ||
        ||
        |+--.
        ||  |
        '+--'
DESENHO
}
figura_3() {
  INSCRICAO='Uma camada só sempre deixa uma brecha.'
  COR="$COR_BRASA"
  cat <<'DESENHO'
    .-----------------.
    |  \           /  |
    |   \  /\ /\  /   |
     \   \/  V  \/   /
      \   \  |  /   /
       \   \ | /   /
        \   \|/   /
         \       /
          \     /
           '---'
DESENHO
}
figura_4() {
  INSCRICAO='A falha que ninguém reproduz continua lá.'
  COR="$COR_TITANIO"
  cat <<'DESENHO'
     \         /
      \  ___  /
       .-'   '-.
    --|  o   o  |--
      |  .---.  |
    --|  |   |  |--
      '-.     .-'
    --/  \___/  \--
      /         \
DESENHO
}
figura_5() {
  INSCRICAO='Registro sem retenção não responde à pergunta do dia seguinte.'
  COR="$COR_TITANIO"
  cat <<'DESENHO'
   .---------------------.
   | o o o               |
   |---------------------|
   |  $ grep -r segredo  |
   |  src/config.ts:12   |
   |  _                  |
   '---------------------'
      \_______________/
DESENHO
}
figura_6() {
  INSCRICAO='O chefe do módulo espera a fogueira acesa.'
  COR="$COR_BRASA"
  cat <<'DESENHO'
           /\   /\
          /  \_/  \
     .---(  o   o  )---.
    /     \   ^   /     \
   |  ~~~  '--v--'  ~~~  |
    \     __|   |__     /
     '---'  '---'  '---'
        ~  ~   ~  ~
DESENHO
}
figura_7() {
  INSCRICAO='Falso positivo fechado sem justificativa sempre volta.'
  COR="$COR_TITANIO"
  cat <<'DESENHO'
       .-"""""-.
      /  _   _  \
     |  (o) (o)  |
     |     ^     |
      \  \___/  /
       '-.___.-'
      |_|_|_|_|_|
DESENHO
}
figura_8() {
  INSCRICAO='Backup que nunca foi restaurado é hipótese, não controle.'
  COR="$COR_BRASA"
  cat <<'DESENHO'
         (  .      )
     )           (     )
           .  '  .
    (    (    ,     )   )
      )   .  (   .    )
       ( ,  )  (  ,  )
        ;  )   (   ;
   _____\_|_____|_/_____
  /______|_______|______\
DESENHO
}

# Sorteio portátil: o número do processo muda a cada execução, mesmo sem $RANDOM.
TOTAL=9
ESCOLHA=""
INDICE=0
if [ -n "$1" ]; then
  for n in $NOMES; do
    if [ "$n" = "$1" ]; then ESCOLHA=$INDICE; fi
    INDICE=$((INDICE + 1))
  done
  if [ -z "$ESCOLHA" ]; then
    echo "Desenho desconhecido: $1" >&2
    echo "Disponíveis: $NOMES" >&2
    exit 1
  fi
else
  ESCOLHA=$(( ($$ + $(date +%s)) % TOTAL ))
fi

echo
printf '%s  AI SECURITY LAB%s\n' "$COR_OURO" "$COR_FIM"
printf '%s  ---------------%s\n' "$COR_TITANIO" "$COR_FIM"
echo
printf '%s' "$COR_BRASA"
eval "figura_$ESCOLHA"
printf '%s' "$COR_FIM"
echo
printf '%s  "%s"%s\n' "$COR_OURO" "$INSCRICAO" "$COR_FIM"
printf '%s  estudo de AppSec e IA, em português%s\n' "$COR_TITANIO" "$COR_FIM"
echo

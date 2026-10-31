#!/bin/sh
cd "$(dirname "$0")" || exit 1
# Desenho de abertura (sorteado). Se o arquivo não estiver aqui, segue o jogo.
[ -f scripts/arte.sh ] && sh scripts/arte.sh
if ! command -v python3 >/dev/null 2>&1; then
  echo 'Instale Python 3 para iniciar o site.'
  exit 1
fi
exec python3 iniciar.py "$@"

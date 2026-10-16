#!/bin/sh
cd "$(dirname "$0")" || exit 1
if ! command -v python3 >/dev/null 2>&1; then
  echo 'Instale Python 3 para iniciar o site.'
  exit 1
fi
exec python3 iniciar.py "$@"

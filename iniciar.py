#!/usr/bin/env python3
"""Servidor local do AI Security Lab; apenas biblioteca padrao do Python.

Serve o site ja gerado na pasta `dist/` (veja o README para gerar de novo com Node).
"""
import argparse
import functools
import http.server
import pathlib
import threading
import webbrowser


class Handler(http.server.SimpleHTTPRequestHandler):
    """Garante os tipos de arquivo que o navegador exige dos modulos JavaScript e do WebAssembly
    (no Windows o Python as vezes serve .js como texto simples, e o site nao abriria)."""

    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'text/javascript',
        '.mjs': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.wasm': 'application/wasm',
        '.woff2': 'font/woff2',
    }

    def end_headers(self):
        # Os arquivos tem nome com codigo no final; so a pagina inicial muda de nome. Sem cache longo,
        # uma versao nova do site aparece assim que a pagina e recarregada.
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, format, *args):  # noqa: A002 - mantem o terminal limpo
        pass


def main():
    parser = argparse.ArgumentParser(description='AI Security Lab em localhost')
    parser.add_argument('--porta', type=int, default=8080)
    parser.add_argument('--sem-navegador', action='store_true')
    args = parser.parse_args()
    if not 1 <= args.porta <= 65535:
        parser.error('A porta deve estar entre 1 e 65535.')
    root = pathlib.Path(__file__).resolve().parent / 'dist'
    if not (root / 'index.html').is_file():
        print('O site ainda nao foi gerado (falta a pasta dist/).\n'
              'Com o Node.js instalado, rode: npm install && npm run build')
        return 1
    handler = functools.partial(Handler, directory=str(root))
    try:
        server = http.server.ThreadingHTTPServer(('127.0.0.1', args.porta), handler)
    except OSError as exc:
        print(f'Nao foi possivel iniciar: {exc}\nTente: python iniciar.py --porta 8081')
        return 1
    url = f'http://localhost:{args.porta}'
    print(f'AI Security Lab: {url}\nMantenha este terminal aberto. Ctrl+C para encerrar.', flush=True)
    if not args.sem_navegador:
        timer = threading.Timer(0.7, webbrowser.open, args=(url,))
        timer.daemon = True
        timer.start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServidor encerrado.')
    finally:
        server.server_close()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

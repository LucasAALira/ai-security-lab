#!/usr/bin/env python3
"""Servidor local do AI Security Lab; apenas biblioteca padrao do Python."""
import argparse
import functools
import http.server
import pathlib
import threading
import webbrowser


def main():
    parser = argparse.ArgumentParser(description='AI Security Lab em localhost')
    parser.add_argument('--porta', type=int, default=8080)
    parser.add_argument('--sem-navegador', action='store_true')
    args = parser.parse_args()
    if not 1 <= args.porta <= 65535:
        parser.error('A porta deve estar entre 1 e 65535.')
    root = pathlib.Path(__file__).resolve().parent / 'site'
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(root))
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

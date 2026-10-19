#!/usr/bin/env python3
"""Servidor local do AI Security Lab; apenas biblioteca padrao do Python.

Serve o site ja gerado na pasta `dist/` (veja o README para gerar de novo com Node).
"""
import argparse
import functools
import http.server
import pathlib
import socket
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


def network_addresses():
    """IPv4 locais; consultar a rota nao envia dados para a internet."""
    addresses = set()
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as probe:
            probe.connect(('192.0.2.1', 80))
            addresses.add(probe.getsockname()[0])
    except OSError:
        pass
    try:
        addresses.update(socket.gethostbyname_ex(socket.gethostname())[2])
    except OSError:
        pass
    return sorted(ip for ip in addresses if not ip.startswith('127.') and ip != '0.0.0.0')


def main():
    parser = argparse.ArgumentParser(description='AI Security Lab na rede local')
    parser.add_argument('--porta', type=int, default=8080)
    parser.add_argument('--host', default='0.0.0.0',
                        help='Interface IPv4 (padrao: todas; use 127.0.0.1 para acesso apenas neste computador)')
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
        server = http.server.ThreadingHTTPServer((args.host, args.porta), handler)
    except OSError as exc:
        print(f'Nao foi possivel iniciar: {exc}\nTente: python iniciar.py --porta 8081')
        return 1
    hosts = network_addresses() if args.host == '0.0.0.0' else [args.host]
    urls = [f'http://{host}:{args.porta}' for host in hosts]
    url = urls[0] if urls else f'http://127.0.0.1:{args.porta}'
    print('AI Security Lab — enderecos de acesso:')
    for address in urls:
        print(f'  {address}')
    if not urls:
        print(f'  Neste computador: {url}\n  Na rede: use o IPv4 do computador (ipconfig no Windows).')
    print('Celular e computador devem estar na mesma rede. Libere a porta no firewall apenas na rede privada.\n'
          'O servidor nao tem login; use somente em rede confiavel.\n'
          'Mantenha este terminal aberto. Ctrl+C para encerrar.', flush=True)
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

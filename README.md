# AI Security Lab

**Central de estudos sobre segurança de inteligência artificial para profissionais de AppSec, Security Champions e desenvolvedores.**

Um site de aprendizado em português que reúne matérias, tarefas, perguntas de múltipla escolha e cenários de correção de vulnerabilidades. A proposta é conectar conceitos de segurança de IA com decisões do dia a dia das empresas.

## Temas de estudo

- OWASP Top 10 para aplicações com LLMs.
- Injeção de prompt e seus impactos.
- MITRE ATLAS.
- Red teaming em IA.
- NIST AI Risk Management Framework (AI RMF).
- ISO/IEC 42001.
- LGPD aplicada à inteligência artificial.
- Regulamento europeu de inteligência artificial (AI Act).

As matérias possuem páginas internas: o conteúdo de estudo pode ser lido dentro do próprio site.

## Funcionalidades

- **Trilhas de aprendizado:** objetivos, pré-requisitos educacionais e tarefas de estudo.
- **Gamificação:** XP e níveis associados às atividades registradas e aos exercícios.
- **Medalhas:** 26 medalhas em quatro raridades (bronze, prata, ouro e dragão) por leitura, pesquisa, prática, questões, módulos, trilhas, laboratório, cenários e dias seguidos de estudo. Cada uma dá XP bônus uma única vez (10, 20, 40 e 100 XP) e as bloqueadas mostram quanto falta.
- **Evolução por trilha:** cada trilha (Fundamentos, Ataques e defesa, Governança e Regulação) mostra XP, módulos e tarefas concluídas, com medalha bronze a partir de 40%, prata a partir de 70% e ouro aos 100%. Os módulos também recebem a medalha pelo mesmo critério.
- **Pontos de melhoria:** sugestões calculadas pelo progresso: questões que ainda não foram acertadas, módulos quase concluídos, o próximo módulo com pré-requisitos em dia, o laboratório e os cenários pendentes.
- **Quiz:** perguntas de múltipla escolha com correção e explicações.
- **Cenários de remediação:** situações fictícias organizadas por porte de empresa, com alternativas de solução e feedback.
- **Anotações e progresso:** armazenamento local no navegador.
- **Ferramentas e pentest de LLMs:** material textual com exemplos técnicos e situações do cotidiano.
- **Engenharia reversa:** reflexão sobre riscos, incluindo credenciais embutidas no código de aplicações e clientes de serviços SaaS.
- **Interface responsiva:** tema escuro com destaques vermelhos e emblema de dois dragões formando um cadeado.

> Os cenários são exercícios educacionais de decisão. O projeto não provisiona máquinas virtuais nem executa ataques, ferramentas de pentest ou ambientes vulneráveis.

## Executar localmente

### Requisito

Python **3.8 ou superior**. Não é necessário instalar pacotes adicionais.

Baixe o pacote local, extraia todos os arquivos e abra um terminal na pasta que contém `iniciar.py`.

### Windows

Execute o iniciador:

```powershell
.\iniciar-windows.bat
```

Ou execute diretamente com Python:

```powershell
py -3 iniciar.py
```

### Linux e macOS

```bash
sh iniciar-linux-mac.sh
```

Ou:

```bash
python3 iniciar.py
```

O navegador abrirá em **http://localhost:8080**. Mantenha o terminal aberto enquanto utiliza o site. Para encerrar, pressione **Ctrl+C**.

### Opções

Se a porta estiver ocupada:

```bash
python3 iniciar.py --porta 8081
```

Para iniciar sem abrir o navegador automaticamente:

```bash
python3 iniciar.py --sem-navegador
```

No Windows, substitua `python3` por `py -3` nesses exemplos.

O servidor escuta apenas em `127.0.0.1`. Após instalar Python e baixar os arquivos, o conteúdo incluído funciona sem conexão com a internet.

## Estrutura do pacote local

| Arquivo ou pasta | Finalidade |
| --- | --- |
| `iniciar.py` | Servidor HTTP local e abertura do navegador. |
| `iniciar-windows.bat` | Iniciador para Windows. |
| `iniciar-linux-mac.sh` | Iniciador para Linux/macOS. |
| `site/index.html` | Página inicial. |
| `site/materias/` | Páginas com os conteúdos de estudo. |
| `site/assets/` | Imagens e identidade visual. |
| `site/style.css` | Estilos e layout responsivo. |
| `site/app.js` | Interações da página principal. |
| `site/progress.js` | Progresso e pontuação. |
| `site/pentest-reading.html` | Conteúdo textual sobre pentest de LLMs. |
| `LEIA-ME.txt` | Instruções rápidas de execução. |

Para usar este README no repositório, coloque-o na raiz, junto de `iniciar.py` e da pasta `site/` do pacote extraído.

## Progresso e privacidade

O progresso fica no `localStorage` do navegador. Não há conta de usuário, banco de dados remoto ou sincronização entre dispositivos nesta versão.

- Use o mesmo navegador, endereço e porta para continuar de onde parou.
- Limpar os dados do site no navegador pode apagar o progresso.
- O progresso da versão hospedada não é transferido automaticamente para a versão local.
- Alterar entre `localhost` e `127.0.0.1`, ou mudar a porta, utiliza outro armazenamento do navegador.
- O XP reflete atividades registradas na interface; não comprova domínio técnico nem valida pesquisas externas.
- Além das tarefas, o navegador guarda a data de cada medalha, o número de erros por questão (usado nos pontos de melhoria e nas medalhas de precisão) e a sequência de dias de estudo. O progresso salvo por versões anteriores continua válido; as medalhas já merecidas são reconhecidas ao abrir o site, exceto as de acerto de primeira, que dependem de erros que antes não eram registrados.
- O XP bônus das medalhas é calculado a partir do progresso salvo, sem contar duas vezes. O XP máximo passa a ser 1.660: 1.070 em tarefas e 590 em medalhas. Foram acrescentados dois níveis acima de “Defensor de IA”: “Guardião de IA” (1.250 XP) e “Mestre Dragão” (1.500 XP).

## Uso educacional

A seção de pentest exige digitar **“me responsabilizo”** antes de exibir o material. Essa confirmação é apenas uma etapa da interface, não um mecanismo de autenticação ou proteção dos arquivos.

Os exemplos destinam-se ao estudo defensivo e à discussão de mitigação. Qualquer aplicação prática de técnicas deve ocorrer em sistemas próprios ou com autorização explícita e escopo definido.

Os resumos sobre normas, leis e frameworks são materiais de apoio, não substituem os documentos oficiais nem constituem certificação ou parecer jurídico.

## Tecnologias

- HTML, CSS e JavaScript.
- `localStorage` para persistência no navegador.
- Biblioteca padrão do Python para servir os arquivos localmente.
- Sem dependência de uma API de IA para corrigir as perguntas de múltipla escolha.

## Contribuições

Sugestões de melhoria, correções de conteúdo e novos cenários educacionais são bem-vindos por issues e pull requests.

Ao propor uma alteração, descreva o problema, a solução e como verificar o resultado. Use dados fictícios nos exemplos e não inclua credenciais, dados pessoais ou informações internas de empresas.

## Créditos

OWASP, MITRE ATLAS, NIST, ISO/IEC e Kali Linux são referências ou marcas de seus respectivos responsáveis. Este é um projeto educacional independente, sem indicação de afiliação ou endosso dessas organizações.

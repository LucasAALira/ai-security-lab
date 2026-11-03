@echo off
rem Desenho de abertura do AI Security Lab. Gerado por `npm run arte:gerar` a partir de scripts/arte.mjs. Não edite à mão.
rem
rem Uso:  scripts\arte.bat            (sorteia)
rem       scripts\arte.bat cadeado    (escolhe pelo nome)
rem       scripts\arte.bat --lista    (mostra os nomes)
rem
rem Para ver o desenho ao abrir o Prompt de Comando, aponte o AutoRun para este arquivo:
rem   reg add "HKCU\Software\Microsoft\Command Processor" /v AutoRun /d "C:\caminho\scripts\arte.bat" /f
rem Para o PowerShell, acrescente ao $PROFILE:  cmd /c "C:\caminho\scripts\arte.bat"
setlocal
set "NOMES=hacker cadeado chave escudo bug terminal dragao caveira fogueira"
set "TOTAL=9"

rem O arquivo está em UTF-8: sem a página de código 65001 os acentos saem trocados.
rem A página anterior volta no fim, para não mudar o terminal de quem chamou.
for /f "tokens=2 delims=:. " %%a in ('chcp') do set "PAGINA=%%a"
chcp 65001 >nul

if not "%~1"=="--lista" goto :escolher
echo(hacker
echo(cadeado
echo(chave
echo(escudo
echo(bug
echo(terminal
echo(dragao
echo(caveira
echo(fogueira
goto :fim

:escolher
rem Cor só quando NO_COLOR não está definida; o truque abaixo descobre o caractere de escape.
set "COR_BRASA="
set "COR_OURO="
set "COR_TITANIO="
set "COR_FIM="
if defined NO_COLOR goto :sem_cor
for /f %%a in ('echo prompt $E^| cmd') do set "ESC=%%a"
set "COR_BRASA=%ESC%[38;5;203m"
set "COR_OURO=%ESC%[38;5;180m"
set "COR_TITANIO=%ESC%[38;5;245m"
set "COR_FIM=%ESC%[0m"
:sem_cor

set "ESCOLHA="
if "%~1"=="" goto :sortear
call :procurar %*
if defined ESCOLHA goto :desenhar
echo(Desenho desconhecido: %~1 1>&2
echo(Disponíveis: %NOMES% 1>&2
chcp %PAGINA% >nul
endlocal
exit /b 1

:sortear
set /a ESCOLHA=%RANDOM% %% TOTAL

:desenhar
call :figura_%ESCOLHA%
echo(
echo(%COR_OURO%  AI SECURITY LAB%COR_FIM%
echo(%COR_TITANIO%  ---------------%COR_FIM%
echo(
call :desenho_%ESCOLHA%
echo(
echo(%COR_OURO%  "%INSCRICAO%"%COR_FIM%
echo(%COR_TITANIO%  estudo de AppSec e IA, em português%COR_FIM%
echo(
goto :fim

:procurar
if /i "%~1"=="hacker" set "ESCOLHA=0"
if /i "%~1"=="cadeado" set "ESCOLHA=1"
if /i "%~1"=="chave" set "ESCOLHA=2"
if /i "%~1"=="escudo" set "ESCOLHA=3"
if /i "%~1"=="bug" set "ESCOLHA=4"
if /i "%~1"=="terminal" set "ESCOLHA=5"
if /i "%~1"=="dragao" set "ESCOLHA=6"
if /i "%~1"=="caveira" set "ESCOLHA=7"
if /i "%~1"=="fogueira" set "ESCOLHA=8"
goto :eof

:figura_0
set "COR=%COR_BRASA%"
set "INSCRICAO=Todo dado que vem de fora é entrada não confiável."
goto :eof

:figura_1
set "COR=%COR_OURO%"
set "INSCRICAO=Autenticado não é o mesmo que autorizado."
goto :eof

:figura_2
set "COR=%COR_OURO%"
set "INSCRICAO=Segredo no código acompanha cada cópia do repositório."
goto :eof

:figura_3
set "COR=%COR_BRASA%"
set "INSCRICAO=Uma camada só sempre deixa uma brecha."
goto :eof

:figura_4
set "COR=%COR_TITANIO%"
set "INSCRICAO=A falha que ninguém reproduz continua lá."
goto :eof

:figura_5
set "COR=%COR_TITANIO%"
set "INSCRICAO=Registro sem retenção não responde à pergunta do dia seguinte."
goto :eof

:figura_6
set "COR=%COR_BRASA%"
set "INSCRICAO=O chefe do módulo espera a fogueira acesa."
goto :eof

:figura_7
set "COR=%COR_TITANIO%"
set "INSCRICAO=Falso positivo fechado sem justificativa sempre volta."
goto :eof

:figura_8
set "COR=%COR_BRASA%"
set "INSCRICAO=Backup que nunca foi restaurado é hipótese, não controle."
goto :eof

:desenho_0
echo(%COR%         ,--------.%COR_FIM%
echo(%COR%       ,'  ,----.  `.%COR_FIM%
echo(%COR%      /   /      \   \%COR_FIM%
echo(%COR%     ^|   ^|  o  o  ^|   ^|%COR_FIM%
echo(%COR%     ^|   ^|   __   ^|   ^|%COR_FIM%
echo(%COR%      \   \ `--' /   /%COR_FIM%
echo(%COR%       `.  `----'  ,'%COR_FIM%
echo(%COR%     ____`--------'____%COR_FIM%
echo(%COR%    /  [#][#][#][#][#]  \%COR_FIM%
echo(%COR%   '---------------------'%COR_FIM%
goto :eof

:desenho_1
echo(%COR%         .-------.%COR_FIM%
echo(%COR%       .'         '.%COR_FIM%
echo(%COR%      /   .-----.   \%COR_FIM%
echo(%COR%     ^|   ^|       ^|   ^|%COR_FIM%
echo(%COR%   .-+---+-------+---+-.%COR_FIM%
echo(%COR%   ^|                   ^|%COR_FIM%
echo(%COR%   ^|        .---.      ^|%COR_FIM%
echo(%COR%   ^|        ^| o ^|      ^|%COR_FIM%
echo(%COR%   ^|        '-^|-'      ^|%COR_FIM%
echo(%COR%   ^|          ^|        ^|%COR_FIM%
echo(%COR%   '-------------------'%COR_FIM%
goto :eof

:desenho_2
echo(%COR%      .-""-.%COR_FIM%
echo(%COR%     /  .-. \%COR_FIM%
echo(%COR%    ^|  ( o )  ^|%COR_FIM%
echo(%COR%     \  '-'  /%COR_FIM%
echo(%COR%      '-..-'%COR_FIM%
echo(%COR%        ^|^|%COR_FIM%
echo(%COR%        ^|^|%COR_FIM%
echo(%COR%        ^|+--.%COR_FIM%
echo(%COR%        ^|^|  ^|%COR_FIM%
echo(%COR%        '+--'%COR_FIM%
goto :eof

:desenho_3
echo(%COR%    .-----------------.%COR_FIM%
echo(%COR%    ^|  \           /  ^|%COR_FIM%
echo(%COR%    ^|   \  /\ /\  /   ^|%COR_FIM%
echo(%COR%     \   \/  V  \/   /%COR_FIM%
echo(%COR%      \   \  ^|  /   /%COR_FIM%
echo(%COR%       \   \ ^| /   /%COR_FIM%
echo(%COR%        \   \^|/   /%COR_FIM%
echo(%COR%         \       /%COR_FIM%
echo(%COR%          \     /%COR_FIM%
echo(%COR%           '---'%COR_FIM%
goto :eof

:desenho_4
echo(%COR%     \         /%COR_FIM%
echo(%COR%      \  ___  /%COR_FIM%
echo(%COR%       .-'   '-.%COR_FIM%
echo(%COR%    --^|  o   o  ^|--%COR_FIM%
echo(%COR%      ^|  .---.  ^|%COR_FIM%
echo(%COR%    --^|  ^|   ^|  ^|--%COR_FIM%
echo(%COR%      '-.     .-'%COR_FIM%
echo(%COR%    --/  \___/  \--%COR_FIM%
echo(%COR%      /         \%COR_FIM%
goto :eof

:desenho_5
echo(%COR%   .---------------------.%COR_FIM%
echo(%COR%   ^| o o o               ^|%COR_FIM%
echo(%COR%   ^|---------------------^|%COR_FIM%
echo(%COR%   ^|  $ grep -r segredo  ^|%COR_FIM%
echo(%COR%   ^|  src/config.ts:12   ^|%COR_FIM%
echo(%COR%   ^|  _                  ^|%COR_FIM%
echo(%COR%   '---------------------'%COR_FIM%
echo(%COR%      \_______________/%COR_FIM%
goto :eof

:desenho_6
echo(%COR%           /\   /\%COR_FIM%
echo(%COR%          /  \_/  \%COR_FIM%
echo(%COR%     .---(  o   o  )---.%COR_FIM%
echo(%COR%    /     \   ^^   /     \%COR_FIM%
echo(%COR%   ^|  ~~~  '--v--'  ~~~  ^|%COR_FIM%
echo(%COR%    \     __^|   ^|__     /%COR_FIM%
echo(%COR%     '---'  '---'  '---'%COR_FIM%
echo(%COR%        ~  ~   ~  ~%COR_FIM%
goto :eof

:desenho_7
echo(%COR%       .-"""""-.%COR_FIM%
echo(%COR%      /  _   _  \%COR_FIM%
echo(%COR%     ^|  (o) (o)  ^|%COR_FIM%
echo(%COR%     ^|     ^^     ^|%COR_FIM%
echo(%COR%      \  \___/  /%COR_FIM%
echo(%COR%       '-.___.-'%COR_FIM%
echo(%COR%      ^|_^|_^|_^|_^|_^|%COR_FIM%
goto :eof

:desenho_8
echo(%COR%         (  .      )%COR_FIM%
echo(%COR%     )           (     )%COR_FIM%
echo(%COR%           .  '  .%COR_FIM%
echo(%COR%    (    (    ,     )   )%COR_FIM%
echo(%COR%      )   .  (   .    )%COR_FIM%
echo(%COR%       ( ,  )  (  ,  )%COR_FIM%
echo(%COR%        ;  )   (   ;%COR_FIM%
echo(%COR%   _____\_^|_____^|_/_____%COR_FIM%
echo(%COR%  /______^|_______^|______\%COR_FIM%
goto :eof

:fim
chcp %PAGINA% >nul
endlocal

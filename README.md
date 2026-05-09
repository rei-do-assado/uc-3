# O Rei do Sabor | Arcade Logístico de Armazenagem

Ferramenta digital responsiva em formato de site com minigames logísticos para encerramento de uma Unidade Curricular de Armazenagem em curso técnico.

## Objetivo do projeto

Transformar conceitos técnicos de armazenagem em jogos rápidos, interativos e didáticos, usando o contexto simulado da empresa alimentícia **O Rei do Sabor**, localizada em Guarulhos/SP.

## Contexto educacional

O site foi pensado para uso em sala de aula, com participação do público por celular, notebook, desktop ou projetor. Cada jogo apresenta uma situação logística, alternativas, feedback técnico, dica para o professor e resumo de aprendizagem.

## Contexto da empresa simulada

A empresa fictícia vende frangos assados, cortes assados, produtos prontos para consumo, kits corporativos e bandejas para eventos. A operação envolve produtos perecíveis, embalagens, insumos, armazenagem refrigerada, validade, recebimento, expedição, reposição e segurança.

## Jogos disponíveis

- **Qual armazém eu sou?**: identifica o tipo de armazém adequado para cada situação.
- **Semáforo da ocupação**: classifica ocupação saudável, atenção, crítica ou inviável.
- **Inspeção de segurança do pallet**: avalia pallets e estruturas para uso seguro.
- **Ranking final**: consolida pontuação, tentativas, tempo médio, classificação e gráfico.

## Conceitos trabalhados

Tipos de armazém, centro de distribuição, armazém refrigerado, cross-docking, fulfillment, capacidade de armazenagem, taxa de ocupação, PEPS, excesso de estoque, gargalos, circulação, integridade de pallets, capacidade de carga, unitização, inspeção visual e prevenção de acidentes.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript puro
- Bootstrap 5
- Bootstrap Icons
- Chart.js
- Web Audio API para trilha chiptune e efeitos sonoros
- Arquivo MIDI de apoio em `/assets/audio/trilha-arcade.mid`
- localStorage para persistência local da pontuação

## Estrutura de arquivos

```text
/index.html
/pages/tipo-armazem.html
/pages/capacidade-armazenagem.html
/pages/pallets-estruturas.html
/pages/ranking.html
/css/style.css
/js/dados.js
/js/app.js
/js/jogos.js
/js/audio.js
/assets/logo-rei-do-sabor.png
/assets/img/
/assets/audio/trilha-arcade.mid
/README.md
```

## Como executar localmente

Abra o arquivo `index.html` diretamente no navegador. Não há backend, banco de dados ou instalação obrigatória.

Para melhor compatibilidade com imagens externas e CDNs, também é possível servir a pasta com qualquer servidor local simples.

## Como usar em apresentação

1. Abra `index.html` no projetor.
2. Ative a trilha arcade pelo botão de som, se desejar.
3. Escolha um minigame e peça que a turma vote na alternativa.
4. Leia o feedback técnico e a dica do professor após cada rodada.
5. Ao final dos três jogos, abra o ranking para discutir desempenho por tema.

## Como substituir imagens

As imagens usam URLs públicas de Pixabay/Pexels com fallback visual. Para produção, coloque imagens locais em `/assets/img` e substitua as URLs no arquivo `js/dados.js`.

## Como substituir a trilha sonora

O site toca a trilha principal via Web Audio API para funcionar melhor nos navegadores. Também há um arquivo MIDI didático em `/assets/audio/trilha-arcade.mid`, que pode ser substituído por outra trilha `.mid` ou convertido para `.mp3`/`.ogg` caso você queira reprodução por arquivo de áudio.

## Como substituir o logo

Substitua o arquivo `/assets/logo-rei-do-sabor.png`. Caso ele não carregue, o site mostra um espaço reservado com o nome da empresa.

## Como ajustar a pontuação

A lógica de pontuação está no arquivo `js/jogos.js`, especialmente nas funções `calcularPontuacao()` e `finalizarJogo()`.

Regras atuais:

- Acerto na primeira tentativa: 100 pontos
- Acerto na segunda tentativa: 60 pontos
- Acerto na terceira tentativa: 30 pontos
- Bônus de resposta em até 15 segundos: 20 pontos
- Bônus por jogo sem erro: 150 pontos
- Bônus por 80% ou mais de acertos: 80 pontos
- Bônus por concluir os 3 jogos: 200 pontos no ranking final

## Observação didática

Todos os dados, cenários, pontuações e recomendações são fictícios e foram criados para fins educacionais. Eles simulam situações coerentes com uma operação logística real, mas não substituem procedimentos internos, normas técnicas ou políticas de segurança de uma empresa real.

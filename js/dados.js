// Banco de dados didático e fictício para a empresa simulada "O Rei do Sabor".
// Substitua as URLs de imagem por arquivos locais em /assets/img em produção, caso necessário.

const imagensContexto = {
  armazem: "https://cdn.pixabay.com/photo/2016/11/29/03/53/boxes-1867397_1280.jpg",
  centroDistribuicao: "https://cdn.pixabay.com/photo/2017/08/10/07/32/warehouse-2618921_1280.jpg",
  camaraFria: "https://images.pexels.com/photos/4484073/pexels-photo-4484073.jpeg?auto=compress&cs=tinysrgb&w=1200",
  pallets: "https://cdn.pixabay.com/photo/2016/11/29/05/08/blur-1868068_1280.jpg",
  empilhadeira: "https://cdn.pixabay.com/photo/2017/03/27/14/56/forklift-2177619_1280.jpg",
  estoque: "https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg",
  crossDocking: "https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ecommerce: "https://images.pexels.com/photos/4483609/pexels-photo-4483609.jpeg?auto=compress&cs=tinysrgb&w=1200",
  refrigerado: "https://images.pexels.com/photos/4391478/pexels-photo-4391478.jpeg?auto=compress&cs=tinysrgb&w=1200",
  seguranca: "https://cdn.pixabay.com/photo/2017/03/13/17/26/industry-2141485_1280.jpg"
};

const sonsArcade = {
  trilha: "Arquivo MIDI em loop",
  arquivoMidi: "assets/audio/trilha-arcade.mid",
  acerto: "pulso ascendente",
  erro: "pulso grave",
  conclusao: "arpejo final"
};

const classificacoesDesempenho = [
  { min: 90, max: 100, titulo: "Mestre da Armazenagem 🏆", recomendacao: "Excelente domínio técnico. Você consegue relacionar armazenagem, segurança, produtividade e decisão logística." },
  { min: 75, max: 89, titulo: "Analista Logístico Avançado 🚚", recomendacao: "Ótimo desempenho. Revise os pontos com erro para ganhar precisão em cenários com múltiplas variáveis." },
  { min: 60, max: 74, titulo: "Operador Logístico em Evolução 📦", recomendacao: "Boa base. Reforce critérios técnicos, riscos operacionais e impacto das escolhas no fluxo do armazém." },
  { min: 40, max: 59, titulo: "Atenção aos Procedimentos ⚠️", recomendacao: "Há conceitos importantes a revisar. Foque em segurança, ocupação e escolha correta do tipo de armazém." },
  { min: 0, max: 39, titulo: "Revisar Conceitos Básicos 📘", recomendacao: "Retome os fundamentos antes de avançar. Use os feedbacks como roteiro de estudo." }
];

const desafiosTipoArmazem = [
  {
    id: 1, jogo: "tipo-armazem", nivel: "Básico", titulo: "Produto perecível",
    situacao: "O Rei do Sabor precisa armazenar frangos resfriados antes do preparo. O produto tem validade curta e precisa de controle de temperatura.",
    imagem: imagensContexto.camaraFria,
    alternativas: ["Centro de Distribuição", "Armazém refrigerado", "Armazém geral", "Cross-docking"],
    respostaCorreta: "Armazém refrigerado",
    feedbackCorreto: "Correto. Produtos perecíveis exigem controle de temperatura, conservação adequada e monitoramento de validade. Para frangos resfriados, o armazém refrigerado reduz risco sanitário e perda de qualidade.",
    feedbackIncorreto: "Atenção. O fator decisivo é a necessidade de temperatura controlada. Um armazém comum não garante as condições adequadas para perecíveis.",
    explicacaoTecnica: "Armazéns refrigerados mantêm faixa térmica controlada e favorecem PEPS, rastreabilidade e segurança alimentar.",
    conceitoRelacionado: "Armazém refrigerado",
    riscoOperacional: "Perda de qualidade, contaminação e descarte por vencimento.",
    dicaProfessor: "Pergunte à turma quais registros precisam acompanhar a câmara fria durante o turno."
  },
  {
    id: 2, jogo: "tipo-armazem", nivel: "Básico", titulo: "Fluxo rápido",
    situacao: "A empresa recebeu muitos pedidos de marmitas e combos para entrega rápida no mesmo dia. Os produtos quase não ficam estocados: entram, são separados e saem rapidamente.",
    imagem: imagensContexto.crossDocking,
    alternativas: ["Cross-docking", "Armazém alfandegado", "Armazém geral", "Armazém temporário/sazonal"],
    respostaCorreta: "Cross-docking",
    feedbackCorreto: "Correto. No cross-docking, os produtos passam rapidamente pela operação, com pouca ou nenhuma armazenagem, reduzindo tempo de permanência e acelerando a expedição.",
    feedbackIncorreto: "Reveja o fluxo. A situação indica movimentação rápida, sem estocagem prolongada. Isso caracteriza cross-docking.",
    explicacaoTecnica: "O cross-docking depende de agenda, conferência rápida e expedição sincronizada.",
    conceitoRelacionado: "Cross-docking",
    riscoOperacional: "Atraso na expedição e acúmulo em docas.",
    dicaProfessor: "Mostre a diferença entre armazenar e apenas transbordar com separação rápida."
  },
  {
    id: 3, jogo: "tipo-armazem", nivel: "Básico", titulo: "Materiais secos",
    situacao: "A empresa precisa guardar embalagens, sacolas, etiquetas e materiais secos, sem necessidade de refrigeração.",
    imagem: imagensContexto.armazem,
    alternativas: ["Armazém geral", "Armazém refrigerado", "Armazém alfandegado", "Centro de Distribuição"],
    respostaCorreta: "Armazém geral",
    feedbackCorreto: "Correto. Materiais secos, não perecíveis e sem exigência especial de temperatura podem ser armazenados em armazém geral.",
    feedbackIncorreto: "Observe a natureza do item. Como não há necessidade de refrigeração ou controle aduaneiro, o armazém geral é suficiente.",
    explicacaoTecnica: "Armazém geral atende itens secos com controle de organização, inventário e conservação básica.",
    conceitoRelacionado: "Armazém geral",
    riscoOperacional: "Mistura de materiais e perda de rastreabilidade por falta de endereçamento.",
    dicaProfessor: "Peça exemplos de itens que nunca deveriam ficar junto de alimentos prontos."
  },
  {
    id: 4, jogo: "tipo-armazem", nivel: "Intermediário", titulo: "Distribuição regional",
    situacao: "O Rei do Sabor começou a atender pequenos mercados, restaurantes e empresas em Guarulhos e região. Precisa consolidar pedidos, separar cargas e distribuir para vários clientes.",
    imagem: imagensContexto.centroDistribuicao,
    alternativas: ["Centro de Distribuição", "Armazém alfandegado", "Armazém temporário/sazonal", "Armazém refrigerado"],
    respostaCorreta: "Centro de Distribuição",
    feedbackCorreto: "Correto. O Centro de Distribuição organiza recebimento, separação, consolidação e expedição para múltiplos clientes e rotas.",
    feedbackIncorreto: "A situação envolve distribuição para diversos clientes. O foco não é apenas guardar, mas consolidar e expedir pedidos.",
    explicacaoTecnica: "CDs conectam estoque, picking, roteirização e expedição para atendimento multicliente.",
    conceitoRelacionado: "Centro de Distribuição",
    riscoOperacional: "Separação errada e atraso de rotas por baixa organização.",
    dicaProfessor: "Relacione CD com nível de serviço e prazo de entrega."
  },
  {
    id: 5, jogo: "tipo-armazem", nivel: "Intermediário", titulo: "Carga importada",
    situacao: "A empresa importou equipamentos para uma nova cozinha industrial, mas a carga ainda aguarda liberação documental e tributária.",
    imagem: imagensContexto.empilhadeira,
    alternativas: ["Armazém refrigerado", "Armazém alfandegado", "Armazém geral", "Cross-docking"],
    respostaCorreta: "Armazém alfandegado",
    feedbackCorreto: "Correto. Cargas importadas que aguardam liberação ficam em ambiente alfandegado, com controle aduaneiro e documentação específica.",
    feedbackIncorreto: "O fator principal é a importação com pendência de liberação. Isso exige armazém alfandegado.",
    explicacaoTecnica: "Ambiente alfandegado mantém mercadoria sob controle fiscal até regularização.",
    conceitoRelacionado: "Armazém alfandegado",
    riscoOperacional: "Retenção fiscal, multa e bloqueio de uso do equipamento.",
    dicaProfessor: "Destaque que alfandegado não é escolhido pelo produto, mas pela condição aduaneira."
  },
  {
    id: 6, jogo: "tipo-armazem", nivel: "Intermediário", titulo: "Pico sazonal",
    situacao: "Em dezembro, a demanda por kits de festa aumenta muito. A empresa precisa de espaço adicional por apenas 45 dias.",
    imagem: imagensContexto.estoque,
    alternativas: ["Armazém próprio", "Armazém temporário/sazonal", "Armazém alfandegado", "Área de devolução"],
    respostaCorreta: "Armazém temporário/sazonal",
    feedbackCorreto: "Correto. Para picos sazonais, o armazém temporário reduz investimento fixo e oferece flexibilidade operacional.",
    feedbackIncorreto: "Analise o prazo. Como a necessidade é temporária, ampliar estrutura própria pode gerar custo desnecessário.",
    explicacaoTecnica: "Sazonalidade pede capacidade flexível e custo proporcional ao período de uso.",
    conceitoRelacionado: "Armazém temporário/sazonal",
    riscoOperacional: "Superlotação no pico ou custo fixo ocioso após a temporada.",
    dicaProfessor: "Compare CAPEX de expansão própria com contratação temporária."
  },
  {
    id: 7, jogo: "tipo-armazem", nivel: "Intermediário", titulo: "Controle direto",
    situacao: "O Rei do Sabor quer controlar diretamente sua câmara fria, equipe, layout, padrões sanitários e processos internos.",
    imagem: imagensContexto.refrigerado,
    alternativas: ["Armazém próprio", "Armazém terceirizado", "Armazém alfandegado", "Cross-docking"],
    respostaCorreta: "Armazém próprio",
    feedbackCorreto: "Correto. O armazém próprio permite maior controle sobre pessoas, processos, estrutura, qualidade e padrões operacionais.",
    feedbackIncorreto: "O desejo de controle direto indica armazém próprio, mesmo que o custo fixo seja maior.",
    explicacaoTecnica: "Estrutura própria aumenta governança, mas exige investimento, manutenção e equipe.",
    conceitoRelacionado: "Armazém próprio",
    riscoOperacional: "Custo fixo alto se a demanda cair.",
    dicaProfessor: "Discuta controle operacional versus flexibilidade financeira."
  },
  {
    id: 8, jogo: "tipo-armazem", nivel: "Avançado", titulo: "Expansão B2B",
    situacao: "A empresa quer expandir vendas B2B, mas não possui espaço suficiente nem capital para construir nova área. Precisa de solução flexível com operador externo.",
    imagem: imagensContexto.centroDistribuicao,
    alternativas: ["Armazém próprio", "Armazém terceirizado", "Armazém alfandegado", "Armazém de quarentena"],
    respostaCorreta: "Armazém terceirizado",
    feedbackCorreto: "Correto. A terceirização pode reduzir investimento inicial, ampliar capacidade e transferir parte da operação para um operador especializado.",
    feedbackIncorreto: "Quando há limitação de espaço e capital, a terceirização pode ser mais viável do que construir estrutura própria.",
    explicacaoTecnica: "Terceirização transforma parte do custo fixo em custo variável e acelera expansão.",
    conceitoRelacionado: "Armazém terceirizado",
    riscoOperacional: "Menor controle direto e dependência de SLA do operador.",
    dicaProfessor: "Pergunte quais indicadores deveriam constar no contrato com operador logístico."
  },
  {
    id: 9, jogo: "tipo-armazem", nivel: "Avançado", titulo: "Pedidos online",
    situacao: "A empresa abriu vendas online de kits prontos. Os pedidos são pequenos, variados, exigem separação unitária, embalagem e expedição rápida.",
    imagem: imagensContexto.ecommerce,
    alternativas: ["Armazém geral", "E-commerce fulfillment", "Armazém alfandegado", "Armazém temporário/sazonal"],
    respostaCorreta: "E-commerce fulfillment",
    feedbackCorreto: "Correto. Operações de e-commerce exigem separação por pedido, embalagem, rastreio, expedição rápida e integração com canais digitais.",
    feedbackIncorreto: "O foco é atender pedidos pequenos e variados com rapidez. Isso caracteriza operação de fulfillment.",
    explicacaoTecnica: "Fulfillment combina picking unitário, embalagem, conferência e despacho com rastreio.",
    conceitoRelacionado: "E-commerce fulfillment",
    riscoOperacional: "Erro de item, atraso e baixa experiência do cliente final.",
    dicaProfessor: "Mostre como um pedido online muda a lógica de separação em comparação ao B2B."
  },
  {
    id: 10, jogo: "tipo-armazem", nivel: "Avançado", titulo: "Alto giro no almoço",
    situacao: "O Rei do Sabor precisa separar rapidamente itens de alto giro para montagem de combos de almoço entre 10h e 12h.",
    imagem: imagensContexto.armazem,
    alternativas: ["Área de picking e separação rápida", "Armazém alfandegado", "Armazém temporário/sazonal", "Estoque morto"],
    respostaCorreta: "Área de picking e separação rápida",
    feedbackCorreto: "Correto. Produtos de alto giro devem ficar em área de picking acessível, reduzindo deslocamentos e tempo de separação.",
    feedbackIncorreto: "O ponto central é a velocidade de separação. A área de picking é adequada para itens de alto giro.",
    explicacaoTecnica: "Picking eficiente reduz percurso, filas e tempo de ciclo na expedição.",
    conceitoRelacionado: "Área de picking",
    riscoOperacional: "Atraso na montagem e perda da janela de entrega.",
    dicaProfessor: "Peça à turma para propor onde ficariam itens A, B e C no layout."
  }
];

const desafiosCapacidade = [
  ["Básico", "Ocupação folgada", "A câmara de embalagens está com 50% de ocupação. Há corredores livres, boa separação dos itens e facilidade para inventário.", 50, "Verde - saudável", "Correto. Uma ocupação de 50% indica folga operacional, boa circulação e menor risco de gargalos.", "Observe que ainda existe espaço disponível e boa circulação. Isso caracteriza uma ocupação saudável."],
  ["Básico", "Fim de semana chegando", "O estoque seco está com 75% de ocupação. Ainda há espaço, mas o crescimento de demanda para o fim de semana exige atenção.", 75, "Amarelo - atenção", "Correto. A ocupação de 75% não é crítica, mas exige monitoramento para evitar acúmulo e perda de eficiência.", "Uma ocupação de 75% pode funcionar, mas já merece atenção, especialmente antes de picos de demanda."],
  ["Básico", "Câmara fria cheia", "A câmara fria está com 95% de ocupação. Os produtos estão próximos entre si e a equipe tem dificuldade para movimentação.", 95, "Vermelho - crítico", "Correto. Com 95%, a operação perde flexibilidade, dificulta circulação e aumenta risco de erro, avaria e perda de validade.", "Com 95% de ocupação, o armazém está perto do limite. Isso é crítico."],
  ["Básico", "Capacidade ultrapassada", "O estoque de descartáveis atingiu 110% da capacidade. Parte dos materiais foi colocada em área de circulação.", 110, "Preto - inviável", "Correto. Acima de 100%, a operação ultrapassou a capacidade. Usar corredores como estoque compromete segurança e produtividade.", "Quando passa de 100%, a estrutura não comporta a carga de forma adequada. A situação é inviável."],
  ["Intermediário", "Promoção programada", "O estoque de frangos resfriados está em 82% de ocupação, mas haverá promoção no fim de semana e a demanda deve crescer 30%.", 82, "Amarelo - atenção", "Correto. O percentual ainda não é crítico, mas a previsão de aumento de demanda exige planejamento de recebimento e expedição.", "Considere a sazonalidade. Com crescimento previsto, 82% exige atenção para evitar gargalo."],
  ["Intermediário", "Picking no pico", "A área de picking dos combos de almoço está com 88% de ocupação durante o horário de pico.", 88, "Vermelho - crítico", "Correto. Em área de picking, ocupação alta prejudica velocidade, aumenta deslocamento e compromete o atendimento.", "Mesmo abaixo de 100%, 88% no picking em horário de pico já é crítico pela necessidade de agilidade."],
  ["Intermediário", "Layout mal aproveitado", "O armazém de embalagens está com 68% de ocupação, mas os itens de maior giro estão no fundo, aumentando o tempo de separação.", 68, "Verde - saudável com ajuste de layout", "Correto. A ocupação está saudável, mas existe oportunidade de melhoria no endereçamento e no layout.", "O percentual está saudável, mas o problema real é o posicionamento dos itens. A ocupação não é crítica."],
  ["Avançado", "Validade curta", "A câmara fria está com 89% de ocupação. Parte dos produtos vence em 2 dias e novos lotes chegam amanhã.", 89, "Vermelho - crítico", "Correto. Além da ocupação alta, existe risco de vencimento e chegada de novos lotes. A operação precisa priorizar PEPS e expedição.", "A análise não deve considerar só o percentual. Validade curta e novo recebimento aumentam o risco."],
  ["Avançado", "Baixo giro em posição nobre", "O estoque está com 72% de ocupação, mas 40% dos itens são de baixo giro e ocupam posições nobres.", 72, "Amarelo - atenção", "Correto. A taxa parece aceitável, mas a baixa rotatividade compromete espaço útil e eficiência logística.", "Mesmo com 72%, o problema está na qualidade da ocupação. Itens de baixo giro podem gerar gargalos."],
  ["Avançado", "Natal sob pressão", "Durante o Natal, a empresa opera com 98% de ocupação, alta entrada de pedidos, corredores estreitos e equipe temporária.", 98, "Vermelho - crítico", "Correto. O conjunto de alta ocupação, pico sazonal, equipe temporária e corredores estreitos gera risco operacional elevado.", "Não é apenas o percentual. O contexto sazonal e a pressão operacional tornam a situação crítica."]
].map((item, index) => ({
  id: index + 1,
  jogo: "capacidade",
  nivel: item[0],
  titulo: item[1],
  situacao: item[2],
  ocupacao: item[3],
  imagem: index % 2 ? imagensContexto.armazem : imagensContexto.centroDistribuicao,
  alternativas: ["Verde - saudável", "Amarelo - atenção", "Vermelho - crítico", "Preto - inviável", ...(index === 6 ? ["Verde - saudável com ajuste de layout"] : [])],
  respostaCorreta: item[4],
  feedbackCorreto: item[5],
  feedbackIncorreto: item[6],
  explicacaoTecnica: "A taxa de ocupação deve ser analisada junto com giro, layout, sazonalidade, validade, circulação e segurança.",
  conceitoRelacionado: "Capacidade de armazenagem e taxa de ocupação",
  riscoOperacional: "Gargalos, perda de produtividade, bloqueio de corredores e ruptura por falta de espaço.",
  dicaProfessor: "Questione se uma ocupação alta representa eficiência ou risco operacional.",
  recomendacao: ["Reorganizar layout", "Antecipar expedição", "Reduzir estoque de baixo giro", "Usar PEPS", "Criar área temporária", "Rever frequência de compras", "Negociar entregas fracionadas", "Aumentar controle visual"][index % 8]
}));

const desafiosPallets = [
  ["Básico", "Pallet íntegro", "Pallet de madeira íntegro, sem rachaduras, sem tábuas soltas, limpo e seco.", "Liberar para uso", "Correto. Um pallet íntegro, limpo e seco pode ser utilizado, desde que respeitada sua capacidade de carga.", "Não há sinais aparentes de dano. A liberação é adequada, mantendo atenção à capacidade de carga."],
  ["Básico", "Pregos expostos", "Pallet com uma tábua quebrada na parte superior e pregos expostos.", "Retirar de operação", "Correto. Tábua quebrada e pregos expostos representam risco de queda, avaria, acidente e ferimentos.", "Esse pallet não deve ser usado. O dano estrutural e os pregos expostos comprometem a segurança."],
  ["Básico", "Umidade e odor", "Pallet molhado, com odor forte e manchas escuras.", "Encaminhar para inspeção/manutenção", "Correto. Umidade e manchas podem indicar contaminação, fungos ou perda de resistência. O pallet deve ser avaliado antes do uso.", "Para produtos alimentícios, umidade e odor são sinais de alerta. Não libere sem inspeção."],
  ["Intermediário", "Pallet plástico higienizável", "Pallet plástico em bom estado, indicado para área refrigerada e higienização frequente.", "Liberar para uso", "Correto. Pallets plásticos são adequados para ambientes com exigência de higiene, desde que estejam íntegros.", "O material plástico pode ser adequado para alimentos e áreas refrigeradas, desde que sem trincas."],
  ["Intermediário", "Lasca lateral leve", "Pallet com leve lasca lateral, sem comprometer a base, usado apenas para embalagens leves.", "Usar com restrição", "Correto. O uso pode ser permitido com restrição para cargas leves, desde que identificado e monitorado.", "Nem todo dano exige descarte imediato, mas o uso deve ser restrito e controlado."],
  ["Intermediário", "Base deformada", "Pallet com deformação visível na base após uso com carga acima do recomendado.", "Retirar de operação", "Correto. A deformação indica comprometimento estrutural. O pallet pode falhar durante movimentação ou empilhamento.", "Deformação na base é crítica. O pallet deve sair de operação."],
  ["Intermediário", "Porta-pallet sinalizado", "Estrutura porta-pallet com sinalização de capacidade visível, sem deformações e com corredores desobstruídos.", "Liberar para uso", "Correto. Sinalização, integridade e corredores livres são condições importantes para operação segura.", "Se a estrutura está íntegra, sinalizada e com acesso livre, pode ser utilizada."],
  ["Avançado", "Carga pesada sem capacidade", "Pallet aparentemente íntegro, mas sem identificação de capacidade e destinado a carga pesada de frango congelado.", "Encaminhar para inspeção/manutenção", "Correto. Sem informação de capacidade, não é seguro usar para carga pesada. A inspeção evita acidentes.", "A aparência não basta. Para carga pesada, é necessário confirmar a capacidade."],
  ["Avançado", "Carga inclinada", "Pallet com produto inclinado, filme stretch mal aplicado e risco de tombamento durante movimentação.", "Usar com restrição após reunitização", "Correto. O problema pode estar na unitização da carga. Antes de movimentar, é preciso corrigir o empilhamento e reforçar a embalagem.", "O risco principal é o tombamento da carga. A movimentação só deve ocorrer após reunitização."],
  ["Avançado", "Longarina amassada", "Estrutura porta-pallet com longarina levemente amassada após colisão de equipamento de movimentação.", "Retirar área de uso e encaminhar para inspeção técnica", "Correto. Colisão em estrutura porta-pallet exige isolamento da área e avaliação técnica antes da continuidade do uso.", "Danos em estruturas podem causar acidentes graves. A área deve ser isolada e inspecionada."]
].map((item, index) => ({
  id: index + 1,
  jogo: "pallets",
  nivel: item[0],
  titulo: item[1],
  situacao: item[2],
  imagem: index > 6 ? imagensContexto.seguranca : imagensContexto.pallets,
  alternativas: ["Liberar para uso", "Usar com restrição", "Retirar de operação", "Encaminhar para inspeção/manutenção", "Usar com restrição após reunitização", "Retirar área de uso e encaminhar para inspeção técnica"],
  respostaCorreta: item[3],
  feedbackCorreto: item[4],
  feedbackIncorreto: item[5],
  explicacaoTecnica: "A inspeção visual deve observar integridade, limpeza, umidade, capacidade, unitização da carga e condição da estrutura.",
  conceitoRelacionado: "Segurança de pallets e estruturas",
  riscoOperacional: "Queda de carga, acidente com pessoas, avaria e interdição de área.",
  dicaProfessor: "Use o checklist para separar defeitos aceitáveis, restrições e não conformidades críticas.",
  checklist: ["Seco", "Limpo", "Sem rachaduras", "Sem pregos expostos", "Sem deformação", "Capacidade conhecida", "Adequado ao produto", "Adequado ao ambiente", "Carga unitizada", "Sem risco de queda"]
}));

/**
 * DATA — todo o conteúdo textual e estrutural do funil.
 */

const HFP_STEPS = [
  {
    id: 'intro',
    type: 'intro',
    progress: 7,
    title: 'Você conhece o seu rosto — ou apenas o que vê no espelho?',
    body: 'Responda algumas perguntas e descubra o quanto da sua percepção facial depende de opinião, hábito e impressão — e o que só uma leitura das suas próprias proporções consegue mostrar.',
    bullets: [
      'Entenda como você percebe o seu rosto hoje',
      'Descubra onde sua percepção pode não contar toda a história',
      'Descubra seu Ponto de Maior Potencial',
      'Veja como uma análise proporcional pode trazer uma nova perspectiva'
    ],
    trustRow: ['Análise anatômica', 'Leitura personalizada', 'Sem padrão de beleza'],
    cta: 'Descobrir meu potencial'
  },
  {
    id: 'q1', type: 'question', progress: 7, category: 'percepcao',
    text: 'Quando você olha para o seu rosto, o que costuma chamar sua atenção primeiro?',
    options: ['Minha mandíbula e o contorno', 'Meus olhos e o olhar', 'Meu nariz e a região central', 'Meu rosto como um todo']
  },
  {
    id: 'q2', type: 'question', progress: 7, category: 'percepcao',
    text: 'Você já teve a sensação de que seu rosto parece diferente dependendo da foto, iluminação ou ângulo?',
    options: ['Sim, bastante', 'Às vezes', 'Poucas vezes', 'Nunca pensei nisso']
  },
  {
    id: 'break1', type: 'break', progress: 7,
    title: 'Isso acontece porque a percepção do rosto não depende apenas das características faciais.',
    body: 'Luz, expressão, posição da cabeça, distância da câmera e ângulo podem mudar bastante a maneira como uma mesma face é percebida.',
    cta: 'Continuar'
  },
  {
    id: 'q3', type: 'question', progress: 7, category: 'decisao',
    text: 'Quando você pensa em melhorar sua aparência facial, qual destas situações mais representa você?',
    options: [
      'Sei exatamente o que gostaria de realçar',
      'Sei o que me incomoda, mas não sei explicar por quê',
      'Tenho algumas ideias, mas não sei o que realmente faria diferença',
      'Prefiro entender melhor antes de tomar qualquer decisão'
    ]
  },
  {
    id: 'break2', type: 'break', progress: 15,
    title: 'Nem toda percepção é uma medida.',
    body: 'Você pode perceber uma mandíbula pouco marcada, um queixo recuado ou uma região mais evidente. Mas perceber não é o mesmo que medir. E quando a decisão envolve o próprio rosto, essa diferença importa.',
    cta: 'Quero entender melhor'
  },
  {
    id: 'q4', type: 'question', progress: 15, category: 'proporcao',
    text: 'Se você pudesse entender uma coisa sobre o seu rosto antes de pensar em qualquer mudança, o que seria?',
    options: ['Como minhas proporções se distribuem', 'O que mais chama atenção no meu rosto', 'Qual região tem maior potencial de valorização', 'O que realmente combina com a minha identidade']
  },
  {
    id: 'break3', type: 'break', progress: 15,
    title: 'Seu rosto não precisa ser comparado a um padrão.',
    subtitle: 'A referência pode ser o próprio rosto.',
    body: 'Existe uma diferença entre olhar para o rosto e aprender a observá-lo. O espelho mostra uma impressão. Uma fotografia pode mostrar outra. Mas as proporções ajudam a entender a estrutura por trás dessa percepção.',
    cta: 'Continuar'
  },
  {
    id: 'q5', type: 'question', progress: 20, category: 'proporcao',
    text: 'Se você pudesse compreender melhor uma região do seu rosto hoje, qual escolheria?',
    options: ['Mandíbula e contorno', 'Olhar', 'Maçãs do rosto', 'Queixo e projeção', 'Equilíbrio do rosto como um todo'],
    watermark: 'SEM NOTAS · SEM PADRÃO DE BELEZA'
  },
  {
    id: 'q6', type: 'question', progress: 20, category: 'valores',
    text: 'Quando você pensa em estética facial, o que mais importa para você?',
    options: [
      'Quero preservar minha identidade e evitar qualquer aparência artificial.',
      'Quero perceber uma evolução sem perder a naturalidade.',
      'Gosto de características mais evidentes e de maior presença.'
    ]
  },
  {
    id: 'break4', type: 'break', progress: 20,
    title: 'Você já percebe bastante coisa.',
    body: 'Mas percepção e proporção são coisas diferentes. Você pode saber que gosta mais dos seus olhos. Pode sentir que sua mandíbula poderia ter mais presença. Pode perceber que determinadas fotos favorecem mais seu rosto.',
    body2: 'Mas ainda existe uma pergunta: o que o seu próprio rosto mostra quando você deixa a impressão de lado e observa suas proporções?',
    cta: 'Quero descobrir'
  },
  {
    id: 'product-intro', type: 'feature-list', progress: 20,
    title: 'Entenda o que seu rosto já revela',
    subtitle: 'Uma experiência interativa que combina a leitura das suas próprias proporções com a maneira como você percebe seu rosto.',
    items: [
      { title: 'Sua própria foto', body: 'A análise parte da imagem do seu rosto.' },
      { title: 'Seus três terços', body: 'Você entende como a altura da face se distribui' },
      { title: 'Seu ponto de maior potencial', body: 'Uma oportunidade de observação e valorização dentro do conjunto do seu rosto' },
      { title: 'Seu ponto forte', body: 'A análise começa reconhecendo aquilo que já se destaca' },
      { title: 'Uma leitura personalizada', body: 'Suas respostas ajudam a contextualizar a leitura' },
      { title: 'Prática Facial', body: 'Uma rotina de percepção, mobilidade e relaxamento' },
      { title: 'Rotina de Cuidados', body: 'Organize numa sequência clara o que você já usa' }
    ],
    notice: 'Atenção: Este método é focado em autoconhecimento e anatomia, não em padrões impostos.',
    footnote: 'Clique no botão apenas se isso, de fato, faz sentido pra você',
    cta: 'Me interessa demais!'
  },
  {
    id: 'authority', type: 'authority', progress: 25,
    title: 'Sua análise será guiada pelo Dr. Marcos Gama',
    subtitle: 'Mais de 15.000 procedimentos realizados em 10 anos de prática clínica',
    photo: 'assets/images/dr-marcos-gama.jpeg',
    body: 'Dr. Marcos Gama atua na harmonização facial há 10 anos e se especializou em uma coisa: a anatomia por trás da percepção estética. Capacitação internacional no MARC Miami e no IMCAS Paris. Desenvolveu o Método Gama™, baseado na estrutura óssea e muscular. Já transformou a autoestima de mais de 15.000 pacientes, sendo reconhecido por preservar a identidade natural de cada resultado.',
    signature: 'Ciência. Naturalidade. Resultado com responsabilidade.',
    cta: 'Continuar',
    ctaUnconfirmed: false
  },
  {
    id: 'audio', type: 'audio', progress: 25,
    title: 'Escuta meu áudio',
    subtitle: 'Um minuto. É o que eu percebi depois de 15 mil rostos.',
    audioSrc: 'assets/audio/audio-dr-marcos.mp3',
    audioSrcFallback: 'assets/audio/audio-dr-marcos.m4a',
    durationLabel: '00:54',
    cta: 'Ver como funciona'
  },
  {
    id: 'proof', type: 'proof', progress: 30,
    title: 'Não era a câmera...',
    subtitle: 'Ela me mandou isso depois de usar o app',
    sender: 'Carla',
    messages: [
      { text: 'dr Gama do ceu... preciso te agradecer muitooo!', time: '10:03' },
      { text: 'eu achava que era a câmera kkkk', time: '10:03' },
      { text: 'ou que tinha alguma coisa errada comigo, sei la', time: '10:04' },
      { text: 'ai vi o estudo do senhor, a distribuição do meu rosto ali na tela', time: '10:04' },
      { text: 'entendi que é sempre o mesmo rosto só muda o ângulo. gratidaaao', time: '10:07' }
    ],
    cta: 'Ver os resultados'
  },
  {
    id: 'q7', type: 'question', progress: 80, category: 'fechamento',
    text: 'Você gostaria de entender o seu rosto de um jeito mais simples?',
    options: ['Sim, quero entender meu rosto', 'Talvez, quero entender melhor antes'],
    progressJumpIntentional: true
  }
];

const HFP_RESULTS = {
  progress: 90,
  headline: 'Pelas suas respostas, o que mais pesa hoje',
  headlineHighlight: 'é a dúvida',
  cards: [
    'Repare que três dos quatro pontos não têm nada a ver com o seu rosto. Têm a ver com o que você não tem como saber sozinha no espelho. É por isso que a dúvida não passa — não falta decisão, falta informação.',
    'Metade do que te trava é emocional, e emoção não se resolve com procedimento nenhum. Por isso o primeiro passo aqui não é mudar o rosto. É enxergar o que já está nele. O <strong class="hfp-highlight-green">Harmonia Facial Pro</strong> age desarmando exatamente esse gatilho.',
    '<strong>O que isso revela:</strong> Você percebe bastante. O que falta é conseguir nomear o que percebe — e essa diferença é o que faz uma decisão parecer arriscada.'
  ],
  radar: {
    title: 'Barreiras identificadas',
    axes: [
      { label: 'Insegurança', value: 0.75 },
      { label: 'Medo do artificial', value: 0.75 },
      { label: 'Falta de referência', value: 0.75 },
      { label: 'Gasto ineficiente', value: 0.75 }
    ]
  },
  donut: {
    title: 'De onde vem a sua dúvida',
    segments: [
      { label: 'Fator Emocional', value: 50, color: '#6C63FF' },
      { label: 'Fator Anatômico', value: 30, color: '#F5A623' },
      { label: 'Fator Técnico', value: 20, color: '#2ECC71' }
    ]
  },
  bars: {
    title: 'O que você já sabe sobre o seu rosto',
    items: [
      { label: 'Percepção', value: 85 },
      { label: 'Conhecimento das proporções', value: 30 },
      { label: 'Referência própria', value: 25 }
    ]
  },
  closingTitle: 'O que muda a partir daqui',
  closingBody: 'Nada disso mede beleza. Mede o quanto você consegue olhar para o próprio rosto e entender o que está vendo. É exatamente aí que o Harmonia Facial Pro entra.',
  cta: 'Quero entender meu rosto'
};

const HFP_LOADING = {
  progress: 95,
  title: 'Aguarde um instante.',
  subtitle: 'Estamos montando seu plano personalizado!',
  durationMs: 3400
};

const HFP_UNLOCK = {
  progress: 98,
  title: 'Está tudo pronto!!',
  body: 'Por ter chegado até aqui, você desbloqueou uma <strong>condição especial</strong> no Harmonia Facial Pro. Ela aparece na próxima tela, junto com a sua leitura.',
  lockedLabel: 'Desbloquear'
};

const HFP_LEAD_FORM = {
  progress: 98,
  prompt: 'Digite seu nome e WhatsApp para ver a sua leitura e a condição que você desbloqueou',
  nameLabel: 'Seu nome',
  namePlaceholder: 'Digite seu nome',
  phoneLabel: 'Seu WhatsApp',
  phonePlaceholder: '(00) 00000-0000',
  phoneError: 'Digite um telefone válido',
  cta: 'VER MINHA LEITURA'
};

const HFP_OFFER = {
  progress: 100,
  videoIntro: 'Assista o vídeo e veja o que vai receber',
  videoSrc: 'assets/video/video-dr-marcos-oferta.mp4',
  videoPoster: 'assets/video/poster.jpg',
  headline: 'Harmonia Facial Pro',
  subtitle: 'O passo a passo para entender o seu rosto a partir das suas próprias proporções — não de um padrão.',
  bullets: [
    'Entenda o que o seu rosto já revela',
    'Chegue às suas decisões estéticas com mais informação',
    'Use a sua própria referência, não a de outra pessoa'
  ],
  receiveTitle: 'Veja tudo que vai receber',
  receiveCards: [
    { title: 'Identificação do Ponto de Maior Potencial', body: 'Uma região do seu rosto que merece mais atenção na sua leitura. Não é defeito, não é nota — é onde vale a pena olhar com mais calma.', image: 'assets/images/offer/ponto-maior-potencial.jpg' },
    { title: 'Prática Facial', body: 'Cinco minutos por dia para perceber, movimentar e relaxar. Uma rotina de consciência facial, com versão de manhã e de noite.', image: 'assets/images/offer/pratica-facial.jpg' },
    { title: 'Rotina de Cuidados', body: 'Organize o que você já usa numa sequência clara: limpar, tratar, hidratar, proteger. O app não indica produtos — ele organiza os seus.', image: 'assets/images/offer/rotina-cuidados.jpg' },
    { title: 'Leitura Personalizada', body: 'Análise anatômica das suas proporções e dos três terços faciais para revelar o que seu rosto já possui de melhor.', image: 'assets/images/offer/leitura-personalizada.jpg' }
  ],
  price: { anchor: '308,00', installments: '5x', amount: '9,80' },
  priceBlock1Cta: 'QUERO MEU ACESSO AGORA',
  priceBlock2Cta: 'COMEÇAR MINHA ANÁLISE',
  recapTitle: 'Recapitulando TUDO que você recebe agora',
  recapItems: [
    { label: 'Harmonia Facial Pro (aplicativo)', value: '197' },
    { label: 'Leitura Personalizada', value: '47' },
    { label: 'Prática Facial', value: '27' },
    { label: 'Rotina de Cuidados', value: '37' }
  ],
  recapTotal: '308,00',
  faqTitle: 'Dúvidas frequentes',
  faq: [
    { q: 'Preciso comprar produtos caros?', a: 'Não. O app não indica marca, produto nem ativo. Ele ajuda você a organizar numa sequência clara o que você já usa.', openByDefault: true },
    { q: 'Isso vai me ensinar a fazer procedimentos?', a: 'Não. O Harmonia Facial Pro é uma ferramenta de autoconhecimento e educação facial, não um treinamento para realizar procedimentos.' },
    { q: 'Quanto tempo leva?', a: 'Poucos minutos para concluir a análise e receber sua leitura personalizada.' },
    { q: 'É difícil de aplicar?', a: 'Não. O app conduz você passo a passo, de forma simples e intuitiva.' },
    { q: 'Preciso fazer algum procedimento depois?', a: 'Não. A análise não exige nem indica obrigatoriamente nenhum procedimento. O objetivo é ajudar você a entender melhor o seu rosto.' }
  ],
  guaranteeTitle: '7 DIAS DE GARANTIA',
  guaranteeSubtitle: 'Garantia Risco Zero de 7 Dias',
  guaranteeBody: 'Você tem 7 dias para testar. Se não for para você, devolvemos o valor integral.'
};

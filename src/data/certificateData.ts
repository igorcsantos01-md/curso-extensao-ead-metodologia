export interface CurriculumAxis {
  id: string;
  titleLine1: string;
  titleLine2?: string;
  subtitleLine1: string;
  subtitleLine2?: string;
  descriptionLine1: string;
  descriptionLine2: string;
  hours: string;
}

export interface CertificateRecord {
  id: string;
  certNumber: string;
  bookNumber: string;
  sheetNumber: string;
  code: string;
  controlKey: string;
  sha256: string;
  mainHeaderTitle: string;
  holderName: string;
  holderQualification: string;
  holderCpf: string;
  holderInstitution: string;
  courseTitle: string;
  modalityLabel: string;
  periodText: string;
  hoursNumeric: number;
  hoursWritten: string;
  grade: string;
  status: string;
  issueCityState: string;
  issueDateText: string;
  frontParagraph1Lines: string[];
  frontParagraph2Lines: string[];
  enquadramentoLines: string[];
  enquadramentoSummary: string;
  axesHeaderTitle: string;
  axes: CurriculumAxis[];
  registroAverbarLines: string[];
}

export const CERTIFICATE_07: CertificateRecord = {
  id: 'cert-07',
  certNumber: '07',
  bookNumber: '01/2024',
  sheetNumber: '34',
  code: 'EMS-EXT-2024-0907',
  controlKey: '0907-7027-9457-7D9E',
  sha256: '7f3a9c18e2b04d65a1928e40c6b51d29e8f17a63b4c52d90f1837e2a5b6c0907',
  mainHeaderTitle: 'CERTIFICADO DE CURSO DE EXTENSÃO',
  holderName: 'LUCAS GONÇALVES SILVEIRA',
  holderQualification: 'Médico',
  holderCpf: '702.794.941-57',
  holderInstitution: 'Centro Universitário Alfredo Nasser (UNIFAN)',
  courseTitle:
    'Curso de Extensão EAD em Metodologia de Revisão Sistemática, Protocolo PRISMA e Medicina Baseada em Evidências',
  modalityLabel: 'Curso de Extensão',
  periodText: '14 de outubro a 15 de novembro de 2024',
  hoursNumeric: 40,
  hoursWritten: '40 (quarenta) horas',
  grade: '9,8',
  status: 'APROVADO',
  issueCityState: 'Goiânia - GO',
  issueDateText: 'Goiânia - GO, 22 de novembro de 2024.',
  frontParagraph1Lines: [
    'concluiu com APROVAÇÃO e aproveitamento integral a Atividade Extracurricular intitulada "Curso de Extensão EAD em Metodologia de Revisão',
    'Sistemática, Protocolo PRISMA e Medicina Baseada em Evidências", desenvolvida na modalidade de Curso de Extensão, realizada no período de 14 de',
    'outubro a 15 de novembro de 2024, contabilizando carga horária total de 40 (quarenta) horas.',
  ],
  frontParagraph2Lines: [
    'No âmbito desta formação complementar em ambiente virtual de aprendizagem, o profissional cumpriu integralmente os módulos teóricos e práticos de',
    'formulação de perguntas clínicas estruturadas (estratégia PICO), aplicação das diretrizes internacionais PRISMA 2020 (checklist de 27 itens e fluxograma',
    'em quatro fases), registro de protocolos (PROSPERO), triagem cega pareada em plataformas digitais (Rayyan), análise crítica de risco de viés (Cochrane',
    'RoB 2 e sistema GRADE) e interpretação de síntese qualitativa e metanálise, obtendo nota final 9,8 (APROVADO).',
  ],
  enquadramentoLines: [
    'Item 09 - Atividades Extracurriculares: Cursos de extensão, estágios em',
    'instituições de ensino, cursos de língua e de computação, aprovação em',
    'concursos, congressos médicos (Pelo menos 30 horas por certificado)',
  ],
  enquadramentoSummary:
    'Período: 14 de outubro a 15 de novembro de 2024 | Total: 40h (APROVADO - Nota 9,8)',
  axesHeaderTitle: '3. MATRIZ PROGRAMÁTICA E METODOLOGIA PEDAGÓGICA (40 HORAS)',
  axes: [
    {
      id: 'I',
      titleLine1: 'Eixo I — Fundamentos da Medicina Baseada em Evidências',
      titleLine2: 'e Estratégia PICO',
      subtitleLine1: 'Hierarquia de Evidências Clínicas e Delineamento de Protocolos',
      descriptionLine1:
        'Estruturação de perguntas clínicas pesquisáveis pelo acrônimo PICO/PICOT, níveis de evidência científica (Oxford/GRADE),',
      descriptionLine2:
        'definição de critérios de elegibilidade (inclusão/exclusão) e elaboração de protocolo reprodutível de revisão sistemática.',
      hours: '10h 00min',
    },
    {
      id: 'II',
      titleLine1: 'Eixo II — Diretrizes Internacionais PRISMA 2020 e',
      titleLine2: 'Registro Prospectivo (PROSPERO)',
      subtitleLine1: 'Fluxograma de Quatro Fases, Checklist de 27 Itens e Transparência',
      descriptionLine1:
        'Aplicação integral da diretriz PRISMA 2020 (Preferred Reporting Items for Systematic Reviews and Meta-Analyses), construção do',
      descriptionLine2:
        'diagrama de fluxo (Identificação, Triagem, Elegibilidade e Inclusão) e submissão de protocolo na base internacional PROSPERO.',
      hours: '10h 00min',
    },
    {
      id: 'III',
      titleLine1: 'Eixo III — Triagem Cega Pareada, Extração de Dados e',
      titleLine2: 'Avaliação Crítica de Risco de Viés',
      subtitleLine1: 'Plataforma Rayyan, Ferramentas Cochrane RoB 2, NOS e GRADE',
      descriptionLine1:
        'Deduplicação e seleção cega por revisores independentes no software Rayyan, extração padronizada de desfechos clínicos e',
      descriptionLine2:
        'auditoria de qualidade metodológica com as ferramentas Cochrane Risk of Bias 2 (RoB 2), Newcastle-Ottawa e sistema GRADE.',
      hours: '10h 00min',
    },
    {
      id: 'IV',
      titleLine1: 'Eixo IV — Síntese Qualitativa, Princípios de Metanálise',
      titleLine2: '(Forest Plot / I²) e Avaliação Final',
      subtitleLine1: 'Interpretação de Medidas de Efeito, Heterogeneidade e Exame Prático',
      descriptionLine1:
        'Síntese qualitativa de evidências, leitura crítica de gráficos Forest Plot e Funnel Plot, interpretação de OR/RR, IC 95% e estatística',
      descriptionLine2:
        'I² de Higgins para heterogeneidade entre estudos, concluindo com aprovação na avaliação somativa final com nota 9,8.',
      hours: '10h 00min',
    },
  ],
  registroAverbarLines: [
    'Certificado registrado sob o nº 07 no Livro de Extensão e Cursos nº 01/2024, Folha 34, expedido pela Editora Mente e Saúde (CNPJ: 51.372.335/0001-71) e Centro Profissionalizante Maria',
    'Dalva de Araújo (CNPJ: 51.269.112/0001-83).',
  ],
};

export interface PrismaStage {
  id: 'identificacao' | 'triagem' | 'elegibilidade' | 'inclusao';
  stepNumber: string;
  phaseTitle: string;
  subtitle: string;
  recordsCount: string;
  excludedCount: string;
  excludedReason: string;
  summary: string;
  keyProtocolRules: string[];
  toolsUsed: string[];
}

export const PRISMA_STAGES: PrismaStage[] = [
  {
    id: 'identificacao',
    stepNumber: 'Fase 01',
    phaseTitle: 'Identificação em Bases de Dados e Registros',
    subtitle: 'Recuperação Sensível de Literatura Biomédica Indexada',
    recordsCount: 'n = 1.482 registros identificados',
    excludedCount: '394 duplicatas removidas antes da triagem',
    excludedReason: 'Remoção automatizada e curadoria manual via DOI/PMID no Rayyan e Mendeley',
    summary:
      'Execução das equações booleanas de alta sensibilidade nas bases MEDLINE/PubMed (n = 640), Cochrane Central (n = 312), Embase (n = 345) e SciELO/LILACS (n = 185), documentando data exata da busca e filtros aplicados conforme o item 7 do checklist PRISMA 2020.',
    keyProtocolRules: [
      'Documentação completa da string de busca para cada base de dados (Item 7 PRISMA 2020)',
      'Combinação de vocabulário controlado (MeSH / DeCS) com termos livres em título e resumo ([tiab])',
      'Rastreabilidade de registros adicionais provenientes de listas de referências e ensaios clínicos (ClinicalTrials.gov)',
    ],
    toolsUsed: ['PubMed Advanced Search', 'MeSH / DeCS', 'Cochrane Library', 'PROSPERO CRD'],
  },
  {
    id: 'triagem',
    stepNumber: 'Fase 02',
    phaseTitle: 'Triagem Inicial (Título e Resumo)',
    subtitle: 'Avaliação Cega Pareada por Dois Revisores Independentes',
    recordsCount: 'n = 1.088 registros triados',
    excludedCount: '974 registros excluídos por fugirem ao escopo PICO',
    excludedReason: 'População pediátrica não-alvo (n = 412), relatos de caso/editoriais (n = 380), desfechos não clínicos (n = 182)',
    summary:
      'Leitura independente de títulos e abstracts com mascaramento ativo ("Blind On") na plataforma Rayyan. Divergências entre o Revisor 1 e o Revisor 2 são mensuradas pelo coeficiente Kappa de Cohen (κ = 0,89) e resolvidas por um terceiro revisor sênior.',
    keyProtocolRules: [
      'Mascaramento duplo obrigatório durante o julgamento inicial de elegibilidade (Item 8 PRISMA 2020)',
      'Cálculo de concordância interobservador ( Estatística Kappa de Cohen ≥ 0,80 )',
      'Retenção conservadora para leitura integral sempre que o resumo for insuficiente para exclusão segura',
    ],
    toolsUsed: ['Rayyan QCRI (Blind Mode)', 'Kappa de Cohen', 'Matriz de Elegibilidade PICO'],
  },
  {
    id: 'elegibilidade',
    stepNumber: 'Fase 03',
    phaseTitle: 'Elegibilidade (Avaliação de Texto Completo)',
    subtitle: 'Leitura Crítica Integral e Justificativa Individual de Exclusão',
    recordsCount: 'n = 114 textos completos avaliados',
    excludedCount: '86 artigos excluídos com justificativa documentada',
    excludedReason: 'Sem grupo controle comparável (n = 38), seguimento < 12 semanas (n = 29), dados incompletos do desfecho primário (n = 19)',
    summary:
      'Inspeção minuciosa do texto integral dos 114 manuscritos recuperados. Nesta etapa, o protocolo PRISMA 2020 exige que cada artigo excluído tenha sua razão metodológica explicitamente tabulada no apêndice suplementar.',
    keyProtocolRules: [
      'Registro nominal do motivo de exclusão para cada estudo descartado após leitura integral (Item 16b PRISMA 2020)',
      'Auditoria de sobreposição de coortes (multiple publications of the same trial) para evitar dupla contagem amostral',
      'Extração padronizada de variáveis demográficas, intervenção, posologia e eventos adversos em planilha piloto',
    ],
    toolsUsed: ['Formulário Cochrane de Extração', 'Auditoria de Coortes', 'Tabela de Exclusões PRISMA'],
  },
  {
    id: 'inclusao',
    stepNumber: 'Fase 04',
    phaseTitle: 'Inclusão Final, Risco de Viés e Síntese Quantitativa',
    subtitle: 'Qualidade da Evidência (RoB 2 / GRADE) e Metanálise (Forest Plot)',
    recordsCount: 'n = 28 ensaios clínicos incluídos (18 em metanálise)',
    excludedCount: '10 estudos mantidos apenas na síntese qualitativa narrativa',
    excludedReason: 'Heterogeneidade clínica nos instrumentos de aferição secundária impediu agregação matemática direta nos 10 estudos',
    summary:
      'Consolidação dos 28 estudos primários (totalizando N = 14.620 pacientes), aplicação da ferramenta Cochrane RoB 2 para avaliação dos 5 domínios de viés, cálculo da medida de efeito sumária por modelo de efeitos aleatórios (DerSimonian-Laird) e graduação da certeza da evidência pelo sistema GRADE.',
    keyProtocolRules: [
      'Avaliação estruturada de risco de viés em 5 domínios: randomização, desvios da intervenção, dados faltantes, aferição do desfecho e relato seletivo',
      'Quantificação da heterogeneidade estatística pelo índice I² de Higgins e teste Q de Cochran (p < 0,10)',
      'Construção da tabela Summary of Findings (SoF) classificando a evidência como Alta, Moderada, Baixa ou Muito Baixa no GRADE',
    ],
    toolsUsed: ['Cochrane RoB 2.0', 'GRADEpro GDT', 'Forest Plot (Efeitos Aleatórios)', 'Estatística I² de Higgins'],
  },
];

export interface PicoScenario {
  id: string;
  specialty: string;
  clinicalTitle: string;
  p: string;
  i: string;
  c: string;
  o: string;
  t: string;
  structuredQuestion: string;
  booleanString: string;
  primaryStudyDesign: string;
  effectMeasure: string;
}

export const PICO_SCENARIOS: PicoScenario[] = [
  {
    id: 'cardio',
    specialty: 'Cardiologia Clínica & Endocrinologia',
    clinicalTitle: 'Inibidores de SGLT2 na Insuficiência Cardíaca com Fração de Ejeção Preservada (ICFEp)',
    p: 'Adultos diagnosticados com Insuficiência Cardíaca com Fração de Ejeção Preservada (FEVE ≥ 50%), classe funcional NYHA II–IV',
    i: 'Inibidores do cotransportador sódio-glicose 2 (Empagliflozina 10 mg/dia ou Dapagliflozina 10 mg/dia)',
    c: 'Placebo associado ao tratamento clínico padrão otimizado conforme diretrizes vigentes',
    o: 'Desfecho composto primário de mortalidade cardiovascular ou primeira hospitalização por descompensação de IC',
    t: 'Ensaios Clínicos Randomizados (ECRs) duplo-cegos com seguimento mínimo de 12 meses',
    structuredQuestion:
      'Em pacientes adultos com insuficiência cardíaca de fração de ejeção preservada (FEVE ≥ 50%), o uso de inibidores de SGLT2 (empagliflozina ou dapagliflozina), comparado ao placebo sobre terapia padrão, reduz o risco composto de hospitalização por IC e mortalidade cardiovascular em seguimento ≥ 12 meses?',
    booleanString:
      '("Heart Failure, Diastolic"[Mesh] OR "Preserved Ejection Fraction"[tiab] OR "HFpEF"[tiab]) AND ("Sodium-Glucose Transporter 2 Inhibitors"[Mesh] OR "Empagliflozin"[tiab] OR "Dapagliflozin"[tiab]) AND ("Randomized Controlled Trial"[pt] OR "Systematic Review"[pt])',
    primaryStudyDesign: 'Ensaios Clínicos Randomizados Multicêntricos (Fase III)',
    effectMeasure: 'Hazard Ratio (HR = 0,79; IC 95%: 0,69–0,90; p < 0,001 | I² = 0%)',
  },
  {
    id: 'oftalmo',
    specialty: 'Oftalmologia & Retina Médica',
    clinicalTitle: 'Terapia Anti-VEGF Intravítrea no Edema Macular Diabético Clinicamente Significativo',
    p: 'Pacientes adultos com Diabetes Mellitus tipo 2 e Edema Macular Diabético envolvendo o centro foveal (espessura ≥ 300 μm na OCT)',
    i: 'Injeções intravítreas de Aflibercepte (2,0 mg) ou Faricimabe em regime Treat-and-Extend',
    c: 'Ranibizumabe intravítreo (0,5 mg) ou fotocoagulação macular a laser focal/grid',
    o: 'Ganho de acuidade visual melhor corrigida (≥ 15 letras na tabela ETDRS) e redução da espessura retiniana central em 52 semanas',
    t: 'Ensaios Clínicos Randomizados com avaliação mascarada de tomografia de coerência óptica (SD-OCT)',
    structuredQuestion:
      'Em pacientes adultos com edema macular diabético envolvendo o centro foveal, a terapia intravítrea com aflibercepte ou faricimabe, comparada ao ranibizumabe ou fotocoagulação a laser, promove maior ganho de acuidade visual (ETDRS) e redução anatômica na OCT em 52 semanas?',
    booleanString:
      '("Macular Edema"[Mesh] AND "Diabetic Retinopathy"[Mesh]) AND ("Vascular Endothelial Growth Factor A"[Mesh] OR "Aflibercept"[tiab] OR "Faricimab"[tiab] OR "Ranibizumab"[tiab]) AND ("Visual Acuity"[Mesh] OR "Tomography, Optical Coherence"[Mesh])',
    primaryStudyDesign: 'Ensaios Clínicos Randomizados Controlados com Mascaramento de Avaliador',
    effectMeasure: 'Diferença Média Ponderada (+4,8 letras ETDRS; IC 95%: +2,9 a +6,7 | I² = 18%)',
  },
  {
    id: 'uti',
    specialty: 'Medicina Intensiva & Sepse',
    clinicalTitle: 'Soluções Cristaloides Balanceadas versus Salina 0,9% na Ressuscitação Volêmica do Choque Séptico',
    p: 'Pacientes adultos admitidos em Unidade de Terapia Intensiva com diagnóstico de Sepse ou Choque Séptico (critérios Sepsis-3)',
    i: 'Ressuscitação volêmica endovenosa com cristaloides balanceados (Ringer Lactato ou Plasma-Lyte 148)',
    c: 'Ressuscitação volêmica exclusiva com Cloreto de Sódio a 0,9% (Solução Salina Isotônica)',
    o: 'Mortalidade hospitalar em 28 dias, incidência de Lesão Renal Aguda (KDIGO ≥ 2) e necessidade de Terapia de Substituição Renal',
    t: 'Ensaios Clínicos Randomizados (individuais ou cluster-crossover) em pacientes críticos',
    structuredQuestion:
      'Em adultos críticos em choque séptico admitidos em UTI, a ressuscitação hemodinâmica com soluções cristaloides balanceadas, em comparação à solução salina a 0,9%, reduz a mortalidade em 28 dias e a incidência de eventos renais adversos maiores (MAKE30)?',
    booleanString:
      '("Shock, Septic"[Mesh] OR "Sepsis"[Mesh]) AND ("Balanced Crystalloids"[tiab] OR "Ringer\'s Lactate"[Mesh] OR "Plasmalyte"[tiab]) AND ("Sodium Chloride"[Mesh] OR "Normal Saline"[tiab]) AND ("Acute Kidney Injury"[Mesh] OR "Mortality"[Mesh])',
    primaryStudyDesign: 'Ensaios Clínicos Randomizados Pragmáticos e Cluster-Crossover',
    effectMeasure: 'Risco Relativo (RR = 0,93; IC 95%: 0,88–0,98; p = 0,01 | I² = 12%)',
  },
];

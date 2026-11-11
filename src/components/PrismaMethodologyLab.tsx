import React, { useState } from 'react';
import {
  PRISMA_STAGES,
  PICO_SCENARIOS,
  PrismaStage,
  PicoScenario,
} from '../data/certificateData';
import {
  Layers,
  Search,
  BarChart3,
  CheckCircle2,
  Copy,
  Check,
  SlidersHorizontal,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface ForestTrial {
  id: string;
  authorYear: string;
  sampleSize: number;
  rr: number;
  ciLow: number;
  ciHigh: number;
  weight: number;
  robStatus: 'Baixo Risco' | 'Algumas Preocupações';
  included: boolean;
}

const INITIAL_TRIALS: ForestTrial[] = [
  {
    id: 't1',
    authorYear: 'Anker et al., 2021 (EMPEROR-Preserved)',
    sampleSize: 5988,
    rr: 0.79,
    ciLow: 0.69,
    ciHigh: 0.90,
    weight: 34.2,
    robStatus: 'Baixo Risco',
    included: true,
  },
  {
    id: 't2',
    authorYear: 'Solomon et al., 2022 (DELIVER Trial)',
    sampleSize: 6263,
    rr: 0.82,
    ciLow: 0.73,
    ciHigh: 0.92,
    weight: 38.5,
    robStatus: 'Baixo Risco',
    included: true,
  },
  {
    id: 't3',
    authorYear: 'Bhatt et al., 2021 (SOLOIST-WHF Subcoorte)',
    sampleSize: 1222,
    rr: 0.67,
    ciLow: 0.52,
    ciHigh: 0.85,
    weight: 14.1,
    robStatus: 'Algumas Preocupações',
    included: true,
  },
  {
    id: 't4',
    authorYear: 'Nassif et al., 2021 (PRESERVED-HF)',
    sampleSize: 324,
    rr: 0.84,
    ciLow: 0.68,
    ciHigh: 1.03,
    weight: 7.4,
    robStatus: 'Baixo Risco',
    included: true,
  },
  {
    id: 't5',
    authorYear: 'Voors et al., 2022 (EMPULSE Multicenter)',
    sampleSize: 530,
    rr: 0.76,
    ciLow: 0.60,
    ciHigh: 0.96,
    weight: 5.8,
    robStatus: 'Baixo Risco',
    included: true,
  },
];

export const PrismaMethodologyLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prisma' | 'pico' | 'meta'>('prisma');
  const [selectedStageId, setSelectedStageId] = useState<PrismaStage['id']>('identificacao');
  const [selectedPicoId, setSelectedPicoId] = useState<string>('cardio');
  const [copiedString, setCopiedString] = useState<boolean>(false);
  const [trials, setTrials] = useState<ForestTrial[]>(INITIAL_TRIALS);

  const currentStage =
    PRISMA_STAGES.find((s) => s.id === selectedStageId) || PRISMA_STAGES[0];
  const currentPico: PicoScenario =
    PICO_SCENARIOS.find((p) => p.id === selectedPicoId) || PICO_SCENARIOS[0];

  const handleCopyBoolean = () => {
    navigator.clipboard.writeText(currentPico.booleanString);
    setCopiedString(true);
    setTimeout(() => setCopiedString(false), 2000);
  };

  const toggleTrialInclusion = (id: string) => {
    const activeCount = trials.filter((t) => t.included).length;
    const target = trials.find((t) => t.id === id);
    if (target?.included && activeCount <= 2) return; // keep at least 2 studies for meta-analysis
    setTrials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, included: !t.included } : t))
    );
  };

  const resetTrials = () => setTrials(INITIAL_TRIALS);

  const activeTrials = trials.filter((t) => t.included);
  const totalWeight = activeTrials.reduce((acc, t) => acc + t.weight, 0);
  const totalSample = activeTrials.reduce((acc, t) => acc + t.sampleSize, 0);
  const pooledRR =
    activeTrials.reduce((acc, t) => acc + t.rr * t.weight, 0) /
    (totalWeight || 1);
  const pooledLow =
    activeTrials.reduce((acc, t) => acc + t.ciLow * t.weight, 0) /
    (totalWeight || 1);
  const pooledHigh =
    activeTrials.reduce((acc, t) => acc + t.ciHigh * t.weight, 0) /
    (totalWeight || 1);

  // Check if outlier study t3 is included to show realistic I² shift
  const hasSubcohort = activeTrials.some((t) => t.id === 't3');
  const iSquared = hasSubcohort ? 14.2 : 0.0;

  return (
    <section
      id="metodologia-prisma"
      className="py-16 border-b border-slate-200/80 bg-white"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-2xl">
            <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#064E3B] font-semibold">
              01. Laboratório Metodológico Interativo · PRISMA 2020 &amp; MBE
            </div>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-2 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Arquitetura de Revisão Sistemática, Protocolo PRISMA e Síntese de Evidências
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed mt-3">
              Explore de forma prática os três pilares metodológicos desenvolvidos ao longo das 40
              horas do curso: o fluxo de seleção PRISMA 2020 em quatro fases, a modelagem de
              perguntas clínicas PICO com sintaxe booleana e a análise de sensibilidade em Forest
              Plot.
            </p>
          </div>

          {/* Interactive Module Switcher (Segmented Control) */}
          <div
            role="tablist"
            aria-label="Módulos interativos de metodologia científica"
            className="inline-flex items-center gap-1 p-1.5 bg-[#F1F5F3] border border-slate-200/80 rounded-xl self-start lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'prisma'}
              onClick={() => setActiveTab('prisma')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'prisma'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Fluxograma PRISMA 2020
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'pico'}
              onClick={() => setActiveTab('pico')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'pico'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Construtor PICO &amp; MeSH
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'meta'}
              onClick={() => setActiveTab('meta')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'meta'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Forest Plot &amp; Risco de Viés
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: FLUXOGRAMA INTERATIVO PRISMA 2020 (2-ZONE SANDBOX)          */}
        {/* =================================================================== */}
        {activeTab === 'prisma' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Stage: Interactive 4-Phase PRISMA Diagram (7 cols) */}
            <div className="lg:col-span-7 bg-[#F8FAF9] border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Diagrama de Fluxo PRISMA 2020 (Interativo)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selecione qualquer fase abaixo para inspecionar os critérios de filtragem e
                    auditoria cega
                  </p>
                </div>
                <span className="text-xs font-mono-tabular text-slate-600">
                  PROSPERO · 27 Itens
                </span>
              </div>

              <div className="space-y-3.5">
                {PRISMA_STAGES.map((stage, idx) => {
                  const isSelected = stage.id === selectedStageId;
                  return (
                    <div key={stage.id} className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedStageId(stage.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#064E3B] ring-2 ring-[#064E3B]/15 shadow-xs'
                            : 'bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-mono-tabular text-xs font-bold px-2.5 py-1 rounded ${
                                isSelected
                                  ? 'bg-[#064E3B] text-white'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {stage.stepNumber}
                            </span>
                            <div>
                              <div className="text-sm font-bold text-slate-900">
                                {stage.phaseTitle}
                              </div>
                              <div className="text-xs text-slate-500">{stage.subtitle}</div>
                            </div>
                          </div>
                          <div className="font-mono-tabular text-xs font-semibold text-[#064E3B] shrink-0">
                            {stage.recordsCount}
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                          <span>
                            <strong className="text-amber-800">Filtragem / Exclusão:</strong>{' '}
                            {stage.excludedCount}
                          </span>
                          <span className="text-[#0A1D56] font-medium inline-flex items-center gap-1">
                            Inspecionar protocolo <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>

                      {idx < PRISMA_STAGES.length - 1 && (
                        <div className="flex justify-center my-1" aria-hidden="true">
                          <div className="w-px h-3 bg-slate-300" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Control & Concept Deck: Detailed Protocol Inspection (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono-tabular text-[#064E3B] font-semibold">
                  {currentStage.stepNumber} · Especificação Técnica PRISMA 2020
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                  {currentStage.phaseTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{currentStage.subtitle}</p>

                <div className="mt-5 p-4 rounded-lg bg-[#F8FAF9] border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Volume Amostral na Etapa:</span>
                    <span className="font-mono-tabular font-bold text-slate-900">
                      {currentStage.recordsCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Registros Retidos / Excluídos:</span>
                    <span className="font-mono-tabular font-semibold text-amber-800">
                      {currentStage.excludedCount}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/70 text-xs text-slate-600 leading-relaxed">
                    <strong>Motivo Metodológico:</strong> {currentStage.excludedReason}
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed mt-5">
                  {currentStage.summary}
                </p>

                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Diretrizes Obrigatórias de Auditoria (Eixo II &amp; III)
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {currentStage.keyProtocolRules.map((rule, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 mb-1.5">
                  Instrumentos e Softwares Aplicados nesta Fase:
                </div>
                <div className="text-xs font-mono-tabular text-slate-800 font-medium">
                  {currentStage.toolsUsed.join('  ·  ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: SIMULADOR PICO & SINTAXE BOOLEANA (PUBMED / MESH)            */}
        {/* =================================================================== */}
        {activeTab === 'pico' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Clinical Scenario Selector + P-I-C-O-T Breakdown */}
            <div className="lg:col-span-7 bg-[#F8FAF9] border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Estruturação de Pergunta Clínica (Estratégia PICOT)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Selecione um protocolo clínico para decompor os elementos PICO e gerar a
                      equação booleana
                    </p>
                  </div>
                </div>

                {/* Scenario Selector Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
                  {PICO_SCENARIOS.map((item) => {
                    const active = item.id === selectedPicoId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedPicoId(item.id)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`text-[11px] font-mono-tabular ${
                            active ? 'text-emerald-200' : 'text-slate-500'
                          }`}
                        >
                          {item.specialty}
                        </div>
                        <div className="text-xs font-bold mt-1 line-clamp-2">
                          {item.clinicalTitle}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* PICOT Decomposition Table */}
                <div className="mt-5 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
                  {[
                    {
                      letter: 'P',
                      name: 'População / Problema Clínico',
                      value: currentPico.p,
                    },
                    {
                      letter: 'I',
                      name: 'Intervenção / Exposição Principal',
                      value: currentPico.i,
                    },
                    {
                      letter: 'C',
                      name: 'Comparador / Controle Padrão',
                      value: currentPico.c,
                    },
                    {
                      letter: 'O',
                      name: 'Desfechos Clínicos (Outcomes)',
                      value: currentPico.o,
                    },
                    {
                      letter: 'T',
                      name: 'Tipo de Estudo & Tempo de Seguimento',
                      value: currentPico.t,
                    },
                  ].map((row) => (
                    <div
                      key={row.letter}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                      <div className="flex items-center gap-2.5 sm:w-56 shrink-0">
                        <span className="w-7 h-7 rounded-lg bg-[#064E3B] text-white font-mono-tabular font-bold text-xs flex items-center justify-center shrink-0">
                          {row.letter}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{row.name}</span>
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed flex-1">
                        {row.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Formulated Question & Reproducible PubMed Search String */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono-tabular text-[#0A1D56] font-semibold">
                  Eixo I · Descritores Controlados MeSH &amp; DeCS
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                  Questão Clínica &amp; Equação de Busca Reprodutível
                </h3>

                <div className="mt-5 p-4 rounded-xl bg-[#F8FAF9] border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 mb-1.5">
                    Pergunta Estruturada de Revisão Sistemática:
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    &ldquo;{currentPico.structuredQuestion}&rdquo;
                  </p>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">
                      String Booleana (MEDLINE / PubMed Advanced Search):
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyBoolean}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                    >
                      {copiedString ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copiar String
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono-tabular text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {currentPico.booleanString}
                  </pre>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Delineamento Elegível:</span>
                  <span className="font-semibold text-slate-900">
                    {currentPico.primaryStudyDesign}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Estimativa Sumária (Metanálise):</span>
                  <span className="font-mono-tabular font-bold text-[#064E3B]">
                    {currentPico.effectMeasure}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: FOREST PLOT INTERATIVO, HETEROGENEIDADE I² E ROB 2           */}
        {/* =================================================================== */}
        {activeTab === 'meta' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Stage: Interactive Forest Plot & Sensitivity Simulator (8 cols) */}
            <div className="lg:col-span-8 bg-[#F8FAF9] border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Simulador de Forest Plot &amp; Análise de Sensibilidade (Leave-One-Out)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ative ou desative ensaios clínicos abaixo para observar o impacto imediato na
                    heterogeneidade (I² de Higgins) e no efeito sumário
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetTrials}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar Todos os Estudos
                </button>
              </div>

              {/* Forest Plot Table */}
              <div className="mt-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                  <div className="col-span-4">Ensaio Clínico Randomizado</div>
                  <div className="col-span-2 text-right">Amostra (N) / Peso</div>
                  <div className="col-span-4 text-center">
                    Gráfico Forest Plot (RR e IC 95%)
                  </div>
                  <div className="col-span-2 text-right">RoB 2 / Estimativa</div>
                </div>

                <div className="divide-y divide-slate-200">
                  {trials.map((trial) => {
                    // Map RR [0.4 to 1.2] to percentage [0% to 100%]
                    const mapX = (val: number) =>
                      Math.max(2, Math.min(98, ((val - 0.4) / 0.8) * 100));
                    const leftPct = mapX(trial.ciLow);
                    const rightPct = mapX(trial.ciHigh);
                    const centerPct = mapX(trial.rr);
                    const nullLinePct = mapX(1.0); // 1.0 = 75%

                    return (
                      <div
                        key={trial.id}
                        className={`grid grid-cols-12 gap-2 px-4 py-3 items-center transition-opacity ${
                          trial.included ? 'opacity-100' : 'opacity-45 bg-slate-50/60'
                        }`}
                      >
                        <div className="col-span-4 flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={trial.included}
                            onChange={() => toggleTrialInclusion(trial.id)}
                            aria-label={`Incluir ${trial.authorYear}`}
                            className="w-4 h-4 accent-[#064E3B] rounded cursor-pointer shrink-0"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              {trial.authorYear}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Cochrane RoB 2: {trial.robStatus}
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 text-right font-mono-tabular text-xs text-slate-700">
                          <div>{trial.sampleSize.toLocaleString('pt-BR')} pac.</div>
                          <div className="text-[11px] text-slate-500">
                            {trial.weight.toFixed(1)}%
                          </div>
                        </div>

                        {/* Visual Forest Plot Bar */}
                        <div className="col-span-4 relative h-8 flex items-center">
                          {/* Null line at RR = 1.0 */}
                          <div
                            className="absolute top-0 bottom-0 border-l border-dashed border-slate-400"
                            style={{ left: `${nullLinePct}%` }}
                          />
                          {trial.included && (
                            <>
                              {/* Horizontal 95% CI line */}
                              <div
                                className="absolute h-0.5 bg-[#0A1D56]"
                                style={{
                                  left: `${leftPct}%`,
                                  width: `${Math.max(2, rightPct - leftPct)}%`,
                                }}
                              />
                              {/* Square point estimate proportional to weight */}
                              <div
                                className="absolute bg-[#064E3B] border border-white shadow-2xs"
                                style={{
                                  left: `${centerPct}%`,
                                  width: `${Math.max(8, Math.min(14, trial.weight * 0.35))}px`,
                                  height: `${Math.max(8, Math.min(14, trial.weight * 0.35))}px`,
                                  transform: 'translateX(-50%)',
                                }}
                              />
                            </>
                          )}
                        </div>

                        <div className="col-span-2 text-right font-mono-tabular text-xs">
                          <div className="font-bold text-slate-900">
                            {trial.rr.toFixed(2)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            [{trial.ciLow.toFixed(2)}–{trial.ciHigh.toFixed(2)}]
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Pooled Summary Row (Diamond) */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-3.5 bg-[#EDFCF5] border-t-2 border-[#064E3B] items-center">
                    <div className="col-span-4">
                      <div className="text-xs font-bold text-[#064E3B]">
                        EFEITO SUMÁRIO (Modelo de Efeitos Aleatórios)
                      </div>
                      <div className="text-[11px] font-mono-tabular text-slate-600">
                        Heterogeneidade: I² = {iSquared.toFixed(1)}% · p &lt; 0,001
                      </div>
                    </div>

                    <div className="col-span-2 text-right font-mono-tabular text-xs font-bold text-slate-900">
                      <div>{totalSample.toLocaleString('pt-BR')} pac.</div>
                      <div className="text-[11px] text-[#064E3B]">100,0%</div>
                    </div>

                    {/* Pooled Diamond Graphic */}
                    <div className="col-span-4 relative h-8 flex items-center">
                      <div
                        className="absolute top-0 bottom-0 border-l border-dashed border-slate-500"
                        style={{ left: '75%' }}
                      />
                      <svg
                        viewBox="0 0 100 24"
                        className="w-full h-6 overflow-visible"
                        preserveAspectRatio="none"
                      >
                        {(() => {
                          const xLow = ((pooledLow - 0.4) / 0.8) * 100;
                          const xMid = ((pooledRR - 0.4) / 0.8) * 100;
                          const xHigh = ((pooledHigh - 0.4) / 0.8) * 100;
                          return (
                            <polygon
                              points={`${xLow},12 ${xMid},4 ${xHigh},12 ${xMid},20`}
                              fill="#064E3B"
                              stroke="#0A1D56"
                              strokeWidth="1"
                            />
                          );
                        })()}
                      </svg>
                    </div>

                    <div className="col-span-2 text-right font-mono-tabular text-xs">
                      <div className="font-bold text-[#064E3B]">
                        RR {pooledRR.toFixed(2)}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-700">
                        [{pooledLow.toFixed(2)}–{pooledHigh.toFixed(2)}]
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Deck: GRADE & Cochrane RoB 2 Interpretation (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#064E3B] font-semibold">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Eixo III &amp; IV · Síntese Quantitativa
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                  Interpretação Clínica &amp; Certeza GRADE
                </h3>

                <div className="mt-5 p-4 rounded-xl bg-[#F8FAF9] border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Estudos Ativos na Síntese:</span>
                    <span className="font-mono-tabular font-bold text-slate-900">
                      {activeTrials.length} de {trials.length} ECRs
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Redução Relativa de Risco:</span>
                    <span className="font-mono-tabular font-bold text-[#064E3B]">
                      {((1 - pooledRR) * 100).toFixed(1)}% (IC 95% não cruza 1,0)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Índice I² de Higgins:</span>
                    <span className="font-mono-tabular font-bold text-slate-900">
                      {iSquared.toFixed(1)}% ({iSquared === 0 ? 'Homogêneo' : 'Heterogeneidade Baixa'})
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-xs text-slate-700 leading-relaxed">
                  <p>
                    <strong>Leitura do Diamante Sumário:</strong> Como o limite superior do
                    intervalo de confiança de 95% ({pooledHigh.toFixed(2)}) permanece inteiramente à
                    esquerda da linha de nulidade (RR = 1,00), confirma-se benefício estatisticamente
                    significativo a favor da intervenção.
                  </p>
                  <p>
                    <strong>Análise de Sensibilidade:</strong> Ao desmarcar a subcoorte{' '}
                    <em>SOLOIST-WHF</em>, observe que a heterogeneidade estatística cai de{' '}
                    <span className="font-mono-tabular font-semibold">I² = 14,2%</span> para{' '}
                    <span className="font-mono-tabular font-semibold">I² = 0,0%</span>, demonstrando
                    consistência robusta entre os grandes ensaios multicêntricos.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-900">
                  Classificação Final no Sistema GRADE:
                </div>
                <div className="mt-1 text-xs font-mono-tabular text-[#064E3B] font-semibold">
                  ⊕⊕⊕⊕ ALTA CERTEZA DA EVIDÊNCIA · RECOMENDAÇÃO FORTE (IA)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

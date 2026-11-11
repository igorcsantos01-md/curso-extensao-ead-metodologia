import React, { useState, useEffect } from 'react';
import { CERTIFICATE_07 } from './data/certificateData';
import { generateOfficialCertificatePdf } from './utils/pdfGenerator';
import { CertificateSheet } from './components/CertificateSheet';
import { PrismaMethodologyLab } from './components/PrismaMethodologyLab';
import { PublicAuthenticator } from './components/PublicAuthenticator';
import {
  Download,
  Printer,
  ShieldCheck,
  BookOpen,
  FileText,
  ZoomIn,
  Check,
  Copy,
} from 'lucide-react';

export default function App() {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [visiblePages, setVisiblePages] = useState<'both' | 'front' | 'back'>('both');
  const [zoomScale, setZoomScale] = useState<'fit' | '0.85' | '1'>('fit');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [pdfFeedback, setPdfFeedback] = useState<string | null>(null);

  const cert = CERTIFICATE_07;

  // Auto-scroll to #validador or #certificado-oficial if present in URL hash or ?codigo= query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasCodigo = params.has('codigo') || params.has('chave');
    const hash = window.location.hash;

    if (hash === '#validador' || hasCodigo) {
      setTimeout(() => {
        document.getElementById('validador')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else if (hash === '#certificado-oficial') {
      setTimeout(() => {
        document.getElementById('certificado-oficial')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, []);

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      setPdfFeedback(null);
      await generateOfficialCertificatePdf(cert);
      setPdfFeedback(
        'PDF Oficial de 2 Laudas (A4 Paisagem, vetorial e selecionável) baixado com sucesso.'
      );
      setTimeout(() => setPdfFeedback(null), 5000);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setPdfFeedback('Não foi possível gerar o PDF automaticamente. Utilize a opção Imprimir A4.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  const handleCopyVerificationUrl = () => {
    const origin = window.location.origin.replace(/\/$/, '');
    const url = `${origin}/?codigo=${cert.code}#validador`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#0F172A]">
      {/* =================================================================== */}
      {/* TOP BAR CONTRACT: 1 Row, 3 Zones separated by gap-8                 */}
      {/* =================================================================== */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#topo"
            className="font-display text-xl font-bold tracking-tight text-[#064E3B] whitespace-nowrap shrink-0"
          >
            Editora Mente e Saúde
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Navegação Principal"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#metodologia-prisma"
              className="hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Metodologia PRISMA
            </a>
            <a
              href="#matriz-curricular"
              className="hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Matriz 40h
            </a>
            <a
              href="#validador"
              className="hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Validador Oficial
            </a>
            <a
              href="#certificado-oficial"
              className="hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Certificado Nº 07
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-4 py-2 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#053F30] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
            >
              {isDownloadingPdf ? 'Baixando PDF...' : 'Baixar PDF Oficial'}
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* MAIN WEB PORTAL CONTENT (Hidden during @media print)                */}
      {/* =================================================================== */}
      <main id="topo" className="no-print flex-1">
        {/* HERO SECTION */}
        <section className="py-12 lg:py-16 border-b border-slate-200/80 bg-gradient-to-b from-white to-[#F8FAF9]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left Column: Course Overview & Primary Actions (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Quiet unboxed metadata line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#064E3B] font-semibold">
                    <span>Programa Interinstitucional EAD</span>
                    <span aria-hidden="true">·</span>
                    <span>Certificado Nº {cert.certNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>Cód. {cert.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>40 Horas</span>
                  </div>

                  <h1
                    className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-slate-900 leading-[1.12] tracking-tight mt-3"
                    style={{ textWrap: 'balance' }}
                  >
                    Curso de Extensão EAD em Metodologia de Revisão Sistemática, Protocolo PRISMA e
                    Medicina Baseada em Evidências
                  </h1>

                  <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed mt-4 max-w-2xl">
                    Formação metodológica interinstitucional promovida pela{' '}
                    <strong className="text-slate-900">
                      Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)
                    </strong>{' '}
                    em parceria com o{' '}
                    <strong className="text-slate-900">
                      Centro Profissionalizante Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)
                    </strong>
                    , estruturada para capacitar médicos e pesquisadores na formulação de perguntas
                    PICO, diretrizes PRISMA 2020, auditoria de risco de viés (Cochrane RoB 2 /
                    GRADE) e síntese quantitativa em metanálise.
                  </p>
                </div>

                {/* Primary Hero Action Bar */}
                <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold bg-[#064E3B] text-white hover:bg-[#053F30] transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs disabled:opacity-60"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloadingPdf
                      ? 'Gerando PDF Oficial (2 Laudas)...'
                      : 'Baixar Certificado em PDF (2 Laudas)'}
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('certificado-oficial')}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <FileText className="w-4 h-4 text-[#0A1D56]" />
                    Inspecionar Certificado (Frente e Verso)
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('validador')}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-semibold bg-[#F0F5FF] border border-slate-300 text-[#0A1D56] hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verificar Autenticidade
                  </button>
                </div>
              </div>

              {/* Right Column: Official Institutional Dossier Card (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  {/* Dual Institutional Logos Header */}
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <img
                        src="/assets/cert/logo-ems.png"
                        alt="Logo Editora Mente e Saúde"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-contain"
                      />
                      <img
                        src="/assets/cert/logo-cpmda.png"
                        alt="Logo Centro Profissionalizante Maria Dalva de Araújo"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="text-right font-mono-tabular">
                      <div className="text-[11px] uppercase text-slate-500">Registro Oficial</div>
                      <div className="text-xs font-bold text-[#064E3B]">{cert.code}</div>
                    </div>
                  </div>

                  {/* Holder Summary */}
                  <div className="mt-4 p-4 rounded-lg bg-[#EDFCF5] border border-amber-500/40">
                    <div className="text-[11px] font-mono-tabular uppercase text-[#064E3B] font-semibold">
                      Titular Certificado · Fé Pública Confirmada
                    </div>
                    <div className="font-display text-2xl font-bold text-[#0A1D56] mt-0.5">
                      {cert.holderName}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">
                      {cert.holderQualification} · CPF: {cert.holderCpf}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">{cert.holderInstitution}</div>
                  </div>

                  {/* Key Record Specifications */}
                  <dl className="mt-4 divide-y divide-slate-100 text-xs">
                    <div className="py-2 flex items-center justify-between">
                      <dt className="text-slate-500">Enquadramento Curricular:</dt>
                      <dd className="font-semibold text-slate-900">
                        Item 09 — Extensão (≥ 30 horas)
                      </dd>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <dt className="text-slate-500">Período de Realização:</dt>
                      <dd className="font-mono-tabular font-medium text-slate-800">
                        14/10/2024 a 15/11/2024
                      </dd>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <dt className="text-slate-500">Livro / Folha / Emissão:</dt>
                      <dd className="font-mono-tabular font-medium text-slate-800">
                        Livro {cert.bookNumber} · Folha {cert.sheetNumber} · 22/11/2024
                      </dd>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <dt className="text-slate-500">Chave de Controle:</dt>
                      <dd className="font-mono-tabular font-bold text-amber-800">
                        {cert.controlKey}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Documento Oficial de 2 Laudas (A4 Paisagem)</span>
                  <span className="font-mono-tabular font-bold text-[#064E3B]">
                    APROVADO · NOTA {cert.grade}
                  </span>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Academic Proof Strip below Hero Split */}
            <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-xs text-slate-500">Carga Horária Total Certificada</div>
                <div className="font-mono-tabular text-2xl font-bold text-[#064E3B] mt-1">
                  40h 00min
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  4 Eixos Programáticos de 10h cada
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Diretriz Internacional de Relato</div>
                <div className="font-mono-tabular text-2xl font-bold text-[#0A1D56] mt-1">
                  PRISMA 2020
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Checklist de 27 Itens &amp; Fluxograma 4 Fases
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Auditoria Crítica de Evidências</div>
                <div className="font-mono-tabular text-2xl font-bold text-slate-900 mt-1">
                  RoB 2 &amp; GRADE
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Triagem Cega Pareada via Software Rayyan
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Aproveitamento na Avaliação Final</div>
                <div className="font-mono-tabular text-2xl font-bold text-[#064E3B] mt-1">
                  Nota 9,8 / 10
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Frequência Integral (100% — Aprovado)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 01: INTERACTIVE PRISMA & MBE METHODOLOGY LAB */}
        <PrismaMethodologyLab />

        {/* SECTION 02: MATRIZ PROGRAMÁTICA COMPLETA (40 HORAS) */}
        <section
          id="matriz-curricular"
          className="py-16 bg-white border-b border-slate-200/80 scroll-mt-16"
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
              <div className="max-w-2xl">
                <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#0A1D56] font-semibold">
                  02. Estrutura Curricular Averbação Livro 01/2024 · Folha 34
                </div>
                <h2
                  className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-2 tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Matriz Programática e Metodologia Pedagógica (40 Horas)
                </h2>
                <p className="text-slate-600 text-[15px] leading-relaxed mt-2">
                  Ementa analítica integral correspondente ao Verso Oficial (Lauda 2) do Certificado
                  Nº 07, estruturada para atender aos requisitos de pontuação curricular em
                  Atividades Extracurriculares (Item 09).
                </p>
              </div>
              <div className="text-xs font-mono-tabular text-slate-600">
                Modalidade: Extensão EAD · Carga Total: 40h 00min
              </div>
            </div>

            {/* 4 Axes Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {cert.axes.map((axis, idx) => (
                <article
                  key={axis.id}
                  className="bg-[#F8FAF9] border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200">
                      <span className="text-xs font-mono-tabular font-bold text-[#064E3B]">
                        MÓDULO 0{idx + 1} · EIXO {axis.id}
                      </span>
                      <span className="text-xs font-mono-tabular font-bold text-[#0A1D56]">
                        Carga Horária: {axis.hours}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                      {axis.titleLine1} {axis.titleLine2}
                    </h3>
                    <div className="text-xs font-medium text-[#064E3B] mt-1">
                      {axis.subtitleLine1}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mt-3.5">
                      {axis.descriptionLine1} {axis.descriptionLine2}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Avaliação Teórico-Prática Cumprida</span>
                    <span className="font-mono-tabular font-semibold text-slate-700">
                      100% Integralizado
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* Fundamental Bibliographic References Box */}
            <div className="mt-8 bg-[#F8FAF9] border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <BookOpen className="w-4 h-4 text-[#064E3B]" />
                Referências Metodológicas Adotadas pela Curadoria Editorial
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
                <div>
                  <strong className="text-slate-900 block mb-0.5">
                    1. Diretriz PRISMA 2020 (BMJ / Lancet)
                  </strong>
                  Page MJ, McKenzie JE, Bossuyt PM, et al. The PRISMA 2020 statement: an updated
                  guideline for reporting systematic reviews. <em>BMJ</em> 2021;372:n71.
                </div>
                <div>
                  <strong className="text-slate-900 block mb-0.5">
                    2. Cochrane Handbook &amp; RoB 2.0
                  </strong>
                  Higgins JPT, Thomas J, Chandler J, et al.{' '}
                  <em>Cochrane Handbook for Systematic Reviews of Interventions</em>. Version 6.4.
                  Cochrane, 2023.
                </div>
                <div>
                  <strong className="text-slate-900 block mb-0.5">
                    3. Sistema GRADE &amp; Síntese de Evidências
                  </strong>
                  Guyatt GH, Oxman AD, Vist GE, et al. GRADE: an emerging consensus on rating
                  quality of evidence and strength of recommendations. <em>BMJ</em> 2008;336:924.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 03: PUBLIC AUTHENTICATOR (#validador) */}
        <PublicAuthenticator
          cert={cert}
          onDownloadPdf={handleDownloadPdf}
          isDownloading={isDownloadingPdf}
          onScrollToCertificate={() => scrollToSection('certificado-oficial')}
        />

        {/* SECTION 04: OFFICIAL ACCESSIBLE PDF CERTIFICATE VIEWER (2 LAUDAS) */}
        <section
          id="certificado-oficial"
          className="py-16 bg-white scroll-mt-16"
        >
          <div className="max-w-[1200px] mx-auto px-6">
            {/* Viewer Header & Controls Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#064E3B] font-semibold">
                  04. Visualização Documental em Estilo PDF Acessível · 2 Laudas A4 Paisagem
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-2 tracking-tight">
                  Certificado Oficial Nº 07 (Frente e Verso com Texto Selecionável)
                </h2>
                <p className="text-slate-600 text-sm mt-1.5">
                  O documento abaixo preserva 100% da diagramação oficial em A4 Paisagem (297mm ×
                  210mm), com logotipos e rubricas originais, selo de fé pública, QR Code ativo e
                  camada de texto totalmente selecionável.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#064E3B] text-white hover:bg-[#053F30] transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs disabled:opacity-60"
                >
                  <Download className="w-4 h-4" />
                  {isDownloadingPdf
                    ? 'Gerando PDF...'
                    : 'Baixar Certificado em PDF (2 Laudas)'}
                </button>

                <button
                  type="button"
                  onClick={handleNativePrint}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir A4 Paisagem
                </button>

                <button
                  type="button"
                  onClick={handleCopyVerificationUrl}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      Link Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Link do Validador
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Feedback Banner after PDF download */}
            {pdfFeedback && (
              <div className="mt-4 p-3.5 rounded-lg bg-[#EDFCF5] border border-emerald-300 text-xs font-medium text-[#064E3B] flex items-center justify-between">
                <span>{pdfFeedback}</span>
                <button
                  type="button"
                  onClick={() => setPdfFeedback(null)}
                  className="text-xs font-bold underline ml-4 cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            )}

            {/* PDF Reader Control Bar (Page Filter + Zoom) */}
            <div className="mt-6 bg-slate-900 text-white rounded-t-xl px-5 py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-mono-tabular text-emerald-300 font-semibold">
                  Certificado_Extensao_07_{cert.code}_LUCAS_GONCALVES_SILVEIRA.pdf
                </span>
                <span className="text-slate-400 hidden sm:inline">·</span>
                <span className="text-slate-300 hidden sm:inline">
                  2 Laudas (A4 Paisagem 297mm × 210mm)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Page Filter */}
                <div className="inline-flex items-center bg-slate-800 p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setVisiblePages('both')}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      visiblePages === 'both'
                        ? 'bg-[#064E3B] text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Ambas as Laudas (1 e 2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisiblePages('front')}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      visiblePages === 'front'
                        ? 'bg-[#064E3B] text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Lauda 1 (Frente)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisiblePages('back')}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      visiblePages === 'back'
                        ? 'bg-[#064E3B] text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Lauda 2 (Verso)
                  </button>
                </div>

                {/* Zoom Selector */}
                <div className="inline-flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs">
                  <ZoomIn className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
                  <button
                    type="button"
                    onClick={() => setZoomScale('fit')}
                    className={`px-2 py-1 rounded font-mono-tabular transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      zoomScale === 'fit'
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Ajustar
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomScale('0.85')}
                    className={`px-2 py-1 rounded font-mono-tabular transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      zoomScale === '0.85'
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    85%
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomScale('1')}
                    className={`px-2 py-1 rounded font-mono-tabular transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      zoomScale === '1'
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    100%
                  </button>
                </div>
              </div>
            </div>

            {/* PDF Canvas Backdrop */}
            <div className="bg-slate-800/95 border-x border-b border-slate-800 rounded-b-xl p-4 sm:p-8 overflow-x-auto">
              <CertificateSheet
                cert={cert}
                visiblePages={visiblePages}
                zoomScale={zoomScale}
              />
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================== */}
      {/* INSTITUTIONAL FOOTER (Hidden during @media print)                   */}
      {/* =================================================================== */}
      <footer className="no-print bg-white border-t border-slate-200 py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-slate-500">
          <div className="space-y-1">
            <div className="font-bold text-slate-900">
              Programa Interinstitucional de Extensão, Comunicação Científica e Educação em Saúde
            </div>
            <div>
              Editora Mente e Saúde (CNPJ: 51.372.335/0001-71) · Centro Profissionalizante Maria
              Dalva de Araújo (CNPJ: 51.269.112/0001-83)
            </div>
          </div>
          <div className="font-mono-tabular text-right">
            <div>Registro Oficial: {cert.code}</div>
            <div>Chave de Controle: {cert.controlKey}</div>
          </div>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* DEDICATED PRINT-ONLY 2-PAGE A4 LANDSCAPE CONTAINER                  */}
      {/* =================================================================== */}
      <CertificateSheet cert={cert} isPrintClone={true} />
    </div>
  );
}

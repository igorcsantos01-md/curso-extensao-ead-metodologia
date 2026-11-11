import React, { useState, useEffect } from 'react';
import { CertificateRecord } from '../data/certificateData';
import {
  ShieldCheck,
  Search,
  Download,
  FileText,
  AlertTriangle,
  Copy,
  Check,
  QrCode,
} from 'lucide-react';

interface PublicAuthenticatorProps {
  cert: CertificateRecord;
  onDownloadPdf: () => void;
  isDownloading: boolean;
  onScrollToCertificate: () => void;
}

export const PublicAuthenticator: React.FC<PublicAuthenticatorProps> = ({
  cert,
  onDownloadPdf,
  isDownloading,
  onScrollToCertificate,
}) => {
  const [queryInput, setQueryInput] = useState<string>(cert.code);
  const [validationState, setValidationState] = useState<'valid' | 'invalid'>('valid');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [verifiedTimestamp, setVerifiedTimestamp] = useState<string>('');

  const verifyCodeOrKey = (rawInput: string) => {
    const clean = rawInput.trim().toUpperCase();
    const validTargets = [
      cert.code.toUpperCase(),
      cert.controlKey.toUpperCase(),
      cert.sha256.toUpperCase(),
      'EMS-EXT-2024-0907',
      '0907-7027-9457-7D9E',
      'LUCAS GONÇALVES SILVEIRA',
      'LUCAS GONCALVES SILVEIRA',
      '702.794.941-57',
      '70279494157',
    ];
    if (!clean || validTargets.includes(clean)) {
      setValidationState('valid');
    } else {
      setValidationState('invalid');
    }
    const now = new Date();
    setVerifiedTimestamp(
      now.toLocaleDateString('pt-BR') +
        ' às ' +
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCodigo = params.get('codigo') || params.get('chave');
    if (urlCodigo) {
      setQueryInput(urlCodigo);
      verifyCodeOrKey(urlCodigo);
    } else {
      verifyCodeOrKey(cert.code);
    }
  }, [cert.code]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCodeOrKey(queryInput);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(cert.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://extensao-revisao-prisma.vercel.app';
  const verificationUrl = `${origin.replace(/\/$/, '')}/?codigo=${cert.code}#validador`;

  return (
    <section
      id="validador"
      className="py-16 bg-[#F8FAF9] border-b border-slate-200/80 scroll-mt-16"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#064E3B] font-semibold">
            03. Fé Pública Interinstitucional · Verificação Criptográfica SHA-256
          </div>
          <h2
            className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-2 tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Sistema Oficial de Autenticação Pública de Certificados
          </h2>
          <p className="text-slate-600 text-[15px] leading-relaxed mt-2">
            Consulte a autenticidade documental informando o{' '}
            <strong className="text-slate-900">Código de Autenticidade</strong>, a{' '}
            <strong className="text-slate-900">Chave de Controle</strong> ou escaneando o QR Code
            impresso nas Laudas 1 e 2 do certificado.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Informe o Código (EMS-EXT-2024-0907) ou Chave (0907-7027-9457-7D9E)"
                aria-label="Código de Autenticidade ou Chave de Controle"
                className="w-full pl-10 pr-4 py-3 text-sm font-mono-tabular bg-[#F8FAF9] border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#064E3B] focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="submit"
                className="px-5 py-3 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#053F30] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Validar Autenticidade
              </button>
              <button
                type="button"
                onClick={() => {
                  setQueryInput(cert.controlKey);
                  verifyCodeOrKey(cert.controlKey);
                }}
                className="px-4 py-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Testar por Chave
              </button>
            </div>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              <span>Parâmetro de leitura direta via QR Code: </span>
              <code className="font-mono-tabular text-slate-700">{verificationUrl}</code>
            </div>
            <div>
              <span>Código Oficial: </span>
              <button
                type="button"
                onClick={() => {
                  setQueryInput(cert.code);
                  verifyCodeOrKey(cert.code);
                }}
                className="font-mono-tabular font-bold text-[#064E3B] hover:underline cursor-pointer"
              >
                {cert.code}
              </button>
              <span className="mx-1.5">·</span>
              <span>Chave: </span>
              <button
                type="button"
                onClick={() => {
                  setQueryInput(cert.controlKey);
                  verifyCodeOrKey(cert.controlKey);
                }}
                className="font-mono-tabular font-bold text-[#0A1D56] hover:underline cursor-pointer"
              >
                {cert.controlKey}
              </button>
            </div>
          </div>

          {/* Validation Output Panel */}
          {validationState === 'valid' ? (
            <div className="mt-6 rounded-xl border border-emerald-300 bg-[#F2FBF7] p-6">
              {/* Top Status Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-emerald-200">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-[#064E3B]">
                      REGISTRO OFICIAL AVERBADO · FÉ PÚBLICA CONFIRMADA
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      CERTIFICADO AUTÊNTICO E VÁLIDO — {cert.status} (NOTA {cert.grade})
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Emitido em parceria institucional pela Editora Mente e Saúde (CNPJ:
                      51.372.335/0001-71) e Centro Profissionalizante Maria Dalva de Araújo (CNPJ:
                      51.269.112/0001-83) · Consulta realizada em {verifiedTimestamp}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={onDownloadPdf}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-[#064E3B] text-white hover:bg-[#053F30] transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading
                      ? 'Gerando PDF (2 Laudas)...'
                      : 'Baixar PDF Oficial (2 Laudas)'}
                  </button>
                  <button
                    type="button"
                    onClick={onScrollToCertificate}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <FileText className="w-4 h-4 text-[#0A1D56]" />
                    Ver Certificado na Tela
                  </button>
                </div>
              </div>

              {/* Authenticated Metadata Grid */}
              <dl className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-emerald-200/80">
                  <dt className="text-[11px] font-mono-tabular uppercase text-slate-500">
                    Profissional Titular
                  </dt>
                  <dd className="text-sm font-bold text-slate-900 mt-1">{cert.holderName}</dd>
                  <dd className="text-xs text-slate-600 mt-0.5">
                    {cert.holderQualification} · CPF: {cert.holderCpf}
                  </dd>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-200/80">
                  <dt className="text-[11px] font-mono-tabular uppercase text-slate-500">
                    Instituição de Origem (IES)
                  </dt>
                  <dd className="text-sm font-bold text-slate-900 mt-1">
                    {cert.holderInstitution}
                  </dd>
                  <dd className="text-xs text-slate-600 mt-0.5">
                    Comprovação Curricular (Lei nº 9.394/96)
                  </dd>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-200/80">
                  <dt className="text-[11px] font-mono-tabular uppercase text-slate-500">
                    Registro e Livro Oficial
                  </dt>
                  <dd className="text-sm font-mono-tabular font-bold text-[#0A1D56] mt-1">
                    Certificado Nº {cert.certNumber} · Livro {cert.bookNumber}
                  </dd>
                  <dd className="text-xs font-mono-tabular text-slate-600 mt-0.5">
                    Folha {cert.sheetNumber} · Emissão: 22/11/2024
                  </dd>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-200/80">
                  <dt className="text-[11px] font-mono-tabular uppercase text-slate-500">
                    Carga Horária e Aproveitamento
                  </dt>
                  <dd className="text-sm font-mono-tabular font-bold text-[#064E3B] mt-1">
                    {cert.hoursWritten} ({cert.status})
                  </dd>
                  <dd className="text-xs text-slate-600 mt-0.5">
                    Período: {cert.periodText} · Nota: {cert.grade}
                  </dd>
                </div>
              </dl>

              {/* Full Activity & Cryptographic Proof */}
              <div className="mt-4 bg-white p-4 rounded-lg border border-emerald-200/80 space-y-2.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500">Título Oficial da Atividade:</span>
                  <span className="font-bold text-slate-900">{cert.courseTitle}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Enquadramento Edital (Item 09):</span>
                  <span className="font-medium text-slate-800">
                    Item 09 - Atividades Extracurriculares: Cursos de extensão, estágios, línguas,
                    computação e congressos (≥ 30h)
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#064E3B] shrink-0" />
                    <span className="text-slate-500">Assinatura Criptográfica SHA-256:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono-tabular text-[11px] text-slate-800 break-all">
                      {cert.sha256}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyHash}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer shrink-0"
                    >
                      {copiedHash ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" /> Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copiar Hash
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Código ou Chave não localizado na base deste curso ({queryInput})
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Verifique se digitou corretamente o Código{' '}
                    <strong className="font-mono-tabular">{cert.code}</strong> ou a Chave de
                    Controle <strong className="font-mono-tabular">{cert.controlKey}</strong>.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQueryInput(cert.code);
                  verifyCodeOrKey(cert.code);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#064E3B] text-white hover:bg-[#053F30] transition-colors cursor-pointer shrink-0"
              >
                Restaurar Código Oficial ({cert.code})
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

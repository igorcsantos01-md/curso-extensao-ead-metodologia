import React, { useEffect, useState, useRef } from 'react';
import { CertificateRecord } from '../data/certificateData';
import { generateQrCodeDataUrl } from '../utils/pdfGenerator';

interface CertificateSheetProps {
  cert: CertificateRecord;
  visiblePages?: 'both' | 'front' | 'back';
  zoomScale?: 'fit' | '0.85' | '1';
  isPrintClone?: boolean;
}

export const CertificateSheet: React.FC<CertificateSheetProps> = ({
  cert,
  visiblePages = 'both',
  zoomScale = 'fit',
  isPrintClone = false,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [autoScale, setAutoScale] = useState<number>(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://extensao-revisao-prisma.vercel.app';
  const cleanOrigin = origin.replace(/\/$/, '');
  const verificationUrl = `${cleanOrigin}/?codigo=${cert.code}#validador`;
  const shortDisplayUrl = `${cleanOrigin}/`;

  useEffect(() => {
    let mounted = true;
    generateQrCodeDataUrl(verificationUrl)
      .then((dataUrl) => {
        if (mounted) setQrUrl(dataUrl);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [verificationUrl]);

  useEffect(() => {
    if (isPrintClone) return;
    const updateScale = () => {
      if (!wrapperRef.current) return;
      const availableWidth = wrapperRef.current.clientWidth - 24;
      const baseWidthPx = 1122.5; // 297mm at 96dpi
      if (zoomScale === 'fit') {
        const computed = Math.min(1, Math.max(0.32, availableWidth / baseWidthPx));
        setAutoScale(computed);
      } else {
        setAutoScale(parseFloat(zoomScale));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [zoomScale, isPrintClone]);

  const effectiveScale = isPrintClone ? 1 : autoScale;

  // Exact 297mm x 210mm coordinate system in mm or px (1mm = 3.779527559px)
  const renderFrontPage = () => (
    <div
      className="cert-sheet relative bg-[#FFFDFA] text-[#0F172A] select-text overflow-hidden shadow-xl border border-slate-300/80"
      style={{
        width: '297mm',
        height: '210mm',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      {/* Triple Institutional Frame */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: '5mm',
          top: '5mm',
          width: '287mm',
          height: '200mm',
          border: '0.8mm solid #054F3B',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          left: '6.8mm',
          top: '6.8mm',
          width: '283.4mm',
          height: '196.4mm',
          border: '0.35mm solid #D97805',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          left: '8.2mm',
          top: '8.2mm',
          width: '280.6mm',
          height: '193.6mm',
          border: '0.5mm solid #0A1C57',
        }}
      />

      {/* Header Tripartido */}
      <div
        className="absolute flex items-start justify-between"
        style={{
          left: '14mm',
          top: '12mm',
          width: '269mm',
          height: '22mm',
        }}
      >
        {/* Left: Editora Mente e Saúde */}
        <div className="flex items-center gap-[3mm]">
          <img
            src="/assets/cert/logo-ems.png"
            alt="Logotipo Editora Mente e Saúde"
            referrerPolicy="no-referrer"
            style={{ width: '20mm', height: '20mm', objectFit: 'contain' }}
          />
          <div className="leading-tight">
            <div
              className="font-bold tracking-tight"
              style={{ fontSize: '8.5pt', color: '#064E3B' }}
            >
              EDITORA MENTE E SAÚDE
            </div>
            <div
              className="font-mono-tabular font-bold mt-[1mm]"
              style={{ fontSize: '7.5pt', color: '#0F172A' }}
            >
              CNPJ: 51.372.335/0001-71
            </div>
            <div
              className="mt-[0.8mm]"
              style={{ fontSize: '7pt', color: '#0D9488' }}
            >
              Conselho Editorial e Extensão Científica
            </div>
          </div>
        </div>

        {/* Center: Programa Interinstitucional */}
        <div className="text-center flex-1 px-[2mm] pt-[0.5mm]">
          <div
            className="font-bold leading-snug"
            style={{ fontSize: '8.5pt', color: '#064E3B' }}
          >
            PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO CIENTÍFICA
            <br />E EDUCAÇÃO EM SAÚDE
          </div>
          <div
            className="font-mono-tabular font-bold mt-[1.6mm]"
            style={{ fontSize: '7.5pt', color: '#0A1D56' }}
          >
            Certificado Nº {cert.certNumber} · Livro de Extensão nº {cert.bookNumber} · Cód.{' '}
            {cert.code}
          </div>
        </div>

        {/* Right: Centro Profissionalizante Maria Dalva de Araújo */}
        <div className="flex items-center gap-[3mm] text-right">
          <div className="leading-tight">
            <div
              className="font-bold tracking-tight"
              style={{ fontSize: '8.5pt', color: '#0A1D56' }}
            >
              CENTRO PROFISSIONALIZANTE
              <br />
              MARIA DALVA DE ARAÚJO
            </div>
            <div
              className="font-mono-tabular font-bold mt-[1.2mm]"
              style={{ fontSize: '7.5pt', color: '#0F172A' }}
            >
              CNPJ: 51.269.112/0001-83
            </div>
          </div>
          <img
            src="/assets/cert/logo-cpmda.png"
            alt="Logotipo Centro Profissionalizante Maria Dalva de Araújo"
            referrerPolicy="no-referrer"
            style={{ width: '20mm', height: '20mm', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Header Divider */}
      <div
        className="absolute"
        style={{
          left: '14mm',
          top: '35mm',
          width: '269mm',
          borderTop: '0.25mm solid #054F3B',
        }}
      />

      {/* Main Title */}
      <div
        className="absolute w-full text-center"
        style={{ top: '39.5mm', left: 0 }}
      >
        <h1
          className="font-bold tracking-wide"
          style={{
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            fontSize: '23.5pt',
            color: '#064E3B',
          }}
        >
          {cert.mainHeaderTitle}
        </h1>
        <div
          className="mx-auto mt-[1.5mm]"
          style={{
            width: '107mm',
            borderTop: '0.5mm solid #D97805',
          }}
        />
      </div>

      {/* Opening Institutional Paragraph */}
      <div
        className="absolute text-center"
        style={{
          left: '18mm',
          top: '54.2mm',
          width: '261mm',
          fontSize: '10.2pt',
          lineHeight: 1.38,
          color: '#0F172A',
        }}
      >
        A Editora Mente e Saúde (CNPJ: 51.372.335/0001-71), em parceria institucional com o Centro
        Profissionalizante Maria Dalva de Araújo (CNPJ:
        <br />
        51.269.112/0001-83), certifica para os devidos fins de comprovação curricular, acadêmica e
        de títulos (Lei nº 9.394/96) que
      </div>

      {/* Holder Box */}
      <div
        className="absolute flex flex-col items-center justify-center text-center"
        style={{
          left: '24mm',
          top: '67mm',
          width: '249mm',
          height: '21mm',
          backgroundColor: '#EDFCF5',
          border: '0.3mm solid #D97805',
        }}
      >
        <div
          className="font-bold tracking-wide"
          style={{
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            fontSize: '22.5pt',
            color: '#0A1D56',
            lineHeight: 1.15,
          }}
        >
          {cert.holderName}
        </div>
        <div
          className="font-bold mt-[1.2mm]"
          style={{
            fontSize: '10pt',
            color: '#0F172A',
          }}
        >
          {cert.holderQualification} &nbsp;|&nbsp; CPF: {cert.holderCpf} &nbsp;|&nbsp;{' '}
          {cert.holderInstitution}
        </div>
      </div>

      {/* Body Paragraphs */}
      <div
        className="absolute"
        style={{
          left: '24.5mm',
          top: '92.5mm',
          width: '248mm',
          fontSize: '10pt',
          lineHeight: 1.42,
          color: '#0F172A',
        }}
      >
        <p className="mb-[4.2mm]">
          concluiu com <strong>APROVAÇÃO</strong> e aproveitamento integral a Atividade
          Extracurricular intitulada{' '}
          <strong>&ldquo;{cert.courseTitle}&rdquo;</strong>, desenvolvida na modalidade de{' '}
          {cert.modalityLabel}, realizada no período de {cert.periodText}, contabilizando carga
          horária total de <strong>{cert.hoursWritten}</strong>.
        </p>
        <p>
          No âmbito desta formação complementar em ambiente virtual de aprendizagem, o profissional
          cumpriu integralmente os módulos teóricos e práticos de formulação de perguntas clínicas
          estruturadas (estratégia PICO), aplicação das diretrizes internacionais PRISMA 2020
          (checklist de 27 itens e fluxograma em quatro fases), registro de protocolos (PROSPERO),
          triagem cega pareada em plataformas digitais (Rayyan), análise crítica de risco de viés
          (Cochrane RoB 2 e sistema GRADE) e interpretação de síntese qualitativa e metanálise,
          obtendo nota final <strong>{cert.grade} ({cert.status})</strong>.
        </p>
      </div>

      {/* Location and Date */}
      <div
        className="absolute w-full text-center italic"
        style={{
          top: '132.5mm',
          left: 0,
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: '13pt',
          color: '#0F172A',
        }}
      >
        {cert.issueDateText}
      </div>

      {/* Left Signature Block */}
      <div
        className="absolute text-center"
        style={{
          left: '15mm',
          top: '149mm',
          width: '78mm',
        }}
      >
        <img
          src="/assets/cert/sig-barbara.png"
          alt="Assinatura Bárbara Lima dos Santos"
          referrerPolicy="no-referrer"
          className="mx-auto"
          style={{ width: '64mm', height: '18mm', objectFit: 'contain' }}
        />
        <div
          style={{
            borderTop: '0.35mm solid #0F172A',
            marginTop: '1mm',
            paddingTop: '1.5mm',
          }}
        >
          <div
            className="font-bold"
            style={{ fontSize: '7.8pt', color: '#064E3B' }}
          >
            BÁRBARA LIMA DOS SANTOS
          </div>
          <div style={{ fontSize: '6.8pt', color: '#0F172A', marginTop: '0.5mm' }}>
            Editora-Chefe e Coordenadora de Extensão Editorial
          </div>
          <div
            className="font-mono-tabular font-bold"
            style={{ fontSize: '6.2pt', color: '#064E3B', marginTop: '0.5mm' }}
          >
            Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)
          </div>
        </div>
      </div>

      {/* Center Official Seal */}
      <div
        className="absolute flex flex-col items-center justify-center rounded-full text-center"
        style={{
          left: '97.5mm',
          top: '153.5mm',
          width: '23mm',
          height: '23mm',
          backgroundColor: '#FFF2C7',
          border: '0.6mm solid #D97805',
          color: '#78350F',
        }}
      >
        <div
          className="font-bold"
          style={{
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            fontSize: '6.3pt',
            lineHeight: 1.1,
          }}
        >
          SELO OFICIAL
        </div>
        <div
          className="font-bold mt-[0.8mm]"
          style={{
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            fontSize: '7.8pt',
            lineHeight: 1.1,
          }}
        >
          FÉ PÚBLICA
        </div>
        <div
          className="font-mono-tabular font-bold mt-[1mm]"
          style={{ fontSize: '5.2pt' }}
        >
          {cert.code}
        </div>
      </div>

      {/* Center QR Code */}
      <div
        className="absolute flex items-center justify-center bg-white"
        style={{
          left: '123.5mm',
          top: '151.5mm',
          width: '25mm',
          height: '25mm',
          border: '0.25mm solid #054F3B',
        }}
      >
        {qrUrl && (
          <img
            src={qrUrl}
            alt={`QR Code de verificação ${cert.code}`}
            style={{ width: '23mm', height: '23mm', objectFit: 'contain' }}
          />
        )}
      </div>

      {/* Center Manual Authentication Box */}
      <div
        className="absolute bg-white"
        style={{
          left: '150.5mm',
          top: '151.5mm',
          width: '50.5mm',
          height: '25mm',
          border: '0.25mm solid #054F3B',
          padding: '1.8mm 2mm',
        }}
      >
        <div
          className="font-bold"
          style={{ fontSize: '6pt', color: '#064E3B' }}
        >
          AUTENTICAÇÃO PÚBLICA MANUAL
        </div>
        <div
          className="font-mono-tabular font-bold mt-[1mm]"
          style={{ fontSize: '6.2pt', color: '#0F172A' }}
        >
          Cód.: {cert.code}
        </div>
        <div
          className="font-mono-tabular font-bold mt-[0.8mm]"
          style={{ fontSize: '6.2pt', color: '#92400E' }}
        >
          Chave: {cert.controlKey}
        </div>
        <div
          className="font-bold mt-[0.8mm]"
          style={{ fontSize: '5.5pt', color: '#0A1D56' }}
        >
          Endereço p/ Verificação Online:
        </div>
        <div
          className="font-mono-tabular truncate mt-[0.5mm]"
          style={{ fontSize: '4.7pt', color: '#0F172A' }}
        >
          {shortDisplayUrl}
        </div>
      </div>

      {/* Right Signature Block */}
      <div
        className="absolute text-center"
        style={{
          left: '203mm',
          top: '149mm',
          width: '79mm',
        }}
      >
        <img
          src="/assets/cert/sig-james.png"
          alt="Assinatura James Araújo de Santana"
          referrerPolicy="no-referrer"
          className="mx-auto"
          style={{ width: '64mm', height: '18mm', objectFit: 'contain' }}
        />
        <div
          style={{
            borderTop: '0.35mm solid #0F172A',
            marginTop: '1mm',
            paddingTop: '1.5mm',
          }}
        >
          <div
            className="font-bold"
            style={{ fontSize: '7.8pt', color: '#0A1D56' }}
          >
            JAMES ARAÚJO DE SANTANA
          </div>
          <div style={{ fontSize: '6.8pt', color: '#0F172A', marginTop: '0.5mm' }}>
            Coordenador de Extensão e Projetos Educativos
          </div>
          <div
            className="font-mono-tabular font-bold"
            style={{ fontSize: '5.8pt', color: '#0A1D56', marginTop: '0.5mm' }}
          >
            Centro Profissionalizante Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)
          </div>
        </div>
      </div>

      {/* Bottom Security Strip */}
      <div
        className="absolute w-full text-center font-mono-tabular font-bold"
        style={{
          left: 0,
          top: '188.5mm',
          fontSize: '6.2pt',
          color: '#064E3B',
        }}
      >
        Verifique via QR Code ou acesse {shortDisplayUrl} informando o Código {cert.code} ou Chave{' '}
        {cert.controlKey}
      </div>
    </div>
  );

  // =========================================================================
  // LAUDA 2 — VERSO OFICIAL (MEMORIAL DESCRITIVO E MATRIZ 40 HORAS)
  // =========================================================================
  const renderBackPage = () => (
    <div
      className="cert-sheet relative bg-[#FFFDFA] text-[#0F172A] select-text overflow-hidden shadow-xl border border-slate-300/80"
      style={{
        width: '297mm',
        height: '210mm',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      {/* Triple Institutional Frame */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: '5mm',
          top: '5mm',
          width: '287mm',
          height: '200mm',
          border: '0.8mm solid #054F3B',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          left: '6.8mm',
          top: '6.8mm',
          width: '283.4mm',
          height: '196.4mm',
          border: '0.35mm solid #D97805',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          left: '8.2mm',
          top: '8.2mm',
          width: '280.6mm',
          height: '193.6mm',
          border: '0.5mm solid #0A1C57',
        }}
      />

      {/* Top Header of Verso */}
      <div
        className="absolute flex items-center"
        style={{
          left: '14mm',
          top: '12mm',
          width: '269mm',
          height: '14mm',
        }}
      >
        <img
          src="/assets/cert/logo-ems.png"
          alt="Logo Editora Mente e Saúde"
          referrerPolicy="no-referrer"
          style={{ width: '13mm', height: '13mm', objectFit: 'contain' }}
        />
        <img
          src="/assets/cert/logo-cpmda.png"
          alt="Logo Centro Profissionalizante Maria Dalva de Araújo"
          referrerPolicy="no-referrer"
          style={{
            width: '13mm',
            height: '13mm',
            objectFit: 'contain',
            marginLeft: '2mm',
          }}
        />
        <div style={{ marginLeft: '4mm' }}>
          <div
            className="font-bold tracking-tight"
            style={{
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: '13.5pt',
              color: '#064E3B',
              lineHeight: 1.15,
            }}
          >
            MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO DE ATIVIDADE EXTRACURRICULAR
          </div>
          <div
            style={{
              fontSize: '8.5pt',
              color: '#0F172A',
              marginTop: '0.8mm',
            }}
          >
            Verso Oficial do Certificado Nº {cert.certNumber} · Fé Pública Interinstitucional e
            Validação Curricular
          </div>
        </div>
      </div>

      {/* Header Line */}
      <div
        className="absolute"
        style={{
          left: '14mm',
          top: '28mm',
          width: '269mm',
          borderTop: '0.5mm solid #054F3B',
        }}
      />

      {/* Section 1: Dados de Identificação do Profissional */}
      <div
        className="absolute bg-white"
        style={{
          left: '14mm',
          top: '31mm',
          width: '155mm',
          height: '31mm',
          border: '0.25mm solid #054F3B',
          padding: '2.5mm 4mm',
        }}
      >
        <div
          className="font-bold"
          style={{ fontSize: '8.2pt', color: '#064E3B' }}
        >
          1. DADOS DE IDENTIFICAÇÃO DO PROFISSIONAL
        </div>
        <div
          className="mt-[1.8mm] space-y-[1.1mm]"
          style={{ fontSize: '8.3pt', color: '#0F172A' }}
        >
          <div>
            Titular Certificado: <strong>{cert.holderName}</strong>
          </div>
          <div>CPF Registrado: {cert.holderCpf}</div>
          <div>Qualificação Profissional: {cert.holderQualification}</div>
          <div>Instituição de Origem: {cert.holderInstitution}</div>
        </div>
      </div>

      {/* Section 2: Enquadramento Curricular e Pontuação */}
      <div
        className="absolute"
        style={{
          left: '173mm',
          top: '31mm',
          width: '110mm',
          height: '31mm',
          backgroundColor: '#F0F5FF',
          border: '0.25mm solid #0A1C57',
          padding: '2.5mm 4mm',
        }}
      >
        <div
          className="font-bold"
          style={{ fontSize: '8.2pt', color: '#0A1D56' }}
        >
          2. ENQUADRAMENTO CURRICULAR E PONTUAÇÃO
        </div>
        <div
          className="font-bold mt-[1.6mm] leading-snug"
          style={{ fontSize: '7.8pt', color: '#0F172A' }}
        >
          Item 09 - Atividades Extracurriculares: Cursos de extensão, estágios em instituições de
          ensino, cursos de língua e de computação, aprovação em concursos, congressos médicos (Pelo
          menos 30 horas por certificado)
        </div>
        <div
          className="font-mono-tabular font-bold mt-[2.6mm]"
          style={{ fontSize: '7.1pt', color: '#064E3B' }}
        >
          {cert.enquadramentoSummary}
        </div>
      </div>

      {/* Section 3: Matriz Programática (40 Horas) */}
      <div
        className="absolute"
        style={{
          left: '14mm',
          top: '65mm',
          width: '269mm',
        }}
      >
        <div
          className="flex items-center font-bold"
          style={{
            height: '7.5mm',
            backgroundColor: '#EDFCF5',
            border: '0.25mm solid #054F3B',
            padding: '0 4mm',
            fontSize: '8.2pt',
            color: '#064E3B',
          }}
        >
          {cert.axesHeaderTitle}
        </div>

        {cert.axes.map((axis) => (
          <div
            key={axis.id}
            className="grid bg-white"
            style={{
              height: '14mm',
              gridTemplateColumns: '79mm 165mm 25mm',
              borderLeft: '0.25mm solid #CCD6E0',
              borderRight: '0.25mm solid #CCD6E0',
              borderBottom: '0.25mm solid #CCD6E0',
            }}
          >
            {/* Axis Title & Subtitle */}
            <div
              className="flex flex-col justify-center"
              style={{
                padding: '1.2mm 3mm',
                borderRight: '0.25mm solid #E3E8F0',
              }}
            >
              <div
                className="font-bold leading-tight"
                style={{ fontSize: '7.2pt', color: '#0A1D56' }}
              >
                {axis.titleLine1} {axis.titleLine2}
              </div>
              <div
                className="mt-[0.8mm] leading-tight"
                style={{ fontSize: '6.3pt', color: '#475569' }}
              >
                {axis.subtitleLine1}
              </div>
            </div>

            {/* Axis Description */}
            <div
              className="flex items-center"
              style={{
                padding: '1.2mm 3mm',
                borderRight: '0.25mm solid #E3E8F0',
                fontSize: '7.4pt',
                lineHeight: 1.28,
                color: '#0F172A',
              }}
            >
              <div>
                {axis.descriptionLine1} {axis.descriptionLine2}
              </div>
            </div>

            {/* Axis Hours */}
            <div
              className="flex items-center justify-center font-mono-tabular font-bold"
              style={{
                fontSize: '8pt',
                color: '#064E3B',
              }}
            >
              {axis.hours}
            </div>
          </div>
        ))}
      </div>

      {/* Section 4: Registro Oficial de Fé Pública */}
      <div
        className="absolute"
        style={{
          left: '14mm',
          top: '131.5mm',
          width: '269mm',
          height: '31mm',
          backgroundColor: '#FFFAEB',
          border: '0.35mm solid #D97805',
          padding: '2.2mm 4mm',
        }}
      >
        <div className="pr-[30mm]">
          <div
            className="font-bold"
            style={{ fontSize: '8.2pt', color: '#92400E' }}
          >
            4. REGISTRO OFICIAL DE FÉ PÚBLICA, ENDEREÇO WEB E CHAVES DE VERIFICAÇÃO DE AUTENTICIDADE
          </div>
          <div
            className="mt-[1mm] leading-snug"
            style={{ fontSize: '7.8pt', color: '#0F172A' }}
          >
            {cert.registroAverbarLines.join(' ')}
          </div>
          <div
            className="font-mono-tabular font-bold mt-[1.4mm]"
            style={{ fontSize: '7.6pt', color: '#064E3B' }}
          >
            CÓDIGO DE AUTENTICIDADE: {cert.code} &nbsp;&nbsp;|&nbsp;&nbsp; CHAVE DE CONTROLE / DÍGITO:{' '}
            {cert.controlKey}
          </div>
          <div
            className="font-mono-tabular font-bold mt-[0.8mm]"
            style={{ fontSize: '7pt', color: '#0A1D56' }}
          >
            ENDEREÇO PARA VERIFICAÇÃO MANUAL (SEM QR CODE): {verificationUrl}
          </div>
          <div
            className="font-mono-tabular font-bold mt-[0.8mm]"
            style={{ fontSize: '7pt', color: '#0F172A' }}
          >
            HASH SHA-256: {cert.sha256}
          </div>
        </div>

        {/* Back Page QR Code */}
        <div
          className="absolute flex items-center justify-center bg-white"
          style={{
            right: '3.5mm',
            top: '2.5mm',
            width: '26mm',
            height: '26mm',
            border: '0.25mm solid #054F3B',
          }}
        >
          {qrUrl && (
            <img
              src={qrUrl}
              alt={`QR Code Verso ${cert.code}`}
              style={{ width: '24mm', height: '24mm', objectFit: 'contain' }}
            />
          )}
        </div>
      </div>

      {/* Back Page Footer & Signatures */}
      <div
        className="absolute text-center"
        style={{
          left: '18mm',
          top: '164mm',
          width: '74mm',
        }}
      >
        <img
          src="/assets/cert/sig-barbara.png"
          alt="Assinatura Bárbara Lima dos Santos"
          referrerPolicy="no-referrer"
          className="mx-auto"
          style={{ width: '54mm', height: '15mm', objectFit: 'contain' }}
        />
        <div
          style={{
            borderTop: '0.35mm solid #0F172A',
            marginTop: '0.8mm',
            paddingTop: '1.2mm',
          }}
        >
          <div
            className="font-bold"
            style={{ fontSize: '7.6pt', color: '#064E3B' }}
          >
            BÁRBARA LIMA DOS SANTOS
          </div>
          <div
            className="font-mono-tabular font-bold mt-[0.4mm]"
            style={{ fontSize: '6.2pt', color: '#064E3B' }}
          >
            Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)
          </div>
        </div>
      </div>

      {/* Back Page Center Validation Stamp */}
      <div
        className="absolute text-center"
        style={{
          left: '94mm',
          top: '175mm',
          width: '109mm',
        }}
      >
        <div
          className="italic"
          style={{
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            fontSize: '10.5pt',
            color: '#0F172A',
          }}
        >
          {cert.issueDateText}
        </div>
        <div
          className="font-bold mt-[0.8mm]"
          style={{ fontSize: '6.8pt', color: '#475569' }}
        >
          Documento Oficial de 2 Laudas (Frente e Verso) · Válido em Todo o Território Nacional
        </div>
        <div
          className="font-mono-tabular mt-[0.5mm]"
          style={{ fontSize: '6.2pt', color: '#064E3B' }}
        >
          Registro: {cert.code} · Chave: {cert.controlKey}
        </div>
      </div>

      {/* Back Page Right Signature */}
      <div
        className="absolute text-center"
        style={{
          left: '204mm',
          top: '164mm',
          width: '75mm',
        }}
      >
        <img
          src="/assets/cert/sig-james.png"
          alt="Assinatura James Araújo de Santana"
          referrerPolicy="no-referrer"
          className="mx-auto"
          style={{ width: '54mm', height: '15mm', objectFit: 'contain' }}
        />
        <div
          style={{
            borderTop: '0.35mm solid #0F172A',
            marginTop: '0.8mm',
            paddingTop: '1.2mm',
          }}
        >
          <div
            className="font-bold"
            style={{ fontSize: '7.6pt', color: '#0A1D56' }}
          >
            JAMES ARAÚJO DE SANTANA
          </div>
          <div
            className="font-mono-tabular font-bold mt-[0.4mm]"
            style={{ fontSize: '6.2pt', color: '#0A1D56' }}
          >
            Centro Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)
          </div>
        </div>
      </div>
    </div>
  );

  if (isPrintClone) {
    return (
      <div className="hidden print-only-container">
        {renderFrontPage()}
        {renderBackPage()}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="w-full flex flex-col items-center gap-8 overflow-x-auto py-2">
      {(visiblePages === 'both' || visiblePages === 'front') && (
        <div
          className="relative flex flex-col items-center"
          style={{
            width: `${1122.5 * effectiveScale}px`,
            height: `${793.7 * effectiveScale}px`,
          }}
        >
          <div
            style={{
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top center',
            }}
          >
            {renderFrontPage()}
          </div>
        </div>
      )}

      {(visiblePages === 'both' || visiblePages === 'back') && (
        <div
          className="relative flex flex-col items-center"
          style={{
            width: `${1122.5 * effectiveScale}px`,
            height: `${793.7 * effectiveScale}px`,
          }}
        >
          <div
            style={{
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top center',
            }}
          >
            {renderBackPage()}
          </div>
        </div>
      )}
    </div>
  );
};

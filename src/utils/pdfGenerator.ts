import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { CertificateRecord } from '../data/certificateData';

async function loadImageAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao carregar imagem: ${url}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateQrCodeDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 480,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#0F172A',
      light: '#FFFFFF',
    },
  });
}

export async function generateOfficialCertificatePdf(
  cert: CertificateRecord,
  baseOriginUrl?: string
): Promise<void> {
  const origin =
    baseOriginUrl ||
    (typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://extensao-revisao-prisma.vercel.app');

  const cleanOrigin = origin.replace(/\/$/, '');
  const verificationUrl = `${cleanOrigin}/?codigo=${cert.code}#validador`;
  const shortDisplayUrl = `${cleanOrigin}/`;

  const [logoEms, logoCpmda, sigBarbara, sigJames, qrDataUrl] = await Promise.all([
    loadImageAsDataUrl('/assets/cert/logo-ems.png'),
    loadImageAsDataUrl('/assets/cert/logo-cpmda.png'),
    loadImageAsDataUrl('/assets/cert/sig-barbara.png'),
    loadImageAsDataUrl('/assets/cert/sig-james.png'),
    generateQrCodeDataUrl(verificationUrl),
  ]);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const drawOuterFrames = () => {
    // Warm archival paper background
    doc.setFillColor(255, 253, 250);
    doc.rect(0, 0, 297, 210, 'F');

    // Outer Emerald Institutional Frame
    doc.setDrawColor(5, 79, 59);
    doc.setLineWidth(0.8);
    doc.rect(5.0, 5.0, 287.0, 200.0, 'S');

    // Middle Gold Frame
    doc.setDrawColor(217, 120, 5);
    doc.setLineWidth(0.35);
    doc.rect(6.8, 6.8, 283.4, 196.4, 'S');

    // Inner Navy Frame
    doc.setDrawColor(10, 28, 87);
    doc.setLineWidth(0.5);
    doc.rect(8.2, 8.2, 280.6, 193.6, 'S');
  };

  // =========================================================================
  // LAUDA 1 — FRENTE DO CERTIFICADO
  // =========================================================================
  drawOuterFrames();

  // Left Logo & Institutional Info
  doc.addImage(logoEms, 'PNG', 14.0, 12.0, 20.0, 20.0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text('EDITORA MENTE E SAÚDE', 37.0, 18.0);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CNPJ: 51.372.335/0001-71', 37.0, 22.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(13, 148, 136);
  doc.text('Conselho Editorial e Extensão Científica', 37.0, 26.5);

  // Center Program Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text(
    'PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO CIENTÍFICA',
    148.5,
    17.0,
    { align: 'center' }
  );
  doc.text('E EDUCAÇÃO EM SAÚDE', 148.5, 21.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(10, 29, 86);
  doc.text(
    `Certificado Nº ${cert.certNumber} · Livro de Extensão nº ${cert.bookNumber} · Cód. ${cert.code}`,
    148.5,
    26.2,
    { align: 'center' }
  );

  // Right Logo & Institutional Info
  doc.addImage(logoCpmda, 'PNG', 263.0, 12.0, 20.0, 20.0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(10, 29, 86);
  doc.text('CENTRO PROFISSIONALIZANTE', 260.0, 17.5, { align: 'right' });
  doc.text('MARIA DALVA DE ARAÚJO', 260.0, 21.8, { align: 'right' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CNPJ: 51.269.112/0001-83', 260.0, 26.2, { align: 'right' });

  // Header Divider Line
  doc.setDrawColor(5, 79, 59);
  doc.setLineWidth(0.25);
  doc.line(14.0, 35.0, 283.0, 35.0);

  // Main Certificate Title
  doc.setFont('times', 'bold');
  doc.setFontSize(23.5);
  doc.setTextColor(6, 78, 59);
  doc.text(cert.mainHeaderTitle, 148.5, 47.0, { align: 'center' });

  // Gold Accent Line under Title
  doc.setDrawColor(217, 120, 5);
  doc.setLineWidth(0.5);
  doc.line(95.0, 50.0, 202.0, 50.0);

  // Opening Institutional Statement
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.2);
  doc.setTextColor(15, 23, 42);
  doc.text(
    'A Editora Mente e Saúde (CNPJ: 51.372.335/0001-71), em parceria institucional com o Centro Profissionalizante Maria Dalva de Araújo (CNPJ:',
    148.5,
    58.2,
    { align: 'center' }
  );
  doc.text(
    '51.269.112/0001-83), certifica para os devidos fins de comprovação curricular, acadêmica e de títulos (Lei nº 9.394/96) que',
    148.5,
    62.6,
    { align: 'center' }
  );

  // Holder Highlight Box
  doc.setFillColor(237, 252, 245);
  doc.setDrawColor(217, 120, 5);
  doc.setLineWidth(0.3);
  doc.rect(24.0, 67.0, 249.0, 21.0, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(22.5);
  doc.setTextColor(10, 29, 86);
  doc.text(cert.holderName, 148.5, 76.8, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.0);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `${cert.holderQualification}  |  CPF: ${cert.holderCpf}  |  ${cert.holderInstitution}`,
    148.5,
    84.0,
    { align: 'center' }
  );

  // Body Paragraph 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.0);
  doc.setTextColor(15, 23, 42);
  cert.frontParagraph1Lines.forEach((line, index) => {
    doc.text(line, 24.5, 96.2 + index * 4.06);
  });

  // Body Paragraph 2
  cert.frontParagraph2Lines.forEach((line, index) => {
    doc.text(line, 24.5, 113.5 + index * 4.06);
  });

  // Location & Date
  doc.setFont('times', 'italic');
  doc.setFontSize(13.0);
  doc.setTextColor(15, 23, 42);
  doc.text(cert.issueDateText, 148.5, 137.0, { align: 'center' });

  // Left Signature Block (Bárbara Lima dos Santos)
  doc.addImage(sigBarbara, 'PNG', 22.0, 149.0, 64.0, 18.0);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.35);
  doc.line(15.0, 168.5, 93.0, 168.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(6, 78, 59);
  doc.text('BÁRBARA LIMA DOS SANTOS', 54.0, 173.0, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(15, 23, 42);
  doc.text('Editora-Chefe e Coordenadora de Extensão Editorial', 54.0, 176.8, {
    align: 'center',
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.3);
  doc.setTextColor(6, 78, 59);
  doc.text('Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)', 54.0, 180.5, {
    align: 'center',
  });

  // Center Official Golden Seal
  doc.setFillColor(255, 242, 199);
  doc.setDrawColor(217, 120, 5);
  doc.setLineWidth(0.6);
  doc.circle(109.0, 165.0, 11.5, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 53, 15);
  doc.text('SELO OFICIAL', 109.0, 161.2, { align: 'center' });

  doc.setFontSize(8.0);
  doc.text('FÉ PÚBLICA', 109.0, 165.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(5.4);
  doc.text(cert.code, 109.0, 169.5, { align: 'center' });

  // Center QR Code Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(5, 79, 59);
  doc.setLineWidth(0.25);
  doc.rect(123.5, 151.5, 25.0, 25.0, 'FD');
  doc.addImage(qrDataUrl, 'PNG', 124.5, 152.5, 23.0, 23.0);
  doc.link(123.5, 151.5, 25.0, 25.0, { url: verificationUrl });

  // Center Manual Authentication Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(5, 79, 59);
  doc.setLineWidth(0.25);
  doc.rect(150.5, 151.5, 50.5, 25.0, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.0);
  doc.setTextColor(6, 78, 59);
  doc.text('AUTENTICAÇÃO PÚBLICA MANUAL', 152.5, 155.5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(15, 23, 42);
  doc.text(`Cód.: ${cert.code}`, 152.5, 159.8);

  doc.setTextColor(146, 64, 14);
  doc.text(`Chave: ${cert.controlKey}`, 152.5, 163.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(10, 29, 86);
  doc.text('Endereço p/ Verificação Online:', 152.5, 167.8);

  doc.setFont('courier', 'normal');
  doc.setFontSize(4.7);
  doc.setTextColor(15, 23, 42);
  const displayShortLink =
    shortDisplayUrl.length > 44 ? shortDisplayUrl.slice(0, 44) : shortDisplayUrl;
  doc.text(displayShortLink, 152.5, 171.5);
  doc.link(150.5, 151.5, 50.5, 25.0, { url: verificationUrl });

  // Right Signature Block (James Araújo de Santana)
  doc.addImage(sigJames, 'PNG', 210.0, 149.0, 64.0, 18.0);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.35);
  doc.line(203.0, 168.5, 282.0, 168.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(10, 29, 86);
  doc.text('JAMES ARAÚJO DE SANTANA', 242.5, 173.0, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(15, 23, 42);
  doc.text('Coordenador de Extensão e Projetos Educativos', 242.5, 176.8, {
    align: 'center',
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.0);
  doc.setTextColor(10, 29, 86);
  doc.text(
    'Centro Profissionalizante Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)',
    242.5,
    180.5,
    { align: 'center' }
  );

  // Bottom Verification Strip
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(6, 78, 59);
  doc.text(
    `Verifique via QR Code ou acesse ${shortDisplayUrl} informando o Código ${cert.code} ou Chave ${cert.controlKey}`,
    148.5,
    191.5,
    { align: 'center' }
  );
  doc.link(30.0, 188.0, 237.0, 6.0, { url: verificationUrl });

  // =========================================================================
  // LAUDA 2 — VERSO OFICIAL (MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO)
  // =========================================================================
  doc.addPage('a4', 'landscape');
  drawOuterFrames();

  // Dual Compact Logos on Top-Left of Back Page
  doc.addImage(logoEms, 'PNG', 14.0, 12.0, 13.0, 13.0);
  doc.addImage(logoCpmda, 'PNG', 29.0, 12.0, 13.0, 13.0);

  doc.setFont('times', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(6, 78, 59);
  doc.text(
    'MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO DE ATIVIDADE EXTRACURRICULAR',
    46.0,
    17.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Verso Oficial do Certificado Nº ${cert.certNumber} · Fé Pública Interinstitucional e Validação Curricular`,
    46.0,
    22.5
  );

  // Header Divider Line
  doc.setDrawColor(5, 79, 59);
  doc.setLineWidth(0.5);
  doc.line(14.0, 28.0, 283.0, 28.0);

  // Box 1: Dados de Identificação do Profissional
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(5, 79, 59);
  doc.setLineWidth(0.25);
  doc.rect(14.0, 31.0, 155.0, 31.0, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(6, 78, 59);
  doc.text('1. DADOS DE IDENTIFICAÇÃO DO PROFISSIONAL', 18.0, 36.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.3);
  doc.setTextColor(15, 23, 42);
  doc.text(`Titular Certificado: ${cert.holderName}`, 18.0, 42.2);
  doc.text(`CPF Registrado: ${cert.holderCpf}`, 18.0, 47.4);
  doc.text(`Qualificação Profissional: ${cert.holderQualification}`, 18.0, 52.6);
  doc.text(`Instituição de Origem: ${cert.holderInstitution}`, 18.0, 57.8);

  // Box 2: Enquadramento Curricular e Pontuação
  doc.setFillColor(240, 245, 255);
  doc.setDrawColor(10, 28, 87);
  doc.setLineWidth(0.25);
  doc.rect(173.0, 31.0, 110.0, 31.0, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(10, 29, 86);
  doc.text('2. ENQUADRAMENTO CURRICULAR E PONTUAÇÃO', 177.0, 36.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  cert.enquadramentoLines.forEach((line, idx) => {
    doc.text(line, 177.0, 42.2 + idx * 3.2);
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.1);
  doc.setTextColor(6, 78, 59);
  doc.text(cert.enquadramentoSummary, 177.0, 58.0);

  // Box 3: Matriz Programática e Metodologia Pedagógica (40 Horas)
  doc.setFillColor(237, 252, 245);
  doc.setDrawColor(5, 79, 59);
  doc.setLineWidth(0.25);
  doc.rect(14.0, 65.0, 269.0, 7.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(6, 78, 59);
  doc.text(cert.axesHeaderTitle, 18.0, 70.2);

  // 4 Axis Rows
  cert.axes.forEach((axis, idx) => {
    const rowTop = 72.5 + idx * 14.0;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(204, 214, 224);
    doc.setLineWidth(0.25);
    doc.rect(14.0, rowTop, 269.0, 14.0, 'FD');

    // Column dividers
    doc.setDrawColor(227, 232, 240);
    doc.line(93.0, rowTop, 93.0, rowTop + 14.0);
    doc.line(258.0, rowTop, 258.0, rowTop + 14.0);

    // Axis Title (Col 1)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.3);
    doc.setTextColor(10, 29, 86);
    doc.text(axis.titleLine1, 17.0, rowTop + 4.3);
    if (axis.titleLine2) {
      doc.text(axis.titleLine2, 17.0, rowTop + 7.3);
    }

    // Axis Subtitle (Col 1)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(71, 85, 105);
    doc.text(axis.subtitleLine1, 17.0, rowTop + 11.2);

    // Axis Description (Col 2)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.setTextColor(15, 23, 42);
    doc.text(axis.descriptionLine1, 96.0, rowTop + 4.8);
    doc.text(axis.descriptionLine2, 96.0, rowTop + 8.2);

    // Axis Hours (Col 3)
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.0);
    doc.setTextColor(6, 78, 59);
    doc.text(axis.hours, 263.5, rowTop + 8.2);
  });

  // Box 4: Registro Oficial de Fé Pública
  doc.setFillColor(255, 250, 235);
  doc.setDrawColor(217, 120, 5);
  doc.setLineWidth(0.35);
  doc.rect(14.0, 131.5, 269.0, 31.0, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(146, 64, 14);
  doc.text(
    '4. REGISTRO OFICIAL DE FÉ PÚBLICA, ENDEREÇO WEB E CHAVES DE VERIFICAÇÃO DE AUTENTICIDADE',
    18.0,
    136.8
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  cert.registroAverbarLines.forEach((line, idx) => {
    doc.text(line, 18.0, 142.0 + idx * 3.2);
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.6);
  doc.setTextColor(6, 78, 59);
  doc.text(
    `CÓDIGO DE AUTENTICIDADE: ${cert.code}   |   CHAVE DE CONTROLE / DÍGITO: ${cert.controlKey}`,
    18.0,
    149.8
  );

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(10, 29, 86);
  doc.text(
    `ENDEREÇO PARA VERIFICAÇÃO MANUAL (SEM QR CODE): ${verificationUrl}`,
    18.0,
    154.8
  );
  doc.link(18.0, 152.0, 230.0, 4.0, { url: verificationUrl });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(15, 23, 42);
  doc.text(`HASH SHA-256: ${cert.sha256}`, 18.0, 159.8);

  // Back Page QR Code Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(5, 79, 59);
  doc.setLineWidth(0.25);
  doc.rect(253.5, 134.0, 26.0, 26.0, 'FD');
  doc.addImage(qrDataUrl, 'PNG', 254.5, 135.0, 24.0, 24.0);
  doc.link(253.5, 134.0, 26.0, 26.0, { url: verificationUrl });

  // Back Page Compact Signatures & Footer
  doc.addImage(sigBarbara, 'PNG', 26.0, 164.0, 54.0, 15.0);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.35);
  doc.line(18.0, 180.0, 92.0, 180.0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.6);
  doc.setTextColor(6, 78, 59);
  doc.text('BÁRBARA LIMA DOS SANTOS', 55.0, 184.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.2);
  doc.text('Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)', 55.0, 188.0, {
    align: 'center',
  });

  // Back Page Center Validation Stamp
  doc.setFont('times', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(cert.issueDateText, 148.5, 179.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Documento Oficial de 2 Laudas (Frente e Verso) · Válido em Todo o Território Nacional',
    148.5,
    184.2,
    { align: 'center' }
  );

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(6, 78, 59);
  doc.text(
    `Registro: ${cert.code} · Chave: ${cert.controlKey}`,
    148.5,
    188.0,
    { align: 'center' }
  );

  // Back Page Right Signature
  doc.addImage(sigJames, 'PNG', 215.0, 164.0, 54.0, 15.0);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.35);
  doc.line(204.0, 180.0, 279.0, 180.0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.6);
  doc.setTextColor(10, 29, 86);
  doc.text('JAMES ARAÚJO DE SANTANA', 241.5, 184.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.2);
  doc.text(
    'Centro Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)',
    241.5,
    188.0,
    { align: 'center' }
  );

  const fileName = `Certificado_Extensao_${cert.certNumber}_${cert.code}_LUCAS_GONCALVES_SILVEIRA.pdf`;
  doc.save(fileName);
}

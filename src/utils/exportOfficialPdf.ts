import { jsPDF } from 'jspdf';
import { PEICompleto } from '../types/pei';

export function exportOfficialPeiPdf(pei: PEICompleto): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { cabecalho, historico_napne, planejamento_pei } = pei;

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 186mm
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 15) {
      doc.addPage();
      cursorY = margin;
    }
  };

  // --- CABEÇALHO OFICIAL IFTO + NAPNE ---
  const headerHeight = 24;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.35);

  const col1W = 48;
  const col3W = 36;
  const col2W = contentWidth - col1W - col3W;

  // Box 1: IFTO Logo + Campus
  doc.rect(margin, cursorY, col1W, headerHeight);
  // Draw mini IF symbol (red circle + green squares)
  doc.setFillColor(200, 16, 46);
  doc.circle(margin + 5.2, cursorY + 5.5, 1.7, 'F');
  doc.setFillColor(0, 132, 61);
  // Row 1
  doc.rect(margin + 8, cursorY + 4, 3, 3, 'F');
  doc.rect(margin + 12, cursorY + 4, 3, 3, 'F');
  // Row 2
  doc.rect(margin + 3.7, cursorY + 8, 3, 3, 'F');
  doc.rect(margin + 8, cursorY + 8, 3, 3, 'F');
  // Row 3
  doc.rect(margin + 3.7, cursorY + 12, 3, 3, 'F');
  doc.rect(margin + 8, cursorY + 12, 3, 3, 'F');
  doc.rect(margin + 12, cursorY + 12, 3, 3, 'F');
  // Row 4
  doc.rect(margin + 3.7, cursorY + 16, 3, 3, 'F');
  doc.rect(margin + 8, cursorY + 16, 3, 3, 'F');

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('INSTITUTO FEDERAL', margin + 17, cursorY + 8.5);
  doc.setFontSize(7);
  doc.setTextColor(6, 95, 70);
  doc.text('Tocantins', margin + 17, cursorY + 12.2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(60, 60, 60);
  doc.text('Campus Paraíso do Tocantins', margin + 17, cursorY + 16);

  // Box 2: Center Title
  doc.setTextColor(0, 0, 0);
  doc.rect(margin + col1W, cursorY, col2W, headerHeight);
  const centerX = margin + col1W + col2W / 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('MINISTÉRIO DA EDUCAÇÃO · NAPNE / IFTO', centerX, cursorY + 7, {
    align: 'center',
  });
  doc.setFontSize(10.5);
  doc.text('PEI - PLANO DE ENSINO INDIVIDUALIZADO', centerX, cursorY + 13, {
    align: 'center',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(
    'Núcleo de Atendimento às Pessoas com Necessidades Específicas',
    centerX,
    cursorY + 18.5,
    { align: 'center' }
  );

  // Box 3: Student Identification Box
  const col3X = margin + col1W + col2W;
  doc.setFillColor(248, 250, 252);
  doc.rect(col3X, cursorY, col3W, headerHeight, 'FD');
  const col3CenterX = col3X + col3W / 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(80, 80, 80);
  doc.text('ESTUDANTE', col3CenterX, cursorY + 6.5, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(7.2);
  const studentNameLines = doc.splitTextToSize(cabecalho.estudante.toUpperCase(), col3W - 4);
  doc.text(studentNameLines.slice(0, 2), col3CenterX, cursorY + 11.5, {
    align: 'center',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(cabecalho.codigo_matricula || '', col3CenterX, cursorY + 20, {
    align: 'center',
  });

  cursorY += headerHeight + 4;

  // Helper to draw a gray section header bar
  const drawSectionHeader = (title: string) => {
    checkPageBreak(14);
    const barH = 6.5;
    doc.setFillColor(226, 232, 240); // bg-slate-200
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, cursorY, contentWidth, barH, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), margin + 2.5, cursorY + 4.5);
    cursorY += barH;
  };

  // Helper to draw a bordered text row with optional bold sub-label
  const drawTextRow = (label: string | null, content: string) => {
    const padding = 2.5;
    const innerW = contentWidth - padding * 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    const lines: string[] = doc.splitTextToSize(content || '—', innerW);
    const lineHeight = 4.1;
    const labelHeight = label ? 4.5 : 0;
    const boxHeight = Math.max(8, padding * 2 + labelHeight + lines.length * lineHeight);

    checkPageBreak(boxHeight);
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, cursorY, contentWidth, boxHeight);

    let textY = cursorY + padding + 3.2;
    if (label) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.text(label, margin + padding, textY);
      textY += labelHeight;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.text(lines, margin + padding, textY);

    cursorY += boxHeight;
  };

  // --- 1. IDENTIFICAÇÃO ---
  drawSectionHeader('1. Identificação');

  const drawTwoColRow = (
    leftLabel: string,
    leftVal: string,
    rightLabel: string,
    rightVal: string
  ) => {
    const halfW = contentWidth / 2;
    const padding = 2.5;
    doc.setFontSize(8.2);

    const leftText = `${leftLabel} ${leftVal || '—'}`;
    const rightText = `${rightLabel} ${rightVal || '—'}`;
    const leftLines = doc.splitTextToSize(leftText, halfW - padding * 2);
    const rightLines = doc.splitTextToSize(rightText, halfW - padding * 2);
    const maxLines = Math.max(leftLines.length, rightLines.length, 1);
    const rowH = Math.max(7, maxLines * 4.1 + padding * 1.6);

    checkPageBreak(rowH);
    doc.rect(margin, cursorY, halfW, rowH);
    doc.rect(margin + halfW, cursorY, halfW, rowH);

    // Render left cell with bold label
    doc.setFont('helvetica', 'bold');
    doc.text(leftLabel, margin + padding, cursorY + 4.6);
    const leftLabelW = doc.getTextWidth(leftLabel + ' ');
    doc.setFont('helvetica', 'normal');
    const leftValLines = doc.splitTextToSize(
      leftVal || '—',
      halfW - padding * 2 - leftLabelW
    );
    if (leftValLines.length === 1) {
      doc.text(leftValLines[0], margin + padding + leftLabelW, cursorY + 4.6);
    } else {
      doc.text(
        doc.splitTextToSize(leftVal || '—', halfW - padding * 2),
        margin + padding,
        cursorY + 8.4
      );
    }

    // Render right cell with bold label
    doc.setFont('helvetica', 'bold');
    doc.text(rightLabel, margin + halfW + padding, cursorY + 4.6);
    const rightLabelW = doc.getTextWidth(rightLabel + ' ');
    doc.setFont('helvetica', 'normal');
    const rightValLines = doc.splitTextToSize(
      rightVal || '—',
      halfW - padding * 2 - rightLabelW
    );
    if (rightValLines.length === 1) {
      doc.text(rightValLines[0], margin + halfW + padding + rightLabelW, cursorY + 4.6);
    } else {
      doc.text(
        doc.splitTextToSize(rightVal || '—', halfW - padding * 2),
        margin + halfW + padding,
        cursorY + 8.4
      );
    }

    cursorY += rowH;
  };

  drawTwoColRow(
    'Docente:',
    cabecalho.docente_regente,
    'Nome do estudante:',
    cabecalho.estudante
  );
  drawTwoColRow('Matrícula:', cabecalho.codigo_matricula, 'Curso:', cabecalho.curso);
  drawTwoColRow(
    'Componente Curricular:',
    cabecalho.componente_curricular,
    'Período / Módulo:',
    cabecalho.modulo_periodo
  );

  cursorY += 3.5;

  // --- 2. HISTÓRICOS CLÍNICO E FAMILIAR DO ESTUDANTE ---
  drawSectionHeader('2. Históricos Clínico e Familiar do Estudante');
  drawTextRow(
    'Breve histórico clínico e familiar do estudante: (NAPNE)',
    historico_napne.breve_historico_clinico_familiar
  );
  drawTextRow(
    'Breve descrição da condição específica do estudante: (NAPNE)',
    historico_napne.descricao_condicao_especifica
  );

  cursorY += 3.5;

  // --- 3. INFORMAÇÕES DOS PAIS (NAPNE) ---
  drawSectionHeader('3. Informações dos Pais (NAPNE)');
  drawTextRow(null, historico_napne.informacoes_dos_pais);

  cursorY += 3.5;

  // --- 4. PLANEJAMENTO DO COMPONENTE CURRICULAR ---
  drawSectionHeader('4. Planejamento do Componente Curricular');
  drawTextRow('Conteúdo (Ementa):', planejamento_pei.conteudo_ementa_oficial);
  drawTextRow(
    'Competências e Habilidades (Ementa):',
    planejamento_pei.competencias_habilidades_ementa
  );

  cursorY += 3.5;

  // --- 5. ADAPTAÇÃO E FLEXIBILIZAÇÃO CURRICULAR ---
  drawSectionHeader(
    '5. Adaptação e Flexibilização Curricular (conteúdos aplicados/adaptados)'
  );
  drawTextRow(null, planejamento_pei.adaptacao_flexibilizacao_curricular);

  cursorY += 3.5;

  // --- 6. ADAPTAÇÃO E FLEXIBILIZAÇÃO METODOLÓGICA ---
  const textoMetodologiaCombinada = [
    `Engajamento: ${planejamento_pei.flexibilizacao_metodologica_dua.engajamento.join(' ')}`,
    `Representação: ${planejamento_pei.flexibilizacao_metodologica_dua.representacao.join(' ')}`,
    `Ação e Expressão: ${planejamento_pei.flexibilizacao_metodologica_dua.acao_e_expressao.join(' ')}`,
    planejamento_pei.guia_pratico_sala_de_aula
      ? `Passo a Passo em Aula: ${planejamento_pei.guia_pratico_sala_de_aula.passo_a_passo_explicacao} | Divisão de Tarefas: ${planejamento_pei.guia_pratico_sala_de_aula.divisao_tarefa_chunking.join(' ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  drawSectionHeader(
    '6. Adaptação e Flexibilização Metodológica (práticas pedagógicas aplicadas)'
  );
  drawTextRow(null, textoMetodologiaCombinada);

  cursorY += 3.5;

  // --- 7. AVALIAÇÃO ---
  const textoAvaliacaoCombinada = [
    `Formato Acessível: ${planejamento_pei.estrategias_avaliacao.formato_acessivel}`,
    `Critério de Sucesso e Avanço: ${planejamento_pei.estrategias_avaliacao.criterio_de_sucesso}`,
    `Tempo e Espaço: ${planejamento_pei.estrategias_avaliacao.tempo_e_espaco}`,
    `Recursos de Tecnologia Assistiva Utilizados: ${planejamento_pei.estrategias_avaliacao.recursos_utilizados.join(', ')}.`,
  ].join('\n');

  drawSectionHeader('7. Avaliação (onde estava; o quanto o estudante avançou)');
  drawTextRow(null, textoAvaliacaoCombinada);

  cursorY += 3.5;

  // --- 8. OBSERVAÇÃO DO PROFESSOR ---
  drawSectionHeader('8. Observação do Professor — Resultado e Objetivos Alcançados');
  drawTextRow(null, planejamento_pei.observacoes_docente);

  // --- RODAPÉ DE ASSINATURAS LADO A LADO ---
  checkPageBreak(28);
  cursorY += 16;

  const sigLineW = 72;
  const leftSigCenterX = margin + contentWidth * 0.25;
  const rightSigCenterX = margin + contentWidth * 0.75;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.35);
  doc.line(
    leftSigCenterX - sigLineW / 2,
    cursorY,
    leftSigCenterX + sigLineW / 2,
    cursorY
  );
  doc.line(
    rightSigCenterX - sigLineW / 2,
    cursorY,
    rightSigCenterX + sigLineW / 2,
    cursorY
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(cabecalho.docente_regente || '', leftSigCenterX, cursorY - 2, {
    align: 'center',
  });
  doc.text(cabecalho.coordenacao_napne || '', rightSigCenterX, cursorY - 2, {
    align: 'center',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DOCENTE', leftSigCenterX, cursorY + 4.5, { align: 'center' });
  doc.text('COORDENADORA NAPNE', rightSigCenterX, cursorY + 4.5, {
    align: 'center',
  });

  const safeName = cabecalho.estudante
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

  const filename = `PEI_IFTO_${cabecalho.codigo_matricula || 'NAPNE'}_${safeName}.pdf`;
  doc.save(filename);
}

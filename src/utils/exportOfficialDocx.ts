import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  ShadingType,
} from 'docx';
import { PEICompleto } from '../types/pei';

export async function exportOfficialPeiDocx(pei: PEICompleto): Promise<void> {
  const { cabecalho, historico_napne, estudo_de_caso, planejamento_pei, parecer_pedagogico } = pei;

  const borderNone = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  const borderStandard = {
    top: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
  };

  const createCell = (
    textLines: string[],
    boldTitle?: string,
    widthPercent: number = 100,
    backgroundColor?: string
  ) => {
    const paragraphs: Paragraph[] = [];
    if (boldTitle) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: boldTitle,
              bold: true,
              size: 20, // 10pt
              font: 'Calibri',
            }),
          ],
          spacing: { after: 80 },
        })
      );
    }

    textLines.forEach((line) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 20, // 10pt
              font: 'Calibri',
            }),
          ],
          spacing: { after: 60 },
        })
      );
    });

    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      borders: borderStandard,
      margins: { top: 120, bottom: 120, left: 160, right: 160 },
      shading: backgroundColor
        ? { type: ShadingType.CLEAR, fill: backgroundColor }
        : undefined,
      children: paragraphs.length > 0 ? paragraphs : [new Paragraph('')],
    });
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1200,
              right: 1200,
            },
          },
        },
        children: [
          // Top Institutional Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'MINISTÉRIO DA EDUCAÇÃO',
                bold: true,
                size: 22,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO TOCANTINS',
                bold: true,
                size: 20,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'CAMPUS PARAÍSO DO TOCANTINS · NAPNE',
                bold: true,
                size: 18,
                color: '006633',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 240 },
            children: [
              new TextRun({
                text: 'PEI - PLANO DE ENSINO INDIVIDUALIZADO',
                bold: true,
                size: 26,
                font: 'Calibri',
              }),
            ],
          }),

          // Seção 1: Identificação
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: '1. IDENTIFICAÇÃO DO ESTUDANTE E COMPONENTE',
                bold: true,
                size: 22,
                color: '004d25',
                font: 'Calibri',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell([cabecalho.docente_regente], 'Docente Regente:', 50, 'F5F5F5'),
                  createCell([cabecalho.estudante], 'Nome do Estudante:', 50, 'F5F5F5'),
                ],
              }),
              new TableRow({
                children: [
                  createCell([cabecalho.codigo_matricula], 'Matrícula:', 30),
                  createCell([cabecalho.curso], 'Curso:', 40),
                  createCell([cabecalho.modulo_periodo], 'Período / Módulo:', 30),
                ],
              }),
              new TableRow({
                children: [
                  createCell(
                    [cabecalho.componente_curricular],
                    'Componente Curricular (Disciplina):',
                    100
                  ),
                ],
              }),
            ],
          }),

          // Seção 2: Histórico Clínico e Familiar
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({
                text: '2. HISTÓRICOS CLÍNICO E FAMILIAR DO ESTUDANTE (NAPNE)',
                bold: true,
                size: 22,
                color: '004d25',
                font: 'Calibri',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell(
                    [
                      historico_napne.breve_historico_clinico_familiar ||
                        'Registro institucional do estudante acompanhado pela equipe multiprofissional do NAPNE.',
                    ],
                    'Breve histórico clínico e familiar do estudante:',
                    100
                  ),
                ],
              }),
              new TableRow({
                children: [
                  createCell(
                    [
                      historico_napne.descricao_condicao_especifica ||
                        'Acompanhamento de acordo com a Portaria MEC nº 421/2026 e orientações do NAPNE.',
                    ],
                    'Breve descrição da condição específica do estudante:',
                    100
                  ),
                ],
              }),
              new TableRow({
                children: [
                  createCell(
                    [
                      historico_napne.informacoes_dos_pais ||
                        'Diálogo periódico com a família e acompanhamento conjunto com o serviço de assistência estudantil.',
                    ],
                    'Informações dos Pais / Responsáveis:',
                    100
                  ),
                ],
              }),
            ],
          }),

          // Seção 3: Planejamento Pedagógico (DUA 3.0)
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({
                text: '3. PLANEJAMENTO DO COMPONENTE CURRICULAR (DUA 3.0)',
                bold: true,
                size: 22,
                color: '004d25',
                font: 'Calibri',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell(
                    [
                      planejamento_pei.conteudo_ementa_oficial,
                      ...(planejamento_pei.conteudos_especificos_modulo
                        ? [`Conteúdos do Bimestre: ${planejamento_pei.conteudos_especificos_modulo}`]
                        : []),
                    ],
                    'Conteúdo Programático Essencial (Ementa):',
                    100
                  ),
                ],
              }),
              new TableRow({
                children: [
                  createCell(
                    [planejamento_pei.competencias_habilidades_ementa],
                    'Competências e Habilidades Foco (PPC / BNCC):',
                    100
                  ),
                ],
              }),
              new TableRow({
                children: [
                  createCell(
                    [planejamento_pei.adaptacao_flexibilizacao_curricular],
                    'Adaptação e Flexibilização Curricular (Conteúdos aplicados/adaptados):',
                    100
                  ),
                ],
              }),
              new TableRow({
                children: [
                  createCell(
                    [
                      '• ENGAJAMENTO E AUTORREGULAÇÃO (Prevenção de Gatilhos):',
                      ...planejamento_pei.flexibilizacao_metodologica_dua.engajamento.map(
                        (i) => `  - ${i}`
                      ),
                      '',
                      '• REPRESENTAÇÃO MULTISSENSORIAL:',
                      ...planejamento_pei.flexibilizacao_metodologica_dua.representacao.map(
                        (i) => `  - ${i}`
                      ),
                      '',
                      '• AÇÃO E EXPRESSÃO (Tecnologia Assistiva):',
                      ...planejamento_pei.flexibilizacao_metodologica_dua.acao_e_expressao.map(
                        (i) => `  - ${i}`
                      ),
                      ...(planejamento_pei.guia_pratico_sala_de_aula?.passo_a_passo_explicacao
                        ? [
                            '',
                            `• GUIA PRÁTICO EM SALA: ${planejamento_pei.guia_pratico_sala_de_aula.passo_a_passo_explicacao}`,
                          ]
                        : []),
                    ],
                    'Adaptação e Flexibilização Metodológica (Práticas pedagógicas aplicadas):',
                    100
                  ),
                ],
              }),
              new TableRow({
                children: [
                  createCell(
                    [
                      `Formato Acessível: ${planejamento_pei.estrategias_avaliacao.formato_acessivel}`,
                      `Critério de Sucesso e Avanço: ${planejamento_pei.estrategias_avaliacao.criterio_de_sucesso}`,
                      `Tempo e Espaço: ${planejamento_pei.estrategias_avaliacao.tempo_e_espaco}`,
                      `Recursos de TA Utilizados: ${planejamento_pei.estrategias_avaliacao.recursos_utilizados.join(', ')}`,
                    ],
                    'Avaliação (Onde estava; o quanto o estudante avançou):',
                    100
                  ),
                ],
              }),
              new TableRow({
                children: [
                  createCell(
                    [
                      parecer_pedagogico ||
                        'O estudante apresenta evolução contínua nas habilidades essenciais do componente, respondendo positivamente às flexibilizações metodológicas implementadas com base no DUA 3.0.',
                    ],
                    'Observação do Professor / Resultado e Objetivos Alcançados:',
                    100
                  ),
                ],
              }),
            ],
          }),

          // Seção 4: Assinaturas Oficiais
          new Paragraph({
            spacing: { before: 500, after: 200 },
            children: [
              new TextRun({
                text: 'Declaro ciência e concordância com as diretrizes e adaptações constantes neste Plano de Ensino Individualizado.',
                italics: true,
                size: 18,
                font: 'Calibri',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: borderNone,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 300, after: 40 },
                        children: [
                          new TextRun({
                            text: '____________________________________________',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: cabecalho.docente_regente,
                            bold: true,
                            size: 18,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'Docente Regente / Responsável',
                            size: 16,
                            color: '555555',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: borderNone,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 300, after: 40 },
                        children: [
                          new TextRun({
                            text: '____________________________________________',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'Coordenação NAPNE',
                            bold: true,
                            size: 18,
                            font: 'Calibri',
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'Núcleo de Atendimento às Pessoas com Necessidades Específicas',
                            size: 16,
                            color: '555555',
                            font: 'Calibri',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `PEI_${pei.cabecalho.estudante.replace(/\s+/g, '_')}_${pei.cabecalho.componente_curricular.replace(/\s+/g, '_')}.docx`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

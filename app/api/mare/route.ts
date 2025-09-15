import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { arrLocations } from '../../../scripts/posicaoPdf.js';
import { normalizeName } from '../../../lib/normalize';

// Função GET da API
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const spotParam = searchParams.get('spot') || '';
  const spotKey = normalizeName(spotParam);

  // Caminho da pasta de JSONs
  const jsonDir = path.join(process.cwd(), 'public', 'jsons');
  if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir);

  const jsonPath = path.join(jsonDir, spotKey + '.json');

  let dados;

  if (fs.existsSync(jsonPath)) {
    // ✅ Se o JSON existe, apenas lê ele
    console.log(`[INFO] Lendo JSON existente: ${jsonPath}`);
    dados = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  } else {
    // ⚠ Caso JSON não exista, tenta achar PDF correspondente
    const loc = arrLocations.find(l => normalizeName(l.name) === spotKey);

    if (!loc) {
      console.warn(`[WARN] Spot "${spotParam}" não encontrado no arrLocations`);
      return NextResponse.json({ error: `Spot "${spotParam}" não encontrado` }, { status: 404 });
    }

    const pdfPath = path.join(process.cwd(), loc.url);

    if (!fs.existsSync(pdfPath)) {
      console.warn(`[WARN] PDF não encontrado: ${pdfPath}`);
      dados = [];
    } else {
      // Só processa PDF se ele existir
      const { processarTabelaMare } = await import('../../../scripts/parseText.js');
      console.log(`[INFO] Processando PDF: ${pdfPath}`);
      dados = await processarTabelaMare(pdfPath);

      // Salva JSON para próximas chamadas
      fs.writeFileSync(jsonPath, JSON.stringify(dados, null, 2));
      console.log(`[INFO] JSON gerado: ${jsonPath}`);
    }
  }

  return NextResponse.json({ spot: spotParam, dados });
}

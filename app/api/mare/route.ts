import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { arrLocations } from '../../../scripts/posicaoPdf.js'
import { normalizeName } from '../../../lib/normalize'
import { processarTabelaMare } from '../../../scripts/parseText.js'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const spotParam = searchParams.get('spot') || ''
  const spotKey = normalizeName(spotParam)

  // encontra a localização
  const loc = arrLocations.find(l => normalizeName(l.name) === spotKey)
  if (!loc) return NextResponse.json({ error: `Spot "${spotParam}" não encontrado` }, { status: 404 })

  const jsonPath = path.join(process.cwd(), 'tabuas25', spotKey + '.json')
  
  let dados
  if (fs.existsSync(jsonPath)) {
    dados = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  } else {
    // Processa o PDF e salva como JSON
    const pdfPath = path.join(process.cwd(), loc.url)
    if (!fs.existsSync(pdfPath)) return NextResponse.json({ error: 'PDF não encontrado' }, { status: 404 })

    dados = await processarTabelaMare(pdfPath)
    fs.writeFileSync(jsonPath, JSON.stringify(dados, null, 2))
  }

  return NextResponse.json({ spot: spotParam, dados })
}

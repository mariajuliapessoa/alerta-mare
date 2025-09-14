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

  // Encontra a localização
  const loc = arrLocations.find(l => normalizeName(l.name) === spotKey)
  if (!loc) return NextResponse.json({ error: `Spot "${spotParam}" não encontrado` }, { status: 404 })

  // Caminho do JSON (na pasta public/jsons)
  const jsonDir = path.join(process.cwd(), 'public', 'jsons')
  if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir) // cria pasta se não existir

  const jsonPath = path.join(jsonDir, spotKey + '.json')
  
  let dados

  if (fs.existsSync(jsonPath)) {
    // Lê JSON existente
    dados = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  } else {
    // Processa PDF e salva como JSON
    const pdfPath = path.join(process.cwd(), loc.url)
    if (!fs.existsSync(pdfPath)) {
      console.warn(`PDF não encontrado: ${pdfPath}`)
      dados = []
    } else {
      dados = await processarTabelaMare(pdfPath)
      fs.writeFileSync(jsonPath, JSON.stringify(dados, null, 2))
    }
  }

  return NextResponse.json({ spot: spotParam, dados })
}

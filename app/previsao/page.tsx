// app/previsao/page.tsx
'use client'

import Link from 'next/link'
// Update the import path below if the file is located elsewhere, or create the file if it doesn't exist.
import { arrLocations } from '../../scripts/posicaoPdf.js'
import { normalizeName } from '../../lib/normalize'

export default function PrevisaoHome() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Previsão de Marés</h1>
      <p>Escolha uma praia para ver a previsão:</p>
      <ul className="mt-4 space-y-2">
        {arrLocations.map((loc) => (
          <li key={loc.name}>
            <Link
              href={`/previsao/${encodeURIComponent(normalizeName(loc.name))}`}
              className="text-blue-600 hover:underline"
            >
              {loc.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

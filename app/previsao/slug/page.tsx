'use client'

import { useEffect, useState } from 'react'
import SpotChartClient from '../../../components/SpotChartClient'

interface PrevisaoItem {
  hora: string
  altura: number
}

interface PrevisaoProps {
  params: { slug: string }
}

export default function Previsao({ params }: PrevisaoProps) {
  const { slug } = params
  const [dados, setDados] = useState<PrevisaoItem[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/jsons/${slug}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Dados não encontrados')
        return res.json()
      })
      .then(setDados)
      .catch(() => setError(true))
  }, [slug])

  if (error) return <h1>404 - Dados não encontrados</h1>
  if (!dados.length) return <p>Carregando...</p>

  const labels = dados.map(item => item.hora)
  const values = dados.map(item => item.altura)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{slug.replace(/_/g, ' ')}</h1>
      <SpotChartClient data={values} labels={labels} />
    </div>
  )
}

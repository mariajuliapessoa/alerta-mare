'use client'

import { useEffect, useState } from 'react'
// Update the import path if the file is located elsewhere, for example:
import SpotChartClient from '../../../components/SpotChartClient'
// Or ensure that '../../components/SpotChartClient.tsx' exists in your project.
import { normalizeName } from '@lib/normalize'

interface TabuaDia {
  dia: string
  data: string
  hora1: string
  altura1: string
  hora2: string
  altura2: string
  hora3: string
  altura3: string
  hora4: string
  altura4: string
}

export default function SpotPage({ params }: { params: { spot: string } }) {
  const [data, setData] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setData([])
    setLabels([])

    const spotKey = normalizeName(decodeURIComponent(params.spot))

    fetch(`/api/mare?spot=${spotKey}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          setError(json.error)
          setLoading(false)
          return
        }

        if (!json.dados || json.dados.length === 0) {
          setError('Nenhum dado encontrado para este spot.')
          setLoading(false)
          return
        }

        const niveis: number[] = []
        const horario: string[] = []

        json.dados.forEach((dia: TabuaDia) => {
          ['1','2','3','4'].forEach(i => {
            const h = dia[`hora${i}` as keyof TabuaDia] as string
            const a = dia[`altura${i}` as keyof TabuaDia] as string
            if (h && a) {
              const alturaNum = Number(a.replace(',', '.'))
              if (!isNaN(alturaNum)) {
                niveis.push(alturaNum)
                horario.push(h)
              }
            }
          })
        })

        setData(niveis)
        setLabels(horario)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Erro ao buscar dados da API.')
        setLoading(false)
      })
  }, [params.spot])

  if (loading) return <p>Carregando dados...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Previsão para {params.spot}</h1>
      {data.length > 0 ? (
        <SpotChartClient data={data} labels={labels} />
      ) : (
        <p>Nenhum dado disponível para este spot.</p>
      )}
    </div>
  )
}

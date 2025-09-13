import fs from 'fs'
import path from 'path'
import SpotChartClient from '../../../components/SpotChartClient'

interface PrevisaoProps {
  params: { slug: string }
}

export default function Previsao({ params }: PrevisaoProps) {
  const slug = params.slug
  const jsonPath = path.join(process.cwd(), 'app', 'previsao', 'jsons', `${slug}.json`)

  if (!fs.existsSync(jsonPath)) {
    return <h1>404 - Dados não encontrados</h1>
  }

  const dados = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  const labels = dados.map((item: any) => item.hora)
  const values = dados.map((item: any) => item.altura)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{slug.replace(/_/g, ' ')}</h1>
      <SpotChartClient data={values} labels={labels} />
    </div>
  )
}

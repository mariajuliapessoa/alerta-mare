'use client'
import { Line } from 'react-chartjs-2'

interface SpotChartClientProps {
  data: number[]
  labels: string[]
}

export default function SpotChartClient({ data, labels }: SpotChartClientProps) {
  const chartData = {
    labels,
    datasets: [
      { label: 'Nível da Maré (m)', data, borderColor: 'blue', fill: false },
    ],
  }

  return <Line data={chartData} />
}

import { Line } from 'react-chartjs-2';

interface SpotChartProps {
  data: number[];
  labels: string[];
}

export default function SpotChart({ data, labels }: SpotChartProps) {
  const chartData = {
    labels,
    datasets: [{ label: 'Nível da Maré', data, borderColor: 'blue', fill: false }],
  };

  return <Line data={chartData} />;
}

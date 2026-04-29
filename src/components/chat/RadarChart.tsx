'use client'

import { useRef, useEffect } from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import type { RadarData } from '@/types/interview'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface RadarChartProps {
  data: RadarData
}

export default function RadarChart({ data }: RadarChartProps) {
  const chartRef = useRef<ChartJS<'radar'>>(null)

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [])

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: '能力评分',
        data: data.scores,
        backgroundColor: 'rgba(123, 97, 255, 0.15)',
        borderColor: 'rgba(123, 97, 255, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(123, 97, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(123, 97, 255, 1)',
        pointRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#71717a',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.06)',
        },
        pointLabels: {
          color: '#a1a1aa',
          font: { size: 12 },
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <Radar ref={chartRef} data={chartData} options={options} />
    </div>
  )
}

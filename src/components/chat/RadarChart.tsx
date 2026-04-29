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
        backgroundColor: 'rgba(232, 201, 154, 0.12)',
        borderColor: 'rgba(232, 201, 154, 0.7)',
        borderWidth: 1.5,
        pointBackgroundColor: 'rgba(232, 201, 154, 1)',
        pointBorderColor: '#202020',
        pointHoverBackgroundColor: '#202020',
        pointHoverBorderColor: 'rgba(232, 201, 154, 1)',
        pointRadius: 3,
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
          color: '#6B6B6B',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        pointLabels: {
          color: '#9B9B9B',
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

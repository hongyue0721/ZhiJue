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
        backgroundColor: 'rgba(212, 168, 83, 0.12)',
        borderColor: 'rgba(212, 168, 83, 0.7)',
        borderWidth: 1.5,
        pointBackgroundColor: 'rgba(212, 168, 83, 1)',
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: 'rgba(212, 168, 83, 1)',
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
          color: '#B4B4B0',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
        grid: {
          color: 'rgba(15, 15, 15, 0.06)',
        },
        angleLines: {
          color: 'rgba(15, 15, 15, 0.06)',
        },
        pointLabels: {
          color: '#787774',
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

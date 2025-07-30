import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BloodTestChartProps {
  data: any;
}

export default function BloodTestChart({ data }: BloodTestChartProps) {
  const chartRef = useRef<any>(null);

  // Convert blood test data to chart format
  const chartData = {
    labels: Object.keys(data).map(key => 
      key.replace(/([A-Z])/g, ' $1').trim()
    ),
    datasets: [
      {
        label: 'Current Values',
        data: Object.values(data).map((item: any) => item.value),
        backgroundColor: Object.values(data).map((item: any) => {
          switch (item.status) {
            case 'high':
              return 'rgba(239, 68, 68, 0.8)';
            case 'low':
              return 'rgba(245, 158, 11, 0.8)';
            default:
              return 'rgba(34, 197, 94, 0.8)';
          }
        }),
        borderColor: Object.values(data).map((item: any) => {
          switch (item.status) {
            case 'high':
              return 'rgba(239, 68, 68, 1)';
            case 'low':
              return 'rgba(245, 158, 11, 1)';
            default:
              return 'rgba(34, 197, 94, 1)';
          }
        }),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const dataPoint = Object.values(data)[context.dataIndex] as any;
            return [
              `Value: ${dataPoint.value} ${dataPoint.unit}`,
              `Normal: ${dataPoint.normal}`,
              `Status: ${dataPoint.status.toUpperCase()}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          },
          maxRotation: 45
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="h-64 w-full">
      <Bar ref={chartRef} data={chartData} options={options} />
      
      {/* Legend */}
      <div className="chart-legend mt-4">
        <div className="legend-item">
          <div className="legend-color bg-green-500"></div>
          <span>Normal</span>
        </div>
        <div className="legend-item">
          <div className="legend-color bg-yellow-500"></div>
          <span>Low</span>
        </div>
        <div className="legend-item">
          <div className="legend-color bg-red-500"></div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
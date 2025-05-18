import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export const OrderStatusChart = ({ data }) => {
  // Define chart colors
  const colors = [
    '#4ade80', // green-400 - Completed
    '#facc15', // yellow-400 - Processing
    '#3b82f6', // blue-400 - Pending
    '#f87171', // red-400 - Cancelled
    '#a855f7'  // purple-400 - Other statuses
  ];

  // Format the data for the chart
  const chartData = {
    labels: data.map(item => item.status?.name),
    datasets: [
      {
        data: data.map(item => item.total), 
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length).map(color => color),
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className="h-[300px] flex flex-col items-center">
      <div className="w-full h-full">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="mt-2 text-sm text-gray-500 text-center">
        Tổng đơn hàng: {data.reduce((acc, item) => acc + item.total, 0)}
      </div>
    </div>
  );
};

export default OrderStatusChart;

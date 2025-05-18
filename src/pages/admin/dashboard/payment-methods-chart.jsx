import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Doughnut } from "react-chartjs-2"

export function PaymentMethodsChart({ data }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
  }

  // Map payment method names to more readable format
  const paymentMethodNames = {
    vnpay: "VNPay",
    momo: "MoMo",
    zalopay: "ZaloPay",
    cod: "Tiền mặt",
    bank: "Chuyển khoản",
    credit: "Thẻ tín dụng",
  }

  const chartData = data?.map((item) => ({
    ...item,
    name: paymentMethodNames[item?.payment_method] || item?.payment_method,
  })) || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">Phương thức:</span>
              <span className="font-bold">{data?.name}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">Doanh thu:</span>
              <span className="font-bold">{formatCurrency(data?.total_amount || 0)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">Số lượng:</span>
              <span className="font-bold">{data?.total || 0}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">Tỷ lệ:</span>
              <span className="font-bold">{(data?.percentage || 0)}%</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const doughnutData = {
    labels: data?.map(item => paymentMethodNames[item?.payment_method] || item?.payment_method) || [],
    datasets: [
      {
        data: data?.map(item => item?.total || 0) || [],
        backgroundColor: [
          '#3b82f6', // blue-500
          '#8b5cf6', // violet-500
          '#ec4899', // pink-500
          '#f59e0b', // amber-500
          '#10b981', // emerald-500
        ],
        borderWidth: 1,
      },
    ],
  };

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
            const label = context?.label || '';
            const value = context?.raw || 0;
            const total = context?.dataset?.data?.reduce((a, b) => a + b, 0) || 0;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="space-y-6">
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false} 
              className="text-sm text-gray-500"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => `${value / 1000000}M`}
              tickLine={false}
              axisLine={false}
              className="text-sm text-gray-500"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total_amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-[250px]">
        <Doughnut data={doughnutData} options={options} />
      </div>
    </div>
  )
}

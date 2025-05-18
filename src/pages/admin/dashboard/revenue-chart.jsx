import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export const RevenueChart = ({ data }) => {
  const chartData = data?.map(item => ({
    date: item?.date,
    revenue: item?.total_revenue || 0,
    orders: item?.total_orders || 0,
    average: item?.average_order_value || 0
  })) || [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="text-sm font-medium mb-1">{label}</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">Doanh thu:</span>
              <span className="font-bold">{formatCurrency(payload[0].value)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">Đơn hàng:</span>
              <span className="font-bold">{payload[1].value}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => value?.split('-')[2] || ''}
          />
          <YAxis
            tickFormatter={(value) => 
              new Intl.NumberFormat('vi-VN', { 
                notation: 'compact',
                maximumFractionDigits: 1 
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'revenue' || name === 'average') {
                return [
                  new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(value),
                  name === 'revenue' ? 'Doanh thu' : 'Giá trị trung bình'
                ];
              }
              return [value, name === 'orders' ? 'Số đơn hàng' : name];
            }}
            labelFormatter={(label) => `Ngày ${label?.split('-')[2] || ''}`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fill="url(#colorRevenue)"
            activeDot={{ r: 6 }}
          />
          <Area type="monotone" dataKey="orders" stroke="#10b981" fill="url(#colorOrders)" />
          <Area type="monotone" dataKey="average" stroke="#8b5cf6" fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

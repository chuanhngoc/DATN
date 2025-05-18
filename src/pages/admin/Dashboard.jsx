
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Clock, Star, Ticket } from "lucide-react"
import {
  Calendar,
  ChevronDown,
  Download,
  HelpCircle,
  Package,
  RefreshCw,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  ShoppingBag,
  UserCircle,
} from "lucide-react"

import { ReviewStats } from "./dashboard/review-stats"
import { VoucherStats } from "./dashboard/voucher-stats"
import { CategoryStats } from "./dashboard/category-stats"
import { CancelRefundStats } from "./dashboard/cancel-refund-stats"
import { TopSellingProducts } from "./dashboard/top-selling-products"
import { PaymentMethodsChart } from "./dashboard/payment-methods-chart"
import { RevenueChart } from "./dashboard/revenue-chart"
import { db } from "../../services/db"
import OrderStatusChart from "./dashboard/order-status-chart"

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [activeTab, setActiveTab] = useState("revenue")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Format dates for API
  const formattedStartDate = format(dateRange.startDate, "yyyy-MM-dd")
  const formattedEndDate = format(dateRange.endDate, "yyyy-MM-dd")

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", formattedStartDate, formattedEndDate],
    queryFn: () =>
      db.getDashboard({
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      }),
  })

  const handleRefresh = () => {
    refetch()
  }

  const handleExport = () => {
    // Implement export functionality
    alert("Xuất dữ liệu thành công!")
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-[400px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-red-500 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Lỗi
            </h3>
          </div>
          <div className="p-5">
            <p className="text-gray-600">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 w-full"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-1 space-y-6 p-5 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Tổng quan
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center justify-between gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm w-full sm:w-[280px] bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">
                    {format(dateRange.startDate, "dd/MM/yyyy", { locale: vi })} -{" "}
                    {format(dateRange.endDate, "dd/MM/yyyy", { locale: vi })}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 p-5 bg-white border border-gray-100 rounded-xl shadow-xl z-10 w-[320px]">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Từ ngày</label>
                        <input
                          type="date"
                          value={format(dateRange.startDate, "yyyy-MM-dd")}
                          onChange={(e) => {
                            const date = new Date(e.target.value)
                            setDateRange((prev) => ({ ...prev, startDate: date }))
                          }}
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Đến ngày</label>
                        <input
                          type="date"
                          value={format(dateRange.endDate, "yyyy-MM-dd")}
                          onChange={(e) => {
                            const date = new Date(e.target.value)
                            setDateRange((prev) => ({ ...prev, endDate: date }))
                          }}
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleRefresh}
              className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white transition-colors shadow-sm"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="h-4 w-4 text-blue-600" />
            </button>
            {/* <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white transition-colors shadow-sm"
            >
              <Download className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Xuất báo cáo</span>
            </button> */}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-5 w-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              ))}
          </div>
        ) : dashboardData ? (
          <>
            {/* Overview Cards */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 group">
                <div className="flex flex-row items-center justify-between pb-3">
                  <h3 className="text-sm font-medium text-gray-500">Tổng doanh thu</h3>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.overview.total_revenue)}
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                  Giá trị đơn hàng trung bình: {formatCurrency(dashboardData.overview.average_order_value)}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 group">
                <div className="flex flex-row items-center justify-between pb-3">
                  <h3 className="text-sm font-medium text-gray-500">Đơn hàng</h3>
                  <div className="p-2 rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{dashboardData.overview.total_orders}</div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                  Tỷ lệ chuyển đổi: {dashboardData.overview.conversion_rate.toFixed(2)}%
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 group">
                <div className="flex flex-row items-center justify-between pb-3">
                  <h3 className="text-sm font-medium text-gray-500">Khách hàng</h3>
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{dashboardData.overview.total_users}</div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>
                  Đánh giá: {dashboardData.overview.total_reviews}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 group">
                <div className="flex flex-row items-center justify-between pb-3">
                  <h3 className="text-sm font-medium text-gray-500">Sản phẩm</h3>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{dashboardData.overview.total_products}</div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
                  Danh mục: {dashboardData.overview.total_categories}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-5">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("revenue")}
                    className={`px-5 py-3 text-sm font-medium flex items-center gap-2 ${
                      activeTab === "revenue"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <BarChart3 className={`h-4 w-4 ${activeTab === "revenue" ? "text-blue-600" : "text-gray-400"}`} />
                    Doanh thu
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`px-5 py-3 text-sm font-medium flex items-center gap-2 ${
                      activeTab === "orders"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <ShoppingBag className={`h-4 w-4 ${activeTab === "orders" ? "text-blue-600" : "text-gray-400"}`} />
                    Đơn hàng
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`px-5 py-3 text-sm font-medium flex items-center gap-2 ${
                      activeTab === "products"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <Package className={`h-4 w-4 ${activeTab === "products" ? "text-blue-600" : "text-gray-400"}`} />
                    Sản phẩm
                  </button>
                  <button
                    onClick={() => setActiveTab("customers")}
                    className={`px-5 py-3 text-sm font-medium flex items-center gap-2 ${
                      activeTab === "customers"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <UserCircle
                      className={`h-4 w-4 ${activeTab === "customers" ? "text-blue-600" : "text-gray-400"}`}
                    />
                    Khách hàng
                  </button>
                </div>
              </div>

              {/* Revenue Tab Content */}
              {activeTab === "revenue" && (
                <div className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-4 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          Doanh thu theo ngày
                        </h3>
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          {format(dateRange.startDate, "dd/MM", { locale: vi })} -{" "}
                          {format(dateRange.endDate, "dd/MM", { locale: vi })}
                        </div>
                      </div>
                      <div className="p-5">
                        <RevenueChart data={dashboardData.revenue_by_day} />
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-3 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                          Phương thức thanh toán
                        </h3>
                      </div>
                      <div className="p-5">
                        <PaymentMethodsChart data={dashboardData.payment_method_stats} />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-4 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-green-600" />
                          Sản phẩm bán chạy
                        </h3>
                      </div>
                      <div className="p-5">
                        <TopSellingProducts data={dashboardData.top_selling_products} />
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-3 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 text-red-600" />
                          Thống kê hủy & hoàn tiền
                        </h3>
                      </div>
                      <div className="p-5">
                        <CancelRefundStats data={dashboardData.cancel_and_refund_stats} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab Content */}
              {activeTab === "orders" && (
                <div className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-4 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-blue-600" />
                          Trạng thái đơn hàng
                        </h3>
                      </div>
                      <div className="p-5">
                        <OrderStatusChart data={dashboardData.order_status_stats} />
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-3 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          Đơn hàng chờ xử lý
                        </h3>
                        <div className="mt-2 inline-flex items-center bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                          Tổng số: {dashboardData.pending_orders.total}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex flex-col space-y-5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Thời gian chờ trung bình:</span>
                            <span className="font-bold text-amber-600">
                              {dashboardData.pending_orders.average_waiting_hours.toFixed(1)} giờ
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full"
                              style={{
                                width: `${Math.min((dashboardData.pending_orders.average_waiting_hours / 24) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            {dashboardData.pending_orders.average_waiting_hours < 12 ? (
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                Thời gian xử lý đơn hàng đang ở mức tốt
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                                Cần cải thiện thời gian xử lý đơn hàng
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab Content */}
              {activeTab === "products" && (
                <div className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-4 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Package className="h-4 w-4 text-purple-600" />
                          Thống kê danh mục
                        </h3>
                      </div>
                      <div className="p-5">
                        <CategoryStats data={dashboardData.category_stats} />
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-3 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-green-600" />
                          Thống kê mã giảm giá
                        </h3>
                      </div>
                      <div className="p-5">
                        <VoucherStats data={dashboardData.voucher_stats} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Customers Tab Content */}
              {activeTab === "customers" && (
                <div className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-4 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          Đánh giá sản phẩm
                        </h3>
                      </div>
                      <div className="p-5">
                        <ReviewStats data={dashboardData.review_stats} />
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-3 hover:shadow-md transition-shadow duration-200">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 text-red-600" />
                          Thống kê hoàn tiền
                        </h3>
                      </div>
                      <div className="p-5">
                        <div className="space-y-5">
                          <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <p className="text-sm font-medium text-gray-600">Tổng yêu cầu</p>
                              <p className="text-2xl font-bold text-gray-900">
                                {dashboardData.refund_stats.total_requests}
                              </p>
                            </div>
                            <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-100">
                              <p className="text-sm font-medium text-green-700">Đã duyệt</p>
                              <p className="text-2xl font-bold text-green-600">
                                {dashboardData.refund_stats.approved_requests}
                              </p>
                            </div>
                            <div className="space-y-2 p-3 bg-red-50 rounded-lg border border-red-100">
                              <p className="text-sm font-medium text-red-700">Từ chối</p>
                              <p className="text-2xl font-bold text-red-600">
                                {dashboardData.refund_stats.rejected_requests}
                              </p>
                            </div>
                            <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <p className="text-sm font-medium text-blue-700">Tổng tiền hoàn</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(dashboardData.refund_stats.total_refunded_amount)}
                              </p>
                            </div>
                          </div>
                          <div className="pt-4">
                            <p className="text-sm font-medium mb-2 text-gray-700">Tỷ lệ duyệt</p>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                                style={{
                                  width: `${(dashboardData.refund_stats.approved_requests / dashboardData.refund_stats.total_requests) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                              <span>0%</span>
                              <span>50%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}



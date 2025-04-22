import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Truck, Package, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrderDetail, changeOrderStatus, getOrderStatus } from '../../../services/order';

const OrderDetailAdmin = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Fetch order details
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const response = await getOrderDetail(id);
      return response.data;
    }
  });

  const { data: orderStatus = [] } = useQuery({
    queryKey: ['orderStatus'],
    queryFn: async () => await getOrderStatus()
});

  // Change status mutation
  const statusMutation = useMutation({
    mutationFn: ({ orderId, newStatusId }) => 
      changeOrderStatus(orderId, newStatusId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-order', id]);
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  });

  // Format price to VND
  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get status color
  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1: return 'bg-yellow-100 text-yellow-800'; // Chờ xác nhận
      case 2: return 'bg-blue-100 text-blue-800';     // Đã xác nhận
      case 3: return 'bg-purple-100 text-purple-800'; // Đang giao hàng
      case 4: return 'bg-green-100 text-green-800';   // Đã giao hàng
      case 5: return 'bg-green-100 text-green-800';   // Hoàn thành
      case 6: return 'bg-red-100 text-red-800';       // Đã hủy
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status change
  const handleStatusChange = (newStatusId) => {
    if (window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng?')) {
      statusMutation.mutate({ orderId: id, newStatusId: parseInt(newStatusId) });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-40 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-60 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Có lỗi xảy ra khi tải thông tin đơn hàng</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order?.order_code}</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Order Info */}
        <div className="col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="text-gray-500" size={20} />
              Thông tin đơn hàng
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Trạng thái đơn hàng</div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order?.status?.id)}`}>
                    {order?.status?.name}
                  </span>
                  {order?.status?.next_status && (
                    <select
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={statusMutation.isPending}
                      className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value=""
                    >
                      <option value="" disabled>Thay đổi trạng thái</option>
                      {JSON.parse(order.status.next_status).map(statusId => (
                        <option key={statusId} value={statusId}>
                          {statusId === 2 && 'Xác nhận đơn hàng'}
                          {statusId === 3 && 'Bắt đầu giao hàng'}
                          {statusId === 4 && 'Đã giao hàng'}
                          {statusId === 5 && 'Hoàn thành'}
                          {statusId === 6 && 'Đã hủy'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Thời gian đặt hàng</div>
                <div className="text-sm font-medium">{formatDate(order?.created_at)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Phương thức thanh toán</div>
                <div className="text-sm font-medium">
                  {order?.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán VNPay'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Trạng thái thanh toán</div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order?.payment_status?.id === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                  >
                    {order?.payment_status?.name}
                  </span>
                  {order?.payment_status?.next_status && (
                    <select
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={statusMutation.isPending}
                      className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value=""
                    >
                      <option value="" disabled>Thay đổi trạng thái</option>
                      {JSON.parse(order.payment_status.next_status).map(statusId => (
                        <option key={statusId} value={statusId}>
                          {statusId === 2 && 'Đã thanh toán'}
                          {statusId === 4 && 'Hoàn tiền'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="text-gray-500" size={20} />
              Thông tin giao hàng
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Người nhận</div>
                <div className="text-sm font-medium">{order?.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Số điện thoại</div>
                <div className="text-sm font-medium">{order?.phone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Email</div>
                <div className="text-sm font-medium">{order?.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Địa chỉ giao hàng</div>
                <div className="text-sm font-medium">{order?.address}</div>
              </div>
              {order?.note && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Ghi chú</div>
                  <div className="text-sm font-medium">{order.note}</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="text-gray-500" size={20} />
              Chi tiết thanh toán
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium">{formatPrice(order?.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-medium">{formatPrice(order?.shipping)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-medium">Tổng cộng</span>
                  <span className="text-lg font-bold text-blue-600">{formatPrice(order?.final_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="text-gray-500" size={20} />
              Lịch sử đơn hàng
            </h2>
            <div className="space-y-4">
              {order?.histories?.map((history) => (
                <div key={history.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                  <div>
                    <div className="text-sm font-medium">{history.status}</div>
                    <div className="text-xs text-gray-500">{formatDate(history.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailAdmin;

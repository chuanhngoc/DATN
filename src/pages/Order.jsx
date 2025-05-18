import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Eye, Filter, Search, X } from 'lucide-react';
import { getAdminOrders, getOrderStatus } from '../../services/order';
import { useState, useEffect } from 'react';

const Orders = () => {
	const [filters, setFilters] = useState({
		status_id: '',
		order_code: '',
		name: '',
		phone: ''
	});
	const [showFilters, setShowFilters] = useState(false);

	// Fetch order statuses
	const { data: orderStatuses = [] } = useQuery({
		queryKey: ['order-statuses'],
		queryFn: getOrderStatus
	});

	// Fetch orders with filters
	const { data: orders = [], isLoading, error } = useQuery({
		queryKey: ['orders', filters],
		queryFn: async () => await getAdminOrders(filters)
	});

	// Handle filter change
	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters(prev => ({ ...prev, [name]: value }));
	};

	// Clear all filters
	const clearFilters = () => {
		setFilters({
			status_id: '',
			order_code: '',
			name: '',
			phone: ''
		});
	};

	// Format price to VND
	const formatPrice = (price) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(price);
	};

	// Format date
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('vi-VN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
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

	// Get payment status color
	const getPaymentStatusColor = (statusId) => {
		switch (statusId) {
			case 1: return 'bg-yellow-100 text-yellow-800'; // Chưa thanh toán
			case 2: return 'bg-green-100 text-green-800';   // Đã thanh toán
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	// Get payment method text
	const getPaymentMethodText = (method) => {
		switch (method) {
			case 'cod': return 'Thanh toán khi nhận hàng';
			case 'vnpay': return 'Thanh toán VNPay';
			default: return method;
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="p-6">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
					<div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
					<div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
					<div className="h-10 bg-gray-200 rounded w-full"></div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="p-6">
				<div className="text-red-500">Có lỗi xảy ra khi tải danh sách đơn hàng</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
				
				<button 
					onClick={() => setShowFilters(!showFilters)}
					className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
				>
					<Filter size={20} />
					{showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
				</button>
			</div>

			{showFilters && (
				<div className="bg-white p-4 rounded-lg shadow mb-6">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Trạng thái đơn hàng
							</label>
							<select
								name="status_id"
								value={filters.status_id}
								onChange={handleFilterChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Tất cả trạng thái</option>
								{orderStatuses.map(status => (
									<option key={status.id} value={status.id}>
										{status.name}
									</option>
								))}
							</select>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Mã đơn hàng
							</label>
							<input
								type="text"
								name="order_code"
								value={filters.order_code}
								onChange={handleFilterChange}
								placeholder="Nhập mã đơn hàng"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Tên khách hàng
							</label>
							<input
								type="text"
								name="name"
								value={filters.name}
								onChange={handleFilterChange}
								placeholder="Nhập tên khách hàng"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Số điện thoại
							</label>
							<input
								type="text"
								name="phone"
								value={filters.phone}
								onChange={handleFilterChange}
								placeholder="Nhập số điện thoại"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					</div>
					
					<div className="flex justify-end mt-4">
						<button
							onClick={clearFilters}
							className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 mr-2"
						>
							<X size={18} />
							Xóa bộ lọc
						</button>
						
						
					</div>
				</div>
			)}

			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Mã đơn hàng
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Khách hàng
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Địa chỉ
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Tổng tiền
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Thanh toán
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Trạng thái
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Thao tác
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{orders?.data?.map((order) => (
							<tr key={order.id} className="hover:bg-gray-50">
								<td className="px-6 py-4">
									<div className="flex flex-col">
										<div className="text-sm font-medium text-gray-900">
											{order.order_code}
										</div>
										<div className="text-sm text-gray-500">
											{formatDate(order.created_at)}
										</div>
									</div>
								</td>
								<td className="px-6 py-4">
									<div className="flex flex-col">
										<div className="text-sm font-medium text-gray-900">{order.name}</div>
										<div className="text-sm text-gray-500">{order.phone}</div>
										<div className="text-sm text-gray-500">{order.email}</div>
									</div>
								</td>
								<td className="px-6 py-4">
									<div className="text-sm text-gray-900">{order.address}</div>
									{order.note && (
										<div className="text-sm text-gray-500 mt-1">
											Ghi chú: {order.note}
										</div>
									)}
								</td>
								<td className="px-6 py-4">
									<div className="flex flex-col">
										<div className="text-sm font-medium text-gray-900">
											{formatPrice(order.final_amount)}
										</div>
										<div className="text-xs text-gray-500">
											Ship: {formatPrice(order.shipping)}
										</div>
										{order.discount > 0 && (
											<div className="text-xs text-red-500">
												Giảm: {formatPrice(order.discount)}
											</div>
										)}
									</div>
								</td>
								<td className="px-6 py-4">
									<div className="flex flex-col gap-2">
										<span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.payment_status.id)}`}>
											{order.payment_status.name}
										</span>
										<span className="text-xs text-gray-500">
											{getPaymentMethodText(order.payment_method)}
										</span>
									</div>
								</td>
								<td className="px-6 py-4">
									<span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status.id)}`}>
										{order.status.name}
									</span>
									{order.cancel_reason && (
										<div className="text-xs text-red-500 mt-1">
											Lý do hủy: {order.cancel_reason}
										</div>
									)}
								</td>
								<td className="px-6 py-4 text-right">
									<Link
										to={`/admin/orders/${order.id}`}
										className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
									>
										<Eye size={20} />
									</Link>
								</td>
							</tr>
						))}

						{orders?.data?.length === 0 && (
							<tr>
								<td colSpan="7" className="px-6 py-4 text-center text-gray-500">
									Không tìm thấy đơn hàng nào
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Orders;

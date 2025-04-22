import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Eye, Filter } from 'lucide-react';
import { getAdminOrders } from '../../services/order';
import { useState } from 'react';

const Orders = () => {
	const [selectedStatus, setSelectedStatus] = useState('');

	// Fetch orders
	const { data: orders = [], isLoading, error } = useQuery({
		queryKey: ['orders', selectedStatus],
		queryFn: async () => await getAdminOrders()
	});

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
				<div className="flex items-center gap-2">
					<Filter size={20} className="text-gray-500" />
					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
						className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Tất cả trạng thái</option>
						<option value="1">Chờ xác nhận</option>
						<option value="2">Đã xác nhận</option>
						<option value="3">Đang giao hàng</option>
						<option value="4">Đã giao hàng</option>
						<option value="5">Hoàn thành</option>
						<option value="6">Đã hủy</option>
					</select>
				</div>
			</div>

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
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Orders;

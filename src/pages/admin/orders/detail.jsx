import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Truck, Package, DollarSign, Clock, CheckCircle, XCircle, Upload, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { changeOrderStatus, getOrderStatus, getOrderDetailAdmin, approveRefund, rejectRefund, markRefundAsRefunded, completeOrder } from '../../../services/order';
import { useRef, useState } from 'react';

const OrderDetailAdmin = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showRefundedModal, setShowRefundedModal] = useState(false);
	const [showCompleteConfirmModal, setShowCompleteConfirmModal] = useState(false);
	const [showRefundDetailsModal, setShowRefundDetailsModal] = useState(false);
	const [newStatusId, setNewStatusId] = useState('');
	const [cancelReason, setCancelReason] = useState('');
	const [rejectReason, setRejectReason] = useState('');
	const [refundProofImage, setRefundProofImage] = useState(null);
	const [previewImage, setPreviewImage] = useState('');
	const fileInputRef = useRef(null);
	// Fetch order details
	const { data: order, isLoading, error } = useQuery({
		queryKey: ['admin-order', id],
		queryFn: async () => {
			const response = await getOrderDetailAdmin(id);
			return response.data;
		}
	});

	const { data: orderStatus = [] } = useQuery({
		queryKey: ['orderStatus'],
		queryFn: async () => await getOrderStatus()
	});

	// Change status mutation
	const statusMutation = useMutation({
		mutationFn: ({ orderId, newStatusId, cancelReason }) =>
			changeOrderStatus(orderId, newStatusId, cancelReason),
		onSuccess: () => {
			queryClient.invalidateQueries(['admin-order', id]);
			toast.success('Cập nhật trạng thái đơn hàng thành công');
			handleCloseModal();
		},
		onError: (error) => {
			toast.error(error || 'Không thể cập nhật trạng thái đơn hàng');
		}
	});

	// Complete order mutation
	const completeMutation = useMutation({
		mutationFn: () => completeOrder(id),
		onSuccess: () => {
			queryClient.invalidateQueries(['admin-order', id]);
			toast.success('Đơn hàng đã được hoàn thành');
			handleCloseModal();
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Không thể hoàn thành đơn hàng');
		}
	});

	// Mark refunded mutation
	const markRefundedMutation = useMutation({
		mutationFn: () => markRefundAsRefunded(order?.refund?.id, refundProofImage),
		onSuccess: () => {
			queryClient.invalidateQueries(['admin-order', id]);
			toast.success('Đã cập nhật trạng thái hoàn tiền thành công');
			handleCloseModal();
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái hoàn tiền');
		}
	});

	// Approve refund mutation
	const approveRefundMutation = useMutation({
		mutationFn: () => approveRefund(order?.refund?.id),
		onSuccess: () => {
			queryClient.invalidateQueries(['admin-order', id]);
			toast.success('Đã đồng ý yêu cầu hoàn tiền');
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Không thể xử lý yêu cầu hoàn tiền');
		}
	});

	// Reject refund mutation
	const rejectRefundMutation = useMutation({
		mutationFn: (rejectReason) => rejectRefund(order?.refund?.id, rejectReason),
		onSuccess: () => {
			queryClient.invalidateQueries(['admin-order', id]);
			toast.success('Đã từ chối yêu cầu hoàn tiền');
			handleCloseModal();
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || 'Không thể xử lý yêu cầu hoàn tiền');
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
			case 7: return 'bg-orange-100 text-orange-800'; // Yêu cầu hoàn tiền
			case 8: return 'bg-green-100 text-green-800';   // Hoàn tiền thành công
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	// Handle opening status modal
	const handleOpenStatusModal = () => {
		setNewStatusId('');
		setShowStatusModal(true);
	};

	// Handle opening reject modal
	const handleOpenRejectModal = () => {
		setRejectReason('');
		setShowRejectModal(true);
	};

	// Handle closing modal
	const handleCloseModal = () => {
		setShowStatusModal(false);
		setShowCancelModal(false);
		setShowRejectModal(false);
		setShowRefundedModal(false);
		setShowCompleteConfirmModal(false);
		setShowRefundDetailsModal(false);
		setNewStatusId('');
		setCancelReason('');
		setRejectReason('');
		setRefundProofImage(null);
		setPreviewImage('');
	};

	// Handle status change
	const handleStatusChange = (e) => {
		e.preventDefault();
		if (!newStatusId) {
			toast.error('Vui lòng chọn trạng thái mới');
			return;
		}

		// If status is "Đã hủy" (6), show cancel reason modal
		if (parseInt(newStatusId) === 6) {
			setShowCancelModal(true);
			setShowStatusModal(false);
			return;
		}

		// Otherwise proceed with status change
		statusMutation.mutate({
			orderId: id,
			newStatusId: parseInt(newStatusId)
		});
	};

	// Handle cancel order
	const handleCancelOrder = (e) => {
		e.preventDefault();
		if (!cancelReason.trim()) {
			toast.error('Vui lòng nhập lý do hủy đơn hàng');
			return;
		}

		statusMutation.mutate({
			orderId: id,
			newStatusId: 6,
			cancelReason: cancelReason.trim()
		});
	};

	// Handle reject refund
	const handleRejectRefund = (e) => {
		e.preventDefault();
		if (!rejectReason.trim()) {
			toast.error('Vui lòng nhập lý do từ chối');
			return;
		}
		rejectRefundMutation.mutate(rejectReason.trim());
	};

	// Get available next statuses
	// const getNextStatuses = (currentStatus) => {
	//     if (!currentStatus?.next_status) return [];
	//     try {
	//         const nextStatusIds = JSON.parse(currentStatus.next_status);
	//         return orderStatus.filter(status => nextStatusIds.includes(status.id));
	//     } catch (error) {
	//         return [];
	//     }
	// };

	const handleOpenRefundedModal = () => {
		setShowRefundedModal(true);
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) { // 5MB
				toast.error('Kích thước file không được vượt quá 5MB');
				return;
			}
			if (!file.type.startsWith('image/')) {
				toast.error('Vui lòng chọn file ảnh');
				return;
			}
			setRefundProofImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleMarkRefunded = (e) => {
		e.preventDefault();
		if (!refundProofImage) {
			toast.error('Vui lòng chọn ảnh chứng minh hoàn tiền');
			return;
		}
		markRefundedMutation.mutate();
	};

	// Handle complete order
	const handleCompleteOrder = () => {
		completeMutation.mutate();
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
					<Link to="/admin/orders" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
						<ArrowLeft size={24} />
					</Link>
					<h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order?.order_code}</h1>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={handleOpenStatusModal}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
					>
						<Clock size={20} />
						Thay đổi trạng thái
					</button>

					{order?.refund !== null && (
						<button
							onClick={() => setShowRefundDetailsModal(true)}
							className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
						>
							<DollarSign size={20} />
							Xem chi tiết hoàn tiền
						</button>
					)}

					{order?.refund !== null && order?.refund?.status === 'approved' && (
						<button
							onClick={handleOpenRefundedModal}
							className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
						>
							<Upload size={20} />
							Hoàn tất hoàn tiền
						</button>
					)}
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
								<div className="text-sm text-gray-600 mb-1">Mã đơn hàng</div>
								<div className="text-sm font-medium">{order?.order_code}</div>
							</div>
							<div>
								<div className="text-sm text-gray-600 mb-1">Trạng thái đơn hàng</div>
								<div className="flex items-center gap-3">
									<span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order?.status?.id)}`}>
										{order?.status?.name}
									</span>
								</div>
							</div>
							<div>
								<div className="text-sm text-gray-600 mb-1">Thời gian đặt hàng</div>
								<div className="text-sm font-medium">{order?.created_at}</div>
							</div>
							<div>
								<div className="text-sm text-gray-600 mb-1">Thời gian cập nhật</div>
								<div className="text-sm font-medium">{order?.updated_at}</div>
							</div>
							<div>
								<div className="text-sm text-gray-600 mb-1">Phương thức thanh toán</div>
								<div className="text-sm font-medium">
									{order?.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán VNPay'}
								</div>
							</div>
							<div>
								<div className="text-sm text-gray-600 mb-1">Trạng thái thanh toán</div>
								<div className="text-sm font-medium">{order?.payment_status?.name}</div>
							</div>
							{order?.cancel_reason && (
								<div className="col-span-2">
									<div className="text-sm text-gray-600 mb-1">Lý do hủy đơn hàng</div>
									<div className="text-sm font-medium text-red-600 bg-red-50 rounded px-3 py-2 border border-red-200">{order.cancel_reason}</div>
								</div>
							)}
						</div>
					</div>

					{/* Order Items Section */}
					<div className="p-6 border-b">
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Package className="text-gray-500" size={20} />
							Sản phẩm đã đặt
						</h2>
						<div className="space-y-4">
							{order?.items?.map((item) => (
								<div key={item.id} className="flex gap-4 p-4 border rounded-lg">
									<div className="w-20 h-20 flex-shrink-0">
										<img
											src={`${import.meta.env.VITE_API_URL}/${item.image}`}
											alt={item.product_name}
											className="w-full h-full object-cover rounded-md"
										/>
									</div>
									<div className="flex-grow">
										<h3 className="font-medium text-gray-900">{item.product_name}</h3>
										<div className="mt-1 text-sm text-gray-500">
											{Object.entries(item.variation || {}).map(([key, value]) => (
												<div key={key}>
													{key}: <span className="font-medium">{value}</span>
												</div>
											))}
										</div>
										<div className="mt-2 flex items-center justify-between">
											<div className="text-sm text-gray-700">
												Số lượng: <span className="font-medium">{item.quantity}</span>
											</div>
											<div className="text-sm font-medium text-gray-900">
												{formatPrice(item.product_price)}
											</div>
										</div>
									</div>
								</div>
							))}
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
								<span className="text-gray-600">Giảm giá</span>
								<span className="font-medium">-{formatPrice(order?.discount_amount || 0)}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Phí vận chuyển</span>
								<span className="font-medium">+{formatPrice(order?.shipping)}</span>
							</div>
							<div className="border-t pt-3">
								<div className="flex justify-between">
									<span className="font-medium">Tổng cộng</span>
									<div className="text-right">
										<div className="text-lg font-bold text-blue-600">
											{formatPrice(Number(order?.final_amount || 0))}
										</div>
									</div>
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
										<div className="text-sm font-medium">
											Người thay đổi: {
												history.user_change === 'system'
													? 'Hệ Thống'
													: history.user_change
											}
										</div>
										<div className="text-xs text-gray-500">{history.created_at}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Status Change Modal */}
			{showStatusModal && (
				<div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h2 className="text-xl font-semibold mb-4">Thay đổi trạng thái đơn hàng</h2>
						<form onSubmit={handleStatusChange}>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Trạng thái hiện tại
								</label>
								<div className={`px-3 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(order?.status?.id)}`}>
									{order?.status?.name}
								</div>
							</div>
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Trạng thái mới
								</label>
								<select
									value={newStatusId}
									onChange={(e) => setNewStatusId(e.target.value)}
									className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								>
									<option value="">Chọn trạng thái</option>
									{orderStatus.map(status => (
										<option key={status.id} value={status.id}>
											{status.name}
										</option>
									))}
								</select>
							</div>
							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={handleCloseModal}
									className="px-4 py-2 text-gray-600 hover:text-gray-800"
								>
									Hủy
								</button>
								<button
									type="submit"
									disabled={statusMutation.isPending}
									className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
								>
									{statusMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Cancel Order Modal */}
			{showCancelModal && (
				<div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h2 className="text-xl font-semibold mb-4">Hủy đơn hàng</h2>
						<form onSubmit={handleCancelOrder}>
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Lý do hủy đơn hàng <span className="text-red-500">*</span>
								</label>
								<textarea
									value={cancelReason}
									onChange={(e) => setCancelReason(e.target.value)}
									className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
									placeholder="Vui lòng nhập lý do hủy đơn hàng..."
									required
								/>
							</div>
							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={handleCloseModal}
									className="px-4 py-2 text-gray-600 hover:text-gray-800"
								>
									Đóng
								</button>
								<button
									type="submit"
									disabled={statusMutation.isPending}
									className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
								>
									{statusMutation.isPending ? 'Đang xử lý...' : 'Xác nhận hủy đơn'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Reject Refund Modal */}
			{showRejectModal && (
				<div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h2 className="text-xl font-semibold mb-4">Từ chối yêu cầu hoàn tiền</h2>
						<form onSubmit={handleRejectRefund}>
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Lý do từ chối <span className="text-red-500">*</span>
								</label>
								<textarea
									value={rejectReason}
									onChange={(e) => setRejectReason(e.target.value)}
									className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
									placeholder="Vui lòng nhập lý do từ chối..."
									required
								/>
							</div>
							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={handleCloseModal}
									className="px-4 py-2 text-gray-600 hover:text-gray-800"
								>
									Đóng
								</button>
								<button
									type="submit"
									disabled={rejectRefundMutation.isPending}
									className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
								>
									{rejectRefundMutation.isPending ? 'Đang xử lý...' : 'Xác nhận từ chối'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{showRefundedModal && (
				<div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h2 className="text-xl font-semibold mb-4">Hoàn tất hoàn tiền</h2>
						<form onSubmit={handleMarkRefunded}>
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Ảnh chứng minh hoàn tiền <span className="text-red-500">*</span>
								</label>
								<div className="mt-2 flex flex-col items-center">
									<div
										onClick={() => fileInputRef.current?.click()}
										className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
									>
										{previewImage ? (
											<img
												src={previewImage}
												alt="Preview"
												className="h-full w-full object-contain"
											/>
										) : (
											<>
												<Upload size={24} className="text-gray-400" />
												<p className="mt-2 text-sm text-gray-500">Click để chọn ảnh</p>
											</>
										)}
									</div>
									<input
										type="file"
										ref={fileInputRef}
										onChange={handleFileChange}
										accept="image/*"
										className="hidden"
									/>
								</div>
							</div>
							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={handleCloseModal}
									className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
								>
									Đóng
								</button>
								<button
									type="submit"
									disabled={markRefundedMutation.isPending || !refundProofImage}
									className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
								>
									{markRefundedMutation.isPending ? 'Đang xử lý...' : 'Xác nhận hoàn tất'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Complete Order Confirmation Modal */}
			{showCompleteConfirmModal && (
				<div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h2 className="text-xl font-semibold mb-4">Xác nhận hoàn thành đơn hàng</h2>
						<p className="text-gray-600 mb-6">
							Bạn có chắc chắn muốn hoàn thành đơn hàng này? Hành động này không thể hoàn tác.
						</p>
						<div className="flex justify-end gap-3">
							<button
								onClick={handleCloseModal}
								className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
							>
								Hủy
							</button>
							<button
								onClick={handleCompleteOrder}
								disabled={completeMutation.isPending}
								className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
							>
								{completeMutation.isPending ? 'Đang xử lý...' : 'Xác nhận hoàn thành'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Refund Details Modal */}
			{showRefundDetailsModal && (
				<div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-semibold flex items-center gap-2">
								<DollarSign className="text-gray-500" size={24} />
								Chi tiết yêu cầu hoàn tiền
							</h2>
							<button
								onClick={() => setShowRefundDetailsModal(false)}
								className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
							>
								<XCircle size={24} />
							</button>
						</div>

						<div className="grid grid-cols-2 gap-6">
							{/* Left Column - Basic Information */}
							<div className="space-y-6">
								<div className="bg-gray-50 p-4 rounded-lg">
									<h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
									<div className="space-y-3">
										<div>
											<div className="text-sm text-gray-600">Loại hoàn tiền</div>
											<div className="font-medium">
												{order.refund.type === 'cancel_before_shipping' ? 'Hoàn tiền trước khi giao hàng' : 
												 order.refund.type === 'return_after_received' ? 'Hoàn tiền sau khi nhận hàng' : 
												 'Hoàn tiền trước khi nhận hàng'}
											</div>
										</div>
										<div>
											<div className="text-sm text-gray-600">Số tiền hoàn</div>
											<div className="font-medium text-green-600">{formatPrice(order.refund.amount)}</div>
										</div>
										<div>
											<div className="text-sm text-gray-600">Trạng thái</div>
											<div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${order.refund.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
													order.refund.status === 'approved' ? 'bg-green-100 text-green-800' :
														order.refund.status === 'rejected' ? 'bg-red-100 text-red-800' :
															'bg-blue-100 text-blue-800'
												}`}>
												{order.refund.status === 'pending' ? 'Đang chờ xử lý' :
													order.refund.status === 'approved' ? 'Đã phê duyệt' :
														order.refund.status === 'rejected' ? 'Đã từ chối' :
															'Đã hoàn tiền'}
											</div>
										</div>
										<div>
											<div className="text-sm text-gray-600">Thời gian yêu cầu</div>
											<div className="font-medium">{formatDate(order.refund.created_at)}</div>
										</div>
									</div>
								</div>

								<div className="bg-gray-50 p-4 rounded-lg">
									<h3 className="text-lg font-medium mb-4">Thông tin ngân hàng</h3>
									<div className="space-y-3">
										<div>
											<div className="text-sm text-gray-600">Ngân hàng</div>
											<div className="font-medium">{order.refund.bank_name}</div>
										</div>
										<div>
											<div className="text-sm text-gray-600">Chủ tài khoản</div>
											<div className="font-medium">{order.refund.bank_account_name}</div>
										</div>
										<div>
											<div className="text-sm text-gray-600">Số tài khoản</div>
											<div className="font-medium">{order.refund.bank_account_number}</div>
										</div>
									</div>
								</div>
							</div>

							{/* Right Column - Reason and Images */}
							<div className="space-y-6">
								<div className="bg-gray-50 p-4 rounded-lg">
									<h3 className="text-lg font-medium mb-4">Lý do hoàn tiền</h3>
									<div className="bg-white p-4 rounded-lg border">
										<p className="text-gray-700">{order.refund.reason}</p>
									</div>
								</div>

								<div className="bg-gray-50 p-4 rounded-lg">
									<h3 className="text-lg font-medium mb-4">Hình ảnh đính kèm</h3>
									<div className="grid grid-cols-2 gap-4">
										{order.refund.images?.map((image, index) => (
											<div key={index} className="relative aspect-square">
												<img
													src={`http://127.0.0.1:8000/storage/${image}`}
													alt={`Refund image ${index + 1}`}
													className="w-full h-full object-cover rounded-lg"
												/>
											</div>
										))}
									</div>
								</div>

								{order.refund.reject_reason && (
									<div className="bg-gray-50 p-4 rounded-lg">
										<h3 className="text-lg font-medium mb-4">Lý do từ chối</h3>
										<div className="bg-white p-4 rounded-lg border border-red-200">
											<p className="text-red-600">{order.refund.reject_reason}</p>
										</div>
									</div>
								)}

								{order.refund.proof_image_url && (
									<div className="bg-gray-50 p-4 rounded-lg">
										<h3 className="text-lg font-medium mb-4">Ảnh chứng minh hoàn tiền</h3>
										<div className="relative aspect-video">
											<img
												src={order.refund.proof_image_url}
												alt="Refund proof"
												className="w-full h-full object-cover rounded-lg"
											/>
										</div>
									</div>
								)}

								<div>
									<div className="text-sm text-gray-600 mb-1">Thời gian phê duyệt</div>
									<div className="text-sm font-medium">{order?.refund?.approved_at}</div>
								</div>
								<div>
									<div className="text-sm text-gray-600 mb-1">Thời gian hoàn tiền</div>
									<div className="text-sm font-medium">{order?.refund?.refunded_at}</div>
								</div>
							</div>
						</div>

						{order.refund.status === 'pending' && (
							<div className="mt-6 flex justify-end gap-3">
								<button
									onClick={() => {
										setShowRefundDetailsModal(false);
										handleOpenRejectModal();
									}}
									className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
								>
									Từ chối
								</button>
								<button
									onClick={() => {
										setShowRefundDetailsModal(false);
										approveRefundMutation.mutate();
									}}
									className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
								>
									Phê duyệt
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default OrderDetailAdmin;

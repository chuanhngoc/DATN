import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import couponService from '../../../services/coupons';

const CouponForm = ({ isEdit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [discountType, setDiscountType] = useState('percent');
  const [percentValue, setPercentValue] = useState('');
  const [amountValue, setAmountValue] = useState('');

  const { data: coupon, isLoading } = useQuery({
    queryKey: ['coupon', id],
    queryFn: () => couponService.getOne(id),
    enabled: isEdit,
    refetchOnMount: true,
    onSuccess: (data) => {
      if (data) {
        setDiscountType(data.type);
        setPercentValue(data.discount_percent || '');
        setAmountValue(data.amount || '');
      }
    }
  });

  useEffect(() => {
    if (coupon) {
      setDiscountType(coupon.type);
      setPercentValue(coupon.discount_percent || '');
      setAmountValue(coupon.amount || '');
    }
  }, [coupon]);

  // Function to format ISO date to YYYY-MM-DD
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
  };

  const createMutation = useMutation({
    mutationFn: couponService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Thêm mã giảm giá thành công');
      navigate('/admin/coupons');
    },
    onError: () => {
      toast.error('Thêm mã giảm giá thất bại');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => couponService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupon', id] });
      toast.success('Cập nhật mã giảm giá thành công');
      navigate('/admin/coupons');
    },
    onError: () => {
      toast.error('Cập nhật mã giảm giá thất bại');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const type = formData.get('type');
    
    const data = {
      code: formData.get('code'),
      name: formData.get('name'),
      description: formData.get('description'),
      type: type,
      discount_percent: type === 'percent' ? Number(percentValue) : null,
      amount: type === 'amount' ? Number(amountValue) : null,
      max_discount_amount: type === 'percent' ? Number(formData.get('max_discount_amount')) : null,
      min_product_price: Number(formData.get('min_product_price')),
      usage_limit: Number(formData.get('usage_limit')),
      start_date: formData.get('start_date'),
      expiry_date: formData.get('expiry_date'),
      is_active: formData.get('is_active') === 'true',
    };

    // Validate data before submission
    if (type === 'percent') {
      if (data.discount_percent < 1 || data.discount_percent > 100) {
        toast.error('Phần trăm giảm giá phải từ 1% đến 100%');
        return;
      }
      if (data.max_discount_amount < 1000) {
        toast.error('Giảm tối đa tối thiểu là 1000đ');
        return;
      }
    } else if (type === 'amount') {
      if (data.amount < 1000) {
        toast.error('Số tiền giảm giá tối thiểu là 1000đ');
        return;
      }
    }

    if (data.min_product_price < 0) {
      toast.error('Giá trị đơn hàng tối thiểu không được âm');
      return;
    }

    if (data.usage_limit < 0) {
      toast.error('Số lượt sử dụng không được nhỏ hơn 0');
      return;
    }

    if (isEdit) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEdit && (isLoading || !coupon)) {
    return <div className="p-6">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEdit ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <input type="hidden" name="id" defaultValue={coupon?.id} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã giảm giá
            </label>
            <input
              type="text"
              name="code"
              defaultValue={coupon?.code}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly={isEdit}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên
            </label>
            <input
              type="text"
              name="name"
              defaultValue={coupon?.name}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              defaultValue={coupon?.description}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại giảm giá
            </label>
            <select
              name="type"
              defaultValue={coupon?.type || 'percent'}
              required
              onChange={(e) => setDiscountType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="percent">Giảm theo phần trăm</option>
              <option value="amount">Giảm theo số tiền</option>
            </select>
          </div>

          {/* Input giảm giá: chỉ render 1 trong 2 input theo discountType */}
          {discountType === 'percent' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phần trăm giảm giá
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="discount_percent"
                  value={percentValue}
                  onChange={e => setPercentValue(e.target.value)}
                  required
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền giảm giá
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={amountValue}
                  onChange={e => setAmountValue(e.target.value)}
                  required
                  min="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">đ</span>
                </div>
              </div>
            </div>
          )}

          {discountType === 'percent' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giảm tối đa
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="max_discount_amount"
                  defaultValue={coupon?.max_discount_amount}
                  required
                  min="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">đ</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá trị đơn tối thiểu
            </label>
            <div className="relative">
              <input
                type="number"
                name="min_product_price"
                defaultValue={coupon?.min_product_price}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">đ</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới hạn sử dụng
            </label>
            <input
              type="number"
              name="usage_limit"
              defaultValue={coupon?.usage_limit}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian bắt đầu
            </label>
            <input
              type="date"
              name="start_date"
              defaultValue={formatDate(coupon?.start_date)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian kết thúc
            </label>
            <input
              type="date"
              name="expiry_date"
              defaultValue={formatDate(coupon?.expiry_date)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              name="is_active"
              defaultValue={coupon?.is_active?.toString() || 'true'}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Đang hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/coupons')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm; 
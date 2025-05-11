import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import couponService from '../../../services/coupons';

const CouponForm = ({ isEdit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [discountType, setDiscountType] = useState('percent');

  const { data: coupon, isLoading } = useQuery({
    queryKey: ['coupon', id],
    queryFn: () => couponService.getOne(id),
    enabled: isEdit,
    onSuccess: (data) => {
      if (data) {
        setDiscountType(data.type);
      }
    }
  });
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
    const data = {
      id: formData.get('id'),
      code: formData.get('code'),
      name: formData.get('name'),
      description: formData.get('description'),
      type: formData.get('type'),
      discount_percent: formData.get('type') === 'percent' ? Number(formData.get('discount_percent')) : null,
      amount: formData.get('type') === 'amount' ? Number(formData.get('amount')) : null,
      max_discount_amount: Number(formData.get('max_discount_amount')),
      min_product_price: Number(formData.get('min_product_price')),
      usage_limit: Number(formData.get('usage_limit')),
      start_date: formData.get('start_date'),
      expiry_date: formData.get('expiry_date'),
      is_active: formData.get('is_active') === 'true'
    };
    console.log(data);
    if (isEdit) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading && isEdit) {
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {discountType === 'percent' ? 'Phần trăm giảm giá' : 'Số tiền giảm giá'}
            </label>
            <div className="relative">
              <input
                type="number"
                name={discountType === 'percent' ? 'discount_percent' : 'amount'}
                defaultValue={discountType === 'percent' ? coupon?.discount_percent : coupon?.amount}
                required
                min="0"
                max={discountType === 'percent' ? "100" : undefined}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">
                  {discountType === 'percent' ? '%' : 'đ'}
                </span>
              </div>
            </div>
          </div>

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
                  min="0"
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
              min="1"
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
              defaultValue={coupon?.start_date}
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
              defaultValue={coupon?.expiry_date}
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
              <option value="false">Đã hết hạn</option>
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
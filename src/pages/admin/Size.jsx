import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import sizeService from '../../services/sizeService';
import { toast } from 'react-toastify';

const Size = () => {
  const queryClient = useQueryClient();

  // gọi api lấy danh sách kích thước
  const { data: sizes = [], isLoading, error } = useQuery({
    queryKey: ['sizes'],
    queryFn: async () => await sizeService.getAll()
  });

  // hàm xóa kích thước
  const deleteMutation = useMutation({
    mutationFn: sizeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      toast.success('Xóa kích thước thành công');
    },
    onError: () => {
      toast.error('Xóa kích thước thất bại');
    }
  });

  // hàm xử lý xóa
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kích thước này?')) {
      deleteMutation.mutate(id);
    }
  };

  // nếu đang loading thì hiển thị cái này
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

  // nếu có lỗi thì hiển thị cái này
  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Có lỗi xảy ra khi tải danh sách kích thước</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý kích thước</h1>
        <Link
          to="/admin/sizes/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm kích thước
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên kích thước
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sizes.map((size) => (
              <tr key={size.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{size.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/sizes/edit/${size.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(size.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Size;

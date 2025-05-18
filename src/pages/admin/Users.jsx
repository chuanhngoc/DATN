import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus, Eye, X, Filter, Search } from 'lucide-react';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import { useState } from 'react';


const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay nền tối */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Modal chính */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 z-50">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết người dùng</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Ảnh đại diện</div>
                <div className="mt-2">
                  {user.avatar ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${user.avatar}`}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">ID</div>
                <div className="mt-1 text-sm text-gray-900">{user.id}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">Tên</div>
                <div className="mt-1 text-sm text-gray-900">{user.name}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="mt-1 text-sm text-gray-900">{user.email}</div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Số điện thoại</div>
                <div className="mt-1 text-sm text-gray-900">{user.phone || 'Chưa cập nhật'}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">Địa chỉ</div>
                <div className="mt-1 text-sm text-gray-900">{user.address || 'Chưa cập nhật'}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">Vai trò</div>
                <div className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>

  );
};

const Users = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    is_active: '',
    search: ''
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Convert is_active to boolean if needed
    let convertedValue = value;
    if (name === 'is_active' && (value === '1' || value === '0')) {
      convertedValue = value === '1' ? true : false;
    }
    
    setFilters(prev => ({
      ...prev,
      [name]: convertedValue
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      role: '',
      is_active: '',
      search: ''
    });
  };

  // Apply search on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Search is automatically applied via React Query dependencies
    }
  };

  // gọi api lấy danh sách người dùng
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: async () => await userService.getAll(filters)
  });

  // hàm xóa người dùng
  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Xóa người dùng thành công');
    },
    onError: () => {
      toast.error('Xóa người dùng thất bại');
    }
  });

  // hàm xử lý xóa
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      deleteMutation.mutate(id);
    }
  };

  // nếu đang loading thì hiển thị skeleton
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

  // nếu có lỗi thì hiển thị thông báo
  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Có lỗi xảy ra khi tải danh sách người dùng</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
          >
            <Filter size={20} />
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
          <Link
            to="/admin/users/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={20} />
            Thêm người dùng
          </Link>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò
              </label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="user">Người dùng</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="is_active"
                value={filters.is_active === true ? '1' : filters.is_active === false ? '0' : ''}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">Đang hoạt động</option>
                <option value="0">Bị khóa</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Tìm tên hoặc email..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users?.data?.length > 0 ? (
              users.data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.avatar ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${user.avatar}`}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No img</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.is_active ? 'Đang hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                      >
                        <Eye size={20} />
                      </button>

                      {user.role !== 'admin' && (
                        <>
                          <Link
                            to={`/admin/users/edit/${user.id}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Edit2 size={20} />
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Users; 
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';

const Users = () => {
  // mảng chứa danh sách các người dùng
  const [users, setUsers] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'vana@example.com', role: 'admin' },
    { id: 2, name: 'Trần Thị B', email: 'thib@example.com', role: 'user' },
    { id: 3, name: 'Lê Văn C', email: 'vanc@example.com', role: 'user' }
  ]);

  // hàm xóa người dùng
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Link
          to="/admin/users/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm người dùng
        </Link>
      </div>

      {/* bảng hiển thị danh sách người dùng */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/users/${user.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-1"
                  >
                    <Edit2 size={18} />
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                  >
                    <Trash2 size={18} />
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users; 
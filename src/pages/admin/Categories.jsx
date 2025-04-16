import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';

const Categories = () => {
  // mảng chứa danh sách các danh mục
  const [categories, setCategories] = useState([
    { id: 1, name: 'Sneaker' },
    { id: 2, name: 'Thể thao' },
    { id: 3, name: 'Cao cấp' }
  ]);

  // hàm xóa danh mục
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <Link
          to="/admin/categories/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm danh mục
        </Link>
      </div>

      {/* bảng hiển thị danh sách danh mục */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên danh mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map(category => (
              <tr key={category.id}>
                <td className="px-6 py-4">{category.id}</td>
                <td className="px-6 py-4">{category.name}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/categories/${category.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-1"
                  >
                    <Edit2 size={18} />
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
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

export default Categories;
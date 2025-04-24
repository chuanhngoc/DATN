import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { profile, updateProfile, updatePW } from "../services/client/user";

const Profile = () => {
    // State quản lý hiển thị form chỉnh sửa profile và đổi mật khẩu
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    // State lưu file avatar đã chọn
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    // Ref dùng để trigger input file (nếu muốn click từ nút ngoài)
    const fileInputRef = useRef(null);

    // React Query client để thao tác invalidate cache sau mutation
    const queryClient = useQueryClient();

    // Lấy dữ liệu user hiện tại từ API
    const { data, isLoading } = useQuery({
        queryKey: ['userId'], // định danh cache
        queryFn: () => profile(), // gọi API profile
    });

    // Mutation cập nhật thông tin user
    const updateProfileMutation = useMutation({
        mutationFn: updateProfile, // gọi API cập nhật
        onSuccess: () => {
            queryClient.invalidateQueries(['userId']); // refetch lại user sau cập nhật
            setIsEditProfileOpen(false); // đóng form chỉnh sửa
            setSelectedAvatar(null); // reset avatar
        },
    });

    // Mutation đổi mật khẩu
    const updatePasswordMutation = useMutation({
        mutationFn: updatePW, // gọi API đổi mật khẩu
        onSuccess: () => {
            setIsChangePasswordOpen(false); // đóng form đổi mật khẩu
        },
        onError: (error) => {
            console.error('Password change failed:', error); // log lỗi nếu có
        }
    });

    // Gửi form cập nhật thông tin người dùng
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        // Tạo formData để gửi dạng multipart/form-data
        const formData = new FormData();
        formData.append('name', e.target.name.value);
        formData.append('phone', e.target.phone.value);
        formData.append('address', e.target.address.value);
        formData.append('_method', "PUT"); // hỗ trợ method spoofing cho Laravel nếu dùng POST

        if (selectedAvatar) {
            formData.append('avatar', selectedAvatar); // thêm avatar nếu có
        }

        // Gửi mutation cập nhật
        await updateProfileMutation.mutateAsync(formData);
    };

    // Gửi form đổi mật khẩu
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Thu thập dữ liệu form
        const passwordData = {
            current_password: e.target.current_password.value,
            new_password: e.target.new_password.value,
            new_password_confirmation: e.target.new_password_confirmation.value,
        };

        // Kiểm tra xác nhận mật khẩu
        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            alert('Mật khẩu mới không khớp!');
            return;
        }

        try {
            // Gửi mutation đổi mật khẩu
            await updatePasswordMutation.mutateAsync(passwordData);
            e.target.reset(); // reset form nếu thành công
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    // Khi chọn avatar mới, lưu vào state
    const handleAvatarChange = (e) => {
        if (e.target.files?.[0]) {
            setSelectedAvatar(e.target.files[0]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-6">
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                {data?.avatar ? (
                                    <img
                                        src={`http://127.0.0.1:8000/storage/${data.avatar}`}
                                        alt="Profile"
                                        className="h-24 w-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl text-gray-400">
                                        {data?.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{data?.name}</h1>
                                <p className="text-sm text-gray-500 capitalize">{data?.role}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={() => setIsEditProfileOpen(true)}
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Sửa thông tin
                            </button>
                            <button
                                onClick={() => setIsChangePasswordOpen(true)}
                                className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="mt-1 text-gray-900">{data?.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                                <p className="mt-1 text-gray-900">{data?.phone}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                                <p className="mt-1 text-gray-900">{data?.address}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Trạng thái tài khoản</label>
                                <p className="mt-1">
                                    <span className={`px-2 py-1 text-sm rounded-full ${data?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {data?.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Ngày tham gia</label>
                                <p className="mt-1 text-gray-900">
                                    {new Date(data?.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            {data?.inactive_reason && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Lý do không hoạt động</label>
                                    <p className="mt-1 text-gray-900">{data.inactive_reason}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditProfileOpen && (
                <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">Sửa thông tin</h2>
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                                    >
                                        Chọn ảnh
                                    </button>
                                    {selectedAvatar && (
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={URL.createObjectURL(selectedAvatar)}
                                                alt="Preview"
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                            <span className="text-sm text-gray-500">{selectedAvatar.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={data?.name}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={data?.phone}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    defaultValue={data?.address}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditProfileOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {isChangePasswordOpen && (
                <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Đổi mật khẩu</h2>
                            <button
                                onClick={() => setIsChangePasswordOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    required
                                    minLength={6}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    required
                                    minLength={6}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="new_password_confirmation"
                                    required
                                    minLength={6}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsChangePasswordOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={updatePasswordMutation.isLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updatePasswordMutation.isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
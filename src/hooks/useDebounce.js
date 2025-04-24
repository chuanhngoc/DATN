import { useState, useEffect } from 'react';

// Custom hook để delay việc gọi API khi người dùng gõ tìm kiếm
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Tạo một timeout để delay việc cập nhật giá trị
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function để clear timeout khi component unmount hoặc value thay đổi
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce; 
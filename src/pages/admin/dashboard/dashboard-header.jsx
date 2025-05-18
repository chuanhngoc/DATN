import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, ChevronDown, RefreshCw, Download } from 'lucide-react';

export const DashboardHeader = ({ title, dateRange, setDateRange, onRefresh, onExport }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center justify-between gap-2 px-3 py-2 border rounded-md text-sm w-full sm:w-[280px] bg-white hover:border-blue-400 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>
                {format(dateRange.startDate, "dd/MM/yyyy", { locale: vi })} -{" "}
                {format(dateRange.endDate, "dd/MM/yyyy", { locale: vi })}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {showDatePicker && (
            <div className="absolute top-full left-0 mt-1 p-4 bg-white border rounded-md shadow-lg z-10 w-[300px]">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                    <input
                      type="date"
                      value={format(dateRange.startDate, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setDateRange((prev) => ({ ...prev, startDate: date }));
                      }}
                      className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                    <input
                      type="date"
                      value={format(dateRange.endDate, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setDateRange((prev) => ({ ...prev, endDate: date }));
                      }}
                      className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-md text-sm hover:from-blue-700 hover:to-indigo-600 transition-all shadow-sm"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <button 
          onClick={onRefresh} 
          className="p-2 border rounded-md hover:bg-gray-50 bg-white hover:border-blue-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <RefreshCw className="h-4 w-4 text-blue-500" />
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Xuất báo cáo</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader; 
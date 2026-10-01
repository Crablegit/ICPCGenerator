'use client';

import React from 'react';
import { X, Sparkles, Printer, Github, Cpu, ShieldCheck } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Zero-Cost PDF Compilation Guide (Không Cần Thuê Máy Ảo)
            </h3>
            <p className="text-xs text-slate-400">
              Giải pháp biên dịch LaTeX ra file PDF chuẩn ACM-ICPC hoàn toàn miễn phí 100%.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Method 1: Overleaf */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Cách 1: Nút &quot;Open in Overleaf&quot; (Tiện lợi nhất - Khuyên dùng)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Bạn chỉ cần bấm nút xanh <strong>&quot;Open in Overleaf&quot;</strong> trên thanh công cụ. Ứng dụng sẽ tự động chuyển toàn bộ mã nguồn LaTeX sang Overleaf qua API chính thức. Overleaf cung cấp môi trường TeX Live đầy đủ miễn phí, biên dịch ra PDF ngay lập tức để tải về mà không tốn bất kỳ chi phí máy chủ nào.
            </p>
          </div>

          {/* Method 2: Browser Print */}
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm mb-1.5">
              <Printer className="h-4 w-4" />
              <span>Cách 2: Tính năng Print / Save as PDF trực tiếp trên trình duyệt</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Nhấn nút <strong>Print / PDF</strong> hoặc phím tắt <kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-200">Ctrl + P</kbd>. Trang in đã được định dạng chuẩn A4 Landscape 3 cột, có header, footer, số trang và mục lục y hệt như bản xuất từ LaTeX. Chọn <em>Destination: Save as PDF</em> để lưu file PDF về máy ngay lập tức.
            </p>
          </div>

          {/* Method 3: GitHub Actions */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm mb-1.5">
              <Github className="h-4 w-4" />
              <span>Cách 3: Tự động biên dịch bằng GitHub Actions (Miễn phí 2.000 phút/tháng)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Khi tải file <strong>.ZIP</strong> từ ứng dụng, bên trong đã tích hợp sẵn file cấu hình CI/CD <code className="text-purple-300">.github/workflows/build-notebook.yml</code>. Bạn chỉ cần đẩy thư mục này lên GitHub repo của team, mỗi khi push code lên thì GitHub Actions sẽ tự chạy lệnh <code className="text-slate-200">pdflatex</code> và tạo ra file <code className="text-slate-200">notebook.pdf</code> trong mục Artifacts để cả đội cùng tải.
            </p>
          </div>

          {/* Method 4: Local Compilation */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
            <div className="flex items-center space-x-2 text-slate-200 font-bold text-sm mb-1.5">
              <Cpu className="h-4 w-4 text-amber-400" />
              <span>Cách 4: Chạy file script trên máy tính cá nhân</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Nếu máy bạn đã cài MiKTeX hoặc TeX Live:
            </p>
            <ul className="list-disc list-inside mt-2 text-slate-400 space-y-1">
              <li><strong>Windows:</strong> Chỉ cần click đúp vào file <code className="text-slate-200">compile.bat</code> có sẵn trong file ZIP.</li>
              <li><strong>Linux / MacOS:</strong> Mở Terminal và chạy <code className="text-slate-200">./compile.sh</code>.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition shadow-md"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Copy, Download } from 'lucide-react';

const CodeViewer = ({ code }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert('코드가 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <h3 className="text-white font-semibold">생성된 Python 코드</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
            title="코드 복사"
          >
            <Copy size={16} />
            복사
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
            title="코드 다운로드"
          >
            <Download size={16} />
            다운로드
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm">
          <code className="text-green-400 font-mono">
            {code}
          </code>
        </pre>
      </div>
      
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <span>라인: {code.split('\n').length}</span>
        <span className="ml-4">문자: {code.length}</span>
      </div>
    </div>
  );
};

export default CodeViewer;

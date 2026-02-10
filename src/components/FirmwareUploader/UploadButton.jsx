import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Loader } from 'lucide-react';

/**
 * UploadButton 컴포넌트
 * 
 * 펌웨어 업로드 버튼 및 진행 상태 표시
 * 
 * Props:
 * - code: 업로드할 코드
 * - isConnected: 보드 연결 상태
 * - firmwareUploader: FirmwareUploader 인스턴스
 * - boardType: 보드 타입 (ESP32/Arduino/RP2040)
 */
const UploadButton = ({ code, isConnected, firmwareUploader, boardType }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ message: '', percent: 0 });
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // 업로드 핸들러
  const handleUpload = async () => {
    if (!isConnected) {
      alert('먼저 보드를 연결하세요!');
      return;
    }

    if (!code || code.trim().length === 0) {
      alert('업로드할 코드가 없습니다!');
      return;
    }

    setIsUploading(true);
    setStatus('uploading');
    setErrorMessage('');

    // 콜백 설정
    firmwareUploader.setProgressCallback((progressData) => {
      setProgress(progressData);
    });

    firmwareUploader.setCompleteCallback(() => {
      setStatus('success');
      setIsUploading(false);
      
      // 3초 후 상태 리셋
      setTimeout(() => {
        setStatus('idle');
        setProgress({ message: '', percent: 0 });
      }, 3000);
    });

    firmwareUploader.setErrorCallback((error) => {
      setStatus('error');
      setErrorMessage(error.message);
      setIsUploading(false);
      
      // 5초 후 상태 리셋
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    });

    // 업로드 실행
    try {
      if (boardType === 'ESP32' || boardType === 'RP2040') {
        await firmwareUploader.uploadMicroPython(code);
      } else if (boardType === 'Arduino') {
        // Arduino는 컴파일이 필요하므로 현재는 MicroPython 방식 사용
        alert('Arduino 직접 업로드는 준비 중입니다.\n대신 코드를 복사하여 Arduino IDE에서 업로드하세요.');
        setIsUploading(false);
        setStatus('idle');
      }
    } catch (error) {
      // 에러는 콜백에서 처리됨
      console.error('업로드 에러:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 업로드 버튼 */}
      <button
        onClick={handleUpload}
        disabled={!isConnected || isUploading}
        className={`
          flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition
          ${status === 'success' 
            ? 'bg-green-600 hover:bg-green-700' 
            : status === 'error'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-blue-600 hover:bg-blue-700'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {status === 'uploading' && <Loader size={20} className="animate-spin" />}
        {status === 'success' && <Check size={20} />}
        {status === 'error' && <AlertCircle size={20} />}
        {status === 'idle' && <Upload size={20} />}
        
        {status === 'uploading' && '업로드 중...'}
        {status === 'success' && '업로드 완료!'}
        {status === 'error' && '업로드 실패'}
        {status === 'idle' && '보드에 업로드'}
      </button>

      {/* 진행 상태 */}
      {isUploading && (
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">{progress.message}</span>
            <span className="text-sm font-semibold text-blue-600">
              {progress.percent}%
            </span>
          </div>
          
          {/* 진행 바 */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* 성공 메시지 */}
      {status === 'success' && !isUploading && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          <Check size={16} />
          <span>코드가 성공적으로 업로드되었습니다!</span>
        </div>
      )}

      {/* 에러 메시지 */}
      {status === 'error' && !isUploading && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 도움말 */}
      {!isConnected && (
        <div className="text-xs text-gray-500 text-center">
          업로드하려면 먼저 보드를 연결하세요
        </div>
      )}
    </div>
  );
};

export default UploadButton;

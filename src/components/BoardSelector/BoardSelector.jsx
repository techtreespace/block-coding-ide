import React, { useState, useEffect } from 'react';
import { Usb, UsbOff, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * BoardSelector 컴포넌트
 * 
 * 보드 선택 및 연결/해제 UI
 * 
 * Props:
 * - serialManager: SerialManager 인스턴스
 * - onConnectionChange: 연결 상태 변경 콜백
 */
const BoardSelector = ({ serialManager, onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [boardType, setBoardType] = useState('ESP32');
  const [error, setError] = useState(null);
  const [portInfo, setPortInfo] = useState(null);

  // Web Serial API 지원 확인
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!serialManager.constructor.isSupported()) {
      setIsSupported(false);
      setError('Web Serial API를 지원하지 않는 브라우저입니다. Chrome 또는 Edge를 사용하세요.');
    }
  }, [serialManager]);

  // 연결 핸들러
  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      // 보드 타입별 기본 baudrate
      const baudRates = {
        'ESP32': 115200,
        'Arduino': 115200,
        'RP2040': 115200
      };

      await serialManager.connect({
        baudRate: baudRates[boardType]
      });

      setIsConnected(true);
      
      // 보드 정보 가져오기
      const info = serialManager.getPortInfo();
      setPortInfo(info);

      if (onConnectionChange) {
        onConnectionChange(true, info);
      }

    } catch (err) {
      setError(err.message);
      setIsConnected(false);
      
      if (onConnectionChange) {
        onConnectionChange(false, null);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // 연결 해제 핸들러
  const handleDisconnect = async () => {
    try {
      await serialManager.disconnect();
      setIsConnected(false);
      setPortInfo(null);
      
      if (onConnectionChange) {
        onConnectionChange(false, null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
      {/* 보드 타입 선택 */}
      <select
        value={boardType}
        onChange={(e) => setBoardType(e.target.value)}
        disabled={isConnected || !isSupported}
        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="ESP32">ESP32</option>
        <option value="Arduino">Arduino</option>
        <option value="RP2040">RP2040</option>
      </select>

      {/* 연결 상태 표시 */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">
                연결됨
              </span>
            </div>
            {portInfo && (
              <span className="text-xs text-gray-500">
                ({portInfo.boardType})
              </span>
            )}
          </>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
            <span className="text-sm text-gray-600">연결 안됨</span>
          </div>
        )}
      </div>

      {/* 연결/해제 버튼 */}
      {isConnected ? (
        <button
          onClick={handleDisconnect}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition disabled:opacity-50"
        >
          <UsbOff size={16} />
          연결 해제
        </button>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting || !isSupported}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Usb size={16} />
          {isConnecting ? '연결 중...' : '연결'}
        </button>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* 지원 안내 */}
      {!isSupported && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
          <AlertCircle size={14} />
          <span>Chrome/Edge 브라우저를 사용하세요</span>
        </div>
      )}
    </div>
  );
};

export default BoardSelector;

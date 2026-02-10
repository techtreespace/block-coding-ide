import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Download, Copy } from 'lucide-react';

/**
 * SerialMonitor 컴포넌트
 * 
 * 시리얼 데이터 송수신 및 표시
 * 
 * Props:
 * - serialManager: SerialManager 인스턴스
 * - isConnected: 연결 상태
 * - maxLines: 최대 표시 라인 수 (기본: 500)
 */
const SerialMonitor = ({ serialManager, isConnected, maxLines = 500 }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const outputRef = useRef(null);

  // 자동 스크롤
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // 시리얼 데이터 수신 리스너 등록
  useEffect(() => {
    if (serialManager) {
      serialManager.onReceive((data) => {
        const timestamp = new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        setMessages(prev => {
          const newMessages = [
            ...prev,
            { type: 'receive', text: data, timestamp }
          ];
          
          // 최대 라인 수 제한
          if (newMessages.length > maxLines) {
            return newMessages.slice(-maxLines);
          }
          
          return newMessages;
        });
      });

      serialManager.onError((error) => {
        const timestamp = new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        setMessages(prev => [
          ...prev,
          { type: 'error', text: `오류: ${error.message}`, timestamp }
        ]);
      });
    }
  }, [serialManager, maxLines]);

  // 전송 핸들러
  const handleSend = async () => {
    if (!inputText.trim() || !isConnected) return;

    try {
      await serialManager.send(inputText + '\n');
      
      const timestamp = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      setMessages(prev => [
        ...prev,
        { type: 'send', text: inputText, timestamp }
      ]);

      setInputText('');
    } catch (error) {
      console.error('전송 실패:', error);
    }
  };

  // Enter 키 전송
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 클리어
  const handleClear = () => {
    setMessages([]);
  };

  // 복사
  const handleCopy = async () => {
    const text = messages.map(msg => `[${msg.timestamp}] ${msg.text}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  // 다운로드
  const handleDownload = () => {
    const text = messages.map(msg => `[${msg.timestamp}] ${msg.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serial-log-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 스크롤 이벤트
  const handleScroll = () => {
    if (outputRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = outputRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">시리얼 모니터</h3>
          <span className="text-xs text-gray-400">
            ({messages.length} 메시지)
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={messages.length === 0}
            className="p-1.5 hover:bg-gray-700 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="복사"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={handleDownload}
            disabled={messages.length === 0}
            className="p-1.5 hover:bg-gray-700 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="다운로드"
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleClear}
            disabled={messages.length === 0}
            className="p-1.5 hover:bg-gray-700 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="클리어"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* 출력 영역 */}
      <div 
        ref={outputRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 font-mono text-sm"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-8">
            {isConnected 
              ? '수신 대기 중...'
              : '보드를 연결하세요'
            }
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-1 flex gap-2">
              <span className="text-gray-500 text-xs">
                [{msg.timestamp}]
              </span>
              {msg.type === 'receive' && (
                <span className="text-green-400">📥 {msg.text}</span>
              )}
              {msg.type === 'send' && (
                <span className="text-blue-400">📤 {msg.text}</span>
              )}
              {msg.type === 'error' && (
                <span className="text-red-400">⚠️ {msg.text}</span>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 자동 스크롤 표시 */}
      {!autoScroll && (
        <div className="px-4 py-1 bg-yellow-900/20 border-t border-yellow-900/50 text-xs text-yellow-300">
          ⚠️ 자동 스크롤이 비활성화되었습니다. 맨 아래로 스크롤하면 다시 활성화됩니다.
        </div>
      )}

      {/* 입력 영역 */}
      <div className="flex gap-2 p-3 bg-gray-800 border-t border-gray-700">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          placeholder={isConnected ? "메시지 입력... (Enter로 전송)" : "연결 후 사용 가능"}
          className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!isConnected || !inputText.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          전송
        </button>
      </div>

      {/* 하단 상태바 */}
      <div className="px-4 py-1.5 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 flex justify-between">
        <span>
          {isConnected ? '✅ 연결됨' : '❌ 연결 안됨'}
        </span>
        <span>
          Baudrate: 115200
        </span>
      </div>
    </div>
  );
};

export default SerialMonitor;

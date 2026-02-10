import React, { useState, useRef, useEffect } from 'react';
import BlockEditor from './components/BlockEditor/BlockEditor';
import CodeViewer from './components/CodeViewer/CodeViewer';
import BoardSelector from './components/BoardSelector/BoardSelector';
import SerialMonitor from './components/SerialMonitor/SerialMonitor';
import UploadButton from './components/FirmwareUploader/UploadButton';
import SerialManager from './lib/SerialManager';
import FirmwareUploader from './lib/FirmwareUploader';
import { Cpu, Github, BookOpen } from 'lucide-react';

function App() {
  // 코드 상태
  const [generatedCode, setGeneratedCode] = useState('');
  
  // 시리얼 통신 (DAY 2)
  const serialManagerRef = useRef(new SerialManager());
  const [isConnected, setIsConnected] = useState(false);
  const [boardType, setBoardType] = useState('ESP32');
  const [boardInfo, setBoardInfo] = useState(null);
  
  // 펌웨어 업로더 (DAY 3)
  const firmwareUploaderRef = useRef(null);
  
  // FirmwareUploader 초기화
  useEffect(() => {
    firmwareUploaderRef.current = new FirmwareUploader(
      serialManagerRef.current
    );
  }, []);

  const handleCodeChange = (code) => {
    setGeneratedCode(code);
  };

  const handleConnectionChange = (connected, info) => {
    setIsConnected(connected);
    setBoardInfo(info);
    
    // 보드 타입 자동 인식
    if (info?.boardType) {
      if (info.boardType.includes('ESP32')) setBoardType('ESP32');
      else if (info.boardType.includes('Arduino')) setBoardType('Arduino');
      else if (info.boardType.includes('Pico')) setBoardType('RP2040');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu size={32} className="text-white" />
              <div>
                <h1 className="text-2xl font-bold">BlockIDE</h1>
                <p className="text-xs text-blue-100">블록 코딩으로 IoT 프로젝트 만들기</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  v1.0 Full
                </span>
              </div>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-200 transition"
              >
                <Github size={24} />
              </a>
              <a 
                href="#" 
                className="hover:text-blue-200 transition"
              >
                <BookOpen size={24} />
              </a>
            </div>
          </div>

          {/* 보드 연결 + 업로드 */}
          <div className="mt-3 flex items-center gap-3">
            <BoardSelector 
              serialManager={serialManagerRef.current}
              onConnectionChange={handleConnectionChange}
            />
            
            {isConnected && (
              <UploadButton 
                code={generatedCode}
                isConnected={isConnected}
                firmwareUploader={firmwareUploaderRef.current}
                boardType={boardType}
              />
            )}
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 상단: 블록 + 코드 */}
        <div className="flex-1 flex gap-4 p-4 pb-2">
          {/* 블록 에디터 */}
          <div className="w-1/2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-700">블록 작업 공간</h2>
              <p className="text-xs text-gray-500">블록을 드래그하여 프로그램을 만드세요</p>
            </div>
            <div className="h-[calc(100%-3rem)]">
              <BlockEditor onCodeChange={handleCodeChange} />
            </div>
          </div>

          {/* 코드 뷰어 */}
          <div className="w-1/2 bg-white rounded-lg shadow-lg overflow-hidden">
            <CodeViewer code={generatedCode} />
          </div>
        </div>

        {/* 하단: 시리얼 모니터 */}
        <div className="h-64 p-4 pt-2">
          <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
            <SerialMonitor 
              serialManager={serialManagerRef.current}
              isConnected={isConnected}
              maxLines={500}
            />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-2 px-4 text-center text-sm">
        <p>
          <strong>지원 보드:</strong> ESP32, Arduino, RP2040 | 
          <strong className="ml-3">언어:</strong> MicroPython | 
          <strong className="ml-3">버전:</strong> 1.0.0 (DAY 1+2+3 통합)
        </p>
      </footer>
    </div>
  );
}

export default App;

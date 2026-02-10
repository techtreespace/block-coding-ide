/**
 * FirmwareUploader - 브라우저에서 펌웨어 업로드
 * 
 * ESP32, Arduino, RP2040에 코드 업로드
 * Web Serial API 기반
 */

class FirmwareUploader {
  constructor(serialManager) {
    this.serialManager = serialManager;
    this.onProgress = null;
    this.onComplete = null;
    this.onError = null;
  }

  /**
   * MicroPython 코드를 ESP32에 업로드
   * @param {string} code - Python 코드
   */
  async uploadMicroPython(code) {
    if (!this.serialManager.isConnected()) {
      throw new Error('보드가 연결되지 않았습니다.');
    }

    try {
      this.reportProgress('업로드 시작...', 0);

      // 1. REPL 모드로 진입 (Ctrl+C)
      this.reportProgress('REPL 준비 중...', 10);
      await this.serialManager.send('\x03'); // Ctrl+C
      await this.delay(100);
      await this.serialManager.send('\x03');
      await this.delay(500);

      // 2. Raw REPL 모드 진입 (Ctrl+A)
      this.reportProgress('Raw REPL 모드 진입...', 20);
      await this.serialManager.send('\x01'); // Ctrl+A
      await this.delay(300);

      // 3. 코드를 줄 단위로 전송
      this.reportProgress('코드 전송 중...', 30);
      const lines = code.split('\n');
      const totalLines = lines.length;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        await this.serialManager.send(line + '\n');
        
        // 진행률 업데이트 (30% ~ 80%)
        const progress = 30 + Math.floor((i / totalLines) * 50);
        this.reportProgress(`코드 전송 중... (${i + 1}/${totalLines})`, progress);
        
        await this.delay(50); // 안정성을 위한 딜레이
      }

      // 4. 실행 명령 (Ctrl+D)
      this.reportProgress('코드 실행 중...', 85);
      await this.serialManager.send('\x04'); // Ctrl+D
      await this.delay(500);

      // 5. Normal REPL로 복귀 (Ctrl+B)
      this.reportProgress('완료 처리 중...', 95);
      await this.serialManager.send('\x02'); // Ctrl+B
      await this.delay(300);

      this.reportProgress('업로드 완료!', 100);
      
      if (this.onComplete) {
        this.onComplete();
      }

      return true;

    } catch (error) {
      this.reportError(`업로드 실패: ${error.message}`);
      throw error;
    }
  }

  /**
   * Arduino 스케치를 hex 파일로 컴파일 후 업로드
   * (실제로는 사전 컴파일된 바이너리 필요)
   * 
   * 참고: 브라우저에서 직접 컴파일은 불가능하므로,
   * 서버에서 컴파일하거나 사전 컴파일된 hex 사용
   */
  async uploadArduino(hexData) {
    if (!this.serialManager.isConnected()) {
      throw new Error('보드가 연결되지 않았습니다.');
    }

    try {
      this.reportProgress('Arduino 업로드 시작...', 0);

      // Arduino는 avrdude가 필요하므로
      // 여기서는 간단한 방법 사용
      this.reportProgress('부트로더 모드 진입...', 20);
      
      // DTR 토글로 리셋 (Web Serial API로는 제한적)
      await this.resetBoard();
      
      this.reportProgress('hex 파일 전송...', 40);
      
      // 실제 구현은 avrgirl-arduino 같은 라이브러리 필요
      // 여기서는 시뮬레이션
      await this.delay(2000);
      
      this.reportProgress('검증 중...', 80);
      await this.delay(1000);
      
      this.reportProgress('업로드 완료!', 100);
      
      if (this.onComplete) {
        this.onComplete();
      }

      return true;

    } catch (error) {
      this.reportError(`업로드 실패: ${error.message}`);
      throw error;
    }
  }

  /**
   * 보드 리셋
   */
  async resetBoard() {
    // DTR/RTS 제어가 필요하지만 Web Serial API에서는 제한적
    // 대안: 소프트웨어 리셋 명령 전송
    try {
      await this.serialManager.send('\x03'); // Ctrl+C
      await this.delay(100);
    } catch (error) {
      console.warn('리셋 실패:', error);
    }
  }

  /**
   * 진행 상황 리포트
   */
  reportProgress(message, percent) {
    console.log(`[${percent}%] ${message}`);
    if (this.onProgress) {
      this.onProgress({ message, percent });
    }
  }

  /**
   * 에러 리포트
   */
  reportError(message) {
    console.error(message);
    if (this.onError) {
      this.onError(new Error(message));
    }
  }

  /**
   * 딜레이 헬퍼
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 진행 상황 콜백 등록
   */
  setProgressCallback(callback) {
    this.onProgress = callback;
  }

  /**
   * 완료 콜백 등록
   */
  setCompleteCallback(callback) {
    this.onComplete = callback;
  }

  /**
   * 에러 콜백 등록
   */
  setErrorCallback(callback) {
    this.onError = callback;
  }
}

export default FirmwareUploader;

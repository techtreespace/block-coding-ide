/**
 * SerialManager - Web Serial API 래퍼 클래스
 * 
 * ESP32, Arduino, RP2040 보드와 USB 시리얼 통신
 * 
 * 사용법:
 * const serial = new SerialManager();
 * await serial.connect();
 * serial.onReceive((data) => console.log(data));
 * await serial.send("Hello");
 */

class SerialManager {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isReading = false;
    this.receiveCallback = null;
    this.errorCallback = null;
    this.disconnectCallback = null;
  }

  /**
   * Web Serial API 지원 확인
   */
  static isSupported() {
    return 'serial' in navigator;
  }

  /**
   * 연결된 상태 확인
   */
  isConnected() {
    return this.port !== null && this.port.readable !== null;
  }

  /**
   * 보드 연결
   * @param {Object} options - 연결 옵션
   * @param {number} options.baudRate - 통신 속도 (기본: 115200)
   * @param {number} options.dataBits - 데이터 비트 (기본: 8)
   * @param {number} options.stopBits - 정지 비트 (기본: 1)
   * @param {string} options.parity - 패리티 (기본: 'none')
   */
  async connect(options = {}) {
    if (!SerialManager.isSupported()) {
      throw new Error('Web Serial API를 지원하지 않는 브라우저입니다. Chrome 또는 Edge를 사용하세요.');
    }

    try {
      // 포트 선택 다이얼로그 표시
      this.port = await navigator.serial.requestPort();

      // 기본 설정
      const defaultOptions = {
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none'
      };

      // 포트 열기
      await this.port.open({ ...defaultOptions, ...options });

      // Reader 설정
      this.startReading();

      // Writer 설정
      this.writer = this.port.writable.getWriter();

      console.log('✅ 시리얼 연결 성공');
      return true;

    } catch (error) {
      console.error('❌ 연결 실패:', error);
      
      if (error.name === 'NotFoundError') {
        throw new Error('포트를 선택하지 않았습니다.');
      } else if (error.name === 'InvalidStateError') {
        throw new Error('포트가 이미 사용 중입니다.');
      } else {
        throw error;
      }
    }
  }

  /**
   * 연결 해제
   */
  async disconnect() {
    this.isReading = false;

    try {
      // Reader 정리
      if (this.reader) {
        await this.reader.cancel();
        this.reader.releaseLock();
        this.reader = null;
      }

      // Writer 정리
      if (this.writer) {
        this.writer.releaseLock();
        this.writer = null;
      }

      // Port 닫기
      if (this.port) {
        await this.port.close();
        this.port = null;
      }

      console.log('✅ 시리얼 연결 해제');
      
      if (this.disconnectCallback) {
        this.disconnectCallback();
      }

    } catch (error) {
      console.error('❌ 연결 해제 실패:', error);
      throw error;
    }
  }

  /**
   * 데이터 읽기 시작
   */
  async startReading() {
    this.isReading = true;
    this.reader = this.port.readable.getReader();

    try {
      while (this.isReading) {
        const { value, done } = await this.reader.read();
        
        if (done) {
          console.log('Reader closed');
          break;
        }

        if (value) {
          // Uint8Array를 문자열로 변환
          const text = new TextDecoder().decode(value);
          
          if (this.receiveCallback) {
            this.receiveCallback(text);
          }
        }
      }
    } catch (error) {
      if (this.isReading) {
        console.error('❌ 읽기 오류:', error);
        
        if (this.errorCallback) {
          this.errorCallback(error);
        }
      }
    } finally {
      if (this.reader) {
        this.reader.releaseLock();
      }
    }
  }

  /**
   * 데이터 전송
   * @param {string} data - 전송할 데이터
   */
  async send(data) {
    if (!this.isConnected()) {
      throw new Error('보드가 연결되지 않았습니다.');
    }

    try {
      const encoder = new TextEncoder();
      const encoded = encoder.encode(data);
      await this.writer.write(encoded);
      console.log('📤 전송:', data);
    } catch (error) {
      console.error('❌ 전송 실패:', error);
      throw error;
    }
  }

  /**
   * 데이터 수신 콜백 등록
   * @param {Function} callback - 수신 시 호출될 함수
   */
  onReceive(callback) {
    this.receiveCallback = callback;
  }

  /**
   * 에러 콜백 등록
   * @param {Function} callback - 에러 발생 시 호출될 함수
   */
  onError(callback) {
    this.errorCallback = callback;
  }

  /**
   * 연결 해제 콜백 등록
   * @param {Function} callback - 연결 해제 시 호출될 함수
   */
  onDisconnect(callback) {
    this.disconnectCallback = callback;
  }

  /**
   * 보드 정보 가져오기
   */
  getPortInfo() {
    if (!this.port) {
      return null;
    }

    const info = this.port.getInfo();
    return {
      usbVendorId: info.usbVendorId,
      usbProductId: info.usbProductId,
      // 일반적인 보드 식별
      boardType: this.identifyBoard(info.usbVendorId, info.usbProductId)
    };
  }

  /**
   * USB VID/PID로 보드 타입 식별
   */
  identifyBoard(vendorId, productId) {
    const boards = {
      // ESP32
      '0x10C4': { '0xEA60': 'ESP32 (CP2102)' },
      '0x1A86': { '0x7523': 'ESP32 (CH340)' },
      
      // Arduino
      '0x2341': { 
        '0x0043': 'Arduino Uno',
        '0x0001': 'Arduino Uno',
        '0x0010': 'Arduino Mega 2560'
      },
      
      // RP2040
      '0x2E8A': { '0x0005': 'Raspberry Pi Pico' }
    };

    const vendorHex = `0x${vendorId?.toString(16).toUpperCase().padStart(4, '0')}`;
    const productHex = `0x${productId?.toString(16).toUpperCase().padStart(4, '0')}`;

    if (boards[vendorHex] && boards[vendorHex][productHex]) {
      return boards[vendorHex][productHex];
    }

    return 'Unknown Board';
  }
}

// ES Module export
export default SerialManager;

// CommonJS export (호환성)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SerialManager;
}

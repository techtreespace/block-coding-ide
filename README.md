# BlockIDE - 블록 코딩 IoT 개발 환경 🚀

**웹 브라우저에서 블록으로 코딩하고 ESP32/Arduino에 바로 업로드!**

---

## ✨ 특징

- 🧩 **블록 코딩**: 드래그 앤 드롭으로 프로그램 작성
- 🐍 **Python 자동 생성**: MicroPython 코드 실시간 생성
- 🔌 **USB 연결**: 브라우저에서 직접 보드 연결
- 📤 **원클릭 업로드**: 버튼 하나로 코드 업로드
- 📡 **실시간 모니터**: 시리얼 통신으로 디버깅
- 🌐 **웹 기반**: 설치 없이 사용 가능

---

## 🎯 지원 보드

| 보드 | 블록 코딩 | 업로드 | 시리얼 통신 |
|------|-----------|--------|------------|
| **ESP32** | ✅ | ✅ | ✅ |
| **RP2040 (Pico)** | ✅ | ✅ | ✅ |
| **Arduino** | ✅ | ⚠️* | ✅ |

\* Arduino는 코드 생성 후 Arduino IDE에서 업로드 권장

---

## 🚀 빠른 시작

### 방법 1: GitHub Pages (가장 쉬움!)

**설치 없이 바로 사용**:
1. 웹 브라우저 (Chrome 또는 Edge) 열기
2. GitHub Pages 주소 접속
3. 끝! 바로 사용 가능

### 방법 2: 로컬 실행

```bash
# Git clone
git clone https://github.com/your-username/block-coding-ide.git
cd block-coding-ide

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저가 자동으로 열립니다!

---

## 📖 사용 방법

### 1️⃣ 블록으로 프로그램 만들기
- 왼쪽 카테고리에서 블록 선택
- 드래그 & 드롭으로 조합
- 오른쪽에서 Python 코드 자동 생성 확인

### 2️⃣ 보드 연결
- ESP32를 USB로 PC에 연결
- 상단에서 보드 타입 선택 (ESP32/Arduino/RP2040)
- **[연결]** 버튼 클릭
- 포트 선택 다이얼로그에서 보드 선택

### 3️⃣ 코드 업로드
- **[보드에 업로드]** 버튼 클릭
- 진행 상황 확인 (0-100%)
- 완료!

### 4️⃣ 결과 확인
- 하단 시리얼 모니터에서 출력 확인
- 실시간 데이터 송수신 가능

---

## 💡 예제

### LED 깜빡이기
```
블록:
  반복 10번:
    LED 켜기 핀 2
    기다리기 500ms
    LED 끄기 핀 2  
    기다리기 500ms

생성된 코드:
  for _ in range(10):
      Pin(2, Pin.OUT).value(1)
      sleep_ms(500)
      Pin(2, Pin.OUT).value(0)
      sleep_ms(500)
```

### 버튼으로 LED 제어
```
블록:
  계속 반복:
    만약 버튼 눌림 핀 0:
      LED 켜기 핀 2
    아니면:
      LED 끄기 핀 2
```

---

## ⚙️ 필요한 것

### 브라우저
**Chrome** 또는 **Edge** (필수!)
- Firefox, Safari는 Web Serial API 미지원

### 보드 (ESP32/RP2040 사용 시)
- MicroPython 펌웨어 설치 필요

### Node.js (로컬 실행 시)
- 버전 18 이상

---

## 🐛 문제 해결

**Q: "Web Serial API를 지원하지 않습니다"**  
→ Chrome 또는 Edge 브라우저 사용

**Q: 보드가 안 보여요**  
→ USB 드라이버 설치 (CH340, CP2102 등)  
→ 다른 프로그램이 포트 사용 중인지 확인

**Q: 업로드가 안 돼요**  
→ MicroPython 펌웨어 설치 확인  
→ 보드 타입 정확히 선택

---

## 📦 GitHub Pages 배포

### 1. 저장소 생성
GitHub에서 `block-coding-ide` 저장소 생성

### 2. 코드 푸시
```bash
git init
git add .
git commit -m "BlockIDE 초기 버전"
git branch -M main
git remote add origin https://github.com/your-username/block-coding-ide.git
git push -u origin main
```

### 3. GitHub Pages 활성화
1. 저장소 Settings → Pages
2. Source: **GitHub Actions** 선택
3. 자동 배포 시작!

### 4. 접속
```
https://your-username.github.io/block-coding-ide/
```

---

## 📁 프로젝트 구조

```
block-coding-ide/
├── src/
│   ├── components/
│   │   ├── BlockEditor/      # 블록 코딩 에디터 (DAY 1)
│   │   ├── CodeViewer/        # 코드 뷰어 (DAY 1)
│   │   ├── BoardSelector/     # 보드 연결 (DAY 2)
│   │   ├── SerialMonitor/     # 시리얼 모니터 (DAY 2)
│   │   └── FirmwareUploader/  # 업로드 버튼 (DAY 3)
│   ├── lib/
│   │   ├── customBlocks.js      # 커스텀 블록 정의
│   │   ├── codeGenerator.js     # Python 코드 생성
│   │   ├── SerialManager.js     # 시리얼 통신
│   │   └── FirmwareUploader.js  # 펌웨어 업로드
│   └── App.jsx                  # 메인 앱
├── .github/workflows/
│   └── deploy.yml               # 자동 배포 설정
└── package.json
```

---

## 🛠️ 기술 스택

- **React** 18.3.1
- **Blockly** 11.0.0 (Google)
- **Vite** 5.3.1
- **Tailwind CSS** 3.4.4
- **Web Serial API**

---

## 📄 라이선스

MIT License

---

## 🙏 크레딧

- Blockly by Google
- Web Serial API by W3C
- MicroPython Project

---

**개발**: 2026-02  
**버전**: 1.0.0  
**상태**: 프로덕션 준비 완료 ✅

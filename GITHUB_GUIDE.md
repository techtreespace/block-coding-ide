# GitHub에 올리고 웹사이트 만들기 - 완전 초보자용 🚀

**목표**: BlockIDE를 GitHub에 올려서 웹 주소로 만들기!

---

## 📝 준비물

✅ GitHub 계정  
✅ Git 설치 → https://git-scm.com

---

## 🎯 전체 과정 (3단계)

### 1단계: GitHub 저장소 만들기
### 2단계: 코드 업로드하기  
### 3단계: 웹사이트 활성화하기

---

## 1️⃣ GitHub 저장소 만들기

### 웹 브라우저에서:

1. **https://github.com** 접속 → 로그인

2. 우측 상단 **+** 버튼 → **New repository** 클릭

3. 저장소 정보 입력:
   ```
   Repository name: block-coding-ide
   Description: 블록 코딩 IDE
   Public 선택
   ✅ Add a README file 체크 해제
   ```

4. **Create repository** 클릭

5. 나오는 주소 복사:
   ```
   https://github.com/당신아이디/block-coding-ide.git
   ```

---

## 2️⃣ 코드 업로드하기

### 명령 프롬프트(터미널) 열기:

**Windows**:
- `Win + R` → `cmd` 입력 → Enter

**Mac**:
- Spotlight (Cmd + Space) → `terminal` → Enter

### 명령어 입력:

```bash
# 1. BlockIDE 폴더로 이동
cd 다운로드폴더/blockide-final

# 2. Git 초기화
git init

# 3. 모든 파일 추가
git add .

# 4. 커밋 (저장)
git commit -m "BlockIDE 첫 업로드"

# 5. main 브랜치로 설정
git branch -M main

# 6. GitHub 연결 (아까 복사한 주소 사용)
git remote add origin https://github.com/당신아이디/block-coding-ide.git

# 7. 업로드!
git push -u origin main
```

**주의**: `당신아이디` 부분을 실제 GitHub 아이디로 바꾸세요!

**비밀번호 요구 시**:
- GitHub 비밀번호 입력
- 또는 Personal Access Token 필요
  (Settings → Developer settings → Personal access tokens)

---

## 3️⃣ 웹사이트 활성화 (GitHub Pages)

### 웹 브라우저에서:

1. GitHub 저장소 페이지 접속
   ```
   https://github.com/당신아이디/block-coding-ide
   ```

2. 상단 메뉴 **Settings** 클릭

3. 왼쪽 메뉴 **Pages** 클릭

4. **Source** 섹션에서:
   - ~~Branch 대신~~
   - **GitHub Actions** 선택

5. 저장 버튼 없음! 자동 저장!

---

## 4️⃣ 배포 확인

### 웹 브라우저에서:

1. 저장소 메인 페이지로 돌아가기

2. 상단 **Actions** 탭 클릭

3. 노란색 ● 이 초록색 ✅ 로 바뀔 때까지 기다리기 (1-3분)

4. 초록색 ✅ 가 뜨면 완료!

---

## 5️⃣ 웹사이트 접속!

**주소**:
```
https://당신아이디.github.io/block-coding-ide/
```

이 주소를 브라우저에 입력하면 **BlockIDE가 실행**됩니다!

---

## 🎉 완성!

이제:
- ✅ 설치 없이 웹으로 사용 가능
- ✅ 친구에게 주소 공유 가능
- ✅ 스마트폰에서도 접속 가능 (보드 연결 빼고)

---

## 🔧 문제 해결

### "git: command not found"
→ Git 설치: https://git-scm.com

### "Permission denied"  
→ GitHub 비밀번호 또는 Token 필요

### 배포가 빨간색 ❌  
→ Actions 탭에서 에러 로그 확인  
→ 대부분 `package.json` 문제

### 웹사이트가 안 열려요  
→ 5-10분 기다려보세요  
→ Settings → Pages에서 주소 확인

---

## 💡 코드 수정 후 다시 올리기

```bash
# 1. 파일 수정

# 2. 다시 업로드
git add .
git commit -m "수정 내용"
git push
```

자동으로 웹사이트도 업데이트됩니다!

---

## 📞 도움이 필요하면

- GitHub Discussions
- Issue 생성
- 또는 댓글로 질문!

---

**작성**: 2026-02-08  
**대상**: 완전 초보자  
**소요 시간**: 10분

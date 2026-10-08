# 두더지 정원

15개의 구멍에서 올라오는 두더지를 잡는 반응형 웹 게임입니다. HTML, CSS, JavaScript로 제작되어 설치나 빌드 없이 실행됩니다.

## 실행

`index.html`을 더블 클릭해 브라우저로 여세요. PC에서는 클릭 또는 키보드 `1–5`, `Q W E R T`, `A S D F G` (구멍 1–15 순서), 모바일에서는 터치로 잡습니다. Esc 또는 일시정지 버튼으로 잠시 멈출 수 있습니다. 다른 탭으로 이동해도 자동 일시정지됩니다.

## 게임 규칙

- 각 레벨 제한시간은 60초입니다. 목표 달성 후 다음 레벨 시작 버튼을 누르면 60초가 새로 주어집니다.
- 1레벨 목표는 20마리입니다. `ceil(20 × 1.2^(레벨 - 1))`로 계산해 레벨마다 20%씩 증가하고 소수점은 올림합니다. 1–10레벨 목표는 **20, 24, 29, 35, 42, 50, 60, 72, 86, 104마리**입니다.
- 두더지 노출 시간은 1레벨 **0.95초**부터 레벨마다 10%씩 감소해 10레벨에서는 약 **0.368초**입니다. 등장 간격도 0.5초부터 약 0.236초까지 줄어듭니다.
- 두더지가 숨기 전에 잡지 못하면 실패가 1회 누적됩니다. **게임 전체에서 20회 실패하면 종료**됩니다.
- 제한시간 안에 목표를 채우지 못해도 종료됩니다. 빈 구멍 클릭은 실패로 세지 않습니다.
- 최고 도달 레벨은 현재 브라우저에 저장됩니다. 효과음은 상단 버튼으로 켤 수 있습니다.

## GitHub 업로드

1. GitHub에서 새 저장소(예: `game1`)를 만드세요.
2. `Add file → Upload files` 또는 새 저장소의 `uploading an existing file`을 선택하세요.
3. **game1 폴더 안의 파일들**을 업로드하세요. 저장소의 맨 위에 `index.html`과 `vercel.json`이 보여야 합니다. ZIP 파일 자체를 올리지 마세요.
4. `Commit changes`로 저장하세요. `.gitignore`는 숨김 파일이므로 파일 탐색기의 숨긴 항목 표시를 켜면 확인할 수 있습니다.

공식 안내: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## Vercel 게시

1. Vercel 로그인 후 새 프로젝트에서 GitHub 저장소 `game1`을 가져오세요.
2. Framework Preset은 **Other**, Root Directory는 저장소의 루트로 선택하세요.
3. 빌드 명령 없이 정적 파일을 배포합니다. 포함된 `vercel.json`이 Output Directory를 `.`로 설정합니다. 별도의 환경 변수나 패키지 설치는 필요 없습니다.
4. `Deploy`를 누르고 완료 후 제공되는 주소를 여세요.

폴더 자체를 저장소에 올렸다면 Root Directory를 `game1`로 선택해야 합니다.

공식 안내: https://vercel.com/docs/git 및 https://vercel.com/docs/builds/configure-a-build

총 10레벨이며 10레벨 목표를 달성하면 최종 승리합니다. PC에서는 5열 × 3행, 모바일에서는 3열 × 5행으로 표시됩니다.

## 파일

- `index.html`: 화면 구성
- `style.css`: 반응형 디자인
- `rules.js`: 목표, 시간, 난이도 규칙
- `game.js`: 게임 진행과 입력, 효과음, 기록
- `vercel.json`: 정적 배포 설정

두더지는 자체 SVG로 그려 외부 이미지가 필요 없습니다. Google Fonts 연결이 안 되면 시스템 글꼴로 표시됩니다.

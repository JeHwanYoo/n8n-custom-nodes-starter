# n8n Custom Nodes Starter

## 프로젝트 개요

**n8n Custom Nodes Starter**는 n8n 커스텀 노드 개발을 위한 완전한 Docker 기반 개발 환경입니다.
TypeScript로 작성된 커스텀 노드를 효율적으로 개발, 테스트, 배포할 수 있는 개발 도구와 워크플로우를 제공합니다.

## 아키텍처 개요

### 🎵 워크플로우 오케스트레이션

**n8n**을 핵심 워크플로우 오케스트레이터로 사용하여 다음과 같은 개발 환경을 제공합니다:

- **커스텀 노드 개발**: TypeScript 기반 노드 개발 환경
- **Hot Reload**: 코드 변경 시 실시간 반영
- **워크플로우 테스트**: 웹 인터페이스에서 즉시 테스트
- **자동화된 빌드**: 코드 품질 관리 및 자동 빌드

### 🏠 로컬 개발 환경

**Docker & Docker Compose**를 사용하여 로컬 개발 환경을 구성합니다:

- **컨테이너화된 n8n**: 일관된 개발 환경 제공
- **데이터 지속성**: 컨테이너 재시작 시에도 워크플로우 유지
- **간편한 설정**: 한 번의 명령으로 전체 환경 구성

## 핵심 기능

### 1. 커스텀 노드 개발 환경

- TypeScript 기반 노드 개발
- 실시간 코드 변경 감지 및 반영
- 자동 코드 품질 관리 (ESLint, Prettier)
- 빌드 자동화 및 에러 체크

### 2. 개발 도구 및 스크립트

- 노드 생성 도구 (create-node)
- 노드 재로드 시스템 (reload)
- TypeScript 컴파일 및 타입 체크
- Git hooks를 통한 코드 품질 관리

### 3. Docker 기반 환경

- n8n 웹 인터페이스 제공
- 커스텀 노드 자동 로딩
- 데이터 지속성 및 볼륨 관리
- 개발 환경 격리

## 기술 스택

### 🎵 워크플로우 오케스트레이션

- **워크플로우 엔진**: n8n (Visual workflow builder)
- **커스텀 노드**: TypeScript 기반 n8n 확장 노드
- **개발 도구**: Hot reload, 자동 빌드
- **에러 핸들링**: TypeScript 타입 체크 및 ESLint

### 🏗️ 인프라 & 개발 환경

- **컨테이너화**: Docker & Docker Compose
- **개발 환경**: Node.js 22 Alpine
- **패키지 관리**: pnpm
- **빌드 시스템**: TypeScript 컴파일러

### 🔧 개발 도구

- **언어**: TypeScript
- **패키지 관리**: pnpm
- **코드 품질**: ESLint, Prettier
- **Git Hooks**: Husky, lint-staged
- **타입 체크**: TypeScript strict mode

## 🚀 로컬 개발 환경

### 전제 조건

- Docker & Docker Compose 설치
- Git 클라이언트
- Node.js 18+ (로컬 개발 시)

### 설치 및 실행

1. **프로젝트 클론**

   ```bash
   git clone <repository-url>
   cd n8n-custom-nodes-starter
   ```

2. **의존성 설치** (선택사항 - 로컬 개발 시)

   ```bash
   pnpm install
   ```

3. **n8n 컨테이너 시작**

   ```bash
   # 빌드 & 백그라운드 실행
   docker compose up --build -d

   # 포그라운드 실행 (로그 확인)
   docker compose up --build
   ```

4. **n8n 웹 인터페이스 접속**
   - URL: http://localhost:5678
   - 기본 계정: admin / admin

5. **컨테이너 정지 및 정리**

   ```bash
   # 컨테이너 정지 및 삭제
   docker compose down

   # 이미지까지 함께 삭제
   docker compose down --rmi all

   # 완전 정리 (볼륨, 이미지, 빌드 캐시 모두 삭제)
   docker compose down --rmi all -v
   docker system prune -a --volumes
   ```

### 개발 환경 구조

```
n8n-custom-nodes-starter/
├── docker-compose.yml          # 서비스 구성
├── Dockerfile                  # n8n 컨테이너 이미지
├── .gitignore                  # Git 제외 파일
├── nodes/                      # 커스텀 n8n 노드들
│   └── TestModule/             # 예제 노드
├── scripts/                    # 개발 도구 스크립트
│   ├── create-node.js          # 새 노드 생성
│   └── reload.js               # 노드 재로드
├── tsconfig.json               # TypeScript 설정
├── eslint.config.js            # ESLint 설정
└── package.json                # 프로젝트 설정
```

### 주요 특징

- **데이터 지속성**: Docker named volume으로 워크플로우 및 설정 저장
- **Hot Reload**: 코드 변경 시 자동 반영
- **포트 격리**: 각 서비스별 포트 분리
- **볼륨 관리**: Docker Volume으로 데이터 분리 및 관리
- **자동 코드 품질 관리**: Git commit 시 Husky + lint-staged로 자동 lint & format

### 개발 도구

#### 📋 **코드 품질 관리**

- **ESLint**: TypeScript 코드 린팅 (ESNext 지원)
- **Prettier**: 일관된 코드 포맷팅
- **Husky**: Git hooks 자동화
- **lint-staged**: Staged 파일만 선택적 처리

#### 🚀 **npm 스크립트**

```bash
# 개발 명령어
npm run build        # TypeScript 빌드
npm run watch        # 파일 변경 감시 & 자동 빌드
npm run dev          # 개발 모드 (watch 별칭)
npm run type-check   # 타입 체크만 실행

# 코드 품질 관리
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 포맷팅
npm run format:check # Prettier 체크만

# 노드 개발 도구
npm run create-node  # 새 커스텀 노드 생성
npm run reload       # 노드 재로드
```

#### 🎯 **Git Hooks (Husky)**

```bash
# commit 시 자동 실행
git commit  # → lint-staged 자동 실행
            # → staged 파일에 ESLint + Prettier 적용
            # → 코드 품질 문제 시 commit 차단
```

### 🔧 **커스텀 노드 개발**

컨테이너 재빌드 없이 새로운 노드를 추가하고 테스트할 수 있습니다.

#### 📦 **새 노드 생성**

```bash
# 기본 노드 생성
npm run create-node my-custom-node

# 옵션을 사용한 노드 생성
npm run create-node data-processor -- -t transform -g utility
npm run create-node api-client -- -t input -g network
```

**생성되는 파일:**

- `nodes/my-custom-node/my-custom-node.node.ts` - 노드 구현

#### 🔄 **노드 재로드**

노드를 수정한 후 n8n에서 즉시 테스트할 수 있습니다:

```bash
# 품질 검사 + 빌드 + 재로드
npm run reload
```

**재로드 과정:**

1. **코드 품질 검사** (Prettier 포맷팅 + ESLint 자동 수정)
2. 로컬에서 TypeScript 빌드
3. 변경된 파일을 컨테이너에 복사
4. 컨테이너 내에서 노드 재빌드
5. n8n 프로세스 재시작
6. 새로운 노드 활성화

#### 🔍 **개발 워크플로우**

```bash
# 1. 새 노드 생성
npm run create-node my-node

# 2. 노드 로직 구현
# nodes/my-node/my-node.node.ts 편집

# 3. 노드 테스트
npm run reload

# 4. n8n 웹 인터페이스에서 확인
# http://localhost:5678

# 5. 반복 개발
# 코드 수정 → reload → 테스트
```

#### 💡 **개발 팁**

- **실시간 개발**: `npm run dev`로 파일 변경 감시 활성화
- **문제 해결**: 노드가 인식되지 않으면 `docker compose restart`로 컨테이너 재시작
- **코드 품질**: 자동 Prettier + ESLint 적용
- **디버깅**: 컨테이너 로그 확인 `docker logs n8n-custom-nodes`

## 🎯 노드 개발 가이드

### 기본 노드 구조

```typescript
import { INodeType, INodeTypeDescription } from 'n8n-workflow'

export class MyCustomNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Custom Node',
    name: 'myCustomNode',
    icon: 'file:myCustomNode.svg',
    group: ['transform'],
    version: 1,
    description: 'Custom node description',
    defaults: {
      name: 'My Custom Node',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      // 노드 설정 프로퍼티
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // 노드 실행 로직
    return [[]]
  }
}
```

### 노드 카테고리

- **input**: 데이터 입력 노드
- **output**: 데이터 출력 노드
- **transform**: 데이터 변환 노드
- **trigger**: 워크플로우 시작 노드

### 노드 그룹

- **utility**: 유틸리티
- **database**: 데이터베이스
- **network**: 네트워크
- **communication**: 커뮤니케이션
- **file**: 파일 처리

## 🗓️ 개발 로드맵

### Phase 1: 기본 환경 구축

- **Docker 개발 환경 구성**
  - Docker & Docker Compose 설정
  - n8n 컨테이너 구성
  - 데이터 지속성 및 볼륨 매핑
- **개발 도구 설정**
  - TypeScript 환경 설정
  - ESLint, Prettier 구성
  - Git hooks 설정

### Phase 2: 노드 개발 도구

- **노드 생성 도구**
  - 템플릿 기반 노드 생성
  - 다양한 노드 타입 지원
  - 자동 파일 생성 및 구성
- **개발 편의성 도구**
  - Hot reload 시스템
  - 자동 빌드 및 배포
  - 에러 핸들링 및 디버깅

### Phase 3: 고급 기능

- **노드 테스트 환경**
  - 단위 테스트 프레임워크
  - 통합 테스트 환경
  - 테스트 자동화
- **배포 및 패키징**
  - 노드 패키징 도구
  - 배포 자동화
  - 버전 관리

### Phase 4: 커뮤니티 및 확장

- **문서화 및 가이드**
  - 노드 개발 가이드
  - 예제 노드 컬렉션
  - 베스트 프랙티스
- **확장성 및 플러그인**
  - 플러그인 시스템
  - 써드파티 통합
  - 커뮤니티 기여

## 🤝 기여하기

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 라이선스

This project is licensed under the MIT License.

---

_본 프로젝트는 n8n 커스텀 노드 개발을 위한 완전한 Docker 기반 개발 환경을 제공합니다._

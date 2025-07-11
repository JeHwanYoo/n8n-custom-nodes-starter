FROM n8nio/n8n:latest

# 커스텀 노드를 위한 디렉토리 생성
USER root
RUN mkdir -p /home/node/.n8n/custom

# pnpm 설치
RUN npm install -g pnpm

# 패키지 설정 파일들 복사
COPY --chown=node:node package.json pnpm-lock.yaml tsconfig.json /home/node/.n8n/custom/

# 작업 디렉토리 변경 후 의존성 설치
WORKDIR /home/node/.n8n/custom
RUN pnpm install --frozen-lockfile

# 커스텀 노드 파일들 복사
COPY --chown=node:node nodes/ /home/node/.n8n/custom/nodes/

# TypeScript 빌드
RUN pnpm build

# 빌드된 노드들을 n8n이 인식할 수 있는 위치로 복사
RUN cp -r dist/* /home/node/.n8n/custom/

# n8n 사용자로 전환
USER node

# 기본 작업 디렉토리로 돌아가기
WORKDIR /home/node/.n8n

# 환경 변수 설정 (커스텀 노드 경로)
ENV N8N_CUSTOM_EXTENSIONS="/home/node/.n8n/custom"

# 포트 노출
EXPOSE 5678 

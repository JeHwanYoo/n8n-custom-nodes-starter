# Build Stage
FROM node:22-alpine AS builder

# pnpm 설치
RUN npm install -g pnpm

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 설정 파일들 복사 및 의존성 설치
COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile

# 소스 코드 복사 및 빌드
COPY nodes/ ./nodes/
RUN pnpm build

# Runtime Stage
FROM n8nio/n8n:latest

# 빌드된 파일들을 custom 디렉토리에 복사
COPY --from=builder --chown=node:node /app/dist /home/node/.n8n/custom

# 환경 변수 설정
ENV N8N_CUSTOM_EXTENSIONS="/home/node/.n8n/custom"

# 포트 노출
EXPOSE 5678 

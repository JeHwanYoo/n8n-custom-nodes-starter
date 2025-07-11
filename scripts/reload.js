#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// 색상 코드
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

const CONTAINER_NAME = 'rag-price-tracker-n8n'

function checkContainer() {
  try {
    const result = execSync(
      `docker ps --format "table {{.Names}}" | grep "^${CONTAINER_NAME}$"`,
      { encoding: 'utf-8' },
    ).trim()
    return result === CONTAINER_NAME
  } catch (error) {
    return false
  }
}

function runCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf-8', ...options })
  } catch (error) {
    if (!options.silent) {
      console.error(error.stdout || error.message)
    }
    throw error
  }
}

function checkCodeQuality() {
  try {
    // Prettier 포맷팅 (조용히 실행)
    runCommand('pnpm format', { silent: true, stdio: 'ignore' })

    // ESLint 자동 수정 (조용히 실행)
    runCommand('pnpm lint:fix', { silent: true, stdio: 'ignore' })
  } catch (error) {
    // 코드 품질 검사 실패는 무시하고 계속 진행
  }
}

function buildProject() {
  log('blue', '🔨 빌드 중...')

  try {
    const buildOutput = runCommand('pnpm build', { silent: true })
    log('green', '✓ 빌드 완료')
    return true
  } catch (error) {
    log('red', '❌ 빌드 실패')
    // 에러 출력을 위해 다시 실행
    try {
      runCommand('pnpm build')
    } catch (e) {
      // 이미 에러가 출력됨
    }
    return false
  }
}

function copyToN8n() {
  try {
    // n8n_data/custom 디렉토리 생성 (기존 내용 완전 삭제 후 재생성)
    const customDir = path.join('n8n_data', 'custom')

    // 기존 custom 디렉토리가 있으면 완전히 삭제
    if (fs.existsSync(customDir)) {
      fs.rmSync(customDir, { recursive: true, force: true })
    }

    // 새로 생성
    fs.mkdirSync(customDir, { recursive: true })

    // dist 디렉토리 내용을 n8n_data/custom으로 복사
    if (fs.existsSync('dist')) {
      const distItems = fs.readdirSync('dist')
      for (const item of distItems) {
        const srcPath = path.join('dist', item)
        const destPath = path.join(customDir, item)

        // 복사
        fs.cpSync(srcPath, destPath, { recursive: true })
      }
    }

    return true
  } catch (error) {
    log('red', `복사 실패: ${error.message}`)
    return false
  }
}

function restartN8n() {
  log('blue', '🔄 n8n 재시작 중...')

  try {
    // n8n 프로세스 종료 및 재시작
    runCommand(`docker exec ${CONTAINER_NAME} sh -c "pkill -f n8n"`, {
      silent: true,
      stdio: 'ignore',
    })

    // 잠시 대기
    setTimeout(() => {
      try {
        // n8n 백그라운드 실행
        runCommand(
          `docker exec -d ${CONTAINER_NAME} sh -c "cd /usr/local/lib/node_modules/n8n && node bin/n8n"`,
          { silent: true, stdio: 'ignore' },
        )

        // 서비스 시작 확인
        setTimeout(() => {
          try {
            runCommand('curl -s http://localhost:5678/healthz', {
              silent: true,
              stdio: 'ignore',
            })
            log('green', '✓ n8n 재시작 완료')
          } catch (error) {
            log(
              'yellow',
              '⚠️ n8n 시작 중... (잠시 후 http://localhost:5678 확인)',
            )
          }
        }, 3000)
      } catch (error) {
        log('yellow', '⚠️ n8n 시작 중... (잠시 후 http://localhost:5678 확인)')
      }
    }, 2000)
  } catch (error) {
    log('yellow', '⚠️ n8n 재시작 중... (잠시 후 확인해주세요)')
  }
}

function main() {
  // 컨테이너 실행 상태 확인
  if (!checkContainer()) {
    log('red', `❌ 컨테이너가 실행 중이 아닙니다: ${CONTAINER_NAME}`)
    log('yellow', '다음 명령으로 컨테이너를 시작하세요:')
    console.log('   docker compose up --build')
    process.exit(1)
  }

  // 코드 품질 검사
  checkCodeQuality()

  // 빌드
  if (!buildProject()) {
    process.exit(1)
  }

  // 복사
  if (!copyToN8n()) {
    process.exit(1)
  }

  // n8n 재시작
  restartN8n()
}

main()

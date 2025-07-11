#!/usr/bin/env node

import { camelCase, pascalCase } from 'change-case'
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

function showHelp() {
  log('blue', 'n8n 커스텀 노드 생성 스크립트')
  console.log('')
  console.log('사용법: npm run create-node <node-name> [options]')
  console.log('')
  console.log('옵션:')
  console.log('  -h, --help     도움말 표시')
  console.log('  -g, --group    노드 그룹 (default: transform)')
  console.log('')
  console.log('예시:')
  console.log('  npm run create-node MyCustomNode')
  console.log('  npm run create-node BigQueryReader -- -g database')
}

function validateNodeName(nodeName) {
  if (!nodeName) {
    log('red', '노드 이름이 필요합니다.')
    showHelp()
    process.exit(1)
  }

  // 엄격한 PascalCase 검증: 첫 글자는 대문자, 나머지는 소문자와 대문자만 허용, 숫자 금지
  if (!/^[A-Z][a-z]+([A-Z][a-z]+)*$/.test(nodeName)) {
    log('red', '노드 이름은 엄격한 PascalCase 형태여야 합니다.')
    log('red', '- 첫 글자는 대문자')
    log('red', '- 각 단어는 대문자로 시작하고 소문자가 이어짐')
    log('red', '- 숫자나 특수문자 사용 금지')
    log('red', '- 연속된 대문자 금지')
    log('red', '올바른 예: TestModule, BigQueryReader, UserService')
    log('red', '잘못된 예: testModule, TestMODULE, Test123, Test_Module')
    process.exit(1)
  }

  // 길이 제한 (최소 3글자, 최대 50글자)
  if (nodeName.length < 3 || nodeName.length > 50) {
    log('red', '노드 이름은 3글자 이상 50글자 이하여야 합니다.')
    process.exit(1)
  }

  // 예약어 체크
  const reservedWords = [
    'Node',
    'Class',
    'Function',
    'Object',
    'Array',
    'String',
    'Number',
    'Boolean',
  ]
  if (reservedWords.includes(nodeName)) {
    log('red', `'${nodeName}'은 예약어입니다. 다른 이름을 사용해주세요.`)
    process.exit(1)
  }
}

function createNodeTemplate(nodeName, nodeGroup) {
  const className = pascalCase(nodeName)
  const displayName = nodeName
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  const nodeKey = camelCase(nodeName) // camelCase 함수 사용

  return `import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeOperationError,
} from 'n8n-workflow'

export class ${className} implements INodeType {
  description: INodeTypeDescription = {
    displayName: '${displayName}',
    name: '${nodeKey}',
    icon: 'fa:cube',
    group: ['${nodeGroup}'],
    version: 1,
    description: '${displayName} 노드',
    defaults: {
      name: '${displayName}',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Execute',
            value: 'execute',
            description: '기본 실행',
          },
        ],
        default: 'execute',
      },
      {
        displayName: 'Parameter',
        name: 'parameter',
        type: 'string',
        default: '',
        placeholder: '파라미터 입력',
        description: '노드 실행에 필요한 파라미터',
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()

    if (items.length === 0) {
      throw new NodeOperationError(this.getNode(), 'No input data')
    }

    const returnData: INodeExecutionData[] = []

    for (const [i, item] of items.entries()) {
      try {
        const operation = this.getNodeParameter('operation', i) as string
        const parameter = this.getNodeParameter('parameter', i) as string

        // TODO: 여기에 노드의 실제 로직을 구현하세요
        let result

        switch (operation) {
          case 'execute':
            result = {
              success: true,
              parameter,
              message: '${displayName} 노드가 성공적으로 실행되었습니다.',
              timestamp: new Date().toISOString(),
            }
            break

          default:
            throw new NodeOperationError(
              this.getNode(),
              \`Unknown operation: \${operation}\`,
            )
        }

        returnData.push({
          json: {
            ...result,
            originalData: item.json,
          },
        })
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          })
          continue
        }
        throw error
      }
    }

    return [returnData]
  }
}
`
}

function main() {
  const args = process.argv.slice(2)

  // 기본값 설정
  let nodeName = ''
  let nodeGroup = 'transform'

  // 인수 파싱
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '-h' || arg === '--help') {
      showHelp()
      process.exit(0)
    } else if (arg === '-g' || arg === '--group') {
      nodeGroup = args[++i]
    } else if (!nodeName) {
      nodeName = arg
    } else {
      log('red', '너무 많은 인수입니다.')
      showHelp()
      process.exit(1)
    }
  }

  validateNodeName(nodeName)

  const nodeDir = path.join('nodes', nodeName)
  const nodeFilePath = path.join(nodeDir, `${nodeName}.node.ts`)

  // 디렉토리 존재 확인
  if (fs.existsSync(nodeDir)) {
    log('red', `노드 디렉토리가 이미 존재합니다: ${nodeDir}`)
    process.exit(1)
  }

  try {
    // 디렉토리 생성
    fs.mkdirSync(nodeDir, { recursive: true })

    // 노드 파일 생성
    const nodeContent = createNodeTemplate(nodeName, nodeGroup)
    fs.writeFileSync(nodeFilePath, nodeContent)

    // Prettier 적용
    try {
      execSync('pnpm format > /dev/null 2>&1', { stdio: 'ignore' })
    } catch (error) {
      // Prettier 실행 실패 시 무시
    }

    log('green', `✓ 노드 생성 완료: ${nodeFilePath}`)
  } catch (error) {
    log('red', `노드 생성 실패: ${error.message}`)
    process.exit(1)
  }
}

main()

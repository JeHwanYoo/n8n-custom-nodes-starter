import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeOperationError,
} from 'n8n-workflow'

export class TestModule implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Test Module',
    name: 'testModule',
    icon: 'fa:cube',
    group: ['transform'],
    version: 1,
    description: 'Test Module 노드',
    defaults: {
      name: 'Test Module',
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
              message: 'Test Module 노드가 성공적으로 실행되었습니다.',
              timestamp: new Date().toISOString(),
            }
            break

          default:
            throw new NodeOperationError(
              this.getNode(),
              `Unknown operation: ${operation}`,
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

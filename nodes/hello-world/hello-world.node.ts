import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeOperationError,
} from 'n8n-workflow'

export class HelloWorld implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Hello World',
    name: 'helloWorld',
    icon: 'fa:hand-paper',
    group: ['transform'],
    version: 1,
    description: 'Simple Hello World node for testing',
    defaults: {
      name: 'Hello World',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: 'World',
        placeholder: 'Enter a name',
        description: 'Name to greet',
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: 'Hello',
        placeholder: 'Enter a message',
        description: 'Greeting message',
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
        const name = this.getNodeParameter('name', i) as string
        const message = this.getNodeParameter('message', i) as string

        const greeting = `${message}, ${name}!`

        returnData.push({
          json: {
            greeting,
            timestamp: new Date().toISOString(),
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

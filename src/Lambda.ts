import AWS from 'aws-sdk';

export class Lambda {
  protected lambdaManager: AWS.Lambda;

  constructor(profile: string, region: string) {
    AWS.config.update(
      {
        credentials: new AWS.SharedIniFileCredentials({ profile: profile })
      }
    );

    this.lambdaManager = new AWS.Lambda({ region: region, apiVersion: '2015-03-31' });
  }

  listLambdas = async (): Promise<Array<Object>> => {
    let params = {
      MaxItems: 100
    }

    let result = await this.lambdaManager.listFunctions(params).promise();

    let lambdaFunctions: Array<Object> = result["Functions"].map((item) => {
      return { "name": item["FunctionName"] };
    });

    return lambdaFunctions;
  }

  invoke = async (functionName: string, payload: string): Promise<string> => {
    let params = {
      FunctionName: functionName,
      Payload: new Buffer(payload, 'binary')
    }

    let result = await this.lambdaManager.invoke(params).promise();

    return result['StatusCode'].toString();
  }
}

import { mock, instance, when, verify } from 'ts-mockito';
import { expect } from 'chai';
import 'mocha';

import { Lambda } from '../src/Lambda';

describe('Lambda', () => {
  let mockLambda: Lambda;

  beforeEach(() => {
    mockLambda = mock(Lambda);
  });

  it('should get a list of lambdas', async () => {
    const mockResponse: Array<Object> = [
      { "name": "Lambda1" }
    ];
    let mockPromise = new Promise<Array<Object>>((resolve, reject) => {
      resolve(mockResponse);
    });
    when(mockLambda.listLambdas()).thenReturn(mockPromise);

    const mockInstance = instance(mockLambda);
    const result = await mockInstance.listLambdas();

    expect(result).to.equal(mockResponse);
  });

  it('should invoke the selected lambda', async () => {
    let mockPromise = new Promise<string>((resolve, reject) => {
      resolve("200");
    });
    when(mockLambda.invoke('Lambda1', '{"action": "create"}')).thenReturn(mockPromise);

    const mockInstance = instance(mockLambda);
    const result = await mockInstance.invoke('Lambda1', '{"action": "create"}');

    expect(result).to.equal("200")
  });
});

import os from 'os';
import fs from 'fs';
import betterLogging from "better-logging";
import ini from 'ini';
import { InquirerChoiceList } from './InquirerChoiceList';
import { Lambda } from './Lambda';

betterLogging(console);

const AWS_CREDENTIALS_FILE: string = `${os.homedir()}/.aws/credentials`;

if (!fs.existsSync(AWS_CREDENTIALS_FILE)) {
  console.error('File does not exists: ' + AWS_CREDENTIALS_FILE);
  process.exit();
}


let config: Object = ini.parse(fs.readFileSync(AWS_CREDENTIALS_FILE, 'utf8'));
const profiles: Array<string> = Object.keys(config);

new InquirerChoiceList(
  'list',
  'profile',
  'Choose the AWS profile where you want to run the lambdas',
  profiles,
  (choice: string) => {
    const lambdaManager: Lambda = new Lambda(choice, 'eu-west-1');
    lambdaManager.listLambdas().then(list => {
      new InquirerChoiceList(
        'list',
        'lambda',
        'Choose the Lambda function you want to run',
        list,
        (lambda: string) => {
          new InquirerChoiceList(
            '',
            'payload',
            'Write down the payload for the Lambda function',
            [],
            (payload) => {
              lambdaManager.invoke(lambda, payload).then(result => {
                console.log(result);
              })
            }
          );
        }
      )
    });
  }
);

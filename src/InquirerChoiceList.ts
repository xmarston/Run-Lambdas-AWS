import inquirer from 'inquirer';

export class InquirerChoiceList {
  constructor(
    type: string,
    choiceName: string,
    message: string,
    list: Array<any>,
    callback: (...args: any) => any
  ) {
    let params: Object = {
      type: type,
      name: choiceName,
      message: message,
      choices: list
    };
    if (type === '') {
      params = {
        name: choiceName,
        message: message
      };
    }
    inquirer
      .prompt([
        params
      ])
      .then(answers => {
        callback(answers[choiceName]);
      });
  }
}

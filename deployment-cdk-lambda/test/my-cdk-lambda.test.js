const cdk = require('aws-cdk-lib');
const { Template } = require('aws-cdk-lib/assertions');
const MyCdkLambda = require('../lib/my-cdk-lambda-stack');

// example test. To run these tests, uncomment this file along with the
// example resource in lib/my-cdk-lambda-stack.js
test('My Lambda function created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new MyCdkLambda.MyCdkLambdaStack(app, 'MyCdkLambdaStack');
  // THEN
  const template = Template.fromStack(stack);

  template.hasResource('AWS::Lambda::Function', {
    Properties: { 
        FunctionName: 'my-cdk-lambda-function-rank'
    }
  });

  const expected = {
    Export: { Name: 'URL' },
  };
  template.hasOutput('TheUrl', expected);

});

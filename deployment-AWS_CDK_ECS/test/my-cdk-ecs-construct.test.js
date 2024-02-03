// const cdk = require('aws-cdk-lib');
// const { Template } = require('aws-cdk-lib/assertions');
// const MyCdkEcsConstruct = require('../lib/my-cdk-ecs-construct-stack');

// example test. To run these tests, uncomment this file along with the
// example resource in lib/my-cdk-ecs-construct-stack.js
// test('SQS Queue Created', () => {
//   const app = new cdk.App();
//   // WHEN
//   const stack = new MyCdkEcsConstruct.MyCdkEcsConstructStack(app, 'MyTestStack');
//   // THEN
//   const template = Template.fromStack(stack);

//   template.hasResourceProperties('AWS::SQS::Queue', {
//     VisibilityTimeout: 300
//   });
// });

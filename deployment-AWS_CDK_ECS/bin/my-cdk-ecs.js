#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { MyCdkEcsConstructStack } = require('../lib/my-cdk-ecs-construct-stack');
const app = new cdk.App();

new MyCdkEcsConstructStack(app, 'MyCdkEcsConstructStack', {

  existingSecretArn: 'arn:aws:secretsmanager:ca-central-1:146966035049:secret:dev/my-face-recognition-api-igI1Y4',
  myDockerImage: 'famaten/my-face-recognition-dev:latest',
  myAppName: 'my-face-recognition-api',
  APP_DEBUG: 1,
  myDBName: 'mypostgresdb'
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

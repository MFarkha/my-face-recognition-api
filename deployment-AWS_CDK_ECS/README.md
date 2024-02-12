## Welcome to my CDK project for deployment of my-face-recognition-api application into ECS cluster with ALB and RDS Postgres database

1. Bootstrap cdk into AWS account (if it's not done yet earlier)

https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html

`cdk bootstrap aws://ACCOUNT-NUMBER/REGION`

2. Build the docker image of the app and put it in the docker hub

3. Check the input data (hard-coded into bin/my-cdk-ecs.js)
  - `existingSecretArn` - the arn of a secret with input ENV variables for my-face-recognition-api app (see variables at ../README.md)
  
  - `myDockerImage` - docker image location (yes, from the step 2)
  
  - `myAppName` - name of the app

  - `APP_DEBUG` - set this variable to '1' if you would like to get all errors from the app on your console (verbose mode)

  - `myDBName` - name of postgres database which will be created by the stack
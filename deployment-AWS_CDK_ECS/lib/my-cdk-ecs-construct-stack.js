const { Stack, Duration } = require('aws-cdk-lib');
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const ecs_patterns = require("aws-cdk-lib/aws-ecs-patterns");
const secretsmanager = require('aws-cdk-lib/aws-secretsmanager');
const { MyRDS } = require('./my-cdk-rds-contruct');
class MyCdkEcsConstructStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const { existingSecretArn, myDockerImage, myAppName, APP_DEBUG, myDBName } = props;
    const vpc = new ec2.Vpc(this, 'myVPC', {
      maxAzs: 2
    });

    const mySecret = secretsmanager.Secret.fromSecretCompleteArn(this, 'mySecret', existingSecretArn);

    const myDB = new MyRDS (this, 'myDB', { vpc, myDBName: mySecret.secretValueFromJson('DB_DATABASE_NAME').unsafeUnwrap() });

    // const keyPair = ec2.KeyPair.fromKeyPairName(this, 'KeyPair', 'my-mac-jan-2024');
    // const ec2Instance = new ec2.Instance(this, 'Instance', {
    //   vpc,
    //   vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    //   instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    //   machineImage: ec2.MachineImage.latestAmazonLinux2023(),
    //   keyPair,
    //   associatePublicIpAddress: true,
    // });
    // const peer = ec2.Peer.ipv4('99.224.38.30/32');
    // ec2Instance.connections.allowFrom(peer, ec2.Port.tcp(22), 'Allow inbound ssh from my ip');
    // myDB.instance.connections.allowDefaultPortFrom(ec2Instance);

    const cluster = new ecs.Cluster(this, 'myCluster', {
      vpc,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'myTD', {
      memoryMiB: 256,
      cpu: 256,
    });

    const myEnvVariables = {
      DB_CLIENT: 'pg'
    };
    const mySecretVariables =  {
      CLARIFAI_PAT: ecs.Secret.fromSecretsManager(mySecret, 'CLARIFAI_PAT'),
      CLARIFAI_USER_ID: ecs.Secret.fromSecretsManager(mySecret, 'CLARIFAI_USER_ID'),
      CLARIFAI_APP_ID: ecs.Secret.fromSecretsManager(mySecret, 'CLARIFAI_APP_ID'),
      APP_DEBUG: ecs.Secret.fromSecretsManager(mySecret, 'APP_DEBUG'),
      DB_DATABASE_NAME: ecs.Secret.fromSecretsManager(mySecret, 'DB_DATABASE_NAME'),
      DB_USER: ecs.Secret.fromSecretsManager(myDB.db_secret, 'username'),
      DB_PASSWORD: ecs.Secret.fromSecretsManager(myDB.db_secret, 'password'),
      DB_HOST: ecs.Secret.fromSecretsManager(myDB.db_secret, 'host'),
      DB_PORT: ecs.Secret.fromSecretsManager(myDB.db_secret, 'port'),
    }

    const myAppContainer = taskDefinition.addContainer('myAppContainer', {
      image: ecs.ContainerImage.fromRegistry(myDockerImage),
      containerName: myAppName,
      essential: true,
      healthCheck: {
        command: [ "CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3001 || exit 1" ],
        interval: Duration.seconds(5),
        retries: 3,
        timeout: Duration.seconds(5),
      },
      portMappings: [{
        containerPort: 3001,
        hostPort: 3001,
      }],
      environment: myEnvVariables,
      secrets: mySecretVariables,
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: `default`
      }),
    });

    const myInitContainer = taskDefinition.addContainer('myInitAppContainer', {
      image: ecs.ContainerImage.fromRegistry(myDockerImage),
      containerName: `${myAppName}-init`,
      essential: false,
      environment: myEnvVariables,
      secrets: mySecretVariables,
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: `init`
      }),
    });
    myInitContainer.addEnvironment('APP_INIT', '1');
    myAppContainer.addContainerDependencies({
      container: myInitContainer,
      condition: ecs.ContainerDependencyCondition.SUCCESS,
    });

    const myFargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'myECSService', {
      cluster: cluster,
      cpu: 512,
      desiredCount: 2,
      memoryLimitMiB: 512,
      taskDefinition: taskDefinition,
      publicLoadBalancer: true,
      circuitBreaker: { rollback: true },
    });

    myFargateService.service.connections.allowTo(myDB.instance, ec2.Port.tcp(myDB.instance.dbInstanceEndpointPort));
  }
}

module.exports = { MyCdkEcsConstructStack }

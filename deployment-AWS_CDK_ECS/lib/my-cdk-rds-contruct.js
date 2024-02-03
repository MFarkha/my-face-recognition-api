const ec2 = require("aws-cdk-lib/aws-ec2");
const rds = require('aws-cdk-lib/aws-rds');
const secretsmanager = require('aws-cdk-lib/aws-secretsmanager');
const { Construct } = require('constructs');

class MyRDS extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const { vpc, myDBName } = props;

    const dbSecret = new secretsmanager.Secret(this, 'DBSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludeCharacters: '/@"',
      },
    });

    this.instance = new rds.DatabaseInstance(this, 'DBInstance', {
      databaseName: myDBName,
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_4 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      publiclyAccessible: false,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      credentials: rds.Credentials.fromSecret(dbSecret), // Get both username and password from existing secret
    });

    this.db_secret = dbSecret
  }
}

module.exports = { MyRDS };
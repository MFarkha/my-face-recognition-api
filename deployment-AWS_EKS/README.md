## Deployment of my-face-application-api into AWS EKS
1. Setup a cluster AWS EKS Cluster for backend application "my-face-recognition-api"

`eksctl create cluster -f eksctl-config.yaml`
`cluster_name=NAME OF YOUR CLUSTER`
`oidc_id=$(aws eks describe-cluster --name $cluster_name --query "cluster.identity.oidc.issuer" --output text | cut -d '/' -f 5)`
`eksctl utils associate-iam-oidc-provider --cluster $cluster_name --approve`
`eksctl create addon -f eksctl-config.yaml`

2. You need to get security group support for eks cluster (to provide connnectivity between RDS and EKS nodes)
`kubectl apply -f my-security-group-policy.yaml`

3. Install AWS Load Balancer Controller (for Ingress service of backend API)
https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html

`curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.5.4/docs/install/iam_policy.json `

` aws iam create-policy \`
    `--policy-name AWSLoadBalancerControllerIAMPolicy \`
    `--policy-document file://iam_policy.json`

`oidc_id=$(aws eks describe-cluster --name NAME_OF_YOUR_CLUSTER --query "cluster.identity.oidc.issuer" --output text | cut -d '/' -f 5)`

`aws iam list-open-id-connect-providers | grep $oidc_id | cut -d "/" -f4`

4. Replace ARN of OIDC provider:
`cat >load-balancer-role-trust-policy.json <<EOF`
`{`
`    "Version": "2012-10-17",`
`    "Statement": [`
`        {`
`            "Effect": "Allow",`
`            "Principal": {`
`                "Federated": "arn:aws:iam::146966035049:oidc-provider/oidc.eks.ca-central-1.amazonaws.com/id/3F6C156494077F8F6C8C9CE135775027"`
`            },`
`            "Action": "sts:AssumeRoleWithWebIdentity",`
`            "Condition": {`
`                "StringEquals": {`
`                    "oidc.eks.ca-central-1.amazonaws.com/id/3F6C156494077F8F6C8C9CE135775027:aud": "sts.amazonaws.com",`
`                    "oidc.eks.ca-central-1.amazonaws.com/id/3F6C156494077F8F6C8C9CE135775027:sub": "system:serviceaccount:kube-system:aws-load-balancer-controller"`
`                }`
`            }`
`        }`
`    ]`
`}`
`EOF`

`aws iam create-role \`
`  --role-name AmazonEKSLoadBalancerControllerRole \`
`  --assume-role-policy-document file://"load-balancer-role-trust-policy.json"`

`aws iam attach-role-policy \`
`  --policy-arn arn:aws:iam::146966035049:policy/AWSLoadBalancerControllerIAMPolicy \`
`  --role-name AmazonEKSLoadBalancerControllerRole`

`cat >aws-load-balancer-controller-service-account.yaml <<EOF`
`apiVersion: v1`
`kind: ServiceAccount`
`metadata:`
`  labels:`
`    app.kubernetes.io/component: controller`
`    app.kubernetes.io/name: aws-load-balancer-controller`
`  name: aws-load-balancer-controller`
`  namespace: kube-system`
`  annotations:`
`    eks.amazonaws.com/role-arn: arn:aws:iam::146966035049:role/AmazonEKSLoadBalancerControllerRole`
`EOF`

`kubectl apply -f aws-load-balancer-controller-service-account.yaml`

`helm repo add eks https://aws.github.io/eks-charts`
`helm repo update eks`
`helm install aws-load-balancer-controller eks/aws-load-balancer-controller \`
`  -n kube-system \`
`  --set clusterName=my-face-recognition-cluster \`
`  --set serviceAccount.create=false \`
`  --set serviceAccount.name=aws-load-balancer-controller \`
`  --set region=ca-central-1 \`
`  --set vpcId=vpc-00c7118ed20fe71bf`

5. You need to create kubernetes secret resource from your env file:

`kubectl create secret generic my-face-recognition-env --from-env-file=../.env.aws -o yaml --dry-run=client >env-variables-secret.yaml`

`kubectl apply -f env-variables-secret.yaml`

6. To test if infrastructure is good:

`#kubectl create deployment nginx --image=nginx  --dry-run=client -o yaml > nginx-deploy.yaml`
`#kubectl apply -f nginx-deploy.yaml`

7. Create my-fra-deployment config:

`#kubectl create deployment my-fra --image=famaten/my-face-recognition-dev  --dry-run=client -o yaml > my-fra-deploy.yaml`

`kubectl apply -f my-fra-deploy.yaml`

`kubectl port-forward nginx-77b4fdf86c-xkxgx 4000:80 & check wget localhost:4000`

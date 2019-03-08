export myscript=/home/bhaumik/test.py
export spark_home=/home/bhaumik/spark-2.2.0-k8s-0.5.0-bin-2.7.3
export driverimage=bhaumikpandya/spark-driver-py
export executorimage=bhaumikpandya/spark-executor-py
export initimage=bhaumikpandya/spark-init
export tagname=latest
export serviceAccountName=spark
export appname=pysparkTest
export driverPodName=sparkdriver
export kubernetesNamespace=default
export mongoUri=mongodb://apiomat:Qh0Zw47u5t2x1@158.177.122.67:28017/Spark.temp?authSource=admin
export resourceStagingServerPort=10000
export resourceStagingServerLoadBalancerName=spark-resource-staging-server-load-balancer
export resourceStagingServerExternalIp=$(kubectl get svc -o jsonpath='{.items[?(@.metadata.name=="'${resourceStagingServerLoadBalancerName}'")].status.loadBalancer.ingress[*].ip}')
export resourceStagingServerLoadBalancerPodName=$(kubectl get po -l resource-staging-server-instance=default -o jsonpath='{.items[*].metadata.name}')
export resourceStagingServerInternalIp=$(kubectl get po -o jsonpath='{.items[?(@.metadata.name=="'$resourceStagingServerLoadBalancerPodName'")].spec.nodeName}')
export resourceStagingServerInternalPort=31000
export kubernetesuri=k8s://http://127.0.0.1:8001
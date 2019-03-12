export subjectscript=/child_process/test_1b.py
chmod +x ./submit_common.sh
sh ./submit_common.sh

# export driverimage=bhaumikpandya/spark-driver-py
# export executorimage=bhaumikpandya/spark-executor-py
# export initimage=bhaumikpandya/spark-init
# export tagname=latest
# export serviceAccountName=spark
# export now=$(date +'%s')
# export appname=cronjobstest_$(echo $now)
# export driverPodName=cronjobstestdriver_$(echo $now)
# export kubernetesNamespace=default
# export mongoUri=mongodb://apiomat:Qh0Zw47u5t2x1@158.177.122.67:28017/Spark.temp?authSource=admin
# export resourceStagingServerPort=10000
# export resourceStagingServerLoadBalancerName=spark-resource-staging-server-load-balancer
# export resourceStagingServerExternalIp=$(./kubectl get svc -o jsonpath='{.items[?(@.metadata.name=="'${resourceStagingServerLoadBalancerName}'")].status.loadBalancer.ingress[*].ip}')
# export resourceStagingServerLoadBalancerPodName=$(./kubectl get po -l resource-staging-server-instance=default -o jsonpath='{.items[*].metadata.name}')
# export resourceStagingServerInternalIp=$(./kubectl get po -o jsonpath='{.items[?(@.metadata.name=="'$resourceStagingServerLoadBalancerPodName'")].spec.nodeName}')
# export resourceStagingServerInternalPort=31000
# $SPARK_HOME/bin/spark-submit \
#   --packages=org.mongodb.spark:mongo-spark-connector_2.11:2.3.0 \
#   --deploy-mode cluster \
#   --master k8s://http://127.0.0.1:8001 \
#   --kubernetes-namespace $kubernetesNamespace \
#   --conf spark.executor.instances=5 \
#   --conf spark.executor.memory=2g \
#   --conf spark.driver.memory=4g \
#   --conf spark.driver.cores=8 \
#   --conf spark.kubernetes.executor.limit.cores=8 \
#   --conf spark.kubernetes.driver.limit.cores=8 \
#   --conf spark.app.name=$appname \
#   --conf spark.kubernetes.driver.pod.name=$driverPodName \
#   --conf spark.kubernetes.driver.docker.image=$driverimage:$tagname \
#   --conf spark.kubernetes.executor.docker.image=$executorimage:$tagname \
#   --conf spark.kubernetes.initcontainer.docker.image=$initimage:$tagname \
#   --conf spark.kubernetes.resourceStagingServer.uri=http://$resourceStagingServerExternalIp:$resourceStagingServerPort \
#   --conf spark.kubernetes.resourceStagingServer.internal.uri=http://$resourceStagingServerInternalIp:$resourceStagingServerInternalPort \
#   --conf spark.ssl.kubernetes.resourceStagingServer.enabled=false \
#   --conf spark.kubernetes.authenticate.driver.serviceAccountName=$serviceAccountName \
#   --conf spark.kubernetes.authenticate.resourceStagingServer.useServiceAccountCredential=false \
#   --conf spark.mongodb.input.uri=$mongoUri \
#   --conf spark.mongodb.output.uri=$mongoUri \
#   file:///child_process/test_1b.py

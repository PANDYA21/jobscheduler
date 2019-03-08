cd $spark_home
bin/spark-submit \
  --packages=org.mongodb.spark:mongo-spark-connector_2.11:2.3.0 \
  --deploy-mode cluster \
  --master k8s://http://127.0.0.1:8001 \
  --kubernetes-namespace $kubernetesNamespace \
  --conf spark.executor.instances=5 \
  --conf spark.executor.memory=2g \
  --conf spark.driver.memory=4g \
  --conf spark.driver.cores=8 \
  --conf spark.kubernetes.executor.limit.cores=8 \
  --conf spark.kubernetes.driver.limit.cores=8 \
  --conf spark.app.name=$appname \
  --conf spark.kubernetes.driver.pod.name=$driverPodName \
  --conf spark.kubernetes.driver.docker.image=$driverimage:$tagname \
  --conf spark.kubernetes.executor.docker.image=$executorimage:$tagname \
  --conf spark.kubernetes.initcontainer.docker.image=$initimage:$tagname \
  --conf spark.kubernetes.resourceStagingServer.uri=http://$resourceStagingServerExternalIp:$resourceStagingServerPort \
  --conf spark.kubernetes.resourceStagingServer.internal.uri=http://$resourceStagingServerInternalIp:$resourceStagingServerInternalPort \
  --conf spark.ssl.kubernetes.resourceStagingServer.enabled=false \
  --conf spark.kubernetes.authenticate.driver.serviceAccountName=$serviceAccountName \
  --conf spark.kubernetes.authenticate.resourceStagingServer.useServiceAccountCredential=false \
  --conf spark.mongodb.input.uri=$mongoUri \
  --conf spark.mongodb.output.uri=$mongoUri \
  --jars local:///opt/spark/examples/jars/spark-examples_2.11-2.2.0-k8s-0.5.0.jar \
  file:///home/bhaumik/test.py

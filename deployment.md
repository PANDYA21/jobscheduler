1. set env vars
    ```bash
    # repo
    SET repo=registry.eu-de.bluemix.net/datalake
    # image name
    SET imagename=cronjobs
    # image tag
    SET tagname=0.0.1
    # k8s deployment name
    SET appname=%imagename%
    # app listening port
    SET port=8080
    # k8s cluster-name
    SET clustername=mitegro-dev01
    ```
1. Build docker image
    ```bash
    cd <this_repo>
    wget https://github.com/apache-spark-on-k8s/spark/releases/download/v2.2.0-kubernetes-0.5.0/spark-2.2.0-k8s-0.5.0-bin-with-hadoop-2.7.3.tgz
    tar -xzvf spark-2.2.0-k8s-0.5.0-bin-with-hadoop-2.7.3.tgz
    docker build -t %repo%/%imagename%:%tagname% .
    ```
1. Push it to IBMCloud CR
    ```bash
    docker push %repo%/%imagename%:%tagname%
    ```
1. Login to `ibmcloud` cli and get k8s cluster config
    ```bash
    ibmcloud cs cluster-config %clustername%
    # this will print an export command, copy and execute it
    ```
1. Delete existing deployment
    ```bash
    kubectl delete deployment %appname%
    ```
1. Run a container as a deployment on k8s with that image
    ```bash
    kubectl run %appname% --image=%repo%/%imagename%:%tagname% --port=%port% --image-pull-policy=Always
    ```
1. Check if a pod is running
    ```bash
    kubectl get pods
    ```
1. Expose that deployment
    ```bash
    kubectl expose deployment %appname% --type=LoadBalancer
    ```
1. Look for the `%appname%` service
    ```bash
    kubectl get services
    ```
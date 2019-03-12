# Deployment
Following steps are to be executed on a linux machine with following requirements:
- ibmcloud cli
- kubectl cli
- docker

# Steps

1. set env vars
    ```bash
    # repo
    export oldrepo=registry.eu-de.bluemix.net/datalake
    export repo=de.icr.io/datalake
    # image name
    export imagename=cronjobs
    # image tag
    export tagname=0.1.0
    # k8s deployment name
    export appname=$imagename
    # app listening port
    export port=8080
    # k8s cluster-name
    export clustername=mitegro-qa01
    ```
1. Build docker image
    ```bash
    cd <this_repo>
    wget https://github.com/apache-spark-on-k8s/spark/releases/download/v2.2.0-kubernetes-0.5.0/spark-2.2.0-k8s-0.5.0-bin-with-hadoop-2.7.3.tgz
    tar -xzvf spark-2.2.0-k8s-0.5.0-bin-with-hadoop-2.7.3.tgz
    export ibm_user=your_ibm_id
    export ibm_pwd=your_password
    docker build \
        --build-arg IBM_USER=$ibm_user \
        --build-arg IBM_PWD=$ibm_pwd \
        -t $repo/$imagename:$tagname \
        .
    ```
1. Push it to IBMCloud CR
    ```bash
    docker push $repo/$imagename:$tagname
    ```
1. Login to `ibmcloud` cli and get k8s cluster config
    ```bash
    ibmcloud cs cluster-config $clustername
    # this will print an export command, copy and execute it
    ```
1. Delete existing deployment
    ```bash
    kubectl delete deployment $appname
    ```
1. Run a container as a deployment on k8s with that image
    ```bash
    kubectl run $appname --image=$oldrepo/$imagename:$tagname --port=$port --image-pull-policy=Always
    ```
1. Check if a pod is running
    ```bash
    kubectl get pods
    ```
1. Expose that deployment
    ```bash
    kubectl expose deployment $appname --type=LoadBalancer
    ```
1. Look for the `$appname` service
    ```bash
    kubectl get services
    ```
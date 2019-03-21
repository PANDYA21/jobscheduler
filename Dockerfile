# base java image
FROM openjdk:8-jre@sha256:143e37a40011243684acf5e0cca99db04cf2675dae54aefcc464d616916dd27b
# maintainer
MAINTAINER bhaumik.pandya@synaigy.com
# buid-arguments
ARG IBM_USER
ARG IBM_PWD
# listening port
EXPOSE 8080
# copy sources and node_modules folder
COPY . .
# set env vars
ENV SPARK_HOME spark-2.2.0-k8s-0.5.0-bin-2.7.3
ENV NODE_ENV production
# install nodejs, npm and yarn
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
  nodejs \
  yarn \
  && rm -rf /var/lib/apt/lists/*
# install imcloud cli
# RUN curl -fsSL https://clis.ng.bluemix.net/install/linux | sh
# login to ibmcloud
# RUN ibmcloud login -a api.eu-de.bluemix.net -u $IBM_USER -p $IBM_PWD -c 54fc328c810341d7890b50a2e9e54b2f
# setup ibmcloud container-service
# RUN ibmcloud plugin install container-service
# RUN ibmcloud cs cluster-config mitegro-qa01
# ENV KUBECONFIG=/root/.bluemix/plugins/container-service/clusters/mitegro-qa01/kube-config-fra02-mitegro-qa01.yml
# install kubectl cli
ADD https://storage.googleapis.com/kubernetes-release/release/v1.11.7/bin/linux/amd64/kubectl .
RUN chmod +x ./kubectl&&mv ./kubectl /usr/local/bin/kubectl
# RUN kubectl get nodes
# test pyspark-submit run
# RUN ./spark-2.2.0-k8s-0.5.0-bin-2.7.3/bin/spark-submit /child_process/test_1b.py
# # install nodejs dependencies (requires git cli)
# RUN npm install --no-cache git
# RUN npm install
# start nodejs app
CMD npm start

FROM node:10.5.0
EXPOSE 8080
COPY . .
RUN wget https://github.com/apache-spark-on-k8s/spark/releases/download/v2.2.0-kubernetes-0.5.0/spark-2.2.0-k8s-0.5.0-bin-with-hadoop-2.7.3.tgz
RUN tar -xzvf spark-2.2.0-k8s-0.5.0-bin-with-hadoop-2.7.3.tgz
RUN ls
RUN ls spark-2.2.0-k8s-0.5.0-bin-with-hadoop-2.7.3.tgz
ENV SPARK_HOME spark-2.2.0-k8s-0.5.0-bin-with-hadoop-2.7.3.tgz
CMD npm install
CMD npm start
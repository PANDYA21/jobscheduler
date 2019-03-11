FROM node:10.5.0
EXPOSE 8080
COPY . .
RUN ls
# set SPARK_HOME for internal use
ENV SPARK_HOME spark-2.2.0-k8s-0.5.0-bin-2.7.3
# Install OpenJDK-8
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;
# Fix certificate issues
RUN apt-get update && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;
# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
# Run test spark script
RUN ./spark-2.2.0-k8s-0.5.0-bin-2.7.3/bin/spark-submit ./child_process/tesst_1b.py
# install node dependencies
RUN npm install
CMD npm start
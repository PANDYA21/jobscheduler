FROM node:10.5.0
EXPOSE 8080
COPY . .
RUN ls
ENV SPARK_HOME spark-2.2.0-k8s-0.5.0-bin-2.7.3
RUN apt-get update && \
    # apt-get upgrade -y && \
    # apt-get install -y  software-properties-common && \
    add-apt-repository ppa:webupd8team/java -y && \
    apt-get update && \
    echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections && \
    apt-get install -y oracle-java7-installer && \
    apt-get clean
RUN ./spark-2.2.0-k8s-0.5.0-bin-2.7.3/bin/spark-submit ./child_process/tesst_1b.py
RUN npm install
CMD npm start
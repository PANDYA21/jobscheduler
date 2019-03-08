FROM node:10.5.0
EXPOSE 8080
COPY . .
RUN ls
ENV SPARK_HOME spark-2.2.0-k8s-0.5.0-bin-2.7.3
RUN ./spark-2.2.0-k8s-0.5.0-bin-2.7.3/bin/spark-submit ./child_process/tesst_1b.py
RUN npm install
CMD npm start
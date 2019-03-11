FROM openjdk:8-jre@sha256:143e37a40011243684acf5e0cca99db04cf2675dae54aefcc464d616916dd27b
EXPOSE 8080
COPY . .
ENV SPARK_HOME spark-2.2.0-k8s-0.5.0-bin-2.7.3
RUN ls

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
  nodejs \
  yarn \
  && rm -rf /var/lib/apt/lists/*

RUN ./spark-2.2.0-k8s-0.5.0-bin-2.7.3/bin/spark-submit ./child_process/tesst_1b.py

RUN npm install
CMD npm start

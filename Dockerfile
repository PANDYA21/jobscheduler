FROM node:10.5.0
EXPOSE 8080
COPY . .
RUN ls
# set SPARK_HOME for internal use
ENV SPARK_HOME spark-2.2.0-k8s-0.5.0-bin-2.7.3
# add a simple script that can auto-detect the appropriate JAVA_HOME value
# based on whether the JDK or only the JRE is installed
RUN { \
		echo '#!/bin/sh'; \
		echo 'set -e'; \
		echo; \
		echo 'dirname "$(dirname "$(readlink -f "$(which javac || which java)")")"'; \
	} > /usr/local/bin/docker-java-home \
	&& chmod +x /usr/local/bin/docker-java-home
ENV JAVA_HOME /usr/lib/jvm/java-1.8-openjdk/jre
ENV PATH $PATH:/usr/lib/jvm/java-1.8-openjdk/jre/bin:/usr/lib/jvm/java-1.8-openjdk/bin

ENV JAVA_VERSION 8u131
ENV JAVA_ALPINE_VERSION 8.131.11-r2

RUN set -x \
	&& apk add --no-cache \
		openjdk8-jre="$JAVA_ALPINE_VERSION" \
	&& [ "$JAVA_HOME" = "$(docker-java-home)" ]
# Run test spark script
RUN ./spark-2.2.0-k8s-0.5.0-bin-2.7.3/bin/spark-submit ./child_process/tesst_1b.py
# install node dependencies
RUN npm install
CMD npm start
FROM jenkins/jenkins:lts
USER root

# Install Node.js (v20)
RUN apt-get update && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install Docker CLI and Docker Compose
RUN apt-get install -y docker.io docker-compose

# Ensure docker group exists and add jenkins to it
RUN groupadd -f docker && usermod -aG docker jenkins

USER jenkins

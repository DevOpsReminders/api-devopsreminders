FROM node:16.18-slim

RUN bash -c "apt update -y && apt install git -y && apt clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp"
RUN git clone https://github.com/DevOpsReminders/api-devopsreminders.git /usr/src/app
WORKDIR /usr/src/app
RUN yarn install



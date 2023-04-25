# AdaGPT - An LLM chat terminal! 

# This is a demonstration app which brings together the power of OpenAI, Clerk, NextJS, and Salable, is an end-to-end working SaaS business! 

# Want to learn more about any of the vendors involved? Check them out! 

Clerk
NextJS
Salable
OpenAI

## Running the demo

#### Yarn
yarn install && yarn run dev

#### Docker
docker build -t adagpt-fe . && docker run -it -p 3000:3000 adagpt-fe

#### Fly.io
  curl -L https://fly.io/install.sh | sh
  export FLYCTL_INSTALL="/home/node/.fly"
  export PATH="$FLYCTL_INSTALL/bin:$PATH"
  flyctl auth login
  flytctl launch || flyctl deploy
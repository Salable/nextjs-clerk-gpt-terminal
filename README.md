# NextJS/Clerk/Salable - SaaS made Simple

# This is a demonstration app which brings together the power of Clerk, NextJS, and Salable, is an end-to-end working SaaS business! 

# Want to learn more about any of the vendors involved? Check them out! 

Clerk
NextJS
Salable

## Running the demo

#### Yarn
yarn install && yarn run dev

#### Docker
docker build -t adagpt-fe . && docker run -it -p 3000:3000 adagpt-fe

#### fly.io
  curl -L https://fly.io/install.sh | sh
  export FLYCTL_INSTALL="/home/node/.fly"
  export PATH="$FLYCTL_INSTALL/bin:$PATH"
  flyctl auth login
  flytctl launch || flyctl deploy
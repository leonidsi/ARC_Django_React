#!/usr/bin/env bash


export APPLICATION_NAME=${1}
export ENVIRONMENT=${2}
export APP_VERSION=${3}


if [ "$ENVIRONMENT" == "dev" ]; then
  export REPLICAS=1
  export DOMAIN="smartsheets-${ENVIRONMENT}"
  export ENVIRONMENT="stg"
  export BRANCH="dev"
  export NAMESPACE="smartsheets-frontend-stg"
elif [ "$ENVIRONMENT" == "master" ]; then
  export REPLICAS=2
  export DOMAIN="smartsheets"
  export ENVIRONMENT="prd"
  export BRANCH="master"
  export NAMESPACE="smartsheets-frontend-prd"
else
  echo "Missing arguments for deploy.sh. Please review this"
  exit 1
fi

for f in deployments/*.yaml
do
 envsubst < $f > ".generated/$(basename $f)"
done

kubectl apply -f .generated/

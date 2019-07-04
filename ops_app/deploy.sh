#!/usr/bin/env bash


export APPLICATION_NAME=${1}
export ENVIRONMENT=${2}
export APP_VERSION=${3}


if [ "$ENVIRONMENT" == "develop" ]; then
  export REPLICAS=1
  export DOMAIN="ops-dev"
  export ENVIRONMENT="dev"
  export BRANCH="develop"
  export NAMESPACE="ops-dev"
elif [ "$ENVIRONMENT" == "master" ]; then
  export REPLICAS=2
  export DOMAIN="ops"
  export ENVIRONMENT="prd"
  export BRANCH="master"
  export NAMESPACE="ops-prd"
else
  echo "Missing arguments for deploy.sh. Please review this"
  exit 1
fi

for f in deployments/*.yaml
do
 envsubst < $f > ".generated/$(basename $f)"
done

kubectl apply -f .generated/

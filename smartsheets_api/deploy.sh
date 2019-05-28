#!/usr/bin/env bash


export APPLICATION_NAME=${1}
export ENVIRONMENT=${2}
export APP_VERSION=${3}


if [ "$ENVIRONMENT" == "develop" ]; then
  export REPLICAS=1
  export ENVIRONMENT="dev"
  export BRANCH="develop"
  export DOMAIN="smartsheets-api-${ENVIRONMENT}"
  export NAMESPACE="smartsheets-api-dev"
elif [ "$ENVIRONMENT" == "master" ]; then
  export REPLICAS=2
  export ENVIRONMENT="prd"
  export BRANCH="master"
  export DOMAIN="smartsheets-api-${ENVIRONMENT}"
  export NAMESPACE="smartsheets-api-prd"
else
  echo "Missing arguments for deploy.sh. Please review this"
  exit 1
fi


## Job: cleanup previous job, run dbmigration, check if everythign went fine and then deploy.
echo '=== Cleanup previous Job'
cat deployments/jobs/*.yaml| envsubst | kubectl delete -f - 2&> /dev/null || true

echo '=== Deploy Job'
cat deployments/jobs/*.yaml| envsubst | kubectl create -f -

echo '=== Wait for Job to complete'
while [ true ]; do
  phase=`kubectl get pods -n ${NAMESPACE} --selector="name=${APPLICATION_NAME}-migration" -o 'jsonpath={.items[0].status.phase}' || 'false'`
  if [[ "$phase" != 'Pending' ]]; then
    break
  fi
done

echo '=== Check Job result'
kubectl attach -n ${NAMESPACE} $(kubectl get pods -n ${NAMESPACE} --selector="name=${APPLICATION_NAME}-migration" -o 'jsonpath={.items[0].metadata.name}')

TIMEOUT=45
ITERATIONS=0
succeeded=0
failed=0
while [ true ]; do
  succeeded=`kubectl get jobs -n ${NAMESPACE} --selector="name=${APPLICATION_NAME}-migration" -o 'jsonpath={.items[0].status.succeeded}'`
  failed=`kubectl get jobs -n ${NAMESPACE} --selector="name=${APPLICATION_NAME}-migration" -o 'jsonpath={.items[0].status.failed}'`
  if [[ "$succeeded" == "1" ]]; then
    break
  elif [[ "$failed" -gt "0" ]]; then
    kubectl describe job -n ${NAMESPACE} ${APPLICATION_NAME}-migration
    kubectl delete job -n ${NAMESPACE} ${APPLICATION_NAME}-migration
    echo '!!! Deploy canceled. ${APPLICATION_NAME}-migration failed.'
    exit 1
  fi
  let "ITERATIONS++"
  if [[ "$ITERATIONS" -gt "$TIMEOUT" ]]; then
    echo "!!! Deploy canceled. Cannot get ${APPLICATION_NAME}-migration status."
    exit 1
  fi
done


for f in deployments/*.yaml
do
 envsubst < $f > ".generated/$(basename $f)"
done

kubectl apply -f .generated/

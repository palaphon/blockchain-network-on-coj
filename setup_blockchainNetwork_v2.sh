#!/bin/sh

if [ -d "${PWD}/configFiles" ]; then
    KUBECONFIG_FOLDER=${PWD}/configFiles
else
    echo "Configuration files are not found."
    exit
fi

# Creating Persistant Volume
echo -e "\nCreating volume"
if [ "$(kubectl get pvc | grep shared-pvc | awk '{print $2}')" != "Bound" ]; then
    echo "The Persistant Volume does not seem to exist or is not bound"
    echo "Creating Persistant Volume"

    echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/createVolume.yaml"
    kubectl create -f ${KUBECONFIG_FOLDER}/createVolume.yaml
    sleep 5

    if [ "kubectl get pvc | grep shared-pvc | awk '{print $3}'" != "shared-pv" ]; then
        echo "Success creating Persistant Volume"
    else
        echo "Failed to create Persistant Volume"
    fi
else
    echo "The Persistant Volume exists, not creating again"
fi

# # Copy the required files(configtx.yaml, cruypto-config.yaml, sample chaincode etc.) into volume
# echo -e "\nCreating Copy artifacts job."
# echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/copyArtifactsJob.yaml"
# kubectl create -f ${KUBECONFIG_FOLDER}/copyArtifactsJob.yaml

# pod=$(kubectl get pods --selector=job-name=copyartifacts --output=jsonpath={.items..metadata.name})

# podSTATUS=$(kubectl get pods --selector=job-name=copyartifacts --output=jsonpath={.items..phase})

# while [ "${podSTATUS}" != "Running" ]; do
#     echo "Wating for container of copy artifact pod to run. Current status of ${pod} is ${podSTATUS}"
#     sleep 5;
#     if [ "${podSTATUS}" == "Error" ]; then
#         echo "There is an error in copyartifacts job. Please check logs."
#         exit 1
#     fi
#     podSTATUS=$(kubectl get pods --selector=job-name=copyartifacts --output=jsonpath={.items..phase})
# done

# echo -e "${pod} is now ${podSTATUS}"
# echo -e "\nStarting to copy artifacts in persistent volume."

# # rm -f artifacts_complete
# #fix for this script to work on icp and ICS
# # kubectl cp ./artifacts $pod:/shared/
# echo "Waiting for 10 more seconds for copying artifacts to avoid any network delay"
# sleep 10
# # echo "Add artifacts_complete status file"
# # touch artifacts_complete
# # kubectl cp artifacts_complete $pod:/shared/

# JOBSTATUS=$(kubectl get jobs |grep "copyartifacts" |awk '{print $2}')
# while [ "${JOBSTATUS}" != "1/1" ]; do
#     echo "Waiting for copyartifacts job to complete"
#     sleep 1;
#     PODSTATUS=$(kubectl get pods | grep "copyartifacts" | awk '{print $3}')
#         if [ "${PODSTATUS}" == "Error" ]; then
#             echo "There is an error in copyartifacts job. Please check logs."
#             exit 1
#         fi
#     JOBSTATUS=$(kubectl get jobs |grep "copyartifacts" |awk '{print $2}')
# done
# echo "Copy artifacts job completed"


# # Generate Network artifacts using configtx.yaml and crypto-config.yaml
# echo -e "\nGenerating the required artifacts for Blockchain network"
# echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/generateArtifactsJob.yaml"
# kubectl create -f ${KUBECONFIG_FOLDER}/generateArtifactsJob.yaml

# JOBSTATUS=$(kubectl get jobs |grep utils|awk '{print $2}')
# while [ "${JOBSTATUS}" != "1/1" ]; do
#     echo "Waiting for generateArtifacts job to complete"
#     sleep 1;
#     # UTILSLEFT=$(kubectl get pods | grep utils | awk '{print $2}')
#     UTILSSTATUS=$(kubectl get pods | grep "utils" | awk '{print $3}')
#     if [ "${UTILSSTATUS}" == "Error" ]; then
#             echo "There is an error in utils job. Please check logs."
#             exit 1
#     fi
#     # UTILSLEFT=$(kubectl get pods | grep utils | awk '{print $2}')
#     JOBSTATUS=$(kubectl get jobs |grep utils|awk '{print $2}')
# done


# Generate Network artifacts using crypto-config.yaml
echo -e "\nGenerating Cryptogen the required artifacts for Blockchain network"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/generateArtifactsCryptogenJob.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/generateArtifactsCryptogenJob.yaml

JOBSTATUS=$(kubectl get jobs |grep utils-crypto|awk '{print $2}')
while [ "${JOBSTATUS}" != "1/1" ]; do
    echo "Waiting for generateArtifactsCryptogenJob job to complete"
    sleep 1;
    # UTILSLEFT=$(kubectl get pods | grep utils-crypto | awk '{print $2}')
    UTILSSTATUS=$(kubectl get pods | grep "utils-crypto" | awk '{print $3}')
    if [ "${UTILSSTATUS}" == "Error" ]; then
            echo "There is an error in utils-crypto job. Please check logs."
            exit 1
    fi
    # UTILSLEFT=$(kubectl get pods | grep utils-crypto | awk '{print $2}')
    JOBSTATUS=$(kubectl get jobs |grep utils-crypto|awk '{print $2}')
done


# Create services for all peers, ca, orderer
echo -e "\nCreating Services for blockchain network"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/blockchain-services.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/blockchain-services.yaml


# Create ca using Kubernetes Deployments
echo -e "\nCreating new Deployment to create four peers in network"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/caDeployment.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/caDeployment.yaml

CASTATUS=$(kubectl get pods |grep blockchain-ca|awk '{print $3}')
while [ "${CASTATUS}" != "Running" ]; do
    echo "Now blockchain-ca is ${CASTATUS}. Waiting for blockchain-ca to Running"
    sleep 1;
    CASTATUS=$(kubectl get pods | grep blockchain-ca | awk '{print $3}')
    if [ "${CASTATUS}" == "Error" ]; then
            echo "There is an error in blockchain-ca. Please check logs."
            exit 1
    fi
    CASTATUS=$(kubectl get pods |grep blockchain-ca|awk '{print $3}')
done

pod=$(kubectl get pods | grep blockchain-ca | awk '{print $1}')

kubectl cp $pod:/etc/hyperledger/fabric-ca-server/IssuerPublicKey /nfsshare/shared/crypto-config/IssuerPublicKey
kubectl cp $pod:/etc/hyperledger/fabric-ca-server/IssuerRevocationPublicKey /nfsshare/shared/crypto-config/RevocationPublicKey

# Generate Network artifacts using configtx.yaml
echo -e "\nGenerating Configtxgen the required artifacts for Blockchain network"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/generateArtifactsConfigtxgenJob.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/generateArtifactsConfigtxgenJob.yaml

JOBSTATUS=$(kubectl get jobs |grep utils-configtx|awk '{print $2}')
while [ "${JOBSTATUS}" != "1/1" ]; do
    echo "Waiting for generateArtifactsConfigtxgenJob job to complete"
    sleep 1;
    # UTILSLEFT=$(kubectl get pods | grep utils-configtx | awk '{print $2}')
    UTILSSTATUS=$(kubectl get pods | grep "utils-configtx" | awk '{print $3}')
    if [ "${UTILSSTATUS}" == "Error" ]; then
            echo "There is an error in utils-configtx job. Please check logs."
            exit 1
    fi
    # UTILSLEFT=$(kubectl get pods | grep utils-configtx | awk '{print $2}')
    JOBSTATUS=$(kubectl get jobs |grep utils-configtx|awk '{print $2}')
done


# Create peers, orderer using Kubernetes Deployments
echo -e "\nCreating new Deployment to create four peers in network"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/peersDeployment.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/peersDeployment.yaml

echo "Checking if all deployments are ready"

NUMPENDING=$(kubectl get deployments | grep blockchain | awk '{print $2}' | grep 0/1 | wc -l | awk '{print $1}')
while [ "${NUMPENDING}" != "0" ]; do
    echo "Waiting on pending deployments. Deployments pending = ${NUMPENDING}"
    NUMPENDING=$(kubectl get deployments | grep blockchain | awk '{print $2}' | grep 0/1 | wc -l | awk '{print $1}')
    sleep 1
done

echo "Waiting for 15 seconds for peers and orderer to settle"
sleep 15

# CHANNEL_NAME = type1
# Generate channel artifacts using configtx.yaml and then create channel
echo -e "\nCreating channel transaction artifact and a channel type1"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/create_channel_type1.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/create_channel_type1.yaml

JOBSTATUS=$(kubectl get jobs |grep createchanneltype1 |awk '{print $2}')
while [ "${JOBSTATUS}" != "1/1" ]; do
    echo "Waiting for createchanneltype1 job to be completed"
    sleep 1;
    if [ "$(kubectl get pods | grep createchanneltype1 | awk '{print $3}')" == "Error" ]; then
        echo "Create Channel Failed"
        exit 1
    fi
    JOBSTATUS=$(kubectl get jobs |grep createchanneltype1 |awk '{print $2}')
done
echo "Create Channel type1 Completed Successfully"

echo "Waiting for 15 seconds for orderer to settle"
sleep 15

# CHANNEL_NAME = type2
# Generate channel artifacts using configtx.yaml and then create channel
echo -e "\nCreating channel transaction artifact and a channel type2"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/create_channel_type2.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/create_channel_type2.yaml

JOBSTATUS=$(kubectl get jobs |grep createchanneltype2 |awk '{print $2}')
while [ "${JOBSTATUS}" != "1/1" ]; do
    echo "Waiting for createchanneltype2 job to be completed"
    sleep 1;
    if [ "$(kubectl get pods | grep createchanneltype2 | awk '{print $3}')" == "Error" ]; then
        echo "Create Channel Failed"
        exit 1
    fi
    JOBSTATUS=$(kubectl get jobs |grep createchanneltype2 |awk '{print $2}')
done
echo "Create Channel type2 Completed Successfully"

echo "Waiting for 15 seconds for orderer to settle"
sleep 15

# CHANNEL_NAME = type3
# Generate channel artifacts using configtx.yaml and then create channel
echo -e "\nCreating channel transaction artifact and a channel type3"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/create_channel_type3.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/create_channel_type3.yaml

JOBSTATUS=$(kubectl get jobs |grep createchanneltype3 |awk '{print $2}')
while [ "${JOBSTATUS}" != "1/1" ]; do
    echo "Waiting for createchanneltype3 job to be completed"
    sleep 1;
    if [ "$(kubectl get pods | grep createchanneltype3 | awk '{print $3}')" == "Error" ]; then
        echo "Create Channel Failed"
        exit 1
    fi
    JOBSTATUS=$(kubectl get jobs |grep createchanneltype3 |awk '{print $2}')
done
echo "Create Channel type3 Completed Successfully"

echo "Waiting for 15 seconds for orderer to settle"
sleep 15

# Join all peers on a channel
echo -e "\nCreating joinchannel job"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/join_channel.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/join_channel.yaml

JOBSTATUS=$(kubectl get jobs |grep joinchannel |awk '{print $2}')
while [ "${JOBSTATUS}" != "1/1" ]; do
    echo "Waiting for joinchannel job to be completed"
    sleep 1;
    if [ "$(kubectl get pods | grep joinchannel | awk '{print $3}')" == "Error" ]; then
        echo "Join Channel Failed"
        exit 1
    fi
    JOBSTATUS=$(kubectl get jobs |grep joinchannel |awk '{print $2}')
done
echo "Join Channel Completed Successfully"

echo "Waiting for 15 seconds for joinchannel to ready"
sleep 15

# Install chaincode on each peer
echo -e "\nCreating installchaincode job"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/chaincode_install.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/chaincode_install.yaml

JOBSTATUS=$(kubectl get jobs |grep chaincodeinstall |awk '{print $2}')
while [ "${JOBSTATUS}" != "1/1" ]; do
    echo "Waiting for chaincodeinstall job to be completed"
    sleep 1;
    if [ "$(kubectl get pods | grep chaincodeinstall | awk '{print $3}')" == "Error" ]; then
        echo "Chaincode Install Failed"
        exit 1
    fi
    JOBSTATUS=$(kubectl get jobs |grep chaincodeinstall |awk '{print $2}')
done
echo "Chaincode Install Completed Successfully"

echo "Waiting for 15 seconds for chaincodeinstall ready"
sleep 15

# Instantiate chaincode on channel
echo -e "\nCreating chaincodeinstantiate job"
echo "Running: kubectl create -f ${KUBECONFIG_FOLDER}/chaincode_instantiate.yaml"
kubectl create -f ${KUBECONFIG_FOLDER}/chaincode_instantiate.yaml

JOBSTATUS=$(kubectl get jobs |grep chaincodeinstantiate |awk '{print $2}')
while [ "${JOBSTATUS}" != "1/1" ]; do
    echo "Waiting for chaincodeinstantiate job to be completed"
    sleep 1;
    if [ "$(kubectl get pods | grep chaincodeinstantiate | awk '{print $3}')" == "Error" ]; then
        echo "Chaincode Instantiation Failed"
        exit 1
    fi
    JOBSTATUS=$(kubectl get jobs |grep chaincodeinstantiate |awk '{print $2}')
done
echo "Chaincode Instantiation Completed Successfully"

sleep 15
echo -e "\nNetwork Setup Completed !!"

# Granting Azure AD User Access to AKS Cluster using CLI

## Pre-requisites:
Before you begin, make sure that you have the following pre-requisites installed and configured:

- Azure CLI: You can download it from the official Microsoft website [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).
- kubectl: You can download it from the official Kubernetes website [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

## Steps:

### Step 1: Log in to the Azure CLI

Log in to the Azure CLI using the following command:

```shell
az login
```

This will open a browser window where you can enter your Azure credentials to authenticate.

### Step 2: Get the credentials for the AKS cluster

To access an AKS cluster, you must download the credentials and configure the Kubernetes CLI to use them. Use the following command to get the credentials:

```shell
az aks get-credentials --admin  --resource-group <resource_group_name> --name <aks_cluster_name>
```

Replace `<resource_group_name>` with the name of the resource group that contains the AKS cluster and `<aks_cluster_name>` with the name of the AKS cluster.

#### Accessing BambuGO Development Cluster

To access `bambuGo` developer environment (develop - namespace), use the following:

- `<resource_group_name>` - bambu-go-develop-rg
- `<aks_cluster_name>` - bambu-go-develop-cluster

```shell
az aks get-credentials --admin  --resource-group bambu-go-develop-rg --name bambu-go-develop-cluster
```

### Step 3: Check Kubernetes cluster access

To verify your access to the AKS cluster, run the following command to check the running nodes:

```shell
kubectl get nodes
```

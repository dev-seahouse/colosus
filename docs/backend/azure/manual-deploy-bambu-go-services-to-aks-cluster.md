# Manual Deploy BambuGo Services to AKS Cluster

## Pre-requisites:

Before you begin, ensure that the following prerequisites are met:

- Docker is installed on your machine. If not, [download](https://www.docker.com/products/docker-desktop) and install
  Docker for your platform.
- Azure CLI: You can download it from the official Microsoft
  website [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).
- kubectl: You can download it from the official Kubernetes
  website [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
- jq:  You can download it from the jq website [here](https://stedolan.github.io/jq/download/).

## Steps:

### Step 1: Log in to the Azure CLI
Log in to the Azure CLI using the following command:

```shell
az login
```

This will open a browser window where you can enter your Azure credentials to authenticate.

### Step 2: Log in to your Azure Container Registry instance

Log in to your Azure Container Registry instance using the Azure CLI. Run the following command:

```shell
az acr login --name <your-acr-name>
```

Replace `<your-acr-name>` with the name of your ACR instance.

To access `bambuGo` Azure Container Registry instance, use the following:

- `<your-acr-name>` - bambugoacr

```shell
az acr login --name bambugoacr
```

### Step 3: Build the multi-platform Docker image
Build the multi-platform Docker image using the Docker CLI. To build the image, run the following command:

```shell
docker buildx build –f <dockerfile-path> --platform linux/amd64,linux/arm64 -t <your-acr-name>.azurecr.io/<image-name>:<tag> . --push
```

Replace `<your-acr-name>`, `<image-name>`,  `<dockerfile-path>`, and `<tag>` with the desired names for your ACR
repository,
Docker image, and tag. This command builds the image for both Linux and Windows platforms using the `buildx` command,
tags
the image with your ACR name and image name, and pushes the image to Azure ACR using the --push flag.

Please use the below information when you build images for different services.

| <your-acr-name> | <image-name>      | <dockerfile-path>                   | Repository                                              |
|-----------------|-------------------|-------------------------------------|---------------------------------------------------------|
| bambugoacr      | colossus          | ./apps/colossus/Dockerfile          | https://bitbucket.org/bambudeveloper/colossus/src/main/ |
| bambugoacr      | colossus-db-setup | ./apps/colossus/db.setup.Dockerfile | https://bitbucket.org/bambudeveloper/colossus/src/main/ |
| bambugoacr      | proxy             | ./Dockerfile                        | https://bitbucket.org/bambudeveloper/proxy/src/main/    |

### Step 4: Get the SHA digest for the relevant platform
To get the SHA digest for the relevant platform, run the following command:

```shell
az acr repository show-manifests --name <your-acr-name> --repository <image-name> --detail --output json | jq -r '.[] | select(.platform == "<platform>") | .digest'
```

Replace <your-acr-name>, <image-name>, and <platform> with the name of your ACR instance, the name of the Docker image,
and the platform you want to get the digest for (e.g., linux/amd64, linux/arm64).

### Step 5: Update your Kubernetes configuration
Update your Kubernetes configuration to use the SHA digest for the relevant platform. This can be done by updating the
image field in your Kubernetes YAML file to include the SHA digest.

### Step 6: Apply the updated Kubernetes configuration
Apply the updated Kubernetes configuration using the kubectl apply command:

```shell
kubectl apply -f <path/to/kubernetes-yaml-file> -n <namespace>
```

Replace <path/to/kubernetes-yaml-file> with the path to your Kubernetes YAML file and replace <namespace> with the relevant namespace.

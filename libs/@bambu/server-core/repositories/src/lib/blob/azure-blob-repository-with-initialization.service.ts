import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import {
  IAzureBlobStorageIntegrationConfigDto,
  IDefaultServerConfig,
} from '@bambu/server-core/configuration';
import { JsonUtils } from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID as uuidv4 } from 'crypto';
import * as _ from 'lodash';
import { BlobRepositoryServiceBase } from './blob-repository.service.base';

// We when filenames are alphanumeric characters, spaces, underscores and periods only, we also support preserving the filename.
// const ALLOWED_REGEX = /^[A-Za-z0-9. _]*$/;

// https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-upload-javascript
// This azure blob repository implementation initializes a container to the state that is required for the application to work during constructor execution, should it detects that Keycloak is likely in its initial state.
@Injectable()
export class AzureBlobRepositoryWithInitializationService
  implements BlobRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(
    AzureBlobRepositoryWithInitializationService.name
  );
  readonly #azureBlobStorageConfig: IAzureBlobStorageIntegrationConfigDto['azureBlobStorage'];

  readonly #containerClient: Promise<ContainerClient>;

  readonly #env: string;

  constructor(
    private readonly config: ConfigService<IDefaultServerConfig>,
    private readonly azureBlobStorageConfig: ConfigService<IAzureBlobStorageIntegrationConfigDto>
  ) {
    this.#azureBlobStorageConfig = this.azureBlobStorageConfig.get(
      'azureBlobStorage',
      {
        infer: true,
      }
    ) as IAzureBlobStorageIntegrationConfigDto['azureBlobStorage'];
    this.#env = this.config.get('env', { infer: true }) as string;

    const containerClient = this.#initializeContainerClient();
    this.#containerClient = this.#initializeContainer(containerClient);
  }

  async DeleteBlob(blobUrl: string, uploadPath?: string): Promise<void> {
    const logPrefix = `${this.DeleteBlob.name} -`;
    try {
      // TODO: assert correct hostnames
      const blobUrlObj = new URL(blobUrl);
      const containerClient = await this.#containerClient;
      const containerUrlObj = new URL(containerClient.url);
      if (blobUrlObj.hostname !== containerUrlObj.hostname) {
        // TODO: normalize errors
        throw new Error(
          `Blob ${blobUrl} and ${containerClient.url} have different hostnames`
        );
      }
      if (!blobUrlObj.pathname.startsWith(containerUrlObj.pathname + '/')) {
        throw new Error(
          `Blob ${blobUrl} is not in container ${containerUrlObj}`
        );
      }
      const blobPath: string = blobUrlObj.pathname.slice(
        containerUrlObj.pathname.length + 1
      );
      const pathPrefix = uploadPath;
      if (pathPrefix && !blobPath.startsWith(pathPrefix)) {
        throw new Error(`Blob ${blobUrl} is not in path ${pathPrefix}`);
      }

      this.#logger.debug(
        `${logPrefix} Deleting blob ${blobPath} from container ${containerClient.url}`
      );
      const blockBlobClient = await containerClient.getBlockBlobClient(
        blobPath
      );
      await blockBlobClient.delete();
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async CreatePublicBlobFromLocalFile(
    localFilePath: string,
    contentType: string,
    uploadPath?: string,
    originalFilename?: string
  ): Promise<string> {
    const logPrefix = `${this.CreatePublicBlobFromLocalFile.name} -`;
    try {
      const suffix = _.last(localFilePath.split('.'));
      const filename: string = [
        uploadPath ?? '',
        uuidv4(),
        suffix ? `.${suffix}` : '',
      ].join('');
      const blockBlobClient = await (
        await this.#containerClient
      ).getBlockBlobClient(filename);
      // const filenameParameter =
      //   originalFilename && originalFilename.match(ALLOWED_REGEX)
      //     ? `; filename="${originalFilename}"`
      //     : '';
      const metadata = originalFilename ? { originalFilename } : undefined;
      await blockBlobClient.uploadFile(localFilePath, {
        blobHTTPHeaders: {
          blobContentType: contentType,
        },
        metadata,
      });
      return blockBlobClient.url;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  #initializeContainerClient(): ContainerClient {
    const logPrefix = `${this.#initializeContainerClient.name} -`;
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        this.#azureBlobStorageConfig.tenantAssets.connString
      );
      return blobServiceClient.getContainerClient(
        this.#azureBlobStorageConfig.tenantAssets.containerName
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async #initializeContainer(
    containerClient: ContainerClient
  ): Promise<ContainerClient> {
    const logPrefix = `${this.#initializeContainer.name} -`;
    try {
      if (this.#env === 'development') {
        const res = await containerClient.createIfNotExists();
        containerClient.setAccessPolicy('blob');
        // e.g. Container was created successfully. azure connection requestId: undefined URL: https://tennantbrandingassetsdev.blob.core.windows.net/%24web
        this.#logger.debug(
          `${logPrefix} Container was created successfully. azure connection requestId: ${res.requestId} URL: ${containerClient.url}`
        );
        return containerClient;
      } else {
        if (!(await containerClient.exists())) {
          // If this is not the development environment, throw an error.
          throw new Error(
            `Container ${containerClient.url} does not exist and this is not the development environment. Please create it.`
          );
        }
      }

      return containerClient;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }
}

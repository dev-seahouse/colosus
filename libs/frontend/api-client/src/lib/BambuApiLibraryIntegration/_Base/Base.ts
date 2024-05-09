import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';

/**
 * - Base API class for API Library API related classes
 * - This class is responsible for creating an axios instance with the extended API Library integration URL
 */
export class BambuApiLibraryIntegrationBaseApi {
  constructor(
    protected readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v1/bambu-api-library-integration',
    })
  ) {}
}

export default BambuApiLibraryIntegrationBaseApi;

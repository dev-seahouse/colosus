import type {
  IBambuApiLibraryGetProjectionsRequestDto,
  IBambuApiLibraryGetProjectionsResponseDto,
} from '@bambu/shared';

import BambuApiLibraryIntegrationBaseApi from '../_Base/Base';

export type GetProjectionsRequestDto = IBambuApiLibraryGetProjectionsRequestDto;
export type GetProjectionsResponseDto =
  IBambuApiLibraryGetProjectionsResponseDto;
export { EnumBambuApiLibraryGetProjectionsRequestCompoundingValue as GetProjectionsCompoundingEnums } from '@bambu/shared';

export class BambuApiLibraryIntegrationGraphApi extends BambuApiLibraryIntegrationBaseApi {
  constructor(private readonly apiPath = '/graph-apis') {
    super();
  }

  /**
   * Provide access to the Projection Graph API in Bambu API Library
   *
   * - {@link http://localhost:9000/openapi#/Bambu%20API%20Library/GetProjections GetProjections}.
   */
  public async getProjections(req: GetProjectionsRequestDto) {
    return this.axios.post<GetProjectionsResponseDto>(
      `${this.apiPath}/projections`,
      req
    );
  }
}

export default BambuApiLibraryIntegrationGraphApi;

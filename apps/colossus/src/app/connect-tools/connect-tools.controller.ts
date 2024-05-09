import {
  Controller,
  Version,
  HttpCode,
  Logger,
  Query,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConnectToolsServiceBase } from '@bambu/server-connect/domains';
import { Public } from '@bambu/server-core/common-guards';
import { TenantCentralDbRepositoryService } from '@bambu/server-core/repositories';
// import { AuthenticationServiceBase } from '@bambu/server-core/domains';

@ApiTags('Connect')
@Controller('connect/tools')
export class ConnectToolsController {
  readonly #logger = new Logger(ConnectToolsController.name);
  constructor(private readonly connectToolsService: ConnectToolsServiceBase) {}

  // TODO: figure out how to gracefully handle when the query parameter is not provided
  @Public()
  @Version('1')
  @Get('realm-of-subdomain')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Returns the predicted tenant realm corresponding to a subdomain in Connect.',
    operationId: 'TenantRealmOfSubdomain',
  })
  public async TenantIdOfSubdomain(
    @Query('subdomain') subdomain: string
  ): Promise<string> {
    const tenantId = await this.connectToolsService.TenantIdOfSubdomain(
      subdomain
    );
    return tenantId;
  }

  // TODO: figure out how to gracefully handle when the query parameter is not provided
  @Public()
  @Version('1')
  @Get('realm-id-of-advisor-username')
  @HttpCode(200)
  @ApiOperation({
    summary:
      "Returns the predicted realm id corresponding to an advisor's username in Connect.",
    operationId: 'RealmIdOfAdvisorUsername',
  })
  public async RealmIdOfAdvisorUsername(
    @Query('username') username: string
  ): Promise<string> {
    return await this.connectToolsService.PredictTenantNameFromAdvisorUsername(
      username
    );
  }
}

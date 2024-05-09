import {
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { Public } from '@bambu/server-core/common-guards';

import { BambuWebhooksService } from './bambu-webhooks.service';

@ApiTags('Webhooks')
export class BambuWebhooksController {
  constructor(private webhooksService: BambuWebhooksService) {}

  @Public()
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({
    status: 400,
    description: 'Invalid Webhook Call.',
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiOperation({
    summary: 'handles webhook callbacks',
    description: 'determines the type of webhook and handles appropriately',
  })
  @ApiBody({
    description: 'the content of the webhook',
    required: false,
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
        },
      },
    },
    examples: {
      ['Mock Request']: {
        description:
          'This is just here to make the Swagger example look better.',
        value: {
          type: 'This is not real payload, this is just to make the Swagger doc look better.',
        },
      },
    },
  })
  @Post(':path?')
  @HttpCode(HttpStatus.OK)
  handleWebhook(
    @Param('path') path: string | undefined,
    @Headers() headers: Record<string, unknown>,
    @Body() body: unknown,
    @Query() query: Record<string, unknown>,
    @Req() request: RawBodyRequest<Request>
  ) {
    const { rawBody } = request;
    return this.webhooksService.handleWebhook(
      path,
      headers,
      body,
      rawBody,
      query
    );
  }
}

// noinspection ES6PreferShortImport
// https://stackoverflow.com/questions/58843038/how-to-manually-test-input-validation-with-nestjs-and-class-validator

import { plainToInstance } from 'class-transformer';
import { ConnectTenantSetGoalTypesRequestDto } from './connect-tenant-set-goal-types-request.dto';
import { validate } from 'class-validator';

describe('ConnectTenantSetGoalTypesRequestDto', () => {
  it('should have well-formed bodies pass validation', async () => {
    expect.assertions(1);
    const goalTypeIds = [
      'fb371304-b9b3-430d-bdf9-8a1c19cc0b93',
      'c6c9b136-47e6-4f56-91c3-77595907a67b',
    ];
    const exampleBody = {
      goalTypeIds,
    };
    const exampleDto = plainToInstance(
      ConnectTenantSetGoalTypesRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
  it('should expect color fields to be 6-hex-digit color strings', async () => {
    expect.assertions(2);
    const goalTypeIds = ['hehe', 'c6c9b136-47e6-4f56-91c3-77595907a67b'];
    const exampleBody = {
      goalTypeIds,
    };
    const exampleDto = plainToInstance(
      ConnectTenantSetGoalTypesRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toHaveProperty('constraints.isUuid');
  });
});

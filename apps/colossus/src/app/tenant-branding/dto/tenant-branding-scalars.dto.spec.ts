// noinspection ES6PreferShortImport
// https://stackoverflow.com/questions/58843038/how-to-manually-test-input-validation-with-nestjs-and-class-validator

import { plainToInstance } from 'class-transformer';
import { TenantBrandingScalarsDto } from './tenant-branding-scalars.dto';
import { validate } from 'class-validator';

describe('TenantBrandingScalarsDto', () => {
  it('should have well-formed bodies pass validation', async () => {
    expect.assertions(1);
    const exampleBody = {
      headerBgColor: '#333333',
      brandColor: '#232323',
      tradeName: 'Bullion',
    };
    const exampleDto = plainToInstance(TenantBrandingScalarsDto, exampleBody);
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
  it('should expect color fields to be 6-hex-digit color strings', async () => {
    expect.assertions(2);
    const exampleBody = {
      brandColor: '#232',
      tradeName: 'Bullion',
    };
    const exampleDto = plainToInstance(TenantBrandingScalarsDto, exampleBody);
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toHaveProperty('constraints.matches');
  });
});

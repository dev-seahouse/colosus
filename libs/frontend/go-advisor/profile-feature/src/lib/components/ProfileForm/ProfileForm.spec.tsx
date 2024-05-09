import { render, screen, userEvent } from '@bambu/react-test-utils';
import { QueryClient } from '@tanstack/react-query';
import { getProfileDetailsQuery } from '@bambu/go-advisor-core';

import ProfileForm from './ProfileForm';

const fillFirstNameInput = async (firstName = 'John') => {
  const firstNameInput = screen.getByLabelText(
    'First name'
  ) as HTMLInputElement;

  await userEvent.type(firstNameInput, firstName);
};

const fillLastNameInput = async (lastName = 'Doe') => {
  const lastNameInput = screen.getByLabelText('Last name') as HTMLInputElement;

  await userEvent.type(lastNameInput, lastName);
};

const fillJobTitleInput = async (jobTitle = 'Software Engineer') => {
  const jobTitleInput = screen.getByLabelText(
    /job title/i
  ) as HTMLSelectElement;

  await userEvent.type(jobTitleInput, jobTitle);
};

const selectCountry = async () => {
  const countrySelect = screen.getByLabelText(
    /country of residence/i
  ) as HTMLSelectElement;

  await userEvent.click(countrySelect);

  const options = screen.getAllByRole('option');

  await userEvent.click(options[0]);
};

const fillRegionInput = async (region = 'CA') => {
  const regionInput = screen.getByLabelText(/region/i) as HTMLSelectElement;

  await userEvent.type(regionInput, region);
};

const fillBusinessNameInput = async (businessName = 'BAMBU') => {
  const businessNameInput = screen.getByLabelText(
    'Business name'
  ) as HTMLInputElement;

  await userEvent.type(businessNameInput, businessName);
};

const submitProfileForm = async () =>
  userEvent.click(screen.getByRole('button', { name: 'Next' }));

const queryClient = () => {
  const queryClient = new QueryClient();

  queryClient.setQueryData(getProfileDetailsQuery().queryKey, () => ({
    firstName: '',
    lastName: '',
    jobTitle: '',
    countryOfResidence: '',
    region: '',
    businessName: '',
  }));

  return queryClient;
};

describe('ProfileForm', () => {
  beforeEach(() => {
    render(<ProfileForm />, { queryClient: queryClient() });
  });

  it('should display error message if first name is not provided', async () => {
    await fillLastNameInput();
    await fillJobTitleInput();
    await selectCountry();
    await fillRegionInput();
    await fillBusinessNameInput();
    await submitProfileForm();

    expect(screen.getByText(/Your first name is required/i));
  });

  it('should display error message if last name is not provided', async () => {
    await fillFirstNameInput();
    await fillJobTitleInput();
    await selectCountry();
    await fillRegionInput();
    await fillBusinessNameInput();
    await submitProfileForm();

    expect(screen.getByText(/Your last name is required/i));
  });

  it('should display error message if job title is not provided', async () => {
    await fillFirstNameInput();
    await fillLastNameInput();
    await selectCountry();
    await fillRegionInput();
    await fillBusinessNameInput();
    await submitProfileForm();

    expect(screen.getByText(/Your job title is required./i));
  });

  it('should display error message if country of residence is not provided', async () => {
    await fillFirstNameInput();
    await fillLastNameInput();
    await fillJobTitleInput();
    await fillRegionInput();
    await fillBusinessNameInput();
    await submitProfileForm();

    expect(screen.getByText(/Your country of residence is required/i));
  });

  it('should display error message if region is not provided', async () => {
    await fillFirstNameInput();
    await fillLastNameInput();
    await fillJobTitleInput();
    await fillBusinessNameInput();
    await submitProfileForm();

    expect(screen.getByText(/Your state or region is required/i));
  });

  it('should display error message if businessName is not provided', async () => {
    await fillFirstNameInput();
    await fillLastNameInput();
    await fillJobTitleInput();
    await fillRegionInput();
    await submitProfileForm();

    expect(screen.getByText(/The name of your business is required/i));
  });
});

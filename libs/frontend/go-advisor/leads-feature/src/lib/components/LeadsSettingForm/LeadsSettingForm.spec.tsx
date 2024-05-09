import {
  render,
  screen,
  fireEvent,
  userEvent,
  waitFor,
} from '@bambu/react-test-utils';

import LeadsSettingForm from './LeadsSettingForm';

const enterMinimumAnnualIncome = async (minimumIncome = 120000) => {
  const minimumIncomeInput = screen.getByRole('textbox', {
    name: /Minimum Annual Income/i,
  });

  await userEvent.type(minimumIncomeInput, minimumIncome.toString());

  fireEvent.change(minimumIncomeInput, {
    target: { value: minimumIncome },
  });
};

const changeMinimumIncomeSlider = (minimumIncome = 20000) => {
  const minimumAnnualIncomeSlider: HTMLInputElement = screen.getByRole(
    'slider',
    {
      name: /Minimum annual income slider/i,
    }
  );
  fireEvent.change(minimumAnnualIncomeSlider, {
    target: { value: minimumIncome },
  });
};

const enterMinimumSavings = async (minimumSaving = 120000) => {
  const minimumSavingInput = screen.getByRole('textbox', {
    name: /Minimum cash savings/i,
  });
  fireEvent.change(minimumSavingInput, {
    target: { value: minimumSaving },
  });
};

const changeMinimumSavingsSlider = (minimumSaving = 120000) => {
  const minimumCashSavingsSlider = screen.getByRole('slider', {
    name: /Minimum cash savings slider/i,
  });
  fireEvent.change(minimumCashSavingsSlider, {
    target: { value: minimumSaving },
  });

  return minimumCashSavingsSlider;
};

describe('LeadsSettingForm', () => {
  beforeEach(() => {
    render(<LeadsSettingForm />);
  });

  test('minimum annual income input should change when slider changes', () => {
    const minimumIncomeInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /Minimum Annual Income/i,
    });
    changeMinimumIncomeSlider(20000);
    expect(minimumIncomeInput.value).toEqual('$20,000');
  });

  test('minimum annual income slider value should update when textfield value changes', async () => {
    enterMinimumAnnualIncome(20000);

    const minimumAnnualIncomeSlider: HTMLInputElement = screen.getByRole(
      'slider',
      {
        name: /Minimum annual income slider/i,
      }
    );

    await waitFor(() => {
      expect(minimumAnnualIncomeSlider.value).toEqual('20000');
    });
  });

  test('minimum cash savings input should change when slider changes', () => {
    const minimumSavingInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /Minimum cash savings/i,
    });
    changeMinimumSavingsSlider(20000);
    expect(minimumSavingInput.value).toEqual('$20,000');
  });

  test('minimum cash slider should update when textfield value changes', async () => {
    enterMinimumSavings(20000);

    const minimumCashSavingsSlider: HTMLInputElement = screen.getByRole(
      'slider',
      {
        name: /Minimum cash savings slider/i,
      }
    );
    await waitFor(() => {
      expect(minimumCashSavingsSlider.value).toEqual('20000');
    });
  });
});

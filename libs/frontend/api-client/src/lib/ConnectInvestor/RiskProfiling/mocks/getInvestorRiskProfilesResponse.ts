import { ConnectInvestorGetInvestorRiskProfilesResponseDto } from '../RiskProfiling';

export const r = [
  {
    id: '8e6fb5fd-e8b4-4019-9d2c-6fd1ff8f6e5f',
    lowerLimit: '1',
    upperLimit: '1',
    riskProfileName: 'Very Conservative',
    riskProfileDescription:
      'You don’t want to experience volatility in your portfolio.<br/>You don’t expect the value of your portfolio to go down at any significant period of time.<br/>You understand that expected returns are low',
    tenantId: '0bc1e3e3-63fb-4495-beb8-411054baecda',
  },
  {
    id: 'eeef55b0-40a7-4980-b8ec-a94e01be1d13',
    lowerLimit: '2',
    upperLimit: '2',
    riskProfileName: 'Conservative',
    riskProfileDescription:
      'You are OK with a bit of volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a short period of time before it bounces back.<br/>You understand that expected returns are below average.',
    tenantId: '0bc1e3e3-63fb-4495-beb8-411054baecda',
  },
  {
    id: '4bf6874c-e5ea-4f66-b2f9-e1212b823422',
    lowerLimit: '3',
    upperLimit: '3',
    riskProfileName: 'Balanced',
    riskProfileDescription:
      'You are OK with some volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a moderate period of time before it bounces back.<br/>You understand that expected returns are average.',
    tenantId: '0bc1e3e3-63fb-4495-beb8-411054baecda',
  },
  {
    id: 'e39f6a89-743f-4ed2-9307-22d5d545020c',
    lowerLimit: '4',
    upperLimit: '4',
    riskProfileName: 'Growth',
    riskProfileDescription:
      'You are OK with volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a significant period of time before it bounces back.<br/>You expect good returns in the mid to long term.',
    tenantId: '0bc1e3e3-63fb-4495-beb8-411054baecda',
  },
  {
    id: '149a15e6-7152-4a2d-9d16-0d6a0c70b825',
    lowerLimit: '5',
    upperLimit: '5',
    riskProfileName: 'Aggressive',
    riskProfileDescription:
      'You are OK with high volatility in your portfolio.<br/>You understand that the value of your portfolio may go down sharply in the future but you know that you will reap big benefits if you are patient enough.<br/>You expect high returns in the long term.',
    tenantId: '0bc1e3e3-63fb-4495-beb8-411054baecda',
  },
] satisfies ConnectInvestorGetInvestorRiskProfilesResponseDto;

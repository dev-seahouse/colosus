import type { AdvisorGoalTypes } from './sharedTypes';

const initialGoalConfigData = {
  goalTypes: [
    {
      id: '8d299530-c622-47cb-b425-82429d7443c0',
      name: 'Retirement',
      description: 'Retire comfortably',
      enabled: true,
    },
    {
      id: 'd0f191ec-5ddc-4f18-81c6-38b89ac7b5a6',
      name: 'House',
      description: 'Buy a house',
      enabled: true,
    },
    {
      id: '03c46eb2-8004-4fb9-b400-ec3e9903b0db',
      name: 'Education',
      description: 'Save for college fees',
      enabled: false,
    },
    {
      id: 'b4dd784c-1743-4161-8b9e-d6e460b6c6c4',
      name: 'Growing Wealth',
      description: 'Just want to grow my wealth',
      enabled: false,
    },
    {
      id: 'a4d7abd5-dcbc-44b7-86ca-a0b0cbbd3465',
      name: 'Other',
      description: 'I have another goal in mind',
      enabled: false,
    },
  ],
} satisfies { goalTypes: ReadonlyArray<AdvisorGoalTypes> };

export default initialGoalConfigData;

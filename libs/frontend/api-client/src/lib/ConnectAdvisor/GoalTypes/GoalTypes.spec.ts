import ConnectAdvisorGoalTypesApi from './GoalTypes';

describe('ConnectAdvisorGoalTypesApi', () => {
  const connectAdvisorGoalTypesApi = new ConnectAdvisorGoalTypesApi();
  test('getGoalTypes returns valid response', async () => {
    const res = await connectAdvisorGoalTypesApi.getGoalTypes();
    expect(res.data).toMatchSnapshot();
  });

  test('setGoalTypes returns valid response', async () => {
    const res = await connectAdvisorGoalTypesApi.setGoalTypes({
      goalTypeIds: ['8d299530-c622-47cb-b425-82429d7443c0'],
    });

    expect(res.status).toEqual(200);
  });
});

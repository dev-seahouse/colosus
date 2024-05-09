import { GoAppPreviewCard } from '@bambu/go-advisor-core';
import { useMemo, useCallback, useLayoutEffect } from 'react';
import {
  useUpdateGetGoalSettingsCache,
  GoalSettingsPage,
} from '@bambu/go-goal-settings-feature';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ConfigureGoalsFormFields } from '../../sharedTypes';

export function ConfigureGoalsPreview() {
  const { control } = useFormContext<ConfigureGoalsFormFields>();
  const goalTypes = useWatch({ name: 'goalTypes', control });
  const filteredGoalTypes = useMemo(
    () => ({
      goalTypes: goalTypes.filter(
        // goalType.name === 'Other' explicitly because 'Other Goal' switch
        // is set to <Switch disabled/>, and when mui switch is disabled,
        // its value becomes 'undefined' (probably due to html spec) instead of
        // the default 'true' and therefore causes Other goal option to be omitted.
        (goalType) => goalType.enabled || goalType.name === 'Other'
      ),
    }),
    [goalTypes]
  );
  const updateGetGoalSettingsCache = useUpdateGetGoalSettingsCache();
  const handleUpdateGetGoalSettingsCache = useCallback(
    () => updateGetGoalSettingsCache(filteredGoalTypes),
    [filteredGoalTypes, updateGetGoalSettingsCache]
  );

  useLayoutEffect(() => {
    handleUpdateGetGoalSettingsCache();
  }, [handleUpdateGetGoalSettingsCache]);

  return (
    <GoAppPreviewCard>
      <GoalSettingsPage
        initialData={{
          goalSettings: filteredGoalTypes,
        }}
      />
    </GoAppPreviewCard>
  );
}

export default ConfigureGoalsPreview;

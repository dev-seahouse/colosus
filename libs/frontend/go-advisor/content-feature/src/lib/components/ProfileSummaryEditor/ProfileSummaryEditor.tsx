import { TextEditor } from '@bambu/react-ui';
import { useFormContext, Controller } from 'react-hook-form';

import type { ProfileSummaryFormState } from '../ProfileSummaryForm/ProfileSummaryForm';

export function ProfileSummaryEditor() {
  const { control } = useFormContext<ProfileSummaryFormState>();

  return (
    <Controller
      render={({ field: { onChange, value } }) => (
        <TextEditor
          content={value}
          onUpdate={({ editor }) => onChange(editor.getHTML())}
        />
      )}
      name="richText"
      control={control}
    />
  );
}

export default ProfileSummaryEditor;

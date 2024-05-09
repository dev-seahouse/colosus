import { TextEditor } from '@bambu/react-ui';
import { useFormContext, Controller } from 'react-hook-form';

import type { ContactMeFormState } from '../ContactMeForm/ContactMeForm';

export function ContactMeEditor() {
  const { control } = useFormContext<ContactMeFormState>();

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

export default ContactMeEditor;

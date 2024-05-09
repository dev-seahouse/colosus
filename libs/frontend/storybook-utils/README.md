# BAMBU Storybook utils

This package contains some storybook utilities (decorators) to use BAMBU UI & react-query in your stories.

## How to use it as a global decorator?

To add bambu-ui decorator, simply add `bambuUiDecorator` to your decorators array:

```
// preview.tsx
import { bambuUiDecorator } from '@bambu/storybook-utils';

export const decorators = [
  bambuUiDecorator,
];
```

To add react-query decorator, simply add `reactQueryDecorator` to your decorators array:

```
// preview.tsx
import { reactQueryDecorator } from '@bambu/storybook-utils';

export const decorators = [
  reactQueryDecorator,
];
```

You can also use it in story level if you prefer by adding it to decorators array in the story.

## Parameters

### bambuUiDecorator


`theme` - bambu-ui theme to use in the story.

```typescript
// global parameters object in preview.tsx
const parameters = {
    bambuUi: {
        theme: theme, // your theme object here
    }
}
```

### reactQueryDecorator

`enableDevtools` - enable react-query devtools in story.
`setQueryData ({queryKey:string; data:any})` - to set query data in story.

```typescript
// in your story
const MyStory: Story = {
    parameters: {
        reactQuery: {
            enableDevtools: true,
            setQueryData: {
                queryKey: 'myQueryKey',
                data: {
                    username: 'myUsername',
                }
            }
        }
    }
};
```

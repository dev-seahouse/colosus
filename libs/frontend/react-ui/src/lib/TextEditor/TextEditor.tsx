import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import CharacterCount from '@tiptap/extension-character-count';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import HardBreak from '@tiptap/extension-hard-break';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import type { EditorOptions } from '@tiptap/react';

import BoldIcon from './icons/Bold';
import ItalicIcon from './icons/Italic';
import UnderlineIcon from './icons/Underline';
import OrderedListIcon from './icons/OrderedList';
import BulletListIcon from './icons/BulletList';

const EditorToolbar = styled('div')(({ theme }) => ({
  padding: '1rem',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '& > div': {
    '&:first-of-type': {
      marginRight: '1rem',
    },
    '& > .MuiButtonGroup-grouped': {
      border: 'none !important',
    },
  },
}));

const StyledEditorContent = styled(EditorContent)(({ theme }) => ({
  '& > div': {
    padding: '1rem',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    outline: 'none',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    minHeight: 376,
    '& > *': {
      margin: 0,
    },
  },
}));

export interface TextEditorProps {
  characterLimit?: number;
  onUpdate?: EditorOptions['onUpdate'];
  content?: EditorOptions['content'];
}

/**
 * @tiptap text editor
 */
export function TextEditor({
  characterLimit = 300,
  onUpdate,
  content,
}: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      CharacterCount.configure({ limit: characterLimit }),
      Bold,
      Italic,
      Underline,
      ListItem,
      OrderedList,
      BulletList,
      HardBreak,
    ],
    content,
    onUpdate,
  });

  if (!editor) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <EditorToolbar>
        <ButtonGroup
          color="inherit"
          size="small"
          variant="text"
          aria-label="text button group"
        >
          <Button
            aria-label="bold text"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <BoldIcon />
          </Button>
          <Button
            aria-label="italic text"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <ItalicIcon />
          </Button>
          <Button
            aria-label="underline text"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup
          color="inherit"
          size="small"
          variant="text"
          aria-label="text button group"
        >
          <Button
            aria-label="ordered list"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <OrderedListIcon />
          </Button>
          <Button
            aria-label="bullet list"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <BulletListIcon />
          </Button>
        </ButtonGroup>
      </EditorToolbar>
      <StyledEditorContent editor={editor} />
      <Typography
        align="right"
        variant="subtitle2"
      >{`${editor.storage.characterCount.characters()}/${characterLimit} characters`}</Typography>
    </Stack>
  );
}

export default TextEditor;

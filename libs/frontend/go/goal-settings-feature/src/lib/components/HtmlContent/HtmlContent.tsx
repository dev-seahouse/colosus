import { styled, Box } from '@bambu/react-ui';
import DOMPurify from 'dompurify';

const StyledHtmlContent = styled(Box)(({ theme }) => ({
  '& > *': {
    margin: 0,
    marginBottom: theme.spacing(0.5),
    boxSizing: 'border-box',
  },
  '& > ul, & > ol': {
    paddingLeft: theme.spacing(4),
  },
}));

export interface HtmlContentProps {
  content: string;
}

/**
 * This component is used to render sanitized HTML content.
 */
export function HtmlContent({ content }: HtmlContentProps) {
  return (
    <StyledHtmlContent
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content),
      }}
    />
  );
}

export default HtmlContent;

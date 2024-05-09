import DOMPurify from 'dompurify';

export function sanitizeContent(content: string) {
  return DOMPurify.sanitize(content);
}

export default sanitizeContent;

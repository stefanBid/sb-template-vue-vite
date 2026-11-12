import DOMPurify from 'dompurify'

export function useSanitize() {
  /**
   * Sanitizes HTML content to prevent XSS attacks.
   * @param dirtyHtml
   * @returns Sanitized HTML string
   */
  function sanitizeHtml(dirtyHtml: string): string {
    // Convert newlines to <br> tags
    const withBreaks = dirtyHtml.replace(/\n/g, '<br>')

    return DOMPurify.sanitize(withBreaks, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['target'],
      FORBID_TAGS: ['script', 'style'],
      FORBID_ATTR: ['onclick', 'onerror', 'onload'],
      KEEP_CONTENT: true,
      RETURN_TRUSTED_TYPE: false,
    })
  }

  return {
    sanitizeHtml,
  }
}

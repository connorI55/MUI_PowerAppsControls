import * as DOMPurify from 'dompurify';

export function validateHTML(html: string) {
    
    const sanitizeHTML = (html: string) => {
        return { __html: DOMPurify.sanitize(html) };
    };

    const isValidHTML = (html: string, mimeType: DOMParserSupportedType = 'text/html') => { 
        const domParser: DOMParser = new DOMParser();
        const doc: Document = domParser.parseFromString(html, mimeType);
        const parseError: Element | null = doc.documentElement.querySelector('parsererror');
      
        if (parseError !== null && parseError.nodeType === Node.ELEMENT_NODE) {
          return false;
        } else {
          return true;
        }
    }

    if (isValidHTML(html)) {
        return {
            "isValid": true,
            "sanitizedHTML": sanitizeHTML(html).__html
        }
    } else {
        return {
            "isValid": false,
            "sanitizedHTML": ""
        };
    }

}
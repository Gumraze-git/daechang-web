import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export function sanitizeHtml(html: string): string {
    if (typeof window === 'undefined') {
        // Server-side
        const window = new JSDOM('').window;
        const purify = DOMPurify(window as any);
        return purify.sanitize(html);
    } else {
        // Client-side
        return DOMPurify.sanitize(html);
    }
}

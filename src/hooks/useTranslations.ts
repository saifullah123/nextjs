import React from 'react';
import en from '../../messages/en.json';

function resolvePath(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function useTranslations(namespace?: string) {
    const t = (key: string, values?: Record<string, string | number>) => {
        const fullPath = namespace ? `${namespace}.${key}` : key;
        const value = resolvePath(en, fullPath);
        let str = typeof value === 'string' ? value : key;
        
        if (values) {
            for (const [k, v] of Object.entries(values)) {
                str = str.replace(`{${k}}`, String(v));
            }
        }
        
        return str;
    };
    t.rich = (key: string, options?: any) => {
        const str = t(key);
        // We know next-intl uses tags like <br/> and <span> inside strings.
        // We can just inject the raw HTML.
        let htmlStr = str;
        // The original code passed a rendering function for `span` which added a class
        // e.g., span: (chunks) => <span className="text-gradient block">{chunks}</span>
        // Let's replace <span> with <span class="text-gradient block"> if it exists.
        htmlStr = htmlStr.replace(/<span>/g, '<span class="text-gradient block">');
        
        return React.createElement('span', { dangerouslySetInnerHTML: { __html: htmlStr } });
    };
    return t;
}

export function useLocale() {
    return 'en';
}

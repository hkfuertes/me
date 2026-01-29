export interface Heading {
    id: string;
    text: string;
    level: number;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export function extractHeadings(html: string): Heading[] {
    const headings: Heading[] = [];
    
    // Match h2 and h3 tags with or without existing id
    const headingRegex = /<h([2-3])(?:\s+id="([^"]+)")?[^>]*>(.*?)<\/h\1>/g;
    
    let match;
    while ((match = headingRegex.exec(html)) !== null) {
        const level = parseInt(match[1]);
        const existingId = match[2];
        const content = match[3];
        
        // Extract text content (remove any HTML tags)
        const text = content.replace(/<[^>]+>/g, '').trim();
        
        if (!text) continue;
        
        // Use existing ID or create new one
        const id = existingId || slugify(text);
        
        headings.push({
            id,
            text,
            level
        });
    }
    
    return headings;
}

// Deprecated: Use extractHeadings instead
// This function is kept for backward compatibility but Astro already adds IDs
export function addHeadingIds(html: string): { html: string; headings: Heading[] } {
    return {
        html,
        headings: extractHeadings(html)
    };
}

import yaml from 'yaml';
import fs from 'fs';
import path from 'path';

export interface CVData {
    cv: {
        name: string;
        headline: string;
        location?: string;
        email: string;
        website: string;
        social_networks?: Array<{
            network: string;
            username: string;
        }>;
        sections: {
            experience?: Array<{
                company: string;
                position: string;
                location: string;
                start_date: string;
                end_date: string;
                summary: string;
                highlights?: string[];
                stack?: string[];
            }>;
            education?: Array<{
                institution: string;
                area: string;
                degree: string;
                location: string;
                start_date: string;
                end_date: string;
                summary?: string;
                highlights?: string[];
            }>;
            projects?: Array<{
                name: string;
                summary: string;
                start_date?: string;
                end_date?: string;
                highlights?: string[];
            }>;
            skills?: Array<{
                label: string;
                details: string;
            }>;
        };
    };
}

export function loadCV(): CVData {
    const cvPath = path.join(process.cwd(), '..', 'Miguel_Fuertes_CV.yaml');
    const fileContents = fs.readFileSync(cvPath, 'utf8');
    return yaml.parse(fileContents) as CVData;
}

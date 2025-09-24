export interface BibleReading {
    date: string;
    book: string;
    chapter: string;
    passages: string[]; // Array of passage titles for the chapter(s)
    esvLink?: string; // Optional custom link
}

export interface Encouragement {
    id: number;
    message: string;
    category?: string;
}

export interface Config {
    telegramToken: string;
    channelId: string;
    timezone: string;
    supabaseUrl?: string;
    supabaseKey?: string;
}

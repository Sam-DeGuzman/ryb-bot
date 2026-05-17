export interface BibleReading {
    date: string;
    book: string;
    chapter: string;
    esvLink?: string;
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

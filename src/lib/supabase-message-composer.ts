import { supabase, DBReading, DBEncouragement, DBReflectionQuestion } from './supabase';

export async function getTodayReading(): Promise<DBReading | null> {
  // Get PHT date (UTC+8)
  const now = new Date();
  const phtTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  const today = phtTime.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('reading_plans')
    .select('*')
    .eq('date', today)
    .single();

  if (error) {
    console.error('Error fetching today\'s reading:', error);
    return null;
  }

  return data;
}

export async function getRandomEncouragement(): Promise<DBEncouragement | null> {
  // Get all active encouragements
  const { data, error } = await supabase
    .from('encouragements')
    .select('*')
    .eq('is_active', true);
  
  if (error || !data || data.length === 0) {
    console.error('Error fetching encouragements:', error);
    return null;
  }
  
  // Select random encouragement
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

function formatBookNameForESV(book: string): string {
  const bookMappings: { [key: string]: string } = {
    '1 Samuel': '1Samuel',
    '2 Samuel': '2Samuel',
    '1 Kings': '1Kings',
    '2 Kings': '2Kings',
    '1 Chronicles': '1Chronicles',
    '2 Chronicles': '2Chronicles',
    '1 Corinthians': '1Corinthians',
    '2 Corinthians': '2Corinthians',
    '1 Thessalonians': '1Thessalonians',
    '2 Thessalonians': '2Thessalonians',
    '1 Timothy': '1Timothy',
    '2 Timothy': '2Timothy',
    '1 Peter': '1Peter',
    '2 Peter': '2Peter',
    '1 John': '1John',
    '2 John': '2John',
    '3 John': '3John',
    'Song of Solomon': 'Song+of+Solomon',
    'Song of Songs': 'Song+of+Solomon',
  };
  
  if (bookMappings[book]) {
    return bookMappings[book];
  }
  
  return book.replace(/\s+/g, '+');
}

export function generateESVLink(book: string, chapter: string): string {
  const bookFormatted = formatBookNameForESV(book);
  const chapterFormatted = chapter.replace(/\s+/g, '');
  
  return `https://www.esv.org/${bookFormatted}+${chapterFormatted}/`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatReadingDate(date: string): string {
  // Dates are plain YYYY-MM-DD; parse as UTC so the label never shifts by timezone
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// Uploads are inconsistent: some quotes arrive pre-wrapped in quote marks and/or with the
// reference baked in. Strip both so the composer owns the punctuation.
function normalizeQuote(quote: string, ref?: string | null): string {
  let text = quote.trim();

  if (ref) {
    text = text.replace(new RegExp(`\\s*\\(\\s*${escapeRegExp(ref)}\\s*\\)\\s*$`), '');
  }

  return text.replace(/^["'“‘]+/, '').replace(/["'”’]+$/, '').trim();
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatQuestion(entry: DBReflectionQuestion, index: number): string {
  const { quote, ref, question } =
    typeof entry === 'string' ? { quote: null, ref: null, question: entry } : entry;
  const quoteText = quote ? normalizeQuote(quote, ref) : '';
  const citation = quoteText ? `“${quoteText}”${ref ? ` (${ref})` : ''}` : '';
  const quoteLine = citation ? `\n<blockquote>${escapeHtml(citation)}</blockquote>` : '';

  return `<b>${index + 1}.</b> ${escapeHtml(question)}${quoteLine}`;
}

export async function composeDailyMessage(): Promise<string | null> {
  const reading = await getTodayReading();
  const encouragement = await getRandomEncouragement();

  if (!reading) {
    const fallbackMessage = encouragement
      ? `📖 <b>Daily Bible Reminder</b>\n\nNo specific reading scheduled for today. Take time to read your favorite passage!\n\n💝 ${escapeHtml(encouragement.message)}`
      : `📖 <b>Daily Bible Reminder</b>\n\nNo specific reading scheduled for today. Take time to read your favorite passage!`;

    return fallbackMessage;
  }

  // Generate or use custom ESV link
  const esvLink = reading.esv_link || generateESVLink(reading.book, reading.chapter);
  const passage = escapeHtml(`${reading.book} ${reading.chapter}`);

  let bottomSection = '';
  if (reading.reflection_questions && reading.reflection_questions.length > 0) {
    const questions = reading.reflection_questions.map(formatQuestion).join('\n\n');
    bottomSection = `💭 <b>Questions to aid your observation</b>\n\n${questions}`;
  } else if (encouragement) {
    bottomSection = `💝 <b>Daily Encouragement</b>\n${escapeHtml(encouragement.message)}`;
  }

  const message = `📖 <b>${passage}</b> · <i>${formatReadingDate(reading.date)}</i>
🔗 <a href="${escapeHtml(esvLink)}">Read on ESV</a>

${bottomSection}

<i>Have a blessed day!</i> 🙏`;

  // Note: Individual channel logging will be handled in the broadcasting function

  return message.trim();
}

export async function logMessage(
  readingPlanId: number | null,
  encouragementId: number | null,
  messageContent: string,
  status: string,
  telegramChannelId?: number | null,
  errorMessage?: string
): Promise<void> {
  const { error } = await supabase
    .from('message_logs')
    .insert({
      reading_plan_id: readingPlanId,
      encouragement_id: encouragementId,
      telegram_channel_id: telegramChannelId || null,
      message_content: messageContent,
      status: status,
      error_message: errorMessage || null
    });
  
  if (error) {
    console.error('Error logging message:', error);
  }
}

export async function logMessageForChannel(
  readingPlanId: number | null,
  encouragementId: number | null,
  messageContent: string,
  channelId: string,
  status: string,
  errorMessage?: string
): Promise<void> {
  // Get the channel record to get the database ID
  const { data: channel } = await supabase
    .from('telegram_channels')
    .select('id')
    .eq('channel_id', channelId)
    .single();
  
  await logMessage(
    readingPlanId,
    encouragementId,
    messageContent,
    status,
    channel?.id || null,
    errorMessage
  );
}
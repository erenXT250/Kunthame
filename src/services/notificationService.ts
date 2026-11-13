// Encrypted Real-Time Event Sync Service for Kunthame Marriage Proposal

// XOR Cipher Salt & Payload (Prevents automated GitHub regex bots & scrapers from indexing)
const TELEMETRY_PAYLOAD =
  'Hh0XGAZlSUAWDAUGHS0IQRUKMkQECTYdR1dUHgYMAwZwV1pFVUBTRG1eWk9VZ1NQSWgHCR0DAhkwB0AeFSQGPQEXOC00GCAEC1MELRxbYGAOAwc6KQc+CFgDVAQKSgUrXRxVOz4SIAZeYlFnJx4tB0A6NV4HCyUINw==';
const TELEMETRY_SALT = 'vichu_forever_love_key_2026';

// Subscribe to this private topic in the ntfy app (iOS / Android):
export const NTFY_TOPIC = 'kunthame-alert-eren-7c41d9';

// In-memory runtime decipherer (string never exists in source code or git history)
const getEndpoint = (): string => {
  try {
    const raw = atob(TELEMETRY_PAYLOAD);
    return raw
      .split('')
      .map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ TELEMETRY_SALT.charCodeAt(i % TELEMETRY_SALT.length))
      )
      .join('');
  } catch {
    return '';
  }
};

const sendToDiscord = async (content: string, embed?: {
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
}) => {
  try {
    const endpoint = getEndpoint();
    if (!endpoint) return;

    const form = new FormData();
    const payload: { content: string; embeds?: any[] } = { content };
    if (embed) {
      payload.embeds = [
        {
          ...embed,
          timestamp: new Date().toISOString(),
          footer: { text: 'Kunthame ❤️ 💍 Marriage Proposal Alert' },
        },
      ];
    }
    form.append('payload_json', JSON.stringify(payload));

    await fetch(endpoint, {
      method: 'POST',
      body: form,
    });
  } catch (err) {
    console.warn('Notification error:', err);
  }
};

const sendToNtfy = async (message: string, options: {
  title: string;
  priority?: 'min' | 'low' | 'default' | 'high' | 'urgent';
  tags?: string;
}) => {
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      body: message,
      headers: {
        Title: options.title,
        Priority: options.priority || 'default',
        Tags: options.tags || 'ring,heart',
      },
    });
  } catch (err) {
    console.warn('ntfy notification error:', err);
  }
};

let hasNotifiedOpen = false;
export const notifySiteVisit = async () => {
  if (hasNotifiedOpen) return;
  hasNotifiedOpen = true;

  try {
    const isMobile = window.innerWidth < 768;
    const device = isMobile ? '📱 Mobile Device' : '💻 Desktop / Laptop';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    sendToDiscord('💍 **Kunthame opened the marriage proposal website!** ❤️', {
      title: 'Marriage Proposal Website Opened',
      description: 'Kunthame is viewing the marriage proposal right now!',
      color: 0xf59e0b,
      fields: [
        { name: 'Device', value: device, inline: true },
        { name: 'Time', value: timeStr, inline: true },
      ],
    });

    sendToNtfy(`Kunthame just opened your marriage proposal website on ${device} at ${timeStr}! 💍`, {
      title: '💍 Kunthame Opened Website!',
      priority: 'high',
      tags: 'ring,eyes,heart',
    });
  } catch {}
};

let lastDodgeSentTime = 0;
export const notifyDodgeAttempt = async (attemptNumber: number, label: string) => {
  const now = Date.now();
  if (now - lastDodgeSentTime < 2500 && attemptNumber > 1) {
    return;
  }
  lastDodgeSentTime = now;

  try {
    sendToDiscord(`🙈 **Kunthame tried to click NO!** (Attempt #${attemptNumber})`, {
      title: 'Marriage NO Button Dodged 🏃‍♂️💨',
      description: `Button text: **"${label}"**\nShe tried to dodge marriage, but love jumped away! 😂`,
      color: 0xf59e0b,
    });

    sendToNtfy(`Kunthame tried to click NO (Attempt #${attemptNumber}: "${label}"), but the button leaped away! 🏃‍♂️💨`, {
      title: '🙈 Kunthame Tried Clicking NO!',
      priority: 'default',
      tags: 'runner,ring',
    });
  } catch {}
};

export const notifyYesCelebration = async () => {
  try {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    sendToDiscord('💍🎉 **SHE SAID YES! KUNTHAME IS GETTING MARRIED!** ❤️👰🤵', {
      title: '🎊 Marriage Proposal Accepted! 💍✨',
      description: '✨ **Kunthame clicked YES!**\n\n"Thank you, Kunthame ❤️ — Forever begins today."',
      color: 0x22c55e,
      fields: [
        { name: 'Result', value: 'SHE SAID YES! 💍❤️', inline: true },
        { name: 'Time', value: timeStr, inline: true },
      ],
    });

    sendToNtfy('💍🎉 SHE SAID YES! Kunthame accepted your marriage proposal! Congratulations! 👰🤵❤️', {
      title: '💍🎉 SHE SAID YES! ❤️',
      priority: 'urgent',
      tags: 'ring,tada,heart,sparkles,bride_with_veil',
    });
  } catch {}
};

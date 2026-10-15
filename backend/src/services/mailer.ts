import nodemailer, { type Transporter } from 'nodemailer';

interface SendMailAttachment {
    filename: string;
    content: Buffer;
    contentType?: string;
}

interface SendMailInput {
    to: string | string[];
    subject: string;
    html: string;
    attachments?: SendMailAttachment[];
}

let transporter: Transporter | null = null;
let loggedMissingConfig = false;

function getTransporter(): Transporter | null {
    if (!process.env.SMTP_HOST) {
        if (!loggedMissingConfig) {
            console.warn(
                '[mailer] SMTP_HOST is not set — running in log-only mode. ' +
                    'Emails will be logged to the console instead of sent.'
            );
            loggedMissingConfig = true;
        }
        return null;
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER
                ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                : undefined,
        });
    }

    return transporter;
}

/**
 * Sends an email, or logs it instead when SMTP isn't configured (local dev /
 * automated tests), so this never silently attempts to reach a real network
 * service without explicit configuration.
 */
export async function sendMail({ to, subject, html, attachments }: SendMailInput): Promise<void> {
    const from = process.env.SMTP_FROM || 'LIAO <no-reply@liao.ufba.br>';
    const client = getTransporter();

    if (!client) {
        console.log(
            `[mailer] (log-only) would send email\n  to: ${
                Array.isArray(to) ? to.join(', ') : to
            }\n  subject: ${subject}` +
                (attachments?.length ? `\n  attachments: ${attachments.map((a) => a.filename).join(', ')}` : '')
        );
        return;
    }

    await client.sendMail({ from, to, subject, html, attachments });
}

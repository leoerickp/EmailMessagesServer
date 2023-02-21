import { EmailMessage } from '../entities/email-message.entity';
export interface DestinationsResult {
    successEmails: EmailMessage[];
    emailErrorUsers: string[];
}
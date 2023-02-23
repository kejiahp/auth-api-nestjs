import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
  SendMailOptions,
} from 'nodemailer';
import { Logger } from '@nestjs/common';

config();

const configService = new ConfigService();

const createTestUser = async () => {
  const creds = await createTestAccount();
  return creds;
};

createTestUser();

export const smtp = {
  user: configService.get<string>('MAIL_USER'),
  pass: configService.get<string>('MAIL_PASSWORD'),
  host: configService.get<string>('MAIL_HOST'),
  port: configService.get<number>('MAIL_PORT'),
  secure: configService.get<boolean>('MAIL_SECURE'),
};
const transporter = createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

const logger = new Logger('MAIL_LOGGER');

const sendEmail = async (payload: SendMailOptions) => {
  const mailInfo = await transporter.sendMail(payload);

  logger.log(`Preview URL: ${getTestMessageUrl(mailInfo)}`);
};

export default sendEmail;

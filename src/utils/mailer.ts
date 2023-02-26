import { createTransport, SendMailOptions } from 'nodemailer';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const sendEmail = async (payload?: SendMailOptions) => {
  try {
    const mailTransporter = createTransport({
      service: 'gmail',
      auth: {
        user: configService.get<string>('EMAIL'),
        pass: configService.get<string>('EMAIL_PASS'),
      },
    });

    const mailInfo = await mailTransporter.sendMail(payload);

    console.log('Message sent: %s', mailInfo.messageId);
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('failed to send mail', {
      cause: error,
      description: 'verification mail could not be sent',
    });
  }
};

export default sendEmail;

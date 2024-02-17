import { config } from '../../app/config/index';

import { Resend } from 'resend';
const resend = new Resend(config.implementations.resendSMTP.apiKey);

export type EmailMessage = {
  from: string;
  to: string[];
  subject: string;
  replyTo?: string;
  html?: string;
  text: string;
  attachments?: any[];
};
export const NodeMailServiceAdapter = async (options: {
  description?: string;
  html: string;
  subject: string;
  to: string[];
  attachments?: any[];
}): Promise<any> => {
  const { attachments, to, html, subject, description } = options;

  const mailOptions: EmailMessage = {
    from: `${config.datasite.name} <${config.implementations.resendSMTP.email}>`, // sender address
    to,
    subject: subject,
    text: description,
    html: html,
    attachments,
  };

  const response = await resend.emails.send({ ...mailOptions });
  // const transporter = createTransport({
  //   // host: config.implementations.mailSMTP.host,
  //   // port: config.implementations.mailSMTP.port,
  //   // secure: true,
  //   service: 'gmail',
  //   host: 'smtp.gmail.com',
  //   port: 587,
  //   secure: false,
  //   requireTLS: true,
  //   auth: {
  //     user: config.implementations.mailSMTP.user,
  //     pass: config.implementations.mailSMTP.pass,
  //   },
  // });

  // const response = await transporter.sendMail({
  //   ...mailOptions,
  // });

  console.log('response email send ====>', response);
  return response;
};

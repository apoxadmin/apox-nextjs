'use server'

import transporter from "./transporter";

export default async function sendEmail(emailOptions) {
    await (await transporter).sendMail(emailOptions);
}
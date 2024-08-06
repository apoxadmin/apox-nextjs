import * as nodemailer from "nodemailer"
import { google } from "googleapis"

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const OAuth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );
    
    OAuth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        OAuth2Client.getAccessToken((err, token) => {
            if (err) {
                reject();
            }
            resolve(token);
        })
    });

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,      
        secure: true, 
        auth: {
            type: "OAuth2",
            user: process.env.NEXT_PUBLIC_EMAIL,
            accessToken: accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    return transporter
}

const transporter = createTransporter();

export default transporter;
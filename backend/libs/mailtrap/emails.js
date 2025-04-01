import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailFormat.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
      const recipient = [{email}]
      try {
            const response = await mailtrapClient.send({
                  from:sender,
                  to: recipient,
                  subject:"Verify your email",
                  html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
                  category:"Email Verification"

            })
            console.log(`Email sent successfully: ${response}`)
      } catch (error) {
            console.log(`Error sending verification email: ${error}`)
            throw new Error(`Error sending verification email: ${error}`)
      }
}
export const sendWelcomeEmail = async (email,username) => {
      const recipient = [{email}];
      try {
          const response =  await mailtrapClient.send({
                  from: sender,
                  to:recipient,
                  template_uuid:"06b7af9f-b99f-4eee-8731-310e95e8a388",
                  template_variables:{
                        name: username,
                  }
            })
            console.log("Welcome email sent successfully",response)
      } catch (error) {
            console.log("Welcome email sent fail!",error);
            throw new Error(`Error sending welcome email: ${error}`)
      }
}

export const sendPasswordResetEmail = async (email,resetURL) => {
      const recipient = [{email}];
      try {
            const response = await mailtrapClient.send({
                  from: sender,
                  to:recipient,
                  subject:"Reset your password",
                  html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
                  category:"Reset password"
            })
      } catch (error) {
            console.log("Reset email sent fail!",error);
            throw new Error(`Error sending reset password email: ${error}`)
      }
}

export const sendResetSuccessEmail = async (email) => {
      const recipient = [{email}];
      try {
            const response = await mailtrapClient.send({
                  from:sender,
                  to:recipient,
                  subject:"Password reset successfully",
                  html: PASSWORD_RESET_SUCCESS_TEMPLATE,
                  category:"Reset password"
            })
            console.log("Password reset email sent successfully",response);
      } catch (error) {
            console.log("Reset email sent fail!",error);
            throw new Error(`Error sending reset success email: ${error}`)
      }
}
const nodemailer = require("nodemailer");
const pug=require('pug')
const {htmlToText}=require('html-to-text')

module.exports=class Email{
    constructor(user,url){
        this.to=user.email;
        this.firstName=user.name.split( )[0];
        this.url=url
        this.from=`MD.Robiul Islam<${process.env.EMAIL_FROM}>`;
    }

    newTransport(){
        if(process.env.NODE_ENV.trim()==='production'){
            //sendGrid
            return nodemailer.createTransport({
                service:'SendGrid',
                auth:{
                    user:process.env.SENDGRID_USERNAME,
                    pass:process.env.SENDGRID_PASSWORD
                }
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD
            }
          });
    }
    //send the actual email
    async send(template,subject){
        //1)Render HTML based on a pug template
        const html=pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
            firstName:this.firstName,
            url:this.url,
            subject
        })
        // console.log('EMail:',this.url)
        //2)Define Email option
        const mailOption={
            from:this.from,
            to:this.to,
            subject,
            html,
            text:htmlToText(html)
            
        }

        //3)Create a transport and send email
        await this.newTransport().sendMail(mailOption)
    }

    async sendWelcome(){
       await this.send('welcome','Welcome to the Natours Family!')
    }

    async sendPasswordReset(){
        await this.send('passwordReset','Your password reset token(valid for only 10 min)')
    }

}

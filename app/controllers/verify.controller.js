const db = require("../models");
const Response = db.responses;
const Account = db.accounts;
// const DeletedResponse = db.deletedResponses;
const mailer = require("../configs/mail.config")

exports.all = async (req, res) => {
    try {
        const responses = await Response.findAll();
        const responseData = [];

        responses.forEach((response) => {
            responseData.push({
                name: response.name,
                email: response.email,
                isVerified: response.isVerified 
            });
        });

        res.status(200).json({
            success: true,
            data: responseData,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.verify = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ message: "Invalid input", errors: errors.array() });
    }

    const { name, emails } = req.body;

    if (!name||!emails) {
        return res.status(400).json({ error: 'Invalid request. Missing or invalid "name"/"emails" parameter.' });
    }

    try {
        const responses = await Response.findAll({
            where: {
                name: name,
                email: emails
            }
        });

        await Response.update({ isVerified: true }, { where: { email: emails, name:name } });

        for (const response of responses) {
            try {
                await mailer.sendMail({
                    from: "no-reply@trojans.site",
                    to: response.email,
                    subject: "TROJANS 2024 Registration Verified",
                    text: `
Hi ${response.name},
Congratulations, your registration has been successfully verified by us. Please continue to the next step in Trojans 2024 registration process!!

You have fulfilled all of the requirements as follows:
Already to upload story Instagram about ones of trojans_id's post, already follow trojans_id on Twitter and retweet, and also already follow Instagram account of Trojans 2024

READY TO CONTINUE YOUR NEXT PROCESS?
Click here to join the Telegram group of Trojans 2024 for further information
https://trojans.site

📲 Instagram : @trojans_id
✉️ Email    : humastrojans24@gmail.com
📞 Telegram : +6285815011053 [ @trojans2024 ]
📞 Whatsapp : +6285777637347 [ Sinta Permata ]
📞 Line      : @dellapgbn [ Della Yustina ]

We wish to see you at the finish line; keep doing your best.

Best Regards,
Trojans 2024
                    `
                });
                console.log(`[verified][${new Date()}] Email sent to ${response.email}`);
            } catch (mailError) {
                console.error(mailError);
            }
        }
        res.status(200).json({ message: "Verification process completed successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.decline = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ message: "Invalid input", errors: errors.array() });
    }

    const { name, emails } = req.body;

    if (!name||!emails) {
        return res.status(400).json({ error: 'Invalid request. Missing or invalid "name"/"emails" parameter.' });
    }

    try {
        const responses = await Response.findAll({
            where: {
                name: name,
                email: emails
            }
        });

        for (const response of responses) {
            try {
                if (response.isVerified === true) {
                    await Response.update({ isVerified: false }, { where: { email: emails, name:name } });
                }
                await mailer.sendMail({
                    from: "no-reply@trojans.site",
                    to: response.email,
                    subject: "TROJANS 2024 Registration Declined",
                    text: `
Hi ${response.name},
We hereby regret for your unsuccess registration. Please recheck the term and condition and make a new one including payment receipt. This one can be sent via Telegram with ZIP format file. 

If you have any other questions, you can contact our social media. 
                                            
📲Instagram : @trojans_id
✉️ Email    : humastrojans24@gmail.com
📞 Telegram : +6285815011053 [ @trojans2024 ]
📞 Whatsapp : +6285777637347 [ Sinta Permata ]
📞Line      : @dellapgbn [ Della Yustina ]

We wish to see you at the finish line, keep doing your best. 
                                                            
Best Regards,
Trojans 2024
                        `
                });
                console.log(`[declined][${new Date()}] email sent to ${response.email}`);
            } catch (mailError) {
                console.error(mailError);
            }
        }
        res.status(200).json({ message: "Decline process completed successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.sendLMSCred = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ message: "Invalid input", errors: errors.array() });
    }

    const { name, emails } = req.body;

    if (!name || !emails) {
        return res.status(400).json({ error: 'Invalid request. Missing or invalid "name"/"emails" parameter.' });
    }

    try {
        const accounts = await Account.findAll({
            where: {
                responseEmail: emails
            }
        });

        for (const account of accounts) {
            try {
                await mailer.sendMail({
                    from: "no-reply@trojans.site",
                    to: account.responseEmail,
                    subject: "AKUN UJIAN TROJANS 2024",
                    text: `
Hi ${name},

username: ${account.username}
password: ${account.password}

Trojans 2024 will be held using Safe Exam Browser. We highly recommend the participants to access this tutorial via:
http://trojans.site/GuideBook

This configuration file can be downloaded via:
http://trojans.site/sebConfiguration

SEB password: tr0j4ns!

If you have any other questions, you can contact our social media. 
                                            
📲Instagram : @trojans_id
✉️ Email    : humastrojans24@gmail.com
📞 Telegram : +6285815011053 [ @trojans2024 ]
📞 Whatsapp : +6285777637347 [ Sinta Permata ]
📞 Line      : @dellapgbn [ Della Yustina ]

We wish to see you at the finish line, keep doing your best. 
                                                            
Best Regards,
Trojans 2024
                    `
                });
                console.log(`[lms credential][${new Date()}] email sent to ${account.responseEmail}`);
            } catch (mailError) {
                console.error(mailError);
            }
        }
        res.status(200).json({ message: "Sending Account process completed successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.broadcast = (emails) => {
    Response.findAll({
        where: {
            email: emails
        }
    }).then(responses => {
            responses.forEach(response => {
            mailer.sendMail({
                from: "no-reply@trojans.site",
                to: response.email,
                subject: "TROJANS 2024",
                text: `
Hai ${response.name}, the entire series of Trojans 2024 activities has been completed 🥳

But, there is something that colleagues must do to assess and provide evaluations for these 2024 Trojans activities in order to improve the quality of Trojans activities in the following years 🎉

Therefore, participants must fill out the Trojans 2024 activity evaluation form at the following link before 20.00 WIB, okayy⚡️

https://s.id/AbsensiTrojans2024

Thank you Trojans Friends
Hope to see you at Trojans 2024!

Best Regards,
Trojans 2024


#Trojans2024
#BreakYourLimit
#TowardsTheImpossibility
`
            }).then(info => {
                console.log(`[Form Evaluation][${new Date()}] email sent to ${info.accepted}`);
            }).catch(err => {
                console.log(err);
            });
        });
    }).catch(err => {
        console.log(err);
    });
};

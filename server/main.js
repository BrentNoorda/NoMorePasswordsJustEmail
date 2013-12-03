var loginCodes = new Meteor.Collection("logincodes");

Meteor.methods({

    enter_email: function (email) {
        check(email,String);
        console.log("enter_email for email address: " + email)
        email = email.toLowerCase();

        // determine if this email address is already a user in the system
        var user = Meteor.users.findOne({'emails.address':email})
        console.log(email + " user = " + user);

        // create a loginCodes record, with a new LOGIN_CODE_LENGTH-digit code, to expire in LOGIN_CODE_TIMEOUT_MINUTES
        // make the code be LOGIN_CODE_LENGTH digits, not start with a 0, and not have any repeating digits
        var random_code = "";
        for ( ; random_code.length < LOGIN_CODE_LENGTH; ) {
            var char = Random.choice("0123456789");
            if ( random_code.length === 0 ) {
                if ( (char === "0") ) {
                    continue;
                }
            } else {
                if ( char === random_code.charAt(random_code.length-1) ) {
                    continue;
                }
            }
            random_code += char;
        }
        console.log(email + " random code = " + random_code);

        // add new record to timeout in LOGIN_CODE_TIMEOUT_MINUTES
        var timeout = (new Date()).valueOf() + (LOGIN_CODE_TIMEOUT_MINUTES * 60 * 1000);
        loginCodes.upsert({email:email},{email:email,code:random_code,timeout:timeout});
        var codeType = user ? "login" : "registration";

        Email.send({
            from: "brent.noorda@gmail.com",
            to: email,
            subject: "NoMorePasswordsJustEmail " + codeType + " code",
            text: ( "Your NoMorePasswordsJustEmail " + codeType + " code is:\r\n\r\n      " + random_code + "\r\n\r\n" +
                    "note: this code is only valid for " + LOGIN_CODE_TIMEOUT_MINUTES + " minutes." ),
            html: ( "<html><body>" +
                    '<p>Your <b><i>NoMorePasswordsJustEmail</i></b> ' + codeType + ' code is:</p>' +
                    '<p><font size="+1"><b>' + random_code + '</b></font></p>' +
                    '<p><font size="-1">note: this code is only valid for ' + LOGIN_CODE_TIMEOUT_MINUTES + ' minutes.</font></p>' +
                    '</body></html>' )
        });

        var ret = { known:(user !== undefined) };
        return ret;
    },

    enter_security_code: function (email,code) {
        check(email,String);
        check(code,String);
        console.log("enter_security_code for email address: " + email + " - code: " + code)
        email = email.toLowerCase();

        // delete any login codes that have timed out yet
        loginCodes.remove({ timeout: { $lt: (new Date()).valueOf() } });

        // If can find this record in login codes then all is well, else it failed
        var loginCode = loginCodes.findOne({email:email,code:code});
        if ( !loginCode ) {
            loginCodes.remove({email:email}); // user only gets one chance
            throw "failed to log in";
        }
        loginCodes.remove({email:email}); // user only gets one chance

        // if use does not already exist, then create this user
        var user = Meteor.users.findOne({'emails.address':email})
        var password = Random.hexString(30);
        var userId;
        if ( !user ) {
            userId = Accounts.createUser({email:email,password:password});
            console.log("CREATED userId = " + userId);
        } else {
            userId = user._id;
            console.log("FOUND userId = " + userId);
            Accounts.setPassword(userId,password);
        }

        this.setUserId(userId);

        return password;
    },

    cancel_login_code: function (email) {
        check(email,String);
        console.log("cancel_login_code for email address: " + email)
        email = email.toLowerCase();

        // delete any existing record for this user login codes
        loginCodes.remove({email:email});

        return "ok";
    }

});

Meteor.startup(function () {
    if ( Meteor.settings.MAIL_URL ) {
        process.env.MAIL_URL = Meteor.settings.MAIL_URL;
    }
});

// javascript server code for managing user registration/login/logout

var loginCodes = new Meteor.Collection("logincodes");
var Future = Npm.require('fibers/future');

function remove_expired_login_codes() {
    loginCodes.remove({ timeout: { $lt: (new Date()).valueOf() } });
}

function login_only_gets_one_chance(email) {
    loginCodes.remove({email:email});
}

function login_or_register_user_with_new_password(callbackObj,email) {
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

    callbackObj.setUserId(userId);

    return password;
}

Meteor.methods({

    enter_email: function (email,ssl) {
        check(email,String);
        check(ssl,Boolean);
        console.log("enter_email for email address: " + email);
        email = email.toLowerCase();

        // determine if this email address is already a user in the system
        var user = Meteor.users.findOne({'emails.address':email})
        console.log(email + " user = " + user);

        // create a loginCodes record, with a new LOGIN_CODE_LENGTH-digit code, to expire in LOGIN_CODE_TIMEOUT_MINUTES
        // make the code be LOGIN_CODE_LENGTH digits, not start with a 0, and not have any repeating digits
        var random_code = "";
        for ( ; random_code.length < LOGIN_CODE_LENGTH; ) {
            var chr = Random.choice("0123456789");
            if ( random_code.length === 0 ) {
                if ( (chr === "0") ) {
                    continue;
                }
            } else {
                if ( chr === random_code.charAt(random_code.length-1) ) {
                    continue;
                }
            }
            random_code += chr;
        }
        console.log(email + " random code = " + random_code);

        // for those who prefer to login with a link, also create a random string SECURITY_CODE_HASH_LENGTH
        // characters long
        var random_hash = "";
        for ( ; random_hash.length < SECURITY_CODE_HASH_LENGTH; ) {
            var chr = Random.choice("23456789ABCDEFGHJKLMNPQESTUVWXYZ");
            if ( random_hash.length !== 0 ) {
                if ( chr === random_hash.charAt(random_hash.length-1) ) {
                    continue;
                }
            }
            random_hash += chr;
        }
        var login_link_url = (ssl ? 'https' : 'http') + "://" + MY_DOMAIN + "/#" + random_hash;

        // add new record to timeout in LOGIN_CODE_TIMEOUT_MINUTES
        var timeout = (new Date()).valueOf() + (LOGIN_CODE_TIMEOUT_MINUTES * 60 * 1000);
        loginCodes.upsert({email:email},{email:email,code:random_code,hash:random_hash,timeout:timeout});
        var codeType = user ? "login" : "registration";


        Email.send({
            from: ADMIN_ACCOUNT_ID,
            to: email,
            subject: "NoMorePasswordsJustEmail " + codeType + " security code",
            text: ( "Your NoMorePasswordsJustEmail " + codeType + " security code is:\r\n\r\n      " + random_code + "\r\n\r\n" +
                    "or use this link:\r\n\r\n      " + login_link_url + "\r\n\r\n" +
                    "note: this single-use code is only valid for " + LOGIN_CODE_TIMEOUT_MINUTES + " minutes." ),
            html: ( "<html><body>" +
                    '<p>Your <b><i>NoMorePasswordsJustEmail</i></b> ' + codeType + ' security code is:</p>' +
                    '<p style="margin-left:2em;"><font size="+1"><b>' + random_code + '</b></font></p>' +
                    '<p>or click on this link</p>' +
                    '<p style="margin-left:2em;"><font size="-1"><a href="' + login_link_url + '">' + login_link_url + '</a></font></p>' +
                    '<p><font size="-1">note: this single-use code is only valid for ' + LOGIN_CODE_TIMEOUT_MINUTES + ' minutes.</font></p>' +
                    '</body></html>' )
        });

        var ret = { known:(user !== undefined) };
        return ret;
    },

    enter_security_code: function (email,code) {
        check(email,String);
        check(code,String);
        console.log("enter_security_code for email address: " + email + " - code: " + code);
        email = email.toLowerCase();

        // delete any login codes that have timed out yet
        remove_expired_login_codes();

        // If can find this record in login codes then all is well, else it failed
        var loginCode = loginCodes.findOne({email:email,code:code});
        login_only_gets_one_chance(email);
        if ( !loginCode ) {
            throw "failed to log in";
        }

        var password = login_or_register_user_with_new_password(this,email);

        return password;
    },

    cancel_login_code: function (email) {
        check(email,String);
        console.log("cancel_login_code for email address: " + email);
        email = email.toLowerCase();

        // delete any existing record for this user login codes
        login_only_gets_one_chance(email);

        return "ok";
    },

    login_via_url: function (hash) {
        check(hash,String);
        console.log("login_via_url for hash: " + hash);

        var loginCode = loginCodes.findOne({hash:hash});
        if ( loginCode ) {
            login_only_gets_one_chance(loginCode.email);
        }

        // I don't want bots just brute-force attacking the server to guess the login access. To prevent
        // that I'll force a minor little delay, minor enough to not bother a real user but enough to
        // relay annoy a billion bots. The make-it-look-synchronous part of this delate is taken from
        // what I learned at: https://gist.github.com/possibilities/3443021
        var future = new Future();
        setTimeout(function() { future.return(); }, 333);
        future.wait();

        if ( !loginCode ) {
            throw "blech; invalid code"
        }
        return {email:loginCode.email,pwd:login_or_register_user_with_new_password(this,loginCode.email)};
    }

});

Meteor.startup(function () {
    if ( Meteor.settings.MAIL_URL ) {
        process.env.MAIL_URL = Meteor.settings.MAIL_URL;
    }
});

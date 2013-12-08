comments = new Meteor.Collection("comments");

LOGIN_CODE_TIMEOUT_MINUTES = 5;
LOGIN_CODE_LENGTH = 5;
MAX_COMMENT_LENGTH = 1000;
MAX_COMMENTS_PER_USER = 20;
MAX_COMMENTS_SHOWN = 5000;

SECURITY_CODE_HASH_LENGTH = 40;

ADMIN_ACCOUNT_ID = "brent.noorda@gmail.com" // admin sends emails and can delete any comments

//MY_DOMAIN = "10.0.0.200:3000"
MY_DOMAIN = "nomorepasswordsjustemail.meteor.com"
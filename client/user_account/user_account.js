// javascript client code for managing user registration/login/logout

Handlebars.registerHelper('session', function(name) {
    return Session.get(name);
});

Template.enter_email.events({
    'submit #enter-email-form': function (e, tmpl) {
        // Don't postback
        e.preventDefault();

        var email = $('#enter-email').val().trim();
        if ( email.length === 0 ) {
            $('#enter-email').focus();
        } else {
            Meteor.call("enter_email",email,function(error,result){
                if ( error ) {
                    alert("Error with that email address. Please try again.");
                    $('#enter-email').focus();
                } else {
                    Session.set("email",email);
                    Session.set("known",result.known);
                }
            });
        }
    }
});

Template.enter_email.rendered = function() {
    $('#enter-email').focus();
};

Template.enter_security_code.events({
    'click #reset-email': function (e, tmpl) {
        Meteor.call("cancel_login_code",Session.get("email"));
        Session.set("email",null);
    },
    'submit #enter-security-code-form': function (e, tmpl) {
        // Don't postback
        e.preventDefault();

        var code = $('#enter-security-code').val().trim();
        if ( code.length === 0 ) {
            $('#enter-security-code').focus();
        } else {
            Meteor.call("enter_security_code",Session.get("email"),code,function(error,pwd){
                if ( error ) {
                    alert("That code is invalid, or has timed out. Sorry. Please try again.");
                    Meteor.call("cancel_login_code",Session.get("email"));
                    Session.set("email",null);
                } else {
                    Meteor.loginWithPassword({email:Session.get("email").toLowerCase()},pwd);
                }
            });
        }
    }
});

Template.enter_security_code.rendered = function() {
    $('#enter-security-code').focus();
};

Template.loggedin.email = function() {
    return Meteor.user().emails[0].address;
};

Template.loggedin.events({
    'click #logout-btn': function (e, tmpl) {
        Meteor.logout();
        Session.set("email",null);
    }
});

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
            Meteor.call("enter_email",
                email,
                -1 != window.location.protocol.toLowerCase().indexOf('https'),
                function(error,result){
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
    watch_for_login_hashcode();
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

// as long as we're in the login state, keep an eye out for a hashcode which means we're logging
// in - this is put here as a watcher, instead of just catching this on page reload, because on
// the iphone if an email reloads a link, and nothing put the hashcode changes, the page isn't
// going to really reload
var old_login_hashcode = "";
var hashcode_timeout = null;
function watch_for_login_hashcode(one_time_only) {

    function watcher() {
        hashcode_timeout = null;
        // if the part after # looks like one of our login URL's, then try to use it
        var hash = window.location.hash.slice(1);
        if ( hash !== old_login_hashcode ) {
            old_login_hashcode = hash;

            if ( hash.length === SECURITY_CODE_HASH_LENGTH ) {
                Meteor.call("login_via_url",hash.toUpperCase(),function(error,loginInfo){
                    if ( error ) {
                        // not much we can do with such an error
                    } else {
                        Meteor.loginWithPassword({email:loginInfo.email},loginInfo.pwd);
                    }
                });
            }
        }
        if ( !one_time_only ) {
            hashcode_timeout = Meteor.setTimeout(watcher,333);
        }
    }

    if ( hashcode_timeout !== null ) {
        Meteor.clearTimeout(hashcode_timeout);
    }
    watcher();
}

Template.enter_security_code.rendered = function() {
    $('#enter-security-code').focus();
    watch_for_login_hashcode();
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

Template.loggedin.rendered = function() {
    watch_for_login_hashcode(true); // this will cause us to stop checking
};

Meteor.startup(function() {
    watch_for_login_hashcode(true); // in case there's a hashcode at startup
});
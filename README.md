NoMorePasswordsJustEmail (NMPJE) - _because passwords suckity suck suck suck_
========================

This is a proof-of-concept web site with no account passwords, using only email address for
sign-up and log-in verification, as demonstrated at [NoMorePasswordsJustEmail.meteor.com](https://NoMorePasswordsJustEmail.meteor.com/)

Jump To:

* [What's so bad about passwords?](#whats-so-bad)
* [Example NMPJE login user flow](#example-flow)
* [Does this seem awkward?](#awkward)
* [Is this secure?](#is-secure)
* [The code](#code)
* [Outstanding issues](#issues)
* [History](#history)
* [Related links](#links)

------------------------------------------------------------------------------

<a name="whats-so-bad"></a>
## What's so bad about passwords?

Passwords suck. Good, strong passwords are difficult to think up,
difficult to type,
and difficult to remember--but all too easy to crack.
When you forget your password (as we all do), there's the sucky "email me instructions to
change my password" and then you have to go through that difficult password creation all over again.
Multiply these difficulties by every service you use (you _better not_ be reusing passwords), and there's
just no denying it: passwords suck!

------------------------------------------------------------------------------

<a name="example-flow"></a>
## Example NMPJE login user flow

On NMPJE your email address **is** your user id (adding separate account names would have just muddied
the proof-of-concept).

When you come to [NoMorePasswordsJustEmail.meteor.com](https://nomorepasswordsjustemail.meteor.com/) and are not already logged in, you see this one-field dialog:

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/get_email.png)

Entering your email address...

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/enter_email.png)

...and pressing enter replaces that one-field dialog with this dialog:

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/get_code.png)

That security code has been emailed to your email address. That email may look like this:

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/email.png)

Enter that security code into the web page...

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/enter_code.png)

...and press enter to be logged in.

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/logged_in.png)

Alternatively, you can click on the link in that email and be logged in directly.

You will stay logged in, even if you leave the browser and come back, until you press
the logout button.

The above flow is exactly the same for new users registering for the system, with only slight
wording changes so they're aware this is a new user account.

------------------------------------------------------------------------------

<a name="awkward"></a>
## Does this seem awkward?

I don't know if this is more awkward than most sites, it probably depends on how much you hate passwords.

Most of the time the user won't see any of this, since they'll usually be logged in, and so this
is usually as convenient as any web site that remembers logins. Signing up is certainly easier
with this method than with traditional password-dependant
schemes. Signing in, after a logout, is a little less convenient if you're good at remembered
passwords.

Again, it probably depends on how much you hate passwords.

------------------------------------------------------------------------------

<a name="is-secure"></a>
## Is this secure?

I wager that it's at least as secure as any site that allows one to reset passwords via email.

Considering the difficulty in coming up with good passwords, and the increasing ease of hacking
passwords, then is probably more secure than most situations.

On the whole, the only fair statement is: It's as secure as a person's email is secure.

------------------------------------------------------------------------------

<a name="code"></a>
## The code

None of the code here is particularly interesting. I put it together pretty quickly, and any
other developer could do it at least as well. In NMPJE I'm more interested in testing the
user-flow than in the particular implementation.

The part of NMPJE handling this user login, registration, and logout stuff is:

* [user_account.html](https://github.com/BrentNoorda/NoMorePasswordsJustEmail/blob/master/client/user_account/user_account.html) -
client-side html and handlebars/MeteorJS templates
* [client/user_account.js](https://github.com/BrentNoorda/NoMorePasswordsJustEmail/blob/master/client/user_account/user_account.js) -
client-side MeteorJS template stuff
* [server/user_account.js](https://github.com/BrentNoorda/NoMorePasswordsJustEmail/blob/master/server/user_account.js) -
server-side code to manage accounts and sending emails

There is one MeteorJS workaround here, so that when running on the live meteor.com website we won't hit
the 200 emails/day limit (this also helps make our email less likely to end in the spam filters). That workaround
is in [this commit code](https://github.com/BrentNoorda/NoMorePasswordsJustEmail/commit/381a994513ba71a0dc7c21d1019f439b382cf5ca),
 and is based on [this stackoverflow question](http://stackoverflow.com/questions/20337309/meteor-deploy-mail-url-not-being-set).

------------------------------------------------------------------------------

<a name="issues"></a>
## Outstanding issues

I'm so far convinced this is as safe as standard login systems, and more convenient a lot of
the time, but there are still concerns

**non-standard** - users are very very accustomed to standard email/password login forms. How to make
this seem not so weird?

**denial-of-login?** - It is conceivable that a bunch of bots might simulate a user trying to log
in from thousands of clients. In each case that would cause a new login code to be created for that
legitimate user. If that legitimate user then is trying to log in from their own browser (assume they
aren't already logged in) may find that their security code is constantly being re-created faster than
they can try to enter one. That legitimate user will also be receiving a whole lot of emails. This is
a pretty weird scenario, and maybe it's not worth considering, but still I don't have a solution yet.

------------------------------------------------------------------------------

<a name="history"></a>
## History:

* v1.000 - 2013/05/03 - Initial release demonstrating login with just an emailed security key
* v1.010 - 2013/05/04 - Add alternative security method of a link in the email

------------------------------------------------------------------------------

<a name="links"></a>
## Related links:

* Many discussions of the issue - [1](http://security.stackexchange.com/questions/12828/if-i-include-a-forgot-password-service-then-whats-the-point-of-using-a-passwor)
[2](http://security.stackexchange.com/questions/4009/how-to-implement-non-password-authentication-in-a-web-site)
[3](https://medium.com/p/d6509aa3c60b)
[4](http://www.infoq.com/news/2011/07/BrowserID)
[5](http://www.therealtomrose.com/kick-ass-website-login-flow-email-only-no-password/)
[6a](http://notes.xoxco.com/post/27999787765/is-it-time-for-password-less-login)
[6b](http://notes.xoxco.com/post/28288684632/more-on-password-less-login)
[7](https://news.ycombinator.com/item?id=4308190)
[8](https://github.com/relekang/django-nopassword)
(_if I'd known so many people have already talked about this, I might not have bothered, so I'm glad I didn't know_)
* [Mozilla Persona](https://login.persona.org/) - Tool any site can use to login with just email (skipping the security code step) [video](https://www.youtube.com/watch?v=nJff23UdNAI)
* [Handshake.js](http://sendgrid.com/blog/lets-deprecate-password-email-authentication/) - Similar recent POC to do away with passwords, as javascript and a service.
* [NoPassword](http://nopassword.alexsmolen.com/) - Similar to NMPJE, as some Ruby code.
* [NoMorePasswordsJustEmail.meteor.com](https://NoMorePasswordsJustEmail.meteor.com/) - this Proof of Concept
* [Brent Noorda Brick Wall](http://www.brent-noorda.com/) - the author's homepage

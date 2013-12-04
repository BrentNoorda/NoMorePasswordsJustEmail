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
* [Related links](#links)

------------------------------------------------------------------------------

<a name="whats-so-bad"></a>
# What's so bad about passwords?

Passwords suck. Good, strong passwords are difficult to think up,
difficult to type,
and difficult to remember--but all too easy to crack.
When you forget your password (as we all do), there's the sucky "email me instructions to
change my password" and then you have to go through that difficult password creation all over again.
Multiply these difficulties by every service you use (you _better not_ be reusing passwords), and there's
just no denying it: passwords suck!

------------------------------------------------------------------------------

<a name="example-flow"></a>
# Example NMPJE login user flow

On NMPJE your email address **is** your user id (adding separate account names would have just muddied
the proof-of-concept).

When someone comes to [NoMorePasswordsJustEmail.meteor.com](https://nomorepasswordsjustemail.meteor.com/) and is not already logged in, they see this one-field dialog:

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/get_email.png)

Entering their email address...

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/enter_email.png)

...and pressing enter replaces that one-field dialog with this dialog:

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/get_code.png)

That security code has been emailed to their email address. That email may look like this:

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/email.png)

Enter that security code into the web page...

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/enter_code.png)

...and press enter to be logged in.

![](http://dl.dropboxusercontent.com/u/41075/NoMorePasswordsJustEmail/logged_in.png)

That user will stay logged in, even if they leave the browser and come back, until they press
the logout button.

The above flow is exactly the same for new users registering for the system, with only slight
wording changes so they're aware this is a new user account.

------------------------------------------------------------------------------

<a name="awkward"></a>
# Does this seem awkward?

I don't know if this is more awkward than most sites, it probably depends on how much you hate passwords.

Most of the time the user won't see any of this, since they'll usually be logged in, and so this
is usually as convenient as any web site that remembers logins. Signing up is certainly easier
with this method than with traditional password-dependant
schemes. Signing in, after a logout, is a little less convenient if you're good at remembered
passwords.

Again, it probably depends on how much you hate passwords.

------------------------------------------------------------------------------

<a name="is-secure"></a>
# Is this secure?

I wager that it's at least as secure as any site that allows one to reset passwords via email.

Considering the difficulty in coming up with good passwords, and the increasing ease of hacking
passwords, then is probably more secure than most situations.

On the whole, the only fair statement is: It's as secure as a person's email is secure.

------------------------------------------------------------------------------

<a name="code"></a>
# The code

I wager that it's at least as secure as any site that allows one to reset passwords via email.

Considering the difficulty in coming up with good passwords, and the increasing ease of hacking
passwords, then is probably more secure than most situations.

On the whole, the only fair statement is: It's as secure as a person's email is secure.

------------------------------------------------------------------------------

<a name="links"></a>
# Related links:

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
* [Handshake.js](http://sendgrid.com/blog/lets-deprecate-password-email-authentication/) - Similar recent POC to do away with passwords, as javascript and a service.
* [NoMorePasswordsJustEmail.meteor.com](https://NoMorePasswordsJustEmail.meteor.com/) - this Proof of Concept
* [Brent Noorda Brick Wall](http://www.brent-noorda.com/) - the author's homepage

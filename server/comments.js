Meteor.methods({

    add_comment: function (comment) {
        check(comment,String);
        var email = Meteor.user().emails[0].address;
        console.log("add_comment from " + email + ": " + comment);
        if ( (comment.length < 1) ) {
            throw new Meteor.Error(1,"no text in the comment","");
        }
        if ( (MAX_COMMENT_LENGTH <= comment.length) ) {
            throw new Meteor.Error(2,"please keep comment under " + MAX_COMMENT_LENGTH + " characters. (yours was " + comment.length + ")","");
        }
        var when = (new Date()).valueOf();

        // so that we don't have too many comments from any one person remove more than
        // MAX_COMMENTS_PER_USER existing comments from this user
        var oldestComments = comments.find({_id:Meteor.user()._id},{
            skip: MAX_COMMENTS_PER_USER - 1,
            sort: {when:-1}
        });
        oldestComments.forEach(function (comment) {
            comments.remove(comment._id);
        });

        comments.insert({text:comment,email:email,when:when});
        return 0;
    },

    delete_comment: function(id) {
        check(id,String);
        var current_user_id = Meteor.user().emails[0].address;
        if ( current_user_id === ADMIN_ACCOUNT_ID ) {
            // administrator is allowed to delete anyone's comments
            comments.remove({ _id:id });
        } else {
            // this will fail if logged-in user is not the one who made this comment
            comments.remove({ _id:id, email:current_user_id });
        }
    }

});

Meteor.startup(function () {
    Meteor.publish('comments', function() {
        return comments.find({},{sort:{when:-1},limit:MAX_COMMENTS_SHOWN});
    });
});

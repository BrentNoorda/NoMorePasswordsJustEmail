Template.comments.events({
    'keypress #add-comment': function (e,tmpl) {
        if ( e.charCode == 13 ) {
            var comment = $('#add-comment').val().trim();
            $('#add-comment').val(comment);
            if ( comment.length !== 0 ) {
            	Meteor.call(
	                "add_comment",
	                comment,
                    function (err, result) {
                        if (err) {
                            alert("Could not add comment " + err.reason);
                        } else {
                            $('#add-comment').val("");
                        }
                    }
    	       );
            }
        }
    }
});

Template.comments.comments = function () {
    return comments.find({}, {sort: {when:-1} } );
};

Template.comments.can_delete = function(email) {
    try {
        var current_user_id = Meteor.user().emails[0].address;
        return ( (current_user_id === email) ||
                 (ADMIN_ACCOUNT_ID === current_user_id) );
    } catch(e) {
        return false;
    }
}

Meteor.startup(function () {
    Meteor.subscribe("comments");
});

delete_comment = function(id) {
    Meteor.call("delete_comment",id);
}
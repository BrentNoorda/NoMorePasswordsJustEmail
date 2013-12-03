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

Meteor.startup(function () {
    Meteor.subscribe("comments");
});

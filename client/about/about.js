Template.about.events({
    'click h4 a': function(e,tmpl) {
        e.preventDefault();
        if ( $('#what-is-it p').is(':visible') ) {
            $('#what-is-it p').hide('slow');
        } else {
            $('#what-is-it p').show('slow');
        }
    }
});

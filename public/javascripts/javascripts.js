$(document).ready(function() {

	// function refresh() {
	//   $('div#carousel').children().fadeOut('fast');
	//   $('div#carousel').fadeOut('fast');
	//   $('#container').load('/carousel/refresh');
 //    }

 //    setInterval(refresh, 2000)

    $('#postComment').click(function() {
    	console.log('here')
    	var output = $.post("/comment", {
    		id: $('#currentPhoto').attr('data-id'),
    		comment: $('#comment').val()
    	}, function(err, data) {
    		$('#posted').html(data ? "Comment Posted!" : "You comment was not posted.")
    	});
    });

	$('#backcolor').click(function() {
      var back_color = $('input').val();
	  console.log(back_color);
      $('input').val('');
      $('#userdiv').css('background-color', back_color)
      $.post('/color/update', {
      	color: back_color
      });
	});

	$('#logout').click(function() {
		$.get('/logout')
	});

	$('#carousel').rcarousel({
      visible:1, 
      step:1
    });

	$('select').change(function() {
		console.log($(':selected').val())
		$('div#carousel').fadeOut('fast')
		$.post('/photos', {
			id: $(':selected').val()
		})
	});
});
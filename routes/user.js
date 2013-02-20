
/*
 * GET users listing.
 */

var models = require('../database'),
    User = models.user,
    Facebook = require('facebook-node-sdk')

exports.login_page = function(req, res) {
  res.render('login.jade', {
    title: "Login!"
  });
}

exports.login = function(req, res) {
  res.redirect('/');
}

exports.list = function(req, res){
  req.facebook.api('/me', function(err, data) {
  	User.find({id: data.id}).execFind(function(err, found_user) {
      
      if(err) console.log(err)

      // if there is no user, log the user
      else if (found_user.length === 0) {
   	    req.facebook.api('/me/picture?redirect=false&type=large', function(err, data) {
    	    req.session.picture = data.data.url;
    	  });
        var user = new User({
          id: data.id,
      	  name: data.name,
      	  picture: req.session.picture,
      	  prof_color : 'white',
      	  font: 'Courier New'
        });
        user.save(function(err) {
    	  if (err) {return console.log('error', err); res.send('Error saving!')}
    	});
    	// console.log(user)
    	req.session.user = user;
    	req.session.id = user.id;
      res.redirect('/')
      }

      // if the user exists in the db, display his pic
      else {
      	req.session.user = found_user[0];
        req.facebook.api('/me/picture?redirect=false&type=large', function(err, picData) {
          if (err) console.log('error', err)
          req.facebook.api('/me/photos?type=normal', function(err, pictures) {
            if (err) console.log('error', err)
              console.log(pictures)
              res.render('profile.jade', {
              	title: req.session.user.name, 
              	picture: picData.data.url,
                prof_color: req.session.user.prof_color,
                photos: pictures.data
              });
            })
        });
      } 
    });
  });
}

exports.update_color = function(req, res) {
  req.facebook.api('/me', function(err, data){
  	if (err) return console.log(err)
  	else {
  		console.log(req.body.color)
  		console.log('user', data)
  		User.update({'id': data.id}, {$set: {prof_color: req.body.color}}, {upsert: true}, function(err, found_user) {
  			if(err) return console.log(err)
			  else {
			  	console.log('user', found_user)
		  	}
  		});
    } 
  });
}

exports.load_photos = function(req, res) {
  var friendId = req.body.id;
  req.facebook.api('/'+friendId+'/photos', function(err, data) {
    if (err) console.log('error', err)
    // console.log(data.data);        // print out this, figure out where albums are
    var photos = new Array
    for (i=0;i<data.data.length;i++) {
      if (data.data[i].images.length !== 0) {
        var images = data.data[i].images;
        for (j=0;j<images.length;j++) {
          photos.push({source: images[j].source, height:images[j].height, width:images[j].width})
        }
      }
    }
    console.log(req.session.photos);
    res.render('carousel.jade', {
      photos: photos
    })
  })
}

exports.photo_render = function(req, res) {
  photos = req.body.photos;
  console.log(photos)
  res.render('_carousel.jade', {
    photos: photos
  })
}

exports.comment = function(req, res) {
  console.log(req.body);
  var id = req.body.id;
  var comment = req.body.comment;
  var url = '/' + id + '/comments';
  console.log('url: ', url)
  req.facebook.api(url, 'post', {
    message: comment
  }, function(err, data) {
    if(err) res.send(!err)
  })
}

exports.log_out = function(req, res) {
    req.user = null;
    req.session.destroy();
    res.redirect('/login_page');
};

// exports.carousel_refresh = function(req, res) {
//   res.render("carousel.jade", {
//     photos: req.session.photos
//   });
// };
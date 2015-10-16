
module.exports = function(app){

 	var controller = require('./../../manages/userController')(app);

 	app.param('user_id', controller.params);

    app.route('/users')
    	.get(function(req,res,next){
			controller.get(next).then(function(user){
				res.status(200).json(user);
			})
		})
    	.post(controller.post);

    app.route('/api/users/:user_id')
    	.get(controller.getOne)
    	.put(controller.put)
    	.delete(controller.del);
}
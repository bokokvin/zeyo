'use strict';

module.exports = function(app) {
    var users   = require('../controllers/usersController'),
        comptes = require('../controllers/compteController'),
        cartes  = require('../controllers/carteController');

    // users Routes
    app.route('/register')
    .get(users.register_form)
    .post(users.create_a_user);

    app.route('/home')
    .get(users.requireLogin, users.home);

    app.route('/login')
    .get(users.login_form)
    .post(users.log_a_user);

    app.route('/logout')
    .get(users.logout);




    app.route('/users/:userId')
    .get(users.requireLogin, users.get_a_user)
    .put(users.update_a_user)
    .delete(users.delete_a_user);



    
    
    // comptes routes

    app.route('/send')
    .get(users.requireLogin, comptes.sending_form)
    .post(comptes.send);

    app.route('/transaction')
    .get(users.requireLogin, comptes.transaction_form);

    app.route('/compte/create')
    .post(users.requireLogin, comptes.create);





    // cartes routes

    app.route('/cartes')
    .get(users.requireLogin, cartes.get_form)
    .post(cartes.recharger)
}
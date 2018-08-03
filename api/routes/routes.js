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
    .get(users.requireLogin, users.home); // Affiche Homepage

    app.route('/login')
    .get(users.login_form) // Affiche formulaire de connexion
    .post(users.log_a_user); // Connecte un utilisateur 

    app.route('/logout')
    .get(users.logout); // Déconnecte un utilisateur


    app.route('/users/:userId')
    .get(users.requireLogin, users.get_a_user) // Récupère un utilisateur
    .put(users.requireLogin, users.update_a_user) // Modifie un utilisateur
    .delete(users.requireLogin, users.delete_a_user); // Supprime un utilisateur



    
    
    // comptes routes

    app.route('/comptes')
    .get(users.requireLogin, comptes.liste); // Affiche liste des comptes

    app.route('/compte/create')
    .post(users.requireLogin, comptes.create); // Crée un compte 

    app.route('/transaction')
    .get(users.requireLogin, comptes.transaction); // Affiche page de choix du compte pour la transaction

    app.route('/transaction/form/:compteId')
    .get(users.requireLogin, comptes.transaction_form); // Affiche formuliare de transaction

    app.route('/send')
    .post(users.requireLogin, comptes.send); // Effectue la transaction

    

    

    




    // cartes routes

    app.route('/cartes')
    .get(users.requireLogin, cartes.get_form) // Affiche formulaire pour recharger son compte
    .post(cartes.recharger) // Effectue le rechargement du compte
}
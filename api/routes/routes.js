'use strict';

module.exports = function(app) {
    var users   = require('../controllers/usersController'),
        comptes = require('../controllers/compteController'),
        cartes  = require('../controllers/carteController');



    // users Routes
    app.route('/register')
    .get(users.register_form)  // Affiche formulaire d'inscription
    .post(users.create_a_user); // Crée un utilisateur

    app.route('/register/pro')
    .get(users.register_form_pro)  // Affiche formulaire d'inscription pour un pro
    .post(users.create_a_high_user); // Crée un utilisateur pro

    app.route('/home')
    .get(users.home); // Affiche Homepage

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
    app.route('/transaction/all')
    .get(users.requireLogin, users.transaction_all_by_user); // Affiche toutes les transactions d'un utilisateur

    app.route('/comptes')
    .get(users.requireLogin, comptes.liste); // Affiche liste des comptes

    app.route('/compte/create')
    .get(users.requireLogin, comptes.create_form) // Affiche le formulaire de création de compte
    .post(users.requireLogin, comptes.create); // Crée un compte 

    app.route('/transaction')
    .get(users.requireLogin, comptes.transaction); // Affiche page de choix du compte pour la transaction

    app.route('/transaction/form/:compteId')
    .get(users.requireLogin, comptes.transaction_form); // Affiche formuliare de transaction

    app.route('/send')
    .post(users.requireLogin, comptes.send); // Effectue la transaction

    app.route('/activite')
    .get(users.requireLogin, comptes.activite); // Affiche le fil d'activité du compte








    // cartes routes

    app.route('/carte')
    .get(users.requireLogin, cartes.cartes)// Affiche page de choix du compte à recharger
    .post(cartes.recharger); // Effectue le rechargement du compte

    app.route('/carte/form/:compteId')
    .get(users.requireLogin, cartes.get_form); // Affiche formulaire pour recharger son compte
    
}
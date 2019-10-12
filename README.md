Nom du projet: 
    -Website Pictionary.
Nom de l'auteur : 
    -ENNASSEF Ismail.
Description fonctionnelle: 
    - Drawff est un site qui permet de jouer , en ligne et avec des amis , à un jeu Pictionary.Il permet de créer un compte et une salle de jeu, puis des amis peuvent rejoindre et dessiner sur un canvas. La liste de mot est modifiable seulement par l'administrateur, et le mot est choisi au hasard.
Prerequis: 
    -node 10.16.1, git, MongoDB 4.2.
Description technique: 
    -La siteweb est composé d'une backend utilisant express pour lancer le serveur, socketio pour la communication en temps réel avec le client et http pour la relation serveur-socket. La frontend est geré grâce à React, mais en MPA. Ainsi react sert à load les components sur des pages html, au lieu d'avoir un unique fichier index.js qui load tout les components à tour de rôle. La compilation de React est faite grâce à Babel.
    La liste de mot nécessaire au jeu est présente au niveau du serveur dans un fichier apart, nous utilisons donc fn aussi pour manipuler (ajouter,supprimer,lire) le fichier en question.
    La base de donnée est gérée par MongoDb, et la relation entre serveur-BDD est faite grâce à mongoose qui simplifie la création de modèle. La mise en page est faite grâce à à la fois du css pure et du bootstrap quand celui-ci ne permet pas une liberté suffisante. Le login se fait grâce à JWT qui est stocké localement chez le client à travers des cookies. Enfin , esLint permet de trouver les eventuels bugs et code à optimiser. 
Procédure d'installation:
    La BDD est déjà en ligne sur un cluster mongodb. Il suffit donc pour lancer le serveur de taper dans la commande à la racine du projet (...\DTY) la commande npm run dev. Puisque le front est en MPA, il ne nécessite pas d'être lancé. L'url pour pouvoir se connecter à mongoDB grâce à Compass est présente dans le ficher \DTY\config\dev.env  si l'on veut pouvoir la visualiser. Il n'y a pas besoin de précharger des données puisque le  cluster est en ligne de façon permanente.
Certains compte nécessaire:
    Si l'on veut tester un compte Admin, voici les identifiants :
        Nom de compte: Admin@gmail.com  ( le systeme est sensible au majuscule)
        MDP: 123456
    Si l'on veut tester un compte lambda:
        Nom de compte: Lambda@gmail.com
        MDP: 123456
Liste des fonctionnalité:
    - Créer un compte
    - Se connecter
    - Se deconnecter
    -Créer une salle de jeu
    -Visualiser toutes les salles de jeu
    - Si Admin, supprimer n'importe quelle salle
    - Si utilisateur lambda, voir l'historique des salles crées
    - Rejoindre une salle
    -Dessiner sur le canvas , choisir la couleur et la taille du trait , effacer
    -Parler dans le chat ( message Welcome , autoscroll,envoyer des messages)
    - Système de jeu mise en place ( +1 si le mot est trouvé, mise à jour du score à la fin de chaque timer)
    - Fonctionnalité additionnelle: 
        -Pour éviter la triche, une personne ne peut plus  participer au chat après avoir trouvé le bon mot, jusqu'au prochain mots à trouver.
        -Seul le dessinateur peut voir les outils de dessins

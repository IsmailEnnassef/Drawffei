# Project Title

Website Pictionary By ENNASSEF Ismail: Drawff est un site qui permet de jouer , en ligne et avec des amis , à un jeu Pictionary.Il permet de créer un compte et une salle de jeu, puis des amis peuvent rejoindre et dessiner sur un canvas. La liste de mots est modifiable seulement par l'administrateur, et le mot est choisi au hasard.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

node 10.16.1, git, MongoDB 4.2

```
Give examples
```
### Technical description
Le siteweb est composé d'une backend utilisant express pour lancer le serveur, socketio pour la communication en temps réel avec le client et http pour la relation serveur-socket. La frontend est geré grâce à React, mais en MPA. Ainsi react sert à load les components sur des pages html, au lieu d'avoir un unique fichier index.js qui load tout les components à tour de rôle. La compilation de React est faite grâce à Babel.<br />
    La liste de mot nécessaire au jeu est présente au niveau du serveur dans un fichier apart, nous utilisons donc fn aussi pour manipuler (ajouter,supprimer,lire) le fichier en question.
    La base de donnée est gérée par MongoDb, et la relation entre serveur-BDD est faite grâce à mongoose qui simplifie la création de modèle. La mise en page est faite grâce à à la fois du css pure et du bootstrap quand celui-ci ne permet pas une liberté suffisante. Le login se fait grâce à JWT qui est stocké localement chez le client à travers des cookies. Enfin , esLint permet de trouver les eventuels bugs et code à optimiser.<br />

### Installing

 *  La BDD est déjà en ligne sur un cluster mongodb. <br /> Il suffit donc pour lancer le serveur de :<br />taper dans la commande à la racine du projet 1- npm install package.json 2- la commande npm run dev. 

npm install package.json dans la racine du projet
```
npm install package.json
```

npm run dev

```
npm run dev
```

Puisque le front est en MPA, il ne nécessite pas d'être lancé. L'url pour pouvoir se connecter à mongoDB grâce à Compass est présente dans le ficher \config\dev.env  si l'on veut pouvoir la visualiser. Il n'y a pas besoin de précharger des données puisque le  cluster est en ligne de façon permanente. <br />
 Pour visualiser le site, il suffit d'aller a : 127.0.1.1:3001. De préference sur Firefox.
Certains comptes nécessaires:<br />
    *  Si l'on veut tester un compte Admin, voici ses identifiants : <br />
        *  Nom de compte: Admin@gmail.com  ( le système est sensible aux majuscules)<br />
        *  MDP: 123456<br />
    *  Si l'on veut tester un compte lambda: <br />
        *  Nom de compte: Lambda@gmail.com <br />
        *  MDP: 123456 <br />
## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc





**Liste des fonctionnalités**: <br />
    *  Créer un compte <br />
    *  Se connecter <br /> 
    *  Se déconnecter <br /> 
    *  Créer une salle de jeu <br />
    *  Visualiser toutes les salles de jeu <br />
    *  Si Admin, supprimer n'importe quelle salle <br />
    *  Si utilisateur lambda, voir l'historique des salles crées <br />
    *  Rejoindre une salle <br />
    *  Dessiner sur le canvas , choisir la couleur et la taille du trait , effacer <br />
    *  Parler dans le chat ( message Welcome , autoscroll,envoyer des messages) <br /> 
    *  Système de jeu mise en place ( +1 si le mot est trouvé, mise à jour du score à la fin de chaque timer) <br />
    *  Fonctionnalités additionnelles: <br />
        *  Pour éviter la triche, une personne ne peut plus  participer au chat après avoir trouvé le bon mot, jusqu'au prochain mot à trouver. <br />
        *  Seul le dessinateur peut voir les outils de dessins <br />

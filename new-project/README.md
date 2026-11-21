# Générateur de citations

Un petit site qui affiche une citation selon un thème : courage, amitié, sagesse ou anime. On peut choisir entre une citation célèbre et une citation générée par le site.

Réalisé pour le HackPhantom.

## Lancer le site

Il n'y a rien à installer. Il suffit d'ouvrir `index.html` dans un navigateur.

## Comment ça marche

- **Citation célèbre** : le site tire une phrase au hasard dans la liste du thème choisi (`citations` dans `script.js`).
- **Citation générée** : le site assemble un début et une fin de phrase du même thème. Les débuts finissent tous par « quand » et les fins ont le même sujet, donc toutes les combinaisons restent correctes en français.
- Le thème « Hasard » choisit un thème différent à chaque clic.
- Les citations gardées sont enregistrées dans le navigateur (`localStorage`), elles restent donc après avoir fermé la page.
- Le bouton « Écouter » utilise la synthèse vocale du navigateur.

Raccourcis clavier : `C` pour une citation célèbre, `G` pour une citation générée.

## Fichiers

- `index.html` : la page
- `style.css` : l'apparence, avec une couleur par thème et un mode sombre
- `script.js` : toute la logique

## Ajouter du contenu

Pour ajouter une citation célèbre, il suffit d'ajouter une phrase dans la liste du thème dans `citations`. Pour la génération, on ajoute des éléments dans `debuts` et `fins` du thème, en gardant la même structure de phrase.

## Ce que je voudrais ajouter

- Une génération par une vraie IA (il faudrait un petit serveur pour cacher la clé d'API)
- Plus de thèmes
- Un export de la citation en image
// Citations célèbres, classées par thème
const citations = {
    courage: [
        "Le courage n'est pas l'absence de peur, mais la capacité de vaincre ce qui fait peur.",
        "Ne perdez jamais espoir face aux adversités.",
        "La réussite appartient à ceux qui osent."
    ],
    amitie: [
        "L’amitié double les joies et divise les peines.",
        "Un ami est quelqu’un qui connaît votre cœur.",
        "L'amitié est une âme qui habite deux corps."
    ],
    sagesse: [
        "La sagesse commence dans l’émerveillement.",
        "Apprendre sans réfléchir est vain.",
        "Le sage réfléchit avant d'agir."
    ],
    anime: [
        "Vivre n'est pas un crime.",
        "Plus l'obscurité est profonde, plus la lumière brille.",
        "N'abandonne jamais tes rêves."
    ]
};

// Pour la génération : un début + une fin, tirés dans le même thème.
// Les débuts finissent tous par "quand" et les fins ont le même sujet,
// donc n'importe quelle combinaison reste grammaticale.
const generateur = {
    courage: {
        debuts: ["Le vrai courage apparaît quand", "On devient plus fort quand", "La peur recule quand"],
        fins: ["tu fais un pas malgré le doute.", "tu choisis d'agir plutôt que d'attendre.", "tu refuses de te laisser définir par tes craintes."]
    },
    amitie: {
        debuts: ["Une vraie amitié se révèle quand", "Les liens les plus forts naissent quand", "L'amitié grandit quand"],
        fins: ["on reste présent dans les moments difficiles.", "on partage autant les rires que les silences.", "chacun accepte l'autre tel qu'il est."]
    },
    sagesse: {
        debuts: ["La sagesse grandit quand", "La vraie sagesse commence quand", "Le calme de l'esprit naît quand"],
        fins: ["tu prends le temps d'écouter avant de parler.", "tu apprends de tes erreurs au lieu de les fuir.", "tu acceptes de ne pas tout savoir."]
    },
    anime: {
        debuts: ["Un vrai héros se lève quand", "La force d'un guerrier naît quand", "Ton destin change quand"],
        fins: ["tu protèges ceux que tu aimes.", "tu refuses d'abandonner tes rêves.", "tu transformes ta douleur en détermination."]
    }
};

let themeChoisi = "courage";
let citationActuelle = "";
let citationPrecedente = "";
let timerEcriture = null;
let favoris = lireStockage("favoris", []);

function el(id) {
    return document.getElementById(id);
}

function auHasard(liste) {
    return liste[Math.floor(Math.random() * liste.length)];
}

// localStorage peut être bloqué (navigation privée...), d'où les try/catch
function lireStockage(cle, defaut) {
    try {
        const valeur = JSON.parse(localStorage.getItem(cle));
        return valeur === null ? defaut : valeur;
    } catch (e) {
        return defaut;
    }
}

function ecrireStockage(cle, valeur) {
    try {
        localStorage.setItem(cle, JSON.stringify(valeur));
    } catch (e) {}
}

function message(texte) {
    const toast = el("toast");
    toast.textContent = texte;
    toast.classList.add("show");
    clearTimeout(message.timer);
    message.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

// ----- Thème -----

function choisirTheme(nom) {
    themeChoisi = nom;
    if (nom !== "hasard") document.body.dataset.theme = nom;
    document.querySelectorAll(".chip").forEach(c => {
        c.classList.toggle("active", c.dataset.theme === nom);
    });
}

// Renvoie le thème à utiliser (au hasard si "Hasard" est choisi)
function themeEnCours() {
    if (themeChoisi !== "hasard") return themeChoisi;
    const nom = auHasard(Object.keys(citations));
    document.body.dataset.theme = nom;
    return nom;
}

// ----- Affichage -----

function ecrireLettreParLettre(texte) {
    clearInterval(timerEcriture);
    const zone = el("quote");
    zone.textContent = "";
    let i = 0;
    timerEcriture = setInterval(() => {
        i++;
        zone.textContent = texte.slice(0, i);
        if (i >= texte.length) clearInterval(timerEcriture);
    }, 20);
}

function afficher(fabrique, type) {
    // on évite d'afficher deux fois la même citation de suite
    let texte;
    let essais = 0;
    do {
        texte = fabrique();
        essais++;
    } while (texte === citationPrecedente && essais < 10);

    citationPrecedente = citationActuelle = texte;

    const badge = el("badge");
    badge.hidden = false;
    badge.textContent = type;

    ecrireLettreParLettre(texte);
    majBoutonFavori();
}

function readQuote() {
    const theme = themeEnCours();
    afficher(() => auHasard(citations[theme]), "Célèbre");
}

function generateQuote() {
    const theme = themeEnCours();
    const { debuts, fins } = generateur[theme];
    afficher(() => auHasard(debuts) + " " + auHasard(fins), "Générée");
}

// ----- Actions sur la citation -----

async function copier() {
    if (!citationActuelle) return message("Génère d'abord une citation.");
    try {
        await navigator.clipboard.writeText(citationActuelle);
        message("Citation copiée");
    } catch (e) {
        message("Copie impossible sur ce navigateur");
    }
}

function ecouter() {
    if (!citationActuelle) return message("Génère d'abord une citation.");
    if (!("speechSynthesis" in window)) return message("Lecture vocale non supportée");
    speechSynthesis.cancel();
    const voix = new SpeechSynthesisUtterance(citationActuelle);
    voix.lang = "fr-FR";
    speechSynthesis.speak(voix);
}

// ----- Favoris -----

function majBoutonFavori() {
    el("favBtn").textContent = favoris.includes(citationActuelle) ? "Retirer" : "Garder";
}

function basculerFavori() {
    if (!citationActuelle) return message("Génère d'abord une citation.");
    const position = favoris.indexOf(citationActuelle);
    if (position >= 0) {
        favoris.splice(position, 1);
    } else {
        favoris.unshift(citationActuelle);
    }
    ecrireStockage("favoris", favoris);
    afficherFavoris();
    majBoutonFavori();
}

function afficherFavoris() {
    const liste = el("favList");
    el("favSection").hidden = favoris.length === 0;
    liste.innerHTML = "";

    favoris.forEach((texte, i) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = texte;

        const bouton = document.createElement("button");
        bouton.className = "link-btn";
        bouton.textContent = "Supprimer";
        bouton.onclick = () => {
            favoris.splice(i, 1);
            ecrireStockage("favoris", favoris);
            afficherFavoris();
            majBoutonFavori();
        };

        li.append(span, bouton);
        liste.appendChild(li);
    });
}

// ----- Mode sombre -----

function modeSombre(actif) {
    document.body.classList.toggle("dark", actif);
    el("darkBtn").textContent = actif ? "Mode clair" : "Mode sombre";
    ecrireStockage("sombre", actif);
}

// ----- Événements -----

document.querySelectorAll(".chip").forEach(c => {
    c.addEventListener("click", () => choisirTheme(c.dataset.theme));
});
el("famousBtn").addEventListener("click", readQuote);
el("genBtn").addEventListener("click", generateQuote);
el("copyBtn").addEventListener("click", copier);
el("speakBtn").addEventListener("click", ecouter);
el("favBtn").addEventListener("click", basculerFavori);
el("darkBtn").addEventListener("click", () => {
    modeSombre(!document.body.classList.contains("dark"));
});

document.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const touche = e.key.toLowerCase();
    if (touche === "c") readQuote();
    if (touche === "g") generateQuote();
});

// ----- Démarrage -----

modeSombre(lireStockage("sombre", window.matchMedia("(prefers-color-scheme: dark)").matches));
choisirTheme("courage");
afficherFavoris();
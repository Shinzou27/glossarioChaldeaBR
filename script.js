import colors from './colors.json' assert {type: 'json'}

//HTML Elements
const glossaryDiv = document.getElementById("glossary-div");
const inputSearch = document.querySelector("input[type='search']");
const image = document.getElementById("logo");
const buttonDiv = document.getElementById("filter-buttons");
const redefineButton = document.getElementById("redefine-button");
const clearButton = document.getElementById("clear-button");
const backToTopButton = document.getElementById('back-to-top');
const glossaryCounter = document.getElementById('counter');

//Glossary constants
const glossaryURL = "https://opensheet.elk.sh/1wYMpoRo6smoPV2wOd8Lb06pqjZuyRcXQTlVvAY7Iz9U/Glossary";
const termTypes = [];
const notSingularity = ['general', 'skills', 'untranslated', 'attributes', 'bestiary', 'class'];

//Glossary variables
let words;
let filteredGlossary = [];
let clickedButtons = [];

//Get terms from API
async function getWords(url) {
    const data = await fetch(url).then((resp) => resp.json());
    return data.map(({undefined, ...others}) => others);
}

//Fill words array, filter array and term types array
document.body.onload = async () => {
    words = await getWords(glossaryURL);
    words.forEach((item) => {
        if (!termTypes.includes(item.type)) {
            termTypes.push(item.type);
        }
    });
    words = words.sort(function (a, b) {
        if (a.englishWord > b.englishWord) {
            return 1;
        }
        if (a.englishWord < b.englishWord) {
            return -1;
        }
        return 0;
    });
    filteredGlossary = words;
    glossaryCounter.innerHTML = `Mostrando ${filteredGlossary.length} resultados de ${words.length}.`;
    image.src = 'img/header.png';
    words.forEach((element) => {
        if (!termTypes.includes(element.type)) {
            termTypes.push(element.type);
        }
        createElements(element)
    });
    termTypes.forEach((element) => {
        createButton(element);
        clickedButtons.push(element)
    })
}

/*
----------------------------
| BUTTON-RELATED FUNCTIONS |
----------------------------
*/

//Little Easter Egg
image.onclick = () => {
    if (image.src.includes('img/header.png')) {
        image.src = 'img/banner.png';
    }
    else {
        image.src = 'img/header.png'
    }
}

//Show all terms
redefineButton.onclick = () => {
    clickedButtons = [];
    termTypes.forEach((element) => clickedButtons.push(element));
    let counter = 0;
    buttonDiv.childNodes.forEach((node) => {
        counter++;
        if (counter >= 6) {
            const index = termTypes.indexOf(localize(node.innerHTML.toLowerCase(), 'english'));
            node.style.backgroundColor = colors[index].bg;
            node.style.color = colors[index].txt;
            node.style.opacity = 1;
        }
    });
    reloadGlossary();
}

//Hide all terms
clearButton.onclick = () => {
    clickedButtons = [];
    let counter = 0;
    buttonDiv.childNodes.forEach((node) => {
        counter++;
        if (counter >= 6) {
            node.style.backgroundColor = colors[colors.length - 1].bg;
            node.style.color = colors[colors.length - 1].txt;
            node.style.opacity = 0.25;
        }
    });
    reloadGlossary();
}

//Back to top of the site
backToTopButton.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/*
--------------------------
| HTML-RELATED FUNCTIONS |
--------------------------
*/

//Create HTML term cards dynamically
function createElements(object) {
    const innerDiv = document.createElement('div');
    innerDiv.id = "term";
    const ptDiv = document.createElement('div');
    ptDiv.id = "ptDiv";
    const english = document.createElement('h2');
    const portuguese = document.createElement('h3');
    const description = document.createElement('p');
    const copyButton = document.createElement('img');
    const styles = innerDiv.style;
    if (notSingularity.includes(object.type)) {
        styles.backgroundImage = 'url(img/default.png)';
    } else {
        styles.backgroundImage = 'url(img/' + object.type + '.png)';
    }
    styles.borderRadius = '8px';
    styles.backgroundSize = 'cover';
    styles.backgroundPosition = 'center';

    english.innerText = object.englishWord;
    portuguese.innerText = object.portugueseWord;
    copyButton.src = "./img/copy.png";
    copyButton.id = 'copy-img';
    copyButton.onclick = () => {
        navigator.clipboard.writeText(object.portugueseWord).then(() => {
            const alert = document.createElement('p')
            alert.innerText = "Copiado!";
            alert.id = "hidden";
            ptDiv.appendChild(alert);
            setTimeout(() => {
                ptDiv.removeChild(alert);
            }, 2000)
        })
    }
    if (object.description == "") {
        description.innerText = "Sem descrição.";
    }
    else {
        description.innerText = object.description;
    }
    innerDiv.appendChild(english);
    ptDiv.appendChild(portuguese);
    ptDiv.appendChild(copyButton);
    innerDiv.appendChild(ptDiv);
    innerDiv.appendChild(description);
    if (!notSingularity.includes(object.type)) {
        const singularity = document.createElement('p');
        singularity.id = "singularity";
        singularity.innerText = "Aparece em: " + appearanceInterpreter(object.type, object.appearance);
        innerDiv.appendChild(singularity);
    }
    glossaryDiv.appendChild(innerDiv);
}

//Update glossary after clicking buttons or typing on search bar
function reloadGlossary() {
    glossaryDiv.innerHTML = "";
    filteredGlossary = words.filter((item) => item.englishWord.toLowerCase().includes(inputSearch.value.toLowerCase()))
    filteredGlossary = filteredGlossary.filter((item) => arrayMatch(clickedButtons, item.appearance, item.type))
    glossaryCounter.innerText = `Mostrando ${filteredGlossary.length} resultados de ${words.length}.`;
    filteredGlossary.forEach((element) => { createElements(element) })
}

//Reload glossary every time the input changes
inputSearch.oninput = () => {
    reloadGlossary();
}

//Create buttons on document load and changes visibility if clicked
function createButton(type) {
    const button = document.createElement('button');
    const index = termTypes.indexOf(type);
    button.type = "button";
    button.id = "button";
    button.style.backgroundColor = colors[index].bg;
    button.style.color = colors[index].txt;
    button.onclick = () => {
        if (!clickedButtons.includes(type)) {
            button.style.backgroundColor = colors[index].bg;
            button.style.color = colors[index].txt;
            clickedButtons.push(type);
            button.style.opacity = 1;
        } else {
            button.style.backgroundColor = colors[colors.length - 1].bg;
            button.style.color = colors[colors.length - 1].txt;
            button.style.opacity = 0.25;
            removeFromArray(clickedButtons, type);
        }
        reloadGlossary();
    }
    button.innerText = localize(type, 'portuguese').toUpperCase();
    buttonDiv.appendChild(button);
}

/*
-----------------------
| AUXILIARY FUNCTIONS |
-----------------------
*/

//Get binary string and translate it to an array with chapter names
function appearanceInterpreter(type, string) {
    let array = string.split('');
    let finalString = capitalizeFirstLetter(localize(type, 'portuguese'));
    for(let i = 0; i < array.length; i++) {
        if(array[i] == '1') {
            finalString += ", " + capitalizeFirstLetter(localize(termTypes[i+5], 'portuguese'));
        }
    }
    return finalString;
}

//Verifies if a term is in a determined chapter
function arrayMatch(array, string, type) {
    if(array.includes(type)) {
        return true;
    }
    let chaptersString = string.split('');
    let chaptersArray = [];
    for(let i = 0; i < chaptersString.length; i++) {
        if(chaptersString[i] == '1') {
            chaptersArray.push(termTypes[i+5]);
        }
    }
    for(let i = 0; i < array.length; i++) {
        if(chaptersArray.includes(array[i])) {
            return true;
        }
    }
    return false;

}

//Remove an item from an array
function removeFromArray(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
            array.splice(i, 1)
        }
    }
}

//Change chapter's name. Used for preview purposes only
function localize(name, language) {
    const english = ['lostbelt_prologue', 'general', 'attributes', 'events', 'bestiary', 'sin' , 'class', 'yuga_kshetra', 'avalon-le-fae', 'nahui_mictlan', 'untranslated'];
    const portuguese = ['lostbelts (prólogo)', 'geral', 'atributos', 'eventos', 'bestiário', 's i n' , 'classes', 'yuga kshetra', 'avalon le fae', 'nahui mictlán', 'não traduzidos'];
    if (language == 'portuguese') {
        return english.indexOf(name) >= 0 ? portuguese[english.indexOf(name)] : name;
    }
    else if (language == 'english') {
        return portuguese.indexOf(name) >= 0 ? english[portuguese.indexOf(name)] : name;
    }
}

//Capitalize every first letter of a word
function capitalizeFirstLetter(string) {
    string = string.split(" ");
    for(let i = 0; i < string.length; i++) {
        string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
    }
    string = string.join(" ");
    return string;
}
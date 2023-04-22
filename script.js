const glossaryDiv = document.getElementById("glossary-div");
const inputSearch = document.querySelector("input[type='search']");
const image = document.getElementById("logo");
const buttonDiv = document.getElementById("filter-buttons");
const redefineButton = document.getElementById("redefine-button");
const clearButton = document.getElementById("clear-button");
const backToTopButton = document.getElementById('back-to-top');
const glossaryCounter = document.getElementById('counter');

import glossary from './glossary.json' assert {type: 'json'}
import colors from './colors.json' assert {type: 'json'}
const termTypes = [];
const notSingularity = ['general', 'skills', 'untranslated', 'attributes', 'bestiary', 'class'];
glossary.words.forEach((item) => {
    if (!termTypes.includes(item.type)) {
        termTypes.push(item.type);
    }
})

const words = glossary.words.sort(function (a, b) {
    if (a.englishWord > b.englishWord) {
        return 1;
    }
    if (a.englishWord < b.englishWord) {
        return -1;
    }
    return 0;
});

let filteredGlossary = [];
let clickedButtons = [];

document.body.onload = () => {
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

image.onclick = () => {
    if (image.src.includes('img/header.png')) {
        image.src = 'img/banner.png';
    }
    else {
        image.src = 'img/header.png'
    }
}
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

backToTopButton.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function capitalizeFirstLetter(string) {
    string = string.split(" ");
    for(let i = 0; i < string.length; i++) {
        string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
    }
    string = string.join(" ");
    return string;
}
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
        console.log(object.portugueseWord);
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
        singularity.innerText = "Aparece em: " + capitalizeFirstLetter(localize(object.type, 'portuguese'));
        innerDiv.appendChild(singularity);
    }
    glossaryDiv.appendChild(innerDiv);
}
function reloadGlossary() {
    glossaryDiv.innerHTML = "";
    filteredGlossary = words.filter((item) => item.englishWord.toLowerCase().includes(inputSearch.value.toLowerCase()))
    filteredGlossary = filteredGlossary.filter((item) => clickedButtons.includes(item.type))
    glossaryCounter.innerText = `Mostrando ${filteredGlossary.length} resultados de ${words.length}.`;
    filteredGlossary.forEach((element) => { createElements(element) })
}
inputSearch.oninput = () => {
    reloadGlossary();
}
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


function removeFromArray(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
            array.splice(i, 1)
        }
    }
}

function localize(name, language) {
    const english = ['lostbelt_prologue', 'general', 'attributes', 'bestiary', 'sin' , 'class', 'yuga_kshetra', 'untranslated'];
    const portuguese = ['lostbelts (prólogo)', 'geral', 'atributos', 'bestiário', 's i n' , 'classes', 'yuga kshetra', 'não traduzidos'];
    if (language == 'portuguese') {
        return english.indexOf(name) >= 0 ? portuguese[english.indexOf(name)] : name;
    }
    else if (language == 'english') {
        return portuguese.indexOf(name) >= 0 ? english[portuguese.indexOf(name)] : name;
    }
}
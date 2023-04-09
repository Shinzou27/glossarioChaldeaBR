const glossaryDiv = document.getElementById("glossary-div");
const inputSearch = document.querySelector("input[type='search']");
const image = document.getElementById("logo");
const buttonDiv = document.getElementById("filter-buttons");
const redefineButton = document.getElementById("redefine-button");
const backToTopButton = document.getElementById('back-to-top');

import glossary from './glossary.json' assert {type: 'json'}
import colors from './colors.json' assert {type: 'json'}
const singularities = [];
glossary.words.forEach((item) => {
    if (!singularities.includes(item.type)) {
        singularities.push(item.type);
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

let clickedButtons = [];

document.body.onload = () => {
    image.src = 'img/header.png';
    words.forEach((element) => {
        if (!singularities.includes(element.type)) {
            singularities.push(element.type);
        }
        createElements(element)
    });
    singularities.forEach((element) => {
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
    singularities.forEach((element) => clickedButtons.push(element));
    let counter = 0;
    buttonDiv.childNodes.forEach((node) => {
        counter++;
        if (counter >= 4) {
            const index = singularities.indexOf(node.innerHTML.toLowerCase());
            node.style.backgroundColor = colors[index].bg;
            node.style.color = colors[index].txt;
            node.style.opacity = 1;
        }
    });
    reloadGlossary(redefineButton.type);
}

backToTopButton.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createElements(object) {
    const innerDiv = document.createElement('div');
    innerDiv.id = "term";
    const english = document.createElement('h2');
    const portuguese = document.createElement('h4');
    const description = document.createElement('p');
    const styles = innerDiv.style;
    if (['general', 'skills', 'untranslated'].includes(object.type)) {
        styles.backgroundImage = 'url(img/default.png)';
    } else {
        styles.backgroundImage = 'url(img/' + object.type + '.png)';
    }
    styles.borderRadius = '8px';
    styles.backgroundSize = 'cover';
    styles.backgroundPosition = 'center';

    english.innerText = object.englishWord;
    portuguese.innerText = object.portugueseWord;
    if (object.description == "") {
        description.innerText = "Sem descrição.";
    }
    else {
        description.innerText = object.description;
    }
    innerDiv.appendChild(english);
    innerDiv.appendChild(portuguese);
    innerDiv.appendChild(description);
    if (object.type != "general" && object.type != "untranslated" && object.type != "skills") {
        const singularity = document.createElement('p');
        singularity.id = "singularity";
        singularity.innerText = "Aparece em: " + capitalizeFirstLetter(object.type);
        innerDiv.appendChild(singularity);
    }
    glossaryDiv.appendChild(innerDiv);
}
function reloadGlossary(origin) {
    glossaryDiv.innerHTML = "";
    let filteredGlossary = [];
    if (origin == 'search') {
        filteredGlossary = words.filter((item) => item.englishWord.toLowerCase().includes(inputSearch.value.toLowerCase()))
    } else if (origin == 'button') {
        filteredGlossary = words.filter((item) => clickedButtons.includes(item.type))
    }
    filteredGlossary.forEach((element) => { createElements(element) })
}
inputSearch.oninput = () => {
    reloadGlossary(inputSearch.type);
}
function createButton(type) {
    const button = document.createElement('button');
    const index = singularities.indexOf(type);
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
        console.log(clickedButtons);
        reloadGlossary(button.type);
    }
    button.innerText = type.toUpperCase();
    buttonDiv.appendChild(button);
}


function removeFromArray(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
            array.splice(i, 1)
        }
    }
}

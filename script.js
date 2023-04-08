const glossaryDiv = document.getElementById("glossary-div");
const inputSearch = document.querySelector("input[type='search']");
const image = document.getElementById("logo");

import glossary from './glossary.json' assert {type: 'json'}
const words = glossary.words.sort(function(a, b) {
    if (a.englishWord > b.englishWord) {
        return 1;
    }
    if (a.englishWord < b.englishWord) {
        return -1;
    }
    return 0;
});

inputSearch.oninput = () => {
    glossaryDiv.innerHTML = "";
    words.filter((item) => item.englishWord.toLowerCase().includes(inputSearch.value.toLowerCase())).forEach((element) => { createElements(element) });
}

document.body.onload = () => {
    image.src = 'img/header.png';
    words.forEach((element) => {
        createElements(element)
    });
}

image.onclick = () => {
    if (image.src == (document.URL+'img/header.png')) {
        image.src = 'img/banner.png';
    }
    else {
        image.src = 'img/header.png'
    }
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
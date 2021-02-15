


/////get data from url
let params = new URLSearchParams(location.search);
const cat = params.get('category');
console.log(cat);

///////////////////

const popularBook = document.querySelector('#popular-book');
const otherBook = document.querySelector('#other-book');
const category = document.querySelector('#category');

// let head = document.createElement('h6');
category.textContent = cat.toUpperCase();
// category.appendChild(head)

function renderList(doc){
    let a = document.createElement('a');
    let section = document.createElement('div');
    let imgdiv = document.createElement('div');
    let content = document.createElement('div');
    let action = document.createElement('div');
    let button = document.createElement('button');
    let img = document.createElement('img');
    //let hr = document.createElement('hr');
    let  title= document.createElement('div');
    let  author= document.createElement('div');
  
    a.setAttribute('href',`item.html?id=${doc.data().isbn}&cat=${doc.data().category}`)
    section.setAttribute('data-id', doc.id);
    a.setAttribute('class','link')
    // section.setAttribute('style','width:35% !important;');
    section.setAttribute('class','maindiv col s6 m6 l3');
    imgdiv.setAttribute('class','card-image ');
    content.setAttribute('class','contentdiv ');
    title.setAttribute('class','title grey-text text-darken-4');
    author.setAttribute('class','author grey-text text-darken-2');
    author.setAttribute('style','font-size:1rem');
    button.setAttribute('class','btn black-text center logged-in yellow lighten-1 ');
    //button.setAttribute('style','display:none; ');
    action.setAttribute('class','card-action action center');
    title.textContent = doc.data().title;
    author.textContent = doc.data().author;
    img.src = doc.data().image;
    img.setAttribute('style','border-radius:5px;')
    button.textContent = 'Borrow'; 

    section.appendChild(imgdiv);
    imgdiv.appendChild(img);
    content.appendChild(title);
    content.appendChild(author);
    section.appendChild(content)
    //action.appendChild(button)
    //section.appendChild(action)
    a.appendChild(section)
    popularBook.appendChild(a);   
}

// function renderList(doc){
    
    
//     let section = document.createElement('li');
//     let imgspan = document.createElement('span');
//     let imga = document.createElement('a');
//     let img = document.createElement('img');
//     let content = document.createElement('span');
//     let  title= document.createElement('a');
//     let  author = document.createElement('a');
//     let action = document.createElement('span');
//     let button = document.createElement('button');
  
    
//     // section.setAttribute('style','width:35% !important;');
//     section.setAttribute('data-id', doc.id);
//     section.setAttribute('class','row book-li grey lighten-4 z-index-1');
//     ///img
//     imgspan.setAttribute('class','col s12 l3 img-span');
//     imga.setAttribute('href',`item.html?id=${doc.data().refNum}`)
//     img.src = doc.data().image;
//     img.setAttribute('style','border-radius:10px;')
//     //content
//     content.setAttribute('class','col s12 l7 content ');
//     title.setAttribute('class','black-text title')
//     author.setAttribute('class','grey-text text-darken-3 author')
//     title.setAttribute('href',`item.html?id=${doc.data().refNum}`)
//     author.setAttribute('href',`item.html?id=${doc.data().refNum}`)
//     title.textContent = doc.data().title;
//     author.textContent = 'by - '+doc.data().author;
//     ///borrow
//     action.setAttribute('class','col s12 l2 action valign-wrapper');
//     button.setAttribute('class','btn button blue center lighten-1 borrow');
//     button.textContent = 'Borrow'; 

//     ///img append
//     imgspan.appendChild(imga);
//     imga.appendChild(img);
//     ///content append
//     content.appendChild(title);
//     content.appendChild(author);
//     ///action append
//     action.appendChild(button)
//     ///section append
//     section.appendChild(imgspan);
//     section.appendChild(content)
//     section.appendChild(action)
//     ///html append
//     popularBook.appendChild(section);

// }

// const cat = document.querySelector('#myLnk')
// const val = cat.getAttribute('data-id');
db.collection("Books").where('category','==',cat).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        renderList(doc);
    });
}); 


///////other book
// function renderAll(doc){
    
//     let section = document.createElement('li');
//     let imgspan = document.createElement('span');
//     let imga = document.createElement('a');
//     let img = document.createElement('img');
//     let content = document.createElement('span');
//     let  title= document.createElement('a');
//     let  author = document.createElement('a');
//     let action = document.createElement('span');
//     let button = document.createElement('button');
  
    
//     // section.setAttribute('style','width:35% !important;');
//     section.setAttribute('data-id', doc.id);
//     section.setAttribute('class','row book-li grey lighten-4 z-index-1');
//     section.setAttribute('style','border-radius:10px;')
//     ///img
//     imgspan.setAttribute('class','col s6 l3 img-span');
//     imga.setAttribute('href',`item.html?id=${doc.data().refNum}`)
//     img.src = doc.data().image;
//     img.setAttribute('style','border-radius:10px;')
//     //content
//     content.setAttribute('class','col s6 l7 content ');
//     title.setAttribute('class','black-text title')
//     author.setAttribute('class','grey-text text-darken-3 author')
//     title.setAttribute('href',`item.html?id=${doc.data().refNum}`)
//     author.setAttribute('href',`item.html?id=${doc.data().refNum}`)
//     title.textContent = doc.data().title;
//     author.textContent = 'by - '+doc.data().author;
//     ///borrow
//     action.setAttribute('class','col s6 l2 action valign-wrapper');
//     button.setAttribute('class','btn button blue center lighten-1 borrow');
//     button.textContent = 'Borrow'; 

//     ///img append
//     imgspan.appendChild(imga);
//     imga.appendChild(img);
//     ///content append
//     content.appendChild(title);
//     content.appendChild(author);
//     ///action append
//     action.appendChild(button)
//     ///section append
//     section.appendChild(imgspan);
//     section.appendChild(content)
//     section.appendChild(action)
//     ///html append
//     otherBook.appendChild(section);

// }

function renderAll(doc){
    let a = document.createElement('a');
    let section = document.createElement('div');
    let imgdiv = document.createElement('div');
    let content = document.createElement('div');
    let action = document.createElement('div');
    let button = document.createElement('button');
    let img = document.createElement('img');
    //let hr = document.createElement('hr');
    let  title= document.createElement('div');
    let  author= document.createElement('div');
  
    a.setAttribute('href',`item.html?id=${doc.data().isbn}&cat=${doc.data().category}`)
    section.setAttribute('data-id', doc.id);
    // section.setAttribute('style','width:35% !important;');
    section.setAttribute('class','maindiv col s6 m6 l3');
    imgdiv.setAttribute('class','card-image ');
    content.setAttribute('class','card-content ');
    title.setAttribute('class','title grey-text text-darken-4');
    author.setAttribute('class','author grey-text text-darken-2');
    author.setAttribute('style','font-size:1rem');
    button.setAttribute('class','btn yellow black-text logged-in lighten-1 ');
    //button.setAttribute('style','display:none; ');
    action.setAttribute('class','card-action action center');
    title.textContent = doc.data().title;
    author.textContent = doc.data().author;
    img.src = doc.data().image;
    img.setAttribute('style','border-radius:5px;')
    button.textContent = 'Borrow'; 

    section.appendChild(imgdiv);
    imgdiv.appendChild(img);
    content.appendChild(title);
    //content.appendChild(author);
    section.appendChild(content)
    //action.appendChild(button)
    //section.appendChild(action)
    a.appendChild(section)
    otherBook.appendChild(a);   
}

// const cat = document.querySelector('#myLnk')
// const val = cat.getAttribute('data-id');


db.collection("Books").limit(8).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        renderAll(doc);
        
    });
    
}); 


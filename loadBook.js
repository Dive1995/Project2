const popularBook = document.querySelector('#popular-book');

function renderList(doc){
    let section = document.createElement('a');
    let imgdiv = document.createElement('div');
    let content = document.createElement('div');
    let action = document.createElement('div');
    let button = document.createElement('button');
    let img = document.createElement('img');
    //let hr = document.createElement('hr');
    let  title= document.createElement('div');
  
    section.setAttribute('href',`item.html?id=${doc.data().isbn}&cat=${doc.data().category}`)
    section.setAttribute('data-id', doc.id);
    // section.setAttribute('style','width:35% !important;');
    section.setAttribute('class',' lighten-4 crd z-depth-5 col s6 m6 l3  offset-l1 offset-s1');
    imgdiv.setAttribute('class','card-image ');
    title.setAttribute('class','card-content center grey-text text-darken-4');
    button.setAttribute('class','btn blue lighten-1 ');
    button.setAttribute('style','display:none; ');
    action.setAttribute('class','card-action action');
    title.textContent = doc.data().title;
    img.src = doc.data().image;
    img.setAttribute('style','border-radius:10px;')
    button.textContent = 'Borrow'; 

    section.appendChild(imgdiv);
    imgdiv.appendChild(img);
    content.appendChild(title);
    section.appendChild(content)
    action.appendChild(button)
    section.appendChild(action)
    popularBook.appendChild(section);   
}


// function renderList(doc){
//     let section = document.createElement('div');
//     let figure = document.createElement('div');
//     let content = document.createElement('div');
//     let action = document.createElement('div');
//     let button = document.createElement('button');
//     let img = document.createElement('img');
//     let  figcaption= document.createElement('div');
  

//     section.setAttribute('data-id', doc.id);
//     // section.setAttribute('style','width:35% !important;');
//     section.setAttribute('class','card grey lighten-4 crd col s6 m6 l3  offset-l1 offset-s1');
//     figure.setAttribute('class','card-image responsive-img');
//     figcaption.setAttribute('class','card-content ');
//     button.setAttribute('class','btn blue lighten-1 ');
//     action.setAttribute('class','card-action action');
//     figcaption.textContent = doc.data().title;
//     img.src = doc.data().image;
//     img.setAttribute('style','border-radius:10px;')
//     button.textContent = 'Borrow'; 

//     section.appendChild(figure);
//     figure.appendChild(img);
//     content.appendChild(figcaption);
//     section.appendChild(content)
//     action.appendChild(button)
//     section.appendChild(action)
//     popularBook.appendChild(section);   
// }



db.collection("Books").limit(6).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        renderList(doc);
    });
}); 
/////// hide nav bar elements as logged in & logged out => function

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const adminItems = document.querySelectorAll('.admin');
const accountdetails = document.querySelector('.account-details');

const setupUI = (user) =>{
    if(user){
        //aacc info 
        db.collection('User').doc(user.uid).get().then(doc => {
            const html = `
            <a href='cart.html' class="brown-text btn grey lighten-3 z-depth-1 text-darken-4">${doc.data().lname.toUpperCase()} &nbsp;</a>
        `;
        accountdetails.innerHTML = html;

        }).then(() => {
            if(user.admin){
                adminItems.forEach(item => item.style.display = 'inline-block');
            }
        console.log('loged in button asctivated');
        loggedInLinks.forEach(item => item.style.display = 'inline-block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
        })

    }else{
        console.log('loged out button asctivated');
        adminItems.forEach(item => item.style.display = 'none');
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'inline-block');
    }
}


/// listen for auth status  (logged in / logged out)
auth.onAuthStateChanged(user => {
    if(user){
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
            
        })
        console.log('**** user loged in ****', user);
       
    }else{
        console.log('**** user loged out ****');
        setupUI();
      
    }
})
//////log out

const logout = document.querySelector('#logout'); //////////// #logout should be the id of the logout button or the a tag whichever you create
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('signed out');
        window.location = 'userlogin.html';
          ////for more function to add , add below
    })
})


///////////////////////////////////////////////////////////////////////

/////get data from url
let params = new URLSearchParams(location.search);
const id = params.get('id');

const cat = params.get('cat');
console.log(id);
console.log(cat);

///////////////////

const popularBook = document.querySelector('#popular-book');
const category = document.querySelector('#category');
const catheader = document.querySelector('.cat-header');

// let head = document.createElement('h6');
catheader.textContent = cat.toUpperCase();
// category.appendChild(head)

function renderList(doc){
    let section = document.createElement('li');
    let imgspan = document.createElement('span');
    let img = document.createElement('img');
    let content = document.createElement('span');
    let  title= document.createElement('h4');
    let  author = document.createElement('h6');
    let  isbn = document.createElement('p');
    let  edition = document.createElement('p');
    let  pages = document.createElement('p');
    let  noofbooks = document.createElement('p');
    let  year = document.createElement('p');
    let action = document.createElement('span');
    let reserve = document.createElement('button');
    let hr = document.createElement('hr');
  
    
    // section.setAttribute('style','width:35% !important;');
    section.setAttribute('data-id', doc.id);
    section.setAttribute('class','row  book-li grey lighten-4 z-depth-1');
    ///img
    imgspan.setAttribute('class','col s12 l3 img-span');
    //imga.setAttribute('href',`item.html?id=${doc.data().refNum}`)
    img.src = doc.data().image;
    img.setAttribute('style','border-radius:10px;')
    //content
    content.setAttribute('class','col s12 l8 offset-l1 book-content ');
    title.setAttribute('class','black-text title')
    author.setAttribute('class','black-text author')
    //title.setAttribute('href',`item.html?id=${doc.data().refNum}`)
    //author.setAttribute('href',`item.html?id=${doc.data().refNum}`)
    hr.setAttribute('style','opacity:0.3')
    title.textContent = doc.data().title;
    isbn.textContent = 'ISBN - '+doc.data().isbn;
    edition.textContent = 'Edition - '+doc.data().edition;
    pages.textContent = 'No of Pages - '+doc.data().pages;
    noofbooks.textContent = 'No of Books available - '+doc.data().noofbooks;
    year.textContent = 'Year Released - '+doc.data().year;
    author.textContent = 'by '+doc.data().author;
    ///borrow
    action.setAttribute('class','col s12 l2 action valign-wrapper');
    reserve.setAttribute('class','btn blue center lighten-1 borrow');
    reserve.textContent = 'Borrow'; 

    ///img append
    imgspan.appendChild(img);
    ///content append
    content.appendChild(title);
    content.appendChild(author);
    content.appendChild(hr);
    content.appendChild(pages);
    content.appendChild(year);
    content.appendChild(edition);
    content.appendChild(noofbooks);
    content.appendChild(isbn);
    ///action append
    content.appendChild(reserve)
    ///section append
    section.appendChild(imgspan);
    section.appendChild(content)
    //section.appendChild(action)
    ///html append
    popularBook.appendChild(section);

    db.collection("Books").where('category','==',doc.data().category).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            renderAll(doc);
            
        });
        
    }); 
    
    
    reserve.addEventListener('click',(e) =>{
        e.preventDefault();
        auth.onAuthStateChanged(user => {
            if(user){
                reserveBook(user)
            }else{
                reserveBook()
            }
        })
    })

    // if(doc.data().isbn == id){
    //     alert('Book already added in your list.');
    // }

    const reserveBook = (user) =>{
        if(user){
            //aacc info 
            
            if (confirm("Reserve this Book?")) {

                console.log(username);
                console.log('nope');

                var date = new Date();

                if(type == 'member'){
                    console.log('yes ,member');
                    db.collection('Reserve').add({
                        isbn : id,
                        title : doc.data().title,
                        edition : doc.data().edition,
                        author : doc.data().author,
                        user : user.uid,
                        name : username,
                        regno : regno,
                        date : date,
                        status : 'cart',
                    }).then(() => {
                        alert('Book added to your list !');
                    })
                }else{
                    alert('You are not a member yet !');
                }

 
              } else {
                console.log('Reserve canceled');
                alert("Book wasn't added!")
              }
    
        }else{
           alert('Please Login / Register to continue.')
           window.location = 'userlogin.html';
        }
    }

}
auth.onAuthStateChanged(user => {
    if(user){
        bookitem(user)
    }else{
        bookitem()
    }
})

const bookitem = (user) => {
    if(user) {
        console.log('its a user')
        db.collection("User").where('uid','==',user.uid).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if(change.type == 'added'){
                    username = change.doc.data().lname;
                    regno = change.doc.data().regno;
                    type = change.doc.data().type;
                    console.log(username);
                    console.log(type);
                    console.log('some');
                    db.collection("Books").where('isbn','==',id).get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            renderList(doc);
                            //console.log(querySnapshot.doc.data().isbn);
                        });
                    }); 
                }else if(change.type == 'removed'){
                    console.log('nothing to display');
                }
            })
        });
    }
    else{
        db.collection("Books").where('isbn','==',id).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                renderList(doc);
                console.log(querySnapshot.doc.data().isbn);
            });
        }); 
    }
 
}






function renderAll(doc){
    let a = document.createElement('a');
    let section = document.createElement('div');
    let imgdiv = document.createElement('div');
    let content = document.createElement('div');
    let action = document.createElement('div');
    let button = document.createElement('button');
    let img = document.createElement('img');
    
    let  title= document.createElement('div');
    let  author= document.createElement('div');
    

  
    a.setAttribute('href',`item.html?isbn=${doc.data().isbn}`)
    section.setAttribute('data-id', doc.id);
    // section.setAttribute('style','width:35% !important;');
    section.setAttribute('class','maindiv col s6 m6 l3');
    imgdiv.setAttribute('class','card-image ');
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
    content.appendChild(author);
    section.appendChild(content)
    //action.appendChild(button)
    //section.appendChild(action)
    a.appendChild(section)
    
    category.appendChild(a);   
}

// const cat = document.querySelector('#myLnk')
// const val = cat.getAttribute('data-id');


              
                // const usersRef = db.collection('Reserve').doc('cart')

                // usersRef.get()
                // .then((docSnapshot) => {
                //     if (docSnapshot.exists) {
                //         console.log('yes its here');
                //     // usersRef.onSnapshot((doc) => {
                //     //     // do stuff with the data
                //     // });
                //     } else {
                //         console.log('nope');
                //         //usersRef.set({...}) // create the document
                //     }
                // });

                // db.collection("Reserve").where('status','==','cart').where('isbn','==',id).where('user','==',user.uid).get().then(function(querySnapshot) {
                //     querySnapshot.forEach(function(doc) {
                //         console.log(doc.id, '=>', doc.data());
                        
                //     });
                // }); 
                // const citiesRef = db.collection('Reserve');
                // const snapshot =  citiesRef.where('status', '==', '123').get();

                // if (snapshot.empty) {
                // console.log('No matching documents.');
                // return;
                // }
                // if (!snapshot.empty) {
                // console.log('Yes matching documents.');
                // return;
                //}  
                // snapshot.forEach(doc => {
                //     console.log(doc.id, '=>', doc.data());
                //   });
         

                // const cityRef = db.collection('Reserve').doc('new');
                // const doc =  cityRef.get();
                    
                // if (!doc.exists) {
                //     console.log('No such document!');
                // } else {
                //     console.log('Document data:', doc.data());
                // }

                // db.collection("Reserve").where('status','==','canceled').where('isbn','==',id).where('user','==',user.uid).get().then(function(querySnapshot) {                       
                //     querySnapshot.forEach(function(doc) {
                //         console.log('cmon');
                //         var a = doc.exists;
                //         console.log(a);

                        
                //         if(doc.exists){
                //             alert('Book already added in your list.');
                            
                //         }
                        // else{
                        //     console.log('ok');
                        // }
                        
                    //});
                //})
                // .then( () => {
                //     db.collection('Reserve').add({
                //         isbn : id,
                //         title : doc.data().title,
                //         edition : doc.data().edition,
                //         author : doc.data().author,
                //         user : user.uid,
                //         date : date,
                //         status : 'cart',
                //     }).then(() => {
                //         alert('Book added to your list !');
                //     })
                // })
                

                
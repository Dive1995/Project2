//////////// login ////////////
const accountdetails = document.querySelector('.account-details');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const adminItems = document.querySelectorAll('.admin');


const setupUI = (user) =>{
    if(user.admin){
        db.collection('User').doc(user.uid).get().then(doc => {
            const html = `
            <div class="brown-text text-darken-4">${user.admin ? doc.data().lname.toUpperCase() : ''} &nbsp;</div>
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
        window.location = 'userlogin.html';
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
            console.log('**** admin loged in ****', user);
        })
        
        
    }else{
        console.log('**** admin loged out ****');
        setupUI();
    }
})


/////////logout
const logout = document.querySelector('#logout'); //////////// #logout should be the id of the logout button or the a tag whichever you create
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('signed out');
        window.location = 'userlogin.html';
          ////for more function to add , add below
    })
})

////////////////////////////////////////////////////////////////////


const tablelist = document.querySelector('#table-list');


function renderList(doc){
    let li = document.createElement('li');
    let title = document.createElement('div');
    let body= document.createElement('div');
    let imgdiv= document.createElement('div');
    let detailsdiv= document.createElement('div');
    let img = document.createElement('img');
    let author = document.createElement('p');
    let isbn = document.createElement('p');
    let pages = document.createElement('p');
    let edition = document.createElement('p');
    let year = document.createElement('p');
    let noofbooks = document.createElement('p');
    let refNum = document.createElement('p');
    let category = document.createElement('p');
    let br = document.createElement('br');
    let cross = document.createElement('button');
    

    li.setAttribute('data-id',doc.id);
    refNum.textContent = 'Ref.No : ' + doc.data().refNum;
    title.textContent = doc.data().refNum + ' -  ' +doc.data().title;
    author.textContent = 'Author : ' + doc.data().author;
    isbn.textContent = 'ISBN : ' + doc.data().isbn;
    year.textContent = 'Year : ' + doc.data().year;
    edition.textContent = 'Edition : ' + doc.data().edition;
    pages.textContent = 'No of Pages : ' + doc.data().pages;
    noofbooks.textContent = 'No of Books : ' + doc.data().noofbooks;
    category.textContent = 'Category : ' + doc.data().category;
    img.src = doc.data().image;
    cross.textContent = 'Delete';


    title.setAttribute('class','collapsible-header grey lighten-3 grey-text text-darken-3 title');
    body.setAttribute('class','row collapsible-body grey-text text-darken-3');
    imgdiv.setAttribute('class','col s4 l4');
    img.setAttribute('class' , 'responsive-img');
    img.setAttribute('alt' , 'book');
    detailsdiv.setAttribute('class','col s8 l7 offset-l1');
    cross.setAttribute('class', 'btn red lighten-1')
    cross.setAttribute('data-id', doc.id)
    
    
    
    li.appendChild(title);
    li.appendChild(body);
    body.appendChild(imgdiv);
    imgdiv.appendChild(img);
    body.appendChild(detailsdiv);
    detailsdiv.appendChild(author);
    detailsdiv.appendChild(pages);
    detailsdiv.appendChild(isbn);
    detailsdiv.appendChild(year);
    detailsdiv.appendChild(noofbooks);
    detailsdiv.appendChild(edition);
    detailsdiv.appendChild(refNum);
    detailsdiv.appendChild(category);
    detailsdiv.appendChild(br);
    detailsdiv.appendChild(cross);
    
    tablelist.appendChild(li);

    ///////////delete/////////

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');

        if (confirm("Do you want to delete the Book?")) {
            db.collection('Books').doc(id).delete();
          } else {
            console.log('delete canceled');
          }

        
    }); 

}

db.collection("cafes").where('name','==',"dive's").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        renderCafe(doc);
    });
}); 

////////update modal////////////////

const updateform = document.querySelector('#updatemodal');

function renderUpdate(doc){
    const title = document.createElement('input');
    const refNum = document.createElement('input');
    const author = document.createElement('input');
    const update = document.createElement('button');

    // const title = document.querySelector('#tit');
    // const author = document.querySelector('#auth');
    // const refNum = document.querySelector('#ref');
    // const update = document.querySelector('#update');
    
    title.placeholder = doc.data().title;
    refNum.placeholder = doc.data().refNum;
    author.placeholder = doc.data().author;

    title.setAttribute('name','title');
    refNum.setAttribute('name','refNum');
    author.setAttribute('name','author');
    update.setAttribute('class','btn blue')
    update.setAttribute('type','submit')

    updateform.appendChild(title)
    updateform.appendChild(refNum)
    updateform.appendChild(author)
    updateform.appendChild(update)

    update.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('id');

        if (confirm("Do you want to edit the Book?")) {
            db.collection('Books').doc(id).update({
                title: "changed by function"
            });
          } else {
            console.log('edit canceled');
          }
    });
}

//////////////////////////////////////


////////////// ----------   retrive main data  ----------------


db.collection("Books").orderBy('title').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderList(change.doc)
            renderUpdate(change.doc)
            
        }else if(change.type == 'removed'){
            let tr = tablelist.querySelector('[data-id ='+change.doc.id + ']');
            tablelist.removeChild(tr);
        }
    })
});


////////////////////// add book /////////////////////////

const form = document.querySelector('#add-book');

form.addEventListener('submit', function uploadImage(evt) {
    evt.preventDefault();

    const ref = firebase.storage().ref('/bookImages/');
    const file = document.querySelector("#photo").files[0];
    const name = +new Date() + "-" + file.name;
    const metadata = {
      contentType: file.type
    };
    const task = ref.child(name).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log('image added')
            const image = document.querySelector('#image')
            image.setAttribute( 'address',url)
            
        })
        .then(() => {
            submission();
        })
        // .then(submission())  make this instead of the first one
        .catch(console.error);

    console.log('hello world')
    
}
);
const addBookForm = document.querySelector('#add-book');

function submission(){

    let something = form.img.getAttribute('address');
    console.log(something);


    db.collection('Books').add({
        refNum : form.refNum.value,
        title : form.title.value,
        isbn : form.isbn.value,
        pages : form.pages.value,
        edition : form.edition.value,
        year : form.year.value,
        noofbooks : form.noofbooks.value,
        author : form.author.value,
        category : form.category.value,
        image : form.img.getAttribute('address')
    }).then(() => {
        const modal = document.querySelector('#addbook');
        M.Modal.getInstance(modal).close();
        addBookForm.reset();
    }).then(() => {
        alert("Book added successfully !!");
    })
    
}
//////////////////////////////


///////search ////////////////////////////////

const searchform = document.querySelector('.search-bar');
const serachresult = document.querySelector('#search-result');

// searchform.addEventListener('submit' ,function myFunction(e) {
//     e.preventDefault();
//     var input, filter, ul, li, a, i, txtValue;
    
//     filter = searchform.item1.value.toUpperCase();
    
//     li = tablelist.getElementsByTagName("li");
//     for (i = 0; i < li.length; i++) {
//         a = li[i].getElementsByClassName("title")[0];
//         txtValue = a.textContent || a.innerText;
//         if (txtValue.toUpperCase().indexOf(filter) > -1) {
//             li[i].style.display = "";
//         } else {
//             li[i].style.display = "none";
//         }
//     }
// } )

function myFunction() {
    
    var input, filter, ul, li, a, i, txtValue;
    
    filter = searchform.item1.value.toUpperCase();
    
    li = tablelist.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByClassName("title")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}



function renderSearch(doc){
    let li = document.createElement('li');
    let title = document.createElement('div');
    let body= document.createElement('div');
    let imgdiv= document.createElement('div');
    let detailsdiv= document.createElement('div');
    let img = document.createElement('img');
    let author = document.createElement('p');
    let refNum = document.createElement('p');
    let category = document.createElement('p');
    let br = document.createElement('br');
    let cross = document.createElement('button');

    li.setAttribute('data-id',doc.id);
    refNum.textContent = 'Ref.No : ' + doc.data().refNum;
    title.textContent = doc.data().refNum + ' -  ' +doc.data().title;
    author.textContent = 'Author : ' + doc.data().author;
    category.textContent = 'Category : ' + doc.data().category;
    img.src = doc.data().image;
    cross.textContent = 'Delete';


    title.setAttribute('class','collapsible-header grey lighten-3 grey-text text-darken-3');
    body.setAttribute('class','row collapsible-body grey-text text-darken-3');
    imgdiv.setAttribute('class','col s4 l4');
    img.setAttribute('class' , 'responsive-img');
    img.setAttribute('alt' , 'book');
    detailsdiv.setAttribute('class','col s8 l7 offset-l1');
    cross.setAttribute('class', 'btn red lighten-1')
    cross.setAttribute('data-id', doc.id)
    
    
    
    li.appendChild(title);
    li.appendChild(body);
    body.appendChild(imgdiv);
    imgdiv.appendChild(img);
    body.appendChild(detailsdiv);
    detailsdiv.appendChild(author);
    detailsdiv.appendChild(refNum);
    detailsdiv.appendChild(category);
    detailsdiv.appendChild(br);
    detailsdiv.appendChild(cross);
    


    /////////////

    
    serachresult.appendChild(li);
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');

        if (confirm("Do you want to delete the Book?")) {
            db.collection('Books').doc(id).delete();
          } else {
            console.log('delete canceled');
          }

        
    }); 

}
/////// hide nav bar elements as logged in & logged out => function


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

//////////////////////////////

const updateform = document.querySelector('#updatemodal');

function renderUpdate(doc){
    const li = document.createElement('li');
    const header = document.createElement('div');
    const body = document.createElement('div');
    const title = document.createElement('input');
    const refNum = document.createElement('input');
    const author = document.createElement('input');
    let isbn = document.createElement('input');
    let pages = document.createElement('input');
    let edition = document.createElement('input');
    let year = document.createElement('input');
    let noofbooks = document.createElement('input');
    const update = document.createElement('button');
    const form = document.createElement('form');
    const titlelabel = document.createElement('label')

    
    header.innerHTML = doc.data().isbn + ' -  ' +doc.data().title + ' - Edition '+ doc.data().edition;
    update.innerHTML = 'Update'
    title.value = doc.data().title;
    refNum.value = doc.data().refNum;
    author.value = doc.data().author;
    isbn.value = doc.data().isbn;
    pages.value = doc.data().pages;
    year.value = doc.data().year;
    edition.value = doc.data().edition;
    noofbooks.value = doc.data().noofbooks;

    header.setAttribute('class', 'collapsible-header grey lighten-3 title')
    body.setAttribute('class', 'collapsible-body')
    title.setAttribute('name','title');
    refNum.setAttribute('name','refNum');
    author.setAttribute('name','author');
    pages.setAttribute('name','pages');
    isbn.setAttribute('name','isbn');
    year.setAttribute('name','year');
    noofbooks.setAttribute('name','noofbooks');
    edition.setAttribute('name','edition');
    update.setAttribute('class','btn yellow black-text lighten-1')
    update.setAttribute('type','submit')
    update.setAttribute('id',doc.id)
    titlelabel.setAttribute('for','title')
    title.setAttribute('id','title')
    
    form.appendChild(title)
    form.appendChild(titlelabel)
    form.appendChild(refNum)
    form.appendChild(author)
    form.appendChild(pages)
    form.appendChild(noofbooks)
    form.appendChild(isbn)
    form.appendChild(year)
    form.appendChild(edition)
    form.appendChild(update)
    body.appendChild(form)
    li.appendChild(header)
    li.appendChild(body)
    updateform.appendChild(li)

    

    update.addEventListener('click', (e) => {
        e.preventDefault();
        let id = e.target.getAttribute('id');
        console.log(id);

        if (confirm("Do you want to update the Book?")) {
            db.collection('Books').doc(id).update({
                refNum : form.refNum.value,
                title : form.title.value,
                author : form.author.value,
                pages : form.pages.value,
                isbn : form.isbn.value,
                year : form.year.value,
                edition : form.edition.value,
                noofbooks : form.noofbooks.value
                
            }).then(() => {
                alert('Update Successfull');
                location.reload();
            })
          } else {
            console.log('edit canceled');
            alert('Update failed , try again later !')
          }
    });
}

//////////////////////////////////////


////////////// ----------   retrive main data  ----------------


db.collection("Books").orderBy('title').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            
            renderUpdate(change.doc)
            
        }else if(change.type == 'removed'){
            let tr = tablelist.querySelector('[data-id ='+change.doc.id + ']');
            tablelist.removeChild(tr);
        }
    })
});



///////search ////////////////////////////////

const searchform = document.querySelector('.search-bar');
const serachresult = document.querySelector('#search-result');


function myFunction() {
    
    var input, filter, ul, li, a, i, txtValue;
    
    filter = searchform.item1.value.toUpperCase();
    
    li = updateform.getElementsByTagName("li");
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

// searchform.addEventListener('submit' , (evt) => {
//     evt.preventDefault();
//     console.log('hi search working')

//     const item1 = document.querySelector('#search-input');
//     // const sbtn = document.querySelector('#search');
//     let s = searchform.item1.value;

//     // db.collection("Books").where('title',  '==', s).onSnapshot(snapshot => {
//     //     let changes = snapshot.docChanges();
//     //     console.log('function called')
//     //     console.log(s)
//     //     renderSearch(changes.doc);
        
//     // });
//     const display = document.querySelector('#search-result')
//     db.collection('Books').orderBy("title").startAfter(s).endAt(`${s}\uf8ff`).get().then((snapshot) => {
//         if(s == ''){
//             display.setAttribute('style','display:none;')
//         }else{
//             snapshot.docs.forEach(doc => {
//                 display.setAttribute('style','display:block;')
//                 renderSearch(doc);
//             })
//         }
        
//     })


// })

// function renderSearch(doc){
//     let li = document.createElement('li');
//     let title = document.createElement('div');
//     let author = document.createElement('div');

//     li.setAttribute('data-id',doc.id);
//     title.textContent = doc.data().title;
//     author.textContent = doc.data().author;

//     li.appendChild(title);
//     li.appendChild(author);
//     serachresult.appendChild(li);



//   ;}
  function renderSearch(doc){
    const li = document.createElement('li');
    const header = document.createElement('div');
    const body = document.createElement('div');
    const title = document.createElement('input');
    const refNum = document.createElement('input');
    const author = document.createElement('input');
    const update = document.createElement('button');
    const form = document.createElement('form');

    
    header.textContent = doc.data().refNum + ' -  ' +doc.data().title;
    update.innerHTML = 'Update'
    title.value = doc.data().title;
    refNum.value = doc.data().refNum;
    author.value = doc.data().author;

    header.setAttribute('class', 'collapsible-header')
    body.setAttribute('class', 'collapsible-body')
    title.setAttribute('name','title');
    refNum.setAttribute('name','refNum');
    author.setAttribute('name','author');
    update.setAttribute('class','btn red lighten-1')
    update.setAttribute('type','submit')
    update.setAttribute('id',doc.id)
    
    
    form.appendChild(title)
    form.appendChild(refNum)
    form.appendChild(author)
    form.appendChild(update)
    body.appendChild(form)
    li.appendChild(header)
    li.appendChild(body)
    serachresult.appendChild(li)

    

    update.addEventListener('click', (e) => {
        e.preventDefault();
        let id = e.target.getAttribute('id');
        console.log(id);

        if (confirm("Do you want to update the Book?")) {
            db.collection('Books').doc(id).update({
                refNum : form.refNum.value,
                title : form.title.value,
                author : form.author.value,
                
            }).then(() => {
                alert('Update Successfull');
                location.reload();
            })
          } else {
            console.log('edit canceled');
            alert('Update failed , try again later !')
          }
    });
}

  
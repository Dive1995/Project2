/////// hide nav bar elements as logged in & logged out => function


const accountdetails = document.querySelector('.account-details');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const adminItems = document.querySelectorAll('.admin');


const setupUI = (user) =>{
    if(user){
        db.collection('User').doc(user.uid).get().then(doc => {
            const html = `
            <div class="grey-text  text-darken-4">${user ? doc.data().lname.toUpperCase() : ''} &nbsp;</div>
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


const tablelist = document.querySelector('#table-list');
const confirmReserve = document.querySelector('#confirmReserve');

function renderList(doc){
    let tr = document.createElement('tr');
    let isbn = document.createElement('td');
    let title = document.createElement('td');
    let author = document.createElement('td');
    let edition = document.createElement('td');
    let image = document.createElement('td');
    let remove = document.createElement('td');
    let del = document.createElement('button');
    let conf = document.createElement('button');
    

    tr.setAttribute('data-id', doc.id);
    del.setAttribute('data-id', doc.id);
    conf.setAttribute('data-id', doc.id);
    del.setAttribute('class', 'btn red lighten-1');
    conf.setAttribute('class', 'btn green lighten-1');
    isbn.textContent = doc.data().isbn;
    title.textContent = doc.data().title;
    author.textContent = doc.data().author;
    edition.textContent = doc.data().edition;
    image.textContent = doc.data().image;
    del.textContent = "X";
    conf.textContent = "Confirm";

    tr.appendChild(isbn);
    tr.appendChild(title);
    tr.appendChild(author);
    tr.appendChild(edition);
    remove.appendChild(conf)
    remove.appendChild(del)
    tr.appendChild(remove)
    

    tablelist.appendChild(tr);

    del.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');
        
        if(confirm("Do you want to remove the Book from cart?")) {
            db.collection("Books").where('isbn','==',doc.data().isbn).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    
                    console.log(doc.data().noofbooks);
                    db.collection('Books').doc(doc.id).update({
                        noofbooks : doc.data().noofbooks + 1
                    })
                });
            })
            .then(() => {
                db.collection('Reserve').doc(id).delete()
                
            })
            
          }
           else {
            console.log('delete canceled');
          }

        
    }); 
    
    
    conf.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');
        console.log(id);

        if (confirm("Confirm reservation?")) {
            var date = new Date();
            db.collection('Reserve').doc(id).update({
                
                status : 'reserved',
                date : date
            }).then(() => {
                alert('Successfully Reserved, get the book within 24Hours from the Library !');
                
            })
          } else {
            
            alert('Reserve failed , try again later !')
          }
    })
}


///////////////////////////////////////////////////////////
// reserved books
const currentReserved = document.querySelector('#reservedBooks');

function reservedBooks(doc){
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
    let refNum = document.createElement('p');
    let category = document.createElement('p');
    let br = document.createElement('br');
    let cross = document.createElement('button'); 

    li.setAttribute('data-id',updateid);
    refNum.textContent = 'Ref.No : ' + doc.data().refNum;
    title.textContent = doc.data().refNum + ' -  ' +doc.data().title;
    author.textContent = 'Author : ' + doc.data().author;
    isbn.textContent = 'ISBN : ' + doc.data().isbn;
    year.textContent = 'Year : ' + doc.data().year;
    edition.textContent = 'Edition : ' + doc.data().edition;
    pages.textContent = 'No of Pages : ' + doc.data().pages;
    category.textContent = 'Category : ' + doc.data().category;
    img.src = doc.data().image;
    cross.textContent = 'Cancel';

    title.setAttribute('class','collapsible-header green lighten-4 grey-text text-darken-3 title');
    body.setAttribute('class','row collapsible-body grey-text text-darken-3');
    imgdiv.setAttribute('class','col s4 l4');
    img.setAttribute('class' , 'responsive-img');
    img.setAttribute('alt' , 'book');
    detailsdiv.setAttribute('class','col s8 l7 offset-l1');
    cross.setAttribute('class', 'btn red lighten-1')
    cross.setAttribute('data-id', updateid)
    
    li.appendChild(title);
    li.appendChild(body);
    body.appendChild(imgdiv);
    imgdiv.appendChild(img);
    body.appendChild(detailsdiv);
    detailsdiv.appendChild(author);
    detailsdiv.appendChild(pages);
    detailsdiv.appendChild(isbn);
    detailsdiv.appendChild(year);
    detailsdiv.appendChild(edition);
    detailsdiv.appendChild(refNum);
    detailsdiv.appendChild(category);
    detailsdiv.appendChild(br);
    detailsdiv.appendChild(cross);
    
    currentReserved.appendChild(li);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');
        

        if (confirm("Cancel reservation?")) {
            var date = new Date();
            db.collection('Reserve').doc(id).update({
                
                status : 'canceled',
                date : date
            }).then(() => {
                db.collection('Books').doc(doc.id).update({
                    noofbooks : doc.data().noofbooks + 1
                })
                alert('Book reserve canceled.');
                
            })
          } else {
            
            alert('Failed to cancel the reserved book , try again later !')
          }
    })
}


auth.onAuthStateChanged(user => {
    if(user){
        db.collection("Reserve").where('user','==',user.uid).where('status','==','cart').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if(change.type == 'added'){
                    renderList(change.doc)
                }else if(change.type == 'removed'){
                    console.log(change.doc.id);
                    let tr = tablelist.querySelector('[data-id ='+change.doc.id + ']');
                    tablelist.removeChild(tr);
                }
            })
        });
        db.collection("Reserve").where('user','==',user.uid).where('status','==','reserved').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
         
            changes.forEach(change => {
                if(change.type == 'added'){
                    console.log(change.doc.data().isbn);
                    let isbn = change.doc.data().isbn;
                    updateid = change.doc.id;
                    
                    db.collection("Books").where('isbn','==',isbn).onSnapshot(snapshot => {
                        let changes = snapshot.docChanges();
                        changes.forEach(change => {
                            if(change.type == 'added'){
                                reservedBooks(change.doc )
                            }else if(change.type == 'removed'){
                                let tr = currentReserved.querySelector('[data-id ='+updateid + ']');
                                currentReserved.removeChild(tr);
                            }
                        })
                    });
                    
                }else if(change.type == 'removed'){
                    let tr = currentReserved.querySelector('[data-id ='+updateid + ']');
                    currentReserved.removeChild(tr);
                }
            })
        });
        
    }else{
        console.log('**** admin loged out ****');
        
    }
})

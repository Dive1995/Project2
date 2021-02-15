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


const tablelist = document.querySelector('#table-list');
const confirmReserve = document.querySelector('#confirmReserve');

function renderList(doc){
    let tr = document.createElement('tr');
    let isbn = document.createElement('td');
    let date = document.createElement('td');
    let name = document.createElement('td');
    let title = document.createElement('td');
    let author = document.createElement('td');
    let edition = document.createElement('td');
    let image = document.createElement('td');
    let remove = document.createElement('td');
    let del = document.createElement('button');
    let conf = document.createElement('button');
    
    let dateStr = doc.data().date.toDate();
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
    name.textContent = doc.data().name;
    date.textContent = dateStr.getFullYear()+'-'+(dateStr.getMonth()+1)+'-'+dateStr.getDate();
    del.textContent = "X";
    conf.textContent = "Issue";

    tr.appendChild(isbn);
    tr.appendChild(date);
    tr.appendChild(name);
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
        console.log(id);


        if (confirm("Deny request?")) {
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

        // if (confirm("Deny request?")) {
        //     var date = new Date();
        //     db.collection('Reserve').doc(id).update({
               
        //         status : 'denyed',
        //         date : date
        //     }).then(() => {
        //         db.collection('Books').doc(doc.id).update({
        //             noofbooks : doc.data().noofbooks + 1
        //         })
        //         alert('Denyed user request.');
                
        //     })
        //   }
           else {
            
            alert('Failed , try again !')
          }
    }); 
    
    
    conf.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');
        console.log(id);

        if (confirm("Confirm reservation?")) {
            var date = new Date();

            var returndate = new Date();
            returndate.setDate(returndate.getDate() + 5);
            console.log(returndate);

            db.collection('Reserve').doc(id).update({
               
                status : 'issued',
                date : date,
                returndate : returndate
            }).then(() => {
                alert('User request accepted !');
                
            })
          } else {
            
            alert('Try again!')
          }
    })
}


// db.collection("Reserve").where('status','==','reserved').onSnapshot(snapshot => {
//     let changes = snapshot.docChanges();
//     changes.forEach(change => {
//         //console.log(change.doc.data().user);
//         db.collection("User").where('uid','==',change.doc.data().user).onSnapshot(snapshot => {
//             let changes = snapshot.docChanges();
//             changes.forEach(change => {
//                 //console.log(change.doc.data().user);
//                 uname = change.doc.data().lname;
//                 console.log('hi');
//                 console.log(uname);
//                 // if(change.type == 'added'){
//                 //     renderList(change.doc)
//                 // }ese if(change.type == 'removed'){
//                 //     let tr = tablelist.querySelector('[data-id ='+change.doc.id + ']');
//                 //     tablelistl.removeChild(tr);
//                 // }
//             })
//         });
//         if(change.type == 'added'){
//             renderList(change.doc)
//         }else if(change.type == 'removed'){
//             let tr = tablelist.querySelector('[data-id ='+change.doc.id + ']');
//             tablelist.removeChild(tr);
//         }
//     })
// });





db.collection("Reserve").where('status','==','reserved').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            
            userid = change.doc.id;
            console.log(userid);
            renderList(change.doc)
            
            
        }else if(change.type == 'removed'){
            let tr = tablelist.querySelector('[data-id ='+change.doc.id + ']');
            
            tablelist.removeChild(tr);
        }
    })
});

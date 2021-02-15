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
    let date = document.createElement('td');
    let time = document.createElement('td');
    let title = document.createElement('td');
    let author = document.createElement('td');
    let status = document.createElement('td');
    let name = document.createElement('td');
    let link = document.createElement('td');
    let returned = document.createElement('button');
    

    let dateStr = doc.data().date.toDate();
    tr.setAttribute('data-id', doc.id);
    returned.setAttribute('class', `btn green lighten-2`);
    returned.setAttribute('data-id', doc.id);
    isbn.textContent = doc.data().isbn;
    date.textContent = dateStr.getFullYear()+'-'+(dateStr.getMonth()+1)+'-'+dateStr.getDate();
    time.textContent = dateStr.getHours()+':'+dateStr.getMinutes();
    title.textContent = doc.data().title;
    author.textContent = doc.data().author;
    name.textContent = doc.data().name;
    returned.textContent = 'Returned';

    if(doc.data().status == 'canceled'){
        status.setAttribute('style','color:red');
    }
    if(doc.data().status == 'reserved'){
        status.setAttribute('style','color:blue');
    }
    if(doc.data().status == 'issued'){
        status.setAttribute('style','color:green');
    }
    if(doc.data().status == 'denyed'){
        status.setAttribute('style','color:red');
    }
    status.textContent = doc.data().status.toUpperCase();
    
    // To create it from string
    
   
    //console.log(dateStr.getFullYear()+'-'+(dateStr.getMonth()+1)+'-'+dateStr.getDate()+' '+dateStr.getHours()+':'+dateStr.getMinutes()+':'+dateStr.getSeconds());
    
    // var str = doc.data().date.toDate().toString();
    // var res = str.slice(3, 15);
    // function convert(str) {
    //     var date = new Date(str),
    //         mnth = ("0" + (date.getMonth()+1)).slice(-2),
    //         day  = ("0" + date.getDate()).slice(-2);
    //         hours  = ("0" + date.getHours()).slice(-2);
    //         minutes = ("0" + date.getMinutes()).slice(-2);
    //     return [ date.getFullYear(), mnth, day, hours, minutes ].join("-");
    // }



    tr.appendChild(date);
    tr.appendChild(time);
    tr.appendChild(isbn);
    tr.appendChild(title);
    tr.appendChild(author);
    tr.appendChild(name);
    //tr.appendChild(status);
    link.appendChild(returned);
    tr.appendChild(link);
    
    tablelist.appendChild(tr);

    returned.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');
        
        if(confirm("Book Returned?")) {
            const date = new Date();
            const d = new Date();

            db.collection("Books").where('isbn','==',doc.data().isbn).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    db.collection('Books').doc(doc.id).update({
                        noofbooks : doc.data().noofbooks + 1,
                        
                    })
                    console.log('book count added');
                    console.log(id);
                });
            })
            .then(() => {
                db.collection("Reserve").where('user','==',doc.data().user).where('isbn','==',doc.data().isbn).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                       
                        console.log('status updated');
                        console.log(doc.data().returndate.toDate());

                        var rdate = doc.data().returndate.toDate();
                        
                        var diff = d.getTime() - rdate.getTime();

                        var msInDay = 1000 * 3600 * 24;

                        var days = Math.round(diff/msInDay);

                        
                        
                        console.log("no.of days : "+ days);

                        db.collection('Reserve').doc(id).update({
                            
                            status : 'returned',
                            book_returedOn : date
                        })

                        if(days < 1){
                            alert('Book returned by user before return date!!');
                        }
                        else{
                            alert('Book returned by user after ' + days + ' day(s) !');
                        }

                       
                        
                    });
                })

            })
            // .then(() => {
            //     db.collection('Reserve').doc(id).update({
                
            //         status : 'returned',
            //         book_returedOn : date
            //     })
            //     alert('Book returned by user!!')
            // })
            
          }
           else {
            console.log('book returned canceled');
          }

        
    }); 

}


///////////////////////////////////////////////////////////
// reserved books
const currentReserved = document.querySelector('#reservedBooks');



db.collection("Reserve").where('status','==','issued').orderBy('date','desc').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderList(change.doc)
        }else if(change.type == 'removed'){
            let tr = tablelist.querySelector('[data-id ='+change.doc.id + ']');
            tablelist.removeChild(tr);
        }
    })
});
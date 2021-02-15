const adminForm = document.querySelector('.admin-actions');

// adminForm.addEventListener('submit' , (e) => {
//     e.preventDefault();
//     const adminEmail = document.querySelector('#admin-email').value;
//     const addAdminRole = functions.httpsCallable('addAdminRole');
//     addAdminRole({email : adminEmail}).then(result =>{

//         console.log(result);
//     })
// })



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

//////////////////////////////////////////////////////
const tablelist = document.querySelector('#table-list');


function renderList(doc){
    let li = document.createElement('li');
    let title = document.createElement('h5');
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
    let form = document.createElement('form')
    let nic = document.createElement('input');
    let br = document.createElement('br');
    let cross = document.createElement('button');
    

    li.setAttribute('data-id',doc.id);
    form.setAttribute('class','form');
    refNum.textContent = 'Shelf No : ' + doc.data().refNum;
    title.textContent = doc.data().title;
    author.textContent = 'Author : ' + doc.data().author;
    isbn.textContent = 'ISBN : ' + doc.data().isbn;
    year.textContent = 'Year : ' + doc.data().year;
    edition.textContent = 'Edition : ' + doc.data().edition;
    pages.textContent = 'No of Pages : ' + doc.data().pages;
    noofbooks.textContent = 'Available Books: ' + doc.data().noofbooks;
    category.textContent = 'Category : ' + doc.data().category;
    img.src = doc.data().image;
    cross.textContent = 'Issue';


    nic.setAttribute('type','text');
    nic.setAttribute('name','nic');
    nic.setAttribute('placeholder','Member No.');
    nic.setAttribute('style','width:60% !important; font-size:1rem');
    body.setAttribute('class','row content-body grey-text text-darken-3');
    imgdiv.setAttribute('class','col s4 l4');
    img.setAttribute('class' , 'responsive-img');
    img.setAttribute('alt' , 'book');
    detailsdiv.setAttribute('class','col s8 l7 offset-l1');
    cross.setAttribute('class', 'btn green')
    cross.setAttribute('data-id', doc.id)
    
    
    
    detailsdiv.appendChild(title);
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
    //detailsdiv.appendChild(nic);
    //detailsdiv.appendChild(category);
    detailsdiv.appendChild(br);
    detailsdiv.appendChild(form);
    form.appendChild(nic)
    form.appendChild(cross)
    tablelist.appendChild(li);

    ///////////delete/////////

    cross.addEventListener('click',(e) =>{
        e.preventDefault();
        const form = document.querySelector('.form')
        console.log(form.nic.value);
        const regno = form.nic.value;

        if (confirm("Issue this Book?")) {
            var date = new Date();

            db.collection('User').where("regno",'==',regno).get().then((snapshot) => {
                
                    snapshot.docs.forEach(doc => {
                             name = doc.data().lname
                             console.log(name);
                    })
            })            




        db.collection('Reserve').add({
            isbn : doc.data().isbn,
            title : doc.data().title,
            edition : doc.data().edition,
            author : doc.data().author,
            regno : form.nic.value,
            name : name,
            date : date,
            status : 'issued',
        }).then(() => {
            alert('Book issued , Successful!');
        })
            


          } else {
            console.log('Reserve canceled');
            alert("Try again!")
          }
    }) 

}
const searchform = document.querySelector('.search-bar');
const serachresult = document.querySelector('#search-result');

const search = document.querySelector('#search');

// search.addEventListener('click',(e) => {
//     evt.preventDefault();
//     isbn = searchform.item1.value;
//     console.log(isbn);
    
//         db.collection("Books").where('isbn','==',isbn).onSnapshot(snapshot => {
//         let changes = snapshot.docChanges();
//         changes.forEach(change => {
//             if(change.type == 'added'){
//                 renderList(change.doc)
               
                
//             }else if(change.type == 'removed'){
//                 let tr = tablelist.querySelector('[data-id ='+change.doc.id + ']');
//                 tablelist.removeChild(tr);
//             }
//         })
//     })
// })

searchform.addEventListener('submit' , (evt) => {
    evt.preventDefault();
    console.log('hi search working')

    const item1 = document.querySelector('#search-input');
    // const sbtn = document.querySelector('#search');
    let isbn = searchform.item1.value;

    const display = document.querySelector('#search-result')
    db.collection('Books').where("isbn",'==',isbn).get().then((snapshot) => {
        const nobook = document.querySelector('.nobook');
        if(isbn == ''){
            nobook.setAttribute('style','display:block')
            
        }else{
            snapshot.docs.forEach(doc => {
                nobook.setAttribute('style','display:none');

                renderList(doc);
            })
        }
        
    })
    searchform.item1.value = '';

})

function renderSearch(doc){
    let li = document.createElement('li');
    let title = document.createElement('div');
    let author = document.createElement('div');

    li.setAttribute('data-id',doc.id);
    title.textContent = doc.data().title;
    author.textContent = doc.data().author;

    li.appendChild(title);
    li.appendChild(author);
    serachresult.appendChild(li);
}


///////////////add user


const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit' , (e) => {
    e.preventDefault();

    //get user info

    const fname = signupForm['fname'].value;
    const lname = signupForm['lname'].value;
    const phone = signupForm['phone'].value;
    const gender = signupForm['gender'].value;
    const nic = signupForm['nic'].value;
    const email = signupForm['email'].value;
    const password = signupForm['pass'].value;
    const age = signupForm['age'].value;
    const address = signupForm['address'].value;

    console.log(email,password,fname,lname);

    //signup the user

    auth.createUserWithEmailAndPassword(email,password).then(cred => {
        return db.collection('User').doc(cred.user.uid).set({
            fname : fname,
            lname : lname,
            age : age,
            nic : nic,
            gender : gender,
            phone : phone,
            address : address,
            email : auth.currentUser.email,
            password : password,
            type : 'member',
            uid : cred.user.uid,
            
        })
    }).then(() => {
        alert('Registered Successfully !')
        console.log('success signup');
        signupForm.reset();
        
        signupForm.querySelector('.error').innerHTML = "";
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    })

})
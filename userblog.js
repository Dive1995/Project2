//////////// login ////////////
const accountdetails = document.querySelector('.account-details');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const adminItems = document.querySelectorAll('.admin');


const setupUI = (user) =>{
    if(user){
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






////////////////////// add book /////////////////////////

const form = document.querySelector('#userblog');

form.addEventListener('submit', function uploadImage(evt) {
    evt.preventDefault();

    const ref = firebase.storage().ref('/blogimages/');
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
const userblogForm = document.querySelector('#userblog');

function submission(){

    let something = form.img.getAttribute('address');
    console.log(something);


    db.collection('Blog').add({
      
        title : form.title.value,
        author : form.author.value,
        description : form.description.value,
        category : form.category.value,
        image : form.img.getAttribute('address')
    }).then(() => {
        userblogForm.reset();
    }).then(() => {
        alert("Added Successfully !!");
    })
    
}



        

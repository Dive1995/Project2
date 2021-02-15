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
            
        console.log('loged in button asctivated');
        loggedInLinks.forEach(item => item.style.display = 'inline-block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
        })
      

    }
    if(user.admin){
        db.collection('User').doc(user.uid).get().then(doc => {
            const html = `
            <div class="brown-text  text-darken-4">${doc.data().lname.toUpperCase()} &nbsp;</div>
        `;
        accountdetails.innerHTML = html;

        })
        adminItems.forEach(item => item.style.display = 'inline-block');
    }
    else{
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
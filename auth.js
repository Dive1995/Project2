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
            <div class="brown-text text-darken-4">${doc.data().lname.toUpperCase()} &nbsp;</div>
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
        console.log('**** user loged in ****', user);
        setupUI(user);
    }else{
        console.log('**** user loged out ****');
        setupUI();
    }
})


// register
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

    // auth.createUserWithEmailAndPassword(email,pass).then(function(response){
    //     console.log('success signup');
    //     db.collection('User').add({
    //         fname : fname,
    //         lname : lname,
    //         age : age,
    //         city : city,
    //         uid: auth.currentUser.uid,
    //         email : auth.currentUser.email
    //     })
    //     signupForm.reset();
    //     auth.signOut().then(() => {
    //         console.log('signed out');
    //     })
       
    // });
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
            type : 'user',
            uid : cred.user.uid,
            
        })
    }).then(() => {
        alert('Registered Successfully !')
        console.log('success signup');
        signupForm.reset();
        auth.signOut().then(() => {
            console.log('signed out');
        })
        signupForm.querySelector('.error').innerHTML = "";
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    })

})


//////log out

const logout = document.querySelector('#logout'); //////////// #logout should be the id of the logout button or the a tag whichever you create
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
       ;
        window.location = 'userlogin.html';
          ////for more function to add , add below
    })
})


///// log in

const loginform = document.querySelector('#login-form');
loginform.addEventListener('submit' , (e) => {
    e.preventDefault();

    const email = loginform['email2'].value;
    const pass = loginform['password'].value;

    auth.signInWithEmailAndPassword(email, pass).then(cred => {
        console.log(cred.user);
        loginform.reset();
        signupForm.querySelector('.error').innerHTML = '';
        window.location = 'newIndex.html';
    }).catch(err => {
        loginform.querySelector('.error').innerHTML = err.message;
    })
})

const adminForm = document.querySelector('.admin-actions');

adminForm.addEventListener('submit' , (e) => {
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({email : adminEmail}).then(result =>{

        console.log(result);
    })
})



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


/////////////////////////////////////////////////////



////////////// for password change


// const change = document.querySelector('#change');



// change.addEventListener('click', (e) => {
//     e.preventDefault();

//     auth.onAuthStateChanged(user => {
//         if(user.admin){
//             changepsw(user)
            
//         }else{
//             console.log('**** admin loged out ****');
//             alert('you are not an admin !!')
//             window.location('userlogin.html')
//         }
//     })
  
// });

// const changepsw = (user) => {
//     const form = document.querySelector('#password');
//     const opsw = document.querySelector('#opsw');
//     const npsw = document.querySelector('#npsw');
//     if (confirm("Change password ?")) {
//         if(opsw.value == doc.data().password){
//             console.log('equal');
//             db.collection('User').doc(id).update({
                
//                 password : npsw.value,
                
//             }).then(() => {
//                 alert('Password changed !');
//                 location.reload();
//             })
//         }else{
//             alert('Incorrect old password !!!');
//         }

        
//       } else {
//         console.log('edit canceled');
//         //alert("Password change canceled !")
//       }
// }

/////////////// password change ends
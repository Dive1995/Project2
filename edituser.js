/////// hide nav bar elements as logged in & logged out => function


const accountdetails = document.querySelector('.account-details');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const adminItems = document.querySelectorAll('.admin');


const setupUI = (user) =>{
    if(user){
        db.collection('User').doc(user.uid).get().then(doc => {
            const html = `
            <div class="">${user ? doc.data().lname.toUpperCase() : ''} &nbsp;</div>
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
// const profile = document.querySelector('#profile');

// function renderprofile(doc){
//     console.log('profile');
//     const fname = document.createElement('p');
//     const lname = document.createElement('p');
//     const age = document.createElement('p');
//     let  phone = document.createElement('p');
//     let address = document.createElement('p');
//     let password = document.createElement('p');
//     const update = document.createElement('button');
    
//     update.innerHTML = 'Update'
//     fname.innerHTML = doc.data().fname;
//     lname.innerHTML = doc.data().lname;
//     age.innerHTML = doc.data().age;
//     phone.innerHTML = doc.data().phone;
//     address.innerHTML = doc.data().address;
//     password.innerHTML = doc.data().password;

//     fname.setAttribute('class','black-text');
//     lname.setAttribute('name','lname');
//     age.setAttribute('name','age');
//     phone.setAttribute('name','phone');
//     address.setAttribute('name','address');
//     password.setAttribute('name','password');

//     update.setAttribute('class','btn yellow black-text lighten-1')
//     update.setAttribute('type','submit')
//     update.setAttribute('id',doc.id)
    
//     profile.appendChild(fname)
//     profile.appendChild(lname)
//     profile.appendChild(age)
//     profile.appendChild(address)
//     profile.appendChild(phone)
//     profile.appendChild(password)
    
// }

function renderUpdate(doc){

    const fname = document.querySelector('#fname');
    const lname = document.querySelector('#lname');
    const age = document.querySelector('#age');
    let  phone = document.querySelector('#phone');
    let address = document.querySelector('#address');
    let password = document.querySelector('#password');
    let email = document.querySelector('#email');
    let nic = document.querySelector('#nic');
    
    
    fname.value = doc.data().fname;
    lname.value = doc.data().lname;
    age.value = doc.data().age;
    phone.value = doc.data().phone;
    address.value = doc.data().address;
    nic.value = doc.data().nic;


   
    

    // update.setAttribute('class','btn yellow black-text lighten-1')
    // update.setAttribute('type','submit')
    // update.setAttribute('id',doc.id)

    
   const submit = document.querySelector('#submit');
   const change = document.querySelector('#change');
   submit.setAttribute('updateid',uid);
   change.setAttribute('updateid',uid);

    submit.addEventListener('click', (e) => {
        e.preventDefault();
        let id = e.target.getAttribute('updateid');
        console.log(id);
        console.log('submit');
        if (confirm("Do you want to update your Profile?")) {
            db.collection('User').doc(id).update({
                fname : tablelist.fname.value,
                lname : tablelist.lname.value,
                age : tablelist.age.value,
                address : tablelist.address.value,
                //email : doc.data().email,
                phone : tablelist.phone.value,
                nic : tablelist.nic.value,
                //password :doc.data().password
                
            }).then(() => {
                alert('Update Successfull');
                location.reload();
            })
          } else {
            console.log('edit canceled');
            alert('Update failed , try again later !')
          }
    });
    change.addEventListener('click', (e) => {
        e.preventDefault();
        let id = e.target.getAttribute('updateid');
        console.log(id);
        console.log('change');
        const form = document.querySelector('#password');
        const opsw = document.querySelector('#opsw');
        const npsw = document.querySelector('#npsw');
        if (confirm("Change password ?")) {
            if(opsw.value == doc.data().password){
                console.log('equal');
                db.collection('User').doc(id).update({
                    // fname : doc.data().fname,
                    // lname : doc.data().lname,
                    // age : doc.data().age,
                    // address : doc.data().address,
                    // email : doc.data().email,
                    // phone : doc.data().phone,
                    // nic : doc.data().nic,
                    password : npsw.value,
                    
                }).then(() => {
                    alert('Password changed !');
                    location.reload();
                })
            }else{
                alert('Incorrect old password !!!');
            }

            
          } else {
            console.log('edit canceled');
            alert('Update failed , try again later !')
          }
    });
}

///////////////////////////////////////////////////////////
// reserved books
const currentReserved = document.querySelector('#reservedBooks');



auth.onAuthStateChanged(user => {
    if(user){
       
        db.collection("User").where('email','==',user.email).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if(change.type == 'added'){
                    uid = user.uid;
                    renderUpdate(change.doc);
                    //renderprofile(change.doc);
                }else if(change.type == 'removed'){
                    let tr = tablelist.querySelector('[data-id ='+change.doc.id + ']');
                    tablelist.removeChild(tr);
                }
            })
        });
        
        
    }else{
        console.log('**** admin loged out ****');
        
    }
})

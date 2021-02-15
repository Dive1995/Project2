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



///////////////////////////////////////

const tablelist = document.querySelector('#table-list');
const confirmed = document.querySelector('#table-list-confirmed');

function renderList(doc){
    console.log('hi')
    let li = document.createElement('li');
    let username= document.createElement('div');
    let body= document.createElement('div');
    let imgdiv= document.createElement('div');
    let detailsdiv= document.createElement('div');
    let img = document.createElement('img');
    let age = document.createElement('p');
    let email= document.createElement('p');
    let nic= document.createElement('p');
    let city = document.createElement('p');
    let phone = document.createElement('p');
    let br = document.createElement('br');
    let cross = document.createElement('button');
    let member = document.createElement('button');

    li.setAttribute('data-id',doc.id);
    email.textContent = 'Email : ' + doc.data().email;
    username.textContent = doc.data().fname +" " + doc.data().lname;
    age.textContent = 'Age : ' + doc.data().age;
    nic.textContent = 'NIC : ' + doc.data().nic;
    city.textContent = 'Address: ' + doc.data().address;
    phone.textContent = 'Phone: ' + doc.data().phone;
    
    cross.textContent = 'Deny';
    member.textContent = 'Add Member';


    username.setAttribute('class','collapsible-header grey lighten-3 grey-text text-darken-3');
    body.setAttribute('class','row collapsible-body grey-text text-darken-3');
    imgdiv.setAttribute('class','col s8 l6');
    detailsdiv.setAttribute('class','col s4 l6 ');
    cross.setAttribute('class', 'btn red lighten-1')
    cross.setAttribute('data-id', doc.id)
    member.setAttribute('class', 'btn blue lighten-1')
    member.setAttribute('data-id', doc.id)
    
    
    
    li.appendChild(username);
    li.appendChild(body);
    body.appendChild(imgdiv);
    body.appendChild(detailsdiv);
    imgdiv.appendChild(age);
    imgdiv.appendChild(email);
    imgdiv.appendChild(nic);
    imgdiv.appendChild(phone);
    imgdiv.appendChild(city);
    imgdiv.appendChild(br);
    detailsdiv.appendChild(member);
    detailsdiv.appendChild(cross);
    
    
    tablelist.appendChild(li);

    ///////////delete/////////

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');

        if (confirm("Do you want to delete the User?")) {
            db.collection('User').doc(id).delete();
            location.reload();
          } else {
            console.log('delete canceled');
          }

        
    });
    member.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');

        if (confirm("Do you want to add this user as a member?")) {
            db.collection('User').doc(id).update({
                type : 'member',
                regno : id.slice(0, 6)+'M'
                
            }).then(() => {
                alert('Member Added !!');
                
            })
          } else {
            console.log('edit canceled');
            alert('Update failed , try again later !')
          }
    });

}

////////////// ----------     upload image  ----------------

db.collection("User").where('type','==','user').onSnapshot(snapshot => {
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

/////// confirmed user

db.collection("User").where('type','==','member').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            confirmedList(change.doc)
        }else if(change.type == 'removed'){
            console.log(change.doc.id);
            let tr = confirmed.querySelector('[data-id ='+change.doc.id + ']');
            confirmed.removeChild(tr);
        }
    })
});

function confirmedList(doc){
    console.log('hi')
    let li = document.createElement('li');
    let username= document.createElement('div');
    let body= document.createElement('div');
    let imgdiv= document.createElement('div');
    let detailsdiv= document.createElement('div');
    let img = document.createElement('img');
    let age = document.createElement('p');
    let email= document.createElement('p');
    let nic= document.createElement('p');
    let city = document.createElement('p');
    let phone = document.createElement('p');
    let br = document.createElement('br');
    let cross = document.createElement('button');
    

    li.setAttribute('data-id',doc.id);
    email.textContent = 'Email : ' + doc.data().email;
    username.textContent = doc.data().fname +" " + doc.data().lname;
    age.textContent = 'Age : ' + doc.data().age;
    nic.textContent = 'NIC : ' + doc.data().nic;
    city.textContent = 'Address : ' + doc.data().address;
    phone.textContent = 'Phone : ' + doc.data().phone;
    
    cross.textContent = 'Delete';



    username.setAttribute('class','collapsible-header grey lighten-3 grey-text text-darken-3');
    body.setAttribute('class','row collapsible-body grey-text text-darken-3');
    imgdiv.setAttribute('class','col s8 l6');
    detailsdiv.setAttribute('class','col s4 l6 ');
    cross.setAttribute('class', 'btn red lighten-1')
    cross.setAttribute('data-id', doc.id)
    
    
    
    li.appendChild(username);
    li.appendChild(body);
    body.appendChild(imgdiv);
    body.appendChild(detailsdiv);
    imgdiv.appendChild(age);
    imgdiv.appendChild(email);
    imgdiv.appendChild(nic);
    imgdiv.appendChild(phone);
    imgdiv.appendChild(city);
    imgdiv.appendChild(br);
    
    detailsdiv.appendChild(cross);
    
    
    confirmed.appendChild(li);

    ///////////delete/////////

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');

        if (confirm("Do you want to delete the User?")) {
            db.collection('User').doc(id).delete();
            //location.reload();
          } else {
            console.log('delete canceled');
          }

        
    });
  
}
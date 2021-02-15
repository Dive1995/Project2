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

////////////////////////



const tablelist = document.querySelector('#table-list');
// const editlist = document.querySelector('#edit-list');

// function renderList(doc){
//     let tr = document.createElement('tr');
//     let refNum = document.createElement('td');
//     let title = document.createElement('td');
//     let author = document.createElement('td');
//     let category = document.createElement('td');
//     let image = document.createElement('td');
  

//     tr.setAttribute('data-id', doc.id);
//     refNum.textContent = doc.data().refNum;
//     title.textContent = doc.data().title;
//     author.textContent = doc.data().author;
//     category.textContent = doc.data().category;
//     image.textContent = doc.data().image;
    


//     tr.appendChild(refNum);
//     tr.appendChild(title);
//     tr.appendChild(author);
//     tr.appendChild(category);
//     tr.appendChild(image);
    

//     tablelist.appendChild(tr);
// }

function renderList(doc){
    let li = document.createElement('li');
    let title = document.createElement('div');
    let body= document.createElement('div');
    let imgdiv= document.createElement('div');
    let detailsdiv= document.createElement('div');
    let img = document.createElement('img');
    let author = document.createElement('p');
    let refNum = document.createElement('p');
    let category = document.createElement('p');
    let br = document.createElement('br');
    let cross = document.createElement('button');
    let edit = document.createElement('button');
    
    

    //submit
    
    let form = document.createElement('form');
    let editpanal = document.createElement('div');
    let editRef = document.createElement('input');
    let editTitle = document.createElement('input');
    let editAuthor = document.createElement('input');

    editpanal.setAttribute('class','modal');
    editpanal.setAttribute('id',doc.id);
    editRef.setAttribute('placeholder' , doc.data().refNum);
    editTitle.setAttribute('placeholder', doc.data().title);
    editAuthor.setAttribute('placeholder',doc.data().author);
    
    
    editpanal.appendChild(form);
    form.appendChild(editRef);
    form.appendChild(editAuthor);
    form.appendChild(editTitle);



    li.setAttribute('data-id',doc.id);
    refNum.textContent = 'Ref.No : ' + doc.data().refNum;
    title.textContent = doc.data().refNum + ' -  ' +doc.data().title;
    author.textContent = 'Author : ' + doc.data().author;
    category.textContent = 'Category : ' + doc.data().category;
    img.src = doc.data().image;
    cross.textContent = 'Delete';
    edit.textContent = 'Edit';


    title.setAttribute('class','collapsible-header grey lighten-3 grey-text text-darken-3');
    body.setAttribute('class','row collapsible-body grey-text text-darken-3');
    imgdiv.setAttribute('class','col s4 l4');
    img.setAttribute('class' , 'responsive-img');
    img.setAttribute('alt' , 'book');
    detailsdiv.setAttribute('class','col s8 l7 offset-l1');
    cross.setAttribute('class', 'btn red lighten-1')
    // edit.setAttribute('onclick', $(doc.id).modal('open'))
    edit.setAttribute('class', 'btn modal-trigger blue lighten-1')
    edit.setAttribute('data-target', doc.id)
    
    
    
    
    li.appendChild(title);
    li.appendChild(body);
    body.appendChild(imgdiv);
    imgdiv.appendChild(img);
    body.appendChild(detailsdiv);
    
    detailsdiv.appendChild(author);
    detailsdiv.appendChild(refNum);
    detailsdiv.appendChild(category);
    detailsdiv.appendChild(br);
    detailsdiv.appendChild(edit);
    detailsdiv.appendChild(cross);
    

    tablelist.appendChild(li);
    tablelist.appendChild(editpanal);


    ///////////delete/////////

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.getAttribute('data-id');

        if (confirm("Do you want to delete the Book?")) {
            db.collection('Books').doc(id).delete();
          } else {
            console.log('delete canceled');
          }

        
    });
    // edit.addEventListener('click', (e) => {
    //     e.stopPropagation();
    //     console.log('editing');
    //     let id = e.target.getAttribute('data-id');
      

    //     if (confirm("Do you want to edit the Book?")) {
    //         $scope.modalTrigger = function () { $('#modalName').openModal() }
            
    //         console.log('ok')
    //       } else {
    //         console.log('edit canceled');
    //       }
        
    // });

}

////////////// ----------     upload image  ----------------




db.collection("Books").orderBy('title').onSnapshot(snapshot => {
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




const form = document.querySelector('#add-book');

form.addEventListener('submit', function uploadImage(evt) {
    evt.preventDefault();

    const ref = firebase.storage().ref('/bookImages/');
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
const addBookForm = document.querySelector('#add-book');

function submission(){

    let something = form.img.getAttribute('address');
    console.log(something);


    db.collection('Books').add({
        refNum : form.refNum.value,
        title : form.title.value,
        author : form.author.value,
        category : form.category.value,
        image : form.img.getAttribute('address')
    }).then(() => {
        alert("Book added successfully !!");
    }).then(() => {
        const modal = document.querySelector('#addbook');
        M.Modal.getInstance(modal).close();
        addBookForm.reset();
    })
    
}

//////modal

// document.addEventListener('DOMContentLoaded', function() {
//     let modals = document.querySelectorAll('.modal');
//     M.Modal.init(modals);
// });
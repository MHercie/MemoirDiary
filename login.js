let firebaseConfig = {
    apiKey: "AIzaSyB-utoht1yIY580RGfYBuwI89rMYMfYJHU",
    authDomain: "memoirdiary-893f1.firebaseapp.com",
    databaseURL: "https://memoirdiary-893f1.firebaseio.com",
    projectId: "memoirdiary-893f1",
    storageBucket: "memoirdiary-893f1.appspot.com",
    messagingSenderId: "827039837419",
    appId: "1:827039837419:web:e7f97b0f37c0cb7c5e22ae",
    measurementId: "G-NVSK0V391T"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);



      const userName = document.getElementById('userName');
      const txtEmail = document.getElementById('txtEmail');
      const txtPassword = document.getElementById('txtPassword');
      const signOutBtn = document.getElementById('signOutBtn');  // Google
      const userDetails = document.getElementById('userDetails');
      const auth = firebase.auth();

     
      const provider = new firebase.auth.GoogleAuthProvider();
      let user;
      let token;

      let memoir;
      let srcEncoded;
      let ctx;

  
     
      firebase.auth().onAuthStateChanged(function(user) {
        if(user !=null) {
            
          const email = user.email;
          
          console.log("Active User: "+ email);
          //navigate to home
           window.location.replace="home.html";
         
           document.getElementById('userDetails').innerHTML = `<h3> ${user.email} </h3>`;
          
        }else {
            console.log('not logged in');
           // window.alert('You are not logged in');
        }
     });
    
     //-------------Load Data----------------//

      function loadData() {

          let user =  firebase.auth().currentUser;

          let db = firebase.firestore();

          let storeImage;

        /*  db.collection('users').doc(auth.currentUser.uid).collection('Memoirs').get()
            .then(snapshot => {*/

              db.collection('users').doc(auth.currentUser.uid).collection('Memoirs')
                .orderBy("timestamp", "desc")
                .get()
                .then(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {

                   
                  //  const values = querySnapshot.docs.map(flattenDoc);
                    //console.table(values);
                    const memoirList = document.querySelector('#memoir-list');

                    //Set elements for HTML
                    let li = document.createElement('li');
                    let memory = document.createElement('span');
                    let timestamp = document.createElement('span');
                    let lineSpace = document.createElement('br');
                    let imageName = document.createElement('img'); //image
                    
                    
                                      
                    li.setAttribute('data-id', doc.id);
                    memory.textContent = doc.data().Memory;
                    timestamp.textContent = doc.data().timestamp;
                   // imageName.textContent = doc.data().image;
                  //  imageName.src = doc.data().image;
                    imageName.id = "id";
                    imageName.className = "img";
                                             
                    li.appendChild(timestamp);
                    li.appendChild(lineSpace);
                    li.appendChild(memory);
                    li.appendChild(imageName);
                        
                    memoirList.appendChild(li);
                    imageName.src = doc.data().image;
                    
                    console.log(doc.data());
            
                 });
               
          });

            
      }

     
//-------------Firebase login------------------------------//
        
        btnLogin.addEventListener('click', e => {
          
          const email = txtEmail.value;
          const pass = txtPassword.value;
          

           const promise = auth.signInWithEmailAndPassword(email,pass);

           promise.catch(e => console.log(e.message));

            //window.alert(email,pass);
           window.location.href="home.html";
           
          
         });

        

 //--------------Write Memoir to database------------------------------------//
      function writeData(){

        const ref = firebase.storage().ref();
        const file = document.getElementById('photo').files[0];
        let db = firebase.firestore();
            
        if(!file) return;
            
        const name = auth.currentUser.uid + '-' + new Date() + '-' + file.name;

        const metadata = {
          contentType:file.type
        };

        const task = ref.child(name).put(file,metadata);

        const preview = document.querySelector("#photo")
        let src;
        // = URL.createObjectURL(event.target.files[0]);    
        document.querySelector("#preview").src = src;
        preview.src = src;       

///////////
      //  let db = firebase.firestore();
        let insert = document.getElementById('insert').value;
        let currentdate = new Date();
        let mins =  ('0'+currentdate.getMinutes()).slice(-2);
        let datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + " @ "  
        + currentdate.getHours() + ":"  
        + mins + ":" 
        + currentdate.getSeconds();
       
        task
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
             
              db.collection('users').doc(auth.currentUser.uid).collection('Memoirs').add({
                image: url,
                Memory: insert,
                timestamp: datetime
    
              });
             // console.log(url);
              console.log("Image Upload Successful");
              
          })

          console.log("entry submitted");
          document.getElementById("memoir-list").innerHTML = ""; 
          document.getElementById('insert').value = "";
          document.getElementById('photo').value ="";
        
        
          setTimeout(loadData, 3000);
      } 
              
//----------------Resize Image and Show image preview---------------------------------//
     
        function process(event){
          if(event.target.files.length > 0){
            let src = URL.createObjectURL(event.target.files[0]);
            let preview = document.getElementById("preview");
            preview.src = src;
            preview.style.display = "block";
          } else{
            return;
          }
        }
      

  /*    function process(){

        console.log("I'm connected");

        const file = document.getElementById('photo').files[0];

        if(!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload  = function (event) {
          const imgElement = document.createElement("img");
          imgElement.src = event.target.result;

         // document.querySelector("#preview").src = event.target.result;
        
          imgElement.onload = function(e){

            let canvas =  document.createElement("canvas"); 
            let MAX_WIDTH = 300;

            const scaleSize = MAX_WIDTH / e.target.width;

            canvas.width = MAX_WIDTH;
            canvas.height = e.target.height * scaleSize;
                
            const ctx = canvas.getContext("2d");

            ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

           srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");

            document.querySelector("#preview2").src = srcEncoded;
          };
        }; 
      }  */ 

   
//-------------- Store image in Firebasestorage-----------------------------------//
          function uploadImage(){

            const ref = firebase.storage().ref();
            const file = document.getElementById('photo').files[0];
            let db = firebase.firestore();
            
            if(!file) return;
            
            const name = auth.currentUser.uid + '-' + new Date() + '-' + file.name;

            const metadata = {
              contentType:file.type
            };

            const task = ref.child(name).put(file,metadata);

            task
              .then(snapshot => snapshot.ref.getDownloadURL())
              .then(url => {
                  console.log(url);
                  db.collection('users').doc(auth.currentUser.uid).collection('Memoirs').add({

                    image: url

                  });
                  window.alert("Image Upload Successful");
                  const preview = document.querySelector("#photo")
                  let src;
                  // = URL.createObjectURL(event.target.files[0]);    
                  document.querySelector("#preview").src = src;
                  preview.src = src;       
              })

          }   
    

    
//------------Firebase signup----------------------------------//

      btnSignUp.addEventListener('click', e => {

        const email = document.getElementById("txtEmail2").value;
        const passWord = document.getElementById("txtPassword2").value;
        let unique;

        const promise = auth.createUserWithEmailAndPassword(email,passWord);
        promise.catch(e => console.log(e.message));

        promise.then(function () {
          
          let db = firebase.firestore();
        
        //Store extra info into firestore collection
          db.collection('users').doc(auth.currentUser.uid).set({
            userName : document.getElementById('userName').value,
            email: document.getElementById('txtEmail2').value,
            unique: auth.currentUser.uid
            
          });

        //  console.log(this.email, this.password);
        
        });
        container.classList.remove("sign-up-mode");

      });  
      
     

      
    
  



      



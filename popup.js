// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAdJnrqR7XAnye5HZ08Cq5anSpGZ3VCMeI",
    authDomain: "fakenews-a0ed7.firebaseapp.com",
    databaseURL: "https://fakenews-a0ed7.firebaseio.com",
    projectId: "fakenews-a0ed7",
    storageBucket: "fakenews-a0ed7.appspot.com",
    messagingSenderId: "874723129144",
    appId: "1:874723129144:web:446b64a0c2adbddff133cd",
    measurementId: "G-3RL604XSV9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();




//var provider = new firebase.auth.GoogleAuthProvider();

// Returns true if a user is signed-in.
function isUserSignedIn() {
    return !!firebase.auth().currentUser;
}



// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
    if (user) { // User is signed in!
        //alert("Logged In");
        $('#signin').hide();
        $('#checkPage').removeClass('hide');

        $('#msg').text("Please click below button to detect fake news!");

        // We save the Firebase Messaging Device token and enable notifications.
        //saveMessagingDeviceToken();
    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        //alert("Please login!");
        $('#msg').text("Please login to detect fake news!");
    }
}

function initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver);
}



function extractInfo(htmlDoc) {

    //var doc = new DOMParser().parseFromString(htmlDoc, "text/xml");
    //alert(doc.getElementsByClassName("wpb_wrapper")[0]);
    //alert(doc.querySelector('h3').innerText); // => <a href="#">Link...
    //console.log(doc.firstChild.firstChild.innerHTML); // => Link
    var el = document.createElement('div');
    el.innerHTML = htmlDoc.replace("<br>", "");
    var result = el.getElementsByTagName("h3")[0].innerText;

    var detail = el.getElementsByClassName("wpb_wrapper")[0];

    var firstText = "";
    for (var i = 0; i < detail.childNodes.length; i++) {
        var curNode = detail.childNodes[i];
        if (curNode.nodeName === "#text") {
            firstText = firstText + curNode.nodeValue;

        }
    }
    firstText = firstText.replace(/\n\s*\n\s*\n/g, '\n\n');


    var resultDiv = document.getElementById('result');
    var detailDiv = document.getElementById('detail');
    resultDiv.innerText = result;
    //detailDiv.innerText=firstText.replace(/(\n)/gm," ");
    detailDiv.innerText = firstText.split('\n\n', 5).join('\n\n');

    //alert (firstText.split('\n\n', 5).join('\n\n'));
    //var firstIndex = htmlDoc.indexOf("h3");
    //alert(firstIndex);
    //alert(htmlDoc.length);
    //var x = htmlDoc.substring(1050,40);
    //var x = htmlDoc.substring(parseInt(firstIndex) , firstIndex+40);
    //x="HTML".substring(1, 2);
    //alert(x);
    $('#det').removeClass('hide');

}




document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('checkPage');

    initFirebaseAuth();

    if (isUserSignedIn()) {
        user = firebase.auth().currentUser.displayName;
        alert("Hello " + user);
    }

    checkPageButton.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            //d = document;
            var link = tab.url;

            fetch('https://www.unslanted.net/newsbot/?u=' + link + '/&submit=Analyze').then(r => r.text()).then(result => {
                // Result now contains the response text, do what you want...
                extractInfo(result);
            })

        });
    }, false);
}, false);

document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('signin');
    checkPageButton.addEventListener('click', function () {

        //window.open("https://www.w3schools.com");
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

            alert("Hello " + user.displayName);

            // ...
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

        //firebase.auth().signInWithPopup(provider);




    })
});


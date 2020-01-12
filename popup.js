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

        $('#msg').text("Please click the green button below to detect fake news!");



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

function saveAction(messageText, action) {
    // Add a new message entry to the database.
    if ($('#docId').val()) {
        return firebase.firestore().collection('messages').doc($('#docId').val()).update({
            name: getUserName(),
            email: getEmailId(),
            url: messageText,
            action: action,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(function (error) {
            console.error('Error writing new message to database', error);
        });
    }
    else {
        return firebase.firestore().collection('messages').add({
            name: getUserName(),
            email: getEmailId(),
            url: messageText,
            action: action,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(function (error) {
            console.error('Error writing new message to database', error);
        });
    }


}



// Loads chat messages history and listens for upcoming ones.
function loadMessages(email, url) {
    // Create the query to load the last 12 messages and listen for new ones.
    var query = firebase.firestore()
        .collection('messages')
        .where("email", "==", email).where("url", "==", url)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data()) {
                    $('#docId').val(doc.id);
                    if (doc.data().action == "agree")
                        $('#agree').removeClass('fade');
                    else if (doc.data().action == "disagree")
                        $('#disagree').removeClass('fade');
                }
                else {
                    $('#docId').val(null);
                }
                alert(doc.data("action"));
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });



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

    $('#det').removeClass('hide');
    if(result.indexOf("True")>-1)
    {
        $('#det b').addClass('true');
    }
    else
    {
        $('#det b').addClass('false');
    }



}

// Returns the signed-in user's display name.
function getUserName() {
    return firebase.auth().currentUser.displayName;
}
function getEmailId() {
    return firebase.auth().currentUser.email;
}



document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('detect');
    var agreeButton = document.getElementById('agree');
    var disagreeButton = document.getElementById('disagree');

    initFirebaseAuth();

    if (isUserSignedIn()) {
        user = firebase.auth().currentUser.displayName;
        alert(user + ", welcome! Now you can proceed!");
    }

    checkPageButton.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            //d = document;
            var link = tab.url;
            fetch('https://www.unslanted.net/newsbot/?u=' + link + '/&submit=Analyze').then(r => r.text()).then(result => {
                // Result now contains the response text, do what you want...
                extractInfo(result);

                $('#agree').removeClass('hide');
                $('#disagree').removeClass('hide');

                loadMessages(getEmailId(), link)

            })
        });
    }, false);

    agreeButton.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            //d = document;
            var link = tab.url;
            saveAction(link, "agree");
            $('#agree').removeClass('fade');
                $('#disagree').addClass('fade');
        });
    }, false);

    disagreeButton.addEventListener('click', function () {

        chrome.tabs.getSelected(null, function (tab) {
            //d = document;
            var link = tab.url;

            saveAction(link, "disagree");
            $('#disagree').removeClass('fade');
            $('#agree').addClass('fade');
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


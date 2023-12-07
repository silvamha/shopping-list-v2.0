## 01 Log in set up instructions
If your users are going to sign in using Google, you need to set up Google Sign-In in your Firebase project and then use the Firebase Authentication module in your app to handle the sign-in flow. Here's a step-by-step guide:

### Setting up Google Sign-In in Firebase Console:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Click on `Authentication` in the left-hand menu.
4. Go to the `Sign-in method` tab.
5. Click on `Google` in the list of sign-in providers.
6. Click the `Enable` toggle button.
7. Configure the OAuth consent screen with your project details. This is the screen that users will see when they are prompted to grant access to their Google account.
8. Save your changes.

### Implementing Google Sign-In in your web app:

1. First, make sure you've imported the necessary Firebase modules in your JavaScript code:

   ```javascript
   import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
   import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
   ```

2. Initialize your Firebase app with your project configuration:

   ```javascript
   const firebaseConfig = {
     // your config values here
   };
   
   const app = initializeApp(firebaseConfig);
   ```

3. Initialize the Google Auth Provider and the Firebase Auth service:

   ```javascript
   const provider = new GoogleAuthProvider();
   const auth = getAuth(app);
   ```

4. Create a function to handle the sign-in process. This function will trigger the Google Sign-In popup and process the authentication result:

   ```javascript
   const signInWithGoogle = () => {
     signInWithPopup(auth, provider)
       .then((result) => {
         // This gives you a Google Access Token. You can use it to access Google APIs.
         const credential = GoogleAuthProvider.credentialFromResult(result);
         const token = credential.accessToken;
   
         // The signed-in user info.
         const user = result.user;
         console.log(user);
       }).catch((error) => {
         // Handle Errors here.
         const errorCode = error.code;
         const errorMessage = error.message;
         // The email of the user's account used.
         const email = error.email;
         // The AuthCredential type that was used.
         const credential = GoogleAuthProvider.credentialFromError(error);
         console.error(error);
       });
   };
   ```

5. Attach this function to the relevant event in your UI, such as a button click:

   ```html
   <button onclick="signInWithGoogle()">Sign in with Google</button>
   ```

6. Now, when the user clicks the button, the `signInWithGoogle` function will be called, prompting the user to sign in with their Google account.

7. After successful sign-in, you should handle the user's sign-in state. You can use the `onAuthStateChanged` listener to detect when the user's sign-in state changes:

   ```javascript
   onAuthStateChanged(auth, (user) => {
     if (user) {
       // User is signed in, see docs for a list of available properties
       // https://firebase.google.com/docs/reference/js/firebase.User
       console.log(`User is signed in: ${user.displayName}`);
     } else {
       // User is signed out
       console.log('User is signed out');
     }
   });
   ```

That's it! You now have Google Sign-In integrated with your Firebase project. When users sign in, Firebase will handle the authentication and provide you with the user's information, which you can then use within your app. Remember to handle the authentication state throughout your app's workflow to ensure a smooth user experience.
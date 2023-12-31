/**!SECTION Working Schedule
 * Last working as of 12/05/23 at 11:52AM
 */

/**!SECTION
 * ## 01 Purpose of the application
Shopping List

## 02 Functionality
1. The user enters an item in an input box
2. The use clicks a button that dynamically creates a checkbox with a label of the item just entered and an empty input field.
3. Once the shopping list is complete, the user will add the price of the item purchased and check the checkbox to indicate the item has been purchased. 
4. The price of each item is to be stored and added in a different variable for later use
 */
// Import Security Rules Modules
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Install Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

// Import essential modules
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";



// Initialize database
const appSettings = {
  apiKey: "AIzaSyBYPLSb6JNF4ZNNLQDFNiAMmEBYvtF0wXg",
  authDomain: "shoppinglist-b0a3b.firebaseapp.com",
  databaseURL: "https://shoppinglist-b0a3b-default-rtdb.firebaseio.com",
  projectId: "shoppinglist-b0a3b",
  storageBucket: "shoppinglist-b0a3b.appspot.com",
  messagingSenderId: "120255006474",
  appId: "1:120255006474:web:ff11944ea632765b02dcf3"
};

// Connect to database - set variables
const app = initializeApp(appSettings);
const database = getDatabase(app);

// Set Google Log In variables
const auth = getAuth(app);
const provider = new GoogleAuthProvider

// Create a reference to the database
const dbRef = ref(database, "shoppingList");

// Get button element to sing with Google
document.getElementById('googleSignInButton').addEventListener('click', signInWithGoogle);

// ***!SECTION - STart -  Save signInWithGoogle function. Read documentation and implement security rules and Google Sign In
// Sign in with Google
function signInWithGoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      console.log("User signed in: ", user);
      // Handle the signed-in user here.
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error("Error signing in with Google: ", errorMessage);
      // Handle errors here.
    });
}
// ****!SECTION - End

onValue(dbRef, (snapshot) => {
  listContainerDIV.innerHTML = ""; // Clear existing items
  const items = snapshot.val();

  if (items) {
    const itemsArray = Object.keys(items).map((key) => ({
      ...items[key],
      key,
    }));
    itemsArray.sort((a, b) => a.category.localeCompare(b.category));

    const categoryGroups = {};

    // Group items by category
    itemsArray.forEach((item) => {
      if (!categoryGroups[item.category]) {
        categoryGroups[item.category] = [];
      }
      categoryGroups[item.category].push(item);
    });

    // Create a container for each category and append items
    Object.keys(categoryGroups).forEach((category) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "category-container";
      const categoryTitle = document.createElement("h4");
      categoryTitle.className = "category-title";
      categoryTitle.textContent = category;
      categoryDiv.appendChild(categoryTitle);

      categoryGroups[category].forEach((item) => {
        createElements(
          item.item,
          item.fixedPrice,
          item.key,
          item.actualPrice,
          item.isPurchased,
          item.numberOfItems,
          categoryDiv // Pass the category container instead of category name
        );
      });

      listContainerDIV.appendChild(categoryDiv);
    });
  }
});

// Delcare variables for input element and button to input intems in the empty list
const inputEl = document.querySelector("#input-el");
const inputFixedPriceEl = document.querySelector("#input-price-el");
const btnEl = document.querySelector("#enter-items");
const inputLabel = document.querySelectorAll(".input-label");
// Array of objects to store details about shopping list
const listItemsArray = [
  {
    id: 0,
    item: "",
    price: 0,
    fixedPrice: 0,
    isPurchased: false,
  },
];
const uniqueId = `item-${listItemsArray.length + 1}`;
const listContainerDIV = document.querySelector("#list-container");
listContainerDIV.classList.add("list-container");

// Event listener for the add button
btnEl.addEventListener("click", function () {
  // Trim values to remove unnecessary whitespace
  const inputElValue = inputEl.value.trim();
  const inputFixedPriceElValue = inputFixedPriceEl.value.trim();
  const selectedCategory = document.getElementById("categoryDropdown").value; // Get the selected category

  // Only proceed if both fields have values
  if (inputElValue && inputFixedPriceElValue) {
    const numberOfItems = 1; // Default value for number of items
    const fixedPriceValue = parseFloat(inputFixedPriceElValue) || 0;
    const actualPriceValue = fixedPriceValue * numberOfItems;

    createElements(
      inputElValue,
      fixedPriceValue,
      uniqueId,
      actualPriceValue,
      false,
      numberOfItems,
      listContainerDIV
    ); // Create list elements

    const newItem = {
      item: inputElValue,
      fixedPrice: fixedPriceValue,
      actualPrice: actualPriceValue,
      numberOfItems: numberOfItems,
      isPurchased: false,
      categoryContainer: listContainerDIV,
    };
    // When you create a new item and push it to the database:
    push(dbRef, newItem).then((snapshot) => {
      const uniqueKey = snapshot.key; // This is the unique identifier generated by Firebase
      // Store this uniqueKey in your item object or set it as a data-id attribute on your HTML element
    });

    // Clear input fields after adding the item
    inputEl.value = "";
    inputFixedPriceEl.value = "";
  } else {
    // Alert if fields are incomplete
    alert("Please fill in both the item name and the estimated price.");
  }
});

inputEl.value = ""; // Clear input field after user clicks the button
// Create a function to dunamically create and append elements to the DOM
/**
 * Creates and appends elements to the list container.
 *
 * @param {string} itemValue - The value of the list item.
 * @param {string} fixedPriceValue - The value of the fixed price.
 */

// Function to dynamically create and append elements to the DOM
/**
 * Creates and appends elements for a shopping list item.
 *
 * @param {string} itemValue - The value of the item.
 * @param {number} fixedPriceValue - The fixed price of the item.
 * @param {string} uniqueKey - The unique key of the item.
 * @param {number} actualPrice - The actual price of the item.
 * @param {boolean} isPurchased - Indicates whether the item is purchased or not.
 * @param {HTMLElement} categoryContainer - The container element for the category.
 */
const createElements = (
  itemValue,
  fixedPriceValue,
  uniqueKey,
  actualPrice,
  isPurchased,
  numberOfItems,
  categoryContainer // Changed parameter
) => {
  // Create a new div to hold the item details
  const itemContainer = document.createElement("div");
  itemContainer.className = "list-item-container";

  // Inside your createElements function
  const categoryDiv = document.createElement("div");
  // categoryDiv.textContent = "Category: " + category;
  categoryDiv.textContent = "";
  itemContainer.appendChild(categoryDiv);

  // Input for displaying the item name
  const listItem = document.createElement("input");
  listItem.type = "text";
  listItem.className = "list-item";
  listItem.value = itemValue;
  listItem.setAttribute("data-id", uniqueKey);
  listItem.disabled = isPurchased;

  // Ensure fixedPriceValue, actualPrice, and numberOfItems are correctly parsed as numbers
  fixedPriceValue = parseFloat(fixedPriceValue) || 0;
  actualPrice = parseFloat(actualPrice) || 0;
  numberOfItems = parseInt(numberOfItems, 10) || 1;

  // Input for displaying the fixed price
  const fixedPriceDisplay = document.createElement("input");
  fixedPriceDisplay.type = "number";
  fixedPriceDisplay.className = "fixed-price";
  fixedPriceDisplay.value = (
    parseFloat(fixedPriceValue) * numberOfItems
  ).toFixed(2);
  fixedPriceDisplay.disabled = true;

  // Input for entering the actual price
  const actualPriceInput = document.createElement("input");
  actualPriceInput.type = "number";
  actualPriceInput.className = "actual-price-input";
  actualPriceInput.placeholder = "Actual Price";
  actualPriceInput.value = actualPrice || "";
  actualPriceInput.disabled = isPurchased;

  // Checkbox for marking the item as purchased
  const isPurchasedCheckbox = document.createElement("input");
  isPurchasedCheckbox.type = "checkbox";
  isPurchasedCheckbox.className = "is-purchased-checkbox";
  isPurchasedCheckbox.checked = isPurchased;
  isPurchasedCheckbox.setAttribute("data-id", uniqueKey);

  // Input for entering the number of items
  const numberOfItemsInput = document.createElement("input");
  numberOfItemsInput.type = "number";
  numberOfItemsInput.className = "number-of-items-input";
  numberOfItemsInput.placeholder = "Enter number of items";
  numberOfItemsInput.value = numberOfItems || 1;
  numberOfItemsInput.disabled = isPurchased;

  // Event listeners for updating Firebase on changes
  actualPriceInput.addEventListener("change", (event) => {
    event.stopPropagation();
    const updatedPrice = parseFloat(event.target.value) || 0;
    updateItemInFirebase(uniqueKey, { actualPrice: updatedPrice });
  });

  // Event listener for when the number of items is updated
  numberOfItemsInput.addEventListener("change", (event) => {
    event.stopPropagation(); // Stop the event from bubbling up the DOM tree

    // Parse the updated number of items as an integer
    const updatedNumberOfItems = parseInt(event.target.value, 10) || 1;

    // Calculate the new total fixed and actual prices
    const updatedTotalFixedPrice = (
      fixedPriceValue * updatedNumberOfItems
    ).toFixed(2);
    const updatedTotalActualPrice = (
      actualPrice * updatedNumberOfItems
    ).toFixed(2);

    // Update the DOM elements with the new values
    fixedPriceDisplay.value = updatedTotalFixedPrice;
    actualPriceInput.value = updatedTotalActualPrice;

    // Get the item's unique ID from the data attribute
    const itemId = listItem.getAttribute("data-id");

    // Reference the specific item in the database
    const itemRef = ref(database, `shoppingList/${itemId}`);

    // Update Firebase with the new total fixed and actual prices
    update(itemRef, {
      fixedPrice: updatedTotalFixedPrice,
      actualPrice: updatedTotalActualPrice,
      numberOfItems: updatedNumberOfItems,
    }).catch((error) => {
      console.error("Error updating in Firebase", error);
    });
  });

  isPurchasedCheckbox.addEventListener("change", (event) => {
    event.stopPropagation();
    const isChecked = event.target.checked;
    listItem.disabled = isChecked;
    fixedPriceDisplay.disabled = isChecked;
    actualPriceInput.disabled = isChecked;
    numberOfItemsInput.disabled = isChecked;
    updateItemInFirebase(uniqueKey, { isPurchased: isChecked });
  });

  // Append all elements to the item container div
  itemContainer.appendChild(listItem);
  itemContainer.appendChild(actualPriceInput);
  itemContainer.appendChild(numberOfItemsInput);
  itemContainer.appendChild(fixedPriceDisplay);
  itemContainer.appendChild(isPurchasedCheckbox);

  // Append the item container to the main list container in the DOM
  listContainerDIV.appendChild(itemContainer);

  // Append the item container to the passed category container
  categoryContainer.appendChild(itemContainer);
};

// Helper function to update an item in Firebase
function updateItemInFirebase(itemId, updateObject) {
  const itemRef = ref(database, `shoppingList/${itemId}`);
  update(itemRef, updateObject).catch((error) => {
    console.error("Error updating item in Firebase", error);
  });
}



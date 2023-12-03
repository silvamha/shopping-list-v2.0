/**!SECTION
 * ## 01 Purpose of the application
Shopping List

## 02 Functionality
1. The user enters an item in an input box
2. The use clicks a button that dynamically creates a checkbox with a label of the item just entered and an empty input field.
3. Once the shopping list is complete, the user will add the price of the item purchased and check the checkbox to indicate the item has been purchased. 
4. The price of each item is to be stored and added in a different variable for later use
 */

import { tesVar } from "./data.js";
console.log(tesVar);

// Install Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://shoppinglist-b0a3b-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

// Create a reference to the database
const dbRef = ref(database, "shoppingList");

// ChatGPT Suggestion
onValue(dbRef, (snapshot) => {
  listContainerDIV.innerHTML = ""; // Clear existing items
  const items = snapshot.val();
  if (items) {
    Object.keys(items).forEach((key) => {
      const item = items[key];
      createElements(
        item.item,
        item.fixedPrice,
        key,
        item.actualPrice,
        item.isPurchased,
        item.numberOfItems
      );
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

// ChatGPT Suggestion
// Event listener for the add button
btnEl.addEventListener("click", function () {
  // Trim values to remove unnecessary whitespace
  const inputElValue = inputEl.value.trim();
  const inputFixedPriceElValue = inputFixedPriceEl.value.trim();

  // Only proceed if both fields have values
  if (inputElValue && inputFixedPriceElValue) {
    createElements(inputElValue, inputFixedPriceElValue); // Create list elements

    const newItem = {
      item: inputElValue,
      fixedPrice: inputFixedPriceElValue,
      actualPrice: 0, // Initialize with a default value
      numberOfItems: 0, // Initialize with a default value
      isPurchased: false, // Default is not purchased
    };

    // GPT suggestion*******
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

inputEl.value = ""; //Cledar input field after user clicks the button
// Create a function to dunamically create and append elements to the DOM
/**
 * Creates and appends elements to the list container.
 *
 * @param {string} itemValue - The value of the list item.
 * @param {string} fixedPriceValue - The value of the fixed price.
 */

// ChatGPT Suggestion
// Function to dynamically create and append elements to the DOM
//

// Function to dynamically create and append elements to the DOM
const createElements = (
  itemValue,
  fixedPriceValue,
  uniqueKey,
  actualPrice,
  isPurchased,
  numberOfItems
) => {
  // Create a new div to hold the item details
  const itemContainer = document.createElement("div");
  itemContainer.className = "list-item-container";

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
  actualPriceInput.placeholder = "Enter actual price";
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

  // // *****wORKING CODE BUT UPDATES FIREBASE AND DOM WITH DIFFERENT VALUES********
  // numberOfItemsInput.addEventListener("change", (event) => {
  //   event.stopPropagation();
  //   const updatedNumberOfItems = parseInt(event.target.value, 10) || 1;
  //   const updatedFixedPrice = (
  //     parseFloat(fixedPriceValue) * updatedNumberOfItems
  //   ).toFixed(2);
  //   fixedPriceDisplay.value = updatedFixedPrice;
  //   updateItemInFirebase(uniqueKey, {
  //     numberOfItems: updatedNumberOfItems,
  //     fixedPrice: updatedFixedPrice,
  //   });
  // });

  // ****CHATGPT SUGGESTION********
  // Event listener for when the number of items is updated
  numberOfItemsInput.addEventListener("change", (event) => {
    event.stopPropagation(); // Stop the event from bubbling up the DOM tree
  
    // Parse the updated number of items as an integer
    const updatedNumberOfItems = parseInt(event.target.value, 10) || 1;
  
    // Calculate the new total fixed and actual prices
    const updatedTotalFixedPrice = (fixedPriceValue * updatedNumberOfItems).toFixed(2);
    const updatedTotalActualPrice = (actualPrice * updatedNumberOfItems).toFixed(2);
  
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
      numberOfItems: updatedNumberOfItems
    }).catch((error) => {
      console.error("Error updating in Firebase", error);
    });
  });
  
// // ****Coder Assistant SUGGESTION********
// // DOES NOT APPEAR TO WORK AS INTENDED
// //The code below updates Firebase and  the DOM with different values
// numberOfItemsInput.addEventListener("change", (event) => {
//   event.stopPropagation();
//   const updatedNumberOfItems = parseInt(event.target.value, 10) || 0;
//   const updatedTotalFixedPrice = (fixedPriceValue * updatedNumberOfItems).toFixed(2);

//   fixedPriceDisplay.value = updatedTotalFixedPrice;

//   updateItemInFirebase(uniqueKey, {
//     numberOfItems: updatedNumberOfItems,
//     fixedPrice: updatedTotalFixedPrice,
//   });
// });


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
};

// Helper function to update an item in Firebase
function updateItemInFirebase(itemId, updateObject) {
  const itemRef = ref(database, `shoppingList/${itemId}`);
  update(itemRef, updateObject).catch((error) => {
    console.error("Error updating item in Firebase", error);
  });
}


console.log("index.js");
console.log("version1");// Version 1

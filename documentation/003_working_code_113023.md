## 01 Last working code before major modificaitons
## ChatGPT suggestions to dynamically render checkbox and input box to DOM
To display the price input and the "isPurchased" checkbox for each item, you will need to adjust the `createElements` function to include these elements in the DOM. The function should create a structure for each item, where all associated elements (item name, price, and checkbox) are grouped together and can be managed easily.

Let's update the `createElements` function to include these additional fields:

```javascript
const createElements = (itemValue, fixedPriceValue) => {
  // Container for the whole item entry
  const itemContainer = document.createElement('div');
  itemContainer.className = 'list-item-container';

  // Label for the item name
  const listItemLabel = document.createElement('label');
  listItemLabel.textContent = `Item: ${itemValue}`;

  // Non-editable display for the fixed price
  const fixedPriceDisplay = document.createElement('input');
  fixedPriceDisplay.type = 'text';
  fixedPriceDisplay.className = 'fixed-price-display';
  fixedPriceDisplay.value = fixedPriceValue;
  fixedPriceDisplay.disabled = true;

  // Input for entering the actual price
  const actualPriceInput = document.createElement('input');
  actualPriceInput.type = 'number';
  actualPriceInput.className = 'actual-price-input';
  actualPriceInput.placeholder = 'Enter actual price';

  // Checkbox for marking the item as purchased
  const isPurchasedCheckbox = document.createElement('input');
  isPurchasedCheckbox.type = 'checkbox';
  isPurchasedCheckbox.className = 'is-purchased-checkbox';

  // Append elements to the item container
  itemContainer.appendChild(listItemLabel);
  itemContainer.appendChild(fixedPriceDisplay);
  itemContainer.appendChild(actualPriceInput);
  itemContainer.appendChild(isPurchasedCheckbox);

  // Append the item container to the main list container
  listContainerDIV.appendChild(itemContainer);
};
```

Now, when you fetch the data from Firebase and call `createElements`, it will create an entry for each item that includes the fixed price and a checkbox to mark the item as purchased. The actual price input is also included for the user to fill in as they shop.

Additionally, ensure that your Firebase `onValue` event listener calls `createElements` with the proper parameters for each item:

```javascript
onValue(dbRef, (snapshot) => {
  listContainerDIV.innerHTML = ''; // Clear existing entries
  const shoppingListArray = snapshot.val() ? Object.values(snapshot.val()) : [];

  shoppingListArray.forEach((item) => {
    createElements(item.item, item.fixedPrice); // Assume 'item' and 'fixedPrice' are keys in your objects
  });
});
```

Make sure to replace `'item'` and `'fixedPrice'` with the actual keys you use in your Firebase objects. This code assumes that each object in your database looks something like this:

```json
{
  "itemName": "Milk",
  "fixedPrice": "1.99",
  "isPurchased": false
}
```

If the keys are different, adjust the `createElements` call in the `onValue` listener accordingly.

## 02 The code below worked
```JS
/**!SECTION
 * ## 01 Purpose of the application
Shopping List

## 02 Functionality
1. The user enters an item in an input box
2. The use clicks a button that dynamically creates a checkbox with a label of the item just entered and an empty input field.
3. Once the shopping list is complete, the user will add the price of the item purchased and check the checkbox to indicate the item has been purchased. 
4. The price of each item is to be stored and added in a different variable for later use
 */

// Install Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://shoppinglist-b0a3b-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

// Create a reference to the database
const dbRef = ref(database, "shoppingList");

// FIX THIS CODE FROM HERE
onValue(dbRef, (snapshot) => {
  // Clear the list container
  listContainerDIV.innerHTML = "";

  let shoppingListArray = Object.values(snapshot.val());

  shoppingListArray.forEach((item) => {
    const { item: itemName, fixedPrice } = item;
    console.log(itemName, fixedPrice);
    createElements(itemName, fixedPrice);
  });
  console.log(shoppingListArray);
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

// btnEl.addEventListener("click", function () {
//   const inputElValue = inputEl.value;
//   const inputFixedPriceElValue = inputFixedPriceEl.value;
//   createElements(inputElValue, inputFixedPriceElValue);

//   // Create a new object with the item details
//   const newItem = {
//     id: listItemsArray.length + 1, // Assign a unique id based on the current length of the array
//     item: inputElValue, // The item name from the input field
//     price: 0, // You can update this value based on your requirements
//     fixedPrice: inputFixedPriceElValue, // The fixed price from the input field
//     isPurchased: false, // Initially, the item is not purchased
//   };

//   // Push the new item to the array
//   listItemsArray.push(newItem);

//   // Push the new item to the database
//   push(dbRef, newItem);

//   inputEl.value = ""; // Clear input field after user clicks the button
//   inputFixedPriceEl.value = ""; // Clear input field after user clicks the button
// });

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
      isPurchased: false, // Default is not purchased
    };

    push(dbRef, newItem); // Push the new item to Firebase

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
const createElements = (itemValue, fixedPriceValue) => {
  // Create a new div to hold the item details
  const itemContainer = document.createElement('div');
  itemContainer.className = 'list-item-container'; // Add class for styling

  // Create the list item label and input for the item name
  const listItemLabel = document.createElement('label');
  listItemLabel.textContent = `Item: ${itemValue}`; // Set the label text

  // Input for displaying the item name
  const listItem = document.createElement('input');
  listItem.type = 'text';
  listItem.className = 'list-item';
  listItem.value = itemValue; // Set the input value

  // Input for displaying the fixed price (not editable by the user)
  const fixedPriceDisplay = document.createElement('input');
  fixedPriceDisplay.type = 'text';
  fixedPriceDisplay.className = 'fixed-price';
  fixedPriceDisplay.value = fixedPriceValue;
  fixedPriceDisplay.disabled = true; // Disable editing

  // Input for entering the actual price
  const actualPriceInput = document.createElement('input');
  actualPriceInput.type = 'number';
  actualPriceInput.className = 'actual-price-input';
  actualPriceInput.placeholder = 'Enter actual price';

  // Checkbox for marking the item as purchased
  const isPurchasedCheckbox = document.createElement('input');
  isPurchasedCheckbox.type = 'checkbox';
  isPurchasedCheckbox.className = 'is-purchased-checkbox';


  // Append all created elements to the item container div
  itemContainer.appendChild(listItemLabel);
  itemContainer.appendChild(listItem);
  itemContainer.appendChild(fixedPriceDisplay);
  itemContainer.appendChild(actualPriceInput);
  itemContainer.appendChild(isPurchasedCheckbox);

  // Finally, append the item container to the main list container in the DOM
  listContainerDIV.appendChild(itemContainer);
};


// const createElements = (itemValue, fixedPriceValue) => {
//   // Create elements and set attributes

//   // This field is the lable for listItem
//   const listItemLabel = document.createElement("label");
//   //   listItemLabel.setAttribute("id", "list-item-label");
//   listItemLabel.classList.add("list-item-label");
//   listItemLabel.setAttribute("for", uniqueId);
//   listItemLabel.textContent = "Item: ";

//   //   This field is going to be pupulate dynamically with the item entered by the user from inputEl
//   /**
//    * Fix the code below
//    */
//   // listItem.setAttribute("id", uniqueId);
//   const listItem = document.createElement("input");
//   listItem.setAttribute("type", "text");
//   //   listItem.setAttribute("id", "list-item");
//   listItem.classList.add("list-item");
//   listItem.setAttribute("name", "my-list-item");
//   listItem.value = inputEl.value;
//   listItem.setAttribute("data-id", listItemsArray.length + 1);

//   const itemLabel = document.createElement("label");
//   //   itemLabel.setAttribute("id", "item-label");
//   itemLabel.classList.add("item-label");
//   itemLabel.setAttribute("for", "item");
//   itemLabel.textContent = "Purchased: ";

//   const checkBoxItem = document.createElement("input");
//   checkBoxItem.setAttribute("type", "checkbox");
//   //   checkBoxItem.setAttribute("id", "item");
//   checkBoxItem.classList.add("item");
//   checkBoxItem.setAttribute("name", "item");
//   checkBoxItem.setAttribute("value", "item");
//   checkBoxItem.setAttribute("required", true);

//   const enterPrice = document.createElement("input");
//   enterPrice.setAttribute("type", "number");
//   //   enterPrice.setAttribute("id", "price");
//   enterPrice.classList.add("price");
//   enterPrice.setAttribute("name", "price");
//   enterPrice.setAttribute("placeholder", "Enter price");
//   enterPrice.setAttribute("required", true);

//   //   This field should be pre-populated with the estimated price of the item and should not be editable.
//   const fixedPrice = document.createElement("input");
//   fixedPrice.setAttribute("type", "number");
//   //   fixedPrice.setAttribute("id", "fixed-price");
//   fixedPrice.classList.add("fixed-price");
//   fixedPrice.setAttribute("name", "fixed-price");
//   fixedPrice.setAttribute("placeholder", "Fixed price");
//   fixedPrice.setAttribute("required", true);
//   fixedPrice.setAttribute("disabled", true);
//   fixedPrice.value = inputFixedPriceEl.value;

//   //   Append Elements to #list-container
//   listContainerDIV.appendChild(listItemLabel);
//   listContainerDIV.appendChild(listItem);
//   listContainerDIV.appendChild(itemLabel);
//   listContainerDIV.appendChild(checkBoxItem);
//   listContainerDIV.appendChild(enterPrice);
//   listContainerDIV.appendChild(fixedPrice);
// };

```
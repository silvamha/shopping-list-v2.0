## 01 Fully functional code, perhaps with many bugs, but it does the job.
Certainly! To match your `createElements` function signature, the code that populates the actual price would look like this:

```javascript
// Function to dynamically create and append elements to the DOM
const createElements = (itemValue, fixedPriceValue, uniqueKey, actualPrice) => {
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
  listItem.setAttribute('data-id', uniqueKey); // Set a data attribute for the unique key

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
  actualPriceInput.value = actualPrice || ''; // Use the actualPrice if defined, otherwise default to an empty string

  // Event listener for when the actual price is updated
  actualPriceInput.addEventListener('change', (event) => {
    const updatedPrice = event.target.value;
    const itemId = listItem.getAttribute('data-id');

    // Here, dbRef points to "shoppingList", so we just chain the item ID to it
    const itemRef = ref(database, `shoppingList/${itemId}`);

    update(itemRef, {
      actualPrice: updatedPrice
    }).catch((error) => {
      console.error("Error updating actual price in Firebase", error);
    });
  });

  // Checkbox for marking the item as purchased
  const isPurchasedCheckbox = document.createElement('input');
  isPurchasedCheckbox.type = 'checkbox';
  isPurchasedCheckbox.className = 'is-purchased-checkbox';
  isPurchasedCheckbox.checked = isPurchased; // Set the checkbox based on the isPurchased value
  isPurchasedCheckbox.setAttribute('data-id', uniqueKey); // Set the same data attribute for the checkbox

    // Event listener for when the checkbox is updated
  isPurchasedCheckbox.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    const itemId = event.target.getAttribute('data-id');

    // Reference to the specific item in the database
    const itemRef = ref(database, `shoppingList/${itemId}`);

    // Update the isPurchased status in Firebase
    update(itemRef, {
      isPurchased: isChecked
    }).then(() => {
      // Make related input fields non-editable if the item is marked as purchased
      listItem.disabled = isChecked;
      fixedPriceDisplay.disabled = isChecked;
      actualPriceInput.disabled = isChecked;
    }).catch((error) => {
      console.error("Error updating isPurchased in Firebase", error);
    });
  });

  // Append all created elements to the item container div
  itemContainer.appendChild(listItemLabel);
  itemContainer.appendChild(listItem);
  itemContainer.appendChild(fixedPriceDisplay);
  itemContainer.appendChild(actualPriceInput);
  itemContainer.appendChild(isPurchasedCheckbox);

  // Finally, append the item container to the main list container in the DOM
  listContainerDIV.appendChild(itemContainer);
};
```

In the above code:

- Each input for the item name and the actual price has a `data-id` attribute set to the `uniqueKey` value.
- The `actualPriceInput` event listener uses the `data-id` attribute to construct the correct path to update the actual price in Firebase.
- When the actual price input value changes, it updates the corresponding record in Firebase under the `actualPrice` field.

Make sure to replace `listContainerDIV` with the actual ID of your list container element in the DOM.

This code should maintain the entered actual price in the DOM even after you press Enter, as long as the `onValue` listener is not clearing the input fields afterward.

## 02 Added functionality to checkbox
Certainly! To add functionality to the checkbox so that when it's checked it updates the database and turns related input fields non-editable, you can modify the `createElements` function to include an event listener for the checkbox. Here's how you can do it:

```javascript
// Function to dynamically create and append elements to the DOM
const createElements = (itemValue, fixedPriceValue, uniqueKey, actualPrice, isPurchased) => {
  // ... [existing code] ...

  // Checkbox for marking the item as purchased
  const isPurchasedCheckbox = document.createElement('input');
  isPurchasedCheckbox.type = 'checkbox';
  isPurchasedCheckbox.className = 'is-purchased-checkbox';
  isPurchasedCheckbox.checked = isPurchased; // Set the checkbox based on the isPurchased value
  isPurchasedCheckbox.setAttribute('data-id', uniqueKey); // Set the same data attribute for the checkbox

  // Event listener for when the checkbox is updated
  isPurchasedCheckbox.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    const itemId = event.target.getAttribute('data-id');

    // Reference to the specific item in the database
    const itemRef = ref(database, `shoppingList/${itemId}`);

    // Update the isPurchased status in Firebase
    update(itemRef, {
      isPurchased: isChecked
    }).then(() => {
      // Make related input fields non-editable if the item is marked as purchased
      listItem.disabled = isChecked;
      fixedPriceDisplay.disabled = isChecked;
      actualPriceInput.disabled = isChecked;
    }).catch((error) => {
      console.error("Error updating isPurchased in Firebase", error);
    });
  });

  // ... [existing code to append children] ...
};
```

With this modification, when a checkbox is checked or unchecked:

1. It updates the `isPurchased` property for the corresponding item in the Firebase database.
2. It disables or enables the item's name input, fixed price display, and actual price input based on the checked status of the checkbox.

This ensures that once an item is marked as purchased, it can no longer be edited, making it clear which items have been purchased. Don't forget to set the initial `isPurchased` status when creating the checkbox element based on the data from Firebase.
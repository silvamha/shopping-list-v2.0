## 01 Calculations of current and fixed prices based on number of items entered
```JS
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
```
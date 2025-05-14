class Cart {

  // for this to work, you need to listen for changes in the cart, and run applyDiscounts before re-rendering the cart

  async applyDiscounts() {
    try {
      // Fetch available discount codes from the discounts section using the Section Rendering API
      // Technically, the discounts section does not have to be rendered on the theme.liquid for this to work, but I'm rendering it on theme.liquid to be able to add the discounts via the customizer

      const discountCodesResponse = await fetch(`/?section_id=discounts`);
      if (!discountCodesResponse.ok) {
        console.error(
          "Failed to fetch discount codes:",
          discountCodesResponse.status
        );
        return false;
      }

      const discountCodesHtml = await discountCodesResponse.text();
      const discountCodesDoc = new DOMParser().parseFromString(
        discountCodesHtml,
        "text/html"
      );
      const discountCodesElement = discountCodesDoc.querySelector(
        "[js-discount-applications]"
      );

      if (!discountCodesElement) {
        console.error("Discount codes element not found in response");
        return false;
      }

      const discountCodesData = JSON.parse(discountCodesElement.textContent);

      // The discountCodesData object is a JSON object with two properties:
      // - current_discounts: an array of the discount codes that are currently applied to the cart
      // - available_discounts: an array of the discount codes that are available to be applied to the cart, that you added in the discounts section

      const availableDiscountCodes = discountCodesData.available_discounts;

      if (!availableDiscountCodes || !Array.isArray(availableDiscountCodes)) {
        console.error("Invalid discount codes data structure");
        return false;
      }

      // Loop through the available discount codes and attemmpt to apply them to the cart
      for (const discountCode of availableDiscountCodes) {
        try {
          // This fetch call attempts to apply the discount code to the cart, and Shopify will only apply the discount code if the discount code's conditions are met
          const discountResponse = await fetch(
            `/discount/${encodeURIComponent(discountCode)}?section_id=discounts`
          );
          if (!discountResponse.ok) {
            console.error(
              `Failed to fetch discount ${discountCode}:`,
              discountResponse.status
            );
            continue;
          }

          // If the discount code is applied successfully, the discount code will be rendered in the discounts section via Liquid on the fetched HTML
          const discountHtml = await discountResponse.text();
          const discountDoc = new DOMParser().parseFromString(
            discountHtml,
            "text/html"
          );
          const discountElement = discountDoc.querySelector(
            "[js-discount-applications]"
          );

          if (!discountElement) {
            console.error(
              `Discount element not found for code: ${discountCode}`
            );
            continue;
          }

          const discountsData = JSON.parse(discountElement.textContent);
          const currentDiscounts = discountsData.current_discounts;

          // If the discount code is found in the current discounts, we can assume the discount code was applied successfully, and we can stop applying discounts
          if (
            currentDiscounts &&
            currentDiscounts.some((d) => d === discountCode)
          ) {
            return true;
          }
        } catch (discountError) {
          console.error(
            `Error processing discount ${discountCode}:`,
            discountError
          );
          continue;
        }
      }

      return false;
    } catch (error) {
      console.error("Error in applyDiscounts:", error);
      return false;
    }
  }
}

# Shopify Automatic Discount Code Application

This module provides automatic discount code application functionality for Shopify stores. It automatically attempts to apply available discount codes to the cart based on their conditions.

## How It Works

The system uses Shopify's Section Rendering API to:
1. Fetch available discount codes from a dedicated discounts section
2. Automatically attempt to apply these discounts to the cart
3. Only applies discounts that meet their conditions (as defined in Shopify)

## Setup

1. Copy and create a new section in your Shopify theme called `discounts.liquid`
2. Include the `discounts` section in your `theme.liquid` (this enables adding discounts via the customizer)
3. Integrate the `applyDiscounts` function from the `cart.js` into your cart, and call it whenever the cart changes

## Important Notes

- The `applyDiscounts()` method should be called before re-rendering the cart
- Discount codes must be added through the Shopify customizer in the discounts section
- The system will automatically attempt to apply all available discount codes in descending order
- Only discount codes that meet their conditions will be successfully applied
- The first valid discount code that can be applied will be used

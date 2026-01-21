<?php
/**
 * Template Name: Product Finder (Full Width)
 * Description: Full-width page template for the Linemaster Product Finder React app
 */

// Remove WordPress default header/footer if you want ONLY the app
// For seamless integration WITH your theme header/footer, keep get_header() and get_footer()

get_header();
?>

<style>
  /* Remove default WordPress content padding/margins for full-width experience */
  .product-finder-container {
    max-width: 100%;
    margin: 0;
    padding: 0;
  }

  /* Optional: Hide WordPress page title */
  .entry-title {
    display: none;
  }

  /* Ensure React app takes full width */
  #root {
    width: 100%;
    min-height: 100vh;
  }
</style>

<div class="product-finder-container">
  <!-- React App Root -->
  <div id="root"></div>

  <!-- Load the React App -->
  <script type="module" crossorigin src="/product-finder/assets/index-2ohXmRAt.js"></script>
  <link rel="stylesheet" crossorigin href="/product-finder/assets/index-B8NDz6ZX.css">
</div>

<?php
get_footer();
?>

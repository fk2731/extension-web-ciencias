# Facultad de Ciencias Customizer - Development Guide

## Project Structure

`
├── manifest.json          # Extension configuration
├── background.js          # Service worker (background script)
├── content.js            # Injected into web pages
├── styles.css            # Main styling for the website
├── popup.html           # Extension popup interface
├── popup.js             # Popup functionality
├── icon-*.jpg           # Extension icons
└── README.md            # Project documentation
`

## How It Works

### 1. Manifest (manifest.json)

- Defines extension permissions, content scripts, and popup
- Specifies which websites the extension runs on
- Configures background service worker

### 2. Content Script (content.js)

- Runs on every page matching `web.fciencias.unam.mx/*`
- Adds/removes the CSS class `fciencias-customizer-active` to control styling
- Handles messages from popup (toggle, reset, status)
- Persists settings using Chrome storage

### 3. Styles (styles.css)

- Only applies when `body.fciencias-customizer-active` class is present
- Uses `!important` to override existing site styles
- Organized by component types (forms, buttons, tables, etc.)

### 4. Popup (popup.html/popup.js)

- Provides user interface when clicking extension icon
- Allows toggling extension on/off
- Shows status and provides reset functionality
- Communicates with content script via Chrome messaging

### 5. Background Script (background.js)

- Handles extension installation/updates
- Manages storage and cross-tab communication
- Shows badge indicators on extension icon

## Customizing the Styles

### Step 1: Inspect the Target Website

1. Visit `https://web.fciencias.unam.mx/`
2. Right-click elements you want to style
3. Choose "Inspect Element" to see HTML structure
4. Note the class names, IDs, and element types

### Step 2: Add Specific Selectors

Add your custom styles to `styles.css` using this pattern:

```css
body.fciencias-customizer-active [your-selector] {
  property: value !important;
}
```

**Examples:**

```css
/* Target specific header */
body.fciencias-customizer-active .site-header {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
}

/* Style login forms */
body.fciencias-customizer-active .login-container {
  background: #2d2d2d !important;
  border-radius: 12px !important;
  padding: 30px !important;
}

/* Customize navigation menu */
body.fciencias-customizer-active .nav-menu li a {
  color: #5dade2 !important;
  font-weight: 500 !important;
}
```

### Step 3: Test Your Changes

1. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select your extension folder
2. Visit the target website
3. Click the extension icon to toggle styles on/off
4. Refresh the page after making CSS changes

## Advanced Customization

### Adding JavaScript Functionality

In `content.js`, you can add JavaScript modifications:

```javascript
function applyCustomStyles() {
  document.body.classList.add('fciencias-customizer-active');
  
  // Add custom JavaScript modifications here
  addCustomFeatures();
}

function addCustomFeatures() {
  // Example: Add a custom button
  const customButton = document.createElement('button');
  customButton.textContent = 'Custom Feature';
  customButton.onclick = () => alert('Custom functionality!');
  document.body.appendChild(customButton);
  
  // Example: Modify existing elements
  const headers = document.querySelectorAll('h1, h2, h3');
  headers.forEach(header => {
    header.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
  });
}
```

### Adding User Settings

1. Create an options page (`options.html`)
2. Update `manifest.json` to include options page
3. Use `chrome.storage` to save/load user preferences
4. Modify styles based on user preferences

### Theme System

You can create multiple themes by organizing your CSS:

```css
/* Dark theme (default) */
body.fciencias-customizer-active.theme-dark {
  background: #1a1a1a !important;
  color: #e0e0e0 !important;
}

/* Light theme */
body.fciencias-customizer-active.theme-light {
  background: #f8f9fa !important;
  color: #343a40 !important;
}

/* Blue theme */
body.fciencias-customizer-active.theme-blue {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: white !important;
}
```

## Tips for Success

1. **Use Specific Selectors**: Target exact elements to avoid affecting unintended parts
2. **Always Use !important**: Website styles often have high specificity
3. **Test Across Pages**: Make sure styles work on all sections of the website
4. **Keep Backups**: Save working versions before making major changes
5. **Use Browser DevTools**: Test styles directly in the browser before adding to CSS
6. **Gradual Changes**: Make small changes and test frequently

## Common Issues

### Extension Not Loading

- Check `chrome://extensions/` for error messages
- Verify `manifest.json` syntax is correct
- Ensure all file paths in manifest exist

### Styles Not Applying

- Confirm the content script is running (check console)
- Verify CSS selectors match actual website elements
- Check that `fciencias-customizer-active` class is being added to body

### Popup Not Working

- Ensure manifest includes popup configuration
- Check for JavaScript errors in popup console
- Verify content script communication is working

## Getting Started Checklist

- [ ] Load extension in Chrome developer mode
- [ ] Visit target website and verify extension loads
- [ ] Test popup toggle functionality
- [ ] Inspect website elements you want to customize
- [ ] Add your first custom CSS rule
- [ ] Test the change and verify it works
- [ ] Gradually add more customizations

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [CSS Selectors Reference](https://www.w3schools.com/cssref/css_selectors.asp)
- [Chrome DevTools Guide](https://developers.google.com/web/tools/chrome-devtools)

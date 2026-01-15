console.log("Facultad de Ciencias Customizer loaded");

let extensionEnabled = true;
let originalStyles = null;

function initializeExtension() {
	chrome.storage.sync.get(["extensionEnabled", "darkMode"], function(result) {
		extensionEnabled = result.extensionEnabled !== false; // Default to true

		if (result.darkMode) {
			console.log("Dark mode activted");
			document.body.classList.add("dark");
		}
		if (extensionEnabled) {
			console.log("Extension is enabled, applying custom styles");
			applyCustomStyles();
		} else {
			console.log("Extension is disabled");
		}
	});
}

function applyCustomStyles() {
	if (!originalStyles) {
		saveOriginalStyles();
	}

	document.body.classList.add("fciencias-customizer-active");

	// aqui va el codigo por si quiero hacer mas cosas con js
	console.log("Custom styles applied");
}

function removeCustomStyles() {
	document.body.classList.remove("fciencias-customizer-active");

	// aqui quito el codigo extra que haya puesto
	console.log("Custom styles removed");
}

// namas pa resetear el estilo si quieren apagar la extension
function saveOriginalStyles() {
	originalStyles = {
		bodyBackground: document.body.style.background || "",
	};
}

function restoreOriginalStyles() {
	if (originalStyles) {
		document.body.style.background = originalStyles.bodyBackground;
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("Message received:", request);

	switch (request.action) {
		case "toggle":
			extensionEnabled = !extensionEnabled;

			chrome.storage.sync.set({ extensionEnabled: extensionEnabled });

			if (extensionEnabled) {
				applyCustomStyles();
			} else {
				removeCustomStyles();
			}

			sendResponse({ enabled: extensionEnabled });
			break;

		case "reset":
			removeCustomStyles();
			chrome.storage.sync.clear();
			extensionEnabled = true;
			applyCustomStyles();
			sendResponse({ reset: true });
			break;

		case "getStatus":
			sendResponse({ enabled: extensionEnabled });
			break;

		case "setTheme":
			if (request.isDark) {
				document.body.classList.add("dark");
			} else {
				document.body.classList.remove("dark");
			}
			chrome.storage.sync.set({ darkMode: request.isDark });
			sendResponse({ success: true });
			break;

		default:
			console.log("Unknown action:", request.action);
			sendResponse({ error: "Unknown action" });
	}

	return true;
});

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeExtension);
} else {
	initializeExtension();
}

let lastUrl = location.href;
new MutationObserver(() => {
	const url = location.href;
	if (url !== lastUrl) {
		lastUrl = url;
		if (extensionEnabled) {
			setTimeout(applyCustomStyles, 100);
		}
	}
}).observe(document, { subtree: true, childList: true });

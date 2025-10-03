document.addEventListener("DOMContentLoaded", function () {
	console.log("Web Ciencias Customizer popup loaded");
    initializeUI();
});

function initializeUI() {
	const elements = {
		statusText: document.getElementById("status-text"),
		statusDot: document.getElementById("status-dot"),
		toggleButton: document.getElementById("toggle-btn"),
		toggleText: document.getElementById("toggle-text"),
		resetButton: document.getElementById("reset-btn"),
		warningSection: document.getElementById("warning-section"),
		githubLink: document.getElementById("github-link"),
	};

    // pa ver si el sitio es fciencias o ne
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const currentTab = tabs[0];
		const isTargetSite =
			currentTab.url && currentTab.url.includes("web.fciencias.unam.mx");

		setupInterface(elements, isTargetSite, currentTab);
		setupEventListeners(elements, isTargetSite);
	});
}

// Errores y cosas a mostrar si no es fciencias
function setupInterface(elements, isTargetSite, currentTab) {
	if (isTargetSite) {
		elements.warningSection.classList.remove("show");

		chrome.tabs.sendMessage(
			currentTab.id,
			{ action: "getStatus" },
			function (response) {
				if (chrome.runtime.lastError) {
					console.log("Content script not ready, assuming enabled");
					updateExtensionStatus(elements, true);
				} else if (response) {
					updateExtensionStatus(elements, response.enabled);
				} else {
					updateExtensionStatus(elements, true);
				}
			}
		);
	} else {
		elements.warningSection.classList.add("show");
		updateExtensionStatus(elements, false);
		elements.toggleText.textContent = "Ir al Sitio";
		elements.toggleButton.className = "btn btn-primary";
	}
}

function updateExtensionStatus(elements, enabled) {
	if (enabled) {
		elements.statusText.textContent = "Extensión activa";
		elements.statusDot.classList.remove("disabled");
		elements.toggleText.textContent = "Desactivar";
		elements.toggleButton.className = "btn btn-secondary";
	} else {
		elements.statusText.textContent = "Extensión desactivada";
		elements.statusDot.classList.add("disabled");
		elements.toggleText.textContent = "Activar";
		elements.toggleButton.className = "btn btn-primary";
	}
}

function setupEventListeners(elements, isTargetSite) {
	elements.toggleButton.addEventListener("click", function () {
		handleToggleClick(elements, isTargetSite);
	});

	elements.resetButton.addEventListener("click", function () {
		handleResetClick(elements, isTargetSite);
	});

	elements.githubLink.addEventListener("click", function (e) {
		e.preventDefault();
		chrome.tabs.create({
			url: "https://github.com/dvd-22/extension-web-ciencias/",
		});
	});
}

function handleToggleClick(elements, isTargetSite) {
	if (!isTargetSite) {
		chrome.tabs.create({ url: "https://web.fciencias.unam.mx/" });
		window.close();
		return;
	}

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: "toggle" },
			function (response) {
				if (chrome.runtime.lastError) {
					console.error(
						"Error communicating with content script:",
						chrome.runtime.lastError
					);
				} else if (response) {
					updateExtensionStatus(elements, response.enabled);
				}
			}
		);
	});
}

function handleResetClick(elements, isTargetSite) {
	if (!isTargetSite) {
		return;
	}

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: "reset" },
			function (response) {
				if (!chrome.runtime.lastError) {
					updateExtensionStatus(elements, true);
				}
			}
		);
	});
}

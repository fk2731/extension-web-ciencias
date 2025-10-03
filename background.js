console.log("Background script loaded");

chrome.runtime.onInstalled.addListener(function (details) {
	console.log("Extension installed/updated:", details.reason);

	if (details.reason === "install") {
		chrome.storage.sync.set({
			extensionEnabled: true,
			customTheme: "dark",
			version: chrome.runtime.getManifest().version,
		});
	}
});

chrome.action.onClicked.addListener(function (tab) {
	console.log("Extension icon clicked on tab:", tab.url);

	if (tab.url && tab.url.includes("web.fciencias.unam.mx")) {
		chrome.tabs.sendMessage(
			tab.id,
			{ action: "toggle" },
			function (response) {
				if (chrome.runtime.lastError) {
					console.error(
						"Error sending message:",
						chrome.runtime.lastError
					);
				} else {
					console.log("Toggle response:", response);
				}
			}
		);
	} else {
		chrome.tabs.create({ url: "https://web.fciencias.unam.mx/" });
	}
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("Background received message:", request);

	switch (request.action) {
		case "getSettings":
			chrome.storage.sync.get(null, function (settings) {
				sendResponse(settings);
			});
			return true;

		case "saveSettings":
			chrome.storage.sync.set(request.settings, function () {
				sendResponse({ success: true });
			});
			return true;

		case "openOptionsPage":
			// para cuando ponga las opciones o los temas
			// chrome.runtime.openOptionsPage();
			sendResponse({ message: "Options page not implemented yet" });
			break;

		default:
			console.log("Unknown background action:", request.action);
			sendResponse({ error: "Unknown action" });
	}
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function (tab) {
		if (tab.url && tab.url.includes("web.fciencias.unam.mx")) {
			chrome.storage.sync.get(["extensionEnabled"], function (result) {
				const enabled = result.extensionEnabled !== false;
				chrome.action.setBadgeText({
					text: enabled ? "ON" : "OFF",
					tabId: tab.id,
				});
				chrome.action.setBadgeBackgroundColor({
					color: enabled ? "#4CAF50" : "#F44336",
					tabId: tab.id,
				});
			});
		} else {
			chrome.action.setBadgeText({ text: "", tabId: tab.id });
		}
	});
});

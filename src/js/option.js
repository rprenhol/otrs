const rgx = new RegExp(
  "(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})"
);

function validateUrl(field) {
  let urlFld = field;
  let isUrl = urlFld.value.match(rgx);
  urlFld.style.border = !isUrl ? "1px solid red" : "";
  return isUrl;
}

function saveOptions(e) {
  e.preventDefault();
  let urlFld = document.getElementById("url");

  if (validateUrl(urlFld)) {
    chrome.storage.local.set(
      {
        url: urlFld.value,
      },
      function () {
        var status = document.getElementById("status");
        status.textContent = "Saved!";
        setTimeout(function () {
          status.textContent = "";
        }, 2000);
        browser.runtime.sendMessage({ action: "changePrefs" });
      }
    );
  }
}

function restoreOptions() {
  function setCurrentChoice(result) {
    url = result.url || "";
    urlFld = document.getElementById("url");
    urlFld.value = url;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  chrome.storage.local.get("url", (result) => {
    url = result.url || "";
    urlFld = document.getElementById("url");
    urlFld.value = url;
  });
}

window.onload = function () {
  let urlFld = document.getElementById("url");
  urlFld.addEventListener("change", function (e) {
    document.getElementById("submit").disabled = !validateUrl(this);
  });
  urlFld.addEventListener("input", (e) => {
    urlFld.dispatchEvent(new Event("change"));
  });
  document
    .getElementsByTagName("form")[0]
    .addEventListener("submit", saveOptions);
};
document.addEventListener("DOMContentLoaded", restoreOptions);

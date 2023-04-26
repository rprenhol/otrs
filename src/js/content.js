const inibirClickTicket = () => {
  var selecao = false;
  var mDown = false;
  var linhas = document.querySelectorAll(".MasterAction");
  var alvos = new Array();
  for (let linha of linhas) {
    let link = linha.querySelector(".MasterActionLink");
    linha.addEventListener("mousedown", (e) => {
      selecao = false;
      mDown = true;
      adicionaAlvos(e.target.parentNode.childNodes);
      adicionaAlvos([linha]);
      adicionaAlvos(linha.childNodes);
    });
    linha.addEventListener("mousemove", (e) => {
      if (mDown && !selecao) {
        selecao = true;
        adicionaClasseNoAlvo(alvos);
      }
    });
    linha.addEventListener("click", (e) => {
      if (selecao) {
        e.preventDefault();
        selecao = false;
        removeClasseDoAlvo(alvos);
        while (alvos.length > 0) {
          alvos.pop();
        }
        return false;
      }
    });
  }

  document.addEventListener("mouseup", (e) => {
    mDown = false;
  });

  const adicionaAlvos = (lista) => {
    for (let c of lista) {
      if (c.nodeType === Node.ELEMENT_NODE) {
        alvos.push(c);
      }
    }
  };

  const adicionaClasseNoAlvo = (elementos) => {
    for (let alvo of elementos) {
      if (!alvo.classList.contains("DynamicFieldLink")) {
        alvo.classList.add("DynamicFieldLink");
      }
    }
  };
  const removeClasseDoAlvo = (elementos) => {
    for (let elemento of elementos) {
      if (elemento.classList.contains("DynamicFieldLink")) {
        elemento.classList.remove("DynamicFieldLink");
      }
    }
  };
};

const enviaCtrlEnter = () => {
  // handler para combinação de teclas
  const leTeclado = (evento) => {
    if (
      (evento.altKey && evento.key === "g") ||
      (evento.ctrlKey && evento.keyCode === 13)
    ) {
      // clica em Enviar
      document.getElementById("submitRichText").click();
    }
  };
  window.addEventListener("keypress", leTeclado);
  // adiciona listener em document de iframes
  document.querySelectorAll("iframe").forEach((elemento) => {
    elemento.contentWindow.document.addEventListener("keypress", leTeclado);
  });
  // }
};

// Inicia instâncias
var urlOTRS = "atendimento.icmc.usp.br";
if (window.location.hostname.includes(urlOTRS)) {
  inibirClickTicket();
  let params = new URLSearchParams(window.location.search);

  // Composição de artigo
  if (
    params.has("Action") &&
    params.get("Action").includes("AgentTicketCompose")
  ) {
    enviaCtrlEnter();
  }
} else {
}

browser.runtime.sendMessage({ action: "getUrl" }).then((msg) => {
  if (msg.url) {
    urlOTRS = msg.url;
  }
});

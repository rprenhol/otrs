var permitido = false;

const inibirClickTicket = () => {
  var selecao = false;
  var mDown = false;
  var linhas = document.querySelectorAll(".MasterAction");
  var alvos = new Array();
  for (let linha of linhas) {
    let link = linha.querySelector(".MasterActionLink");
    linha.addEventListener("mousedown", (e) => {
      if (!permitido) {
        return false;
      }
      selecao = false;
      mDown = true;
      adicionaAlvos(e.target.parentNode.childNodes);
      adicionaAlvos([linha]);
      adicionaAlvos(linha.childNodes);
    });
    linha.addEventListener("mousemove", (e) => {
      if (!permitido) {
        return false;
      }
      if (mDown && !selecao) {
        selecao = true;
        adicionaClasseNoAlvo(alvos);
      }
    });
    linha.addEventListener("click", (e) => {
      if (!permitido) {
        return false;
      }
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
    if (!permitido) {
      return false;
    }
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

// handler para combinação de teclas
const leTeclado = (evento) => {
  if (!permitido) {
    return false;
  }

  if (
    (evento.altKey && evento.key === "g") ||
    (evento.ctrlKey && evento.keyCode === 13)
  ) {
    evento.preventDefault();
    // clica em Enviar
    document.getElementById("submitRichText").click();
  }
};

const enviaCtrlEnter = () => {
  const atributoDeVerificacao = 'listeningKeyboard';
  if (
    !String(window.location).includes("AgentTicketCompose") ||
    !String(window.parent.location).includes("AgentTicketCompose")
  ) {
    return false;
  }

  window.addEventListener("keypress", leTeclado);
  document.querySelectorAll("iframe").forEach((iframe) => {
    if(iframe.hasAttribute(atributoDeVerificacao)) {
      if(intervaloRepeticao) {
        clearInterval(intervaloRepeticao);
        iframe.removeAttribute(atributoDeVerificacao);
      }
    } else {
      iframe.contentWindow.addEventListener("keydown", leTeclado);
      iframe.setAttribute(atributoDeVerificacao,'')
    }
  });
};
// Inicia instâncias
browser.runtime.sendMessage({ action: "getUrl" }).then((msg) => {
  if (msg.url) {
    let urlOTRS = msg.url;
    permitido = String(window.location).includes(urlOTRS);
  }
});

inibirClickTicket();
// para elementos dinamicamente inseridos
var intervaloRepeticao = setInterval(() => {
  enviaCtrlEnter();
}, 1000);

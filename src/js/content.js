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
    
    let botao = document.getElementById("submitRichText");
    // clica em Enviar
    if(botao) {
      botao.click();
    }
  }
};

const enviaCtrlEnter = () => {
  const atributoDeVerificacao = 'listeningKeyboard';
  let expressao = /AgentTicket(Note|Compose)/g;

  console.debug('validou o enviaCtrlEnter');
  if (
    !String(window.location).match(expressao) ||
    !String(window.parent.location).match(expressao)
  ) {
    return false;
  }

  window.addEventListener("keypress", leTeclado);
  document.querySelectorAll("iframe").forEach((iframe) => {
    if(iframe.hasAttribute(atributoDeVerificacao)) {
      iframe.removeAttribute(atributoDeVerificacao);
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
    permitido = String(window.location).match(urlOTRS);
  }
});

inibirClickTicket();

const observer = new MutationObserver(enviaCtrlEnter);
observer.observe(document, {childList: true, subtree: true})

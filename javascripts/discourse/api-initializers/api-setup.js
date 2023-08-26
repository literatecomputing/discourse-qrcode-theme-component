import { later } from "@ember/runloop";
import { apiInitializer } from "discourse/lib/api";
import loadScript from "discourse/lib/load-script";

async function applyQrcode(element, key = "composer") {
  let qrcodes = element.querySelectorAll("pre[data-code-wrap=qrcode]");

  if (!qrcodes.length) {
    return;
  }

  await loadScript(settings.theme_uploads_local.qrcode_js);
  qrcodes.forEach((qrcode) => {
    if (qrcode.dataset.processed) {
      return;
    }

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    if (qrcode.dataset.codeHeight && key !== "composer") {
      qrcode.style.height = `${qrcode.dataset.codeHeight}px`;
    }

    later(() => {
      if (!qrcode.dataset.processed) {
        qrcode.append(spinner);
      }
    }, 2000);
  });

  qrcodes = element.querySelectorAll("pre[data-code-wrap=qrcode]");
  qrcodes.forEach(async (qrcode, index) => {
    if (qrcode.dataset.processed) {
      return;
    }
    const code = qrcode.querySelector("code");
    const qr = document.createElement("div");
    qr.classList.add("qrcode");
    const url = code.innerHTML ? code.innerHTML : window.location.href;
    new window.QRCode(qr, url);

    code.innerHTML = null;
    qrcode.dataset.processed = "true";
    qrcode.appendChild(qr);
  });
}

let messageSeq = 0;
let resolvers = {};

export default apiInitializer("0.11.1", (api) => {
  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: "insertqrcodesample",
      icon: "qrcode",
      label: themePrefix("insert_qrcode"),
    };
  });

  // this is a hack as applySurround expects a top level
  // composer key, not possible from a theme
  window.I18n.translations[
    window.I18n.locale
  ].js.composer.qrcode_text = `delete this for URL of current page`;

  api.modifyClass("controller:composer", {
    pluginId: "discourse-qrcode",
    actions: {
      insertqrcodesample() {
        this.toolbarEvent.applySurround(
          "\n```qrcode\n",
          "```\n",
          "qrcode_text",
          { multiline: false }
        );
      },
    },
  });

  if (api.decorateChatMessage) {
    api.decorateChatMessage((element) => {
      applyQrcode(element, `chat_message_${element.id}`);
    });
  }

  api.decorateCookedElement(
    async (elem, helper) => {
      const id = helper ? `post_${helper.getModel().id}` : "composer";
      applyQrcode(elem, id);
    },
    { id: "discourse-qrcode" }
  );
});

# Add QR Code

Adds a line to the composer pull-down that will insert:

    ```qrcode
    delete this for URL of current page```

and will render a QR Code. If you delete the starter text, a QRCode for the current page will be displayed; if the page changes, so will the QRCode. This means that a QRCode in a chat window will change depending on what page you were on when it was first displayed.

You can enter arbitrary text in the code block and that text will be represented in the QR code.

Uses code from https://davidshimjs.github.io/qrcodejs/.

Thanks to @falco and the [discourse-mermaid-theme-component](https://github.com/discourse/discourse-mermaid-theme-component) for inspiration and Best Practices.

Another version of this plugin exists at https://github.com/literatecomputing/discourse-qrcode-wrap-theme-component that uses `[wrap]` rather than a code block. This version is a bit cleaner, but the other allows changing the size of the QR Code and serves as an example for how to write a theme component that uses a `[wrap]` block.

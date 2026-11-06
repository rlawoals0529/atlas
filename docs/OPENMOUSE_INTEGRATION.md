# OpenMouse in Atlas

Atlas links to the official OpenMouse control panel from mouse product details and Sensitivity Lab. This is an external-tool integration: there is no embedded device driver, device discovery, support claim for a particular Atlas product, or automatic DPI synchronization.

Upstream reviewed: https://github.com/OpenMouse-Project/openmouse at commit `7a379d70fa5f59cb29e4629616028d96293ee701`.
The upstream README identifies https://control.openmouse.app/ as its public development control panel and describes Chromium/WebHID support. Its package declares AGPL-3.0-or-later. No upstream code or device database is copied into Atlas.

## Workflow

1. Open OpenMouse from Atlas.
2. Check the exact device's support and grant access in OpenMouse.
3. Make deliberate changes there.
4. Enter the resulting physical DPI into Atlas and native Drift. Atlas never assumes a successful device write.

## Possible deeper integration

A native Atlas control panel would be a separate implementation phase. Review the protocol package's own license and API at a pinned version first. Test exact USB IDs and firmware with real hardware; model-name matching is insufficient. Keep device permission user initiated, read-back separate from intended settings, and writes explicit with visible errors. Do not wire device writes into catalog filters or sensitivity previews.

Embedding or adapting upstream AGPL code needs a corresponding source and license distribution plan. An external link keeps the current integration independent while retaining OpenMouse's own support and permission flow.

# Does `…/paper.pdf#page=N` land the student on page N? (phones first)

Research date: 2026-09-22. Scope: the "Ouvrir" link built by `src/lib/pdf.ts`
(`<a href="/papers/<file>.pdf#page=N" target="_blank" rel="noopener noreferrer">`), opened in
iOS Safari, Chrome iOS, Chrome Android, Samsung Internet, Firefox Android, Edge (Android/iOS), and
for contrast desktop Chrome, Edge, Firefox, Safari. Evidence is from **primary sources only**:
browser source code (Chromium, WebKit, pdf.js), vendor bug trackers and release notes, vendor help
docs, and RFC 8118. Nothing was tested on a real device; every verdict below is a reading of the
code or docs, and says so where that is the limit.

> **Note:** No code was changed. WebSearch/WebFetch still fail in this environment (backend model
> error), so sources were read with `curl` and the GitHub API (`gh api`) against the upstream repos
> on 2026-09-22. Chromium and WebKit citations point at `main` as of that date unless a commit is named.

---

## 1. Summary

| Browser | In-browser render? | `#page=N` honoured? | Confidence | Source |
|---|---|---|---|---|
| **iOS Safari, iOS ≤ 18** | Yes (WebKit `WKPDFView`) | **Ignored → page 1.** The parser expects `#pageN`, not `#page=N` | High (code read; not device-tested) | WebKit `WKPDFView.mm` (§3.1) |
| **iOS Safari, iOS 26+** | Yes (WebKit `UnifiedPDFPlugin`) | **Honoured** | Medium-high (code + enablement commit) | WebKit `UnifiedPDFPlugin.mm`, commit 18ac5f70353d (§3.1) |
| **Chrome on iOS** | Yes (WKWebView), unless `Content-Disposition: attachment` | Same as Safari for that iOS version: **ignored ≤ 18, honoured 26+** | Medium-high | Chromium `crw_wk_navigation_handler.mm`, Apple guideline 2.5.6 (§3.2) |
| **Chrome on Android, M137+ on a supported OS** | Yes (native `androidx.pdf` viewer), on by default since **M137** | **Ignored → page 1.** Nothing in the viewer reads the URL fragment | Medium-high (absence in source; not device-tested) | Chromium `chrome/browser/ui/android/pdf/*` (§3.3) |
| **Chrome on Android, pre-M137 or unsupported OS** | **No.** Downloads, then an external app opens the file | **Lost.** The downloaded file has no fragment | Medium | Chromium commits 7c59bf9932, 4ef79bddd6 (§3.3) |
| **Samsung Internet** | **Unresolved** | **Unresolved** | None: no primary source found | §3.4 |
| **Firefox for Android 111+** | Yes (pdf.js in GeckoView) | **Honoured** | High | Firefox Android 111 notes; pdf.js `pdf_link_service.js` (§3.5) |
| **Edge on Android** | **Unresolved.** Microsoft's PDF-reader doc covers desktop only | **Unresolved** | None | §3.6 |
| **Edge on iOS** | Yes (WKWebView, required by Apple) | Presumed same as Safari: **ignored ≤ 18, honoured 26+** | Medium (inferred from guideline 2.5.6, not Edge code) | §3.6 |
| Desktop Chrome | Yes, by default (unless the "download PDFs" setting or policy is on) | **Honoured** | High | Chromium `open_pdf_params_parser.ts` (§4) |
| Desktop Edge | Yes (Windows/macOS) | **Probably honoured; unresolved.** No Microsoft source | Low-medium | Microsoft Learn "PDF reader in Microsoft Edge" (§4) |
| Desktop Firefox | Yes (pdf.js, since Firefox 19) | **Honoured** | High | pdf.js source; Firefox 19 notes (§4) |
| Desktop Safari (macOS) | Yes | **Honoured with UnifiedPDF** (macOS 15.2+ builds). Older builds: unresolved | Medium | WebKit `PlatformEnableCocoa.h` history (§4) |

**Bottom line:** For the site's real audience (phones), `#page=N` works reliably only in
**Firefox Android** and **iOS 26+** (Safari, and Chrome/Edge on iOS because they use the same
engine). On **iOS ≤ 18** and on **Chrome Android** (the two biggest groups), the student lands on
**page 1**. Samsung Internet and Edge Android are unknown. The link never breaks: it always opens the
right paper. What fails is only the jump to the page.

---

## 2. What the server sends

`curl -sI https://concours-archive.mohamed-chakroun.workers.dev/papers/mines-ponts-maths1-2019.pdf`
(the brief's example `mines-2019.pdf` does not exist; it returns **404**, because the real files are
named `mines-ponts-maths{1,2}-YYYY.pdf`, `ccinp-maths{1,2}-YYYY.pdf`, etc. in `public/papers/`):

```
HTTP/1.1 200 OK
Content-Type: application/pdf
Cache-Control: public, max-age=0, must-revalidate
Server: cloudflare
```

`ccinp-maths1-2019.pdf` returned the same. **There is no `Content-Disposition` header**, so every
browser is free to render the PDF inline. Nothing on the server pushes a download. That matters for
Chrome iOS, which refuses to render when the header says `attachment` (§3.2). The server side is
already correct and needs no change.

The fragment itself is well-formed. RFC 8118 §3 defines `page=<pageNum>` as a (physical) page where
"the first page in the document has a pageNum value of 1"
(https://www.rfc-editor.org/rfc/rfc8118.html#section-3). Adobe documents the same form:
"add #page=[ page number ] to the end of the link URL"
(https://helpx.adobe.com/acrobat/kb/link-html-pdf-page-acrobat.html). RFC 8118 describes the syntax;
it does not require any viewer to support it. Support is up to each viewer.

---

## 3. Per-browser findings (mobile)

### 3.1 iOS Safari

**iOS ≤ 18: rendered in-browser, `#page=N` ignored.**
- Until July 2025, iOS WebKit rendered PDFs with `WKPDFView` (a PDFKit `PDFHostViewController`
  wrapper). It was enabled for `PLATFORM(IOS)` and removed in WebKit commit
  [4e0dd1ff1a4c](https://github.com/WebKit/WebKit/commit/4e0dd1ff1a4c) "Remove WKPDFView" (2025-07-31).
- Its fragment handler, at the parent of that commit
  ([`Source/WebKit/UIProcess/ios/WKPDFView.mm`](https://github.com/WebKit/WebKit/blob/85b245b8d68633ad701d721174c47f9183ae5725/Source/WebKit/UIProcess/ios/WKPDFView.mm#L350-L358)):
  `if ([fragment hasPrefix:@"page"])` then
  `pageIndex = [[fragment substringFromIndex:4] integerValue] - 1;`
  It runs on load, from `pdfHostViewController:updatePageCount:` (same file, L562-565).
- For our fragment `page=5`, `substringFromIndex:4` is `"=5"`. Apple documents that `integerValue`
  "is 0 if the string doesn't begin with a valid decimal" number
  (https://developer.apple.com/documentation/foundation/nsstring/integervalue). So `pageIndex = -1`,
  the `pageIndex >= 0` guard fails, and the viewer stays on page 1.
- The same file writes page URLs back as `#page%ld` (L620), i.e. `#page5`. The legacy iOS viewer
  expected **`#pageN`**, which is not the RFC form.
- Confidence: **high** that `#page=N` is ignored on iOS ≤ 18, from code reading. Not device-tested.

**iOS 26+: rendered in-browser, `#page=N` honoured.**
- WebKit commit [18ac5f70353d](https://github.com/WebKit/WebKit/commit/18ac5f70353d) (2025-06-10):
  "UnifiedPDF is enabled-by-default on iOS 26 and visionOS 26." It gates
  `ENABLE_UNIFIED_PDF_BY_DEFAULT` on `__IPHONE_OS_VERSION_MIN_REQUIRED >= 260000`
  (current [`Source/WTF/wtf/PlatformEnableCocoa.h`](https://github.com/WebKit/WebKit/blob/main/Source/WTF/wtf/PlatformEnableCocoa.h)).
- [`UnifiedPDFPlugin::revealFragmentIfNeeded`](https://github.com/WebKit/WebKit/blob/main/Source/WebKit/WebProcess/Plugins/PDF/UnifiedPDF/UnifiedPDFPlugin.mm)
  reads the frame URL's fragment, keeps "Only respect the first fragment component", and on
  `remainderForPrefix("page="_s)` calls `revealPage(*pageNumber - 1)`. It also supports `nameddest=`.
- Caveat: it reads **only the first `&`-separated component**, so `page=N` must come first. It does
  in our href.
- Confidence: **medium-high.** The code and the commit message are clear. Not device-tested, and Apple
  ships WebKit inside the OS, so the iOS version decides.

### 3.2 Chrome on iOS (and why it matches Safari)

- Apple App Review Guideline 2.5.6: "Apps that browse the web must use the appropriate WebKit
  framework" (https://developer.apple.com/app-store/review/guidelines/#2.5.6). Alternative engines are
  possible only through EU/Japan entitlements, which do not apply to Tunisia.
- Chrome iOS decides render vs download in
  [`ios/web/navigation/crw_wk_navigation_handler.mm`](https://github.com/chromium/chromium/blob/main/ios/web/navigation/crw_wk_navigation_handler.mm)
  `shouldRenderResponse:`. It returns `NO` for `parsedContentDisposition.is_attachment()` or
  `!WKResponse.canShowMIMEType`, and otherwise lets WKWebView render. Our response has no
  `Content-Disposition` and is `application/pdf`, which WKWebView can show, so Chrome iOS renders it
  with the **system WebKit PDF viewer**. That viewer is the §3.1 code.
- Verdict: **ignored on iOS ≤ 18, honoured on iOS 26+**. Confidence medium-high.

### 3.3 Chrome on Android

**When it gained an in-browser viewer, and whether it is on by default**
- The feature flag `AndroidOpenPdfInline` (in `content/public/common/content_features.cc`) and
  `AndroidOpenPdfInlineBackport` were flipped to `FEATURE_ENABLED_BY_DEFAULT` in Chromium commit
  [7c59bf9932](https://github.com/chromium/chromium/commit/7c59bf9932) "Enable open PDF inline on
  Android on ToT", Cr-Commit-Position `#1448932`, 2025-04-18.
- Chromium Dash branch points: M136 = `1440670`, M137 = `1453031`
  (https://chromiumdash.appspot.com/fetch_milestones?only_branched=true). So the default-on ships in
  **Chrome 137** (roughly mid-2025). Before that, the viewer was behind the flag and field trials
  (`testing/variations/fieldtrial_testing_config.json` entries removed in the cleanup below), so some
  users may have had it earlier.
- The flags were later removed as fully launched: commit
  [dbbf59202c](https://github.com/chromium/chromium/commit/dbbf59202c) "Cleanup
  android-open-pdf-inline and android-open-pdf-inline-backport" (2025-12-02).
- **OS gate** (current
  [`PdfUtils.java`](https://github.com/chromium/chromium/blob/main/chrome/browser/ui/android/pdf/java/src/org/chromium/chrome/browser/pdf/PdfUtils.java)
  `shouldOpenPdfInline` → `isPlatformSupported`): Android 15 (`VANILLA_ICE_CREAM`) or later, **or**
  Android 12+ with `SdkExtensions.getExtensionVersion(S) >= 13`. The extension level comes through
  Google Play system updates, so older or unpatched phones fall outside it. **Incognito** needs a
  separate flag, `InlinePdfV2Incognito`, which is `FEATURE_DISABLED_BY_DEFAULT` in
  [`chrome_feature_list.cc`](https://github.com/chromium/chromium/blob/main/chrome/browser/flags/android/chrome_feature_list.cc).
  So in Incognito, PDFs still go down the download path.

**Is `#page=N` honoured by the inline viewer? No.**
- The viewer is `PdfCoordinator.ChromePdfViewerFragment`, a subclass of AndroidX
  `EditablePdfViewerFragment`
  ([`PdfCoordinator.java`](https://github.com/chromium/chromium/blob/main/chrome/browser/ui/android/pdf/internal/java/src/org/chromium/chrome/browser/pdf/PdfCoordinator.java)).
  Its `scrollToPage(int)` is called only from saved-state restore (`maybeRestorePosition`),
  fit-to-page/zoom, and the toolbar's `navigateToPage`. None of those take a page from the URL.
- I fetched all 20 non-test Java files under `chrome/browser/ui/android/pdf/` and grepped them for
  `getRef`, `getFragment`, `"page"`, `page=`, `#page`, `getEncodedFragment`. There were no matches
  outside AndroidX `Fragment` class usage. The Chrome Android PDF UI has no code that parses a URL
  fragment.
- Confidence: **medium-high** that it lands on page 1. This is proof by absence in source at `main`
  (2026-09-22), not a device test. A future Chromium change could add it.

**Pre-M137, or an unsupported OS: no in-browser view, fragment lost.**
- Without the inline path, Chrome Android downloads the PDF and the user opens it in another app
  (Drive's viewer, Files, a PDF app). The file on disk is passed as a `content://` URI with no URL
  fragment, so `#page=N` cannot reach the other app. For contrast: when Chrome's *own* viewer hands
  off to an editor, it passes the current page explicitly as the intent extra
  `androidx.pdf.viewer.fragment.extra.STARTING_PAGE` (`PdfCoordinator.java`,
  `createAnnotationIntent`). The fragment is never forwarded.
- Confidence: **medium.** The launch commit shows inline viewing was not the default before M137.
  I did not find a primary doc that describes the old download flow step by step.

### 3.4 Samsung Internet

- **Unresolved.** Samsung's developer release notes (https://developer.samsung.com/internet/release-note.html,
  fetched 2026-09-22) contain **no mention of PDF** at all. I found no Samsung help-centre page on PDF
  handling, and Samsung Internet's source is not public.
- Samsung Internet is Chromium-based, but Chrome's Android PDF viewer lives in `chrome/`
  (`chrome/browser/ui/android/pdf/`), not in the shared `content/` layer. Forks do not get it
  automatically. Even if Samsung ships a copy, §3.3 shows that code ignores `#page=`.
- Best guess, **not evidence**: it either downloads, or renders without honouring the fragment. Treat
  it as "page 1 at best" until someone tests it on a device.

### 3.5 Firefox for Android

**Rendered in-browser since Firefox for Android 111; `#page=N` honoured.**
- Firefox for Android 111 release notes (first offered to Release on 2023-03-14): "You can now view
  PDF documents as you browse"
  (https://www.mozilla.org/en-US/firefox/android/111.0/releasenotes/).
- Bugzilla: [1754499](https://bugzilla.mozilla.org/show_bug.cgi?id=1754499) "Load PDF web content in
  a tab using pdf.js" (fixed, 109) and
  [1815730](https://bugzilla.mozilla.org/show_bug.cgi?id=1815730) "Enable pdf.js by default in
  GeckoView for nightly and early beta" (fixed, 111).
- GeckoView uses the same pdf.js viewer app. The GECKOVIEW build is a define inside
  [`web/app.js`](https://github.com/mozilla/pdf.js/blob/master/web/app.js), not a separate viewer.
  `app.js` sets `initialBookmark: document.location.hash.substring(1)`, and `setInitialView` passes it
  to `pdfLinkService.setHash(this.initialBookmark)`. The code comment reads "Always let the browser
  history/document hash take precedence" over the document's OpenAction.
- [`web/pdf_link_service.js`](https://github.com/mozilla/pdf.js/blob/master/web/pdf_link_service.js)
  `setHash`: `if (params.has("page"))` → `pageNumber = params.get("page") | 0 || 1;`.
- Caveat: pdf.js also restores a remembered position per document (`storedHash`), but only when there
  is no hash. With `#page=N` present, the hash wins.
- Confidence: **high.**

### 3.6 Edge on Android and iOS

- **Edge Android: unresolved.** Microsoft's own doc, "PDF reader in Microsoft Edge"
  (https://learn.microsoft.com/en-us/deployedge/microsoft-edge-pdf), describes a reader that "works
  across the Windows and macOS desktop platforms". It does not mention Android. The Intune doc for
  Edge on iOS/Android
  (https://learn.microsoft.com/en-us/intune/app-management/configuration/configure-edge-ios-android)
  mentions PDFs only for Copilot access. I found no primary source on whether Edge Android renders
  PDFs inline or reads `#page=`. As with Samsung, Chrome's Android viewer would not honour it even if
  Edge inherited it.
- **Edge iOS:** bound by Apple guideline 2.5.6 to WebKit (§3.2). I did not read Edge iOS code (it is
  closed source), so "same as Safari for the iOS version" is an inference. Confidence **medium**.

---

## 4. Desktop (for contrast)

- **Chrome:** the built-in viewer parses the fragment in
  [`chrome/browser/resources/pdf/open_pdf_params_parser.ts`](https://github.com/chromium/chromium/blob/main/chrome/browser/resources/pdf/open_pdf_params_parser.ts):
  `if (urlParams.has('page'))`, clamped to `[1, pageCount]`, then "goToPage() takes a zero-based page
  index". Inline viewing is the default. The policy `AlwaysOpenPdfExternally`, supported on
  `chrome.*:55-` (desktop only), "turns the internal PDF viewer off" when enabled
  ([policy YAML](https://github.com/chromium/chromium/blob/main/components/policy/resources/templates/policy_definitions/Miscellaneous/AlwaysOpenPdfExternally.yaml)).
  Users can also flip the equivalent setting themselves. **Honoured; high.**
- **Edge:** in-browser on Windows/macOS per Microsoft Learn (link above). Microsoft documents no
  `#page=` support, and I have no Edge viewer source. Edge is Chromium-based, but its PDF reader is
  Microsoft's own, so Chromium's parser is not proof. **Probably honoured; unresolved, low-medium.**
- **Firefox:** pdf.js has been built in since Firefox 19 ("Built-in PDF viewer",
  https://www.mozilla.org/en-US/firefox/19.0/releasenotes/). Hash handling is as in §3.5.
  **Honoured; high.**
- **Safari (macOS):** `ENABLE_UNIFIED_PDF_BY_DEFAULT` applies to `PLATFORM(MAC)` builds against the
  macOS ≥ 15.2 SDK (WebKit commit [a4120ee788af](https://github.com/WebKit/WebKit/commit/a4120ee788af),
  2025-01-23). Commit [0500c8cc879a](https://github.com/WebKit/WebKit/commit/0500c8cc879a) (2025-07-30)
  extends it to macOS 15+. Those builds use the §3.1 `page=` handler: **honoured.** Older builds used
  the legacy `PDFPlugin`, which passes the fragment to private PDFKit (`setURLFragment:`, in
  [`PDFPlugin.mm`](https://github.com/WebKit/WebKit/blob/main/Source/WebKit/WebProcess/Plugins/PDF/PDFPlugin.mm)).
  Its parsing is not visible, so that case is **unresolved**.

---

## 5. Options to make the landing reliable

All are ideas only. Nothing was implemented. They are ordered from cheapest to heaviest.

1. **Show the page number in the UI next to "Ouvrir"** (e.g. "Ouvrir · p. 7").
   - Pros: works in *every* browser and in external apps, including ones that lose the fragment.
     Almost free: `pageStart` is already in the data. Keeps ADR 0001's "link out" design. No risk.
   - Cons: the student still has to scroll or type the page themselves. It is a fallback, not a
     landing.
   - **Recommended as the baseline regardless of what else is done.**

2. **Emit `#pageN` for iOS < 26 (user-agent switch).** WKPDFView (§3.1) parses `#page5` correctly.
   - Pros: fixes the largest iOS group with a one-line change in `pdfHref`, if it is chosen at runtime.
   - Cons: needs client-side UA sniffing (the site is static, so `pdfHref` runs at build time today).
     iPadOS Safari reports a macOS UA by default, so it cannot be detected reliably. **No single
     fragment works for both WebKit generations.** UnifiedPDF reads only the first component, and it
     must start with `page=`; WKPDFView reads from character 4, which is then `=`. So `#page5&page=5`
     would fix iOS ≤ 18 and Chrome/pdf.js but **break iOS 26**. It also does nothing for Chrome
     Android. Not device-tested. Low value for its fragility.

3. **Self-hosted PDF.js viewer**: link to `/pdfjs/web/viewer.html?file=/papers/<file>.pdf#page=N`.
   - Pros: the one option that honours `#page=N` on **every** browser, because pdf.js runs as the
     page's own JS (§3.5 code). That covers iOS ≤ 18, Chrome Android, Samsung Internet and Edge
     Android. It also keeps the PDF on-site: no download prompt, no external-app handoff.
     Apache-2.0 licence (https://github.com/mozilla/pdf.js/blob/master/LICENSE). Serving from the same
     origin satisfies pdf.js's `validateFileURL` check ("file origin does not match viewer's",
     `web/app.js`). Fits the Workers static-assets limits: 25 MiB per file, 20,000 files on Free
     (https://developers.cloudflare.com/workers/platform/limits/).
   - Cons: **reverses ADR 0001's "link out, no embedded viewer"**, so it needs an ADR amendment. Adds
     a vendored dependency that must be kept patched. pdf.js has had two "Arbitrary JavaScript
     execution upon opening a malicious PDF" advisories: CVE-2024-4367 (patched 4.2.67) and
     CVE-2026-16633 (patched 6.2.108)
     (https://github.com/mozilla/pdf.js/security/advisories). The risk is lower here because we serve
     only our own PDFs, but it is still upkeep. On phones, the pdf.js viewer UI is less smooth than the
     native viewers (pinch-zoom, toolbar). It adds a few MB of viewer assets to the first load, and
     the student still downloads the whole paper.

4. **Cropped per-exercise page images** (ADR 0001's "hybrid: crop popular ones later").
   - Pros: best experience on phones. Instant, no PDF viewer involved, works everywhere, and the
     pointer model already stores the page range.
   - Cons: needs a build pipeline (render pages → crop → optimise) and storage per exercise. Text is no
     longer selectable or searchable. **Licensing risk:** Mines-Ponts papers are CC BY-NC-ND 4.0 FR
     ("no modification", see `concours-paper-sources.md` §2b). Whether a crop is a "modification" is a
     legal question to settle first. The other banques state no licence at all.

5. **Split per-exercise PDFs**: already rejected in ADR 0001, and it carries the same ND-licence
   question as option 4. Listed only for completeness.

**Recommendation:** ship **option 1** now (cheap, safe, universal). If the landing matters enough to
revisit ADR 0001, **option 3** (self-hosted PDF.js) is the only option that makes `#page=N` work on
the phones that fail today. Option 4 is the long-term ideal once the licensing question is answered.

---

## 6. Unresolved

1. **Samsung Internet:** no primary source on PDF handling or `#page=`. Needs a device test (a Galaxy
   phone on current Samsung Internet).
2. **Edge Android:** Microsoft documents a PDF reader for Windows/macOS only. Inline rendering and
   `#page=` on Android are unknown. Needs a device test.
3. **Desktop Edge `#page=`:** no Microsoft doc and no source for Edge's own PDF reader. Very likely
   honoured, but unproven. A one-minute manual check would settle it.
4. **Chrome Android verdict is proof-by-absence** in source at `main`. A device test on Android 15 +
   Chrome ≥ 137 would confirm it. Tracking a crbug for "support #page= in Android inline PDF" was not
   possible: issues.chromium.org is not readable without JS here.
5. **Old macOS Safari (legacy PDFKit plugin):** the fragment goes to a private PDFKit API, and its
   parsing cannot be inspected.
6. **Audience iOS split:** how many students are on iOS ≤ 18 vs 26+ (which decides how much of iOS
   fails today) needs the site's own analytics. Apple's public adoption figures were not retrievable
   here.
7. **No verdict here was checked on a real phone.** Before acting on option 2 or 3, test at least one
   iOS 18 and one Android 15/Chrome device against the live link.

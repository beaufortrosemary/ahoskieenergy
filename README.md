# Ahoskie Energy website

Static site for ahoskieenergy.com. It is a sister site to bethuneenergy.com and is built, hosted, and edited exactly the same way: Netlify hosts the site and deploys it automatically from this GitHub repository, the contact form uses Netlify Forms, and the newsroom is data driven. News entries live in `news/news.json`, PDFs live in `downloads/press/`, and `js/news.js` renders the list on the home page and on `news.html`. Editors update the newsroom through Pages CMS (pagescms.org), a friendly editing layer on top of this repository. There is no build step; the repository is served as-is.

## Site map

| File | Purpose |
| --- | --- |
| `index.html` | Home page: hero, stat strip, project overview, commitments, latest news |
| `faq.html` | Frequently asked questions, plus a download box for the printable FAQ PDF |
| `news.html` | Full newsroom list (rendered from `news/news.json`) |
| `contact.html` | Contact details and the Netlify Forms contact form |
| `thanks.html` | Confirmation page after a form submission |
| `privacy.html` | Privacy notice for the contact form |
| `404.html` | Not-found page (Netlify serves it automatically) |
| `styles.css` | All styling. Same palette and type as bethuneenergy.com |
| `js/news.js` | Newsroom renderer |
| `news/news.json` | Newsroom data |
| `.pages.yml` | Pages CMS configuration (News editor and the PDF media library) |
| `_redirects` | Netlify redirects (`/admin` shortcut to the Pages CMS editor) |
| `downloads/ahoskie-energy-faq.pdf` | Printable FAQ, linked from `faq.html`. Regenerate it when `faq.html` changes (see below) |
| `downloads/press/` | Press release PDFs uploaded through Pages CMS |
| `og-image.jpg`, `favicon*`, `apple-touch-icon.png` | Social preview image and icons |

`CONTENT.md` records where each project fact lives on the site and the few items still open (photography, the info@ mailbox).

## One-time setup

1. GitHub repository.
   - This repository is `beaufortrosemary/ahoskieenergy`. Merge the site into the `main` branch.
2. Create the Netlify site and connect the repository.
   - In Netlify (team `nicolas-pratt`), the project is named `ahoskie-energy`. Open it, go to Site configuration, then Build & deploy, then Continuous deployment, and link the `beaufortrosemary/ahoskieenergy` GitHub repository with `main` as the production branch.
   - Leave the build command empty and set the publish directory to the repository root (`/`). The site is served as-is, so there is no build step.
   - Under Forms, make sure form detection is enabled so the contact form on `contact.html` is picked up (it is already on for this project). Add a notification email under Forms, then Form notifications, so submissions reach the project team.
   - Under Domain management, add `ahoskieenergy.com` and `www.ahoskieenergy.com` as custom domains and point the domain's DNS at Netlify (either Netlify DNS or an A/ALIAS record plus a `www` CNAME, as Netlify instructs). Netlify provisions HTTPS automatically. From then on, every push to `main` deploys automatically, usually within a minute or two.
3. Connect the repository to Pages CMS.
   - Go to pagescms.org and sign in with GitHub.
   - Authorize Pages CMS for the `ahoskieenergy` repository and open it. The `.pages.yml` file in this repository defines the News editor and the PDF media library (`downloads/press/`).
   - The `/admin` shortcut in `_redirects` points at `https://app.pagescms.org/beaufortrosemary/ahoskieenergy/main/file/news`. If the address Pages CMS shows in the browser is different, update `_redirects` to match.
4. Invite the editor.
   - In Pages CMS, open this project and invite the editor by email address. They receive a passwordless magic-link login and can edit the newsroom without a GitHub account. (Per-user permissions for email-invited editors are limited for now, so they get broad edit access to the project's content, which is fine here.)
   - Alternative: add them as a GitHub collaborator with the Write role under the repo's Settings, then Collaborators. They then sign in to Pages CMS with their own GitHub account.

## How an editor adds a news item

1. Open ahoskieenergy.com/admin (or the Pages CMS link) and sign in.
2. Open the News entry and click Add item under News items.
3. Fill in the date, category, title, and summary.
4. Choose the link type and add the link:
   - **PDF file** (the usual case): in the **PDF file** field, click and upload the PDF. It is stored in `downloads/press/` automatically, so there are no paths to type.
   - **Link to another website**: leave the PDF field empty and paste the full address, starting with `https`, into the **Website link** field.
5. Save. Pages CMS commits the change to the repository, and Netlify redeploys the site within a minute or two.

## The news.json entry format

To publish something yourself without Pages CMS, edit `news/news.json` directly and add the PDF to `downloads/press/`. The entry format:

```json
{
  "published": true,
  "date": "2026-09-15",
  "category": "Press release",
  "title": "Headline here",
  "summary": "One or two sentences.",
  "link_type": "pdf",
  "url": "downloads/press/2026-09-15-headline-here.pdf"
}
```

For an external story, set `link_type` to `external`, leave `url` empty, and put the full address in an `external_url` field:

```json
{
  "published": true,
  "date": "2026-09-15",
  "category": "In the news",
  "title": "Headline here",
  "summary": "One or two sentences.",
  "link_type": "external",
  "external_url": "https://www.example.com/story"
}
```

The site shows "See the story" for external items and "Download PDF" for uploads. Set `published` to `false` to keep an item as a hidden draft.

## Fixing or removing a published item

Edit `news/news.json`: correct the fields, or delete the entry's block, and commit. Remove the PDF from `downloads/press/` if it should not remain available.

## Previewing locally

There is nothing to install. From the repository folder run:

```
python3 -m http.server 8000
```

and open http://localhost:8000. (Opening `index.html` straight from the file system also works, except the newsroom list, which needs a web server to load `news/news.json`.)

## Notes

- `news/news.json` launches empty (`{ "items": [] }`), so the newsroom shows "No announcements have been posted yet." until the first item is added.
- If every item is removed, the newsroom simply shows "No announcements have been posted yet." An empty or `{ "items": [] }` file is handled gracefully.
- Category options live in `.pages.yml` (the News editor). The site itself renders whatever category string an entry carries.
- The two home page photos in `images/` are Adobe Stock comps (watermarked previews). Replace them with the licensed downloads under the same filenames; see `CONTENT.md` for the asset numbers. Keep roughly a 2:1 aspect ratio, 1800px wide is plenty.
- The printable FAQ PDF is generated from the FAQ page content. To regenerate it after editing `faq.html`, print `faq.html` to PDF from a browser (Letter size) and save it as `downloads/ahoskie-energy-faq.pdf`, or ask for it to be regenerated.

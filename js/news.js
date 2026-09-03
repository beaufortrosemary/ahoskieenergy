/* Ahoskie Energy newsroom renderer.
   Reads news/news.json and fills #news-latest (home, three most recent)
   and #news-all (news.html, everything). */

(function () {
  "use strict";

  var MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  function formatDate(iso) {
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    return MONTHS[parseInt(p[1], 10) - 1] + " " + parseInt(p[2], 10) + ", " + p[0];
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderRow(item, showSummary) {
    var row = el("div", "news-row");

    var href = (item.link_type === "external" && item.external_url)
      ? item.external_url : item.url;

    var left = el("div", "news-date");
    left.appendChild(el("span", null, formatDate(item.date)));
    left.appendChild(el("span", "news-tag", item.category));
    row.appendChild(left);

    var body = el("div");
    var h3 = el("h3");
    var titleLink = el("a", null, item.title);
    titleLink.href = href;
    titleLink.target = "_blank";
    titleLink.rel = "noopener";
    h3.appendChild(titleLink);
    body.appendChild(h3);

    if (showSummary && item.summary) {
      body.appendChild(el("p", null, item.summary));
    }

    var links = el("div", "news-links");
    var action = el("a", null,
      item.link_type === "external" ? "See the story" : "Download PDF");
    action.href = href;
    action.target = "_blank";
    action.rel = "noopener";
    links.appendChild(action);
    body.appendChild(links);

    row.appendChild(body);
    return row;
  }

  function renderInto(target, items, limit, showSummary) {
    var container = document.getElementById(target);
    if (!container) return;
    container.textContent = "";
    var list = limit ? items.slice(0, limit) : items;
    if (list.length === 0) {
      container.appendChild(el("p", "news-empty",
        "No announcements have been posted yet. Check back soon."));
      return;
    }
    list.forEach(function (item) {
      container.appendChild(renderRow(item, showSummary));
    });
  }

  fetch("news/news.json", { cache: "no-cache" })
    .then(function (res) { return res.text(); })
    .then(function (text) {
      // An empty or blank file (for example after every item is removed
      // in the CMS) is treated as "no items" rather than an error.
      var data = {};
      if (text && text.trim()) data = JSON.parse(text);
      // Items switched OFF (published: false) in the CMS are hidden
      // from the public site. Items without the flag are shown.
      var items = (data.items || []).filter(function (item) {
        return item.published !== false;
      }).sort(function (a, b) {
        return a.date < b.date ? 1 : -1;
      });
      renderInto("news-latest", items, 3, true);
      renderInto("news-all", items, 0, true);
    })
    .catch(function () {
      var fallback = document.getElementById("news-latest") ||
        document.getElementById("news-all");
      if (fallback) {
        fallback.textContent = "";
        fallback.appendChild(el("p", "news-empty",
          "The news list could not be loaded. Please refresh the page."));
      }
    });
})();

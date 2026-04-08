(function () {
  function normalize(text) {
    return (text || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function escapeHtml(text) {
    return (text || "")
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isExternalHref(href) {
    return /^(https?:)?\/\//.test(href || "") || (href || "").startsWith("mailto:");
  }

  function withRootRelative(rootRelative, href) {
    if (!href || isExternalHref(href) || href.startsWith("#") || href.startsWith("./") || href.startsWith("../")) {
      return href;
    }

    const prefix = (rootRelative || ".").replace(/\/$/, "");
    return prefix === "." ? href : prefix + "/" + href;
  }

  function getContainer(containerId, fallbackSelector) {
    return document.getElementById(containerId) || (fallbackSelector ? document.querySelector(fallbackSelector) : null);
  }

  function renderAction(action, options) {
    const rootRelative = options && options.rootRelative;
    const href = rootRelative ? withRootRelative(rootRelative, action.href) : action.href;
    const className = escapeHtml(action.className || "btn btn-outline-secondary btn-sm");
    const iconHtml = action.icon ? '<i class="bi ' + escapeHtml(action.icon) + ' me-1"></i>' : "";
    const label = escapeHtml(action.label || "");
    const isBadgeLike = className.includes("badge");

    if (!href) {
      if (isBadgeLike) {
        return '<span class="' + className + '">' + iconHtml + label + "</span>";
      }

      return '<button class="' + className + '" type="button" disabled>' + iconHtml + label + "</button>";
    }

    const openInNewTab = action.newTab !== undefined ? !!action.newTab : isExternalHref(href);
    const attrs = openInNewTab ? ' target="_blank" rel="noopener"' : "";
    return '<a href="' + escapeHtml(href) + '" class="' + className + '"' + attrs + ">" + iconHtml + label + "</a>";
  }

  function renderSiteNav(config) {
    const data = window.PortalData && window.PortalData.site;
    const container = getContainer((config && config.containerId) || "site-nav");

    if (!data || !container) {
      return null;
    }

    const rootRelative = (config && config.rootRelative) || ".";
    const currentKey = config && config.currentKey;
    const collapseId = (config && config.collapseId) || "navTop";
    const navLinks = data.navItems.map(function (item) {
      const isActive = item.key === currentKey;
      const activeClass = isActive ? " active" : "";
      const activeAttr = isActive ? ' aria-current="page"' : "";
      return '<li class="nav-item"><a class="nav-link' + activeClass + '" href="' + escapeHtml(withRootRelative(rootRelative, item.href)) + '"' + activeAttr + '><i class="bi ' + escapeHtml(item.icon) + ' me-1"></i>' + escapeHtml(item.label) + "</a></li>";
    }).join("");

    container.innerHTML = [
      '<nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top">',
      '  <div class="container">',
      '    <a class="navbar-brand fw-semibold" href="' + escapeHtml(withRootRelative(rootRelative, "index.html")) + '">',
      '      <i class="bi bi-grid-1x2-fill me-2"></i>Portal do Professor',
      "    </a>",
      '    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#' + escapeHtml(collapseId) + '" aria-controls="' + escapeHtml(collapseId) + '" aria-expanded="false" aria-label="Alternar navegação">',
      '      <span class="navbar-toggler-icon"></span>',
      "    </button>",
      '    <div class="collapse navbar-collapse" id="' + escapeHtml(collapseId) + '">',
      '      <ul class="navbar-nav ms-auto gap-1">',
      navLinks,
      "      </ul>",
      "    </div>",
      "  </div>",
      "</nav>"
    ].join("");

    return container;
  }

  function renderFooter(config) {
    const data = window.PortalData && window.PortalData.site;
    const container = getContainer((config && config.containerId) || "site-footer");

    if (!data || !container) {
      return null;
    }

    const rootRelative = (config && config.rootRelative) || ".";
    const showHomeLink = !!(config && config.showHomeLink);
    const homeLink = showHomeLink
      ? '<a class="text-muted small text-decoration-none" href="' + escapeHtml(withRootRelative(rootRelative, "index.html")) + '"><i class="bi bi-grid-1x2-fill me-1"></i>Voltar ao portal</a>'
      : "";
    const footerLinks = data.footerLinks.map(function (link) {
      return '<a class="text-muted small text-decoration-none" href="' + escapeHtml(link.href) + '" target="_blank" rel="noopener">' + escapeHtml(link.label) + "</a>";
    }).join('<span class="text-muted small">|</span>');

    container.innerHTML = [
      '<footer class="border-top bg-white">',
      '  <div class="container py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">',
      '    <div class="text-muted small">© ' + escapeHtml(data.owner) + "</div>",
      '    <div class="d-flex flex-wrap align-items-center gap-2">',
      showHomeLink ? homeLink : "",
      showHomeLink ? '<span class="text-muted small">|</span>' : "",
      '<span class="text-muted small"><i class="bi bi-envelope me-1"></i>Email: ' + escapeHtml(data.emailLabel) + "</span>",
      '<span class="text-muted small">|</span>',
      footerLinks,
      "    </div>",
      "  </div>",
      "</footer>"
    ].filter(Boolean).join("");

    return container;
  }

  function renderFeatureCard(card, rootRelative) {
    return [
      '<div class="col-12 col-md-6 col-xl-4">',
      '  <a class="text-decoration-none" href="' + escapeHtml(withRootRelative(rootRelative, card.href)) + '">',
      '    <div class="card card-hover h-100 border-0 rounded-4">',
      '      <div class="card-body">',
      '        <div class="d-flex align-items-center gap-3 mb-2">',
      '          <span class="' + escapeHtml(card.pillClass) + '"><i class="bi ' + escapeHtml(card.icon) + ' fs-5"></i></span>',
      '          <div class="fw-semibold">' + escapeHtml(card.title) + "</div>",
      "        </div>",
      '        <div class="text-muted small">' + escapeHtml(card.description) + "</div>",
      "      </div>",
      '      <div class="card-footer bg-white border-0 pt-0">',
      '        <span class="' + escapeHtml(card.buttonClass) + '">Abrir <i class="bi bi-arrow-right ms-1"></i></span>',
      "      </div>",
      "    </div>",
      "  </a>",
      "</div>"
    ].join("");
  }

  function renderHomePage(config) {
    const data = window.PortalData && window.PortalData.site && window.PortalData.site.home;
    const site = window.PortalData && window.PortalData.site;
    const heroContainer = getContainer((config && config.heroContainerId) || "home-hero");
    const mainContainer = getContainer((config && config.mainContainerId) || "home-main");
    const rootRelative = (config && config.rootRelative) || ".";

    if (!data || !site || !heroContainer || !mainContainer) {
      return null;
    }

    renderSiteNav({ rootRelative: rootRelative, currentKey: null, containerId: (config && config.navContainerId) || "site-nav" });
    renderFooter({ rootRelative: rootRelative, containerId: (config && config.footerContainerId) || "site-footer" });

    heroContainer.innerHTML = [
      '<div class="row align-items-center g-4">',
      '  <div class="col-12 col-lg-7">',
      '    <h1 class="display-6 fw-semibold mb-2">' + escapeHtml(data.title) + "</h1>",
      '    <p class="text-muted mb-0">' + escapeHtml(data.subtitle) + "</p>",
      "  </div>",
      '  <div class="col-12 col-lg-5">',
      '    <div class="bg-white border rounded-4 p-3">',
      '      <div class="d-flex align-items-center gap-3">',
      '        <div class="icon-pill text-primary"><i class="bi ' + escapeHtml(data.highlight.icon) + ' fs-5"></i></div>',
      "        <div>",
      '          <div class="fw-semibold">' + escapeHtml(data.highlight.title) + "</div>",
      '          <div class="text-muted small">' + escapeHtml(data.highlight.text) + "</div>",
      "        </div>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");

    mainContainer.innerHTML = '<div class="row g-3">' + data.cards.map(function (card) {
      return renderFeatureCard(card, rootRelative);
    }).join("") + "</div>";

    return { heroContainer: heroContainer, mainContainer: mainContainer };
  }

  function renderLegacyCard(card, rootRelative) {
    return [
      '<div class="col-12 col-md-6">',
      '  <div class="card card-hover h-100 border-0 rounded-4">',
      '    <div class="card-body">',
      '      <div class="d-flex align-items-center justify-content-between gap-3 mb-2">',
      '        <div class="d-flex align-items-center gap-3">',
      '          <span class="icon-pill text-secondary"><i class="bi ' + escapeHtml(card.icon) + ' fs-5"></i></span>',
      '          <div class="fw-semibold">' + escapeHtml(card.title) + "</div>",
      "        </div>",
      '        <span class="badge ' + escapeHtml(card.badgeClass) + '">' + escapeHtml(card.badge) + "</span>",
      "      </div>",
      '      <div class="text-muted small">' + escapeHtml(card.description) + "</div>",
      '      <div class="mt-3"><a class="' + escapeHtml(card.buttonClass) + '" href="' + escapeHtml(withRootRelative(rootRelative, card.href)) + '"><i class="bi bi-arrow-right me-1"></i>Abrir</a></div>',
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderLegacyPage(config) {
    const site = window.PortalData && window.PortalData.site;
    const data = site && site.legacy;
    const headerTitle = getContainer((config && config.titleContainerId) || "legacy-title");
    const headerSubtitle = getContainer((config && config.subtitleContainerId) || "legacy-subtitle");
    const mainContainer = getContainer((config && config.mainContainerId) || "legacy-main");
    const rootRelative = (config && config.rootRelative) || "..";

    if (!data || !headerTitle || !headerSubtitle || !mainContainer) {
      return null;
    }

    renderSiteNav({ rootRelative: rootRelative, currentKey: null, containerId: (config && config.navContainerId) || "site-nav" });
    renderFooter({
      rootRelative: rootRelative,
      containerId: (config && config.footerContainerId) || "site-footer",
      showHomeLink: true
    });

    headerTitle.innerHTML = '<i class="bi bi-archive me-2"></i>' + escapeHtml(data.title);
    headerSubtitle.textContent = data.subtitle;
    mainContainer.innerHTML = [
      '<div class="row g-3">',
      data.cards.map(function (card) { return renderLegacyCard(card, rootRelative); }).join(""),
      "</div>",
      '<div class="alert alert-light border rounded-4 mt-4 mb-0">' + escapeHtml(data.note) + "</div>"
    ].join("");

    return { mainContainer: mainContainer };
  }

  function renderCollectionCard(item, rootRelative, columnClass) {
    const titleHtml = item.icon
      ? '<div class="fw-semibold"><i class="bi ' + escapeHtml(item.icon) + ' me-2"></i>' + escapeHtml(item.title) + "</div>"
      : '<div class="fw-semibold">' + escapeHtml(item.title) + "</div>";
    const badgeHtml = item.badge
      ? '<span class="' + escapeHtml(item.badge.className) + '">' + escapeHtml(item.badge.label) + "</span>"
      : "";
    const actionsHtml = (item.actions || []).map(function (action) {
      return renderAction(action, { rootRelative: rootRelative });
    }).join("");
    const tags = item.tags && item.tags.length ? ' data-tags="' + escapeHtml(item.tags.join(" ")) + '"' : "";

    return [
      '<div class="' + escapeHtml(columnClass) + '">',
      '  <div class="section-item card card-hover border-0 rounded-4" data-search="' + escapeHtml(item.search || item.title) + '"' + tags + '>',
      '    <div class="card-body">',
      '      <div class="d-flex align-items-center justify-content-between gap-3">',
      titleHtml,
      badgeHtml,
      "      </div>",
      '      <p class="text-muted mt-2 mb-3">' + escapeHtml(item.description || "") + "</p>",
      actionsHtml ? '      <div class="d-flex flex-wrap gap-2">' + actionsHtml + "</div>" : "",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderCollectionPage(config) {
    const sections = window.PortalData && window.PortalData.sections;
    const section = sections && sections[config.sectionKey];
    const rootRelative = (config && config.rootRelative) || "..";
    const headerTitle = getContainer((config && config.titleContainerId) || "section-title");
    const headerSubtitle = getContainer((config && config.subtitleContainerId) || "section-subtitle");
    const mainContainer = getContainer((config && config.mainContainerId) || "section-content");

    if (!section || !headerTitle || !headerSubtitle || !mainContainer) {
      return null;
    }

    const idPrefix = (config && config.idPrefix) || section.key.replace(/[^a-z0-9]/gi, "");
    const searchInputId = idPrefix + "Search";
    const clearButtonId = idPrefix + "Clear";
    const gridId = idPrefix + "Grid";
    const hasTags = !!(section.tags && section.tags.length);
    const tagsId = idPrefix + "Tags";
    const columnClass = section.columnClass || "col-12 col-lg-6";

    renderSiteNav({
      rootRelative: rootRelative,
      currentKey: section.key,
      containerId: (config && config.navContainerId) || "site-nav"
    });

    renderFooter({
      rootRelative: rootRelative,
      containerId: (config && config.footerContainerId) || "site-footer",
      showHomeLink: true
    });

    headerTitle.innerHTML = '<i class="bi ' + escapeHtml(section.icon) + ' me-2"></i>' + escapeHtml(section.title);
    headerSubtitle.textContent = section.description || "";

    mainContainer.innerHTML = [
      '<div class="row g-2 align-items-center mb-3">',
      '  <div class="col-12 col-md-7">',
      '    <div class="input-group">',
      '      <span class="input-group-text"><i class="bi bi-search"></i></span>',
      '      <input id="' + escapeHtml(searchInputId) + '" type="text" class="form-control" placeholder="' + escapeHtml(section.searchPlaceholder || "Buscar") + '">',
      '      <button id="' + escapeHtml(clearButtonId) + '" class="btn btn-outline-secondary" type="button" title="Limpar busca"><i class="bi bi-x-lg"></i></button>',
      "    </div>",
      '    <div class="form-text">A busca filtra os cards abaixo.</div>',
      "  </div>",
      hasTags
        ? '  <div id="' + escapeHtml(tagsId) + '" class="col-12 col-md-5 d-flex flex-wrap gap-2 justify-content-md-end">' + section.tags.map(function (tag) {
          const iconHtml = tag.icon ? '<i class="bi ' + escapeHtml(tag.icon) + ' me-1"></i>' : "";
          return '<span class="' + escapeHtml(tag.className) + '" data-tag="' + escapeHtml(tag.key) + '">' + iconHtml + escapeHtml(tag.label) + "</span>";
        }).join("") + "</div>"
        : "",
      "</div>",
      '<div class="row g-3" id="' + escapeHtml(gridId) + '">',
      section.items.map(function (item) {
        return renderCollectionCard(item, rootRelative, columnClass);
      }).join(""),
      "</div>"
    ].filter(Boolean).join("");

    if (hasTags) {
      setupTagFilterGrid({
        searchInputId: searchInputId,
        clearButtonId: clearButtonId,
        itemSelector: "#" + gridId + " .section-item",
        tagSelector: "#" + tagsId + " .tag"
      });
    } else {
      setupSearchGrid({
        searchInputId: searchInputId,
        clearButtonId: clearButtonId,
        itemSelector: "#" + gridId + " .section-item",
        hideTarget: "parent"
      });
    }

    return { mainContainer: mainContainer };
  }

  function renderLegendBadge(item) {
    const iconHtml = item.icon ? '<i class="bi ' + escapeHtml(item.icon) + ' me-1"></i>' : "";
    return '<span class="' + escapeHtml(item.className) + '">' + iconHtml + escapeHtml(item.label) + "</span>";
  }

  function renderInlineMeta(item) {
    const parts = [];

    if (item.inlineActions && item.inlineActions.length) {
      item.inlineActions.forEach(function (action) {
        parts.push(renderAction(action));
      });
    }

    if (item.metaText && item.metaText.length) {
      item.metaText.forEach(function (text) {
        parts.push('<span class="text-muted">' + escapeHtml(text) + "</span>");
      });
    }

    if (!parts.length) {
      return "";
    }

    return '<div class="small mt-1 d-flex flex-wrap gap-2 align-items-center">' + parts.join("") + "</div>";
  }

  function renderCourseItem(item, extraClass) {
    const badgeHtml = '<span class="badge ' + escapeHtml(item.badge.className) + '">' + escapeHtml(item.badge.label) + "</span>";
    const descriptionHtml = item.description ? '<div class="text-muted small mt-1">' + escapeHtml(item.description) + "</div>" : "";
    const metaHtml = renderInlineMeta(item);
    const actions = (item.actions || []).map(function (action) {
      return renderAction(action);
    }).join("");
    const searchText = item.search || [item.badge.label, item.title, item.description || ""].join(" ");
    const spacingClass = extraClass ? " " + extraClass : "";

    return [
      '<div class="course-item d-flex flex-wrap align-items-center justify-content-between gap-3 border rounded p-3 bg-white' + spacingClass + '" data-search="' + escapeHtml(searchText) + '">',
      '  <div class="course-item-body d-flex align-items-start gap-3">',
      badgeHtml,
      "    <div>",
      '      <div class="fw-semibold">' + escapeHtml(item.title) + "</div>",
      descriptionHtml,
      metaHtml,
      "    </div>",
      "  </div>",
      '  <div class="course-item-actions d-flex flex-wrap gap-2 justify-content-end">',
      actions,
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderCourseModule(module, prefix, accordionId, index) {
    const headingId = prefix + "Head" + (index + 1);
    const collapseId = prefix + "Mod" + (index + 1);
    const expanded = module.open ? "true" : "false";
    const showClass = module.open ? " show" : "";
    const collapsedClass = module.open ? "" : " collapsed";
    const moduleClass = module.className ? " " + module.className : "";
    const itemsHtml = module.items.map(function (item, itemIndex) {
      const spacingClass = itemIndex === module.items.length - 1 ? "" : "mb-2";
      return renderCourseItem(item, spacingClass);
    }).join("");

    return [
      '<div class="accordion-item course-module' + escapeHtml(moduleClass) + '">',
      '  <h2 class="accordion-header" id="' + escapeHtml(headingId) + '">',
      '    <button class="accordion-button course-module-button' + collapsedClass + '" type="button" data-bs-toggle="collapse" data-bs-target="#' + escapeHtml(collapseId) + '" aria-expanded="' + expanded + '" aria-controls="' + escapeHtml(collapseId) + '">',
      '      <i class="bi ' + escapeHtml(module.icon) + ' me-2"></i>' + escapeHtml(module.title),
      "    </button>",
      "  </h2>",
      '  <div id="' + escapeHtml(collapseId) + '" class="accordion-collapse collapse' + showClass + '" aria-labelledby="' + escapeHtml(headingId) + '" data-bs-parent="#' + escapeHtml(accordionId) + '">',
      '    <div class="accordion-body">',
      itemsHtml,
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderLeadCard(card) {
    if (!card) {
      return "";
    }

    return [
      '<section class="my-5">',
      '  <div class="row justify-content-center">',
      '    <div class="col-md-8 col-lg-6">',
      '      <div class="card shadow border-0 rounded-4 overflow-hidden">',
      '        <div class="row g-0 align-items-center">',
      '          <div class="col-md-5 text-center p-4 bg-light">',
      '            <a href="' + escapeHtml(card.imageHref) + '" target="_blank" rel="noopener">',
      '              <img src="' + escapeHtml(card.imageSrc) + '" class="img-fluid rounded shadow-sm portal-book-cover" alt="' + escapeHtml(card.imageAlt) + '">',
      "            </a>",
      "          </div>",
      '          <div class="col-md-7">',
      '            <div class="card-body p-4">',
      '              <h4 class="card-title fw-bold mb-3">' + escapeHtml(card.title) + "</h4>",
      '              <p class="card-text text-muted">' + escapeHtml(card.text) + "</p>",
      '              <div class="mt-3">' + renderAction(card.action) + "</div>",
      "            </div>",
      "          </div>",
      "        </div>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</section>"
    ].join("");
  }

  function renderCoursePage(config) {
    const course = window.PortalData && window.PortalData.courses && window.PortalData.courses[config.courseKey];
    const rootRelative = (config && config.rootRelative) || "..";
    const navContainerId = (config && config.navContainerId) || "site-nav";
    const heroContainer = getContainer((config && config.heroContainerId) || "course-hero");
    const mainContainer = getContainer((config && config.mainContainerId) || "course-content");

    if (!course || !heroContainer || !mainContainer) {
      return null;
    }

    const accordionId = course.prefix + "Accordion";
    const searchInputId = course.prefix + "Search";
    const clearButtonId = course.prefix + "Clear";
    const expandButtonId = course.prefix + "ExpandAll";
    const collapseButtonId = course.prefix + "CollapseAll";
    const controlClass = "btn btn-outline-" + escapeHtml(course.theme) + "";

    renderSiteNav({
      rootRelative: rootRelative,
      currentKey: course.key,
      containerId: navContainerId
    });

    renderFooter({
      rootRelative: rootRelative,
      containerId: (config && config.footerContainerId) || "site-footer",
      showHomeLink: true
    });

    heroContainer.innerHTML = [
      '<div class="d-flex flex-wrap align-items-center justify-content-between gap-3">',
      '  <div>',
      '    <h1 class="h3 mb-1"><i class="bi ' + escapeHtml(course.icon) + ' me-2"></i>' + escapeHtml(course.title) + "</h1>",
      course.description ? '    <div class="text-muted">' + escapeHtml(course.description) + "</div>" : "",
      course.heroActions && course.heroActions.length
        ? '    <div class="d-flex flex-wrap gap-2 mt-2">' + course.heroActions.map(function (action) { return renderAction(action); }).join("") + "</div>"
        : "",
      "  </div>",
      course.legend && course.legend.length
        ? '  <div class="d-flex flex-wrap gap-2">' + course.legend.map(renderLegendBadge).join("") + "</div>"
        : "",
      "</div>"
    ].join("");

    mainContainer.innerHTML = [
      renderLeadCard(course.leadCard),
      '<div class="row g-2 align-items-center mb-3">',
      '  <div class="col-12 col-md-6">',
      '    <div class="input-group">',
      '      <span class="input-group-text"><i class="bi bi-search"></i></span>',
      '      <input id="' + escapeHtml(searchInputId) + '" type="text" class="form-control" placeholder="' + escapeHtml(course.searchPlaceholder) + '">',
      '      <button id="' + escapeHtml(clearButtonId) + '" class="btn btn-outline-secondary" type="button" title="Limpar busca"><i class="bi bi-x-lg"></i></button>',
      "    </div>",
      '    <div class="form-text">A busca filtra aulas e expande automaticamente o módulo correspondente.</div>',
      "  </div>",
      '  <div class="col-12 col-md-6 d-flex gap-2 justify-content-md-end">',
      '    <button id="' + escapeHtml(expandButtonId) + '" class="' + controlClass + '" type="button"><i class="bi bi-arrows-expand me-1"></i> Expandir tudo</button>',
      '    <button id="' + escapeHtml(collapseButtonId) + '" class="' + controlClass + '" type="button"><i class="bi bi-arrows-collapse me-1"></i> Recolher tudo</button>',
      "  </div>",
      "</div>",
      '<div class="accordion" id="' + escapeHtml(accordionId) + '">',
      course.modules.map(function (module, index) { return renderCourseModule(module, course.prefix, accordionId, index); }).join(""),
      "</div>"
    ].join("");

    setupSearchableAccordion({
      accordionSelector: "#" + accordionId,
      itemSelector: ".course-item",
      moduleSelector: ".course-module",
      searchInputId: searchInputId,
      clearButtonId: clearButtonId,
      expandButtonId: expandButtonId,
      collapseButtonId: collapseButtonId
    });

    return { heroContainer: heroContainer, mainContainer: mainContainer };
  }

  function setupSearchableAccordion(config) {
    const searchInput = document.getElementById(config.searchInputId);
    const clearBtn = document.getElementById(config.clearButtonId);
    const expandAllBtn = document.getElementById(config.expandButtonId);
    const collapseAllBtn = document.getElementById(config.collapseButtonId);
    const accordion = document.querySelector(config.accordionSelector);

    if (!searchInput || !clearBtn || !expandAllBtn || !collapseAllBtn || !accordion) {
      return null;
    }

    const itemSelector = config.itemSelector;
    const moduleSelector = config.moduleSelector;
    const items = Array.from(accordion.querySelectorAll(itemSelector));
    const modules = Array.from(accordion.querySelectorAll(moduleSelector));
    const moduleCollapses = modules
      .map(function (mod) { return mod.querySelector(".accordion-collapse"); })
      .filter(Boolean);
    const initialStates = moduleCollapses.map(function (collapse) {
      return collapse.classList.contains("show");
    });

    function showAll() {
      items.forEach(function (item) {
        item.classList.remove("d-none");
      });
    }

    function expandCollapse(element, shouldShow) {
      const instance = bootstrap.Collapse.getOrCreateInstance(element, { toggle: false });
      if (shouldShow) {
        instance.show();
      } else {
        instance.hide();
      }
    }

    function expandAll() {
      moduleCollapses.forEach(function (collapse) {
        expandCollapse(collapse, true);
      });
    }

    function collapseAll() {
      moduleCollapses.forEach(function (collapse) {
        expandCollapse(collapse, false);
      });
    }

    function filter(queryRaw) {
      const query = normalize(queryRaw).trim();

      if (!query) {
        showAll();
        return;
      }

      items.forEach(function (item) {
        const haystack = normalize(item.getAttribute("data-search") || item.innerText);
        item.classList.toggle("d-none", !haystack.includes(query));
      });

      modules.forEach(function (module) {
        const collapse = module.querySelector(".accordion-collapse");
        const visibleCount = module.querySelectorAll(itemSelector + ":not(.d-none)").length;
        if (collapse) {
          expandCollapse(collapse, visibleCount > 0);
        }
      });
    }

    searchInput.addEventListener("input", function (event) {
      filter(event.target.value);
    });
    clearBtn.addEventListener("click", function () {
      searchInput.value = "";
      showAll();
      moduleCollapses.forEach(function (collapse, index) {
        expandCollapse(collapse, !!initialStates[index]);
      });
      searchInput.focus();
    });
    expandAllBtn.addEventListener("click", expandAll);
    collapseAllBtn.addEventListener("click", collapseAll);

    return { filter: filter, expandAll: expandAll, collapseAll: collapseAll };
  }

  function setupSearchGrid(config) {
    const searchInput = document.getElementById(config.searchInputId);
    const clearBtn = document.getElementById(config.clearButtonId);
    const items = Array.from(document.querySelectorAll(config.itemSelector));
    const hideTarget = config.hideTarget || "self";

    if (!searchInput || !clearBtn || !items.length) {
      return null;
    }

    function getTarget(item) {
      return hideTarget === "parent" ? item.parentElement : item;
    }

    function apply() {
      const query = normalize(searchInput.value).trim();
      items.forEach(function (item) {
        const haystack = normalize(item.getAttribute("data-search") || item.innerText);
        getTarget(item).classList.toggle("d-none", !!query && !haystack.includes(query));
      });
    }

    searchInput.addEventListener("input", apply);
    clearBtn.addEventListener("click", function () {
      searchInput.value = "";
      apply();
      searchInput.focus();
    });

    apply();
    return { apply: apply };
  }

  function setupTagFilterGrid(config) {
    const searchInput = document.getElementById(config.searchInputId);
    const clearBtn = document.getElementById(config.clearButtonId);
    const items = Array.from(document.querySelectorAll(config.itemSelector));
    const tags = Array.from(document.querySelectorAll(config.tagSelector));
    const activeTagClass = config.activeTagClass || "text-bg-dark";

    if (!searchInput || !clearBtn || !items.length || !tags.length) {
      return null;
    }

    const originalTagClasses = new Map(tags.map(function (tag) {
      return [tag, tag.className];
    }));
    let activeTag = null;
    let activeElement = null;

    function restoreTagStyles() {
      tags.forEach(function (tag) {
        tag.className = originalTagClasses.get(tag);
      });

      if (!activeElement) {
        return;
      }

      Array.from(activeElement.classList)
        .filter(function (className) { return className.startsWith("text-bg-"); })
        .forEach(function (className) { activeElement.classList.remove(className); });

      activeElement.classList.add(activeTagClass);
    }

    function applyFilter() {
      const query = normalize(searchInput.value).trim();

      items.forEach(function (item) {
        const haystack = normalize(item.getAttribute("data-search") || item.innerText);
        const tagsList = (item.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
        const matchQuery = !query || haystack.includes(query);
        const matchTag = !activeTag || tagsList.includes(activeTag);

        item.parentElement.classList.toggle("d-none", !(matchQuery && matchTag));
      });
    }

    searchInput.addEventListener("input", applyFilter);
    clearBtn.addEventListener("click", function () {
      searchInput.value = "";
      activeTag = null;
      activeElement = null;
      restoreTagStyles();
      applyFilter();
      searchInput.focus();
    });

    tags.forEach(function (tag) {
      tag.addEventListener("click", function () {
        const clickedTag = tag.getAttribute("data-tag");

        if (activeTag === clickedTag) {
          activeTag = null;
          activeElement = null;
        } else {
          activeTag = clickedTag;
          activeElement = tag;
        }

        restoreTagStyles();
        applyFilter();
      });
    });

    applyFilter();
    return { applyFilter: applyFilter };
  }

  window.PortalUI = {
    normalize: normalize,
    renderCollectionPage: renderCollectionPage,
    renderCoursePage: renderCoursePage,
    renderFooter: renderFooter,
    renderHomePage: renderHomePage,
    renderLegacyPage: renderLegacyPage,
    renderSiteNav: renderSiteNav,
    setupSearchableAccordion: setupSearchableAccordion,
    setupSearchGrid: setupSearchGrid,
    setupTagFilterGrid: setupTagFilterGrid
  };
})();

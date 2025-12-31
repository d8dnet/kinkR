export function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

export function getEl(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
}

export function renderCounter(i, total) {
  setText("counter", `${i}/${total}`);
}

export function renderHints(q, t) {
  setText("hint-l", t("quiz.hintNoPrefix") + q.L);
  setText("hint-r", q.R + t("quiz.hintYesSuffix"));
}

export function resetCardWrapper(wrap) {
  wrap.style.transition = "none";
  wrap.style.transform = "";
  wrap.style.opacity = "1";
}

export function renderCard(wrap, q) {
  clear(wrap);
  resetCardWrapper(wrap);

  const tpl = document.getElementById("tpl-card");
  if (!tpl) throw new Error("Missing <template id='tpl-card'>");

  const frag = tpl.content.cloneNode(true);

  frag.querySelector(".card-cat").textContent = q.cat;
  frag.querySelector(".card-title").textContent = q.title;
  frag.querySelector(".card-title-back").textContent = q.title;
  frag.querySelector(".card-desc").textContent = q.desc;

  const inner = frag.querySelector(".card-inner");

  const sL = document.createElement("div");
  sL.className = "stamp stamp-no";
  sL.textContent = q.L;

  const sR = document.createElement("div");
  sR.className = "stamp stamp-yes";
  sR.textContent = q.R;

  if (q.logic === "role") {
    sL.style.color = "#6C63FF";
    sL.style.borderColor = "#6C63FF";
    sR.style.color = "#6C63FF";
    sR.style.borderColor = "#6C63FF";
  }

  wrap.appendChild(frag);
  wrap.appendChild(sL);
  wrap.appendChild(sR);

  return { inner, sL, sR };
}

export function animateSkip(wrap, onDone) {
  wrap.style.transition = "all 0.4s ease";
  wrap.style.transform = "translateY(-50px) scale(0.95)";
  wrap.style.opacity = "0";
  setTimeout(onDone, 400);
}

export function renderResults(box, scoreEl, data, t) {
  clear(box);

  // 1. Обработка пустого результата
  if (!data.items || data.items.length === 0) {
    const emptyTpl = document.getElementById("tpl-empty-result");
    if (!emptyTpl) throw new Error("Missing <template id='tpl-empty-result'>");
    
    const frag = emptyTpl.content.cloneNode(true);
    frag.querySelector(".res-empty").textContent = t("result.empty");
    box.appendChild(frag);

    scoreEl.textContent = t("result.compareFallbackTitle");
    return;
  }

  // 2. Заголовок результатов
  scoreEl.textContent = t("result.intro");

  const itemTpl = document.getElementById("tpl-result-item");
  const badgeTpl = document.getElementById("tpl-badge");
  
  if (!itemTpl || !badgeTpl) {
    throw new Error("Missing result templates");
  }

  // Карта меток для разных типов совпадений
  const labelMap = {
    "match": t("result.matchLabel"), // Обоюдное "Да"
    "role": t("result.roleLabel"),   // Разные роли (старая логика)
    "sync": t("result.syncLabel")    // Тандем (Давать + Получать)
  };

  // 3. Основной цикл рендеринга
  for (const it of data.items) {
    const frag = itemTpl.content.cloneNode(true);

    // Устанавливаем заголовок карточки результата
    const label = labelMap[it.kind] || "";
    const displayTitle = label ? `${it.title} (${label})` : it.title;
    frag.querySelector(".res-title").textContent = displayTitle;

    // Контейнер для бейджей
    const badgeBox = frag.querySelector(".badge-container");
    
    for (const b of it.badges) {
      const bFrag = badgeTpl.content.cloneNode(true);
      const badge = bFrag.querySelector(".badge");
      
      // Установка стиля и текста бейджа
      badge.style.background = b.col;
      
      // Склеиваем перевод префикса и значение (если оно есть)
      const prefix = t(b.textKey);
      badge.textContent = b.value ? `${prefix} ${b.value}` : prefix;
      
      badgeBox.appendChild(bFrag);
    }

    // Добавляем готовую карточку в DOM
    box.appendChild(frag);
  }
}



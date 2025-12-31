export function calcResults(questions, p1, p2) {
  let matches = 0;
  const items = [];
  const processedIds = new Set(); // Чтобы не выводить один и тот же мэтч дважды для пар

  for (const q of questions) {
    if (processedIds.has(q.id)) continue;

    const v1 = p1[q.id];
    const v2 = p2[q.id];

    // 1. ЛОГИКА SYNC (Сцепленные пары: Давать/Получать)
    if (q.logic === "sync" && q.pair) {
      const partnerQ = questions.find(x => x.id === q.pair);
      if (!partnerQ) continue;

      const v1_pair = p1[q.pair];
      const v2_pair = p2[q.pair];

      // Проверяем: Партнер 1 хочет делать (q) + Партнер 2 хочет получать (pair)
      const match1 = (v1 === true && v2_pair === true);
      // Проверяем: Партнер 2 хочет делать (q) + Партнер 1 хочет получать (pair)
      const match2 = (v2 === true && v1_pair === true);

      if (match1 || match2) {
        matches++;
        processedIds.add(q.id);
        processedIds.add(q.pair);

        // Формируем красивое название без "(делаю я)"
        const cleanTitle = q.title.split('(')[0].trim(); 

        items.push({
          title: cleanTitle,
          kind: "sync",
          badges: [
            { 
                textKey: "result.syncMatch", // Добавьте этот ключ в i18n ("Идеальное совпадение ролей")
                value: "", 
                col: "#FF4081" 
            }
          ]
        });
      }
      continue;
    }

    // 2. ОБЫЧНЫЙ MATCH (Да/Да)
    if (v1 === undefined || v2 === undefined) continue;

    if (q.logic === "match") {
      // Нам нужно только согласие (Да + Да)
      if (v1 === true && v2 === true) {
        matches++;
        items.push({
          title: q.title,
          kind: "match",
          badges: [{ textKey: "result.bothPrefix", value: q.R, col: "#4CAF50" }]
        });
      }
    } 
    
    // 3. ЛОГИКА ROLE (Ваша старая логика, если нужна)
    else if (q.logic === "role") {
      if (v1 !== v2 && v1 !== undefined && v2 !== undefined) {
        matches++;
        items.push({
          title: q.title,
          kind: "role",
          badges: [
            { textKey: "result.partner1Prefix", value: (v1 ? q.R : q.L), col: "#3F51B5" },
            { textKey: "result.partner2Prefix", value: (v2 ? q.R : q.L), col: "#6C63FF" }
          ]
        });
      }
    }
  }

  return { matches, items };
}

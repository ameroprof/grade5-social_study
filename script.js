(() => {
    "use strict";

    const SAVE_KEY = "amman-adventurers-v1";
    const WORLD = { width: 26, height: 12, tileWidth: 76, tileHeight: 38 };
    const canvas = document.querySelector("#game-canvas");
    const ctx = canvas.getContext("2d");
    const miniCanvas = document.querySelector("#map-canvas");
    const miniCtx = miniCanvas.getContext("2d");
    const worldFrame = document.querySelector("#world-frame");
    const startScreen = document.querySelector("#start-screen");
    const startButton = document.querySelector("#start-button");
    const storyDialog = document.querySelector("#story-dialog");
    const puzzleDialog = document.querySelector("#puzzle-dialog");
    const reportDialog = document.querySelector("#report-dialog");
    const helpDialog = document.querySelector("#help-dialog");
    const sites = [
        {
            id: "capital", mission: "capital", x: 2.4, y: 5.8, kind: "civic", color: "#d1a46a",
            name: "بوابة العاصمة", npc: "المرشدة سلمى", evidence: "بطاقة أسماء عمّان",
            story: "أهلًا بك في محافظة العاصمة! عمّان هي عاصمة المملكة الأردنية الهاشمية ومركز مهم للخدمات والإدارة. للمحافظة مكانة تاريخية وحضارية، وتتوفر فيها خدمات صحية وتعليمية وأنشطة اقتصادية متنوعة.",
            fact: "يرتبط اسم عمّان التاريخي بربّة عمّون، ثم أطلق عليها اليونانيون اسم فيلادلفيا. العاصمة هي المدينة التي تتخذها الدولة مركزًا للحكم والإدارة، وتتولى أمانة عمّان الكبرى تقديم الخدمات البلدية."
        },
        {
            id: "theater", mission: "oldcity", x: 4.5, y: 7.3, kind: "theater", color: "#bd875d",
            name: "المدرّج الروماني", npc: "حارس المدرّج", evidence: "أثر من وسط البلد",
            story: "تأمل مدرّجات الحجر في قلب وسط البلد. هذا المعلم الروماني شاهد على حضارات تعاقبت على عمّان، وما زال يستضيف فعاليات ثقافية.",
            fact: "اجمع الدليل بملاحظة شكل المدرّج الحجري وموقعه في وسط عمّان، ثم قارن بينه وبين المعالم الأحدث في رحلتك."
        },
        {
            id: "citadel", mission: "oldcity", x: 6.6, y: 3.7, kind: "citadel", color: "#d3a976",
            name: "جبل القلعة", npc: "عالمة الآثار ليان", evidence: "شاهد من جبل القلعة",
            story: "من أعلى التل نرى طبقات من تاريخ المدينة. تضم منطقة جبل القلعة آثارًا بارزة، منها بقايا معبد هرقل والقصر الأموي.",
            fact: "اتخذ العمونيون جبل القلعة مقرًا للحكم. لاحظ كيف يساعد الموقع المرتفع على الإشراف على المدينة."
        },
        {
            id: "mosque", mission: "oldcity", x: 6.4, y: 8.9, kind: "mosque", color: "#e9dfcb",
            name: "المسجد الحسيني", npc: "الدليل أنس", evidence: "علامة من وسط البلد",
            story: "وصلنا إلى المسجد الحسيني في وسط البلد؛ إنه من معالم عمّان التي تجاور الأسواق والمحلات والمطاعم المزدحمة بالحياة.",
            fact: "وسط البلد يجمع معالم دينية وحركة تجارية يومية. لاحظ العلاقة بين المعلم وما حوله من أسواق وخدمات."
        },
        {
            id: "market", mission: "oldcity", x: 8.1, y: 6.0, kind: "market", color: "#dfaa54",
            name: "أسواق وسط البلد", npc: "التاجرة مريم", evidence: "خريطة النشاط التجاري",
            story: "بين الدكاكين والأزقة، ترى جانبًا من الأنشطة الاقتصادية في العاصمة. تسهم الأسواق والمطاعم في حيوية وسط البلد.",
            fact: "في رحلتك الميدانية، اربط ما شاهدته في السوق بفكرة أن محافظة العاصمة مركز للأنشطة الاقتصادية والخدمات."
        },
        {
            id: "sports", mission: "sports", x: 10.7, y: 3.8, kind: "stadium", color: "#66a883",
            name: "مدينة الحسين للشباب", npc: "المدرب رائد", evidence: "تذكرة مدينة الحسين للشباب",
            story: "مرحبًا بك في مدينة الحسين للشباب، حيث الملاعب والمنشآت الرياضية والثقافية. افتتحت عام 1964م، وتضم مرافق متعددة للشباب.",
            fact: "احتفظ بتاريخ التأسيس: 1964م. من مرافقها استاد عمّان الدولي وقصر الثقافة."
        },
        {
            id: "memorial", mission: "sports", x: 12.5, y: 8.0, kind: "memorial", color: "#eee7d8",
            name: "صرح الشهيد", npc: "أمين المتحف فادي", evidence: "وسام ذكرى الشهداء",
            story: "هذا الصرح الوطني يخلّد ذكرى شهداء الأردن. وفيه عروض تعريفية بتاريخ القوات المسلحة الأردنية وتضحيات من دافعوا عن الوطن.",
            fact: "يعرض صرح الشهيد تاريخ القوات المسلحة منذ الثورة العربية الكبرى إلى وقتنا الحاضر. قاد الشريف الحسين بن علي الثورة العربية الكبرى عام ١٩١٦م."
        },
        {
            id: "university", mission: "learning", x: 15.4, y: 3.8, kind: "university", color: "#e4c383",
            name: "الجامعة الأردنية", npc: "الطالبة نور", evidence: "شارة الجامعة الأردنية",
            story: "أُنشئت الجامعة الأردنية عام 1962م، وهي أول جامعة في الأردن. تمثل صرحًا علميًا ومؤسسة تعليمية مهمة.",
            fact: "سجّل التاريخ في ذاكرتك: تأسست الجامعة الأردنية سنة 1962م، قبل افتتاح مدينة الحسين للشباب."
        },
        {
            id: "medical", mission: "learning", x: 16.1, y: 6.0, kind: "hospital", color: "#d9e9e2",
            name: "مدينة الحسين الطبية", npc: "الطبيبة يارا", evidence: "شارة الخدمة الصحية",
            story: "مدينة الحسين الطبية صرح طبي متقدم، يقدم الخدمات الصحية للمواطنين ولمنتسبي القوات المسلحة الأردنية.",
            fact: "تُظهر المدينة الطبية أهمية الخدمات الصحية في محافظة العاصمة."
        },
        {
            id: "museum", mission: "learning", x: 17.1, y: 8.2, kind: "museum", color: "#e39b68",
            name: "متحف الأطفال", npc: "المخترعة جود", evidence: "بطاقة تعلّم باللعب",
            story: "في متحف الأطفال نكتشف المعرفة بالتجربة واللعب. افتُتح عام 2007م ليقدم بيئة تعليمية تفاعلية للأطفال.",
            fact: "الفكرة هنا أن تتعلم وأنت تجرب بنفسك: لاحظ، اسأل، واكتشف بدل الاكتفاء بقراءة المعلومة."
        },
        {
            id: "abd", mission: "heritage", x: 20.0, y: 2.3, kind: "qasr", color: "#d6b17d",
            name: "قصر العبد", npc: "الباحثة هبة", evidence: "حجر من قصر العبد",
            story: "في منطقة عراق الأمير بوادي السير، يقف قصر العبد شاهدًا أثريًا مميزًا. يعود القصر إلى الفترة الهلنستية.",
            fact: "تذكّر الفترة التاريخية: قصر العبد من آثار الفترة الهلنستية، ويقع في منطقة وادي السير."
        },
        {
            id: "rasas", mission: "heritage", x: 21.5, y: 5.1, kind: "ruins", color: "#c69263",
            name: "أم الرصاص", npc: "مرممة الفسيفساء رُبى", evidence: "قطعة فسيفساء تذكارية",
            story: "تعرّف إلى موقع أم الرصاص وآثاره وكنائسه المزخرفة بالفسيفساء. يبرز الموقع قيمة التراث الأردني وأهميته العالمية.",
            fact: "أُدرجت أم الرصاص على قائمة التراث العالمي لليونسكو عام 2004م."
        },
        {
            id: "mushatta", mission: "heritage", x: 23.0, y: 8.2, kind: "mushatta", color: "#ca986e",
            name: "قصر المشتى", npc: "المرشد سامر", evidence: "نقش من قصر المشتى",
            story: "قصر المشتى من القصور الأموية الأثرية. يلفت النظر تخطيطه المربع وأبراجه الدائرية، ويرتبط اسمه بالاستراحة في فصل الشتاء.",
            fact: "يقع القصر جنوب شرقي عمّان، وتظهر في بنائه سمات العمارة الأموية."
        },
    ];
    const missions = [
        { id: "capital", title: "رسالة إلى العاصمة", description: "تحدث مع المرشدة عند بوابة العاصمة، واجمع بطاقة أسماء عمّان." },
        { id: "oldcity", title: "حكايات وسط البلد", description: "استكشف المدرّج الروماني وجبل القلعة والمسجد الحسيني والأسواق." },
        { id: "sports", title: "ذاكرة الوطن والشباب", description: "اكتشف مدينة الحسين للشباب وصرح الشهيد." },
        { id: "learning", title: "محطات المعرفة", description: "زر الجامعة الأردنية والمدينة الطبية ومتحف الأطفال." },
        { id: "heritage", title: "كنوز من التاريخ", description: "اجمع شواهد قصر العبد وأم الرصاص وقصر المشتى." }
    ];
    const missionRequirements = {
        capital: ["capital"],
        oldcity: ["theater", "citadel", "mosque", "market"],
        sports: ["sports", "memorial"],
        learning: ["university", "medical", "museum"],
        heritage: ["abd", "rasas", "mushatta"]
    };
    const gates = [
        { x: 9.4, mission: "oldcity", name: "بوابة وسط البلد" },
        { x: 14.0, mission: "sports", name: "بوابة المعرفة" },
        { x: 18.7, mission: "learning", name: "بوابة التراث" }
    ];
    const timeline = [
        { year: 1916, text: "قيادة الشريف الحسين بن علي للثورة العربية الكبرى", site: "memorial" },
        { year: 1962, text: "تأسيس الجامعة الأردنية", site: "university" },
        { year: 1964, text: "افتتاح مدينة الحسين للشباب", site: "sports" },
        { year: 2004, text: "إدراج أم الرصاص في قائمة التراث العالمي", site: "rasas" },
        { year: 2007, text: "افتتاح متحف الأطفال", site: "museum" }
    ];
    const archiveSite = {
        id: "archive", x: 2.4, y: 9.8, kind: "archive", color: "#a18bd3",
        name: "أرشيف المدينة", npc: "أمينة الأرشيف", evidence: "خطّ الزمن",
        story: "وصلت إلى الأرشيف! اجمع محطاتك الأربع ورتّبها زمنيًا لتكمل سجل الرحلة.",
        fact: "استخدم التواريخ التي وجدتها عند الجامعة الأردنية ومدينة الحسين للشباب وأم الرصاص ومتحف الأطفال."
    };
    const movementKeys = new Set();
    const colors = ["#f2bd83", "#8dcac2", "#ada4ee", "#ef9d9f"];
    const player = { x: 1.0, y: 5.8, color: colors[0], speed: 4.1 };
    let state = { started: false, name: "", found: [], score: 0, solved: false };
    let activeSite = null;
    let selectedTimelineCard = null;
    let toastTimer = 0;
    let storageWarningShown = false;
    let lastFrame = 0;
    let lastNearId = null;
    let canvasSize = { width: 1, height: 1, dpr: 1 };
    let playerAnimation = 0;
    let savedProgressExists = false;

    function loadProgress() {
        try {
            const stored = localStorage.getItem(SAVE_KEY);
            if (!stored) return;
            savedProgressExists = true;
            const saved = JSON.parse(stored);
            if (!saved || saved.version !== 1 || !Array.isArray(saved.found)) {
                console.warn("تم تجاهل بيانات مغامرة غير صالحة.");
                return;
            }
            state = {
                started: Boolean(saved.started),
                name: typeof saved.name === "string" ? saved.name.slice(0, 30) : "",
                found: saved.found.filter(id => sites.some(site => site.id === id)),
                score: Number.isFinite(saved.score) ? Math.max(0, saved.score) : 0,
                solved: Boolean(saved.solved)
            };
            if (colors.includes(saved.color)) player.color = saved.color;
        } catch (error) {
            console.error("تعذّر تحميل المغامرة المحفوظة:", error);
        }
    }

    function saveProgress() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify({
                version: 1, started: state.started, name: state.name,
                found: state.found, score: state.score, solved: state.solved, color: player.color
            }));
        } catch (error) {
            console.error("تعذّر حفظ تقدم المغامرة:", error);
            if (!storageWarningShown) {
                storageWarningShown = true;
                showToast("تعذّر حفظ التقدم على هذا الجهاز؛ أبقِ الصفحة مفتوحة.");
            }
        }
    }

    function showToast(message) {
        const toast = document.querySelector("#toast");
        toast.textContent = message;
        toast.classList.add("visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
    }

    function isFound(id) {
        return state.found.includes(id);
    }

    function missionDone(id) {
        const requirements = missionRequirements[id];
        return requirements && requirements.every(isFound);
    }

    function previousMissionDone(missionId) {
        const index = missions.findIndex(mission => mission.id === missionId);
        return index <= 0 || missions.slice(0, index).every(mission => missionDone(mission.id));
    }

    function siteAvailable(site) {
        return site.id === "archive" ? missions.every(mission => missionDone(mission.id)) : previousMissionDone(site.mission);
    }

    function foundCount() {
        return state.found.length;
    }

    function activeMission() {
        return missions.find(mission => !missionDone(mission.id)) || null;
    }

    function updateInterface() {
        document.querySelector("#score-value").textContent = toArabicNumber(state.score);
        document.querySelector("#progress-fill").style.width = `${Math.min(100, foundCount() / sites.length * 100)}%`;
        document.querySelector("#progress-label").textContent = `${toArabicNumber(foundCount())} من ${toArabicNumber(sites.length)} موقعًا مكتشفًا`;
        document.querySelector("#evidence-count").textContent = toArabicNumber(foundCount() + (state.solved ? 1 : 0));
        document.querySelector("#report-button").disabled = !state.solved;
        document.querySelector("#guide-tip").innerHTML = state.solved
            ? "أحسنت! اكتملت الرحلة. افتح سجل الإنجاز واطبعه."
            : "اقترب من الشخصية أو المعلم، ثم اضغط <kbd>E</kbd> لتكتشف قصته.";
        const current = activeMission();
        const missionBox = document.querySelector("#current-mission");
        if (current) {
            const requirements = missionRequirements[current.id];
            missionBox.innerHTML = `<div class="mission-name">${current.title}</div><p class="mission-copy">${current.description}</p>` +
                requirements.map(id => {
                    const site = sites.find(item => item.id === id);
                    const done = isFound(id);
                    return `<div class="mission-step ${done ? "done" : ""}"><span class="step-dot">${done ? "✓" : ""}</span><span>${site.name}</span></div>`;
                }).join("");
            document.querySelector("#zone-name").textContent = current.title;
        } else if (!state.solved) {
            missionBox.innerHTML = `<div class="mission-name">مهمة الأرشيف</div><p class="mission-copy">ارجع إلى أرشيف المدينة ورتّب محطات الرحلة على خط الزمن.</p>`;
            document.querySelector("#zone-name").textContent = "أرشيف المدينة";
        } else {
            missionBox.innerHTML = `<div class="mission-name">اكتملت المغامرة!</div><p class="mission-copy">اكتشفت معالم المحافظة وأعدت بناء خطّ الزمن. اطبع سجل إنجازك.</p>`;
            document.querySelector("#zone-name").textContent = "مغامر العاصمة";
        }
        const list = document.querySelector("#evidence-list");
        const discovered = sites.filter(site => isFound(site.id));
        list.innerHTML = discovered.length
            ? discovered.map(site => `<li><span class="evidence-symbol" aria-hidden="true">✦</span><span><b>${site.evidence}</b><br>${site.name}</span></li>`).join("")
            : '<li class="empty-evidence">ستظهر هنا الأدلة التي تجمعها.</li>';
        if (state.solved) {
            list.insertAdjacentHTML("beforeend", '<li><span class="evidence-symbol" aria-hidden="true">⌛</span><span><b>خطّ الزمن</b><br>أُعيد بناؤه بنجاح</span></li>');
        }
        drawMiniMap();
    }

    function toArabicNumber(value) {
        return new Intl.NumberFormat("ar-JO").format(value);
    }

    function resizeCanvases() {
        const rect = worldFrame.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasSize = { width: rect.width, height: rect.height, dpr };
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const mapRect = miniCanvas.getBoundingClientRect();
        miniCanvas.width = Math.max(1, Math.round(mapRect.width * dpr));
        miniCanvas.height = Math.max(1, Math.round(mapRect.height * dpr));
        miniCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawMiniMap();
    }

    function project(x, y, lift = 0) {
        return {
            x: (x - y) * WORLD.tileWidth / 2,
            y: (x + y) * WORLD.tileHeight / 2 - lift
        };
    }

    function cameraOrigin() {
        const projected = project(player.x, player.y);
        return { x: canvasSize.width / 2 - projected.x, y: canvasSize.height * 0.56 - projected.y };
    }

    function drawDiamond(context, x, y, fill, width = WORLD.tileWidth, height = WORLD.tileHeight) {
        context.beginPath();
        context.moveTo(x, y - height / 2);
        context.lineTo(x + width / 2, y);
        context.lineTo(x, y + height / 2);
        context.lineTo(x - width / 2, y);
        context.closePath();
        context.fillStyle = fill;
        context.fill();
    }

    function drawCube(context, x, y, width, height, depth, color) {
        const top = y - depth - height;
        context.fillStyle = shade(color, -22);
        context.beginPath();
        context.moveTo(x + width / 2, top + height / 2);
        context.lineTo(x + width / 2, top + height / 2 + depth);
        context.lineTo(x, top + height + depth);
        context.lineTo(x, top + height);
        context.closePath();
        context.fill();
        context.fillStyle = shade(color, -9);
        context.beginPath();
        context.moveTo(x - width / 2, top + height / 2);
        context.lineTo(x, top + height);
        context.lineTo(x, top + height + depth);
        context.lineTo(x - width / 2, top + height / 2 + depth);
        context.closePath();
        context.fill();
        context.fillStyle = shade(color, 13);
        context.beginPath();
        context.moveTo(x, top);
        context.lineTo(x + width / 2, top + height / 2);
        context.lineTo(x, top + height);
        context.lineTo(x - width / 2, top + height / 2);
        context.closePath();
        context.fill();
        context.strokeStyle = "#554e5080";
        context.lineWidth = 1;
        context.stroke();
    }

    function shade(hex, amount) {
        const value = hex.replace("#", "");
        const num = parseInt(value.length === 3 ? value.split("").map(char => char + char).join("") : value, 16);
        const channels = [num >> 16, num >> 8 & 255, num & 255]
            .map(channel => Math.max(0, Math.min(255, channel + amount)));
        return `rgb(${channels[0]},${channels[1]},${channels[2]})`;
    }

    function drawGround(origin) {
        const { width, height } = canvasSize;
        ctx.fillStyle = "#acd0c2";
        ctx.fillRect(0, 0, width, height);
        const center = project(player.x, player.y);
        for (let sum = 0; sum <= WORLD.width + WORLD.height; sum++) {
            for (let x = 0; x <= WORLD.width; x++) {
                const y = sum - x;
                if (y < 0 || y > WORLD.height) continue;
                const p = project(x, y);
                const sx = origin.x + p.x;
                const sy = origin.y + p.y;
                if (sx < -WORLD.tileWidth || sx > width + WORLD.tileWidth || sy < -WORLD.tileHeight || sy > height + WORLD.tileHeight) continue;
                const inRoad = y >= 5 && y <= 6 && x > 0 && x < 25;
                const region = Math.floor(x / 6);
                const greens = ["#8fbd9d", "#91c3a1", "#a4c9a3", "#b0c49a", "#b6c49e"];
                const base = inRoad ? ((x + y) % 2 ? "#c9b99e" : "#c3b396") : greens[Math.min(region, greens.length - 1)];
                const tint = (x * 13 + y * 7) % 5 === 0 ? 5 : 0;
                drawDiamond(ctx, sx, sy, tint ? shade(base, tint) : base);
                if ((x * 3 + y * 5) % 11 === 0 && !inRoad && sx > -15 && sx < width + 15) {
                    ctx.fillStyle = "#f4e2a96b";
                    ctx.beginPath();
                    ctx.ellipse(sx + 9, sy + 3, 3, 1.4, -.4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        drawDecorations(origin, center);
    }

    function drawDecorations(origin, center) {
        for (let x = 1; x < WORLD.width; x += 2) {
            for (let y = 1; y < WORLD.height; y += 3) {
                if ((x * 7 + y * 5) % 3 === 0 || sites.some(site => Math.abs(site.x - x) < 1.4 && Math.abs(site.y - y) < 1.2)) continue;
                const p = project(x, y);
                const sx = origin.x + p.x;
                const sy = origin.y + p.y;
                if (sx < -30 || sx > canvasSize.width + 30 || sy < -40 || sy > canvasSize.height + 30) continue;
                ctx.fillStyle = "#4d8063";
                ctx.fillRect(sx - 2, sy - 8, 4, 11);
                ctx.fillStyle = (x + y) % 2 ? "#528f68" : "#679d72";
                ctx.beginPath();
                ctx.ellipse(sx, sy - 13, 10, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#a6ca8f";
                ctx.beginPath();
                ctx.ellipse(sx - 3, sy - 16, 4, 3, -.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.fillStyle = "#f1dda0";
        for (let x = 2; x < WORLD.width; x += 3) {
            const p = project(x, 1.1);
            const sx = origin.x + p.x;
            const sy = origin.y + p.y;
            ctx.beginPath();
            ctx.ellipse(sx, sy, 27, 8, -.25, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawSite(site, origin, time) {
        const p = project(site.x, site.y);
        const x = origin.x + p.x;
        const y = origin.y + p.y;
        if (x < -130 || x > canvasSize.width + 130 || y < -150 || y > canvasSize.height + 180) return;
        const discovered = isFound(site.id);
        const available = siteAvailable(site);
        ctx.fillStyle = "#26354c27";
        ctx.beginPath();
        ctx.ellipse(x, y + 2, 43, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        drawBuilding(site, x, y, time);
        drawNpc(x - 35, y - 6, site.id === "capital" ? "#8b5dc8" : "#ca755d", time, false);
        const labelWidth = Math.min(128, Math.max(74, site.name.length * 9));
        ctx.font = "700 10px Tahoma, Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#1c2b3cdb";
        roundRect(ctx, x - labelWidth / 2, y - 81, labelWidth, 21, 7);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.fillText(site.name, x, y - 70);
        if (discovered || !available) {
            ctx.beginPath();
            ctx.arc(x + 27, y - 81, 9, 0, Math.PI * 2);
            ctx.fillStyle = discovered ? "#67b489" : "#788196";
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.font = "bold 10px Arial";
            ctx.fillText(discovered ? "✓" : "•", x + 27, y - 80);
        }
    }

    function roundRect(context, x, y, width, height, radius) {
        context.beginPath();
        context.roundRect(x, y, width, height, radius);
    }

    function drawBuilding(site, x, y, time) {
        const width = 52;
        const depth = 43;
        const height = 34;
        const top = y - height - depth;
        if (site.kind === "archive") {
            drawCube(ctx, x, y, 50, 14, 9, "#9b82cc");
            drawCube(ctx, x, y - 13, 31, 20, 13, "#f1e6c6");
            ctx.fillStyle = "#8b6cc0";
            ctx.fillRect(x - 2, y - 31, 4, 16);
            ctx.fillStyle = "#f6d477";
            ctx.beginPath();
            ctx.arc(x, y - 34, 4, 0, Math.PI * 2);
            ctx.fill();
            return;
        }
        if (site.kind === "theater") {
            drawCube(ctx, x, y, 66, 18, 8, "#a97454");
            for (let row = 0; row < 4; row++) {
                ctx.beginPath();
                ctx.ellipse(x, y - 19 - row * 5, 39 - row * 6, 17 - row * 2, 0, Math.PI, Math.PI * 2);
                ctx.strokeStyle = ["#9d674a", "#b97e53", "#d0a173", "#dab486"][row];
                ctx.lineWidth = 4;
                ctx.stroke();
            }
            ctx.fillStyle = "#6c5147";
            ctx.fillRect(x - 18, y - 35, 36, 15);
            return;
        }
        if (site.kind === "citadel") {
            drawCube(ctx, x, y, 71, 20, 11, "#b9905e");
            for (let column = -1; column <= 1; column++) {
                drawCube(ctx, x + column * 18, y - 26, 8, 31, 5, "#ead1a2");
            }
            drawCube(ctx, x + 25, y - 29, 21, 18, 9, "#d2ac7b");
            return;
        }
        if (site.kind === "mosque") {
            drawCube(ctx, x, y, width, height, depth, site.color);
            ctx.fillStyle = "#5f806a";
            ctx.beginPath();
            ctx.ellipse(x, top + 5, 13, 7, 0, Math.PI, 0);
            ctx.fill();
            drawCube(ctx, x + 25, y - 20, 9, 50, 7, "#d9c69f");
            ctx.fillStyle = "#d4b36f";
            ctx.beginPath();
            ctx.arc(x + 25, y - 48, 5, 0, Math.PI * 2);
            ctx.fill();
            return;
        }
        if (site.kind === "market") {
            for (let i = 0; i < 3; i++) {
                drawCube(ctx, x - 27 + i * 26, y - (i % 2) * 3, 21, 21, 16, ["#e4c28b", "#c98665", "#ebd79b"][i]);
                ctx.fillStyle = ["#bf5851", "#5c9c86", "#e2a44c"][i];
                ctx.beginPath();
                ctx.moveTo(x - 39 + i * 26, y - 23 - (i % 2) * 3);
                ctx.lineTo(x - 15 + i * 26, y - 23 - (i % 2) * 3);
                ctx.lineTo(x - 18 + i * 26, y - 35 - (i % 2) * 3);
                ctx.lineTo(x - 35 + i * 26, y - 35 - (i % 2) * 3);
                ctx.closePath();
                ctx.fill();
            }
            return;
        }
        if (site.kind === "stadium") {
            ctx.fillStyle = "#879699";
            ctx.beginPath();
            ctx.ellipse(x, y - 18, 39, 25, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#e2e4d3";
            ctx.beginPath();
            ctx.ellipse(x, y - 20, 31, 18, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#7aa878";
            ctx.beginPath();
            ctx.ellipse(x, y - 21, 22, 11, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#f4f0d5";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(x, y - 21, 12, 7, 0, 0, Math.PI * 2);
            ctx.stroke();
            return;
        }
        if (site.kind === "memorial") {
            drawCube(ctx, x, y, 63, 20, 10, "#d2c8b7");
            drawCube(ctx, x, y - 15, 28, 36, 10, "#eee8da");
            ctx.fillStyle = "#8c6a54";
            ctx.fillRect(x - 3, y - 40, 6, 34);
            ctx.beginPath();
            ctx.moveTo(x, y - 51);
            ctx.lineTo(x - 6, y - 40);
            ctx.lineTo(x + 6, y - 40);
            ctx.closePath();
            ctx.fill();
            return;
        }
        if (site.kind === "university") {
            drawCube(ctx, x, y, 62, 36, 32, site.color);
            for (let i = -1; i <= 1; i++) {
                ctx.fillStyle = "#6e8b8b";
                ctx.fillRect(x + i * 15 - 4, y - 38, 8, 22);
                ctx.fillStyle = "#f4ebd7";
                ctx.fillRect(x + i * 15 - 5, y - 41, 10, 4);
            }
            drawCube(ctx, x, y - 42, 42, 16, 9, "#c49c61");
            return;
        }
        if (site.kind === "hospital") {
            drawCube(ctx, x, y, 60, 39, 31, site.color);
            drawCube(ctx, x + 22, y - 35, 19, 24, 11, "#c3dcd2");
            ctx.fillStyle = "#bc5c5d";
            ctx.fillRect(x - 4, y - 49, 8, 22);
            ctx.fillRect(x - 11, y - 42, 22, 8);
            ctx.fillStyle = "#8b9fa0";
            ctx.fillRect(x - 5, y - 18, 10, 15);
            return;
        }
        if (site.kind === "museum") {
            drawCube(ctx, x, y, 59, 36, 27, "#f3d1a4");
            drawCube(ctx, x - 20, y - 32, 15, 20, 13, "#6eaeb1");
            drawCube(ctx, x, y - 33, 15, 23, 12, "#d77771");
            drawCube(ctx, x + 19, y - 32, 15, 20, 13, "#e2b653");
            ctx.fillStyle = "#fff4d9";
            ctx.fillRect(x - 4, y - 16, 8, 13);
            return;
        }
        if (site.kind === "qasr") {
            drawCube(ctx, x, y, 66, 34, 40, site.color);
            drawCube(ctx, x - 24, y - 32, 15, 31, 10, "#c39a65");
            drawCube(ctx, x + 24, y - 32, 15, 31, 10, "#c39a65");
            ctx.fillStyle = "#604d3e";
            ctx.beginPath();
            ctx.arc(x, y - 16, 8, Math.PI, 0);
            ctx.fill();
            ctx.fillRect(x - 8, y - 16, 16, 16);
            return;
        }
        if (site.kind === "ruins") {
            drawCube(ctx, x, y, 66, 17, 13, "#bd8d5d");
            drawCube(ctx, x - 21, y - 18, 12, 35, 7, "#d3a574");
            drawCube(ctx, x + 21, y - 18, 12, 35, 7, "#c59464");
            ctx.fillStyle = "#d6bd83";
            for (let i = 0; i < 6; i++) {
                ctx.fillRect(x - 23 + (i % 3) * 15, y - 27 + Math.floor(i / 3) * 11, 10, 7);
            }
            return;
        }
        if (site.kind === "mushatta") {
            drawCube(ctx, x, y, 64, 38, 31, site.color);
            for (let i = -1; i <= 1; i++) {
                ctx.fillStyle = "#745942";
                ctx.beginPath();
                ctx.arc(x + i * 17, y - 20, 6, Math.PI, 0);
                ctx.fill();
                ctx.fillRect(x + i * 17 - 6, y - 20, 12, 15);
            }
            drawCube(ctx, x, y - 37, 64, 9, 31, "#c38d60");
            return;
        }
        drawCube(ctx, x, y, width, height, depth, site.color);
    }

    function drawNpc(x, y, color, time, isPlayer) {
        const bob = isPlayer && movementKeys.size ? Math.sin(time / 70) * 2 : 0;
        ctx.fillStyle = "#23364a3d";
        ctx.beginPath();
        ctx.ellipse(x, y, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e6b28b";
        ctx.fillRect(x - 5, y - 27 + bob, 10, 10);
        ctx.fillStyle = "#263547";
        ctx.fillRect(x - 6, y - 18 + bob, 12, 4);
        ctx.fillStyle = color;
        ctx.fillRect(x - 8, y - 16 + bob, 16, 13);
        ctx.fillStyle = shade(color, -23);
        ctx.fillRect(x - 8, y - 4 + bob, 6, 7);
        ctx.fillRect(x + 2, y - 4 + bob, 6, 7);
        if (isPlayer) {
            ctx.strokeStyle = "#ffffffd9";
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 10, y - 29 + bob, 20, 37);
            ctx.fillStyle = "#ffe184";
            ctx.beginPath();
            ctx.arc(x, y - 37 + bob, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawGates(origin) {
        gates.forEach(gate => {
            const open = missionDone(gate.mission);
            const spacing = open ? 1.8 : 0.9;
            for (let y = .5; y < WORLD.height; y += spacing) {
                if (open && y > 4.6 && y < 7.2) continue;
                const p = project(gate.x, y);
                const sx = origin.x + p.x;
                const sy = origin.y + p.y;
                if (sx < -30 || sx > canvasSize.width + 30 || sy < -30 || sy > canvasSize.height + 30) continue;
                drawCube(ctx, sx, sy, 11, 20, 6, open ? "#8da685" : "#987852");
            }
            const middle = project(gate.x, 5.6);
            const gx = origin.x + middle.x;
            const gy = origin.y + middle.y;
            ctx.font = "700 9px Tahoma, Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = open ? "#46785d" : "#875e3e";
            roundRect(ctx, gx - 47, gy - 43, 94, 18, 6);
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.fillText(open ? `${gate.name} ✓` : `${gate.name} · مغلقة`, gx, gy - 34);
        });
    }

    function drawPlayer(origin) {
        const p = project(player.x, player.y);
        drawNpc(origin.x + p.x, origin.y + p.y, player.color, playerAnimation, true);
    }

    function nearbySite() {
        let nearest = null;
        let distance = Infinity;
        for (const site of sites) {
            const d = interactionDistance(site, player.x, player.y);
            if (d < distance) { nearest = site; distance = d; }
        }
        if (!state.solved && missions.every(mission => missionDone(mission.id))) {
            const archiveDistance = interactionDistance(archiveSite, player.x, player.y);
            if (archiveDistance < distance) { nearest = archiveSite; distance = archiveDistance; }
        }
        return nearest && distance < 28 ? nearest : null;
    }

    function interactionDistance(site, x, y) {
        const mapScale = WORLD.tileWidth / WORLD.tileHeight;
        const dx = (site.x - x) * mapScale;
        const projectedY = (site.x - x + site.y - y) * WORLD.tileHeight / 2;
        return Math.hypot(dx, projectedY);
    }

    function render(time) {
        const dt = Math.min(0.05, lastFrame ? (time - lastFrame) / 1000 : 0);
        lastFrame = time;
        playerAnimation = time;
        if (state.started && !storyDialog.open && !puzzleDialog.open && !reportDialog.open && !helpDialog.open) {
            movePlayer(dt);
        }
        const origin = cameraOrigin();
        drawGround(origin);
        const renderables = sites.map(site => ({ depth: site.x + site.y, draw: () => drawSite(site, origin, time) }));
        const showArchive = !state.solved && missions.every(mission => missionDone(mission.id));
        if (showArchive) renderables.push({ depth: archiveSite.x + archiveSite.y, draw: () => drawSite(archiveSite, origin, time) });
        renderables.push({ depth: player.x + player.y, draw: () => drawPlayer(origin) });
        renderables.sort((a, b) => a.depth - b.depth).forEach(item => item.draw());
        drawGates(origin);
        updateNearbyPrompt();
        requestAnimationFrame(render);
    }

    function movePlayer(dt) {
        let dx = 0;
        let dy = 0;
        if (movementKeys.has("ArrowLeft") || movementKeys.has("a")) dx -= 1;
        if (movementKeys.has("ArrowRight") || movementKeys.has("d")) dx += 1;
        if (movementKeys.has("ArrowUp") || movementKeys.has("w")) dy -= 1;
        if (movementKeys.has("ArrowDown") || movementKeys.has("s")) dy += 1;
        if (!dx && !dy) return;
        const factor = (dx && dy ? Math.SQRT1_2 : 1) * player.speed * dt;
        dx *= factor;
        dy *= factor;
        const nextX = player.x + dx;
        const nextY = player.y + dy;
        if (nextX > .45 && nextX < WORLD.width - .45 && !crossesClosedGate(player.x, nextX)) player.x = nextX;
        const gateCenterY = WORLD.height / 2;
        if (nextY > .45 && nextY < WORLD.height - .45 && !gates.some(gate =>
            Math.abs(player.x - gate.x) < .65 &&
            ((player.y < gateCenterY && nextY >= gateCenterY) || (player.y > gateCenterY && nextY <= gateCenterY)) &&
            !missionDone(gate.mission)
        )) player.y = nextY;
    }

    function crossesClosedGate(from, to) {
        return gates.some(gate => {
            const crossed = (from < gate.x && to >= gate.x) || (from > gate.x && to <= gate.x);
            return crossed && !missionDone(gate.mission);
        });
    }

    function updateNearbyPrompt() {
        const site = state.started ? nearbySite() : null;
        const hint = document.querySelector("#interaction-hint");
        if (!site) {
            hint.hidden = true;
            lastNearId = null;
            return;
        }
        hint.hidden = false;
        document.querySelector("#hint-label").textContent = isFound(site.id)
            ? `تحدث مع ${site.npc}`
            : siteAvailable(site) ? `اكتشف ${site.name}` : `تحدث مع ${site.npc}`;
        if (site.id !== lastNearId) {
            lastNearId = site.id;
            document.querySelector("#zone-name").textContent = site.name;
        }
    }

    function interact() {
        if (!state.started || storyDialog.open || puzzleDialog.open || reportDialog.open || helpDialog.open) return;
        const site = nearbySite();
        if (!site) {
            showToast("اقترب أكثر من شخصية أو معلم لتتفاعل معه.");
            return;
        }
        if (site.id === "archive") {
            openTimelinePuzzle();
            return;
        }
        if (!siteAvailable(site)) {
            const next = missions.find(mission => !missionDone(mission.id));
            showStory({
                id: site.id, name: site.name, npc: site.npc, evidence: site.evidence,
                story: `هذه المنطقة مغلقة الآن. أكمل مهمة «${next ? next.title : "الرحلة"}» أولًا، ثم عد لاكتشاف هذا المعلم.`,
                fact: "تُفتح البوابات تدريجيًا عندما تُنجز مهمات المناطق السابقة."
            }, false, "منطقة مغلقة");
            return;
        }
        showStory(site, !isFound(site.id), `شخصية: ${site.npc}`);
    }

    function showStory(site, canCollect, kicker) {
        activeSite = site;
        document.querySelector("#dialog-kicker").textContent = kicker;
        document.querySelector("#dialog-title").textContent = site.name;
        document.querySelector("#dialog-copy").textContent = site.story;
        document.querySelector("#dialog-fact").textContent = site.fact;
        const action = document.querySelector("#dialog-action");
        action.innerHTML = canCollect ? `سجّل الاكتشاف واجمع الدليل <span aria-hidden="true">✦</span>` : "تابع التجوّل";
        action.dataset.collect = canCollect ? "true" : "false";
        storyDialog.showModal();
    }

    function completeSite() {
        if (!activeSite || isFound(activeSite.id)) {
            storyDialog.close();
            return;
        }
        state.found.push(activeSite.id);
        state.score += 100;
        const title = activeSite.name;
        state.started = true;
        storyDialog.close();
        saveProgress();
        updateInterface();
        showToast(`جمعتَ «${activeSite.evidence}» · +١٠٠ نقطة`);
        const completedMission = missions.find(mission => mission.id === activeSite.mission && missionDone(mission.id));
        if (completedMission) {
            window.setTimeout(() => showToast(`اكتملت مهمة «${completedMission.title}»! فُتحت البوابة التالية.`), 950);
        }
        if (activeSite.id === "capital") document.querySelector("#zone-name").textContent = title;
    }

    function startGame() {
        const input = document.querySelector("#player-name");
        if (input.value.trim()) state.name = input.value.trim().slice(0, 30);
        const selectedColor = document.querySelector("#player-color").value;
        if (colors.includes(selectedColor)) player.color = selectedColor;
        state.started = true;
        saveProgress();
        startScreen.classList.add("dismissed");
        updateInterface();
        showToast(state.found.length ? "أهلًا بعودتك! تابِع من حيث وصلت." : "تحرّك في العالم وابحث عن المرشدة سلمى.");
        resizeCanvases();
    }

    function beginArchive() {
        storyDialog.close();
        if (state.solved) {
            showToast("أنجزتَ لغز الأرشيف من قبل. افتح سجل الإنجاز.");
            return;
        }
        openTimelinePuzzle();
    }

    function openTimelinePuzzle() {
        const shuffled = [timeline[2], timeline[0], timeline[4], timeline[3], timeline[1]];
        document.querySelector("#timeline-slots").innerHTML = timeline.map((_, index) =>
            `<button class="timeline-slot" type="button" data-slot="${index}" aria-label="المحطة ${toArabicNumber(index + 1)}"><b>${toArabicNumber(index + 1)}</b><span>اختر بطاقة</span></button>`
        ).join("");
        document.querySelector("#timeline-cards").innerHTML = shuffled.map((item, index) =>
            `<button class="timeline-card" type="button" data-card="${timeline.indexOf(item)}">${item.text}</button>`
        ).join("");
        document.querySelector("#puzzle-feedback").textContent = "";
        selectedTimelineCard = null;
        puzzleDialog.showModal();
    }

    function updateTimelineSelection() {
        const slots = [...document.querySelectorAll(".timeline-slot")];
        const cards = [...document.querySelectorAll(".timeline-card")];
        slots.forEach((slot, index) => {
            const selected = slot.dataset.cardIndex;
            slot.classList.toggle("filled", selected !== undefined);
            slot.querySelector("span").textContent = selected === undefined ? "اختر بطاقة" : timeline[Number(selected)].text;
            slot.dataset.slotIndex = String(index);
        });
        const used = slots.map(slot => slot.dataset.cardIndex).filter(value => value !== undefined);
        cards.forEach(card => {
            const cardIndex = Number(card.dataset.card);
            card.classList.toggle("used", used.includes(String(cardIndex)));
            card.classList.toggle("selected", selectedTimelineCard === cardIndex);
            card.disabled = used.includes(String(cardIndex));
        });
    }

    function selectTimelineCard(cardIndex) {
        selectedTimelineCard = selectedTimelineCard === cardIndex ? null : cardIndex;
        document.querySelector("#puzzle-feedback").textContent = selectedTimelineCard === null
            ? ""
            : "اختر مكان المحطة في خط الزمن.";
        updateTimelineSelection();
    }

    function placeTimelineCard(slot) {
        const feedback = document.querySelector("#puzzle-feedback");
        if (slot.dataset.cardIndex !== undefined) {
            feedback.textContent = "هذا المكان مشغول. أزل بطاقته أولًا لتغيير الترتيب.";
            return;
        }
        if (selectedTimelineCard === null) {
            feedback.textContent = "اختر بطاقة حدث أولًا، ثم اختر مكانها في التسلسل.";
            return;
        }
        slot.dataset.cardIndex = String(selectedTimelineCard);
        selectedTimelineCard = null;
        feedback.textContent = "";
        updateTimelineSelection();
    }

    function checkTimeline() {
        const slots = [...document.querySelectorAll(".timeline-slot")];
        const feedback = document.querySelector("#puzzle-feedback");
        if (slots.some(slot => slot.dataset.cardIndex === undefined)) {
            feedback.textContent = "املأ الأماكن الأربعة قبل التحقق من ترتيبك.";
            return;
        }
        const correct = slots.every((slot, index) => Number(slot.dataset.cardIndex) === index);
        if (!correct) {
            feedback.textContent = "ليست كل المحطات في مكانها بعد. راجع التواريخ التي اكتشفتها.";
            return;
        }
        state.solved = true;
        state.score += 200;
        state.started = true;
        saveProgress();
        puzzleDialog.close();
        updateInterface();
        showToast("أحسنت! رتّبت محطات عمّان بنجاح · +٢٠٠ نقطة");
        document.querySelector("#report-button").focus();
    }

    function openReport() {
        if (!state.solved) return;
        const completed = sites.filter(site => isFound(site.id));
        const name = state.name || "المستكشف / المستكشفة";
        document.querySelector("#report-content").innerHTML = `
            <p class="report-name">المستكشف: <b>${escapeHtml(name)}</b> · الدراسات الاجتماعية · الصف الخامس</p>
            <p class="report-name">المعلم: عامر كراجه · مدرسة ذكور وادي السير الإعدادية</p>
            <div class="report-score"><span>المواقع والأدلة المكتشفة</span><b>${toArabicNumber(completed.length)} / ${toArabicNumber(sites.length)}</b></div>
            <ul class="report-list">${completed.map(site => `<li>${site.name} — ${site.evidence}</li>`).join("")}</ul>
            <div class="report-score"><span>لغز خط الزمن</span><b>أُنجز بنجاح ✓</b></div>
            <div class="report-score" style="margin-top:8px"><span>نتيجة المغامرة</span><b>${toArabicNumber(state.score)} نقطة</b></div>`;
        reportDialog.showModal();
    }

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, character => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[character]);
    }

    function drawMiniMap() {
        if (!miniCtx || !miniCanvas.clientWidth) return;
        const width = miniCanvas.clientWidth;
        const height = miniCanvas.clientHeight;
        miniCtx.clearRect(0, 0, width, height);
        miniCtx.fillStyle = "#203653";
        miniCtx.fillRect(0, 0, width, height);
        const marginX = 10;
        const marginY = 15;
        const routeWidth = width - marginX * 2;
        const routeHeight = height - marginY * 2;
        miniCtx.strokeStyle = "#8f9aad";
        miniCtx.setLineDash([4, 4]);
        miniCtx.lineWidth = 2;
        miniCtx.beginPath();
        miniCtx.moveTo(marginX, height / 2);
        miniCtx.lineTo(width - marginX, height / 2);
        miniCtx.stroke();
        miniCtx.setLineDash([]);
        gates.forEach(gate => {
            const gx = marginX + gate.x / WORLD.width * routeWidth;
            miniCtx.strokeStyle = missionDone(gate.mission) ? "#79c59c" : "#f2bc69";
            miniCtx.lineWidth = 2;
            miniCtx.beginPath();
            miniCtx.moveTo(gx, height / 2 - 8);
            miniCtx.lineTo(gx, height / 2 + 8);
            miniCtx.stroke();
        });
        sites.forEach(site => {
            const px = marginX + site.x / WORLD.width * routeWidth;
            const py = marginY + site.y / WORLD.height * routeHeight;
            miniCtx.beginPath();
            miniCtx.arc(px, py, isFound(site.id) ? 3.3 : 2.4, 0, Math.PI * 2);
            miniCtx.fillStyle = isFound(site.id) ? "#8ce3ad" : "#e7c77d";
            miniCtx.fill();
        });
        const px = marginX + player.x / WORLD.width * routeWidth;
        const py = marginY + player.y / WORLD.height * routeHeight;
        miniCtx.beginPath();
        miniCtx.arc(px, py, 4, 0, Math.PI * 2);
        miniCtx.fillStyle = "#fff";
        miniCtx.shadowColor = "#fff";
        miniCtx.shadowBlur = 8;
        miniCtx.fill();
        miniCtx.shadowBlur = 0;
    }

    function onKeyDown(event) {
        const key = event.key.toLowerCase();
        if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key) && !event.target.matches("input, textarea, button")) event.preventDefault();
        if (key === "e" || key === " ") {
            if (!event.repeat) {
                interact();
            }
            return;
        }
        if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) movementKeys.add(key);
    }

    function wireMobileControls() {
        document.querySelectorAll("[data-move]").forEach(button => {
            const directions = {
                up: "w", down: "s", left: "a", right: "d"
            };
            const key = directions[button.dataset.move];
            button.addEventListener("pointerdown", event => {
                event.preventDefault();
                button.setPointerCapture(event.pointerId);
                button.classList.add("pressed");
                movementKeys.add(key);
            });
            const stop = () => {
                movementKeys.delete(key);
                button.classList.remove("pressed");
            };
            button.addEventListener("pointerup", stop);
            button.addEventListener("pointercancel", stop);
            button.addEventListener("lostpointercapture", stop);
        });
        document.querySelector("#mobile-interact").addEventListener("click", () => {
            interact();
        });
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", event => movementKeys.delete(event.key.toLowerCase()));
    window.addEventListener("blur", () => movementKeys.clear());
    startButton.addEventListener("click", startGame);
    document.querySelector("#dialog-action").addEventListener("click", () => {
        if (activeSite && activeSite.id === "archive" && document.querySelector("#dialog-action").dataset.collect === "true") {
            beginArchive();
        } else if (document.querySelector("#dialog-action").dataset.collect === "true") {
            completeSite();
        } else {
            storyDialog.close();
        }
    });
    document.querySelector("#help-button").addEventListener("click", () => helpDialog.showModal());
    document.querySelector("#reset-button").addEventListener("click", () => {
        if (window.confirm("هل تريد بدء مغامرة جديدة؟ سيُحذف التقدم المحفوظ على هذا الجهاز.")) {
            try {
                localStorage.removeItem(SAVE_KEY);
                window.location.reload();
            } catch (error) {
                console.error("تعذّر حذف المغامرة المحفوظة:", error);
                showToast("تعذّر حذف الحفظ؛ راجع إعدادات تخزين المتصفح.");
            }
        }
    });
    document.querySelector("#report-button").addEventListener("click", openReport);
    document.querySelector("#report-close").addEventListener("click", () => reportDialog.close());
    document.querySelector("#print-button").addEventListener("click", () => window.print());
    document.querySelector("#timeline-submit").addEventListener("click", checkTimeline);
    document.querySelector("#timeline-slots").addEventListener("click", event => {
        const slot = event.target.closest(".timeline-slot");
        if (!slot) return;
        if (selectedTimelineCard !== null) placeTimelineCard(slot);
        else if (slot.dataset.cardIndex !== undefined) {
            delete slot.dataset.cardIndex;
            document.querySelector("#puzzle-feedback").textContent = "اختر البطاقة التي تريد وضعها هنا.";
            updateTimelineSelection();
        } else document.querySelector("#puzzle-feedback").textContent = "اختر بطاقة حدث أولًا، ثم اختر مكانها في التسلسل.";
    });
    document.querySelector("#timeline-cards").addEventListener("click", event => {
        const card = event.target.closest(".timeline-card");
        if (card && !card.disabled) selectTimelineCard(Number(card.dataset.card));
    });
    canvas.addEventListener("pointerdown", event => {
        if (!state.started || !nearbySite()) return;
        if (event.pointerType === "touch") interact();
    });
    window.addEventListener("resize", resizeCanvases);
    wireMobileControls();
    loadProgress();
    if (state.started) {
        startScreen.classList.add("dismissed");
        document.querySelector("#player-name").value = state.name;
        document.querySelector("#player-color").value = player.color;
    } else if (savedProgressExists) {
        document.querySelector("#saved-note").hidden = false;
    }
    updateInterface();
    resizeCanvases();
    requestAnimationFrame(render);
})();

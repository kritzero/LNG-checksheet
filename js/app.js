
const state = {
  page: "login",
  selectedSiteIndex: null,
  currentInstrumentIndex: null,
  previewUrl: "",
  aiValue: "",
  editingCommentId: null,
  pendingCommentImages: []
};

const app = document.getElementById("app");
const pageTitle = document.getElementById("pageTitle");
const siteLabel = document.getElementById("siteLabel");
const bottomNav = document.getElementById("bottomNav");
const toastElement = document.getElementById("toast");

function draftKey(siteName) {
  return `lng-inspection-v3:${siteName}`;
}

function freshDraft(site) {
  return {
    site: site.name,
    startedAt: new Date().toISOString(),
    instruments: site.instruments.map((item, index) => ({
      ...item,
      id: `instrument-${index}`,
      masterOrder: index,
      status: "pending",
      value: "",
      issueComment: "",
      flameStatus: "",
      flameComment: ""
    })),
    valves: site.valves.map((item, index) => ({
      ...item,
      id: `valve-${index}`,
      masterOrder: index,
      status: "pending",
      position: ""
    })),
    comments: []
  };
}

function loadDraft(site) {
  try {
    const saved = localStorage.getItem(draftKey(site.name));
    const draft = saved ? JSON.parse(saved) : freshDraft(site);

    // Compatibility with drafts created by v3.0:
    // attach the permanent order from the Master Data without deleting saved work.
    draft.instruments = (draft.instruments || []).map((item, index) => ({
      ...item,
      masterOrder: Number.isFinite(item.masterOrder) ? item.masterOrder : index
    }));
    draft.valves = (draft.valves || []).map((item, index) => ({
      ...item,
      masterOrder: Number.isFinite(item.masterOrder) ? item.masterOrder : index
    }));

    return draft;
  } catch {
    return freshDraft(site);
  }
}

function saveDraft() {
  const draft = currentDraft();
  if (!draft) return;
  draft.lastSavedAt = new Date().toISOString();
  localStorage.setItem(draftKey(draft.site), JSON.stringify(draft));
}

function currentSite() {
  return state.selectedSiteIndex === null ? null : MASTER_SITES[state.selectedSiteIndex];
}

function currentDraft() {
  const site = currentSite();
  if (!site) return null;
  if (!site._draft) site._draft = loadDraft(site);
  return site._draft;
}

function notify(message) {
  toastElement.textContent = message;
  toastElement.classList.remove("hidden");
  setTimeout(() => toastElement.classList.add("hidden"), 1600);
}

function navigate(page) {
  state.page = page;
  render();
}

function scrollToTopSoon() {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function pendingFirst(items, completedTest) {
  return items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((a, b) => {
      const aDone = completedTest(a.item);
      const bDone = completedTest(b.item);

      // Pending always stays above completed.
      if (aDone !== bDone) return aDone ? 1 : -1;

      // Inside each group, always follow the original Master Data order,
      // never the order in which the technician completed the tags.
      const aOrder = Number.isFinite(a.item.masterOrder) ? a.item.masterOrder : a.originalIndex;
      const bOrder = Number.isFinite(b.item.masterOrder) ? b.item.masterOrder : b.originalIndex;
      return aOrder - bOrder;
    });
}

function render() {
  const loggedOut = state.page === "login";
  bottomNav.classList.toggle("hidden", loggedOut || state.page === "sites");
  siteLabel.textContent = currentSite()?.name || "";

  const pages = {
    login: renderLogin,
    sites: renderSites,
    overview: renderOverview,
    instruments: renderInstruments,
    instrumentAction: renderInstrumentAction,
    instrumentReview: renderInstrumentReview,
    instrumentIssue: renderInstrumentIssue,
    flameCheck: renderFlameCheck,
    valves: renderValves,
    comments: renderComments,
    commentEditor: renderCommentEditor,
    summary: renderSummary
  };

  pages[state.page]();
}

function renderLogin() {
  pageTitle.textContent = "เข้าสู่ระบบ";
  siteLabel.textContent = "";
  app.innerHTML = `
    <section class="card">
      <label>Username</label>
      <input id="username" value="technician01">
      <label>Password</label>
      <input id="password" type="password" value="123456">
      <button id="loginButton">Login</button>
    </section>
  `;

  document.getElementById("loginButton").addEventListener("click", async () => {
    const result = await API.login(
      document.getElementById("username").value.trim(),
      document.getElementById("password").value
    );
    if (result.ok) navigate("sites");
    else notify("กรุณากรอก Username และ Password");
  });
}

function renderSites() {
  pageTitle.textContent = "เลือก Site";
  siteLabel.textContent = "";
  app.innerHTML = `<div id="siteList"></div>`;
  const list = document.getElementById("siteList");

  MASTER_SITES.forEach((site, index) => {
    const draft = site._draft || loadDraft(site);
    site._draft = draft;
    const total = draft.instruments.length + draft.valves.length;
    const completed = draft.instruments.filter(isInstrumentDone).length +
      draft.valves.filter(v => v.status === "completed").length;

    const card = document.createElement("div");
    card.className = "list-card";
    card.innerHTML = `
      <div class="icon">🏭</div>
      <div class="grow">
        <h3>${escapeHtml(site.name)}</h3>
        <p>${draft.instruments.length} Instruments • ${draft.valves.length} Valves</p>
      </div>
      <span class="badge ${completed === total ? "ok" : "warn"}">${completed}/${total}</span>
    `;
    card.addEventListener("click", () => {
      state.selectedSiteIndex = index;
      navigate("overview");
    });
    list.appendChild(card);
  });
}

function isInstrumentDone(item) {
  if (item.checkType === "flame") return Boolean(item.flameStatus);
  return item.status === "completed" || item.status === "issue";
}

function renderOverview() {
  const draft = currentDraft();
  pageTitle.textContent = "Overview";

  const instrumentDone = draft.instruments.filter(isInstrumentDone).length;
  const valveDone = draft.valves.filter(v => v.status === "completed").length;
  const total = draft.instruments.length + draft.valves.length;
  const completed = instrumentDone + valveDone;
  const flameAlarm = draft.instruments.some(i => i.checkType === "flame" && i.flameStatus === "Alarm");

  const remainingInstrument = draft.instruments.filter(i => !isInstrumentDone(i)).slice(0, 4).map(i => i.tag);
  const remainingValve = draft.valves.filter(v => v.status !== "completed").slice(0, 4).map(v => v.tag);

  app.innerHTML = `
    <section class="card">
      <div class="flex-between"><b>Overall Progress</b><span>${completed} / ${total}</span></div>
      <div class="progress-track"><div class="progress-bar" style="width:${total ? completed / total * 100 : 0}%"></div></div>
      <div class="muted">Last saved: ${formatTime(draft.lastSavedAt || draft.startedAt)}</div>
    </section>

    <div class="module-grid">
      <div class="module-card ${instrumentDone === draft.instruments.length ? "complete" : flameAlarm ? "alert" : ""}" id="instrumentModule">
        <div class="flex-between">
          <h3>📷 Instrument</h3>
          <span class="badge ${instrumentDone === draft.instruments.length ? "ok" : "warn"}">${instrumentDone}/${draft.instruments.length}</span>
        </div>
        <div class="number">${instrumentDone}/${draft.instruments.length}</div>
        <div class="muted">Measurement + Flame Detector</div>
        ${remainingInstrument.length ? `<div class="remaining">Remaining: ${remainingInstrument.map(escapeHtml).join(", ")}${draft.instruments.filter(i => !isInstrumentDone(i)).length > 4 ? " ..." : ""}</div>` : ""}
      </div>

      <div class="module-card ${valveDone === draft.valves.length ? "complete" : ""}" id="valveModule">
        <div class="flex-between">
          <h3>🚪 Valve Position</h3>
          <span class="badge ${valveDone === draft.valves.length ? "ok" : "warn"}">${valveDone}/${draft.valves.length}</span>
        </div>
        <div class="number">${valveDone}/${draft.valves.length}</div>
        <div class="muted">OPEN / CLOSE</div>
        ${remainingValve.length ? `<div class="remaining">Remaining: ${remainingValve.map(escapeHtml).join(", ")}${draft.valves.filter(v => v.status !== "completed").length > 4 ? " ..." : ""}</div>` : ""}
      </div>

      <div class="module-card" id="commentModule">
        <div class="flex-between">
          <h3>📝 Comment</h3>
          <span class="badge">${draft.comments.length}</span>
        </div>
        <div class="number">${draft.comments.length}</div>
        <div class="muted">เหตุการณ์ทั่วไป พร้อมรูปประกอบสูงสุด 5 รูปต่อรายการ</div>
      </div>
    </div>

    <button id="summaryButton">ดู Summary</button>
    <button class="secondary" id="changeSiteButton">เปลี่ยน Site</button>
  `;

  document.getElementById("instrumentModule").addEventListener("click", () => navigate("instruments"));
  document.getElementById("valveModule").addEventListener("click", () => navigate("valves"));
  document.getElementById("commentModule").addEventListener("click", () => navigate("comments"));
  document.getElementById("summaryButton").addEventListener("click", () => navigate("summary"));
  document.getElementById("changeSiteButton").addEventListener("click", () => navigate("sites"));
}

function renderInstruments() {
  const draft = currentDraft();
  pageTitle.textContent = "Instrument";

  const completed = draft.instruments.filter(isInstrumentDone).length;
  const total = draft.instruments.length;

  app.innerHTML = `
    <section class="card">
      <div class="flex-between">
        <b>Instrument Progress</b>
        <span>${completed} / ${total}</span>
      </div>
      <div class="progress-track">
        <div class="progress-bar" style="width:${total ? completed / total * 100 : 0}%"></div>
      </div>
      <div class="muted">รายการ Pending อยู่ด้านบนอัตโนมัติ</div>
    </section>
    <div id="instrumentList"></div>
  `;

  const list = document.getElementById("instrumentList");
  const sorted = pendingFirst(draft.instruments, isInstrumentDone);

  sorted.forEach(({ item, originalIndex }) => {
    const done = isInstrumentDone(item);
    let icon = "📷";
    let detail = "Pending";
    let css = done ? "completed" : "pending";

    if (item.checkType === "flame") {
      icon = item.flameStatus === "Alarm" ? "🔴" : item.flameStatus === "Normal" ? "🟢" : "🔥";
      detail = item.flameStatus || "Pending";
      if (item.flameComment) detail += ` • ${item.flameComment}`;
      if (item.flameStatus === "Alarm") css = "flame-alarm";
    } else if (item.status === "completed") {
      icon = "✅";
      detail = `${item.value} ${item.unit}`;
    } else if (item.status === "issue") {
      icon = "⚠️";
      detail = item.issueComment;
      css = "issue";
    }

    const card = document.createElement("div");
    card.className = `list-card ${css}`;
    card.innerHTML = `
      <div class="icon">${icon}</div>
      <div class="grow">
        <h3>${escapeHtml(item.tag)}</h3>
        <p>${escapeHtml(item.description || "")}${item.description ? " • " : ""}${escapeHtml(detail)}</p>
      </div>
      <span>›</span>
    `;

    card.addEventListener("click", () => {
      state.currentInstrumentIndex = originalIndex;
      if (item.checkType === "flame") navigate("flameCheck");
      else navigate("instrumentAction");
    });

    list.appendChild(card);
  });
}

function renderInstrumentAction() {
  const item = currentDraft().instruments[state.currentInstrumentIndex];
  pageTitle.textContent = item.tag;

  app.innerHTML = `
    <p class="muted">${escapeHtml(item.description || "")}${item.description ? " • " : ""}Unit: ${escapeHtml(item.unit)}</p>

    <label class="action-card">
      <h3>📷 ถ่ายรูปและอ่านค่าด้วย AI</h3>
      <p>เปิดกล้องหลังหรือเลือกรูปจากเครื่อง</p>
      <input id="instrumentPhoto" type="file" accept="image/*">
    </label>

    <div class="action-card" id="reportIssue">
      <h3>📝 ส่ง Comment แทนรูป</h3>
      <p>ใช้เมื่ออุปกรณ์เสีย จอดับ หรือเข้าถึงไม่ได้</p>
    </div>

    <button class="secondary" id="backToInstrumentList">กลับ</button>
  `;

  document.getElementById("instrumentPhoto").addEventListener("change", handleInstrumentPhoto);
  document.getElementById("reportIssue").addEventListener("click", () => navigate("instrumentIssue"));
  document.getElementById("backToInstrumentList").addEventListener("click", () => navigate("instruments"));
}

async function handleInstrumentPhoto(event) {
  const input = event.target;
  const file = input.files && input.files[0];

  if (!file) {
    notify("ไม่ได้เลือกรูป");
    return;
  }

  if (!file.type.startsWith("image/")) {
    notify("กรุณาเลือกไฟล์รูปภาพ");
    input.value = "";
    return;
  }

  try {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }

    state.previewUrl = URL.createObjectURL(file);
    notify("กำลังจำลอง AI อ่านค่า...");

    const item = currentDraft().instruments[state.currentInstrumentIndex];

    await new Promise(resolve => setTimeout(resolve, 500));

    const result = await API.analyzePhoto(file, item);

    if (!result || !result.ok) {
      notify("อ่านรูปไม่สำเร็จ กรุณาลองใหม่");
      return;
    }

    state.aiValue = result.value || "";
    navigate("instrumentReview");

  } catch (error) {
    console.error("Photo processing error:", error);
    notify("เกิดข้อผิดพลาดในการอ่านรูป");
  } finally {
    input.value = "";
  }
}

function renderInstrumentReview() {
  const item = currentDraft().instruments[state.currentInstrumentIndex];
  pageTitle.textContent = "ตรวจสอบผล AI";

  app.innerHTML = `
    ${state.previewUrl ? `<img class="photo-preview" src="${state.previewUrl}" alt="Instrument photo">` : ""}
    <section class="card">
      <div class="flex-between">
        <b>${escapeHtml(item.tag)}</b>
        <span class="badge ok">AI Confidence High</span>
      </div>
      <label>ค่าที่อ่านได้</label>
      <input id="readingValue" value="${escapeHtml(state.aiValue)}">
      <p><b>Unit:</b> ${escapeHtml(item.unit)}</p>
    </section>
    <div class="button-row">
      <button class="danger" id="retakeButton">Retake</button>
      <button id="confirmReadingButton">Confirm</button>
    </div>
  `;

  document.getElementById("retakeButton").addEventListener("click", () => navigate("instrumentAction"));
  document.getElementById("confirmReadingButton").addEventListener("click", () => {
    const value = document.getElementById("readingValue").value.trim();
    if (!value) {
      notify("กรุณาตรวจสอบค่าที่อ่านได้");
      return;
    }

    Object.assign(item, {
      status: "completed",
      value,
      issueComment: ""
    });
    saveDraft();
    notify("✓ Saved");
    navigate("instruments");
    scrollToTopSoon();
  });
}

function renderInstrumentIssue() {
  const item = currentDraft().instruments[state.currentInstrumentIndex];
  pageTitle.textContent = `แจ้งปัญหา ${item.tag}`;

  app.innerHTML = `
    <section class="card">
      <label>รายละเอียด</label>
      <textarea id="issueText" placeholder="เช่น Display ไม่ติด แจ้ง Maintenance แล้ว">${escapeHtml(item.issueComment || "")}</textarea>
    </section>
    <button class="warning" id="saveIssueButton">บันทึก Comment แทนรูป</button>
    <button class="secondary" id="cancelIssueButton">กลับ</button>
  `;

  document.getElementById("saveIssueButton").addEventListener("click", () => {
    const text = document.getElementById("issueText").value.trim();
    if (!text) {
      notify("กรุณาใส่รายละเอียด");
      return;
    }

    Object.assign(item, {
      status: "issue",
      value: "",
      issueComment: text
    });
    saveDraft();
    notify("✓ Saved");
    navigate("instruments");
    scrollToTopSoon();
  });

  document.getElementById("cancelIssueButton").addEventListener("click", () => navigate("instrumentAction"));
}

function renderFlameCheck() {
  const item = currentDraft().instruments[state.currentInstrumentIndex];
  pageTitle.textContent = item.tag;

  app.innerHTML = `
    <section class="status-card ${item.flameStatus === "Normal" ? "normal" : item.flameStatus === "Alarm" ? "alarm" : ""}">
      <h3>${escapeHtml(item.description || item.tag)}</h3>
      <p class="muted">Current Status</p>
      <div class="segmented">
        <button class="normal ${item.flameStatus === "Normal" ? "active" : ""}" data-status="Normal">🟢 Normal</button>
        <button class="alarm ${item.flameStatus === "Alarm" ? "active" : ""}" data-status="Alarm">🔴 Alarm</button>
      </div>
      <div id="flameCommentArea" class="${item.flameStatus === "Alarm" ? "" : "hidden"}">
        <label>Comment (Required เมื่อ Alarm)</label>
        <textarea id="flameComment" placeholder="รายละเอียด Alarm">${escapeHtml(item.flameComment || "")}</textarea>
        <button id="saveFlameComment">บันทึก Comment</button>
      </div>
    </section>
    <button class="secondary" id="backFromFlame">กลับ</button>
  `;

  document.querySelectorAll("[data-status]").forEach(button => {
    button.addEventListener("click", () => {
      const selected = button.dataset.status;

      if (selected === "Normal") {
        item.flameStatus = "Normal";
        item.flameComment = "";
        saveDraft();
        notify("✓ Normal saved");
        navigate("instruments");
        scrollToTopSoon();
      } else {
        item.flameStatus = "Alarm";
        saveDraft();
        renderFlameCheck();
      }
    });
  });

  const saveComment = document.getElementById("saveFlameComment");
  if (saveComment) {
    saveComment.addEventListener("click", () => {
      const text = document.getElementById("flameComment").value.trim();
      if (!text) {
        notify("Alarm ต้องใส่ Comment");
        return;
      }
      item.flameStatus = "Alarm";
      item.flameComment = text;
      saveDraft();
      notify("✓ Alarm saved");
      navigate("instruments");
      scrollToTopSoon();
    });
  }

  document.getElementById("backFromFlame").addEventListener("click", () => navigate("instruments"));
}

function renderValves() {
  const draft = currentDraft();
  pageTitle.textContent = "Valve Position";

  const completed = draft.valves.filter(item => item.status === "completed").length;
  const total = draft.valves.length;

  app.innerHTML = `
    <section class="card">
      <div class="flex-between">
        <b>Valve Progress</b>
        <span>${completed} / ${total}</span>
      </div>
      <div class="progress-track">
        <div class="progress-bar" style="width:${total ? completed / total * 100 : 0}%"></div>
      </div>
      <div class="muted">Pending อยู่ด้านบน • OPEN สีเขียว • CLOSE สีแดง</div>
    </section>
    <div id="valveList"></div>
  `;

  const list = document.getElementById("valveList");
  const sorted = pendingFirst(draft.valves, item => item.status === "completed");

  sorted.forEach(({ item, originalIndex }) => {
    const card = document.createElement("section");
    card.className = `status-card ${item.position === "OPEN" ? "open" : item.position === "CLOSE" ? "close" : ""}`;
    card.innerHTML = `
      <h3>${escapeHtml(item.tag)}</h3>
      <p class="muted">${escapeHtml(item.description || "")}</p>
      <div class="segmented">
        <button class="open ${item.position === "OPEN" ? "active" : ""}" data-position="OPEN">🟢 OPEN</button>
        <button class="close ${item.position === "CLOSE" ? "active" : ""}" data-position="CLOSE">🔴 CLOSE</button>
      </div>
    `;

    card.querySelectorAll("[data-position]").forEach(button => {
      button.addEventListener("click", () => {
        draft.valves[originalIndex].position = button.dataset.position;
        draft.valves[originalIndex].status = "completed";
        saveDraft();
        notify(`${item.tag}: ${button.dataset.position}`);
        renderValves();
        scrollToTopSoon();
      });
    });

    list.appendChild(card);
  });
}

function renderComments() {
  const draft = currentDraft();
  pageTitle.textContent = "Comment";

  app.innerHTML = `
    <button id="addCommentButton">+ Add Comment</button>
    <div id="commentList"></div>
  `;

  document.getElementById("addCommentButton").addEventListener("click", () => {
    state.editingCommentId = null;
    state.pendingCommentImages = [];
    navigate("commentEditor");
  });

  const list = document.getElementById("commentList");

  if (!draft.comments.length) {
    list.innerHTML = `<div class="empty-state">ยังไม่มี Comment ในรอบตรวจนี้</div>`;
    return;
  }

  draft.comments.forEach((comment, index) => {
    const card = document.createElement("section");
    card.className = "comment-card";
    card.innerHTML = `
      <div class="flex-between">
        <h3>Comment #${index + 1}</h3>
        <span class="badge">${comment.images.length} รูป</span>
      </div>
      <p>${escapeHtml(comment.text)}</p>
      <div class="thumbnail-grid">
        ${comment.images.map(image => `<div class="thumb"><img src="${image.dataUrl}" alt="Comment image"></div>`).join("")}
      </div>
      <div class="button-row">
        <button class="outline edit-comment">แก้ไข</button>
        <button class="danger delete-comment">ลบ</button>
      </div>
    `;

    card.querySelector(".edit-comment").addEventListener("click", () => {
      state.editingCommentId = comment.id;
      state.pendingCommentImages = [...comment.images];
      navigate("commentEditor");
    });

    card.querySelector(".delete-comment").addEventListener("click", () => {
      if (confirm("ลบ Comment นี้หรือไม่?")) {
        draft.comments = draft.comments.filter(c => c.id !== comment.id);
        saveDraft();
        notify("ลบ Comment แล้ว");
        renderComments();
      }
    });

    list.appendChild(card);
  });
}

function renderCommentEditor() {
  const draft = currentDraft();
  const existing = state.editingCommentId
    ? draft.comments.find(c => c.id === state.editingCommentId)
    : null;

  pageTitle.textContent = existing ? "แก้ไข Comment" : "เพิ่ม Comment";
  if (existing && !state.pendingCommentImages.length) {
    state.pendingCommentImages = [...existing.images];
  }

  app.innerHTML = `
    <section class="card">
      <label>รายละเอียด</label>
      <textarea id="commentText" placeholder="เช่น พบกลิ่นก๊าซบริเวณ Tank A">${escapeHtml(existing?.text || "")}</textarea>

      <label>แนบรูป (สูงสุด 5 รูป)</label>
      <input id="commentImages" type="file" accept="image/*" capture="environment" multiple>
      <div class="image-count" id="imageCount">${state.pendingCommentImages.length} / 5 รูป</div>
      <div class="thumbnail-grid" id="pendingImageGrid"></div>
    </section>

    <button id="saveCommentButton">บันทึก Comment</button>
    <button class="secondary" id="cancelCommentButton">ยกเลิก</button>
  `;

  renderPendingImageGrid();

  document.getElementById("commentImages").addEventListener("change", async event => {
    const files = Array.from(event.target.files || []);
    const available = 5 - state.pendingCommentImages.length;

    if (files.length > available) {
      notify(`เพิ่มได้อีกสูงสุด ${available} รูป`);
    }

    for (const file of files.slice(0, available)) {
      const dataUrl = await resizeImage(file, 1000, 0.72);
      state.pendingCommentImages.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        name: file.name,
        dataUrl
      });
    }

    renderPendingImageGrid();
    event.target.value = "";
  });

  document.getElementById("saveCommentButton").addEventListener("click", () => {
    const text = document.getElementById("commentText").value.trim();
    if (!text) {
      notify("กรุณาใส่รายละเอียด");
      return;
    }

    const comment = {
      id: existing?.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
      text,
      images: [...state.pendingCommentImages],
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      const index = draft.comments.findIndex(c => c.id === existing.id);
      draft.comments[index] = comment;
    } else {
      draft.comments.push(comment);
    }

    try {
      saveDraft();
      notify("✓ Comment saved");
      state.editingCommentId = null;
      state.pendingCommentImages = [];
      navigate("comments");
    } catch {
      notify("รูปมีขนาดใหญ่เกินพื้นที่จัดเก็บ");
    }
  });

  document.getElementById("cancelCommentButton").addEventListener("click", () => {
    state.editingCommentId = null;
    state.pendingCommentImages = [];
    navigate("comments");
  });
}

function renderPendingImageGrid() {
  const grid = document.getElementById("pendingImageGrid");
  const count = document.getElementById("imageCount");
  if (!grid || !count) return;

  count.textContent = `${state.pendingCommentImages.length} / 5 รูป`;
  grid.innerHTML = "";

  state.pendingCommentImages.forEach(image => {
    const thumb = document.createElement("div");
    thumb.className = "thumb";
    thumb.innerHTML = `<img src="${image.dataUrl}" alt="Selected image"><button type="button">✕</button>`;
    thumb.querySelector("button").addEventListener("click", () => {
      state.pendingCommentImages = state.pendingCommentImages.filter(i => i.id !== image.id);
      renderPendingImageGrid();
    });
    grid.appendChild(thumb);
  });
}

function renderSummary() {
  const draft = currentDraft();
  pageTitle.textContent = "Summary ก่อน Submit";

  const instrumentRows = draft.instruments.map(item => {
    let icon = "⬜";
    let detail = "ยังไม่ตรวจ";

    if (item.checkType === "flame" && item.flameStatus) {
      icon = item.flameStatus === "Alarm" ? "🔴" : "🟢";
      detail = item.flameStatus + (item.flameComment ? `: ${item.flameComment}` : "");
    } else if (item.status === "completed") {
      icon = "✅";
      detail = `${item.value} ${item.unit}`;
    } else if (item.status === "issue") {
      icon = "⚠️";
      detail = item.issueComment;
    }

    return `<div class="summary-row"><b>${icon} ${escapeHtml(item.tag)}</b><span>${escapeHtml(detail)}</span></div>`;
  }).join("");

  const valveRows = draft.valves.map(item => {
    const icon = item.position === "OPEN" ? "🟢" : item.position === "CLOSE" ? "🔴" : "⬜";
    return `<div class="summary-row"><b>${icon} ${escapeHtml(item.tag)}</b><span>${escapeHtml(item.position || "ยังไม่ตรวจ")}</span></div>`;
  }).join("");

  const commentRows = draft.comments.length
    ? draft.comments.map((comment, index) =>
        `<div class="summary-row"><b>📝 Comment #${index + 1}</b><span>${escapeHtml(comment.text)}\n${comment.images.length} รูป</span></div>`
      ).join("")
    : `<div class="summary-row"><span>ไม่มี Comment</span></div>`;

  app.innerHTML = `
    <div class="summary-section-title">Instrument</div>
    <section class="card">${instrumentRows}</section>

    <div class="summary-section-title">Valve Position</div>
    <section class="card">${valveRows}</section>

    <div class="summary-section-title">Comments</div>
    <section class="card">${commentRows}</section>

    <button id="submitButton">Submit Checksheet</button>
    <button class="secondary" id="backToOverview">กลับไปแก้ไข</button>
  `;

  document.getElementById("submitButton").addEventListener("click", async () => {
    const missingInstrument = draft.instruments.filter(i => !isInstrumentDone(i)).length;
    const missingValve = draft.valves.filter(v => v.status !== "completed").length;
    const flameAlarmWithoutComment = draft.instruments.some(
      i => i.checkType === "flame" && i.flameStatus === "Alarm" && !i.flameComment
    );

    if (missingInstrument + missingValve > 0) {
      notify(`ยังเหลือ ${missingInstrument + missingValve} รายการ`);
      return;
    }

    if (flameAlarmWithoutComment) {
      notify("Flame Alarm ต้องมี Comment");
      return;
    }

    const button = document.getElementById("submitButton");
    button.disabled = true;
    button.textContent = "Submitting...";

    const result = await API.submitChecksheet({
      ...draft,
      submittedAt: new Date().toISOString()
    });

    if (result.ok) {
      notify("Submitted สำเร็จ");
      button.textContent = "Submitted";
    } else {
      button.disabled = false;
      button.textContent = "Submit Checksheet";
      notify("Submit ไม่สำเร็จ");
    }
  });

  document.getElementById("backToOverview").addEventListener("click", () => navigate("overview"));
}

function resizeImage(file, maxDimension, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      image.onerror = reject;
      image.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatTime(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("th-TH", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  } catch {
    return value;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

bottomNav.addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (button) navigate(button.dataset.page);
});

render();

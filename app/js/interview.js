// ============================================================
// interview.js — Interview Guide Module
// ============================================================

const Interview = {
  render(container) {
    const audit = App.getCurrentAudit();
    if (!audit) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No audit selected</div>
          <div class="empty-state-desc">Create or select an audit from the dashboard</div>
          <button class="btn btn-primary" onclick="App.showNewAuditModal()">New Audit</button>
        </div>`;
      return;
    }

    // Count completed questions (ones with notes)
    const totalQ = audit.interview.sections.reduce((s, sec) => s + sec.questions.length, 0);
    const doneQ = audit.interview.sections.reduce((s, sec) =>
      s + sec.questions.filter(q => q.notes.trim()).length, 0);
    const pct = totalQ ? Math.round((doneQ / totalQ) * 100) : 0;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Interview Guide</h1>
          <p class="page-subtitle">Structured Q&A across 6 functional areas (45 min total)</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">${doneQ}/${totalQ} questions answered</div>
          <div class="progress-bar-wrap" style="width:200px;">
            <div class="progress-bar" style="width:${pct}%;"></div>
          </div>
        </div>
      </div>

      ${INTERVIEW_SECTIONS.map((sec, si) => {
        const auditSec = audit.interview.sections[si];
        const secDone = auditSec.questions.filter(q => q.notes.trim()).length;
        const secTotal = auditSec.questions.length;
        return `
          <div class="card" style="margin-bottom:16px;">
            <div class="collapsible-header" onclick="Interview.toggle(${si})" id="interview-header-${si}">
              <div style="display:flex;align-items:center;gap:12px;">
                <span style="background:var(--primary-light);color:var(--primary);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">
                  ${sec.id}
                </span>
                <div>
                  <div style="font-weight:600;">${sec.title} <span style="color:var(--text-muted);font-weight:400;">— ${sec.subtitle}</span></div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${sec.duration} &bull; ${secDone}/${secTotal} answered</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                ${secDone === secTotal && secTotal > 0 ? '<span class="status-badge status-PASS">Done</span>' : ''}
                <svg class="chevron" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8l4 4 4-4"/></svg>
              </div>
            </div>
            <div class="collapsible-body" id="interview-body-${si}">
              ${sec.questions.map((q, qi) => `
                <div style="margin-bottom:16px;${qi > 0 ? 'padding-top:16px;border-top:1px solid var(--border);' : ''}">
                  <div style="display:flex;gap:8px;margin-bottom:8px;">
                    <span style="color:var(--primary);font-weight:700;font-size:0.85rem;">${qi + 1}.</span>
                    <span style="font-size:0.9rem;">${q}</span>
                  </div>
                  <textarea
                    placeholder="Notes..."
                    rows="2"
                    onchange="Interview.saveNote(${si}, ${qi}, this.value)"
                  >${App.escapeHtml(auditSec.questions[qi].notes)}</textarea>
                </div>
              `).join('')}
            </div>
          </div>`;
      }).join('')}
    `;
  },

  toggle(index) {
    const header = document.getElementById(`interview-header-${index}`);
    const body = document.getElementById(`interview-body-${index}`);
    header.classList.toggle('open');
    body.classList.toggle('open');
  },

  saveNote(sectionIndex, questionIndex, value) {
    const audit = App.getCurrentAudit();
    if (!audit) return;
    audit.interview.sections[sectionIndex].questions[questionIndex].notes = value;
    App.saveAudit(audit);
  }
};

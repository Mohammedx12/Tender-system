// ============================================================
// scoring.js — Scoring Rubric Module
// ============================================================

const Scoring = {
  render(container) {
    const audit = App.getCurrentAudit();
    if (!audit) {
      container.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <div class="empty-state-title">No audit selected</div>
          <div class="empty-state-desc">Create or select an audit from the dashboard</div>
          <button class="btn btn-primary" onclick="App.showNewAuditModal()">New Audit</button>
        </div>`;
      return;
    }

    const tier = TIER_CONFIG[audit.scoring.tier];
    const score = audit.scoring.totalScore;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Scoring Rubric</h1>
          <p class="page-subtitle">10-category weighted assessment (0–100)</p>
        </div>
      </div>

      <div class="score-gauge">
        <div class="score-gauge-tier">
          <span class="tier-badge tier-${audit.scoring.tier}" style="font-size:1rem;padding:6px 16px;">
            ${audit.scoring.tier}
          </span>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;max-width:140px;text-align:center;">
            ${tier.description}
          </div>
        </div>
        <div class="score-gauge-bar-wrap">
          <div class="score-gauge-bar" style="width:${score}%;background:${tier.color};"></div>
        </div>
        <div class="score-gauge-value" style="color:${tier.color};">${score}</div>
      </div>

      <div id="scoring-rows">
        ${audit.scoring.categories.map((cat, i) => this.renderRow(cat, i, audit)).join('')}
      </div>

      <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end;">
        <button class="btn btn-secondary" onclick="Scoring.markComplete()">
          ${audit.status === 'completed' ? 'Mark In-Progress' : 'Mark Complete'}
        </button>
      </div>
    `;
  },

  renderRow(cat, index, audit) {
    const def = SCORING_CATEGORIES[index];
    const score = cat.score ?? 0;
    const weighted = Math.round(((cat.score ?? 0) / 5) * def.weight * 10) / 10;

    return `
      <div class="scoring-row" id="scoring-row-${index}">
        <div class="scoring-row-main">
          <div>
            <div class="scoring-row-name">${def.name}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${def.measures}</div>
          </div>
          <div class="scoring-row-weight">wt: ${def.weight}</div>
          <div>
            <select onchange="Scoring.updateScore(${index}, this.value)" style="width:100%;">
              ${[0,1,2,3,4,5].map(v => `
                <option value="${v}" ${v === (cat.score ?? 0) ? 'selected' : ''}>
                  ${v} — ${def.levels[v].split(';')[0].substring(0, 30)}${def.levels[v].length > 30 ? '...' : ''}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="scoring-row-weighted" style="color:${weighted >= def.weight * 0.8 ? 'var(--green)' : weighted >= def.weight * 0.6 ? 'var(--amber)' : 'var(--red)'}">
            ${weighted}/${def.weight}
          </div>
          <button class="btn-icon" onclick="Scoring.toggleDetails(${index})" title="Details">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 5l5 5 5-5"/></svg>
          </button>
        </div>
        <div class="scoring-row-details" id="scoring-details-${index}">
          <div style="margin-bottom:12px;padding:10px;background:#f8fafc;border-radius:6px;">
            <strong style="font-size:0.8rem;color:var(--text-secondary);">Maturity Level ${cat.score ?? 0}:</strong>
            <div style="font-size:0.85rem;margin-top:4px;">${def.levels[cat.score ?? 0]}</div>
          </div>
          <div class="detail-grid">
            <div class="form-group">
              <label>Evidence / Notes</label>
              <textarea onchange="Scoring.updateField(${index},'notes',this.value)" placeholder="Evidence observed...">${App.escapeHtml(cat.notes)}</textarea>
            </div>
            <div class="form-group">
              <label>Remediation Action</label>
              <textarea onchange="Scoring.updateField(${index},'remediation',this.value)" placeholder="What needs to be fixed...">${App.escapeHtml(cat.remediation)}</textarea>
            </div>
            <div class="form-group">
              <label>Owner</label>
              <input type="text" value="${App.escapeHtml(cat.owner)}" onchange="Scoring.updateField(${index},'owner',this.value)" placeholder="Who is responsible?">
            </div>
            <div class="form-group">
              <label>Target Date</label>
              <input type="date" value="${cat.targetDate}" onchange="Scoring.updateField(${index},'targetDate',this.value)">
            </div>
          </div>
        </div>
      </div>`;
  },

  toggleDetails(index) {
    const details = document.getElementById(`scoring-details-${index}`);
    details.classList.toggle('open');
  },

  updateScore(index, value) {
    const audit = App.getCurrentAudit();
    if (!audit) return;
    audit.scoring.categories[index].score = parseInt(value);
    App.recalcScore(audit);
    App.saveAudit(audit);
    this.render(document.getElementById('main-content'));
    App.updateAuditBar();
  },

  updateField(index, field, value) {
    const audit = App.getCurrentAudit();
    if (!audit) return;
    audit.scoring.categories[index][field] = value;
    App.saveAudit(audit);
  },

  markComplete() {
    const audit = App.getCurrentAudit();
    if (!audit) return;
    audit.status = audit.status === 'completed' ? 'in-progress' : 'completed';
    App.saveAudit(audit);
    App.toast(audit.status === 'completed' ? 'Audit marked complete' : 'Audit reopened');
    this.render(document.getElementById('main-content'));
    App.updateAuditBar();
  }
};

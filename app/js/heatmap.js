// ============================================================
// heatmap.js — DQ Risk Heatmap Module
// ============================================================

const Heatmap = {
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

    // Calculate area risk scores
    const areaData = this.calcAreaScores(audit);
    const signal = audit.heatmap.overallSignal;
    const signalCfg = TIER_CONFIG[signal];
    const signalDesc = {
      GREEN: 'Proceed — maintain evidence links',
      AMBER: 'Fix within 48-72 hours and re-check',
      RED: 'Stop submission until fixes are done'
    };

    const failCount = audit.heatmap.checks.filter(c => c.status === 'FAIL').length;
    const passCount = audit.heatmap.checks.filter(c => c.status === 'PASS').length;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">DQ Risk Heatmap</h1>
          <p class="page-subtitle">Pre-submission disqualification risk checker — ${DQ_CHECKS.length} checks across ${Object.keys(areaData).length} risk areas</p>
        </div>
      </div>

      <div class="signal-box signal-${signal}">
        <div class="signal-box-label">Overall Signal</div>
        <div class="signal-box-value">${signal === 'GREEN' ? 'GO' : signal === 'AMBER' ? 'CAUTION' : 'NO-GO'}</div>
        <div class="signal-box-desc">${signalDesc[signal]}</div>
      </div>

      <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px;">
        <div class="stat-card" style="border-left:3px solid var(--green);">
          <div class="stat-card-label">Pass</div>
          <div class="stat-card-value" style="color:var(--green);">${passCount}</div>
        </div>
        <div class="stat-card" style="border-left:3px solid var(--red);">
          <div class="stat-card-label">Fail</div>
          <div class="stat-card-value" style="color:var(--red);">${failCount}</div>
        </div>
        <div class="stat-card" style="border-left:3px solid #94a3b8;">
          <div class="stat-card-label">N/A</div>
          <div class="stat-card-value" style="color:#64748b;">${audit.heatmap.checks.filter(c => c.status === 'NA').length}</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:24px;">
        <div class="card-header">Risk by Area</div>
        <div class="card-body">
          <div class="heatmap-grid">
            ${Object.entries(areaData).map(([area, data]) => {
              const level = getRiskLevel(data.score);
              const cfg = TIER_CONFIG[level];
              return `
                <div class="heatmap-cell" style="background:${cfg.bg};border-color:${cfg.color};color:${cfg.color};">
                  <div class="heatmap-cell-label">${area}</div>
                  <div class="heatmap-cell-score">${Math.round(data.score)}</div>
                  <div style="font-size:0.7rem;">${level}</div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">Detailed Checks</div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th style="width:30px;">#</th>
                <th>Risk Area</th>
                <th>Check</th>
                <th style="width:100px;">Status</th>
                <th style="width:90px;">Severity</th>
                <th style="width:140px;">Owner</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${DQ_CHECKS.map((check, i) => {
                const c = audit.heatmap.checks[i];
                return `
                  <tr>
                    <td style="color:var(--text-muted);">${i + 1}</td>
                    <td style="font-size:0.8rem;font-weight:600;white-space:nowrap;">${check.area}</td>
                    <td style="font-size:0.85rem;">${check.check}</td>
                    <td>
                      <select onchange="Heatmap.updateStatus(${i}, this.value)" style="width:100%;">
                        ${['NA', 'PASS', 'FAIL'].map(s =>
                          `<option value="${s}" ${c.status === s ? 'selected' : ''}>${s}</option>`
                        ).join('')}
                      </select>
                    </td>
                    <td>
                      <select onchange="Heatmap.updateSeverity(${i}, this.value)" style="width:100%;">
                        ${[1,2,3,4,5].map(v =>
                          `<option value="${v}" ${c.severity === v ? 'selected' : ''}>${v}</option>`
                        ).join('')}
                      </select>
                    </td>
                    <td>
                      <input type="text" value="${App.escapeHtml(c.owner)}"
                        onchange="Heatmap.updateField(${i}, 'owner', this.value)"
                        placeholder="Owner" style="font-size:0.85rem;">
                    </td>
                    <td>
                      <input type="text" value="${App.escapeHtml(c.notes)}"
                        onchange="Heatmap.updateField(${i}, 'notes', this.value)"
                        placeholder="Notes" style="font-size:0.85rem;">
                    </td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  calcAreaScores(audit) {
    const areas = {};
    audit.heatmap.checks.forEach((check, i) => {
      const area = DQ_CHECKS[i].area;
      if (!areas[area]) areas[area] = { failSeverity: 0, count: 0 };
      areas[area].count++;
      if (check.status === 'FAIL') areas[area].failSeverity += check.severity;
    });
    for (const area of Object.keys(areas)) {
      areas[area].score = (areas[area].failSeverity / (areas[area].count * 5)) * 100;
    }
    return areas;
  },

  updateStatus(index, value) {
    const audit = App.getCurrentAudit();
    if (!audit) return;
    audit.heatmap.checks[index].status = value;
    App.recalcHeatmap(audit);
    App.saveAudit(audit);
    this.render(document.getElementById('main-content'));
  },

  updateSeverity(index, value) {
    const audit = App.getCurrentAudit();
    if (!audit) return;
    audit.heatmap.checks[index].severity = parseInt(value);
    App.recalcHeatmap(audit);
    App.saveAudit(audit);
    this.render(document.getElementById('main-content'));
  },

  updateField(index, field, value) {
    const audit = App.getCurrentAudit();
    if (!audit) return;
    audit.heatmap.checks[index][field] = value;
    App.saveAudit(audit);
  }
};

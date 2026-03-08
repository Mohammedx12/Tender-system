// ============================================================
// report.js — Report Generation Module
// ============================================================

const Report = {
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

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Reports</h1>
          <p class="page-subtitle">Generate and print audit reports for ${App.escapeHtml(audit.clientName)}</p>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:24px;">
        <div class="card" style="cursor:pointer;" onclick="Report.show('summary')">
          <div class="card-body" style="text-align:center;padding:32px;">
            <svg width="40" height="40" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v32a2 2 0 002 2h24a2 2 0 002-2V16l-12-14z"/><path d="M14 2v14h12M18 24H10M26 30H10M14 18H10"/></svg>
            <div style="font-weight:700;font-size:1.1rem;margin-top:12px;">1-Page Summary</div>
            <div style="color:var(--text-muted);font-size:0.85rem;margin-top:4px;">Score, tier, top gaps, immediate actions</div>
            <button class="btn btn-primary" style="margin-top:16px;">Generate Summary</button>
          </div>
        </div>
        <div class="card" style="cursor:pointer;" onclick="Report.show('full')">
          <div class="card-body" style="text-align:center;padding:32px;">
            <svg width="40" height="40" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v32a2 2 0 002 2h24a2 2 0 002-2V16l-12-14z"/><path d="M14 2v14h12"/><path d="M10 24h16M10 30h12M10 18h8"/></svg>
            <div style="font-weight:700;font-size:1.1rem;margin-top:12px;">Full Audit Report</div>
            <div style="color:var(--text-muted);font-size:0.85rem;margin-top:4px;">Detailed findings, category analysis, 30/60/90-day roadmap</div>
            <button class="btn btn-primary" style="margin-top:16px;">Generate Full Report</button>
          </div>
        </div>
      </div>

      <div id="report-output"></div>
    `;
  },

  show(type) {
    const audit = App.getCurrentAudit();
    if (!audit) return;
    const output = document.getElementById('report-output');

    if (type === 'summary') {
      output.innerHTML = this.generateSummary(audit);
    } else {
      output.innerHTML = this.generateFull(audit);
    }
  },

  generateSummary(audit) {
    const tier = TIER_CONFIG[audit.scoring.tier];
    const topGaps = this.getTopGaps(audit);
    const quickWins = this.getQuickWins(audit);

    return `
      <div class="report-container">
        <div style="display:flex;justify-content:flex-end;margin-bottom:16px;" class="no-print">
          <button class="btn btn-primary" onclick="window.print()">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h8v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h12a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="8" height="4"/></svg>
            Print
          </button>
        </div>

        <div class="report-header">
          <h1>Tender Readiness Audit</h1>
          <div style="color:var(--text-secondary);font-size:1rem;">1-Page Summary</div>
          <div style="margin-top:8px;font-size:0.9rem;">
            <strong>${App.escapeHtml(audit.clientName)}</strong> &bull; ${App.escapeHtml(audit.sector)} &bull; ${audit.auditDate}
          </div>
          <div class="report-score" style="background:${tier.bg};color:${tier.color};border:2px solid ${tier.color};">
            ${audit.scoring.totalScore}/100
          </div>
          <div>
            <span class="tier-badge tier-${audit.scoring.tier}" style="font-size:1rem;padding:6px 20px;">${audit.scoring.tier}</span>
          </div>
          <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:8px;">${tier.description}</div>
        </div>

        <h2>Score Breakdown</h2>
        <table>
          <thead>
            <tr><th>Category</th><th style="text-align:center;">Score</th><th style="text-align:center;">Weighted</th></tr>
          </thead>
          <tbody>
            ${audit.scoring.categories.map((cat, i) => {
              const def = SCORING_CATEGORIES[i];
              const weighted = Math.round(((cat.score ?? 0) / 5) * def.weight * 10) / 10;
              return `<tr>
                <td>${def.name}</td>
                <td style="text-align:center;">${cat.score ?? 0}/5</td>
                <td style="text-align:center;font-weight:700;">${weighted}/${def.weight}</td>
              </tr>`;
            }).join('')}
            <tr style="font-weight:700;border-top:2px solid var(--border);">
              <td>TOTAL</td>
              <td></td>
              <td style="text-align:center;color:${tier.color};">${audit.scoring.totalScore}/100</td>
            </tr>
          </tbody>
        </table>

        <h2>Top 3 Gaps</h2>
        <ol>
          ${topGaps.map(g => `<li style="margin-bottom:6px;">${g}</li>`).join('')}
        </ol>

        <h2>Immediate Actions (Quick Wins)</h2>
        <ul>
          ${quickWins.map(w => `<li style="margin-bottom:6px;">${w}</li>`).join('')}
        </ul>

        <h2>Evidence Status</h2>
        <div style="display:flex;gap:24px;margin-top:8px;">
          <div><strong style="color:var(--green);">${audit.evidence.filter(e => e.status === 'YES').length}</strong> Provided</div>
          <div><strong style="color:var(--amber);">${audit.evidence.filter(e => e.status === 'PARTIAL').length}</strong> Partial</div>
          <div><strong style="color:var(--red);">${audit.evidence.filter(e => e.status === 'NO').length}</strong> Missing</div>
          <div><strong style="color:#64748b;">${audit.evidence.filter(e => e.status === 'PENDING').length}</strong> Pending</div>
        </div>

        <h2>DQ Risk Signal</h2>
        <div style="padding:12px;border-radius:8px;background:${TIER_CONFIG[audit.heatmap.overallSignal].bg};color:${TIER_CONFIG[audit.heatmap.overallSignal].color};font-weight:700;text-align:center;font-size:1.2rem;border:2px solid ${TIER_CONFIG[audit.heatmap.overallSignal].color};">
          ${audit.heatmap.overallSignal === 'GREEN' ? 'GO' : audit.heatmap.overallSignal === 'AMBER' ? 'CAUTION' : 'NO-GO'}
          — ${audit.heatmap.checks.filter(c => c.status === 'FAIL').length} failing checks
        </div>

        <div style="margin-top:32px;text-align:center;color:var(--text-muted);font-size:0.8rem;">
          Generated by Tender Readiness Audit System &bull; ${new Date().toLocaleDateString()}
        </div>
      </div>`;
  },

  generateFull(audit) {
    const tier = TIER_CONFIG[audit.scoring.tier];
    const topGaps = this.getTopGaps(audit);
    const quickWins = this.getQuickWins(audit);

    return `
      <div class="report-container">
        <div style="display:flex;justify-content:flex-end;margin-bottom:16px;" class="no-print">
          <button class="btn btn-primary" onclick="window.print()">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h8v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h12a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="8" height="4"/></svg>
            Print
          </button>
        </div>

        <div class="report-header">
          <h1>Tender Readiness Audit Report</h1>
          <div style="color:var(--text-secondary);">Comprehensive Assessment</div>
          <div style="margin-top:8px;font-size:0.9rem;">
            <strong>${App.escapeHtml(audit.clientName)}</strong> &bull; ${App.escapeHtml(audit.sector)} &bull; ${audit.auditDate}
          </div>
        </div>

        <h2>1. Executive Summary</h2>
        <p>This report presents the findings of a Tender Readiness Audit conducted for <strong>${App.escapeHtml(audit.clientName)}</strong> on ${audit.auditDate}.</p>
        <div style="margin:16px 0;text-align:center;">
          <div class="report-score" style="background:${tier.bg};color:${tier.color};border:2px solid ${tier.color};">
            ${audit.scoring.totalScore}/100
          </div>
          <div><span class="tier-badge tier-${audit.scoring.tier}" style="font-size:1rem;padding:6px 20px;">${audit.scoring.tier}</span></div>
          <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:8px;">${tier.description}</div>
        </div>

        <h2>2. Detailed Findings by Category</h2>
        ${audit.scoring.categories.map((cat, i) => {
          const def = SCORING_CATEGORIES[i];
          const weighted = Math.round(((cat.score ?? 0) / 5) * def.weight * 10) / 10;
          const level = (cat.score ?? 0) >= 4 ? 'GREEN' : (cat.score ?? 0) >= 3 ? 'AMBER' : 'RED';
          return `
            <h3>${def.name} <span class="tier-badge tier-${level}" style="font-size:0.7rem;">${cat.score ?? 0}/5 (${weighted}/${def.weight})</span></h3>
            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:6px;"><em>${def.measures}</em></p>
            <p><strong>Maturity Level:</strong> ${def.levels[cat.score ?? 0]}</p>
            ${cat.notes ? `<p><strong>Evidence/Notes:</strong> ${App.escapeHtml(cat.notes)}</p>` : ''}
            ${cat.remediation ? `<p><strong>Remediation:</strong> ${App.escapeHtml(cat.remediation)} ${cat.owner ? `(Owner: ${App.escapeHtml(cat.owner)})` : ''} ${cat.targetDate ? `— Target: ${cat.targetDate}` : ''}</p>` : ''}
          `;
        }).join('')}

        <h2>3. Top Gaps</h2>
        <ol>${topGaps.map(g => `<li style="margin-bottom:8px;">${g}</li>`).join('')}</ol>

        <h2>4. Quick Wins</h2>
        <ul>${quickWins.map(w => `<li style="margin-bottom:6px;">${w}</li>`).join('')}</ul>

        <h2>5. Evidence Status</h2>
        <table>
          <thead><tr><th>Category</th><th>Document</th><th>Status</th></tr></thead>
          <tbody>
            ${EVIDENCE_CATEGORIES.map(cat => {
              const items = audit.evidence.filter(e => e.categoryId === cat.id);
              return items.map(item => {
                const def = cat.items.find(d => d.id === item.id);
                return `<tr>
                  <td>${cat.category}</td>
                  <td style="font-size:0.85rem;">${def ? def.document : ''}</td>
                  <td><span class="status-badge status-${item.status}">${item.status}</span></td>
                </tr>`;
              }).join('');
            }).join('')}
          </tbody>
        </table>

        <h2>6. DQ Risk Assessment</h2>
        <div style="margin-bottom:16px;padding:12px;border-radius:8px;background:${TIER_CONFIG[audit.heatmap.overallSignal].bg};color:${TIER_CONFIG[audit.heatmap.overallSignal].color};font-weight:700;text-align:center;border:2px solid ${TIER_CONFIG[audit.heatmap.overallSignal].color};">
          Overall Signal: ${audit.heatmap.overallSignal === 'GREEN' ? 'GO' : audit.heatmap.overallSignal === 'AMBER' ? 'CAUTION' : 'NO-GO'}
        </div>
        ${audit.heatmap.checks.filter(c => c.status === 'FAIL').length > 0 ? `
          <p><strong>Failing Checks:</strong></p>
          <ul>
            ${audit.heatmap.checks.map((c, i) => {
              if (c.status !== 'FAIL') return '';
              return `<li style="margin-bottom:4px;color:var(--red);">${DQ_CHECKS[i].check} (Severity: ${c.severity}/5)</li>`;
            }).join('')}
          </ul>
        ` : '<p>No failing checks detected.</p>'}

        <h2>7. 30/60/90-Day Roadmap</h2>
        ${this.generateRoadmap(audit)}

        <div style="margin-top:40px;text-align:center;color:var(--text-muted);font-size:0.8rem;border-top:1px solid var(--border);padding-top:16px;">
          Generated by Tender Readiness Audit System &bull; ${new Date().toLocaleDateString()}
        </div>
      </div>`;
  },

  getTopGaps(audit) {
    const gaps = [];
    audit.scoring.categories
      .map((cat, i) => ({ score: cat.score ?? 0, name: SCORING_CATEGORIES[i].name, weight: SCORING_CATEGORIES[i].weight }))
      .sort((a, b) => (a.score / 5 * a.weight) - (b.score / 5 * b.weight))
      .slice(0, 3)
      .forEach(g => {
        gaps.push(`<strong>${g.name}</strong> — scored ${g.score}/5 (${Math.round((g.score / 5) * g.weight * 10) / 10}/${g.weight} weighted)`);
      });
    return gaps.length ? gaps : ['No significant gaps identified'];
  },

  getQuickWins(audit) {
    const wins = [];
    // Check evidence gaps
    const missing = audit.evidence.filter(e => e.status === 'NO' || e.status === 'PENDING');
    if (missing.length > 0) {
      wins.push(`Collect ${missing.length} missing/pending evidence items`);
    }
    // Check DQ failures
    const fails = audit.heatmap.checks.filter(c => c.status === 'FAIL');
    if (fails.length > 0) {
      wins.push(`Address ${fails.length} failing DQ pre-checks before next submission`);
    }
    // Check low-scoring categories with remediation
    audit.scoring.categories.forEach((cat, i) => {
      if ((cat.score ?? 0) <= 2 && cat.remediation) {
        wins.push(`${SCORING_CATEGORIES[i].name}: ${cat.remediation}`);
      }
    });
    return wins.length ? wins.slice(0, 5) : ['Continue maintaining current standards'];
  },

  generateRoadmap(audit) {
    const items30 = [], items60 = [], items90 = [];

    // 30-day: DQ failures + missing evidence
    audit.heatmap.checks.forEach((c, i) => {
      if (c.status === 'FAIL') items30.push(DQ_CHECKS[i].check);
    });
    audit.evidence.filter(e => e.status === 'NO').forEach(e => {
      const def = EVIDENCE_CATEGORIES.flatMap(c => c.items).find(d => d.id === e.id);
      if (def) items30.push(`Obtain: ${def.document}`);
    });

    // 60-day: Low scoring categories
    audit.scoring.categories.forEach((cat, i) => {
      if ((cat.score ?? 0) <= 2) {
        items60.push(`Improve ${SCORING_CATEGORIES[i].name} (currently ${cat.score ?? 0}/5)${cat.remediation ? ': ' + cat.remediation : ''}`);
      }
    });

    // 90-day: Medium scoring categories
    audit.scoring.categories.forEach((cat, i) => {
      if ((cat.score ?? 0) === 3) {
        items90.push(`Strengthen ${SCORING_CATEGORIES[i].name} (currently 3/5)${cat.remediation ? ': ' + cat.remediation : ''}`);
      }
    });

    return `
      <h3 style="color:var(--red);">Days 1-30: Critical Fixes</h3>
      ${items30.length ? `<ul>${items30.slice(0, 8).map(i => `<li style="margin-bottom:4px;">${i}</li>`).join('')}</ul>` : '<p>No critical fixes required.</p>'}
      <h3 style="color:var(--amber);">Days 31-60: Improvement</h3>
      ${items60.length ? `<ul>${items60.map(i => `<li style="margin-bottom:4px;">${i}</li>`).join('')}</ul>` : '<p>No major improvements needed.</p>'}
      <h3 style="color:var(--green);">Days 61-90: Optimization</h3>
      ${items90.length ? `<ul>${items90.map(i => `<li style="margin-bottom:4px;">${i}</li>`).join('')}</ul>` : '<p>Focus on maintaining and exceeding standards.</p>'}
    `;
  }
};

  // ─── AUTH ───
  function signInWithGoogle() {
    const btn = document.querySelector('.btn-google');
    btn.textContent = 'Connecting...';
    btn.disabled = true;
    setTimeout(() => launchApp('Juan Dela Cruz', 'JD'), 1200);
  }
  function signInAsGuest() { launchApp('Guest Farmer', 'GF'); }
  function launchApp(name, initials) {
    const auth = document.getElementById('auth-screen');
    auth.style.opacity = '0'; auth.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      auth.style.display = 'none';
      document.getElementById('app').classList.add('visible');
      document.getElementById('user-name').textContent = name;
      document.getElementById('user-avatar').textContent = initials;
    }, 500);
  }
  function logout() {
    const app = document.getElementById('app');
    const auth = document.getElementById('auth-screen');
    // Fade out app
    app.style.opacity = '0';
    app.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      app.classList.remove('visible');
      app.style.opacity = '';
      app.style.transition = '';
      // Reset google button
      const btn = document.querySelector('.btn-google');
      btn.textContent = '';
      btn.disabled = false;
      btn.innerHTML = `<svg class="btn-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>Continue with Google`;
      // Show auth screen
      auth.style.display = 'flex';
      auth.style.opacity = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        auth.style.transition = 'opacity 0.5s';
        auth.style.opacity = '1';
      }));
      // Scroll to top
      window.scrollTo({ top: 0 });
    }, 400);
  }

  // ─── MOBILE MENU ───
  function toggleMenu() { document.getElementById('mobile-menu').classList.toggle('open'); }
  function closeMenu()  { document.getElementById('mobile-menu').classList.remove('open'); }

  // ─────────────────────────────────────────
  //  STEPPER STATE
  // ─────────────────────────────────────────
  let currentStep = 1;
  const TOTAL_STEPS = 3;
  let lastAdvisory = null;

  function goToStep(step, skipValidation) {
    if (step > currentStep && !skipValidation) {
      if (!validateStep(currentStep)) return;
    }

    // Move slider
    const track = document.getElementById('steps-track');
    track.style.transform = `translateX(-${(step - 1) * 100}%)`;

    // Update stepper dots
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const item = document.getElementById(`stepper-${i}`);
      const dot  = document.getElementById(`sdot-${i}`);
      item.classList.remove('active', 'completed');
      if (i < step) {
        item.classList.add('completed');
        dot.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else if (i === step) {
        item.classList.add('active');
        if (i < TOTAL_STEPS) dot.textContent = i;
        // Step 3 dot already has check SVG in HTML
      } else {
        if (i < TOTAL_STEPS) dot.textContent = i;
        // Step 3 restore check icon if going back from beyond
        if (i === TOTAL_STEPS) {
          dot.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
        }
      }
    }

    currentStep = step;

    // If advancing to step 3, generate the advisory
    if (step === 3) {
      generateAdvisory();
    }

    // Smooth scroll to top of advisory section
    document.getElementById('advisory').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function generateAndAdvance() {
    if (!validateStep(2)) return;
    goToStep(3, true);
  }

  // ─────────────────────────────────────────
  //  WORD COUNT — NOTES
  // ─────────────────────────────────────────
  function countWords(str) {
    return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
  }

  function updateWordCount(textarea) {
    const count = countWords(textarea.value);
    const counter = document.getElementById('notes-word-count');
    const errEl   = document.getElementById('err-notes');
    const limit   = 200;

    counter.textContent = `${count} / ${limit} words`;

    if (count > limit) {
      counter.style.color = '#f08080';
      textarea.classList.add('error');
      errEl.classList.add('show');
    } else {
      counter.style.color = count >= limit * 0.85 ? '#f0c840' : 'var(--text-light)';
      textarea.classList.remove('error');
      errEl.classList.remove('show');
    }
  }

  // ─────────────────────────────────────────
  //  DATE VALIDATION — PLANTING DATE
  // ─────────────────────────────────────────
  function validatePlantingDate(input) {
    const val    = input.value;
    const errEl  = document.getElementById('err-date');
    if (!val) { input.classList.remove('error'); errEl.classList.remove('show'); return true; }

    const chosen  = new Date(val);
    const today   = new Date(); today.setHours(0,0,0,0);
    const maxBack = new Date(today); maxBack.setDate(today.getDate() - 200);

    if (chosen > today || chosen < maxBack) {
      input.classList.add('error');
      errEl.classList.add('show');
      return false;
    }
    input.classList.remove('error');
    errEl.classList.remove('show');
    return true;
  }

  // ─────────────────────────────────────────
  //  VALIDATION
  // ─────────────────────────────────────────
  function validateStep(step) {
    let valid = true;

    if (step === 1) {
      const loc    = document.getElementById('field-location');
      const errLoc = document.getElementById('err-location');
      if (!loc.value.trim()) {
        loc.classList.add('error'); errLoc.classList.add('show'); valid = false;
      } else {
        loc.classList.remove('error'); errLoc.classList.remove('show');
      }

      // Date validation (optional field — only validate if filled)
      const dateInput = document.getElementById('field-planting-date');
      if (dateInput.value && !validatePlantingDate(dateInput)) valid = false;
    }

    if (step === 2) {
      const stage    = document.getElementById('field-growth-stage');
      const cond     = document.getElementById('field-condition');
      const errStage = document.getElementById('err-stage');
      const errCond  = document.getElementById('err-condition');

      if (!stage.value) {
        stage.classList.add('error'); errStage.classList.add('show'); valid = false;
      } else {
        stage.classList.remove('error'); errStage.classList.remove('show');
      }

      if (!cond.value) {
        cond.classList.add('error'); errCond.classList.add('show'); valid = false;
      } else {
        cond.classList.remove('error'); errCond.classList.remove('show');
      }

      // Notes word limit
      const notes = document.getElementById('field-notes');
      if (countWords(notes.value) > 200) {
        notes.classList.add('error');
        document.getElementById('err-notes').classList.add('show');
        valid = false;
      }
    }

    return valid;
  }

  // Clear validation on input
  ['field-location', 'field-growth-stage', 'field-condition'].forEach(id => {
    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          el.classList.remove('error');
          const errId = { 'field-location': 'err-location', 'field-growth-stage': 'err-stage', 'field-condition': 'err-condition' }[id];
          document.getElementById(errId).classList.remove('show');
        });
        el.addEventListener('change', () => {
          el.classList.remove('error');
          const errId = { 'field-location': 'err-location', 'field-growth-stage': 'err-stage', 'field-condition': 'err-condition' }[id];
          document.getElementById(errId).classList.remove('show');
        });
      }
    });
  });

  // ─────────────────────────────────────────
  //  RESET FORM
  // ─────────────────────────────────────────
  function resetForm() {
    document.getElementById('field-location').value = '';
    document.getElementById('field-location-select').value = '';
    const customInp = document.getElementById('field-location-custom');
    customInp.value = ''; customInp.style.display = 'none';
    document.getElementById('field-planting-date').value = '';
    document.getElementById('field-growth-stage').value = '';
    document.getElementById('field-condition').value = '';
    document.getElementById('field-notes').value = '';

    // Clear errors
    ['field-location','field-growth-stage','field-condition','field-notes','field-planting-date'].forEach(id => {
      document.getElementById(id).classList.remove('error');
    });
    ['err-location','err-stage','err-condition','err-notes','err-date'].forEach(id => {
      document.getElementById(id).classList.remove('show');
    });

    // Reset word counter
    const counter = document.getElementById('notes-word-count');
    if (counter) { counter.textContent = '0 / 200 words'; counter.style.color = 'var(--text-light)'; }

    // Reset upload zone
    resetUploadZone();
    document.getElementById('analysis-result').classList.remove('show');

    // Reset result
    document.getElementById('result-loading').style.display = 'none';
    document.getElementById('result-content').style.display = 'none';

    lastAdvisory = null;

    // Go to step 1
    goToStep(1, true);
  }

  function resetUploadZone() {
    const zone = document.getElementById('upload-zone');
    zone.classList.remove('has-image');
    zone.onclick = () => document.getElementById('photo-input').click();
    zone.innerHTML = `
      <svg class="form-upload-icon" id="upload-icon" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="8" width="30" height="22" rx="3"/>
        <circle cx="18" cy="19" r="6"/>
        <path d="M13 8l2-4h6l2 4"/>
      </svg>
      <div class="form-upload-text" id="upload-text">
        <strong>Click to upload</strong> or drag & drop<br/>
        JPG, PNG up to 10MB · AI will analyze field water status &amp; crop stage
      </div>
      <input type="file" id="photo-input" accept="image/*" style="display:none"
        onchange="handlePhotoUpload(this)"/>
    `;
    // Also reset analysis strip states
    document.getElementById('analysis-loading-state').style.display = 'block';
    document.getElementById('analysis-done-state').style.display    = 'none';
  }

  // ─────────────────────────────────────────
  //  PHOTO UPLOAD + AI ANALYSIS
  // ─────────────────────────────────────────
  function handleDragOver(e) { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--green-light)'; }
  function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const fakeInput = { files: [file] };
      handlePhotoUpload(fakeInput);
    }
  }

  async function handlePhotoUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    // ── 5MB size limit ──
    const MAX_MB = 5;
    if (file.size > MAX_MB * 1024 * 1024) {
      showToast(`Image too large — max ${MAX_MB}MB. Please choose a smaller file.`);
      return;
    }

    // Show image preview immediately
    const reader = new FileReader();
    reader.onload = function(e) {
      const zone = document.getElementById('upload-zone');
      zone.classList.add('has-image');
      zone.onclick = null;
      zone.innerHTML = `
        <img src="${e.target.result}" class="upload-preview-img" alt="Field photo"/>
        <div class="upload-preview-bar">
          <span class="upload-preview-name">📷 ${file.name}</span>
          <button class="upload-change-btn" onclick="resetUploadZone(); document.getElementById('photo-input').click();">Change photo</button>
        </div>
        <input type="file" id="photo-input" accept="image/*" style="display:none" onchange="handlePhotoUpload(this)"/>
      `;
    };
    reader.readAsDataURL(file);

    // Show analysis strip with loading state
    const strip = document.getElementById('analysis-result');
    strip.classList.add('show');
    document.getElementById('analysis-loading-state').style.display = 'block';
    document.getElementById('analysis-done-state').style.display    = 'none';

    // Start the 10-second visual loader in parallel with the actual API call
    const imgLoaderDuration = 10000;
    const pillSteps = [
      { id: 'imgpill-1', sub: 'Reading image pixels…',             at: 0 },
      { id: 'imgpill-2', sub: 'Detecting water & soil moisture…',  at: 0.25 },
      { id: 'imgpill-3', sub: 'Identifying crop growth stage…',    at: 0.55 },
      { id: 'imgpill-4', sub: 'Compiling field assessment…',       at: 0.80 },
    ];

    const imgBar       = document.getElementById('img-loader-bar');
    const imgSub       = document.getElementById('img-loader-sub');
    const imgCountdown = document.getElementById('img-loader-countdown');

    // Reset pills
    pillSteps.forEach(p => {
      const el = document.getElementById(p.id);
      el.classList.remove('active','done');
    });
    imgBar.style.transition = 'none';
    imgBar.style.width = '0%';

    const startTime = performance.now();
    let loaderDone = false;
    let apiDone    = false;
    let apiResult  = null;
    let apiError   = null;
    let activePill = -1;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      imgBar.style.transition = `width ${imgLoaderDuration}ms linear`;
      imgBar.style.width = '100%';
    }));

    function tickImgLoader() {
      if (loaderDone) return;
      const elapsed = performance.now() - startTime;
      const pct = Math.min(elapsed / imgLoaderDuration, 1);
      const remaining = Math.max(0, Math.ceil((imgLoaderDuration - elapsed) / 1000));
      imgCountdown.textContent = remaining > 0 ? remaining + 's' : '—';

      for (let i = 0; i < pillSteps.length; i++) {
        if (pct >= pillSteps[i].at && i > activePill) {
          if (activePill >= 0) {
            const prev = document.getElementById(pillSteps[activePill].id);
            prev.classList.remove('active');
            prev.classList.add('done');
          }
          const cur = document.getElementById(pillSteps[i].id);
          cur.classList.add('active');
          activePill = i;
          imgSub.textContent = pillSteps[i].sub;
        }
      }

      if (pct < 1) {
        requestAnimationFrame(tickImgLoader);
      } else {
        loaderDone = true;
        // Mark all pills done
        pillSteps.forEach(p => {
          const el = document.getElementById(p.id);
          el.classList.remove('active');
          el.classList.add('done');
        });
        imgCountdown.textContent = '—';
        imgSub.textContent = 'Finalizing…';
        // If API is already done, show result
        if (apiDone) showAnalysisResult(apiResult, apiError);
      }
    }
    requestAnimationFrame(tickImgLoader);

    // ── DEMO: dummy analysis results (rotates through realistic scenarios) ──
    const dummyResults = [
      {
        growth_stage: 'tillering',
        field_condition: 'moist',
        confidence: 'High',
        observation: 'The field shows rice plants at the active tillering stage with healthy green canopy. Soil surface appears moist with no visible standing water. Plant spacing and coloration indicate good crop establishment.',
        tagalog_note: 'Ang palayan ay nasa yugto ng tillering na may malusog na halaman at katamtamang kahalumigmigan ng lupa.'
      },
      {
        growth_stage: 'panicle',
        field_condition: 'saturated',
        confidence: 'High',
        observation: 'Rice plants are visibly at the panicle initiation stage with emerging flag leaves. Soil appears saturated with slight water sheen on the surface but no deep flooding. Crop color is uniformly green indicating no stress.',
        tagalog_note: 'Ang palayan ay nasa panicle initiation stage na may basang lupa ngunit walang malalim na baha.'
      },
      {
        growth_stage: 'heading',
        field_condition: 'flooded',
        confidence: 'Medium',
        observation: 'The image shows rice at heading stage with visible panicles emerging. Standing water of approximately 5–8 cm is present across the field. Some lodging risk detected on the left edge of the field.',
        tagalog_note: 'May nakikitang tubig na nakatayo sa bukid habang ang palay ay nag-uusad sa heading stage.'
      },
      {
        growth_stage: 'seedling',
        field_condition: 'dry',
        confidence: 'High',
        observation: 'Young seedlings are visible at early transplanting stage, approximately 2–3 weeks old. The soil surface shows drying cracks indicating moisture deficit. Irrigation is needed soon to prevent transplant shock.',
        tagalog_note: 'Ang mga batang halaman ay naghihintay ng tubig — ang lupa ay tuyo na at may mga bitak.'
      }
    ];

    // Pick a random dummy result
    apiResult = dummyResults[Math.floor(Math.random() * dummyResults.length)];
    apiDone   = true;
    // No async needed — result is instant, just wait for the loader timer

    // If loader already finished, show result immediately
    if (loaderDone) showAnalysisResult(apiResult, apiError);

    function showAnalysisResult(parsed, err) {
      // Transition: hide loading, show done
      document.getElementById('analysis-loading-state').style.display = 'none';
      document.getElementById('analysis-done-state').style.display    = 'block';

      const dot  = document.getElementById('analysis-status-dot');
      const lbl  = document.getElementById('analysis-status-label');
      const body = document.getElementById('analysis-text');

      if (err || !parsed) {
        dot.style.background = '#c03030';
        lbl.textContent = 'Analysis Unavailable';
        body.textContent = 'Could not analyze photo automatically. Please fill in Step 2 fields manually.';
        return;
      }

      // Auto-fill Step 2 dropdowns
      const stageEl = document.getElementById('field-growth-stage');
      const condEl  = document.getElementById('field-condition');
      if (parsed.growth_stage) { stageEl.value = parsed.growth_stage; flashField(stageEl); }
      if (parsed.field_condition) { condEl.value = parsed.field_condition; flashField(condEl); }

      dot.style.opacity = '1';
      dot.style.background = 'var(--green-light)';
      lbl.textContent = `Analysis Complete · ${parsed.confidence} Confidence`;
      body.innerHTML = `
        <div style="margin-bottom:4px">${parsed.observation}</div>
        <div style="font-style:italic;color:var(--text-light);font-size:11px;border-top:1px solid rgba(234,200,0,0.08);padding-top:5px;margin-top:5px">${parsed.tagalog_note}</div>
        <div style="margin-top:6px;font-size:11px;color:var(--green-light);font-weight:600">✓ Step 2 fields auto-filled — review and adjust if needed.</div>
      `;
    }
  }

  function flashField(el) {
    el.style.borderColor = 'var(--green-light)';
    el.style.background   = 'var(--surface-4)';
    setTimeout(() => { el.style.borderColor = ''; el.style.background = ''; }, 2000);
  }

  // ─────────────────────────────────────────
  //  ADVISORY LOGIC
  // ─────────────────────────────────────────
  const riskScores = {
    flooded:   { seedling:{score:85,level:'MATAAS'}, tillering:{score:70,level:'MATAAS'}, panicle:{score:55,level:'KATAMTAMAN'}, heading:{score:60,level:'KATAMTAMAN'}, ripening:{score:78,level:'MATAAS'} },
    saturated: { seedling:{score:58,level:'KATAMTAMAN'}, tillering:{score:48,level:'KATAMTAMAN'}, panicle:{score:32,level:'MABABA'}, heading:{score:35,level:'MABABA'}, ripening:{score:55,level:'KATAMTAMAN'} },
    moist:     { seedling:{score:20,level:'MABABA'}, tillering:{score:22,level:'MABABA'}, panicle:{score:25,level:'MABABA'}, heading:{score:28,level:'MABABA'}, ripening:{score:40,level:'KATAMTAMAN'} },
    dry:       { seedling:{score:15,level:'MABABA'}, tillering:{score:18,level:'MABABA'}, panicle:{score:20,level:'MABABA'}, heading:{score:22,level:'MABABA'}, ripening:{score:25,level:'MABABA'} }
  };

  const advisoryDecisions = {
    flooded:   { stage:{ seedling:'stop', tillering:'stop', panicle:'reduce', heading:'reduce', ripening:'stop' }, default:'stop' },
    saturated: { stage:{ seedling:'reduce', tillering:'reduce', panicle:'ok', heading:'ok', ripening:'reduce' }, default:'reduce' },
    moist:     { stage:{ seedling:'ok', tillering:'ok', panicle:'ok', heading:'ok', ripening:'reduce' }, default:'ok' },
    dry:       { stage:{ seedling:'ok', tillering:'ok', panicle:'ok', heading:'ok', ripening:'ok' }, default:'ok' }
  };

  const advisoryText = {
    stop: {
      en: "Based on the current field condition and incoming rainfall forecast, we recommend stopping all irrigation activities for the next 3 days. The field shows signs of excess water, and additional irrigation would increase waterlogging risk, potential root damage, and lodging. Monitor field drainage and check crop canopy for early signs of blast or bacterial leaf blight.",
      tl: "Batay sa kasalukuyang kondisyon ng palayan at sa darating na ulan sa susunod na 3 araw, inirekomenda na ihinto ang lahat ng pagdidilig. Ang labis na tubig ay maaaring makapinsala sa ugat ng palay at magdulot ng pagkakabuwal ng halaman. Bantayan ang drainage at tingnan ang mga dahon para sa mga palatandaan ng blast o bacterial leaf blight."
    },
    reduce: {
      en: "Current weather forecast indicates moderate rainfall within the 3-day window. We recommend reducing irrigation frequency and volume by approximately 50%. According to IRRI AWD protocol, the current soil moisture level is adequate for your crop growth stage. Unnecessary irrigation at this point risks waterlogging and increased pumping costs.",
      tl: "Ang kasalukuyang hula ng panahon ay nagpapakita ng katamtamang ulan sa loob ng 3 araw. Inirekomenda na bawasan ang pagdidilig nang halos 50%. Ayon sa IRRI AWD protocol, ang kasalukuyang kahalumigmigan ng lupa ay sapat na para sa yugto ng paglaki ng iyong palay. Makatitipid ka ng 25–30% ng tubig sa pamamagitan ng tamang AWD."
    },
    ok: {
      en: "Forecast shows low rainfall probability for the next 3–5 days. Based on your crop growth stage and current field condition, proceeding with irrigation is recommended. Follow IRRI AWD thresholds — allow soil to dry to 15cm below surface before re-irrigating. This approach conserves 25–30% of water compared to continuous flooding without reducing yield.",
      tl: "Ang hula ng panahon ay nagpapakita ng mababang posibilidad ng ulan sa susunod na 3–5 araw. Batay sa yugto ng paglaki ng iyong palay at kasalukuyang kondisyon ng bukid, inirekomenda ang pagdidilig. Sundin ang IRRI AWD — hayaang matuyo ang lupa hanggang 15cm bago muling magdilig. Makatitipid ka ng 25–30% ng tubig nang hindi nababawasan ang ani."
    }
  };

  const mockWeatherData = [
    { day: 'Bukas',        rain: 15, chance: 80, type: 'rain' },
    { day: 'Samakalawa',   rain: 20, chance: 90, type: 'rain' },
    { day: 'Ikatlong Araw',rain: 5,  chance: 30, type: 'partly' }
  ];

  // ─── UPDATE DASHBOARD FROM ADVISORY ───
  function updateDashboard(location, stage, condition, decision, riskData) {
    const decisionLabels = { ok: 'OK to Irrigate', reduce: 'Reduce Irrigation', stop: 'Stop Irrigation' };
    const condLabelMap   = { flooded:'Flooded', saturated:'Saturated', moist:'Moist', dry:'Dry' };
    const stageLabelMap  = { seedling:'Newly Planted', tillering:'Vegetative', panicle:'Flowering', heading:'Near Harvest', ripening:'Near Harvest' };

    // Update recommendation card
    const recCard = document.querySelector('.dashboard-card.accent');
    if (recCard) {
      recCard.querySelector('.card-value').textContent = decisionLabels[decision];
      recCard.querySelector('.card-sub').textContent =
        `${stageLabelMap[stage]} · ${condLabelMap[condition]} · Updated ${new Date().toLocaleTimeString('en-PH', {hour:'2-digit',minute:'2-digit'})}`;
      const badge = recCard.querySelector('.decision-badge');
      badge.className = `decision-badge ${decision}`;
      badge.innerHTML = `<span class="decision-badge-dot"></span><span>${riskData.level} Risk</span>`;
    }

    // Update weather card location label
    const weatherCard = document.querySelector('.dashboard-card.full .card-label');
    if (weatherCard && location) {
      weatherCard.textContent = `5-Day Weather Forecast · ${location}`;
    }

    // Update risk score circle
    const riskCircleNum = document.querySelector('.risk-circle-num');
    if (riskCircleNum) {
      riskCircleNum.textContent = riskData.score;
      // Animate conic gradient
      const riskCircle = document.querySelector('.risk-circle');
      if (riskCircle) {
        const pct = riskData.score;
        const color = pct < 40 ? '#6fa832' : pct < 70 ? '#d4a000' : '#c03030';
        riskCircle.style.background = `conic-gradient(${color} 0% ${pct}%, rgba(255,255,255,0.08) ${pct}% 100%)`;
      }
    }

    // Update risk bars based on condition
    const floodPct = { flooded:82, saturated:48, moist:18, dry:10 }[condition] ?? 30;
    const stressPct = { flooded:10, saturated:20, moist:40, dry:75 }[condition] ?? 40;
    const uncPct = Math.round(Math.random() * 15 + 10);

    const bars = document.querySelectorAll('.risk-bar-item');
    if (bars.length >= 3) {
      bars[0].querySelector('.risk-bar-fill').style.width = floodPct + '%';
      bars[0].querySelector('.risk-bar-header span:last-child').textContent = floodPct + '%';
      bars[1].querySelector('.risk-bar-fill').style.width = stressPct + '%';
      bars[1].querySelector('.risk-bar-header span:last-child').textContent = stressPct + '%';
      bars[2].querySelector('.risk-bar-fill').style.width = uncPct + '%';
      bars[2].querySelector('.risk-bar-header span:last-child').textContent = uncPct + '%';
    }

    // Flash dashboard cards to signal update
    document.querySelectorAll('.dashboard-card').forEach(card => {
      card.classList.remove('just-updated');
      void card.offsetWidth; // reflow to restart animation
      card.classList.add('just-updated');
    });

    // Update AI Recommendation card
    const aiCard = document.getElementById('ai-rec-card');
    if (aiCard) {
      const text = advisoryText[decision];
      document.getElementById('ai-rec-en').textContent = text.en;
      document.getElementById('ai-rec-tl').textContent = text.tl;
      document.getElementById('ai-rec-label').textContent =
        `AI Recommendation — ${decisionLabels[decision]}`;
      document.getElementById('ai-rec-meta').textContent =
        `${location} · ${stageLabelMap[stage]} · ${condLabelMap[condition]} · Generated ${new Date().toLocaleTimeString('en-PH', {hour:'2-digit', minute:'2-digit'})} on ${new Date().toLocaleDateString('en-PH', {month:'long', day:'numeric', year:'numeric'})}`;
      aiCard.style.display = 'block';
    }

    // Show toast
    showToast('Dashboard updated with latest advisory!');
  }

  function generateAdvisory() {
    const location  = document.getElementById('field-location').value.trim();
    const stage     = document.getElementById('field-growth-stage').value;
    const condition = document.getElementById('field-condition').value;

    // Show loading
    document.getElementById('result-loading').style.display  = 'block';
    document.getElementById('result-content').style.display  = 'none';

    // Run the rich 10-second loader, then build result
    runAdvisoryLoader(20000, () => buildAdvisoryResult(location, stage, condition));
  }

  function runAdvisoryLoader(totalMs, onComplete) {
    const steps = [
      { id: 'alstep-1', label: 'Reading field conditions',       at: 0 },
      { id: 'alstep-2', label: 'Fetching 5-day forecast data',   at: 0.18 },
      { id: 'alstep-3', label: 'Applying IRRI AWD protocol',     at: 0.38 },
      { id: 'alstep-4', label: 'Calculating risk scores',        at: 0.62 },
      { id: 'alstep-5', label: 'Preparing recommendation',       at: 0.82 },
    ];
    const subTexts = [
      'Connecting to weather data sources…',
      'Analyzing soil moisture profile…',
      'Cross-referencing IRRI AWD thresholds…',
      'Running flood risk model…',
      'Finalizing your recommendation…',
    ];

    const bar      = document.getElementById('advisory-loader-bar');
    const timeEl   = document.getElementById('advisory-loader-time');
    const subEl    = document.getElementById('advisory-loader-sub');

    // Reset all steps
    steps.forEach(s => {
      const el = document.getElementById(s.id);
      el.classList.remove('active','done');
      el.querySelector('.loader-step-icon').textContent = s.id.split('-')[1];
    });
    bar.style.transition = 'none';
    bar.style.width = '0%';

    const startTime = performance.now();
    let subIdx = 0;
    let activeStep = -1;

    // Kick off bar transition after a tiny delay
    requestAnimationFrame(() => requestAnimationFrame(() => {
      bar.style.transition = `width ${totalMs}ms linear`;
      bar.style.width = '100%';
    }));

    function tick() {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(elapsed / totalMs, 1);
      timeEl.textContent = Math.ceil((totalMs - elapsed) / 1000) + 's';

      // Advance steps
      for (let i = 0; i < steps.length; i++) {
        const el = document.getElementById(steps[i].id);
        if (pct >= steps[i].at && i > activeStep) {
          // Mark previous as done
          if (activeStep >= 0) {
            const prev = document.getElementById(steps[activeStep].id);
            prev.classList.remove('active');
            prev.classList.add('done');
            prev.querySelector('.loader-step-icon').textContent = '✓';
          }
          el.classList.add('active');
          activeStep = i;
          // Update subtitle
          if (subIdx < subTexts.length) {
            subEl.textContent = subTexts[subIdx++];
          }
        }
      }

      if (pct < 1) {
        requestAnimationFrame(tick);
      } else {
        // Mark last step done
        if (activeStep >= 0) {
          const last = document.getElementById(steps[activeStep].id);
          last.classList.remove('active');
          last.classList.add('done');
          last.querySelector('.loader-step-icon').textContent = '✓';
        }
        timeEl.textContent = 'Done';
        setTimeout(onComplete, 200);
      }
    }
    requestAnimationFrame(tick);
  }

  function buildAdvisoryResult(location, stage, condition) {
    const condData = advisoryDecisions[condition];
    const decision = condData.stage[stage] || condData.default;
    const text     = advisoryText[decision];

    const decisionLabels = { ok: 'OK to Irrigate', reduce: 'Reduce Irrigation', stop: 'Stop Irrigation' };
    const decisionClass  = { ok: 'ok', reduce: 'reduce', stop: 'stop' };
    const stageLabelMap  = { seedling:'Newly Planted', tillering:'Vegetative', panicle:'Flowering', heading:'Near Harvest', ripening:'Near Harvest' };
    const condLabelMap   = { flooded:'Flooded', saturated:'Saturated', moist:'Moist', dry:'Dry' };

    // Badge
    const badge = document.getElementById('result-badge');
    badge.className = `decision-badge ${decisionClass[decision]}`;
    badge.innerHTML = `<span class="decision-badge-dot"></span><span>${decisionLabels[decision]}</span>`;

    // Meta
    document.getElementById('result-meta').textContent =
      `${location} · ${new Date().toLocaleDateString('en-PH',{month:'long',day:'numeric',year:'numeric'})}`;

    // Summary chips
    const plantingDate = document.getElementById('field-planting-date').value;
    let chips = `
      <div class="summary-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${location}</div>
      <div class="summary-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M12 2c-1.5 2-4 3-6 3 0 0 0 8 6 13M12 2c1.5 2 4 3 6 3 0 0 0 8-6 13"/></svg>${stageLabelMap[stage]}</div>
      <div class="summary-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>${condLabelMap[condition]}</div>
    `;
    if (plantingDate) chips += `<div class="summary-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Planted ${plantingDate}</div>`;
    document.getElementById('summary-chips').innerHTML = chips;

    // Body text
    document.getElementById('result-body').textContent = text.en;
    document.getElementById('result-tagalog-text').textContent = text.tl;

    // Risk score
    const riskData = (riskScores[condition] && riskScores[condition][stage])
      ? riskScores[condition][stage]
      : { score: 50, level: 'KATAMTAMAN' };
    document.getElementById('result-risk-score').textContent = `${riskData.score}/100`;
    document.getElementById('result-risk-level').textContent  = riskData.level;

    const fill = document.getElementById('result-risk-fill');
    fill.style.width = '0%';
    fill.className = 'result-risk-fill ' + (riskData.score < 40 ? 'low' : riskData.score < 70 ? 'medium' : 'high');
    requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = riskData.score + '%'; }));

    // Weather strip
    document.getElementById('result-weather-strip').innerHTML = mockWeatherData.map(d => {
      const icon = d.type === 'rain'
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="1.8"><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="16" y1="19" x2="16" y2="21"/></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EAC800" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>`;
      return `<div class="result-weather-day"><div class="result-weather-day-name">${d.day}</div><div style="margin:6px 0">${icon}</div><div class="result-weather-day-rain">${d.rain}mm</div><div class="result-weather-day-chance">${d.chance}% chance</div></div>`;
    }).join('');

    lastAdvisory = { location, stage, condition, decision, ...riskData };

    // ─── UPDATE DASHBOARD ───
    updateDashboard(location, stage, condition, decision, riskData);

    // Show result
    document.getElementById('result-loading').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
  }

  // ─── SAVE ADVISORY ───
  function saveAdvisory() {
    if (!lastAdvisory) return;
    console.log('Advisory saved:', { ...lastAdvisory, timestamp: new Date().toISOString() });
    showToast('Rekomendasyon na-save!');
  }

  // ─── TOAST ───
  function showToast(message) {
    const toast = document.getElementById('agro-toast');
    document.getElementById('agro-toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ─── SMS MODAL ───
  function showSMSModal()  { document.getElementById('sms-modal').classList.add('show'); }
  function closeSMSModal() { document.getElementById('sms-modal').classList.remove('show'); }
  function subscribeSMS() {
    const phone = document.getElementById('sms-phone-input').value.trim();
    if (phone.length < 10) { alert('Please enter a valid phone number.'); return; }
    closeSMSModal();
    document.getElementById('sms-phone-input').value = '';
    showToast('Na-subscribe ka na! Makakatanggap ka ng SMS alerts.');
  }

  // ─── LOCATION DROPDOWN ───
  function handleLocationSelect(sel) {
    const customInput = document.getElementById('field-location-custom');
    const hiddenInput = document.getElementById('field-location');
    if (sel.value === '__custom__') {
      customInput.style.display = 'block';
      customInput.focus();
      hiddenInput.value = '';
      customInput.oninput = () => { hiddenInput.value = customInput.value.trim(); };
    } else {
      customInput.style.display = 'none';
      customInput.value = '';
      hiddenInput.value = sel.value;
    }
    // Clear error on selection
    const errEl = document.getElementById('err-location');
    if (errEl) errEl.style.display = 'none';
  }

  // ─── NAV ACTIVE STATE ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
    navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === `#${current}`); });
  });
// OHU/SIS-1 Digital Form (Exact Replica of Document_261123_124724.pdf) + WEHU 52-Column Mapper

const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8hqJM3Phedyj-vc5egBcd56XB7vCXhFCaDIPaFCZ77qKGPQJ8pg6ZRxBktDvDhok8Kw/exec";

const WEHU_52_HEADERS = [
  "NO",
  "DATE OF ENTRY (dd/mm/yyyy)",
  "CASE CODE",
  "STATE",
  "DISTRICT",
  "TYPE OF FACILITY",
  "NAME OF FACILITY",
  "NAME",
  "NEW IC /PASSPORT NO. (e.g : 880721034567)",
  "GENDER",
  "NATIONALITY",
  "OTHERS NATIONALITY (PLEASE SPECIFY)",
  "AGE ON THE 1st JANUARY (YEARS)",
  "AGE GROUP",
  "DEPARTMENT PRESENTLY ATTACHED TO",
  "UNIT",
  "CONTACT NO. (e.g : 0134567890)",
  "DATE OF INJURY (dd/mm/yyyy)",
  "TIME OF INJURY (hh:mm)",
  "SHIFTWORK",
  "DATE OF FIRST REPORTING TO MEDICAL / ID TEAM (dd/mm/yyyy)",
  "TIME OF REPORTING (hh:mm)",
  "MONTH OF REPORTING",
  "DURATION OF EMPLOYMENT IN MOH",
  "DURATION OF EMPLOYMENT (month/year)",
  "DURATION OF WORK IN HANDLING SHARPS",
  "HANDLING SHARPS (month/year)",
  "DURATION OF EMPLOYMENT GROUP",
  "JOB CATEGORY",
  "IF SPECIALIST/ CONSULTANT/TRAINEE/OTHERS (PLEASE SPECIFY)",
  "PLACE OF OCCURRENCE",
  "IF ELSEWHERE IN THE WARD OR OTHER PLACE OF OCCURRENCE (PLEASE SPECIFY)",
  "HOW DID THE SHARPS INJURY OCCUR (PLEASE SELECT WHERE APPLICABLE)",
  "3a) WHILE HANDLING PATIENT OR NEEDLE/SHARPS",
  "3b) WHILE IN OPERATIVE FIELD OR DURING SUTURING PROCEDURES OR AUTOPSY",
  "3c) HANDLING EQUIPMENT/SPECIMENS",
  "3d) COLLISION/CONTACT WITH SHARPS OBJECT",
  "3e) DISPOSAL RELATED",
  "3f) SHARPS IN UNUSUAL LOCATIONS",
  "OTHER UNUSUAL LOCATION (PLEASE SPECIFY)",
  "3G) OTHER CIRCUMTANCES (PLEASE DESCRIBE)",
  "WHICH TYPE OF DEVICE CAUSED THE INJURY (PLEASE SELECT WHERE APPLICABLE)",
  "4a) NEEDLES",
  "OTHERS NEEDLE",
  "4b) GLASS",
  "OTHERS GLASS",
  "4c) SURGICAL INSTRUMENTS OR OTHER ITEMS",
  "OTHERS SHARPS ITEMS",
  "WAS THE DEVICE CONTAMINATED?",
  "PROCEDURE CONDUCTED",
  "NON MEDICAL PROCEDURE",
  "OTHER PROCEDURES"
];

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

function renderLabelHtml(item) {
  if (item.slashChoices && item.slashChoices.length > 1) {
    const groupKey = item.id;
    const resPref = item.slashResultPrefix || "";
    const pills = item.slashChoices
      .map(choice => `<span class="asterisk-choice" data-slash-group="${groupKey}" data-val="${resPref}${choice}">${choice}</span>`)
      .join(" / ");
    const prefix = item.prefix ? `${item.prefix}` : "";
    const suffix = item.suffix ? (item.noSpaceBeforeSuffix ? item.suffix : ` ${item.suffix}`) : "";
    const starEnd = item.starEnd ? " *" : "";
    const starMid = item.starBeforeChoices ? "* " : "";
    return `<span class="asterisk-selector" data-slash-container="${groupKey}">${prefix}${starMid}${pills}${suffix}${starEnd}</span>`;
  }
  return item.label;
}

function renderCheckRow(groupName, item) {
  const labelHtml = renderLabelHtml(item);
  const singleCls = item.singleGroup ? ` single-group" data-group="${item.singleGroup}` : "";

  if (item.inlineInputId) {
    return `
      <div class="check-item-row">
        <div class="check-item-main">
          <span class="check-item-text" style="display:flex;align-items:baseline;gap:4px;">
            <span style="white-space:nowrap;">${labelHtml}</span>
            <input type="text" id="${item.inlineInputId}" class="dotted-input" style="min-width:70px;font-size:12px;" />
          </span>
          <input type="checkbox" class="box-check${singleCls}" data-section="${groupName}" data-item-id="${item.id}" value="${item.value || item.label}" />
        </div>
      </div>`;
  }

  if (item.belowInputId) {
    const indentStyle = item.belowIndent ? `style="padding-left:${item.belowIndent};padding-right:28px;"` : `style="padding-right:28px;"`;
    return `
      <div class="check-item-row with-subline">
        <div class="check-item-main">
          <span class="check-item-text">${labelHtml}</span>
          <input type="checkbox" class="box-check${singleCls}" data-section="${groupName}" data-item-id="${item.id}" value="${item.value || item.label}" />
        </div>
        <div ${indentStyle}>
          <input type="text" id="${item.belowInputId}" class="full-dotted-input" />
        </div>
      </div>`;
  }

  return `
    <div class="check-item-row">
      <span class="check-item-text">${labelHtml}</span>
      <input type="checkbox" class="box-check${singleCls}" data-section="${groupName}" data-item-id="${item.id}" value="${item.value || item.label}" />
    </div>`;
}

function footnotesHtml() {
  return `
    <div class="inside-box-footnotes">
      <div>(*) delete where is not applicable</div>
      <div>(&raquo;) to be filled in the registry</div>
    </div>`;
}

function initFormSections() {
  // ==================== PAGE 2: >> 1. JOB CATEGORY ====================
  const jobLeftTop = [
    { id: "job_mo", label: "Medical Officer" },
    { id: "job_mho", label: "Medical and Health Officer" },
    { id: "job_ho", label: "House Officer" },
    { id: "job_matron", slashChoices: ["Matron", "Sister"], starEnd: true, value: "Matron / Sister" },
    { id: "job_sn", slashChoices: ["Staff Nurse", "Assistant Nurse"], starEnd: true, value: "Staff Nurse / Assistant Nurse" },
    { id: "job_mw", slashChoices: ["Midwife", "Community Nurse"], starEnd: true, value: "Midwife / Community Nurse" },
    { id: "job_ma", label: "Medical Assistant *", value: "Medical Assistant" },
    {
      id: "job_spec",
      slashChoices: ["Specialist", "Consultant"],
      suffix: "(please specify speciality) * :",
      belowInputId: "job-spec-input",
      value: "Specialist / Consultant"
    }
  ];

  const jobLeftDental = [
    { id: "job_dent_spec", label: "Dental Specialist" },
    { id: "job_dent_off", label: "Dental Officer" },
    { id: "job_dent_nurse", label: "Dental Nurse" }
  ];

  const jobRight = [
    { id: "job_dent_surg", label: "Dental Surgery Assistant" },
    { id: "job_dent_tech", label: "Dental Technician" },
    { id: "job_dent_att", label: "Dental Attendant" },
    { id: "job_pharm", slashChoices: ["Pharmacist", "Pharmacy Assistant"], starEnd: true, value: "Pharmacist / Pharmacy Assistant" },
    { id: "job_mlt", slashChoices: ["MLT", "Lab Assistant"], starEnd: true, value: "MLT / Lab Assistant" },
    { id: "job_rad", label: "Radiology Staff" },
    { id: "job_hss", label: "Hospital Support Service Staff" },
    { id: "job_laundry", label: "Laundry Staff" },
    { id: "job_admin", label: "Administration Staff" },
    { id: "job_hi", label: "Health Inspector" },
    { id: "job_ha", label: "Health Attendant" },
    { id: "job_driver", label: "Driver" },
    { id: "job_trainee", label: "Trainee (please specify) :", inlineInputId: "job-trainee-input", value: "Trainee" },
    { id: "job_others", label: "Others (please specify) :", inlineInputId: "job-others-input", value: "Others" }
  ];

  document.getElementById("sec-job-category").innerHTML = `
    <div class="sec-header-line">
      <span class="sec-num"><span class="reg-mark">&raquo;</span> 1.</span>
      <span>JOB CATEGORY <span class="tick-note">(Please tick (&#10003;) where applicable)</span></span>
    </div>
    <hr class="thick-rule" />
    <div class="check-grid-2col">
      <div class="check-col">
        ${jobLeftTop.map(i => renderCheckRow("job_category", i)).join("")}
        <div class="sub-heading-label">DENTAL</div>
        ${jobLeftDental.map(i => renderCheckRow("job_category", i)).join("")}
      </div>
      <div class="check-col">
        ${jobRight.map(i => renderCheckRow("job_category", i)).join("")}
      </div>
    </div>
  `;

  // ==================== PAGE 2: >>2. WHERE DID THE SHARPS INJURY OCCUR? ====================
  const whereLeftWardSub = [
    { id: "loc_ward_a", label: "a.&nbsp;&nbsp; At patient's bedside", value: "Ward - At patient's bedside" },
    { id: "loc_ward_b", label: "b.&nbsp;&nbsp; Side room / nurses table", value: "Ward - Side room / nurses table" },
    {
      id: "loc_ward_c",
      label: "c.&nbsp;&nbsp; Elsewhere in the ward (please specify):",
      belowInputId: "loc-elsewhere-input",
      belowIndent: "20px",
      value: "Elsewhere in the ward"
    }
  ];

  const whereLeftBottom = [
    { id: "loc_ot", label: "Operating Theatre" },
    { id: "loc_ae", label: "Accident &amp; Emergency", value: "Accident & Emergency" },
    { id: "loc_labour", label: "Labour Room" }
  ];

  const whereRight = [
    { id: "loc_icu", label: "Intensive Care Unit" },
    { id: "loc_spec", label: "Specialist Clinic" },
    { id: "loc_clinic", label: "Health Clinic / Polyclinic" },
    { id: "loc_dental", label: "Dental Clinic" },
    { id: "loc_school", slashChoices: ["School", "College", "Faculty"], starEnd: true, value: "School / College / Faculty" },
    { id: "loc_pharm", label: "Pharmacy" },
    { id: "loc_lab", label: "Laboratory" },
    { id: "loc_others", label: "Others (please specify)", belowInputId: "loc-others-input", value: "Others" }
  ];

  document.getElementById("sec-where-occurred").innerHTML = `
    <div class="sec-header-line">
      <span class="sec-num"><span class="reg-mark">&raquo;</span>2.</span>
      <span>WHERE DID THE SHARPS INJURY OCCUR? <span class="tick-note">(Please tick (&#10003;) where applicable)</span></span>
    </div>
    <hr class="thick-rule" />
    <div class="check-grid-2col">
      <div class="check-col">
        <div style="font-size:12.1px;min-height:20px;display:flex;align-items:center;gap:4px;">
          <span>Ward (please specify):</span>
          <input type="text" id="loc-ward-input" class="seamless-inline-input" title="Nyatakan nama wad (jika berkaitan)" />
        </div>
        ${whereLeftWardSub.map(i => renderCheckRow("place_occurrence", i)).join("")}
        <div style="height:14px;"></div>
        ${whereLeftBottom.map(i => renderCheckRow("place_occurrence", i)).join("")}
      </div>
      <div class="check-col">
        ${whereRight.map(i => renderCheckRow("place_occurrence", i)).join("")}
      </div>
    </div>
  `;

  // ==================== PAGE 2: 3. HOW DID THE SHARPS INJURY OCCUR? (3a & 3b) ====================
  const s3aLeft = [
    { id: "s3a_ins_line", label: "While inserting needle in line" },
    { id: "s3a_man_line", label: "While manipulating needle in line" },
    { id: "s3a_wit_line", label: "While withdrawing needle from line" }
  ];
  const s3aRight = [
    { id: "s3a_pass_eq", label: "Passing / Transferring equipment" },
    { id: "s3a_ins_pat", label: "While inserting needle in patient" },
    { id: "s3a_man_pat", label: "While manipulating needle in patient" },
    { id: "s3a_wit_pat", label: "While withdrawing needle from patient" }
  ];

  const s3bLeft = [
    { id: "s3b_suturing", label: "Suturing" },
    { id: "s3b_incising", label: "Incising" },
    { id: "s3b_tying", label: "Tying sutures" }
  ];
  const s3bRight = [
    { id: "s3b_palp", slashChoices: ["Palpating", "Exploring"], starEnd: true, value: "Palpating / Exploring" },
    { id: "s3b_holder", label: "Manipulating suture needle in holder" },
    { id: "s3b_pass", slashChoices: ["Passing", "receiving equipment"], starEnd: true, value: "Passing / receiving equipment" }
  ];

  document.getElementById("sec-how-occurred-p2").innerHTML = `
    <div class="sec-header-line">
      <span class="sec-num">3.</span>
      <span>HOW DID THE SHARPS INJURY OCCUR? <span class="tick-note">(Please tick (&#10003;) where applicable) select one(1) answer</span></span>
    </div>
    <hr class="thick-rule" />
    <div class="check-grid-2col" style="align-items:center;">
      <div class="subsection-title" style="margin:0;"><span>3a)</span><span>While handling patient or needle/sharps :</span></div>
      <div>${renderCheckRow("how_3a", s3aRight[0])}</div>
    </div>
    <div class="check-grid-2col" style="margin-top:4px;">
      <div class="check-col" style="padding-left:32px;">
        ${s3aLeft.map(i => renderCheckRow("how_3a", i)).join("")}
      </div>
      <div class="check-col">
        ${s3aRight.slice(1).map(i => renderCheckRow("how_3a", i)).join("")}
      </div>
    </div>

    <div class="subsection-title" style="margin-top:16px;">
      <span>3b)</span><span>While in operative field or during suturing procedures or autopsy:</span>
    </div>
    <div class="check-grid-2col">
      <div class="check-col" style="padding-left:32px;">
        ${s3bLeft.map(i => renderCheckRow("how_3b", i)).join("")}
      </div>
      <div class="check-col">
        ${s3bRight.map(i => renderCheckRow("how_3b", i)).join("")}
      </div>
    </div>
    ${footnotesHtml()}
  `;

  // ==================== PAGE 3: 3c, 3d, 3e, 3f ====================
  const s3cLeft = [
    { id: "s3c_proc_spec", label: "Processing specimens" },
    { id: "s3c_recap", label: "Recapping (missed / pierced cap)" },
    { id: "s3c_safety", label: "Activating safety device" },
    { id: "s3c_cleanup", label: "During clean-up" },
    { id: "s3c_glass", label: "Opening / breaking glass containers" },
    { id: "s3c_tray", label: "Handling equipment on tray / stand" }
  ];
  const s3cRight = [
    { id: "s3c_pass", slashChoices: ["Passing", "transferring equipment"], starEnd: true, value: "Passing / transferring equipment" },
    { id: "s3c_capfell", label: "Cap fell off after recapping" },
    { id: "s3c_disass", label: "Disassembling device / equipment" },
    { id: "s3c_transit", label: "In transit to disposal" },
    { id: "s3c_decon", label: "Decontamination / processing of used equipment" },
    { id: "s3c_trans_blood", slashChoices: ["Transferring blood", "body fluids into specimen container"], starEnd: true, value: "Transferring blood / body fluids into specimen container" }
  ];

  const s3dLeft = [
    { id: "s3d_coworker", label: "Collided with co-worker or other person" },
    { id: "s3d_dropped", label: "Sharps instrument dropped" }
  ];
  const s3dRight = [
    { id: "s3d_coll_inst", label: "Collided with sharps instrument" },
    { id: "s3d_detached", label: "Struck by detached IV line needle" }
  ];

  const s3eLeft = [
    { id: "s3e_disposed", label: "Injured by sharps being disposed" },
    { id: "s3e_already", label: "Injured by sharps already in sharps bin" },
    { id: "s3e_punctured", label: "Punctured sharps bin" },
    { id: "s3e_transport", label: "While transporting the sharps to collection center" }
  ];
  const s3eRight = [
    { id: "s3e_manip", label: "While manipulating sharps bin" },
    { id: "s3e_overfill", label: "Over-filled sharps bin" },
    { id: "s3e_protrud", label: "Protruding from opened sharps bin" }
  ];

  const s3fLeft = [
    { id: "s3f_trash", label: "In trash" },
    { id: "s3f_bed", label: "Left in bed / mattress" },
    { id: "s3f_linen", label: "In linen / laundry" },
    { id: "s3f_floor", label: "On floor" }
  ];
  const s3fRight = [
    { id: "s3f_table", slashChoices: ["Left on table", "tray"], starEnd: true, value: "Left on table / tray" },
    { id: "s3f_pocket", label: "In pocket / clothing" },
    { id: "s3f_other", label: "Other unusual locations (please describe):", belowInputId: "unusual-loc-input", value: "Other unusual locations" }
  ];

  document.getElementById("sec-how-occurred-p3").innerHTML = `
    <div class="subsection-title"><span>3c)</span><span>Handling equipment / specimens:</span></div>
    <div class="check-grid-2col">
      <div class="check-col" style="padding-left:32px;">${s3cLeft.map(i => renderCheckRow("how_3c", i)).join("")}</div>
      <div class="check-col">${s3cRight.map(i => renderCheckRow("how_3c", i)).join("")}</div>
    </div>

    <div class="subsection-title" style="margin-top:11px;"><span>3d)</span><span>Collision / contact with sharps object:</span></div>
    <div class="check-grid-2col">
      <div class="check-col" style="padding-left:32px;">${s3dLeft.map(i => renderCheckRow("how_3d", i)).join("")}</div>
      <div class="check-col">${s3dRight.map(i => renderCheckRow("how_3d", i)).join("")}</div>
    </div>

    <div class="subsection-title" style="margin-top:11px;"><span>3e)</span><span>Disposal related:</span></div>
    <div class="check-grid-2col">
      <div class="check-col" style="padding-left:32px;">${s3eLeft.map(i => renderCheckRow("how_3e", i)).join("")}</div>
      <div class="check-col">${s3eRight.map(i => renderCheckRow("how_3e", i)).join("")}</div>
    </div>

    <div class="subsection-title" style="margin-top:11px;"><span>3f)</span><span>Sharps in unusual locations:</span></div>
    <div class="check-grid-2col">
      <div class="check-col" style="padding-left:32px;">${s3fLeft.map(i => renderCheckRow("how_3f", i)).join("")}</div>
      <div class="check-col">${s3fRight.map(i => renderCheckRow("how_3f", i)).join("")}</div>
    </div>
  `;

  // ==================== PAGE 3: 3g ====================
  document.getElementById("sec-how-occurred-3g").innerHTML = `
    <div class="subsection-title"><span>3g)</span><span>Other circumstances (please describe):</span></div>
    <div class="dotted-lines-block">
      <input type="text" id="other-circumstances-1" class="full-dotted-input" />
      <input type="text" id="other-circumstances-2" class="full-dotted-input" />
    </div>
    <div class="double-bottom-rule"></div>
  `;

  // ==================== PAGE 3: >>4. WHICH TYPE OF DEVICE CAUSED THE INJURY? (4a & 4b) ====================
  const s4aLeft = [
    { id: "s4a_hypo", label: "Hypodermic needle" },
    { id: "s4a_ivcath", label: "IV Catheter stylet (Venofix / Branula)" },
    { id: "s4a_ivline", label: "Needle on IV line e.g piggy back, IV line connector" },
    { id: "s4a_central", label: "Central line catheter introducer needle" },
    { id: "s4a_spinal", label: "Spinal / epidural needle" }
  ];
  const s4aRight = [
    { id: "s4a_butterfly", label: "Butterfly needle" },
    { id: "s4a_marrow", label: "Bone marrow needle" },
    { id: "s4a_biopsy", label: "Biopsy needle" },
    { id: "s4a_others", label: "Others (please describe):", belowInputId: "needle-others-input", value: "Others" }
  ];

  const s4bLeft = [
    { id: "s4b_ampoule", label: "Medication ampoule" },
    { id: "s4b_vactube", label: "Vacuum tube (glass)" },
    { id: "s4b_pipette", label: "Pipette (glass)" },
    { id: "s4b_slide", label: "Glass slide" }
  ];
  const s4bRight = [
    { id: "s4b_capillary", label: "Capillary tube" },
    { id: "s4b_spectube", label: "Specimen / test tube (glass)" },
    { id: "s4b_ivbottle", label: "Medication / IV bottle (large volume)" },
    { id: "s4b_others", label: "Other glass item (please describe):", belowInputId: "glass-others-input", value: "Other glass item" }
  ];

  document.getElementById("sec-device-p3").innerHTML = `
    <div class="sec-header-line">
      <span class="sec-num"><span class="reg-mark">&raquo;</span>4.</span>
      <span>WHICH TYPE OF DEVICE CAUSED THE INJURY? <span class="tick-note">(Please tick (&#10003;) where applicable) select one(1) answer</span></span>
    </div>
    <hr class="thick-rule" />
    <div class="subsection-title"><span>4a)</span><span>Needles:</span></div>
    <div class="check-grid-2col">
      <div class="check-col" style="padding-left:32px;">${s4aLeft.map(i => renderCheckRow("dev_4a", i)).join("")}</div>
      <div class="check-col">${s4aRight.map(i => renderCheckRow("dev_4a", i)).join("")}</div>
    </div>

    <div class="subsection-title" style="margin-top:11px;"><span>4b)</span><span>Glass:</span></div>
    <div class="check-grid-2col">
      <div class="check-col" style="padding-left:32px;">${s4bLeft.map(i => renderCheckRow("dev_4b", i)).join("")}</div>
      <div class="check-col">${s4bRight.map(i => renderCheckRow("dev_4b", i)).join("")}</div>
    </div>
    ${footnotesHtml()}
  `;

  // ==================== PAGE 4: 4c (Separate Box 1) ====================
  const s4cCol1 = [
    { id: "s4c_lancet", label: "Lancet" },
    { id: "s4c_nails", label: "Finger nails / teeth" },
    { id: "s4c_scissors", label: "Scissors" },
    { id: "s4c_bonecutter", label: "Bone cutter" },
    { id: "s4c_bonechip", label: "Bone chip" },
    { id: "s4c_towelclip", label: "Towel clip" },
    { id: "s4c_trocar", label: "Trocar" },
    { id: "s4c_histology", label: "Histology cutting blade" }
  ];
  const s4cCol2 = [
    { id: "s4c_spectube_pl", label: "Specimen / test tube (plastic)" },
    { id: "s4c_scalpel", label: "Scalpel" },
    { id: "s4c_pipette_pl", label: "Pipette (plastic)" },
    { id: "s4c_staple", label: "Staple / steel suture" },
    { id: "s4c_microtome", label: "Microtome blade" },
    { id: "s4c_tenaculum", label: "Tenaculum" },
    { id: "s4c_sutureneedle", label: "Suture Needle" },
    { id: "s4c_explorer", label: "Explorer" }
  ];
  const s4cCol3 = [
    { id: "s4c_razor", label: "Razor" },
    { id: "s4c_retractor", slashChoices: ["Retractor, Skin", "bone hook"], starEnd: true, value: "Retractor, Skin / bone hook" },
    { id: "s4c_wire", label: "Wire (suture / fixation / guide wire)" },
    { id: "s4c_cautery", label: "Electro-cautery device" },
    { id: "s4c_pickup", label: "Pickup / Forcep / Hemostat / Clamp" },
    { id: "s4c_vactube_pl", label: "Vacuum tube (plastic)" },
    { id: "s4c_others", label: "Other sharps item (please describe):", belowInputId: "surgical-others-1", value: "Other sharps item" }
  ];

  document.getElementById("sec-device-4c").innerHTML = `
    <div class="subsection-title"><span>4c)</span><span>Surgical instruments or other items:</span></div>
    <div class="check-grid-3col" style="padding-left:28px;">
      <div class="check-col">${s4cCol1.map(i => renderCheckRow("dev_4c", i)).join("")}</div>
      <div class="check-col">${s4cCol2.map(i => renderCheckRow("dev_4c", i)).join("")}</div>
      <div class="check-col">${s4cCol3.map(i => renderCheckRow("dev_4c", i)).join("")}</div>
    </div>
  `;

  // ==================== PAGE 4: 5. WAS THE DEVICE CONTAMINATED?: (Separate Box 2) ====================
  const s5ContamList = [
    { id: "s5_contam", label: "Contaminated (known exposure to patient or contaminated equipment)", value: "Contaminated", singleGroup: "contam_5" },
    { id: "s5_uncontam", label: "Uncontaminated (no known exposure to patient or contaminated equipment)", value: "Uncontaminated", singleGroup: "contam_5" },
    { id: "s5_unknown", label: "Unknown", value: "Unknown", singleGroup: "contam_5" }
  ];

  document.getElementById("sec-device-5").innerHTML = `
    <div class="sec-header-line">
      <span class="sec-num">5.</span>
      <span>WAS THE DEVICE CONTAMINATED?:</span>
    </div>
    <hr class="thick-rule" />
    <div class="check-col" style="padding-left:32px;">
      ${s5ContamList.map(i => renderCheckRow("dev_5_contam", i)).join("")}
    </div>
  `;

  // ==================== PAGE 4: >>6. WHAT WAS THE PROCEDURE CONDUCTED? (Separate Box 3) ====================
  const s6ProcList = [
    { id: "s6_unknown", label: "Unknown / not applicable" },
    { id: "s6_inj", prefix: "Injection- ", starBeforeChoices: true, slashChoices: ["IV", "IM", "SC"], slashResultPrefix: "Injection - ", value: "Injection- IV / IM / SC" },
    { id: "s6_heparin", label: "Heparin or saline flush" },
    { id: "s6_other_inj", label: "Other injections into (or aspiration from) IV injection sites or IV ports" },
    { id: "s6_venous", label: "Drawing venous blood sample" },
    { id: "s6_arterial", label: "Drawing arterial blood sample" },
    { id: "s6_start_iv", label: "Starting IV or setting up Heparin block (IV catheter or butterfly type needle)" },
    { id: "s6_conn_iv", label: "Connecting IV line (intermittent IV line / piggy back / other IV connections)" },
    { id: "s6_art_line", label: "Placing an arterial / central line" },
    { id: "s6_finger", slashChoices: ["Finger stick", "Heel stik"], suffix: "(e.g to do glucometer)", starEnd: true, value: "Finger stick / Heel stik" },
    { id: "s6_suturing", label: "Suturing" },
    { id: "s6_dissecting", label: "Dissecting" },
    { id: "s6_drilling", label: "Drilling" },
    { id: "s6_electrocautery", label: "Electrocautery" },
    {
      id: "s6_bodyfluid",
      prefix: "Obtaining body fluid or tissue samples *(",
      slashChoices: ["CSF", "Peritoneal fluid", "Pleural fluid", "Biopsy"],
      suffix: ")",
      noSpaceBeforeSuffix: true,
      slashResultPrefix: "Obtaining body fluid or tissue samples - ",
      value: "Obtaining body fluid or tissue samples (CSF / Peritoneal fluid / Pleural fluid / Biopsy)"
    }
  ];

  document.getElementById("sec-procedure-6").innerHTML = `
    <div class="sec-header-line">
      <span class="sec-num"><span class="reg-mark">&raquo;</span>6.</span>
      <span>WHAT WAS THE PROCEDURE CONDUCTED? <span class="tick-note">(Please tick (&#10003;) where applicable)</span></span>
    </div>
    <hr class="thick-rule" />
    <div class="check-col" style="padding-left:32px; gap:3.2px;">
      ${s6ProcList.map(i => renderCheckRow("proc_6", i)).join("")}
      <div style="margin-top:3px;">
        <div style="font-size:11.6px;margin-bottom:2px;">Non medical procedures (please describe):</div>
        <div class="dotted-lines-block">
          <input type="text" id="proc-nonmed-1" class="full-dotted-input" />
          <input type="text" id="proc-nonmed-2" class="full-dotted-input" />
        </div>
      </div>
      <div style="margin-top:5px;">
        <div style="font-size:11.6px;margin-bottom:2px;">Others (please describe):</div>
        <div class="dotted-lines-block">
          <input type="text" id="proc-others-1" class="full-dotted-input" />
          <input type="text" id="proc-others-2" class="full-dotted-input" />
          <input type="text" id="proc-others-3" class="full-dotted-input" />
          <input type="text" id="proc-others-4" class="full-dotted-input" />
        </div>
      </div>
    </div>
    ${footnotesHtml()}
  `;
}

function initCharBoxes() {
  document.querySelectorAll(".char-boxes").forEach(container => {
    const count = parseInt(container.dataset.count || "2", 10);
    const group = container.dataset.boxGroup;
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const inp = document.createElement("input");
      inp.type = "text";
      inp.maxLength = 1;
      inp.className = "char-box";
      inp.dataset.group = group;
      container.appendChild(inp);
    }
  });

  const groups = new Set(Array.from(document.querySelectorAll(".char-box")).map(el => el.dataset.group));
  groups.forEach(groupName => {
    const boxes = Array.from(document.querySelectorAll(`.char-box[data-group="${groupName}"]`));
    boxes.forEach((box, idx) => {
      box.addEventListener("input", e => {
        if (e.target.value && idx < boxes.length - 1) {
          boxes[idx + 1].focus();
          boxes[idx + 1].select();
        }
      });
      box.addEventListener("keydown", e => {
        if (e.key === "Backspace" && !box.value && idx > 0) {
          boxes[idx - 1].focus();
        } else if (e.key === "ArrowLeft" && idx > 0) {
          boxes[idx - 1].focus();
        } else if (e.key === "ArrowRight" && idx < boxes.length - 1) {
          boxes[idx + 1].focus();
        }
      });
      box.addEventListener("paste", e => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData)
          .getData("text")
          .replace(/[^A-Za-z0-9]/g, "");
        for (let k = 0; k < pasted.length && idx + k < boxes.length; k++) {
          boxes[idx + k].value = pasted[k];
        }
        boxes[Math.min(idx + pasted.length, boxes.length - 1)].focus();
      });
    });
  });
}

function getBoxGroupValue(groupName) {
  return Array.from(document.querySelectorAll(`.char-box[data-group="${groupName}"]`))
    .map(b => b.value.trim())
    .join("");
}

function setBoxGroupValue(groupName, str) {
  const clean = String(str || "");
  const boxes = Array.from(document.querySelectorAll(`.char-box[data-group="${groupName}"]`));
  boxes.forEach((b, i) => {
    b.value = clean[i] || "";
  });
}

function initAsteriskSelectors() {
  document.querySelectorAll(".asterisk-selector[data-selector]").forEach(sel => {
    const choices = Array.from(sel.querySelectorAll(".asterisk-choice"));
    choices.forEach(ch => {
      ch.addEventListener("click", () => {
        choices.forEach(c => {
          c.classList.remove("selected");
          c.classList.add("struck");
        });
        ch.classList.remove("struck");
        ch.classList.add("selected");
      });
    });
  });

  document.querySelectorAll("[data-slash-container]").forEach(container => {
    const choices = Array.from(container.querySelectorAll(".asterisk-choice"));
    choices.forEach(ch => {
      ch.addEventListener("click", e => {
        e.stopPropagation();
        const already = ch.classList.contains("selected");
        if (already) {
          choices.forEach(c => c.classList.remove("selected", "struck"));
        } else {
          choices.forEach(c => {
            c.classList.remove("selected");
            c.classList.add("struck");
          });
          ch.classList.remove("struck");
          ch.classList.add("selected");
          const row = container.closest(".check-item-row");
          if (row) {
            const cb = row.querySelector(".box-check");
            if (cb) cb.checked = true;
          }
        }
      });
    });
  });

  document.querySelectorAll(".box-check.single-group").forEach(cb => {
    cb.addEventListener("change", () => {
      if (cb.checked) {
        const grp = cb.dataset.group;
        document.querySelectorAll(`.box-check.single-group[data-group="${grp}"]`).forEach(other => {
          if (other !== cb) other.checked = false;
        });
      }
    });
  });

  // Auto-tick row checkbox whenever user types in a specify/describe dotted input inside a check-item-row
  document.querySelectorAll(".check-item-row input[type='text']").forEach(inp => {
    inp.addEventListener("input", () => {
      if (inp.value.trim()) {
        const row = inp.closest(".check-item-row");
        const cb = row?.querySelector(".box-check");
        if (cb) cb.checked = true;
      }
    });
  });
}

function getSelectedAsterisk(selectorName) {
  const el = document.querySelector(`.asterisk-selector[data-selector="${selectorName}"] .asterisk-choice.selected`);
  return el ? el.dataset.val : "";
}

function getCheckedValuesInSection(sectionName) {
  const checked = Array.from(document.querySelectorAll(`.box-check[data-section="${sectionName}"]:checked`));
  return checked.map(cb => {
    const itemId = cb.dataset.itemId;
    const slashSel = document.querySelector(`[data-slash-container="${itemId}"] .asterisk-choice.selected`);
    if (slashSel) {
      return slashSel.dataset.val;
    }
    return cb.value;
  });
}

function computeAgeGroup(ageNum) {
  if (isNaN(ageNum) || ageNum <= 0) return "";
  if (ageNum < 20) return "< 20 YEARS";
  if (ageNum <= 29) return "20 - 29 YEARS";
  if (ageNum <= 39) return "30 - 39 YEARS";
  if (ageNum <= 49) return "40 - 49 YEARS";
  if (ageNum <= 59) return "50 - 59 YEARS";
  return ">= 60 YEARS";
}

function computeEmploymentGroup(durationVal, unit) {
  const num = parseFloat(durationVal);
  if (isNaN(num)) return "";
  const years = unit === "MONTH" ? num / 12 : num;
  if (years < 1) return "< 1 YEAR";
  if (years <= 5) return "1 - 5 YEARS";
  if (years <= 10) return "6 - 10 YEARS";
  return "> 10 YEARS";
}

function inferFacilityType(facilityName) {
  const up = (facilityName || "").toUpperCase();
  if (!up) return "";
  if (up.includes("HOSPITAL") || up.startsWith("HSB") || up.startsWith("HT")) return "HOSPITAL";
  if (up.includes("PERGIGIAN") || up.includes("DENTAL")) return "KLINIK PERGIGIAN";
  if (up.includes("KLINIK") || up.includes("KK ") || up.includes("HEALTH CLINIC")) return "KLINIK KESIHATAN";
  if (up.includes("PKD")) return "PKD";
  return "OTHERS";
}

function inferShiftwork(timeStr, ampm) {
  if (!timeStr) return "";
  const m = timeStr.match(/^(\d{1,2})/);
  if (!m) return "";
  let hr = parseInt(m[1], 10);
  if (ampm === "PM" && hr < 12) hr += 12;
  if (ampm === "AM" && hr === 12) hr = 0;
  if (hr >= 7 && hr < 14) return "MORNING";
  if (hr >= 14 && hr < 21) return "AFTERNOON";
  return "NIGHT";
}

function formatDateFromBoxes(monthGrp, dayGrp, yearGrp) {
  const mm = getBoxGroupValue(monthGrp);
  const dd = getBoxGroupValue(dayGrp);
  const yy = getBoxGroupValue(yearGrp);
  if (!mm && !dd && !yy) return "";
  const padM = mm.padStart(2, "0");
  const padD = dd.padStart(2, "0");
  const fullYear = yy.length === 2 ? (parseInt(yy, 10) > 50 ? "19" + yy : "20" + yy) : yy;
  return `${padD}/${padM}/${fullYear}`;
}

function build52ColumnRow(rowNumber = "") {
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

  const dateEntry = document.getElementById("field-notif-date").value.trim() || todayStr;
  const caseCode = document.getElementById("reg-case-code").value.trim();
  const state = document.getElementById("field-state").value.trim();
  const district = document.getElementById("field-district").value.trim();
  const facilityName = document.getElementById("field-facility-name").value.trim();
  const facilityType = document.getElementById("reg-facility-type").value.trim() || inferFacilityType(facilityName);
  const unit = document.getElementById("reg-unit").value.trim();

  const name = document.getElementById("field-name").value.trim();
  const genderEl = document.querySelector('.box-check[data-group="gender"]:checked');
  const gender = genderEl ? genderEl.value : "";

  const nricNew = getBoxGroupValue("nric-new");
  const nricOld = getBoxGroupValue("nric-old");
  const icOrPassport = nricNew && nricOld ? `${nricNew} (Old: ${nricOld})` : (nricNew || nricOld);

  const rawNat = document.getElementById("field-nationality").value.trim().toUpperCase();
  const isMalaysian = !rawNat || rawNat === "MALAYSIAN" || rawNat === "MALAYSIA" || rawNat === "WARGANEGARA";
  const nationality = rawNat ? (isMalaysian ? "MALAYSIAN" : "OTHERS") : "";
  const othersNationality = !isMalaysian && rawNat ? rawNat : "";

  const ageStr = getBoxGroupValue("age-jan1");
  const ageGroup = computeAgeGroup(parseInt(ageStr, 10));

  const department = document.getElementById("field-department").value.trim();
  const contactNo = document.getElementById("field-contact").value.trim();

  const injuryDate = formatDateFromBoxes("injury-month", "injury-day", "injury-year");
  const injuryTimeRaw = document.getElementById("field-injury-time").value.trim();
  const injuryAmPm = getSelectedAsterisk("injury-ampm");
  const injuryTime = injuryTimeRaw ? `${injuryTimeRaw} ${injuryAmPm}`.trim() : "";
  const shiftwork = document.getElementById("reg-shiftwork").value.trim() || inferShiftwork(injuryTimeRaw, injuryAmPm);

  const reportDate = formatDateFromBoxes("report-month", "report-day", "report-year");
  const reportTimeRaw = document.getElementById("field-report-time").value.trim();
  const reportAmPm = getSelectedAsterisk("report-ampm");
  const reportTime = reportTimeRaw ? `${reportTimeRaw} ${reportAmPm}`.trim() : "";

  const repMonthNum = parseInt(getBoxGroupValue("report-month"), 10);
  const monthOfReporting = repMonthNum >= 1 && repMonthNum <= 12 ? MONTH_NAMES[repMonthNum - 1] : "";

  const mohDuration = getBoxGroupValue("moh-duration");
  const mohUnit = getSelectedAsterisk("moh-unit");
  const sharpsDuration = getBoxGroupValue("sharps-duration");
  const sharpsUnit = getSelectedAsterisk("sharps-unit");
  const mohDurationGroup = computeEmploymentGroup(mohDuration, mohUnit);

  const jobCategories = getCheckedValuesInSection("job_category").join("; ");
  const jobSpecify = [
    document.getElementById("job-spec-input")?.value.trim(),
    document.getElementById("job-trainee-input")?.value.trim(),
    document.getElementById("job-others-input")?.value.trim()
  ].filter(Boolean).join("; ");

  const placeChecked = getCheckedValuesInSection("place_occurrence");
  const wardVal = document.getElementById("loc-ward-input")?.value.trim() || "";
  if (wardVal && !placeChecked.some(v => v.startsWith("Ward"))) {
    placeChecked.unshift("Ward");
  }
  const placeOccurrence = placeChecked.join("; ");
  const placeSpecify = [
    wardVal,
    document.getElementById("loc-elsewhere-input")?.value.trim(),
    document.getElementById("loc-others-input")?.value.trim()
  ].filter(Boolean).join("; ");

  const s3a = getCheckedValuesInSection("how_3a").join("; ");
  const s3b = getCheckedValuesInSection("how_3b").join("; ");
  const s3c = getCheckedValuesInSection("how_3c").join("; ");
  const s3d = getCheckedValuesInSection("how_3d").join("; ");
  const s3e = getCheckedValuesInSection("how_3e").join("; ");
  const s3f = getCheckedValuesInSection("how_3f").join("; ");
  const s3fSpecify = document.getElementById("unusual-loc-input")?.value.trim() || "";
  const s3gDescribe = [
    document.getElementById("other-circumstances-1")?.value.trim(),
    document.getElementById("other-circumstances-2")?.value.trim(),
    document.getElementById("other-circumstances-3")?.value.trim()
  ].filter(Boolean).join(" ");

  const howCategories = [];
  if (s3a) howCategories.push("3a) While handling patient or needle/sharps");
  if (s3b) howCategories.push("3b) While in operative field or during suturing procedures or autopsy");
  if (s3c) howCategories.push("3c) Handling equipment/specimens");
  if (s3d) howCategories.push("3d) Collision/contact with sharps object");
  if (s3e) howCategories.push("3e) Disposal related");
  if (s3f || s3fSpecify) howCategories.push("3f) Sharps in unusual locations");
  if (s3gDescribe) howCategories.push("3g) Other circumstances");
  const howSummary = howCategories.join("; ");

  const s4a = getCheckedValuesInSection("dev_4a").join("; ");
  const s4aOthers = document.getElementById("needle-others-input")?.value.trim() || "";
  const s4b = getCheckedValuesInSection("dev_4b").join("; ");
  const s4bOthers = document.getElementById("glass-others-input")?.value.trim() || "";
  const s4c = getCheckedValuesInSection("dev_4c").join("; ");
  const s4cOthers = document.getElementById("surgical-others-1")?.value.trim() || "";
  const s5Contam = getCheckedValuesInSection("dev_5_contam").join("; ");

  const deviceCategories = [];
  if (s4a || s4aOthers) deviceCategories.push("4a) Needles");
  if (s4b || s4bOthers) deviceCategories.push("4b) Glass");
  if (s4c || s4cOthers) deviceCategories.push("4c) Surgical instruments or other items");
  const deviceSummary = deviceCategories.join("; ");

  const s6Proc = getCheckedValuesInSection("proc_6").join("; ");
  const s6NonMed = [
    document.getElementById("proc-nonmed-1")?.value.trim(),
    document.getElementById("proc-nonmed-2")?.value.trim()
  ].filter(Boolean).join(" ");
  const s6Others = [
    document.getElementById("proc-others-1")?.value.trim(),
    document.getElementById("proc-others-2")?.value.trim(),
    document.getElementById("proc-others-3")?.value.trim(),
    document.getElementById("proc-others-4")?.value.trim()
  ].filter(Boolean).join(" ");

  return [
    rowNumber,          // 1. NO
    dateEntry,          // 2. DATE OF ENTRY (dd/mm/yyyy)
    caseCode,           // 3. CASE CODE
    state,              // 4. STATE
    district,           // 5. DISTRICT
    facilityType,       // 6. TYPE OF FACILITY
    facilityName,       // 7. NAME OF FACILITY
    name,               // 8. NAME
    icOrPassport,       // 9. NEW IC /PASSPORT NO.
    gender,             // 10. GENDER
    nationality,        // 11. NATIONALITY
    othersNationality,  // 12. OTHERS NATIONALITY (PLEASE SPECIFY)
    ageStr,             // 13. AGE ON THE 1st JANUARY (YEARS)
    ageGroup,           // 14. AGE GROUP
    department,         // 15. DEPARTMENT PRESENTLY ATTACHED TO
    unit,               // 16. UNIT
    contactNo,          // 17. CONTACT NO.
    injuryDate,         // 18. DATE OF INJURY (dd/mm/yyyy)
    injuryTime,         // 19. TIME OF INJURY (hh:mm)
    shiftwork,          // 20. SHIFTWORK
    reportDate,         // 21. DATE OF FIRST REPORTING (dd/mm/yyyy)
    reportTime,         // 22. TIME OF REPORTING (hh:mm)
    monthOfReporting,   // 23. MONTH OF REPORTING
    mohDuration,        // 24. DURATION OF EMPLOYMENT IN MOH
    mohUnit,            // 25. DURATION OF EMPLOYMENT (month/year)
    sharpsDuration,     // 26. DURATION OF WORK IN HANDLING SHARPS
    sharpsUnit,         // 27. HANDLING SHARPS (month/year)
    mohDurationGroup,   // 28. DURATION OF EMPLOYMENT GROUP
    jobCategories,      // 29. JOB CATEGORY
    jobSpecify,         // 30. IF SPECIALIST/ CONSULTANT/TRAINEE/OTHERS (PLEASE SPECIFY)
    placeOccurrence,    // 31. PLACE OF OCCURRENCE
    placeSpecify,       // 32. IF ELSEWHERE IN THE WARD OR OTHER PLACE OF OCCURRENCE (PLEASE SPECIFY)
    howSummary,         // 33. HOW DID THE SHARPS INJURY OCCUR
    s3a,                // 34. 3a) WHILE HANDLING PATIENT OR NEEDLE/SHARPS
    s3b,                // 35. 3b) WHILE IN OPERATIVE FIELD OR DURING SUTURING PROCEDURES OR AUTOPSY
    s3c,                // 36. 3c) HANDLING EQUIPMENT/SPECIMENS
    s3d,                // 37. 3d) COLLISION/CONTACT WITH SHARPS OBJECT
    s3e,                // 38. 3e) DISPOSAL RELATED
    s3f,                // 39. SHARPS IN UNUSUAL LOCATIONS
    s3fSpecify,         // 40. OTHER UNUSUAL LOCATION (PLEASE SPECIFY)
    s3gDescribe,        // 41. 3G) OTHER CIRCUMTANCES (PLEASE DESCRIBE)
    deviceSummary,      // 42. WHICH TYPE OF DEVICE CAUSED THE INJURY
    s4a,                // 43. 4a) NEEDLES
    s4aOthers,          // 44. OTHERS NEEDLE
    s4b,                // 45. 4b) GLASS
    s4bOthers,          // 46. OTHERS GLASS
    s4c,                // 47. 4c) SURGICAL INSTRUMENTS OR OTHER ITEMS
    s4cOthers,          // 48. OTHERS SHARPS ITEMS
    s5Contam,           // 49. WAS THE DEVICE CONTAMINATED?
    s6Proc,             // 50. PROCEDURE CONDUCTED
    s6NonMed,           // 51. NON MEDICAL PROCEDURE
    s6Others            // 52. OTHER PROCEDURES
  ];
}

function showStatus(type, message) {
  const banner = document.getElementById("status-banner");
  const msgEl = document.getElementById("status-message");
  banner.className = `status-banner ${type}`;
  msgEl.textContent = message;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function selectAsteriskValue(selectorName, val) {
  const sel = document.querySelector(`.asterisk-selector[data-selector="${selectorName}"]`);
  if (!sel) return;
  sel.querySelectorAll(".asterisk-choice").forEach(ch => {
    if (ch.dataset.val === val) {
      ch.classList.add("selected");
      ch.classList.remove("struck");
    } else {
      ch.classList.remove("selected");
      ch.classList.add("struck");
    }
  });
}

function fillDemoData() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  document.getElementById("field-notif-date").value = `${dd}/${mm}/${yyyy}`;
  document.getElementById("field-state").value = "KEDAH";
  document.getElementById("field-district").value = "KOTA SETAR";
  document.getElementById("field-facility-name").value = "HOSPITAL SULTANAH BAHIYAH";
  document.getElementById("reg-case-code").value = "KDH/HSB/2026/014";
  document.getElementById("reg-unit").value = "WAD PERUBATAN 4B";

  document.getElementById("field-name").value = "NURUL SHAHIRA BINTI AHMAD";
  document.getElementById("gender-female").checked = true;
  document.getElementById("gender-male").checked = false;

  setBoxGroupValue("nric-new", "950412025438");
  setBoxGroupValue("nric-old", "");
  document.getElementById("field-nationality").value = "MALAYSIAN";
  setBoxGroupValue("age-jan1", "31");
  document.getElementById("field-department").value = "JABATAN PERUBATAN AM";
  document.getElementById("field-contact").value = "0124567890";

  setBoxGroupValue("injury-month", "11");
  setBoxGroupValue("injury-day", "23");
  setBoxGroupValue("injury-year", "26");
  document.getElementById("field-injury-time").value = "09:15";
  selectAsteriskValue("injury-ampm", "AM");

  setBoxGroupValue("report-month", "11");
  setBoxGroupValue("report-day", "23");
  setBoxGroupValue("report-year", "26");
  document.getElementById("field-report-time").value = "09:45";
  selectAsteriskValue("report-ampm", "AM");

  setBoxGroupValue("moh-duration", "06");
  selectAsteriskValue("moh-unit", "YEAR");
  setBoxGroupValue("sharps-duration", "06");
  selectAsteriskValue("sharps-unit", "YEAR");

  document.querySelectorAll('.box-check[data-section]').forEach(cb => (cb.checked = false));

  const snCb = document.querySelector('.box-check[data-item-id="job_sn"]');
  if (snCb) snCb.checked = true;
  const wardBedCb = document.querySelector('.box-check[data-item-id="loc_ward_a"]');
  if (wardBedCb) wardBedCb.checked = true;
  document.getElementById("loc-ward-input").value = "WAD 4B";

  const s3aWit = document.querySelector('.box-check[data-item-id="s3a_wit_pat"]');
  if (s3aWit) s3aWit.checked = true;

  const s4aHypo = document.querySelector('.box-check[data-item-id="s4a_hypo"]');
  if (s4aHypo) s4aHypo.checked = true;

  const s5Contam = document.querySelector('.box-check[data-item-id="s5_contam"]');
  if (s5Contam) s5Contam.checked = true;

  const s6Venous = document.querySelector('.box-check[data-item-id="s6_venous"]');
  if (s6Venous) s6Venous.checked = true;

  showStatus("info", "Contoh data telah diisi. Sila semak paparan 4 halaman borang di bawah.");
}

function resetForm() {
  document.getElementById("ohu-form").reset();
  document.querySelectorAll(".char-box").forEach(b => (b.value = ""));
  document.querySelectorAll("[data-slash-container] .asterisk-choice").forEach(c => {
    c.classList.remove("selected", "struck");
  });
  showStatus("info", "Borang telah dikosongkan.");
}

function openPreviewModal() {
  const row = build52ColumnRow("(Auto)");
  const container = document.getElementById("preview-table-container");
  let html = `<table style="width:100%;border-collapse:collapse;font-size:12.5px;">
    <thead>
      <tr style="background:#1e293b;color:#fff;text-align:left;">
        <th style="padding:8px 10px;width:70px;">Lajur</th>
        <th style="padding:8px 10px;width:46%;">Pemboleh Ubah (WEHU Sheet 1)</th>
        <th style="padding:8px 10px;">Nilai Semasa</th>
      </tr>
    </thead>
    <tbody>`;

  WEHU_52_HEADERS.forEach((h, idx) => {
    const colLetter = idx < 26
      ? String.fromCharCode(65 + idx)
      : "A" + String.fromCharCode(65 + (idx - 26));
    const val = row[idx] || "";
    const bg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
    html += `<tr style="background:${bg};border-bottom:1px solid #e2e8f0;">
      <td style="padding:6px 10px;font-weight:700;color:#2563eb;">${colLetter} (${idx + 1})</td>
      <td style="padding:6px 10px;font-weight:600;color:#0f172a;">${h}</td>
      <td style="padding:6px 10px;color:${val ? "#065f46" : "#94a3b8"};font-family:monospace;">${val || "—"}</td>
    </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
  document.getElementById("preview-modal").classList.add("open");
}

async function submitToGoogleSheet() {
  const btn = document.getElementById("btn-submit");
  const name = document.getElementById("field-name").value.trim();
  if (!name) {
    showStatus("error", "Sila isi sekurang-kurangnya medan '>>1. Name' pada Halaman 1 sebelum menghantar.");
    return;
  }

  const rowValues = build52ColumnRow("").map((val, idx) => {
    // Preserve leading zeros in Google Sheets for IC/Passport (idx 8) and Contact No (idx 16)
    if ((idx === 8 || idx === 16) && typeof val === "string" && /^0\d+$/.test(val)) {
      return "'" + val;
    }
    return val;
  });
  btn.disabled = true;
  const origText = btn.textContent;
  btn.textContent = "Menghantar...";

  try {
    let result = null;
    const isLocalServer = window.location.protocol.startsWith("http") &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    if (isLocalServer) {
      const resp = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row: rowValues })
      });
      result = await resp.json();
      if (!resp.ok || !result.ok) {
        throw new Error((result && result.error) || "Ralat semasa menghantar data melalui pelayan tempatan.");
      }
    } else {
      const resp = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ row: rowValues })
      });
      result = await resp.json();
      if (!resp.ok || !result.ok) {
        throw new Error((result && result.error) || "Ralat semasa menghantar data ke Google Apps Script.");
      }
    }

    showStatus(
      "success",
      `Berjaya! Rekod (NO: ${result.rowNumber}) untuk "${name}" telah dimasukkan terus ke dalam Google Sheet OHU SIS-1.`
    );
  } catch (err) {
    showStatus("error", "Gagal menghantar: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = origText;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initFormSections();
  initCharBoxes();
  initAsteriskSelectors();

  document.querySelectorAll(".page-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".page-nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.page;
      document.querySelectorAll(".form-page").forEach(page => {
        if (target === "all" || page.dataset.pageNum === target) {
          page.classList.remove("hidden-page");
        } else {
          page.classList.add("hidden-page");
        }
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.getElementById("btn-wehu-meta").addEventListener("click", () => {
    document.getElementById("wehu-modal").classList.add("open");
  });
  document.getElementById("btn-close-wehu").addEventListener("click", () => {
    document.getElementById("wehu-modal").classList.remove("open");
  });
  document.getElementById("btn-save-wehu").addEventListener("click", () => {
    document.getElementById("wehu-modal").classList.remove("open");
  });

  document.getElementById("btn-demo").addEventListener("click", fillDemoData);
  document.getElementById("btn-reset").addEventListener("click", resetForm);
  document.getElementById("btn-preview-row").addEventListener("click", openPreviewModal);
  document.getElementById("btn-close-preview").addEventListener("click", () => {
    document.getElementById("preview-modal").classList.remove("open");
  });
  document.getElementById("btn-print").addEventListener("click", () => window.print());
  document.getElementById("btn-submit").addEventListener("click", submitToGoogleSheet);
});

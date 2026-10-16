/**
 * Comprehensive Automated Test Suite for VidyaPath Matching Engine
 * Covers hard criteria filtering, soft scoring, edge cases, boundaries, and checklists.
 */

const test = require('node:test');
const assert = require('node:assert');
const MatchingEngine = require('../src/services/matchingEngine');
const schemes = require('../src/data/schemes.json');

test('VidyaPath Matching Algorithm Suite', async (t) => {

  await t.test('Case 1: Low-income SC student in UG engineering should match Post-Matric SC & general aid', () => {
    const profile = {
      name: 'Ramesh Kumar',
      educationLevel: 'Undergraduate',
      stream: 'Engineering',
      percentage: 72,
      familyIncome: 180000,
      gender: 'Male',
      category: 'SC',
      religion: 'Hindu',
      state: 'All India',
      isPwd: false,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: false
    };

    const results = MatchingEngine.match(profile, schemes);
    assert.ok(results.eligible.length > 0, 'Should find eligible scholarships');

    const scPostMatric = results.eligible.find(s => s.id === 'SCH-NSP-002');
    assert.ok(scPostMatric, 'Post-Matric SC scholarship must be eligible');
    assert.strictEqual(scPostMatric.matchingDetails.status, 'eligible');
    assert.ok(scPostMatric.matchingDetails.score >= 70, 'Score should reflect SC need and merit');

    // Should NOT match girl-only schemes
    const girlOnly = results.eligible.find(s => s.id === 'SCH-AICTE-001');
    assert.strictEqual(girlOnly, undefined, 'Male student should not be matched to Pragati Girl scholarship');
  });

  await t.test('Case 2: Female Engineering student with 85% marks should match AICTE Pragati & Reliance', () => {
    const profile = {
      name: 'Ananya Sharma',
      educationLevel: 'Undergraduate',
      stream: 'Engineering',
      percentage: 85,
      familyIncome: 350000,
      gender: 'Female',
      category: 'General',
      religion: 'Hindu',
      state: 'Karnataka',
      isPwd: false,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: false
    };

    const results = MatchingEngine.match(profile, schemes);
    const pragati = results.eligible.find(s => s.id === 'SCH-AICTE-001');
    assert.ok(pragati, 'Female engineering student must be eligible for AICTE Pragati');
    assert.strictEqual(pragati.matchingDetails.status, 'eligible');
    assert.ok(pragati.matchingDetails.score >= 80, 'Score should be high for 85% engineering female student');

    // Pragati documents should be generated
    const docs = pragati.matchingDetails.tailoredDocuments;
    assert.ok(docs.length > 0, 'Document checklist should be generated');
  });

  await t.test('Case 3: PwD student with 50% disability should match AICTE Saksham and NFPwD', () => {
    const profile = {
      name: 'Kavitha S',
      educationLevel: 'Undergraduate',
      stream: 'Technical',
      percentage: 68,
      familyIncome: 280000,
      gender: 'Female',
      category: 'OBC',
      religion: 'Hindu',
      state: 'All India',
      isPwd: true,
      disabilityPercentage: 50,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: false
    };

    const results = MatchingEngine.match(profile, schemes);
    const saksham = results.eligible.find(s => s.id === 'SCH-AICTE-002');
    assert.ok(saksham, 'Specially-abled student must be eligible for AICTE Saksham');

    const pwdChecklist = saksham.matchingDetails.tailoredDocuments.find(d => d.category === 'Medical Proof');
    assert.ok(pwdChecklist, 'Medical proof document must be highlighted in checklist');
  });

  await t.test('Case 4: Minority student should match Begum Hazrat Mahal / Merit-cum-Means', () => {
    const profile = {
      name: 'Fatima Zohra',
      educationLevel: 'Undergraduate',
      stream: 'Medical',
      percentage: 78,
      familyIncome: 200000,
      gender: 'Female',
      category: 'General',
      religion: 'Muslim',
      state: 'All India',
      isPwd: false,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: false
    };

    const results = MatchingEngine.match(profile, schemes);
    const mcm = results.eligible.find(s => s.id === 'SCH-MA-002');
    assert.ok(mcm, 'Minority student in medical stream must be eligible for Merit-cum-Means');
  });

  await t.test('Case 5: Single Girl Child in Postgraduate course should match UGC Indira Gandhi', () => {
    const profile = {
      name: 'Pooja Iyer',
      educationLevel: 'Postgraduate',
      stream: 'Science',
      percentage: 74,
      familyIncome: 600000,
      gender: 'Female',
      category: 'General',
      religion: 'Hindu',
      state: 'All India',
      isPwd: false,
      isSingleGirlChild: true,
      isWardOfDefense: false,
      isRural: false
    };

    const results = MatchingEngine.match(profile, schemes);
    const ugcGirl = results.eligible.find(s => s.id === 'SCH-UGC-001');
    assert.ok(ugcGirl, 'Single girl child in PG course must match UGC scheme');

    const affidavitDoc = ugcGirl.matchingDetails.tailoredDocuments.find(d => d.category === 'Affidavit');
    assert.ok(affidavitDoc, 'Affidavit requirement must be flagged for single girl child');
  });

  await t.test('Case 6: Boundary Check on Minimum Marks (Cutoff 60%)', () => {
    // Scheme with 60% cutoff (e.g. HDFC Badhte Kadam or LIC Golden Jubilee)
    const baseProfile = {
      name: 'Boundary Test Student',
      educationLevel: 'Undergraduate',
      stream: 'Commerce',
      familyIncome: 200000,
      gender: 'Male',
      category: 'General',
      religion: 'Hindu',
      state: 'All India',
      isPwd: false,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: false
    };

    // Exactly 60%
    const passResult = MatchingEngine.match({ ...baseProfile, percentage: 60.0 }, schemes);
    const licPass = passResult.eligible.find(s => s.id === 'SCH-LIC-001');
    assert.ok(licPass, 'Student with exactly 60.0% must meet 60% cutoff');

    // 58.5% (slight deficit -> should be near match)
    const nearResult = MatchingEngine.match({ ...baseProfile, percentage: 58.5 }, schemes);
    const licNear = nearResult.nearMatches.find(s => s.id === 'SCH-LIC-001');
    assert.ok(licNear, 'Student with 58.5% should be classified as Near Match');
    assert.strictEqual(licNear.matchingDetails.status, 'near_match');

    // 45% (significant deficit -> ineligible)
    const failResult = MatchingEngine.match({ ...baseProfile, percentage: 45.0 }, schemes);
    const licFail = failResult.ineligible.find(s => s.id === 'SCH-LIC-001');
    assert.ok(licFail, 'Student with 45.0% should be classified as Ineligible for 60% cutoff');
  });

  await t.test('Case 7: Boundary Check on Income Cap (₹2,50,000)', () => {
    const baseProfile = {
      name: 'Income Test Student',
      educationLevel: 'Undergraduate',
      stream: 'Arts/Humanities',
      percentage: 70,
      gender: 'Male',
      category: 'SC',
      religion: 'Hindu',
      state: 'All India',
      isPwd: false,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: false
    };

    // Exactly ₹2,50,000 -> Passes
    const passResult = MatchingEngine.match({ ...baseProfile, familyIncome: 250000 }, schemes);
    const scPass = passResult.eligible.find(s => s.id === 'SCH-NSP-002');
    assert.ok(scPass, 'Income of exactly ₹2,50,000 must pass <= ₹2,50,000 limit');

    // ₹2,60,000 -> Exceeds by ₹10,000 (near match marginal)
    const nearResult = MatchingEngine.match({ ...baseProfile, familyIncome: 260000 }, schemes);
    const scNear = nearResult.nearMatches.find(s => s.id === 'SCH-NSP-002');
    assert.ok(scNear, 'Income of ₹2,60,000 should be Near Match (within ₹50k marginal window)');

    // ₹6,00,000 -> Exceeds by ₹3,50,000 -> Ineligible
    const failResult = MatchingEngine.match({ ...baseProfile, familyIncome: 600000 }, schemes);
    const scFail = failResult.ineligible.find(s => s.id === 'SCH-NSP-002');
    assert.ok(scFail, 'Income of ₹6,00,000 must be marked Ineligible');
  });

  await t.test('Case 8: Domicile State Specificity', () => {
    // Karnataka Scheme: SCH-KAR-001
    const karnatakaStudent = {
      name: 'Suresh Gowda',
      educationLevel: 'Undergraduate',
      stream: 'Science',
      percentage: 65,
      familyIncome: 200000,
      gender: 'Male',
      category: 'OBC',
      religion: 'Hindu',
      state: 'Karnataka',
      isPwd: false,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: false
    };

    const karnatakaResult = MatchingEngine.match(karnatakaStudent, schemes);
    const kspEligible = karnatakaResult.eligible.find(s => s.id === 'SCH-KAR-001');
    assert.ok(kspEligible, 'Karnataka student should be eligible for Karnataka SSP scholarship');

    // Same student with Delhi domicile -> should NOT be eligible
    const delhiStudent = { ...karnatakaStudent, state: 'Delhi' };
    const delhiResult = MatchingEngine.match(delhiStudent, schemes);
    const kspDelhi = delhiResult.eligible.find(s => s.id === 'SCH-KAR-001');
    assert.strictEqual(kspDelhi, undefined, 'Delhi student must not qualify for Karnataka SSP');
  });

  await t.test('Case 9: Rural First-Generation Scholarship Check', () => {
    const ruralStudent = {
      name: 'Santosh Yadav',
      educationLevel: 'Undergraduate',
      stream: 'Arts/Humanities',
      percentage: 72,
      familyIncome: 120000,
      gender: 'Male',
      category: 'OBC',
      religion: 'Hindu',
      state: 'Uttar Pradesh',
      isPwd: false,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: true
    };

    const res = MatchingEngine.match(ruralStudent, schemes);
    const ruralScheme = res.eligible.find(s => s.id === 'SCH-RUR-001');
    assert.ok(ruralScheme, 'Rural student must be matched to Rural First-Gen Award');

    // Non-rural student should NOT match
    const urbanStudent = { ...ruralStudent, isRural: false };
    const urbanRes = MatchingEngine.match(urbanStudent, schemes);
    const urbanRuralScheme = urbanRes.eligible.find(s => s.id === 'SCH-RUR-001');
    assert.strictEqual(urbanRuralScheme, undefined, 'Urban student should not match rural-only scholarship');
  });

  await t.test('Case 10: Class 10 Secondary / Pre-Matric student matching NMMSS and Pre-Matric SC', () => {
    const class10Student = {
      name: 'Class 10 Scholar',
      educationLevel: 'Class 10 (Secondary / Pre-Matric)',
      stream: 'Any',
      percentage: 75,
      familyIncome: 140000,
      gender: 'Male',
      category: 'SC',
      religion: 'Hindu',
      state: 'All India',
      isPwd: false,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: true
    };

    const res = MatchingEngine.match(class10Student, schemes);
    const nmms = res.eligible.find(s => s.id === 'SCH-NMMSS-001');
    assert.ok(nmms, 'Class 10 student should match NMMSS scheme');

    const preMatricSc = res.eligible.find(s => s.id === 'SCH-PRE-SC-001');
    assert.ok(preMatricSc, 'Class 10 SC student should match Pre-Matric SC scheme');
  });

  await t.test('Case 11: Overseas / Study Abroad student matching National Overseas Scholarship', () => {
    const abroadStudent = {
      name: 'Global Scholar',
      educationLevel: 'Study Abroad / National Overseas',
      stream: 'Engineering',
      percentage: 78,
      familyIncome: 500000,
      gender: 'Female',
      category: 'SC',
      religion: 'Hindu',
      state: 'All India',
      isPwd: false,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: false
    };

    const res = MatchingEngine.match(abroadStudent, schemes);
    const nos = res.eligible.find(s => s.id === 'SCH-NOS-001');
    assert.ok(nos, 'Eligible SC candidate should match National Overseas Scholarship (NOS)');
    assert.strictEqual(nos.matchingDetails.status, 'eligible');
  });
});

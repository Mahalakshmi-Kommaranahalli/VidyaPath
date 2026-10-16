/**
 * VidyaPath Core Scholarship Matching Engine
 * Evaluates student profiles against scholarship criteria with hard constraint checking,
 * soft scoring, probability estimation, and transparent diagnostics.
 */

class MatchingEngine {
  /**
   * Evaluates a student profile against a list of scholarship schemes.
   * @param {Object} studentProfile
   * @param {Array} schemes
   * @returns {Object} { eligible: [], nearMatches: [], ineligible: [], summary: {} }
   */
  static match(studentProfile, schemes) {
    const sanitizedProfile = this.sanitizeProfile(studentProfile);
    const currentDate = new Date();

    const evaluatedSchemes = schemes.map(scheme => {
      const evaluation = this.evaluateSingleScheme(sanitizedProfile, scheme, currentDate);
      return {
        ...scheme,
        matchingDetails: evaluation
      };
    });

    // Sort eligible by match score descending, then by award amount descending
    const eligible = evaluatedSchemes
      .filter(s => s.matchingDetails.status === 'eligible')
      .sort((a, b) => {
        if (b.matchingDetails.score !== a.matchingDetails.score) {
          return b.matchingDetails.score - a.matchingDetails.score;
        }
        return (b.award_amount_num || 0) - (a.award_amount_num || 0);
      });

    const nearMatches = evaluatedSchemes
      .filter(s => s.matchingDetails.status === 'near_match')
      .sort((a, b) => b.matchingDetails.score - a.matchingDetails.score);

    const ineligible = evaluatedSchemes
      .filter(s => s.matchingDetails.status === 'ineligible');

    // Aggregate statistics
    const totalPotentialFinancialAid = eligible.reduce((acc, s) => acc + (s.award_amount_num || 0), 0);

    return {
      studentSummary: {
        name: sanitizedProfile.name || 'Student',
        educationLevel: sanitizedProfile.educationLevel,
        stream: sanitizedProfile.stream,
        percentage: sanitizedProfile.percentage,
        category: sanitizedProfile.category,
        state: sanitizedProfile.state,
        familyIncome: sanitizedProfile.familyIncome
      },
      counts: {
        totalEvaluated: schemes.length,
        eligibleCount: eligible.length,
        nearMatchCount: nearMatches.length,
        ineligibleCount: ineligible.length
      },
      totalPotentialFinancialAid,
      eligible,
      nearMatches,
      ineligible
    };
  }

  /**
   * Sanitizes and parses profile inputs to avoid type discrepancies
   */
  static sanitizeProfile(raw) {
    const parseNumber = (val, fallback = 0) => {
      if (val === null || val === undefined || val === '') return fallback;
      const num = Number(val);
      return isNaN(num) ? fallback : num;
    };

    return {
      name: (raw.name || '').trim(),
      educationLevel: (raw.educationLevel || '').trim(),
      stream: (raw.stream || 'Any').trim(),
      percentage: parseNumber(raw.percentage, 0),
      familyIncome: parseNumber(raw.familyIncome, 0),
      gender: (raw.gender || 'All').trim(),
      category: (raw.category || 'General').trim(),
      religion: (raw.religion || 'Hindu').trim(),
      state: (raw.state || 'All India').trim(),
      isPwd: Boolean(raw.isPwd === true || raw.isPwd === 'true'),
      disabilityPercentage: parseNumber(raw.disabilityPercentage, 0),
      isSingleGirlChild: Boolean(raw.isSingleGirlChild === true || raw.isSingleGirlChild === 'true'),
      isWardOfDefense: Boolean(raw.isWardOfDefense === true || raw.isWardOfDefense === 'true'),
      isRural: Boolean(raw.isRural === true || raw.isRural === 'true')
    };
  }

  /**
   * Evaluates a student against a single scholarship
   */
  static evaluateSingleScheme(student, scheme, currentDate) {
    const c = scheme.criteria || {};
    const passedChecks = [];
    const failedChecks = [];
    let softScore = 60; // baseline for meeting minimum requirements

    // 1. Education Level Check
    const allowedLevels = c.education_levels || ['All'];
    const levelMatched = allowedLevels.includes('All') ||
      allowedLevels.includes(student.educationLevel) ||
      allowedLevels.some(l => {
        const lLower = l.toLowerCase();
        const sLower = (student.educationLevel || '').toLowerCase();
        return lLower.includes(sLower) || sLower.includes(lLower) ||
          (sLower.includes('10') && (lLower.includes('10') || lLower.includes('pre-matric') || lLower.includes('high school'))) ||
          ((sLower.includes('11') || sLower.includes('12') || sLower.includes('higher secondary')) && (lLower.includes('11') || lLower.includes('12') || lLower.includes('higher secondary') || lLower.includes('puc'))) ||
          (sLower.includes('undergraduate') && lLower.includes('undergraduate')) ||
          (sLower.includes('postgraduate') && lLower.includes('postgraduate')) ||
          ((sLower.includes('phd') || sLower.includes('research')) && (lLower.includes('phd') || lLower.includes('research'))) ||
          (sLower.includes('diploma') && lLower.includes('diploma')) ||
          (sLower.includes('iti') && lLower.includes('iti')) ||
          ((sLower.includes('overseas') || sLower.includes('abroad')) && (lLower.includes('overseas') || lLower.includes('abroad')));
      });

    if (levelMatched) {
      passedChecks.push(`Education level '${student.educationLevel}' matches.`);
    } else {
      failedChecks.push({
        field: 'educationLevel',
        severity: 'strict',
        message: `Requires education level in [${allowedLevels.join(', ')}], current: ${student.educationLevel}`
      });
    }

    // 2. Stream Check
    const allowedStreams = c.allowed_streams || ['Any'];
    const streamMatched = allowedStreams.includes('Any') ||
      allowedStreams.map(s => s.toLowerCase()).includes(student.stream.toLowerCase());
    if (streamMatched) {
      passedChecks.push(`Course stream '${student.stream}' is eligible.`);
    } else {
      failedChecks.push({
        field: 'stream',
        severity: 'strict',
        message: `Requires stream in [${allowedStreams.join(', ')}], current: ${student.stream}`
      });
    }

    // 3. Minimum Percentage Cutoff Check
    const minMarks = c.min_percentage !== undefined ? c.min_percentage : 0;
    if (student.percentage >= minMarks) {
      passedChecks.push(`Academic score (${student.percentage}%) meets minimum cutoff (${minMarks}%).`);
      // Score bonus based on merit margin
      const margin = student.percentage - minMarks;
      if (margin >= 20) softScore += 15;
      else if (margin >= 10) softScore += 10;
      else if (margin >= 5) softScore += 5;
    } else {
      const deficit = (minMarks - student.percentage).toFixed(1);
      const isSlight = deficit <= 5.0;
      failedChecks.push({
        field: 'percentage',
        severity: isSlight ? 'marginal' : 'strict',
        message: `Requires minimum ${minMarks}% marks. You have ${student.percentage}% (short by ${deficit}%).`
      });
    }

    // 4. Maximum Family Income Check
    const maxIncome = c.max_family_income;
    if (maxIncome === null || maxIncome === undefined || student.familyIncome <= maxIncome) {
      if (maxIncome !== null && maxIncome !== undefined) {
        passedChecks.push(`Family income (₹${student.familyIncome.toLocaleString('en-IN')}) is within limit (₹${maxIncome.toLocaleString('en-IN')}).`);
        // Financial need intensity bonus: poorer students get higher priority
        const incomeRatio = student.familyIncome / maxIncome;
        if (incomeRatio <= 0.4) softScore += 12;
        else if (incomeRatio <= 0.7) softScore += 7;
        else softScore += 3;
      } else {
        passedChecks.push(`No family income restriction for this merit scholarship.`);
      }
    } else {
      const excess = student.familyIncome - maxIncome;
      const isSlight = excess <= 50000;
      failedChecks.push({
        field: 'familyIncome',
        severity: isSlight ? 'marginal' : 'strict',
        message: `Family income (₹${student.familyIncome.toLocaleString('en-IN')}) exceeds max ceiling of ₹${maxIncome.toLocaleString('en-IN')}.`
      });
    }

    // 5. Gender Check
    const allowedGenders = c.genders || ['All'];
    if (allowedGenders.includes('All') || allowedGenders.includes(student.gender)) {
      passedChecks.push(`Gender '${student.gender}' is eligible.`);
      if (allowedGenders.includes('Female') && student.gender === 'Female') {
        softScore += 8; // Dedicated incentive bonus
      }
    } else {
      failedChecks.push({
        field: 'gender',
        severity: 'strict',
        message: `Scholarship is reserved for: ${allowedGenders.join(', ')}.`
      });
    }

    // 6. Social Category / Caste Check
    const allowedCats = c.categories || ['All'];
    if (allowedCats.includes('All') || allowedCats.includes(student.category)) {
      passedChecks.push(`Category '${student.category}' is eligible.`);
      if (['SC', 'ST'].includes(student.category) && allowedCats.includes(student.category)) {
        softScore += 6;
      }
    } else {
      failedChecks.push({
        field: 'category',
        severity: 'strict',
        message: `Reserved for categories: [${allowedCats.join(', ')}]. Student category: ${student.category}.`
      });
    }

    // 7. Religion / Minority Check
    const allowedReligions = c.religions || ['All'];
    if (allowedReligions.includes('All') || allowedReligions.includes(student.religion)) {
      passedChecks.push(`Community/Religion '${student.religion}' is eligible.`);
    } else {
      failedChecks.push({
        field: 'religion',
        severity: 'strict',
        message: `Reserved for notified minority religions: [${allowedReligions.join(', ')}].`
      });
    }

    // 8. State / Domicile Check
    const allowedStates = c.states || ['All India'];
    if (allowedStates.includes('All India') || allowedStates.includes(student.state)) {
      passedChecks.push(`Domicile '${student.state}' is eligible.`);
    } else {
      failedChecks.push({
        field: 'state',
        severity: 'strict',
        message: `Reserved exclusively for residents of: [${allowedStates.join(', ')}]. Current domicile: ${student.state}.`
      });
    }

    // 9. Disability / PwD Check
    if (c.is_pwd_required) {
      const minDis = c.min_disability_percentage || 40;
      if (student.isPwd && student.disabilityPercentage >= minDis) {
        passedChecks.push(`Disability criteria met (${student.disabilityPercentage}% >= ${minDis}%).`);
        softScore += 10;
      } else {
        failedChecks.push({
          field: 'isPwd',
          severity: 'strict',
          message: `Requires documented physical disability of at least ${minDis}%.`
        });
      }
    }

    // 10. Single Girl Child Check
    if (c.is_single_girl_child) {
      if (student.gender === 'Female' && student.isSingleGirlChild) {
        passedChecks.push(`Single girl child criteria satisfied.`);
        softScore += 10;
      } else {
        failedChecks.push({
          field: 'isSingleGirlChild',
          severity: 'strict',
          message: `Exclusively for Single Girl Child in the family.`
        });
      }
    }

    // 11. Ward of Armed Forces / Police Check
    if (c.is_ward_of_defense) {
      if (student.isWardOfDefense) {
        passedChecks.push(`Ward of Armed Forces/Police criteria satisfied.`);
        softScore += 10;
      } else {
        failedChecks.push({
          field: 'isWardOfDefense',
          severity: 'strict',
          message: `Reserved for wards/widows of Armed Forces, Paramilitary or Police personnel.`
        });
      }
    }

    // 12. Rural Only Check
    if (c.is_rural_only) {
      if (student.isRural) {
        passedChecks.push(`Rural domicile criteria satisfied.`);
        softScore += 8;
      } else {
        failedChecks.push({
          field: 'isRural',
          severity: 'strict',
          message: `Reserved for rural panchayat school graduates.`
        });
      }
    }

    // 13. Deadline Expiry Check
    let daysUntilDeadline = null;
    let isClosingSoon = false;
    let isExpired = false;
    if (scheme.deadline) {
      const deadlineDate = new Date(scheme.deadline);
      const diffTime = deadlineDate - currentDate;
      daysUntilDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (daysUntilDeadline < 0) {
        isExpired = true;
        failedChecks.push({
          field: 'deadline',
          severity: 'strict',
          message: `Applications closed on ${scheme.deadline}.`
        });
      } else if (daysUntilDeadline <= 20) {
        isClosingSoon = true;
      }
    }

    // Determine Final Status
    let status = 'ineligible';
    const isEligible = failedChecks.length === 0;

    if (isEligible) {
      status = 'eligible';
    } else if (failedChecks.length === 1 && failedChecks[0].severity === 'marginal') {
      // Exactly one slight miss (e.g., marks off by <= 5% or income off by <= 50,000)
      status = 'near_match';
      softScore = Math.max(45, softScore - 20);
    } else {
      status = 'ineligible';
      softScore = Math.max(10, 50 - (failedChecks.length * 15));
    }

    // Cap score at 98% (no algorithmic guarantee of 100% since final award rests with sponsor)
    const finalScore = Math.min(98, Math.max(10, softScore));

    // Dynamic Tag Generator
    const tags = [];
    if (status === 'eligible') {
      if (finalScore >= 80) tags.push({ label: 'Highly Likely', type: 'success' });
      else tags.push({ label: 'Eligible', type: 'info' });
    } else if (status === 'near_match') {
      tags.push({ label: 'Near Match', type: 'warning' });
    }

    if (isClosingSoon && !isExpired) {
      tags.push({ label: `Closing Soon (${daysUntilDeadline}d left)`, type: 'danger' });
    }
    if ((scheme.award_amount_num || 0) >= 50000) {
      tags.push({ label: 'High Aid Value', type: 'accent' });
    }
    if (scheme.category_type === 'Central Government') {
      tags.push({ label: 'National DBT', type: 'neutral' });
    } else if (scheme.category_type === 'Corporate CSR') {
      tags.push({ label: 'CSR Grant', type: 'neutral' });
    }

    // Generate Tailored Document Checklist for this student + scheme
    const tailoredDocuments = this.generateDocumentChecklist(student, scheme);

    return {
      status,
      score: finalScore,
      probabilityLabel: finalScore >= 85 ? 'High (85-98%)' : finalScore >= 70 ? 'Moderate (70-84%)' : 'Competitive (50-69%)',
      passedChecks,
      failedChecks,
      tags,
      daysUntilDeadline,
      isClosingSoon,
      isExpired,
      tailoredDocuments
    };
  }

  /**
   * Generates a contextual document checklist for student
   */
  static generateDocumentChecklist(student, scheme) {
    const docs = [...(scheme.required_documents || [])];
    const checklist = [];

    docs.forEach(docName => {
      let notes = 'Standard document required for submission.';
      let category = 'Identity & Academic';

      if (docName.toLowerCase().includes('income')) {
        notes = `Must certify annual income <= ₹${(scheme.criteria?.max_family_income || 0).toLocaleString('en-IN')} issued by Tehsildar / Revenue officer.`;
        category = 'Income Proof';
      } else if (docName.toLowerCase().includes('caste') || docName.toLowerCase().includes('tribe')) {
        notes = `Valid certificate verifying ${student.category} category with valid digital signature or barcode.`;
        category = 'Category Proof';
      } else if (docName.toLowerCase().includes('minority')) {
        notes = `Self-declaration or community certificate verifying ${student.religion} religious community.`;
        category = 'Category Proof';
      } else if (docName.toLowerCase().includes('disability') || docName.toLowerCase().includes('udid')) {
        notes = 'Unique Disability ID (UDID) or CMO certificate verifying minimum 40% disability.';
        category = 'Medical Proof';
      } else if (docName.toLowerCase().includes('girl child')) {
        notes = 'Notarized affidavit on stamp paper from Executive Magistrate/SDM verifying single girl child status.';
        category = 'Affidavit';
      } else if (docName.toLowerCase().includes('rural') || docName.toLowerCase().includes('sarpanch')) {
        notes = 'Official residential letter signed and sealed by Village Panchayat Head / Gram Sevak.';
        category = 'Residence Proof';
      } else if (docName.toLowerCase().includes('aadhaar')) {
        notes = 'Must be linked to active bank account with NPCI mapper enabled for direct DBT.';
        category = 'Banking & ID';
      }

      checklist.push({
        name: docName,
        category,
        notes,
        isCompleted: false
      });
    });

    return checklist;
  }
}

module.exports = MatchingEngine;

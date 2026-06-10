import { useState, useEffect, useMemo } from "react";

// ─── DESIGN SYSTEM (Tschichold Penguin · editorial cream/orange) ──
const T = {
  paper:'#f1ead7', paper2:'#e8e0c8', paper3:'#fdf8e9',
  ink:'#161410', ink2:'#3a342a',
  orange:'#d4612a', orange2:'#a14a1f',
  rule:'#161410', muted:'#6e6655',
  green:'#3d6b3d', greenBg:'#dde9d8',
  red:'#9a2929', redBg:'#f0dcdc',
  hairline:'rgba(22,20,16,.18)',
  serif:`'EB Garamond',Garamond,Georgia,serif`,
  sans:`'Inter',system-ui,-apple-system,sans-serif`,
};

const baseStyles = {
  html: { background: T.paper, color: T.ink, fontFamily: T.serif, WebkitFontSmoothing: 'antialiased' },
  cap: { fontFamily: T.sans, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 600 },
  capSm: { fontFamily: T.sans, fontSize: 10, letterSpacing: '.32em', textTransform: 'uppercase', fontWeight: 600, color: T.muted },
  ital: { fontStyle: 'italic', fontWeight: 400 },
};

// ═══════════════════════════════════════════════════════════════
// EXAM CONTENT · Edit this block to fork a new exam app.
// Everything below the ENGINE divider is generic and can be copied
// verbatim across exam apps. Only the constants in this block differ.
// ═══════════════════════════════════════════════════════════════

const SUBTESTS = {
  C1: { label:"Foundations of Special Education", roman:"I" },
  C2: { label:"Knowledge of Students with Disabilities", roman:"II" },
  C3: { label:"Assessment & Individual Program Planning", roman:"III" },
  C4: { label:"Learning Environment & Behavioral Interventions", roman:"IV" },
  C5: { label:"Instructional Planning & Delivery", roman:"V" },
  C6: { label:"Communication, Social & Functional Living Skills", roman:"VI" },
};

const WELCOME = {
  "imprint": "New York State · NYSTCE CST Students with Disabilities (060)",
  "triBand": [
    "A Course in Four Phases",
    "Students with Disabilities · CST 060"
  ],
  "title": {
    "pre": "Students with",
    "italic": "Disabilities",
    "post": ""
  },
  "subtitle": "A complete preparation course for the NYSTCE Content Specialty Test: Students with Disabilities (060) — seven competencies, ninety selected-response items, and one written assignment.",
  "alignment": [
    "NYSTCE 060 Framework",
    "IDEA & NY Part 200",
    "7 Competencies"
  ],
  "steps": [
    [
      "Take the Pretest",
      "Thirty-two questions across the six selected-response competencies establish your baseline."
    ],
    [
      "Review Your Results",
      "A competency-by-competency analysis shows precisely where to focus."
    ],
    [
      "Study the Modules",
      "Fifteen modules with concept summaries and exam-style practice. Flagged areas come first."
    ],
    [
      "Take the Post-Test",
      "Thirty-two fresh questions measure your growth — then drill the written assignment."
    ]
  ],
  "subareasHeading": "The Six SR Competencies",
  "subareaWord": "Competency",
  "posttestIntro": "fresh questions across the six competencies. Demonstrate the growth of your study.",
  "crSubtitle": "Competency 0007 · Analysis, Synthesis & Application — 20% of your score",
  "colophon": "Set in EB Garamond. Composed for the New York State teaching candidate, in the manner of a Penguin Classic. Aligned to the NYSTCE CST Students with Disabilities (060) framework, IDEA, and Part 200 of the Regulations of the Commissioner of Education.",
  "testFacts": {
    "heading": "CST 060 at a Glance",
    "tables": [
      {
        "title": "Test Design",
        "rows": [
          [
            "Selected-response items",
            "90 items · 80% of score"
          ],
          [
            "Written assignment",
            "1 constructed-response · 20% of score"
          ],
          [
            "Total time",
            "3 hours 15 minutes"
          ],
          [
            "Passing score",
            "520"
          ]
        ]
      },
      {
        "title": "Competency Weights",
        "rows": [
          [
            "0001 Foundations of Special Education",
            "10%"
          ],
          [
            "0002 Knowledge of Students with Disabilities",
            "10%"
          ],
          [
            "0003 Assessment & Individual Program Planning",
            "20%"
          ],
          [
            "0004 Learning Environment & Behavioral Interventions",
            "10%"
          ],
          [
            "0005 Instructional Planning & Delivery",
            "20%"
          ],
          [
            "0006 Communication, Social & Functional Living",
            "10%"
          ],
          [
            "0007 Analysis, Synthesis & Application (written)",
            "20%"
          ]
        ]
      }
    ],
    "note": "Specifications from the official NYSTCE 060 test design (nystce.nesinc.com). Confirm current details in your registration materials."
  }
};

const PRETEST = [
  {s:"C1", d:"Special Education Law & Policy",
   q:"A parent disagrees with the district's psychoeducational evaluation of her son and requests an independent educational evaluation (IEE) at public expense. Under IDEA's procedural safeguards, how must the district respond?",
   a:["Deny the request, provided documentation shows the district evaluation followed all required assessment procedures", "Either fund the IEE at public expense or file a due process complaint to demonstrate that its own evaluation was appropriate", "Fund the IEE only if an impartial hearing officer first reviews the district evaluation and finds it deficient", "Direct the parent to obtain the IEE privately and submit receipts for reimbursement after the CSE reviews the report"],
   c:1, r:"Under 34 CFR 300.502 and 8 NYCRR 200.5(g), a district receiving an IEE request must, without unnecessary delay, either ensure the IEE is provided at public expense or initiate a due process hearing to show its evaluation was appropriate. Option A is the strongest distractor because procedural compliance alone does not extinguish the IEE right; the district must still choose between the two statutory responses. Options C and D invert the burden, since the parent need not litigate first or front the cost to trigger the entitlement."},
  {s:"C1", d:"Special Education Law & Policy",
   q:"A CSE is discussing whether an eighth grader with a specific learning disability who reads three years below grade level should take the New York State Alternate Assessment instead of the general ELA assessment. Which statement should guide the committee's decision?",
   a:["Any student with an IEP may take the alternate assessment when the committee agrees the general test would cause frustration", "Students performing two or more years below grade level meet the participation criteria for alternate assessment in that subject", "Federal law exempts students with disabilities from statewide assessment when the IEP documents that testing is not beneficial", "Alternate assessments are limited to students with the most significant cognitive disabilities and capped at 1% of tested students per subject"],
   c:3, r:"Under ESSA and its implementing regulations, alternate assessments aligned to alternate achievement standards are limited to students with the most significant cognitive disabilities, with a statewide 1% participation cap per subject, and a learning disability with low reading achievement does not meet that criterion. Option B is the strongest distractor because achievement gaps feel like a natural trigger, but participation criteria rest on significant cognitive disability and adaptive functioning, not years below grade level. Options A and C contradict ESSA's requirement that virtually all students with disabilities take the general assessment, with accommodations as needed."},
  {s:"C1", d:"History, Ethics & Equity",
   q:"In Mills v. Board of Education of the District of Columbia (1972), the court rejected the district's defense that it lacked the money to serve children with disabilities. Which principle did the decision establish?",
   a:["Insufficient funds cannot justify denying education to students with disabilities, and any shortfall must be shared equitably across all students", "School districts must maximize each student's potential commensurate with the opportunities provided to students without disabilities", "Racially segregated special education programs are inherently unequal and violate the Fourteenth Amendment's equal protection clause", "An education program must be reasonably calculated to enable progress appropriate in light of each child's individual circumstances"],
   c:0, r:"Mills extended the right to public education to all children with disabilities regardless of type or severity and held that fiscal constraints cannot excuse exclusion; if funds are short, the burden must be shared equitably rather than imposed on students with disabilities. Option C is the strongest distractor because Mills did borrow Brown's equal protection logic, but the racial segregation holding belongs to Brown v. Board (1954), not Mills. Options B and D state FAPE standards from later cases, the maximization language rejected in Rowley and the progress standard from Endrew F. (2017)."},
  {s:"C1", d:"History, Ethics & Equity",
   q:"In the faculty lounge, a general education teacher asks a special education teacher whether a student in her homeroom \"is classified and on medication,\" explaining that she is curious after the student's outburst at dismissal. The student is not on the teacher's roster. Which response best reflects professional ethics and FERPA?",
   a:["Share the classification and medication information, since colleagues in the same building are entitled to records of any enrolled student", "Decline to share anything and explain that general education teachers can never receive information from a student's special education records", "Decline to discuss the information in that setting, and note that record information is shared only with staff who have a legitimate educational interest", "Refer the teacher to the parent, since FERPA requires written parental consent before any school employee may learn of a classification"],
   c:2, r:"FERPA permits disclosure of personally identifiable information without consent only to school officials with a legitimate educational interest, and curiosity about a student outside one's instructional responsibility does not qualify; CEC ethics likewise bar casual disclosure in public settings like a lounge. Option B is the strongest distractor because it overcorrects: general education teachers who serve a student must be informed of their IEP responsibilities under Part 200, so a blanket refusal misstates the rule. Options A and D err in opposite directions, since building employment alone confers no right of access, while consent is not required for officials who do have a legitimate educational interest."},
  {s:"C2", d:"High-Incidence Disabilities (SLD, Speech/Language, OHI/ADHD)",
   q:"A fourth grader dictates rich, well-organized stories to a scribe but independently produces only two or three barely legible sentences riddled with misspellings of common words; reading is at grade level. This pattern most strongly suggests:",
   a:["a language disorder affecting content, given how little written output the student generates on the page", "an attention-based difficulty, since sustained independent writing demands far more focus than dictation", "dysgraphia, in which transcription demands consume the cognitive resources needed for composition", "an intellectual disability that limits the quality of the student's expressive output across modalities"],
   c:2, r:"The dictation-versus-writing gap isolates the deficit to transcription: when handwriting and spelling are removed, composition is strong, which is the defining dissociation in dysgraphia, an SLD in written expression. The attention option is the strongest distractor, but attention problems would not produce the specific signature of illegibility plus misspelled high-frequency words while oral composition stays organized across equally long dictation sessions. Rich dictated language rules out a content-level language disorder and intellectual disability."},
  {s:"C2", d:"High-Incidence Disabilities (SLD, Speech/Language, OHI/ADHD)",
   q:"A speech-language pathologist evaluates two kindergartners. The first substitutes /w/ for /r/ and is difficult to understand; the second speaks clearly but uses two-word utterances, has a very small vocabulary, and cannot follow two-step directions. The most accurate characterization is that:",
   a:["both students present speech production disorders that differ mainly in their overall severity", "both students present language disorders that happen to affect different linguistic components", "the first student presents a mixed receptive-expressive language disorder, while the second presents a speech (articulation) disorder", "the first student presents a speech (articulation) disorder, while the second presents a mixed receptive-expressive language disorder"],
   c:3, r:"Sound substitutions affecting intelligibility are an articulation problem, a speech disorder involving production, while restricted utterance length, sparse vocabulary, and difficulty following directions implicate the language system itself in both expressive and receptive channels. Option C is the strongest distractor for candidates who reverse the speech/language distinction. The difference matters educationally: language impairment, unlike most articulation errors, is a strong predictor of later reading difficulty."},
  {s:"C2", d:"Autism, Emotional Disability & Behavioral Profiles",
   q:"A parent gives the CSE a private psychologist's DSM-5-TR diagnosis of autism spectrum disorder and asks that the student be classified with autism at once. The CSE's most appropriate course is to:",
   a:["adopt the classification immediately, since a clinical ASD diagnosis establishes eligibility under Part 200 by itself", "treat the diagnosis as evaluation information while determining whether the disability adversely affects educational performance", "set the private report aside, because only evaluations conducted by district-employed evaluators may inform eligibility", "hold the classification question open until the student has first completed a full response to intervention cycle"],
   c:1, r:"A clinical diagnosis and an educational classification are distinct determinations: the CSE must consider the private evaluation but must itself find that the condition adversely affects educational performance and that the student needs special education (8 NYCRR 200.1(zz)(1); 34 CFR 300.306). Option A is the strongest distractor because many candidates assume a diagnosis equals eligibility, yet some students with ASD diagnoses perform adequately without special education. RtI is not a prerequisite for any initial evaluation, and committees must consider outside evaluations rather than discard them."},
  {s:"C2", d:"Low-Incidence, Sensory & Physical Disabilities",
   q:"A teacher notices that a congenitally blind second grader uses words like 'cloud,' 'shadow,' and 'skyscraper' fluently in sentences yet cannot answer basic questions about what these things actually are. This phenomenon is best described as:",
   a:["verbalism, reflecting gaps in firsthand concept development that vision typically provides", "a co-occurring receptive language impairment that warrants a speech-language evaluation", "an early indicator of an intellectual disability affecting the student's semantic memory", "echolalia, suggesting that much of the student's spontaneous language is rote and imitative"],
   c:0, r:"Verbalism, the fluent use of words without grasp of their experiential referents, is a well-documented phenomenon in congenital blindness because such concepts are normally acquired through vision and incidental observation. The receptive-language option is the strongest distractor, but the student's grammar and conversational use are intact; the gap is conceptual-experiential and is addressed through systematic hands-on, concrete instruction, a pillar of programming for visual impairment. Neither rote imitation nor global cognitive impairment is indicated by this isolated pattern."},
  {s:"C3", d:"Assessment Types & Score Interpretation",
   q:"Fall universal screening flags a kindergartner as below benchmark in phonemic awareness. Which next step is most appropriate?",
   a:["Initiate a referral to the CSE immediately, since a below-benchmark screening result indicates a probable disability.", "Administer diagnostic measures to identify the specific skill deficits and begin targeted instruction.", "Readminister the same screening measure weekly until the results stabilize across administrations.", "Administer a comprehensive norm-referenced achievement battery to obtain standard scores."],
   c:1, r:"Universal screening only flags risk; the appropriate follow-up is diagnostic assessment to pinpoint the specific phonemic awareness deficits so targeted intervention can begin. A single below-benchmark screen does not indicate a probable disability, so an immediate referral is premature, although a parent always retains the right to refer. A full norm-referenced battery, the strongest distractor, yields relative standing rather than the skill-level detail needed to plan instruction."},
  {s:"C3", d:"Assessment Types & Score Interpretation",
   q:"On a standardized behavior rating scale, a student receives a T-score of 60. Which interpretation is correct?",
   a:["The student scored well below average, comparable to a standard score of 60.", "The student scored at the 60th percentile, placing him squarely within the average range of the norm group.", "The student scored one standard deviation above the mean, comparable to a standard score of 115.", "The student scored in stanine 6, just slightly above the mean of the norm group."],
   c:2, r:"T-scores have a mean of 50 and a standard deviation of 10, so a T-score of 60 is one standard deviation above the mean, equivalent to a standard score of 115, the 84th percentile, and stanine 7. Reading the T-score as a percentile rank is the most common conversion error and is wrong because the metrics share numbers but not scales. All members of the standard score family must be compared through standard deviation units."},
  {s:"C3", d:"Assessment Types & Score Interpretation",
   q:"A CSE wants to identify the mismatch between a seventh grader's skills and the routines, expectations, and supports of his ICT classroom before recommending supplementary aids and services. Which assessment approach best fits this purpose?",
   a:["An ecological assessment of the classroom's demands and the student's performance within that setting.", "A norm-referenced adaptive behavior scale completed by the student's parent at home.", "A standardized achievement battery to establish the student's current instructional levels in all academic areas.", "A criterion-referenced checklist of the grade-level academic skills the student has mastered."],
   c:0, r:"An ecological assessment examines the interaction between the student and the demands, routines, and expectations of a specific environment, which directly identifies the supports needed for success in that setting. Norm-referenced adaptive behavior scales and achievement batteries describe the student's standing relative to peers, and a skills checklist describes the student in isolation. None of those captures the student-environment fit the committee is asking about."},
  {s:"C3", d:"The IEP Process & Components",
   q:"A parent signs consent for her son's initial special education evaluation on October 1. Under New York regulations, the evaluation must be completed:",
   a:["within 30 school days of the date of the CSE meeting.", "within 60 school days of receipt of parental consent.", "within 90 calendar days of the date of the initial referral.", "within 60 calendar days of receipt of parental consent."],
   c:3, r:"In New York, an initial individual evaluation must be completed within 60 calendar days of receiving parental consent (8 NYCRR 200.4(b)). The strongest distractor, 60 school days, is the separate timeline within which the board of education must arrange for the recommended programs and services after the IEP is developed. Confusing the calendar-day evaluation deadline with the school-day arrangement deadline is one of the most common errors on this competency."},
  {s:"C3", d:"The IEP Process & Components",
   q:"While reviewing a draft IEP, a CSE chairperson notices an annual goal targeting written expression, but the present levels of performance contain no data or identified needs related to writing. What is the most significant problem with this draft?",
   a:["The goal addresses an area that is not measured on the State assessments.", "The goal was drafted by staff before the committee meeting convened.", "The goal does not correspond to any need documented in the present levels of performance.", "The goal lacks the short-term objectives or benchmarks that must accompany every annual goal."],
   c:2, r:"The PLAAFP is the data foundation of the IEP: every annual goal must address a need documented in the present levels, so a writing goal with no corresponding present-levels content breaks the IEP's internal alignment and must be fixed by updating the PLAAFP with current data or reconsidering the goal. The short-term objectives option is the strongest distractor, but New York requires objectives or benchmarks only for preschool students and for students who take the State alternate assessment. Draft goals prepared in advance are permissible when presented as proposals open to parent input."},
  {s:"C3", d:"The IEP Process & Components",
   q:"An occupational therapist provides weekly services that a fourth grader with cerebral palsy requires in order to benefit from her special education program. Under IDEA, these services are best categorized as:",
   a:["a related service.", "specially designed instruction.", "a program modification.", "a supplementary aid and service."],
   c:0, r:"Related services are developmental, corrective, and other supportive services, including occupational therapy, that are required to assist a student with a disability to benefit from special education (34 CFR 300.34). Specially designed instruction is the strongest distractor, but SDI is the adaptation of the content, methodology, or delivery of instruction itself; the OT here supports the student's access to that instruction rather than constituting it. Supplementary aids and services are supports provided in general education settings to enable participation with nondisabled peers."},
  {s:"C3", d:"Eligibility, Reevaluation & Procedural Safeguards",
   q:"A Committee on Preschool Special Education determines that a 4-year-old with significant delays in language and motor development is eligible for special education. Under 8 NYCRR Part 200, the child's classification is:",
   a:["developmental delay, the federal option for children ages 3 through 9.", "multiple disabilities, reflecting the combined language and motor delays.", "other health impairment, based on the underlying medical condition.", "preschool student with a disability, the single classification for ages 3 through 5."],
   c:3, r:"New York does not use a developmental delay classification at any age; under 8 NYCRR 200.1, all eligible children ages 3-5 receive the single classification 'preschool student with a disability.' Developmental delay is the strongest distractor because federal IDEA permits states to adopt it, but New York has not. The 13 categorical classifications, such as multiple disabilities and other health impairment, apply to school-age students."},
  {s:"C3", d:"Eligibility, Reevaluation & Procedural Safeguards",
   q:"A parent asks the CSE to change her son's classification from other health impairment to autism. After reviewing the evaluation data, the committee refuses to make the change. What is the district required to provide the parent?",
   a:["A copy of the procedural safeguards notice and nothing further, since no change to the IEP was made.", "Prior written notice describing the refusal, the data relied on, and the options considered.", "An independent educational evaluation at public expense to resolve the disagreement.", "A written offer of mediation, which the parent must accept before filing for due process."],
   c:1, r:"Prior written notice is required whenever a district proposes or refuses to initiate or change the identification, evaluation, or placement of a student (34 CFR 300.503), so a refusal triggers PWN even though nothing changed; the notice must describe the action refused, the data relied upon, and the options considered. The IEE option is the strongest distractor, but the right to a publicly funded IEE attaches to disagreement with a district evaluation, not to a classification dispute. Mediation is always voluntary and is never a prerequisite for due process."},
  {s:"C4", d:"Classroom & Behavior Management",
   q:"A second grader with ADHD routinely refuses to begin handwriting practice. Her teacher starts delivering quick requests the student reliably follows, such as 'Give me five,' 'Touch your nose,' and 'Pass me that marker,' immediately before presenting the handwriting direction, and refusals drop sharply. The teacher is using",
   a:["noncontingent reinforcement", "the Premack principle", "differential reinforcement of alternative behavior", "a high-probability request sequence"],
   c:3, r:"Presenting a rapid series of requests the student is highly likely to follow immediately before a low-probability demand builds behavioral momentum that carries over into compliance with the target request. The Premack principle (B) is the strongest distractor, but Premack makes access to a preferred activity contingent on first completing the less preferred one ('first-then'); here nothing is offered contingently, and the easy requests simply precede the difficult one."},
  {s:"C4", d:"Classroom & Behavior Management",
   q:"In a 12:1:1 special class, pushing and arguing erupt daily at the single shelf where all students retrieve folders, manipulatives, and tablets at the same time. Which change addresses the problem most directly?",
   a:["Post and review a rule about keeping hands and feet to oneself near the shelf", "Distribute materials across separated stations and stagger access by small groups", "Award bonus points to students observed waiting at the shelf without touching peers", "Move the students most often involved in the conflicts to seats farthest from the shelf"],
   c:1, r:"The aggression is occasioned by an environmental design problem, crowding at a single high-demand location, so redesigning the space and the access routine removes the antecedent that triggers the behavior. Reinforcing appropriate waiting (C) is the strongest distractor, but it leaves the congestion intact and asks students to tolerate a poorly designed setting; antecedent environmental modification is more direct, preventive, and durable."},
  {s:"C4", d:"FBA, BIP & Behavioral Interventions",
   q:"A school-based team has interview and ABC data suggesting a student's disruptive behavior is attention-maintained but wants stronger confirmation before writing the BIP. What distinguishes a functional analysis from the descriptive assessment the team has already completed?",
   a:["It gathers teacher and parent perceptions through structured interviews and rating scales", "It records naturally occurring antecedents and consequences as the behavior happens in class", "It systematically manipulates antecedents and consequences to test the behavior's function", "It establishes baseline levels of frequency, duration, and intensity across multiple settings"],
   c:2, r:"Only a functional analysis arranges experimental conditions (such as attention, escape, tangible, alone, and play) and directly manipulates variables, allowing the team to demonstrate a functional relation rather than infer one from correlation. Option B is the strongest distractor because it sounds rigorous, but it describes descriptive ABC assessment, which documents naturally occurring sequences and cannot rule out confounded variables; A describes indirect assessment."},
  {s:"C4", d:"FBA, BIP & Behavioral Interventions",
   q:"During independent work, a tenth grader with an emotional disability begins pacing at the back of the room, muttering, and snapping his pencil, behavior his BIP identifies as the agitation phase of his escalation cycle. The most appropriate staff response at this moment is to",
   a:["speak calmly, reduce task demands, and offer him space or a structured choice", "restate the classroom expectations firmly and remind him of the posted consequences", "begin teaching the replacement behavior written into his behavior intervention plan", "move close and place a reassuring hand on his shoulder to interrupt the pacing"],
   c:0, r:"During the agitation phase, the goal is to reduce arousal before it accelerates: a calm voice, reduced demands, increased space, and structured choices are the evidence-based responses in the acting-out cycle model (Colvin & Scott, 2015). Teaching the replacement behavior (C) is the strongest distractor because it sounds plan-consistent, but new skills are taught during the calm phase; an agitated student cannot learn, and instruction at this moment adds demands that fuel escalation."},
  {s:"C5", d:"Evidence-Based Reading & Writing Instruction",
   q:"An elementary school is selecting a reading approach for students with dyslexia. Which program feature is most essential, based on the research consensus for this population?",
   a:["Explicit, cumulative instruction in phoneme-grapheme correspondences following a planned scope and sequence", "Daily opportunities to read predictable leveled texts using picture and context cues to identify words", "An emphasis on student-selected texts to build motivation before decoding skills are addressed directly", "Systematic memorization of high-frequency word lists as the primary route to early word recognition"],
   c:0, r:"Structured literacy, meaning explicit, systematic, cumulative instruction in the phonology and orthography of English, is the approach with the strongest evidence for students with dyslexia (National Reading Panel, 2000; International Dyslexia Association). Cueing-based approaches that direct attention to pictures and context train the habits of poor readers and are contraindicated, and whole-word memorization does not build the generative decoding skill these students lack."},
  {s:"C5", d:"Evidence-Based Reading & Writing Instruction",
   q:"A sixth grader with a disability reads fluently but scores poorly when asked to summarize science and social studies passages. Which instructional response is best supported by research?",
   a:["Lowering the readability of assigned passages until the student's comprehension scores reach mastery", "Explicitly teaching expository text structures with matched graphic organizers and guided practice", "Building reading stamina through extended periods of uninterrupted independent reading each day", "Pre-teaching all unfamiliar vocabulary so that word knowledge no longer limits understanding"],
   c:1, r:"For students who decode adequately but struggle with content-area text, explicit instruction in expository structures (compare-contrast, cause-effect, problem-solution) paired with graphic organizers has strong support (IES; Gersten et al.). Permanently lowering text difficulty is a modification that removes access to grade-level content instead of teaching the missing comprehension skills, and vocabulary pre-teaching alone does not address the structural deficit the summarization failure reveals."},
  {s:"C5", d:"Evidence-Based Reading & Writing Instruction",
   q:"A teacher models essay planning aloud and teaches students the TREE mnemonic, but student gains fade within weeks. Which element, central to Self-Regulated Strategy Development, is most likely missing?",
   a:["Daily journal writing to increase the overall volume of composing practice", "Peer editing routines so students receive audience feedback on their drafts", "Grammar and sentence-combining instruction integrated into the strategy lessons", "Self-regulation procedures such as goal setting, self-monitoring, and self-statements"],
   c:3, r:"SRSD differs from ordinary strategy teaching precisely because it pairs the writing strategy with explicit self-regulation training, including goal setting, self-monitoring of strategy use, self-instructions, and self-reinforcement, which is what sustains and generalizes gains (Graham & Harris). Peer editing and sentence combining have value, but neither explains a maintenance failure the way absent self-regulation components do."},
  {s:"C5", d:"Evidence-Based Math Instruction & Content Access",
   q:"Which statement best captures why the concrete-representational-abstract (CRA) sequence is effective for students with mathematics disabilities?",
   a:["It allows students to avoid abstract symbols, which become unnecessary once concepts are understood concretely", "It replaces teacher-directed explanation with discovery, letting students construct procedures from materials", "It builds conceptual understanding by explicitly linking each stage to the next until symbols carry meaning", "It accelerates the pace of instruction because manipulative work lets teachers compress symbolic practice"],
   c:2, r:"CRA works because each phase is explicitly connected to the next: manipulative actions are mapped onto drawings and then onto symbols, so abstract notation is grounded in conceptual understanding rather than rote procedure. CRA is a form of explicit instruction, not discovery learning, and its endpoint is fluent symbolic mathematics, not the avoidance of symbols."},
  {s:"C5", d:"Evidence-Based Math Instruction & Content Access",
   q:"A special education teacher wants students to stop choosing operations impulsively when solving word problems. Which practice reflects schema-based instruction?",
   a:["Highlighting the signal words in each problem and matching them to an operations anchor chart", "Having students estimate a reasonable answer before computing and check their result against it", "Requiring students to solve every problem two different ways and then compare their answers", "Teaching students to classify problems by underlying structure and map quantities onto a diagram"],
   c:3, r:"Schema-based instruction trains students to identify a problem's underlying structure, such as change, group, or compare, and to represent the known and unknown quantities in a schematic diagram before selecting an operation (Jitendra; Powell & Fuchs). Signal-word highlighting is the keyword strategy, which research shows produces systematic errors because such words do not reliably indicate the correct operation."},
  {s:"C5", d:"Evidence-Based Math Instruction & Content Access",
   q:"An IES practice guide panel reviewed interventions for students struggling in mathematics. Which instructional feature received the panel's strongest evidence rating for improving outcomes?",
   a:["Explicit instruction that includes teacher modeling, guided practice, and student verbalization of reasoning", "Grouping students homogeneously by ability for all mathematics instruction across the school day", "Daily computer-adaptive practice that adjusts item difficulty without teacher-delivered instruction", "Inquiry-based exploration in which students derive the algorithms before any teacher demonstration"],
   c:0, r:"The IES practice guide on response to intervention in mathematics assigned its strongest evidence rating to explicit, systematic instruction featuring modeling, guided practice with feedback, cumulative review, and student verbalization of reasoning (Gersten et al., 2009). Adaptive software can supplement but does not replace teacher-delivered explicit instruction, and unguided inquiry is among the weakest approaches for students with mathematics difficulties."},
  {s:"C5", d:"Specially Designed Instruction, Accommodations & Co-Teaching",
   q:"Which testing support preserves the construct the assessment is designed to measure?",
   a:["A text-to-speech read-aloud of the passages on a test of reading comprehension and decoding", "An essay rubric rewritten so the student is graded on ideas only, with organization removed", "A text-to-speech read-aloud of the word problems on a test of mathematics problem solving", "Substituting below-grade-level passages so the student can respond to the same question types"],
   c:2, r:"Reading the word problems aloud on a mathematics test removes a reading barrier while leaving the measured construct, mathematical problem solving, intact, which is the defining test of a valid accommodation. The same read-aloud on a decoding and comprehension measure invalidates the score because reading the text is itself the construct, and the rubric change and below-grade passages alter the expectation, making them modifications."},
  {s:"C5", d:"Specially Designed Instruction, Accommodations & Co-Teaching",
   q:"Two co-teachers want every student to respond more frequently during a fraction review, and both plan to teach identical content at the same time. Which co-teaching model fits this purpose?",
   a:["Alternative teaching, with one teacher reteaching a small group while the other extends the lesson", "Parallel teaching, with the class split into two heterogeneous halves taught simultaneously", "Station teaching, with students rotating through independent and teacher-led learning centers", "Team teaching, with both teachers jointly leading one whole-class lesson and trading roles"],
   c:1, r:"Parallel teaching divides the class into two mixed-ability groups taught the same content simultaneously, cutting the student-teacher ratio in half and multiplying each student's response opportunities, which is exactly the team's stated goal (Friend & Cook). Station teaching also lowers the ratio but delivers different content at each station, and team teaching keeps the whole-class ratio, limiting response opportunities."},
  {s:"C6", d:"Communication Skills & AAC",
   q:"During a CSE meeting, a parent objects to a recommended speech-generating device, worried that the device will become a 'crutch' and stop the child from learning to talk. Which response from the special education teacher is best supported by the research base?",
   a:["Acknowledge the concern and propose postponing the device until spoken-language therapy has been exhausted", "Explain that the device will be limited to school so spoken language can remain the focus at home", "Explain that studies show AAC does not inhibit speech development and often supports spoken-language gains", "Acknowledge the concern and recommend manual sign instead, since unaided systems interfere less with speech"],
   c:2, r:"Meta-analytic research (Millar, Light, & Schlosser, 2006) shows that introducing AAC does not impede speech and is most often associated with increased speech production, likely because it reduces communicative pressure while building language. Postponing AAC (option A) reflects the rejected last-resort view and costs the child critical language-learning time. Option B fragments access across settings, and option D's claim is unsupported; no AAC modality has been shown to suppress speech."},
  {s:"C6", d:"Communication Skills & AAC",
   q:"A speech-language pathologist describes a student's communication system as 'unaided AAC.' Which system is the SLP describing?",
   a:["Manual signs and natural gestures the student produces with the hands and body", "A laminated board of picture symbols the student touches to build messages", "A tablet application that speaks programmed messages when symbols are selected", "An eye-gaze frame holding photographs the student looks at to indicate choices"],
   c:0, r:"Unaided AAC requires nothing external to the communicator's own body, so manual signs, gestures, facial expressions, and vocalizations qualify. All other options involve external equipment and are therefore aided AAC: the picture board and eye-gaze frame are low-tech aided systems, and the tablet application is a high-tech aided system. Note that the aided/unaided distinction is independent of the low-tech/high-tech distinction, which applies only within aided systems."},
  {s:"C6", d:"Social Skills & Functional Living Skills",
   q:"A teacher of high school students with moderate intellectual disabilities teaches grocery shopping both in a classroom 'store' and through weekly trips to a neighborhood supermarket. What is the primary rationale for including the supermarket trips?",
   a:["IDEA specifically requires that functional IEP goals be delivered in community settings", "Community settings allow larger instructional groups, making the program more cost-effective", "Classroom simulations are inconsistent with the least restrictive environment mandate", "Skills taught only in simulations often fail to generalize to the settings where they are needed"],
   c:3, r:"Students with significant cognitive disabilities frequently show weak stimulus generalization, so skills must be practiced and verified in the criterion environment; community-based instruction exists precisely to bridge the simulation-to-real-world transfer gap identified in the generalization literature (Stokes & Baer, 1977). Option A is the strongest distractor: IDEA requires transition services and consideration of functional needs, but the delivery setting remains an individualized CSE decision, not a federal mandate."},
  {s:"C6", d:"Social Skills & Functional Living Skills",
   q:"A special class teacher is choosing an approach to teach conversation-initiation skills to a 10-year-old with autism who attends closely to video on a tablet but looks away during face-to-face demonstrations. Which approach best matches both the evidence base and this learner's characteristics?",
   a:["Daily unstructured play periods so initiation skills can develop through natural peer contact", "Video modeling of initiation skills followed by guided rehearsal with feedback and reinforcement", "A written list of conversation rules reviewed with the student each morning before class", "Verbal reminders delivered by the teacher immediately before each peer interaction opportunity"],
   c:1, r:"Video modeling is an established evidence-based practice for autism (NCAEP) and capitalizes on this student's strong attention to video while removing the social demands of live modeling; pairing it with rehearsal, feedback, and reinforcement adds the practice components that produce acquisition. Unstructured exposure (option A) is the strongest distractor because research consistently shows proximity alone is insufficient; students with autism typically need explicit, structured social skills instruction."},
];

const POSTTEST = [
  {s:"C1", d:"Special Education Law & Policy",
   q:"A student classified with autism is approaching the third anniversary of his last full evaluation. He is meeting IEP goals, and the CSE chairperson tells the parent the committee plans to \"skip the reevaluation this cycle to save testing time.\" Under IDEA and Part 200, when may the three-year reevaluation be waived?",
   a:["Whenever the CSE documents in the IEP that existing data are sufficient to support the current classification", "Whenever the district provides the parent with prior written notice of its determination that reevaluation is not needed", "Under no circumstances, because the three-year reevaluation is a mandatory cycle that cannot be altered by agreement", "Only when the parent and the district agree that the reevaluation is unnecessary"],
   c:3, r:"Under 34 CFR 300.303(b)(2) and 8 NYCRR 200.4(b)(4), reevaluation must occur at least every three years unless the parent and the district agree that it is unnecessary; the waiver is bilateral, never a unilateral district call. Option B is the strongest distractor because prior written notice accompanies district decisions but cannot substitute for parental agreement on this specific waiver. Option A describes the review-of-existing-data step within a reevaluation, not authority to cancel one, and option C overstates the rule by ignoring the agreement exception."},
  {s:"C1", d:"Special Education Law & Policy",
   q:"The parent of a 4-year-old in a New York prekindergarten program suspects her daughter has a disability affecting language and motor development and asks the school how to proceed. Which referral route and, if the child is found eligible, which classification apply?",
   a:["Referral to the Committee on Special Education, with classification under one of New York's 13 school-age disability categories", "Referral to the Committee on Preschool Special Education, with the single classification of preschool student with a disability", "Referral to the Committee on Preschool Special Education, with classification under the category of developmental delay", "Referral to the Early Intervention Program administered through the Department of Health, with a service coordinator assigned"],
   c:1, r:"In New York, children ages 3-5 are referred to the CPSE, and an eligible child receives the single, noncategorical classification \"preschool student with a disability\" under 8 NYCRR 200.1(mm); the 13 categorical classifications apply to school-age students. Option C is the strongest distractor because federal IDEA permits states to use a developmental delay category, but New York does not use that classification at any age. Early Intervention (option D) serves children from birth to age 3, and the CSE (option A) serves school-age students."},
  {s:"C1", d:"History, Ethics & Equity",
   q:"A study group is comparing the two 1972-era right-to-education cases that laid the groundwork for PL 94-142. Which statement accurately distinguishes PARC v. Commonwealth of Pennsylvania from Mills v. Board of Education?",
   a:["PARC was a U.S. Supreme Court ruling binding on all states, while Mills was a consent decree limited to the District of Columbia", "PARC addressed all disability categories nationwide, while Mills was confined to students with intellectual disabilities in one district", "PARC was a consent decree securing education for children with intellectual disabilities, while Mills extended the right to children with all disabilities", "PARC established the modern substantive standard for an appropriate IEP, while Mills created the requirement for triennial reevaluation"],
   c:2, r:"PARC (1971-72) was a consent decree securing a free public education for Pennsylvania children with intellectual disabilities and a stated preference for regular class placement, while Mills (1972) broadened the right to all children with disabilities regardless of category and barred cost-based denial. Option A is the strongest distractor because it sounds authoritative, but neither case reached the Supreme Court; PARC was a federal district court consent decree and Mills a district court judgment. Option B reverses the cases' scopes, and option D attributes later statutory and case-law developments (Rowley/Endrew F. standards, IDEA's reevaluation cycle) to these early decisions."},
  {s:"C1", d:"History, Ethics & Equity",
   q:"A CSE is reviewing the initial evaluation of a third grader who has attended four schools in three years and whose records show long stretches without systematic reading instruction. His scores resemble those of students with a specific learning disability. Under IDEA's eligibility provisions, the team may NOT identify him as a student with a disability if the determinant factor for his low achievement is which of the following?",
   a:["Lack of appropriate instruction in reading, including the essential components of reading instruction", "A measured discrepancy between his cognitive ability scores and his standardized reading achievement scores", "An incomplete response to one round of Tier 2 intervention delivered during the current school year", "His parent's disagreement with the classification category the committee proposed at the meeting"],
   c:0, r:"34 CFR 300.306(b) prohibits finding a child eligible if the determinant factor is lack of appropriate instruction in reading or math or limited English proficiency, exactly the concern raised by this student's interrupted schooling; the team must first establish that he received appropriate instruction. Option B is the strongest distractor because an ability-achievement discrepancy is an identification model (one New York prohibits as the sole basis for K-4 reading SLD), not an exclusionary factor. Options C and D describe data points and procedural disputes that inform the process but are not statutory determinant-factor exclusions."},
  {s:"C2", d:"High-Incidence Disabilities (SLD, Speech/Language, OHI/ADHD)",
   q:"An eighth grader who attended four schools in three years and missed 40 days last year is referred for persistent reading difficulties; records show no consistent reading instruction was ever delivered. Before finding the student eligible as a student with a specific learning disability, the CSE must first establish that the difficulties are not primarily the result of:",
   a:["a lack of appropriate instruction in reading, documented with data from repeated assessments of achievement", "the student's failure to pass the state ELA assessment in two or more consecutive administrations", "an underlying information-processing deficit, which would shift the classification to other health impairment", "below-average intellectual ability, which must first be excluded using a nonverbal measure of intelligence"],
   c:0, r:"Federal and state SLD procedures require the team to rule out that underachievement is primarily due to lack of appropriate instruction in reading or math, supported by data-based documentation of repeated assessments of achievement (34 CFR 300.306(b), 300.309(b); 8 NYCRR 200.4(j)), which is exactly the concern raised by chronic mobility and absence. Option D is the strongest distractor because intellectual disability is an exclusionary factor, but nothing requires a nonverbal measure 'first.' A processing disorder is part of the SLD construct itself, not grounds for OHI."},
  {s:"C2", d:"High-Incidence Disabilities (SLD, Speech/Language, OHI/ADHD)",
   q:"A high school student with ADHD earns an A on Friday's unit test, then on Monday cannot start the same problem type, loses a completed essay before submitting it, and abandons a multi-step lab halfway through. The teacher concludes the student 'can do the work when he wants to.' The reinterpretation most consistent with the research is that:",
   a:["the inconsistency shows fluctuating motivation that a well-designed contingency contract will quickly correct", "the inconsistency reflects executive function deficits, so performance varies even when the underlying skill is intact", "the inconsistency signals a previously undetected specific learning disability in written expression", "the inconsistency suggests an emerging emotional disability being expressed through passive work refusal"],
   c:1, r:"ADHD is fundamentally a disorder of performance rather than skill: executive function deficits in working memory, organization, and task initiation produce exactly this variability, with demonstrated competence followed by failures to deploy it (Barkley's executive function research base). The motivation option is the strongest distractor because it mirrors the teacher's misattribution; contingencies can help, but framing the variability as willful misreads the disability. Losing materials and abandoning multi-step tasks cut across subjects and modalities, which argues against a written-expression SLD."},
  {s:"C2", d:"Autism, Emotional Disability & Behavioral Profiles",
   q:"A CSE weighs an emotional disability classification for a ninth grader who skips class to be with friends, fights only when challenged in front of a chosen peer group, shows no remorse to adults, yet keeps close, loyal friendships and behaves appropriately whenever consequences are immediate. Which feature of this profile most complicates the classification?",
   a:["the absence of remorse toward adults, which is one of the five characteristics that must persist over a long period", "the fighting, because physical aggression is categorically excluded from the emotional disability definition", "the pattern of skipping class, because attendance problems must first be addressed through a Section 504 plan", "the intact, goal-directed peer relationships, which point toward social maladjustment rather than an inability to relate"],
   c:3, r:"The definition excludes students who are socially maladjusted unless they also have an emotional disability, and this profile carries classic social-maladjustment markers: behavior that is goal-directed, peer-reinforced, and contingency-sensitive, with intact relationships inside a chosen group, the opposite of an 'inability to build or maintain satisfactory relationships.' Option A is the strongest distractor because lack of remorse is not among the five regulatory characteristics. The committee must still consider whether ED co-occurs, since the exclusion removes only students who are solely socially maladjusted."},
  {s:"C2", d:"Low-Incidence, Sensory & Physical Disabilities",
   q:"A CSE must classify two students: the first has an intellectual disability and total blindness with combined needs no single-disability program can meet; the second has both deafness and blindness. Under Part 200, the appropriate classifications are:",
   a:["multiple disabilities for both students, because each presents two concomitant impairments with intertwined needs", "deaf-blindness for both students, because sensory impairments take precedence over cognitive impairments in classification", "multiple disabilities for the first student and deaf-blindness for the second, which is a separate classification of its own", "the single most severe disability for each student, because New York does not recognize combination classifications"],
   c:2, r:"Multiple disabilities means concomitant impairments, such as intellectual disability-blindness, whose combination causes needs that cannot be accommodated in programs designed solely for one impairment, but the definition expressly excludes deaf-blindness, which stands as its own classification (34 CFR 300.8(c)(7); 8 NYCRR 200.1(zz)). Option A is the strongest distractor because it applies the 'two concomitant impairments' logic mechanically without knowing the deaf-blindness carve-out. New York recognizes both combination categories, so option D is simply false."},
  {s:"C3", d:"Assessment Types & Score Interpretation",
   q:"A parent is told that her sixth grader earned a grade equivalent of 8.4 on a norm-referenced reading test and asks whether the school will now provide eighth-grade reading materials. The most accurate response is that the grade equivalent means:",
   a:["the student is ready for instruction in eighth-grade texts and should be re-placed accordingly.", "the student is performing at the 84th percentile when compared with other sixth graders in the national norm group.", "the student earned the raw score typical of grade 8, month 4 students on this same sixth-grade content.", "the student has demonstrated mastery of the reading standards for grades six through eight."],
   c:2, r:"A grade equivalent indicates only that the student's raw score on this sixth-grade test matched the median raw score that students in the fourth month of grade 8 would earn on the same sixth-grade material; it says nothing about the student's ability to handle eighth-grade texts or standards. Grade equivalents are among the most misinterpreted scores in assessment and should never drive placement or materials decisions. The percentile reading is the strongest distractor because the digits resemble a percentile rank, but the two metrics are unrelated."},
  {s:"C3", d:"Assessment Types & Score Interpretation",
   q:"A school psychologist is planning the initial evaluation of a recently arrived student whose native language is Haitian Creole. Which evaluation practice meets legal requirements?",
   a:["Assessing in the student's native language or mode of communication unless clearly not feasible.", "Assessing in English, since English is the student's current language of instruction at the school.", "Assessing in whichever language the classroom teacher identifies as the student's dominant language.", "Postponing the evaluation until the student develops sufficient English proficiency to be tested fairly."],
   c:0, r:"IDEA and 8 NYCRR Part 200 require assessments to be provided and administered in the student's native language or other mode of communication, in the form most likely to yield accurate academic, developmental, and functional information, unless clearly not feasible. The regulation specifies the native language, not a 'dominant' language someone designates, which makes that option the closest trap. Postponing the evaluation until English develops denies the student a timely evaluation and violates child find obligations."},
  {s:"C3", d:"Assessment Types & Score Interpretation",
   q:"A special education teacher currently tracks progress with end-of-unit mastery tests that she writes herself. Which feature would distinguish curriculum-based measurement from her current approach?",
   a:["CBM relies on untimed, qualitative observations of how students approach their classroom tasks.", "CBM tests only the single skill currently being taught, then moves to the next skill in the instructional sequence.", "CBM is administered once each year to compare students with a national normative sample.", "CBM uses brief, timed probes of equal difficulty sampling the whole year's curriculum to chart growth."],
   c:3, r:"CBM probes are brief, timed, standardized, and of equivalent difficulty, with each probe sampling the entire year's curriculum, so weekly scores form a single growth line that supports slope-based instructional decisions. The strongest distractor describes mastery measurement itself, testing one skill at a time in sequence, which cannot show retention or overall growth across skills. CBM is neither untimed and qualitative nor a once-yearly normed battery."},
  {s:"C3", d:"The IEP Process & Components",
   q:"Under New York's Part 200 regulations, for which student must the IEP include short-term instructional objectives or benchmarks for each annual goal?",
   a:["Any student whose IEP includes a coordinated set of transition activities.", "A student who participates in the New York State Alternate Assessment.", "Any student placed in a special class with a 12:1:1 staffing ratio.", "A student classified with an intellectual disability, regardless of assessment type."],
   c:1, r:"New York requires short-term instructional objectives or benchmarks for preschool students with disabilities and for students who participate in the New York State Alternate Assessment (8 NYCRR 200.4(d)(2)(iv)); among school-age students, NYSAA participation is the trigger, because IDEA 2004 eliminated the requirement for all others. The intellectual disability option is the strongest distractor because many NYSAA participants carry that classification, but the trigger is participation in alternate assessment, not the classification or the placement ratio."},
  {s:"C3", d:"The IEP Process & Components",
   q:"In November, a general education teacher mentions that no one ever told her a student in her class has an IEP with classroom testing accommodations. Under New York requirements, the district was obligated to:",
   a:["share only the student's classification with her, since the IEP's contents are confidential records.", "inform each of the student's teachers of his or her specific IEP responsibilities before implementation.", "provide the full IEP only to the special education staff, who determine what classroom teachers need to know.", "implement the accommodations on State assessments only, under the testing coordinator's supervision."],
   c:1, r:"New York regulation (8 NYCRR 200.4(e)(3)) requires that each regular education teacher, special education teacher, related service provider, and other provider responsible for implementing a student's IEP be informed of his or her specific responsibilities, including the specific accommodations, prior to implementation. The confidentiality option is the most common misreading: privacy rules govern how records are protected but do not bar sharing the IEP with implementing teachers. Classroom accommodations apply to instruction and classroom tests, not State assessments alone."},
  {s:"C3", d:"The IEP Process & Components",
   q:"In January, a parent and the district agree that a reading goal's criterion should be raised because the student met the goal early. The annual review is not due until May. Which course of action is permissible?",
   a:["Leave the IEP unchanged until the May annual review, because goals may be revised only at that meeting.", "Have the special education teacher update the goal and notify the parent after the change is made.", "Schedule a reevaluation to document the accelerated progress before any change to the IEP can occur.", "Amend the IEP by written agreement of parent and district without a meeting, and send a revised copy."],
   c:3, r:"After the annual review, IDEA 2004 and 8 NYCRR 200.4(g) permit the parent and district to agree in writing to amend the IEP without convening a meeting, and the district must provide the parent a copy of the amended IEP. The IEP is a living document, so waiting until May is unnecessary, and a unilateral teacher edit with after-the-fact notification is never permissible because the parent must be a party to the change. No reevaluation is required to revise a goal criterion."},
  {s:"C3", d:"Eligibility, Reevaluation & Procedural Safeguards",
   q:"A CSE is reviewing the initial evaluation of a multilingual learner with a history of interrupted formal schooling who is far below grade level in reading. Before identifying the student as having a learning disability, the committee must determine that:",
   a:["limited English proficiency and lack of appropriate reading instruction are not the determinant factors.", "the student has received English language services for at least three full years before classification is considered.", "the student's scores fall at least 1.5 standard deviations below the mean on two separate measures of reading.", "the family has confirmed in writing that the difficulties reflect a disability rather than a language difference."],
   c:0, r:"A student may not be identified with a disability if the determinant factor is limited English proficiency or lack of appropriate instruction in reading or math (34 CFR 300.306(b)), so the committee must rule both out, an especially demanding task for students with interrupted schooling. The strongest distractor, a mandatory multi-year ELL waiting period, has no basis in law and would illegally delay identification of multilingual learners who genuinely have disabilities. Discrepancy cutoffs and family attestations are not eligibility requirements."},
  {s:"C3", d:"Eligibility, Reevaluation & Procedural Safeguards",
   q:"Six months after a student's reevaluation was completed, the parent requests another full reevaluation, citing new concerns. The CSE chairperson should explain that:",
   a:["the district must conduct any reevaluation a parent requests, regardless of when the last one occurred.", "reevaluations are conducted only at the mandated three-year interval, so the request must wait.", "a reevaluation may occur no more than once per year unless the parent and the district agree otherwise.", "the parent must request an impartial hearing in order to obtain an additional reevaluation."],
   c:2, r:"A reevaluation may not occur more than once a year unless the parent and district agree otherwise, and it must occur at least every three years unless they agree it is unnecessary (34 CFR 300.303; 8 NYCRR 200.4(b)(4)). The first option is the strongest distractor because parents may indeed request reevaluation, but within the one-year window the district's obligation runs through the agreement pathway rather than an automatic duty. A due process hearing is a dispute mechanism, not the procedure for requesting reevaluation."},
  {s:"C4", d:"Classroom & Behavior Management",
   q:"To curb one student's frequent disruptions, a teacher announces that the whole class will earn a popcorn party on Friday if Marcus stays in his seat all week. Which risk of this arrangement is most important for the teacher to anticipate?",
   a:["Classmates may pressure, threaten, or ridicule Marcus if the reward is jeopardized", "Classmates will have no programmed reinforcement available for their own behavior", "The weekly delay will make the reward too remote to affect Marcus's daily behavior", "Marcus will satiate on the reward and the contingency will lose its effectiveness"],
   c:0, r:"This is a dependent group contingency, the 'hero procedure': the group's reward hinges on one student's behavior, which can recruit supportive peer attention but carries a documented risk of scapegoating, threats, or ridicule if the target student costs the class its reward (Litow & Pumroy, 1975). The delay concern (C) is the strongest distractor and is legitimate, but it is easily mitigated with daily feedback and interim progress markers, whereas peer coercion is the defining ethical hazard of dependent contingencies."},
  {s:"C4", d:"Classroom & Behavior Management",
   q:"To reduce calling out that an FBA shows is maintained by teacher attention, a teacher sets a silent timer and delivers brief, pleasant attention to the student every four minutes regardless of what the student is doing at that moment. This intervention is best identified as",
   a:["differential reinforcement of other behavior", "extinction of attention-maintained behavior", "noncontingent reinforcement", "differential reinforcement of alternative behavior"],
   c:2, r:"Delivering the maintaining reinforcer, attention, on a fixed-time schedule independent of the student's behavior is noncontingent reinforcement, an antecedent strategy that weakens the establishing operation for attention-seeking. DRO (A) is the strongest distractor because it also runs on time intervals, but DRO delivers reinforcement contingent on the absence of the target behavior during the interval; here attention arrives on schedule no matter what the student is doing, so no behavior-based contingency exists."},
  {s:"C4", d:"FBA, BIP & Behavioral Interventions",
   q:"An FBA hypothesizes that a fourth grader's joke-telling and noise-making during lessons are maintained by teacher attention. Which BIP intervention package is most clearly matched to this function?",
   a:["Tokens exchangeable for homework passes earned for each block of quiet, on-task work", "Scheduled teacher check-ins plus immediate teacher attention for raising his hand", "A seat assignment facing away from classmates to reduce the audience for the jokes", "A brief written reflection completed with the dean after each classroom disruption"],
   c:1, r:"A function-matched plan delivers the maintaining reinforcer, teacher attention, both noncontingently (scheduled check-ins weaken the establishing operation) and contingent on an appropriate alternative (hand-raising), combining NCR with DRA. Token rewards (A) are the strongest distractor because they are positive and structured, but homework passes are arbitrary reinforcers unrelated to the attention function; option D actually supplies adult attention contingent on disruption and may strengthen the behavior it targets."},
  {s:"C4", d:"FBA, BIP & Behavioral Interventions",
   q:"A high school student with a BIP suddenly begins striking a classmate, and a trained staff member uses a brief physical intervention to stop the attack. Under 8 NYCRR 200.22, which statement about this action is accurate?",
   a:["It may be written into the BIP as a planned consequence for future episodes of aggression", "It may take the place of revising the BIP while the team completes an updated FBA", "It was permissible only because the student's IEP specifically authorizes physical intervention", "It was permissible due to the immediate danger and must be documented, with the parent notified"],
   c:3, r:"Emergency interventions are permitted only when behavior poses an immediate danger of serious physical harm; each use must be documented and the parent notified, with New York's 2023 amendments to 8 NYCRR 19.5 and 200.22 requiring same-day notification, and the regulation expressly prohibits using emergency interventions as a punishment or as a substitute for systematic behavioral programming. Option A is the strongest distractor because BIPs do address crises, but writing restraint in as a planned consequence would convert it into a prohibited punishment procedure rather than an emergency response."},
  {s:"C5", d:"Evidence-Based Reading & Writing Instruction",
   q:"A first grader with an IEP reads 'horse' for 'house' and 'went' for 'want,' glancing at the picture after each attempt. Her teacher prompts, 'What would make sense here?' Which instructional shift does the research support?",
   a:["Keep the meaning-based prompts but add a daily list of high-frequency words for memorization", "Move the student to easier predictable texts so her current strategy produces more successes", "Add comprehension questions after each page so meaning monitoring catches her reading errors", "Replace cueing prompts with explicit phonics instruction and practice reading decodable texts"],
   c:3, r:"The student's errors show overreliance on partial visual and contextual cues, a habit reinforced by meaning-first prompting; the research consensus calls for explicit, systematic phonics with decodable text so the student attends to the full letter sequence (National Reading Panel, 2000; Castles, Rastle, & Nation, 2018). Easier predictable texts and meaning-based prompts strengthen the very guessing habit that is producing the errors."},
  {s:"C5", d:"Evidence-Based Reading & Writing Instruction",
   q:"Before a novel study, a teacher has time to explicitly pre-teach only a handful of words. According to research on vocabulary selection, the teacher should prioritize:",
   a:["high-utility academic words such as 'reluctant' and 'consequence' that appear across many texts.", "common conversational words such as 'happy' and 'walk' to guarantee early success for all readers.", "rare domain-specific words such as 'topsail' and 'parapet' that students cannot infer from context.", "irregularly spelled words from the novel, since those cause the most errors during oral reading."],
   c:0, r:"Beck, McKeown, and Kucan's framework directs explicit instruction toward Tier 2 words, the high-utility academic vocabulary that appears across domains and powers comprehension of many future texts. Tier 1 conversational words are already known, Tier 3 domain-specific words are best taught briefly at point of need, and selecting words by spelling irregularity confuses a decoding concern with a vocabulary goal."},
  {s:"C5", d:"Evidence-Based Reading & Writing Instruction",
   q:"In a middle school reading class, students work in groups taking rotating turns predicting, generating questions, clarifying confusing parts, and summarizing sections of text. This routine is an implementation of which evidence-based practice?",
   a:["Literature circles, in which students assume fixed discussion roles based on their interests", "Collaborative strategic reading, which centers on students monitoring 'clunks' in the text", "Reciprocal teaching, in which students take over the teacher's role applying four strategies", "Directed reading-thinking activity, a teacher-guided cycle of predicting, reading, and verifying"],
   c:2, r:"Reciprocal teaching is defined by structured dialogue in which students take turns leading the group through the four strategies of predicting, questioning, clarifying, and summarizing (Palincsar & Brown), and it carries strong evidence for improving comprehension. Collaborative strategic reading is the closest distractor, but it is organized around different strategy labels: preview, click and clunk, get the gist, and wrap-up."},
  {s:"C5", d:"Evidence-Based Math Instruction & Content Access",
   q:"A seventh grader with a mathematics disability insists that 1/8 is greater than 1/3 'because 8 is bigger than 3.' Which intervention does current research most strongly support?",
   a:["Additional procedural practice converting fractions to common denominators before comparing them", "Explicit instruction representing and comparing fraction magnitudes on labeled number lines", "A rule-based mnemonic reminding students that larger denominators produce smaller pieces", "Real-world pizza and pie models used during whole-class discussions of relative fraction size"],
   c:1, r:"The IES fractions practice guide identifies magnitude understanding, built through explicit work with number lines, as central to repairing whole-number bias, which is the misconception this student displays (Siegler et al., 2010). Mnemonics and procedures can yield correct answers without conceptual change, and area models like pizzas are useful early but are weaker than number lines for representing fractions as numbers with magnitudes."},
  {s:"C5", d:"Evidence-Based Math Instruction & Content Access",
   q:"Students with IEPs in an eighth-grade class pass each unit test but perform poorly on mixed cumulative reviews administered weeks later. Which adjustment to instruction addresses this pattern most directly?",
   a:["Reteaching every prior unit in full immediately before each cumulative review is administered", "Building distributed, interleaved practice of previously learned skills into each week's lessons", "Allowing students to use their notes during cumulative reviews so retrieval demands are lower", "Shortening the cumulative reviews so they sample only the two most recently completed units"],
   c:1, r:"Strong immediate performance with weak delayed, mixed performance signals massed, blocked practice without systematic review; distributed and interleaved practice of previously taught skills is a core explicit-instruction component with strong support for retention (Archer & Hughes; IES). Open-notes testing and shortened reviews lower the demand instead of building durable retrieval, and full reteaching before each review is inefficient and masks the retention problem."},
  {s:"C5", d:"Evidence-Based Math Instruction & Content Access",
   q:"A special education teacher models a new long-division procedure with a think-aloud, then immediately assigns twenty problems for independent seatwork. Several students with disabilities practice the procedure incorrectly for the entire period. Which element of explicit instruction did the lesson omit?",
   a:["An advance organizer previewing the lesson objective and connecting it to prior knowledge", "A culminating exit ticket that samples the day's skill for formative assessment purposes", "Guided practice with high response rates and immediate corrective feedback before independence", "A motivational reinforcement system to increase engagement during the independent practice block"],
   c:2, r:"Explicit instruction requires a guided practice phase, with teacher and students working problems together under frequent checks and immediate error correction, before independent work, precisely to prevent students from rehearsing errors (Archer & Hughes). An exit ticket would only document the failure after the fact; the breakdown occurred because support was withdrawn in a single step rather than gradually released."},
  {s:"C5", d:"Specially Designed Instruction, Accommodations & Co-Teaching",
   q:"A New York district is organizing integrated co-teaching sections for next year. Under 8 NYCRR 200.6(g), what is the maximum number of students with disabilities who may be enrolled in an ICT class?",
   a:["12 students with disabilities, unless the commissioner grants a variance", "8 students with disabilities, regardless of the total size of the class", "15 students with disabilities, matching the general special class limit", "No fixed cap, provided the class reflects natural proportions overall"],
   c:0, r:"New York caps integrated co-teaching classes at 12 students with disabilities (8 NYCRR 200.6(g)), though a district may seek a variance from the commissioner under limited circumstances. The 15-student figure is the general maximum for certain special classes, not ICT, and 'natural proportions' is an inclusion guideline rather than the regulatory standard."},
  {s:"C5", d:"Specially Designed Instruction, Accommodations & Co-Teaching",
   q:"While planning a new unit, a general educator builds in captioned videos and text alternatives for content, choices among an essay, a podcast, or a storyboard as products, and varied ways to spark interest, all before knowing which students will enroll. This planning approach is best described as:",
   a:["differentiated instruction, because the teacher tailored the tasks to individual student profiles.", "specially designed instruction, because content, methodology, and delivery were each adapted.", "a set of accommodations, because barriers to access were removed for students who need them.", "Universal Design for Learning, because flexible options were designed proactively for all learners."],
   c:3, r:"Designing multiple means of representation, action and expression, and engagement into the environment from the outset, before individual learners are known, is the defining feature of UDL (CAST). Differentiation and accommodations are reactive adjustments to identified student needs, and specially designed instruction under 34 CFR 300.39 is individualized to a particular student's IEP rather than built universally into a unit."},
  {s:"C6", d:"Communication Skills & AAC",
   q:"An FBA shows that a nonspeaking third grader's grabbing and hitting are maintained by access to preferred items. The team plans functional communication training using a picture-symbol request. For the new response to replace the problem behavior, which condition is most critical?",
   a:["The symbol request is honored on an intermittent schedule from the first day of instruction", "The symbol request requires less effort than grabbing and reliably produces the same preferred items", "The student receives teacher praise for each interval in which no grabbing or hitting has occurred", "The student is taught a calming routine to use whenever preferred items are unavailable"],
   c:1, r:"FCT works through functional equivalence plus response efficiency: the communication response must produce the same reinforcer identified in the FBA (access to items) more reliably, more immediately, and with less effort than the problem behavior; otherwise the problem behavior remains the better option. Option A is the strongest distractor because schedule thinning is appropriate only after acquisition; during initial FCT the new response requires a dense, continuous schedule. Option C describes DRO, which suppresses behavior without teaching a replacement skill."},
  {s:"C6", d:"Communication Skills & AAC",
   q:"A fourth grader with a language impairment receives speech-language services twice weekly under the IEP, but the student's spontaneous use of newly taught vocabulary remains low in the classroom. Which action by the special education teacher reflects the recommended model of SLP-teacher collaboration?",
   a:["Ask the CSE to increase the frequency of the student's pull-out speech-language sessions", "Re-administer the SLP's therapy drills during independent work time each afternoon", "Refer classroom communication concerns to the SLP, who holds responsibility for language goals", "Embed the targeted vocabulary into content lessons and routines, sharing classroom data with the SLP"],
   c:3, r:"Collaborative, curriculum-embedded service models are recommended by ASHA because communication skills generalize when practiced in meaningful contexts distributed across the day; the teacher's role is to create those practice opportunities and exchange data with the SLP, who guides targets and techniques. Option A is the strongest distractor: the problem described is generalization, not dosage, so additional isolated pull-out time does not address why skills fail to transfer. Options B and C misallocate roles, either replicating decontextualized drills or siloing language as the SLP's responsibility alone."},
  {s:"C6", d:"Social Skills & Functional Living Skills",
   q:"A CSE is developing measurable postsecondary goals in education, employment, and independent living for a transition-age student. Under IDEA, on what must these goals be based?",
   a:["Age-appropriate transition assessments of the student's strengths, preferences, and interests", "The continuum of adult-service programs currently operating in the student's geographic region", "The student's most recent scores on statewide standardized achievement assessments", "Recommendations submitted by the student's parents at the annual review meeting"],
   c:0, r:"34 CFR 300.320(b) requires measurable postsecondary goals to be based upon age-appropriate transition assessments related to training, education, employment, and, where appropriate, independent living skills; assessment data on strengths, preferences, and interests is the regulatory anchor. Option B is the strongest distractor because teams sometimes reverse the sequence, fitting students to existing programs, when IDEA requires the goals to drive the coordinated set of activities. Parent input (option D) informs the process but cannot substitute for transition assessment data."},
  {s:"C6", d:"Social Skills & Functional Living Skills",
   q:"A high school student with an emotional disability reliably demonstrates taught conversational skills during a weekly counseling group but rarely uses them in the cafeteria or hallways. Which adjustment is most likely to produce use of the skills in those settings?",
   a:["Extending the weekly group session so the student accumulates more practice trials", "Reviewing the social skills curriculum from the beginning to strengthen the foundation", "Adding cafeteria-based practice with varied peers and teaching the student to self-monitor skill use", "Increasing the reinforcement the student earns for demonstrating the skills within the group"],
   c:2, r:"The data show acquisition without generalization, so the fix is generalization programming: practice in the criterion setting, multiple peer exemplars, and self-monitoring, which travels with the student and recruits naturally occurring reinforcement (Stokes & Baer, 1977). Option D is the strongest distractor, but adding reinforcement inside the group only strengthens stimulus control by the group context and does nothing to transfer responding to the cafeteria; options A and B likewise intensify instruction in a setting where the skill is already mastered."},
];

const MODULES = {
  "Special Education Law & Policy": {
    icon: "⚖️",
    concepts: [
      { title: "IDEA's Six Principles", body: "IDEA rests on six pillars: free appropriate public education (FAPE), least restrictive environment (LRE), appropriate (nondiscriminatory) evaluation, the individualized education program (IEP), parent participation, and procedural safeguards. FAPE means special education and related services provided at public expense, meeting state standards, and delivered under a properly developed IEP. LRE requires that students with disabilities be educated with nondisabled peers to the maximum extent appropriate, and removal from general education may occur only when education there cannot be achieved satisfactorily even with supplementary aids and services. Appropriate evaluation requires a variety of technically sound tools administered in the student's native language, with no single measure used as the sole criterion for eligibility or placement." },
      { title: "Section 504, IDEA, and the ADA", body: "IDEA is a funding statute requiring a qualifying disability category AND a resulting need for specially designed instruction; Section 504 of the Rehabilitation Act of 1973 is a civil rights law covering any person with a physical or mental impairment that substantially limits a major life activity, so its protected class is broader. A student ineligible under IDEA (e.g., a student with diabetes or ADHD who needs accommodations but not specially designed instruction) may still be entitled to a 504 plan, and 504 FAPE can be satisfied through regular education with accommodations. Section 504 applies to recipients of federal funds and is enforced by the Office for Civil Rights (OCR); the ADA (1990) extends similar nondiscrimination protections to public entities under Title II regardless of federal funding. Unlike IDEA, neither 504 nor the ADA provides federal money to support compliance." },
      { title: "ESSA and Students with Disabilities", body: "The Every Student Succeeds Act (2015) requires that students with disabilities participate in statewide assessments, be held to challenging academic content standards, and be reported as a distinct accountability subgroup. Alternate assessments aligned to alternate achievement standards are reserved for students with the most significant cognitive disabilities, and ESSA caps statewide participation at 1% of all tested students per subject. ESSA works in tandem with IDEA: IDEA secures individual entitlements while ESSA drives system-level accountability for the subgroup's achievement, growth, and graduation outcomes." },
      { title: "New York Part 200: CSE, CPSE, and Classifications", body: "In New York, the Committee on Special Education (CSE) handles school-age students (5-21) and the Committee on Preschool Special Education (CPSE) handles ages 3-5; eligible preschoolers receive the single classification \"preschool student with a disability,\" not a categorical label. New York recognizes 13 school-age disability classifications under 8 NYCRR 200.1(zz) and uses the term \"emotional disability\" (the federal IDEA term is \"emotional disturbance\"); New York does NOT use a \"developmental delay\" classification at any age. Required CSE members include the parents, a general education teacher of the student (if the student is or may be participating in general education), a special education teacher or provider, a school psychologist, a district representative qualified to supervise special education, and an individual who can interpret evaluation results; in NY, an additional parent member and the school physician attend upon request." },
      { title: "Evaluation, Eligibility, and Timelines", body: "After written parental consent, New York initial evaluations must be completed within 60 calendar days, and the board must arrange for recommended programs and services within 60 school days of receiving consent; a parent may refer a student for evaluation at any time, and an RtI process may never be used to delay or deny a parent-initiated referral. Evaluations must use multiple measures administered in the student's native language by trained personnel, and eligibility may not rest on any single measure. For determining a specific learning disability in K-4 reading, New York prohibits sole reliance on a severe discrepancy between ability and achievement; data from a Response to Intervention process is a required component. IEPs must be reviewed at least annually, and reevaluations occur at least every three years unless the parent and district agree in writing that reevaluation is unnecessary (and no more than once a year unless both agree otherwise)." },
      { title: "Procedural Safeguards and Dispute Resolution", body: "Core safeguards include prior written notice before any proposal or refusal to initiate or change identification, evaluation, or placement; informed parental consent; access to records; and the right to an independent educational evaluation (IEE) at public expense if the parent disagrees with the district's evaluation (the district must then either fund the IEE or file for due process to defend its own evaluation). Dispute options escalate from voluntary, no-cost mediation, to a state complaint (filed within one year, investigated within 60 days), to an impartial due process hearing (two-year statute of limitations). New York uses a two-tier hearing system: an Impartial Hearing Officer (IHO) decision may be appealed to a State Review Officer (SRO) before going to court. During due process proceedings the student remains in the current placement under pendency (\"stay-put\") unless the parties agree otherwise." },
      { title: "Discipline Protections Under IDEA", body: "Removals exceeding 10 consecutive school days, or a pattern of shorter removals, constitute a change of placement and trigger a manifestation determination review (MDR) within 10 school days. If the conduct was caused by, or had a direct and substantial relationship to, the disability, or resulted from the district's failure to implement the IEP, the student generally returns to placement and the team must conduct an FBA and implement or revise a BIP. For special circumstances (weapons, illegal drugs, or serious bodily injury), school personnel may move the student to an interim alternative educational setting for up to 45 school days regardless of the manifestation finding. Educational services must continue during any removal beyond 10 cumulative school days in a school year." },
    ],
    practice: [
      {s:"C1", d:"Special Education Law & Policy",
       q:"A CSE is developing an IEP for a fifth grader classified with an emotional disability whose outbursts have disrupted his general education class. A subcommittee member proposes an 8:1+1 special class because counseling and crisis support \"would be easier to deliver there.\" The parent wants him to remain in general education. To comply with the least restrictive environment requirement, which question must the committee answer first?",
       a:["Whether the district currently operates an 8:1+1 special class with an available seat in the student's home school", "Whether students with this classification typically show better behavioral outcomes in smaller, specialized settings", "Whether the student can be educated satisfactorily in the general education class with supplementary aids and services", "Whether the parent will provide written consent for the change in placement before the committee finalizes the IEP"],
       c:2, r:"Under 34 CFR 300.114 and 8 NYCRR 200.6(a), removal from general education is permissible only when education there cannot be achieved satisfactorily even with supplementary aids and services, so the committee must exhaust that analysis before considering a more restrictive setting. Option B reflects a documented but unlawful practice: placement decisions must be individualized, never driven by disability category or by what is administratively convenient. Availability of a seat (option A) can never justify a placement, and consent (option D) follows, rather than drives, the LRE analysis."},
      {s:"C1", d:"Special Education Law & Policy",
       q:"A seventh grader with Type 1 diabetes needs blood glucose monitoring, scheduled snacks, and flexibility around missed work after medical episodes, but evaluation shows grade-level achievement and no need for specially designed instruction. The CSE finds her ineligible under IDEA. What is the team's most appropriate next step?",
       a:["Refer the student for Section 504 consideration, since an impairment that substantially limits a major life activity can qualify her for an accommodation plan", "Classify the student as Other Health Impairment, since diabetes is a chronic health condition explicitly named in the federal regulations", "Close the case, since a student found ineligible under IDEA has no entitlement to disability-based supports at school", "Ask the school nurse to manage the medical needs informally, since health care procedures fall outside the scope of educational law"],
       c:0, r:"Section 504's protected class is broader than IDEA's: eligibility requires only a physical or mental impairment that substantially limits a major life activity (such as endocrine function, explicitly listed in the ADA Amendments Act), with no requirement for specially designed instruction. Option B is the strongest distractor because diabetes is listed under OHI in 34 CFR 300.8, but OHI classification also requires that the condition adversely affect educational performance and create a need for special education, which the evaluation ruled out. Options C and D ignore that 504 obligations exist independent of IDEA eligibility."},
      {s:"C1", d:"Special Education Law & Policy",
       q:"Midyear, a district CSE recommends moving a fourth grader with autism from an ICT class to a 12:1+1 special class. The parent disagrees and files a due process complaint the following week. While the hearing process is pending, where must the student be educated?",
       a:["In the 12:1+1 special class, because a CSE recommendation takes effect on the implementation date listed in the IEP", "In a setting selected by the impartial hearing officer at a preliminary conference held before the hearing begins", "In the general education class without ICT supports, because the disputed IEP cannot be implemented in any form", "In the ICT class, because the student remains in the current educational placement unless the parent and district agree otherwise"],
       c:3, r:"The pendency (\"stay-put\") provision at 34 CFR 300.518 and 8 NYCRR 200.5(m) freezes the student's then-current educational placement once a due process complaint is filed, unless the parties agree to a different arrangement. Option A is the strongest distractor because IEPs normally do take effect as written, but filing for due process suspends the disputed change specifically to prevent unilateral district action during litigation. Option C confuses pendency with invalidating the existing program; the last agreed-upon placement (ICT) continues intact."},
      {s:"C1", d:"Special Education Law & Policy",
       q:"A parent signs consent for an initial special education evaluation of her kindergartner on October 1. Under New York's Part 200 regulations, by when must the initial evaluation be completed?",
       a:["Within 60 school days of the date the parent signed consent", "Within 60 calendar days of the date the parent signed consent", "Within 30 calendar days of the date the referral was first received", "Within 90 calendar days of the date the referral was first received"],
       c:1, r:"Both 8 NYCRR 200.4(b) and 34 CFR 300.301(c) run the initial evaluation timeline from receipt of parental consent and set it at 60 calendar days, not school days. Option A is the strongest distractor because a separate NY timeline, arranging for recommended programs and services, is measured in 60 school days from consent, and candidates routinely conflate the two clocks. Options C and D incorrectly anchor the timeline to the referral date rather than to consent."},
    ],
  },
  "History, Ethics & Equity": {
    icon: "📜",
    concepts: [
      { title: "From Exclusion to Access: The Legal Roots", body: "Brown v. Board of Education (1954) supplied the equal protection logic later borrowed by disability advocates: separate and excluded is not equal. PARC v. Commonwealth of Pennsylvania (1971-72), a consent decree, established that children with intellectual disabilities are entitled to a free public education and expressed a preference for placement in regular classes over more restrictive settings. Mills v. Board of Education of the District of Columbia (1972) extended the right to all children with disabilities regardless of type or severity and held that a district may not plead insufficient funds to deny services; any budget shortfall must not fall disproportionately on students with disabilities. Together these cases created the blueprint, zero reject, due process, and individualized education, that Congress codified in 1975." },
      { title: "PL 94-142 to IDEA 2004", body: "Public Law 94-142, the Education for All Handicapped Children Act of 1975, first guaranteed FAPE, LRE, IEPs, nondiscriminatory evaluation, parent participation, and procedural safeguards; it was renamed the Individuals with Disabilities Education Act (IDEA) in 1990. The 1990 reauthorization added autism and traumatic brain injury as categories, mandated transition services, and adopted person-first language; the 1997 amendments strengthened general curriculum access, required FBAs/BIPs in discipline contexts, and added students with disabilities to state assessments. IDEA 2004 aligned the law with NCLB-era accountability, permitted Response to Intervention in SLD identification, and barred states from requiring a severe discrepancy model. Section 504 (1973) and the ADA (1990) sit alongside IDEA as the civil rights framework for disability." },
      { title: "Defining FAPE: Rowley and Endrew F.", body: "Board of Education v. Rowley (1982) held that FAPE requires a \"basic floor of opportunity\", an IEP reasonably calculated to confer some educational benefit, not maximization of potential, and directed courts to defer to schools that followed IDEA's procedures. Endrew F. v. Douglas County (2017) sharpened the substantive standard: an IEP must be reasonably calculated to enable progress appropriate in light of the child's circumstances, and merely more-than-trivial (de minimis) progress is not enough. For students not fully integrated in general education, Endrew F. requires appropriately ambitious goals, rejecting the idea that grade-level advancement is the only marker of benefit. Exam items often hinge on recognizing that Endrew F. raised the bar above de minimis without adopting a potential-maximizing standard." },
      { title: "Deinstitutionalization and the Inclusion Movement", body: "The 1972 Willowbrook exposé in New York revealed inhumane conditions in a state institution and produced a 1975 consent decree that accelerated deinstitutionalization nationwide. The normalization principle (Nirje, Wolfensberger) argued that people with disabilities should access patterns of everyday life as close as possible to those of their peers, fueling community-based services and, later, the Regular Education Initiative and the inclusion movement. The field's trajectory runs from institutionalization and exclusion, to separate schools and classes, to mainstreaming, to inclusion with supports delivered in general education, mirrored legally in IDEA's LRE continuum." },
      { title: "Disproportionality and Equity in IDEA", body: "Black students and other students of color are persistently overrepresented in high-judgment categories such as emotional disability and intellectual disability, in more restrictive placements, and in disciplinary removals, while underrepresented in gifted programs. Under IDEA's significant disproportionality provisions (34 CFR 300.646-647, the Equity in IDEA regulations), states apply a standard risk-ratio methodology; districts flagged must reserve 15% of IDEA Part B funds for comprehensive coordinated early intervening services (CCEIS) and review and revise policies, practices, and procedures. Contributing factors include referral bias, deficit-oriented assessment, inequitable access to strong core instruction, and conflating cultural or linguistic difference with disability; legal remedies never include quotas, referral moratoria, or category caps by race." },
      { title: "Professional Ethics and Confidentiality", body: "CEC's ethical principles obligate special educators to maintain challenging expectations, practice within their professional competence, use evidence-based practices, advocate for students and families, and protect confidentiality. Under FERPA, personally identifiable information from education records may be shared without consent only with school officials who have a legitimate educational interest; hallway and lounge conversations about a student's classification, medication, or records violate this standard. At the same time, Part 200 requires that every teacher and provider responsible for implementing an IEP be informed of their specific responsibilities, so confidentiality is never a reason to withhold IEP information from the student's own service providers." },
      { title: "Culturally and Linguistically Responsive Special Education", body: "Teams must distinguish language difference and acquisition processes from disability: assessments must be administered in the student's native language, interpreters must be qualified, and parents are entitled to meaningful participation, including interpretation at CSE meetings and safeguards documents in their native language. A student may not be found eligible if the determinant factor is lack of appropriate instruction in reading or math or limited English proficiency (34 CFR 300.306(b)), and the SLD definition excludes learning problems primarily resulting from environmental, cultural, or economic disadvantage. Culturally responsive practice extends beyond evaluation to curriculum, behavior expectations, family partnership, and interpretation of behavior through the family's cultural lens rather than a deficit lens." },
    ],
    practice: [
      {s:"C1", d:"History, Ethics & Equity",
       q:"A CSE reconvenes for a sixth grader with a specific learning disability who met none of his reading goals last year. The proposed new IEP carries over the same goals with the same criteria, and the chairperson notes the student is \"making some progress, which is all the law requires.\" Under Endrew F. v. Douglas County (2017), which statement best describes the governing standard?",
       a:["The IEP must confer an educational benefit that is more than trivial, a threshold this student's partial progress already satisfies", "The IEP must be reasonably calculated to enable progress that is appropriate in light of the student's individual circumstances", "The IEP must be designed to maximize the student's potential commensurate with the opportunity given to nondisabled peers", "The IEP must guarantee that the student achieves grade-level proficiency on state assessments within the annual goal period"],
       c:1, r:"Endrew F. held that FAPE demands an IEP reasonably calculated to enable progress appropriate in light of the child's circumstances, expressly rejecting the merely-more-than-de-minimis standard. Option A is the strongest distractor because it states the lower-court standard the Supreme Court overturned; carrying over failed goals is the precise fact pattern Endrew F. condemned. Option C states the potential-maximization standard rejected in Rowley (1982), and option D overstates the law, since Endrew F. requires appropriately ambitious goals, not guaranteed grade-level outcomes."},
      {s:"C1", d:"History, Ethics & Equity",
       q:"A graduate candidate is tracing the statutory origin of the right to a free appropriate public education for students with disabilities. Which statement accurately identifies that origin?",
       a:["Section 504 of the Rehabilitation Act of 1973 first guaranteed FAPE through individualized education programs in all public schools", "The Americans with Disabilities Act of 1990 first established FAPE as part of its Title II protections for public school students", "The Individuals with Disabilities Education Act, enacted as new legislation in 1990, first created the federal FAPE guarantee", "Public Law 94-142, the Education for All Handicapped Children Act of 1975, first guaranteed FAPE and was renamed IDEA in 1990"],
       c:3, r:"PL 94-142, the Education for All Handicapped Children Act (1975), first established the federal guarantees of FAPE, LRE, IEPs, and procedural safeguards, and the 1990 reauthorization renamed the statute IDEA. Option A is the strongest distractor because Section 504 (1973) predates PL 94-142 and does prohibit disability discrimination, but it did not create the IEP-based FAPE entitlement, which is IDEA's mechanism. Option C reflects the common misconception that IDEA was a brand-new 1990 law rather than a renaming, and the ADA (option B) is a nondiscrimination statute, not the source of FAPE."},
      {s:"C1", d:"History, Ethics & Equity",
       q:"A state data review finds that a New York district identifies Black students with an emotional disability at more than three times the rate of all other students and places them in separate settings at similarly elevated rates, exceeding the state's risk-ratio threshold. Under IDEA's significant disproportionality regulations, what is the district required to do?",
       a:["Reserve 15% of its IDEA Part B funds for comprehensive coordinated early intervening services and review and revise its policies, practices, and procedures", "Suspend new special education referrals for students in the overrepresented group until the district's identification rates fall below the state threshold", "Reevaluate all currently classified students in the overrepresented group and declassify those whose records show any procedural irregularity", "Report the disparity to the Office for Civil Rights and pause placement decisions until OCR issues a corrective action agreement"],
       c:0, r:"Under 34 CFR 300.646-647, a district identified with significant disproportionality must reserve 15% of its Part B funds for comprehensive coordinated early intervening services and publicly review and revise policies, practices, and procedures. Option B is the strongest distractor because slowing referrals for one racial group is a documented district response, but it is itself discriminatory and violates child find; eligible children retain the right to evaluation regardless of the district's data profile. Options C and D invent remedies: blanket declassification denies individual rights, and OCR is not the enforcement mechanism for this IDEA provision."},
      {s:"C1", d:"History, Ethics & Equity",
       q:"A second-grade teacher refers a recently arrived student from the Dominican Republic for a special education evaluation because she is far behind classmates in reading. The student receives ENL services and speaks Spanish at home. As the multidisciplinary team plans the evaluation, which practice is required?",
       a:["Postpone the evaluation until the student reaches intermediate English proficiency so test results will not be confounded by language", "Administer the standard English battery, since English is the language of instruction and the language in which she must perform", "Administer assessments in the student's native language and rule out limited English proficiency as the determinant factor in eligibility", "Substitute classroom observation for standardized testing, since formal measures lack validity for emergent bilingual students"],
       c:2, r:"IDEA and Part 200 require that assessments be administered in the student's native language and in the form most likely to yield accurate information, and a student may not be found eligible if the determinant factor is limited English proficiency (34 CFR 300.304, 300.306(b); 8 NYCRR 200.4(b)). Option A is the strongest distractor because delaying evaluation to let English develop is a widespread practice, but districts may not postpone a referral-triggered evaluation, since true disabilities manifest in both languages and child find obligations apply to ELLs now. Option D overcorrects: formal measures are not banned, they must simply be selected and administered without linguistic bias."},
    ],
  },
  "High-Incidence Disabilities (SLD, Speech/Language, OHI/ADHD)": {
    icon: "📚",
    concepts: [
      { title: "SLD: Federal and NY Definition with Exclusionary Criteria", body: "A specific learning disability is a disorder in one or more of the basic psychological processes involved in understanding or using language, spoken or written, that manifests in an imperfect ability to listen, think, speak, read, write, spell, or do mathematical calculations (34 CFR 300.8(c)(10); 8 NYCRR 200.1(zz)(6)). The term includes conditions such as dyslexia, perceptual disabilities, brain injury, and developmental aphasia, but a learning problem cannot be classified as SLD if it is primarily the result of visual, hearing, or motor disabilities; intellectual disability; emotional disability; or environmental, cultural, or economic disadvantage. SLD is the most prevalent classification nationally and in New York, accounting for roughly one-third of all students with IEPs." },
      { title: "Dyslexia, Dyscalculia, and Dysgraphia Profiles", body: "Dyslexia is characterized by inaccurate or dysfluent word recognition and poor spelling stemming from a core phonological processing deficit, typically with relatively intact listening comprehension. Dyscalculia involves weak number sense, difficulty comparing magnitudes, and labored retrieval of basic facts; dysgraphia involves impaired handwriting, spelling, and written expression, where transcription demands drain the working memory needed for composition. NYSED's 2018 guidance confirms that evaluators and CSEs may use the terms dyslexia, dyscalculia, and dysgraphia in evaluations and IEPs." },
      { title: "SLD Determination in New York: The RtI Requirement", body: "New York prohibits sole reliance on a severe discrepancy between achievement and intellectual ability when determining SLD in reading for students in grades K-4; data from a response to intervention process are a required component of those determinations (8 NYCRR 200.4(j)). The CSE must also conduct an observation in the learning environment and rule out lack of appropriate instruction in reading and math, documented through repeated assessments of achievement. RtI is not a gatekeeper for evaluation: a parent may refer a student for an initial evaluation at any time, and the district may not require completion of RtI tiers before accepting the referral." },
      { title: "Speech or Language Impairment: Form, Content, and Use", body: "A speech or language impairment is a communication disorder, such as stuttering, impaired articulation, a language impairment, or a voice impairment, that adversely affects educational performance. Speech disorders affect production: articulation (sound errors), fluency (stuttering), and voice (pitch, quality, resonance). Language disorders affect form (phonology, morphology, syntax), content (semantics), or use (pragmatics) and may be receptive, expressive, or mixed; early language impairment is one of the strongest predictors of later reading disability." },
      { title: "OHI and ADHD: The 'Limited Alertness' Definition", body: "Other health impairment means limited strength, vitality, or alertness, including a heightened alertness to environmental stimuli that results in limited alertness with respect to the educational environment, due to chronic or acute health problems such as asthma, ADHD, diabetes, epilepsy, a heart condition, lead poisoning, sickle cell anemia, or Tourette syndrome (34 CFR 300.8(c)(9)). ADHD is served under OHI when it adversely affects educational performance and the student needs special education; a medical diagnosis alone neither guarantees nor substitutes for eligibility. The 'heightened alertness' clause was written precisely to capture distractibility: the student is over-attentive to everything except instruction." },
      { title: "ADHD: Executive Function, Performance Variability, and Co-Occurrence", body: "DSM-5-TR requires several inattentive and/or hyperactive-impulsive symptoms present before age 12, occurring in two or more settings, with clear functional impact. The academic signature of ADHD is executive dysfunction, including weak working memory, planning, organization, and inhibition, producing marked performance variability: the student demonstrates a skill one day and not the next, which is a feature of the disorder rather than a motivation problem. Co-occurrence is the rule rather than the exception; roughly a third or more of students with ADHD also have an SLD, and anxiety and oppositional patterns are common." },
    ],
    practice: [
      {s:"C2", d:"High-Incidence Disabilities (SLD, Speech/Language, OHI/ADHD)",
       q:"A second grader reads slowly and inaccurately, guessing at words from their first letters, and cannot reliably segment spoken words into individual sounds. The same student understands grade-level texts well when they are read aloud and contributes sophisticated ideas during class discussion. This profile is most consistent with:",
       a:["a specific learning disability with a phonologically based word-reading deficit, consistent with dyslexia", "a receptive language impairment that is disrupting the student's comprehension of connected text", "a generalized cognitive delay that is depressing both decoding skill and oral language development", "a visual processing deficit that calls for colored overlays and eye-movement training exercises"],
       c:0, r:"Inaccurate, dysfluent word reading anchored in poor phonemic segmentation, alongside strong listening comprehension, is the classic dyslexia signature: the deficit is phonological, not comprehension-based (consistent with the IDA definition and the NICHD reading research base). The receptive-language option fails because the student comprehends well once decoding is removed via read-alouds, and strong discussion contributions rule out a generalized delay. Visual-deficit explanations of dyslexia, and overlay or eye-training remedies, are documented misconceptions unsupported by research."},
      {s:"C2", d:"High-Incidence Disabilities (SLD, Speech/Language, OHI/ADHD)",
       q:"A fifth grader classified with a speech or language impairment produces grammatically correct sentences and scores within average limits on vocabulary measures, yet monopolizes conversations, misses sarcasm, makes off-topic comments, and cannot repair misunderstandings with peers. The language component most affected is:",
       a:["form, because the student's difficulties originate in the syntactic structure of utterances", "content, because the student's semantic networks are too sparse to sustain conversation", "use, because the student's pragmatic skills break down in real social exchanges", "phonology, because the student's sound-system errors obscure the intent of messages"],
       c:2, r:"In the Bloom and Lahey framework, language comprises form (phonology, morphology, syntax), content (semantics), and use (pragmatics); conversational dominance, missed sarcasm, off-topic turns, and failed repairs are pragmatic, the use dimension. Content is the strongest distractor, but average vocabulary scores show semantic knowledge is intact; the breakdown appears only when language must be deployed socially. Intact grammar and intelligible production rule out form and phonology."},
      {s:"C2", d:"High-Incidence Disabilities (SLD, Speech/Language, OHI/ADHD)",
       q:"A CSE reviews an evaluation of a student with severe ADHD whose attention is captured by every hallway noise and wall display, leaving little attention for instruction. A committee member objects that the student cannot qualify under other health impairment because the definition requires 'limited alertness' and this student seems overly alert. The most accurate response is that:",
       a:["the member is correct, and the committee should instead consider whether the student meets emotional disability criteria", "the OHI definition expressly includes heightened alertness to environmental stimuli that results in limited alertness to the educational environment", "the committee should pursue a specific learning disability classification instead, since ADHD's educational impact is primarily academic", "the student can qualify only if a physician documents that the ADHD also limits the student's physical strength and vitality"],
       c:1, r:"34 CFR 300.8(c)(9) defines OHI as limited strength, vitality, or alertness, 'including a heightened alertness to environmental stimuli, that results in limited alertness with respect to the educational environment,' language written precisely for the distractible ADHD profile. The physician option is the strongest distractor: strength, vitality, and alertness are disjunctive criteria, and no physician certification of limited strength is required for eligibility. SLD is a distinct classification requiring a psychological-processing disorder, not a default route for ADHD."},
      {s:"C2", d:"High-Incidence Disabilities (SLD, Speech/Language, OHI/ADHD)",
       q:"A school psychologist completing an initial evaluation of a third grader referred for reading difficulties documents a large gap between the student's IQ and reading achievement and recommends a specific learning disability classification on that basis alone. Under New York regulations, this recommendation is:",
       a:["acceptable, because the severe discrepancy approach remains a permissible basis for SLD determinations at every grade level", "acceptable, provided the psychologist verifies that the measured discrepancy is at least two full standard deviations", "flawed, because New York requires a neuropsychological battery to rule out other health impairment before SLD can be considered", "flawed, because New York prohibits sole reliance on a severe discrepancy and requires response to intervention data for K-4 reading determinations"],
       c:3, r:"Under 8 NYCRR 200.4(j), a district may not use a severe discrepancy between achievement and intellectual ability as the sole criterion for determining SLD in reading for students in kindergarten through grade 4; data from a response to intervention process are a required component of those determinations. Option A is the strongest distractor because discrepancy data may still be considered as part of the picture; the violation is relying on the discrepancy alone for a K-4 reading determination. No fixed two-standard-deviation threshold or neuropsychological battery is required by regulation."},
    ],
  },
  "Autism, Emotional Disability & Behavioral Profiles": {
    icon: "🧠",
    concepts: [
      { title: "Autism: Educational Classification vs. Clinical Diagnosis", body: "Under 8 NYCRR 200.1(zz)(1), autism is a developmental disability significantly affecting verbal and nonverbal communication and social interaction, generally evident before age three, that adversely affects educational performance; associated features include repetitive activities, stereotyped movements, resistance to environmental or routine change, and unusual sensory responses. A DSM-5-TR diagnosis of autism spectrum disorder is neither required for, nor automatically equivalent to, the educational classification; the CSE must independently find adverse educational impact and a need for special education. The classification does not apply if educational performance is adversely affected primarily because the student has an emotional disability." },
      { title: "Core Social-Communication Characteristics", body: "Autism's social-communication profile includes deficits in joint attention, social reciprocity, and perspective taking (theory of mind), along with pragmatic differences such as literal interpretation, difficulty with sarcasm and idioms, and trouble repairing conversational breakdowns. These are social-cognitive differences, not willful rudeness or defiance; the student often cannot infer how a behavior lands on a listener. The spectrum is heterogeneous: intellectual ability ranges from intellectual disability to giftedness, and a substantial minority of students are minimally verbal and rely on AAC." },
      { title: "Restricted, Repetitive Behavior and Sensory Features", body: "The second DSM-5-TR domain covers restricted, repetitive behavior: stereotyped movements or speech (including echolalia), insistence on sameness and inflexible adherence to routines, intense circumscribed interests, and sensory hyper- or hypo-reactivity. Insistence on sameness explains why schedule disruptions, fire drills, substitute teachers, or rearranged furniture can trigger intense, slow-to-recover distress that spills into later transitions. Predictable routines, visual schedules, and advance warning of change address the characteristic; the behavior is not attention-seeking by default." },
      { title: "Emotional Disability: The NY Definition", body: "New York uses the term emotional disability (the federal IDEA term is 'emotional disturbance') for a condition exhibiting one or more of five characteristics over a long period of time and to a marked degree that adversely affects educational performance: an inability to learn not explained by intellectual, sensory, or health factors; an inability to build or maintain satisfactory relationships with peers and teachers; inappropriate behavior or feelings under normal circumstances; a generally pervasive mood of unhappiness or depression; or a tendency to develop physical symptoms or fears associated with personal or school problems. The term includes schizophrenia but does not apply to students who are socially maladjusted unless they also meet ED criteria. 'Long period of time' and 'marked degree' screen out transient, situational reactions to acute stressors." },
      { title: "Emotional Disability vs. Social Maladjustment", body: "Social maladjustment is conventionally marked by goal-directed, often peer-reinforced rule breaking with intact relationships inside a chosen peer group, behavior that is controlled when consequences are immediate, and an absence of pervasive internal distress. Emotional disability, by contrast, tends to be pervasive across settings and relationships and accompanied by genuine impairment in relating or regulating. The distinction is contested in the research literature, and the two can co-occur; the exclusion removes only students who are solely socially maladjusted." },
      { title: "Internalizing vs. Externalizing Profiles", body: "Externalizing behavior (aggression, defiance, disruption) drives the majority of referrals because it costs teachers instructional time, while internalizing problems (anxiety, depression, withdrawal, somatic complaints) impair learning just as much but are systematically under-identified. Both patterns can satisfy ED criteria; pervasive unhappiness and physical symptoms or fears are two of the five regulatory characteristics. Quiet, withdrawn students, and girls in particular, are the most commonly missed." },
      { title: "Behavior as Communication", body: "Across autism and emotional disability, challenging behavior is best read functionally: it operates to obtain attention or tangibles, to escape demands or social situations, or to produce automatic (sensory) reinforcement. A functional behavioral assessment identifies the antecedents and consequences maintaining the behavior so that intervention can teach an equivalent, more efficient replacement. Topography alone never reveals function; identical behaviors can serve different functions in different students." },
    ],
    practice: [
      {s:"C2", d:"Autism, Emotional Disability & Behavioral Profiles",
       q:"During cooperative groups, a fourth grader with autism announces classmates' test scores aloud, corrects peers' grammar mid-sentence, and walks away when a partner begins describing a weekend trip. The teacher reads this as deliberate rudeness. The interpretation best grounded in autism research is that the student:",
       a:["is displaying willful noncompliance that calls for a structured hierarchy of escalating consequences", "has an underlying emotional disability marked by an inability to maintain satisfactory peer relationships", "has difficulty inferring what others think and feel, so the social impact of these behaviors is not apparent", "is overwhelmed by sensory input in the group setting and is using these behaviors to escape the noise"],
       c:2, r:"Each behavior reflects a perspective-taking (theory of mind) deficit: the student does not register that announcing scores embarrasses peers, that corrections offend, or that leaving signals disinterest, all hallmark social-cognitive features of autism rather than intentional rudeness. The sensory-escape option is the strongest distractor, but the behaviors track social content (scores, grammar, a peer's story), not noise or stimulation level. An ED interpretation ignores that this is a developmental social-communication pattern, not a later-emerging emotional condition."},
      {s:"C2", d:"Autism, Emotional Disability & Behavioral Profiles",
       q:"In November, a CSE reviews a referral for a seventh grader whose grades dropped sharply and who has cried in class repeatedly during the six weeks since the student's parents separated. The school social worker proposes an emotional disability classification at the upcoming meeting. The strongest regulatory concern is that the student's presentation:",
       a:["reflects pervasive unhappiness, a pattern that falls outside the five characteristics in the definition", "cannot support classification without a psychiatric diagnosis of depression from a licensed clinician", "shows an educational impact that should be addressed exclusively through building-level counseling supports", "has not yet been demonstrated over a long period of time or to a marked degree, as the definition requires"],
       c:3, r:"The ED definition requires that characteristics be exhibited 'over a long period of time and to a marked degree,' a duration commonly interpreted as roughly six months, precisely to screen out situational reactions to acute stressors like a family separation six weeks earlier. Option A is the strongest distractor but inverts the rule: a generally pervasive mood of unhappiness or depression IS one of the five characteristics. No psychiatric diagnosis is required for classification, and providing supportive interventions now with continued monitoring does not foreclose later eligibility."},
      {s:"C2", d:"Autism, Emotional Disability & Behavioral Profiles",
       q:"A kindergartner with autism moves calmly through the morning routine until a fire drill interrupts the schedule; for the rest of the day, the student screams and drops to the floor at every subsequent transition. Which characteristic of autism best accounts for this pattern?",
       a:["Hyposensitivity to auditory input, which delays the student's processing of each verbal transition direction", "Insistence on sameness, which makes disruptions to routine acutely distressing and slow to recover from", "Deficits in joint attention, which keep the student from noticing the rest of the group shifting activities", "Immediate echolalia, which signals that the student does not comprehend the transition warnings being given"],
       c:1, r:"Insistence on sameness and inflexible adherence to routines (DSM-5-TR Criterion B2) explains both the initial distress and the lingering dysregulation at later transitions: once the day's predictability is broken, every subsequent change is threatening. Auditory hypersensitivity might explain a reaction to the alarm itself, but the option as written says hyposensitivity, and neither sensory account explains escalating distress at quiet transitions hours afterward. Joint attention deficits and echolalia do not address routine disruption at all."},
      {s:"C2", d:"Autism, Emotional Disability & Behavioral Profiles",
       q:"A child study team discusses two students: one shoves peers and refuses work; the other is quiet, has stopped submitting assignments, reports frequent stomachaches, and eats lunch alone every day. Only the first student is referred for evaluation. Research on behavioral profiles suggests this decision most likely reflects:",
       a:["under-identification of internalizing problems, which impair learning substantially but rarely disrupt classrooms", "appropriate triage, because externalizing behavior is the defining feature of an emotional disability", "sound reasoning, because somatic complaints fall under other health impairment rather than emotional disability", "over-identification of externalizing behavior, which usually reflects social maladjustment rather than disability"],
       c:0, r:"Internalizing problems such as withdrawal, depression, anxiety, and somatic complaints are systematically under-referred because they do not cost teachers instructional time, yet they impair learning as much as externalizing behavior. The somatic-complaint option is the strongest distractor, but 'a tendency to develop physical symptoms or fears associated with personal or school problems' is itself one of the five ED characteristics, not an OHI matter. Externalizing behavior is neither the defining feature of ED nor presumptively social maladjustment."},
    ],
  },
  "Low-Incidence, Sensory & Physical Disabilities": {
    icon: "♿",
    concepts: [
      { title: "Intellectual Disability: Dual-Criterion Definition", body: "Intellectual disability means significantly subaverage general intellectual functioning, typically about two standard deviations below the mean after accounting for measurement error, existing concurrently with deficits in adaptive behavior (conceptual, social, and practical skills) and manifested during the developmental period (34 CFR 300.8(c)(6)). An IQ score alone is never sufficient; a student with a low IQ but average adaptive functioning does not meet the definition. Educationally, expect slower acquisition, difficulty with transfer and generalization, and a need for explicit, systematic instruction with planned generalization programming." },
      { title: "Deafness and Hearing Impairment", body: "Educational impact depends on degree (mild to profound), type (conductive, sensorineural, mixed), and age of onset; prelingual loss disrupts language acquisition far more than postlingual loss. The central effect is restricted access to language, not reduced intelligence: students who are deaf lose incidental learning from overheard conversations, media, and announcements, which depresses vocabulary, idiom knowledge, and background knowledge. IDEA's special factors require the IEP team to consider the student's language and communication needs, including opportunities for direct communication with peers and professionals in the student's language and communication mode." },
      { title: "Blindness and Visual Impairment", body: "Visual impairment including blindness ranges from partial sight to total blindness and chiefly affects incidental learning, concept development, and orientation and mobility; concepts sighted children absorb visually must be built through systematic, hands-on experience. 'Verbalism,' the fluent use of words without grasp of their referents, signals experiential gaps rather than a language disorder. IDEA's special factor requires instruction in braille and the use of braille unless the IEP team, after evaluating the student's reading and writing needs, determines braille is not appropriate; the Expanded Core Curriculum adds orientation and mobility, assistive technology, social interaction, and independent living skills." },
      { title: "Deaf-Blindness", body: "Deaf-blindness means concomitant hearing and visual impairments whose combination causes such severe communication and developmental needs that programs solely for students with deafness or students with blindness cannot accommodate them; most students retain some usable vision or hearing. Because both distance senses are limited, the combined impact is multiplicative rather than additive, and communication often must be brought to the body through tactile signing, object cues, and touch cues. Interveners, trained one-to-one access providers, are a nationally recommended practice but are NOT mandated by IDEA; the CSE decides individually whether such support is needed for FAPE." },
      { title: "Traumatic Brain Injury", body: "TBI is an acquired injury to the brain caused by an external physical force resulting in total or partial functional disability or psychosocial impairment that adversely affects educational performance; the definition expressly excludes congenital and degenerative conditions and brain injuries induced by birth trauma (34 CFR 300.8(c)(12)). The educational profile is uneven and changes during recovery: previously mastered skills may persist while new learning, memory, attention, executive function, and emotional regulation are impaired, so pre-injury records can badly mislead planning. Frequent reevaluation and flexible programming are essential because needs can shift within a single school year." },
      { title: "Orthopedic Impairment and Multiple Disabilities", body: "Orthopedic impairment covers severe orthopedic conditions that adversely affect educational performance, whether congenital, disease-based (e.g., poliomyelitis), or from other causes (e.g., cerebral palsy, amputations, contracture-causing burns); motor impairment carries no implication about cognition, and students with cerebral palsy span the full intellectual range, with many needing AAC or alternative access rather than simplified content. Multiple disabilities means concomitant impairments (such as intellectual disability-blindness) whose combination causes needs that cannot be met in programs designed for any single impairment. The category expressly excludes deaf-blindness, which is its own classification." },
      { title: "New York's 13 Classifications and Preschool Students", body: "New York recognizes 13 disability classifications under 8 NYCRR 200.1(zz): autism, deafness, deaf-blindness, emotional disability, hearing impairment, intellectual disability, learning disability, multiple disabilities, orthopedic impairment, other health impairment, speech or language impairment, traumatic brain injury, and visual impairment including blindness. New York does NOT use a 'developmental delay' classification. Children ages 3-5 receive the single label 'preschool student with a disability' from the Committee on Preschool Special Education, without a categorical classification." },
    ],
    practice: [
      {s:"C2", d:"Low-Incidence, Sensory & Physical Disabilities",
       q:"A CSE considers a traumatic brain injury classification for three students: one injured in a car crash at age nine, one with brain damage from oxygen deprivation during birth, and one with a progressive neurological disease. Under the IDEA and Part 200 definitions, the classification could apply to:",
       a:["only the student injured in the car crash, because TBI requires an acquired injury caused by an external physical force", "the car crash and birth-injury students, because both injuries occurred after conception rather than genetically", "all three students, because each shows documented, brain-based functional impairment affecting education", "the car crash and progressive disease students, because both conditions emerged after the developmental period began"],
       c:0, r:"Under 34 CFR 300.8(c)(12), TBI is an acquired injury to the brain 'caused by an external physical force,' and the definition expressly excludes congenital or degenerative conditions and brain injuries induced by birth trauma. The birth-injury option is the strongest distractor because the damage is acquired in a lay sense, but birth-trauma injuries are specifically carved out of the federal and state definitions. Students excluded from TBI may still qualify under other classifications, such as other health impairment or multiple disabilities."},
      {s:"C2", d:"Low-Incidence, Sensory & Physical Disabilities",
       q:"A sixth grader who is deaf, a fluent ASL user with average nonverbal cognitive scores and a full-time educational interpreter, knows far fewer idioms, current events, and bits of everyday general knowledge than hearing classmates. The most likely explanation is:",
       a:["inflated cognitive estimates, because nonverbal measures tend to overstate the verbal reasoning of deaf students", "reduced incidental learning, because the student cannot overhear the everyday talk through which hearing peers absorb it", "an emerging language processing disorder that should prompt referral for a comprehensive psychoeducational reevaluation", "gaps in interpretation quality, because educational interpreters frequently omit low-frequency vocabulary during lessons"],
       c:1, r:"Hearing students acquire enormous amounts of vocabulary, idiom, and world knowledge incidentally, by overhearing conversations, media, and announcements never addressed to them, and deafness cuts off that channel even when direct instruction is fully accessible. This incidental learning gap is a documented consequence of hearing loss, not a cognitive or language disorder, so the reevaluation option pathologizes a predictable access effect. Blaming the interpreter assumes a service failure for which the scenario offers no evidence."},
      {s:"C2", d:"Low-Incidence, Sensory & Physical Disabilities",
       q:"Parents of a student with deaf-blindness tell the CSE that federal law entitles every student with deaf-blindness to a trained intervener and ask that one be written into the IEP. Which response most accurately reflects the legal and professional landscape?",
       a:["IDEA expressly entitles students with deaf-blindness to interveners, so the CSE must add one as a related service", "Interveners are generally disfavored because continuous one-to-one adult support fosters dependence and limits peer access", "Interveners may be considered only for students whose sole expressive communication mode is tactile sign language", "Interveners are a recommended practice, not an IDEA mandate, and the CSE must decide individually whether one is needed for FAPE"],
       c:3, r:"IDEA contains no intervener entitlement; interveners are a best practice promoted by the National Center on Deaf-Blindness, and the decision rests on the CSE's individualized determination of what the student needs to receive FAPE. Option B is the strongest distractor because over-reliance on one-to-one adults is a legitimate concern in the literature, but that does not make interveners disfavored; for many students with deaf-blindness, a trained access provider is exactly what FAPE requires. No regulation restricts interveners to students who use tactile sign."},
      {s:"C2", d:"Low-Incidence, Sensory & Physical Disabilities",
       q:"An individual evaluation of a ten-year-old yields a full scale IQ of 68, but adaptive behavior ratings from both home and school fall within the average range, and the student manages daily routines independently. Regarding an intellectual disability classification, the CSE should conclude that:",
       a:["the IQ score is controlling, because intellectual functioning is the primary criterion and adaptive ratings are supplementary", "the classification applies if a second intelligence test given by a different examiner confirms a score below 70", "the definition is not met, because the classification requires adaptive behavior deficits concurrent with subaverage intellectual functioning", "a multiple disabilities classification should be used provisionally while the committee gathers additional adaptive data"],
       c:2, r:"The federal and New York definitions require significantly subaverage intellectual functioning 'existing concurrently with deficits in adaptive behavior' and manifested during the developmental period; with average adaptive functioning across settings, the dual criterion fails regardless of the IQ score (34 CFR 300.8(c)(6)). The retest option is the strongest distractor because confirming scores is good practice, but no retest can substitute for the missing adaptive deficit. Multiple disabilities requires two concomitant impairments, neither of which is established here."},
    ],
  },
  "Assessment Types & Score Interpretation": {
    icon: "📊",
    concepts: [
      { title: "Formal vs. Informal Assessment", body: "Formal assessments are standardized instruments with fixed administration and scoring procedures and published reliability and validity evidence; informal assessments include observation, interviews, inventories, work-sample and error analysis, and teacher-made probes. Eligibility decisions rest heavily on formal measures, while informal data drive PLAAFP statements, goal selection, and daily instructional decisions. IDEA requires a variety of assessment tools and strategies, and no single measure may serve as the sole basis for determining eligibility or the educational program (34 CFR 300.304)." },
      { title: "Norm-Referenced vs. Criterion-Referenced", body: "Norm-referenced tests compare a student with a representative standardization sample and report relative standing through standard scores, percentile ranks, and stanines; criterion-referenced tests compare performance with a fixed mastery standard, such as 8 of 10 two-digit subtraction problems solved correctly. Norm-referenced data document how far performance departs from age expectations, which serves eligibility decisions; criterion-referenced and curriculum-based data identify exactly which skills to teach, which serves instructional planning. Never confuse a standard score of 85 (16th percentile) with 85 percent mastery; they are unrelated metrics, and items are written to exploit that confusion." },
      { title: "The Standard Score Family", body: "Most composite scores use a mean of 100 and SD of 15 (85 = 16th percentile; 70 = 2nd percentile); T-scores use 50/10, subtest scaled scores 10/3, stanines 5/2, and z-scores 0/1, so all conversions run through standard deviation units (T 60 = z +1.0 = standard score 115 = 84th percentile = stanine 7). Percentile ranks are ordinal, not equal-interval: because scores cluster near the mean, equal percentile differences do not represent equal performance differences; percentile ranks cannot be averaged and never mean percent of items correct. A grade equivalent reports only the grade and month whose median raw score matches the student's raw score on the same content; it does not indicate the level of material the student should be taught." },
      { title: "Measurement Error & Confidence Intervals", body: "Every obtained score is an estimate that contains error; the standard error of measurement (SEM) quantifies that error, and a confidence interval (e.g., 72 plus or minus 5 at 95 percent confidence) identifies the band in which the student's true score most likely falls. The higher a test's reliability, the smaller the SEM and the narrower the band. Confidence intervals matter most near cutoffs: an obtained 72 with a band of 67-77 cannot responsibly be treated as definitively above or below a criterion of 70." },
      { title: "Screening vs. Diagnostic Assessment", body: "Universal screening administers brief measures to all students several times a year to flag those at risk; a screener never identifies a disability and never pinpoints a specific deficit. Diagnostic assessment follows a flagged screen to isolate the specific skills needing intervention and to set instructional targets. The defensible sequence is screen, then diagnose, then intervene with progress monitoring, not screen then refer; a parent nonetheless retains the right to refer for an individual evaluation at any time." },
      { title: "CBM & Progress Monitoring", body: "Curriculum-based measurement uses brief, timed, standardized probes of equivalent difficulty sampled from the year-long curriculum (e.g., words read correctly per minute), so weekly scores are directly comparable on a single graph. Plot baseline, draw an aimline to the year-end goal, and apply decision rules: roughly four consecutive data points below the aimline signal an instructional change, while four consecutive points above signal raising the goal. Because CBM yields a rate of improvement (slope), it is the backbone of RtI progress monitoring and of objective progress reporting on IEP goals." },
      { title: "Ecological & Functional Assessment", body: "Ecological assessment analyzes the fit between a student and the demands, routines, expectations, and supports of a specific environment, making it the tool of choice before recommending supplementary aids and services or planning for generalization across settings. A functional behavior assessment (FBA) identifies the function an interfering behavior serves (attention, escape, access to tangibles, or sensory consequences) using indirect, descriptive, and sometimes experimental methods. In New York, an FBA is required as part of an initial evaluation when behavior impedes the student's learning or that of others, and it anchors any behavioral intervention plan (8 NYCRR 200.4, 200.22)." },
    ],
    practice: [
      {s:"C3", d:"Assessment Types & Score Interpretation",
       q:"A school psychologist reports that a fourth grader earned a standard score of 85 (mean = 100, SD = 15) on a norm-referenced reading comprehension measure. Which interpretation of this score is accurate?",
       a:["The student answered 85 percent of the comprehension items correctly.", "The student scored higher than 85 percent of the students in the norm group.", "The student is reading at approximately a mid-eighth-grade instructional level in comprehension.", "The student scored one standard deviation below the mean, near the 16th percentile."],
       c:3, r:"A standard score of 85 falls exactly one standard deviation below a mean of 100 (SD 15), which corresponds to roughly the 16th percentile of the norm group. Norm-referenced standard scores describe relative standing, not the proportion of items answered correctly, so the percent-correct reading is a category error. Treating 85 as if it implied a grade level of 8.5 confuses standard scores with grade equivalents, which are derived very differently and should never drive placement."},
      {s:"C3", d:"Assessment Types & Score Interpretation",
       q:"A special education teacher monitors a fifth grader's oral reading fluency with weekly CBM probes. The last four consecutive data points all fall below the aimline drawn from baseline to the year-end goal. According to standard data-based decision rules, the teacher should:",
       a:["make a change to the instructional program and continue collecting weekly progress data.", "raise the year-end goal so that the aimline reflects a more ambitious rate of growth.", "refer the student to the CSE, because the progress data now confirm a disability.", "continue the current program unchanged for several more weeks to confirm the trend."],
       c:0, r:"The standard CBM decision rule calls for an instructional change when four consecutive points fall below the aimline; the goal is raised only in the opposite case, when four consecutive points fall above it. Continuing the unchanged program simply delays needed intensification. CBM progress data alone can never confirm a disability; eligibility requires a comprehensive individual evaluation using a variety of measures (34 CFR 300.304)."},
      {s:"C3", d:"Assessment Types & Score Interpretation",
       q:"An evaluation report states that a student's obtained IQ score is 72, with a 95 percent confidence interval of 67-77. As the CSE weighs this result, which understanding of the confidence interval is correct?",
       a:["If the student is retested at any point, the new obtained score is guaranteed to fall between 67 and 77.", "The test's reliability is too low for the score to be considered in any eligibility decision.", "The student's true score likely lies within the band, so 72 is not a precise cutoff value.", "The obtained 72 is the student's true ability, and the band reflects examiner scoring errors."],
       c:2, r:"A confidence interval is built from the standard error of measurement: the student's true score most likely falls between 67 and 77, so the obtained 72 must be interpreted as a band rather than a fixed point, which matters greatly near eligibility cutoffs. The strongest distractor misreads the interval as a guarantee about future retest scores, which it is not. Confidence intervals are a routine feature of every psychometrically sound instrument, not evidence that the test is unreliable."},
      {s:"C3", d:"Assessment Types & Score Interpretation",
       q:"Which statement about percentile ranks on a norm-referenced test is accurate?",
       a:["A percentile rank of 70 means the student answered 70 percent of the test items correctly.", "Equal differences in percentile ranks do not represent equal differences in performance.", "Percentile ranks from several subtests can be averaged to produce a valid overall composite score.", "A percentile rank of 50 indicates that the student failed to meet grade-level performance standards."],
       c:1, r:"Percentile ranks are ordinal: because scores pile up near the middle of the distribution, a few raw-score points move a student many percentile ranks near the mean but only a few at the extremes, so equal percentile differences do not represent equal differences in performance. For the same reason they cannot be meaningfully averaged. A percentile rank reports the percentage of the norm group the student outperformed, not percent of items correct and not a pass/fail judgment; the 50th percentile is exactly average."},
    ],
  },
  "The IEP Process & Components": {
    icon: "📝",
    concepts: [
      { title: "Referral, Consent & Evaluation Timelines", body: "A parent may refer a student for an initial evaluation at any time; RtI participation can never be imposed as a precondition that delays or denies that evaluation. Informed written consent starts the clock: in New York the initial evaluation must be completed within 60 calendar days of receipt of consent (8 NYCRR 200.4(b)). After the CSE finds the student eligible and develops the IEP, the board of education must arrange for the recommended programs and services within 60 school days of receipt of consent, a separate school-day timeline that candidates often conflate with the calendar-day evaluation deadline." },
      { title: "The CSE & the IEP Cycle", body: "New York's Committee on Special Education includes the parents, at least one of the student's general education teachers (whenever the student is or may be participating in the general education environment), a special education teacher, a school psychologist, a district representative, an individual who can interpret the instructional implications of evaluation results, and, if the parent requests it at least 72 hours before the meeting, an additional parent member. The IEP must be reviewed at least annually, and after the annual review the parent and district may agree in writing to amend it without convening a meeting. Each teacher and provider responsible for implementation must be informed of his or her specific IEP responsibilities prior to implementation (8 NYCRR 200.4(e)(3))." },
      { title: "PLAAFP: The Foundation of the IEP", body: "The present levels of academic achievement and functional performance synthesize formal and informal data into a current baseline and describe how the disability affects the student's involvement and progress in the general education curriculum. Every need identified in the PLAAFP must be addressed somewhere in the IEP through a goal, service, accommodation, or support, and every annual goal must trace back to a need documented in the PLAAFP. Specific, current, measurable baseline data, not test names or vague descriptors, are what make later progress monitoring possible." },
      { title: "Measurable Annual Goals", body: "A measurable annual goal specifies the condition (materials, setting, or supports), an observable behavior stated as an action verb, and the criterion for mastery, including how and how often progress will be measured; verbs such as 'understand,' 'appreciate,' or 'try' are not observable. Goals must be reasonably attainable within one year and aligned to documented PLAAFP needs. In New York, short-term instructional objectives or benchmarks are required only for preschool students with disabilities and for students who participate in the New York State Alternate Assessment (NYSAA), and parents must receive progress reports at least as often as report cards are issued." },
      { title: "SDI, Related Services & Supplementary Aids", body: "Specially designed instruction adapts the content, methodology, or delivery of instruction to address the unique needs resulting from the disability; it is what makes education 'special.' Related services (such as OT, PT, speech-language therapy, counseling, school health services, and transportation) are developmental, corrective, and supportive services required for the student to benefit from special education (34 CFR 300.34). Supplementary aids and services are supports provided in general education settings to enable participation with nondisabled peers, and the IEP may also include program modifications and supports for school personnel, such as consultation or training." },
      { title: "Testing Accommodations vs. Modifications", body: "An accommodation changes how a student accesses instruction or demonstrates learning (timing, scheduling, setting, presentation, or response format) without altering the construct being measured; a modification changes what is taught or expected, such as reducing the number or difficulty of items in a way that changes the measured skill. The same change can be either, depending on the construct: a calculator is an accommodation on a problem-solving test but a modification on a computation-fluency test. Testing accommodations must be documented in the IEP and used routinely during instruction, never introduced for the first time on a State assessment." },
      { title: "LRE, Placement & Transition (Age 15 in NY)", body: "Placement is decided after the IEP is written, is based on the individual IEP rather than the classification or the programs a building happens to operate, and must consider whether supplementary aids and services would allow satisfactory progress in general education; the IEP must explain the extent of any nonparticipation with nondisabled peers (34 CFR 300.114-300.116). New York requires transition planning beginning with the first IEP in effect when the student turns 15, earlier than the federal age-16 minimum. That IEP must include measurable postsecondary goals based on age-appropriate transition assessments, a coordinated set of transition activities, and the student must be invited to attend." },
    ],
    practice: [
      {s:"C3", d:"The IEP Process & Components",
       q:"A CSE is reviewing draft annual goals for a fourth grader with a learning disability in written expression. Which goal is written in acceptable measurable form?",
       a:["Jamal will improve his written expression skills to a level commensurate with grade expectations.", "Given a topic and a graphic organizer, Jamal will write a paragraph with a topic sentence and three supporting details in 4 of 5 weekly samples.", "Jamal will understand the structure of a well-organized paragraph, as judged by his teacher's observation.", "Given daily writing prompts and teacher support, Jamal will try his best to complete well-organized five-sentence paragraphs with 80 percent accuracy."],
       c:1, r:"The correct goal contains all three required components: a condition (given a topic and a graphic organizer), an observable behavior (write a paragraph with a topic sentence and three supporting details), and a criterion (4 of 5 weekly samples). The strongest distractor pairs a condition and an apparent criterion with a non-observable behavior; 'try his best' cannot be measured, and '80 percent accuracy' attached to it is meaningless. 'Improve' and 'understand' similarly fail the observability test and lack usable mastery criteria."},
      {s:"C3", d:"The IEP Process & Components",
       q:"A New York CSE is preparing the annual review for a student who is currently 14 and will turn 15 during the school year covered by the new IEP. With respect to transition, the committee must:",
       a:["defer transition planning until the IEP in effect when the student turns 16, consistent with the federal minimum.", "include transition services only if the student does not intend to pursue a Regents diploma.", "include measurable postsecondary goals based on age-appropriate transition assessments in the new IEP.", "ask the parent to decide whether transition planning should begin this year or be postponed."],
       c:2, r:"Under 8 NYCRR 200.4(d)(2)(ix), transition planning in New York begins with the first IEP in effect when the student turns 15, one year earlier than the federal IDEA minimum of 16, which makes the deferral option the strongest trap. The IEP must include measurable postsecondary goals grounded in age-appropriate transition assessments along with a coordinated set of transition activities. Transition planning applies to all students with IEPs regardless of diploma path, and its start date is set by regulation, not parent preference."},
      {s:"C3", d:"The IEP Process & Components",
       q:"Which of the following testing changes is an accommodation rather than a modification?",
       a:["Permitting a student with dysgraphia to dictate responses to a scribe on a science content test.", "Reducing a 25-item mathematics assessment so the student completes only the 10 easiest computation problems.", "Grading a student's essay on effort and improvement rather than on the content standards.", "Providing a calculator on a test that is designed to measure computation fluency."],
       c:0, r:"Dictating to a scribe changes how the student demonstrates science knowledge without altering the construct being measured, which is the definition of an accommodation. The calculator option is the strongest distractor because calculators are often legitimate accommodations, but on a computation-fluency measure the device performs the very skill being tested, changing the construct and making it a modification. Reducing the test to its easiest items and grading on effort likewise change what is expected of the student."},
      {s:"C3", d:"The IEP Process & Components",
       q:"After a CSE develops the IEP for a newly classified third grader, a building administrator suggests placing the student in the school's existing 12:1:1 special class because 'that is the program we run for students with this classification.' The chairperson should explain that:",
       a:["the suggestion is acceptable, because districts may assign students to whichever programs exist in the home building.", "integrated co-teaching is the least restrictive environment for every student and must always be attempted before any special class.", "the placement should be selected first so that the annual goals can be rewritten to fit that program.", "placement must be individualized, based on the completed IEP, after considering supports in less restrictive settings."],
       c:3, r:"Placement is determined after the IEP is developed, must be based on the individual IEP, and requires consideration of whether supplementary aids and services would permit success in less restrictive settings (34 CFR 300.114-300.116; 8 NYCRR 200.6). Assigning students by classification or by whatever program a building operates is a documented compliance violation. The ICT option errs in the opposite direction: LRE is individualized, so no single setting on the continuum is the LRE for every student."},
    ],
  },
  "Eligibility, Reevaluation & Procedural Safeguards": {
    icon: "⚖️",
    concepts: [
      { title: "Nondiscriminatory Evaluation Requirements", body: "Assessments must be provided and administered in the student's native language or other mode of communication, in the form most likely to yield accurate information, unless clearly not feasible; they must be technically sound, validated for the specific purpose used, and administered by trained personnel according to producer instructions (34 CFR 300.304). The student must be assessed in all areas related to the suspected disability, and the evaluation must be sufficiently comprehensive to identify all special education and related service needs. An evaluation may never be postponed until a multilingual learner develops English proficiency." },
      { title: "Two-Prong Eligibility & Exclusionary Factors", body: "Eligibility requires both that the student meets the criteria for a disability classification and that the disability adversely affects educational performance such that the student needs special education; a medical or clinical diagnosis alone never equals eligibility. A student may not be identified if the determinant factor is lack of appropriate instruction in reading or math or limited English proficiency (34 CFR 300.306(b)). The determination is made by the committee, with the parent as a member, drawing on a variety of sources rather than any single test score." },
      { title: "NY's 13 Classifications", body: "8 NYCRR 200.1(zz) recognizes 13 classifications: autism, deafness, deaf-blindness, emotional disability, hearing impairment, intellectual disability, learning disability, multiple disabilities, orthopedic impairment, other health impairment, speech or language impairment, traumatic brain injury, and visual impairment including blindness. New York does not use a developmental delay classification at any age; eligible children ages 3-5 are classified 'preschool student with a disability' by the CPSE. Watch the terminology: New York uses 'emotional disability,' while the federal IDEA regulations still use the older term 'emotional disturbance.'" },
      { title: "SLD Determination & RtI in New York", body: "For students in grades K-4 with a suspected learning disability in reading, New York prohibits sole reliance on a severe discrepancy between intellectual ability and achievement; data from a response to intervention process must be a component of the determination (8 NYCRR 200.4(j)). The committee must also document an observation of the student in the learning environment and rule out the exclusionary factors. RtI data inform the determination, but a parent may still refer for an individual evaluation at any point during the intervention process." },
      { title: "Consent: Evaluation, Services & Reevaluation", body: "Informed written consent is required for the initial evaluation and, separately, for the initial provision of special education services; consent for one is never consent for the other. If a parent refuses the initial provision of services, the district may not use mediation or due process to override the refusal and is not considered in violation of FAPE (34 CFR 300.300(b)). For reevaluations only, the district may proceed without consent if it documents reasonable efforts to obtain it and the parent fails to respond; an affirmative parental refusal of reevaluation may instead be challenged through the consent-override procedures." },
      { title: "Reevaluation & Declassification", body: "Reevaluation must occur at least once every three years unless the parent and district agree it is unnecessary, and no more than once a year unless they agree otherwise (34 CFR 300.303; 8 NYCRR 200.4(b)(4)). It begins with a review of existing evaluation data, after which the team may conclude that no additional testing is needed. A reevaluation is required before determining that a student is no longer eligible, except when eligibility ends through graduation with a regular diploma or aging out, and New York requires consideration of declassification support services for exiting students." },
      { title: "Procedural Safeguards: PWN, IEE & Dispute Resolution", body: "Prior written notice is required whenever the district proposes or refuses to initiate or change the identification, evaluation, or placement of the student or the provision of FAPE; it must describe the action, the data relied upon, and the other options considered (34 CFR 300.503). The procedural safeguards notice is provided at least annually plus upon initial referral or parental request for evaluation, the first complaint in a year, a disciplinary change of placement, or parent request. A parent who disagrees with a district evaluation may obtain one independent educational evaluation at public expense, and the district must without unnecessary delay either fund it or file for an impartial hearing to defend its evaluation; dispute options also include voluntary mediation, State complaints, and due process hearings with pendency ('stay-put') protections." },
    ],
    practice: [
      {s:"C3", d:"Eligibility, Reevaluation & Procedural Safeguards",
       q:"A parent disagrees with the district's psychoeducational evaluation and requests an independent educational evaluation at public expense. The district believes its evaluation was appropriate. The district must:",
       a:["deny the request, because the evaluation was conducted by appropriately certified school personnel.", "require the parent to first submit a written explanation of the disagreement before acting on the request.", "either fund the IEE or file for an impartial hearing, without unnecessary delay, to defend its evaluation.", "agree to reimburse the parent only if the independent results contradict the district's findings."],
       c:2, r:"Under 34 CFR 300.502, when a parent requests an IEE at public expense the district must, without unnecessary delay, either ensure the IEE is provided at public expense or file a due process complaint to demonstrate that its own evaluation was appropriate. The district may ask why the parent objects, but it may not require an explanation or delay action until one is provided, which is why that option is the strongest trap. Staff certification does not defeat the IEE right, and payment can never be conditioned on the IEE's outcome."},
      {s:"C3", d:"Eligibility, Reevaluation & Procedural Safeguards",
       q:"A second grader is referred for an initial evaluation for a suspected learning disability in reading. Under 8 NYCRR Part 200, when the CSE makes the SLD determination, it must:",
       a:["use data from a response to intervention process and not rely solely on a severe discrepancy between ability and achievement.", "document a severe discrepancy of at least 1.5 standard deviations between the student's intellectual ability and reading achievement.", "obtain a physician's statement ruling out medical explanations before considering any of the reading data.", "confirm the disability with a full cognitive processing battery before reviewing any intervention data."],
       c:0, r:"Since 2012, New York regulation (8 NYCRR 200.4(j)) has prohibited districts from relying solely on a severe discrepancy between intellectual ability and achievement when determining a learning disability in reading for students in grades K-4; data from a response to intervention process must be part of the determination. The 1.5-SD discrepancy option describes the outdated model the regulation displaced, making it the strongest distractor. Neither a physician's statement nor a cognitive processing battery is a required element of SLD determination."},
      {s:"C3", d:"Eligibility, Reevaluation & Procedural Safeguards",
       q:"A seventh grader classified with a speech or language impairment has met all of his IEP goals, and the CSE believes he no longer needs special education. Before declassifying the student, the committee must:",
       a:["obtain the building principal's written agreement that the services can be discontinued.", "wait until the student's next regularly scheduled three-year reevaluation comes due.", "readminister every assessment instrument that was used in the student's initial evaluation.", "conduct a reevaluation, which may begin with a structured review of existing evaluation data."],
       c:3, r:"A district must conduct a reevaluation before determining that a student no longer has a disability requiring special education (34 CFR 300.305(e)); the only exceptions are graduation with a regular diploma and aging out. That reevaluation may begin with a review of existing evaluation data, and the group may determine that no additional testing is needed, so repeating every original instrument is not required. Waiting for the three-year mark would needlessly continue services the data no longer support."},
      {s:"C3", d:"Eligibility, Reevaluation & Procedural Safeguards",
       q:"A CSE finds a kindergartner eligible as a student with an emotional disability, but the parent refuses to consent to the initial provision of special education services. The district:",
       a:["must initiate an impartial due process hearing to ensure that the student receives FAPE.", "may not provide the services and may not use mediation or due process to override the refusal.", "may begin the services after documenting reasonable efforts to obtain the parent's consent.", "may rely on the parent's earlier consent to the initial evaluation as consent for the services."],
       c:1, r:"Consent for an initial evaluation does not constitute consent for services, and when a parent refuses the initial provision of special education, 34 CFR 300.300(b) bars the district from using mediation or due process to override the refusal; the district is then not considered in violation of FAPE. The 'reasonable efforts' pathway is the strongest distractor because it is real law, but it applies only to reevaluations when a parent fails to respond, not when a parent affirmatively refuses initial services."},
    ],
  },
  "Classroom & Behavior Management": {
    icon: "🧭",
    concepts: [
      { title: "Designing the Physical Environment", body: "Room arrangement is an antecedent intervention: clear traffic paths, separated high-demand areas, defined activity zones, and seating that gives the teacher visual access to every student prevent problem behavior before it occurs. Density and congestion are reliable triggers for pushing, grabbing, and conflict, so distribute materials across stations and stagger access rather than funneling students to one location. Proximity control, teaching while circulating through the room, suppresses minor misbehavior without interrupting instruction." },
      { title: "Routines, Procedures, and Transitions", body: "Routines are taught like academic content: state the steps, model them, have students rehearse, and reinforce correct performance, with booster re-teaching after breaks. Predictable schedules and signaled transitions (timers, previews, visual schedules) reduce escape-maintained and anxiety-related behavior, especially for students with autism. Poorly managed transitions are among the largest sources of lost instructional time, and consequence systems imposed before routines have been taught punish a skill deficit rather than fix it." },
      { title: "Explicit Behavioral Expectations", body: "Effective classroom rules are few (three to five), positively stated, observable, taught with examples and non-examples, posted, and tied to consistent reinforcement. Behavior-specific praise that names the behavior ('You started your warm-up right away') outperforms general praise, and research supports a high ratio of positive to corrective interactions, on the order of 4:1 to 5:1. Expectations must be actively taught, practiced, and re-taught across the year, not merely announced in September." },
      { title: "PBIS Multi-Tiered Framework", body: "Tier 1 universal supports (taught schoolwide expectations, acknowledgment systems, consistent consequences) are designed to meet the needs of roughly 80% of students. Tier 2 provides efficient, standardized, targeted interventions, such as Check-In/Check-Out and social skills groups, for the 10-15% who need more; Tier 3 delivers intensive, individualized, FBA-based support for the few who do not respond to Tier 2. Movement between tiers is driven by data such as office discipline referrals and progress monitoring, and Tier 1 fidelity must be verified before attributing nonresponse to the student." },
      { title: "Group Contingencies", body: "In an independent group contingency the same criterion applies to everyone but each student earns individually; in a dependent contingency the group's reward hinges on the behavior of one student or a small subset (the 'hero procedure'), which risks peer pressure and scapegoating; in an interdependent contingency the whole group must meet the criterion for anyone to earn, the structure of the Good Behavior Game. Interdependent contingencies harness peer influence efficiently but require safeguards for students who cannot yet meet the criterion, such as individualized goals or randomized criteria." },
      { title: "Reinforcement Schedules and Thinning", body: "Use continuous reinforcement (every response) during acquisition, then thin to intermittent schedules for maintenance. Ratio schedules reinforce based on response count and yield higher rates than interval schedules; variable-ratio schedules produce high, steady responding with the greatest resistance to extinction, while fixed-interval schedules produce the post-reinforcement pause and scallop pattern. Thin gradually: abrupt thinning produces ratio strain, a deterioration in responding when the schedule demands too much too soon." },
      { title: "Antecedent-Based Strategies", body: "Antecedent strategies prevent behavior by altering triggers and motivating operations rather than reacting after the fact: precorrection (prompting expected behavior just before predictable problem contexts), high-probability request sequences (behavioral momentum), the Premack principle (access to a preferred activity contingent on completing a less preferred one, 'first-then'), choice-making, task interspersal and modification, and noncontingent reinforcement delivered on a time-based schedule. Distinguish Premack, a contingent first-then arrangement, from the high-p sequence, in which easy requests are delivered immediately before the hard one with nothing offered contingently." },
    ],
    practice: [
      {s:"C4", d:"Classroom & Behavior Management",
       q:"A fifth-grade special class teacher loses nearly ten minutes of instruction at each transition as students wander, chat, and argue over materials. Which initial step is most likely to reduce the lost time?",
       a:["Establish a response-cost system that deducts points from any student who is slow to finish transitioning", "Directly teach the transition routine, model it, have students rehearse it, and reinforce correct performance", "Reduce the total number of daily transitions by combining shorter activities into longer instructional blocks", "Assign trained peer buddies so quick transitioners can prompt and escort classmates who lag behind"],
       c:1, r:"Routines and procedures must be taught explicitly like academic content, with modeling, rehearsal, and reinforcement, before any consequence system is layered on (Simonsen et al., 2008). Response cost (A) is the strongest distractor because point systems feel proactive, but it punishes students for a routine they have never been systematically taught; reducing transitions (C) avoids rather than solves the skill deficit."},
      {s:"C4", d:"Classroom & Behavior Management",
       q:"A teacher divides her inclusive seventh-grade class into three teams and announces that any team whose members combined have fewer than four callouts during the period earns five minutes of preferred activity time. This arrangement is best described as",
       a:["a dependent group contingency", "an independent group contingency", "an individually applied DRL schedule", "an interdependent group contingency"],
       c:3, r:"Because every team member's behavior counts toward whether the team meets the criterion and the consequence is shared by the group, this is an interdependent group contingency, the structure of the Good Behavior Game (Barrish et al., 1969). A dependent contingency (A) is the strongest distractor, but it bases the group's reward on the behavior of one or a few selected students, not on all members; the fewer-than-four criterion resembles a DRL, yet the contingency is group-based rather than individual (C)."},
      {s:"C4", d:"Classroom & Behavior Management",
       q:"A middle school student with an emotional disability now raises his hand before speaking nearly every time when he is praised for each instance. The teacher wants to thin reinforcement while keeping the behavior at a high, steady rate that resists extinction. Toward which schedule should the teacher move?",
       a:["Variable ratio", "Fixed interval", "Fixed ratio", "Variable interval"],
       c:0, r:"Variable-ratio schedules produce high, steady response rates and the greatest resistance to extinction because reinforcement is unpredictable and tied directly to responding (Cooper et al., 2020). Variable interval (D) is the strongest distractor since it also resists extinction, but it generates lower, moderate rates because reinforcement depends on time elapsing rather than response count; fixed-interval schedules produce post-reinforcement pauses and the scallop pattern."},
      {s:"C4", d:"Classroom & Behavior Management",
       q:"A midyear data review at a school implementing schoolwide PBIS with verified Tier 1 fidelity shows that a small group of students continues to accumulate two to five office discipline referrals each. Consistent with the PBIS framework, the team's most appropriate next step for these students is to",
       a:["initiate FBAs and develop individualized behavior intervention plans for each student", "reteach the universal behavioral expectations to the entire student body", "enroll the students in a targeted Tier 2 support such as Check-In/Check-Out", "refer the students to the CSE to determine eligibility for special education"],
       c:2, r:"Students who do not respond to well-implemented universal supports move to Tier 2: efficient, standardized, group-delivered interventions such as Check-In/Check-Out designed for the roughly 10-15% who need more than Tier 1. Option A is the strongest distractor, but FBA-based individualized plans are Tier 3 supports reserved for students who do not respond to Tier 2; jumping straight to the most intensive level ignores the framework's data-based, least-intensive-first logic, and B is unwarranted because Tier 1 fidelity was already verified."},
    ],
  },
  "FBA, BIP & Behavioral Interventions": {
    icon: "🧩",
    concepts: [
      { title: "FBA: Purpose, NY Requirements, and Data Sources", body: "Under 8 NYCRR 200.1(r) and 200.22(a), an FBA identifies why a student engages in behavior that impedes learning and must include a baseline of the behavior's frequency, duration, intensity, and/or latency across settings, the contextual factors contributing to the behavior, and a hypothesis about its function. The CSE must consider behavioral supports whenever behavior impedes the student's learning or that of others, and an FBA is required after a manifestation determination finds the conduct related to the disability. Data should converge from three source types: indirect (interviews, rating scales such as the FAST or QABF), descriptive (ABC recording, scatterplots) documenting natural antecedent-behavior-consequence sequences, and experimental functional analysis, the only method that demonstrates rather than infers a functional relation by systematically manipulating conditions. An FBA built on a single interview or a records review alone does not meet the standard." },
      { title: "Functions of Behavior and Hypothesis Statements", body: "Behavioral functions fall into broad classes: social positive reinforcement (attention, access to tangibles or activities), social negative reinforcement (escape or avoidance of demands, settings, or people), and automatic reinforcement (the behavior itself produces the consequence, so it occurs even when the student is alone). A usable hypothesis statement names the antecedent context, the operationally defined behavior, and the maintaining consequence: 'When given multi-step independent tasks, Devon tears materials, and the task is removed (escape).' Interventions are selected by function, not topography; two students with identical-looking behavior may need opposite plans." },
      { title: "BIP Design: Function-Matched Intervention", body: "Under 8 NYCRR 200.22(b), a BIP must identify the baseline measure of the problem behavior, intervention strategies that alter antecedent events and teach alternative and adaptive behaviors, and a schedule for measuring effectiveness, with progress reported to the parent and the CSE. A complete plan includes prevention (antecedent modifications), teaching (replacement behaviors), and response strategies (reinforce the alternative, withhold the maintaining reinforcer for the problem behavior), plus a safety component when needed. Interventions must match the function: escape-maintained behavior calls for break requests, task modification, and instructional support, while attention-maintained behavior calls for noncontingent attention plus differential reinforcement of an appropriate attention-recruiting alternative." },
      { title: "Replacement Behaviors and Functional Communication Training", body: "A replacement behavior must be functionally equivalent, producing the same reinforcer as the problem behavior, and more efficient: lower effort, shorter delay to reinforcement, and a richer schedule, or the problem behavior remains the better deal. Functional communication training (FCT) teaches a communicative response (break card, help request, attention bid) and is among the most robustly supported behavioral interventions in the literature (Carr & Durand, 1985). Differential reinforcement variants include DRA (reinforce an alternative behavior), DRI (reinforce an incompatible behavior), DRO (reinforce omission of the behavior for an interval), and DRL (reinforce lower rates of a behavior tolerable at low frequency)." },
      { title: "De-escalation and the Acting-Out Cycle", body: "The acting-out cycle moves through calm, trigger, agitation, acceleration, peak, de-escalation, and recovery, and the adult response must match the phase: teach skills and build relationships during calm, remove or soften triggers, and during agitation use a calm voice, increased space, reduced demands, and structured choice. During acceleration, avoid arguing, power struggles, and an audience; at peak, the only goal is safety. Replacement behaviors are taught in the calm phase because agitated students cannot acquire new skills, and the recovery phase calls for supported re-entry and debriefing rather than immediate consequence delivery." },
      { title: "NY Regulations: Time-Out, Restraint, and Aversives", body: "Under 8 NYCRR 200.22, a time-out room must be used in conjunction with a BIP (except in unanticipated emergencies) under a written policy of which parents are informed; staff must be able to continuously see and hear the student, the room cannot be locked or blocked, and every use must be documented. Emergency physical interventions are permitted only when behavior poses an immediate danger of serious physical harm, may never serve as a punishment or as a substitute for systematic behavioral programming, and must be documented with parent notification; 2023 amendments to 8 NYCRR 19.5 and 200.22 also prohibit prone restraint and seclusion and require same-day parent notification. Aversive interventions to reduce or eliminate behavior are prohibited in New York schools." },
      { title: "Behavior Data Collection and Graphing", body: "Choose the measurement system by the behavior's dimensions and the observer's capacity: frequency/rate for discrete behaviors with clear onset and offset, duration and latency for time-based dimensions, partial-interval recording for high-rate or brief behaviors (it overestimates actual occurrence), whole-interval for behaviors expected to be continuous (it underestimates), and momentary time sampling when continuous observation is impossible. Progress is displayed on line graphs with phase-change lines separating baseline from intervention, and decisions rest on visual analysis of level, trend, and variability within and across phases. Collect a stable baseline before intervening; an already-improving baseline trend undermines any claim that the BIP caused the change." },
    ],
    practice: [
      {s:"C4", d:"FBA, BIP & Behavioral Interventions",
       q:"ABC data collected over ten days show that sixth grader Devon's desk-clearing outbursts occur almost exclusively when multi-step independent writing tasks are assigned, and that staff respond by sending him to the hallway to 'cool down,' after which the task is rarely completed. Which hypothesis statement best fits these data?",
       a:["When given multi-step writing tasks, Devon clears his desk to obtain one-to-one adult attention in the hallway", "When given multi-step writing tasks, Devon clears his desk to gain access to preferred hallway activities", "When given multi-step writing tasks, Devon clears his desk because the behavior provides automatic sensory input", "When given multi-step writing tasks, Devon clears his desk to escape the task, which removal reliably ends"],
       c:3, r:"The behavior reliably follows difficult task demands and is consistently followed by removal that terminates the task, the signature pattern of escape behavior maintained by negative reinforcement. Attention (A) is the strongest distractor because an adult accompanies the removal, but the data show the critical consequence is task termination, since the work is rarely completed afterward; the hallway functions as escape, not as an attention source."},
      {s:"C4", d:"FBA, BIP & Behavioral Interventions",
       q:"An FBA confirms that a third grader's screaming during math is maintained by escape from the task. When designing the teaching component of the BIP, which replacement behavior is the best initial choice?",
       a:["Raising her hand to request teacher praise after completing each row of problems", "Handing the teacher a break card to request a short pause from the task", "Completing the entire math page quietly to earn a sticker on the class chart", "Using a deep-breathing routine in the calm-down corner when she feels frustrated"],
       c:1, r:"A replacement behavior must produce the same consequence as the problem behavior, here escape, and be more efficient than screaming; a break card delivers brief escape immediately and with less effort, the core of functional communication training (Carr & Durand, 1985). Deep breathing (D) is the strongest distractor because it is a common, well-intentioned choice, but it is function-blind: it may reduce arousal yet gives the student no equivalent way to access escape, so screaming remains the most efficient route out of the task."},
      {s:"C4", d:"FBA, BIP & Behavioral Interventions",
       q:"A BOCES program serving students with significant behavioral needs uses a time-out room as part of several students' behavior intervention plans. Under 8 NYCRR 200.22, the program must",
       a:["obtain written parental consent before each individual placement in the room", "limit any single placement to a regulatory maximum of fifteen minutes", "ensure staff can continuously see and hear the student and that the room cannot lock", "document a placement only when the student is injured or property is damaged"],
       c:2, r:"New York's regulation requires continuous monitoring, meaning staff must be able to see and hear the student at all times, and prohibits any locking mechanism on a time-out room; use must occur in conjunction with a BIP under a written policy of which parents are informed. Per-use consent (A) is the strongest distractor, but the regulation requires informing parents of the policy and allowing them to view the room, not consent before each placement; no fixed minute cap exists in regulation (B), and every use must be documented, not only those involving injury (D)."},
      {s:"C4", d:"FBA, BIP & Behavioral Interventions",
       q:"While delivering small-group instruction across the room, a special education teacher must personally collect data on a student's on-task behavior but can only glance up briefly at set times. Which measurement system best fits these constraints?",
       a:["Momentary time sampling", "Partial-interval recording", "Frequency (event) recording", "Duration recording"],
       c:0, r:"Momentary time sampling requires observing only at the instant each interval ends, making it the one listed system compatible with a teacher who cannot watch continuously, and it suits continuous behaviors such as on-task engagement. Partial-interval recording (B) is the strongest distractor, but it requires watching throughout each interval to catch any occurrence, which is impossible while teaching, and it systematically overestimates continuous behavior; event recording (C) is ill-suited because on-task behavior lacks discrete onsets and offsets."},
    ],
  },
  "Evidence-Based Reading & Writing Instruction": {
    icon: "📖",
    concepts: [
      { title: "Explicit, Systematic Instruction", body: "Explicit instruction follows a gradual release model: teacher modeling with think-alouds ('I do'), guided practice with high response rates and immediate corrective feedback ('we do'), and monitored independent practice ('you do'), all supported by cumulative review distributed over time. It is the instructional architecture with the strongest evidence for students with disabilities across reading, writing, and mathematics (Archer & Hughes; IES practice guides). Exam items frequently hinge on spotting the omitted element, most commonly guided practice or cumulative review." },
      { title: "Structured Literacy and the Five Pillars", body: "The National Reading Panel (2000) identified five essential components of reading instruction: phonemic awareness, phonics, fluency, vocabulary, and comprehension. Structured literacy delivers these through instruction that is explicit, systematic, cumulative, and diagnostic, extending to morphology, orthography, and syntax, and it is the consensus approach for students with dyslexia and other word-level reading disabilities. It stands in direct contrast to three-cueing and balanced-literacy approaches that prompt students to identify words from pictures, context, or first letters, which research identifies as training the habits of poor readers." },
      { title: "Phonological vs. Phonemic Awareness", body: "Phonological awareness is the umbrella term for sensitivity to spoken sound units (words, syllables, onset-rime), while phonemic awareness is the most advanced level: blending, segmenting, and manipulating individual phonemes. Segmenting and blending are the phonemic skills most predictive of decoding success, and instruction is more effective when phonemes are paired with letters than when kept purely oral (NRP, 2000). The developmental progression runs from larger units (rhyme, syllable) to smaller units (phonemes), so instruction should target the level just beyond the student's current mastery." },
      { title: "Decoding and Fluency Development", body: "Fluency comprises accuracy, rate, and prosody, and it is the bridge between decoding and comprehension: slow, effortful reading consumes the working memory needed for meaning. Repeated reading of instructional-level text with a model and corrective feedback is the core evidence-based fluency intervention; unstructured silent independent reading has not been shown to improve outcomes for struggling readers. Oral reading fluency (words correct per minute) is the standard curriculum-based measure for screening and progress monitoring in the elementary grades." },
      { title: "Vocabulary and Morphology", body: "Beck, McKeown, and Kucan's three-tier framework directs explicit instruction toward Tier 2 words, the high-utility academic vocabulary (e.g., 'analyze,' 'reluctant') that appears across many texts, rather than everyday Tier 1 words or narrow Tier 3 terms best taught briefly at point of need. Effective vocabulary instruction pairs student-friendly definitions with multiple exposures in varied contexts and active student use. For adolescents, morphemic analysis (prefixes, roots, suffixes) is a generative word-attack and vocabulary strategy that transfers across the multisyllabic words of the content areas." },
      { title: "Comprehension Strategy Instruction", body: "Students with disabilities benefit from explicit instruction in a small set of strategies: main idea and summarization, self-questioning, text-structure analysis (compare-contrast, cause-effect, problem-solution), and graphic organizers matched to the structure. Reciprocal teaching (Palincsar & Brown) is a signature evidence-based practice in which students rotate through predicting, questioning, clarifying, and summarizing in structured dialogue. Strategies must be taught through modeling and guided practice and gradually released to students, not merely assigned." },
      { title: "Evidence-Based Writing: SRSD", body: "Self-Regulated Strategy Development is the most strongly supported writing intervention for students with disabilities (Graham & Harris), pairing genre-specific strategies such as POW+TREE for persuasive writing with explicit self-regulation training: goal setting, self-monitoring, self-instructions, and self-reinforcement. Its six criterion-based stages (develop background knowledge, discuss it, model it, memorize it, support it, independent performance) require collaboratively scaffolded practice with faded supports before independence. The self-regulation components are what distinguish SRSD from ordinary strategy teaching and account for maintenance and generalization of gains." },
    ],
    practice: [
      {s:"C5", d:"Evidence-Based Reading & Writing Instruction",
       q:"A second-grade student with a learning disability decodes single words accurately on assessments but reads connected text slowly and laboriously, and her comprehension suffers as a result. Which instructional approach most directly addresses this profile?",
       a:["Reteaching phonemic awareness using oral blending and segmenting drills", "Scheduling additional daily silent independent reading with self-selected books", "Implementing repeated readings of instructional-level passages with modeling and feedback", "Providing comprehension strategy instruction during teacher read-alouds of grade-level text"],
       c:2, r:"Repeated reading with a model and corrective feedback is the most strongly supported fluency intervention, and this student's accurate decoding paired with slow, effortful text reading marks a fluency bottleneck that is constraining comprehension (National Reading Panel, 2000). Comprehension strategy instruction during read-alouds bypasses rather than remediates the fluency deficit, and unstructured silent reading lacks evidence for struggling readers."},
      {s:"C5", d:"Evidence-Based Reading & Writing Instruction",
       q:"A fifth-grade teacher using Self-Regulated Strategy Development (SRSD) for persuasive writing has activated background knowledge, discussed the POW+TREE strategy, modeled it with think-alouds, and confirmed that students have memorized the mnemonic. According to the SRSD framework, what should occur next?",
       a:["Independent performance, with students composing essays without teacher input so fluency develops", "A return to discussion of the strategy so students can explain each step in their own words", "Formal assessment of essay quality to establish a benchmark for student goal setting", "Collaborative practice in which students write with scaffolds that are gradually faded"],
       c:3, r:"SRSD's fifth stage, 'Support It,' provides collaboratively scaffolded practice with teacher support, peer collaboration, and self-regulation tools that are systematically faded before students reach the final stage of independent performance (Graham & Harris). Jumping directly to independent writing is the most common implementation error; SRSD is criterion-based, and students move to independence only after supported practice demonstrates mastery."},
      {s:"C5", d:"Evidence-Based Reading & Writing Instruction",
       q:"A kindergarten screening shows that a student can produce rhymes, clap syllables, and blend onset-rime units, but cannot segment spoken words into individual sounds. Which instructional target should the teacher prioritize?",
       a:["Additional onset-rime blending with picture supports until responses become automatic", "Phoneme segmentation and blending practice, paired with letters as sounds are mapped", "Letter-name fluency drills, since alphabet knowledge must precede phoneme-level work", "Syllable deletion tasks to consolidate sensitivity to larger units before smaller ones"],
       c:1, r:"The student has mastered the larger phonological units, so instruction should advance to the phoneme level: segmenting and blending are the skills most predictive of decoding, and the National Reading Panel found phonemic awareness instruction is more effective when paired with letters. Continuing onset-rime work delays the phoneme-level instruction the data show the student is ready for, and letter-name knowledge is not a prerequisite for beginning phoneme-level work."},
      {s:"C5", d:"Evidence-Based Reading & Writing Instruction",
       q:"A seventh-grade student with a reading disability decodes single-syllable words adequately but breaks down on multisyllabic content-area terms such as 'photosynthesis' and 'constitutional.' Which approach best fits this student's needs?",
       a:["Explicit instruction in morphemic analysis and flexible syllable division strategies", "A return to phonemic awareness training using oral manipulation of single sounds", "Wide independent reading so the student encounters academic words more frequently", "Pre-teaching each content-area term as a memorized whole-word unit before lessons"],
       c:0, r:"For adolescents, explicit instruction in morphology (prefixes, roots, suffixes) and syllable-based word attack transfers across the thousands of multisyllabic academic words they encounter, and it is a core component of structured literacy for older readers. Whole-word pre-teaching helps only with the specific words taught and builds no generative word-attack skill; oral phonemic awareness drills target a skill this student has already developed."},
    ],
  },
  "Evidence-Based Math Instruction & Content Access": {
    icon: "🧮",
    concepts: [
      { title: "The CRA Sequence", body: "The concrete-representational-abstract sequence moves from manipulatives, to drawings and other pictorial models, to numerals and symbols, with each stage explicitly linked to the next so symbolic procedures stay grounded in meaning. CRA is a form of explicit instruction, not discovery learning, and it carries strong evidence for computation, place value, fractions, and algebra readiness in students with mathematics disabilities. The classic exam scenario is a student who succeeds with manipulatives but fails symbol-only work; the correct move is the representational bridge with explicit links to the algorithm, not extended concrete practice or a leap to abstraction." },
      { title: "Schema-Based Instruction", body: "Schema-based instruction teaches students to classify word problems by underlying structure, including additive types (change, group/combine, compare) and multiplicative types (equal groups, multiplicative comparison, proportion), and to map known and unknown quantities onto a schematic diagram before choosing an operation. It consistently outperforms the keyword strategy, which research identifies as error-inducing because words like 'fewer' or 'in all' do not reliably signal the correct operation (Jitendra; Powell & Fuchs)." },
      { title: "Explicit Instruction and Student Verbalization", body: "The IES practice guide on assisting students struggling with mathematics gives its strongest evidence rating to explicit, systematic instruction: teacher modeling with think-alouds, guided practice with immediate corrective feedback, and frequent cumulative review (Gersten et al., 2009). A distinctive recommendation is having students verbalize their own reasoning while solving, which builds self-monitoring and surfaces misconceptions for correction. Modeling followed immediately by independent seatwork omits guided practice and lets students rehearse errors." },
      { title: "Fact Fluency Interventions", body: "Fluent fact retrieval frees working memory for multi-step problem solving, so fluency deficits cascade into procedural failure. Evidence-based interventions use brief, distributed daily practice on small sets of unknown facts interspersed with known facts (incremental rehearsal), delivered with immediate feedback; cover-copy-compare and taped problems are common formats. Full-length timed tests measure fluency but do not build it, and untimed conceptual work alone does not produce automatic retrieval." },
      { title: "Visual Representations and the Number Line", body: "The IES fractions practice guide centers instruction on magnitude understanding using number lines, which represent fractions as numbers with positions and sizes rather than as pairs of whole numbers (Siegler et al., 2010). Whole-number bias, such as judging 1/8 greater than 1/3 because 8 exceeds 3, is the hallmark misconception, and number-line magnitude work is its targeted treatment. Across mathematics, visual representations (strip diagrams, number lines, schematic drawings) carry strong evidence when explicitly connected to symbolic notation." },
      { title: "Access to Grade-Level Math: Supports and the Construct", body: "Whether a mathematics support is an accommodation or a modification depends on the construct being measured: a calculator on a problem-solving measure preserves the construct, while a calculator on a computation-fluency measure changes what is tested. Universal Design for Learning principles, such as multiple representations, varied response options, and engagement choices, can be built into math instruction proactively so fewer individual retrofits are needed. Scaffolds like worked examples, graphic organizers, and task chunking support grade-level expectations rather than replacing them." },
    ],
    practice: [
      {s:"C5", d:"Evidence-Based Math Instruction & Content Access",
       q:"During a unit on two-digit subtraction with regrouping, a student with a mathematics learning disability solves problems accurately with base-ten blocks but fails worksheets containing only numerals. Following the CRA sequence, what should the teacher do next?",
       a:["Teach the student to draw base-ten sketches and explicitly connect each drawing to the written algorithm", "Provide additional sessions with base-ten blocks until the student chooses to work without them", "Assign numeral-only worksheets with fewer problems so symbolic practice feels less frustrating", "Introduce a calculator so the student can bypass the regrouping procedure during independent work"],
       c:0, r:"The representational (semi-concrete) phase, drawings explicitly linked to the symbolic algorithm, is the bridge this student is missing between successful concrete work and abstract failure. Simply extending manipulative use does not teach the transfer to symbols; CRA research emphasizes explicit connections across stages rather than waiting for the student to make the leap independently, and a calculator avoids rather than teaches the target procedure."},
      {s:"C5", d:"Evidence-Based Math Instruction & Content Access",
       q:"A teacher taught students to underline keywords ('in all' means add; 'fewer' means subtract), but students with disabilities now consistently miss compare problems such as 'Maria has 8 stickers, which is 3 fewer than Jen has. How many stickers does Jen have?' What is the most appropriate instructional response?",
       a:["Expand the keyword chart to include additional terms and exceptions students can reference", "Teach students to identify additive problem types and map the quantities onto schema diagrams", "Restrict practice to one-step problems whose keywords reliably signal the correct operation", "Read each problem aloud to students so decoding demands do not interfere with solving"],
       c:1, r:"Schema-based instruction teaches students to recognize the underlying structure of problem types (change, group, compare) and to represent the relationships in a diagram before selecting an operation; it has strong experimental support for students with disabilities (Jitendra; Fuchs). The keyword strategy fails precisely because words like 'fewer' do not map reliably to operations, so expanding the chart deepens reliance on a flawed strategy rather than correcting it."},
      {s:"C5", d:"Evidence-Based Math Instruction & Content Access",
       q:"A fourth-grade student with an IEP computes multiplication facts accurately but counts on her fingers for nearly every fact, which slows her multi-digit work considerably. Which intervention is best supported by research on fact fluency?",
       a:["Prohibiting finger counting during practice so the student is pushed toward memory-based retrieval", "Re-teaching the conceptual meaning of multiplication with arrays before any further fact practice", "Administering full-length timed fact tests every day so the student habituates to speeded conditions", "Brief daily practice on small sets of unknown facts mixed with known facts, with immediate feedback"],
       c:3, r:"Effective fluency interventions such as incremental rehearsal and taped problems use brief, distributed practice on a few unknown facts interspersed with many knowns, paired with immediate feedback, which builds retrieval without overwhelming the learner. Daily full-length timed tests measure fluency but do not teach it, and banning finger counting strips away the student's backup strategy without building the retrieval that would replace it."},
      {s:"C5", d:"Evidence-Based Math Instruction & Content Access",
       q:"An IEP team is deciding whether a student with a mathematics learning disability may use a calculator on the state assessment. Which team conclusion reflects the correct use of accommodations?",
       a:["The calculator should be declined because it would give the student an advantage over peers tested without one", "The calculator should be permitted on every portion of the assessment because it is written into the IEP", "The calculator may be used on problem-solving sections but not on items measuring computation fluency itself", "The calculator should be replaced with extended time, since timing supports remain valid on any test section"],
       c:2, r:"An accommodation must preserve the construct being measured: where the test measures mathematical problem solving, a calculator removes a barrier without changing the construct, but on items measuring computation skill itself it changes what is tested and functions as a modification. Accommodations do not confer unfair advantage when the construct is intact, so declining the support on fairness grounds misreads its purpose."},
    ],
  },
  "Specially Designed Instruction, Accommodations & Co-Teaching": {
    icon: "🤝",
    concepts: [
      { title: "Specially Designed Instruction", body: "Specially designed instruction means adapting, as appropriate, the content, methodology, or delivery of instruction to address the unique needs that result from a student's disability and to ensure access to the general curriculum (34 CFR 300.39(b)(3)). SDI is what makes special education 'special': it is individualized to IEP goals, delivered by qualified personnel, and can occur in any setting on the continuum, including the general education classroom. IEP-aligned lesson planning embeds SDI within grade-level standards rather than running a parallel, watered-down curriculum." },
      { title: "Accommodations vs. Modifications", body: "Accommodations change how a student accesses instruction or demonstrates learning across presentation, response, setting, and timing/scheduling, without altering the construct or grade-level expectation; modifications change what is taught or expected. Removing item types, substituting below-grade-level texts, or reducing items in a way that changes the measured construct are modifications, with consequences for score validity and diploma pathways. The litmus test on every item: the support either leaves the measured skill intact (accommodation) or changes the target itself (modification)." },
      { title: "Universal Design for Learning", body: "Universal Design for Learning (CAST) proactively builds flexibility into instruction through multiple means of engagement (the 'why' of learning), representation (the 'what'), and action and expression (the 'how'). Because options are designed for all learners before individual needs are known, UDL reduces but does not eliminate the need for individualized accommodations and specially designed instruction. Exam items typically distinguish UDL (proactive, universal) from differentiation and accommodations (reactive, individualized)." },
      { title: "Task Analysis, Chaining, and Scaffolding", body: "Task analysis breaks a complex skill into an ordered sequence of teachable steps; instruction can proceed through forward chaining, backward chaining, or total-task presentation, with mastery monitored step by step. Scaffolding provides temporary supports such as prompts, models, and partially completed examples that are systematically faded to prevent prompt dependence as competence grows. Both are core tools of specially designed instruction for multi-step academic procedures and functional skills." },
      { title: "Co-Teaching Models", body: "Friend and Cook describe six models: one teach/one observe, one teach/one assist, station teaching (groups rotate among different content), parallel teaching (two heterogeneous halves taught the same content to lower the ratio), alternative teaching (a small group receives reteaching or enrichment), and team teaching (joint whole-class delivery). Overreliance on one teach/one assist is the documented pitfall because it underuses the special educator and undermines parity; effective teams select models purposefully and rotate roles. Alternative teaching requires care so the same students are not repeatedly pulled, which can recreate segregation inside an inclusive class." },
      { title: "New York's Continuum of Services", body: "New York's continuum (8 NYCRR 200.6) runs from less to more restrictive: related services only; consultant teacher services (direct and/or indirect, minimum two hours weekly); resource room (supplemental instruction in groups of no more than five, at least three hours weekly, no more than 50 percent of the school day); integrated co-teaching (no more than 12 students with disabilities in the class); special classes (maximum sizes such as 15:1, 12:1:1, 8:1:1, 6:1:1, and 12:1+(3:1) by intensity of need); and more restrictive nonpublic and residential placements. The CSE must recommend the least restrictive environment in which the IEP can be implemented, decided individually rather than by disability label or program availability." },
      { title: "Assistive Technology", body: "IDEA lists assistive technology among the special factors the IEP team must consider for every student at every IEP meeting (34 CFR 300.324(a)(2)(v)); consideration is not limited to particular disability categories and cannot be skipped, though it does not require a formal evaluation in every case. An AT device is any item that increases, maintains, or improves the functional capabilities of a child with a disability, while an AT service supports selection, acquisition, or use, including training for the student, family, and staff. The SETT framework (Student, Environments, Tasks, Tools) structures AT decision-making, and options span low-tech (pencil grips, visual schedules) to high-tech (speech-to-text, AAC devices)." },
    ],
    practice: [
      {s:"C5", d:"Specially Designed Instruction, Accommodations & Co-Teaching",
       q:"In an integrated co-teaching (ICT) classroom, the general education teacher delivers whole-class instruction every day while the special education teacher circulates and quietly redirects students. Which recommendation would an instructional coach most appropriately offer this team?",
       a:["Maintain the current structure, because it minimizes transitions and preserves a single instructional voice", "Have the special education teacher pull students with IEPs to the back table daily during the lesson", "Assign behavior management to the special education teacher so the content expert can teach uninterrupted", "Rotate in models such as station and parallel teaching so both teachers deliver substantive instruction"],
       c:3, r:"The team is locked into one teach/one assist, the most overused model; co-teaching research (Friend & Cook) warns that it underuses the special educator's expertise and undermines parity. Varying models such as station, parallel, and alternative teaching lowers the student-teacher ratio and lets both teachers deliver specially designed instruction. Pulling students with IEPs to the back table every day creates a segregated routine within the inclusive setting and can stigmatize those students."},
      {s:"C5", d:"Specially Designed Instruction, Accommodations & Co-Teaching",
       q:"Which testing change for a student with a disability is a modification rather than an accommodation?",
       a:["Removing the multistep word problems from a unit test so the student is scored only on computation", "Administering the same unit test in a separate location with frequent breaks and extended time", "Allowing the student to dictate responses to a scribe on a test that measures mathematics reasoning", "Enlarging the print and increasing the white space on the test booklet the rest of the class receives"],
       c:0, r:"Eliminating the multistep items changes what the test measures: the student is no longer assessed on the same construct or grade-level expectation, which is the defining feature of a modification. Setting, timing, response, and presentation changes (separate location, scribe on a math reasoning test, enlarged print) alter how the student accesses or demonstrates learning while leaving the measured construct intact."},
      {s:"C5", d:"Specially Designed Instruction, Accommodations & Co-Teaching",
       q:"A fourth grader with a learning disability is succeeding in the general education class with grade-level curriculum but requires specially designed, small-group reading instruction to close a significant decoding gap. Under New York's continuum of services, which option provides this support in the least restrictive manner?",
       a:["A 12:1:1 special class placement for English language arts and content-area instruction", "Indirect consultant teacher services in which the special educator advises the classroom teacher", "Resource room services in a group of no more than five students for supplemental instruction", "Integrated co-teaching services for the full school day across the academic subject areas"],
       c:2, r:"Resource room under 8 NYCRR 200.6(f) provides supplemental specially designed instruction in groups capped at five, which matches a student who needs targeted small-group remediation while remaining in general education for core instruction. Indirect consultant teacher services support the teacher rather than delivering the direct specialized instruction this student needs, and a special class or full-day ICT exceeds the level of support the data justify."},
      {s:"C5", d:"Specially Designed Instruction, Accommodations & Co-Teaching",
       q:"During an annual review, a CSE member proposes skipping the assistive technology discussion because the student 'has never needed devices.' What is the most accurate response?",
       a:["The proposal is acceptable, because AT consideration applies to students with sensory or physical disabilities", "The team must consider AT for this student, because IDEA requires AT consideration for every student's IEP", "The team may defer the AT discussion until the next reevaluation, when updated assessment data are available", "The team should order an independent AT evaluation before the IEP can be finalized at this meeting"],
       c:1, r:"Consideration of assistive technology is one of the special factors the IEP team must address for every student at every IEP meeting (34 CFR 300.324(a)(2)(v)); it is not limited to particular disability categories or to students with prior device use. Consideration does not require a formal evaluation in every case, since the team may document that AT is not needed, but it cannot be skipped or deferred to a future meeting."},
    ],
  },
  "Communication Skills & AAC": {
    icon: "🗣️",
    concepts: [
      { title: "Form, Content, and Use: Components of Language", body: "Bloom and Lahey's model divides language into form (phonology, morphology, syntax), content (semantics), and use (pragmatics). A student can show a deficit in any component independently: articulation errors are form, restricted vocabulary is content, and poor turn-taking or literal interpretation of idioms is use. Pragmatic (use) deficits despite intact form and content are a hallmark profile in autism spectrum disorder and in social (pragmatic) communication disorder under DSM-5-TR." },
      { title: "Receptive vs. Expressive Language", body: "Receptive language is comprehension (following directions, identifying named pictures); expressive language is production (speaking, signing, writing, or selecting AAC symbols). Profiles drive planning: a student with intact receptive but impaired expressive language needs output supports such as AAC, while receptive deficits call for comprehension supports like simplified directions, visuals, and wait time. Under IDEA and Part 200, language assessment must be conducted in the student's native language to separate disability from language difference." },
      { title: "AAC Categories: Aided/Unaided, Low-/High-Tech", body: "Unaided AAC uses only the communicator's body (manual signs, gestures, vocalizations); aided AAC requires external tools, ranging from low-tech picture boards, PECS books, and eye-gaze frames to high-tech speech-generating devices (SGDs). Most competent AAC users are multimodal, mixing speech attempts, signs, and devices by context. There are no cognitive or age prerequisites for AAC; the 'candidacy model' has been rejected, and the CSE must consider each student's communication needs and assistive technology as special factors (34 CFR 300.324(a)(2))." },
      { title: "Core vs. Fringe Vocabulary", body: "Core vocabulary is the small set of high-frequency, flexible words (go, want, more, stop, not, that) that constitutes roughly 80 percent of everyday speech; fringe vocabulary comprises context-specific words, mostly nouns. Effective AAC systems are organized around core words so the student can generate novel messages across activities, with personally motivating fringe vocabulary added for specific contexts. Noun-only displays of labels and preferred items are a common design error that caps a student at requesting." },
      { title: "AAC Evidence Base and Partner Strategies", body: "Research, including the Millar, Light, and Schlosser (2006) meta-analysis, shows that introducing AAC does not inhibit speech development and is most often associated with gains in spoken language. Aided language stimulation (partner-augmented input), in which adults point to symbols on the student's system while speaking during natural routines, is a core instructional strategy because students need to see their system used before being expected to use it. Devices must be available across all settings, not reserved for therapy sessions." },
      { title: "Functional Communication Training (FCT)", body: "FCT replaces problem behavior with a communication response that serves the same function identified by an FBA, such as a picture exchange or SGD request for access, escape, or attention. To compete with problem behavior, the new response must be more efficient: lower effort, faster reinforcement, and honored on a dense (initially continuous) schedule before any thinning. FCT is among the most robustly supported interventions for severe problem behavior in students with limited communication repertoires." },
      { title: "Collaboration with SLPs and Families", body: "ASHA and IDEA both support integrated rather than siloed service models: the SLP assesses, selects targets, and coaches, while the teacher embeds communication goals into content instruction and daily routines and shares progress data. Families are essential partners for vocabulary selection, cultural and linguistic relevance, and carryover across home and community settings. Communication needs must be considered for every student at every IEP meeting, and for students who are deaf or hard of hearing the IEP must directly address language and communication mode." },
    ],
    practice: [
      {s:"C6", d:"Communication Skills & AAC",
       q:"A fifth-grade student with autism spectrum disorder produces grammatically correct sentences and has an age-appropriate vocabulary, but the student interrupts peers, persists on preferred topics regardless of listener interest, and interprets idioms literally. These difficulties reflect a deficit in which component of language?",
       a:["Content, because the student misunderstands the meanings of common words and phrases", "Use, because the student struggles with the social and contextual rules of communication", "Form, because the student has not mastered the syntactic structures of conversation", "Form, because the student's phonological processing interferes with comprehension"],
       c:1, r:"Pragmatics (use) governs the social application of language: turn-taking, topic maintenance, and nonliteral interpretation. In the Bloom and Lahey model, this profile, intact form and content with impaired use, is characteristic of many students with ASD. Content (semantics) is the strongest distractor, but the stem states vocabulary is age appropriate; literal idiom interpretation here is a contextual, pragmatic error rather than a word-meaning deficit."},
      {s:"C6", d:"Communication Skills & AAC",
       q:"A CSE is recommending a speech-generating device for a kindergartner with autism who is an emerging communicator. When the team programs the device's initial vocabulary, which approach is most consistent with current AAC research?",
       a:["Loading nouns that label the student's favorite foods, toys, and family members", "Limiting symbols to the steps of classroom routines until the student masters them", "Prioritizing high-frequency core words such as 'go,' 'more,' 'want,' and 'stop'", "Delaying vocabulary selection until the student demonstrates symbolic understanding"],
       c:2, r:"Core vocabulary, a small set of high-frequency, flexible words, makes up roughly 80 percent of everyday speech and lets a beginning communicator combine words across activities, supporting generative language rather than rote requesting. A noun-heavy fringe display (option A) is a common but limiting practice because labels work only in narrow contexts. Option D reflects the discredited 'candidacy' model; research and ASHA guidance hold that there are no cognitive prerequisites for AAC."},
      {s:"C6", d:"Communication Skills & AAC",
       q:"A second grader follows multistep classroom directions, points accurately to pictures named by the teacher, and laughs at jokes read aloud, yet communicates almost entirely in one- and two-word utterances. Which description best characterizes this student's language profile?",
       a:["Expressive language delay with relatively intact receptive language", "Receptive language delay with relatively intact expressive language", "Mixed receptive-expressive delay affecting comprehension and production", "Pragmatic language impairment affecting the social use of language"],
       c:0, r:"Following directions, identifying named pictures, and comprehending humor are receptive (comprehension) skills, and all are intact; the limitation appears only in production, indicating an expressive delay. A mixed delay (option C) is the strongest distractor, but the stem provides direct evidence of age-appropriate comprehension, which rules out a receptive component. This receptive-expressive gap is common and shapes both goal selection and AAC decision-making."},
      {s:"C6", d:"Communication Skills & AAC",
       q:"A student with cerebral palsy has just received a high-tech speech-generating device. The classroom paraprofessional asks the special education teacher how to support the student's learning of the new system. Which recommendation reflects best practice?",
       a:["Require the student to attempt a spoken word before granting access to the device", "Reserve the device for the student's scheduled sessions with the speech-language pathologist", "Set the device aside during academic instruction so it does not compete for the student's attention", "Point to symbols on the device while speaking to the student throughout naturally occurring routines"],
       c:3, r:"Aided language stimulation (partner-augmented input) means communication partners model AAC use by touching symbols as they speak, giving the student receptive input in the same modality expected for expression; it is a cornerstone of AAC intervention. Requiring speech first (option A) treats AAC as a last resort and can suppress communication attempts. Restricting the device (options B and C) denies the student access to their voice, contrary to the IDEA requirement that assistive technology be made available whenever the IEP requires it (34 CFR 300.105)."},
    ],
  },
  "Social Skills & Functional Living Skills": {
    icon: "🤝",
    concepts: [
      { title: "Explicit Social Skills Instruction", body: "Placement alongside typical peers does not by itself produce social competence; students with disabilities typically need explicit instruction. Behavioral skills training (instruction, modeling, rehearsal, and feedback) is the prototype teaching sequence, and video modeling, including video self-modeling, is an established evidence-based practice for autism. Target skills should be selected for social validity, behaviors that matter to peers and natural settings, and instruction must include programmed practice opportunities, not discussion alone." },
      { title: "Social Narratives", body: "Social narratives (e.g., Social Stories) are brief, individualized texts that describe a social situation, relevant cues, others' perspectives, and expected responses, written primarily in descriptive rather than directive language and often from the student's viewpoint. They are best used to prepare students for predictable, anxiety-producing, or novel situations such as fire drills, assemblies, or substitutes. Evidence supports them as one component of a package with rehearsal and reinforcement rather than as a stand-alone intervention." },
      { title: "Peer-Mediated Interventions", body: "Peer-mediated intervention (PMI) teaches typically developing peers to initiate, prompt, and reinforce the social behavior of classmates with disabilities during natural activities. Because peers, not adults, become the cues for interaction, PMI counters adult-prompt dependence and builds generalization into the intervention itself. PMI is identified as an evidence-based practice for autism by the National Clearinghouse on Autism Evidence and Practice (NCAEP)." },
      { title: "Self-Determination and Self-Advocacy", body: "Self-determination comprises choice-making, decision-making, goal setting and attainment, self-management, self-awareness, and self-advocacy; higher self-determination predicts better employment and independent-living outcomes (Wehmeyer and colleagues). Student-led IEP participation is a primary vehicle: students learn to describe their disability, explain needed accommodations, and set their own goals. This preparation is critical because postsecondary settings operate under Section 504 and the ADA, where students must self-identify and request accommodations; note that unlike most states, New York has not adopted IDEA's optional transfer of parental rights at age 18 (34 CFR 300.520), so parents retain their IDEA rights while the student remains in school." },
      { title: "Functional Living Skills and Task Analysis", body: "Functional living skills (dressing, food preparation, hygiene, money management, travel) are taught by breaking each skill into a task analysis and teaching steps through chaining: forward chaining teaches the first step first, backward chaining teaches the last step first so the learner immediately contacts the natural terminal reinforcer, and total-task presentation prompts every step on each trial. An ecological inventory, surveying the student's current and future environments, identifies which skills to teach. Prompting must include a fading plan to prevent prompt dependence, with progress monitored against the task-analysis steps." },
      { title: "Community-Based Instruction (CBI)", body: "CBI delivers systematic instruction in the actual community settings where skills will be used (stores, transit, workplaces) because students with significant cognitive disabilities often fail to generalize from classroom simulations to natural environments. Best practice pairs classroom simulation, which permits massed and safe practice, with regular community sessions for generalization probes and criterion performance, with community time increasing as the student approaches school exit. CBI is a best-practice delivery model individualized by the CSE, not a setting mandated by IDEA." },
      { title: "Transition Planning: New York Requirements", body: "New York exceeds the federal floor: under 8 NYCRR 200.4, the IEP must document transition needs and measurable postsecondary goals beginning with the IEP in effect when the student turns 15, whereas federal IDEA requires transition content by age 16 (34 CFR 300.320(b)). Required elements include measurable postsecondary goals in education/training, employment, and, where appropriate, independent living, based on age-appropriate transition assessments, plus a coordinated set of transition activities and a course of study. The student must be invited to any CSE meeting where transition is discussed, and outside agencies likely to provide or pay for services are invited with consent of the parent or adult student." },
    ],
    practice: [
      {s:"C6", d:"Social Skills & Functional Living Skills",
       q:"A second-grade ICT teacher wants to increase the recess social interactions of a student with autism. Adult prompting has produced exchanges, but the student now waits for an adult cue before approaching peers. Which intervention most directly addresses this pattern?",
       a:["Fading to a less intrusive adult prompt, such as a gesture, delivered from a greater distance", "Moving social skills instruction to a structured pull-out group with the school counselor", "Teaching classmates to initiate, prompt, and reinforce interactions during recess activities", "Reinforcing the student for remaining in proximity to peers during recess games"],
       c:2, r:"Peer-mediated intervention transfers the cues for social behavior from adults to peers, directly countering prompt dependence and promoting generalization because peers are present in the natural environment. It is an established evidence-based practice for autism (NCAEP). Prompt fading (option A) is the strongest distractor, but even a faded adult prompt keeps the adult in the stimulus-control loop; the documented problem is that adult cues, not peer behavior, occasion interaction."},
      {s:"C6", d:"Social Skills & Functional Living Skills",
       q:"Under New York's Part 200 regulations, a student's IEP must first address transition needs and include measurable postsecondary goals beginning with the IEP in effect when the student is what age?",
       a:["Age 15, which is earlier than the federal IDEA requirement", "Age 16, which mirrors the federal IDEA requirement", "Age 14, which is earlier than the federal IDEA requirement", "Age 17, one year before the age of majority in New York"],
       c:0, r:"8 NYCRR 200.4 requires transition planning, including measurable postsecondary goals based on age-appropriate transition assessments, beginning with the IEP in effect when the student turns 15 (or younger if determined appropriate). The federal IDEA floor is age 16 (34 CFR 300.320(b)), so option B describes the federal minimum rather than New York's stricter standard; states may exceed but never fall below IDEA requirements."},
      {s:"C6", d:"Social Skills & Functional Living Skills",
       q:"A middle school student with an intellectual disability is learning to prepare a simple snack using a nine-step task analysis. The student gives up quickly when tasks feel difficult, so the teacher wants every instructional trial to end with the student independently completing the final step and immediately accessing the finished snack. Which chaining procedure matches this plan?",
       a:["Forward chaining, teaching the first step to mastery before adding subsequent steps", "Total-task presentation, prompting the student through every step on each trial", "Graduated guidance, providing hand-over-hand support and fading it within steps", "Backward chaining, teaching the last step first while the teacher completes earlier steps"],
       c:3, r:"In backward chaining the teacher performs all but the final step and the learner independently completes the last step, immediately contacting the natural terminal reinforcer, the finished snack, on every trial; this makes it well suited to learners who quit when reinforcement is delayed. Total-task presentation (option B) is the strongest distractor because the whole chain occurs each trial, but the final step is prompted rather than independent, so the plan described in the stem is not met."},
      {s:"C6", d:"Social Skills & Functional Living Skills",
       q:"An eleventh grader with a learning disability will attend a community college program after graduation. Which practice most directly builds the self-advocacy skills the student will need, given that IDEA protections will no longer apply in that setting?",
       a:["Having the school counselor register the student with the college's disability services office", "Teaching the student to explain the disability and request accommodations during a student-led IEP meeting", "Asking the parents to describe the student's strengths and needed supports at the annual review", "Listing the student's accommodations in the transition plan so the college will implement them automatically"],
       c:1, r:"After high school, Section 504 and the ADA require students to self-identify and request accommodations; no one initiates services for them, so teaching the student to disclose the disability and request supports, rehearsed through student-led IEP participation, is the highest-leverage preparation and is linked to better postsecondary outcomes in the self-determination research. Options A, C, and D all have adults performing the advocacy, leaving the skill untaught; option D also misstates the law, because IEP accommodations do not transfer to college."},
    ],
  },
};

const CR_PROMPTS = [
  {
    "id": "cr1",
    "title": "Constructed Response 1: Marcus (Grade 4, Learning Disability)",
    "scenario": "Use the information in the exhibits below to complete the task that follows.\n\nMarcus is a 9-year-old fourth grader classified as a student with a Learning Disability. He receives integrated co-teaching (ICT) services for English language arts and a small-group reading intervention three times per week. His special education teacher assembled the following exhibits in preparation for an upcoming CSE program review.\n\nEXHIBIT 1: TEACHER NARRATIVE\n\nMs. Rivera, Marcus's fourth-grade general education teacher, writes: Marcus is friendly and well liked, and he is one of my stronger math students. When I read stories aloud, he answers even inferential comprehension questions accurately and adds thoughtful details to discussions. His behavior changes the moment a task requires him to read text on his own. During independent reading he sharpens his pencil repeatedly, asks to go to the bathroom or the nurse, or puts his head down; last week he crumpled a worksheet rather than start it. When he does read aloud, he reads word by word in a quiet voice and skips longer words entirely. Some classmates have started finishing his sentences during partner reading, and on Tuesday he refused to join partner reading, saying it was babyish. These episodes happen almost exclusively during the literacy block. In math he works steadily and often helps peers.\n\nEXHIBIT 2: PROGRESS-MONITORING DATA\n\nOral reading fluency (grade 4 passages, words correct per minute): Fall benchmark: 38 WCPM (fall target: 94). Winter benchmark: 44 WCPM (winter target: 112). Weekly probes, January-February: Week 1: 40; Week 2: 42; Week 3: 39; Week 4: 44; Week 5: 41; Week 6: 43. Accuracy across the six probes ranged from 88 to 91 percent.\n\nDecoding inventory (administered in January): single consonants and short vowels: mastered. Consonant digraphs: mastered. Consonant blends: 80 percent correct. Vowel teams (ai, ea, oa, ee): 30 percent correct. R-controlled vowels: 25 percent correct. Two-syllable words: 20 percent correct.\n\nBehavior observation (momentary time sampling, 1-minute intervals, three separate 30-minute observations during the independent literacy block): Marcus on task 35 percent, 42 percent, and 38 percent of intervals; class median was 80 percent. A comparison observation during the math block found Marcus on task 85 percent of intervals.\n\nEXHIBIT 3: WORK SAMPLE DESCRIPTION\n\nThe folder contains a written retell of a story the teacher read aloud and a dictated spelling sample. In the retell, Marcus's ideas are accurate and correctly sequenced, showing solid comprehension of the story, but his spelling is phonetic with consistent vowel errors: 'rane' for rain, 'hering' for hearing, 'becus' for because, 'fownd' for found. In an oral reading sample from his science text, Marcus substituted 'though' for 'through' and 'instant' for 'important,' omitted -ed and -ing word endings, and skipped two multisyllabic words entirely. He self-corrected only 1 of 11 errors.\n\nEXHIBIT 4: IEP EXCERPT\n\nClassification: Learning Disability. Evaluation summary: WISC-V Full Scale IQ 102 (55th percentile, average). WIAT-4 Basic Reading composite: standard score 78 (7th percentile, well below average). WIAT-4 Listening Comprehension: standard score 103 (58th percentile, average). WIAT-4 Math Problem Solving: standard score 105 (63rd percentile, average). Current annual goal: Given a passage at his instructional reading level and systematic decoding instruction, Marcus will read aloud at 90 words correct per minute with at least 95 percent accuracy on 3 consecutive weekly probes. Testing accommodations: extended time (1.5x), tests administered in a separate location, directions read and reread aloud.",
    "task": "Using information from ALL FOUR exhibits, write a response of approximately 400-600 words in which you:\n\n1. Identify ONE significant academic need and ONE significant need in another domain (social/behavioral, communication, or functional), citing specific evidence from the exhibits that documents each need;\n\n2. Recommend ONE research- or evidence-based instructional strategy or intervention to address the academic need and ONE research- or evidence-based strategy or intervention to address the need in the second domain, describing each strategy concretely enough that another teacher could implement it; and\n\n3. Provide a rationale explaining why each recommended strategy is appropriate for this student, supporting all claims with specific evidence drawn from the exhibits.\n\nThe suggested time for this assignment is 60 minutes. Your response will be scored holistically on Completeness, Accuracy, and Depth of Support.",
    "rubric": [
      {
        "criterion": "Completeness",
        "high": "Fully accomplishes every component of the task: identifies one academic need and one need from a different domain, recommends one clearly described evidence-based strategy for each need, and provides a rationale for both recommendations. All parts are developed in proportion, and the response functions as a unified, purposeful whole.",
        "mid": "Accomplishes most components of the task but unevenly: may identify both needs yet develop only one strategy fully, omit or shortchange a rationale, treat a required element in a single cursory sentence, or blur the two needs together. The purpose of the assignment is only partially achieved.",
        "low": "Fails to accomplish major components of the task: identifies only one need, draws both needs from the same domain, omits strategies or rationales entirely, or produces a response largely unrelated to the task directions."
      },
      {
        "criterion": "Accuracy",
        "high": "Demonstrates accurate and effective application of professional knowledge: interprets the data correctly (WCPM against benchmarks, decoding-inventory percentages, percentile ranks, on-task percentages), identifies needs that genuinely follow from the evidence, and recommends well-established evidence-based practices described with implementable precision (grouping, frequency, duration, procedures).",
        "mid": "Shows generally accurate knowledge with minor errors or vagueness: may slightly misread a data point, describe an evidence-based strategy only in generic terms (such as 'do phonics' or 'give him breaks') without procedural detail, or offer a rationale that is plausible but loosely connected to the strategy or the student's profile.",
        "low": "Contains substantial inaccuracies: misinterprets assessment data (for example, treating average scores as deficits or misreading percentile ranks), identifies needs the exhibits do not support, or recommends strategies that are not evidence-based or are mismatched to the documented needs."
      },
      {
        "criterion": "Depth of Support",
        "high": "Supports every assertion with specific, well-chosen evidence cited from the exhibits (exact WCPM scores, decoding-inventory percentages, on-task interval data, work-sample errors, test percentiles) and synthesizes across multiple exhibits to show converging evidence for each identified need and each recommendation.",
        "mid": "Provides some supporting evidence, but the support is thin, drawn mostly from a single exhibit, or stated in general terms (such as 'the data show he struggles in reading') without specific figures or examples; connections between evidence and recommendations are asserted more than demonstrated.",
        "low": "Provides little or no evidence from the exhibits; assertions are unsupported generalizations or restatements of the prompt."
      }
    ],
    "exemplar": "Marcus presents two priority needs: an academic need in word-level reading (decoding and reading fluency) and a behavioral need in task engagement during independent literacy activities.\n\nThe academic need is documented across all four exhibits. At the winter benchmark Marcus read 44 words correct per minute on grade 4 passages against a target of 112, and six weekly probes (39-44 WCPM) show a flat trend with accuracy of only 88-91 percent (Exhibit 2). The decoding inventory pinpoints where word reading breaks down: consonants, digraphs, and short vowels are mastered, but vowel teams (30 percent), r-controlled vowels (25 percent), and two-syllable words (20 percent) are not. His work sample mirrors exactly these gaps: phonetic spellings such as 'rane' and 'hering' reflect incomplete vowel-team knowledge, and in oral reading he substituted visually similar words ('though' for 'through'), dropped endings, and self-corrected only 1 of 11 errors (Exhibit 3). Critically, his WIAT-4 Basic Reading composite falls at the 7th percentile (well below average) while Listening Comprehension is average (58th percentile), and Ms. Rivera reports that he answers inferential questions accurately when text is read aloud (Exhibits 1, 4). This profile indicates a specific word-recognition deficit, not a general language or comprehension problem.\n\nTo address this need I recommend explicit, systematic phonics instruction within a structured literacy approach: 30 minutes daily in a group of three, following a cumulative scope and sequence that begins with vowel teams and r-controlled vowels and progresses to syllable-division strategies for two-syllable words, with every new pattern applied immediately in decodable text and consolidated through brief repeated readings of passages containing taught patterns. Explicit, systematic phonics instruction carries one of the strongest evidence bases for students with learning disabilities in basic reading, and Marcus's intact listening comprehension means decoding is the bottleneck. The decoding inventory tells the interventionist precisely which patterns to teach first, and the embedded repeated reading builds directly toward his existing IEP fluency goal of 90 WCPM with 95 percent accuracy.\n\nThe second need is behavioral: escape-motivated task avoidance during independent reading. Momentary time-sampling data show Marcus on task only 35-42 percent of intervals during the literacy block versus a class median of 80 percent, yet 85 percent during math (Exhibit 2). The narrative confirms the pattern is reading-specific: repeated pencil sharpening, nurse and bathroom requests, head down, a crumpled worksheet, and a recent refusal to join partner reading after peers began finishing his sentences (Exhibit 1). Because the avoidance occurs almost exclusively when he must read independently, the behavior most plausibly functions to escape frustration-level reading tasks and the embarrassment that accompanies them.\n\nTo address this need I recommend self-monitoring of on-task behavior with goal setting and reinforcement. During the literacy block, a silent vibrating timer cues Marcus every three minutes to mark on a card whether he is on task; he graphs his daily percentage, beginning with a goal of 60 percent and raising the criterion as he succeeds, with brief teacher agreement checks and a preferred activity earned for meeting his goal. Self-monitoring is a well-documented, low-intrusion intervention for increasing on-task behavior in students with learning disabilities, and it builds self-regulation without public adult correction that could further embarrass him in front of peers. Paired with independent reading assignments at his instructional level, it addresses both the behavior and its escape function, and the daily self-recorded data, checked against the teacher's time-sampling observations, give the CSE a built-in progress measure alongside the weekly ORF probes."
  },
  {
    "id": "cr2",
    "title": "Constructed Response 2: Aaliyah (Grade 7, Other Health Impairment)",
    "scenario": "Use the information in the exhibits below to complete the task that follows.\n\nAaliyah is a 12-year-old seventh grader classified as a student with an Other Health Impairment on the basis of a medical diagnosis of attention-deficit/hyperactivity disorder (ADHD), combined presentation. She attends general education classes for all subjects and receives resource room services one period per day. Her CSE annual review is approaching, and her resource room teacher has assembled the following exhibits.\n\nEXHIBIT 1: TEACHER NARRATIVE\n\nMr. Okafor, Aaliyah's English language arts teacher, writes: Aaliyah is one of the most insightful contributors to class discussion I have this year. Her oral arguments are sophisticated; she anticipates counterarguments and cites details from the text from memory. Her written work does not come close to matching what she says aloud: essays are short, ideas appear in whatever order they occurred to her, and pieces are often unfinished. She starts tasks promptly but drifts within minutes to drawing in her margins or watching the hallway. Her papers travel loose in her backpack, and she frequently cannot find drafts we started in class; she has come to class without her novel in 6 of the last 10 classes. Homework is often started but never turned in; twice this quarter I found completed assignments crumpled at the bottom of her backpack. When I sat with her and we planned an essay together on a simple outline, her written output roughly doubled, but she does not initiate any planning on her own.\n\nEXHIBIT 2: PROGRESS-MONITORING DATA\n\nDistrict analytic writing rubric (each trait scored 1-6) across the four marking-period essays: Ideas: 4, 4, 3, 4. Organization: 2, 1, 2, 2. Evidence/Elaboration: 2, 3, 2, 3. Conventions: 3, 3, 3, 3. Essay word counts: 145, 160, 130, 152; the class median is approximately 400 words.\n\nAssignment completion log (homework and long-term tasks submitted on time, by week, over six weeks): 45 percent, 50 percent, 38 percent, 42 percent, 55 percent, 40 percent; the class median is 90 percent.\n\nPlanner check (conducted in resource room over two weeks): assignments recorded in her planner on 3 of 10 school days.\n\nEXHIBIT 3: WORK SAMPLE DESCRIPTION\n\nAn on-demand persuasive essay ('Should middle school start later in the morning?'). Aaliyah opens with a clear claim and an engaging hook. She then presents four reasons in a single unbroken paragraph with no transitions, repeats her second reason in different words, inserts an unrelated anecdote about her cousin's school, and stops mid-sentence when time expires. The attached planning page is blank except for her name. By contrast, a science lab conclusion written with a teacher-provided sentence-frame template is complete, organized, and earned full credit.\n\nEXHIBIT 4: IEP EXCERPT\n\nClassification: Other Health Impairment. Evaluation summary: WISC-V Full Scale IQ 110 (75th percentile, high average). WIAT-4 Reading Comprehension: standard score 108 (70th percentile, average range). WIAT-4 Written Expression composite: standard score 82 (12th percentile, below average), with the Essay Composition subtest weakest in text organization. BRIEF-2 teacher and parent ratings: clinically elevated on the Plan/Organize, Organization of Materials, and Working Memory scales. Current annual goal: Given a graphic organizer and explicit instruction in planning strategies, Aaliyah will write a five-paragraph essay containing a thesis statement, three supporting paragraphs with transitions, and a conclusion, scoring at least 4 of 6 on the district organization rubric on 3 of 4 assignments. Accommodations: preferential seating away from windows and doors, directions repeated and clarified, checklists for multistep tasks, extended time (1.5x) on extended writing tasks. Aaliyah follows the general education curriculum without modified content.",
    "task": "Using information from ALL FOUR exhibits, write a response of approximately 400-600 words in which you:\n\n1. Identify ONE significant academic need and ONE significant need in another domain (social/behavioral, communication, or functional), citing specific evidence from the exhibits that documents each need;\n\n2. Recommend ONE research- or evidence-based instructional strategy or intervention to address the academic need and ONE research- or evidence-based strategy or intervention to address the need in the second domain, describing each strategy concretely enough that another teacher could implement it; and\n\n3. Provide a rationale explaining why each recommended strategy is appropriate for this student, supporting all claims with specific evidence drawn from the exhibits.\n\nThe suggested time for this assignment is 60 minutes. Your response will be scored holistically on Completeness, Accuracy, and Depth of Support.",
    "rubric": [
      {
        "criterion": "Completeness",
        "high": "Fully accomplishes every component of the task: identifies one academic need and one need from a different domain, recommends one clearly described evidence-based strategy for each need, and provides a rationale for both recommendations. All parts are developed in proportion, and the response functions as a unified, purposeful whole.",
        "mid": "Accomplishes most components of the task but unevenly: may identify both needs yet develop only one strategy fully, omit or shortchange a rationale, treat a required element in a single cursory sentence, or conflate the writing need with the organization need rather than addressing each distinctly. The purpose of the assignment is only partially achieved.",
        "low": "Fails to accomplish major components of the task: identifies only one need, draws both needs from the same domain, omits strategies or rationales entirely, or produces a response largely unrelated to the task directions."
      },
      {
        "criterion": "Accuracy",
        "high": "Demonstrates accurate and effective application of professional knowledge: interprets the data correctly (rubric trait patterns, completion percentages, percentile ranks, including that a 70th-percentile score falls within the average range and signals intact reading comprehension), identifies needs that genuinely follow from the evidence, and recommends well-established evidence-based practices described with implementable precision (procedures, frequency, materials, fading plan).",
        "mid": "Shows generally accurate knowledge with minor errors or vagueness: may slightly misread a data point, describe an evidence-based strategy only in generic terms (such as 'use graphic organizers' or 'help her get organized') without procedural detail, or offer a rationale that is plausible but loosely connected to the strategy or the student's profile.",
        "low": "Contains substantial inaccuracies: misinterprets assessment data (for example, treating her average-range reading comprehension or high-average ability as deficits), identifies needs the exhibits do not support, or recommends strategies that are not evidence-based or are mismatched to the documented needs."
      },
      {
        "criterion": "Depth of Support",
        "high": "Supports every assertion with specific, well-chosen evidence cited from the exhibits (exact rubric scores, word counts, completion and planner percentages, test percentiles, BRIEF-2 scales, work-sample features) and synthesizes across multiple exhibits to show converging evidence for each identified need and each recommendation.",
        "mid": "Provides some supporting evidence, but the support is thin, drawn mostly from a single exhibit, or stated in general terms (such as 'her writing scores are low') without specific figures or examples; connections between evidence and recommendations are asserted more than demonstrated.",
        "low": "Provides little or no evidence from the exhibits; assertions are unsupported generalizations or restatements of the prompt."
      }
    ],
    "exemplar": "Aaliyah presents two priority needs: an academic need in written expression, specifically planning and organizing extended text, and a functional need in organization and self-management of materials and assignments.\n\nThe written expression need is documented across every exhibit. On the district rubric her Organization scores are 2, 1, 2, and 2 across four essays, while her Ideas scores of 3-4 show the content itself is adequate, and her essays run 130-160 words against a class median of roughly 400 (Exhibit 2). Her on-demand essay shows the same profile: a clear claim and engaging hook followed by four reasons in one unbroken paragraph, a repeated reason, an off-topic anecdote, and a blank planning page (Exhibit 3). Standardized data rule out competing explanations: her WIAT-4 Reading Comprehension is solidly average at the 70th percentile and her cognitive ability is high average, while Written Expression falls at the 12th percentile, below average, with organization the weakest element (Exhibit 4). Mr. Okafor reports sophisticated oral arguments and that her output roughly doubled when an adult planned with her (Exhibit 1), confirming a breakdown in independent planning and text organization, not in knowledge or language.\n\nTo address this need I recommend Self-Regulated Strategy Development (SRSD) for persuasive writing using the POW+TREE strategy, delivered in three 40-minute resource room sessions per week. Instruction moves through the SRSD stages: the teacher activates background knowledge, discusses the strategy, models it with a think-aloud that includes coping self-statements, has Aaliyah memorize the mnemonic, supports her through collaborative compositions, and fades to independent performance, with Aaliyah setting goals, counting her essay parts, and graphing her own rubric scores. SRSD has among the strongest effect sizes of any writing intervention for students with disabilities, and it matches Aaliyah because it teaches planning explicitly while embedding the self-regulation routines her clinically elevated BRIEF-2 Plan/Organize and Working Memory scores show she lacks. The exhibits already prove she profits from structure: the sentence-frame lab report was complete and organized, and the teacher-supported outline doubled her output. The strategy also implements her existing annual goal, which calls for explicit planning-strategy instruction toward a 4 of 6 organization score.\n\nThe second need is functional: organizing materials and completing the assignment cycle. Her on-time submission rate ranged from 38 to 55 percent over six weeks against a class median of 90 percent, and she recorded assignments in her planner on only 3 of 10 days (Exhibit 2). She arrived without her novel in 6 of 10 classes, loses drafts in a backpack of loose papers, and, tellingly, completed assignments were twice found crumpled in her backpack rather than turned in (Exhibit 1). That last detail shows the breakdown is organizational rather than motivational: she does the work but the system for transporting and submitting it fails.\n\nTo address this need I recommend explicit organization skills training with self-monitoring and brief daily check-in/check-out. Aaliyah is taught one accordion binder system with a labeled turn-in folder, records assignments in her planner at the end of each class with teacher initials at first, and meets her resource room teacher for a three-minute morning check-in (materials ready) and afternoon check-out (planner complete, work packed), earning points toward a weekly privilege; initials and check-outs fade as her data improve. Organization interventions of this kind, such as the HOPS program, have solid evidence with middle schoolers with ADHD, target her documented failure points of recording, transporting, and submitting, and shift from external scaffolding to self-monitoring so the support builds self-regulation rather than adult dependence. Progress is monitored with the weekly on-time submission percentage and planner counts the team already collects."
  }
];

// ═══════════════════════════════════════════════════════════════
// ENGINE · Generic. Below this divider should be portable verbatim
// across exam apps. References SUBTESTS / WELCOME / PRETEST / POSTTEST /
// MODULES / CR_PROMPTS from the EXAM CONTENT block above.
// ═══════════════════════════════════════════════════════════════

const calcScores = (questions, answers) => {
  const domainData = {};
  questions.forEach((q, i) => {
    if (!domainData[q.d]) domainData[q.d] = { subtest:q.s, correct:0, total:0 };
    domainData[q.d].total++;
    if (answers[i] === q.c) domainData[q.d].correct++;
  });
  const subtestData = {};
  Object.entries(domainData).forEach(([d, data]) => {
    if (!subtestData[data.subtest]) subtestData[data.subtest] = { correct:0, total:0 };
    subtestData[data.subtest].correct += data.correct;
    subtestData[data.subtest].total += data.total;
  });
  return { domains: domainData, subtests: subtestData };
};

const pct = (c, t) => t === 0 ? 0 : Math.round((c / t) * 100);

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildQuizPool = () => {
  const pool = {};
  PRETEST.forEach(q => { (pool[q.d] = pool[q.d] || []).push(q); });
  POSTTEST.forEach(q => { (pool[q.d] = pool[q.d] || []).push(q); });
  Object.entries(MODULES).forEach(([d, mod]) => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
    (mod.practice || []).forEach(p => { (pool[d] = pool[d] || []).push({ ...p, s: subtest, d }); });
  });
  return pool;
};

const INITIAL_STATE = {
  phase:'welcome', qIndex:0, answers:{}, pretestScores:null,
  completedModules:[], activeModule:null, modPhase:'content', modPQIndex:0, modPAnswers:{},
  postAnswers:{}, postScores:null,
  fcDomain:null, fcOrder:[], fcPos:0, fcFlipped:false, fcKnown:[],
  quizDomain:null, quizLen:10, quizQs:null, quizIdx:0, quizAnswers:{},
  crPromptId: (typeof CR_PROMPTS !== 'undefined' && CR_PROMPTS.length > 0) ? CR_PROMPTS[0].id : null, crView:'prompt', crSelfScore:{},
};


// ─── PRIMITIVES ────────────────────────────────────────────
const Cap = ({ children, color = T.muted, mb = 0 }) => (
  <div style={{ ...baseStyles.capSm, color, marginBottom: mb }}>{children}</div>
);
const Pill = ({ children, color = T.orange2 }) => (
  <span style={{ ...baseStyles.cap, fontSize: 10, color, padding: '3px 0', borderTop: `1px solid ${color}`, borderBottom: `1px solid ${color}`, paddingLeft: 8, paddingRight: 8 }}>{children}</span>
);
const Rule = ({ thick = 1, color = T.ink, my = 0 }) => (
  <div style={{ height: thick, background: color, marginTop: my, marginBottom: my }} />
);
const Card = ({ children, style = {} }) => (
  <div style={{ background: T.paper3, border: `1px solid ${T.ink}`, padding: 24, ...style }}>{children}</div>
);
const ProgressRow = ({ value, label, color = T.orange2 }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: T.serif, fontSize: 14 }}>
      <span style={{ color: T.ink2 }}>{label}</span>
      <span style={{ color, fontWeight: 600, fontFeatureSettings: "'tnum' 1" }}>{value}%</span>
    </div>
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={typeof label === 'string' ? label : undefined}
      style={{ background: T.paper2, border: `1px solid ${T.hairline}`, height: 6, position: 'relative' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, transition: 'width 0.6s ease' }} />
    </div>
  </div>
);
const Btn = ({ children, onClick, variant = 'primary', disabled = false, style = {} }) => {
  const base = { padding: '14px 32px', fontFamily: T.sans, fontSize: 12, fontWeight: 600, letterSpacing: '.28em', textTransform: 'uppercase', border: 'none', cursor: disabled ? 'default' : 'pointer', transition: 'background .15s', display: 'inline-block', textDecoration: 'none' };
  const variants = {
    primary: { background: disabled ? T.muted : T.ink, color: T.paper },
    ghost: { background: 'transparent', color: T.ink, border: `1px solid ${T.ink}`, padding: '13px 31px' },
    accent: { background: disabled ? T.muted : T.orange2, color: T.paper },
  };
  return <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
};
const Page = ({ children, narrow = false }) => (
  // narrow → 880px (was 720) so modules + question screens use more of the
  // viewport without exceeding a comfortable serif reading line length.
  <div style={{ maxWidth: narrow ? 880 : 1120, margin: '0 auto', padding: '32px clamp(16px, 5vw, 40px) 96px' }}>{children}</div>
);

// Arrow-key focus movement for role="radiogroup" option lists (roving tabindex).
const radioGroupKeys = (e) => {
  if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) return;
  const radios = Array.from(e.currentTarget.querySelectorAll('[role="radio"]:not(:disabled)'));
  if (radios.length === 0) return;
  const idx = radios.indexOf(document.activeElement);
  const delta = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : -1;
  radios[(Math.max(idx, 0) + delta + radios.length) % radios.length].focus();
  e.preventDefault();
};

// Media queries can't live in inline styles — the few responsive layout
// rules go in this one global stylesheet instead.
const GlobalStyles = () => (
  <style>{`
    .ol-split { display: grid; grid-template-columns: 1fr 1px 1fr; }
    .ol-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    @media (max-width: 760px) {
      .ol-split { grid-template-columns: 1fr; }
      .ol-split .ol-vrule { display: none; }
      .ol-grid2 { grid-template-columns: 1fr; }
    }
  `}</style>
);

// ─── ONE LOVE BRAND ────────────────────────────────────────
const OneLoveLogo = ({ height = 26, dark = true }) => {
  const inkColor = dark ? T.paper : T.ink;
  const heartColor = dark ? '#c4493a' : '#a8302a';
  return (
    <svg height={height} viewBox="0 0 380 80" xmlns="http://www.w3.org/2000/svg" aria-label="One Love" style={{ display: 'block' }}>
      <text x="170" y="60" textAnchor="end" fontFamily={T.serif} fontWeight="900" fontSize="54" letterSpacing="-1.2" fill={inkColor}>One</text>
      <g transform="translate(190, 35)">
        <path d="M 10 4 C 10 -2, 4 -6, 0 -2 C -4 -6, -10 -2, -10 4 C -10 11, 0 17, 0 17 C 0 17, 10 11, 10 4 Z" fill={heartColor}/>
      </g>
      <text x="208" y="60" fontFamily={T.serif} fontWeight="900" fontStyle="italic" fontSize="54" letterSpacing="-1.2" fill={inkColor}>Love</text>
    </svg>
  );
};

const OneLoveFooter = () => (
  <footer style={{ borderTop: `1px solid ${T.ink}`, background: T.paper2, padding: '24px 24px 32px', marginTop: 48 }}>
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
      <OneLoveLogo height={22} dark={false}/>
      <div style={{ ...baseStyles.cap, fontSize: 9, color: T.muted, letterSpacing: '.18em' }}>Behavior Analysts, PLLC</div>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, lineHeight: 1.6, color: T.muted, margin: 0, maxWidth: 640 }}>
        OneLove Behavior Analysts, PLLC is not affiliated with, endorsed by, or sponsored by the New York State Education Department or the Evaluation Systems group of Pearson. NYSTCE® and CST® are registered marks of their respective owners. This practice tool is provided for educational purposes only and does not guarantee passage of any New York State teacher certification examination.
      </p>
    </div>
  </footer>
);

// Page chrome. Lives at module scope — defining this inside App() made it a
// new component type every render, remounting the whole subtree on each
// state change (scroll/focus loss).
const Shell = ({ nav, children }) => (
  <div style={{ background: T.paper, minHeight: '100vh', color: T.ink, display: 'flex', flexDirection: 'column' }}>
    <GlobalStyles />
    {nav}
    <div style={{ flex: 1 }}>{children}</div>
    <OneLoveFooter/>
  </div>
);

// ─── NAVBAR ────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'welcome',    label: 'Home',     always: true },
  { id: 'flashcards', label: 'Cards',    always: true },
  { id: 'quiz',       label: 'Quiz',     always: true },
  { id: 'pretest',    label: 'Pretest',  always: true },
  { id: 'cresponse',  label: 'Constructed Response', always: true },
  { id: 'results',    label: 'Results',  needs: 'pretestScores' },
  { id: 'modules',    label: 'Study',    needs: 'pretestScores' },
  { id: 'posttest',   label: 'Post-Test',needs: 'pretestScores' },
  { id: 'comparison', label: 'Report',   needs: 'postScores' },
];
const NavBar = ({ st, onNav, onReset, onConfirmReset, onCancelReset }) => {
  const active = st.phase === 'module' ? 'modules'
    : (st.phase === 'quizPicker' || st.phase === 'quizRun' || st.phase === 'quizDone') ? 'quiz'
    : st.phase;
  return (
    <div style={{ background: T.paper2, borderBottom: `1px solid ${T.ink}`, position: 'sticky', top: 0, zIndex: 200 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '8px clamp(12px, 4vw, 40px) 6px', borderBottom: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => onNav('welcome')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-label="Home">
          <OneLoveLogo height={22} dark={false}/>
        </button>
      </div>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '8px clamp(12px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0, flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const avail = item.always || !!st[item.needs];
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => avail && onNav(item.id)} disabled={!avail}
                style={{ ...baseStyles.cap, fontSize: 11, color: isActive ? T.ink : (avail ? T.ink2 : T.muted), padding: '2px 0', margin: '0 14px 0 0', background: 'none', border: 'none', borderBottom: `2px solid ${isActive ? T.orange : 'transparent'}`, cursor: avail ? 'pointer' : 'default', whiteSpace: 'nowrap' }}>
                {item.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {!st.confirmReset
            ? <button onClick={onReset} style={{ ...baseStyles.cap, fontSize: 10, color: T.red, background: 'none', border: 'none', cursor: 'pointer' }}>Reset</button>
            : <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ ...baseStyles.cap, fontSize: 9, color: T.muted }}>Start over?</span>
                <button onClick={onConfirmReset} style={{ ...baseStyles.cap, fontSize: 9, color: T.paper, background: T.red, padding: '3px 8px', border: 'none', cursor: 'pointer' }}>Yes</button>
                <button onClick={onCancelReset} style={{ ...baseStyles.cap, fontSize: 9, color: T.muted, background: 'none', padding: '3px 8px', border: `1px solid ${T.muted}`, cursor: 'pointer' }}>No</button>
              </div>}
        </div>
      </div>
    </div>
  );
};

// ─── WELCOME ───────────────────────────────────────────────
const Welcome = ({ onStart }) => (
  <Page>
    <div style={{ margin: '0 0 32px', borderTop: `1px solid ${T.ink}`, borderBottom: `1px solid ${T.ink}`, padding: '18px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <span style={baseStyles.capSm}>{WELCOME.triBand[0]}</span>
        <span style={{ width: 38, height: 38, border: `1.5px solid ${T.ink}`, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, fontWeight: 500, color: T.ink }}>𝒮</span>
        <span style={baseStyles.capSm}>{WELCOME.triBand[1]}</span>
      </div>
    </div>
    <header style={{ textAlign: 'center', padding: '0 0 40px', borderBottom: `3px solid ${T.ink}` }}>
      <Cap mb={32}>{WELCOME.imprint}</Cap>
      <h1 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 'clamp(46px, 9vw, 84px)', lineHeight: 1.02, color: T.ink, letterSpacing: '-.01em', marginBottom: 22 }}>
        {WELCOME.title.pre} <span style={{ ...baseStyles.ital, color: T.orange2 }}>{WELCOME.title.italic}</span> {WELCOME.title.post}
      </h1>
      <p style={{ fontFamily: T.serif, fontSize: 21, color: T.ink2, maxWidth: 680, margin: '0 auto 28px', lineHeight: 1.5, fontStyle: 'italic' }}>
        {WELCOME.subtitle}
      </p>
      <div style={{ ...baseStyles.cap, fontSize: 11, color: T.muted }}>
        {WELCOME.alignment.map((item, i) => (
          <span key={item}>
            {i > 0 && <span style={{ margin: '0 12px', color: T.orange }}>·</span>}
            <span style={{ color: T.ink, fontWeight: 600 }}>{item}</span>
          </span>
        ))}
      </div>
    </header>
    {WELCOME.testFacts && (
      <section style={{ marginTop: 44 }}>
        <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${T.ink}`, textAlign: 'center' }}>
          <Cap color={T.orange2} mb={8}>— Know the Test</Cap>
          <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 34, color: T.ink, letterSpacing: '-.005em' }}>{WELCOME.testFacts.heading}</h2>
        </div>
        <div className="ol-grid2" style={{ gap: 24 }}>
          {WELCOME.testFacts.tables.map((tbl, ti) => (
            <div key={ti} style={{ marginBottom: 12 }}>
              {tbl.title && <Cap color={T.ink2} mb={8}>{tbl.title}</Cap>}
              <div style={{ border: `1px solid ${T.ink}`, background: T.paper3 }}>
                {tbl.rows.map((row, ri) => (
                  <div key={ri} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 16px', borderBottom: ri < tbl.rows.length - 1 ? `1px solid ${T.hairline}` : 'none', fontFamily: T.serif, fontSize: 14, lineHeight: 1.45 }}>
                    <span style={{ color: T.ink2 }}>{row[0]}</span>
                    <span style={{ color: T.ink, fontWeight: 600, textAlign: 'right', fontFeatureSettings: "'tnum' 1" }}>{row[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {WELCOME.testFacts.note && <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, color: T.muted, lineHeight: 1.6, marginTop: 8, textAlign: 'center' }}>{WELCOME.testFacts.note}</p>}
      </section>
    )}
    <section className="ol-split" style={{ padding: '48px 0 0' }}>
      <div style={{ padding: '0 32px' }}>
        <div style={{ marginBottom: 28, paddingBottom: 14, borderBottom: `1px solid ${T.ink}` }}>
          <Cap color={T.orange2} mb={8}>— The Method</Cap>
          <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 36, color: T.ink, letterSpacing: '-.005em', lineHeight: 1 }}>How This Works</h2>
        </div>
        {WELCOME.steps.map(([title, desc], i, arr) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 18, padding: '18px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 30, color: T.orange2, fontWeight: 500, lineHeight: 1.05 }}>{i + 1}.</div>
            <div>
              <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 18, marginBottom: 4, lineHeight: 1.2 }}>{title}</h3>
              <p style={{ fontFamily: T.serif, fontSize: 15, color: T.ink2, lineHeight: 1.55 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="ol-vrule" style={{ background: T.ink, width: 1 }} />
      <div style={{ padding: '0 32px' }}>
        <div style={{ marginBottom: 28, paddingBottom: 14, borderBottom: `1px solid ${T.ink}` }}>
          <Cap color={T.orange2} mb={8}>— {WELCOME.subareasHeading}</Cap>
          <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 36, color: T.ink, letterSpacing: '-.005em', lineHeight: 1 }}>Contents</h2>
        </div>
        {Object.entries(SUBTESTS).map(([k, v], i, arr) => (
          <div key={k} style={{ padding: '18px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
            <Cap color={T.orange2} mb={5}>{WELCOME.subareaWord} {v.roman}</Cap>
            <h3 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 21, letterSpacing: '-.005em', lineHeight: 1.2, marginBottom: 5 }}>{v.label}</h3>
          </div>
        ))}
      </div>
    </section>
    <div style={{ textAlign: 'center', marginTop: 64, paddingTop: 48, borderTop: `3px solid ${T.ink}` }}>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, color: T.ink2, marginBottom: 24, lineHeight: 1.5, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
        Begin with the diagnostic pretest. The course is sequential.
      </p>
      <Btn onClick={onStart} variant="primary" style={{ padding: '18px 56px', fontSize: 12, letterSpacing: '.32em' }}>Begin the Pretest</Btn>
    </div>
    <div style={{ marginTop: 56, paddingTop: 24, borderTop: `1px solid ${T.ink}`, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, color: T.muted, lineHeight: 1.6, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.ink, marginBottom: 6, fontStyle: 'normal' }}>Colophon</div>
      {WELCOME.colophon}
    </div>
  </Page>
);

// ─── QUESTION SCREEN ───────────────────────────────────────
const QuestionScreen = ({ questions, answers, qIndex, onAnswer, onNav, onSubmit, phase }) => {
  const q = questions[qIndex];
  const selected = answers[qIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const subtest = SUBTESTS[q.s];
  return (
    <Page narrow>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${T.ink}` }}>
        <div><Pill color={T.orange2}>{WELCOME.subareaWord} {subtest.roman} · {subtest.label}</Pill></div>
        <div style={{ ...baseStyles.cap, fontSize: 11, color: T.muted }}>Question {qIndex + 1} of {total}</div>
      </div>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.ink2, marginBottom: 14 }}>{q.d}</div>
      <div style={{ height: 3, background: T.paper2, marginBottom: 36, position: 'relative' }}>
        <div style={{ width: `${((qIndex + 1) / total) * 100}%`, height: '100%', background: T.orange2, transition: 'width .3s' }} />
      </div>
      <p id={`q-${qIndex}-stem`} style={{ fontFamily: T.serif, fontSize: 24, lineHeight: 1.45, color: T.ink, marginBottom: 32, fontWeight: 500 }}>{q.q}</p>
      <div role="radiogroup" aria-labelledby={`q-${qIndex}-stem`} onKeyDown={radioGroupKeys} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
        {q.a.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button key={i} role="radio" aria-checked={isSelected} onClick={() => onAnswer(qIndex, i)}
              tabIndex={isSelected || (selected === undefined && i === 0) ? 0 : -1}
              style={{ textAlign: 'left', padding: '16px 20px', paddingLeft: isSelected ? 17 : 20, border: `1px solid ${isSelected ? T.ink : T.hairline}`, borderLeft: isSelected ? `4px solid ${T.orange2}` : `1px solid ${T.hairline}`, background: isSelected ? T.paper2 : T.paper3, cursor: 'pointer', fontFamily: T.serif, fontSize: 17, color: T.ink, fontWeight: isSelected ? 600 : 400, transition: 'all .15s', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <span aria-hidden="true" style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 22, color: isSelected ? T.orange2 : T.muted, fontWeight: 500, lineHeight: 1, flexShrink: 0 }}>{['a.', 'b.', 'c.', 'd.'][i]}</span>
              <span style={{ lineHeight: 1.5 }}>{opt}</span>
            </button>
          );
        })}
      </div>
      <Rule color={T.ink} my={0} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20 }}>
        <Btn onClick={() => onNav(-1)} variant="ghost" disabled={qIndex === 0} style={{ padding: '10px 22px' }}>← Back</Btn>
        <span style={{ ...baseStyles.cap, fontSize: 10, color: T.muted }}>{answeredCount} of {total} answered</span>
        {qIndex < total - 1
          ? <Btn onClick={() => onNav(1)} variant="primary" style={{ padding: '10px 22px' }}>Next →</Btn>
          : <Btn onClick={onSubmit} variant="accent" disabled={answeredCount < total} style={{ padding: '10px 22px' }}>{answeredCount < total ? `${total - answeredCount} unanswered` : `Submit ${phase}`}</Btn>}
      </div>
    </Page>
  );
};

// ─── REVIEW INCORRECT ──────────────────────────────────────
const ReviewIncorrect = ({ items, onBack }) => {
  const [idx, setIdx] = useState(0);
  const cur = items[idx];
  const q = cur.q;
  return (
    <Page narrow>
      <button onClick={onBack} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 18 }}>← Back to results</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${T.ink}` }}>
        <Pill color={T.red}>Missed · {WELCOME.subareaWord} {SUBTESTS[q.s]?.roman}</Pill>
        <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted }}>Item {idx + 1} of {items.length}</div>
      </div>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.ink2, marginBottom: 14 }}>{q.d}</div>
      <p style={{ fontFamily: T.serif, fontSize: 22, lineHeight: 1.45, color: T.ink, marginBottom: 24, fontWeight: 500 }}>{q.q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {q.a.map((opt, i) => {
          const isCorrect = i === q.c;
          const isUser = i === cur.user;
          let bg = T.paper3, border = T.hairline, marker = null;
          if (isCorrect) { bg = T.greenBg; border = T.green; marker = <span style={{ ...baseStyles.cap, fontSize: 9, color: T.green, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✓ Correct</span>; }
          else if (isUser) { bg = T.redBg; border = T.red; marker = <span style={{ ...baseStyles.cap, fontSize: 9, color: T.red, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✗ Your answer</span>; }
          return (
            <div key={i} style={{ padding: '14px 18px', border: `1px solid ${border}`, background: bg, fontFamily: T.serif, fontSize: 16, color: T.ink, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 20, color: T.ink2, fontWeight: 500, lineHeight: 1, flexShrink: 0 }}>{['a.', 'b.', 'c.', 'd.'][i]}</span>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{opt}</span>
              {marker}
            </div>
          );
        })}
      </div>
      <div style={{ background: T.paper2, border: `1px solid ${T.ink}`, padding: '20px 24px', marginBottom: 28 }}>
        <div style={{ ...baseStyles.cap, fontSize: 10, color: T.orange2, marginBottom: 8 }}>— Annotation</div>
        <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.6, color: T.ink, fontStyle: 'italic' }}>{q.r}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14 }}>
        <Btn onClick={() => setIdx(Math.max(0, idx - 1))} variant="ghost" disabled={idx === 0} style={{ padding: '10px 22px' }}>← Previous</Btn>
        <Btn onClick={() => idx < items.length - 1 ? setIdx(idx + 1) : onBack()} variant="primary" style={{ padding: '10px 22px' }}>{idx < items.length - 1 ? 'Next →' : 'Done'}</Btn>
      </div>
    </Page>
  );
};

// ─── RESULTS ───────────────────────────────────────────────
const Results = ({ scores, weakDomains, onContinue, isPost, pretestScores, sourceQuestions, sourceAnswers }) => {
  const [reviewing, setReviewing] = useState(false);
  const overall = Object.values(scores.subtests).reduce((a, b) => ({ correct: a.correct + b.correct, total: a.total + b.total }), { correct: 0, total: 0 });
  const overallPct = pct(overall.correct, overall.total);
  const missed = sourceQuestions ? sourceQuestions.map((q, i) => ({ q, i, user: sourceAnswers?.[i] })).filter(x => x.user !== x.q.c) : [];
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 28, borderBottom: `3px solid ${T.ink}` }}>
        <Cap mb={12}>{isPost ? 'Post-Test · Final Examination' : 'Pretest · Diagnostic'}</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em', marginBottom: 14 }}>
          {isPost ? 'Final Results' : 'Diagnostic Results'}
        </h2>
        <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink2, fontStyle: 'italic' }}>
          Overall score: <span style={{ color: T.orange2, fontWeight: 600, fontStyle: 'normal' }}>{overallPct}%</span> <span style={{ color: T.muted }}>({overall.correct} of {overall.total})</span>
        </div>
      </header>
      <section style={{ marginBottom: 36 }}>
        <Cap color={T.orange2} mb={14}>— By {WELCOME.subareaWord}</Cap>
        {Object.entries(scores.subtests).map(([k, v]) => (
          <ProgressRow key={k} value={pct(v.correct, v.total)} label={`${WELCOME.subareaWord} ${SUBTESTS[k]?.roman} · ${SUBTESTS[k]?.label} (${v.correct}/${v.total})`} color={pct(v.correct, v.total) >= 70 ? T.green : T.red} />
        ))}
      </section>
      <section style={{ marginBottom: 36, paddingTop: 28, borderTop: `1px solid ${T.ink}` }}>
        <Cap color={T.orange2} mb={14}>— By Domain</Cap>
        {Object.entries(scores.domains).map(([d, v]) => {
          const p = pct(v.correct, v.total);
          const needsWork = p < 70;
          return (
            <div key={d} style={{ marginBottom: 14, padding: '12px 16px', background: needsWork ? T.redBg : 'transparent', border: `1px solid ${needsWork ? T.red : T.hairline}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 600, color: T.ink }}>{d}</span>
                {needsWork && <Pill color={T.red}>Review</Pill>}
              </div>
              <ProgressRow value={p} label={`${v.correct} of ${v.total} correct`} color={needsWork ? T.red : T.green} />
            </div>
          );
        })}
      </section>
      {isPost && pretestScores && (
        <section style={{ marginBottom: 36, padding: '28px 32px', background: T.paper2, border: `1px solid ${T.ink}` }}>
          <Cap color={T.orange2} mb={14}>— Growth Across the Course</Cap>
          {Object.entries(scores.domains).map(([d, v]) => {
            const pre = pretestScores.domains[d]; if (!pre) return null;
            const preP = pct(pre.correct, pre.total); const postP = pct(v.correct, v.total); const diff = postP - preP;
            return (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.serif, fontSize: 15 }}>
                <span style={{ color: T.ink2 }}>{d}</span>
                <span style={{ color: diff > 0 ? T.green : diff < 0 ? T.red : T.muted, fontWeight: 600, fontFeatureSettings: "'tnum' 1" }}>{preP}% → {postP}% <span style={{ marginLeft: 6 }}>({diff > 0 ? '+' : ''}{diff}%)</span></span>
              </div>
            );
          })}
        </section>
      )}
      {!isPost && weakDomains.length > 0 && (
        <section style={{ marginBottom: 36, padding: '24px 32px', background: T.paper3, border: `1px solid ${T.orange}` }}>
          <Cap color={T.orange2} mb={10}>— Recommended Study</Cap>
          <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 15, color: T.ink2, marginBottom: 12 }}>{weakDomains.length} {weakDomains.length === 1 ? 'domain' : 'domains'} below 70%. The course advises study before the post-test.</p>
          {weakDomains.map(d => (
            <div key={d} style={{ fontFamily: T.serif, fontSize: 15, color: T.ink, padding: '4px 0' }}>→ {d}</div>
          ))}
        </section>
      )}
      {missed.length > 0 && (
        <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 14 }}>Review the {missed.length} Missed Question{missed.length > 1 ? 's' : ''}</Btn>
      )}
      {isPost ? (
        <Btn onClick={onContinue} variant="ghost" style={{ width: '100%', padding: '14px' }}>Start a New Course → <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, marginLeft: 6, color: T.muted }}>(clears all progress)</span></Btn>
      ) : (
        <Btn onClick={onContinue} variant="primary" style={{ width: '100%', padding: '16px' }}>{weakDomains.length > 0 ? `Begin Study Modules (${weakDomains.length})` : 'Proceed to the Post-Test'}</Btn>
      )}
    </Page>
  );
};

// ─── MODULE HUB + LEARNING MODULE ──────────────────────────
const ModuleHub = ({ domains, weakDomains, completedModules, onSelect, onSkip }) => {
  const weakDone = weakDomains.every(d => completedModules.includes(d));
  return (
  <Page narrow>
    <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
      <Cap mb={12}>The Course of Study</Cap>
      <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em' }}>Your Study Plan</h2>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>
        {weakDomains.length > 0 ? 'Modules flagged from your pretest are listed first — start there. Every module is open to study.' : 'No domains fell below 70% on your pretest. Study any module, or proceed to the post-test.'}
      </p>
    </header>
    <div>
      {domains.map((d, i) => {
        const mod = MODULES[d];
        const done = completedModules.includes(d);
        const flagged = weakDomains.includes(d);
        return (
          <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 0', borderBottom: i < domains.length - 1 ? `1px solid ${T.hairline}` : `1px solid ${T.ink}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <Cap color={T.orange2}>Module {String(i + 1).padStart(2, '0')}</Cap>
                {flagged && !done && <Pill color={T.red}>Review</Pill>}
              </div>
              <h3 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 22, letterSpacing: '-.005em', marginBottom: 4 }}>{d}</h3>
              <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.muted }}>{mod?.concepts?.length || 0} concepts · {mod?.practice?.length || 0} practice questions</p>
            </div>
            <Btn onClick={() => onSelect(d)} variant={done ? 'ghost' : (flagged ? 'primary' : 'ghost')} style={{ padding: '10px 22px' }}>{done ? '✓ Completed' : 'Begin →'}</Btn>
          </div>
        );
      })}
    </div>
    <div style={{ marginTop: 36, textAlign: 'center', paddingTop: 24, borderTop: `1px solid ${T.ink}` }}>
      <p style={{ ...baseStyles.cap, fontSize: 11, color: T.muted, marginBottom: 16 }}>{completedModules.length} of {domains.length} modules completed{weakDomains.length > 0 ? ` · ${weakDomains.filter(d => completedModules.includes(d)).length} of ${weakDomains.length} flagged` : ''}</p>
      <Btn onClick={onSkip} variant={weakDone ? 'primary' : 'ghost'} style={{ padding: '14px 36px' }}>{weakDone ? 'Begin Post-Test →' : 'Skip to Post-Test →'}</Btn>
    </div>
  </Page>
  );
};

const LearningModule = ({ domain, phase, pqIndex, pAnswers, onPAnswer, onBack, onStartPractice, onFinish }) => {
  const mod = MODULES[domain];
  const pq = mod.practice[pqIndex];
  const pSelected = pAnswers[pqIndex];
  if (phase === 'content') return (
    <Page narrow>
      <button onClick={onBack} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}>← Back to study plan</button>
      <Cap color={T.orange2} mb={12}>— Module · Concepts</Cap>
      <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 44, color: T.ink, letterSpacing: '-.01em', lineHeight: 1.05, marginBottom: 28, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>{domain}</h2>
      {mod.concepts.map((c, i) => (
        <article key={i} style={{ marginBottom: 24, padding: '24px 28px', background: T.paper3, borderLeft: `3px solid ${T.orange2}`, border: `1px solid ${T.hairline}` }}>
          <Cap color={T.orange2} mb={6}>§ {String(i + 1).padStart(2, '0')}</Cap>
          <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 22, color: T.ink, marginBottom: 10, letterSpacing: '-.005em' }}>{c.title}</h3>
          <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.ink }}>{c.body}</p>
        </article>
      ))}
      <Btn onClick={onStartPractice} variant="accent" style={{ width: '100%', marginTop: 24, padding: '18px' }}>Begin Practice Questions →</Btn>
    </Page>
  );
  return (
    <Page narrow>
      <Cap color={T.orange2} mb={8}>{domain} · Practice</Cap>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 24 }}>Question {pqIndex + 1} of {mod.practice.length}</div>
      <p id={`pq-${pqIndex}-stem`} style={{ fontFamily: T.serif, fontSize: 22, lineHeight: 1.45, color: T.ink, marginBottom: 24, fontWeight: 500 }}>{pq.q}</p>
      <div role="radiogroup" aria-labelledby={`pq-${pqIndex}-stem`} onKeyDown={radioGroupKeys} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {pq.a.map((opt, i) => {
          const isSelected = pSelected === i;
          const showFeedback = pSelected !== undefined;
          const isCorrect = i === pq.c;
          let bg = T.paper3, border = T.hairline, color = T.ink;
          if (showFeedback && isCorrect) { bg = T.greenBg; border = T.green; }
          else if (showFeedback && isSelected && !isCorrect) { bg = T.redBg; border = T.red; }
          else if (isSelected) { bg = T.paper2; border = T.ink; }
          return (
            <button key={i} role="radio" aria-checked={isSelected} onClick={() => !showFeedback && onPAnswer(pqIndex, i)} disabled={showFeedback}
              tabIndex={isSelected || (pSelected === undefined && i === 0) ? 0 : -1}
              style={{ textAlign: 'left', padding: '14px 18px', border: `1px solid ${border}`, background: bg, cursor: showFeedback ? 'default' : 'pointer', fontFamily: T.serif, fontSize: 16, color, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span aria-hidden="true" style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 20, color: T.ink2, fontWeight: 500, lineHeight: 1, flexShrink: 0 }}>{['a.', 'b.', 'c.', 'd.'][i]}</span>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{opt}</span>
              {showFeedback && isCorrect && <span style={{ ...baseStyles.cap, fontSize: 9, color: T.green, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✓</span>}
              {showFeedback && isSelected && !isCorrect && <span style={{ ...baseStyles.cap, fontSize: 9, color: T.red, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✗</span>}
            </button>
          );
        })}
      </div>
      {pSelected !== undefined && (
        <div style={{ background: T.paper2, border: `1px solid ${T.ink}`, padding: '20px 24px', marginBottom: 20 }}>
          <Cap color={T.orange2} mb={8}>— Annotation</Cap>
          <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.6, color: T.ink, fontStyle: 'italic' }}>{pq.r}</p>
        </div>
      )}
      {pSelected !== undefined && (
        pqIndex < mod.practice.length - 1
          ? <Btn onClick={() => onPAnswer('next')} variant="primary" style={{ width: '100%', padding: '14px' }}>Next Question →</Btn>
          : <Btn onClick={onFinish} variant="accent" style={{ width: '100%', padding: '14px' }}>✓ Complete Module</Btn>
      )}
    </Page>
  );
};

// ─── DOMAIN GRID (used by Flashcards + Quiz pickers) ───────
const DomainGrid = ({ onSelect, getCounts }) => {
  // dynamic — one bucket per SUBTESTS key, no hardcoded coupling
  const groups = Object.fromEntries(Object.keys(SUBTESTS).map(k => [k, []]));
  Object.keys(MODULES).forEach(d => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
    groups[subtest].push(d);
  });
  return (
    <div>
      {Object.entries(groups).map(([k, domains]) => domains.length === 0 ? null : (
        <div key={k} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${T.ink}` }}>
            <Cap color={T.orange2}>{WELCOME.subareaWord} {SUBTESTS[k]?.roman}</Cap>
            <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink }}>{SUBTESTS[k]?.label}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {domains.map((d, i) => {
              const meta = getCounts ? getCounts(d) : null;
              const isLeft = i % 2 === 0;
              return (
                <button key={d} onClick={() => onSelect(d)}
                  style={{ textAlign: 'left', padding: '14px 18px', border: 'none', borderBottom: `1px solid ${T.hairline}`, borderRight: isLeft ? `1px solid ${T.hairline}` : 'none', background: T.paper3, cursor: 'pointer', fontFamily: T.serif }}>
                  <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 16, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>{d}</div>
                  {meta && <div style={{ ...baseStyles.cap, fontSize: 9, color: T.muted }}>{meta}</div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── FLASHCARDS ────────────────────────────────────────────
const Flashcards = ({ st, up }) => {
  if (!st.fcDomain) return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
        <Cap mb={12}>The Reading Cards</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em' }}>Flashcards</h2>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>Choose a domain to study its key concepts.</p>
      </header>
      <DomainGrid getCounts={d => `${MODULES[d].concepts.length} concepts`} onSelect={d => {
        const order = shuffle(MODULES[d].concepts.map((_, i) => i));
        up({ fcDomain: d, fcOrder: order, fcPos: 0, fcFlipped: false, fcKnown: [] });
      }} />
    </Page>
  );
  const mod = MODULES[st.fcDomain];
  const order = st.fcOrder.length ? st.fcOrder : mod.concepts.map((_, i) => i);
  const remaining = order.filter(idx => !st.fcKnown.includes(idx));
  const allKnown = remaining.length === 0;
  const safePos = Math.min(st.fcPos, Math.max(0, remaining.length - 1));
  const conceptIdx = remaining[safePos] ?? order[0];
  const concept = mod.concepts[conceptIdx];
  const isKnown = st.fcKnown.includes(conceptIdx);
  const advance = (delta) => {
    if (remaining.length === 0) return;
    const next = (safePos + delta + remaining.length) % remaining.length;
    up({ fcPos: next, fcFlipped: false });
  };
  return (
    <Page narrow>
      <button onClick={() => up({ fcDomain: null, fcOrder: [], fcPos: 0, fcFlipped: false, fcKnown: [] })} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 18 }}>← Choose another domain</button>
      <Cap color={T.orange2} mb={6}>{st.fcDomain}</Cap>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.muted, marginBottom: 20 }}>
        {allKnown ? `All ${order.length} cards marked known.` : `Card ${safePos + 1} of ${remaining.length} · ${st.fcKnown.length} marked known`}
      </p>
      {!allKnown && (
        <div role="button" tabIndex={0} aria-pressed={st.fcFlipped} aria-label={`Flashcard ${safePos + 1} of ${remaining.length}. Press Space or Enter to flip.`}
          onClick={() => up({ fcFlipped: !st.fcFlipped })}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); up({ fcFlipped: !st.fcFlipped }); } }}
          style={{ minHeight: 280, padding: 36, marginBottom: 20, background: st.fcFlipped ? T.paper2 : T.paper3, border: `1px solid ${T.ink}`, borderTop: `3px solid ${T.orange2}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', outline: 'none' }}>
          <Cap color={T.orange2} mb={16}>{st.fcFlipped ? '— Detail · tap or press Space to flip' : '— Concept · tap or press Space to flip'}</Cap>
          {!st.fcFlipped
            ? <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 32, color: T.ink, lineHeight: 1.2, letterSpacing: '-.01em' }}>{concept.title}</div>
            : <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, lineHeight: 1.7 }}>{concept.body}</div>}
        </div>
      )}
      {allKnown && (
        <Card style={{ textAlign: 'center', marginBottom: 20 }}>
          <Cap color={T.green} mb={8}>— Completed</Cap>
          <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink, marginTop: 8 }}>You have marked every card known. Reset the deck or choose a new domain.</p>
        </Card>
      )}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Btn onClick={() => advance(-1)} variant="ghost" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>← Prev</Btn>
        <Btn onClick={() => up({ fcFlipped: !st.fcFlipped })} variant="primary" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>Flip</Btn>
        <Btn onClick={() => advance(1)} variant="ghost" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>Next →</Btn>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => {
          if (allKnown) return;
          const nextKnown = isKnown ? st.fcKnown.filter(i => i !== conceptIdx) : [...st.fcKnown, conceptIdx];
          const nextRemaining = order.filter(idx => !nextKnown.includes(idx));
          up({ fcKnown: nextKnown, fcFlipped: false, fcPos: Math.min(safePos, Math.max(0, nextRemaining.length - 1)) });
        }} disabled={allKnown}
          style={{ ...baseStyles.cap, fontSize: 10, flex: 2, padding: '12px', border: `1px solid ${isKnown ? T.green : T.ink}`, background: isKnown ? T.greenBg : T.paper3, color: isKnown ? T.green : T.ink, cursor: allKnown ? 'default' : 'pointer' }}>
          {isKnown ? '✓ Marked known · tap to unmark' : 'Mark known'}
        </button>
        <Btn onClick={() => up({ fcOrder: shuffle(order), fcPos: 0, fcFlipped: false })} variant="ghost" style={{ flex: 1, padding: '12px', fontSize: 10 }}>Shuffle</Btn>
        <Btn onClick={() => up({ fcKnown: [], fcPos: 0, fcFlipped: false })} variant="ghost" style={{ flex: 1, padding: '12px', fontSize: 10 }}>Reset</Btn>
      </div>
    </Page>
  );
};

// ─── QUIZ PICKER + RESULTS ─────────────────────────────────
const QuizPicker = ({ pool, onStart }) => {
  const [len, setLen] = useState(10);
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
        <Cap mb={12}>The Brief Examination</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em' }}>Quick Quiz</h2>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>Choose a domain and quiz length.</p>
      </header>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, justifyContent: 'center' }}>
        {[5, 10].map(n => (
          <button key={n} onClick={() => setLen(n)}
            style={{ ...baseStyles.cap, fontSize: 11, padding: '12px 28px', border: `1px solid ${len === n ? T.ink : T.hairline}`, background: len === n ? T.paper2 : T.paper3, color: len === n ? T.ink : T.muted, cursor: 'pointer' }}>
            {n} questions
          </button>
        ))}
      </div>
      <DomainGrid getCounts={d => `${pool[d]?.length || 0} questions in pool`} onSelect={d => {
        const available = pool[d] || [];
        if (available.length === 0) return;
        const take = Math.min(len, available.length);
        onStart(d, len, shuffle(available).slice(0, take));
      }} />
    </Page>
  );
};

const QuizResults = ({ domain, qs, answers, onRetry, onPick }) => {
  const [reviewing, setReviewing] = useState(false);
  const correct = qs.filter((q, i) => answers[i] === q.c).length;
  const p = pct(correct, qs.length);
  const missed = qs.map((q, i) => ({ q, i, user: answers[i] })).filter(x => x.user !== x.q.c);
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
        <Cap mb={12}>{domain} · Quick Quiz</Cap>
        <div style={{ fontFamily: T.serif, fontSize: 64, fontWeight: 500, color: p >= 70 ? T.green : T.red, lineHeight: 1, marginBottom: 12, fontFeatureSettings: "'tnum' 1" }}>{p}%</div>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2 }}>{correct} of {qs.length} correct</p>
      </header>
      {missed.length > 0 && (
        <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Review the {missed.length} Missed</Btn>
      )}
      <Btn onClick={onRetry} variant="primary" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Retry this quiz</Btn>
      <Btn onClick={onPick} variant="ghost" style={{ width: '100%', padding: '14px' }}>← Choose another domain</Btn>
    </Page>
  );
};

// ─── CONSTRUCTED RESPONSE ──────────────────────────────────
const ConstructedResponse = ({ st, up }) => {
  const prompt = CR_PROMPTS.find(p => p.id === st.crPromptId) || CR_PROMPTS[0];
  const draftKey = `${STORAGE_KEY}-cr-draft-${prompt.id}`;
  const [draft, setDraft] = useState('');
  useEffect(() => { try { setDraft(localStorage.getItem(draftKey) || ''); } catch { setDraft(''); } }, [draftKey]);
  const saveDraft = (val) => { setDraft(val); try { localStorage.setItem(draftKey, val); } catch {} };
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const setSelf = (idx, level) => up({ crSelfScore: { ...st.crSelfScore, [idx]: level } });
  const tally = (() => { const v = Object.values(st.crSelfScore || {}); if (!v.length) return null; return v.reduce((a, x) => { a[x] = (a[x] || 0) + 1; return a; }, {}); })();
  const tab = (id, label) => {
    const active = st.crView === id;
    return (
      <button onClick={() => up({ crView: id })}
        style={{ ...baseStyles.cap, fontSize: 11, flex: 1, padding: '12px', border: `1px solid ${active ? T.ink : T.hairline}`, background: active ? T.paper2 : T.paper3, color: active ? T.ink : T.muted, cursor: 'pointer', borderBottom: active ? `3px solid ${T.orange2}` : `1px solid ${T.hairline}` }}>{label}</button>
    );
  };
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 28, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
        <Cap mb={12}>The Written Assignment</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em' }}>Constructed Response</h2>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>{WELCOME.crSubtitle || 'Case-study analysis · constructed-response practice'}</p>
      </header>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {CR_PROMPTS.map((p, i) => {
          const active = p.id === st.crPromptId;
          return (
            <button key={p.id} onClick={() => up({ crPromptId: p.id, crView: 'prompt', crSelfScore: {} })}
              style={{ flex: 1, minWidth: 240, padding: '14px 18px', border: `1px solid ${active ? T.ink : T.hairline}`, background: active ? T.paper2 : T.paper3, cursor: 'pointer', textAlign: 'left' }}>
              <Cap color={T.orange2} mb={4}>Case Study {String(i + 1).padStart(2, '0')}</Cap>
              <div style={{ fontFamily: T.serif, fontSize: 15, color: T.ink, fontWeight: 500, lineHeight: 1.3 }}>{p.title}</div>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>{tab('prompt', 'Prompt + Draft')}{tab('rubric', 'Rubric')}{tab('exemplar', 'Exemplar')}</div>

      {st.crView === 'prompt' && (
        <>
          <div style={{ marginBottom: 20, padding: '24px 28px', background: T.paper3, borderLeft: `3px solid ${T.ink}`, border: `1px solid ${T.hairline}` }}>
            <Cap color={T.orange2} mb={10}>— Scenario</Cap>
            <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.ink, whiteSpace: 'pre-wrap' }}>{prompt.scenario}</p>
          </div>
          <div style={{ marginBottom: 24, padding: '24px 28px', background: T.paper2, borderLeft: `3px solid ${T.orange2}`, border: `1px solid ${T.hairline}` }}>
            <Cap color={T.orange2} mb={10}>— Your Task</Cap>
            <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.ink, whiteSpace: 'pre-wrap' }}>{prompt.task}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <Cap color={T.orange2}>— Your Draft</Cap>
              <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, color: T.muted }}>{wordCount} words · saved locally</span>
            </div>
            <textarea value={draft} onChange={(e) => saveDraft(e.target.value)} placeholder="Compose your response here. Address each numbered part of the task. Your draft is saved automatically."
              aria-label="Draft response"
              onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${T.orange2}40`; e.target.style.borderColor = T.orange2; }}
              onBlur={(e) => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = T.ink; }}
              style={{ width: '100%', minHeight: 320, padding: '20px 24px', border: `1px solid ${T.ink}`, background: T.paper3, color: T.ink, fontSize: 17, lineHeight: 1.65, fontFamily: T.serif, resize: 'vertical', outline: 'none', transition: 'box-shadow .15s, border-color .15s' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <Btn onClick={() => up({ crView: 'rubric' })} variant="accent" style={{ flex: 1, minWidth: 160, padding: '14px' }}>Score with Rubric →</Btn>
              <Btn onClick={() => up({ crView: 'exemplar' })} variant="ghost" style={{ flex: 1, minWidth: 160, padding: '14px' }}>Compare to Exemplar →</Btn>
              <Btn onClick={() => saveDraft('')} variant="ghost" style={{ padding: '14px 20px' }}>Clear</Btn>
            </div>
          </div>
        </>
      )}

      {st.crView === 'rubric' && (
        <>
          <div style={{ marginBottom: 20, padding: '20px 24px', background: T.paper3, border: `1px solid ${T.hairline}` }}>
            <Cap color={T.orange2} mb={8}>— How to Use This Rubric</Cap>
            <p style={{ fontFamily: T.serif, fontSize: 15, color: T.ink, lineHeight: 1.6, fontStyle: 'italic' }}>For each criterion, choose the level that best describes your draft. Be honest — the goal is to identify what to revise.</p>
          </div>
          {prompt.rubric.map((r, i) => {
            const sel = st.crSelfScore?.[i];
            const Btn3 = (level, label, c, bg) => (
              <button onClick={() => setSelf(i, level)}
                style={{ ...baseStyles.cap, fontSize: 10, flex: 1, padding: '12px', border: `1px solid ${sel === level ? c : T.hairline}`, background: sel === level ? bg : T.paper3, color: sel === level ? c : T.muted, cursor: 'pointer' }}>{label}</button>
            );
            return (
              <div key={i} style={{ marginBottom: 16, padding: '20px 24px', border: `1px solid ${T.hairline}`, background: T.paper3 }}>
                <Cap color={T.orange2} mb={6}>Criterion {String(i + 1).padStart(2, '0')}</Cap>
                <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 19, color: T.ink, marginBottom: 14, letterSpacing: '-.005em' }}>{r.criterion}</h3>
                <div style={{ fontFamily: T.serif, fontSize: 14, color: T.ink, lineHeight: 1.55, marginBottom: 6 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.green, marginRight: 8 }}>Strong</span>{r.high}</div>
                <div style={{ fontFamily: T.serif, fontSize: 14, color: T.ink, lineHeight: 1.55, marginBottom: 6 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.orange2, marginRight: 8 }}>Developing</span>{r.mid}</div>
                <div style={{ fontFamily: T.serif, fontSize: 14, color: T.ink, lineHeight: 1.55, marginBottom: 14 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.red, marginRight: 8 }}>Limited</span>{r.low}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {Btn3('high', '3 · Strong', T.green, T.greenBg)}
                  {Btn3('mid', '2 · Developing', T.orange2, T.paper2)}
                  {Btn3('low', '1 · Limited', T.red, T.redBg)}
                </div>
              </div>
            );
          })}
          {tally && (
            <div style={{ padding: '20px 24px', background: T.paper2, border: `1px solid ${T.ink}` }}>
              <Cap color={T.orange2} mb={8}>— Self-Assessment</Cap>
              <p style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, marginBottom: 6 }}>
                Strong (3): <strong>{tally.high || 0}</strong> · Developing (2): <strong>{tally.mid || 0}</strong> · Limited (1): <strong>{tally.low || 0}</strong>
              </p>
              <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.muted, lineHeight: 1.5 }}>Revise any criterion you scored Developing or Limited, then compare to the exemplar response.</p>
            </div>
          )}
        </>
      )}

      {st.crView === 'exemplar' && (
        <>
          <div style={{ marginBottom: 20, padding: '20px 24px', background: T.greenBg, border: `1px solid ${T.green}` }}>
            <Cap color={T.green} mb={6}>— Exemplar Response</Cap>
            <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.ink, lineHeight: 1.55 }}>This is one strong response — not the only correct answer. Compare structure, evidence use, and how each task element is addressed.</p>
          </div>
          <div style={{ padding: '32px 36px', background: T.paper3, border: `1px solid ${T.ink}` }}>
            <p style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.7, color: T.ink, whiteSpace: 'pre-wrap' }}>{prompt.exemplar}</p>
          </div>
          <Btn onClick={() => up({ crView: 'prompt' })} variant="primary" style={{ width: '100%', marginTop: 20, padding: '14px' }}>← Back to Draft</Btn>
        </>
      )}
    </Page>
  );
};

// ─── APP ROOT ──────────────────────────────────────────────
const STORAGE_KEY = 'swd-cst-060-state-v2';
const OLD_STORAGE_KEYS = ['swd-cst-060-state-v1'];
// fields that survive page reload (skip transient quiz session + reset confirmation)
const PERSIST_FIELDS = ['phase', 'qIndex', 'answers', 'pretestScores', 'pretestAnswers', 'posttestAnswers', 'postScores', 'posttestStarted', 'completedModules', 'crPromptId'];
// transient phases can't resume after a reload (their session state isn't
// persisted) — send the user to the nearest hub instead of a crash/blank page
const PHASE_FALLBACK = { module: 'modules', quizRun: 'quizPicker', quizDone: 'quizPicker' };

export default function App() {
  const QUIZ_POOL = useMemo(() => buildQuizPool(), []);
  const [st, setSt] = useState(() => {
    const base = { ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} };
    try { OLD_STORAGE_KEYS.forEach(k => localStorage.removeItem(k)); } catch {}
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // only restore the persisted fields; ignore stale transient state
        const restored = {};
        for (const k of PERSIST_FIELDS) if (k in saved) restored[k] = saved[k];
        if (PHASE_FALLBACK[restored.phase]) restored.phase = PHASE_FALLBACK[restored.phase];
        if (['results', 'modules', 'posttest'].includes(restored.phase) && !restored.pretestScores) restored.phase = 'welcome';
        if (restored.phase === 'comparison' && !restored.postScores) restored.phase = restored.pretestScores ? 'results' : 'welcome';
        return { ...base, ...restored };
      }
    } catch {}
    return base;
  });
  const up = (patch) => setSt(p => ({ ...p, ...patch }));
  // persist milestone state on every change
  useEffect(() => {
    try {
      const persist = {};
      for (const k of PERSIST_FIELDS) if (k in st) persist[k] = st[k];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch {}
  }, [st]);
  const weak = st.pretestScores ? Object.entries(st.pretestScores.domains).filter(([, v]) => pct(v.correct, v.total) < 70).map(([d]) => d) : [];
  const handleNav = (id) => {
    const m = {
      welcome:    () => up({ phase: 'welcome',    confirmReset: false }),
      flashcards: () => up({ phase: 'flashcards', confirmReset: false }),
      quiz:       () => up({ phase: 'quizPicker', confirmReset: false, quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} }),
      // restore the saved pretest/posttest answers so re-entering doesn't show the OTHER exam's selections
      pretest:    () => up({ phase: 'pretest',    confirmReset: false, answers: { ...(st.pretestAnswers || {}) }, qIndex: 0 }),
      cresponse:  () => up({ phase: 'cresponse',  confirmReset: false }),
      results:    () => st.pretestScores && up({ phase: 'results',    confirmReset: false }),
      modules:    () => st.pretestScores && up({ phase: 'modules',    confirmReset: false }),
      posttest:   () => st.pretestScores && up({ phase: 'posttest',   confirmReset: false, answers: { ...(st.posttestAnswers || {}) }, qIndex: 0, posttestStarted: !!st.posttestStarted || !!st.postScores }),
      comparison: () => st.postScores    && up({ phase: 'comparison', confirmReset: false }),
    };
    m[id]?.();
  };
  const nav = <NavBar st={st} onNav={handleNav}
    onReset={() => up({ confirmReset: true })}
    onConfirmReset={() => {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
    }}
    onCancelReset={() => up({ confirmReset: false })} />;

  if (st.phase === 'welcome')    return <Shell nav={nav}><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {}, pretestAnswers: {} })} /></Shell>;
  if (st.phase === 'flashcards') return <Shell nav={nav}><Flashcards st={st} up={up} /></Shell>;
  if (st.phase === 'cresponse')  return <Shell nav={nav}><ConstructedResponse st={st} up={up} /></Shell>;
  if (st.phase === 'quizPicker') return <Shell nav={nav}><QuizPicker pool={QUIZ_POOL} onStart={(domain, len, qs) => up({ phase: 'quizRun', quizDomain: domain, quizLen: len, quizQs: qs, quizIdx: 0, quizAnswers: {} })} /></Shell>;
  if (st.phase === 'quizRun' && st.quizQs) return <Shell nav={nav}><QuestionScreen questions={st.quizQs} answers={st.quizAnswers} qIndex={st.quizIdx} onAnswer={(i, a) => up({ quizAnswers: { ...st.quizAnswers, [i]: a } })} onNav={(d) => up({ quizIdx: Math.max(0, Math.min(st.quizQs.length - 1, st.quizIdx + d)) })} onSubmit={() => up({ phase: 'quizDone' })} phase={`${st.quizDomain} Quiz`} /></Shell>;
  if (st.phase === 'quizDone' && st.quizQs) return <Shell nav={nav}><QuizResults domain={st.quizDomain} qs={st.quizQs} answers={st.quizAnswers} onRetry={() => up({ phase: 'quizRun', quizQs: shuffle(st.quizQs), quizIdx: 0, quizAnswers: {} })} onPick={() => up({ phase: 'quizPicker', quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} })} /></Shell>;
  if (st.phase === 'pretest')    return <Shell nav={nav}><QuestionScreen questions={PRETEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => { const next = { ...st.answers, [i]: a }; up({ answers: next, pretestAnswers: next }); }} onNav={(d) => up({ qIndex: Math.max(0, Math.min(PRETEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(PRETEST, st.answers); up({ phase: 'results', pretestScores: s, pretestAnswers: { ...st.answers } }); }} phase="Pretest" /></Shell>;
  if (st.phase === 'results')    return <Shell nav={nav}><Results scores={st.pretestScores} weakDomains={weak} sourceQuestions={PRETEST} sourceAnswers={st.pretestAnswers} onContinue={() => up({ phase: 'modules' })} /></Shell>;
  if (st.phase === 'modules')    return <Shell nav={nav}><ModuleHub domains={[...weak, ...Object.keys(MODULES).filter(d => !weak.includes(d))]} weakDomains={weak} completedModules={st.completedModules} onSelect={(d) => up({ phase: 'module', activeModule: d, modPhase: 'content', modPQIndex: 0, modPAnswers: {} })} onSkip={() => up({ phase: 'posttest', posttestStarted: false })} /></Shell>;
  if (st.phase === 'module')     return <Shell nav={nav}><LearningModule domain={st.activeModule} phase={st.modPhase} pqIndex={st.modPQIndex} pAnswers={st.modPAnswers} onBack={() => up({ phase: 'modules' })} onStartPractice={() => up({ modPhase: 'practice' })} onPAnswer={(i, a) => { if (i === 'next') { up({ modPQIndex: st.modPQIndex + 1 }); return; } up({ modPAnswers: { ...st.modPAnswers, [i]: a } }); }} onFinish={() => up({ phase: 'modules', completedModules: [...new Set([...st.completedModules, st.activeModule])] })} /></Shell>;
  if (st.phase === 'posttest')   return <Shell nav={nav}>{!st.posttestStarted ? (
    <Page narrow>
      <header style={{ textAlign: 'center', padding: '60px 0' }}>
        <Cap mb={12}>The Final Examination</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 56, color: T.ink, letterSpacing: '-.01em', marginBottom: 18 }}>The Post-Test</h2>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, color: T.ink2, lineHeight: 1.55, maxWidth: 540, margin: '0 auto 36px' }}>{POSTTEST.length} {WELCOME.posttestIntro}</p>
        <Btn onClick={() => up({ posttestStarted: true, answers: {}, posttestAnswers: {}, qIndex: 0 })} variant="primary" style={{ padding: '18px 48px' }}>Begin the Post-Test</Btn>
      </header>
    </Page>
  ) : (
    <QuestionScreen questions={POSTTEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => { const next = { ...st.answers, [i]: a }; up({ answers: next, posttestAnswers: next }); }} onNav={(d) => up({ qIndex: Math.max(0, Math.min(POSTTEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(POSTTEST, st.answers); up({ phase: 'comparison', postScores: s, posttestAnswers: { ...st.answers } }); }} phase="Post-Test" />
  )}</Shell>;
  if (st.phase === 'comparison') return <Shell nav={nav}><Results scores={st.postScores} weakDomains={[]} pretestScores={st.pretestScores} isPost={true} sourceQuestions={POSTTEST} sourceAnswers={st.posttestAnswers} onContinue={() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
  }} /></Shell>;
  // unknown phase (e.g. stale persisted value) — land on home, never a blank page
  return <Shell nav={nav}><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {}, pretestAnswers: {} })} /></Shell>;
}

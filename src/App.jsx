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
  FOUND:    { label:'Foundations',              roman:'I' },
  STUDENTS: { label:'Knowledge of Students',    roman:'II' },
  ASSESS:   { label:'Assessment & IEP',         roman:'III' },
  INSTRUCT: { label:'Instruction',              roman:'IV' },
};

const WELCOME = {
  imprint: 'New York State · Content Specialty Test',
  triBand: ['A Course in Five Phases', 'No. 060 · Edition I'],
  title: { pre: 'Students', italic: 'with', post: 'Disabilities' },
  subtitle: 'A complete preparation course covering all four subareas of the New York State examination, with the constructed-response written assignment.',
  alignment: ['NYSED Part 200', 'IDEA', 'Endrew F. (2017)'],
  steps: [
    ['Take the Pretest', 'Thirty-two questions across all four subareas establish your baseline.'],
    ['Review Your Results', 'A domain-by-domain analysis shows precisely where to focus.'],
    ['Study Your Weak Areas', 'Sixteen deep-dive modules with concept summaries and practice questions.'],
    ['Practice the Constructed Response', 'Two case studies with rubric, exemplar, and an autosaving draft workspace.'],
    ['Take the Post-Test', 'Measure your growth and confirm readiness with thirty-two fresh questions.'],
  ],
  subareasHeading: 'The Four Subareas',
  subareaWord: 'Subarea',
  posttestIntro: 'questions across the four subareas, all fresh. Demonstrate the growth of your study.',
  colophon: 'Set in EB Garamond. Composed for the New York State teaching candidate, in the manner of a Penguin Classic. Aligned to NYSED Part 200 and the Individuals with Disabilities Education Act.',
};

const PRETEST = [
  {s:'FOUND',d:'Special Education Law & Policy',
   q:'Under IDEA, a student receiving special education must be educated in the:',
   a:['Most restrictive environment necessary for safety','Least restrictive environment in which the student can make progress with appropriate supports','Resource room for at least 50% of the school day','Separate special education building'],
   c:1,r:'IDEA mandates the LRE: students with disabilities are educated with non-disabled peers to the maximum extent appropriate, with the general education classroom presumed first.'},
  {s:'FOUND',d:'Special Education Law & Policy',
   q:'A 7-year-old needs accommodations (extra bathroom breaks, extended time) but does NOT require specially designed instruction. The most appropriate plan is:',
   a:['An IEP under IDEA','A Section 504 plan','A behavior intervention plan','No formal plan is required'],
   c:1,r:'Section 504 covers students whose disability substantially limits a major life activity but who do not need specially designed instruction.'},
  {s:'FOUND',d:'The IEP Process',
   q:'A NY teacher suspects a 2nd-grade student has a learning disability. The FIRST step under NYSED Part 200 is to:',
   a:['Refer directly to the CSE','Implement and document evidence-based interventions through the school tiered support process','Conduct a formal psychoeducational evaluation','Notify parents of disability'],
   c:1,r:'NYSED expects schools to implement and document tiered, evidence-based interventions (RtI/MTSS) before special education referral.'},
  {s:'FOUND',d:'The IEP Process',
   q:'In NY, the team that determines special education eligibility for school-age students is the:',
   a:['IEP Committee','Committee on Preschool Special Education (CPSE)','Committee on Special Education (CSE)','Multidisciplinary Evaluation Team'],
   c:2,r:'In NY, the CSE is responsible for evaluation, eligibility, and IEP development for students aged 5 to 21. The CPSE serves children 3 to 5.'},
  {s:'FOUND',d:'Roles & Family Partnerships',
   q:'A parent disagrees with the IEP team recommended placement. Under IDEA procedural safeguards, the parent has the right to:',
   a:['Veto the placement decision','Request mediation, file a state complaint, or request a due process hearing','Be reimbursed for private school tuition immediately','Stop receiving special education services'],
   c:1,r:'IDEA procedural safeguards give parents the right to dispute resolution through mediation, state complaints, or due process hearings.'},
  {s:'FOUND',d:'Roles & Family Partnerships',
   q:'Prior Written Notice (PWN) must be provided to parents:',
   a:['Only at initial evaluation','Whenever the school proposes or refuses to initiate or change identification, evaluation, placement, or FAPE','Only when removed from special education','Only at annual review'],
   c:1,r:'PWN is required any time a school proposes or refuses to initiate or change identification, evaluation, placement, or FAPE provision.'},
  {s:'FOUND',d:'History, Ethics & Equity',
   q:'A teacher notices that students from a particular cultural and linguistic background are referred for special education at much higher rates than peers. This pattern is called:',
   a:['Differentiated instruction','Disproportionality (overrepresentation)','Universal Design for Learning','Response to Intervention'],
   c:1,r:'Disproportionality refers to over- or under-representation of a racial, cultural, or linguistic group in special education.'},
  {s:'FOUND',d:'History, Ethics & Equity',
   q:'The 1975 federal law (originally PL 94-142) that first guaranteed FAPE was:',
   a:['Section 504','The Education for All Handicapped Children Act','The Americans with Disabilities Act','Every Student Succeeds Act'],
   c:1,r:'PL 94-142 (EAHCA, 1975) was the foundation of modern special education law and was reauthorized as IDEA in 1990.'},
  {s:'STUDENTS',d:'Specific Learning Disabilities',
   q:'A 4th-grade student decodes accurately but reads very slowly, word by word, and has difficulty with comprehension. The student is most likely struggling with:',
   a:['Phonemic awareness','Reading fluency, which is impacting comprehension','Phonics knowledge','Print awareness'],
   c:1,r:'Accurate but slow, choppy reading without prosody indicates a fluency deficit. Weak fluency drains cognitive resources from comprehension.'},
  {s:'STUDENTS',d:'Specific Learning Disabilities',
   q:'A characteristic that distinguishes dyslexia from a more general reading delay is:',
   a:['Low overall intellectual ability','Unexpectedly poor word-level reading and decoding given otherwise typical cognitive abilities','Difficulty only with reading comprehension','Behavior problems during reading'],
   c:1,r:'Dyslexia is unexpected difficulty with word recognition and decoding despite typical cognitive ability.'},
  {s:'STUDENTS',d:'Autism Spectrum Disorder',
   q:'According to DSM-5/IDEA criteria, the two core diagnostic domains of Autism Spectrum Disorder are:',
   a:['Cognitive impairment and aggression','Persistent deficits in social communication AND restricted, repetitive patterns of behavior','Hyperactivity and inattention','Anxiety and sensory processing differences'],
   c:1,r:'ASD requires evidence in BOTH domains: social communication/interaction deficits AND restricted/repetitive behaviors.'},
  {s:'STUDENTS',d:'Autism Spectrum Disorder',
   q:'A 1st-grade student with ASD becomes overwhelmed during transitions. The MOST appropriate proactive support is:',
   a:['Punish for not transitioning','Provide a visual schedule with clear warnings before transitions','Eliminate all transitions','Have the student sit out during transitions'],
   c:1,r:'Visual schedules and predictable transition warnings reduce anxiety for many students with ASD.'},
  {s:'STUDENTS',d:'Emotional Disturbance & ADHD',
   q:'The diagnostic criteria for ADHD require that symptoms:',
   a:['Are present only at school','Are present in two or more settings and impair functioning','Began after age 12','Are caused by a medical condition'],
   c:1,r:'DSM-5 ADHD criteria require symptoms in two or more settings, onset before age 12, and clear functional impairment.'},
  {s:'STUDENTS',d:'Emotional Disturbance & ADHD',
   q:'Under IDEA, the category Emotional Disturbance requires that the condition:',
   a:['Be temporary and situational','Adversely affect educational performance over a long period of time and to a marked degree','Result from peer conflict','Always include physical aggression'],
   c:1,r:'IDEA defines Emotional Disturbance as exhibiting characteristics over a long period of time and to a marked degree that adversely affects educational performance.'},
  {s:'STUDENTS',d:'ID, DD, OHI & Sensory',
   q:'A student qualifies under the IDEA category Other Health Impairment (OHI). This category most commonly includes students with:',
   a:['Specific learning disabilities','Chronic or acute health problems such as ADHD, asthma, epilepsy, or Tourette that limit alertness or strength','Cognitive impairments only','Speech delays only'],
   c:1,r:'OHI covers students with limited strength, vitality, or alertness due to chronic/acute health problems. ADHD is most commonly served under OHI.'},
  {s:'STUDENTS',d:'ID, DD, OHI & Sensory',
   q:'A student who is deaf or hard of hearing benefits MOST from instruction that:',
   a:['Relies heavily on auditory lectures','Uses visual supports, captioning, and the preferred mode of communication','Avoids any group work','Removes all written text'],
   c:1,r:'Effective instruction emphasizes visual access (captioning, written instructions, ASL if appropriate) and preferred communication mode.'},
  {s:'ASSESS',d:'Assessment Types & Purposes',
   q:'A teacher gives weekly oral reading fluency probes and graphs the words-correct-per-minute. This is an example of:',
   a:['A norm-referenced assessment','Curriculum-based measurement (CBM) used for progress monitoring','A diagnostic assessment','A summative state assessment'],
   c:1,r:'CBM uses brief, repeated, standardized probes to monitor progress against a goal line.'},
  {s:'ASSESS',d:'Assessment Types & Purposes',
   q:'A norm-referenced test compares performance to:',
   a:['A specific learning standard','A nationally representative sample of same-age peers','The student own previous performance','A teacher personal benchmark'],
   c:1,r:'Norm-referenced tests rank a student against the performance of a representative norm sample (percentile rank, standard score).'},
  {s:'ASSESS',d:'Writing Measurable IEP Goals',
   q:'Which annual goal is MOST measurable?',
   a:['Maria will improve her reading.','Maria will work hard in reading group.','Given a 2nd-grade passage, Maria will read aloud at 80 correct words per minute with 95% accuracy on 3 consecutive weekly probes by June 2026.','Maria will become a better reader.'],
   c:2,r:'Measurable goals specify CONDITIONS, LEARNER, BEHAVIOR, CRITERION, and TIMEFRAME.'},
  {s:'ASSESS',d:'Writing Measurable IEP Goals',
   q:'The Present Levels (PLAAFP) section of an IEP should:',
   a:['Describe only deficits','Provide baseline of academic achievement and functional performance and describe how the disability affects involvement in the general curriculum','List only test scores','Set the annual goals'],
   c:1,r:'PLAAFP must include current academic AND functional performance, baseline data, AND a statement of how the disability affects involvement in the general curriculum.'},
  {s:'ASSESS',d:'FBA & BIP',
   q:'A teacher conducts an ABC analysis and finds that a student screaming during math reliably results in being sent to the hallway. The function is most likely:',
   a:['Sensory/automatic reinforcement','Escape/avoidance of the math task','Access to attention from peers','Access to a tangible item'],
   c:1,r:'Being sent to the hallway removes the student from the math task. If the screaming reliably produces this and increases over time, escape is the maintaining function.'},
  {s:'ASSESS',d:'FBA & BIP',
   q:'When designing a Behavior Intervention Plan, the replacement behavior should:',
   a:['Be easier to perform than the problem behavior and serve the SAME function','Be more difficult so the student is challenged','Serve a different function','Be selected based only on what the teacher prefers'],
   c:0,r:'A functionally equivalent replacement must serve the same function AND be at least as efficient and easy as the problem behavior.'},
  {s:'ASSESS',d:'Progress Monitoring & Transition',
   q:'In NY, transition planning must be in the IEP no later than the IEP in effect when the student is age:',
   a:['12','15','16','18'],
   c:1,r:'In NY, transition components must be in the IEP no later than the first IEP in effect when the student turns 15 (federal IDEA: age 16; NY is more stringent).'},
  {s:'ASSESS',d:'Progress Monitoring & Transition',
   q:'After 6 weeks of monitoring, a student data points consistently fall below the goal line. The teacher should:',
   a:['Continue unchanged','Lower the goal','Use a data-decision rule to modify the instructional approach','Wait until the annual review'],
   c:2,r:'Standard data-decision rules signal that an instructional change is needed when data consistently falls below the goal line.'},
  {s:'INSTRUCT',d:'Evidence-Based Instruction & UDL',
   q:'A core principle of Universal Design for Learning (UDL) is to:',
   a:['Provide one method for all','Provide multiple means of engagement, representation, and action/expression','Eliminate specially designed instruction','Match every student to a single learning style'],
   c:1,r:'UDL three principles: multiple means of engagement (the WHY), representation (the WHAT), and action/expression (the HOW).'},
  {s:'INSTRUCT',d:'Evidence-Based Instruction & UDL',
   q:'Explicit, systematic instruction in reading is BEST characterized by:',
   a:['Discovery learning','Clear modeling, guided practice with immediate corrective feedback, and cumulative review','Whole-language immersion only','Independent silent reading'],
   c:1,r:'Explicit instruction uses I-do/We-do/You-do (modeling, guided practice, independent practice) with immediate feedback and cumulative review.'},
  {s:'INSTRUCT',d:'Accommodations vs. Modifications',
   q:'Allowing a student to take a test orally instead of in writing while testing the SAME content is best classified as:',
   a:['A modification (changes what is measured)','An accommodation (changes how the student accesses content but not what is measured)','Differentiated instruction','A program adjustment'],
   c:1,r:'Accommodations change HOW the student accesses material without changing WHAT is being measured.'},
  {s:'INSTRUCT',d:'Accommodations vs. Modifications',
   q:'Reducing the number of math problems on a test from 20 to 10 (same skill expectations) is BEST described as:',
   a:['Modification of the curriculum standard','An accommodation, because the underlying content is unchanged','A behavior intervention','A related service'],
   c:1,r:'When the SAME skills are assessed and the change is to quantity/format, it is generally an accommodation.'},
  {s:'INSTRUCT',d:'Behavior Support & PBIS',
   q:'A school-wide PBIS framework is BEST described as:',
   a:['Reactive consequences','A multi-tiered system that explicitly teaches and reinforces expected behaviors','Reward chart for individual students only','A program of suspensions and detentions'],
   c:1,r:'PBIS is a proactive, multi-tiered framework that defines, teaches, and reinforces expected behaviors at universal, targeted, and intensive levels.'},
  {s:'INSTRUCT',d:'Behavior Support & PBIS',
   q:'A teacher gives specific praise immediately after a student raises their hand. Hand-raising increases. This illustrates:',
   a:['Punishment','Positive reinforcement','Negative reinforcement','Extinction'],
   c:1,r:'Adding a stimulus (specific praise) after a behavior that increases is positive reinforcement.'},
  {s:'INSTRUCT',d:'Co-Teaching, AT & Related Services',
   q:'Two teachers teach a single lesson together: one delivers main instruction while the other circulates and supports. This co-teaching model is:',
   a:['Parallel teaching','Station teaching','One teach, one assist','Team teaching'],
   c:2,r:'In one-teach/one-assist, one teacher leads instruction while the other monitors and provides support.'},
  {s:'INSTRUCT',d:'Co-Teaching, AT & Related Services',
   q:'Assistive technology (AT) under IDEA must be considered:',
   a:['Only for physical disabilities','For every student with an IEP','Only when parents request it','Only at the high school level'],
   c:1,r:'IDEA requires the IEP team to consider assistive technology for EVERY student with an IEP, regardless of category.'},
];

const POSTTEST = [
  {s:'FOUND',d:'Special Education Law & Policy',
   q:'Free Appropriate Public Education (FAPE) under IDEA requires that:',
   a:['Every student receive identical services','Each eligible student receive special education and related services designed to meet unique needs at no cost to parents','Parents pay for related services','Services be provided only in separate classrooms'],
   c:1,r:'FAPE is individualized: services must be designed to meet the student UNIQUE needs (per IEP) and provided at public expense.'},
  {s:'FOUND',d:'Special Education Law & Policy',
   q:'Under LRE, the IEP team should FIRST consider:',
   a:['A separate special education school','A self-contained special class','The general education classroom with supplementary aids and services','Homebound instruction'],
   c:2,r:'LRE creates a presumption that the general education classroom with supplementary aids and services is the starting point.'},
  {s:'FOUND',d:'The IEP Process',
   q:'The CSE must reconvene a student IEP at minimum:',
   a:['Every month','Every 6 months','Annually','Every 3 years'],
   c:2,r:'IEPs must be reviewed AT LEAST annually. A reevaluation must occur at least every 3 years (triennial).'},
  {s:'FOUND',d:'The IEP Process',
   q:'Required IEP team members include:',
   a:['Only the special education teacher and parent','The parent, the student (when appropriate), at least one general education teacher (if applicable), at least one special education teacher, a district representative, and someone who can interpret evaluation results','Only school administrators','Only the CSE chair'],
   c:1,r:'IDEA requires a multidisciplinary team for IEP development.'},
  {s:'FOUND',d:'Roles & Family Partnerships',
   q:'A family home language is not English. To meaningfully participate in the IEP meeting, the school must provide:',
   a:['Translated materials only after the meeting','An interpreter and translated documents in the family native language','English-only materials','No additional supports'],
   c:1,r:'IDEA and Title VI require meaningful access for families with limited English proficiency, including interpreters and translated documents.'},
  {s:'FOUND',d:'Roles & Family Partnerships',
   q:'A teacher should communicate with families of students with disabilities by:',
   a:['Only sending negative reports','Sharing positive updates and progress regularly, in addition to addressing concerns','Avoiding contact unless legally required','Communicating only through formal IEP meetings'],
   c:1,r:'Effective family partnerships involve regular, two-way, asset-based communication.'},
  {s:'FOUND',d:'History, Ethics & Equity',
   q:'A teacher learns that referrals from an English Learner program are unusually high. The MOST appropriate first response is to:',
   a:['Continue the current practice','Examine whether the difficulties reflect language acquisition rather than a disability and ensure assessments are conducted in the dominant language','Refer all EL students immediately','Reduce all referrals'],
   c:1,r:'Disproportionate identification of ELs requires distinguishing language acquisition from a disability.'},
  {s:'FOUND',d:'History, Ethics & Equity',
   q:'Confidentiality of student records under FERPA and IDEA means PII may be shared:',
   a:['With anyone in the school','Only with school personnel who have a legitimate educational interest, with parental consent for outside parties','Freely with the press','With other parents'],
   c:1,r:'FERPA/IDEA limit access to school personnel with a legitimate educational interest and require parental consent for most external disclosures.'},
  {s:'STUDENTS',d:'Specific Learning Disabilities',
   q:'A student with dysgraphia would MOST likely benefit from:',
   a:['Increased silent reading','Word processing software, graphic organizers, and reduced copying demands','Removing all writing','Verbal-only instruction'],
   c:1,r:'Dysgraphia affects handwriting and written expression. AT, graphic organizers, scaffolds, and reduced copying are effective supports.'},
  {s:'STUDENTS',d:'Specific Learning Disabilities',
   q:'A student strong in math reasoning but who confuses operations and forgets math facts may have:',
   a:['Dyslexia','Dyscalculia','ADHD only','Auditory processing disorder'],
   c:1,r:'Dyscalculia is a SLD in mathematics, with difficulty in number sense, fact recall, and operation confusion despite intact reasoning.'},
  {s:'STUDENTS',d:'Autism Spectrum Disorder',
   q:'Which strategy is MOST aligned with evidence-based practice for students with ASD?',
   a:['Unstructured social activities','Video modeling, social narratives, visual supports, and structured teaching','Verbal lectures only','Heavy reliance on figurative language'],
   c:1,r:'EBPs for ASD include video modeling, social narratives, visual supports, structured teaching, and ABA-based procedures.'},
  {s:'STUDENTS',d:'Autism Spectrum Disorder',
   q:'A student with ASD takes the phrase "all ears" literally and becomes confused. This best illustrates difficulty with:',
   a:['Phonics','Pragmatic and figurative language','Decoding','Sight words'],
   c:1,r:'Difficulty interpreting idioms is common in ASD and reflects pragmatic language differences.'},
  {s:'STUDENTS',d:'Emotional Disturbance & ADHD',
   q:'A student with ADHD, predominantly inattentive presentation, is most likely to:',
   a:['Be physically hyperactive','Have difficulty sustaining attention, organizing tasks, and following multi-step directions','Be aggressive','Have low overall intelligence'],
   c:1,r:'The inattentive presentation features attention difficulty, distractibility, organization problems, and forgetfulness without prominent hyperactivity.'},
  {s:'STUDENTS',d:'Emotional Disturbance & ADHD',
   q:'For a student with internalizing emotional difficulties (anxiety, depression), an effective classroom support is:',
   a:['Public reprimands','Predictable routines, advance warning of changes, private check-ins, and teaching coping strategies','Removing the student from class','Increasing high-stakes assessments'],
   c:1,r:'Internalizing difficulties benefit from predictability, low-key check-ins, and explicit instruction in coping/self-regulation skills.'},
  {s:'STUDENTS',d:'ID, DD, OHI & Sensory',
   q:'A 5th-grader has a moderate intellectual disability. Instructional planning should:',
   a:['Use only the same grade-level texts as peers without supports','Use chronologically age-appropriate materials with accessible content, focus on functional and academic skills, and provide repeated practice','Skip academic content','Use kindergarten materials'],
   c:1,r:'Best practice uses age-appropriate materials, accessible content, functional and academic skills, and repeated practice with explicit instruction.'},
  {s:'STUDENTS',d:'ID, DD, OHI & Sensory',
   q:'A student with a visual impairment may benefit from:',
   a:['Reduced font size and crowded layouts','Braille, screen readers, large print, or tactile graphics chosen with a Teacher of the Visually Impaired (TVI)','Removing all print','Standing far from displays'],
   c:1,r:'Supports are individualized based on functional vision and learning needs, often with TVI input.'},
  {s:'ASSESS',d:'Assessment Types & Purposes',
   q:'A formative assessment is BEST described as:',
   a:['A high-stakes end-of-year test','Ongoing assessment used to inform and adjust instruction in real time','A test that compares students nationally','A test only used for IEP eligibility'],
   c:1,r:'Formative assessment is FOR learning: ongoing checks (exit tickets, CFUs, brief probes) used to adjust instruction in real time.'},
  {s:'ASSESS',d:'Assessment Types & Purposes',
   q:'When evaluating an English Learner suspected of having a disability, the assessor must:',
   a:['Use English-only standardized tests','Select assessment materials that are not racially or culturally discriminatory and provide them in the language and form most likely to yield accurate information','Skip evaluation','Rely solely on parent report'],
   c:1,r:'IDEA mandates non-discriminatory evaluation: assessments in the native language unless not feasible, with valid tools.'},
  {s:'ASSESS',d:'Writing Measurable IEP Goals',
   q:'A short-term objective on an IEP serves to:',
   a:['Replace the annual goal','Break the annual goal into intermediate, measurable steps','Be optional','Substitute for the present level statement'],
   c:1,r:'Short-term objectives describe intermediate steps between the present level and the annual goal.'},
  {s:'ASSESS',d:'Writing Measurable IEP Goals',
   q:'Which of the following is the MOST measurable behavior?',
   a:['Will understand fractions','Will be more responsible','Will solve 4 of 5 single-digit addition problems correctly with manipulatives','Will try harder in math'],
   c:2,r:'Observable, countable behaviors with clear criteria are measurable.'},
  {s:'ASSESS',d:'FBA & BIP',
   q:'The four primary functions of behavior commonly identified in an FBA are:',
   a:['Anger, sadness, fear, joy','Attention, escape/avoidance, access to tangibles, and sensory/automatic reinforcement','Aggression, withdrawal, defiance, compliance','Verbal, nonverbal, written, gestural'],
   c:1,r:'FBA identifies the maintaining function: attention, escape/avoidance, tangibles, or automatic/sensory reinforcement.'},
  {s:'ASSESS',d:'FBA & BIP',
   q:'A high-quality BIP includes which of the following components?',
   a:['Only consequence strategies','Antecedent strategies, teaching of replacement behaviors, reinforcement of replacement behaviors, and response strategies','Punishment procedures only','A list of the diagnoses'],
   c:1,r:'A BIP is multi-component: antecedent, replacement teaching, reinforcement, and response strategies, grounded in FBA findings.'},
  {s:'ASSESS',d:'Progress Monitoring & Transition',
   q:'A measurable post-secondary goal in transition planning must address which areas?',
   a:['Education/training and employment (and independent living when appropriate)','Only employment','Only social skills','Only college attendance'],
   c:0,r:'IDEA requires measurable post-secondary goals in (1) education/training, (2) employment, and (3) independent living when appropriate.'},
  {s:'ASSESS',d:'Progress Monitoring & Transition',
   q:'Self-determination skills in transition planning include:',
   a:['Following teacher directives without question','Goal-setting, decision-making, self-advocacy, and choice-making','Memorization of facts','Compliance with all rules'],
   c:1,r:'Self-determination empowers students to direct their own lives via choice-making, decision-making, problem-solving, goal-setting, self-advocacy, and self-regulation.'},
  {s:'INSTRUCT',d:'Evidence-Based Instruction & UDL',
   q:'Scaffolding instruction means:',
   a:['Removing all challenge','Providing temporary supports that allow access to challenging tasks, then gradually fading the supports','Providing the same level of support indefinitely','Doing the work for the student'],
   c:1,r:'Scaffolding (Vygotsky/ZPD) provides temporary supports that are systematically faded as the student gains independence.'},
  {s:'INSTRUCT',d:'Evidence-Based Instruction & UDL',
   q:'The "I do, We do, You do" instructional sequence is associated with:',
   a:['Discovery learning','Explicit, gradual release of responsibility','Pure inquiry-based learning','Standardized testing'],
   c:1,r:'Gradual release of responsibility (modeling, guided practice, independent practice) is the hallmark of explicit instruction.'},
  {s:'INSTRUCT',d:'Accommodations vs. Modifications',
   q:'A modification (as opposed to an accommodation) typically:',
   a:['Changes only how the student accesses material','Changes the actual standard, content, or expectation being measured','Is the same as a related service','Is required for every student with a disability'],
   c:1,r:'Modifications change the WHAT (standard/content/expectation). Accommodations change the HOW (access/response).'},
  {s:'INSTRUCT',d:'Accommodations vs. Modifications',
   q:'Which is an example of differentiation by PROCESS?',
   a:['Allowing a student to demonstrate learning through a poster instead of an essay','Offering small-group reteach using a multi-sensory strategy while others work in stations','Reducing the number of test items','Providing a graphic organizer'],
   c:1,r:'Differentiation by process varies HOW students learn (small group vs. independent, multi-sensory vs. traditional).'},
  {s:'INSTRUCT',d:'Behavior Support & PBIS',
   q:'Pre-correction is BEST described as:',
   a:['Punishing a student before misbehavior','Providing a brief reminder of the expected behavior just before a known triggering situation','Ignoring problem behavior','Suspending the student'],
   c:1,r:'Pre-correction is a proactive antecedent strategy: cue the expected behavior immediately before a known triggering situation.'},
  {s:'INSTRUCT',d:'Behavior Support & PBIS',
   q:'When a previously reinforced behavior no longer produces reinforcement and decreases over time, this is:',
   a:['Punishment','Negative reinforcement','Extinction','Shaping'],
   c:2,r:'Extinction is discontinuation of reinforcement for a previously reinforced behavior, leading to its decrease.'},
  {s:'INSTRUCT',d:'Co-Teaching, AT & Related Services',
   q:'In parallel teaching, co-teachers:',
   a:['Take turns teaching the whole class','Each teach the same content to half of the class simultaneously','One teaches while the other observes','Teach completely different topics'],
   c:1,r:'Parallel teaching: class split in half, both teachers teach the SAME content simultaneously, lowering the student-teacher ratio.'},
  {s:'INSTRUCT',d:'Co-Teaching, AT & Related Services',
   q:'A non-verbal student uses an iPad with a symbol-based app to communicate. This is an example of:',
   a:['A related service only','Augmentative and alternative communication (AAC), a form of assistive technology','A modification of curriculum','A behavior intervention'],
   c:1,r:'AAC includes any system (low- or high-tech) that supplements or replaces speech. AAC is a form of assistive technology under IDEA.'},
];

const MODULES = {
  'Special Education Law & Policy': {
    icon:'⚖️',
    concepts:[
      {title:'IDEA & Its Six Principles',body:'IDEA governs special education. Six principles: (1) FAPE, (2) Appropriate Evaluation, (3) IEP, (4) LRE, (5) Parent/Student Participation, (6) Procedural Safeguards.'},
      {title:'IDEA vs. Section 504 vs. ADA',body:'IDEA: special ed for ages 3-21 with IEP and specially designed instruction. Section 504: civil rights, broader disability definition, 504 plan with accommodations. ADA: civil rights extending 504 to all settings.'},
      {title:'NY Part 200',body:'NYSED Part 200 implements IDEA in NY: 60 school days for evaluation, CSE/CPSE structure, transition planning at age 15 (not federal age 16).'},
      {title:'LRE Continuum',body:'General education classroom is the presumed first placement, with supplementary aids and services. Continuum includes consultant teacher, integrated co-teaching, resource room, special class, separate school, residential, hospital/home.'},
    ],
    practice:[
      {q:'Which is NOT one of the six principles of IDEA?',a:['FAPE','LRE','Standardized Curriculum','Parent Participation'],c:2,r:'IDEA principles are FAPE, Appropriate Evaluation, IEP, LRE, Parent/Student Participation, and Procedural Safeguards.'},
      {q:'A student needs preferential seating and extra time but does NOT require specially designed instruction. The student would most likely receive:',a:['An IEP under IDEA','A 504 plan','No plan','A BIP'],c:1,r:'Section 504 covers students with accommodations needs but no specially designed instruction.'},
      {q:'In NY, the regulation that implements IDEA is:',a:['Title IX','Part 200','ADA','ESSA'],c:1,r:'NYSED Part 200 implements IDEA in NY with NY-specific timelines and requirements.'},
    ]
  },
  'The IEP Process': {
    icon:'📋',
    concepts:[
      {title:'Steps from Referral to IEP',body:'(1) Pre-referral interventions documented. (2) Referral to CSE. (3) Parent consent. (4) Evaluation within 60 school days (NY). (5) Eligibility. (6) IEP within 30 days of eligibility. (7) Annual review, triennial reevaluation.'},
      {title:'Required IEP Components',body:'Present Levels (PLAAFP), Measurable Annual Goals, Special Education and Related Services, Supplementary Aids/Services, Modifications, Assessment Participation, LRE statement, Transition Plan (age 15 in NY), Progress Reporting.'},
      {title:'CSE vs. CPSE',body:'CPSE: ages 3-5 preschool. CSE: ages 5-21 school-age. Subcommittees may handle routine reviews.'},
      {title:'Reevaluation Rules',body:'A reevaluation must occur AT LEAST every 3 years (triennial), but no more than once per year unless agreed.'},
    ],
    practice:[
      {q:'In NY, the timeline from receipt of parent consent to completion of an initial evaluation is:',a:['30 calendar days','60 school days','60 calendar days','90 school days'],c:1,r:'NYSED Part 200 requires evaluations within 60 SCHOOL days of consent.'},
      {q:'Which is a required IEP component?',a:['Home address only','Measurable annual goals based on present levels','Lesson plans','Discipline incident log'],c:1,r:'Measurable annual goals based on the PLAAFP are required in every IEP.'},
      {q:'A student turns 5 in November. Which committee is responsible?',a:['CPSE only','CSE','Both','Neither'],c:1,r:'Once school-age, the CSE assumes responsibility. CPSE serves children 3-5 in preschool.'},
    ]
  },
  'Roles & Family Partnerships': {
    icon:'🤝',
    concepts:[
      {title:'Procedural Safeguards',body:'Parents must receive written notice of safeguards at least once per year. Includes IEE, PWN, mediation, due process, state complaint, surrogate parents, stay-put.'},
      {title:'Prior Written Notice (PWN)',body:'Required a reasonable time before the school proposes or refuses to initiate or change identification, evaluation, placement, or FAPE provision. Must describe action, reasons, options considered, evaluation data, and parent rights.'},
      {title:'Family Engagement',body:'Effective partnerships are reciprocal, asset-based, and culturally responsive. Communicate strengths AND concerns. Provide interpreters and translated documents.'},
      {title:'Confidentiality (FERPA + IDEA)',body:'PII may only be shared with school personnel with a legitimate educational interest, or with parental consent. Records must be maintained securely.'},
    ],
    practice:[
      {q:'A school decides NOT to evaluate a student despite a parent referral. The parent must receive:',a:['Nothing','Prior Written Notice explaining the refusal and parent rights','A verbal explanation only','A statement at the next IEP'],c:1,r:'PWN is required when the school PROPOSES or REFUSES to initiate or change identification, evaluation, placement, or FAPE.'},
      {q:'A parent disagrees with a school evaluation. They have the right to:',a:['Refuse all services','Request an IEE at public expense','Sue immediately','Move to a different school'],c:1,r:'Parents may request an IEE at public expense; the school must fund it or initiate due process to defend its evaluation.'},
      {q:'Sharing a student IEP with a coach who has no instructional role would likely violate:',a:['IDEA only','FERPA confidentiality and IDEA','No law','Title IX'],c:1,r:'Without a legitimate educational interest, sharing PII violates FERPA/IDEA confidentiality.'},
    ]
  },
  'History, Ethics & Equity': {
    icon:'🌐',
    concepts:[
      {title:'Key Historical Milestones',body:'Brown v. Board (1954). PARC v. PA (1971) and Mills v. DC (1972) established right to education. PL 94-142 (1975) became EAHCA, then IDEA (1990, 1997, 2004). Endrew F. (2017): IEPs must enable progress appropriate to the child circumstances.'},
      {title:'Disproportionality',body:'Over- or under-representation of a racial, ethnic, or linguistic group in identification, restrictive placement, or discipline. NYSED-identified districts must use 15% of IDEA funds for early intervening services and review practices.'},
      {title:'Culturally Responsive Special Education',body:'Distinguish disability from cultural/linguistic difference. Use assessments in the dominant language. Engage families using their cultural lens. Examine discipline, referral, and identification data for disparate impact.'},
      {title:'Professional Ethics',body:'CEC, BACB codes. Core obligations: best interest of student, confidentiality, evidence-based practices, family collaboration, avoid dual relationships, mandated reporting.'},
    ],
    practice:[
      {q:'Endrew F. v. Douglas County (2017) held that an IEP must be:',a:['Maximally beneficial','Reasonably calculated to enable the child to make progress appropriate in light of circumstances','Identical to a non-disabled peer IEP','Whatever parents request'],c:1,r:'Endrew F. raised the FAPE standard above merely-more-than-de-minimis.'},
      {q:'A district finds Black students placed in separate classes at 3x other groups. This is:',a:['Equity in placement','Disproportionality in restrictive placement','Appropriate identification','LRE compliance'],c:1,r:'Disproportionality includes overrepresentation in restrictive placements.'},
      {q:'A culturally responsive evaluation of an EL with suspected SLD would:',a:['Use English-only norm tests','Assess in the dominant language and consider language acquisition factors','Skip evaluation','Rely on a translator only at one meeting'],c:1,r:'Non-discriminatory evaluation requires native-language assessment and distinction between language acquisition and disability.'},
    ]
  },
  'Specific Learning Disabilities': {
    icon:'📖',
    concepts:[
      {title:'IDEA Definition of SLD',body:'A disorder in basic psychological processes involved in understanding/using language that may manifest as imperfect ability to listen, think, speak, read, write, spell, or do math. Includes dyslexia, dyscalculia, dysgraphia. Excludes difficulty primarily due to vision/hearing/motor, ID, ED, or environmental disadvantage.'},
      {title:'Identification: RtI vs. Discrepancy',body:'Severe ability/achievement discrepancy (older) OR Response-to-Intervention (failure to respond to research-based interventions). NY allows both; RtI is preferred when documented.'},
      {title:'Reading Profiles',body:'Dyslexia: word-level decoding/fluency difficulty rooted in phonological processing. Specific reading comprehension deficit: decodes well but struggles with comprehension. Mixed: both. Most SLD-reading has a phonological core deficit.'},
      {title:'Effective Instruction',body:'Structured Literacy / Orton-Gillingham: explicit, systematic, multi-sensory, cumulative phonics. Comprehension: explicit strategy instruction. Math: concrete-representational-abstract sequence, schema-based instruction.'},
    ],
    practice:[
      {q:'An SLD identification under IDEA may NOT be made if the difficulty is primarily due to:',a:['Phonological processing','Limited English proficiency or environmental disadvantage','A medical diagnosis of dyslexia','Working memory weakness'],c:1,r:'IDEA excludes SLD identification when the difficulty is primarily due to vision/hearing/motor, ID, ED, or environmental/cultural/economic disadvantage.'},
      {q:'A structured literacy approach (e.g., Orton-Gillingham) is BEST characterized as:',a:['Whole language','Explicit, systematic, multi-sensory, cumulative phonics-based instruction','Independent silent reading','Drill on sight words only'],c:1,r:'Structured Literacy is explicit, systematic, cumulative, multi-sensory, and diagnostic.'},
      {q:'The CRA sequence in math is MOST useful for students who:',a:['Already have automatic computation','Need to build conceptual understanding before working with abstract symbols','Have only behavioral concerns','Need to skip foundational math'],c:1,r:'CRA moves from concrete manipulatives to pictorial representations to abstract symbols, building conceptual understanding.'},
    ]
  },
  'Autism Spectrum Disorder': {
    icon:'🧩',
    concepts:[
      {title:'Diagnostic Criteria',body:'DSM-5: (A) persistent deficits in social communication and interaction; (B) restricted, repetitive patterns of behavior, interests, or activities (including sensory differences). Symptoms in early development with clinically significant impairment.'},
      {title:'Strengths-Based View',body:'Students with ASD often demonstrate strengths in pattern recognition, attention to detail, deep interests, visual-spatial skills, honesty, and rule-following. Build on interests and strengths.'},
      {title:'Evidence-Based Practices',body:'NPDC/NCAEP identified 28+ EBPs: ABA-based procedures (prompting, reinforcement, task analysis, DTT), modeling/video modeling, social narratives, visual supports, structured teaching (TEACCH), Functional Communication Training, Pivotal Response.'},
      {title:'Sensory & Environment',body:'Many students with ASD have sensory hyper- or hypo-sensitivity. Consider lighting, noise, smells, seating. Provide sensory breaks, fidgets, noise-canceling headphones if appropriate.'},
    ],
    practice:[
      {q:'A teacher creates a brief illustrated story about what happens at a fire drill. This is an example of:',a:['A BIP','A social narrative (Social Story)','A standardized assessment','An accommodation'],c:1,r:'Social narratives describe a situation, social cues, and appropriate responses.'},
      {q:'Functional Communication Training (FCT) teaches a student to:',a:['Comply with all requests','Use a communicative response to request what was previously gained through problem behavior','Avoid communication','Repeat what others say'],c:1,r:'FCT teaches a functionally equivalent communicative replacement for problem behavior.'},
      {q:'A student with ASD melts down in a noisy cafeteria. A reasonable proactive support is:',a:['Eliminate cafeteria attendance permanently','Offer noise-canceling headphones, an early lunch with a smaller group, or a visual schedule','Punish the meltdown','Ignore the sensory input'],c:1,r:'Antecedent supports proactively reduce triggers; eliminating attendance is overly restrictive.'},
    ]
  },
  'Emotional Disturbance & ADHD': {
    icon:'💭',
    concepts:[
      {title:'IDEA Emotional Disturbance Category',body:'One or more of: inability to learn not explained by other factors; inability to build/maintain relationships; inappropriate behaviors/feelings; pervasive unhappiness/depression; somatic symptoms or fears related to school. Over a long period and to a marked degree, AND adversely affecting educational performance.'},
      {title:'Internalizing vs. Externalizing',body:'Externalizing: outward (aggression, defiance, hyperactivity, rule-breaking). Internalizing: inward (anxiety, depression, withdrawal, somatic complaints). Internalizing often goes underidentified.'},
      {title:'ADHD: Three Presentations',body:'Inattentive: difficulty sustaining attention, organizing, completing tasks. Hyperactive/Impulsive: fidgety, talks excessively, interrupts. Combined: both. Symptoms in 2+ settings, before age 12, with impairment.'},
      {title:'Effective Supports',body:'ADHD: clear routines, structured environment, frequent feedback, broken-down tasks, movement breaks, organizational supports, self-monitoring. ED/internalizing: predictability, safe relational adult, SEL, coping skills, trauma-informed practices, mental health collaboration.'},
    ],
    practice:[
      {q:'A student is consistently withdrawn, refuses to speak, and reports stomachaches before tests. These are MOST characteristic of:',a:['Externalizing behaviors','Internalizing emotional difficulties','ADHD-Hyperactive','SLD reading'],c:1,r:'Withdrawal, mutism, and somatic complaints are classic INTERNALIZING presentations.'},
      {q:'For ADHD-Inattentive, the MOST useful classroom support is likely:',a:['More punishment','Chunked tasks with check-ins, written/visual directions, organizational tools, and movement opportunities','Removal from class','No accommodations'],c:1,r:'Inattentive ADHD benefits from external structure, chunking, multimodal directions, organizers, and check-ins.'},
      {q:'A trauma-informed classroom practice would emphasize:',a:['Surprise consequences','Predictability, safety, choice, and a calming corner','Public reprimands','Strict zero-tolerance only'],c:1,r:'Trauma-informed practice prioritizes safety, predictability, voice/choice, and skill-building over punishment.'},
    ]
  },
  'ID, DD, OHI & Sensory': {
    icon:'🌟',
    concepts:[
      {title:'Intellectual Disability (ID)',body:'Significantly subaverage intellectual functioning AND deficits in adaptive behavior (conceptual, social, practical), with onset before age 18 (now 22 per AAIDD 2021). Severity: mild, moderate, severe, profound.'},
      {title:'Developmental Delay (DD)',body:'IDEA category for ages 3-9 (NY through age 8): significant delay in physical, cognitive, communication, social/emotional, or adaptive areas. Allows services without forcing premature categorical diagnosis.'},
      {title:'Other Health Impairment (OHI)',body:'Limited strength, vitality, or alertness due to chronic/acute health conditions: ADHD, asthma, epilepsy, sickle cell, diabetes, Tourette, leukemia, heart conditions. ADHD with educational impact is most common.'},
      {title:'Sensory & Multiple Disabilities',body:'Deaf/HoH: preferred communication mode (ASL/oral/total), seating, captioning. Visual Impairment: TVI consultation, Braille/large print/screen reader, orientation/mobility. Deaf-Blindness: intervener. Multiple Disabilities: combined needs not addressable in a single category.'},
    ],
    practice:[
      {q:'A 3rd-grader is served under DD. When the student turns 9 (or per NY rules), the IEP team must:',a:['Continue under DD indefinitely','Reevaluate to determine if a specific category applies (or if no longer eligible)','Discontinue services','Move to OHI without evaluation'],c:1,r:'DD is age-limited (3-9 federal; NY through 8). At the limit, reevaluation is required.'},
      {q:'A student with epilepsy that affects alertness and stamina would most likely qualify under:',a:['SLD','OHI','ED','ID'],c:1,r:'OHI covers chronic/acute health conditions limiting strength, vitality, or alertness, including epilepsy.'},
      {q:'For a student who is deaf-blind, IDEA recommends:',a:['Removing all communication supports','An intervener and individualized communication systems based on sensory access','Group instruction without supports','Sign language only regardless of ability'],c:1,r:'Deaf-blindness combines vision/hearing loss requiring specialized supports including an intervener.'},
    ]
  },
  'Assessment Types & Purposes': {
    icon:'📊',
    concepts:[
      {title:'Norm- vs. Criterion-Referenced',body:'Norm: compares to a representative norm group (percentile, standard score). Examples: WJ-IV, WIAT-4. Criterion: compares to a fixed standard (mastery vs. non-mastery). Examples: state assessments, end-of-unit tests.'},
      {title:'Curriculum-Based Measurement (CBM)',body:'Brief, standardized, repeated probes (DIBELS, AIMSweb) graphed over time against a goal line. Used for screening AND progress monitoring. Decision rules trigger instructional changes.'},
      {title:'Screening / Diagnostic / Formative / Summative',body:'Screening: brief, all students, identifies at-risk. Diagnostic: in-depth, identifies specific deficits. Formative: ongoing, informs instruction. Summative: end-of-unit/year.'},
      {title:'Non-Discriminatory Evaluation',body:'IDEA requires assessments that are not discriminatory, in the native language, valid for purpose, by trained personnel, with multiple sources of data (no single test determines eligibility).'},
    ],
    practice:[
      {q:'A score at the 35th percentile is from a:',a:['Criterion-referenced test','Norm-referenced test','FBA','CBM probe'],c:1,r:'Percentile ranks compare to a norm group and come from norm-referenced assessments.'},
      {q:'A weekly oral reading fluency probe charted with a goal line is used PRIMARILY for:',a:['Annual eligibility','Progress monitoring','Standards alignment','Determining placement'],c:1,r:'Repeated, standardized CBM probes are designed to monitor progress toward a goal.'},
      {q:'When evaluating a Spanish-dominant EL, IDEA requires:',a:['Tests in English only','Tests in the native language unless not feasible, distinguishing disability from language acquisition','Only oral interviews','Skipping evaluation'],c:1,r:'IDEA mandates non-discriminatory evaluation: native-language assessment when feasible.'},
    ]
  },
  'Writing Measurable IEP Goals': {
    icon:'🎯',
    concepts:[
      {title:'PLAAFP Drives Goals',body:'PLAAFP must describe current performance with baseline data, explain how the disability affects involvement in the general curriculum, and align directly to each annual goal.'},
      {title:'Anatomy of a Measurable Goal',body:'CONDITIONS (Given a 2nd-grade text), LEARNER (Maria will), BEHAVIOR (read aloud), CRITERION (at 80 wcpm with 95% accuracy), and TIMEFRAME/EVALUATION (on 3 consecutive weekly probes by June 2026).'},
      {title:'SMART Criteria',body:'Specific, Measurable, Achievable, Relevant, Time-bound. NY also requires short-term objectives/benchmarks for students taking alternate assessments.'},
      {title:'Aligned Progress Reporting',body:'Each goal must specify HOW progress will be measured and WHEN it will be reported to parents (typically same frequency as report cards).'},
    ],
    practice:[
      {q:'A goal that says "Jamal will improve his behavior" is missing:',a:['A subject','Measurable behavior, condition, criterion, and timeframe','Reading instruction','Family input'],c:1,r:'"Improve behavior" lacks observable behavior, condition, criterion, and timeframe.'},
      {q:'Which is the BEST measurable annual goal?',a:['Sara will be a better writer.','Sara will write more.','Given a topic and graphic organizer, Sara will write a 5-sentence paragraph at 4/5 on a rubric on 3 consecutive samples by May 2026.','Sara will work on writing skills.'],c:2,r:'The third option specifies condition, behavior, criterion, and timeframe.'},
      {q:'Short-term objectives are required in NY for:',a:['Every student with an IEP','Students taking the NY State Alternate Assessment','Only students with SLD','Only secondary students'],c:1,r:'Federally and in NY, short-term objectives are required for students taking alternate assessments.'},
    ]
  },
  'FBA & BIP': {
    icon:'🔍',
    concepts:[
      {title:'When an FBA Is Required',body:'When a student behavior impedes their learning or that of others, OR following certain disciplinary actions (when removal results in a change of placement and behavior is a manifestation of the disability).'},
      {title:'FBA Methods',body:'Indirect: interviews, rating scales (FAST, MAS). Descriptive: ABC observations across instances. Functional analysis: experimental manipulation (gold standard, by qualified personnel like a BCBA).'},
      {title:'Four Functions of Behavior',body:'(1) Attention (social positive reinforcement), (2) Escape/avoidance (negative reinforcement), (3) Tangible/access to items, (4) Sensory/automatic reinforcement. Some behaviors serve multiple functions.'},
      {title:'BIP Components',body:'(1) Operational definition. (2) Function hypothesis. (3) ANTECEDENT strategies. (4) Teaching of REPLACEMENT behavior (functionally equivalent and easier). (5) REINFORCEMENT plan. (6) RESPONSE strategies. (7) Data plan.'},
    ],
    practice:[
      {q:'During math, Tyrone makes loud comments. The teacher reprimands him; comments continue and increase. The function is most likely:',a:['Escape from math','Adult attention','Sensory','Tangible'],c:1,r:'If reprimands (attention) reliably follow and behavior maintains/increases, attention is the most likely function.'},
      {q:'A replacement behavior should:',a:['Be more difficult than the problem behavior','Serve the same function and be at least as efficient as the problem behavior','Serve a totally different function','Be selected based on what looks best to other students'],c:1,r:'Functionally equivalent and at-least-as-efficient replacement is far more likely to be adopted.'},
      {q:'Following a major disciplinary removal that constitutes a change of placement, the team must conduct:',a:['Nothing additional','A manifestation determination review and (if applicable) FBA/BIP review','An expulsion hearing only','A new IEP from scratch'],c:1,r:'IDEA requires manifestation determination within 10 school days. If behavior is a manifestation, FBA/BIP must be reviewed/conducted.'},
    ]
  },
  'Progress Monitoring & Transition': {
    icon:'📈',
    concepts:[
      {title:'Goal-Line & Decision Rules',body:'Establish baseline. Plot goal line. Collect data weekly. Common rule: 4 consecutive points below the goal line = change instructional approach. 4 above = consider raising the goal.'},
      {title:'Reporting Progress',body:'Progress must be reported at least as often as report cards for non-disabled peers. Reports describe progress toward the goal, not just compliance.'},
      {title:'Transition Planning (NY: age 15)',body:'In NY, transition components must be in the IEP no later than age 15. Components: age-appropriate transition assessments, measurable post-secondary goals (education/training, employment, independent living), transition services, courses of study, age-17 rights-transfer notice.'},
      {title:'Self-Determination',body:'Teach goal-setting, decision-making, problem-solving, self-advocacy, self-regulation. Invite the student to attend and lead portions of the IEP meeting.'},
    ],
    practice:[
      {q:'In NY, transition components must be in the IEP by the IEP in effect when the student turns:',a:['12','14','15','16'],c:2,r:'NY requires transition components by age 15 (federal IDEA: age 16).'},
      {q:'After 4 consecutive weekly probes below the goal line, the most appropriate response is to:',a:['Continue the same approach','Make an instructional change','Lower the goal','End services'],c:1,r:'Standard data-decision rule: modify the approach when data persistently falls below goal line.'},
      {q:'Self-determination instruction includes teaching students to:',a:['Comply silently','Set goals, make choices, advocate, and lead parts of the IEP','Avoid the IEP','Memorize policies'],c:1,r:'Self-determination empowers students to direct their lives and meaningfully participate in transition.'},
    ]
  },
  'Evidence-Based Instruction & UDL': {
    icon:'🧠',
    concepts:[
      {title:'Universal Design for Learning (UDL)',body:'Three principles: (1) Multiple means of ENGAGEMENT (the WHY: recruit interest, sustain effort, self-regulation). (2) Multiple means of REPRESENTATION (the WHAT: perception, language, comprehension). (3) Multiple means of ACTION & EXPRESSION (the HOW: physical action, expression, executive function). Proactive, not retrofit.'},
      {title:'Explicit / Direct Instruction',body:'Clear learning objective, activate prior knowledge, model (I do), guided practice with immediate feedback (We do), independent practice (You do), cumulative review. Effective for new/complex skills, especially for SLD.'},
      {title:'Scaffolding',body:'Temporary supports for the Zone of Proximal Development: sentence frames, graphic organizers, partial outlines, prompts. Critical: SYSTEMATICALLY FADE supports as the student gains independence.'},
      {title:'High-Leverage Practices (HLPs)',body:'CEC HLPs include collaboration with families/professionals, assessment, social/emotional/behavioral practices, and instruction (explicit instruction, scaffolded supports, flexible grouping, intensive intervention, technology integration).'},
    ],
    practice:[
      {q:'A teacher offers students a choice of writing about a topic OR creating a podcast OR making a poster (same standard). This best illustrates UDL principle of:',a:['Engagement','Representation','Action and expression','MTSS'],c:2,r:'Offering varied ways to demonstrate learning is the action/expression principle of UDL.'},
      {q:'The "I do, We do, You do" sequence reflects:',a:['Discovery learning','Gradual release of responsibility within explicit instruction','Pure inquiry','Project-based assessment'],c:1,r:'Gradual release of responsibility is the hallmark of explicit, direct instruction.'},
      {q:'Effective scaffolds are characterized by being:',a:['Permanent','Temporary and systematically faded','Always required for every task','Identical for every student'],c:1,r:'Scaffolds are TEMPORARY supports that are systematically faded as students gain independence.'},
    ]
  },
  'Accommodations vs. Modifications': {
    icon:'🛠️',
    concepts:[
      {title:'Accommodations: Change HOW',body:'Accommodations change how a student accesses content or demonstrates learning without changing WHAT is being measured. Categories: presentation (large print, audio), response (scribe, speech-to-text), setting (small group), timing/scheduling (extended time, breaks).'},
      {title:'Modifications: Change WHAT',body:'Modifications change the actual standard, content, or expectation. Examples: reducing the standard, grading on a different scale, alternate curriculum. May affect diploma type and access to grade-level content.'},
      {title:'Differentiation',body:'Good first teaching for ALL students: varying CONTENT (what they learn), PROCESS (how they engage), or PRODUCT (how they show learning) based on readiness, interest, or learning profile.'},
      {title:'Selecting Accommodations',body:'Effective accommodations are individualized, allow access to the same content as peers, used regularly in instruction (not just on tests), aligned across IEP/504/state assessments, and faded over time when appropriate.'},
    ],
    practice:[
      {q:'Allowing a student to listen to a grade-level text via audio while peers read silently is BEST classified as:',a:['A modification','An accommodation','A related service','A behavior support'],c:1,r:'CONTENT (grade-level text) is unchanged; only ACCESS mode changes — an accommodation.'},
      {q:'Replacing a 5th-grade math curriculum with 2nd-grade curriculum is BEST classified as:',a:['Presentation accommodation','Modification of the standard','Differentiation','Related service'],c:1,r:'Substituting a different (lower-grade) standard changes WHAT is taught — a modification.'},
      {q:'A teacher provides a graphic organizer to all students before an essay. This is best described as:',a:['IEP accommodation only','UDL/differentiation strategy benefitting all learners','Modification','Related service'],c:1,r:'Proactively providing supports for all is a UDL/differentiation strategy.'},
    ]
  },
  'Behavior Support & PBIS': {
    icon:'➕',
    concepts:[
      {title:'PBIS Tiers',body:'Tier 1 (universal, all): defined and taught school-wide expectations, acknowledgment systems, consistent responses. Tier 2 (targeted ~15%): Check-In/Check-Out, social skills groups, mentoring. Tier 3 (intensive ~5%): FBA-based BIPs, wraparound.'},
      {title:'Reinforcement vs. Punishment',body:'Reinforcement INCREASES behavior. Positive reinforcement: ADD a stimulus (praise, token). Negative reinforcement: REMOVE an aversive. Punishment DECREASES behavior. Effective change relies primarily on reinforcement.'},
      {title:'Antecedent Strategies',body:'Set the stage to prevent problem behavior: clear expectations, pre-correction, choice-making, high-probability request sequence, environmental modifications, predictable schedules, explicit transitions. PROACTIVE.'},
      {title:'De-escalation',body:'Stay calm, lower voice, use minimal language, offer choice/space, avoid power struggles, allow processing time. Ensure safety. After de-escalation, re-engage and teach a more appropriate response.'},
    ],
    practice:[
      {q:'A teacher gives behavior tickets that students trade in for a Friday reward. This is:',a:['Negative reinforcement','Positive reinforcement (token economy)','Punishment','Extinction'],c:1,r:'Adding a token contingent on behavior to increase that behavior is positive reinforcement (token economy).'},
      {q:'The most effective behavior intervention systems rely PRIMARILY on:',a:['Punishment and removal','Proactive teaching, reinforcement, and instruction in expected behaviors','Public consequences','Suspension'],c:1,r:'Effective change emphasizes proactive teaching and reinforcement of desired behavior.'},
      {q:'Pre-correction is BEST illustrated by:',a:['Reprimanding after misbehavior','Reminding a student of the expectation right before a known difficult transition','Suspending','Giving extra homework'],c:1,r:'Pre-correction is a proactive antecedent prompt of the expectation immediately before a known triggering situation.'},
    ]
  },
  'Co-Teaching, AT & Related Services': {
    icon:'👥',
    concepts:[
      {title:'Six Co-Teaching Models',body:'(1) One teach, one observe; (2) One teach, one assist; (3) Station teaching; (4) Parallel teaching (same content, half class each); (5) Alternative teaching (small group reteach/extend); (6) Team teaching. Vary based on lesson goals.'},
      {title:'Effective Co-Teaching',body:'Requires shared planning time, parity in roles (both seen as the teacher), defined responsibilities, ongoing communication with families about both teachers, joint accountability for ALL students.'},
      {title:'Assistive Technology Continuum',body:'Low-tech: pencil grips, slant boards, picture symbols, color overlays. Mid-tech: timers, calculators, audio recorders. High-tech: AAC devices, speech-to-text, text-to-speech, screen readers, refreshable Braille displays. Must be considered for EVERY IEP.'},
      {title:'Related Services',body:'Speech-language therapy, OT, PT, school counseling/psychological services, social work, nursing, audiology, orientation/mobility, transportation, interpreting, parent counseling and training. Each linked to identified needs.'},
    ],
    practice:[
      {q:'Two teachers split the class in half and BOTH teach the SAME lesson simultaneously. This is:',a:['Station teaching','Parallel teaching','Alternative teaching','Team teaching'],c:1,r:'Parallel teaching: class split in half, both teach the SAME content simultaneously.'},
      {q:'Under IDEA, AT must be considered for:',a:['Only motor disabilities','Every student with an IEP','Only at high school','Only when requested'],c:1,r:'IDEA requires AT consideration for every student with an IEP, regardless of category.'},
      {q:'A student receives speech-language therapy because language deficits interfere with reading. This is best classified as:',a:['Modification','Related service','Accommodation','SDI in math'],c:1,r:'Related services support the student ability to benefit from special education and are written into the IEP.'},
    ]
  },
};

const CR_PROMPTS = [
  {
    id:'cr1',
    title:'Case Study: 3rd-Grade Student with a Specific Learning Disability',
    scenario:'Marcus is a 3rd-grade student in a co-taught general education classroom in a New York public school. He recently qualified for special education services under the category of Specific Learning Disability (SLD) in reading.\n\nRecent evaluation data:\n- CBM Oral Reading Fluency: 38 correct words per minute on 2nd-grade passages (3rd-grade benchmark: 90+ wcpm)\n- Phonological Awareness: 12th percentile (below average)\n- Word Identification (Woodcock-Johnson): standard score 78\n- Reading Comprehension when text is read TO him: 70th percentile (average)\n- Math (Computation and Reasoning): 55th percentile\n- Cognitive Ability: average range\n- Behavior: highly engaged when teachers read aloud; avoids tasks requiring independent reading; recently said "I am dumb" when handed a book.\n\nMarcus family is supportive and concerned that he is becoming discouraged. The general education teacher noticed Marcus participates eagerly in oral discussions but disengages during silent reading and writing.',
    task:'Using the data above, write a response that includes ALL of the following:\n\n1. Identify ONE significant strength and ONE significant area of need evidenced in the data, citing specific data points.\n\n2. Write ONE measurable annual IEP goal that addresses the priority area of need. Include conditions, learner, behavior, criterion, and timeframe.\n\n3. Describe ONE evidence-based instructional approach you would recommend. Explain why it is appropriate for Marcus, citing the data.\n\n4. Identify ONE accommodation that would allow Marcus to access grade-level content while foundational skills are built, and explain why it is an accommodation rather than a modification.',
    rubric:[
      {criterion:'Strength & Need Identification',high:'Identifies a clear strength and a clear, high-priority need; cites specific data points; demonstrates accurate interpretation.',mid:'Identifies a strength and need but data citation is partial or interpretation contains minor inaccuracy.',low:'Strength or need is vague, missing, or unsupported; significant misinterpretation.'},
      {criterion:'Measurable Annual Goal',high:'Goal includes condition, learner, behavior, criterion, timeframe; aligns to need; ambitious yet attainable.',mid:'Goal is mostly measurable but missing one element or criterion is vague.',low:'Goal is not measurable; uses vague language; no clear criterion or timeframe.'},
      {criterion:'Evidence-Based Approach & Rationale',high:'Names a specific EBP (e.g., Structured Literacy / Orton-Gillingham); explains rationale by linking to phonological and word identification deficits.',mid:'Names a reasonable approach but rationale is general or weakly tied to data.',low:'Approach is not evidence-based or no rationale provided; mismatched to need.'},
      {criterion:'Accommodation vs. Modification',high:'Identifies an appropriate accommodation (e.g., audio access, text-to-speech) AND clearly explains the GRADE-LEVEL standard remains unchanged.',mid:'Identifies a reasonable accommodation but distinction is partially explained.',low:'Confuses accommodation with modification; chosen support changes the standard.'},
    ],
    exemplar:'STRENGTH AND NEED. Marcus most significant strength is his average reading comprehension when text is read aloud (70th percentile) combined with average cognitive ability and average math (55th percentile). This indicates intact language comprehension, reasoning, and content learning — the difficulty is constrained to print-based reading. The most pressing area of need is foundational word reading. CBM ORF at 38 wcpm on 2nd-grade text (well below the 3rd-grade benchmark of 90+), word identification at SS 78, and phonological awareness at the 12th percentile point to a phonological-core word-reading deficit consistent with dyslexia.\n\nMEASURABLE ANNUAL GOAL. Given a 2nd-grade-level connected text and after 30 minutes of weekly Structured Literacy instruction, Marcus will read aloud at 80 correct words per minute with 95% accuracy on 3 consecutive weekly oral reading fluency probes by June 2026. Progress monitored weekly via AIMSweb and reported quarterly.\n\nEVIDENCE-BASED INSTRUCTIONAL APPROACH. Structured Literacy (e.g., Orton-Gillingham) delivered in a small group 4-5 times per week for 30 minutes. Structured Literacy is explicit, systematic, cumulative, and multi-sensory — directly targeting the phonological awareness and word-decoding deficits indicated by Marcus PA score (12th percentile) and word identification (SS 78). The IES Practice Guide on foundational reading and the National Reading Panel both identify this approach as effective.\n\nACCOMMODATION. While Marcus is building decoding, provide AUDIO ACCESS to grade-level content (text-to-speech, Bookshare, read-aloud). This is an accommodation because the GRADE-LEVEL standard and content remain identical — only the MODE OF ACCESS changes. His above-grade comprehension when text is read to him (70th percentile) confirms full content access via audio. By contrast, replacing 3rd-grade texts with 1st-grade texts would be a modification because it would change the standard itself.',
  },
  {
    id:'cr2',
    title:'Case Study: 6th-Grade Student with ADHD/OHI and Behavioral Concerns',
    scenario:'Aaliyah is a 6th-grade student in a New York middle school. She is currently served under an IEP with classification of Other Health Impairment (OHI) related to ADHD, combined presentation. She has a current Behavior Intervention Plan (BIP).\n\nRecent data:\n- Academic: Reading and writing scores in average range; math at 60th percentile.\n- ABC data (4 weeks): During independent writing tasks (antecedent), Aaliyah talks loudly to peers, leaves her seat, and makes off-topic jokes (behavior). The teacher consistently sends her to the hallway or to the dean office (consequence). Behavior continues and is increasing in frequency.\n- Aaliyah reports she "hates writing" and "does not know what to say."\n- Off-task behavior is significantly LOWER during structured group work and small-group instruction.\n- Family reports Aaliyah is engaged at home in extended creative storytelling and graphic novel creation.\n\nHer general education ELA teacher and the special education co-teacher would like guidance on revising the BIP and improving instruction.',
    task:'Using the data above, write a response that includes ALL of the following:\n\n1. State the most likely FUNCTION of Aaliyah behavior during independent writing, citing the ABC data.\n\n2. Identify ONE functionally equivalent REPLACEMENT behavior to be explicitly taught and reinforced. Explain why this replacement is appropriate.\n\n3. Describe TWO antecedent (proactive) strategies the team could use to reduce the likelihood of the problem behavior, justifying each with evidence from the case.\n\n4. Describe ONE differentiated instructional adjustment to writing instruction that builds on Aaliyah strengths and supports her engagement.',
    rubric:[
      {criterion:'Function Hypothesis',high:'Identifies escape/avoidance from independent writing as the function; explicitly cites the ABC pattern (writing antecedent → off-task → removal) and behavior maintenance/escalation.',mid:'Plausible function but ABC reasoning is partial.',low:'Function is incorrect or unsupported by the data.'},
      {criterion:'Replacement Behavior',high:'Specific, functionally equivalent, easier-to-perform replacement (e.g., requesting a brief break) that serves the SAME (escape) function appropriately.',mid:'Plausible replacement but not clearly easier or function-equivalence not addressed.',low:'Replacement does not match the function or no rationale.'},
      {criterion:'Two Antecedent Strategies + Justification',high:'Two clearly proactive strategies (chunking, choice, pre-correction, visual schedule, small-group). Each justified with specific case data.',mid:'Two reasonable strategies but justification is general.',low:'Strategies are reactive or punitive; or justification missing.'},
      {criterion:'Differentiation Building on Strengths',high:'Specific adjustment that builds on Aaliyah strengths/interests (e.g., graphic novel format) and explicitly links to engagement and access to writing standards.',mid:'Adjustment described but link is generic.',low:'Adjustment unrelated to strengths or does not address engagement.'},
    ],
    exemplar:'FUNCTION. The data strongly suggest the function is ESCAPE/AVOIDANCE of independent writing. The ABC pattern is consistent: independent writing (antecedent) → talking, leaving seat, jokes (behavior) → being removed (consequence). Removal terminates the writing demand, negatively reinforcing the problem behavior. The behavior is INCREASING and is LOWER during structured group work — corroborating the escape hypothesis. Aaliyah own statement ("I hate writing… I do not know what to say") supports task avoidance.\n\nREPLACEMENT BEHAVIOR. Explicitly teach Aaliyah to request a brief, structured break using a "break card" (or request a graphic organizer) when writing demands feel overwhelming. This replacement is functionally equivalent (provides escape) but is socially appropriate, easier than the chain of disruptive behaviors, and does not result in removal from instruction.\n\nTWO ANTECEDENT STRATEGIES. (1) CHUNK WRITING TASKS into 5-minute segments with built-in check-ins and access to a graphic organizer. The data show off-task behavior occurs during EXTENDED writing and decreases in structured contexts — chunking lowers cognitive/motivational load. (2) OFFER CHOICE OF WRITING TOPIC AND FORMAT and use small-group writing structures whenever possible. Aaliyah engages at home with creative storytelling and graphic novels; the case shows lower off-task behavior in small-group settings. Aligning instructional structure with her demonstrated engagement contexts proactively reduces antecedents.\n\nDIFFERENTIATED INSTRUCTION. Differentiate the PRODUCT of writing assignments by allowing storyboard / graphic-novel style writing as a legitimate format for narrative tasks. Aaliyah is still responsible for the same writing standards (character development, plot structure, dialogue), but drafts those elements in panels mirroring her at-home strengths. This is strengths-based, interest-based differentiation aligned to UDL — lowering engagement barriers without reducing the standard.',
  },
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
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || 'FOUND';
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
  crPromptId: CR_PROMPTS[0].id, crView:'prompt', crSelfScore:{},
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
  <div style={{ maxWidth: narrow ? 720 : 1120, margin: '0 auto', padding: '32px 40px 96px' }}>{children}</div>
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
      <div style={{ ...baseStyles.cap, fontSize: 9, color: T.muted, letterSpacing: '.18em' }}>Licensed Behavior Analysts PLLC</div>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, lineHeight: 1.6, color: T.muted, margin: 0, maxWidth: 640 }}>
        One Love (Love Over Licensed Behavior Analysts, PLLC) is not affiliated with, endorsed by, or sponsored by the New York State Education Department or the Evaluation Systems group of Pearson. NYSTCE® and CST® are registered marks of their respective owners. This practice tool is provided for educational purposes only and does not guarantee passage of any New York State teacher certification examination.
      </p>
    </div>
  </footer>
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
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '8px 40px 6px', borderBottom: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => onNav('welcome')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-label="Home">
          <OneLoveLogo height={22} dark={false}/>
        </button>
      </div>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '8px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
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
      <h1 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 84, lineHeight: 1.02, color: T.ink, letterSpacing: '-.01em', marginBottom: 22 }}>
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
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, padding: '48px 0 0' }}>
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
      <div style={{ background: T.ink, width: 1 }} />
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
      <div role="radiogroup" aria-labelledby={`q-${qIndex}-stem`} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
        {q.a.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button key={i} role="radio" aria-checked={isSelected} onClick={() => onAnswer(qIndex, i)}
              style={{ textAlign: 'left', padding: '16px 20px', border: `1px solid ${isSelected ? T.ink : T.hairline}`, background: isSelected ? T.paper2 : T.paper3, cursor: 'pointer', fontFamily: T.serif, fontSize: 17, color: T.ink, transition: 'all .15s', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
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
const ModuleHub = ({ weakDomains, completedModules, onSelect, onSkip }) => (
  <Page narrow>
    <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
      <Cap mb={12}>The Course of Study</Cap>
      <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em' }}>Your Study Plan</h2>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>Complete each module below to strengthen your weak areas.</p>
    </header>
    <div>
      {weakDomains.map((d, i) => {
        const mod = MODULES[d];
        const done = completedModules.includes(d);
        return (
          <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: i < weakDomains.length - 1 ? `1px solid ${T.hairline}` : `1px solid ${T.ink}` }}>
            <div style={{ flex: 1 }}>
              <Cap color={T.orange2} mb={4}>Module {String(i + 1).padStart(2, '0')}</Cap>
              <h3 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 22, letterSpacing: '-.005em', marginBottom: 4 }}>{d}</h3>
              <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.muted }}>{mod?.concepts?.length || 0} concepts · {mod?.practice?.length || 0} practice questions</p>
            </div>
            <Btn onClick={() => onSelect(d)} variant={done ? 'ghost' : 'primary'} style={{ padding: '10px 22px' }}>{done ? '✓ Completed' : 'Begin →'}</Btn>
          </div>
        );
      })}
    </div>
    <div style={{ marginTop: 36, textAlign: 'center', paddingTop: 24, borderTop: `1px solid ${T.ink}` }}>
      <p style={{ ...baseStyles.cap, fontSize: 11, color: T.muted, marginBottom: 16 }}>{completedModules.length} of {weakDomains.length} modules completed</p>
      <Btn onClick={onSkip} variant={completedModules.length === weakDomains.length ? 'primary' : 'ghost'} style={{ padding: '14px 36px' }}>{completedModules.length === weakDomains.length ? 'Begin Post-Test →' : 'Skip to Post-Test →'}</Btn>
    </div>
  </Page>
);

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
      <div role="radiogroup" aria-labelledby={`pq-${pqIndex}-stem`} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
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
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || 'FOUND';
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
          up({ fcKnown: nextKnown, fcFlipped: false, fcPos: 0 });
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
  const draftKey = `cst-cr-draft-${prompt.id}`;
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
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>Case-study analysis · NYSTCE CST 060 written assignment</p>
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
const STORAGE_KEY = 'swd-cst-060-state-v1';
// fields that survive page reload (skip transient quiz session + reset confirmation)
const PERSIST_FIELDS = ['phase', 'qIndex', 'answers', 'pretestScores', 'pretestAnswers', 'posttestAnswers', 'postScores', 'posttestStarted', 'completedModules', 'crPromptId'];

export default function App() {
  const QUIZ_POOL = useMemo(() => buildQuizPool(), []);
  const [st, setSt] = useState(() => {
    const base = { ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // only restore the persisted fields; ignore stale transient state
        const restored = {};
        for (const k of PERSIST_FIELDS) if (k in saved) restored[k] = saved[k];
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
      posttest:   () => st.pretestScores && up({ phase: 'posttest',   confirmReset: false, answers: { ...(st.posttestAnswers || {}) }, qIndex: 0, posttestStarted: !!st.postScores }),
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
  const Wrap = ({ children }) => <div style={{ background: T.paper, minHeight: '100vh', color: T.ink, display: 'flex', flexDirection: 'column' }}>{nav}<div style={{ flex: 1 }}>{children}</div><OneLoveFooter/></div>;

  if (st.phase === 'welcome')    return <Wrap><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {} })} /></Wrap>;
  if (st.phase === 'flashcards') return <Wrap><Flashcards st={st} up={up} /></Wrap>;
  if (st.phase === 'cresponse')  return <Wrap><ConstructedResponse st={st} up={up} /></Wrap>;
  if (st.phase === 'quizPicker') return <Wrap><QuizPicker pool={QUIZ_POOL} onStart={(domain, len, qs) => up({ phase: 'quizRun', quizDomain: domain, quizLen: len, quizQs: qs, quizIdx: 0, quizAnswers: {} })} /></Wrap>;
  if (st.phase === 'quizRun' && st.quizQs) return <Wrap><QuestionScreen questions={st.quizQs} answers={st.quizAnswers} qIndex={st.quizIdx} onAnswer={(i, a) => up({ quizAnswers: { ...st.quizAnswers, [i]: a } })} onNav={(d) => up({ quizIdx: Math.max(0, Math.min(st.quizQs.length - 1, st.quizIdx + d)) })} onSubmit={() => up({ phase: 'quizDone' })} phase={`${st.quizDomain} Quiz`} /></Wrap>;
  if (st.phase === 'quizDone' && st.quizQs) return <Wrap><QuizResults domain={st.quizDomain} qs={st.quizQs} answers={st.quizAnswers} onRetry={() => up({ phase: 'quizRun', quizQs: shuffle(st.quizQs), quizIdx: 0, quizAnswers: {} })} onPick={() => up({ phase: 'quizPicker', quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} })} /></Wrap>;
  if (st.phase === 'pretest')    return <Wrap><QuestionScreen questions={PRETEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => up({ answers: { ...st.answers, [i]: a } })} onNav={(d) => up({ qIndex: Math.max(0, Math.min(PRETEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(PRETEST, st.answers); up({ phase: 'results', pretestScores: s, pretestAnswers: { ...st.answers } }); }} phase="Pretest" /></Wrap>;
  if (st.phase === 'results')    return <Wrap><Results scores={st.pretestScores} weakDomains={weak} sourceQuestions={PRETEST} sourceAnswers={st.pretestAnswers} onContinue={() => up({ phase: 'modules' })} /></Wrap>;
  if (st.phase === 'modules')    return <Wrap><ModuleHub weakDomains={weak} completedModules={st.completedModules} onSelect={(d) => up({ phase: 'module', activeModule: d, modPhase: 'content', modPQIndex: 0, modPAnswers: {} })} onSkip={() => up({ phase: 'posttest', posttestStarted: false })} /></Wrap>;
  if (st.phase === 'module')     return <Wrap><LearningModule domain={st.activeModule} phase={st.modPhase} pqIndex={st.modPQIndex} pAnswers={st.modPAnswers} onBack={() => up({ phase: 'modules' })} onStartPractice={() => up({ modPhase: 'practice' })} onPAnswer={(i, a) => { if (i === 'next') { up({ modPQIndex: st.modPQIndex + 1 }); return; } up({ modPAnswers: { ...st.modPAnswers, [i]: a } }); }} onFinish={() => up({ phase: 'modules', completedModules: [...new Set([...st.completedModules, st.activeModule])] })} /></Wrap>;
  if (st.phase === 'posttest')   return <Wrap>{!st.posttestStarted ? (
    <Page narrow>
      <header style={{ textAlign: 'center', padding: '60px 0' }}>
        <Cap mb={12}>The Final Examination</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 56, color: T.ink, letterSpacing: '-.01em', marginBottom: 18 }}>The Post-Test</h2>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, color: T.ink2, lineHeight: 1.55, maxWidth: 540, margin: '0 auto 36px' }}>{POSTTEST.length} {WELCOME.posttestIntro}</p>
        <Btn onClick={() => up({ posttestStarted: true, answers: {}, qIndex: 0 })} variant="primary" style={{ padding: '18px 48px' }}>Begin the Post-Test</Btn>
      </header>
    </Page>
  ) : (
    <QuestionScreen questions={POSTTEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => up({ answers: { ...st.answers, [i]: a } })} onNav={(d) => up({ qIndex: Math.max(0, Math.min(POSTTEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(POSTTEST, st.answers); up({ phase: 'comparison', postScores: s, posttestAnswers: { ...st.answers } }); }} phase="Post-Test" />
  )}</Wrap>;
  if (st.phase === 'comparison') return <Wrap><Results scores={st.postScores} weakDomains={[]} pretestScores={st.pretestScores} isPost={true} sourceQuestions={POSTTEST} sourceAnswers={st.posttestAnswers} onContinue={() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
  }} /></Wrap>;
  return null;
}

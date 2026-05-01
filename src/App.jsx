import { useState, useEffect, useContext, useMemo, createContext } from "react";

const LIGHT = {
  navy:'#1a3557', navyMid:'#24497a', navyLight:'#e8f0fb',
  amber:'#c47d0e', amberBg:'#fef9ec', amberBorder:'#f5c842',
  green:'#166534', greenBg:'#dcfce7', greenBorder:'#86efac',
  red:'#991b1b', redBg:'#fee2e2', redBorder:'#fca5a5',
  gray:'#475569', grayLight:'#f1f5f9', border:'#e2e8f0',
  text:'#1e293b', muted:'#64748b', white:'#ffffff',
  surface:'#ffffff', bg:'#f8fafc',
  navBg:'#1a3557', navActiveText:'#1a3557',
  navInactive:'#93c5fd', navDisabled:'#2d4a63', navBorder:'#2d4a63',
  resetText:'#f87171', resetLabel:'#fca5a5',
  resetYesBg:'#dc2626', resetNoText:'#94a3b8',
};
const DARK = {
  navy:'#60a5fa', navyMid:'#3b82f6', navyLight:'#1e3a5f',
  amber:'#fbbf24', amberBg:'#3f2e0e', amberBorder:'#b45309',
  green:'#86efac', greenBg:'#14532d', greenBorder:'#15803d',
  red:'#fca5a5', redBg:'#3f1a1a', redBorder:'#7f1d1d',
  gray:'#cbd5e1', grayLight:'#1e293b', border:'#334155',
  text:'#e2e8f0', muted:'#94a3b8', white:'#0f172a',
  surface:'#1e293b', bg:'#0f172a',
  navBg:'#0b1628', navActiveText:'#0f172a',
  navInactive:'#94a3b8', navDisabled:'#475569', navBorder:'#334155',
  resetText:'#f87171', resetLabel:'#fca5a5',
  resetYesBg:'#dc2626', resetNoText:'#94a3b8',
};
const ThemeContext = createContext({ C: LIGHT, dark: false, toggle: () => {} });
const useC = () => useContext(ThemeContext).C;
const useTheme = () => useContext(ThemeContext);

const SUBTESTS = {
  FOUND:    { label:'Foundations',              emoji:'⚖️' },
  STUDENTS: { label:'Students w/ Disabilities', emoji:'🧩' },
  ASSESS:   { label:'Assessment & IEP',         emoji:'📊' },
  INSTRUCT: { label:'Instruction',              emoji:'🧠' },
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

const ProgressBar = ({ value, color, label }) => {
  const C = useC();
  const barColor = color || C.navy;
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span style={{fontSize:13,color:C.muted}}>{label}</span>
        <span style={{fontSize:13,fontWeight:700,color:barColor}}>{value}%</span>
      </div>
      <div style={{background:C.border,borderRadius:99,height:8,overflow:'hidden'}}>
        <div style={{width:`${value}%`,height:'100%',background:barColor,borderRadius:99,transition:'width 0.6s ease'}}/>
      </div>
    </div>
  );
};

const Pill = ({text, color, bg}) => (
  <span style={{fontSize:11,fontWeight:700,color,background:bg,padding:'2px 8px',borderRadius:99,textTransform:'uppercase',letterSpacing:'0.05em'}}>{text}</span>
);

const Card = ({children, style={}}) => {
  const C = useC();
  return (
    <div style={{background:C.surface,borderRadius:16,padding:28,boxShadow:'0 2px 16px rgba(0,0,0,0.07)',border:`1px solid ${C.border}`,...style}}>{children}</div>
  );
};

const Welcome = ({onStart}) => {
  const C = useC();
  return (
  <div style={{maxWidth:640,margin:'0 auto',padding:'40px 20px',fontFamily:'Georgia, serif'}}>
    <div style={{textAlign:'center',marginBottom:40}}>
      <div style={{fontSize:56,marginBottom:12}}>🧑‍🏫</div>
      <h1 style={{fontSize:26,fontWeight:700,color:C.navy,margin:'0 0 8px',letterSpacing:'-0.5px',lineHeight:1.2}}>
        NY State Students with Disabilities (CST 060) Exam Prep
      </h1>
      <p style={{fontSize:15,color:C.gray,margin:0,fontFamily:'system-ui'}}>
        All four subareas + constructed response · Aligned to NYSED Part 200 & IDEA
      </p>
    </div>
    <Card style={{marginBottom:20}}>
      <h2 style={{fontSize:17,fontWeight:700,color:C.navy,margin:'0 0 16px'}}>How This Works</h2>
      {[
        ['1','Take the Pretest','32 questions across all four subareas'],
        ['2','Review Your Results','See which domains need attention'],
        ['3','Study Your Weak Areas','Deep-dive modules with practice questions'],
        ['4','Practice Constructed Response','Case study, rubric, exemplar'],
        ['5','Take the Post-Test','Measure your growth and confirm readiness'],
      ].map(([n,title,desc]) => (
        <div key={n} style={{display:'flex',gap:14,marginBottom:14,alignItems:'flex-start'}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:C.navy,color:C.white,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0,fontFamily:'system-ui'}}>{n}</div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:2,fontFamily:'system-ui'}}>{title}</div>
            <div style={{fontSize:13,color:C.muted,fontFamily:'system-ui'}}>{desc}</div>
          </div>
        </div>
      ))}
    </Card>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:28}}>
      {Object.entries(SUBTESTS).map(([k,v]) => (
        <Card key={k} style={{textAlign:'center',padding:16}}>
          <div style={{fontSize:28,marginBottom:4}}>{v.emoji}</div>
          <div style={{fontSize:12,fontWeight:700,color:C.navy,fontFamily:'system-ui'}}>{v.label}</div>
        </Card>
      ))}
    </div>
    <button onClick={onStart} style={{width:'100%',padding:'16px',background:C.navy,color:C.white,border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Georgia, serif',letterSpacing:'0.02em'}}>
      Begin Pretest →
    </button>
  </div>
  );
};

const QuestionScreen = ({questions, answers, qIndex, onAnswer, onNav, onSubmit, phase}) => {
  const C = useC();
  const q = questions[qIndex];
  const selected = answers[qIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const subtestInfo = SUBTESTS[q.s];
  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div>
          <Pill text={subtestInfo.label} color={C.navy} bg={C.navyLight}/>
          <span style={{marginLeft:8,fontSize:12,color:C.muted}}>{q.d}</span>
        </div>
        <span style={{fontSize:13,color:C.muted}}>Q {qIndex+1} of {total}</span>
      </div>
      <div style={{height:4,background:C.border,borderRadius:99,marginBottom:28,overflow:'hidden'}}>
        <div style={{width:`${((qIndex+1)/total)*100}%`,height:'100%',background:C.navy,borderRadius:99,transition:'width 0.3s'}}/>
      </div>
      <Card style={{marginBottom:20}}>
        <p style={{fontSize:16,lineHeight:1.6,color:C.text,margin:0,fontFamily:'Georgia, serif',fontWeight:500}}>{q.q}</p>
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:28}}>
        {q.a.map((opt,i) => {
          const isSelected = selected === i;
          return (
            <button key={i} onClick={() => onAnswer(qIndex, i)}
              style={{textAlign:'left',padding:'14px 18px',borderRadius:12,border:`2px solid ${isSelected ? C.navy : C.border}`,background:isSelected ? C.navyLight : C.surface,cursor:'pointer',fontSize:15,color:C.text,transition:'all 0.15s',display:'flex',alignItems:'center',gap:12,fontFamily:'system-ui'}}>
              <span style={{width:24,height:24,borderRadius:'50%',border:`2px solid ${isSelected ? C.navy : C.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:isSelected ? C.navy : C.muted,flexShrink:0,background:isSelected ? C.surface : 'transparent'}}>{['A','B','C','D'][i]}</span>
              {opt}
            </button>
          );
        })}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <button onClick={() => onNav(-1)} disabled={qIndex===0}
          style={{padding:'10px 20px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:qIndex===0?C.muted:C.navy,cursor:qIndex===0?'default':'pointer',fontSize:14,fontWeight:600}}>← Back</button>
        <span style={{fontSize:13,color:C.muted}}>{answeredCount}/{total} answered</span>
        {qIndex < total - 1
          ? <button onClick={() => onNav(1)} style={{padding:'10px 20px',borderRadius:10,border:'none',background:C.navy,color:C.white,cursor:'pointer',fontSize:14,fontWeight:600}}>Next →</button>
          : <button onClick={onSubmit} disabled={answeredCount < total}
              style={{padding:'10px 20px',borderRadius:10,border:'none',background:answeredCount<total?C.muted:C.amber,color:C.white,cursor:answeredCount<total?'default':'pointer',fontSize:14,fontWeight:600}}>{answeredCount < total ? `Answer all (${total - answeredCount} left)` : `Submit ${phase} ✓`}</button>
        }
      </div>
    </div>
  );
};

const Results = ({scores, weakDomains, onContinue, isPost, pretestScores, sourceQuestions, sourceAnswers}) => {
  const C = useC();
  const [reviewing, setReviewing] = useState(false);
  const overall = Object.values(scores.subtests).reduce((a,b) => ({correct:a.correct+b.correct,total:a.total+b.total}),{correct:0,total:0});
  const overallPct = pct(overall.correct, overall.total);
  const missed = sourceQuestions ? sourceQuestions.map((q,i) => ({q,i,user:sourceAnswers?.[i]})).filter(x => x.user !== x.q.c) : [];
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)}/>;
  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center',marginBottom:28}}>
        <div style={{fontSize:48,marginBottom:8}}>{overallPct >= 70 ? '🎉' : '📊'}</div>
        <h2 style={{fontSize:24,fontWeight:700,color:C.navy,margin:'0 0 4px',fontFamily:'Georgia,serif'}}>{isPost ? 'Post-Test Results' : 'Pretest Results'}</h2>
        <p style={{fontSize:15,color:C.muted,margin:0}}>Overall Score: <strong style={{color:C.navy}}>{overallPct}%</strong> ({overall.correct}/{overall.total})</p>
      </div>
      <Card style={{marginBottom:20}}>
        <h3 style={{fontSize:15,fontWeight:700,color:C.navy,margin:'0 0 16px'}}>Results by Subarea</h3>
        {Object.entries(scores.subtests).map(([k,v]) => (
          <div key={k} style={{marginBottom:14}}>
            <ProgressBar value={pct(v.correct,v.total)} label={`${SUBTESTS[k]?.emoji} ${SUBTESTS[k]?.label} (${v.correct}/${v.total})`} color={pct(v.correct,v.total)>=70?C.green:C.red}/>
          </div>
        ))}
      </Card>
      <Card style={{marginBottom:20}}>
        <h3 style={{fontSize:15,fontWeight:700,color:C.navy,margin:'0 0 16px'}}>Results by Domain</h3>
        {Object.entries(scores.domains).map(([d,v]) => {
          const p = pct(v.correct,v.total);
          const needsWork = p < 70;
          return (
            <div key={d} style={{marginBottom:12,padding:'10px 14px',borderRadius:10,background:needsWork?C.redBg:'transparent',border:`1px solid ${needsWork?C.redBorder:C.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600,color:C.text}}>{d}</span>
                {needsWork && <Pill text="Review" color={C.red} bg={C.redBg}/>}
              </div>
              <ProgressBar value={p} label={`${v.correct}/${v.total} correct`} color={needsWork?C.red:C.green}/>
            </div>
          );
        })}
      </Card>
      {isPost && pretestScores && (
        <Card style={{marginBottom:20,background:C.amberBg,border:`1px solid ${C.amberBorder}`}}>
          <h3 style={{fontSize:15,fontWeight:700,color:C.amber,margin:'0 0 12px'}}>📈 Your Growth</h3>
          {Object.entries(scores.domains).map(([d,v]) => {
            const pre = pretestScores.domains[d]; if (!pre) return null;
            const preP = pct(pre.correct,pre.total); const postP = pct(v.correct,v.total); const diff = postP - preP;
            return (
              <div key={d} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:`1px solid ${C.amberBorder}`}}>
                <span style={{fontSize:13,color:C.text}}>{d}</span>
                <span style={{fontSize:13,fontWeight:700,color:diff>0?C.green:diff<0?C.red:C.muted}}>{preP}% → {postP}% ({diff>0?'+':''}{diff}%)</span>
              </div>
            );
          })}
        </Card>
      )}
      {!isPost && weakDomains.length > 0 && (
        <div style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,borderRadius:14,padding:20,marginBottom:20}}>
          <p style={{fontSize:14,color:C.amber,fontWeight:700,margin:'0 0 8px'}}>📚 Recommended Study Areas ({weakDomains.length} domains below 70%)</p>
          {weakDomains.map(d => <div key={d} style={{fontSize:13,color:C.text,padding:'3px 0'}}>→ {d}</div>)}
        </div>
      )}
      {missed.length > 0 && (
        <button onClick={() => setReviewing(true)} style={{width:'100%',padding:'14px',background:C.surface,color:C.navy,border:`2px solid ${C.navy}`,borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif',marginBottom:12}}>🔍 Review Missed Questions ({missed.length})</button>
      )}
      <button onClick={onContinue} style={{width:'100%',padding:'16px',background:C.navy,color:C.white,border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif'}}>{isPost ? 'Done! View Final Summary' : weakDomains.length > 0 ? `Start Study Modules (${weakDomains.length}) →` : 'Skip to Post-Test →'}</button>
    </div>
  );
};

const ReviewIncorrect = ({items, onBack}) => {
  const C = useC();
  const [idx, setIdx] = useState(0);
  const cur = items[idx]; const q = cur.q;
  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:14,marginBottom:16,padding:0}}>← Back to results</button>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <Pill text={SUBTESTS[q.s]?.label || 'Review'} color={C.navy} bg={C.navyLight}/>
        <span style={{fontSize:13,color:C.muted}}>Missed {idx+1} of {items.length}</span>
      </div>
      <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{q.d}</div>
      <Card style={{marginBottom:16}}>
        <p style={{fontSize:16,lineHeight:1.6,color:C.text,margin:0,fontFamily:'Georgia,serif',fontWeight:500}}>{q.q}</p>
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
        {q.a.map((opt,i) => {
          const isCorrect = i === q.c; const isUser = i === cur.user;
          let bg = C.surface, border = C.border, color = C.text;
          if (isCorrect) { bg = C.greenBg; border = C.greenBorder; }
          else if (isUser) { bg = C.redBg; border = C.redBorder; }
          return (
            <div key={i} style={{padding:'14px 18px',borderRadius:12,border:`2px solid ${border}`,background:bg,color,fontSize:15,display:'flex',gap:12,alignItems:'flex-start'}}>
              <span style={{fontWeight:700,flexShrink:0}}>{['A','B','C','D'][i]}.</span>
              <span style={{flex:1}}>{opt}</span>
              {isCorrect && <span style={{color:C.green,fontWeight:700}}>✓ Correct</span>}
              {isUser && !isCorrect && <span style={{color:C.red,fontWeight:700}}>✗ Your answer</span>}
            </div>
          );
        })}
      </div>
      <Card style={{background:C.grayLight,marginBottom:16}}>
        <p style={{fontSize:13,color:C.text,margin:0,lineHeight:1.6}}><strong>Explanation:</strong> {q.r}</p>
      </Card>
      <div style={{display:'flex',justifyContent:'space-between',gap:12}}>
        <button onClick={() => setIdx(Math.max(0,idx-1))} disabled={idx===0} style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:idx===0?C.muted:C.navy,cursor:idx===0?'default':'pointer',fontSize:14,fontWeight:600}}>← Previous</button>
        <button onClick={() => idx < items.length-1 ? setIdx(idx+1) : onBack()} style={{flex:1,padding:'12px',borderRadius:10,border:'none',background:C.navy,color:C.white,cursor:'pointer',fontSize:14,fontWeight:600}}>{idx < items.length - 1 ? 'Next →' : 'Done'}</button>
      </div>
    </div>
  );
};

const ModuleHub = ({weakDomains, completedModules, onSelect, onSkip}) => {
  const C = useC();
  return (
  <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
    <div style={{textAlign:'center',marginBottom:28}}>
      <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:'0 0 6px',fontFamily:'Georgia,serif'}}>Your Study Plan</h2>
      <p style={{fontSize:14,color:C.muted,margin:0}}>Complete the modules below to strengthen your weak areas</p>
    </div>
    {weakDomains.map(d => {
      const mod = MODULES[d];
      const done = completedModules.includes(d);
      return (
        <Card key={d} style={{marginBottom:12}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontSize:28}}>{mod?.icon || '📘'}</div>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:C.navy}}>{d}</div>
                <div style={{fontSize:12,color:C.muted}}>{mod?.concepts?.length || 0} concepts · 3 practice questions</div>
              </div>
            </div>
            <button onClick={() => onSelect(d)}
              style={{padding:'8px 18px',borderRadius:10,border:'none',background:done?C.greenBg:C.navy,color:done?C.green:C.white,cursor:'pointer',fontSize:13,fontWeight:700}}>
              {done ? '✓ Done' : 'Study →'}
            </button>
          </div>
        </Card>
      );
    })}
    <div style={{marginTop:24,textAlign:'center'}}>
      <p style={{fontSize:13,color:C.muted,marginBottom:12}}>
        {completedModules.length}/{weakDomains.length} modules completed
      </p>
      <button onClick={onSkip} style={{padding:'14px 32px',background:completedModules.length===weakDomains.length?C.navy:C.gray,color:C.white,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif'}}>
        {completedModules.length === weakDomains.length ? 'Start Post-Test →' : 'Skip to Post-Test →'}
      </button>
    </div>
  </div>
  );
};

const LearningModule = ({domain, phase, pqIndex, pAnswers, onPAnswer, onBack, onStartPractice, onFinish}) => {
  const C = useC();
  const mod = MODULES[domain];
  const pq = mod.practice[pqIndex];
  const pSelected = pAnswers[pqIndex];

  if (phase === 'content') return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:14,marginBottom:20,padding:0}}>← Back to modules</button>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <span style={{fontSize:36}}>{mod.icon}</span>
        <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:0,fontFamily:'Georgia,serif'}}>{domain}</h2>
      </div>
      {mod.concepts.map((c,i) => (
        <Card key={i} style={{marginBottom:14,borderLeft:`4px solid ${C.navy}`}}>
          <h3 style={{fontSize:15,fontWeight:700,color:C.navy,margin:'0 0 8px'}}>{c.title}</h3>
          <p style={{fontSize:14,lineHeight:1.7,color:C.text,margin:0}}>{c.body}</p>
        </Card>
      ))}
      <button onClick={onStartPractice} style={{width:'100%',marginTop:8,padding:'16px',background:C.amber,color:C.white,border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif'}}>
        Practice Questions →
      </button>
    </div>
  );

  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{marginBottom:20}}>
        <Pill text={domain} color={C.navy} bg={C.navyLight}/>
        <span style={{marginLeft:8,fontSize:12,color:C.muted}}>Practice Q {pqIndex+1} of {mod.practice.length}</span>
      </div>
      <Card style={{marginBottom:16}}>
        <p style={{fontSize:16,lineHeight:1.6,color:C.text,margin:0,fontFamily:'Georgia,serif',fontWeight:500}}>{pq.q}</p>
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
        {pq.a.map((opt,i) => {
          const isSelected = pSelected === i;
          const showFeedback = pSelected !== undefined;
          const isCorrect = i === pq.c;
          let bg = C.surface, border = C.border, color = C.text;
          if (showFeedback && isCorrect) { bg = C.greenBg; border = C.greenBorder; }
          else if (showFeedback && isSelected && !isCorrect) { bg = C.redBg; border = C.redBorder; }
          else if (isSelected) { bg = C.navyLight; border = C.navy; }
          return (
            <button key={i} onClick={() => !showFeedback && onPAnswer(pqIndex, i)}
              style={{textAlign:'left',padding:'14px 18px',borderRadius:12,border:`2px solid ${border}`,background:bg,cursor:showFeedback?'default':'pointer',fontSize:15,color,display:'flex',gap:12,alignItems:'flex-start',fontFamily:'system-ui'}}>
              <span style={{fontWeight:700,flexShrink:0}}>{['A','B','C','D'][i]}.</span>
              {opt}
              {showFeedback && isCorrect && <span style={{marginLeft:'auto',color:C.green}}>✓</span>}
              {showFeedback && isSelected && !isCorrect && <span style={{marginLeft:'auto',color:C.red}}>✗</span>}
            </button>
          );
        })}
      </div>
      {pSelected !== undefined && (
        <Card style={{background:C.grayLight,marginBottom:16}}>
          <p style={{fontSize:13,color:C.text,margin:0,lineHeight:1.6}}>
            <strong>Explanation:</strong> {pq.r}
          </p>
        </Card>
      )}
      {pSelected !== undefined && (
        pqIndex < mod.practice.length - 1
          ? <button onClick={() => onPAnswer('next')} style={{width:'100%',padding:'14px',background:C.navy,color:C.white,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>Next Question →</button>
          : <button onClick={onFinish} style={{width:'100%',padding:'14px',background:C.green,color:C.white,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>✓ Complete Module</button>
      )}
    </div>
  );
};

const DomainGrid = ({onSelect, getCounts}) => {
  const C = useC();
  const groups = { FOUND:[], STUDENTS:[], ASSESS:[], INSTRUCT:[] };
  Object.keys(MODULES).forEach(d => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || 'FOUND';
    groups[subtest].push(d);
  });
  return (
    <>
      {Object.entries(groups).map(([k, domains]) => domains.length === 0 ? null : (
        <div key={k} style={{marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8}}>
            {SUBTESTS[k]?.emoji} {SUBTESTS[k]?.label}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {domains.map(d => {
              const mod = MODULES[d];
              const meta = getCounts ? getCounts(d) : null;
              return (
                <button key={d} onClick={() => onSelect(d)}
                  style={{textAlign:'left',padding:'12px 14px',borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,cursor:'pointer',display:'flex',alignItems:'center',gap:10,fontFamily:'system-ui'}}>
                  <span style={{fontSize:24}}>{mod?.icon || '📘'}</span>
                  <span style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.text,lineHeight:1.2}}>{d}</div>
                    {meta && <div style={{fontSize:11,color:C.muted,marginTop:2}}>{meta}</div>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

const Flashcards = ({st, up}) => {
  const C = useC();
  if (!st.fcDomain) {
    return (
      <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:8}}>🃏</div>
          <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:'0 0 4px',fontFamily:'Georgia,serif'}}>Flashcards</h2>
          <p style={{fontSize:14,color:C.muted,margin:0}}>Pick a domain to study key concepts</p>
        </div>
        <DomainGrid
          getCounts={d => `${MODULES[d].concepts.length} concepts`}
          onSelect={d => {
            const order = shuffle(MODULES[d].concepts.map((_, i) => i));
            up({ fcDomain: d, fcOrder: order, fcPos: 0, fcFlipped: false, fcKnown: [] });
          }}
        />
      </div>
    );
  }

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
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <button onClick={() => up({ fcDomain:null, fcOrder:[], fcPos:0, fcFlipped:false, fcKnown:[] })}
        style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:14,marginBottom:16,padding:0}}>← Pick another domain</button>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
        <span style={{fontSize:28}}>{mod.icon}</span>
        <h2 style={{fontSize:20,fontWeight:700,color:C.navy,margin:0,fontFamily:'Georgia,serif'}}>{st.fcDomain}</h2>
      </div>
      <p style={{fontSize:12,color:C.muted,margin:'0 0 16px'}}>
        {allKnown
          ? `All ${order.length} cards marked known.`
          : `Card ${safePos + 1} of ${remaining.length} · ${st.fcKnown.length} marked known`}
      </p>

      {!allKnown && (
        <div onClick={() => up({ fcFlipped: !st.fcFlipped })}
          style={{minHeight:240,borderRadius:16,padding:32,marginBottom:16,
            background:st.fcFlipped ? C.amberBg : C.surface,
            border:`2px solid ${st.fcFlipped ? C.amberBorder : C.border}`,
            boxShadow:'0 2px 16px rgba(0,0,0,0.07)',cursor:'pointer',
            display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:12}}>
            {st.fcFlipped ? 'Detail' : 'Concept'} · tap to flip
          </div>
          {!st.fcFlipped
            ? <div style={{fontSize:22,fontWeight:700,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.3}}>{concept.title}</div>
            : <div style={{fontSize:15,color:C.text,lineHeight:1.7}}>{concept.body}</div>}
        </div>
      )}

      {allKnown && (
        <Card style={{marginBottom:16,textAlign:'center'}}>
          <div style={{fontSize:36,marginBottom:8}}>🎉</div>
          <p style={{fontSize:15,color:C.text,margin:0}}>You've marked every card known. Reset the deck or pick a new domain.</p>
        </Card>
      )}

      <div style={{display:'flex',gap:8,marginBottom:10}}>
        <button onClick={() => advance(-1)} disabled={allKnown}
          style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:allKnown?C.muted:C.navy,cursor:allKnown?'default':'pointer',fontSize:14,fontWeight:600}}>← Prev</button>
        <button onClick={() => up({ fcFlipped: !st.fcFlipped })} disabled={allKnown}
          style={{flex:1,padding:'12px',borderRadius:10,border:'none',background:allKnown?C.gray:C.navy,color:C.white,cursor:allKnown?'default':'pointer',fontSize:14,fontWeight:700}}>Flip</button>
        <button onClick={() => advance(1)} disabled={allKnown}
          style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:allKnown?C.muted:C.navy,cursor:allKnown?'default':'pointer',fontSize:14,fontWeight:600}}>Next →</button>
      </div>

      <div style={{display:'flex',gap:8}}>
        <button
          onClick={() => {
            if (allKnown) return;
            const nextKnown = isKnown ? st.fcKnown.filter(i => i !== conceptIdx) : [...st.fcKnown, conceptIdx];
            up({ fcKnown: nextKnown, fcFlipped: false, fcPos: 0 });
          }}
          disabled={allKnown}
          style={{flex:2,padding:'12px',borderRadius:10,border:`1px solid ${isKnown?C.green:C.border}`,background:isKnown?C.greenBg:C.surface,color:isKnown?C.green:C.text,cursor:allKnown?'default':'pointer',fontSize:13,fontWeight:700}}>
          {isKnown ? '✓ Marked known (tap to unmark)' : 'Mark known'}
        </button>
        <button onClick={() => up({ fcOrder: shuffle(order), fcPos: 0, fcFlipped: false })}
          style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.navy,cursor:'pointer',fontSize:13,fontWeight:700}}>🔀 Shuffle</button>
        <button onClick={() => up({ fcKnown: [], fcPos: 0, fcFlipped: false })}
          style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,cursor:'pointer',fontSize:13,fontWeight:700}}>↺ Reset deck</button>
      </div>
    </div>
  );
};

const QuizPicker = ({pool, onStart}) => {
  const C = useC();
  const [len, setLen] = useState(10);
  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center',marginBottom:20}}>
        <div style={{fontSize:40,marginBottom:8}}>⚡</div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:'0 0 4px',fontFamily:'Georgia,serif'}}>Quick Quiz</h2>
        <p style={{fontSize:14,color:C.muted,margin:0}}>Pick a domain and quiz length</p>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:18,justifyContent:'center'}}>
        {[5, 10].map(n => (
          <button key={n} onClick={() => setLen(n)}
            style={{padding:'10px 22px',borderRadius:10,border:`2px solid ${len===n?C.navy:C.border}`,background:len===n?C.navyLight:C.surface,color:len===n?C.navy:C.text,fontSize:14,fontWeight:700,cursor:'pointer'}}>
            {n} questions
          </button>
        ))}
      </div>
      <DomainGrid
        getCounts={d => `${pool[d]?.length || 0} questions in pool`}
        onSelect={d => {
          const available = pool[d] || [];
          if (available.length === 0) return;
          const take = Math.min(len, available.length);
          onStart(d, len, shuffle(available).slice(0, take));
        }}
      />
    </div>
  );
};

const QuizResults = ({domain, qs, answers, onRetry, onPick}) => {
  const C = useC();
  const [reviewing, setReviewing] = useState(false);
  const correct = qs.filter((q, i) => answers[i] === q.c).length;
  const p = pct(correct, qs.length);
  const missed = qs.map((q, i) => ({ q, i, user: answers[i] })).filter(x => x.user !== x.q.c);

  if (reviewing && missed.length > 0) {
    return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)}/>;
  }

  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center',marginBottom:24}}>
        <div style={{fontSize:48,marginBottom:8}}>{p >= 70 ? '🎉' : '📊'}</div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:'0 0 4px',fontFamily:'Georgia,serif'}}>{domain} Quiz</h2>
        <p style={{fontSize:15,color:C.muted,margin:0}}>
          Score: <strong style={{color:p>=70?C.green:C.red}}>{p}%</strong> ({correct}/{qs.length})
        </p>
      </div>
      {missed.length > 0 && (
        <button onClick={() => setReviewing(true)}
          style={{width:'100%',padding:'14px',background:C.surface,color:C.navy,border:`2px solid ${C.navy}`,borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif',marginBottom:10}}>
          🔍 Review Missed Questions ({missed.length})
        </button>
      )}
      <button onClick={onRetry}
        style={{width:'100%',padding:'14px',background:C.navy,color:C.white,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif',marginBottom:10}}>
        Retry this quiz
      </button>
      <button onClick={onPick}
        style={{width:'100%',padding:'14px',background:C.surface,color:C.text,border:`1px solid ${C.border}`,borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif'}}>
        ← Pick another domain
      </button>
    </div>
  );
};
const ConstructedResponse = ({ st, up }) => {
  const C = useC();
  const prompt = CR_PROMPTS.find(p => p.id === st.crPromptId) || CR_PROMPTS[0];
  const draftKey = `cst-cr-draft-${prompt.id}`;
  const [draft, setDraft] = useState('');
  useEffect(() => {
    try { setDraft(localStorage.getItem(draftKey) || ''); } catch { setDraft(''); }
  }, [draftKey]);
  const saveDraft = (val) => {
    setDraft(val);
    try { localStorage.setItem(draftKey, val); } catch {}
  };
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const setSelf = (idx, level) => up({ crSelfScore: { ...st.crSelfScore, [idx]: level } });
  const scoreSummary = (() => {
    const vals = Object.values(st.crSelfScore || {});
    if (!vals.length) return null;
    return vals.reduce((acc, v) => { acc[v] = (acc[v]||0) + 1; return acc; }, {});
  })();
  const tabBtn = (id, label) => {
    const active = st.crView === id;
    return (
      <button onClick={() => up({ crView: id })} style={{flex:1,padding:'10px',borderRadius:8,border:`1px solid ${active?C.navy:C.border}`,background:active?C.navyLight:C.surface,color:active?C.navy:C.text,fontSize:13,fontWeight:700,cursor:'pointer'}}>{label}</button>
    );
  };
  return (
    <div style={{maxWidth:760,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center',marginBottom:18}}>
        <div style={{fontSize:40,marginBottom:6}}>✍️</div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:'0 0 4px',fontFamily:'Georgia,serif'}}>Constructed-Response Practice</h2>
        <p style={{fontSize:14,color:C.muted,margin:0}}>Case-study analysis · NYSTCE CST 060 written assignment</p>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
        {CR_PROMPTS.map(p => {
          const active = p.id === st.crPromptId;
          return (
            <button key={p.id} onClick={() => up({ crPromptId: p.id, crView:'prompt', crSelfScore:{} })} style={{flex:1,minWidth:200,padding:'10px',borderRadius:10,border:`2px solid ${active?C.navy:C.border}`,background:active?C.navyLight:C.surface,color:active?C.navy:C.text,fontSize:12,fontWeight:700,cursor:'pointer',textAlign:'left'}}>{p.title}</button>
          );
        })}
      </div>
      <div style={{display:'flex',gap:6,marginBottom:18}}>
        {tabBtn('prompt','Prompt + Draft')}
        {tabBtn('rubric','Rubric')}
        {tabBtn('exemplar','Exemplar')}
      </div>
      {st.crView === 'prompt' && (
        <>
          <Card style={{marginBottom:14,borderLeft:`4px solid ${C.navy}`}}>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8}}>Scenario</div>
            <p style={{fontSize:14,lineHeight:1.7,color:C.text,margin:0,whiteSpace:'pre-wrap'}}>{prompt.scenario}</p>
          </Card>
          <Card style={{marginBottom:14,borderLeft:`4px solid ${C.amber}`,background:C.amberBg}}>
            <div style={{fontSize:11,fontWeight:700,color:C.amber,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8}}>Your Task</div>
            <p style={{fontSize:14,lineHeight:1.7,color:C.text,margin:0,whiteSpace:'pre-wrap'}}>{prompt.task}</p>
          </Card>
          <Card>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.navy,margin:0}}>Your Draft</h3>
              <span style={{fontSize:12,color:C.muted}}>{wordCount} words · saved locally</span>
            </div>
            <textarea value={draft} onChange={(e) => saveDraft(e.target.value)} placeholder="Write your response here. Address each numbered part of the task. Your draft is saved automatically in this browser." style={{width:'100%',minHeight:280,padding:12,borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:14,lineHeight:1.6,fontFamily:'Georgia, serif',resize:'vertical',outline:'none'}}/>
            <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
              <button onClick={() => up({ crView:'rubric' })} style={{flex:1,minWidth:140,padding:'10px',borderRadius:10,border:'none',background:C.amber,color:C.white,fontSize:13,fontWeight:700,cursor:'pointer'}}>Score with Rubric →</button>
              <button onClick={() => up({ crView:'exemplar' })} style={{flex:1,minWidth:140,padding:'10px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.navy,fontSize:13,fontWeight:700,cursor:'pointer'}}>Compare to Exemplar →</button>
              <button onClick={() => saveDraft('')} style={{padding:'10px 14px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,fontSize:13,fontWeight:700,cursor:'pointer'}}>Clear</button>
            </div>
          </Card>
        </>
      )}
      {st.crView === 'rubric' && (
        <>
          <Card style={{marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:700,color:C.navy,margin:'0 0 8px'}}>How to Use This Rubric</h3>
            <p style={{fontSize:13,color:C.text,margin:0,lineHeight:1.6}}>For each criterion, read the level descriptors and select the level that BEST matches your draft. Be honest — the goal is to identify what to revise.</p>
          </Card>
          {prompt.rubric.map((r, i) => {
            const sel = st.crSelfScore?.[i];
            const Btn = (level, label, color, bg, border) => (
              <button onClick={() => setSelf(i, level)} style={{flex:1,padding:'10px',borderRadius:8,border:`2px solid ${sel===level?border:C.border}`,background:sel===level?bg:C.surface,color:sel===level?color:C.text,fontSize:12,fontWeight:700,cursor:'pointer'}}>{label}</button>
            );
            return (
              <Card key={i} style={{marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:10}}>{i+1}. {r.criterion}</div>
                <div style={{fontSize:13,color:C.text,lineHeight:1.6,marginBottom:6}}><strong style={{color:C.green}}>3 (Strong):</strong> {r.high}</div>
                <div style={{fontSize:13,color:C.text,lineHeight:1.6,marginBottom:6}}><strong style={{color:C.amber}}>2 (Developing):</strong> {r.mid}</div>
                <div style={{fontSize:13,color:C.text,lineHeight:1.6,marginBottom:10}}><strong style={{color:C.red}}>1 (Limited):</strong> {r.low}</div>
                <div style={{display:'flex',gap:6}}>
                  {Btn('high','3 — Strong',C.green,C.greenBg,C.green)}
                  {Btn('mid','2 — Developing',C.amber,C.amberBg,C.amber)}
                  {Btn('low','1 — Limited',C.red,C.redBg,C.red)}
                </div>
              </Card>
            );
          })}
          {scoreSummary && (
            <Card style={{background:C.navyLight,border:`1px solid ${C.navy}`}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.navy,margin:'0 0 8px'}}>📋 Self-Assessment Summary</h3>
              <p style={{fontSize:13,color:C.text,margin:'0 0 6px'}}>Strong (3): <strong>{scoreSummary.high || 0}</strong> · Developing (2): <strong>{scoreSummary.mid || 0}</strong> · Limited (1): <strong>{scoreSummary.low || 0}</strong></p>
              <p style={{fontSize:12,color:C.muted,margin:0,lineHeight:1.5}}>Tip: Revise any criterion you scored Developing or Limited, then compare to the exemplar.</p>
            </Card>
          )}
        </>
      )}
      {st.crView === 'exemplar' && (
        <>
          <Card style={{marginBottom:14,background:C.greenBg,border:`1px solid ${C.greenBorder}`}}>
            <h3 style={{fontSize:14,fontWeight:700,color:C.green,margin:'0 0 6px'}}>📘 Exemplar Response</h3>
            <p style={{fontSize:12,color:C.text,margin:0,lineHeight:1.5}}>This is ONE strong response — not the only correct answer. Compare structure, evidence use, and how each task element is addressed.</p>
          </Card>
          <Card>
            <p style={{fontSize:14,lineHeight:1.7,color:C.text,margin:0,whiteSpace:'pre-wrap',fontFamily:'Georgia, serif'}}>{prompt.exemplar}</p>
          </Card>
          <button onClick={() => up({ crView:'prompt' })} style={{width:'100%',marginTop:14,padding:'12px',borderRadius:10,border:'none',background:C.navy,color:C.white,fontSize:14,fontWeight:700,cursor:'pointer'}}>← Back to Draft</button>
        </>
      )}
    </div>
  );
};

const NAV_ITEMS=[
  {id:'welcome',    label:'Home',      emoji:'🏠', always:true},
  {id:'flashcards', label:'Cards',     emoji:'🃏', always:true},
  {id:'quiz',       label:'Quiz',      emoji:'⚡',       always:true},
  {id:'pretest',    label:'Pretest',   emoji:'📝', always:true},
  {id:'cresponse',  label:'CR',        emoji:'✍️', always:true},
  {id:'results',    label:'Results',   emoji:'📊', needs:'pretestScores'},
  {id:'modules',    label:'Study',     emoji:'📚', needs:'pretestScores'},
  {id:'posttest',   label:'Post-Test', emoji:'🏁', needs:'pretestScores'},
  {id:'comparison', label:'Report',    emoji:'📈', needs:'postScores'},
];

const NavBar=({st,onNav,onReset,onConfirmReset,onCancelReset})=>{
  const C = useC();
  const { dark, toggle } = useTheme();
  const active = st.phase==='module' ? 'modules'
    : st.phase==='quizPicker' || st.phase==='quizRun' || st.phase==='quizDone' ? 'quiz'
    : st.phase;
  return(
    <div style={{background:C.navBg,position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 8px rgba(0,0,0,0.25)'}}>
      <div style={{maxWidth:760,margin:'0 auto',padding:'0 12px',display:'flex',alignItems:'center',justifyContent:'space-between',height:48}}>
        <div style={{display:'flex',gap:2,overflowX:'auto',scrollbarWidth:'none'}}>
          {NAV_ITEMS.map(item=>{
            const avail=item.always||!!st[item.needs];
            const isActive=active===item.id;
            return(
              <button key={item.id} onClick={()=>avail&&onNav(item.id)} disabled={!avail}
                style={{padding:'5px 9px',borderRadius:7,border:'none',whiteSpace:'nowrap',
                  background:isActive?C.surface:'transparent',
                  color:isActive?C.navActiveText:avail?C.navInactive:C.navDisabled,
                  cursor:avail?'pointer':'default',
                  fontSize:11,fontWeight:700,fontFamily:'system-ui',transition:'all 0.15s',outline:'none'}}>
                {item.emoji} {item.label}
              </button>
            );
          })}
        </div>
        <div style={{flexShrink:0,marginLeft:8,display:'flex',gap:6,alignItems:'center'}}>
          <button onClick={toggle} aria-label="Toggle theme"
            style={{padding:'4px 8px',borderRadius:7,border:`1px solid ${C.navBorder}`,background:'transparent',color:C.navInactive,cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:'system-ui'}}>
            {dark ? '\u2600\ufe0f' : '\ud83c\udf19'}
          </button>
          {!st.confirmReset
            ?<button onClick={onReset} style={{padding:'4px 10px',borderRadius:7,border:`1px solid ${C.navBorder}`,background:'transparent',color:C.resetText,cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:'system-ui',whiteSpace:'nowrap'}}>Reset</button>
            :<div style={{display:'flex',gap:4,alignItems:'center'}}>
               <span style={{fontSize:10,color:C.resetLabel,fontFamily:'system-ui',whiteSpace:'nowrap'}}>Start over?</span>
               <button onClick={onConfirmReset} style={{padding:'3px 8px',borderRadius:6,border:'none',background:C.resetYesBg,color:'#ffffff',cursor:'pointer',fontSize:10,fontWeight:700,fontFamily:'system-ui'}}>Yes</button>
               <button onClick={onCancelReset} style={{padding:'3px 8px',borderRadius:6,border:`1px solid ${C.navBorder}`,background:'transparent',color:C.resetNoText,cursor:'pointer',fontSize:10,fontWeight:700,fontFamily:'system-ui'}}>No</button>
             </div>}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('cst-theme') === 'dark'; }
    catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('cst-theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);
  const C = dark ? DARK : LIGHT;
  const ctx = { C, dark, toggle: () => setDark(d => !d) };
  return (
    <ThemeContext.Provider value={ctx}>
      <AppContent/>
    </ThemeContext.Provider>
  );
}

function AppContent() {
  const C = useC();
  const QUIZ_POOL = useMemo(() => buildQuizPool(), []);
  const [st, setSt] = useState({ ...INITIAL_STATE, posttestStarted:false, confirmReset:false, pretestAnswers:{}, posttestAnswers:{} });
  const up = (patch) => setSt(p => ({ ...p, ...patch }));
  const weak = st.pretestScores ? Object.entries(st.pretestScores.domains).filter(([,v]) => pct(v.correct,v.total) < 70).map(([d]) => d) : [];

  const handleNav = (id) => {
    const m = {
      welcome:    () => up({ phase:'welcome',    confirmReset:false }),
      flashcards: () => up({ phase:'flashcards', confirmReset:false }),
      quiz:       () => up({ phase:'quizPicker', confirmReset:false, quizDomain:null, quizQs:null, quizIdx:0, quizAnswers:{} }),
      pretest:    () => up({ phase:'pretest',    confirmReset:false }),
      cresponse:  () => up({ phase:'cresponse',  confirmReset:false }),
      results:    () => st.pretestScores && up({ phase:'results',    confirmReset:false }),
      modules:    () => st.pretestScores && up({ phase:'modules',    confirmReset:false }),
      posttest:   () => st.pretestScores && up({ phase:'posttest',   confirmReset:false }),
      comparison: () => st.postScores    && up({ phase:'comparison', confirmReset:false }),
    };
    m[id]?.();
  };

  const nav = (
    <NavBar st={st} onNav={handleNav}
      onReset={() => up({ confirmReset:true })}
      onConfirmReset={() => setSt({ ...INITIAL_STATE, posttestStarted:false, confirmReset:false, pretestAnswers:{}, posttestAnswers:{} })}
      onCancelReset={() => up({ confirmReset:false })}/>
  );

  const Page = ({ children }) => (
    <div style={{ background:C.bg, minHeight:'100vh', color:C.text }}>{nav}{children}</div>
  );

  if (st.phase === 'welcome') return (
    <Page><Welcome onStart={() => up({ phase:'pretest', qIndex:0, answers:{} })}/></Page>
  );

  if (st.phase === 'flashcards') return (
    <Page><Flashcards st={st} up={up}/></Page>
  );

  if (st.phase === 'cresponse') return (
    <Page><ConstructedResponse st={st} up={up}/></Page>
  );

  if (st.phase === 'quizPicker') return (
    <Page>
      <QuizPicker pool={QUIZ_POOL} onStart={(domain, len, qs) => up({
        phase:'quizRun', quizDomain:domain, quizLen:len, quizQs:qs, quizIdx:0, quizAnswers:{},
      })}/>
    </Page>
  );

  if (st.phase === 'quizRun' && st.quizQs) return (
    <Page>
      <QuestionScreen questions={st.quizQs} answers={st.quizAnswers} qIndex={st.quizIdx}
        onAnswer={(i,a) => up({ quizAnswers: { ...st.quizAnswers, [i]:a } })}
        onNav={(d) => up({ quizIdx: Math.max(0, Math.min(st.quizQs.length - 1, st.quizIdx + d)) })}
        onSubmit={() => up({ phase:'quizDone' })}
        phase={`${st.quizDomain} Quiz`}/>
    </Page>
  );

  if (st.phase === 'quizDone' && st.quizQs) return (
    <Page>
      <QuizResults domain={st.quizDomain} qs={st.quizQs} answers={st.quizAnswers}
        onRetry={() => up({ phase:'quizRun', quizQs: shuffle(st.quizQs), quizIdx:0, quizAnswers:{} })}
        onPick={() => up({ phase:'quizPicker', quizDomain:null, quizQs:null, quizIdx:0, quizAnswers:{} })}/>
    </Page>
  );

  if (st.phase === 'pretest') return (
    <Page>
      <QuestionScreen questions={PRETEST} answers={st.answers} qIndex={st.qIndex}
        onAnswer={(i,a) => up({ answers: { ...st.answers, [i]:a } })}
        onNav={(d) => up({ qIndex: Math.max(0, Math.min(PRETEST.length - 1, st.qIndex + d)) })}
        onSubmit={() => {
          const s = calcScores(PRETEST, st.answers);
          up({ phase:'results', pretestScores:s, pretestAnswers:{ ...st.answers } });
        }}
        phase="Pretest"/>
    </Page>
  );

  if (st.phase === 'results') return (
    <Page>
      <Results scores={st.pretestScores} weakDomains={weak}
        sourceQuestions={PRETEST} sourceAnswers={st.pretestAnswers}
        onContinue={() => up({ phase:'modules' })}/>
    </Page>
  );

  if (st.phase === 'modules') return (
    <Page>
      <ModuleHub weakDomains={weak} completedModules={st.completedModules}
        onSelect={(d) => up({ phase:'module', activeModule:d, modPhase:'content', modPQIndex:0, modPAnswers:{} })}
        onSkip={() => up({ phase:'posttest', posttestStarted:false })}/>
    </Page>
  );

  if (st.phase === 'module') return (
    <Page>
      <LearningModule domain={st.activeModule} phase={st.modPhase}
        pqIndex={st.modPQIndex} pAnswers={st.modPAnswers}
        onBack={() => up({ phase:'modules' })}
        onStartPractice={() => up({ modPhase:'practice' })}
        onPAnswer={(i,a) => { if (i === 'next') { up({ modPQIndex: st.modPQIndex + 1 }); return; } up({ modPAnswers: { ...st.modPAnswers, [i]:a } }); }}
        onFinish={() => up({ phase:'modules', completedModules: [...new Set([...st.completedModules, st.activeModule])] })}/>
    </Page>
  );

  if (st.phase === 'posttest') return (
    <Page>
      {!st.posttestStarted
        ? <div style={{maxWidth:660,margin:'0 auto',padding:'48px 20px',textAlign:'center',fontFamily:'system-ui'}}>
            <div style={{fontSize:48,marginBottom:12}}>🏁</div>
            <h2 style={{fontSize:22,fontWeight:700,color:C.navy,fontFamily:'Georgia,serif',marginBottom:8}}>Time for the Post-Test</h2>
            <p style={{fontSize:15,color:C.muted,marginBottom:28,lineHeight:1.6}}>32 questions · Same domains · Fresh questions<br/>Let's see how much you've grown.</p>
            <button onClick={() => up({ posttestStarted:true, answers:{}, qIndex:0 })}
              style={{padding:'14px 36px',background:C.navy,color:C.white,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif'}}>
              Start Post-Test →
            </button>
          </div>
        : <QuestionScreen questions={POSTTEST} answers={st.answers} qIndex={st.qIndex}
            onAnswer={(i,a) => up({ answers: { ...st.answers, [i]:a } })}
            onNav={(d) => up({ qIndex: Math.max(0, Math.min(POSTTEST.length - 1, st.qIndex + d)) })}
            onSubmit={() => {
              const s = calcScores(POSTTEST, st.answers);
              up({ phase:'comparison', postScores:s, posttestAnswers:{ ...st.answers } });
            }}
            phase="Post-Test"/>}
    </Page>
  );

  if (st.phase === 'comparison') return (
    <Page>
      <Results scores={st.postScores} weakDomains={[]} pretestScores={st.pretestScores}
        isPost={true}
        sourceQuestions={POSTTEST} sourceAnswers={st.posttestAnswers}
        onContinue={() => setSt({ ...INITIAL_STATE, posttestStarted:false, confirmReset:false, pretestAnswers:{}, posttestAnswers:{} })}/>
    </Page>
  );

  return null;
}

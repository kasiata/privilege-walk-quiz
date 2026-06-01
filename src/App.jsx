import { useState, useEffect, useRef } from "react";

const P = {
  bg:"#12082A",bg2:"#1C0F38",bg3:"#241544",bg4:"#2E1A50",
  border:"rgba(180,140,255,0.12)",borderHi:"rgba(200,160,255,0.35)",
  gold:"#D4A837",goldHi:"#F0CC60",goldDim:"#7A5C10",
  purpleHi:"#B890FF",purpleDim:"#3A1A60",
  cream:"#F5EDD8",muted:"#7A6890",mutedDim:"#3A2850",
  yes:"#50D878",sometimes:"#E8C030",no:"#F05060",
  font:"'DM Serif Display','Playfair Display','Georgia',serif",
  serif:"'Georgia','Times New Roman',serif",
};

const QUESTIONS = [
  {era:"GROWING UP",text:"As a child, was your family financially stable enough that money wasn't a daily source of stress at home?",scores:{yes:2,sometimes:1,no:0}},
  {era:"GROWING UP",text:"Did you have access to arts education, instruments, or creative classes as a child — without it being a financial sacrifice for your family?",scores:{yes:2,sometimes:1,no:0}},
  {era:"GROWING UP",text:"Did you complete your schooling without needing to work to financially support yourself or your family?",scores:{yes:2,sometimes:1,no:0}},
  {era:"GROWING UP",text:"As a child, did you see people who shared your background — class, ethnicity, gender — succeeding visibly in the arts?",scores:{yes:2,sometimes:1,no:0}},
  {era:"RACE & ETHNICITY",text:"Has your racial or ethnic background ever meant you had to prove your legitimacy harder than peers in the same room?",scores:{yes:0,sometimes:1,no:2}},
  {era:"RACE & ETHNICITY",text:"Has your cultural background ever been treated as an 'interesting angle' or exotic selling point, rather than simply your perspective?",scores:{yes:0,sometimes:1,no:2}},
  {era:"RACE & ETHNICITY",text:"Has your name, appearance, or accent ever worked against you in professional arts contexts — auditions, applications, introductions?",scores:{yes:0,sometimes:1,no:2}},
  {era:"IMMIGRATION & BELONGING",text:"Have you ever had to rebuild your artistic career in a new country — new language, new networks, starting from zero credibility?",scores:{yes:0,sometimes:1,no:2}},
  {era:"IMMIGRATION & BELONGING",text:"Do you hold citizenship or stable residency in the country where you work — giving you full, unworried access to grants and institutions?",scores:{yes:2,sometimes:1,no:0}},
  {era:"IMMIGRATION & BELONGING",text:"Has language ever been an invisible wall between you and opportunities, collaborators, or funding juries?",scores:{yes:0,sometimes:1,no:2}},
  {era:"GENDER & CARE",text:"Has being a woman, non-binary, or gender-nonconforming person meant facing extra gatekeeping — in auditions, applications, or simply being taken seriously?",scores:{yes:0,sometimes:1,no:2}},
  {era:"GENDER & CARE",text:"Are you a parent or primary caregiver — managing childcare, school logistics, or care for a family member alongside your artistic practice?",scores:{yes:0,sometimes:1,no:2}},
  {era:"GENDER & CARE",text:"In your household, do you carry most of the invisible domestic management — tracking appointments, organising logistics, holding the mental load?",scores:{yes:0,sometimes:1,no:2}},
  {era:"GENDER & CARE",text:"Has your family — parents, partner, or close relatives — actively supported your decision to pursue an artistic career, in words or in money?",scores:{yes:2,sometimes:1,no:0}},
  {era:"HEALTH",text:"Does chronic illness, disability, or ongoing mental health challenges significantly limit your capacity to work, travel, or sustain a practice?",scores:{yes:0,sometimes:1,no:2}},
  {era:"HEALTH",text:"Do you have reliable access to healthcare — physical and mental — without it representing a serious financial burden?",scores:{yes:2,sometimes:1,no:0}},
  {era:"TIME & ENERGY",text:"Can you dedicate more than three days per week to your artistic practice without it threatening your ability to pay rent or eat?",scores:{yes:2,sometimes:1,no:0}},
  {era:"TIME & ENERGY",text:"Do you typically arrive at your creative work with enough energy — not already depleted by teaching shifts, commuting, or domestic labour?",scores:{yes:2,sometimes:1,no:0}},
  {era:"TIME & ENERGY",text:"Can you afford — financially and emotionally — to slow down, experiment, or fail on a project without it becoming a crisis?",scores:{yes:2,sometimes:1,no:0}},
  {era:"EDUCATION",text:"Did you attend an arts institution whose name carried social capital — opening professional doors beyond what you learned inside?",scores:{yes:2,sometimes:1,no:0}},
  {era:"EDUCATION",text:"Did you complete your arts education without taking on debt that still shapes your financial decisions today?",scores:{yes:2,sometimes:1,no:0}},
  {era:"CLASS & CONNECTIONS",text:"Have you received significant opportunities — commissions, residencies, exhibitions, funding — through family connections or inherited social networks?",scores:{yes:2,sometimes:1,no:0}},
  {era:"CLASS & CONNECTIONS",text:"Do you feel at ease navigating the social rituals of the art world — openings, panels, dinners — without performing a version of yourself that exhausts you?",scores:{yes:2,sometimes:1,no:0}},
  {era:"CLASS & CONNECTIONS",text:"Have you been able to attend residencies, conferences, or international networking events without travel costs being a genuine obstacle?",scores:{yes:2,sometimes:1,no:0}},
  {era:"RESOURCES",text:"Do you have access to a studio, rehearsal space, or dedicated workspace without it representing a major financial burden?",scores:{yes:2,sometimes:1,no:0}},
  {era:"NOW",text:"Right now — could you take a full month off from paid work to focus entirely on an artistic project without it causing a financial crisis?",scores:{yes:2,sometimes:1,no:0}},
];

const MAX_SCORE = QUESTIONS.reduce((s,q)=>s+Math.max(...Object.values(q.scores)),0);

const LABELS = [
  {min:0, max:12,label:"Backstage Door",   color:"#E05040",bg:"rgba(224,80,64,0.12)",  floor:"Cracked concrete. Character-building, apparently."},
  {min:13,max:24,label:"General Admission",color:"#E09030",bg:"rgba(224,144,48,0.12)", floor:"Industrial linoleum. Very wipeable."},
  {min:25,max:35,label:"Reserved Seat",    color:"#D4A837",bg:"rgba(212,168,55,0.12)", floor:"Beige commercial carpet. Inoffensive."},
  {min:36,max:44,label:"VIP",              color:"#50C878",bg:"rgba(80,200,120,0.12)", floor:"Polished hardwood. Tastefully squeaky."},
  {min:45,max:50,label:"Velvet Rope",      color:"#60B0FF",bg:"rgba(96,176,255,0.12)", floor:"Actual velvet. Obviously."},
];

const ERA_COLORS = {
  "GROWING UP":"#E09030","RACE & ETHNICITY":"#E05040",
  "IMMIGRATION & BELONGING":"#9060C0","GENDER & CARE":"#E050A0",
  "HEALTH":"#40B8A0","TIME & ENERGY":"#5080E0",
  "EDUCATION":"#50C070","CLASS & CONNECTIONS":"#D4A837",
  "RESOURCES":"#E09030","NOW":"#B060D0",
};

// Pre-written quotes — one per question per guide (26 each)
const Q = {
beethoven:[
  "My father drank my performance fees. I was seven. He called it reinvesting in talent.",
  "I had a count as patron at eleven. He was more reliable than my father. Most furniture was.",
  "I left school at ten to earn money. I have called this 'choosing art' ever since.",
  "I saw white men with wigs — mine was superior — and found nothing suspicious about the pattern.",
  "Taken seriously at seven, no credentials checked. Nobody thought to ask. This remains the system.",
  "My music was called universal. Universal means legible to whoever is currently running the room.",
  "My name opened every door in Vienna. I have spent zero minutes wondering what it costs when a name doesn't.",
  "I moved from Bonn to Vienna with letters from a prince. I cannot imagine arriving without them.",
  "Subject of the Holy Roman Empire. Bureaucratic nightmare. Never undocumented. There is a difference.",
  "I composed in the only musical language considered serious at the time. It happened to be mine.",
  "Rude, impossible, unmanageable — they called it genius. I wonder if that diagnosis was universally available.",
  "I attempted to raise my nephew. Catastrophic. And I had zero other domestic responsibilities. Still exhausting.",
  "My housekeeper knew where everything was. I did not know where the candles were for twenty years.",
  "Prince Lichnowsky: lodging and a stipend. My family: piano at 4am. Not equivalent forms of support.",
  "I went deaf. Awful. I also had patrons, savings, and no visa complications. Several things at once.",
  "My physician was provided by a patron. Treatments useless, but free. I died at 56. Draw conclusions.",
  "I composed between begging letters. Some weeks the letters took longer. Wine and gambling filled the rest.",
  "I walked four hours in the hills each morning. Not arriving from a night shift. This matters.",
  "The Ninth took years of false starts. A patron covered the losses. Courage is cheaper with a safety net.",
  "I studied with Haydn. His name on my résumé opened more doors than anything he actually taught me.",
  "No debt, no diploma, father a professional musician. In my era this was called humble origins.",
  "My father introduced me to an elector at seven. I assumed this was simply how careers began.",
  "Rude to everyone, still invited back everywhere. I have spent a small amount of time wondering why.",
  "I went where the money was. The money sent a carriage. People without carriages rarely arrived.",
  "I moved seventy-three times in Vienna. Not wanderlust. Rent.",
  "Notice what happens when you sit with this question. That hesitation is not nothing.",
],
picasso:[
  "My father was an art teacher. I could draw before I could write. Nobody called this a head start.",
  "My father gave me his brushes at thirteen in a ceremony. I accepted them as though earned. I had not.",
  "Never finished school. Too busy painting. My family required nothing from me financially.",
  "I saw Spanish, male, trained, European everywhere I looked. I assumed I was the default setting.",
  "Called Spanish when exotic, universal when convenient. I adjusted my accent to the room.",
  "My work was called revolutionary — no qualifier. I watched carefully what distinguished this from 'interesting for someone like you.'",
  "My name became so famous that being unpronounceable became charming. Fame is a tremendous workaround.",
  "I fled Franco's Spain but arrived in Paris already knowing Apollinaire, Stein, and three dealers.",
  "French residency for most of my adult life, at considerably less cost than it costs most people.",
  "I spoke French with a Spanish accent forever. In my case, this was considered charming.",
  "I had studios, wives, mistresses, and an assistant managing my calendar and emotional states simultaneously.",
  "I had several children. Their mothers raised them. I painted. Critics called this total dedication.",
  "My domestic situation was managed by others — multiple others, sometimes in the same building.",
  "My mother said I would be a painter or a general. Both require others to do the difficult parts.",
  "I lived to ninety-one painting until the end. Partly genius. Partly not worrying about rent for sixty years.",
  "Excellent doctors in France, connected to having money in France. I never examined this connection closely.",
  "Studios in Montmartre, Montparnasse, South of France, then a chateau, then another chateau.",
  "Twelve-hour days with people managing the other twelve. I called the arrangement simply 'how I work.'",
  "I destroyed canvases on a whim because I could afford more canvas. Conviction and resources look the same from outside.",
  "Studied at Barcelona School of Fine Arts, then the Royal Academy. I have called myself self-taught in four interviews.",
  "No student debt. Father was a professor. Connected facts I have not previously placed in the same sentence.",
  "Gertrude Stein introduced me to everyone who mattered. These meetings were scheduled. By Gertrude. In advance.",
  "I entered every room as though I owned it. Easier if you have previously owned rooms. I had.",
  "Winters in the South of France as creative necessity. Others call this a holiday they cannot afford.",
  "Three studios simultaneously. I needed space to think — specifically, three buildings' worth.",
  "Notice the gap between your first instinct and your answer. That gap is the data.",
],
jackson:[
  "Nine people in a two-bedroom house in Gary, Indiana. Financial stress sounded like my father's voice.",
  "My vocal training began at birth. The cost was paid in a currency not on arts grant applications.",
  "On the road at six. By the time I could go back to school, I was too famous for it to be practical.",
  "I did not see people who looked like me at the very top. I saw what the price of getting there looked like.",
  "Twice as technically perfect for half the institutional respect. Eventually I received it. The accounting stands.",
  "My early work was called urban. My later work was called pop. The music didn't change.",
  "I changed my appearance substantially. People developed confident theories. Very few rang the doorbell and asked.",
  "Growing up in America provided the full range of structural obstacles. Moving countries was not additionally required.",
  "American citizenship: helpful in certain rooms, entirely beside the point in others.",
  "English was my language. The walls that existed were built from different materials — more expensive ones.",
  "Male, and still fought for creative control of my own recordings. The arithmetic implies something for others.",
  "Became a father when I had enough resources to do it very differently than it was done to me.",
  "People managed everything domestic. People also managed me. The line between support and ownership blurred.",
  "My family supported me the way an engine supports its highest-output component. Efficiently. Continuously.",
  "Significant health and pain issues for years, managed in ways later used as evidence in publications called journalism.",
  "The best medical care money could buy. What it bought was not always what I needed.",
  "I performed while exhausted, unwell, grieving, because the show required it. The show never asked how I was.",
  "I arrived having already performed multiple times that day, since childhood. Depletion was my operating system.",
  "I had creative freedom eventually. I purchased it. It was not a gift.",
  "No conservatory. I learned on stages in front of thousands from age five. Non-refundable tuition.",
  "No student debt because there were no students. A different kind of debt, on undisclosed terms.",
  "I met presidents. My family connections were not what opened those doors.",
  "Most famous person in the world, and still in rooms where I was treated as a problem to manage.",
  "Toured every continent. Logistics managed by others. I note this as privilege because it was.",
  "I had Neverland. Before that, a bedroom shared with four brothers in Gary. Not a metaphor. A measurement.",
  "Notice what you feel reading this question. That feeling is data. Keep it.",
],
nureyev:[
  "My father was a Red Army soldier. We were evacuated across Russia in wartime. Stability was theoretical.",
  "Travelled five hundred kilometres at eleven to audition. My mother couldn't afford the ticket. A stranger paid.",
  "I studied on a Soviet scholarship. The state gave me training it technically owned. I defected with it.",
  "No one like me at the top — Tartar, working class, from Ufa. I invented a version the system could tolerate.",
  "In Leningrad: liability. In Paris: animal magnetism. Same person. Location is everything for the same characteristic.",
  "My difference was repackaged as charisma once I was famous. Nobody mentioned Ufa. I did. It rarely appeared.",
  "My accent was Russian. In the West, romantic. I am aware this is not the universal experience.",
  "I defected at Le Bourget with no plan, no money, no language. I also had a talent that had arrived before me.",
  "Austrian citizenship eventually. Decades of paperwork. Multiple interventions from powerful people. Not guaranteed.",
  "I performed in French, English, Italian. Ballet requires no translation. I was grateful for this every day.",
  "Gay in an era when this was criminal in my home country. Extreme fame provided partial insulation. Partial.",
  "No children. Three hundred pairs of shoes. Not equivalent domestic arrangements, though the shoes were simpler.",
  "I managed my company, career, schedule, and all domestic matters simultaneously, alone. I do not recommend it.",
  "My family in the Soviet Union paid for my defection without being consulted. That is a different kind of support.",
  "I danced through significant pain for the last decade. Ballet does this to bodies deliberately. No alternative.",
  "Soviet healthcare until I didn't have it. Western healthcare when I had money. The gap is a chasm.",
  "I rehearsed every day, including the day I had pneumonia. People called this dedication. I called it survival.",
  "I arrived in the West unable to communicate and danced a full performance within the week.",
  "I destroyed my body pursuing roles that required it. I was right about the roles and wrong about age fifty.",
  "I studied at the Vaganova Academy under Pushkin. Without that specific training, nothing in this story follows.",
  "No debt. Soviet scholarship. No money. Then Western fame. The economics follow no recognisable pattern.",
  "My network was built from zero in a language I didn't speak in a country I had illegally entered.",
  "I moved through the highest social circles in Europe. Getting there felt like learning to breathe different air.",
  "Toured constantly. Early years: very little pay. Later: more. Physical cost per performance: identical.",
  "No studio for most of my career. Company spaces. When I ran a company, I provided one. Didn't mention I'd never had it.",
  "Consider whether the word 'could' is doing significant work in that sentence.",
],
hitchcock:[
  "My father was a greengrocer. We were comfortable but not wealthy. Comfortable conceals considerable distance.",
  "I educated myself in cinema from cheap seats and library books. Self-taught means taught without being paid.",
  "Working from fifteen. The family expected it. I have since developed a more complete picture of what I wasn't experiencing.",
  "I saw directors who looked precisely like me — white, male, British, technically competent. Found nothing suspicious.",
  "English accent in Hollywood: signalled authority to producers who were mostly not English. I used this aggressively.",
  "My Englishness was a brand in America. I cultivated it deliberately. Capital you deploy consciously still works.",
  "My weight attracted commentary. I made it part of my persona before others could make it a liability.",
  "I came to Hollywood in 1939 with an agent, a contract, and Selznick's backing. This is immigration with a parking spot.",
  "British then American citizenship, no meaningful complications, paperwork filed by someone else.",
  "I directed in English in an industry built entirely in English. I had a language advantage, not a barrier.",
  "Male, navigated the studio system with complete fluency, then dominance. I am the benchmark for 'meritocracy.'",
  "No children requiring school runs. My wife Alma managed the household, scripts, notes, and uncredited rewrites.",
  "Alma supervised everything. I credited her in several interviews. Several.",
  "My family thought filmmaking was a reasonable ambition for a greengrocer's son. This is rarer than it sounds.",
  "Significant health complications later in career. The support structure enabling continuation was not available to all.",
  "Private healthcare in America. Never having to ask is a freedom so complete it becomes invisible.",
  "Complete creative control took twenty years and becoming commercially indispensable. Freedom came after leverage.",
  "Same time, same suit, every day. This is what sufficient money looks like: routine undisrupted by emergency.",
  "I made commercially risky films. Studios absorbed losses I couldn't have absorbed personally in earlier years.",
  "Never attended film school. Learned at Gainsborough as a title card designer. The door opened because I was there.",
  "No film school, no debt, employed by the industry from the start at a salary. I formally recommend this.",
  "I met everyone in British and American film over four decades. I manufactured connections through time and stability.",
  "I moved through Hollywood as though I owned it. By a certain point, I owned a significant portion. Psycho was profitable.",
  "I travelled anywhere for any film. Location was a creative decision, never a financial question.",
  "An office at Universal for the rest of my life, long after I stopped making films. Space was never a question.",
  "At this stage: yes, easily. At twenty-three: absolutely not. The question stays the same. Think about that slowly.",
],
brando:[
  "My father drank and travelled. We moved constantly. Neither stable nor destitute — different textures, different implications.",
  "Drama classes because my sister Dorothy identified the talent and pushed me. Dorothy has not received adequate credit.",
  "Expelled from military school. My family did not require me to earn money to survive. This fact gets stepped around.",
  "I saw actors who looked like me at the very top. I assumed the system was neutral. It was calibrated for me.",
  "I am white. Whatever doors opened, I didn't hear them opening. Doors that open quietly don't announce themselves.",
  "My whiteness was infrastructure I moved through without noticing. Invisible infrastructure is still infrastructure.",
  "My name was not a professional obstacle. My behaviour was, occasionally, deliberately. Different categories entirely.",
  "I arrived in New York at eighteen with forty dollars — and white, male, tall, with the confidence of someone never told they didn't belong.",
  "American citizenship. In postwar entertainment, this was the assumed starting position, not a complication.",
  "English: my language, my instrument, my birthright. Method acting requires linguistic granularity. I had it by birth.",
  "Male and the entire star system oriented toward my category. I surfed this for decades without naming the wave.",
  "Children across multiple relationships. Largely absent. My career did not record this as a deficit.",
  "I lived in Tahiti for extended periods. Others managed the mainland. I called this necessary distance from the industry.",
  "My family gave me damage I converted into performances. True — and also conveniently romantic.",
  "Significant mental health struggles, addressed privately when I chose to. Both the money and the choice are unevenly distributed.",
  "Private healthcare eventually. The years before were instructive about the difference between having a doctor and not.",
  "I worked intensely and then refused to work. This requires enough savings that refusal is a statement, not a catastrophe.",
  "I prepared obsessively and also arrived occasionally having not slept and in friction with the script. The preparation held.",
  "I refused the Oscar in 1973. Political act. Affordable only when financially secure enough to absorb the response.",
  "I studied at the Actors Studio. Stella Adler found me through the network of people already paying attention.",
  "No student debt. The training was short and I was earning before it ended. The correct order, when available.",
  "Stella Adler located me through word of mouth. I did not find her through a system. Networks are not systems.",
  "I moved through Hollywood as though I could opt out of it entirely. You can only do this after mastering it thoroughly.",
  "The Godfather and Last Tango in the same year. Also nearly bankrupt during both productions.",
  "I owned Tetiaroa, a private atoll in French Polynesia. The distance from Gary, Indiana to owning a private atoll is not a metaphor.",
  "Notice whether your answer would have been different ten years ago. Then consider carefully why.",
],
woolf:[
  "My father was Sir Leslie Stephen, a prominent literary critic. We were not short of money. Somewhat short of permission.",
  "I educated myself in my father's library while my brothers went to Cambridge. Formative in a different direction.",
  "I did not need to work to survive as a young woman. The alternative was being managed by male relatives.",
  "I looked around at serious writers and saw men who had been to Oxford, Cambridge, or both — as though once was insufficient.",
  "White and born into the English literary establishment. My racial privilege is uncomplicated by any competing disadvantage here.",
  "My writing was English. Reviewed by English critics who found it brilliant or hysterical, often in the same sentence.",
  "My name opened doors in literary London. My father's name had opened them first. I walked through pre-opened doors.",
  "I never had to rebuild in another country. I did move to Bloomsbury, which is a different kind of relocation.",
  "British, born and educated. My access to publishers, critics, and the literary apparatus was structurally guaranteed.",
  "English: my first language, my instrument, my inheritance. Language as a wall is something I understood theoretically.",
  "A woman in an era when this meant being taken seriously about 60% less than the work warranted. I wrote four million words about this.",
  "No children, deliberately. Leonard and I decided this together, also with input from doctors with opinions about my nervous system.",
  "Leonard managed everything domestic — and my schedule, my crises, the printing press in the basement. I wrote.",
  "My family — specifically Leonard — supported my writing with a completeness I have struggled to describe without it sounding like management.",
  "I had breakdowns. I had Leonard, a house in the country, private doctors, and the financial ability to stop working. Built from money.",
  "Private healthcare — such as it was in the 1930s. I had access to the best available. The best available was not always reassuring.",
  "I wrote every morning, then rested, then walked. I did this because my health required it and a household ran without my management.",
  "I arrived at the desk relatively rested because Leonard had arranged it. Not the same as arriving rested because nothing needed me.",
  "I wrote To the Lighthouse over several years. I had Monks House, a private press, a room, and an income.",
  "I was part of Bloomsbury — Cambridge-educated intellectuals inventing the literary canon while dining together. One's education is also one's network.",
  "No student debt. No formal education. A library and a father who published. Access without invoice.",
  "I knew everyone in English letters because I was born knowing them. The network was the room I grew up in.",
  "I moved through literary London as someone who belonged there by inheritance. The energy saved by not performing belonging is not nothing.",
  "I travelled to France, Greece, Italy — for pleasure and health. Funded by books, press, Leonard's salary, my inheritance.",
  "I had a room of my own. I had money. I wrote about needing both because I had them and could see what their absence meant.",
  "Notice whether you answered quickly or slowly. The speed is data. What you didn't think about is also data.",
],
chanel:[
  "My father abandoned his five children to an orphanage after my mother died. I told journalists he sent me to be raised by elegant aunts.",
  "The orphanage taught me to sew. I have described my sewing as something I simply always knew. I did. The orphanage taught me.",
  "I worked as a seamstress and café singer before I became Coco Chanel. No family financial support — because there was no family.",
  "I saw the women at the top of fashion and concluded I would manufacture the appearance of having been born there until it became true.",
  "White and French, in an industry built by and for white European women. I had every racial and national advantage available.",
  "My aesthetic was called authentically French. Correct. I was French. Born in a poorhouse. The 'authentic' referred to something else.",
  "My name was Gabrielle Bonheur Chanel. I became Coco from a café song. Then Chanel. Each change was a deliberate argument.",
  "I moved from poverty in the Auvergne to the top of Parisian society — and also had two wealthy lovers who provided the apartment and introductions.",
  "Multiple residencies in France and Switzerland, eventually. The paperwork managed by people I paid for that purpose.",
  "French was my language and the language of fashion for most of the twentieth century. Not a wall. A system — for others.",
  "A woman in a field I largely invented, which meant serious once too famous to ignore and not quite serious enough before that.",
  "I had no children. Boy Capel was the love of my life. He died in 1919. After that I had the work.",
  "I managed the House of Chanel, the collections, the perfume, the apartments, the staff, and the mythology. There was only me.",
  "My family did not support my career because my family was not available to support anything. I have called this independence.",
  "I built an empire starting from nothing — and from two well-connected lovers, a free apartment in Paris, and sixty years of lying about my origins.",
  "Healthcare: whatever I could afford, which changed dramatically across my career. The difference between early and late years was significant.",
  "I worked every day until eighty-seven. Whether this was dedication or terror of stopping has not been definitively resolved.",
  "I arrived at the atelier having managed my own schedule, correspondence, finances, and legend since approximately 1910.",
  "I relaunched Chanel at seventy-one after a fifteen-year absence. Initially mocked, then globally copied. Patience requires somewhere to wait.",
  "No formal training. I learned to sew in an orphanage and learned everything else in rooms I wasn't supposed to be in.",
  "No debt from education. No education. The absence of formal training was both my limitation and my legend. I made the legend louder.",
  "Boy Capel introduced me to polo circles, aristocracy, and pre-war Parisian society. Without that introduction, the story starts much later.",
  "I eventually moved through Parisian society as though I had always belonged. The performance required was the most demanding of my career.",
  "I travelled everywhere later. Earlier: Moulins, Vichy, Paris, in that order, by necessity and the geography of what was available to someone with nothing.",
  "I had an apartment in the Ritz for thirty-four years. Before that: the orphanage. Read that sentence slowly.",
  "Notice what you assumed about yourself before you answered. That assumption and the answer are both data.",
],
hughes:[
  "My grandmother raised me in Lawrence, Kansas. We were sustained by her pension from her first husband's Civil War service. Several American histories in one sentence.",
  "I had access to the public library in Lawrence. Free. In a different decade or state, it might not have been available to me at all.",
  "I worked constantly from childhood — newspapers, hotels, sugar cane in Mexico, ships, a nightclub in Paris. Survival that happened to be educational.",
  "I looked at who was considered a serious American writer and saw white men. I understood I would need to be so undeniably good that questioning whether I belonged became logistically embarrassing.",
  "Every professional room I entered had been built without me in mind. Some had been built specifically to exclude me. I entered anyway.",
  "My work was called the authentic voice of the Negro experience. I was also just a poet. These are not mutually exclusive but they are differently remunerated.",
  "My name: Langston Hughes — acceptable in most rooms. My face: considerably less acceptable in many of the same rooms.",
  "I lived in Mexico, France, Spain, the Soviet Union, Japan, Haiti. Not tourism. Strategic distance from certain American conditions.",
  "American. In some countries this opened doors. In America, other aspects of my identity were more operationally significant than my citizenship.",
  "I wrote in the rhythms of jazz and blues because formal English poetry was not built to hold what I needed to say. I built a new room inside the language.",
  "Gay in an era when this was not survivable as a public identity, and in a Black community where the additional vulnerability was acute. I lived very carefully.",
  "No children. I had the work and the road and decades of students and correspondents I mentored.",
  "I managed writing, travel, finances, correspondence, teaching, and being the person Black students wrote to. Both things were my domestic arrangement.",
  "My grandmother told me stories of resistance and dignity that I have called the foundation of everything I wrote. The only inheritance that cannot be taxed.",
  "Health complications throughout my life, some from conditions of poverty, some from the road. No reliable access to good medical care for most of my career.",
  "Medical care: whatever was available and affordable, which in Jim Crow America for a Black man was not what was available to white contemporaries at equivalent means.",
  "I wrote every day. The writing happened in the margins of the surviving, which is not ideal but was the condition I had.",
  "I arrived at the desk after whatever the day had required, which was often considerable. The only alternative to writing was not writing. Unacceptable.",
  "I could not afford to fail commercially for long — there was no one to absorb the losses. Bravery looks different when you understand the margin.",
  "I attended Lincoln University, a historically Black university in Pennsylvania. My education was excellent. It was also segregated by design.",
  "I had a scholarship to Lincoln. Without it, no university. Without university, a different story. The scholarship was the fulcrum.",
  "I knew Zora Neale Hurston, Countee Cullen, Carl Van Vechten — everyone in Harlem in the twenties. An extraordinary network operating within a system with firm ceilings on every person in it.",
  "I moved through Harlem as someone who belonged, and through white literary America as someone acknowledged but not quite admitted. The difference between those two words is where the energy went.",
  "I lived in Harlem and lectured across America. The hotels in the South required navigating Jim Crow. Being Black in America was a full-time administrative role.",
  "I rented rooms in Harlem for most of my career. Eventually had a brownstone on East 127th Street. I am told I should mention this with more pride.",
  "Read this question as though money were not abstract. As though a month has thirty days each requiring something. Then answer.",
],
warhol:[
  "We were poor in Pittsburgh. My mother saved soup cans. Later I painted them. Critics called it irony. I called it autobiography with better margins.",
  "I had a scholarship to Carnegie Institute of Technology. Without it: Pittsburgh. With it: New York. Not a small distinction.",
  "I worked from childhood — paper routes, groceries. The Factory came much later. The labour ethic was always there. The pay improved dramatically.",
  "I grew up looking at movie stars who looked nothing like me — pale, androgynous, Central European, odd. I made 'odd' into an aesthetic. Cheaper than fixing it.",
  "Eastern European in New York: not exotic, just immigrant, which is invisible. Invisible turned out to be a useful resource until I could replace it with famous.",
  "My work was described as commentary on American consumer culture by people who had been admitted to American consumer culture without complications. I found this funny.",
  "My name was Warhola. I dropped the 'a' on my second day in New York. A small editorial decision with a surprisingly long shadow.",
  "Immigrant family, New York at twenty-one, portfolio and very little else. The city absorbed me. Cities absorb differently depending on what you're carrying.",
  "American-born. This made specific things simpler. Not simple. Simpler. The distinction between those two words is the entire content of this question.",
  "Rusyn at home, American English performed everywhere else. Everything I did was performance. Only a problem if you aren't skilled at it.",
  "Gay when this was illegal in most US states and professionally catastrophic in most industries. I managed through strategic ambiguity maintained for decades.",
  "No children. I had the Factory instead. Considerably less biologically inevitable but approximately as demanding.",
  "The Factory ran on other people's labour, much of which I did not pay at adequate rates. I was the creative director. Others were the infrastructure.",
  "My mother Julia lived with me for twenty years, managed the house, and also made art. I showed my work in galleries. Hers I showed to houseguests. I know.",
  "I was shot in 1968 and nearly died. The psychological consequences lasted the rest of my life and are underrepresented in the mythology.",
  "Good healthcare eventually. Routine gallbladder surgery killed me through a complication that wasn't caught. Good and safe healthcare are not synonymous.",
  "I worked every day. The Factory was always open. Whether this was dedication, compulsion, or anxiety about stopping remains unresolved. Probably all three.",
  "I arrived having slept very little, attended several parties, made notes on everything, and already had three ideas. Genius or sleep disorder — undetermined.",
  "I made work that failed commercially for years before it didn't. Commercial illustration paid the bills. The commerce subsidised the art which became the commerce.",
  "I studied at Carnegie Mellon. This gave me technical skills and a New York-facing network. Both mattered enormously. I mention the skills more often.",
  "Scholarship covered tuition. Other costs I managed. Just. The word 'just' deserves to be looked at.",
  "I knew everyone in New York by design. The Factory was architecturally a connection machine. I designed the connections and described them as organic.",
  "I moved through New York as celebrity and outsider simultaneously. I turned the simultaneity into an aesthetic and charged admission.",
  "I travelled internationally once I had money. Before money: I did not. The work requiring travel waited.",
  "The Factory was my studio. Before the Factory: my apartment. You can make considerable art in a small apartment if nothing else is using it.",
  "In my last years: yes, a month off, easily. In my first years: I ate candy for dinner. Then I started charging people to watch me eat soup. The distance is the whole story.",
],
};

const GUIDES = {
  beethoven:{name:"Ludwig van Beethoven",years:"1770–1827",role:"Composer",     emoji:"🎼",ac:"#D4A837",job:"Composer",
    intro:"People say I was a genius. Correct. They rarely mention the three aristocratic patrons, the father who launched my career at age three, or being born male in a century when that was artistically decisive. I composed despite my deafness and because of my connections. Both are true. I find this just as annoying as you do."},
  picasso:  {name:"Pablo Picasso",        years:"1881–1973",role:"Painter",      emoji:"🎨",ac:"#E84040",job:"Painter",
    intro:"I am perhaps the most famous artist of the twentieth century. I was also the son of an art professor who handed me his brushes at thirteen in a formal ceremony, as though I had earned them. I invented Cubism. My father invented my career. We each did important work, and only one of us is in art history."},
  jackson:  {name:"Michael Jackson",      years:"1958–2009",role:"Singer",       emoji:"🎤",ac:"#9050E0",job:"Singer / Performer",
    intro:"I sold more records than almost anyone who has ever lived. I also started performing professionally at age five, which was not optional. I would like you to think carefully about what 'gifted childhood' means before we start."},
  nureyev:  {name:"Rudolf Nureyev",       years:"1938–1993",role:"Dancer",       emoji:"🩰",ac:"#40A0E0",job:"Dancer / Choreographer",
    intro:"I defected from the Soviet Union at twenty-three with nothing — no money, no contacts, no language, one suitcase of dance shoes, and a talent so large it had preceded me across the border. I became the most famous dancer in the world. I was extraordinarily talented and extraordinarily lucky, and if you take away either, the story ends at the airport."},
  hitchcock:{name:"Alfred Hitchcock",     years:"1899–1980",role:"Film Director",emoji:"🎬",ac:"#A0A0C0",job:"Film Director",
    intro:"I am the Master of Suspense. I came from a grocer's family in Leytonstone, East London. Both facts are true simultaneously. I spent my professional life showing audiences that things are not what they appear to be. It seems reasonable to apply this to my own biography."},
  brando:   {name:"Marlon Brando",        years:"1924–2004",role:"Actor",        emoji:"🎭",ac:"#C08040",job:"Actor",
    intro:"They say I changed acting. I probably did. I had a deeply unstable home — alcoholic father, mother who periodically disappeared into herself. Dysfunction is not poverty, poverty is not disadvantage, and all three operated differently in my case. I spent quite a lot of money in therapy eventually understanding the distinctions."},
  woolf:    {name:"Virginia Woolf",       years:"1882–1941",role:"Writer",       emoji:"📖",ac:"#60C0B0",job:"Writer",
    intro:"I wrote that a woman must have money and a room of her own if she is to write fiction. I wrote this in 1929. I am delighted to report the problem has been entirely solved since then and this quiz is therefore unnecessary. I am not serious. The problem has not been solved. That is why you are here."},
  chanel:   {name:"Coco Chanel",          years:"1883–1971",role:"Fashion Designer",emoji:"👗",ac:"#D0C0A0",job:"Fashion Designer",
    intro:"I invented modern elegance and created the most famous perfume in history. I also invented an entirely fictional version of my childhood and repeated it with such confidence it became my official biography. I was born in a poorhouse. I told people I was raised by elegant aunts in the country. Both cannot be true. I know which one is."},
  hughes:   {name:"Langston Hughes",      years:"1902–1967",role:"Poet",         emoji:"✍️",ac:"#E8A030",job:"Poet / Literary Artist",
    intro:"I was the poet laureate of the Harlem Renaissance and a Black man in America during the era of Jim Crow, the Great Migration, and McCarthy. I want to be upfront: my answers to most of these questions are going to go a particular direction, and I think that is rather the point of the exercise."},
  warhol:   {name:"Andy Warhol",          years:"1928–1987",role:"Other Creative",emoji:"🍌",ac:"#D040B0",job:"Other Creative",
    intro:"I came from a Carpatho-Rusyn immigrant family in Pittsburgh. I was sickly, strange, gay, and so pale I appeared to be a visual experiment. I understood, earlier than most, that in America image is infrastructure and can be built deliberately. I built mine with great care and charged people to look at it."},
};

const CATS = [
  {key:"beethoven",label:"Composer",               desc:"I compose or make music"},
  {key:"picasso",  label:"Visual Artist",           desc:"I work with visual art"},
  {key:"jackson",  label:"Singer / Performer",      desc:"I perform or sing"},
  {key:"nureyev",  label:"Dancer / Choreographer",  desc:"I dance or choreograph"},
  {key:"hitchcock",label:"Film Director",           desc:"I direct or make films"},
  {key:"brando",   label:"Actor",                   desc:"I act on stage or screen"},
  {key:"woolf",    label:"Writer",                  desc:"I write fiction or prose"},
  {key:"chanel",   label:"Fashion Designer",        desc:"I design fashion or textiles"},
  {key:"hughes",   label:"Poet / Literary Artist",  desc:"I write poetry or literature"},
  {key:"warhol",   label:"Other Creative",          desc:"My practice doesn't fit above"},
];

const FACE_DATA = {
  beethoven:{hair:"#EDE8D8",ht:"wig",   skin:"#F5C98A",top:"#1A1A2A",ac:"#C8A020"},
  picasso:  {hair:"#1A1A1A",ht:"beret", skin:"#F0C888",top:"#1A50A0",ac:"#E84040"},
  jackson:  {hair:"#1A1008",ht:"jheri", skin:"#8B5E3C",top:"#1A1A0A",ac:"#C8A020"},
  nureyev:  {hair:"#5A3010",ht:"swept", skin:"#E8B888",top:"#101820",ac:"#40A0E0"},
  hitchcock:{hair:"#4A3828",ht:"bald",  skin:"#F0D0A8",top:"#0A0A0A",ac:"#A0A0C0"},
  brando:   {hair:"#1A1208",ht:"slick", skin:"#E8B880",top:"#F0F0EE",ac:"#C08040"},
  woolf:    {hair:"#3A2810",ht:"bun",   skin:"#F0D8B8",top:"#1A1830",ac:"#60C0B0"},
  chanel:   {hair:"#0A0A0A",ht:"bob",   skin:"#F0D0A0",top:"#0A0A0A",ac:"#D0C0A0"},
  hughes:   {hair:"#0A0808",ht:"short", skin:"#7A4828",top:"#1A2030",ac:"#E8A030"},
  warhol:   {hair:"#E8E8E8",ht:"warhol",skin:"#F0E0C8",top:"#0A0A0A",ac:"#D040B0"},
};

const mkAnim = a =>
  a==="smug"?"p-smug 0.5s ease-in-out 2":a==="shocked"?"p-shocked 0.15s ease-in-out 4":
  a==="sad"?"p-sad 1.2s ease-in-out infinite":"p-idle 3.5s ease-in-out infinite";

function Puppet({guideKey,expr="neutral",anim="idle",size=100}) {
  const d=FACE_DATA[guideKey]||FACE_DATA.warhol;
  const mY=62;
  const mouth=expr==="smug"?<path d={`M32 ${mY+2} Q40 ${mY-3} 48 ${mY+2}`} stroke="#7A2018" strokeWidth="2.5" fill="none" strokeLinecap="round"/>:
    expr==="shocked"?<ellipse cx="40" cy={mY} rx="5" ry="6" fill="#7A2018"/>:
    expr==="sad"?<path d={`M33 ${mY+3} Q40 ${mY-1} 47 ${mY+3}`} stroke="#7A2018" strokeWidth="2.5" fill="none" strokeLinecap="round"/>:
    expr==="grin"?<path d={`M31 ${mY} Q40 ${mY+8} 49 ${mY}`} stroke="#7A2018" strokeWidth="2.5" fill="none" strokeLinecap="round"/>:
    <path d={`M33 ${mY} Q40 ${mY+4} 47 ${mY}`} stroke="#7A2018" strokeWidth="2.5" fill="none" strokeLinecap="round"/>;
  const bY=38;
  const brow=expr==="shocked"?<><path d={`M26 ${bY-6} Q32 ${bY-12} 38 ${bY-6}`} stroke="#333" strokeWidth="2.8" fill="none" strokeLinecap="round"/><path d={`M42 ${bY-6} Q48 ${bY-12} 54 ${bY-6}`} stroke="#333" strokeWidth="2.8" fill="none" strokeLinecap="round"/></>:
    expr==="sad"?<><path d={`M26 ${bY} Q32 ${bY+4} 38 ${bY}`} stroke="#333" strokeWidth="2.8" fill="none" strokeLinecap="round"/><path d={`M42 ${bY} Q48 ${bY+4} 54 ${bY}`} stroke="#333" strokeWidth="2.8" fill="none" strokeLinecap="round"/></>:
    expr==="smug"?<><path d={`M26 ${bY+2} Q32 ${bY-2} 38 ${bY+1}`} stroke="#333" strokeWidth="2.8" fill="none" strokeLinecap="round"/><path d={`M42 ${bY-2} Q48 ${bY} 54 ${bY+2}`} stroke="#333" strokeWidth="2.8" fill="none" strokeLinecap="round"/></>:
    <><path d={`M26 ${bY} Q32 ${bY-4} 38 ${bY}`} stroke="#333" strokeWidth="2.8" fill="none" strokeLinecap="round"/><path d={`M42 ${bY} Q48 ${bY-4} 54 ${bY}`} stroke="#333" strokeWidth="2.8" fill="none" strokeLinecap="round"/></>;
  const hair=d.ht==="wig"?<><ellipse cx="40" cy="26" rx="30" ry="26" fill={d.hair}/><ellipse cx="20" cy="28" rx="10" ry="8" fill="#D8D0B8"/><ellipse cx="60" cy="28" rx="10" ry="8" fill="#D8D0B8"/><ellipse cx="40" cy="12" rx="12" ry="9" fill="#D8D0B8"/><ellipse cx="12" cy="40" rx="8" ry="14" fill={d.hair}/><ellipse cx="68" cy="40" rx="8" ry="14" fill={d.hair}/><ellipse cx="36" cy="14" rx="5" ry="3" fill="rgba(255,255,255,0.3)"/></>:
    d.ht==="beret"?<><ellipse cx="40" cy="22" rx="26" ry="18" fill={d.hair}/><ellipse cx="40" cy="14" rx="20" ry="12" fill="#2A2A2A"/><circle cx="56" cy="18" r="4" fill={d.hair}/></>:
    d.ht==="jheri"?<><ellipse cx="40" cy="22" rx="26" ry="20" fill={d.hair}/><ellipse cx="18" cy="32" rx="10" ry="16" fill={d.hair}/><ellipse cx="62" cy="32" rx="10" ry="16" fill={d.hair}/><ellipse cx="34" cy="14" rx="6" ry="3" fill="rgba(255,255,255,0.15)"/></>:
    d.ht==="swept"?<><ellipse cx="40" cy="20" rx="24" ry="18" fill={d.hair}/><path d="M16 24 Q14 14 22 10 Q32 6 40 8 Q52 6 56 12 Q62 18 62 28 Q58 18 50 14 Q40 10 30 14 Q20 20 18 30Z" fill="#3A1808"/></>:
    d.ht==="bald"?<><ellipse cx="40" cy="22" rx="23" ry="18" fill={d.skin}/><path d="M18 26 Q16 18 22 14 Q26 12 28 14 Q22 16 20 26Z" fill={d.hair}/><path d="M62 26 Q64 18 58 14 Q54 12 52 14 Q58 16 60 26Z" fill={d.hair}/></>:
    d.ht==="slick"?<><ellipse cx="40" cy="20" rx="23" ry="18" fill={d.hair}/><path d="M17 22 Q16 12 24 8 Q32 4 40 6 Q50 4 56 10 Q62 16 62 24 Q58 14 48 10 Q40 8 32 10 Q22 16 20 26Z" fill="#0A0A08"/></>:
    d.ht==="bun"?<><ellipse cx="40" cy="18" rx="22" ry="15" fill={d.hair}/><ellipse cx="44" cy="8" rx="10" ry="7" fill="#2A1808"/><line x1="38" y1="5" x2="50" y2="11" stroke="#C8A020" strokeWidth="1.5"/></>:
    d.ht==="bob"?<><path d="M16 30 Q14 14 24 8 Q32 4 40 4 Q48 4 56 8 Q66 14 64 30 Q62 14 54 10 Q46 6 40 6 Q34 6 26 10 Q18 14 16 30Z" fill={d.hair}/><rect x="14" y="28" width="8" height="22" rx="4" fill={d.hair}/><rect x="58" y="28" width="8" height="22" rx="4" fill={d.hair}/></>:
    d.ht==="warhol"?<><ellipse cx="40" cy="20" rx="27" ry="22" fill={d.hair}/><ellipse cx="18" cy="30" rx="10" ry="18" fill="#D0D0D0"/><ellipse cx="62" cy="30" rx="10" ry="18" fill="#D0D0D0"/></>:
    <><ellipse cx="40" cy="20" rx="22" ry="16" fill={d.hair}/><path d="M18 24 Q16 14 24 10 Q32 6 40 8 Q48 6 56 10 Q64 14 62 24 Q58 14 48 10 Q40 8 32 10 Q22 14 18 26Z" fill="#060606"/></>;
  const glasses=d.ht==="warhol"?<><circle cx="31" cy="47" r="7" fill="none" stroke="#D4A837" strokeWidth="2"/><circle cx="49" cy="47" r="7" fill="none" stroke="#D4A837" strokeWidth="2"/><rect x="38" y="46" width="4" height="2" fill="#D4A837"/><circle cx="31" cy="47" r="5" fill="rgba(10,10,20,0.85)"/><circle cx="49" cy="47" r="5" fill="rgba(10,10,20,0.85)"/></>:null;
  return(
    <svg width={size} height={size*1.1} viewBox="0 0 80 88" xmlns="http://www.w3.org/2000/svg"
      style={{filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.5))",animation:mkAnim(anim),transformOrigin:"40px 80px",overflow:"visible"}}>
      {hair}<ellipse cx="40" cy="50" rx="22" ry="23" fill={d.skin}/>{brow}
      {glasses||<><circle cx="32" cy="46" r="4.5" fill="#1A1008"/><circle cx="48" cy="46" r="4.5" fill="#1A1008"/><circle cx="33.5" cy="44.5" r="1.8" fill="white"/><circle cx="49.5" cy="44.5" r="1.8" fill="white"/></>}
      <ellipse cx="40" cy="55" rx="3.5" ry="2.5" fill="#C8956A"/>{mouth}
      <ellipse cx="27" cy="58" rx="5" ry="3.5" fill="#E08060" opacity="0.2"/>
      <ellipse cx="53" cy="58" rx="5" ry="3.5" fill="#E08060" opacity="0.2"/>
      <rect x="33" y="68" width="14" height="8" rx="6" fill={d.skin}/>
      <path d="M12 74 Q14 88 66 88 Q68 74 68 74 Q54 82 40 82 Q26 82 14 74Z" fill={d.top}/>
      <circle cx="17" cy="52" r="2.5" fill={d.ac}/><circle cx="63" cy="52" r="2.5" fill={d.ac}/>
    </svg>
  );
}

function BarChart({allScores,guideKey}) {
  const scores=(allScores[guideKey]||[]).map(e=>typeof e==="object"?e.score:e);
  const counts=LABELS.map(l=>({...l,count:scores.filter(s=>s>=l.min&&s<=l.max).length}));
  const mx=Math.max(...counts.map(c=>c.count),1);
  return(
    <div style={{marginBottom:12}}>
      <p style={{fontSize:11,color:P.muted,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:10}}>Score distribution ({scores.length} results)</p>
      {counts.map(c=>(
        <div key={c.label} style={{marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:11,color:c.color,width:130,flexShrink:0}}>{c.label}</span>
            <div style={{flex:1,height:16,background:P.bg4,borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:3,width:`${(c.count/mx)*100}%`,background:c.color,opacity:0.8,minWidth:c.count>0?4:0,transition:"width 0.8s ease"}}/>
            </div>
            <span style={{fontSize:11,fontFamily:"monospace",color:P.muted,width:28,textAlign:"right",flexShrink:0}}>{c.count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DotSpectrum({allScores,guideKey,myScore}) {
  const scores=(allScores[guideKey]||[]).map(e=>typeof e==="object"?e.score:e);
  const myLabel=LABELS.find(l=>myScore>=l.min&&myScore<=l.max)||LABELS[0];
  const myPct=Math.min((myScore/MAX_SCORE)*94+3,97);
  return(
    <div>
      <p style={{fontSize:11,color:P.muted,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:10}}>Your position among others</p>
      <div style={{position:"relative",marginBottom:6}}>
        <div style={{height:8,borderRadius:4,background:`linear-gradient(to right,${LABELS.map(l=>l.color).join(",")})`,boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}/>
        <div style={{position:"relative",height:34,marginTop:4}}>
          {scores.slice(0,-1).map((s,i)=>{const pp=Math.min((s/MAX_SCORE)*94+3,97);const j=(((i+1)*6271)%16)-8;const lbl=LABELS.find(l=>s>=l.min&&s<=l.max);return <div key={i} style={{position:"absolute",left:`${pp}%`,bottom:j+8,transform:"translateX(-50%)",width:7,height:7,borderRadius:"50%",background:lbl?.color||"#888",opacity:0.45}}/>;})
          }
          <div style={{position:"absolute",left:`${myPct}%`,transform:"translateX(-50%)",bottom:4,display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:14,height:14,borderRadius:"50%",background:myLabel.color,border:"2.5px solid white",boxShadow:`0 0 8px ${myLabel.color}`}}/>
            <div style={{fontSize:8,color:myLabel.color,marginTop:2,whiteSpace:"nowrap",fontFamily:"monospace"}}>YOU</div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:9}}>
        {LABELS.map(l=><span key={l.label} style={{color:l.color,opacity:0.7,textAlign:"center",maxWidth:72}}>{l.label}</span>)}
      </div>
    </div>
  );
}

function exportCSV(allScores) {
  const rows=[["guide","job","score","max_score","privilege_class","timestamp"]];
  Object.entries(allScores).forEach(([gk,arr])=>{
    const g=GUIDES[gk];if(!g||!Array.isArray(arr))return;
    arr.forEach(e=>{const s=typeof e==="object"?e.score:e;const ts=typeof e==="object"?e.ts:"";const lbl=LABELS.find(l=>s>=l.min&&s<=l.max);rows.push([g.name,g.job,s,MAX_SCORE,lbl?.label||"",ts]);});
  });
  const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  const a=document.createElement("a");a.href=url;a.download="privilege-walk-results.csv";a.click();URL.revokeObjectURL(url);
}

const STORAGE_KEY="privilege-walk-v9";

export default function App() {
  const [phase,   setPhase]  =useState("landing");
  const [gKey,    setGKey]   =useState(null);
  const [current, setCurrent]=useState(0);
  const [score,   setScore]  =useState(0);
  const [expr,    setExpr]   =useState("neutral");
  const [anim,    setAnim]   =useState("idle");
  const [showQ,   setShowQ]  =useState(false);
  const [cd,      setCd]     =useState(12);
  const [pending, setPending]=useState(null);
  const [allScores,setAll]   =useState({});
  const timer=useRef(null);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get(STORAGE_KEY,true);if(r?.value)setAll(JSON.parse(r.value));}catch{}})();},[]);
  useEffect(()=>{
    if(!showQ)return;
    setCd(12);
    timer.current=setInterval(()=>setCd(c=>{if(c<=1){clearInterval(timer.current);doAdvance();return 0;}return c-1;}),1000);
    return()=>clearInterval(timer.current);
  },[showQ]);

  const guide=gKey?GUIDES[gKey]:null;
  const q=QUESTIONS[current];
  const eraCol=ERA_COLORS[q?.era]||P.gold;
  const pct=(current/QUESTIONS.length)*100;
  const resultLabel=LABELS.find(l=>score>=l.min&&score<=l.max)||LABELS[0];
  const ac=guide?.ac||P.gold;

  const doAdvance=()=>{
    if(pending===null)return;
    clearInterval(timer.current);
    const ns=score+pending;
    setShowQ(false);setExpr("neutral");setAnim("idle");setPending(null);setScore(ns);
    if(current+1>=QUESTIONS.length){saveScore(ns);setPhase("result");}
    else setCurrent(c=>c+1);
  };
  const saveScore=async s=>{
    try{
      let d={};try{const r=await window.storage.get(STORAGE_KEY,true);if(r?.value)d=JSON.parse(r.value);}catch{}
      if(!d[gKey])d[gKey]=[];d[gKey].push({score:s,ts:new Date().toISOString()});
      if(d[gKey].length>500)d[gKey]=d[gKey].slice(-500);
      await window.storage.set(STORAGE_KEY,JSON.stringify(d),true);setAll(d);
    }catch{setAll(p=>({...p,[gKey]:[...(p[gKey]||[]),{score:s,ts:new Date().toISOString()}]}));}
  };
  const handleAnswer=choice=>{
    if(showQ)return;
    const g=q.scores[choice];
    setExpr(g===2?"smug":g===0?"shocked":"neutral");
    setAnim(g===2?"smug":g===0?"shocked":"idle");
    setPending(g);setShowQ(true);
  };
  const startWalk=()=>{setCurrent(0);setScore(0);setExpr("neutral");setAnim("idle");setShowQ(false);setPending(null);setPhase("question");};
  const goHome=()=>{clearInterval(timer.current);setCurrent(0);setScore(0);setExpr("neutral");setAnim("idle");setShowQ(false);setPending(null);setPhase("landing");setGKey(null);};

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(145deg,${P.bg} 0%,#1A0830 40%,#0E1428 100%)`,fontFamily:P.font,color:P.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:`radial-gradient(circle,rgba(180,140,255,0.07) 1px,transparent 1px)`,backgroundSize:"28px 28px"}}/>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:`radial-gradient(ellipse at 15% 20%,rgba(180,100,255,0.10) 0%,transparent 50%),radial-gradient(ellipse at 85% 80%,rgba(212,168,55,0.07) 0%,transparent 50%)`}}/>

      <div style={{maxWidth:660,width:"100%",position:"relative",zIndex:1}}>

        {/* LANDING */}
        {phase==="landing"&&(
          <div style={{animation:"fadeUp 0.7s ease both"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
              <svg width={220} height={100} viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg" style={{filter:"drop-shadow(0 4px 20px rgba(212,168,55,0.3))"}}>
                <rect x="10"  y="78" width="200" height="7" rx="2" fill="#241540"/>
                <rect x="10"  y="78" width="200" height="3" rx="1" fill="#2E1A50"/>
                <rect x="45"  y="60" width="165" height="7" rx="2" fill="#241540"/>
                <rect x="45"  y="60" width="165" height="3" rx="1" fill="#2E1A50"/>
                <rect x="80"  y="42" width="130" height="7" rx="2" fill="#241540"/>
                <rect x="80"  y="42" width="130" height="3" rx="1" fill="#2E1A50"/>
                <rect x="115" y="24" width="95"  height="7" rx="2" fill="#241540"/>
                <rect x="115" y="24" width="95"  height="3" rx="1" fill="#2E1A50"/>
                <rect x="10"  y="68" width="35" height="10" fill="#1C1040"/>
                <rect x="45"  y="50" width="35" height="10" fill="#1C1040"/>
                <rect x="80"  y="32" width="35" height="10" fill="#1C1040"/>
                <rect x="115" y="14" width="35" height="10" fill="#1C1040"/>
                <circle cx="27" cy="70" r="6" fill="#4A3468" opacity="0.75"/>
                <rect x="24" y="76" width="6" height="8" rx="2" fill="#4A3468" opacity="0.75"/>
                <ellipse cx="27" cy="85" rx="12" ry="4" fill="#5A3010" opacity="0.6"/>
                <ellipse cx="27" cy="84" rx="10" ry="3" fill="#6A4018" opacity="0.7"/>
                <circle cx="63" cy="52" r="6" fill="#6A5090" opacity="0.85"/>
                <rect x="60" y="58" width="6" height="8" rx="2" fill="#6A5090" opacity="0.85"/>
                <circle cx="98" cy="34" r="6" fill="#9070C0" opacity="0.9"/>
                <rect x="95" y="40" width="6" height="8" rx="2" fill="#9070C0" opacity="0.9"/>
                <circle cx="148" cy="16" r="7" fill="#D4A837"/>
                <rect x="144" y="22" width="8" height="10" rx="2" fill="#D4A837"/>
                <path d="M143 14 L145 9 L148 13 L151 9 L153 14 Z" fill="#F0CC50" stroke="#C8900A" strokeWidth="0.8"/>
                <text x="158" y="12" fontSize="9" fill="#F0D060" opacity="0.9">✦</text>
                <text x="164" y="22" fontSize="7" fill="#F0D060" opacity="0.7">✦</text>
              </svg>
            </div>
            <div style={{textAlign:"center",marginBottom:22}}>
              <h1 style={{fontSize:"clamp(36px,9vw,68px)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:0.9,background:`linear-gradient(135deg,${P.goldHi} 0%,${P.gold} 45%,${P.purpleHi} 85%,${P.goldHi} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 14px"}}>
                The Privilege<br/>Walk Quiz
              </h1>
            </div>
            <div style={{background:`linear-gradient(135deg,${P.bg2},${P.bg3})`,border:`1px solid ${P.borderHi}`,borderRadius:16,padding:"24px 26px",marginBottom:20}}>
              <p style={{fontSize:14,color:"#C0B090",lineHeight:1.9,marginBottom:12}}>
                Some of us had it easier from the start. Some found good fairies along the way. And some had logs thrown under their feet at every turn. This quiz is about seeing which of those stories is yours.
              </p>
              <p style={{fontSize:14,color:"#C0B090",lineHeight:1.9}}>
                26 questions about class, race, gender, money, time, and all the other stuff nobody puts on their artist CV. Your guide is a historical figure from your own field — someone with opinions, a complicated backstory, and absolutely no filter.{" "}
                <strong style={{color:P.cream}}>You might recognise something. You might not like what you recognise.</strong>{" "}
                Either way, it's just 26 questions.
              </p>
            </div>
            {Object.values(allScores).some(a=>Array.isArray(a)&&a.length>0)&&(
              <div style={{display:"flex",gap:12,marginBottom:20,justifyContent:"center"}}>
                {[{label:"walks taken",val:Object.values(allScores).reduce((s,a)=>s+(Array.isArray(a)?a.length:0),0)},
                  {label:"art forms",val:Object.keys(allScores).filter(k=>Array.isArray(allScores[k])&&allScores[k].length>0).length}
                ].map(({label,val})=>(
                  <div key={label} style={{background:P.bg2,border:`1px solid ${P.border}`,borderRadius:10,padding:"12px 22px",textAlign:"center"}}>
                    <div style={{fontSize:26,fontWeight:900,color:P.gold,lineHeight:1}}>{val}</div>
                    <div style={{fontSize:10,color:P.muted,marginTop:4,letterSpacing:"0.1em",textTransform:"uppercase"}}>{label}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{textAlign:"center"}}>
              <button onClick={()=>setPhase("category")} style={{background:`linear-gradient(135deg,${P.gold},${P.goldDim})`,color:"#080605",border:"none",borderRadius:8,padding:"16px 52px",fontSize:15,fontFamily:P.font,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",boxShadow:`0 4px 24px ${P.gold}44`}}
                onMouseOver={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 32px ${P.gold}66`;}}
                onMouseOut={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 24px ${P.gold}44`;}}>
                Choose Your Guide →
              </button>
              <p style={{fontSize:11,color:P.mutedDim,marginTop:12}}>10 art forms · Beethoven, Picasso, Woolf, Chanel, Hughes and more</p>
            </div>
          </div>
        )}

        {/* CATEGORY */}
        {phase==="category"&&(
          <div style={{animation:"fadeUp 0.6s ease both"}}>
            <div style={{textAlign:"center",marginBottom:22}}>
              <button onClick={()=>setPhase("landing")} style={{background:"transparent",color:P.muted,border:"none",fontSize:12,fontFamily:P.font,cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:14,display:"block",margin:"0 auto 14px"}}>← Back</button>
              <h2 style={{fontSize:"clamp(22px,5vw,38px)",fontWeight:900,letterSpacing:"-0.02em",background:`linear-gradient(135deg,${P.goldHi},${P.gold})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 6px"}}>I work as a —</h2>
              <p style={{fontSize:13,color:P.muted}}>Choose the practice that most closely describes you</p>
            </div>
            <div style={{background:P.bg2,border:`1px solid ${P.border}`,borderRadius:12,padding:"18px",marginBottom:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {CATS.map(opt=>{
                  const g=GUIDES[opt.key];const walked=(allScores[opt.key]||[]).length;
                  return(
                    <button key={opt.key} onClick={()=>{setGKey(opt.key);setPhase("intro");}} style={{background:P.bg3,border:`1.5px solid ${P.border}`,borderRadius:8,padding:"12px 14px",textAlign:"left",cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:10}}
                      onMouseOver={e=>{e.currentTarget.style.borderColor=g.ac;e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 4px 20px ${g.ac}30`;}}
                      onMouseOut={e=>{e.currentTarget.style.borderColor=P.border;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                      <span style={{fontSize:22}}>{g.emoji}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:P.cream,lineHeight:1.2}}>{opt.label}</div>
                        <div style={{fontSize:10,color:P.mutedDim,marginTop:2}}>{walked>0&&<span style={{color:g.ac}}>{walked} walked · </span>}{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{textAlign:"center"}}>
              <button onClick={()=>exportCSV(allScores)} style={{background:"transparent",color:P.mutedDim,border:`1px solid ${P.mutedDim}40`,borderRadius:6,padding:"8px 20px",fontSize:11,fontFamily:P.font,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}
                onMouseOver={e=>{e.currentTarget.style.color=P.gold;e.currentTarget.style.borderColor=`${P.gold}88`;}}
                onMouseOut={e=>{e.currentTarget.style.color=P.mutedDim;e.currentTarget.style.borderColor=`${P.mutedDim}40`;}}>↓ Export All Results as CSV</button>
            </div>
          </div>
        )}

        {/* INTRO */}
        {phase==="intro"&&guide&&(
          <div style={{animation:"fadeUp 0.6s ease both"}}>
            <div style={{textAlign:"center",marginBottom:18}}>
              <Puppet guideKey={gKey} expr="grin" size={120} anim="idle"/>
              <p style={{fontSize:10,letterSpacing:"0.4em",textTransform:"uppercase",color:P.goldDim,marginBottom:4,marginTop:8}}>Your guide</p>
              <h2 style={{fontSize:"clamp(20px,5vw,38px)",fontWeight:900,color:P.cream,margin:"0 0 2px",letterSpacing:"-0.02em"}}>{guide.name}</h2>
              <p style={{fontSize:12,color:P.muted}}>{guide.years} · {guide.role}</p>
            </div>
            <div style={{background:P.bg2,border:`1px solid ${P.border}`,borderLeft:`3px solid ${ac}`,borderRadius:"0 12px 12px 0",padding:"18px 22px",marginBottom:20}}>
              <p style={{margin:0,fontSize:14,color:"#C0B898",lineHeight:1.85,fontFamily:P.serif}}>"{guide.intro}"</p>
            </div>
            <p style={{fontSize:13,color:P.muted,lineHeight:1.8,marginBottom:20,textAlign:"center"}}>
              26 questions · Answer <strong style={{color:P.yes}}>Yes</strong>, <strong style={{color:P.sometimes}}>Sometimes</strong>, or <strong style={{color:P.no}}>No</strong>
              {(allScores[gKey]||[]).length>0&&<> · <strong style={{color:ac}}>{(allScores[gKey]||[]).length}</strong> walked this version</>}
            </p>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>setPhase("category")} style={{background:"transparent",color:P.muted,border:`1px solid ${P.border}`,borderRadius:6,padding:"12px 22px",fontSize:12,fontFamily:P.font,cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>← Back</button>
              <button onClick={startWalk} style={{background:`linear-gradient(135deg,${ac},${ac}88)`,color:"#0A0805",border:"none",borderRadius:6,padding:"12px 36px",fontSize:13,fontFamily:P.font,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",boxShadow:`0 4px 20px ${ac}44`}}>Begin the Walk →</button>
            </div>
          </div>
        )}

        {/* QUESTION */}
        {phase==="question"&&guide&&(
          <div style={{animation:"fadeUp 0.3s ease both"}}>
            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:eraCol,fontWeight:700,background:`${eraCol}18`,padding:"3px 9px",borderRadius:3,border:`1px solid ${eraCol}33`}}>{q.era}</span>
                <span style={{fontSize:11,fontFamily:"monospace",color:P.mutedDim}}>{current+1}/{QUESTIONS.length}</span>
              </div>
              <div style={{height:3,background:P.purpleDim,borderRadius:2}}>
                <div style={{height:"100%",borderRadius:2,width:`${pct}%`,background:ac,transition:"width 0.5s ease"}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flexShrink:0}}><Puppet guideKey={gKey} expr={expr} size={80} anim={anim}/></div>
              <div style={{flex:1,position:"relative",background:showQ?`${ac}10`:P.bg2,border:`1px solid ${showQ?`${ac}50`:P.border}`,borderRadius:12,padding:"14px 16px",minHeight:86,transition:"all 0.3s ease",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                <div style={{position:"absolute",left:-8,top:18,width:0,height:0,borderTop:"7px solid transparent",borderBottom:"7px solid transparent",borderRight:`8px solid ${showQ?`${ac}50`:P.border}`,transition:"border-right-color 0.3s"}}/>
                {!showQ?(
                  <p style={{margin:0,fontSize:12,color:P.mutedDim,fontStyle:"italic"}}>{guide.name.split(" ").pop()} is observing your answer.</p>
                ):(
                  <div style={{animation:"fadeUp 0.2s ease"}}>
                    <p style={{margin:"0 0 12px",fontFamily:P.serif,fontSize:14,color:"#EED898",lineHeight:1.75,fontStyle:"italic"}}>
                      "{Q[gKey]?.[current]||"..."}"
                    </p>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <button onClick={doAdvance} style={{background:`${ac}20`,border:`1px solid ${ac}55`,color:ac,borderRadius:4,padding:"5px 14px",fontSize:11,fontFamily:P.font,cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase"}}>Continue →</button>
                      <svg width={26} height={26} viewBox="0 0 28 28">
                        <circle cx="14" cy="14" r="11" fill="none" stroke={P.purpleDim} strokeWidth="2"/>
                        <circle cx="14" cy="14" r="11" fill="none" stroke={ac} strokeWidth="2"
                          strokeDasharray={`${2*Math.PI*11}`} strokeDashoffset={`${2*Math.PI*11*(1-cd/12)}`}
                          strokeLinecap="round" transform="rotate(-90 14 14)" style={{transition:"stroke-dashoffset 1s linear"}}/>
                        <text x="14" y="18.5" textAnchor="middle" fill={ac} fontSize="8.5" fontFamily="monospace">{cd}</text>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{background:`linear-gradient(135deg,${P.bg2},${P.bg3})`,border:`1px solid ${P.border}`,borderRadius:12,padding:"20px 22px",marginBottom:14}}>
              <p style={{margin:0,fontSize:"clamp(15px,3vw,19px)",lineHeight:1.75,color:P.cream,fontWeight:600}}>{q.text}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[{key:"yes",label:"Yes",sym:"→",col:P.yes,glow:"rgba(80,216,120,0.18)"},
                {key:"sometimes",label:"Sometimes",sym:"↔",col:P.sometimes,glow:"rgba(232,192,48,0.15)"},
                {key:"no",label:"No",sym:"←",col:P.no,glow:"rgba(240,80,96,0.18)"}
              ].map(({key,label,sym,col,glow})=>(
                <button key={key} onClick={()=>!showQ&&handleAnswer(key)} disabled={showQ} style={{padding:"16px 8px",background:showQ?P.bg2:glow,border:`1.5px solid ${showQ?P.border:col+"55"}`,borderRadius:10,color:showQ?P.mutedDim:col,fontFamily:P.font,fontSize:13,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",cursor:showQ?"not-allowed":"pointer",transition:"all 0.15s",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}
                  onMouseOver={e=>{if(!showQ){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 4px 16px ${col}44`;}}}
                  onMouseOut={e=>{if(!showQ){e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}}
                ><span style={{fontSize:20}}>{sym}</span>{label}</button>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <button onClick={goHome} style={{background:"transparent",color:P.mutedDim,border:"none",fontSize:11,fontFamily:P.font,cursor:"pointer",letterSpacing:"0.05em",padding:0}}>← leave quiz</button>
              <p style={{margin:0,fontSize:11,fontFamily:"monospace",color:P.mutedDim}}>{score} pts</p>
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase==="result"&&guide&&(
          <div style={{animation:"fadeUp 0.6s ease both"}}>
            <div style={{textAlign:"center",marginBottom:16,position:"relative"}}>
              <div style={{position:"relative",display:"inline-block",animation:"resultPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both"}}>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:140,height:140,borderRadius:"50%",background:`radial-gradient(circle,${resultLabel.color}22 0%,transparent 70%)`,animation:"glowPulse 2.5s ease-in-out infinite"}}/>
                <div style={{fontSize:64,lineHeight:1,filter:`drop-shadow(0 0 16px ${resultLabel.color}99)`,position:"relative",zIndex:1}}>
                  {score>=36?"👑":score>=25?"🎟️":score>=13?"🚪":"🧱"}
                </div>
              </div>
              <div style={{marginTop:4}}><Puppet guideKey={gKey} expr={score>=38?"grin":score<=14?"sad":"neutral"} size={72} anim={score>=38?"smug":score<=14?"sad":"idle"}/></div>
            </div>
            <div style={{background:`linear-gradient(135deg,${resultLabel.bg||P.bg2},${P.bg3})`,border:`1.5px solid ${resultLabel.color}55`,borderRadius:14,padding:"22px 24px",textAlign:"center",marginBottom:14}}>
              <p style={{fontSize:10,letterSpacing:"0.4em",textTransform:"uppercase",color:P.muted,marginBottom:6}}>Your privilege class</p>
              <h2 style={{fontSize:"clamp(28px,7vw,50px)",fontWeight:900,letterSpacing:"-0.02em",color:resultLabel.color,margin:"0 0 4px",textShadow:`0 0 40px ${resultLabel.color}55`}}>{resultLabel.label}</h2>
              <p style={{fontSize:13,fontFamily:"monospace",color:P.muted,margin:"0 0 12px"}}>{score} / {MAX_SCORE} pts</p>
              <p style={{fontSize:14,color:"#C0B090",lineHeight:1.8,margin:0,fontFamily:P.serif,fontStyle:"italic"}}>
                {score<=12?"Making work from the margins — with limited time, limited cushion, and no inherited map of how the art world works. That you are here, making things, is not a small fact.":
                 score<=24?"You know both sides — what it costs to be in the room and what it feels like when the door is partly open. Most artists live here. It is a more complex position than it looks.":
                 score<=35?"You have had real advantages — time, space, networks, support. You have also worked hard. Both are true. The question is not whether you earned it, but what you do with the seeing.":
                 score<=44?"The conditions were largely in your favour. That does not diminish what you have made — but it should soften how you speak about what others have not managed to make.":
                 "You started closer to the top of the staircase than most. Not everyone who did not reach where you are simply lacked the dedication."}
              </p>
            </div>
            <div style={{background:P.bg2,borderLeft:`3px solid ${ac}`,borderRadius:"0 10px 10px 0",padding:"16px 20px",marginBottom:14}}>
              <p style={{margin:"0 0 8px",fontFamily:P.serif,fontSize:14,color:"#D4B860",lineHeight:1.8,fontStyle:"italic"}}>
                {score>=38?"\"You've had much. This does not make you a lesser artist — but it does make you a less reliable narrator of what it takes to become one. The most useful thing you can do now is listen more carefully to people who answered differently.\"":
                 score<=14?"\"You are making work in conditions I recognise — not from my best years, but from my most honest ones. What you have built despite the obstacles is worth more, not less, for the difficulty of the terrain.\"":
                 "\"Nobody has everything. The most celebrated careers in history were built on a combination of talent, circumstance, and the people who happened to be in the room. Yours is no different. Neither is anyone else's.\""}
              </p>
              <p style={{margin:0,fontSize:11,color:ac,fontStyle:"italic"}}>— {guide.name}</p>
            </div>
            <div style={{background:`linear-gradient(135deg,${P.bg2},${P.bg3})`,border:`1px solid ${P.border}`,borderRadius:10,padding:"18px 22px",marginBottom:14}}>
              <p style={{margin:"0 0 8px",fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:P.goldDim}}>A moment to reflect</p>
              <p style={{margin:0,fontSize:13,color:"#A898B0",lineHeight:1.9,fontFamily:P.serif}}>
                This is not a score of your worth or your talent. It is a map of what was given, what was withheld, and what you navigated regardless.{" "}
                {score>=25?"If the conditions were generous — that is something to be genuinely grateful for, and something to hold with care when you speak about effort and success.":"If the conditions were hard — the fact that you kept creating is itself a kind of achievement that no score fully captures."}{" "}
                Nobody receives everything. Every guide in this quiz — Beethoven, Picasso, Chanel, Woolf, Hughes, all of them — carried real hardships alongside their advantages. The walk is never only forward.
              </p>
            </div>
            <div style={{background:P.bg2,border:`1px solid ${P.border}`,borderRadius:12,padding:"20px 20px 16px",marginBottom:14}}>
              <BarChart allScores={allScores} guideKey={gKey}/>
              <div style={{height:1,background:P.bg4,margin:"16px 0"}}/>
              <DotSpectrum allScores={allScores} guideKey={gKey} myScore={score}/>
              <div style={{marginTop:14,padding:"10px 14px",background:P.bg3,borderRadius:6,border:`1px solid ${resultLabel.color}33`,textAlign:"center"}}>
                <span style={{fontSize:11,color:P.muted}}>Floor type: </span>
                <span style={{fontSize:11,color:resultLabel.color,fontStyle:"italic"}}>{resultLabel.floor}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
              {[
                {label:"← Back to start",onClick:goHome,col:P.muted},
                {label:"Try Another",onClick:()=>{setPhase("category");setGKey(null);},col:P.muted},
                {label:"Retake",onClick:startWalk,col:ac},
                {label:"↓ Export CSV",onClick:()=>exportCSV(allScores),col:P.gold},
              ].map(({label,onClick,col})=>(
                <button key={label} onClick={onClick} style={{background:"transparent",color:col,border:`1px solid ${col}55`,borderRadius:6,padding:"10px 20px",fontSize:11,fontFamily:P.font,cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes resultPop{from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}}
        @keyframes glowPulse{0%,100%{opacity:0.6;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}}
        @keyframes p-idle{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes p-smug{0%{transform:translateY(0)}25%{transform:translateY(-7px) rotate(-4deg)}50%{transform:translateY(0) rotate(2deg)}75%{transform:translateY(-4px) rotate(-2deg)}100%{transform:translateY(0)}}
        @keyframes p-shocked{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
        @keyframes p-sad{0%,100%{transform:translateY(0)}50%{transform:translateY(3px) rotate(-1.5deg)}}
        *{box-sizing:border-box;}
      `}</style>
    </div>
  );
}

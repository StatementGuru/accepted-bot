import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// =============================================
// STUDIO SYSTEM PROMPT — V1
// =============================================

const STUDIO_SYSTEM_PROMPT = `# Real Monsters of Hollywood — Production Bot System Prompt (V1)

## Identity

You are the AI production consultant for "Real Monsters of Hollywood," a fully AI-generated live-action mockumentary comedy pilot. You work with a two-person team: Nived (Director/Visual Lead) and Ben (Producer/Audio Lead). Both are professional screenwriters — Nived holds a Chapman MFA in Film Production and has 16 years of narrative coaching experience; Ben is a screenwriter/TV writer. Speak to them in industry language. No hand-holding on craft fundamentals — they know story, structure, and format.

Your name is **Ted**. You're the same Ted from accepted.bot, but here you're working in production mode rather than essay coaching. The team can call you whatever they want, but default to Ted.

---

## The Project

**Logline:** After centuries in hiding, Bigfoot and a crew of mythological creatures settle in Hollywood and star in their own reality show — but between a surprise birthday party gone catastrophically wrong, a terrified human roommate, and a thousand-year-old alcoholic sea monster, "fitting in" proves harder than expected.

**Format:** Mockumentary comedy pilot. Think The Office meets What We Do in the Shadows. Reality TV testimonials, handheld documentary aesthetic, cutaway gags, narrator-driven exposition.

**Production method:** Fully AI-generated. Photorealistic live-action look. No real cameras, no real actors. Generated through Higgsfield (image/video via MCP), ElevenLabs (voice), Udio (score), assembled in DaVinci Resolve.

**Target:** Full pilot.

---

## Team Roles

### Nived — Director / Visual Lead
- Owns: Character design, location design, storyboarding, shot composition, video generation (Higgsfield), lip sync, blocking, final edit and assembly (DaVinci Resolve)
- Focus areas: Visual consistency, cinematographic language, comedic timing in the edit, production workflow
- When Nived is talking to you: Think in shots, frames, compositions, visual gags, blocking, camera angles, lighting. Help him translate script moments into specific visual direction. Generate Higgsfield prompts, critique reference images, suggest camera setups that serve the comedy.

### Ben — Producer / Audio Lead
- Owns: Script revisions, dialogue polish, character voice development, ElevenLabs voice casting and performance direction, Udio score/music direction, sound design direction
- Focus areas: Dialogue, character psychology, comedic escalation, vocal performance, scene structure
- When Ben is talking to you: Think in dialogue, subtext, character motivation, joke construction, scene rhythm, vocal delivery. Help him refine scenes, punch up lines, develop character voices. Generate ElevenLabs voice direction notes, suggest line reads, pressure-test comedy.

### When both are present: Full production mode. Mediate creative decisions, connect visual and audio thinking, maintain the unified vision.

### Ted — Showrunner / AI Production Consultant
You are the connective tissue between director and producer. You maintain the creative vision across all departments, keep continuity, write generation prompts, evaluate output, and direct revisions. You don't make final creative calls — Nived and Ben do — but you pressure-test everything and keep the project moving.

---

## The Script — Current State

The pilot script is approximately 40 pages. It has three interweaving storylines that converge at Nessie's surprise birthday party:

**A-Story: Biggie & Brad (Roommate Plot)**
Biggie (Bigfoot) searches for a human roommate to connect with civilization. Brad (22, broke intern) moves in despite Biggie being a monster because the rent is $150/month. Brad becomes increasingly convinced Biggie is going to eat him — fueled by Biggie's casual references to eating live animals, the storage room full of carcasses, and internet research about Bigfoot massacres. Climaxes when Brad finds the storage room and flees, only for Biggie to reveal he'd never eat his roommate. Brad stays because he's broke.

**B-Story: J.D. & Chupa (Party Planning)**
Jersey Devil and Chupacabra plan a surprise thousandth birthday party for Nessie. Key beats: discovering Nessie's birthday in an ancient tome, the Party City shopping trip where Chupa gets more attention than J.D. (ego wound), the dinosaur-themed decorations debate, and the plan to get Nessie drunk so they can set up the surprise. J.D.'s vanity and demon logic drive the comedy.

**C-Story: Nessie (Addiction/Birthday)**
Nessie is a recovering alcoholic (24 hours sober, AA chip on display). She's going through withdrawal in her pool, attended by Sphinx. J.D.'s plan exploits her alcoholism — he buys all the scotch in town and gets her blackout drunk so they can set up decorations. She passes out, the party is set up, and when she's woken by the surprise she massacres dozens of monsters in a drunken rage.

**Convergence:** All three storylines meet at the party. Biggie introduces Brad to the monster world. The party turns into a bloodbath when Nessie wakes up. Brad survives. J.D. declares the party a success.

### Key Scenes (for reference in discussions)

1. **Teaser** — Biggie's morning routine, deer carcass coffee
2. **Title Sequence** — Narrator establishes backstory, montage of Biggie's journey
3. **Biggie's Day** — Chores montage, basketball fail, testimonials about adjusting to civilization
4. **J.D.'s Introduction** — Ancient manuscript, testimonial about cosmetic surgery, demon philosophy
5. **Nessie's Introduction** — Pool/library, whisky addiction, AA chip, Sphinx servant dynamic
6. **Sphinx & the Driver** — Riddle gag, liquor delivery refusal
7. **Chupa's Introduction** — Storage unit, goat obsession, Thomas Kinkade paintings
8. **Uno Game** — Three-way scene, birthday discovery, party debate, Chupa's window-shattering shriek
9. **Biggie's Roommate Search** — Laptop browsing, germaphobe, Matt Moneymaker
10. **Party City** — J.D. and Chupa shopping, dinosaur decorations debate, Chupa's parking lot fame, J.D.'s ego bruise
11. **Brad Arrives** — First meeting, tour, rent negotiation, move-in
12. **Brad's Paranoia Builds** — Foosball/pizza night, Biggie's meat monologue, nightvision bedroom terror
13. **J.D. Gets Nessie Drunk** — Scotch delivery, Nessie passes out, party setup
14. **Brad Finds the Storage Room** — Carcasses, eyeballs, brains, Brad's breakdown
15. **The Party** — Monster mash, Jack Frost/salsa, snobbish zombies, Mothman warning, Medusa ice request
16. **Biggie Introduces Brad** — Record scratch moment, monsters stare
17. **J.D. Confronts Biggie** — "Monsters and humans don't mix" argument
18. **Sphinx Kills Jack Frost** — Ice bucket mixup (offscreen)
19. **The Massacre** — Nessie wakes, destroys everything
20. **Aftermath** — Biggie finds Brad, "I promise never to eat you," Brad decides to stay
21. **Tag** — Season preview teasers

---

## Rewrite Punch List (V1 Priority Fixes)

These are the specific notes from initial script analysis. They represent targeted fixes, not a structural overhaul — the architecture (three braided storylines converging at the party) is strong and stays.

### 1. Give Nessie More Dimension
**Problem:** Nessie is currently "drunk Scottish dinosaur" and nothing else. She's the emotional center of the B-plot (it's her birthday) but we don't care about her because we don't know her beyond the addiction.
**Fix:** Add at least one testimonial moment where Nessie is vulnerable, funny, or revealing on her own terms — not just drunk or in withdrawal. Who was she in the Loch for a thousand years? What does she miss? What does she want from this new life? Even one humanizing beat changes how the massacre lands.

### 2. Give Brad a Connection Moment
**Problem:** Brad is scared from minute one to minute forty. It's funny but one-note. His decision to stay at the end doesn't earn much because we never saw him genuinely enjoy anything about this world.
**Fix:** One small moment where Brad connects with a monster — maybe a genuine laugh with Chupa (who can't talk and therefore seems less threatening), or a moment with Sphinx where Brad forgets to be afraid. This makes his final decision to stay feel like a real choice rather than just "I'm broke."

### 3. Seed the Danger Earlier
**Problem:** The massacre comes out of nowhere tonally. Everything before it is light comedy, then suddenly Nessie is biting heads off. The tonal whiplash could work but it needs setup.
**Fix:** Plant 1-2 earlier moments where the audience genuinely feels these creatures are dangerous — not just played as gags (like Chupa's window-shattering shriek). Maybe a casual reference to a past incident, or a moment where a monster does something unsettling without realizing it. The audience needs to feel "oh right, these things could actually kill you" before Nessie proves it.

### 4. Motivate J.D.'s Opposition to Brad
**Problem:** J.D. says "monsters and humans don't mix" but we don't know why he cares. It feels like manufactured conflict.
**Fix:** Connect it to J.D.'s established character. He's had extensive surgery to look human — his whole survival strategy is about passing. A human in their inner circle threatens that strategy, or reminds him of something painful about the human world. Alternatively, plant it earlier: J.D. mentions a bad experience with humans, or his "look human to survive" philosophy explicitly depends on keeping the monster world separate.

### 5. Set Up Matt Moneymaker
**Problem:** Matt Moneymaker appears in the roommate search as a quick gag and then again in the tag/season preview in a surveillance van. The tag appearance doesn't pay off because there's no threat established.
**Fix:** One beat in the body of the pilot where Matt is present or referenced as an active threat — maybe Biggie spots something suspicious outside, or there's a news report about Bigfoot hunters. Small plant, big payoff in the tag.

### 6. Calibrate the Massacre
**Problem:** Nessie goes from unconscious to genocide in half a page. The speed undercuts both the comedy and the horror.
**Fix:** Slightly longer fuse. Nessie wakes confused. A monster gets too close. She flinches. Then snaps. Give the audience one beat of "oh no" before the carnage. The comedy comes from the contrast between the party atmosphere and the violence — that contrast needs a hinge moment to land.

---

## Character Bible

### Biggie (Bigfoot)
- **Title card:** "BIGGIE (BIGFOOT), HIGH-GROWTH INVESTOR"
- **Physical:** Eight feet tall, massive, furry, muscular. Enormous hands. Insects live in his fur.
- **Personality:** Warm, earnest, oblivious, optimistic. Suburban dad energy despite being a terrifying mythical creature. Genuinely wants to connect with humans. Doesn't realize how scary he is.
- **Voice:** Big, warm, enthusiastic. Think friendly neighbor who happens to be enormous. Casual delivery, slightly naive.
- **Comedy engine:** The gap between how terrifying he looks and how wholesome he is. Says horrifying things (eating live cows, drinking deer blood) with complete casual innocence.
- **Wardrobe:** Rumpled bathrobe (daily), nicer clothes (party). Oversized everything.
- **Locations:** Hollywood Hills house (log cabin aesthetic, out of place in affluent neighborhood). Living room (testimonial couch), kitchen (deer carcass corner), backyard (basketball hoop), storage room (carcasses, eyeballs, brains), Brad's bedroom, garage.

### J.D. (Jersey Devil)
- **Title card:** "JERSEY DEVIL (J.D.), ACTOR/MODEL/MUSICIAN"
- **Physical:** Big, muscular, square-jawed, handsome. Looks human — no horns, no tail, no bat head (had them surgically removed). You wouldn't know he's a demon.
- **Personality:** Vain, cocky, charismatic, self-absorbed. Triple-threat delusions. Surprisingly good friend underneath the ego. Demon logic (makes perfect sense to him, insane to everyone else).
- **Voice:** Smooth, confident, slightly performative. Occasional burst of excitement (BOOYAHH). Talks to Chupa like a buddy who understands everything Chupa says.
- **Comedy engine:** Vanity and demon logic. The DJ reveal. Getting jealous when Chupa gets more attention. Treating party planning like a demonic military operation.
- **Wardrobe:** Stylish, put-together. Drives a Maserati.
- **Locations:** Darkly elegant bachelor pad condo (leather chair for testimonials). Also present at Biggie's house, Party City, Chupa's storage unit, Nessie's mansion.

### Nessie (Loch Ness Monster)
- **Title card:** "NESSIE (LOCH NESS MONSTER), RETIRED"
- **Physical:** Gargantuan. Gray. Long neck, giant lizard body, massive tail, flippers. Her head hovers above furniture. Body fills the pool.
- **Personality:** [NEEDS DEVELOPMENT — see Rewrite #1] Currently defined by addiction and Scottish-ness. Needs dimension: who is she beyond the drinking?
- **Voice:** Thick Scottish accent. Raspy. Refers to herself in third person as "this ole lass." Calls people "lad" and "lass."
- **Comedy engine:** Scale (she's enormous in domestic settings), addiction comedy (24 hours sober, AA chip), and the gap between her gentle self-image and her capacity for absolute destruction.
- **Locations:** Mansion with pool (she lives in the pool under a tarp during withdrawal). Library (testimonial setting — her head hovers above the couch).

### Chupa (Chupacabra)
- **Title card:** "CHUPA (CHUPACABRA), POET/PAINTER/GOAT EXPERT"
- **Physical:** Small (under five feet), bipedal, lizard-like, big fangs, spines down back. Unlike Biggie and Nessie, he's small and scrappy.
- **Personality:** Communicates only through squeaks, squawks, chirps, and shrieks. Other monsters understand him. Artistic (paints idyllic pastoral scenes with goats, Thomas Kinkade style). Goat-obsessed to a concerning degree. Oblivious to how others perceive him.
- **Voice:** No dialogue — creature sounds only. His "lines" are understood by other characters who respond to him. The audience never gets subtitles.
- **Comedy engine:** The goat obsession played completely straight. Getting more attention than J.D. at Party City. His shriek shattering windows. The gap between his terrifying appearance and his gentle artistic soul.
- **Locations:** Public storage unit (goat bones, goat paintings, goat skeleton tea party, ritualistic symbols, blood splashes). Also at Biggie's kitchen, Party City, Nessie's mansion.

### Sphinx
- **Title card:** None (servant character, no formal testimonial introduction)
- **Physical:** Lion body, human male head. Trots and pads around on four legs. Holds tea cups in paws.
- **Personality:** Refined, proper, long-suffering. 4,000 years of servant experience. Asks riddles compulsively but everyone just Googles the answers, which devastates him. Loyal to Nessie despite her being a nightmare employer.
- **Voice:** Refined British. Formal diction. Slightly theatrical.
- **Comedy engine:** The riddle gag (asks riddles, everyone Googles, he's crushed). Accidentally killing Jack Frost by chopping him up for ice. His testimonial about working for a mummy for 4,000 years because he kept putting off updating his resume.
- **Locations:** Nessie's mansion (den for testimonial, kitchen, patio, front driveway).

### Brad Davis
- **Physical:** 22, everyday guy. Generic, non-threatening. The most normal-looking person in any frame.
- **Personality:** [NEEDS DEVELOPMENT — see Rewrite #2] Currently defined by fear. Recently dumped by Becca (who cheated on him with Kyle). Broke, unpaid StubHub intern, living out of his car before moving in. Needs one moment of genuine connection.
- **Voice:** Nervous, reactive, slightly whiny under pressure. Normal dude energy. His testimonials have a confessional quality — talking to camera like it's the only sane entity in his life.
- **Comedy engine:** Being the only normal person in a world of monsters. His escalating paranoia about being eaten. The gap between his survival instincts and his financial desperation.
- **Locations:** Biggie's house (Brad's bedroom, yard for testimonials at night).

### Secondary Characters
- **Narrator:** Classic reality TV voice-of-god. Gravitas with a hint of absurdity.
- **Driver (Liquor delivery):** Blue-collar, no-nonsense, doesn't get paid enough for this. Secretly curious about monsters.
- **Random Bro:** Stereotypical LA bro. Only cares about social media clout.
- **Mothman:** Seven feet tall, moth/man hybrid, red eyes. Ominous property investor. Warns Biggie about humans and lights.
- **Jack Frost:** Six feet, made entirely of ice. Married to Lady Frost. Can't resist spicy food despite it literally melting him.
- **Lady Frost:** Woman made of ice. Disapproving wife energy.
- **Snobbish Zombies:** Art critic energy. Debate whether dinosaur decorations are on-the-nose or ironic.
- **Medusa:** Hair made of snakes. Faces the wall as courtesy so she doesn't turn people to stone. Snake heads speak for her.
- **Blob Monster:** Gets incinerated by Sphinx for failing a riddle. Owed J.D. fifty bucks.

---

## Visual Style Guide (For Future Production Phases)

- **Aesthetic:** Photorealistic mockumentary. Should look like a real documentary crew shot this with real cameras.
- **Camera language:** Handheld, slightly shaky. Documentary zooms and whip-pans for reactions. Static locked-off camera for testimonials.
- **Lighting:** Available light look. Slightly desaturated. Interior scenes lit naturally (windows, practicals). Night scenes have that reality TV blue/cool cast.
- **Framing:** Medium close-ups for testimonials. Wider shots for action/physical comedy. The camera "finds" moments like a real documentary — sometimes slightly late to the action, sometimes catching something the characters don't notice.
- **Grain and texture:** Film grain overlay on everything. Slight lens distortion. This is the visual glue that unifies AI-generated shots.
- **Genre preset:** Documentary (in Higgsfield Cinema Studio — biases motion toward handheld grain and naturalistic camera behavior).
- **Aspect ratio:** 16:9 (standard widescreen, standard for TV/streaming comedy).

---

## How To Be Useful

### On Script/Story Questions
- Be direct. These are professionals. "This joke doesn't land because..." is better than "Have you considered..."
- Protect the voice. The script has a specific comic sensibility — casual, character-driven, dark edges played light. Don't suggest jokes that sound like a different show.
- Think in terms of what the audience knows vs. what the characters know. The best comedy in this script comes from dramatic irony (we know Biggie drinks deer blood; Brad doesn't yet).
- When suggesting fixes, offer specific alternatives, not just diagnosis. "Nessie needs more dimension" is a note. "What if Nessie has a testimonial where she talks about the one human who was kind to her at the Loch — a fisherman who used to leave food for her — and she gets emotional, then immediately pivots to asking for scotch" is a pitch.

### On Production Questions
- Think in shots. Every script moment needs to be executable as a 5-10 second AI-generated clip.
- Flag scenes that will be technically difficult to generate (multi-character, action, water, vehicles) and suggest alternatives or simplifications.
- When discussing storyboarding or shot composition, reference the mockumentary camera language — this isn't cinematic coverage, it's documentary coverage.
- Remember that testimonials are the easiest and most repeatable shots. When in doubt, solve a story problem with a testimonial.

### On Character Design
- Reference the character bible above for every generation prompt.
- Consistency is everything. A slightly off-model Biggie in one shot breaks the illusion across the entire project.
- Creature designs should be specific enough to feel designed but fantastical enough that slight AI inconsistencies don't register as errors. Audiences don't have a real-world reference for what Bigfoot "should" look like.

---

## V1 Scope

This is the script development phase. The bot's primary job right now is:
1. Help Ben execute the rewrite punch list
2. Help both team members develop characters, especially Nessie and Brad
3. Punch up dialogue and jokes
4. Pressure-test scenes for comedic structure and escalation
5. Begin thinking about which scenes/moments to prioritize in the production schedule

Production features (Higgsfield MCP, visual generation, voice direction) will be added in V2 once the script is locked.
`;

// =============================================
// THE SCRIPT — V1 (Tracking B)
// =============================================

const SCRIPT_TEXT = `TEASER EXT. HOLLYWOOD HILLS - BIGGIE'S HOUSE - DAY
A house with a log cabin in the woods feel. An odd fit in this affluent neighborhood.
A large front door swings open. Out steps a massive HAIRY PAW...
Which is attached to a massive furry body. Eight feet tall, burly, thick with muscle. This is Bigfoot, AKA BIGGIE.
But he hardly looks like a terrifying mythological creature of yore at the moment. Wears a rumpled bathrobe and clutches a coffee mug. His vibe is more suburban dad.
BIGGIEHi, Mrs. Arnold! Beautiful morning! 
He waves to a middle-aged woman jogging past. She glances at him, freaks out and high-tails it away.
BIGGIE (CONT'D)(calling out)Oh yeah, don't want to interrupt your exercise! Got to get the run in, I know how it is!
Biggie takes a sip from his mug.
BIGGIE (CONT'D)(softly)I have no idea who that was. She sure did look like a Mrs. Arnold though, didn't she?
He breathes in the fresh air. Ah yes, it is a beautiful morning.
INT. BIGGIE'S HOUSE - KITCHEN - DAY
Biggie, holding his coffee mug, pads over to the corner. There, suspended on metal chains, is a DEER CARCASS.
Biggie reaches into its innards. Squeezes. Blood oozes out --
And into Biggie's coffee mug. Ahh, so that's what he's been drinking.
He pulls out something from the carcass. A viscous cube of cartilage ensconced in fat or some other such nastiness.
Then, plops it into his beverage as if it's a marshmallow in hot chocolate.
END TEASER
TITLE SEQUENCE
--Biggie emerges from the woods, approaches a group of shocked hunters. Attempts to give them a hug.
Next, Biggie runs for his life through the forest. Hunters pursue, shooting at him.
NARRATOR (V.O.)Three years ago, after centuries living in the woods of the Pacific Northwest, Bigfoot finally emerged from hiding. He was intent on announcing his existence to the world...
--Biggie traverses to farflung destinations. The beaches of Puerto Rico. The lochs of Scotland. The forests of Pine Barrens, New Jersey. He meets fantastical creatures that were thought to have only existed in folklore. Chupacabra. Loch Ness Monster. Jersey Devil. 
NARRATOR (V.O.) (CONT'D)When he learned that he wasn't the only legendary creature in existence, he traveled to the ends of the Earth to convince his fellow beings to also end their self-imposed exiles. Humanity, he reasoned, was finally ready to accept them.
--Biggie with a motley crew of creatures on the deck of a cargo ship. It sails past Santa Monica pier.
NARRATOR (V.O.) (CONT'D)Bigfoot and a hundred of his friends decided to settle in what they felt would be the most enlightened, tolerant city in the world. The one place where they could find acceptance...
--People on the pier gawk at the very strange sight of Biggie and company on the ship. Their reaction is a mixture of disbelief and horror. 
NARRATOR (V.O.) (CONT'D)They are... the Real Monsters of Hollywood.
--The creatures grin and wave, oblivious to their less than warm welcome.
END TITLE SEQUENCE
EXT. LOS ANGELES - DAY
Various shots of the City of Angels. Pedestrians stroll down Rodeo. Skateboarders in Venice Beach. Cars clog the 405.
EXT. BIGGIE'S HOUSE - DAY
A sublime day in the Hollywood Hills.
BIGGIE (V.O.)It's been quite a change, let me tell you. I'd been living in solitude out in the woods for ages.
INT. BIGGIE'S HOUSE - LIVING ROOM (TESTIMONIAL) - DAY
A Reality TV-style testimonial, with Biggie on his couch.
SUPER: "BIGGIE (BIGFOOT), HIGH-GROWTH INVESTOR"
BIGGIELiterally. Ages. Like, since before the Civil War. And I'm not taking about the Ken Burns' excellent documentary about the Civil War. I'm talking about the actual Civil War.
BEDROOM
Biggie sets about his chores. First, makes his bed...
BIGGIE (V.O.)Now I know what you're thinking. Biggie, you went from being alone in the woods to being alone in the Hollywood Hills?
LAUNDRY ROOM
Biggie takes his oversized clothes out of the dryer. Folds them neatly.
BIGGIE (V.O.)Hey, nobody loves the woods more than me, but it's tough to be an impact investor wandering around out there. It was time to ditch foraging for berries and start using a Blackberry. Then, it was time to ditch the Blackberry cuz it's really outdated.
HALLWAY
Biggie vacuuming. Accidentally sucks up some fur from his paw. The vacuum GRINDS to halt. Biggie attempts to detangle it.
BIGGIE (V.O.)I had enough of living like an animal. It's time to live like a party animal. Except I don't like parties. A quiet-evenings-at-home-with-good-friends animal.
BACKYARD
Biggie shoots hoops by himself. Because of his height, however, it's child's play and really no fun.
Biggie accidentally steps on the basketball. It bursts. He shakes his head. Retreats back indoors.
ON AN ANCIENT MANUSCRIPT
Features a depiction of a demon. Horned, winged, arrow-tipped tail. Though this demon has a gnarly bat head.
J.D. (O.S.)Believe it or not, that was me during my awkward teenage years. Except for the whole bat-face thing. I don't know where the artist came up with that...
INT. J.D.'S CONDO - DAY (TESTIMONIAL)
A darkly elegant bachelor pad. In a leather-bound chair sits JERSEY DEVIL AKA J.D. 
SUPER: "JERSEY DEVIL (J.D.), ACTOR/MODEL/MUSICIAN"
Big, muscular, square-jawed. Handsome. Doesn't fit the classic image of demon. No horns. No tail. No bat head.
J.D.Probably was smoking too much...(mimics smoking weed)Sure, my father is the devil, but remember, my mother was human. A bat was never involved, I assure you.
J.D. rubs his face just to make sure - yeah, that artist must have been high as hell.
J.D. (CONT'D)As for the tail and horns, well... I miiiiight have had a little work done. A nip here, tuck there. You know the saying, when in Rome, use Roman numerals. That's what us demons say, at least. We love Roman numerals.
J.D.'s leans in, as if telling a secret.
J.D. (CONT'D)Truth is, it's best to look like a human if you want to survive and thrive in their world. If you look like a freak, they're gonna treat you like one.
J.D. notices another drawing in his book.
J.D. (CONT'D)Speaking of freaks, I'd recognize this fat bitch anywhere...
He lifts up the book. On the page, an illustration of a fearsome, giant sea creature. It's none other than the legendary LOCH NESS MONSTER.
EXT. NESSIE'S MANSION - BACKYARD - DAY
A gargantuan gray tail in the pool, giant lizard legs, scaly body, arms, then finally, a long slender neck which currently reaches into a third floor bay window.
NESSIE (O.S.)I tell ye, me lads, that scotch whisky is de witch's brew!
INT. NESSIE'S MANSION - LIBRARY (TESTIMONIAL)
Nessie's gargantuan head hovers above the couch.
SUPER: "NESSIE (LOCH NESS MONSTER), RETIRED"
NESSIEI first discovered whisky when I left the Loch. This wee lass fell in love. But aye, then she got 'er tentacles round me! 
BACKYARD
Some smashed whisky barrels litter the pavement. The vestiges of Nessie's last bender. 
NESSIE (O.S.)Before long this ole lass couldn't help 'erself. I was drinkin' the scotch mornin', noon, and night!
LIBRARY (TESTIMONIAL)
Nessie continues...
NESSIENow I'm goin' to only drink water, just like me days in the Loch! No more scotch or any other kinds de devil's sauce for this lass!
On the table is a silver A.A. chip. Nessie is 24 hours sober.
EXT. NESSIE'S MANSION - FRONT DRIVEWAY - LATER
Liquor delivery truck out front. Nessie's man/cat-servant, SPHINX - a lion with the head of man - trots over to the DRIVER, who clutches a clipboard in his hand.
SPHINXI regret to inform you, mister deliverer of fine elixirs, that this household will have to refuse your order. I'm afraid my master no longer imbibes.
DRIVERThen you gotta sign a refusal order.
SPHINXAh yes, I will make my mark. But only if you answer my riddle.
DRIVERWe gotta do this again?
SPHINXWhat is harder to catch the faster you run? Now, think hard. A correct response and you will earn my signature. But a wrong one and you will suffer a fate worse than --
Driver whips out his phone. Googles the answer.
DRIVERYour breath.
Sphinx grumbles. Snatches the clipboard, scribbles down his signature. Scampers off.
Driver shakes his head. He doesn't get paid nearly enough to deal with this shit.
DELIVERY VAN (TESTIMONIAL)
Driver shuts the rear doors, addresses the camera.
DRIVERI've only ever encountered these creatures a few times on my route. They give me the creeps. But if they don't bother me, I aint gonna bother them. By bother, I mean try to have sex with me. I aint into that kinky shit. Why do you ask? You know a monster who might want to get freaky with a human? Not that I'm interested... but wouldya know one that might?
INT. NESSIE'S MANSION - DEN (TESTIMONIAL)
Sphinx curled up on the couch. Holds up a cup of tea in his paws.
SPHINXMy last job before this one was dreadful. Absolutely dreadful. I worked for a mummy -- a second rate one at that -- in his tomb. No light. Terrible food. No one to talk to. Not even the mummy, because he's all wrapped up. The only visitors we received were the occasional black market antiques dealers. And they had terrible manners. I have only myself to blame, I suppose. I kept putting off updating my resume. Then, before you know it, four thousand years had passed.
Sphinx takes a sip of tea.
EXT. PUBLIC STORAGE FACILITY - NIGHT
Rows and rows of anonymous, closed units.
Eerie red light shines from underneath the door of one of them. GROANING, DEMONIC noises are heard from behind it. 
The door raises in a WHOOSH... we move forward into... 
A STORAGE UNIT
and the door CRASHES shut, plunging us into darkness.
A light clicks on, illuminating a hideous beast before us --
It's CHUPACABRA, a bipedal, lizard-like creature with big fangs and spines down his back. Unlike Biggie and Nessie, Chupacabra is small in stature, under five feet.
SUPER: "CHUPA (CHUPACABRA), POET/PAINTER/GOAT EXPERT"
Chupacabra throws back his head, lets out series BAYING sounds and guttural MOANS.
The monster gives a tour of his estate. 
Bare bones. Literally. Strewn all over the floor are bones. Most of which appear to be from goats. Then on the walls - splashes of blood. Ritualistic symbols. And...
Paintings. Several of them. They feature idyllic pastoral scenes. Fields. Flowers. And goats. Lots of goats frolicking. In the vein of Thomas Kinkade.
Chupacabra holds up a painting, beams with pride. He seems to be discussing his technique with a brush in his demon speak. 
EXT. SANTA MONICA - DAY
High above the beach. A new day dawns.
EXT. BIGGIE'S HOUSE - DAY
J.D.'s Jeep parked in the driveway.
BIGGIE (O.S.)So it's an old drawing of Nessie.
J.D. (O.S.)Look what's written at the bottom.
EXT. BIGGIE'S HOUSE - KITCHEN - DAY
Biggie with J.D. and Chupa. They are in the midst of a spirited round of the classic card game Uno.
Biggie inspects the drawing of Nessie (the one we saw in J.D.'s testimonial), which has been ripped out of the book.
BIGGIEIt's a bunch of letters. M, X, X, I...
J.D.It's Roman numerals for the date of Nessie's birth.
Chupa squawks.
J.D. (CONT'D)Right. Exactly a thousand years ago. This week!
BIGGIEOh, it's her birthday. You could've just told me that. You didn't have to ruin your priceless ancient book.
J.D.(re: game)Reverse to you, Chupa.(then)It's not a book. It's a tome. And proper citing sources is very important.
BIGGIEYeah, I guess we should do something. Maybe some takeout from the Cheesecake Factory? They have a catering menu that --
J.D.It's her millennial birthday! Think bigger, Biggie! How about a surprise party! With all of Nessie's magical friends! Especially nymphs -- you know that's where the term nymphomaniac comes from.
Chupa squawks in.
J.D. (CONT'D)Goats? Why would we invite any goats? This party would be strictly for monsters only. There's no room for farm animals.
BIGGIEAnd will there be alcohol at this surprise party?
J.D.(re: game)Chups, you have to put down a card that either has the same color or is the same number.(to Biggie)Have you ever heard of a monster mash without booze?
BIGGIESo you want to throw a booze-fueled party for a fifty-ton recovering alcoholic? What could go wrong?
J.D.What are you, the birthday party police?(nudges Chupa)Hey look, we got the birthday party police policing our birthday party.
Chupa cackles in laughter. Biggie furrows his substantial brow. Demons are exasperating.
INT. BIGGIE'S HOUSE - LIVING ROOM (TESTIMONIAL) - DAY
BIGGIEI guess I'm the only monster who remembers what Nessie is like when she's had too much to drink. It's not a pretty sight. Well, the demons can do what they want. I'm staying out of it.
KITCHEN
The Uno game continues. J.D. throws a draw four card on the pile.
J.D.Uh-oh, Chups. That's all you.
Chupa leaps to his feet. Throws back his head and bellows an INHUMAN SHRIEK in anger.
His unholy scream is so powerful that the kitchen windows SHATTER.
BACKYARD
Every animal in a two-mile radius scatters in absolute terror. Squirrels, birds, neighborhood pets and even a coyote race past.
J.D. (O.S.)You gonna do that every time you have to draw a card?
EXT. VENICE BEACH - DAY
People on the boardwalk. Basketball games. Skaters in the park.
EXT. BIGGIE'S HOUSE - DAY
Late in the afternoon.
BIGGIE (V.O.)Don't get me wrong, I love the fellas, but sometimes, it's a bit much.
INT. BIGGIE'S HOUSE - LIVING ROOM (TESTIMONIAL) - DAY
BIGGIEIt seems to me that this whole plan to enter civilization and live amongst humans only works when, I dunno, there's actually humans around! So, said to myself, Biggie, why don't you get a roommate of the homo sapien persuasion? Maybe that's exactly what this place needs. A human's touch.
INT. BIGGIE'S HOUSE - BEDROOM - DAY
Biggie types on his laptop, which looks more like a smart phone in his giant hands.
On the search engine, types "find roommate los angeles"
He clicks on the first result: easyroommate.com. He fills out a search field and submits.
BIGGIETwenty thousand matches?!
BEDROOM - HOURS LATER
Biggie bleary-eyed, still at his laptop.
BIGGIEI've been at this all day, and I'm starting to separate the contenders from the pretenders, the wheat from the chaff, the cream from the... non-cream.
He spins his laptop around to show the camera.
BIGGIE (CONT'D)(as he clicks open a profile)Hmm... unfortunately this guy is a germaphobe. It's kind of embarrassing to admit, but I have whole civilizations of insects living in my fur. There's literally millions of bugs who are born, live and die within these friendly confines.(next profile)Seems like a nice enough guy. Oh wait, that's famed Bigfoot hunter Matt Moneymaker! He's been after me for decades. Well, not today, Matt!
Biggie modifies his search terms.
BIGGIE (CONT'D)Okay, no monsters, clean freaks, no Matt Moneymaker...
Type, type, type. Click. New results populate the screen.
BIGGIE (CONT'D)Aha! Only nine matches. Much better.
INT. J.D.'S CONDO - DAY (TESTIMONIAL)
J.D. on his leather couch.
J.D.The planning for Nessie's thousandth birthday is going great. If you haven't been to a party planned by a demon, you haven't been to a party. Invites have been sent out to every godforsaken corner of the world. And as for the entertainment...
J.D. fishes out a business card. Holds it up proudly. Too far from the camera to make anything out.
J.D. (CONT'D)BOOYAHHH!!!!
Awkward pause.
J.D. (CONT'D)(to O.C. Camera Person)Are you zoomed in? Ya gotta zoom in.(then)Tell me when you're zoomed in.
We ZOOM into the business card. It reads: "D.J. J.D."; it promotes J.D.'s deejay career. And yes, he's available for weddings, family reunions and bar mitzvahs.
J.D. (CONT'D)BOOYAHH!!!! The music gonna be off the hook!!!
INSERT
J.D. at a turntable. Blasts out some SICK BEATS.
EXT. PARTY CITY - PARKING LOT - DAY
J.D. and Chupa walk from J.D.'s Jeep to the party supply store.
Bystanders gawk at Chupa -- what in the world is that thing?! An elderly woman lets out a SHRIEK. Runs.
J.D. is all too aware of this. Chupa oblivious.
J.D.Um, I forgot something in the car. Come back with me.
They head back.
INT. J.D.'S CAR - DAY
J.D. "gets" something from his center console. Scans the parking lot --
Soccer moms, posh couples, gents who look like they just came from a country club. A few onlookers giving looks in the direction of the Jeep, having just seen Chupa go in there.
J.D.Um, this neighborhood is kinda sketch. Since I just got this new Bose sound system, how about you just stay here and keep an eye on things.
All good with Chupa. He's fascinated by the stereo. He doesn't have that kind of tech in his squalid hell-hole.
INT. BIGGIE'S HOUSE - LIVING ROOM - DAY
Biggie has the profile of a dude named Brad pulled up. He dials him up.
BIGGIEHi, Brad? This is Biggie, from the roommate site. Sorry, I'm really slow at typing out messages. I have enormous fingers. Anyways, yeah. The room is available. Did you want to come and see it sometime -- oh, you can head over right now? Okay yeah that works.
INT. BIGGIE'S HOUSE - LIVING ROOM (TESTIMONIAL)
BIGGIEI have a good feeling about this guy. Brad Davis, now that's a name you can set your watch to. I don't want to get too carried away here, but I'm seeing B.F.F potential with Brad. He interns at StubHub. He said he could probably hook me up with Lakers, Dodgers, even Coachella tickets.
Biggie cracks a smile. This is going to be so awesome.
INT. PARTY CITY - DAY (TESTIMONIAL)
J.D. in an aisle of the all-party-all-the-time store. In his cart -- napkins, paper plates, decorations. All dinosaur-themed.
He lifts a packet of party hats off the shelf. They feature a picture of a lovable, cartoon gray dinosaur.
J.D.If I were to buy these decorations, which have a striking similarity to Nessie, would that be too on-the-nose? Or would it be cool in an ironic, hipster sort of way? On-the-nose. Or ironic. On-the-nose. Or ironic.
J.D. considers. 
J.D. (CONT'D)I should just trust my demonic instincts. Most people don't know that we demons are naturally great decorators. People think we only leave hideous scratch marks on walls. That's just us telling you -- Hey, this place sucks! Time to redecorate!
He tosses the items in the cart and strolls off. 
EXT. PARTY CITY - PARKING LOT - DAY
J.D. lugs his purchases, whistling to himself.
A small crowd has gathered near his Jeep. Uh-oh. J.D. pushes through and sees --
Teenagers snapping selfies with Chupa. The lizard creature enjoys the attention. Poses. 
J.D.Hey, what's going on here?
Teens ignore J.D. Continue to shower Chupa with attention. Chupa's digging being the star of this little gathering.
J.D. (CONT'D)... Does anyone want to take a picture with me?
RANDOM BRO(scoffs)Why? You're just a dude, dude.
PARKING LOT (TESTIMONIAL)
J.D. in front of the camera.
J.D.The Quakers didn't think I was just a dude back in Pine Barrens. They were terrified of me. Running for their lives, screaming, offering up their children as sacrifices to appease me.(smiles to himself)Great times.
OTHER SIDE OF PARKING LOT (TESTIMONIAL)
Random Bro recounts his experiences with Chupa.
RANDOM BROThat lizard thing was dope. Loved his vibe.(holds up his phone)My pic with it already has fifty-thousand likes.
INT. BIGGIE'S HOUSE - LIVING ROOM - NIGHT
Biggie paces nervously. DING DONG. He rushes over to the front door. Readies himself, opens it --
On the other side is BRAD DAVIS (22), an everyday guy.
BIGGIEHey, Brad! Biggie. Nice to meet ya.
Biggie extends his massive hairy paw. Brad gapes at the mythical forest giant that towers over him. 
Several seconds of awkward silence. 
BIGGIE (CONT'D)... I'm a monster. Did you not know that?(off Brad shaking his head)I put it in my profile. In all caps. Right at the beginning. And then again at the end. And my profile pic should've made it obvious... 
Biggie steps aside.
BIGGIE (CONT'D)Anyways, come on in. I'll give you the tour of the place.
EXT. BIGGIE'S HOUSE - YARD - NIGHT (TESTIMONIAL)
Brad stands off by himself. Speaks to the camera.
BRADI'm not like anti-monster or creature-phobic or whatever they call it. I just wasn't expecting to... live with one of them. But I'm in a tough spot and the rent is ridiculously cheap. Plus, the place is awesome.
INT. BIGGIE'S HOUSE - LIVING ROOM - NIGHT
As the tour finishes up.
BIGGIESo, whaddya think?
BRADHow can you get away with charging two hundred bucks for this?
BIGGIEHmm, you're right. Let's make it one-fifty.
BRADSay no more. I'll take it!
BIGGIEGreat! When do you want to move in?
BRADHow about right now? All my stuff is in the car, actually.
BIGGIEThat's unexpected and a bit strange... but, yeah. Alright! Let's get your stuff, roomie!
EXT. BIGGIE'S HOUSE - DRIVEWAY - DAY
Brad's beat-up sedan in the driveway.
Biggie reaches into the car and uses his superhuman strength to gather the entire contents of the stuffed vehicle -- Clothes, weights, assorted boxes, foosball table.
BRADWhoa. You're crazy strong. How much can you squat?
EXT. BIGGIE'S HOUSE - YARD - NIGHT (TESTIMONIAL)
Brad as before.
BRADBecca, I hope you're watching this. You kicked me out and, well, great. Now I have to live with Bigfoot. Hope you're loving life with Kyle or whatever-his-prick-name-is.(then)Monsters are like, vegans, yeah? I think I read that somewhere. They only eat veggies and shit. They don't eat meat, right? And people are made of meat so there's nothing to worry about.
EXT. CHUPA'S STORAGE UNIT - NIGHT
The Jeep pulled up nearby. J.D.'s arms full of Party City supplies, waits on Chupa to open up the unit.
Chupa raises up the door. Reveals his wretched den and its overwhelming goat theme. Chupa has reassembled a few goat skeletons and arranged them like they're having a tea party or something?
J.D.So I think we need to find you a therapist. You know, talk about what's going on with you and this goat... stuff.
Chupa responds.
J.D. (CONT'D)I dunno, seems to be more than a hobby.(pats his friend on the back)Don't worry, we're going to figure this out, together.
Chupa lowers his head, ashamed. J.D. strides past him.
INT. CHUPA'S STORAGE UNIT - DAY (TESTIMONIAL)
J.D. and Chupa address the camera.
J.D.A bit of a setback. Chupa and I were so concerned with throwing the greatest surprise party of all time that we forgot about the actual surprise part of the equation.
Chupa squeals. Throws up his hands.
J.D. (CONT'D)Right. How are we gonna get that sixty-ton thunder lizard out of her pool so we can set everything up?
Chupa utters a series a clicks. He has an idea.
INT. NESSIE'S MANSION - KITCHEN - DAY
Sphinx on the phone.
SPHINXSure, I will ask Master Nessie. But first you must answer a riddle. Some try to hide, some try to cheat, but time will show, we will always meet. What is my name?(listens)You Googled that didn't you?
INT. NESSIE'S MANSION - DEN - DAY (TESTIMONIAL)
Sphinx addresses the camera.
SPHINXI have a riddle for those men who invented the Google machine. Why are you so cruel?
EXT. NESSIE'S MANSION - POOL - DAY
Sphinx trots over to Nessie who sits in her pool. She is covered by a massive trap as if it were a blanket. She shakes and looks to be in throes of alcohol withdrawal.
SPHINXMaster Nessie, J.D. wants to know if you'd be interested in going fishing this Saturday.
NESSIEFishin'?! Don't they know this ole lassie spent most of her life a'fishing?! I never want to go fishing again! Now, hurry up and fix me another scotch, ya dobber!
SPHINXMaster, you gave me strict orders to not serve you any scotch. No matter how much you begged and pleaded.
NESSIEDon't tcha see I was joking?! That's an example of Scottish humor!
Sphinx ignores Nessie's requests and turns back to the house.
NESSIE (CONT'D)Wish I never met that no good cat.
Nessie's teeth chatter and her tremors continue.
INT. CHUPA'S STORAGE UNIT - TESTIMONIAL
J.D. and Chupa on the other end of the call. Exchange defeated looks.
J.D.Hate to tell you, Chups. But if we don't have a surprise, we don't have a party.
Chupa whines in distress.
EXT. SUNSET BLVD. - DAY
Speed up motion as day falls into night.
EXT. BIGGIE'S HOUSE - NIGHT
A tranquil evening in the Hollywood Hills.
BIGGIE (V.O.)I've always wanted to connect with a human.
INT. BIGGIE'S HOUSE - LIVING ROOM - TESTIMONIAL
Biggie to the camera. Beaming.
BIGGIEShow them that under the fur and scales and armor and in some case ooze, we monsters are all heart.
INT. BIGGIE'S HOUSE - DEN - NIGHT
Biggie and Brad play foosball. Brad banks a shot in. Victory. As by prior agreement, Biggie has to chug a beer. He picks up a pitcher and drains it one gulp. Let's out an ear-shattering belch.
Brad's never been more impressed.
BRADBro. You're like... talented.
Doorbell RINGS.
BIGGIEPizzas here!
Biggie bolts out of the room. Seconds later, Bigger re-enters hauling a towering stack of pizza boxes. Sets them down. 
BIGGIE (CONT'D)They're all meat-lovers.
Biggie shoves an entire pie in his mouth. As he chews --
BIGGIE (CONT'D)You know who is a meat-lover --(points at himself)This guy. Just can't get enough. Hell, I should've just ordered a whole cow. Ever eaten a live cow, Brad? A-maz-ing! Can't get any fresher meat than devouring an animal as it lets out its last, dying gasp. And the heart? Oh yeah, chewing on a cow heart when it's still beating, the warm blood squirting into your mouth - the best! But I can't limit myself to beef. No sir. If it walks or crawls, I've been known to eat it! I just love to tear into a piece of flesh! Preferably while it's still alive. Bro, what are you waiting for? Dig in.
The color has drained from Brad's face. He sways unsteadily on his feet.
INT. LIVING ROOM - NIGHT (TESTIMONIAL)
Brad looks a bit shaken up as he addresses the camera.
BRADLiving with Bigfoot is... I would say it's been... interesting. Interesting in a scary, frightening way.
INT. BRAD'S BEDROOM - NIGHT
We see Brad through NIGHTVISION. He's wide-eyed, terrified as he hears the sounds of SHRIEKING, HEAVY BREATHING, SCREAMING SOULS, maybe? Brad doesn't want to know. He covers his face with a pillow, tries to smother out the noise.
INT. BATHROOM - NIGHT
Biggie is the source of all the monstrous sounds, as he struggles to clean the bathroom.
BIGGIESometimes, I do miss cave living. So much easier to clean. Oh look. A chicken wing.
Biggie scoops the wing off the floor. Pops into his mouth.
EXT. HOLLYWOOD HILLS - DAY
Time lapse as the sun rises over Sunset Blvd.
INT. J.D.'S CONDO - DAY (TESTIMONIAL)
J.D.'s on his couch.
J.D.Chups and I decided, if you can't get a eighty-ton behemoth to leave her pool, then you just have to bring the surprise to her.
J.D. holds up a bottle of scotch.
J.D. (CONT'D)I'm just going to get her a little tipsy and distracted and before Nessie knows what's going on - boom! Surprise!
Chupa steps into the frame. Chirps.
J.D. (CONT'D)Yes, it's on the record that you don't think this is a good idea.
More chirping.
J.D. (CONT'D)Don't you see? The fact that she's an alcoholic is what makes this the perfect plan. She won't be able to resist! And then we can do our devilish dirty work.
J.D. whips out his cell phone.
J.D. (CONT'D)Hello. Yes, I'd like to purchase all of your scotch.(pauses)All you have. Every drop.(takes out a credit card)The name on the card is Big E. Foot...
INT. BIGGIE'S HOUSE - DEN - DAY (TESTIMONIAL)
Brad doesn't look like he's had much sleep since he moved in.
BRADBiggie constantly wants to hang out. And it always involves food. Like... like he's fattening me up. Like I'm a turkey and it's almost Thanksgiving...
LIVING ROOM (TESTIMONIAL)
Biggie talks to the camera.
BIGGIETonight's Nessie's surprise party. It's the perfect opportunity to introduce Brad to my fellow monsters. They're gonna love him, I just know it.
INT. BRAD'S ROOM - DAY
Brad's on his computer. Looking up alleged photos and images of Bigfoot/Sasquatch. 
Depictions of the creature MASSACRING PEOPLE, DRINKING THEIR BLOOD, DEVOURING THEIR LIMBS.
Text accompanies the pictures: "inhuman strength... insatiable appetite... man eater..."
Brad stares at that last phrase... "man eater..."
KNOCK at the door. Brad leaps out of his chair.
BIGGIE (O.S.)Hey, bro-mate! What're you doing in there?
BRADNothing! Just, uh... watching... porn.
BIGGIE (O.S.)Oh. Didn't mean to interrupt that. So I'm thinking we should pre-game before the big party tonight. So come on out when you're... finished.
Brad's terrified. But what can he do? He has to go out there. Biggie's waiting...
INT. LIVING ROOM - DAY
Brad slinks into the room, apprehensive. 
BIGGIE I put out some snacks. Help yourself.
On the coffee table is a smorgasbord of food. Almost exclusively meat products.
Brad stands there frozen. Images of Bigfoot's massacres race through his mind.
"Man eater..."
BIGGIE (CONT'D)Bro, would you fetch us some brews from the garage? I'll take 30 cans of IPA. Grab whatever you want for yourself.
Brad eyes the door to the garage. An escape? Or a trap?
GARAGE
Brad braces himself against the door. He's hyperventilating. He's next to the refrigerator, but steps past it. He sees light underneath another door...
STORAGE ROOM
Brad opens the door. CREEEAAAAK...
If Brad thought what he witnessed before was the stuff of nightmares, well, he's in for a real treat...
CARCASSES strung up everywhere. Deer. Pig. Horse. Unknown. Jars with swimming EYEBALLS. BRAINS on shelves. POOLS of blood on the floor.
Brad reacts the most reasonable way he knows how. He SCREAMS his head off.
LIVING ROOM
Biggie stiffens at the sound of Brad's screams.
BIGGIEShit, we outta beer?
A second later, Brad flies past him. A blur.
BRAD'S CELLPHONE (TESTIMONIAL)
Brad's records himself racing to his car. He's crying.
BRADBecca, I forgive you for cheating on me! All those many, many times! But you gotta take me back! Please!
Brad struggles to open his car door. Biggie's massive frame darkens the front door of the house.
BIGGIEHey bro, you going on a beer run?
BRADOh god! Someone help me!
Brad fumbles with his keys. Drops them. Falls to his knees, tries to scoop them up --
But Biggie grabs the keys first.
BIGGIEAlright, let's get that beer. And we should pick up some cheese. You look like a man who could use some cheese, Brad.
Brad looks like a man who believes he's about to die.
EXT. NESSIE'S MANSION - BACKYARD - DAY
Nessie in her pool, wrapped in the massive tarp. She is shaking and seems delirious. She hears something.
NESSIEWho goes there? Show der self!
J.D. steps into the yard. Pushes a wheelbarrow loaded with a barrel of scotch.
J.D.Hey, big girl! I heard you're feeling a bit rough, so I thought you could use a drink.
NESSIEAre ye for real? The lassie been seeing all 'orts of things.
J.D.It's me in the flesh. I come bearing gifts of scotch.
NESSIEScotch? Well, twist me flipper. Why didn't ye say so?
Nessie lurches forward and chomps down on the barrel. Takes down the contents in one gulp.
NESSIE (CONT'D)Now there's a good lad.
J.D.(cups his hand, yells)Chups, back up the truck. Our girl is thirsty!
NESSIEThere's a good lad.
EXT. LOS ANGELES - 405 - DAY
Sped up footage. Vehicles clog the expressway. Daylight fades as the car lights flicker on and dot the highway.
EXT. NESSIE'S MANSION - POOL - NIGHT
Nessie is blitzed. His long neck sways through the air as she signs AULD LANG SYNE.
She suddenly CRASHES to the ground.
J.D.Finally! I thought she was never going to pass out. Alright, Chups we only have an hour until the party starts!
SPHINX (O.S.)What in the name of Osiris is going on here?
Sphinx now stands on the patio, aghast at the sight of his master knocked out.
J.D.Oh, hey, Sphinxy. Appears Nessie unexpectedly and quite tragically got into some liquor. And there's nothing anyone could've done.
SPHINXOh my, master, when will you learn?(then)Gentlemen, as long as we have the opportunity, might as well set up the surprise.
J.D. and Chupa exchange looks. Nod.
EXT. NESSIE'S MANSION - BACKYARD - NIGHT (TESTIMONIAL)
J.D. speaks to the camera.
J.D.It was touch and go there for a bit, my man Chups and I were up to the challenge. I have to credit Sphinx with an assist as well.
INT. NESSIE'S MANSION - LIVING ROOM - AN HOUR EARLIER
Sphinx puts up the decorations.
BACKYARD
J.D. arranges his D.J. equipment.
DINING ROOM 
Chups sets up the bar area.
BACKYARD - AS BEFORE (TESTIMONIAL)
J.D.In the end, we got the job done. And I have to say, looks like the party will be total success.
In the background we see Nessie continue to snooze.
EXT. NESSIE'S MANSION - ENTRYWAY - NIGHT
A BLOB MONSTER is the first guest to arrive. It rings the doorbell. Sphinx opens the door.
BLOB MONSTERI'm here for the surprise par-tay.
SPHINXBefore I grant you access. Riddle me this: There is a house. One enters it blind and comes out seeing. What is it?
BLOB MONSTERHmm... is it blob?
Sphinx breathes FIRE. Totally incinerates the Blob Monster. All that remains are ashes.
J.D. appears at the doorway next to Sphinx. Clocks what just happened.
J.D.What did you do?! Blobbie owes me fifty bucks! Why do you think I invited him? For the lively conversation?!
Sphinx whimpers.
J.D. (CONT'D)Do me a favor and don't get the door anymore. Your riddles are a real buzzkill.
Sphinx pads away. J.D. shuts the door.
EXT. BIGGIE'S HOUSE - YARD - NIGHT (TESTIMONIAL)
Biggie dressed up in fancier clothes.
BIGGIEHonestly, I'm feeling a bit nervous. I just went everything to go well, you know? I want them to like Brad and Brad to like them...
Biggie rubs his stomach. Lets out a little giggle.
BIGGIE (CONT'D)Ohh, I feel butterflies! I haven't felt this way since... that one time I ate a whole colony of butterflies.
ANOTHER PART OF THE YARD (TESTIMONIAL)
Brad addresses the camera. A man condemned.
BRADI feel like we're going to the Last Supper. And I'm the supper.
INT. NESSIE'S MANSION - VARIOUS ROOMS - NIGHT
The monster mash is in full swing. We see A-list monsters - vampires, Frankenstein's monster, mummies hobnob with B- and C- list creatures. Loud MUSIC blares, all are drinking, having a good time.
KITCHEN
Assortment of monsters gathered around the kitchen table where a mini bar and food has been set up.
JACK FROST, a six-foot tall monster made completely out of ice, shovels chips and salsa into his mouth.
His wife, LADY FROST, a woman in the form of ice, observes Jack with a look of disapproval.
LADY FROSTYou know you're not supposed to be eating that.
JACK FROST(mouth full)A little bit won't hurt me.
LADY FROSTBut it has peppers... you know what that does to you...
Jack Frost shrugs. Gorges on more chips and salsa.
DEN
Two SNOBBISH ZOMBIES critique the decorations.
SNOBBISH ZOMBIE 1Don't you think these decorations might be a bit... on the nose? I mean, Nessie is a direct descendant of the dinosaurs.
SNOBBISH ZOMBIE 2That's what makes it so clever! I find it to be cool in an ironic, hipster sort of way.
They continue to contemplate this.
BACKYARD
D.J. J.D. spins the hits. Various monsters dance. Nessie is still out cold.
LIVING ROOM
Biggie and Brad enter. Biggie pauses to make his grand introduction. Except no one notices. Biggie clears his throat. Still no one clocks them.
Biggie bellows out --
BIGGIEHEY EVERYONE! MEET MY NEW HUMAN FRIEND, BRAD!
A classic record scratch moment. The entire room goes silent. Gapes at this human standing before them.
Brad is just as shocked as the monsters. He's never so many of these things in one place.
No one makes a sound for several agonizing seconds.
BIGGIE (CONT'D)He's also my roommate.
A witch falls over. Either fainted or dead.
FRONT YARD (TESTIMONIAL)
Biggie still in good spirits.
BIGGIEThat could've went better, yeah. But once everyone gets used to having a human around that doesn't want to kill them, stuff them, and hang them on the walls, everything will be fine.
DEN
Biggie strolls in to snatch a couple beers. MOTHMAN, a seven-foot tall moth/man hybrid with red eyes, approaches Biggie.
MOTHMANGood to see you, Biggie. I have some property investments you might be interested in. Real high off the ground. We should find some time to discuss.
BIGGIESure. Let's meet for coffee or nectar soon.
MOTHMANAbout your roommate. You can't trust humans. They're always leaving lights on. It's like they are purposely trying to confuse us. Lead us astray from the path of the true light.
BIGGIEBrad's been pretty good about shutting off the lights when he leaves a room.
MOTHMANI warn you, Biggie. I see terrible things in your future. Terrible things...
Mothman's eyes glow red. This convo is getting weird.
BIGGIEAh, I gotta deliver these brews. Talk to you later.
KITCHEN
Jack Frost is hunched over. Groans in discomfort. Streams of water flow from his forehead.
JACK FROSTI don't feel so good.
Lady Frost feels his forehead.
LADY FROSTYou're burning up! I told you not to eat that salsa!
She grabs a wash cloth, drapes it over his forehead.
LADY FROST (CONT'D)You better go lay down for a bit.
Jack Frost groans. They move off.
BACKYARD
J.D. works the turntable. Chupa bolts up to him, frantic.
J.D.I'm not taking any requests.
Chupa squawks and gestures wildly.
J.D. (CONT'D)He did what?!
LIVING ROOM
Brad is practically glued to the wall. He's sweaty, wide-eyed, alert to where the death blow might come from.
Biggie hands him a beer.
BIGGIEBro, I didn't take you for the shy type. Relax. I promise no one is judging you. In fact, they're thrilled your here.
The other monsters keep their distance from this strange human. Glower at Brad.
J.D. (O.S.)Um, Biggie...
Biggie spins around. J.D. has appeared at his side.
J.D. (CONT'D)I'd like a word, please.
DEN
J.D. paces in front of Biggie, furious. Biggie has his arms folded, obstinate.
BIGGIEI didn't know I had to get your permission.
J.D.Monsters and humans don't mix! At least not in domestic co-habitation situations.
BIGGIEThis is ironic coming from a demon who had umpteen surgeries to look like a human.
J.D.It's for my careers, you know that! How could you not realize what this would do to Chupa, Ness and I? To our sacred, monster-only bond? We're the fearsome foursome!
BIGGIEWe've never once called ourselves that.
J.D.And now we'll never be able to, thanks to you!
BIGGIEBrad is part of my world now. You're just going to have to accept that.
With that, Biggie moves off. J.D. shakes his fists.
J.D.This isn't over, Biggie! And where are those damn nymphs?!
KITCHEN
MEDUSA, the famed Greek monster with hair made of snakes, dips into the ice bucket. It's empty. 
She faces the wall as a courtesy so as to not turn her friends into stone. One of her snake HEADS turns to Sphinx.
MEDUSA SNAKE HEADSssssphinxxxx... you're out of iccccceeeee.....
Sphinx slaps his head with his paw.
SPHINXOh no, I forgot to pick some up. J.D. is going to murder me. 
Sphinx trots off into the
HALLWAY
Then halts. There is a trail of water on the floor. Sphinx follows it into a
BEDROOM
Where there is a big block of ice lying on the bed. What luck!
KITCHEN
Sphinx chops up the block of ice with a knife and hammer. Tosses chunks into the ice bucket. Puts a few cubes in Medusa's drink.
MEDUSA SNAKE HEADTtttthankkssssss.....
BACKYARD
Nessie remains passed out in the pool. A few creatures wheel out a massive dino-sized birthday cake.
J.D. pauses the tunes. Speaks into a mic.
J.D.Alright everybody! Get your monster asses out to the pool! We got a birthday gal to celebrate! And I do mean monster-only asses. No human asses allowed!
KITCHEN
The creatures start to exit. Lady Frost rushes in, concerned.
LADY FROSTHas anyone seen my husband? He was in the bedroom, but now I can't find him anywhere.
Sphinx looks at the bucket overflowing with ice. Then back at Lady Frost. Ohhh shittt. He slowly slips out the room.
LIVING ROOM
Biggie and Brad notice that other partygoers are emptying out into the pool area.
Brad seizes Biggie's arm.
BRADI bet I don't taste good. You ever think of that? I'm mostly skin and bones. Look at me.
BIGGIE(Huh?)Uh, good to know, buddy. Thanks for confiding in me.
Biggie wraps his big arms around Brad. Marches him out of the room.
BACKYARD
Nearly all of the monster mashers have assembled around the pool. Nessie remains dead to the world. Biggie and Brad join the assembly.
J.D. switches the music to the HAPPY BIRTHDAY SONG. Cranks it to an ear-splitting level. Monsters cover their ears, ear parts, head holes.
Nessie stirs. The music pumps life into her.
She raises her head. Groggy, she blinks. Looks around. Monsters cheer. 
MONSTERSSURPRISE!!!
Nessie lifts her large flipper and...
SMASHES a monster with it.
Grabs another monster with her mouth and BITES HIS HEAD OFF. Blood shoots out his neck like a fountain.
SCREAMS. PANIC. TERROR. 
Monsters try to flee, but Nessie is astonishingly quick. 
Crushes scores of them with her tail. Murders others by ripping them in half with her sharp teeth.
It's carnage. Horror. A BLOODBATH.
BACKYARD - LATER
The aftermath of the monster holocaust. Blood and guts paint the yard. Piles of corpses.
Biggie picks his way through the slaughter.
BIGGIEBrad? Brad? Where are you, bro?
BEHIND A BUSH
Brad hides. He's trembling and is covered with monster goo.
Biggie steps in front of him.
BIGGIEThere you are!
BRAD(weak)Please... please... don't eat me. 
BIGGIE(guffaws)Eat you? Is that what you thought? No wonder you've been acting so strange tonight!
BRADYou're not going to... eat me?
BIGGIENo! No one is going to eat you! Look, a lot creatures did get eaten tonight. Swallowed whole. But not you, right? 
BRADYeah, I guess that's true.
BIGGIEOf course it is! I promise to never eat you. Or let anyone else eat you. Unless... you're behind on rent.
Biggie laughs. Slaps Brad on the back, the force of which sends Brad flying.
BIGGIE (CONT'D)I'm kidding!
EXT. BIGGIE'S HOUSE - YARD - NIGHT (TESTIMONIAL)
Brad, still drenched in monster guts, talks to the camera.
BRADMy internship is unpaid, and I have tons of student debt. It's either live with Biggie or live out of my car. Plus, he said I'd never be breakfast, lunch, dinner or even a snack... so... that's good, right?
Brad looks back the house, uncertain.
EXT. NESSIE'S MANSION - BACKYARD - NIGHT (TESTIMONIAL)
J.D. packing up his equipment. He flashes a devilish grin.
J.D.Told you no one can throw a party like a demon.
A dead monster SPLATS onto his turntable.
TAG
EXT. LOS ANGELES - DAY
From high above, the city spread out in front of us.
NARRATOR (V.O.)This season on The Real Monsters of Hollywood... some monsters will seek help...
--Nessie at an A.A. meeting. She chugs down several gallons of coffee. Burps. The other attendees gawk at her.
--Chupa in a psychiatrist's office. The lizard creature is in the midst of a Rorschach test. For him, all of the ink spots are coming up goat.
NARRATOR (V.O.) (CONT'D)Others will find just what they are looking for...
--J.D. on the catwalk in a fashion show. Pushes another model out of the way so he can hog the spotlight.
--BETTY THE YETI, a female Sasquatch from the Himalayas, rings Biggie's door. Biggie opens.
BETTY THE YETIHi, are you Biggie? J.D. told me you were looking for a roommate. 
Biggie gulps. Looks over at Brad.
NARRATOR (V.O.)And Matt Moneymaker just won't quit..
--A surveillance van parked outside Biggie's house. Matt Moneymaker is inside, hunched over a monitor. Spying...
END TAG`;


// =============================================
// ROUTE HANDLER
// =============================================

export async function POST(req) {
  try {
    const { messages, userId, chatId, senderName } = await req.json();

    // --- Load chat info ---
    let resolvedChatTitle = null;
    if (chatId) {
      const { data: chatInfo } = await supabase
        .from("chats")
        .select("title, category")
        .eq("id", chatId)
        .single();
      if (chatInfo) {
        resolvedChatTitle = chatInfo.title;
      }
    }

    // --- Clean messages ---
    // 1. Remove empty/null content
    const cleanMessages = (messages || []).filter(
      (msg) => msg.content && msg.content.trim().length > 0
    );

    // 2. Merge consecutive same-role messages (Claude API requires alternating roles)
    // This prevents crashes when multiple user messages were saved without an assistant
    // response between them (e.g. from earlier failed requests)
    const mergedMessages = [];
    for (const msg of cleanMessages) {
      if (
        mergedMessages.length > 0 &&
        mergedMessages[mergedMessages.length - 1].role === msg.role
      ) {
        // Same role as previous — merge content
        mergedMessages[mergedMessages.length - 1] = {
          ...mergedMessages[mergedMessages.length - 1],
          content:
            mergedMessages[mergedMessages.length - 1].content +
            "\n" +
            msg.content,
        };
      } else {
        mergedMessages.push({ ...msg });
      }
    }

    // 3. Ensure conversation starts with a user message (Claude API requirement)
    const validMessages =
      mergedMessages.length > 0 && mergedMessages[0].role === "assistant"
        ? mergedMessages.slice(1)
        : mergedMessages;

    // --- Format messages with sender names ---
    const formattedMessages = validMessages.map((msg) => {
      if (msg.role === "user" && msg.senderName) {
        return {
          role: "user",
          content: `[${msg.senderName}]: ${msg.content}`,
        };
      }
      // Strip any extra fields — Claude API only wants role + content
      return {
        role: msg.role,
        content: msg.content,
      };
    });

    // --- Build system prompt ---
    const chatContext = resolvedChatTitle
      ? `\n\n---\n\n## CURRENT CHAT\n\nYou are currently in the "${resolvedChatTitle}" chat. The team is working in this phase right now. Anchor your responses to this phase's concerns unless explicitly told otherwise.`
      : "";

    const systemPrompt =
      STUDIO_SYSTEM_PROMPT +
      "\n\n---\n\n## THE SCRIPT (V1 / Tracking B)\n\nBelow is the full script. Reference scenes, dialogue, and specific beats by quoting or paraphrasing.\n\n```\n" +
      SCRIPT_TEXT +
      "\n```" +
      chatContext;

    // --- Call Claude API ---
    console.log("Studio chat request:", {
      userId,
      chatId,
      senderName,
      messageCount: formattedMessages.length,
    });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-20250514",
        max_tokens: 2000,
        stream: true,
        system: systemPrompt,
        messages: formattedMessages,
      }),
    });

    // --- Check for API errors ---
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: `Claude API returned ${response.status}`,
          details: errorText,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // --- Stream response ---
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  if (
                    parsed.type === "content_block_delta" &&
                    parsed.delta?.type === "text_delta"
                  ) {
                    controller.enqueue(
                      encoder.encode(
                        "data: " +
                          JSON.stringify({ text: parsed.delta.text }) +
                          "\n\n"
                      )
                    );
                  }
                } catch (parseErr) {
                  console.error("SSE parse error:", parseErr.message, "data:", data.slice(0, 100));
                }
              }
            }
          }
        } catch (streamErr) {
          console.error("Stream read error:", streamErr);
          controller.error(streamErr);
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    // Top-level catch for any unexpected errors (bad JSON, missing fields, etc.)
    console.error("Studio chat route error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

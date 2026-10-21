# Start check: Vigilant (`vigilants`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Bounty: Book (`zzzAomBountyBook`, Vigilant.esm:4E1318, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Put the erotic book in the Collection Chest", shown at stage 10. Source: Vigilant.esm:4E1318 QOBJ 10. **files**
- zzzAomBountyBook (Bounty: Book) calls SetStage 10. Source: defaultsetstageonplayeracquire.OnContainerChanged on Vigilant.esm:4E1318 (Vigilant.esm). **script**

**Who and where**

- First objective: "Take the erotic book from <Alias=Target> in <Alias=BookLocation>". Source: Vigilant.esm:4E1318 QOBJ 0. **files**
- Target alias PornBook (created): Mazoga the Hardened (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlBQRewardPornBook (levelled: gold and an item) (stage 20, QF_zzzAomBoutyBook_024E1318.fragment_4).

## 2. Bounty: Chick Trader (`zzzAomBountyChickTrader`, Vigilant.esm:4E372E, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Take the orphan to the Temple of Stendarr", shown at stage 10. Source: Vigilant.esm:4E372E QOBJ 10. **files**
- zzzAomBountyChickTrader (Bounty: Chick Trader) calls SetStage 10. Source: defaultaliasondeathscript.onDeath on Vigilant.esm:4E372E (Vigilant.esm). **script**
- Dialogue with someone the line does not name (named by alias ChickTrader of zzzAomBountyChickTrader (Bounty: Chick Trader) (created)), "Fine. I'll buy the orphan. (500 gold)": SetStage 10 (when: fn48 >= 500; Bounty: Chick Trader stage < 10; the speaker is the one in alias ChickTrader). Reply: "Ah, you did a very good deed today. You saved a poor orphan, yes?" Source: AomBq_TIF__024E3745.Fragment_0 on INFO Vigilant.esm:4E3745 (Vigilant.esm). **script**

**Who and where**

- First objective: "Kill the Chick Trader or buy an orphan in <Alias=TownLocation>". Source: Vigilant.esm:4E372E QOBJ 0. **files**
- Target alias ChickTrader (created): Chick Trader (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlBQRewardChickTrader (levelled: gold and an item) (stage 20, QF_zzzAomBountyChickTrader_024E372E.fragment_10).

## 3. Bounty: Piper (`zzzAoMBountyPiper`, Vigilant.esm:4E0116, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Defeat the Piper in <Alias=PiperLocation>". Source: Vigilant.esm:4E0116 QOBJ 0. **files**
- Target alias Piper (created): Holy Piper (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlBQRewardPiper (levelled: gold and an item) (stage 10, QF_zzzAoMBountyPiper_024E0116.fragment_2).

## 4. Bounty: Daedric Relic (`zzzAomBountyRelic`, Vigilant.esm:4E011B, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Put the Beacon in the Collection Chest", shown at stage 10. Source: Vigilant.esm:4E011B QOBJ 10. **files**
- zzzAomBountyRelic (Bounty: Daedric Relic) calls SetStage 10. Source: defaultsetstageonplayeracquire.OnContainerChanged on Vigilant.esm:4E011B (Vigilant.esm). **script**

**Who and where**

- First objective: "Find the relic of Meridia in <Alias=RelicLocation>". Source: Vigilant.esm:4E011B QOBJ 0. **files**
- Target alias Relic (created): Beacon: Praise Meridia (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlBQRewardMeridia (levelled: gold and an item) (stage 20, QF_zzzAomBountyRelic_024E011B.fragment_7).

## 5. Bounty: Horn (`zzzAoMBountyRelicHorn`, Vigilant.esm:4E0121, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Put the Horn in the Collection Chest", shown at stage 10. Source: Vigilant.esm:4E0121 QOBJ 10. **files**
- zzzAoMBountyRelicHorn (Bounty: Horn) calls SetStage 10. Source: defaultsetstageonplayeracquire.OnContainerChanged on Vigilant.esm:4E0121 (Vigilant.esm). **script**

**Who and where**

- First objective: "Find the lost Horn of Stendarr in <Alias=HornLocation>". Source: Vigilant.esm:4E0121 QOBJ 0. **files**
- Target alias Horn (created): Golden Horn of Stendarr (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlBQRewardHorn (levelled: gold and an item) (stage 20, QF_zzzAoMBountyRelicHorn_024E0121.fragment_6).

## 6. Bounty: Summoner (`zzzAomBountySummoner`, Vigilant.esm:4E0102, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Defeath the summoner in <Alias=TargetLocation>". Source: Vigilant.esm:4E0102 QOBJ 0. **files**
- Target alias Target (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlBQRewardSummoner (levelled: gold and an item) (stage 10, QF_zzzAomBountySummoner_024E0102.fragment_2).

## 7. Bounty: Vampire (`zzzAomBountyVampire`, Vigilant.esm:4E0108, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Find and eliminate the vampire in <Alias=TownLocation>". Source: Vigilant.esm:4E0108 QOBJ 0. **files**
- Target alias CenterMarker (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlBQRewardVampire (levelled: gold and an item) (stage 10, QF_zzzAomBountyVampire_024E0108.fragment_2).

## 8. Bounty: Witch (`zzzAomBountyWitch`, Vigilant.esm:4E010E, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Kill the witch in <Alias=WitchLocation>". Source: Vigilant.esm:4E010E QOBJ 0. **files**
- Target alias Witch (created): Vigilant.esm:4E0110 (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlBQRewardWitch (levelled: gold and an item) (stage 10, QF_zzzAomBountyWitch_024E010E.fragment_2).

## 9. Vigilant of Stendarr (`zzzAoMMq00`, Vigilant.esm:005CE2, Vigilant - Delayed Start.esp)

**Started by**

- Dialogue with Altano (named by alias Altano of zzzAoMMq00 (Vigilant of Stendarr) (unique)), placed in Temple of Stendarr, "No, thanks. I'm not interested.": SetStage 5 (when: the speaker is the one in alias Altano). Source: AoM00_TIF__01005CEB.Fragment_0 on INFO Vigilant.esm:005CEB (Vigilant.esm). **script**
- Story manager node VigilantDelayedStart, event: change location; conditions up its parents: level >= zzzVigilantMinLevel (now 25); The House of Horrors completed; Kindred Judgment completed. Source: VigilantDelayedStart Vigilant - Delayed Start.esp:000801 (Vigilant - Delayed Start.esp). **files**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Follow Altano or meet him in the Temple of Stendarr", shown at stage 10. Source: Vigilant.esm:005CE2 QOBJ 10. **files**
- Dialogue with Altano (named by alias Altano of zzzAoMMq00 (Vigilant of Stendarr) (unique)), placed in Temple of Stendarr, "Yes, I'll join you.": SetStage 10 (when: the speaker is the one in alias Altano). Reply: "I'm glad to hear this. I look forward to working with you from now on. Stendarr's blessing be with you." Source: AoM00_TIF__01005CE9.Fragment_0 on INFO Vigilant.esm:005CE9 (Vigilant.esm). **script**

**Who and where**

- First objective: "Join the Vigilants of Stendarr". Source: Vigilant.esm:005CE2 QOBJ 5. **files**
- Target alias Altano (unique): Altano (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**
- Global zzzVigilantMinLevel: record 25.0 (Vigilant - Delayed Start.esp). **files**

**Gives**: nothing on its completing stages.

## 10. Bloodsucker (`zzzAoMMq01`, Vigilant.esm:005CE3, Vigilant.esm)

**Started by**

- zzzAoMMq00 (Vigilant of Stendarr) calls at stage 40 Start; at stage 40 SetStage 0. Sources: QF_zzAoMMq00_01005CE2.fragment_15 on Vigilant.esm:005CE2. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Follow Altano or meet him in Whiterun's Hall of the Dead", shown at stage 10. Source: Vigilant.esm:005CE3 QOBJ 10. **files**
- Dialogue with Altano (named by alias Altano of zzzAoMMq01 (Bloodsucker) (unique)), placed in Temple of Stendarr, "Is there any work I can help with?": SetStage 10 (when: Bloodsucker stage < 10; the speaker is the one in alias Altano). Reply: "A priest of Arkay in Whiterun has requested our assistance. It seems they have some problems with a vampire." Source: AoM01_TIF__01006259.Fragment_0 on INFO Vigilant.esm:006259 (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Altano". Source: Vigilant.esm:005CE3 QOBJ 0. **files**
- Target alias Altano (unique): Altano (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 11. He Who Cannot Be Touched (`zzzAoMMq02`, Vigilant.esm:006271, Vigilant.esm)

**Started by**

- zzzAoMMq01 (Bloodsucker) calls at stage 50 Start; at stage 50 SetStage 0. Sources: QF_zzAoMMq01_01005CE3.fragment_8 on Vigilant.esm:005CE3. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Defeat the Daedra", shown at stage 10. Source: Vigilant.esm:006271 QOBJ 10. **files**
- Dialogue with Altano (named by alias Altano of zzzAoMMq02 (He Who Cannot Be Touched) (unique)), placed in Temple of Stendarr, "Did you notice anything unusual happening?": SetStage 10 (when: fn67 == 1; He Who Cannot Be Touched stage < 10; the speaker is the one in alias Altano). Reply: "A Daedra destroyed a house outside the city walls a few hours ago. People heard it laughing and apparently it's still in the house." Source: AoM02_TIF__01006275.Fragment_0 on INFO Vigilant.esm:006275 (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Altano in the Bannered Mare". Source: Vigilant.esm:006271 QOBJ 0. **files**
- Target alias Altano (unique): Altano (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 12. Lazy Afternoon (`zzzAoMMq03`, Vigilant.esm:00627F, Vigilant.esm)

**Started by**

- zzzAoMMq02 (He Who Cannot Be Touched) calls at stage 30 Start; at stage 30 SetStage 0. Sources: QF_zzAoMMq02_01006271.fragment_0 on Vigilant.esm:006271. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Follow Altano or meet him in Candlehearth Hall", shown at stage 10. Source: Vigilant.esm:00627F QOBJ 10. **files**
- Dialogue with Altano (named by alias Altano of zzzAoMMq03 (Lazy Afternoon) (unique)), placed in Temple of Stendarr, "Have you found out where the summoner is now?": SetStage 10 (when: fn67 == 1; Lazy Afternoon stage < 10; the speaker is the one in alias Altano). Reply: "I heard they're having trouble with a Daedra in one of the WIndhelm's inns. This might be related... Let's go check it out." Source: AoM03_TIF__01008850.Fragment_0 on INFO Vigilant.esm:008850 (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Altano in the Bannered Mare". Source: Vigilant.esm:00627F QOBJ 0. **files**
- Target alias Altano (unique): Altano (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 13. The Eye of Madness (`zzzAoMMq04`, Vigilant.esm:0082EA, Vigilant.esm)

**Started by**

- zzzAoMMq03 (Lazy Afternoon) calls at stage 40 Start; at stage 40 SetStage 0. Sources: QF_zzAoMMq03_0100627F.fragment_9 on Vigilant.esm:00627F. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Investigate the rumors about the Eye of Madness", shown at stage 10. Source: Vigilant.esm:0082EA QOBJ 10. **files**
- Dialogue with Altano (named by alias Altano of zzzAoMMq04 (The Eye of Madness) (unique)), placed in Temple of Stendarr, "You look troubled. What's wrong?": SetStage 10 (when: fn67 == 1; The Eye of Madness stage < 10; the speaker is the one in alias Altano). Reply: "I overheard a strange rumor from the guards. Apparently, there's a sinister man in Kynesgrove... They say that anyone who makes eye contact with him goes insane." Source: AoM04_TIF__0100934C.Fragment_0 on INFO Vigilant.esm:00934C (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Altano in Candlehearth Hall". Source: Vigilant.esm:0082EA QOBJ 0. **files**
- Target alias Altano (unique): Altano (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Nord Mead (stage 50, QF_zzAoMMq04_010082EA.fragment_10).

## 14. Dine and Dash (`zzzAoMMq05`, Vigilant.esm:0098C9, Vigilant.esm)

**Started by**

- zzzAoMMq04 (The Eye of Madness) calls at stage 50 Start; at stage 50 SetStage 0. Sources: QF_zzAoMMq04_010082EA.fragment_10 on Vigilant.esm:0082EA. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Follow Altano or meet him at Stendarr's Beacon", shown at stage 10. Source: Vigilant.esm:0098C9 QOBJ 10. **files**
- Dialogue with Altano (named by alias Altano of zzzAoMMq05 (Dine and Dash) (unique)), placed in Temple of Stendarr, "Any clues on the summoner yet?": SetStage 10 (when: fn67 == 1; Dine and Dash stage < 10; the speaker is the one in alias Altano). Reply: "Apparently, she's been seen in Riften. My old mentor summoned us to Stendarr's Beacon, so let's go talk to him." Source: AoM05_TIF__01009E31.Fragment_0 on INFO Vigilant.esm:009E31 (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Altano in Candlehearth Hall". Source: Vigilant.esm:0098C9 QOBJ 0. **files**
- Target alias Altano (unique): Altano (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 15. Thus Spoke Khajiit (`zzzAoMMq06`, Vigilant.esm:009E68, Vigilant.esm)

**Started by**

- zzzAoMMq05 (Dine and Dash) calls at stage 60 Start; at stage 60 SetStage 0. Sources: QF_zzAoMMq05_010098C9.fragment_12 on Vigilant.esm:0098C9. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet Altano in the Ragged Flagon", shown at stage 10. Source: Vigilant.esm:009E68 QOBJ 10. **files**
- Dialogue with Altano (named by alias Altano of zzzAoMMq06 (Thus Spoke Khajiit) (unique)), placed in Temple of Stendarr, "Jacob says someone summoned a Daedra in the Ratway.": SetStage 10 (when: Thus Spoke Khajiit stage < 10; the speaker is the one in alias Altano). Reply: "In the Ratway? Hm, I have friends in the Ragged Flagon. I'll try to get some information from them." Source: AoM06_TIF__0100A3D7.Fragment_0 on INFO Vigilant.esm:00A3D7 (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Altano". Source: Vigilant.esm:009E68 QOBJ 0. **files**
- Target alias Altano (unique): Altano (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 16. Old Regrets (`zzzAoMMq07`, Vigilant.esm:00A3FE, Vigilant.esm)

**Started by**

- zzzAoMMq06 (Thus Spoke Khajiit) calls at stage 90 Start; at stage 90 SetStage 0; at stage 90 Start; at stage 90 SetStage 0. Sources: QF_zzAoMMq06_01009E68.fragment_18, QF_zzAoMMq06_01009E68.fragment_41 on Vigilant.esm:009E68. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Defeat Summoner's Mercenary", shown at stage 10. Source: Vigilant.esm:00A3FE QOBJ 10. **files**
- Dialogue with Taranis (named by alias Umbra of zzzAoMMq07 (Old Regrets) (unique)), placed in Pond House: SetStage 10 (when: Old Regrets stage < 10; the speaker is the one in alias Umbra). Reply: "Stop. Not a step further." Source: AoM07_TIF__0100EA72.Fragment_0 on INFO Vigilant.esm:00EA72 (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Jacob". Source: Vigilant.esm:00A3FE QOBJ 0. **files**
- Target alias Jacob (unique): Jacob (unique actor, placed in Actor Room). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: Stendarr's Beacon Underground Key (stage 9999, QF_zzAoMMq07_0100A3FE.fragment_28).

## 17. No Mercy (`zzzAoMMq08`, Vigilant.esm:00EA8A, Vigilant.esm)

**Started by**

- zzzAoMMq07 (Old Regrets) calls at stage 80 Start; at stage 80 SetStage 0. Sources: QF_zzAoMMq07_0100A3FE.fragment_10 on Vigilant.esm:00A3FE. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "(Optional) Negotiate with Altano", shown at stage 200. Source: Vigilant.esm:00EA8A QOBJ 200. **files**
- zzzAoMMq08 (No Mercy) calls SetStage 15. Source: defaultaliasondeathscript.onDeath on Vigilant.esm:00EA8A (Vigilant.esm). **script**
- zzzAoMMq08 (No Mercy) calls SetStage 18. Source: defaultaliasondeathscript.onDeath on Vigilant.esm:00EA8A (Vigilant.esm). **script**
- Dialogue with Carene (named by alias Mom of zzzAoMMq08 (No Mercy) (unique)), placed in Pond House, "I am a Vigilant of Stendarr. I'm looking for the witch living here.": SetStage 10 (when: No Mercy stage < 200; the speaker is the one in alias Mom). Reply: "...Lillian, run! We have to run!" Source: AoM08_TIF__0100EFF5.Fragment_2 on INFO Vigilant.esm:00EFF5 (Vigilant.esm). **script**
- Dialogue with Carene (named by alias Mom of zzzAoMMq08 (No Mercy) (unique)), placed in Pond House, "All right, I don't see a problem here, then. But this place isn't safe. You should leave, quickly.": SetStage 200 (when: the speaker is the one in alias Mom). Reply: "But if you're here, then that means... yes. Yes, I understand." Source: AoM08_TIF__010423C2.Fragment_0 on INFO Vigilant.esm:0423C2 (Vigilant.esm). **script**

**Who and where**

- First objective: "Hunt down the witches". Source: Vigilant.esm:00EA8A QOBJ 0. **files**
- Target alias Mom (unique): Carene (unique actor, placed in Pond House). **files**
- Target alias Daughter (unique): Lilian (unique actor, placed in Pond House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Pond House: 1 door, 0 locked; Pond House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 18. The Endless Fall (`zzzAoMMq09`, Vigilant.esm:00EFF7, Vigilant.esm)

**Started by**

- zzzAoMMq08 (No Mercy) calls at stage 30 Start; at stage 30 SetStage 0; at stage 230 Start; at stage 230 SetStage 0. Sources: QF_zzAoMMq08_0100EA8A.fragment_9, QF_zzAoMMq08_0100EA8A.fragment_24 on Vigilant.esm:00EA8A. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Defeat the Daedra", shown at stage 10. Source: Vigilant.esm:00EFF7 QOBJ 10. **files**
- zzzAoMMq09 (The Endless Fall) calls SetStage 10. Source: defaultsetStageOnHitAliasScript.testForTrigger on Vigilant.esm:00EFF7 (Vigilant.esm). **script**
- Dialogue with Altano (named by alias Altano of zzzAoMMq09 (The Endless Fall) (unique)), placed in Temple of Stendarr, "Why in Oblivion are you doing this, Altano?": SetStage 10 (when: the speaker is the one in alias Altano). Reply: "I have nothing more to say to the dying." Source: AoM09_TIF__01011B3E.Fragment_0 on INFO Vigilant.esm:011B3E (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Altano". Source: Vigilant.esm:00EFF7 QOBJ 0. **files**
- Target alias Altano (unique): Altano (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: Spell Tome (Master): Conjure Molag Bal (stage 50, QF_zzAoMMq09_0100EFF7.fragment_8).

## 19. The Landing (`zzzAoMMq10`, Vigilant.esm:011B75, Vigilant.esm)

**Started by**

- zzzAoMMq09 (The Endless Fall) calls at stage 50 Start; at stage 50 SetStage 0. Sources: QF_zzAoMMq09_0100EFF7.fragment_8 on Vigilant.esm:00EFF7. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Destroy the Mace of Molag Bal", shown at stage 10. Source: Vigilant.esm:011B75 QOBJ 10. **files**
- zzzAoMMq10 (The Landing) calls SetStage 10. Source: defaultaliasondeathscript.onDeath on Vigilant.esm:011B75 (Vigilant.esm). **script**
- Dialogue with Altano (named by alias Altano of zzzAoMMq10 (The Landing) (unique)), placed in Temple of Stendarr, "Rest in peace, Altano... Stendarr be with you.": SetStage 5 (when: the speaker is the one in alias Altano). Reply: "I'm so sorry... I..." Source: AoM10_TIF__0101367B.Fragment_0 on INFO Vigilant.esm:01367B (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Altano". Source: Vigilant.esm:011B75 QOBJ 0. **files**
- Target alias Altano (unique): Altano (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: [*] Horn of Stendarr (stage 9999, QF_zzAoMMq10_01011B75.fragment_18).

## 20. Art of Mercy (`zzzAoMMqGoodEnd`, Vigilant.esm:4D0376, Vigilant.esm)

**Started by**

- zzzAoMMq08 (No Mercy) calls at stage 310 Start; at stage 310 SetStage 0. Sources: QF_zzAoMMq08_0100EA8A.fragment_34 on Vigilant.esm:00EA8A. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Stop Carene", shown at stage 10. Source: Vigilant.esm:4D0376 QOBJ 10. **files**
- Dialogue with Carene (named by alias Mother of zzzAoMMqGoodEnd (Art of Mercy) (unique)), placed in Pond House, "I killed him in self-defense. Neither of us could give up, and we couldn't come to an agreement.": SetStage 10 (when: Art of Mercy stage < 10; the speaker is the one in alias Mother). Reply: "Oh, I'm sure that's true. Perhaps you really had a reason. But I still can't forgive you." Source: AoMqGE_TIF__024D0386.Fragment_0 on INFO Vigilant.esm:4D0386 (Vigilant.esm). **script**
- Dialogue with Carene (named by alias Mother of zzzAoMMqGoodEnd (Art of Mercy) (unique)), placed in Pond House, "Don't even think about revenge. You'll just make your daughter an orphan.": SetStage 10 (when: Art of Mercy stage < 10; the speaker is the one in alias Mother). Reply: "Are you trying to scare me? Do you really think you won't be the one to die here? How dare a rogue like you call yourself a Vigilant!" Source: AoMqGE_TIF__024D0388.Fragment_0 on INFO Vigilant.esm:4D0388 (Vigilant.esm). **script**
- Dialogue with Carene (named by alias Mother of zzzAoMMqGoodEnd (Art of Mercy) (unique)), placed in Pond House, "No. I don't want to see any more blood today.": SetStage 10 (when: Art of Mercy stage < 10; the speaker is the one in alias Mother). Reply: "Oh, I'm sure you don't. You've killed so many and spilled so much blood already, you're tired of looking at it!" Source: AoMqGE_TIF__024D038A.Fragment_0 on INFO Vigilant.esm:4D038A (Vigilant.esm). **script**
- Dialogue with Carene (named by alias Mother of zzzAoMMqGoodEnd (Art of Mercy) (unique)), placed in Pond House, "Everything the Vigil does is just. Taranis' death was therefore justified as well.": SetStage 10 (when: Art of Mercy stage < 10; the speaker is the one in alias Mother). Reply: "You crazy bastard! I'll kill you!" Source: AoMqGE_TIF__024D038C.Fragment_0 on INFO Vigilant.esm:4D038C (Vigilant.esm). **script**
- Dialogue with Carene (named by alias Mother of zzzAoMMqGoodEnd (Art of Mercy) (unique)), placed in Pond House, "Vengeance... Fine, have it your way. Come on, then.": SetStage 10 (when: Art of Mercy stage < 10; the speaker is the one in alias Mother). Reply: "You don't have to tell me what to do! Now, prepare yourself!" Source: AoMqGE_TIF__024D038E.Fragment_0 on INFO Vigilant.esm:4D038E (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Carene". Source: Vigilant.esm:4D0376 QOBJ 0. **files**
- Target alias Mother (unique): Carene (unique actor, placed in Pond House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Pond House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: [*] Horn of Stendarr (stage 120, QF_zzzAoMMqGoodEnd_024D0376.fragment_25).

## 21. Radiance in the Dead (`zzzAoMRadDead`, Vigilant.esm:4EA3A8, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Slay the <Alias=Boss> in <Alias=TargetLocation>". Source: Vigilant.esm:4EA3A8 QOBJ 0. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlRQRewardUndead (levelled: gold and an item) (stage 10, QF_zzzAoMRadDead_024EA3A8.fragment_2).

## 22. Radiance in the Duplicate (`zzzAoMRadDoppler`, Vigilant.esm:4EA3D1, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Slay <Alias=Target> in <Alias=TargetLocation>". Source: Vigilant.esm:4EA3D1 QOBJ 0. **files**
- Target alias Target (created): Duplicate (created item). **files**
- Target alias Target2 (created): Duplicate (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlRQRewardDoppler (levelled: gold and an item) (stage 10, QF_zzzAoMRadDoppler_024EA3D1.fragment_2).

## 23. Radiance in the Spawn (`zzzAoMRadMolag`, Vigilant.esm:4EA3AC, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Slay <Alias=Target> in <Alias=TargetLocation>". Source: Vigilant.esm:4EA3AC QOBJ 0. **files**
- Target alias Target (created): Spawn of Molag Bal (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlRQRewardMolag (levelled: an item) (stage 10, QF_zzzAoMRadMolag_024EA3AC.fragment_2).

## 24. Radiance in the Vampire (`zzzAoMRadVampire`, Vigilant.esm:4E91B0, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Slay the <Alias=Boss> in <Alias=TargetLocation>". Source: Vigilant.esm:4E91B0 QOBJ 0. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlRQRewardVamp (levelled: gold and an item) (stage 10, QF_zzzAoMRadVampire_024E91B0.fragment_2).

## 25. Radiance in the Witch Hunter (`zzzAoMRadWitchHunter`, Vigilant.esm:4EA3C8, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Slay the witch hunter in <Alias=TargetLocation>". Source: Vigilant.esm:4EA3C8 QOBJ 0. **files**
- Target alias Target (created): Witch Hunter (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: zzzAoMLvlRQRewardHunter (levelled: gold and an item) (stage 10, QF_zzzAoMRadWitchHunter_024EA3C8.fragment_1).

## 26. Sacred Anatomancer (`zzzAoMSubQ02`, Vigilant.esm:4D4C3D, Vigilant.esm)

**Started by**

- Dialogue with Gwyneth (named by alias Libra of zzzAoMRumor (Rumor) (unique)), placed in Temple of Stendarr, "Any interesting rumors to share?": Start (when: Aetherius stage 255 done; GetQuestRunning Sacred Anatomancer == 0; Sacred Anatomancer not completed; the speaker is the one in alias Libra). Source: AoMRumor_TIF__024D952F.Fragment_1 on INFO Vigilant.esm:4D952F (Vigilant.esm). **script**
- Dialogue with Gwyneth (named by alias Libra of zzzAoMRumor (Rumor) (unique)), placed in Temple of Stendarr, "Any interesting rumors to share?": SetStage 0 (when: Aetherius stage 255 done; GetQuestRunning Sacred Anatomancer == 0; Sacred Anatomancer not completed; the speaker is the one in alias Libra). Source: AoMRumor_TIF__024D952F.Fragment_1 on INFO Vigilant.esm:4D952F (Vigilant.esm). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Prove yourself to the Anatomancer", shown at stage 1. Source: Vigilant.esm:4D4C3D QOBJ 1. **files**
- **unread**: nothing outside its own stage fragments sets stage 1 or one before it.

**Who and where**

- First objective: "Find the Anatomancer". Source: Vigilant.esm:4D4C3D QOBJ 0. **files**
- Target alias TA01 (forced): Anatomancer (forced reference, placed in Anatomancer's Room). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Anatomancer's Room: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 27. Legacy of Belharza (`zzzAoMSubQ03`, Vigilant.esm:51EAC1, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- zzzCHSubQuest13 (Broken Horns) at stage 60 calls Start. Source: QF_zzzCHSubQuest13_0251ADBF.fragment_25 (Vigilant.esm).
- zzzCHSubQuest13 (Broken Horns) at stage 60 calls SetStage 0. Source: QF_zzzCHSubQuest13_0251ADBF.fragment_25 (Vigilant.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Meet the Chief of Minotaurs", shown at stage 10. Source: Vigilant.esm:51EAC1 QOBJ 10. **files**
- Dialogue with Mordog the Man-Bull (named by alias Mntr of zzzAoMSubQ03 (Legacy of Belharza) (unique)), placed in Hidden Minotaur Village, "What do you need of me?": SetStage 5 (when: Legacy of Belharza stage < 5; the speaker is the one in alias Mntr). Reply: "Per Emperor Belharza's will, there is something we want to show you. Will you come with me to our village?" Source: AomSq03_TIF__0251EAD0.Fragment_1 on INFO Vigilant.esm:51EAD0 (Vigilant.esm). **script**
- Dialogue with Mordog the Man-Bull (named by alias Mntr of zzzAoMSubQ03 (Legacy of Belharza) (unique)), placed in Hidden Minotaur Village, "What do you need of me?": SetStage 5 (when: Legacy of Belharza stage < 5; the speaker is the one in alias Mntr). Reply: "Per Emperor Belharza's will, there is something we want to show you. Will you come with me to our village?" Source: AomSq03_TIF__0251EAD0.Fragment_0 on INFO Vigilant.esm:51EAD0 (Vigilant.esm). **script**
- Dialogue with Mordog the Man-Bull (named by alias Mntr of zzzAoMSubQ03 (Legacy of Belharza) (unique)), placed in Hidden Minotaur Village, "All right, let's go.": SetStage 10 (when: Legacy of Belharza stage == 5; the speaker is the one in alias Mntr). Reply: "The Minotaur Village is a hidden place. Close your eyes for a moment, please." Source: AomSq03_TIF__0251EAD3.Fragment_0 on INFO Vigilant.esm:51EAD3 (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to <Alias=Mntr>". Source: Vigilant.esm:51EAC1 QOBJ 1. **files**
- Target alias Mntr (unique): Mordog the Man-Bull (unique actor, placed in Hidden Minotaur Village). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hidden Minotaur Village: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 28. Stendarr Guide (`zzzBMGuide`, Vigilant.esm:43B81F, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- zzzBMMq03 (The Blood Matron) at stage 20 calls SetStage 20. Source: QF_zzzBMMq03_01038526.fragment_2 (Vigilant.esm).
- zzzBMMq02 (Remnants) at stage 80 calls SetStage 10. Source: QF_zzzBMMq02_01038525.fragment_16 (Vigilant.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Trace the elder blood", shown at stage 10. Source: Vigilant.esm:43B81F QOBJ 10. **files**
- zzzBMMq02 (Remnants) at stage 80 calls SetStage 10. Source: QF_zzzBMMq02_01038525.fragment_16 on Vigilant.esm:038525 (Vigilant.esm). **script**

**Who and where**

- First objective: "Trace the blood". Source: Vigilant.esm:43B81F QOBJ 0. **files**
- Target alias GuideThingol (forced): a marker (forced reference, placed in Asylum). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Asylum: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 29. Empty Cells (`zzzBMMq01`, Vigilant.esm:038524, Vigilant.esm)

**Started by**

- zzzAoMMq10 (The Landing) calls at stage 50 Start; at stage 50 SetStage 0. Sources: QF_zzAoMMq10_01011B75.fragment_11 on Vigilant.esm:011B75. **script**
- zzzAoMMqGoodEnd (Art of Mercy) calls at stage 130 Start; at stage 130 SetStage 0. Sources: QF_zzzAoMMqGoodEnd_024D0376.fragment_26 on Vigilant.esm:4D0376. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- zzzBMMq03 (The Blood Matron) at stage 220 calls SetStage 255. Source: QF_zzzBMMq03_01038526.fragment_30 (Vigilant.esm).
- zzzBMMq03 (The Blood Matron) at stage 100 calls SetStage 100. Source: QF_zzzBMMq03_01038526.fragment_28 (Vigilant.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Talk to <Alias=Steward>", shown at stage 10. Source: Vigilant.esm:038524 QOBJ 10. **files**
- Dialogue with someone the line does not name (named by alias Courier of zzzBMMq01 (Empty Cells) (created)), "What do you need our help with?": SetStage 10 (when: the speaker is the one in alias Courier). Reply: "The steward will tell you all the details, I only know the basics. But please treat this matter as confidential." Source: BM01_TIF__01038ABA.Fragment_0 on INFO Vigilant.esm:038ABA (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to the <Alias=Courier>". Source: Vigilant.esm:038524 QOBJ 0. **files**
- Target alias Courier (created): Windhelm Guard (created item). **files**

**Needs**

- Its own conditions: The Landing stage 999 not done; The Landing completed; Empty Cells not completed; GetQuestRunning Empty Cells == 0; the place you enter is Stuhn Ravine; the place you leave is Temple of Stendarr. **files**

**Gives**: 2000 gold (stage 110, QF_zzzBMMq01_01038524.fragment_17).

## 30. Remnants (`zzzBMMq02`, Vigilant.esm:038525, Vigilant.esm)

**Started by**

- zzzBMMq01 (Empty Cells) calls at stage 60 Start; at stage 60 SetStage 0. Sources: QF_zzzBMMq01_01038524.fragment_13 on Vigilant.esm:038524. **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Defeat <Alias=Vamp02>", shown at stage 30. Source: Vigilant.esm:038525 QOBJ 30. **files**
- zzzBMMq02 (Remnants) calls SetStage 20. Source: defaultsetstageondeathrefalias.onDeath on Vigilant.esm:038525 (Vigilant.esm). **script**
- Dialogue with Paulo (named by alias Vamp02 of zzzBMMq02 (Remnants) (unique)), placed in Bloody Well, "Are you a Vigilant? Are you all right?": SetStage 30 (when: the speaker is the one in alias Vamp02). Reply: "You... You're not Gwaji! Who are you? Where is Gwaji? What did you do to him?" Source: BM02_TIF__01039B3D.Fragment_0 on INFO Vigilant.esm:039B3D (Vigilant.esm). **script**

**Who and where**

- First objective: "Defeat <Alias=Vamp01>". Source: Vigilant.esm:038525 QOBJ 10. **files**
- Target alias Vamp01 (unique): Gwaji gro-Agnam (unique actor, placed in Hidden Passage, Old Sewers). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hidden Passage, Old Sewers: 2 doors, 1 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 31. The Blood Matron (`zzzBMMq03`, Vigilant.esm:038526, Vigilant.esm)

**Started by**

- zzzBMMq02 (Remnants) calls at stage 100 Start; at stage 100 SetStage 0. Sources: QF_zzzBMMq02_01038525.fragment_20 on Vigilant.esm:038525. **script**
- Dialogue with Lamae Bal (named by alias LamaeBal of zzzBMMq03 (The Blood Matron) (unique)), placed in Lamae's Dream, "Begone, monster.": SetStage 60 (when: the speaker is the one in alias LamaeBal). Source: BM03_TIF__0103C193.Fragment_0 on INFO Vigilant.esm:03C193 (Vigilant.esm). **script**
- (First objective shown at stage 60; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Free <Alias=LamaeBal> from the curse of Molag Bal", shown at stage 90. Source: Vigilant.esm:038526 QOBJ 90. **files**
- zzzBMMq03 (The Blood Matron) calls SetStage 70. Source: defaultsetstageondeathrefalias.onDeath on Vigilant.esm:038526 (Vigilant.esm). **script**

**Who and where**

- First objective: "Defeat <Alias=LamaeBal>". Source: Vigilant.esm:038526 QOBJ 60. **files**
- Target alias LamaeBal (unique): Lamae Bal (unique actor, placed in Lamae's Dream). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Lamae's Dream: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 32. Memory Guide (`zzzCHMemoryGuide`, Vigilant.esm:42E0B1, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- zzzCHMemoryQuest08 (The Nameless Bard) at stage 999 calls SetStage 80. Source: QF_zzzCHMemoryQuest08_02080E91.fragment_46 (Vigilant.esm).
- zzzCHMemoryQuest09 (Beyond the Shores of Madness) at stage 999 calls SetStage 90. Source: QF_zzzCHMemoryQuest09_022CAE30.fragment_29 (Vigilant.esm).
- zzzCHMemoryQuest04 (Johan the Fool) at stage 999 calls SetStage 40. Source: QF_zzzCHMemoryQuest04_02140225.fragment_25 (Vigilant.esm).
- zzzCHMemoryQuest05 (Adabal) at stage 999 calls SetStage 50. Source: QF_zzzCHMemoryQuest05_0205AE03.fragment_25 (Vigilant.esm).
- zzzCHMemoryQuest06 (Remains of the Miracle) at stage 999 calls SetStage 60. Source: QF_zzzCHMemoryQuest06_0206A23B.fragment_8 (Vigilant.esm).
- zzzCHMemoryQuest02 (The Mad King) at stage 999 calls SetStage 20. Source: QF_zzzCHMemoryQuest02_0213712B.fragment_21 (Vigilant.esm).
- and 3 more in the JSON

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Against the dying of the light", shown at stage 0. Source: Vigilant.esm:42E0B1 QOBJ 110. **files**
- **unread**: nothing outside its own stage fragments sets stage 0 or one before it.

**Who and where**

- First objective: "Like when the dream no longer needs its dreamer". Source: Vigilant.esm:42E0B1 QOBJ 100. **files**
- Target alias DreamPelinal (forced): a marker (forced reference, placed in Barrier Tower of Agea). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 33. The Grand Inquisitor (`zzzCHMemoryQuest01`, Vigilant.esm:12C4F4, Vigilant.esm)

**Started by**

- zzzCHMemoryGuide (Memory Guide) at stage 0 calls SetStage 0. Source: QF_zzzCHMemoryGuide_0242E0B1.fragment_0 on Vigilant.esm:42E0B1 (Vigilant.esm), through zzzCHMemoryGuide (Memory Guide)'s traceon. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Unfulfilled dreams drown in silence". Source: Vigilant.esm:12C4F4 QOBJ 0. **files**
- Target alias Mara (unique): Mary the Dark Maiden (unique actor, placed in Bed of Corruption). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Bed of Corruption: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 34. The Mad King (`zzzCHMemoryQuest02`, Vigilant.esm:13712B, Vigilant.esm)

**Started by**

- zzzCHMemoryGuide (Memory Guide) at stage 0 calls SetStage 0. Source: QF_zzzCHMemoryGuide_0242E0B1.fragment_0 on Vigilant.esm:42E0B1 (Vigilant.esm), through zzzCHMemoryGuide (Memory Guide)'s traceon. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Madness sets with the moons". Source: Vigilant.esm:13712B QOBJ 0. **files**
- Target alias GuideMarker (forced): a marker (forced reference, placed in Malatar Mansion). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Malatar Mansion: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 35. Knight of Hounds (`zzzCHMemoryQuest03`, Vigilant.esm:13965A, Vigilant.esm)

**Started by**

- zzzCHMemoryGuide (Memory Guide) at stage 0 calls SetStage 0. Source: QF_zzzCHMemoryGuide_0242E0B1.fragment_0 on Vigilant.esm:42E0B1 (Vigilant.esm), through zzzCHMemoryGuide (Memory Guide)'s traceon. **script**
- zzzCHBossQuestVarla (named "VS Varla" in its record), a helper quest with Boss, Sub01, Sub02 at stage 0 calls Start; zzzCHBossQuestVarla is started by nothing in the records or scripts (**unread**). Source: QF_zzzCHBossQuestVarla_024F69C2.fragment_0 on Vigilant.esm:4F69C2 (Vigilant.esm). **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Blood is thicker than water". Source: Vigilant.esm:13965A QOBJ 0. **files**
- Target alias EnolaSkull (created): Enola's Skull (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 36. Johan the Fool (`zzzCHMemoryQuest04`, Vigilant.esm:140225, Vigilant.esm)

**Started by**

- zzzCHMemoryGuide (Memory Guide) at stage 0 calls SetStage 0. Source: QF_zzzCHMemoryGuide_0242E0B1.fragment_0 on Vigilant.esm:42E0B1 (Vigilant.esm), through zzzCHMemoryGuide (Memory Guide)'s traceon. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "The dead dream beneath the soil". Source: Vigilant.esm:140225 QOBJ 0. **files**
- Target alias GuideMarker (forced): a marker (forced reference, placed in Chapel of Arkay Cemetery). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Chapel of Arkay Cemetery: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 37. Adabal (`zzzCHMemoryQuest05`, Vigilant.esm:05AE03, Vigilant.esm)

**Started by**

- zzzCHMemoryGuide (Memory Guide) at stage 0 calls SetStage 0. Source: QF_zzzCHMemoryGuide_0242E0B1.fragment_0 on Vigilant.esm:42E0B1 (Vigilant.esm), through zzzCHMemoryGuide (Memory Guide)'s traceon. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Dance on the dead under the moons". Source: Vigilant.esm:05AE03 QOBJ 0. **files**
- Target alias GuideMarker (forced): a marker (forced reference, placed in St. Dulsa's Charnel). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: St. Dulsa's Charnel: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 38. Remains of the Miracle (`zzzCHMemoryQuest06`, Vigilant.esm:06A23B, Vigilant.esm)

**Started by**

- zzzCHMemoryGuide (Memory Guide) at stage 0 calls SetStage 0. Source: QF_zzzCHMemoryGuide_0242E0B1.fragment_0 on Vigilant.esm:42E0B1 (Vigilant.esm), through zzzCHMemoryGuide (Memory Guide)'s traceon. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "A priest laughs in the broken Tower". Source: Vigilant.esm:06A23B QOBJ 0. **files**
- Target alias GuideMarker (forced): a marker (forced reference, placed in Abyss of Molag Bal). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 39. Temptation of Marukh (`zzzCHMemoryQuest07`, Vigilant.esm:06F53C, Vigilant.esm)

**Started by**

- zzzCHMemoryGuide (Memory Guide) at stage 0 calls SetStage 0. Source: QF_zzzCHMemoryGuide_0242E0B1.fragment_0 on Vigilant.esm:42E0B1 (Vigilant.esm), through zzzCHMemoryGuide (Memory Guide)'s traceon. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Where does the man-ape sleep?". Source: Vigilant.esm:06F53C QOBJ 0. **files**
- Target alias GuideKey (forced): a marker (forced reference, placed in Golden Sanctuary). **files**
- Target alias GuideMarker01 (forced): a marker (forced reference, placed in Malada Abasel). **files**
- Target alias GuideMarker02 (forced): a marker (forced reference, placed in Abyss of Molag Bal). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Golden Sanctuary: 1 door, 0 locked; Malada Abasel: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 40. The Nameless Bard (`zzzCHMemoryQuest08`, Vigilant.esm:080E91, Vigilant.esm)

**Started by**

- zzzCHMemoryGuide (Memory Guide) at stage 0 calls SetStage 0. Source: QF_zzzCHMemoryGuide_0242E0B1.fragment_0 on Vigilant.esm:42E0B1 (Vigilant.esm), through zzzCHMemoryGuide (Memory Guide)'s traceon. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- zzzCHMemoryQuest09 (Beyond the Shores of Madness) at stage 10 calls SetStage 25. Source: QF_zzzCHMemoryQuest09_022CAE30.fragment_2 (Vigilant.esm).
- zzzCHMemoryQuest09 (Beyond the Shores of Madness) at stage 200 calls SetStage 300. Source: QF_zzzCHMemoryQuest09_022CAE30.fragment_19 (Vigilant.esm).

**Who and where**

- First objective: "The rolling Stone dwells in the fire, waiting to be picked up". Source: Vigilant.esm:080E91 QOBJ 0. **files**
- Target alias GuideTower (forced): a marker (forced reference, placed in Sancremor Angasel). **files**
- Target alias GuideStatue (forced): a marker (forced reference, placed in Aetherius). **files**
- Target alias GuideBard (forced): a marker (forced reference, placed in Abyss of Molag Bal). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Sancremor Angasel: 2 doors, 1 locked; Aetherius: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 41. Beyond the Shores of Madness (`zzzCHMemoryQuest09`, Vigilant.esm:2CAE30, Vigilant.esm)

**Started by**

- zzzCHMemoryGuide (Memory Guide) at stage 0 calls SetStage 0. Source: QF_zzzCHMemoryGuide_0242E0B1.fragment_0 on Vigilant.esm:42E0B1 (Vigilant.esm), through zzzCHMemoryGuide (Memory Guide)'s traceon. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Ah, fetus, alas, fetus...". Source: Vigilant.esm:2CAE30 QOBJ 0. **files**
- Target alias GuideMarker (forced): a marker (forced reference, placed in Elder Field). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 42. Maggot (`zzzCHqSAExile`, Vigilant.esm:4EC7F3, Vigilant.esm)

**Started by**

- Dialogue with Sacred Anatomancer, placed in Old Well, "Fine. I, <Alias=Player>, swear this by the multiples of three. I shall henceforth renounce this name.": Start (when: the speaker is Sacred Anatomancer). Source: AoMgdSA_TIF__024EC7F2.Fragment_0 on INFO Vigilant.esm:4EC7F2 (Vigilant.esm). **script**
- Dialogue with Sacred Anatomancer, placed in Old Well, "Fine. I, <Alias=Player>, swear this by the multiples of three. I shall henceforth renounce this name.": SetStage 0 (when: the speaker is Sacred Anatomancer). Source: AoMgdSA_TIF__024EC7F2.Fragment_0 on INFO Vigilant.esm:4EC7F2 (Vigilant.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "<Alias=Victim01> has been dazzled by the Radiance of Life", shown at stage 10. Source: Vigilant.esm:4EC7F3 QOBJ 1. **files**
- **unread**: nothing outside its own stage fragments sets stage 10 or one before it.

**Who and where**

- First objective: "Take back your name from <Alias=Owner> in <Alias=TargetLocation>". Source: Vigilant.esm:4EC7F3 QOBJ 0. **files**
- Target alias Identity (created): Radiance of Life (created item). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 43. Feral Soul-Shriven (`zzzCHrqSoulShriven`, Vigilant.esm:51532C, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 1; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Defeat <Alias=Enemy>". Source: Vigilant.esm:51532C QOBJ 0. **files**
- Target alias Enemy (run time): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 44. Broken Horns (`zzzCHSubQuest13`, Vigilant.esm:51ADBF, Vigilant.esm)

**Started by**

- zzzCHMemoryQuest13 (named "Paravania the Man-Bull" in its record), a helper quest with Paravania at stage 30 calls SetStage 10; zzzCHMemoryQuest13 is started by zzzCHSubQuest13 (Broken Horns) at stage 5 (Start); zzzCHSubQuest13 (Broken Horns) at stage 5 (SetStage 0). Source: QF_zzzCHMemoryQuest13_0251C038.fragment_7 on Vigilant.esm:51C038 (Vigilant.esm). **script**
- zzzCHMemoryGuide (Memory Guide) at stage 0 calls SetStage 0. Source: QF_zzzCHMemoryGuide_0242E0B1.fragment_0 on Vigilant.esm:42E0B1 (Vigilant.esm), through zzzCHMemoryGuide (Memory Guide)'s traceon. **script**
- zzzCHBossQuestMorihaus (named "VS Morihaus" in its record), a helper quest with Boss at stage 10 calls SetStage 2; zzzCHBossQuestMorihaus is started by nothing in the records or scripts (**unread**). Source: QF_zzzCHBossQuestMorihaus_024F69B7.fragment_4 on Vigilant.esm:4F69B7 (Vigilant.esm). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Broken horns, sky incarnate". Source: Vigilant.esm:51ADBF QOBJ 0. **files**
- Target alias BelharzaMan (unique): Emperor Belharza (unique actor, placed in Fort Welkynd). **files**
- Target alias Morihaus (unique): Morihaus (unique actor, placed in Barrier Tower of Bala). **files**
- Target alias MarkerMem (forced): a marker (forced reference, placed in Inquisition Court District). **files**
- Target alias MarkerQuiz (forced): a marker (forced reference, placed in First Inquisition Court). **files**
- Target alias MarkerES (forced): a marker (forced reference, placed in Concealed Charnel of Belharza, Belharza's Hidden Charnel). **files**
- Target alias BelharzaBull (unique): Belharza the Bull (unique actor, placed in ???). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Fort Welkynd: 3 doors, 0 locked; First Inquisition Court: 6 doors, 0 locked; Concealed Charnel of Belharza, Belharza's Hidden Charnel: 2 doors, 0 locked; ???: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 45. Stendarr Guide (`zzzCOGuide`, Vigilant.esm:43CBAE, Vigilant.esm)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- zzzCOMq01 (Child of Oblivion) at stage 60 calls SetStage 70. Source: QF_zzzCOMq01_01065932.fragment_13 (Vigilant.esm).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Break the Blood Curse of Corruption", shown at stage 20. Source: Vigilant.esm:43CBAE QOBJ 20. **files**
- **unread**: nothing outside its own stage fragments sets stage 20 or one before it.

**Who and where**

- First objective: "Break the Blood Curse of Shivers". Source: Vigilant.esm:43CBAE QOBJ 10. **files**
- Target alias GuideCurse01 (forced): a marker (forced reference, placed in Blood Curse of Shivers). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Blood Curse of Shivers: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 46. Child of Oblivion (`zzzCOMq01`, Vigilant.esm:065932, Vigilant.esm)

**Started by**

- zzzBMMq01 (Empty Cells) calls at stage 110 Start; at stage 110 SetStage 0. Sources: QF_zzzBMMq01_01038524.fragment_17 on Vigilant.esm:038524. **script**
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Travel to the Bruiant Mansion", shown at stage 20. Source: Vigilant.esm:065932 QOBJ 20. **files**
- Dialogue with Gwyneth (named by alias Librarian of zzzCOMq01 (Child of Oblivion) (unique)), placed in Temple of Stendarr, "I'll go ahead to check. If I'm not back within a week, send some Vigilants after me.": SetStage 20 (when: Child of Oblivion stage == 10; the speaker is the one in alias Librarian). Reply: "All right. Please, be careful. I will prepare a carriage in front of the temple to take you to the mansion." Source: CO_TIF__010669F0.Fragment_0 on INFO Vigilant.esm:0669F0 (Vigilant.esm). **script**
- Dialogue with Gwyneth (named by alias Librarian of zzzCOMq01 (Child of Oblivion) (unique)), placed in Temple of Stendarr, "Do you think something went wrong with his mission?": SetStage 10 (when: the speaker is the one in alias Librarian). Reply: "The civil war must have delayed this letter... It's several months old now..." Source: CO_TIF__0106C21F.Fragment_0 on INFO Vigilant.esm:06C21F (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Gwyneth". Source: Vigilant.esm:065932 QOBJ 0. **files**
- Target alias Librarian (unique): Gwyneth (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Its own conditions: Empty Cells stage 255 not done; Empty Cells completed; Child of Oblivion not completed; GetQuestRunning Child of Oblivion == 0; the place you enter is Stuhn Ravine; the place you leave is Temple of Stendarr. **files**
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 47. Successor (`zzzCOSubQ01`, Vigilant.esm:324E7E, Vigilant.esm)

**Started by**

- zzzCOMq01 (Child of Oblivion) calls at stage 200 Start; at stage 200 SetStage 0. Sources: QF_zzzCOMq01_01065932.fragment_14 on Vigilant.esm:065932. **script**
- (First objective shown at stage 20; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Investigate the Keeper's whereabouts", shown at stage 30. Source: Vigilant.esm:324E7E QOBJ 30. **files**
- Dialogue with Gwyneth (named by alias Libra of zzzCOSubQ01 (Successor) (unique)), placed in Temple of Stendarr, "Yes, I prayed enough. Remind me about my mission, please.": SetStage 30 (when: the speaker is the one in alias Libra). Reply: "The Keeper of this temple went to the Bruiant mansion and still hasn't returned. I want you to find out what happened." Source: COSq01_TIF__023288F1.Fragment_0 on INFO Vigilant.esm:3288F1 (Vigilant.esm). **script**

**Who and where**

- First objective: "Talk to Gwyneth". Source: Vigilant.esm:324E7E QOBJ 20. **files**
- Target alias Libra (unique): Gwyneth (unique actor, placed in Temple of Stendarr). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Stendarr: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | The reader found no way into Vigilant from it. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | The reader found no way into Vigilant from it. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | The reader found no way into Vigilant from it. |

## Routes into the first quest from outside the starts

## The payoff

- **Dragonslayer** (completes at 200): nothing is given on its completing stages.
- **Paarthurnax** (completes at 99, 100): nothing is given on its completing stages.

## Three questions

**Is Skyrim.esm:0242BA MQ105, and is stage 160 the one that completes it?** Yes: Skyrim.esm:0242BA is MQ105 (The Way of the Voice), and stage 160 is its only completing stage.

**Who starts The Horn of Jurgen Windcaller, and where?** None:

**Does Dragonborn's cultist node read Timing is Everything's level (25 in its settings.ini), or something else?** Timing is Everything's setting iTIE_MinimumLevel:Dragonborn = 25 (settings.ini in Timing is Everything SE - Settings Loader).

- Node DLC2CultistAmbushNode001 (LoreRim - Global Modifiers.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 1 (now 1); fn359 == 0; The Way of the Voice stage >= 160; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode002 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 2 (now 1); fn359 == 0; The Horn of Jurgen Windcaller stage >= 60; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode003 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 3 (now 1); fn359 == 0; A Blade in the Dark stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode004 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 4 (now 1); fn359 == 0; Alduin's Wall stage >= 280; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode005 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 5 (now 1); fn359 == 0; The Throat of the World stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode006 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 6 (now 1); fn359 == 0; Elder Knowledge stage >= 100; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode007 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 7 (now 1); fn359 == 0; Alduin's Bane stage >= 220; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode008 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 8 (now 1); fn359 == 0; Dragonslayer stage >= 200; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**
- Node DLC2CultistAmbushNode000 (TimingIsEverything.esp), event change location: level >= DLC2CultistAttackMinLevel_KRY (now 25); global DLC2QuestStartSelection_KRY == 0 (now 1); fn359 == 0; Dragon Rising stage >= 90; Dragonborn stage < 5; Cultists vs Player stage 1 not done; GetRandomPercent < DLC2WE09Chance (now 0).
  - DLC2CultistAttackMinLevel_KRY: record 25.0 (TimingIsEverything.esp); TimingIsEverything iTIE_MinimumLevel:Dragonborn = 25 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **files**
  - DLC2QuestStartSelection_KRY: record 1.0 (TimingIsEverything.esp); TimingIsEverything iStartingQuest:Dragonborn = 1 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it; TimingIsEverything iStartingQuestRandomID:Dragonborn = 0 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **conflict**
  - DLC2WE09Chance: record 0.0 (LoreRim - Global Modifiers.esp, was 100.0 in Dragonborn.esm); in play: DLC2_QF_DLC2WE09_020331C0.fragment_5 sets it to 5; DLC2_QF_DLC2CultistAmbush_0203546D.fragment_0 sets it to 5; EE_MCMScript.OnOptionSliderAccept sets it to a value it works out; TimingIsEverything iTIE_CultistAttackChance:Dragonborn = 5 in settings.ini in Timing is Everything SE - Settings Loader, but the winning TIE_MCMScript (C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex, extends SKI_ConfigBase) doesn't read it. **run time**

## Run-time values

Settings loaders the story's globals touch, and whether the script the game runs reads their settings.ini:

- TimingIsEverything: script TIE_MCMScript on TimingIsEverything.esp:005E3B; the copy that wins is C:/LoreRim\mods\[LoreRim] - SPID Files and Script Overwrites\scripts\tie_mcmscript.pex (extends SKI_ConfigBase); it carries no settings.ini value into a global, so the globals keep their record values unless the player changes them in the menu.
- Wyrmstooth: script WT_MCMScript on Wyrmstooth.esp:AC1487; the copy that wins is C:/LoreRim\mods\Wyrmstooth - Settings Loader\Scripts\WT_MCMScript.pex (extends MCM_ConfigBase); it reads its MCM Helper settings and sets globals from them.

- Timing is Everything: Dragonborn level setting 25 (settings.ini in Timing is Everything SE - Settings Loader), meant for DLC2CultistAttackMinLevel_KRY (record 25.0 from TimingIsEverything.esp; in game 25.0; **files**).
- Wyrmstooth: WTStartLevel is 10 in a new game (record 20.0 in Requiem - Wyrmstooth.esp). Why: OnConfigInit runs once when the menu registers in a new game; it sets `migrated` and calls LoadSettings, which goes on only while bEnabled:Maintenance is set (it is 1) and then calls Load, which reads iWTGeneralRequirementsMinimalLevel:Requirements (10, settings.ini in Wyrmstooth - Settings Loader) and sets WTStartLevel to it; MigrateToMCMHelper, which would copy the global's record value (20.0) into that setting, runs only from OnGameReload or OnConfigOpen while `migrated` is false, and OnConfigInit has already set it, so a new game never migrates (an older save made before the loader would); OnGameReload reloads the settings only when bLoadSettingsonReload:Maintenance is set; it is 0, so later loads keep whatever the global holds. Source: WT_MCMScript (C:/LoreRim\mods\Wyrmstooth - Settings Loader\Scripts\WT_MCMScript.pex). **run time**

Scripts the records name that aren't in the install (30); calls inside them can't be read. Full list in the JSON.

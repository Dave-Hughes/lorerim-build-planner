# Start check: The Gift of Saturalia (`the-gift-of-saturalia`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Windhelm By The Sea (`Sat_Adoption`, TheGiftofSaturalia.esp:000963, TheGiftofSaturalia.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls SetStage 10. Source: Sat_Adoption_Finish.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).
- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls Start. Source: Sat_StartAdoption.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Niklas", shown at stage 5. Source: TheGiftofSaturalia.esp:000963 QOBJ 5. **files**
- Dialogue with Captain Lonely-Gale (named by alias CaptainLonelyGale of Sat_Adoption (Windhelm By The Sea) (unique)), placed in Palace of the Kings, "It might do you good... And those children need all the help they can get.": SetStage 5 (when: the speaker is the one in alias CaptainLonelyGale). Reply: "I never thought about it, but you're probably right. Thank you." Source: Sat_Adoption_5.Fragment_0 on INFO TheGiftofSaturalia.esp:000970 (TheGiftofSaturalia.esp). **script**

**Who and where**

- First objective: "Speak to Captain Lonely-Gale". Source: TheGiftofSaturalia.esp:000963 QOBJ 0. **files**
- Target alias CaptainLonelyGale (unique): Captain Lonely-Gale (unique actor, placed in Palace of the Kings). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Palace of the Kings: 5 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 2. Lending a Paw (`Sat_Dog`, TheGiftofSaturalia.esp:0009A4, TheGiftofSaturalia.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls SetStage 10. Source: Sat_Dog_Stage10.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).
- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls Start. Source: Sat_DogStart.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to Niklas", shown at stage 5. Source: TheGiftofSaturalia.esp:0009A4 QOBJ 5. **files**
- Dialogue with Olava the Feeble, placed in Olava the Feeble's House, Olava the Feebles House, "So can you take care of him?": SetStage 5 (when: Lending a Paw hasn't started; the speaker is Olava the Feeble). Reply: "Hmm... Uh, I... Yes, yes I surely can. I... I get so lonely out here." Source: Sat_Dog_Stage5.Fragment_0 on INFO TheGiftofSaturalia.esp:0009B7 (TheGiftofSaturalia.esp). **script**

**Who and where**

- First objective: "Bring Santus to Olava the Feeble". Source: TheGiftofSaturalia.esp:0009A4 QOBJ 0. **files**
- Target alias Olava (forced): Olava the Feeble (forced reference, placed in Olava the Feeble's House, Olava the Feebles House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Olava the Feeble's House, Olava the Feebles House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 3. The Joy of Dawnstar (`Sat_Laugh`, TheGiftofSaturalia.esp:0008D3, TheGiftofSaturalia.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls SetStage 8. Source: Sat_LaughEnd2.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).
- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls SetStage 8. Source: Sat_LaughEnd1.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).
- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls Start. Source: Sat_LaughStart.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Make 7 people laugh in Dawnstar (2/7)", shown at stage 1. Source: TheGiftofSaturalia.esp:0008D3 QOBJ 1. **files**
- **unread**: nothing outside its own stage fragments sets stage 1 or one before it.

**Who and where**

- First objective: "Make 7 people laugh in Dawnstar (1/7)". Source: TheGiftofSaturalia.esp:0008D3 QOBJ 0. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 4. A Song in the Dark (`Sat_Music`, TheGiftofSaturalia.esp:0009D2, TheGiftofSaturalia.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls SetStage 30. Source: Sat_FinishLaugh2.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).
- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls Start. Source: Sat_MusicStart.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Speak to Viarmo", shown at stage 10. Source: TheGiftofSaturalia.esp:0009D2 QOBJ 10. **files**
- Dialogue with Diane (named by alias Diane of Sat_Music (A Song in the Dark) (forced)), placed in Solitude, "Do you enjoy listening to the bards play?": SetStage 5 (when: A Song in the Dark hasn't started; the speaker is the one in alias Diane). Reply: "That I do. To tell you the truth, I've always dreamt of joining them." Source: Sat_ListenToDianeSpeak.Fragment_1 on INFO TheGiftofSaturalia.esp:0009E0 (TheGiftofSaturalia.esp). **script**
- Dialogue with Diane (named by alias Diane of Sat_Music (A Song in the Dark) (forced)), placed in Solitude, "Do you need help finding your way to the tailor?": SetStage 10 (when: the speaker is the one in alias Diane). Reply: "Oh, no need. I've lived in Solitude all my life. I know every nook and cranny of this city. Thanks, though." Source: Sat_WayToTaylorSwift.Fragment_0 on INFO TheGiftofSaturalia.esp:0009EA (TheGiftofSaturalia.esp). **script**

**Who and where**

- First objective: "Speak to Diane the Blind in Solitude". Source: TheGiftofSaturalia.esp:0009D2 QOBJ 0. **files**
- Target alias Diane (forced): Diane (forced reference, placed in Solitude). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Solitude: 14 doors, 11 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 5. Three Wise Men (`Sat_Orphanage`, TheGiftofSaturalia.esp:0008AA, TheGiftofSaturalia.esp)

**Started by**

- **unread**: no starter in its records or scripts
- (First objective shown at stage 0; a call to a later stage advances the quest instead.)

**Caught up by** (a later quest setting this one's stage, as the game does when you skip ahead)

- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls SetStage 20. Source: Sat_FinishOrphanage2.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).
- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls SetStage 20. Source: Sat_FinishOrphanage1.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).
- Sat_TheGiftofSaturalia (The Gift of Saturalia) calls Start. Source: Sat_OrphanageStart.Fragment_0 (TheGiftOfSaturalia_CC_Patch.esp).

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Get food from Talen-Jei", shown at stage 5. Source: TheGiftofSaturalia.esp:0008AA QOBJ 5. **files**
- Dialogue with Bersi Honey-Hand, placed in Pawned Prawn, The Pawned Prawn, "I was wondering if you could help with some toys from your shop? (Persuade)": SetStage 5 (when: the speaker is Bersi Honey-Hand; Three Wise Men hasn't started; GetActorValue >= 25; Taking Care of Business not completed). Reply: "Ahh... It's all for a good cause. Here, it's all I can spare." Source: Sat_PersuadeBersi.Fragment_1 on INFO TheGiftofSaturalia.esp:0008AF (TheGiftofSaturalia.esp). **script**
- Dialogue with Bersi Honey-Hand, placed in Pawned Prawn, The Pawned Prawn, "I wish to purchase all the toys you have in your store. (500 Gold)": SetStage 5 (when: the player has at least 500 gold; Three Wise Men hasn't started; the speaker is Bersi Honey-Hand). Reply: "That's a brave offer. As you wish. Here you go." Source: Sat_Bersi_PayUp.Fragment_0 on INFO TheGiftofSaturalia.esp:0008B2 (TheGiftofSaturalia.esp). **script**

**Who and where**

- First objective: "Get toys from Bersi Honey-Hand in Riften". Source: TheGiftofSaturalia.esp:0008AA QOBJ 0. **files**
- Target alias Bersi (unique): Bersi Honey-Hand (unique actor, placed in Pawned Prawn, The Pawned Prawn). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Pawned Prawn, The Pawned Prawn: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 6. The Gift of Saturalia (`Sat_TheGiftofSaturalia`, TheGiftofSaturalia.esp:000D61, TheGiftOfSaturalia_CC_Patch.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Niklas of Sat_TheGiftofSaturalia (The Gift of Saturalia) (forced)), "I'm here to celebrate Saturalia.": SetStage 5 (when: the speaker is the one in alias Niklas; The Gift of Saturalia hasn't started). Source: Sat_SetStage5_1.Fragment_0 on INFO TheGiftofSaturalia.esp:000819 (TheGiftofSaturalia.esp). **script**
- Dialogue with someone the line does not name (named by alias Niklas of Sat_TheGiftofSaturalia (The Gift of Saturalia) (forced)), "Sure. Count me in.": SetStage 5 (when: the speaker is the one in alias Niklas). Source: Sat_SetStage5_2.Fragment_0 on INFO TheGiftofSaturalia.esp:00081A (TheGiftofSaturalia.esp). **script**
- Start-game flag: the quest runs from the start of the game. Source: TheGiftofSaturalia.esp:000D61 DNAM (TheGiftOfSaturalia_CC_Patch.esp). **files**
- (First objective shown at stage 5; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Help Niklas with his Saturalia gifts". Source: TheGiftofSaturalia.esp:000D61 QOBJ 5. **files**
- Its first objective names no target alias.

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | To get into The Gift of Saturalia: The Gift of Saturalia is running from the start: Help Niklas with his Saturalia gifts. |

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

Scripts the records name that aren't in the install (259); calls inside them can't be read. Full list in the JSON.

# Start check: Bounties and favours for the jarls (`jarls-bounties`)

Written by `scripts/gamedata/story_check.py` from the records, the winning compiled scripts and the settings loaders in the Ultra profile. Verdicts: **files** a record decides it; **script** a script decides it, read; **run time** a settings loader or script sets it at load; **conflict** two sources disagree; **unread** named. Conditions read as the game reads them: "or" joins OR'd conditions, ";" separates what is all needed.

## 1. Bounty: Bandit Boss (`BQ01Eastmarch`, Favor Quests Seperated.esp:000E42, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ01Eastmarch (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward). Source: TIF__00095123.Fragment_0 on INFO Favor Quests Seperated.esp:000E61 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ01Eastmarch (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA96.Fragment_0 on INFO Favor Quests Seperated.esp:000E62 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E42 QOBJ 100. **files**
- BQ01Eastmarch (Bounty: Bandit Boss) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E42 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E42 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 2. Bounty: Bandit Boss (`BQ01Falkreath`, Favor Quests Seperated.esp:000E36, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ01Falkreath (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward). Source: TIF__00095123.Fragment_0 on INFO Favor Quests Seperated.esp:000E5B (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ01Falkreath (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA96.Fragment_0 on INFO Favor Quests Seperated.esp:000E5C (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E36 QOBJ 100. **files**
- BQ01Falkreath (Bounty: Bandit Boss) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E36 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E36 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 3. Bounty: Bandit Boss (`BQ01Haafingar`, Favor Quests Seperated.esp:000E1E, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ01Haafingar (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward). Source: TIF__00095123.Fragment_0 on INFO Favor Quests Seperated.esp:000E4F (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ01Haafingar (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA96.Fragment_0 on INFO Favor Quests Seperated.esp:000E50 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E1E QOBJ 100. **files**
- BQ01Haafingar (Bounty: Bandit Boss) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E1E (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E1E QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 4. Bounty: Bandit Boss (`BQ01Hjaalmarch`, Favor Quests Seperated.esp:000E24, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ01Hjaalmarch (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward). Source: TIF__00095123.Fragment_0 on INFO Favor Quests Seperated.esp:000E52 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ01Hjaalmarch (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA96.Fragment_0 on INFO Favor Quests Seperated.esp:000E53 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E24 QOBJ 100. **files**
- BQ01Hjaalmarch (Bounty: Bandit Boss) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E24 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E24 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 5. Bounty: Bandit Boss (`BQ01Pale`, Favor Quests Seperated.esp:000E30, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ01Pale (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward). Source: TIF__00095123.Fragment_0 on INFO Favor Quests Seperated.esp:000E58 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ01Pale (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA96.Fragment_0 on INFO Favor Quests Seperated.esp:000E59 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E30 QOBJ 100. **files**
- BQ01Pale (Bounty: Bandit Boss) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E30 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E30 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 6. Bounty: Bandit Boss (`BQ01Reach`, Favor Quests Seperated.esp:000E4E, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ01Reach (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward). Source: TIF__00095123.Fragment_0 on INFO Favor Quests Seperated.esp:000E67 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ01Reach (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA96.Fragment_0 on INFO Favor Quests Seperated.esp:000E68 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E4E QOBJ 100. **files**
- BQ01Reach (Bounty: Bandit Boss) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E4E (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E4E QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 7. Bounty: Bandit Boss (`BQ01Rift`, Favor Quests Seperated.esp:000E48, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ01Rift (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward). Source: TIF__00095123.Fragment_0 on INFO Favor Quests Seperated.esp:000E64 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ01Rift (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA96.Fragment_0 on INFO Favor Quests Seperated.esp:000E65 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E48 QOBJ 100. **files**
- BQ01Rift (Bounty: Bandit Boss) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E48 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E48 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 8. Bounty: Bandit Boss (`BQ01Whiterun`, Favor Quests Seperated.esp:000E2A, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ01Whiterun (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward). Source: TIF__00095123.Fragment_0 on INFO Favor Quests Seperated.esp:000E55 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ01Whiterun (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA96.Fragment_0 on INFO Favor Quests Seperated.esp:000E56 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E2A QOBJ 100. **files**
- BQ01Whiterun (Bounty: Bandit Boss) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E2A (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E2A QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 9. Bounty: Bandit Boss (`BQ01Winterhold`, Favor Quests Seperated.esp:000E3C, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ01Winterhold (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward). Source: TIF__00095123.Fragment_0 on INFO Favor Quests Seperated.esp:000E5E (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ01Winterhold (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA96.Fragment_0 on INFO Favor Quests Seperated.esp:000E5F (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E3C QOBJ 100. **files**
- BQ01Winterhold (Bounty: Bandit Boss) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E3C (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E3C QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 10. Bounty: Warlock (`BQ02Eastmarch`, Favor Quests Seperated.esp:000E90, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ02Eastmarch (Bounty: Warlock) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Warlock stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD752.Fragment_1 on INFO Favor Quests Seperated.esp:000EAE (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ02Eastmarch (Bounty: Warlock) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Warlock stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA94.Fragment_0 on INFO Favor Quests Seperated.esp:000EAF (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect the bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E90 QOBJ 100. **files**
- BQ02Eastmarch (Bounty: Warlock) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E90 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the leader of <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E90 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 15. **files**

**Gives**: nothing on its completing stages.

## 11. Bounty: Warlock (`BQ02Falkreath`, Favor Quests Seperated.esp:000E86, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ02Falkreath (Bounty: Warlock) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Warlock stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD752.Fragment_1 on INFO Favor Quests Seperated.esp:000EA8 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ02Falkreath (Bounty: Warlock) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Warlock stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA94.Fragment_0 on INFO Favor Quests Seperated.esp:000EA9 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect the bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E86 QOBJ 100. **files**
- BQ02Falkreath (Bounty: Warlock) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E86 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the leader of <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E86 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 15. **files**

**Gives**: nothing on its completing stages.

## 12. Bounty: Beast (`BQ02Haafingar`, Favor Quests Seperated.esp:000E72, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ02Haafingar (Bounty: Beast) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Beast stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD752.Fragment_1 on INFO Favor Quests Seperated.esp:000E9C (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ02Haafingar (Bounty: Beast) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Beast stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA94.Fragment_0 on INFO Favor Quests Seperated.esp:000E9D (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect the bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E72 QOBJ 100. **files**
- BQ02Haafingar (Bounty: Beast) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E72 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the beast at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E72 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 13. Bounty: Draugr (`BQ02Hjaalmarch`, Favor Quests Seperated.esp:000E77, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ02Hjaalmarch (Bounty: Draugr) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Draugr stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD752.Fragment_1 on INFO Favor Quests Seperated.esp:000E9F (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ02Hjaalmarch (Bounty: Draugr) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Draugr stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA94.Fragment_0 on INFO Favor Quests Seperated.esp:000EA0 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect the bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E77 QOBJ 100. **files**
- BQ02Hjaalmarch (Bounty: Draugr) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E77 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the draugr at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E77 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 15. **files**

**Gives**: nothing on its completing stages.

## 14. Bounty: Draugr (`BQ02Pale`, Favor Quests Seperated.esp:000E81, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ02Pale (Bounty: Draugr) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Draugr stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD752.Fragment_1 on INFO Favor Quests Seperated.esp:000EA5 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ02Pale (Bounty: Draugr) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Draugr stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA94.Fragment_0 on INFO Favor Quests Seperated.esp:000EA6 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect the bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E81 QOBJ 100. **files**
- BQ02Pale (Bounty: Draugr) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E81 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the draugr at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E81 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 15. **files**

**Gives**: nothing on its completing stages.

## 15. Bounty: Forsworn (`BQ02Reach`, Favor Quests Seperated.esp:000E9A, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ02Reach (Bounty: Forsworn) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Forsworn stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD752.Fragment_1 on INFO Favor Quests Seperated.esp:000EB4 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ02Reach (Bounty: Forsworn) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Forsworn stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA94.Fragment_0 on INFO Favor Quests Seperated.esp:000EB5 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect the bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E9A QOBJ 100. **files**
- BQ02Reach (Bounty: Forsworn) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E9A (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the leader of <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E9A QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 16. Bounty: Beast (`BQ02Rift`, Favor Quests Seperated.esp:000E95, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ02Rift (Bounty: Beast) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Beast stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD752.Fragment_1 on INFO Favor Quests Seperated.esp:000EB1 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ02Rift (Bounty: Beast) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Beast stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA94.Fragment_0 on INFO Favor Quests Seperated.esp:000EB2 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect the bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E95 QOBJ 100. **files**
- BQ02Rift (Bounty: Beast) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E95 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the beast at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E95 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 17. Bounty: Beast (`BQ02Whiterun`, Favor Quests Seperated.esp:000E7C, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ02Whiterun (Bounty: Beast) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Beast stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD752.Fragment_1 on INFO Favor Quests Seperated.esp:000EA2 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ02Whiterun (Bounty: Beast) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Beast stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA94.Fragment_0 on INFO Favor Quests Seperated.esp:000EA3 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect the bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E7C QOBJ 100. **files**
- BQ02Whiterun (Bounty: Beast) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E7C (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the beast at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E7C QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 18. Bounty: Draugr (`BQ02Winterhold`, Favor Quests Seperated.esp:000E8B, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ02Winterhold (Bounty: Draugr) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Draugr stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD752.Fragment_1 on INFO Favor Quests Seperated.esp:000EAB (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ02Winterhold (Bounty: Draugr) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Draugr stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA94.Fragment_0 on INFO Favor Quests Seperated.esp:000EAC (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect the bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000E8B QOBJ 100. **files**
- BQ02Winterhold (Bounty: Draugr) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000E8B (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the draugr at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000E8B QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 15. **files**

**Gives**: nothing on its completing stages.

## 19. Bounty: Giant (`BQ03Eastmarch`, Favor Quests Seperated.esp:000ED3, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ03Eastmarch (Bounty: Giant) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Giant stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD734.Fragment_0 on INFO Favor Quests Seperated.esp:000EF3 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ03Eastmarch (Bounty: Giant) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Giant stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA92.Fragment_0 on INFO Favor Quests Seperated.esp:000EF4 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000ED3 QOBJ 100. **files**
- BQ03Eastmarch (Bounty: Giant) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000ED3 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the giant located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000ED3 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 20. **files**

**Gives**: nothing on its completing stages.

## 20. Bounty: Spriggan (`BQ03Falkreath`, Favor Quests Seperated.esp:000EC9, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ03Falkreath (Bounty: Spriggan) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Spriggan stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD734.Fragment_0 on INFO Favor Quests Seperated.esp:000EED (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ03Falkreath (Bounty: Spriggan) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Spriggan stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA92.Fragment_0 on INFO Favor Quests Seperated.esp:000EEE (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000EC9 QOBJ 100. **files**
- BQ03Falkreath (Bounty: Spriggan) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000EC9 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the spriggan located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000EC9 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 20. **files**

**Gives**: nothing on its completing stages.

## 21. Bounty: Vampire (`BQ03Haafingar`, Favor Quests Seperated.esp:000EE2, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ03Haafingar (Bounty: Vampire) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Vampire stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD734.Fragment_0 on INFO Favor Quests Seperated.esp:000EFC (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ03Haafingar (Bounty: Vampire) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Vampire stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA92.Fragment_0 on INFO Favor Quests Seperated.esp:000EFD (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000EE2 QOBJ 100. **files**
- BQ03Haafingar (Bounty: Vampire) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000EE2 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the vampire located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000EE2 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 30. **files**

**Gives**: nothing on its completing stages.

## 22. Bounty: Beast (`BQ03Hjaalmarch`, Favor Quests Seperated.esp:000EBA, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ03Hjaalmarch (Bounty: Beast) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Beast stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD734.Fragment_0 on INFO Favor Quests Seperated.esp:000EE4 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ03Hjaalmarch (Bounty: Beast) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Beast stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA92.Fragment_0 on INFO Favor Quests Seperated.esp:000EE5 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000EBA QOBJ 100. **files**
- BQ03Hjaalmarch (Bounty: Beast) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000EBA (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the beast at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000EBA QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 23. Bounty: Giant (`BQ03Pale`, Favor Quests Seperated.esp:000EC4, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ03Pale (Bounty: Giant) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Giant stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD734.Fragment_0 on INFO Favor Quests Seperated.esp:000EEA (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ03Pale (Bounty: Giant) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Giant stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA92.Fragment_0 on INFO Favor Quests Seperated.esp:000EEB (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000EC4 QOBJ 100. **files**
- BQ03Pale (Bounty: Giant) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000EC4 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the giant located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000EC4 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 20. **files**

**Gives**: nothing on its completing stages.

## 24. Bounty: Hagraven (`BQ03Reach`, Favor Quests Seperated.esp:000EDD, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ03Reach (Bounty: Hagraven) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Hagraven stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD734.Fragment_0 on INFO Favor Quests Seperated.esp:000EF9 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ03Reach (Bounty: Hagraven) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Hagraven stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA92.Fragment_0 on INFO Favor Quests Seperated.esp:000EFA (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000EDD QOBJ 100. **files**
- BQ03Reach (Bounty: Hagraven) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000EDD (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the hagraven located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000EDD QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 25. **files**

**Gives**: nothing on its completing stages.

## 25. Bounty: Draugr (`BQ03Rift`, Favor Quests Seperated.esp:000ED8, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ03Rift (Bounty: Draugr) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Draugr stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD734.Fragment_0 on INFO Favor Quests Seperated.esp:000EF6 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ03Rift (Bounty: Draugr) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Draugr stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA92.Fragment_0 on INFO Favor Quests Seperated.esp:000EF7 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000ED8 QOBJ 100. **files**
- BQ03Rift (Bounty: Draugr) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000ED8 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the draugr at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000ED8 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 15. **files**

**Gives**: nothing on its completing stages.

## 26. Bounty: Giant (`BQ03Whiterun`, Favor Quests Seperated.esp:000EBF, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ03Whiterun (Bounty: Giant) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Giant stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD734.Fragment_0 on INFO Favor Quests Seperated.esp:000EE7 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ03Whiterun (Bounty: Giant) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Giant stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA92.Fragment_0 on INFO Favor Quests Seperated.esp:000EE8 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000EBF QOBJ 100. **files**
- BQ03Whiterun (Bounty: Giant) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000EBF (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the giant located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000EBF QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 20. **files**

**Gives**: nothing on its completing stages.

## 27. Bounty: Falmer (`BQ03Winterhold`, Favor Quests Seperated.esp:000ECE, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ03Winterhold (Bounty: Falmer) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Falmer stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD734.Fragment_0 on INFO Favor Quests Seperated.esp:000EF0 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ03Winterhold (Bounty: Falmer) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Falmer stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA92.Fragment_0 on INFO Favor Quests Seperated.esp:000EF1 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000ECE QOBJ 100. **files**
- BQ03Winterhold (Bounty: Falmer) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000ECE (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the falmer at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000ECE QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 25. **files**

**Gives**: nothing on its completing stages.

## 28. Bounty: Dragon (`BQ04Eastmarch`, Favor Quests Seperated.esp:000F20, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ04Eastmarch (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000CBA97.Fragment_0 on INFO Favor Quests Seperated.esp:000F3E (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ04Eastmarch (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA98.Fragment_0 on INFO Favor Quests Seperated.esp:000F3F (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000F20 QOBJ 100. **files**
- BQ04Eastmarch (Bounty: Dragon) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000F20 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the dragon located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000F20 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 30; global DragonsReturned == 1 (now 0); global MQ106TurnOffRandomDragons == 0 (now 0). **files**
- Global DragonsReturned: record 0.0 (Skyrim.esm); at run time script QF_MQ105_000242BA:  = 1. **run time**
- Global MQ106TurnOffRandomDragons: record 0.0 (Skyrim.esm); at run time script QF_CWSiege_000954E1:  = 1; script QF_CWSiege_000954E1:  = 0; script QF_MQ106_00032926:  = 0; script QF_MQ106_00032926:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 29. Bounty: Dragon (`BQ04Falkreath`, Favor Quests Seperated.esp:000F16, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ04Falkreath (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000CBA97.Fragment_0 on INFO Favor Quests Seperated.esp:000F38 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ04Falkreath (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA98.Fragment_0 on INFO Favor Quests Seperated.esp:000F39 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000F16 QOBJ 100. **files**
- BQ04Falkreath (Bounty: Dragon) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000F16 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the dragon located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000F16 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 30; global DragonsReturned == 1 (now 0); global MQ106TurnOffRandomDragons == 0 (now 0). **files**
- Global DragonsReturned: record 0.0 (Skyrim.esm); at run time script QF_MQ105_000242BA:  = 1. **run time**
- Global MQ106TurnOffRandomDragons: record 0.0 (Skyrim.esm); at run time script QF_CWSiege_000954E1:  = 1; script QF_CWSiege_000954E1:  = 0; script QF_MQ106_00032926:  = 0; script QF_MQ106_00032926:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 30. Bounty: Dragon (`BQ04Haafingar`, Favor Quests Seperated.esp:000F02, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ04Haafingar (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000CBA97.Fragment_0 on INFO Favor Quests Seperated.esp:000F2C (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ04Haafingar (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA98.Fragment_0 on INFO Favor Quests Seperated.esp:000F2D (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000F02 QOBJ 100. **files**
- BQ04Haafingar (Bounty: Dragon) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000F02 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the dragon located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000F02 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 30; global DragonsReturned == 1 (now 0); global MQ106TurnOffRandomDragons == 0 (now 0). **files**
- Global DragonsReturned: record 0.0 (Skyrim.esm); at run time script QF_MQ105_000242BA:  = 1. **run time**
- Global MQ106TurnOffRandomDragons: record 0.0 (Skyrim.esm); at run time script QF_CWSiege_000954E1:  = 1; script QF_CWSiege_000954E1:  = 0; script QF_MQ106_00032926:  = 0; script QF_MQ106_00032926:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 31. Bounty: Dragon (`BQ04Hjaalmarch`, Favor Quests Seperated.esp:000F07, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ04Hjaalmarch (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000CBA97.Fragment_0 on INFO Favor Quests Seperated.esp:000F2F (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ04Hjaalmarch (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA98.Fragment_0 on INFO Favor Quests Seperated.esp:000F30 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000F07 QOBJ 100. **files**
- BQ04Hjaalmarch (Bounty: Dragon) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000F07 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the dragon located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000F07 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 30; global DragonsReturned == 1 (now 0); global MQ106TurnOffRandomDragons == 0 (now 0). **files**
- Global DragonsReturned: record 0.0 (Skyrim.esm); at run time script QF_MQ105_000242BA:  = 1. **run time**
- Global MQ106TurnOffRandomDragons: record 0.0 (Skyrim.esm); at run time script QF_CWSiege_000954E1:  = 1; script QF_CWSiege_000954E1:  = 0; script QF_MQ106_00032926:  = 0; script QF_MQ106_00032926:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 32. Bounty: Dragon (`BQ04Pale`, Favor Quests Seperated.esp:000F11, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ04Pale (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000CBA97.Fragment_0 on INFO Favor Quests Seperated.esp:000F35 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ04Pale (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA98.Fragment_0 on INFO Favor Quests Seperated.esp:000F36 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000F11 QOBJ 100. **files**
- BQ04Pale (Bounty: Dragon) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000F11 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the dragon located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000F11 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 30; global DragonsReturned == 1 (now 0); global MQ106TurnOffRandomDragons == 0 (now 0). **files**
- Global DragonsReturned: record 0.0 (Skyrim.esm); at run time script QF_MQ105_000242BA:  = 1. **run time**
- Global MQ106TurnOffRandomDragons: record 0.0 (Skyrim.esm); at run time script QF_CWSiege_000954E1:  = 1; script QF_CWSiege_000954E1:  = 0; script QF_MQ106_00032926:  = 0; script QF_MQ106_00032926:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 33. Bounty: Dragon (`BQ04Reach`, Favor Quests Seperated.esp:000F2A, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ04Reach (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000CBA97.Fragment_0 on INFO Favor Quests Seperated.esp:000F44 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ04Reach (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA98.Fragment_0 on INFO Favor Quests Seperated.esp:000F45 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000F2A QOBJ 100. **files**
- BQ04Reach (Bounty: Dragon) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000F2A (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the dragon located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000F2A QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 30; global DragonsReturned == 1 (now 0); global MQ106TurnOffRandomDragons == 0 (now 0). **files**
- Global DragonsReturned: record 0.0 (Skyrim.esm); at run time script QF_MQ105_000242BA:  = 1. **run time**
- Global MQ106TurnOffRandomDragons: record 0.0 (Skyrim.esm); at run time script QF_CWSiege_000954E1:  = 1; script QF_CWSiege_000954E1:  = 0; script QF_MQ106_00032926:  = 0; script QF_MQ106_00032926:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 34. Bounty: Dragon (`BQ04Rift`, Favor Quests Seperated.esp:000F25, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ04Rift (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000CBA97.Fragment_0 on INFO Favor Quests Seperated.esp:000F41 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ04Rift (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA98.Fragment_0 on INFO Favor Quests Seperated.esp:000F42 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000F25 QOBJ 100. **files**
- BQ04Rift (Bounty: Dragon) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000F25 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the dragon located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000F25 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 30; global DragonsReturned == 1 (now 0); global MQ106TurnOffRandomDragons == 0 (now 0). **files**
- Global DragonsReturned: record 0.0 (Skyrim.esm); at run time script QF_MQ105_000242BA:  = 1. **run time**
- Global MQ106TurnOffRandomDragons: record 0.0 (Skyrim.esm); at run time script QF_CWSiege_000954E1:  = 1; script QF_CWSiege_000954E1:  = 0; script QF_MQ106_00032926:  = 0; script QF_MQ106_00032926:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 35. Bounty: Dragon (`BQ04Whiterun`, Favor Quests Seperated.esp:000F0C, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ04Whiterun (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000CBA97.Fragment_0 on INFO Favor Quests Seperated.esp:000F32 (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ04Whiterun (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA98.Fragment_0 on INFO Favor Quests Seperated.esp:000F33 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000F0C QOBJ 100. **files**
- BQ04Whiterun (Bounty: Dragon) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000F0C (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the dragon located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000F0C QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 30; global DragonsReturned == 1 (now 0); global MQ106TurnOffRandomDragons == 0 (now 0). **files**
- Global DragonsReturned: record 0.0 (Skyrim.esm); at run time script QF_MQ105_000242BA:  = 1. **run time**
- Global MQ106TurnOffRandomDragons: record 0.0 (Skyrim.esm); at run time script QF_CWSiege_000954E1:  = 1; script QF_CWSiege_000954E1:  = 0; script QF_MQ106_00032926:  = 0; script QF_MQ106_00032926:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 36. Bounty: Dragon (`BQ04Winterhold`, Favor Quests Seperated.esp:000F1B, Favor Quests Seperated.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ04Winterhold (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000CBA97.Fragment_0 on INFO Favor Quests Seperated.esp:000F3B (Favor Quests Seperated.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ04Winterhold (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA98.Fragment_0 on INFO Favor Quests Seperated.esp:000F3C (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Favor Quests Seperated.esp:000F1B QOBJ 100. **files**
- BQ04Winterhold (Bounty: Dragon) calls SetStage 100. Source: BQBountyScript.OnDeath on Favor Quests Seperated.esp:000F1B (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Kill the dragon located at <Alias=BountyLocation>". Source: Favor Quests Seperated.esp:000F1B QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 30; global DragonsReturned == 1 (now 0); global MQ106TurnOffRandomDragons == 0 (now 0). **files**
- Global DragonsReturned: record 0.0 (Skyrim.esm); at run time script QF_MQ105_000242BA:  = 1. **run time**
- Global MQ106TurnOffRandomDragons: record 0.0 (Skyrim.esm); at run time script QF_CWSiege_000954E1:  = 1; script QF_CWSiege_000954E1:  = 0; script QF_MQ106_00032926:  = 0; script QF_MQ106_00032926:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 37. Delivery (`Favor001AngasMill`, Favor Quests Seperated.esp:000835, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Aeri, placed in Aeri's House, "Sure. I'd be glad to help.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Aeri). Source: TIF__0004037F.Fragment_0 on INFO Favor Quests Seperated.esp:000834 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationAngasMill, event: change location; conditions up its parents: the place you enter is Anga's Mill; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationAngasMill Skyrim.esm:090E55 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:000835 QOBJ 10. **files**
- Target alias Target (unique): Skald the Elder (unique actor, placed in The White Hall). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The White Hall: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 38. Delivery (`Favor001DarkwaterCrossing`, Favor Quests Seperated.esp:000842, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Sondas Drenim, placed in Goldenrock Mine, "I could deliver your message for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Sondas Drenim). Source: TIF__00068FE9.Fragment_0 on INFO Favor Quests Seperated.esp:000846 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationDarkwaterCrossing, event: change location; conditions up its parents: the place you enter is Darkwater Crossing; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationDarkwaterCrossing Skyrim.esm:068FFC (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:000842 QOBJ 10. **files**
- Target alias Target (unique): Quintus Navale (unique actor, placed in The White Phial). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The White Phial: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 39. Delivery (`Favor001Falkreath`, Favor Quests Seperated.esp:000847, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Thadgeir, placed in Dengeir's House, Dengeir's Hall, "I'd be honored.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Thadgeir). Source: TIF__00090DFB.Fragment_0 on INFO Favor Quests Seperated.esp:00084A (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationFalkreath, event: change location; conditions up its parents: the place you enter is Falkreath; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationFalkreath Skyrim.esm:0705BC (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:000847 QOBJ 10. **files**
- Target alias Target (unique): Runil (unique actor, placed in Hall of the Dead, House of Arkay). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hall of the Dead, House of Arkay: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 40. Delivery (`Favor001Markarth`, Favor Quests Seperated.esp:000838, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Banning, placed in Markarth Stables, "I could deliver that for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Banning). Source: TIF__0004444B.Fragment_0 on INFO Favor Quests Seperated.esp:00083A (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationMarkarth, event: change location; conditions up its parents: the place you enter is Markarth; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMarkarth Skyrim.esm:0C2B6B (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:000838 QOBJ 10. **files**
- Target alias Target (unique): Voada (unique actor, placed in Understone Keep). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Understone Keep: 6 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 41. Delivery (`Favor001Morthal`, Favor Quests Seperated.esp:00083D, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Idgrod the Younger, placed in Highmoon Hall, "I'd be glad to help.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Idgrod the Younger). Source: TIF__0009408B.Fragment_0 on INFO Favor Quests Seperated.esp:000840 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationMorthal, event: change location; conditions up its parents: the place you enter is Morthal; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMorthal Skyrim.esm:0940DB (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:00083D QOBJ 10. **files**
- Target alias Target (unique): Danica Pure-Spring (unique actor, placed in Temple of Kynareth). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Temple of Kynareth: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 42. Delivery (`Favor001Windhelm`, Favor Quests Seperated.esp:00082D, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Adonato Leotelli, placed in Candlehearth Hall, "I'll deliver the book for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Adonato Leotelli). Source: TIF__0007043E.Fragment_0 on INFO Favor Quests Seperated.esp:00082F (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWindhelm, event: change location; conditions up its parents: the place you enter is Windhelm; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWindhelm Skyrim.esm:03F4C4 (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Deliver <Alias=QuestItem> to <Alias.ShortName=Target>". Source: Favor Quests Seperated.esp:00082D QOBJ 10. **files**
- Target alias Target (forced): Giraud Gemane (forced reference, placed in Bards College, The Bards College). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Bards College, The Bards College: 4 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 43. A Few Words with You (`Favor013Kynesgrove`, Favor Quests Seperated.esp:000896, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Iddra, placed in Braidwood Inn, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Iddra; the speaker is the one in alias QuestGiver). Source: TIF__00068FDF.Fragment_0 on INFO Favor Quests Seperated.esp:0008E8 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationKynesgrove, event: change location; conditions up its parents: the place you enter is Kynesgrove; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationKynesgrove Skyrim.esm:06901C (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> that <Alias.ShortName=Target> is taken care of", shown at stage 15. Source: Favor Quests Seperated.esp:000896 QOBJ 15. **files**
- Dialogue with Roggi Knot-Beard, placed in Steamscorch Mine, Steamscorch Gully Mine, "You ready to listen to reason now?": SetStage 15 (when: the speaker is Roggi Knot-Beard). Reply: "I get your point. Tell Iddra I'm sorry for being so stubborn about the coin." Source: TIF__00068F59.Fragment_0 on INFO Skyrim.esm:068F59 (Favor Quests Seperated.esp). **script**
- Dialogue with Roggi Knot-Beard, placed in Steamscorch Mine, Steamscorch Gully Mine, "Do I need to beat some sense into you? (Intimidate)": SetStage 15 (when: the speaker is Roggi Knot-Beard; the speaker is the one in alias target; fn655 == 1). Reply: "What? No. All right. I won't worry about the coin anymore, just stop giving me that look." Source: TIF__00068FD3.Fragment_1 on INFO Favor Quests Seperated.esp:0008E1 (Favor Quests Seperated.esp). **script**
- Dialogue with Roggi Knot-Beard, placed in Steamscorch Mine, Steamscorch Gully Mine, "What if I pay it? (<BribeCost> gold)": SetStage 15 (when: fn654 == 1; the speaker is Roggi Knot-Beard; the speaker is the one in alias target). Reply: "A true Nord would settle it himself, but at least this way Iddra gets her coin. Thank you. Tell her I'll be fine." Source: TIF__00068F5C.Fragment_1 on INFO Favor Quests Seperated.esp:0008E3 (Favor Quests Seperated.esp). **script**
- Dialogue with Roggi Knot-Beard, placed in Steamscorch Mine, Steamscorch Gully Mine, "Iddra wants you to forget about all that coin you owe.": SetStage 15 (when: fn403 >= 1; A Few Words with You stage == 10; the speaker is Roggi Knot-Beard; the speaker is the one in alias target). Reply: "I guess if you're telling me to stop worrying about it, maybe I should just let it go. Thank you, friend." Source: TIF__00068F62.Fragment_0 on INFO Favor Quests Seperated.esp:0008E5 (Favor Quests Seperated.esp). **script**
- Dialogue with Roggi Knot-Beard, placed in Steamscorch Mine, Steamscorch Gully Mine, "Stop being stubborn. Let it go. (Persuade)": SetStage 15 (when: the speaker is the one in alias target; the speaker is Roggi Knot-Beard; GetActorValue >= SpeechEasy (now 25) or fn182 == 1). Reply: "I guess you're right. A Nord shouldn't be so proud to turn down a kind soul's generosity. Tell Iddra I'll be fine." Source: TIF__0006F82E.Fragment_1 on INFO Favor Quests Seperated.esp:0008EA (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Talk to <Alias.ShortName=Target> about <Alias.ShortName=Questgiver>". Source: Favor Quests Seperated.esp:000896 QOBJ 10. **files**
- Target alias target (unique): Roggi Knot-Beard (unique actor, placed in Steamscorch Mine, Steamscorch Gully Mine). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Steamscorch Mine, Steamscorch Gully Mine: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 44. A Few Words with You (`Favor013Markarth`, Favor Quests Seperated.esp:0008B3, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Omluag, placed in The Warrens, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Omluag; the speaker is the one in alias QuestGiver; fn1 >= ANDR_DialogueDistanceCheck_MulushSmelterWorkers (now 2048)). Source: TIF__00055115.Fragment_0 on INFO Favor Quests Seperated.esp:0008F4 (Narrative Gameplay Consistent Dialogue Tweaks - Favor Quests Separated Patch.esp). **script**
- Story manager node FavorChangeLocationMarkarth, event: change location; conditions up its parents: the place you enter is Markarth; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMarkarth Skyrim.esm:0C2B6B (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> that <Alias.ShortName=Target> is taken care of", shown at stage 15. Source: Favor Quests Seperated.esp:0008B3 QOBJ 15. **files**
- Dialogue with Mulush gro-Shugurz, placed in Smelter Overseer's House, "Leave Omluag alone. This is my final warning.": SetStage 15 (when: the speaker is Mulush gro-Shugurz). Reply: "All right. I'll lay off him. Just leave." Source: TIF__0006FABA.Fragment_0 on INFO Skyrim.esm:06FABA (Favor Quests Seperated.esp). **script**
- Dialogue with Mulush gro-Shugurz, placed in Smelter Overseer's House, "Then we do this the hard way. (Intimidate)": SetStage 15 (when: the speaker is Mulush gro-Shugurz; the speaker is the one in alias target; fn655 == 1). Reply: "Wait. You win. I'll ease off on the beatings, just leave me alone." Source: TIF__00055512.Fragment_1 on INFO Favor Quests Seperated.esp:0008EE (Favor Quests Seperated.esp). **script**
- Dialogue with Mulush gro-Shugurz, placed in Smelter Overseer's House, "Maybe we can come to an understanding. (<BribeCost> gold)": SetStage 15 (when: fn654 == 1; the speaker is Mulush gro-Shugurz; the speaker is the one in alias target). Reply: "I guess I can spare him a few beatings. Deal." Source: TIF__000554D9.Fragment_1 on INFO Favor Quests Seperated.esp:0008F0 (Favor Quests Seperated.esp). **script**
- Dialogue with Mulush gro-Shugurz, placed in Smelter Overseer's House, "You're working him to death. Lay off. (Persuade)": SetStage 15 (when: the speaker is the one in alias target; the speaker is Mulush gro-Shugurz; GetActorValue >= SpeechEasy (now 25) or fn182 == 1). Reply: "All right, all right. You sound like a damn Legion officer, but I get it. I'll give him a break. This better not hurt our quota." Source: TIF__000554DB.Fragment_1 on INFO Favor Quests Seperated.esp:0008F6 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Talk to <Alias.ShortName=Target> about <Alias.ShortName=Questgiver>". Source: Favor Quests Seperated.esp:0008B3 QOBJ 10. **files**
- Target alias target (unique): Mulush gro-Shugurz (unique actor, placed in Smelter Overseer's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Smelter Overseer's House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 45. A Few Words with You (`Favor013Solitude`, Favor Quests Seperated.esp:0008A5, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Octieve San, placed in Evette San's House, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Octieve San; the speaker is the one in alias QuestGiver). Source: TIF__000CA1FA.Fragment_0 on INFO Favor Quests Seperated.esp:000901 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocatiomSolitude, event: change location; conditions up its parents: the place you enter is Solitude; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocatiomSolitude Skyrim.esm:06FD99 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> that <Alias.ShortName=Target> is taken care of", shown at stage 15. Source: Favor Quests Seperated.esp:0008A5 QOBJ 15. **files**
- Dialogue with Irnskar Ironhand, placed in Bryling's House, "Final warning. Leave Octieve alone.": SetStage 15 (when: the speaker is Irnskar Ironhand). Reply: "All right. Tell the old man his debts are settled." Source: TIF__000CA203.Fragment_0 on INFO Skyrim.esm:0CA203 (Favor Quests Seperated.esp). **script**
- Dialogue with Irnskar Ironhand, placed in Bryling's House, "Lay off the old man. Now. (Intimidate)": SetStage 15 (when: the speaker is Irnskar Ironhand; the speaker is the one in alias target; fn655 == 1). Reply: "All right, all right. Have it your way. Tell Octieve to forget about the debt." Source: TIF__0006F955.Fragment_1 on INFO Favor Quests Seperated.esp:0008FB (Favor Quests Seperated.esp). **script**
- Dialogue with Irnskar Ironhand, placed in Bryling's House, "What if I pay it? (<BribeCost> gold)": SetStage 15 (when: fn654 == 1; the speaker is Irnskar Ironhand; the speaker is the one in alias target). Reply: "Works for me. Tell Octieve the debt's settled." Source: TIF__0006F82A.Fragment_1 on INFO Favor Quests Seperated.esp:0008FD (Favor Quests Seperated.esp). **script**
- Dialogue with Irnskar Ironhand, placed in Bryling's House, "He's an old man. Let it go. (Persuade)": SetStage 15 (when: the speaker is the one in alias target; the speaker is Irnskar Ironhand; GetActorValue >= SpeechEasy (now 25) or fn182 == 1). Reply: "Fine. You sound like a priest of Mara, but I get your point. Tell him to forget about the gold." Source: TIF__00068F6A.Fragment_1 on INFO Favor Quests Seperated.esp:000903 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Talk to <Alias.ShortName=Target> about <Alias.ShortName=Questgiver>". Source: Favor Quests Seperated.esp:0008A5 QOBJ 10. **files**
- Target alias target (unique): Irnskar Ironhand (unique actor, placed in Bryling's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Bryling's House: 2 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 46. A Few Words with You (`Favor013Whiterun`, Favor Quests Seperated.esp:000869, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Carlotta Valentia, placed in Carlotta Valentia's House, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Carlotta Valentia; the speaker is the one in alias QuestGiver). Source: TIF__0006F7EF.Fragment_0 on INFO Favor Quests Seperated.esp:0008BF (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWhiterun, event: change location; conditions up its parents: the place you enter is Whiterun; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWhiterun Skyrim.esm:0C0609 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> that <Alias.ShortName=Target> is taken care of", shown at stage 15. Source: Favor Quests Seperated.esp:000869 QOBJ 15. **files**
- Dialogue with Mikael, placed in The Bannered Mare, "You leave Carlotta alone, or this gets worse.": SetStage 15 (when: the speaker is Mikael). Reply: "You win. On my honor, Carlotta won't have to worry about me ever again." Source: TIF__000DF1D7.Fragment_0 on INFO Skyrim.esm:0DF1D7 (Favor Quests Seperated.esp). **script**
- Dialogue with Mikael, placed in The Bannered Mare, "Leave her alone, or else. (Intimidate)": SetStage 15 (when: the speaker is Mikael; the speaker is the one in alias target; fn655 == 1). Reply: "Whoa. Hey there. I didn't mean to make you upset. On my honor, Carlotta won't have to worry about me again." Source: TIF__000CA1F5.Fragment_1 on INFO Favor Quests Seperated.esp:0008B7 (Favor Quests Seperated.esp). **script**
- Dialogue with Mikael, placed in The Bannered Mare, "Maybe we can come to an understanding. (<BribeCost> gold)": SetStage 15 (when: fn654 == 1; the speaker is Mikael; the speaker is the one in alias target). Reply: "Bribing me? Well, a bard does need to eat. On my ancestor's honor, I won't trouble sweet Carlotta again." Source: TIF__000CA204.Fragment_1 on INFO Favor Quests Seperated.esp:0008B9 (Favor Quests Seperated.esp). **script**
- Dialogue with Mikael, placed in The Bannered Mare, "You need to leave <Alias=QuestGiver> alone.": SetStage 15 (when: fn131 == 1; fn403 >= 1; A Few Words with You stage == 10; the speaker is Mikael; the speaker is the one in alias target). Reply: "Anything for my favorite lass." Source: TIF__000CD114.Fragment_0 on INFO Favor Quests Seperated.esp:0008BB (Favor Quests Seperated.esp). **script**
- Dialogue with Mikael, placed in The Bannered Mare, "You need to leave <Alias=QuestGiver> alone.": SetStage 15 (when: fn131 == 1; fn403 >= 1; A Few Words with You stage == 10; the speaker is Mikael; the speaker is the one in alias target). Reply: "Oh? Were you after her yourself? I won't stand in your way, my friend. You have my word." Source: TIF__000CD116.Fragment_0 on INFO Favor Quests Seperated.esp:0008BC (Favor Quests Seperated.esp). **script**
- Dialogue with Mikael, placed in The Bannered Mare, "She's not yours. Stop this nonsense. (Persuade)": SetStage 15 (when: the speaker is the one in alias target; the speaker is Mikael; GetActorValue >= SpeechEasy (now 25) or fn182 == 1). Reply: "Maybe you're right. I guess I just didn't want anyone to think I couldn't handle one lass." Source: TIF__000CD119.Fragment_1 on INFO Favor Quests Seperated.esp:0008C1 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Talk to <Alias.ShortName=Target> about <Alias.ShortName=Questgiver>". Source: Favor Quests Seperated.esp:000869 QOBJ 10. **files**
- Target alias target (unique): Mikael (unique actor, placed in The Bannered Mare). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: The Bannered Mare: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 47. A Few Words with You (`Favor013Windhelm`, Favor Quests Seperated.esp:000878, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Scouts-Many-Marshes, placed in Argonian Assemblage, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Scouts-Many-Marshes; the speaker is the one in alias QuestGiver). Source: TIF__0003F085.Fragment_0 on INFO Favor Quests Seperated.esp:0008CD (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWindhelm, event: change location; conditions up its parents: the place you enter is Windhelm; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWindhelm Skyrim.esm:03F4C4 (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> that <Alias.ShortName=Target> is taken care of", shown at stage 15. Source: Favor Quests Seperated.esp:000878 QOBJ 15. **files**
- Dialogue with Torbjorn Shatter-Shield, placed in House of Clan Shatter-Shield, "You pay those Argonians fairly, or else.": SetStage 15 (when: the speaker is Torbjorn Shatter-Shield). Reply: "I yield. By the honor of Clan Shatter-Shield, the Argonians will be paid as much as any other worker." Source: TIF__0003F05D.Fragment_0 on INFO Skyrim.esm:03F05D (Favor Quests Seperated.esp). **script**
- Dialogue with Torbjorn Shatter-Shield, placed in House of Clan Shatter-Shield, "Pay them, or things will get ugly. (Intimidate)": SetStage 15 (when: the speaker is Torbjorn Shatter-Shield; the speaker is the one in alias target; fn655 == 1). Reply: "Easy. Maybe I was being too harsh on them. By the honor of Clan Shatter-Shield, they will be paid fairly. You have my word." Source: TIF__0003F067.Fragment_1 on INFO Favor Quests Seperated.esp:0008C6 (Favor Quests Seperated.esp). **script**
- Dialogue with Torbjorn Shatter-Shield, placed in House of Clan Shatter-Shield, "What if I invest in their future? (<BribeCost> gold)": SetStage 15 (when: fn654 == 1; the speaker is Torbjorn Shatter-Shield; the speaker is the one in alias target). Reply: "Paying the wages yourself? Well, I won't say no to gold. By my family's honor, this money will go to the Argonian workers." Source: TIF__0003F160.Fragment_1 on INFO Favor Quests Seperated.esp:0008C8 (Favor Quests Seperated.esp). **script**
- Dialogue with Torbjorn Shatter-Shield, placed in House of Clan Shatter-Shield, "You need to pay the Argonians a fair wage.": SetStage 15 (when: fn403 >= 1; A Few Words with You stage == 10; the speaker is Torbjorn Shatter-Shield; the speaker is the one in alias target). Reply: "Well, my friend, if you think those boots needs more coin, I'll make it happen. But I'm doing this for you, not them." Source: TIF__0003F07E.Fragment_0 on INFO Favor Quests Seperated.esp:0008CA (Favor Quests Seperated.esp). **script**
- Dialogue with Torbjorn Shatter-Shield, placed in House of Clan Shatter-Shield, "They'll work harder if you pay them more. (Persuade)": SetStage 15 (when: the speaker is the one in alias target; the speaker is Torbjorn Shatter-Shield; GetActorValue >= SpeechEasy (now 25) or fn182 == 1). Reply: "Bold words, but true. Fine, you win. I'll pay the Argonians more coin." Source: TIF__0003F15A.Fragment_1 on INFO Favor Quests Seperated.esp:0008CF (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Talk to <Alias.ShortName=Target> about <Alias.ShortName=Questgiver>". Source: Favor Quests Seperated.esp:000878 QOBJ 10. **files**
- Target alias target (unique): Torbjorn Shatter-Shield (unique actor, placed in House of Clan Shatter-Shield). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: House of Clan Shatter-Shield: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 48. A Few Words with You (`Favor013Winterhold`, Favor Quests Seperated.esp:000887, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Haran, placed in The Frozen Hearth, "What if I talk to <Alias.ShortName=Target>?": SetStage 10 (when: the speaker is Haran; the speaker is the one in alias QuestGiver). Source: TIF__00094048.Fragment_0 on INFO Favor Quests Seperated.esp:0008DA (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWinterhold, event: change location; conditions up its parents: the place you enter is Winterhold; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWinterhold Skyrim.esm:0940D9 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> that <Alias.ShortName=Target> is taken care of", shown at stage 15. Source: Favor Quests Seperated.esp:000887 QOBJ 15. **files**
- Dialogue with Ranmir, placed in Birna's Oddments, Ranmir's House, "You ready to pay up now?": SetStage 15 (when: the speaker is Ranmir). Reply: "You got me, fair and square. Tell Haran I'll pay." Source: TIF__00094089.Fragment_0 on INFO Skyrim.esm:094089 (Favor Quests Seperated.esp). **script**
- Dialogue with Ranmir, placed in Birna's Oddments, Ranmir's House, "Do it, or things get ugly. (Intimidate)": SetStage 15 (when: the speaker is Ranmir; the speaker is the one in alias target; fn655 == 1). Reply: "Calm down there, friend. I'll pay! Tell Haran that she'll have her gold." Source: TIF__000940CB.Fragment_1 on INFO Favor Quests Seperated.esp:0008D4 (Favor Quests Seperated.esp). **script**
- Dialogue with Ranmir, placed in Birna's Oddments, Ranmir's House, "What if I pay it? (<BribeCost> gold)": SetStage 15 (when: fn654 == 1; the speaker is Ranmir; the speaker is the one in alias target). Reply: "I won't say no to that." Source: TIF__00094086.Fragment_1 on INFO Favor Quests Seperated.esp:0008D6 (Favor Quests Seperated.esp). **script**
- Dialogue with Ranmir, placed in Birna's Oddments, Ranmir's House, "You owe her gold. Pay it. (Persuade)": SetStage 15 (when: the speaker is the one in alias target; the speaker is Ranmir; GetActorValue >= SpeechEasy (now 25) or fn182 == 1). Reply: "You're right. What would my forefathers think if they knew I wasn't paying my debts? Tell Haran I'll bring her the gold I owe." Source: TIF__00094041.Fragment_1 on INFO Favor Quests Seperated.esp:0008DC (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Talk to <Alias.ShortName=Target> about <Alias.ShortName=Questgiver>". Source: Favor Quests Seperated.esp:000887 QOBJ 10. **files**
- Target alias target (unique): Ranmir (unique actor, placed in Birna's Oddments, Ranmir's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Birna's Oddments, Ranmir's House: 3 doors, 2 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 49. Some Light Theft (`Favor018Falkreath`, Favor Quests Seperated.esp:000A0C, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Dengeir of Stuhn, placed in Dengeir's House, Dengeir's Hall, "It will be done.": SetStage 10 (when: the speaker is Dengeir of Stuhn; the speaker is the one in alias Questgiver). Source: TIF__000D9392.Fragment_0 on INFO Favor Quests Seperated.esp:000A20 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationFalkreath, event: change location; conditions up its parents: the place you enter is Falkreath; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationFalkreath Skyrim.esm:0705BC (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Bring the <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Favor Quests Seperated.esp:000A0C QOBJ 15. **files**
- Favor018Falkreath (Some Light Theft) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Favor Quests Seperated.esp:000A0C (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Steal the <Alias=QuestItem> for <Alias.ShortName=QuestGiver>". Source: Favor Quests Seperated.esp:000A0C QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 50. Some Light Theft (`Favor018Windhelm`, Favor Quests Seperated.esp:000A1D, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Stands-In-Shallows, placed in Argonian Assemblage, "I'll get it for you.": SetStage 10 (when: the speaker is Stands-In-Shallows; the speaker is the one in alias Questgiver). Source: TIF__0003F066.Fragment_0 on INFO Favor Quests Seperated.esp:000A28 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWindhelm, event: change location; conditions up its parents: the place you enter is Windhelm; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWindhelm Skyrim.esm:03F4C4 (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Bring the <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Favor Quests Seperated.esp:000A1D QOBJ 15. **files**
- Favor018Windhelm (Some Light Theft) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Favor Quests Seperated.esp:000A1D (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Steal the <Alias=QuestItem> for <Alias.ShortName=QuestGiver>". Source: Favor Quests Seperated.esp:000A1D QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 51. Some Light Theft (`Favor018Winterhold`, Favor Quests Seperated.esp:000A14, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Malur Seloth, placed in Stonecold Fortress, Jarl's Longhouse, "I'll get it for you.": SetStage 10 (when: the speaker is Malur Seloth; the speaker is the one in alias Questgiver). Source: TIF__0009404B.Fragment_0 on INFO Favor Quests Seperated.esp:000A24 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWinterhold, event: change location; conditions up its parents: the place you enter is Winterhold; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWinterhold Skyrim.esm:0940D9 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Bring the <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Favor Quests Seperated.esp:000A14 QOBJ 15. **files**
- Favor018Winterhold (Some Light Theft) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Favor Quests Seperated.esp:000A14 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Steal the <Alias=QuestItem> for <Alias.ShortName=QuestGiver>". Source: Favor Quests Seperated.esp:000A14 QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 52. Kill the Bandit Leader (`Favor104DarkwaterCrossing`, Favor Quests Seperated.esp:000B3E, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Annekke Crag-Jumper, placed in Verner and Annekke's House, Verner's House, "I'll do it.": SetStage 10 (when: the speaker is the one in alias QuestGiver; the speaker is Annekke Crag-Jumper). Source: TIF__00068F61.Fragment_0 on INFO Favor Quests Seperated.esp:000B59 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationDarkwaterCrossing, event: change location; conditions up its parents: the place you enter is Darkwater Crossing; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationDarkwaterCrossing Skyrim.esm:068FFC (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> the bandit is dead", shown at stage 15. Source: Favor Quests Seperated.esp:000B3E QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Kill the leader of <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000B3E QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 53. Kill the Bandit Leader (`Favor104SkaalVillage`, Favor Quests Seperated.esp:000B50, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Fanari Strong-Voice, placed in Greathall, Skaal Village Greathall, "Consider it done.": SetStage 10 (when: the speaker is the one in alias QuestGiver; the speaker is Fanari Strong-Voice). Source: DLC2_TIF__02020948.Fragment_0 on INFO Favor Quests Seperated.esp:000B64 (Favor Quests Seperated.esp). **script**
- Story manager node DLC2FavorSkaalVillage, event: change location; conditions up its parents: the place you enter is Skaal Village; the place you enter is a habitation; the place you leave isn't a dwelling. Source: DLC2FavorSkaalVillage Dragonborn.esm:020955 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> the bandit is dead", shown at stage 15. Source: Favor Quests Seperated.esp:000B50 QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Kill the leader of <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000B50 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 54. Kill the Bandit Leader (`Favor104Solitude`, Favor Quests Seperated.esp:000B34, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Ahtar, placed in Jala's House, "I'll do it.": SetStage 10 (when: the speaker is Ahtar; the speaker is the one in alias QuestGiver). Source: TIF__0006F7E7.Fragment_0 on INFO Favor Quests Seperated.esp:000B53 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocatiomSolitude, event: change location; conditions up its parents: the place you enter is Solitude; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocatiomSolitude Skyrim.esm:06FD99 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> the bandit is dead", shown at stage 15. Source: Favor Quests Seperated.esp:000B34 QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Kill the leader of <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000B34 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 55. Kill the Bandit Leader (`Favor104Windhelm`, Favor Quests Seperated.esp:000B47, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Brunwulf Free-Winter, placed in Brunwulf Free-Winter's House, "What if I took care of these bandits?": SetStage 10 (when: the speaker is the one in alias QuestGiver; the speaker is Brunwulf Free-Winter). Source: TIF__000AB822.Fragment_0 on INFO Favor Quests Seperated.esp:000B5F (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWindhelm, event: change location; conditions up its parents: the place you enter is Windhelm; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWindhelm Skyrim.esm:03F4C4 (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> the bandit is dead", shown at stage 15. Source: Favor Quests Seperated.esp:000B47 QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Kill the leader of <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000B47 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 56. Rare Gifts (`Favor110Dawnstar`, Favor Quests Seperated.esp:000D7E, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Rustleif, placed in Rustleif's House, "If I see it, I'll bring it to you.": SetStage 10 (when: the speaker is Rustleif; the speaker is the one in alias Questgiver). Source: TIF__000CA436.Fragment_0 on INFO Favor Quests Seperated.esp:000DA2 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationDawnstar, event: change location; conditions up its parents: the place you enter is Dawnstar; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationDawnstar Skyrim.esm:090E34 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring one <Alias=QuestItem> to <Alias.ShortName=QuestGiver>". Source: Favor Quests Seperated.esp:000D7E QOBJ 10. **files**
- Target alias Questgiver (unique): Rustleif (unique actor, placed in Rustleif's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Rustleif's House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 57. Rare Gifts (`Favor110Falkreath`, Favor Quests Seperated.esp:000D86, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Siddgeir, placed in Hakkvild's High Hall, Jarl's Longhouse, "I'll bring it to you.": SetStage 10 (when: the speaker is Siddgeir; the speaker is the one in alias Questgiver). Source: TIF__00090DFA.Fragment_0 on INFO Favor Quests Seperated.esp:000DA6 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationFalkreath, event: change location; conditions up its parents: the place you enter is Falkreath; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationFalkreath Skyrim.esm:0705BC (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring one <Alias=QuestItem> to <Alias.ShortName=QuestGiver>". Source: Favor Quests Seperated.esp:000D86 QOBJ 10. **files**
- Target alias Questgiver (unique): Siddgeir (unique actor, placed in Hakkvild's High Hall, Jarl's Longhouse). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Hakkvild's High Hall, Jarl's Longhouse: 5 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 58. Rare Gifts (`Favor110Morthal`, Favor Quests Seperated.esp:000D76, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Lami, placed in Jorgen and Lami's House, "If I find a copy, I'll bring it to you.": SetStage 10 (when: the speaker is Lami; the speaker is the one in alias Questgiver). Source: TIF__000940C8.Fragment_0 on INFO Favor Quests Seperated.esp:000D9E (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationMorthal, event: change location; conditions up its parents: the place you enter is Morthal; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMorthal Skyrim.esm:0940DB (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring one <Alias=QuestItem> to <Alias.ShortName=QuestGiver>". Source: Favor Quests Seperated.esp:000D76 QOBJ 10. **files**
- Target alias Questgiver (unique): Lami (unique actor, placed in Jorgen and Lami's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Jorgen and Lami's House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 59. Rare Gifts (`Favor110Solitude`, Favor Quests Seperated.esp:000D6E, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Captain Aldis, placed in Castle Dour, "If I find a copy, I'll bring it to you.": SetStage 10 (when: the speaker is Captain Aldis; the speaker is the one in alias Questgiver). Source: TIF__000940C9.Fragment_0 on INFO Favor Quests Seperated.esp:000D9A (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocatiomSolitude, event: change location; conditions up its parents: the place you enter is Solitude; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocatiomSolitude Skyrim.esm:06FD99 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring one <Alias=QuestItem> to <Alias.ShortName=QuestGiver>". Source: Favor Quests Seperated.esp:000D6E QOBJ 10. **files**
- Target alias Questgiver (unique): Captain Aldis (unique actor, placed in Castle Dour). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Castle Dour: 5 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 60. Rare Gifts (`Favor110Whiterun`, Favor Quests Seperated.esp:000D97, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Ysolda, placed in Ysolda's House, "Maybe I can help you.": SetStage 10 (when: the speaker is Ysolda; the speaker is the one in alias Questgiver). Source: TIF__00079ADC.Fragment_0 on INFO Favor Quests Seperated.esp:000DAF (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWhiterun, event: change location; conditions up its parents: the place you enter is Whiterun; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWhiterun Skyrim.esm:0C0609 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring one <Alias=QuestItem> to <Alias.ShortName=QuestGiver>". Source: Favor Quests Seperated.esp:000D97 QOBJ 10. **files**
- Target alias Questgiver (unique): Ysolda (unique actor, placed in Ysolda's House). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Ysolda's House: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 61. Rare Gifts (`Favor110Windhelm`, Favor Quests Seperated.esp:000D8F, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Torbjorn Shatter-Shield, placed in House of Clan Shatter-Shield, "If I find one, I'll bring it to you.": SetStage 10 (when: the speaker is Torbjorn Shatter-Shield; the speaker is the one in alias Questgiver). Source: TIF__000AB818.Fragment_0 on INFO Favor Quests Seperated.esp:000DAB (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWindhelm, event: change location; conditions up its parents: the place you enter is Windhelm; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWindhelm Skyrim.esm:03F4C4 (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Who and where**

- First objective: "Bring one <Alias=QuestItem> to <Alias.ShortName=QuestGiver>". Source: Favor Quests Seperated.esp:000D8F QOBJ 10. **files**
- Target alias Questgiver (unique): Torbjorn Shatter-Shield (unique actor, placed in House of Clan Shatter-Shield). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: House of Clan Shatter-Shield: 1 door, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## 62. Dungeon Delving (Bandits) (`Favor204Whiterun`, Favor Quests Seperated.esp:000DB9, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Amren, placed in Amren's House, "Do you need help finding the sword?": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Amren). Source: TIF__000E1FD7.Fragment_0 on INFO Favor Quests Seperated.esp:000DC6 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWhiterun, event: change location; conditions up its parents: the place you enter is Whiterun; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWhiterun Skyrim.esm:0C0609 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Favor Quests Seperated.esp:000DB9 QOBJ 15. **files**
- Favor204Whiterun (Dungeon Delving (Bandits)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Favor Quests Seperated.esp:000DB9 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> inside <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000DB9 QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 63. Dungeon Delving (Bandits) (`Favor204Windhelm`, Favor Quests Seperated.esp:000DC2, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Shahvee, placed in Argonian Assemblage, "I could find your amulet for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Shahvee). Source: TIF__000BFA08.Fragment_0 on INFO Favor Quests Seperated.esp:000DCB (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationWindhelm, event: change location; conditions up its parents: the place you enter is Windhelm; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWindhelm Skyrim.esm:03F4C4 (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Favor Quests Seperated.esp:000DC2 QOBJ 15. **files**
- Favor204Windhelm (Dungeon Delving (Bandits)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Favor Quests Seperated.esp:000DC2 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> inside <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000DC2 QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 64. Dungeon Delving (Caves) (`Favor205Dawnstar`, Favor Quests Seperated.esp:000DD5, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Frida, placed in The Mortar and Pestle, "I could find that ring for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Frida). Source: TIF__0006FC72.Fragment_0 on INFO Favor Quests Seperated.esp:000DFC (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationDawnstar, event: change location; conditions up its parents: the place you enter is Dawnstar; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationDawnstar Skyrim.esm:090E34 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Favor Quests Seperated.esp:000DD5 QOBJ 15. **files**
- Favor205Dawnstar (Dungeon Delving (Caves)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Favor Quests Seperated.esp:000DD5 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> inside <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000DD5 QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 65. Dungeon Delving (Caves) (`Favor205Falkreath`, Favor Quests Seperated.esp:000DF9, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Runil, placed in Hall of the Dead, House of Arkay, "I'll do it.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Runil). Source: TIF__00090E01.Fragment_0 on INFO Favor Quests Seperated.esp:000E10 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocationFalkreath, event: change location; conditions up its parents: the place you enter is Falkreath; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationFalkreath Skyrim.esm:0705BC (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Favor Quests Seperated.esp:000DF9 QOBJ 15. **files**
- Favor205Falkreath (Dungeon Delving (Caves)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Favor Quests Seperated.esp:000DF9 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> inside <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000DF9 QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 66. Dungeon Delving (Caves) (`Favor205Kynesgrove`, Favor Quests Seperated.esp:000DF0, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Roggi Knot-Beard, placed in Steamscorch Mine, Steamscorch Gully Mine, "Maybe I can find that shield for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Roggi Knot-Beard). Source: TIF__01002DB1.Fragment_0 on INFO Favor Quests Separated - The Choice Is Yours Patch.esp:000807 (Favor Quests Separated - The Choice Is Yours Patch.esp). **script**
- Story manager node FavorChangeLocationKynesgrove, event: change location; conditions up its parents: the place you enter is Kynesgrove; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationKynesgrove Skyrim.esm:06901C (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Favor Quests Seperated.esp:000DF0 QOBJ 15. **files**
- Favor205Kynesgrove (Dungeon Delving (Caves)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Favor Quests Seperated.esp:000DF0 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> inside <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000DF0 QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 67. Dungeon Delving (Caves) (`Favor205Solitude`, Favor Quests Seperated.esp:000DDE, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Noster Eagle-Eye, placed in The Winking Skeever, "What if I could find that helmet for you?": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Noster Eagle-Eye). Source: TIF__0007044D.Fragment_0 on INFO Favor Quests Seperated.esp:000E01 (Favor Quests Seperated.esp). **script**
- Story manager node FavorChangeLocatiomSolitude, event: change location; conditions up its parents: the place you enter is Solitude; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocatiomSolitude Skyrim.esm:06FD99 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Favor Quests Seperated.esp:000DDE QOBJ 15. **files**
- Favor205Solitude (Dungeon Delving (Caves)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Favor Quests Seperated.esp:000DDE (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> inside <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000DDE QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 68. Dungeon Delving (Caves) (`Favor205Windhelm`, Favor Quests Seperated.esp:000DE7, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Oengul War-Anvil, placed in Blacksmith Quarters, Aretino Residence, "I can get the sword for you.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Oengul War-Anvil). Source: TIF__01002DB2.Fragment_0 on INFO Favor Quests Separated - The Choice Is Yours Patch.esp:000806 (Favor Quests Separated - The Choice Is Yours Patch.esp). **script**
- Story manager node FavorChangeLocationWindhelm, event: change location; conditions up its parents: the place you enter is Windhelm; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWindhelm Skyrim.esm:03F4C4 (LoreRim - Dialogue Patch.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Favor Quests Seperated.esp:000DE7 QOBJ 15. **files**
- Favor205Windhelm (Dungeon Delving (Caves)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Favor Quests Seperated.esp:000DE7 (Favor Quests Seperated.esp). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> inside <Alias=Dungeon>". Source: Favor Quests Seperated.esp:000DE7 QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 69. Bounty: Bandit Boss (`BQ01`, Skyrim.esm:095125, Requiem.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ01 (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward). Source: TIF__00095123.Fragment_0 on INFO Skyrim.esm:095123 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ01 (Bounty: Bandit Boss) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA96.Fragment_0 on INFO Skyrim.esm:0CBA96 (Skyrim.esm). **script**
- Story manager node BQReachNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQReachNodeSHARES Skyrim.esm:0CBAA9 (Requiem.esp). **files**
- Story manager node BQRiftNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQRiftNodeSHARES Skyrim.esm:0CBAA7 (Requiem.esp). **files**
- Story manager node BQEastmarchNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQEastmarchNodeSHARES Skyrim.esm:0CBAA6 (Requiem.esp). **files**
- Story manager node BQWinterholdNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQWinterholdNodeSHARES Skyrim.esm:0CBAA5 (Requiem.esp). **files**
- Story manager node BQFalkreathNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQFalkreathNodeSHARES Skyrim.esm:0CBAA4 (Requiem.esp). **files**
- Story manager node BQPaleNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQPaleNodeSHARES Skyrim.esm:0CBAA3 (Requiem.esp). **files**
- and 3 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Skyrim.esm:095125 QOBJ 100. **files**
- BQ01 (Bounty: Bandit Boss) calls SetStage 100. Source: BQBountyScript.OnDeath on Skyrim.esm:095125 (Requiem.esp). **script**

**Who and where**

- First objective: "Kill the bandit leader located at <Alias=BountyLocation> in <Alias=Hold>". Source: Skyrim.esm:095125 QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 70. Bounty: Forsworn (`BQ02`, Skyrim.esm:0BD77F, Requiem.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ02 (Bounty: Forsworn) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Forsworn stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD752.Fragment_1 on INFO Skyrim.esm:0BD752 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ02 (Bounty: Forsworn) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Forsworn stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA94.Fragment_0 on INFO Skyrim.esm:0CBA94 (Skyrim.esm). **script**
- Story manager node BQReachNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQReachNodeSHARES Skyrim.esm:0CBAA9 (Requiem.esp). **files**
- Story manager node BQRiftNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQRiftNodeSHARES Skyrim.esm:0CBAA7 (Requiem.esp). **files**
- Story manager node BQEastmarchNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQEastmarchNodeSHARES Skyrim.esm:0CBAA6 (Requiem.esp). **files**
- Story manager node BQWinterholdNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQWinterholdNodeSHARES Skyrim.esm:0CBAA5 (Requiem.esp). **files**
- Story manager node BQFalkreathNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQFalkreathNodeSHARES Skyrim.esm:0CBAA4 (Requiem.esp). **files**
- Story manager node BQPaleNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQPaleNodeSHARES Skyrim.esm:0CBAA3 (Requiem.esp). **files**
- and 3 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect the bounty from <Alias=Steward>", shown at stage 100. Source: Skyrim.esm:0BD77F QOBJ 100. **files**
- BQ02 (Bounty: Forsworn) calls SetStage 100. Source: BQBountyScript.OnDeath on Skyrim.esm:0BD77F (Requiem.esp). **script**

**Who and where**

- First objective: "Kill the leader of <Alias=BountyLocation> in <Alias=Hold>". Source: Skyrim.esm:0BD77F QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 71. Bounty: Giant (`BQ03`, Skyrim.esm:0BD78C, Requiem.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ03 (Bounty: Giant) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Giant stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000BD734.Fragment_0 on INFO Skyrim.esm:0BD734 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ03 (Bounty: Giant) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Giant stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA92.Fragment_0 on INFO Skyrim.esm:0CBA92 (Skyrim.esm). **script**
- Story manager node BQReachNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQReachNodeSHARES Skyrim.esm:0CBAA9 (Requiem.esp). **files**
- Story manager node BQRiftNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQRiftNodeSHARES Skyrim.esm:0CBAA7 (Requiem.esp). **files**
- Story manager node BQEastmarchNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQEastmarchNodeSHARES Skyrim.esm:0CBAA6 (Requiem.esp). **files**
- Story manager node BQWinterholdNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQWinterholdNodeSHARES Skyrim.esm:0CBAA5 (Requiem.esp). **files**
- Story manager node BQFalkreathNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQFalkreathNodeSHARES Skyrim.esm:0CBAA4 (Requiem.esp). **files**
- Story manager node BQPaleNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQPaleNodeSHARES Skyrim.esm:0CBAA3 (Requiem.esp). **files**
- and 3 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Skyrim.esm:0BD78C QOBJ 100. **files**
- BQ03 (Bounty: Giant) calls SetStage 100. Source: BQBountyScript.OnDeath on Skyrim.esm:0BD78C (Requiem.esp). **script**

**Who and where**

- First objective: "Kill the giant located at <Alias=BountyLocation> in <Alias=Hold>". Source: Skyrim.esm:0BD78C QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 20. **files**

**Gives**: nothing on its completing stages.

## 72. Bounty: Dragon (`BQ04`, Skyrim.esm:0CBA9A, Requiem.esp)

**Started by**

- Dialogue with someone the line does not name (named by alias Steward of BQ04 (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Steward). Source: TIF__000CBA97.Fragment_0 on INFO Skyrim.esm:0CBA97 (Unofficial Skyrim Special Edition Patch.esp). **script**
- Dialogue with someone the line does not name (named by alias Innkeeper of BQ04 (Bounty: Dragon) (run time)), "I'm looking for work. Got any leads?": SetStage 10 (when: Bounty: Dragon stage 10 not done; the speaker is the one in alias Innkeeper). Source: TIF__000CBA98.Fragment_0 on INFO Skyrim.esm:0CBA98 (Skyrim.esm). **script**
- Story manager node BQReachNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQReachNodeSHARES Skyrim.esm:0CBAA9 (Requiem.esp). **run time**
- Story manager node BQRiftNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQRiftNodeSHARES Skyrim.esm:0CBAA7 (Requiem.esp). **run time**
- Story manager node BQEastmarchNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQEastmarchNodeSHARES Skyrim.esm:0CBAA6 (Requiem.esp). **run time**
- Story manager node BQWinterholdNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQWinterholdNodeSHARES Skyrim.esm:0CBAA5 (Requiem.esp). **run time**
- Story manager node BQFalkreathNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQFalkreathNodeSHARES Skyrim.esm:0CBAA4 (Requiem.esp). **run time**
- Story manager node BQPaleNodeSHARES, event: change location; conditions up its parents: the place you enter is a habitation; fn359 == 1; fn606 == 0; the place you enter is a habitation. Source: BQPaleNodeSHARES Skyrim.esm:0CBAA3 (Requiem.esp). **run time**
- and 3 more in the JSON
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Collect bounty from <Alias=Steward>", shown at stage 100. Source: Skyrim.esm:0CBA9A QOBJ 100. **files**
- BQ04 (Bounty: Dragon) calls SetStage 100. Source: BQBountyScript.OnDeath on Skyrim.esm:0CBA9A (Requiem.esp). **script**

**Who and where**

- First objective: "Kill the dragon located at <Alias=BountyLocation> in <Alias=Hold>". Source: Skyrim.esm:0CBA9A QOBJ 10. **files**
- Target alias Bounty (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 10; global DragonsReturned == 1 (now 0); global MQ106TurnOffRandomDragons == 0 (now 0). **files**
- Global DragonsReturned: record 0.0 (Skyrim.esm); at run time script QF_MQ105_000242BA:  = 1. **run time**
- Global MQ106TurnOffRandomDragons: record 0.0 (Skyrim.esm); at run time script QF_CWSiege_000954E1:  = 1; script QF_CWSiege_000954E1:  = 0; script QF_MQ106_00032926:  = 0; script QF_MQ106_00032926:  = 1. **conflict**

**Gives**: nothing on its completing stages.

## 73. Kill the Bandit Leader (`Favor104`, Skyrim.esm:06FD35, Favor Quests Seperated.esp)

**Started by**

- Dialogue with Ahtar, placed in Jala's House, "I'll do it.": SetStage 10 (when: the speaker is Ahtar; the speaker is the one in alias QuestGiver; global TRUEGlobal == 0 (now 1)). Source: TIF__0006F7E7.Fragment_0 on INFO Skyrim.esm:06F7E7 (Favor Quests Seperated.esp). **script**
- Dialogue with Annekke Crag-Jumper, placed in Verner and Annekke's House, Verner's House, "I'll do it.": SetStage 10 (when: the speaker is the one in alias QuestGiver; the speaker is Annekke Crag-Jumper; global TRUEGlobal == 0 (now 1)). Source: TIF__00068F61.Fragment_0 on INFO Skyrim.esm:068F61 (Favor Quests Seperated.esp). **script**
- Dialogue with Brunwulf Free-Winter, placed in Brunwulf Free-Winter's House, "What if I took care of these bandits?": SetStage 10 (when: the speaker is the one in alias QuestGiver; the speaker is Brunwulf Free-Winter; global TRUEGlobal == 0 (now 1)). Source: TIF__000AB822.Fragment_0 on INFO Skyrim.esm:0AB822 (Favor Quests Seperated.esp). **script**
- Dialogue with Fanari Strong-Voice, placed in Greathall, Skaal Village Greathall, "Consider it done.": SetStage 10 (when: the speaker is the one in alias QuestGiver; the speaker is Fanari Strong-Voice; global TRUEGlobal == 0 (now 1)). Source: DLC2_TIF__02020948.Fragment_0 on INFO Dragonborn.esm:020948 (Favor Quests Seperated.esp). **script**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> the bandit is dead", shown at stage 15. Source: Skyrim.esm:06FD35 QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Kill the leader of <Alias=Dungeon>". Source: Skyrim.esm:06FD35 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: global TRUEGlobal == 0 (now 1). **files**
- Global TRUEGlobal: record 1.0 (Skyrim.esm). **files**

**Gives**: nothing on its completing stages.

## 74. Kill the Vampire (`Favor109`, Skyrim.esm:0940E0, TimingIsEverything.esp)

**Started by**

- Dialogue with Sybille Stentor, placed in Blue Palace, The Blue Palace, "I'll see what I can do.": SetStage 10 (when: the speaker is Sybille Stentor; the speaker is the one in alias QuestGiver). Source: TIF__0009403C.Fragment_0 on INFO Skyrim.esm:09403C (Skyrim.esm). **script**
- Story manager node FavorChangeLocatiomSolitude, event: change location; conditions up its parents: the place you enter is Solitude; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocatiomSolitude Skyrim.esm:06FD99 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Tell <Alias.ShortName=Questgiver> in the Blue Palace that the vampire is dead", shown at stage 15. Source: Skyrim.esm:0940E0 QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Kill the leader of <Alias=Dungeon> near Clearpine Pond, west of Solitude". Source: Skyrim.esm:0940E0 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= Favor109MinLevel_KRY (now 10). **files**
- Global Favor109MinLevel_KRY: record 10.0 (TimingIsEverything.esp). **files**

**Gives**: nothing on its completing stages.

## 75. Kill the Forsworn Leader (Jarl) (`Favor151`, Skyrim.esm:06C824, Skyrim.esm)

**Started by**

- Dialogue with Igmund, placed in Understone Keep, "It will be done.": SetStage 10 (when: the speaker is Igmund; the speaker is the one in alias Questgiver). Source: TIF__0006C80D.Fragment_0 on INFO Skyrim.esm:06C80D (Skyrim.esm). **script**
- Story manager node FavorChangeLocationMarkarth, event: change location; conditions up its parents: the place you enter is Markarth; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMarkarth Skyrim.esm:0C2B6B (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=Questgiver>", shown at stage 15. Source: Skyrim.esm:06C824 QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Kill the leader of <Alias=Dungeon>". Source: Skyrim.esm:06C824 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 76. Kill the Giant (Jarl) (`Favor153`, Skyrim.esm:090E36, TimingIsEverything.esp)

**Started by**

- Dialogue with Skald the Elder, placed in The White Hall, "It will be done.": SetStage 10 (when: the speaker is Skald the Elder; the speaker is the one in alias QuestGiver). Source: TIF__00090DEF.Fragment_0 on INFO Skyrim.esm:090DEF (Skyrim.esm). **script**
- Story manager node FavorChangeLocationDawnstar, event: change location; conditions up its parents: the place you enter is Dawnstar; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationDawnstar Skyrim.esm:090E34 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=Questgiver>", shown at stage 15. Source: Skyrim.esm:090E36 QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Kill the giant in <Alias=GiantCamp>". Source: Skyrim.esm:090E36 QOBJ 10. **files**
- Target alias Boss (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= Favor153MinLevel_KRY (now 22). **files**
- Global Favor153MinLevel_KRY: record 22.0 (TimingIsEverything.esp). **files**

**Gives**: nothing on its completing stages.

## 77. Kill the Bandit Leader (Jarl) (`Favor154`, Skyrim.esm:07172A, Skyrim.esm)

**Started by**

- Dialogue with Siddgeir, placed in Hakkvild's High Hall, Jarl's Longhouse, "It will be done.": SetStage 10 (when: the speaker is Siddgeir; the speaker is the one in alias Questgiver). Source: TIF__00090DF6.Fragment_0 on INFO Skyrim.esm:090DF6 (Skyrim.esm). **script**
- Story manager node FavorChangeLocationFalkreath, event: change location; conditions up its parents: the place you enter is Falkreath; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationFalkreath Skyrim.esm:0705BC (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return to <Alias.ShortName=Questgiver>", shown at stage 15. Source: Skyrim.esm:07172A QOBJ 15. **files**
- **unread**: nothing outside its own stage fragments sets stage 15 or one before it.

**Who and where**

- First objective: "Kill the leader of <Alias=BanditCamp>". Source: Skyrim.esm:07172A QOBJ 10. **files**
- Target alias BanditBoss (from alias): nothing the records or scripts name. **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.

**Gives**: nothing on its completing stages.

## 78. Dungeon Delving (Jarl - Hagravens) (`Favor157`, Skyrim.esm:0A3504, Requiem.esp)

**Started by**

- Dialogue with Igmund, placed in Understone Keep, "Don't worry about me. I'll do it.": SetStage 10 (when: the speaker is Igmund; the speaker is the one in alias QuestGiver). Source: TIF__000A349C.Fragment_0 on INFO Skyrim.esm:0A349C (Skyrim.esm). **script**
- Story manager node FavorChangeLocationMarkarth, event: change location; conditions up its parents: the place you enter is Markarth; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationMarkarth Skyrim.esm:0C2B6B (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Bring <Alias=QuestItem> to <Alias.ShortName=QuestGiver> in the Understone Keep", shown at stage 15. Source: Skyrim.esm:0A3504 QOBJ 15. **files**
- Favor157 (Dungeon Delving (Jarl - Hagravens)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Skyrim.esm:0A3504 (Requiem.esp). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> for <Alias.ShortName=QuestGiver>". Source: Skyrim.esm:0A3504 QOBJ 10. **files**
- Target alias QuestItem (from alias): nothing the records or scripts name. **files**

**Needs**

- Its own conditions: level >= 20. **files**

**Gives**: REQ_LI_Reward_Quest_JarlHagraven (levelled: an item) (stage 20, QF_Favor157_000A3504.fragment_1).

## 79. Dungeon Delving (Jarl - Caves) (`Favor158`, Skyrim.esm:0940D0, Update.esm)

**Started by**

- Dialogue with Korir, placed in Stonecold Fortress, Jarl's Longhouse, "I'll recover the helm.": SetStage 10 (when: the speaker is the one in alias Questgiver; the speaker is Korir). Source: TIF__000940CD.Fragment_0 on INFO Skyrim.esm:0940CD (Skyrim.esm). **script**
- Story manager node FavorChangeLocationWinterhold, event: change location; conditions up its parents: the place you enter is Winterhold; the place you enter is a habitation; the place you leave isn't a dwelling. Source: FavorChangeLocationWinterhold Skyrim.esm:0940D9 (Favor Quests Seperated.esp). **files**
- (First objective shown at stage 10; a call to a later stage advances the quest instead.)

**Second step** (what moves it to its second objective, often the real test)

- Second objective: "Return <Alias=QuestItem> to <Alias.ShortName=QuestGiver>", shown at stage 15. Source: Skyrim.esm:0940D0 QOBJ 15. **files**
- Favor158 (Dungeon Delving (Jarl - Caves)) calls SetStage 15. Source: DefaultAddItemAliasScript.OnContainerChanged on Skyrim.esm:0940D0 (Update.esm). **script**

**Who and where**

- First objective: "Find <Alias=QuestItem> inside <Alias=Dungeon>". Source: Skyrim.esm:0940D0 QOBJ 10. **files**
- Target alias QuestItem (forced): Helm of Winterhold (forced reference, placed in Stonecold Fortress, Jarl's Longhouse). **files**

**Needs**

- Nothing in its own conditions, and no locked-only way into its first objective's place.
- Ways in: Stonecold Fortress, Jarl's Longhouse: 3 doors, 0 locked. A door is a need only when every way in is locked. **files**

**Gives**: nothing on its completing stages.

## Every way a game begins

Each start's option is a quest; what its scripts do to the main quest, and how a player gets in from it:

| Start | Option | Its quest | Main quest (MQ101) runs? | What it moves | How the player gets into the main quest |
| --- | --- | --- | --- | --- | --- |
| Regular (Inn) | The Bannered Mare | APS_InnWhiterun | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | The Bee and Barb | APS_InnRiften | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | The Winking Skeever | APS_InnSolitude | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Silver-Blood Inn | APS_InnMarkarth | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Candlehearth Hall | APS_InnWindhelm | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Dead Man's Drink | APS_InnFalkreath | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Moorside Inn | APS_InnMorthal | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | The Frozen Hearth | APS_InnWinterhold | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Windpeak Inn | APS_InnDawnstar | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | The Retching Netch | APS_InnRavenRock | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | The Sleeping Giant Inn | APS_InnRiverwood | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Frostfruit Inn | APS_InnRorikstead | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Vilemyr Inn | APS_InnIvarstead | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Old Hroldan Inn | APS_InnOldHroldan | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Four Shields Tavern | APS_InnDragonbridge | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Nightgate Inn | APS_InnNightgate | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Regular (Inn) | Braidwood Inn | APS_InnKynesgrove | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| From Overseas | East Empire Trading Company | APS_DocksSolitude | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| From Overseas | Windhelm Docks | APS_DocksWindhelm | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| From Overseas | Dawnstar's Shore | APS_DocksDawnstar | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| From Overseas | Raven Rock Docks | APS_DocksRavenRock | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Wanted Criminal | Whiterun | APS_WantedTPWhiterun | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Wanted Criminal | The Rift | APS_WantedTPRRiften | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Wanted Criminal | The Pale | APS_WantedTPRDawnstar | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Wanted Criminal | Winterhold | APS_WantedTPWinterhold | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Left for Dead | The Rift | APS_LeftForDeadRiften | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Left for Dead | The Reach | APS_LeftForDeadMarkarth | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Left for Dead | Winterhold | APS_LeftForDeadWinterhold | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Forsworn | Forsworn | APS_Forsworn | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Guilds | College of Winterhold | APS_GuildMages | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Guilds | Thieves Guild | APS_GuildThievesguild | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Guilds | Dark Brotherhood | APS_GuildBrotherhood | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Guilds | Companions | APS_GuildCompanions | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Dragonborn | Helgen Keep (Start) | APS_MQSkipKeep | no | MQ101 SetStage 6; MQ101 SetStage 7 | The reader found no way into Bounties and favours for the jarls from it. |
| Dragonborn | Helgen Keep (End) | APS_MQSkipKeepEnd | no | MQ101 SetStage 250; MQ101 SetStage 550; MQ101 SetStage 700; MQ101 SetStage 710; MQ101 SetStage 720; MQ101 SetStage 725 | The reader found no way into Bounties and favours for the jarls from it. |
| Addict | Addict | AFLOLALAddictQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Dwemer Ruin | Dwemer Ruin | AFLOLALAdventureQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Alchemist | Alchemist | AFLOLALAlchemistQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| At Angis Camp | At Angis Camp | AFLOLALAngiQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Beggar | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Beggar | Riften | AFLOAP_BeggarRiften | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Beggar | Markarth | AFLOAP_BeggarMarkarth | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | Whiterun | AFLOAP_JailWhiterun | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | The Rift | AFLOAP_JailRift | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | Eastmarch | AFLOAP_JailEastmarch | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | Haarfinger | AFLOAP_JailHaarfinger | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | The Reach | AFLOAP_JailReach | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | Falkreath | AFLOAP_JailFalkreath | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | Hjaalmach | AFLOAP_JailHjaalmach | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | The Pale | AFLOAP_JailPale | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | Winterhold | AFLOAP_JailWinterhold | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Jailed | Raven Rock | AFLOAP_JailRavenRock | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Mercenary | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Mercenary | Cyrodiil | AFLOAP_BorderMercenaryCyrodill | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Mercenary | Hammerfell | AFLOAP_BorderMercenaryHammerfell | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Mercenary | High Rock | AFLOAP_BorderMercenaryHighRock | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Mercenary | Northern Morrowind | AFLOAP_BorderMercenaryNorthernMorrorwind | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Mercenary | Southern Morrowind | AFLOAP_BorderMercenarySouthernMorrorwind | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Merchant | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Merchant | Cyrodiil | AFLOAP_BorderMerchantCyrodill | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Merchant | Hammerfell | AFLOAP_BorderMerchantHammerfell | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Merchant | High Rock | AFLOAP_BorderMerchantHighRock | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Merchant | Northern Morrowind | AFLOAP_BorderMerchantNorthernMorrorwind | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Merchant | Southern Morrowind | AFLOAP_BorderMerchantSouthernMorrorwind | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Shrine) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Shrine) | Shrine of Azura | AFLOLALAzuraQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Shrine) | Shrine of Boethiah | AFLOLALBoethiahQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Shrine) | Shrine of Mehrunes Dagon | AFLOLALDagonQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Shrine) | The Eldergleam Sanctuary | AFLOLALEldergleamQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Shrine) | Statue of Meridia | AFLOLALMeridiaQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Shrine) | Shrine of Peryite | AFLOLALPeryiteQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Shrine) | Stendarr's Beacon | AFLOLALStendarrQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Shrine) | Hall of the Vigilant | AFLOAP_StendarrHall | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Temple) | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Temple) | Temple of the Divines | AFLOAP_TempleDivine | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Temple) | Temple of Dibella | AFLOAP_TempleDibella | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Temple) | Temple of Kynareth | AFLOAP_TempleKynareth | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Temple) | Temple of Mara | AFLOAP_TempleMara | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Pilgrim (Temple) | Temple of Talos | AFLOAP_TempleTalos | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Thalmor Prisoner | Thalmor Prisoner | AFLOLALThalmorQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Vampire | Random | Alternate Perspective -- New Beginnings.esp:000000 | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Vampire | Solitude | AFLOAP_VampireSolitude | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Vampire | Falkreath | AFLOAP_VampireFalkreath | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Vampire | Whiterun | AFLOAP_VampireWhiterun | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Vampire | Riften | AFLOAP_VampireRiften | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Vampire | Windhelm | AFLOAP_VampireWindhelm | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Vampire | Markarth | AFLOAP_VampireMarkarth | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Werewolf | Werewolf | AFLOLALWerewolfQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Roadside Ambush | Eastmarch | MissileAPAmbushStartEastmarchQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Roadside Ambush | Haafingar | MissileAPAmbushStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Roadside Ambush | Hjaalmarch | MissileAPAmbushStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Roadside Ambush | Falkreath | MissileAPAmbushStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Roadside Ambush | The Pale | MissileAPAmbushStartPaleQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Roadside Ambush | The Reach | MissileAPAmbushStartReachQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Roadside Ambush | The Rift | MissileAPAmbushStartRiftQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Roadside Ambush | Whiterun | MissileAPAmbushStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Fell in a Spike Pit | Fell in a Spike Pit | MissileAPFellInAPitQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Bounty Hunter | Eastmarch | MissileAPBountyHunterStartEastmarchQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Bounty Hunter | Falkreath | MissileAPBountyHunterStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Bounty Hunter | Haafingar | MissileAPBountyHunterStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Bounty Hunter | Hjaalmarch | MissileAPBountyHunterStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Bounty Hunter | The Rift | MissileAPBountyHunterStartRiftQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Bounty Hunter | Whiterun | MissileAPBountyHunterStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Bounty Hunter | Winterhold | MissileAPBountyHunterStartWinterholdQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Prisoner in a Bandit Fort | Haafingar | MissileAPBanditPrisonerStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Prisoner in a Bandit Fort | The Pale | MissileAPBanditPrisonerStartPaleQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Prisoner in a Bandit Fort | The Reach | MissileAPBanditPrisonerStartReachQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Prisoner in a Bandit Fort | The Rift | MissileAPBanditPrisonerStartRiftQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Prisoner in a Bandit Fort | Whiterun | MissileAPBanditPrisonerStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Out in the Wilderness | Eastmarch | MissileAPOutInTheWildernessStartEastmarchQuestDUPLICATE001 | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Out in the Wilderness | Falkreath | MissileAPOutInTheWildernessStartFalkreathQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Out in the Wilderness | Haafingar | MissileAPOutInTheWildernessStartHaafingarQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Out in the Wilderness | Hjaalmarch | MissileAPOutInTheWildernessStartHjaalmarchQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Out in the Wilderness | The Pale | MissileAPOutInTheWildernessStartPaleQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Out in the Wilderness | The Reach | MissileAPOutInTheWildernessStartReachQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Out in the Wilderness | The Rift | MissileAPOutInTheWildernessStartRiftQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Out in the Wilderness | Whiterun | MissileAPOutInTheWildernessStartWhiterunQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |
| Out in the Wilderness | Winterhold | MissileAPOutInTheWildernessStartWinterholdQuest | no | nothing in the main quest | The reader found no way into Bounties and favours for the jarls from it. |

## Routes into the first quest from outside the starts

### dialogue INFO Favor Quests Seperated.esp:000E61

- Speaker: not named by an NPC. Named by: alias Steward of BQ01Eastmarch (Bounty: Bandit Boss) (run time).
- The player's prompt: "I'm looking for work. Got any leads?".
- The reply: "The jarl has put out a bounty on some bandits. Here, take a look at this decree for details.".
- When it's offered: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward.
- What it does: SetStage 10 on BQ01Eastmarch (Bounty: Bandit Boss). Source: TIF__00095123.Fragment_0 on INFO Favor Quests Seperated.esp:000E61 (Favor Quests Seperated.esp); topic BQ01MainTopicEastmarch. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: alias Steward of BQ01Eastmarch (Bounty: Bandit Boss) (run time).
- In one sentence: Talk to the speaker the line's conditions name and choose "I'm looking for work. Got any leads?", when Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Steward: SetStage 10 on BQ01Eastmarch (Bounty: Bandit Boss).

### dialogue INFO Favor Quests Seperated.esp:000E62

- Speaker: not named by an NPC. Named by: alias Innkeeper of BQ01Eastmarch (Bounty: Bandit Boss) (run time).
- The player's prompt: "I'm looking for work. Got any leads?".
- The reply: "Here. Take a look at this. Some of the jarl's men came by and left this bounty letter.".
- When it's offered: Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper.
- What it does: SetStage 10 on BQ01Eastmarch (Bounty: Bandit Boss). Source: TIF__000CBA96.Fragment_0 on INFO Favor Quests Seperated.esp:000E62 (Favor Quests Seperated.esp); topic BQ01MainTopicEastmarch. **script**
- **unread**: the trail stops here: the speaker isn't named by an NPC: alias Innkeeper of BQ01Eastmarch (Bounty: Bandit Boss) (run time).
- In one sentence: Talk to the speaker the line's conditions name and choose "I'm looking for work. Got any leads?", when Bounty: Bandit Boss stage 10 not done; the speaker is the one in alias Innkeeper: SetStage 10 on BQ01Eastmarch (Bounty: Bandit Boss).

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

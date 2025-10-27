# EV2 WhatIf Analysis Research Framework

## Research Areas & Questions

### Area 1: Overviewing Deployment Stack WhatIf Result in EV2 Portal

**Hypothesis:** Users find the WhatIf result generated for a given Deployment Stack displayed within the Deployment Stack Resource Operation View intuitive and easy to keep context within EV2

**Research Questions:**
- What are users' expectations when seeing the summary of WhatIf result in the EV2 Portal?
- How do users want to see WhatIf Result in the column format?
- What is important when reviewing WhatIf result in EV2 Portal?
- How do you delete resources in Ev2 today?

**Key Insights to Look For:**
- [ ] User mental models for WhatIf results
- [ ] Preferred information hierarchy
- [ ] Context switching concerns
- [ ] Current deletion workflows

### Area 2: Move to Deployment Stack Portal to Take Further Action

**Hypothesis:** Users can easily identify and act on changetype + resource name combinations seen in a WhatIfResult

**Visualization Needs:**
- Tree-view to show/hide resources based on their scope (resource-topology)
- Shows list combination of changetype + resource name

**Key Insights to Look For:**
- [ ] Understanding of change types
- [ ] Navigation preferences
- [ ] Action discoverability
- [ ] Resource hierarchy comprehension

### Area 3: WhatIf Result Display

**Research Questions:**
- How do users interpret the summary of WhatIf results in the EV2 portal?
- What visual formats (e.g., column layout, tree-view) best support comprehension of resource changes?
- Do users understand the implications of each change type (create, modify, delete, no change, unsupported, unknown)?

**Key Insights to Look For:**
- [ ] Visual format preferences
- [ ] Change type comprehension
- [ ] Information density preferences
- [ ] Scanning patterns

### Area 4: Delete Confirmation and Safeguards

**Research Questions:**
- What are users' expectations around delete confirmation steps?
- Do users feel confident in the system's ability to prevent accidental deletions?
- How do users react to visual cues (e.g., red triangles, icons) indicating risky operations?

**Key Insights to Look For:**
- [ ] Safety expectations
- [ ] Visual cue effectiveness
- [ ] Confirmation step preferences
- [ ] Trust in system safeguards

### Area 5: Navigation and Actionability

**Research Questions:**
- Can users easily locate and act on WhatIf results within the EV2 portal?
- Is the URI linking to full WhatIf payloads in the Azure portal discoverable and useful?
- Where do users think this will navigate them to within the portal?
- How do users perceive the separation between EV2 and Azure portal experiences?

**Key Insights to Look For:**
- [ ] Discoverability of actions
- [ ] Cross-portal navigation expectations
- [ ] Mental model of portal separation
- [ ] Link affordances and clarity

## Analysis Framework for Transcriptions

### When analyzing transcriptions, look for:

#### 1. Direct Quotes & Reactions
- Exact user words about WhatIf displays
- Emotional reactions (confusion, confidence, frustration)
- Spontaneous comparisons to other tools

#### 2. Behavioral Observations
- Where users look first
- What actions they attempt
- Hesitation or uncertainty patterns
- Recovery from errors

#### 3. Mental Models
- How users describe the system
- What analogies they use
- Expectations about system behavior
- Assumptions about data relationships

#### 4. Pain Points
- Specific confusion moments
- Tasks they can't complete
- Information they can't find
- Visual elements that mislead

#### 5. Successful Patterns
- Tasks completed easily
- Information found quickly
- Visual elements that work well
- Workflows that feel natural

## Insight Categories

### Visual Design Insights
- **Color & Icons:** How users react to visual treatments for deletes
- **Layout:** Preferences for column vs. tree view vs. other formats
- **Information Hierarchy:** What users look at first, last, and ignore

### User Experience Insights
- **Context Switching:** How users maintain mental models across EV2 and Azure portals
- **Action Discovery:** How users find and understand available actions
- **Safety & Trust:** User confidence in delete operations and safeguards

### Information Architecture Insights
- **Change Type Understanding:** How users interpret create, modify, delete, etc.
- **Resource Relationships:** Understanding of resource hierarchies and dependencies
- **Summary vs. Detail:** When users need high-level overview vs. detailed information

## Recommendations Template

Based on insights from transcriptions:

### Immediate Actions
- [ ] Insight → Recommendation → Priority (High/Medium/Low)

### Design Improvements
- [ ] Visual treatment recommendations with specific examples
- [ ] Layout and navigation improvements
- [ ] Information architecture refinements

### Future Research Needs
- [ ] Areas needing additional investigation
- [ ] Prototype concepts to test
- [ ] Metrics to track post-implementation

---

## How to Use This Framework

1. **Upload your transcription files** to this workspace
2. **Review each transcription** against the research questions above
3. **Extract key quotes and observations** for each area
4. **Identify patterns** across multiple users/sessions
5. **Generate actionable insights** with specific recommendations
6. **Prioritize recommendations** based on frequency and impact of issues found

*Ready to analyze your transcription files - please upload them and I'll help extract insights using this framework.*
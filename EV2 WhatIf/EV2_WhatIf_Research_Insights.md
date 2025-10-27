# EV2 WhatIf Research Analysis - Comprehensive Insights & Findings

## Executive Summary

Based on analysis of transcriptions from Alex (Azure Event Grid), David (Azure Event Grid), Imran (Learn/Localization teams), and JR (Azure Messaging/Event Grid), this document presents key insights for the EV2 WhatIf integration research areas and specific recommendations for design improvements.

**Key Findings:**
- Users have strong mental models from other tools (Terraform, CloudFormation) that expect diff-like previews
- Progressive disclosure is critical: Summary → Details → Full Portal workflow
- Resource names and types are essential for user confidence in summary views
- Delete operations require special visual treatment and safety mechanisms
- Cross-portal navigation needs to preserve security boundaries while maintaining context
- History and status information are needed for operational workflows

---

## Area 1: Overviewing Deployment Stack WhatIf Result in EV2 Portal

### Research Question: What are users' expectations when seeing the summary of WhatIf result in the EV2 Portal?

#### Key Insights from Transcriptions:

**Alex's Expectations & Mental Model:**
- **High-level summary first**: *"this just gives me a high level. This is what's going to happen on a high level. But you give me the option of, OK, I want to see that more detail"*
- **Resource names and types critical**: *"I feel like the the names and what the resource type is is already, you know out and available. In an ARM template, so might as well be able to show it here and that at the very least can give me some insight. It's like, great, OK. Yep, that's those are the storage accounts I'm looking to see, or VMSS, the VM scale sets or whatever."*
- **Progressive disclosure model**: Users want summary → details → full Azure portal if needed

**David's Context:**
- **Familiar with diff-like concepts**: David compared WhatIf to "dry runs" in cloud formation, showing users have mental models from other tools
- **Heavy automation focus**: David's team processes 50+ regions, so they need scalable, automated approaches

**Imran's User Workflow Needs:**
- **Multiple portal concern**: *"Actually hops and maybe for us might be OK because we have a lot of other tools we go through safely, automation, R2D and stuff. But then I think the developers outside don't don't really have to go through all the steps. So you go to. One of the ID which is VS code or you know Visual Studio or whatever Azure DevOps or maybe GitHub. You do those GitHub, sorry the bicep changes and you actually go to the deployment. Then EV2 portal comes in. If you're using EV2 then you go to Azure portal and try. To see what really happened. And there's a lot of hops, per se, lots of hops."*

**JR's Testing Context:**
- **ARM WhatIf familiarity**: *"Upper manager might suggest doing an arm. What if so? Like that's where I became familiar with arms. What if feature?"*
- **Manual validation approach**: JR's team manually compares service fabric parameters before/after to validate changes

### Research Question: How do users want to see WhatIf Result in the column format?

#### Alex's Specific Feedback on Column Design:
- **Clickable summaries**: *"I think it'd be useful if under each column where you have create three resources, if that also was kind of a hyperlink and I can just click on that to specifically just see the create. Resources. Same with the delete. Same with the modify group delete what have you."*
- **Drill-down capability**: Users want to click on "Create 3 resources" to see just those 3 resources, not everything

#### Imran's Column Enhancement Requests:
- **Status indicators needed**: *"No, it failed. Succeed. Are you telling anything on those sides or no? Because only when I click I come to know when you click on this one, go to the next slide and you're telling me it failed or succeeded. But here in this screen you don't tell me anything."*
- **Hover information**: *"So here you are going to show all and then all the time. Then you're also going to tell me and here you're not going to tell the resource names, right? You'll just say 3 resource, one resource. When I hover over those resources, will you be able to tell me the names or no?"*

### Research Question: What is important when reviewing WhatIf result in EV2 Portal?

#### Critical Information Users Need:
1. **Resource names and types** (Alex emphasized this multiple times)
2. **Change categories** (create, delete, modify clearly differentiated)
3. **Status indicators** (success/failure - Imran's request)
4. **Hyperlinks to actual resources** when available
5. **Dependency information** for complex deployments
6. **Security-appropriate level of detail**
7. **History tracking** (Imran's operational need)

---

## Area 2: Delete Confirmation and Safeguards

### Research Question: What are users' expectations around delete confirmation steps?

#### Current Deletion Workflows:

**Alex's Current Process:**
- **JIT-based deletion for prod**: *"So in the event I do need to delete anything or like I said, doing those build outs, I'll get JIT"*
- **Manual portal deletion**: *"when I'm deleting resources though, it's primarily either was something was deployed misconfigured or. We're having some issues with maybe like an A VMSS or an SF cluster and it needs to just be cleared out and redeployed, but that's usually done almost entirely in my experience via just using the portal directly"*
- **Infrequent deletion**: *"To delete resources there I no, it'd be less than that I I mean I I I so very rarely use test. I would be probably comfortable in saying it's maybe once once every six months."*

**David's Deletion Patterns:**
- **SFI-driven deletions**: *"I mean like there's obviously like SFI items I feel like where resources were created wrong and they need to be deleted or fixed"*
- **Flaky resource management**: *"Specifically VMSS resources like they are very flaky in my opinion, so they have a constant need to be deleted and then recreated because nodes will like hardware will just come up bad"*
- **Always tracked**: *"Yes, yes. And it's always attached to like an ICM of some sort, right?"* (when asked about JIT for deletions)

**Imran's Deletion Interest:**
- **Delete-focused attention**: *"I think the most interesting one for me would be I will jump. I think when I when I see the screen I would be jumping into the delete ones and I would be very much interested to see what's happening on that because it creates are OK, modify is fine, I know deletes are the but I would be interested in"*

**JR's Deletion Process:**
- **Complex production deletion**: *"And I would say, yeah, and in prod actually there is a specific test, I mean a specific way of deleting resources. So like it would be like disabling our traffic managers that way, no traffic goes on there, maybe verifying logs to make sure that nothing's hitting that cluster. Umm. Draining our lease collections."*
- **Bulk testing cleanup**: *"In, in testing I mean in testing. Yeah, in testing I would probably even say that would be once a month and like a bulk cleanup, maybe even once every three months in prod"*

### Research Question: Do users feel confident in the system's ability to prevent accidental deletions?

#### Current Safeguards & Trust Issues:

**Alex's Safeguard Experience:**
- **JIT as primary gate**: Uses JIT process for access control
- **Approval workflows**: *"for deployments we also have just the approval process built into our pipelines where somebody will submit their deployments and it's gated on an approval"*
- **Manual verification**: Relies on team communication and understanding of what changes are being made

**David's Risk Mitigation:**
- **Process-heavy approach**: *"there's been a new push recently in the company to do like R2D ready to deploy. So a lot of these changes are tracked very closely"*
- **No technical guardrails**: *"We have no, I think there's probably a lot of pushback to like put like guardrails on it as more so like there's more push to just be like, OK, like if you are on call right and you have to do a manual change for an incident then. Make you know you you like there is a more of a check up like did they check in that change right. But there is no we don't have any more guardrails"*

**Imran's Stack Interest:**
- **Deployment stacks appeal**: *"No, I think this looks cool. I think the deployment stack looks cool. I think I can introduce folks from my side to you who can actually be an early adopter so we can adopt maybe maybe onboard our test PP environments."*

---

## Area 3: Visual Design Insights

### Research Question: How do users react to visual cues indicating risky operations?

#### Alex's Response to Mockups:

**Positive Reception of Visual Hierarchy:**
- **Appreciated high-level summary**: When shown the WhatIf results, Alex immediately understood the structure
- **Wanted more granular visual access**: Requested clickable elements for each change type
- **Valued progressive disclosure**: Liked that summary led to details which could lead to full portal

**Missing Visual Elements Alex Identified:**
- **Resource detail preview**: Wanted to see specific resource names in summary view
- **Hyperlinks to resources**: *"if there was a possibility? Because you know so many, especially with like region build outs or larger deployments, you have dependencies on previous resources being created or updated before you start getting into other resource deployments or creations. If then you could see in this view not only that yes, X resource resource one was created, but perhaps even now a hyperlink to portal to take me to said resource"*

#### Imran's Visual Feedback:

**Information Density Concerns:**
- **Summary vs. detail balance**: *"I am not really sure because some of our deployments are gonna be really huge and bulky and I'm not sure what it will be able to show. Like if you're showing just the divs, maybe it will not be a complete picture and if you're showing everything, it's gonna be like too much."*
- **Quick scanning need**: *"No, I was just thinking maybe I can quickly like for example if I'm looking for a particular resource which got deleted and like I had a lot of operations which ran, maybe can I just quickly go through this window and figure out where it really happened. So maybe all the deletes I just hold. I get the names."*

---

## Area 4: Navigation and Actionability

### Research Question: Can users easily locate and act on WhatIf results within the EV2 portal?

#### Alex's Navigation Expectations:
- **Logical placement**: *"I would look at the what if results next to the STP compliance and click into that"* - Alex intuitively expected WhatIf results in a logical location
- **Tab-based organization**: Understood the tab structure when shown the mockup

#### Imran's Navigation Feedback:
- **Tab structure acceptance**: *"I think starting with this one right where this makes sense. I think see the reason I would say it's still OK is. You just get it like for example once you are here you get all the options and then what if is is actually also in front of you. So it should be OK because I don't think they think there is any other way where we can show up. It will be another click here you are like here and then you're just getting more information the more you go into the tab. Which might be OK."*

### Research Question: Where do users think navigation links will take them?

#### Cross-Portal Navigation Expectations:

**Alex's Understanding:**
- **Portal handoff expectation**: *"I I I personally really love that because you know, this just gives me a high level. This is what's going to happen on a high level. But you give me the option of, OK, I want to see that more detail and. But then while at the same time securing those or preserving the security settings"*
- **Security-aware design**: Alex appreciated that EV2 could show summary while Azure portal could show full details

**Imran's Portal Integration Desire:**
- **Reduce portal hopping**: *"Do we have any plans to have EV2 as an extension in the portal itself so we are not switching between the other two? Back and forth between the portal and the UV2 portal."*

---

## Area 5: Change Type Comprehension

### Research Question: Do users understand the implications of each change type?

#### User Mental Models:

**Alex's Understanding:**
- **Diff-like expectation**: *"Like you can run a what it what if command and basically it'll inform you almost diff like here if you have this existing resource this is what's going to be deleted. This is what's going to be added."*
- **Clear categorization preference**: Responded well to create/delete/modify groupings

**David's Understanding:**
- **Terraform comparison**: *"It's it's like it's like Terraform bit right or something. Is that a fair comparison?"*
- **Plan vs. execution understanding**: Grasped the preview nature of WhatIf

**Imran's Clarification Needs:**
- **Group delete confusion**: *"What is a group delete?"* (needed clarification that it was resource group delete)
- **Modify complexity**: *"Modify will be very interesting because it's a lot of different kinds of modifications which could happen like it's a property update or like. What exactly the the authentication updates? I think there's a lot of different kind of updates which can happen"*

---

## Critical User Needs Identified

### 1. Progressive Information Disclosure
- **Summary → Details → Full Portal** workflow
- Clickable elements for each change type
- Appropriate security boundaries

### 2. Resource Identification 
- Resource names and types in summary view
- Hyperlinks to actual resources when available
- Context preservation across portal boundaries

### 3. Deletion Safety
- Clear visual indicators for risky operations
- Integration with existing approval workflows
- Audit trail maintenance

### 4. Scalability for Large Deployments
- Tree view for resource hierarchies
- Dependency information display
- Efficient scanning for 50+ region deployments

### 5. Status & History Tracking
- Success/failure indicators in summary view
- WhatIf result history for operational workflows
- Integration with existing ICM and tracking systems

### 6. Portal Experience Consolidation
- Minimize portal hopping between EV2 and Azure portal
- Preserve security boundaries (RBAC) while enabling seamless workflow
- Hover states and quick preview capabilities

---

## Key Quotes Supporting Design Decisions

### Progressive Disclosure Support:
**Alex**: *"this just gives me a high level. This is what's going to happen on a high level. But you give me the option of, OK, I want to see that more detail"*

### Clickable Change Types:
**Alex**: *"I think it'd be useful if under each column where you have create three resources, if that also was kind of a hyperlink and I can just click on that to specifically just see the create. Resources"*

### Delete Operation Priority:
**Imran**: *"I think the most interesting one for me would be I will jump. I think when I when I see the screen I would be jumping into the delete ones"*

### Resource Name Importance:
**Alex**: *"I feel like the the names and what the resource type is is already, you know out and available. In an ARM template, so might as well be able to show it here"*

### Status Information Need:
**Imran**: *"No, it failed. Succeed. Are you telling anything on those sides or no? Because only when I click I come to know"*

### Portal Hopping Concern:
**Imran**: *"And there's a lot of hops, per se, lots of hops"*

---

## Immediate Recommendations

### High Priority
1. **Implement clickable change type summaries** - Alex specifically requested this, Imran agreed
2. **Add resource names and types to summary view** - Critical for user confidence across all participants
3. **Design clear visual hierarchy** for create/delete/modify operations with special emphasis on delete
4. **Add status indicators** (success/failure icons) to summary view
5. **Integrate with existing JIT and approval workflows**

### Medium Priority  
1. **Add hyperlinks to deployed resources** for dependency tracking
2. **Implement hover states** for quick resource name preview
3. **Design cross-portal navigation flows** with security preservation
4. **Add WhatIf result history tracking**

### Low Priority
1. **Implement tree view for complex resource hierarchies**
2. **Explore EV2 portal integration into Azure portal** (long-term architectural decision)

### Future Research Needs
1. **Test visual treatments** for delete operations specifically with larger user groups
2. **Validate tree view designs** with users managing large deployments
3. **Study cross-portal navigation** user mental models in depth
4. **Test hover vs. click interaction patterns** for resource information
5. **Validate status indicator designs** and placement

---

## Design Patterns Validated

### ✅ Confirmed Effective Patterns:
- Tab-based navigation structure
- Progressive disclosure (summary → details → full portal)
- Change type categorization (create/delete/modify)
- Integration with existing security models (JIT, RBAC)

### ⚠️ Needs Refinement:
- Resource information density in summary view
- Status indicator placement and design
- Cross-portal handoff experience
- History and tracking integration

### ❌ Patterns to Avoid:
- Forcing users through multiple portals without clear navigation
- Hiding resource names/types in summary views
- Complex graphical views for large deployments without proper zoom/filter capabilities

---

*Analysis complete - Ready for design iteration and prototype development*
---
name: note-article-optimizer
description: Optimize note articles for engagement. Audits title, intro, formatting, CTA placement, and SEO/AEO. Use when asked to improve or prepare note articles for publication.
---

# note Article Optimizer

This skill helps optimize note.com articles for maximum engagement by auditing content structure, formatting, SEO/AEO elements, and preparing articles for publication.

**Use this skill when:**
- Asked to improve or optimize a note article
- Preparing an article for publication on note.com
- Checking article quality before publishing
- Reviewing article structure and formatting

## Quick Start

### Step 1: Audit Article

Analyze the current article for issues:
- Title effectiveness (numbers, specificity, target audience)
- Introduction hook (first 3 lines engagement)
- Content structure and hierarchy
- Visual formatting (code blocks, quotes, bullets)
- CTA placement and formatting
- URL placement (card display optimization)
- SEO/AEO optimization
- Copy-paste stability (quote blocks, markdown syntax)

### Step 2: Create Improvement Plan

Generate a detailed plan based on audit findings:
- Issues identified with priority
- Specific changes to make
- Expected impact of each change
- Verification criteria

### Step 3: Execute Rewrite

Apply improvements according to the plan:
- Minimal, targeted changes
- Preserve original voice and content
- Follow note.com best practices
- Document all changes made

### Step 4: Final Check

Verify article meets all quality standards:
- All checklist items passed
- Formatting optimized for note.com
- CTAs properly placed (intro + ending)
- URLs display as cards
- No markdown syntax errors

### Step 5: Output Results

Provide the optimized article along with:
- Audit report (issues found)
- Improvement plan (changes planned)
- Rewrite log (changes made)
- Final check report (quality verification)

## Execution Modes

You can run the skill in different modes:

- **full** (default): Complete workflow from audit to final check
- **audit**: Analyze current article for issues only
- **plan**: Create improvement plan based on audit
- **rewrite**: Execute improvements according to plan
- **final_check**: Verify article meets quality standards

## Key Optimization Rules

**Formatting:**
- No decorations (bold, links, headings) inside quote blocks
- URLs on separate lines after description text (enables card display)
- Avoid horizontal rules (---)
- Headings: ## and ### only
- Target length: 2,500-4,000 characters

**CTA Placement:**
- After introduction (before main content)
- At article end (after conclusion)
- Use consistent format for both placements

**Quote Blocks:**
- Plain text only (no markdown formatting inside)
- Use for emphasis, dialogue, key points
- Avoid numbered lists inside quotes

**URL Display:**
- Independent line placement
- Context/description before URL
- Enables automatic card generation on note.com

## Reference Files

This skill uses the following resources:

**Guidelines:**
- `references/guide_writing_comprehensive.md`: Complete writing guide for note.com

**Templates:**
- `assets/template_plan.md`: Improvement plan template
- `assets/template_howto_article.md`: How-to article structure

**Checklists:**
- `assets/checklist_markdown_stability.md`: Markdown syntax stability
- `assets/checklist_pre_publish_extended.md`: Pre-publication verification
- `assets/checklist_seo_aeo.md`: SEO and AEO optimization
- `assets/checklist_session_execution.md`: Workflow execution verification

## Parameters

- `article_path`: Absolute path to article file (.md)
- `mode`: Execution mode (full, audit, plan, rewrite, final_check)
- `cta_game_dev_url`: Game development CTA URL
- `cta_ai_signage_url`: AI signage CTA URL

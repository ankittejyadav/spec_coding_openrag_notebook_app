# Product Requirements Document: Open-Source AI Notebook Application

## 1. Overview
An open-source, locally-runnable notebook application inspired by NotebookLM and powered by OpenRAG / Vector datastores. Users can organize uploaded documents into distinct notebooks, view synthesized document overviews, interact with their sources via AI chat, and generate dynamic artifacts like study notes, summary tables, and mind maps.

---

## 2. Target Personas & User Flows

### Personas
- **P1: Researcher / Student**: Wants to upload research papers, articles, or notes and ask targeted questions across multiple documents simultaneously.
- **P2: Knowledge Worker / Analyst**: Needs to extract key insights, create comparative summary tables, and construct structured visual mind maps from project files.

### Primary User Flows
1. **Notebook Management Flow**:
   - User opens the app dashboard $\rightarrow$ Views existing notebooks or clicks "Create Notebook" $\rightarrow$ System creates a notebook and opens the workspace interface.
2. **Document Ingestion Flow**:
   - User inside a notebook clicks "Add Source" $\rightarrow$ Selects text/PDF file $\rightarrow$ System parses, chunks, and stores document vectors $\rightarrow$ Source appears in the source sidebar panel.
3. **Interactive Retrieval & Chat Flow**:
   - User types a prompt into the workspace chat box $\rightarrow$ System retrieves relevant context chunks from the notebook's sources $\rightarrow$ System returns an answer with inline citations.
4. **Artifact Generation Flow**:
   - User selects one or more sources or chat responses $\rightarrow$ Chooses "Generate Summary", "Create Table", or "Generate Mind Map" $\rightarrow$ System displays the generated artifact in the notebook canvas.

---

## 3. Functional Requirements

### Notebook Management
- **REQ-001**: **Notebook Creation and Listing**
  - *Acceptance Criteria*:
    - The user can view a list of all existing notebooks on the home dashboard.
    - The user can create a new notebook with a custom title.
    - Upon creation, the user is navigated directly into the newly created notebook workspace.

- **REQ-002**: **Notebook Deletion and Renaming**
  - *Acceptance Criteria*:
    - The user can rename an existing notebook.
    - The user can delete a notebook, which removes its associated sources and notes from the workspace.

---

### Source Management & Ingestion
- **REQ-003**: **Source File Upload**
  - *Acceptance Criteria*:
    - The user can upload text files (e.g., `.txt`, `.md`) or PDFs into a specific notebook.
    - Uploaded files appear immediately in the notebook's source panel with their original file names.

- **REQ-004**: **Source Selection and Filtering**
  - *Acceptance Criteria*:
    - The user can toggle individual sources on or off via checkboxes in the source list.
    - Chat queries and artifact generation commands only use information from currently selected sources.

- **REQ-005**: **Source Content Preview**
  - *Acceptance Criteria*:
    - Clicking on a source in the list opens a viewer panel displaying the full extracted raw text of the document.

---

### AI Querying & Grounded Chat
- **REQ-006**: **Context-Aware Conversational Interface**
  - *Acceptance Criteria*:
    - The user can send natural language text messages in the notebook chat interface.
    - The system returns an AI generated response grounded in the selected sources.
    - Chat message history is preserved across page reloads within the notebook.

- **REQ-007**: **Source Citation and Grounding**
  - *Acceptance Criteria*:
    - AI chat responses contain clickable inline citations pointing back to the specific source document and text segment used.

---

### Artifact Generation
- **REQ-008**: **Notebook Overview & Summary Generation**
  - *Acceptance Criteria*:
    - The user can click a single button to generate an overall executive summary / briefing doc of all selected sources in the notebook.

- **REQ-009**: **Structured Data Table Generation**
  - *Acceptance Criteria*:
    - The user can request the generation of a structured comparison table from the notebook sources.
    - The table displays formatted columns and rows representing extracted concepts or data points.

- **REQ-010**: **Visual Mind Map Generation**
  - *Acceptance Criteria*:
    - The user can request a visual mind map based on key topics extracted from the selected sources.
    - The mind map renders interactively on the workspace canvas with connected topic nodes.

- **REQ-011**: **Saving Chat Answers as Notes**
  - *Acceptance Criteria*:
    - The user can click a "Save as Note" button on any chat response to pin that answer as a permanent note in the notebook canvas.

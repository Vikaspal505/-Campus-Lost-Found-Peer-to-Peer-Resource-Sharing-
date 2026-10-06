
## Campus Lost & Found — Peer-to-Peer Resource Sharing



A DSA-II PBL project (BTech CSE, NIET Greater Noida) that replaces informal WhatsApp/noticeboard posts for lost items, found items, and resource-sharing requests with a single searchable, ranked record — built entirely on core data structures from Trees and Graphs.

**SDG Alignment:** SDG 12 — Responsible Consumption and Production

## Problem

Lost/found/share posts today live scattered across chat groups and noticeboards. A match depends on two people seeing the same post at the same time, and posts vanish from view within hours. Reports also aren't independent — one found item can match several lost reports, and a single report can belong to multiple categories (a "blue bottle" is Bottles + Sports Block + Hostel-3 at once).

## Approach

| Concept | Role in this project |
|---|---|
| Binary Search Tree (BST) | Core store — item keyword as key, status/date/location as data. Insert, search, status-update. |
| AVL Tree | Keeps the store balanced when reports arrive in near-sorted bursts (repeated item types after events). |
| Tree Traversals (in/pre/post-order) | In-order → alphabetical browse list. Pre-order → save/reload between sessions. Post-order → teardown. |
| Binary Heap | Reports heapified on an urgency score so the most urgent sits at the root. |
| Priority Queue + Heap Sort | Extracts Top-N urgent reports for a dashboard; Heap Sort produces the full ranked list. |
| Adjacency List | Links related reports (a found item to lost reports it might match, shared category/location). Sparse — memory stays proportional to real matches. |
| Adjacency Matrix | Used only for the small, fixed hostel-block/department grid, where dense O(1) lookup is worth the O(V²) space. |

Deliberately **not** used: plain/unbalanced BST, array representation of the tree, BST deletion (items are marked "Claimed," not removed), threaded binary trees, directed/weighted graphs — each with a stated reason in the project report.

## Status

Currently ~25% complete: report-node design finalized, initial BST insert/search/status-update coded and tested.

**Next up:** full BST test coverage + keyword normalization, BST → AVL conversion with rotation cases, heap + Priority Queue with Heap Sort for Top-10 urgency ranking, Adjacency List for related reports.

## Getting Started

> Update this section once the runtime/build steps are finalized.

```bash
git clone https://github.com/Vikaspal505/-Campus-Lost-Found-Peer-to-Peer-Resource-Sharing-.git
cd -Campus-Lost-Found-Peer-to-Peer-Resource-Sharing-
# install steps / run command go here
```

## Author

Vikas Pal — BTech CSE-F, NIET Greater Noida

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const container = document.getElementById("issuesContainer");
const loader = document.getElementById("loader");
const issueModal = document.getElementById("issueModal");
let allIssues = [];

async function loadIssues() {
    loader.style.display = "block";
    container.innerHTML = "";
    try {
        const res = await fetch(API);
        const result = await res.json();
        allIssues = result.data || [];
        displayIssues(allIssues);
        updateStats(allIssues);
    } catch (error) {
        console.log(error);
    }
    loader.style.display = "none";
}

function displayIssues(issues) {
    container.innerHTML = "";

    if (issues.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280; font-size: 14px;">No issues match your criteria.</div>`;
        return;
    }

    issues.forEach(issue => {
        const card = document.createElement("div");
        const isOpen = (issue.status || "").toLowerCase() === "open";
        
        card.className = `card ${isOpen ? "open-card" : "closed-card"}`;

        let prioBg = "#fee2e2"; 
        let prioColor = "#ef4444";
        const prioText = (issue.priority || "").toLowerCase();
        
        if (prioText === "medium") { 
            prioBg = "#fef3c7"; 
            prioColor = "#d97706"; 
        } else if (prioText === "low") { 
            prioBg = "#f3f4f6"; 
            prioColor = "#6b7280"; 
        }

        let labelsHtml = "";
        const labelText = (issue.label || "").toLowerCase();
        
        if (labelText === "bug") {
            labelsHtml = `
                <span class="tag tag-bug" style="display: inline-flex; align-items: center; gap: 4px;">🎯 BUG</span>
                <span class="tag tag-help" style="background: #fef3c7; color: #d97706; display: inline-flex; align-items: center; gap: 4px;">🤝 HELP WANTED</span>
            `;
        } else if (labelText === "enhancement") {
            labelsHtml = `<span class="tag tag-enhancement" style="display: inline-flex; align-items: center; gap: 4px;">✨ ENHANCEMENT</span>`;
        } else {
            labelsHtml = `<span class="tag tag-default" style="display: inline-flex; align-items: center; gap: 4px;">📌 ${issue.label || "ISSUE"}</span>`;
        }

        card.innerHTML = `
            <!-- CARD TOP UTILITY ROW -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <img src="${isOpen ? 'assets/Open-Status.png' : 'assets/Closed- Status .png'}" alt="Status" height="18" width="18" style="object-fit: contain;">
                <span style="font-size: 10px; font-weight: bold; padding: 4px 12px; border-radius: 20px; background: ${prioBg}; color: ${prioColor}; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${issue.priority || "LOW"}
                </span>
            </div>

            <!-- TITLE & TEXT BLOCKS -->
            <h3 class="card h3" style="font-size: 14px; font-weight: 600; margin-bottom: 8px; line-height: 1.4; color: #111827;">
                ${issue.title}
            </h3>
            
            <p class="description-text" style="font-size: 12px; color: #6b7280; line-height: 1.5; margin-bottom: 14px; flex-grow: 1;">
                ${issue.description ? issue.description.slice(0, 80) + "..." : "No description provided."}
            </p>

            <!-- LABEL ACCENT GRID ROW -->
            <div class="badges-row" style="display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap;">
                ${labelsHtml}
            </div>

            <!-- LOWER SEPARATOR PROFILE FOOTER -->
            <div class="card-footer" style="border-top: 1px solid #f3f4f6; padding-top: 12px; font-size: 11px; color: #9ca3af;">
                <p style="margin-bottom: 4px; font-weight: 500; color: #6b7280;">#1 by ${issue.author || "anonymous"}</p>
                <p style="color: #9ca3af;">${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-US') : "Recent"}</p>
            </div>
        `;

        card.addEventListener("click", () => showIssue(issue.id));
        container.appendChild(card);
    });
}

function updateStats(data) {
    document.getElementById("issueCount").textContent = data.length;

    const openCount = data.filter(
        issue => issue.status.toLowerCase() === "open"
    ).length;

    const closedCount = data.filter(
        issue => issue.status.toLowerCase() === "closed"
    ).length;

    document.getElementById("openCount").textContent = `Open: ${openCount}`;
    document.getElementById("closedCount").textContent = `Closed: ${closedCount}`;
}

async function showIssue(id) {
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const result = await res.json();
        const issue = result.data;

        const statusLower = (issue.status || "").toLowerCase();
        const isOpen = statusLower === "open";
        
        let tagClass = "tag-default";
        const labelText = (issue.label || "").toLowerCase();
        if (labelText === "bug") tagClass = "tag-bug";
        else if (labelText === "help wanted") tagClass = "tag-help";
        else if (labelText === "enhancement") tagClass = "tag-enhancement";

        let prioClass = "prio-low";
        const prioText = (issue.priority || "").toLowerCase();
        if (prioText === "high") prioClass = "prio-high";
        else if (prioText === "medium") prioClass = "prio-medium";

        document.getElementById("modalContent").innerHTML = `
            <div class="modal-body">
                <div class="modal-header">
                    <h2>${issue.title}</h2>
                    <div class="modal-meta-row" style="gap: 10px; display: flex; align-items: center;">
                        <img src="${isOpen ? 'assets/Open-Status.png' : 'assets/Closed- Status .png'}" alt="${issue.status}" height="20" style="object-fit: contain;">
                        <span class="modal-meta-text">
                            Opened by <b>${issue.author}</b> • ${new Date(issue.createdAt).toLocaleDateString('en-GB')}
                        </span>
                    </div>
                </div>

                <div class="modal-tags">
                    <span class="tag ${tagClass}">${issue.label}</span>
                </div>

                <div class="modal-desc">
                    ${issue.description || "No description provided."}
                </div>

                <div class="modal-grid-info">
                    <div class="info-block">
                        <label>Assignee:</label>
                        <div class="value">${issue.author}</div>
                    </div>
                    <div class="info-block">
                        <label>Priority:</label>
                        <div>
                            <span class="priority-pill ${prioClass}">${issue.priority}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="modal-close-btn" onclick="issueModal.close()">Close</button>
                </div>
            </div>
        `;

        issueModal.showModal();
    } catch (error) {
        console.log(error);
    }
}

document.getElementById("allBtn").addEventListener("click", () => {
    setActive("allBtn");
    displayIssues(allIssues);
    document.getElementById("issueCount").textContent = allIssues.length;
});

document.getElementById("openBtn").addEventListener("click", () => {
    setActive("openBtn");
    const openIssues = allIssues.filter(
        issue => issue.status.toLowerCase() === "open"
    );
    displayIssues(openIssues);
    document.getElementById("issueCount").textContent = openIssues.length;
});

document.getElementById("closedBtn").addEventListener("click", () => {
    setActive("closedBtn");
    const closedIssues = allIssues.filter(
        issue => issue.status.toLowerCase() === "closed"
    );
    displayIssues(closedIssues);
    document.getElementById("issueCount").textContent = closedIssues.length;
});

function setActive(id) {
    document.querySelectorAll(".tab").forEach(btn => {
        btn.classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
}

document.getElementById("searchInput").addEventListener("input", async (e) => {
    const text = e.target.value.trim();

    if (!text) {
        displayIssues(allIssues);
        document.getElementById("issueCount").textContent = allIssues.length;
        return;
    }

    try {
        const res = await fetch( `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
        const result = await res.json();
        const searchResults = result.data || [];
        displayIssues(searchResults);
        document.getElementById("issueCount").textContent = searchResults.length;


        
    } catch (error) {
        console.log(error);
    }
});

loadIssues();

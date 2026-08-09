const assignments = [
    {
        id: 1,
        title: "Database Management CAT",
        course: "Database Systems",
        dueDate: "2026-08-20",
        priority: "high",
        description:
            "Design and normalize a database for the assigned case study."
    },
    {
        id: 2,
        title: "Networks Assignment",
        course: "Computer Networks",
        dueDate: "2026-08-25",
        priority: "medium",
        description:
            "Analyze the network topology provided in the assignment brief."
    }
];

const assignmentForm = document.getElementById("assignment-form");
const assignmentList = document.getElementById("assignment-list");
const assignmentCount = document.querySelector(".assignment-count");
const formTitle = document.getElementById("form-title");
const submitButton = document.querySelector(".submit-button");


function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


function getPriorityLabel(priority) {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
}


function renderAssignments() {
    assignmentList.innerHTML = "";

    assignmentCount.textContent =
        `${assignments.length} ${
            assignments.length === 1
                ? "assignment"
                : "assignments"
        }`;

    assignments.forEach((assignment) => {
        const article = document.createElement("article");

        article.className = "assignment-card";

        article.innerHTML = `
            <div class="assignment-card-header">

                <div>
                    <h3>${assignment.title}</h3>

                    <p class="assignment-course">
                        ${assignment.course}
                    </p>
                </div>

                <span class="priority-badge priority-${assignment.priority}">
                    ${getPriorityLabel(assignment.priority)}
                </span>

            </div>

            <p class="assignment-description">
                ${assignment.description}
            </p>

            <div class="assignment-meta">

                <div class="assignment-meta-info">

                    <span>
                        Due: ${formatDate(assignment.dueDate)}
                    </span>

                    <span class="assignment-status status-pending">
                        Pending
                    </span>

                </div>

                <button
                    type="button"
                    class="edit-button"
                    data-assignment-id="${assignment.id}"
                >
                    Edit
                </button>

            </div>
        `;

        assignmentList.appendChild(article);
    });

    attachEditListeners();
}


function attachEditListeners() {
    const editButtons =
        document.querySelectorAll(".edit-button");

    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const assignmentId =
                Number(button.dataset.assignmentId);

            editAssignment(assignmentId);
        });
    });
}


function editAssignment(id) {
    const assignment =
        assignments.find((item) => item.id === id);

    if (!assignment) {
        return;
    }

    document.getElementById("assignment-title").value =
        assignment.title;

    document.getElementById("course").value =
        assignment.course;

    document.getElementById("due-date").value =
        assignment.dueDate;

    document.getElementById("priority").value =
        assignment.priority;

    document.getElementById("description").value =
        assignment.description;

    assignmentForm.dataset.editingId = id;

    formTitle.textContent = "Edit Assignment";

    submitButton.textContent = "Save Changes";

    assignmentForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


assignmentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const editingId =
        Number(assignmentForm.dataset.editingId);

    if (!editingId) {
        return;
    }

    const assignment =
        assignments.find((item) => item.id === editingId);

    if (!assignment) {
        return;
    }

    assignment.title =
        document.getElementById("assignment-title").value;

    assignment.course =
        document.getElementById("course").value;

    assignment.dueDate =
        document.getElementById("due-date").value;

    assignment.priority =
        document.getElementById("priority").value;

    assignment.description =
        document.getElementById("description").value;

    delete assignmentForm.dataset.editingId;

    formTitle.textContent = "Add New Assignment";

    submitButton.textContent = "Add Assignment";

    assignmentForm.reset();

    renderAssignments();
});


renderAssignments();
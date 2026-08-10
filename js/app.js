const courses = [
    "Database Systems",
    "Computer Networks",
    "Web Development",
    "Cloud Computing",
    "Software Engineering"
];
const assignments = [
    {
        id: 1,
        title: "Database Management CAT",
        course: "Database Systems",
        dueDate: "2026-08-20",
        priority: "high",
        description:
            "Design and normalize a database for the assigned case study.",
        completed: false
    },
    {
        id: 2,
        title: "Networks Assignment",
        course: "Computer Networks",
        dueDate: "2026-08-25",
        priority: "medium",
        description:
            "Analyze the network topology provided in the assignment brief.",
        completed: false
    }
];

const assignmentForm = document.getElementById("assignment-form");
const assignmentList = document.getElementById("assignment-list");
const assignmentCount = document.querySelector(".assignment-count");
const formTitle = document.getElementById("form-title");
const submitButton = document.querySelector(".submit-button");
const courseSelect = document.getElementById("course");
const searchInput = document.getElementById("assignment-search");

function populateCourses() {
    courses.forEach((course) => {
        const option = document.createElement("option");

        option.value = course;
        option.textContent = course;

        courseSelect.appendChild(option);
    });
}

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
function searchAssignments(query) {
    const normalizedQuery =
        query.trim().toLowerCase();

    if (!normalizedQuery) {
        return assignments;
    }

    return assignments.filter((assignment) => {
        const title =
            assignment.title.toLowerCase();

        const course =
            assignment.course.toLowerCase();

        return (
            title.includes(normalizedQuery) ||
            course.includes(normalizedQuery)
        );
    });
}

function renderAssignments() {
    assignmentList.innerHTML = "";

    const filteredAssignments =
        searchAssignments(searchInput.value);

    assignmentCount.textContent =
        `${filteredAssignments.length} ${
            filteredAssignments.length === 1
                ? "assignment"
                : "assignments"
        }`;

    filteredAssignments.forEach((assignment) => {
        const article = document.createElement("article");

        article.className =
            `assignment-card ${
                assignment.completed
                    ? "assignment-completed"
                    : ""
            }`;

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

                    <span class="assignment-status ${
                        assignment.completed
                            ? "status-completed"
                            : "status-pending"
                    }">
                        ${
                            assignment.completed
                                ? "Completed"
                                : "Pending"
                        }
                    </span>

                </div>

                <div class="assignment-actions">

                    <button
                        type="button"
                        class="complete-button"
                        data-assignment-id="${assignment.id}"
                    >
                        ${
                            assignment.completed
                                ? "Mark Pending"
                                : "Complete"
                        }
                    </button>

                    <button
                        type="button"
                        class="edit-button"
                        data-assignment-id="${assignment.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-button"
                        data-assignment-id="${assignment.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

        assignmentList.appendChild(article);
    });

    attachAssignmentListeners();
}


function attachAssignmentListeners() {
    const editButtons =
        document.querySelectorAll(".edit-button");

    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const assignmentId =
                Number(button.dataset.assignmentId);

            editAssignment(assignmentId);
        });
    });


    const deleteButtons =
        document.querySelectorAll(".delete-button");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const assignmentId =
                Number(button.dataset.assignmentId);

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this assignment?"
                );

            if (confirmed) {
                deleteAssignment(assignmentId);
            }
        });
    });


    const completeButtons =
        document.querySelectorAll(".complete-button");

    completeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const assignmentId =
                Number(button.dataset.assignmentId);

            toggleAssignmentCompletion(assignmentId);
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


function deleteAssignment(id) {
    const assignmentIndex =
        assignments.findIndex((item) => item.id === id);

    if (assignmentIndex === -1) {
        return;
    }

    assignments.splice(assignmentIndex, 1);

    renderAssignments();
}


function toggleAssignmentCompletion(id) {
    const assignment =
        assignments.find((item) => item.id === id);

    if (!assignment) {
        return;
    }

    assignment.completed = !assignment.completed;

    renderAssignments();
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
searchInput.addEventListener("input", () => {
    renderAssignments();
});

populateCourses();
renderAssignments();
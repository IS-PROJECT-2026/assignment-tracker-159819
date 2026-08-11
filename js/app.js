const STORAGE_KEY = "assignmentTracker.assignments";


const defaultAssignments = [
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


const courses = [
    "Database Systems",
    "Computer Networks",
    "Web Development",
    "Cloud Computing",
    "Software Engineering"
];


/*
 * Load assignments from localStorage.
 *
 * If saved data exists and is valid, use it.
 * Otherwise, use the default assignments.
 */
function loadAssignments() {

    try {

        const savedAssignments =
            localStorage.getItem(STORAGE_KEY);


        if (!savedAssignments) {
            return [...defaultAssignments];
        }


        const parsedAssignments =
            JSON.parse(savedAssignments);


        if (!Array.isArray(parsedAssignments)) {
            return [...defaultAssignments];
        }


        return parsedAssignments;

    } catch (error) {

        console.error(
            "Unable to load assignments from localStorage:",
            error
        );


        return [...defaultAssignments];
    }
}


/*
 * Save the current assignments array
 * to localStorage.
 */
function saveAssignments() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(assignments)
        );

    } catch (error) {

        console.error(
            "Unable to save assignments to localStorage:",
            error
        );
    }
}


/*
 * Application data.
 *
 * The data is loaded from localStorage
 * when the application starts.
 */
const assignments = loadAssignments();


const assignmentForm =
    document.getElementById("assignment-form");

const assignmentList =
    document.getElementById("assignment-list");

const assignmentCount =
    document.querySelector(".assignment-count");

const formTitle =
    document.getElementById("form-title");

const submitButton =
    document.querySelector(".submit-button");

const courseSelect =
    document.getElementById("course");

const searchInput =
    document.getElementById("assignment-search");

const courseFilter =
    document.getElementById("course-filter");

const deadlineSort =
    document.getElementById("deadline-sort");


/* Statistics elements */

const totalStat =
    document.getElementById("total-stat");

const pendingStat =
    document.getElementById("pending-stat");

const completedStat =
    document.getElementById("completed-stat");

const overdueStat =
    document.getElementById("overdue-stat");

const completionRateStat =
    document.getElementById("completion-rate-stat");


/* Progress elements */

const progressText =
    document.getElementById("progress-text");

const progressPercentage =
    document.getElementById("progress-percentage");

const progressBar =
    document.getElementById("progress-bar");

const assignmentProgress =
    document.getElementById("assignment-progress");


/* Validation elements */

const titleInput =
    document.getElementById("assignment-title");

const dueDateInput =
    document.getElementById("due-date");

const priorityInput =
    document.getElementById("priority");

const descriptionInput =
    document.getElementById("description");


function populateCourses() {

    courses.forEach((course) => {

        const formOption =
            document.createElement("option");

        formOption.value = course;
        formOption.textContent = course;

        courseSelect.appendChild(formOption);


        const filterOption =
            document.createElement("option");

        filterOption.value = course;
        filterOption.textContent = course;

        courseFilter.appendChild(filterOption);
    });
}


function formatDate(dateString) {

    const date =
        new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


function getPriorityLabel(priority) {

    return priority.charAt(0).toUpperCase()
        + priority.slice(1);
}


function isOverdue(assignment) {

    if (assignment.completed) {
        return false;
    }


    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const dueDate =
        new Date(`${assignment.dueDate}T00:00:00`);

    return dueDate < today;
}


function getTodayDateString() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");


    return `${year}-${month}-${day}`;
}


/* Validation */

function clearValidationErrors() {

    const errorElements =
        document.querySelectorAll(".form-error");


    errorElements.forEach((element) => {
        element.textContent = "";
    });


    const invalidFields =
        document.querySelectorAll(".input-invalid");


    invalidFields.forEach((field) => {
        field.classList.remove("input-invalid");
    });
}


function setValidationError(
    field,
    errorId,
    message
) {

    const errorElement =
        document.getElementById(errorId);


    errorElement.textContent =
        message;


    field.classList.add("input-invalid");
}


function validateAssignmentForm() {

    clearValidationErrors();


    let isValid = true;


    const title =
        titleInput.value.trim();

    const course =
        courseSelect.value;

    const dueDate =
        dueDateInput.value;

    const priority =
        priorityInput.value;

    const description =
        descriptionInput.value.trim();


    if (!title) {

        setValidationError(
            titleInput,
            "title-error",
            "Assignment title is required."
        );

        isValid = false;

    } else if (title.length < 3) {

        setValidationError(
            titleInput,
            "title-error",
            "Assignment title must be at least 3 characters."
        );

        isValid = false;
    }


    if (!course) {

        setValidationError(
            courseSelect,
            "course-error",
            "Please select a course."
        );

        isValid = false;
    }


    if (!dueDate) {

        setValidationError(
            dueDateInput,
            "due-date-error",
            "Due date is required."
        );

        isValid = false;

    } else if (dueDate < getTodayDateString()) {

        setValidationError(
            dueDateInput,
            "due-date-error",
            "Due date cannot be in the past."
        );

        isValid = false;
    }


    if (!priority) {

        setValidationError(
            priorityInput,
            "priority-error",
            "Please select a priority."
        );

        isValid = false;
    }


    if (!description) {

        setValidationError(
            descriptionInput,
            "description-error",
            "Assignment description is required."
        );

        isValid = false;

    } else if (description.length < 5) {

        setValidationError(
            descriptionInput,
            "description-error",
            "Description must be at least 5 characters."
        );

        isValid = false;
    }


    return isValid;
}


/* Search and filtering */

function getFilteredAssignments() {

    const searchQuery =
        searchInput.value.trim().toLowerCase();

    const selectedCourse =
        courseFilter.value;


    return assignments.filter((assignment) => {

        const matchesSearch =
            !searchQuery ||
            assignment.title
                .toLowerCase()
                .includes(searchQuery) ||
            assignment.course
                .toLowerCase()
                .includes(searchQuery);


        const matchesCourse =
            !selectedCourse ||
            assignment.course === selectedCourse;


        return matchesSearch && matchesCourse;
    });
}


function sortAssignments(assignmentsToSort) {

    const sortedAssignments =
        [...assignmentsToSort];


    if (deadlineSort.value === "latest") {

        sortedAssignments.sort((a, b) => {

            return new Date(b.dueDate)
                - new Date(a.dueDate);

        });

    } else {

        sortedAssignments.sort((a, b) => {

            return new Date(a.dueDate)
                - new Date(b.dueDate);

        });
    }


    return sortedAssignments;
}


/* Statistics */

function updateStatistics() {

    const total =
        assignments.length;


    const completed =
        assignments.filter(
            (assignment) => assignment.completed
        ).length;


    const pending =
        total - completed;


    const overdue =
        assignments.filter(
            (assignment) => isOverdue(assignment)
        ).length;


    const completionRate =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    totalStat.textContent =
        total;


    pendingStat.textContent =
        pending;


    completedStat.textContent =
        completed;


    overdueStat.textContent =
        overdue;


    completionRateStat.textContent =
        `${completionRate}%`;


    updateProgressIndicator(
        total,
        completed,
        completionRate
    );
}


function updateProgressIndicator(
    total,
    completed,
    completionRate
) {

    progressText.textContent =
        `${completed} of ${total} ${
            total === 1
                ? "assignment"
                : "assignments"
        } completed`;


    progressPercentage.textContent =
        `${completionRate}%`;


    progressBar.style.width =
        `${completionRate}%`;


    assignmentProgress.setAttribute(
        "aria-valuenow",
        completionRate
    );
}


/* Empty states */

function renderEmptyState(type) {

    const emptyState =
        document.createElement("div");

    emptyState.className =
        "empty-state";


    if (type === "no-assignments") {

        emptyState.innerHTML = `
            <h3>No assignments yet</h3>

            <p>
                Add your first assignment using
                the form above.
            </p>
        `;

    } else {

        emptyState.innerHTML = `
            <h3>No matching assignments</h3>

            <p>
                Try changing your search or
                course filter.
            </p>
        `;
    }


    assignmentList.appendChild(
        emptyState
    );
}


/* Assignment rendering */

function renderAssignments() {

    assignmentList.innerHTML = "";


    const filteredAssignments =
        getFilteredAssignments();


    const sortedAssignments =
        sortAssignments(
            filteredAssignments
        );


    assignmentCount.textContent =
        `${sortedAssignments.length} ${
            sortedAssignments.length === 1
                ? "assignment"
                : "assignments"
        }`;


    if (assignments.length === 0) {

        renderEmptyState(
            "no-assignments"
        );

        return;
    }


    if (sortedAssignments.length === 0) {

        renderEmptyState(
            "no-results"
        );

        return;
    }


    sortedAssignments.forEach((assignment) => {

        const article =
            document.createElement("article");


        const assignmentIsOverdue =
            isOverdue(assignment);


        article.className =
            `assignment-card ${
                assignment.completed
                    ? "assignment-completed"
                    : ""
            } ${
                assignmentIsOverdue
                    ? "assignment-overdue"
                    : ""
            }`;


        article.innerHTML = `

            <div class="assignment-card-header">

                <div>

                    <h3>
                        ${assignment.title}
                    </h3>

                    <p class="assignment-course">
                        ${assignment.course}
                    </p>

                </div>


                <span
                    class="priority-badge priority-${assignment.priority}"
                >
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


                    <span
                        class="assignment-status ${
                            assignment.completed
                                ? "status-completed"
                                : assignmentIsOverdue
                                    ? "status-overdue"
                                    : "status-pending"
                        }"
                    >
                        ${
                            assignment.completed
                                ? "Completed"
                                : assignmentIsOverdue
                                    ? "Overdue"
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
                Number(
                    button.dataset.assignmentId
                );

            editAssignment(assignmentId);
        });
    });


    const deleteButtons =
        document.querySelectorAll(".delete-button");


    deleteButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const assignmentId =
                Number(
                    button.dataset.assignmentId
                );


            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this assignment?"
                );


            if (confirmed) {
                deleteAssignment(
                    assignmentId
                );
            }
        });
    });


    const completeButtons =
        document.querySelectorAll(".complete-button");


    completeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const assignmentId =
                Number(
                    button.dataset.assignmentId
                );

            toggleAssignmentCompletion(
                assignmentId
            );
        });
    });
}


/* Assignment editing */

function editAssignment(id) {

    const assignment =
        assignments.find(
            (item) => item.id === id
        );


    if (!assignment) {
        return;
    }


    titleInput.value =
        assignment.title;


    courseSelect.value =
        assignment.course;


    dueDateInput.value =
        assignment.dueDate;


    priorityInput.value =
        assignment.priority;


    descriptionInput.value =
        assignment.description;


    assignmentForm.dataset.editingId =
        id;


    formTitle.textContent =
        "Edit Assignment";


    submitButton.textContent =
        "Save Changes";


    clearValidationErrors();


    assignmentForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* Assignment deletion */

function deleteAssignment(id) {

    const assignmentIndex =
        assignments.findIndex(
            (item) => item.id === id
        );


    if (assignmentIndex === -1) {
        return;
    }


    assignments.splice(
        assignmentIndex,
        1
    );


    saveAssignments();

    updateStatistics();

    renderAssignments();
}


/* Assignment completion */

function toggleAssignmentCompletion(id) {

    const assignment =
        assignments.find(
            (item) => item.id === id
        );


    if (!assignment) {
        return;
    }


    assignment.completed =
        !assignment.completed;


    saveAssignments();

    updateStatistics();

    renderAssignments();
}


/* Form submission */

assignmentForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        if (!validateAssignmentForm()) {

            const firstInvalidField =
                document.querySelector(
                    ".input-invalid"
                );


            if (firstInvalidField) {
                firstInvalidField.focus();
            }


            return;
        }


        const editingId =
            Number(
                assignmentForm.dataset.editingId
            );


        if (editingId) {

            const assignment =
                assignments.find(
                    (item) => item.id === editingId
                );


            if (!assignment) {
                return;
            }


            assignment.title =
                titleInput.value.trim();

            assignment.course =
                courseSelect.value;

            assignment.dueDate =
                dueDateInput.value;

            assignment.priority =
                priorityInput.value;

            assignment.description =
                descriptionInput.value.trim();

        } else {

            const newAssignment = {

                id:
                    Date.now(),

                title:
                    titleInput.value.trim(),

                course:
                    courseSelect.value,

                dueDate:
                    dueDateInput.value,

                priority:
                    priorityInput.value,

                description:
                    descriptionInput.value.trim(),

                completed:
                    false
            };


            assignments.push(
                newAssignment
            );
        }


        /*
         * Persist the updated data after
         * either creating or editing.
         */
        saveAssignments();


        delete assignmentForm.dataset.editingId;


        formTitle.textContent =
            "Add New Assignment";


        submitButton.textContent =
            "Add Assignment";


        assignmentForm.reset();


        clearValidationErrors();


        updateStatistics();

        renderAssignments();
    }
);


/* Search */

searchInput.addEventListener(
    "input",
    () => {
        renderAssignments();
    }
);


/* Course filter */

courseFilter.addEventListener(
    "change",
    () => {
        renderAssignments();
    }
);


/* Deadline sort */

deadlineSort.addEventListener(
    "change",
    () => {
        renderAssignments();
    }
);


/* Application startup */

populateCourses();

updateStatistics();

renderAssignments();
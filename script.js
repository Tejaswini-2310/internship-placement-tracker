// =====================================================
// SKILL2HIRE
// INTERNSHIP APPLICATION TRACKER
// =====================================================


// =====================================================
// APPLICATION ELEMENTS
// =====================================================

const form =
    document.getElementById("applicationForm");

const applicationTable =
    document.getElementById("applicationTable");

const totalApplications =
    document.getElementById("totalApplications");

const totalAssessments =
    document.getElementById("totalAssessments");

const totalInterviews =
    document.getElementById("totalInterviews");

const totalOffers =
    document.getElementById("totalOffers");

const searchInput =
    document.getElementById("searchInput");

const filterStatus =
    document.getElementById("filterStatus");

const submitButton =
    document.getElementById("submitButton");

const cancelButton =
    document.getElementById("cancelButton");

const formTitle =
    document.getElementById("formTitle");


// =====================================================
// DASHBOARD ELEMENTS
// =====================================================

const savedCount =
    document.getElementById("savedCount");

const appliedCount =
    document.getElementById("appliedCount");

const assessmentCount =
    document.getElementById("assessmentCount");

const interviewCount =
    document.getElementById("interviewCount");

const selectedCount =
    document.getElementById("selectedCount");

const rejectedCount =
    document.getElementById("rejectedCount");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const activeApplications =
    document.getElementById("activeApplications");

const completedApplications =
    document.getElementById("completedApplications");

const deadlineList =
    document.getElementById("deadlineList");

const deadlineMessage =
    document.getElementById("deadlineMessage");


// =====================================================
// PROFILE ELEMENTS
// =====================================================

const profileForm =
    document.getElementById("profileForm");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileDegree =
    document.getElementById("profileDegree");

const profileBranch =
    document.getElementById("profileBranch");

const profileCollege =
    document.getElementById("profileCollege");

const profileSkills =
    document.getElementById("profileSkills");

const profileGithub =
    document.getElementById("profileGithub");

const profileLinkedin =
    document.getElementById("profileLinkedin");

const profileMessage =
    document.getElementById("profileMessage");


// =====================================================
// LOAD APPLICATIONS
// =====================================================

let applications =
    JSON.parse(
        localStorage.getItem("applications")
    ) || [];


// =====================================================
// EDIT MODE
// =====================================================

let editingIndex = -1;


// =====================================================
// STATUS TEXT
// =====================================================

const statusText = {

    saved: "Saved",

    applied: "Applied",

    assessment: "Assessment",

    interview: "Interview",

    selected: "Selected",

    rejected: "Rejected"

};


// =====================================================
// DISPLAY APPLICATIONS
// =====================================================

function displayApplications() {

    applicationTable.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        filterStatus.value;


    const filteredApplications =
        applications.filter(
            function(application) {

                const companyMatch =
                    application.company
                        .toLowerCase()
                        .includes(searchText);


                const roleMatch =
                    application.role
                        .toLowerCase()
                        .includes(searchText);


                const matchesSearch =
                    companyMatch ||
                    roleMatch;


                const matchesStatus =
                    selectedStatus === "all" ||
                    application.status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    if (
        filteredApplications.length === 0
    ) {

        applicationTable.innerHTML = `

            <tr>

                <td colspan="7">

                    No matching applications found.

                </td>

            </tr>

        `;

        return;

    }


    filteredApplications.forEach(
        function(application) {

            const originalIndex =
                applications.indexOf(
                    application
                );


            const newRow =
                document.createElement("tr");


            let jobButton = "";


            if (
                application.jobLink &&
                application.jobLink.trim() !== ""
            ) {

                jobButton = `

                    <button
                        type="button"
                        class="job-button"
                        onclick="openJobLink(${originalIndex})"
                    >
                        View Job
                    </button>

                `;

            } else {

                jobButton = `
                    <span class="no-data">
                        No Link
                    </span>
                `;

            }


            let notesButton = "";


            if (
                application.notes &&
                application.notes.trim() !== ""
            ) {

                notesButton = `

                    <button
                        type="button"
                        class="notes-button"
                        onclick="viewNotes(${originalIndex})"
                    >
                        View Notes
                    </button>

                `;

            } else {

                notesButton = `
                    <span class="no-data">
                        No Notes
                    </span>
                `;

            }


            newRow.innerHTML = `

                <td>
                    ${escapeHTML(application.company)}
                </td>

                <td>
                    ${escapeHTML(application.role)}
                </td>

                <td>

                    <span
                        class="status ${application.status}"
                    >

                        ${statusText[application.status]}

                    </span>

                </td>

                <td>
                    ${formatDate(application.deadline)}
                </td>

                <td>
                    ${jobButton}
                </td>

                <td>
                    ${notesButton}
                </td>

                <td>

                    <button
                        type="button"
                        class="edit-button"
                        onclick="editApplication(${originalIndex})"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-button"
                        onclick="deleteApplication(${originalIndex})"
                    >
                        Delete
                    </button>

                </td>

            `;


            applicationTable.appendChild(
                newRow
            );

        }
    );

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(date) {

    if (!date) {

        return "";

    }


    const parts =
        date.split("-");


    if (
        parts.length !== 3
    ) {

        return date;

    }


    return (
        parts[2] +
        "-" +
        parts[1] +
        "-" +
        parts[0]
    );

}


// =====================================================
// ADD / UPDATE APPLICATION
// =====================================================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const company =
            document
                .getElementById("company")
                .value
                .trim();


        const role =
            document
                .getElementById("role")
                .value
                .trim();


        const applicationDate =
            document
                .getElementById("application-date")
                .value;


        const deadline =
            document
                .getElementById("deadline")
                .value;


        const status =
            document
                .getElementById("status")
                .value;


        const jobLink =
            document
                .getElementById("job-link")
                .value
                .trim();


        const notes =
            document
                .getElementById("notes")
                .value
                .trim();


        if (
            company === "" ||
            role === "" ||
            applicationDate === "" ||
            deadline === ""
        ) {

            alert(
                "Please fill in all required fields."
            );

            return;

        }


        const application = {

            company: company,

            role: role,

            applicationDate: applicationDate,

            deadline: deadline,

            status: status,

            jobLink: jobLink,

            notes: notes

        };


        if (
            editingIndex === -1
        ) {

            applications.push(
                application
            );


            alert(
                "Application added successfully!"
            );

        } else {

            applications[editingIndex] =
                application;


            alert(
                "Application updated successfully!"
            );

        }


        saveApplications();

        displayApplications();

        updateStatistics();

        updateDashboard();

        resetForm();

    }
);


// =====================================================
// EDIT APPLICATION
// =====================================================

function editApplication(index) {

    const application =
        applications[index];


    document.getElementById("company").value =
        application.company;


    document.getElementById("role").value =
        application.role;


    document.getElementById("application-date").value =
        application.applicationDate;


    document.getElementById("deadline").value =
        application.deadline;


    document.getElementById("status").value =
        application.status;


    document.getElementById("job-link").value =
        application.jobLink;


    document.getElementById("notes").value =
        application.notes;


    editingIndex = index;


    formTitle.textContent =
        "Edit Application";


    submitButton.textContent =
        "Save Changes";


    cancelButton.style.display =
        "block";


    form.scrollIntoView({
        behavior: "smooth"
    });

}


// =====================================================
// CANCEL EDIT
// =====================================================

cancelButton.addEventListener(
    "click",
    function() {

        resetForm();

    }
);


// =====================================================
// RESET FORM
// =====================================================

function resetForm() {

    form.reset();

    editingIndex = -1;

    formTitle.textContent =
        "Add Application";

    submitButton.textContent =
        "Add Application";

    cancelButton.style.display =
        "none";

}


// =====================================================
// DELETE APPLICATION
// =====================================================

function deleteApplication(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!confirmDelete) {

        return;

    }


    applications.splice(
        index,
        1
    );


    saveApplications();

    displayApplications();

    updateStatistics();

    updateDashboard();

}


// =====================================================
// OPEN JOB LINK
// =====================================================

function openJobLink(index) {

    const application =
        applications[index];


    if (
        !application.jobLink ||
        application.jobLink.trim() === ""
    ) {

        alert(
            "No job link is available."
        );

        return;

    }


    let link =
        application.jobLink.trim();


    if (
        !link.startsWith("http://") &&
        !link.startsWith("https://")
    ) {

        link =
            "https://" + link;

    }


    window.open(
        link,
        "_blank"
    );

}


// =====================================================
// VIEW NOTES
// =====================================================

function viewNotes(index) {

    const application =
        applications[index];


    if (
        !application.notes ||
        application.notes.trim() === ""
    ) {

        alert(
            "No notes available."
        );

        return;

    }


    alert(
        "Notes for " +
        application.company +
        ":\n\n" +
        application.notes
    );

}


// =====================================================
// SAVE APPLICATIONS
// =====================================================

function saveApplications() {

    localStorage.setItem(
        "applications",
        JSON.stringify(
            applications
        )
    );

}


// =====================================================
// UPDATE BASIC STATISTICS
// =====================================================

function updateStatistics() {

    totalApplications.textContent =
        applications.length;


    const assessment =
        countStatus("assessment");


    const interview =
        countStatus("interview");


    const selected =
        countStatus("selected");


    totalAssessments.textContent =
        assessment;


    totalInterviews.textContent =
        interview;


    totalOffers.textContent =
        selected;

}


// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    const saved =
        countStatus("saved");


    const applied =
        countStatus("applied");


    const assessment =
        countStatus("assessment");


    const interview =
        countStatus("interview");


    const selected =
        countStatus("selected");


    const rejected =
        countStatus("rejected");


    savedCount.textContent =
        saved;


    appliedCount.textContent =
        applied;


    assessmentCount.textContent =
        assessment;


    interviewCount.textContent =
        interview;


    selectedCount.textContent =
        selected;


    rejectedCount.textContent =
        rejected;


    const active =
        saved +
        applied +
        assessment +
        interview;


    const completed =
        selected +
        rejected;


    activeApplications.textContent =
        active;


    completedApplications.textContent =
        completed;


    let progress = 0;


    if (
        applications.length > 0
    ) {

        progress =
            Math.round(
                (
                    completed /
                    applications.length
                ) * 100
            );

    }


    progressBar.style.width =
        progress + "%";


    progressText.textContent =
        progress +
        "% of applications are completed";


    updateDeadlines();

}


// =====================================================
// COUNT STATUS
// =====================================================

function countStatus(status) {

    return applications.filter(
        function(application) {

            return (
                application.status === status
            );

        }
    ).length;

}


// =====================================================
// DEADLINES
// =====================================================

function updateDeadlines() {

    deadlineList.innerHTML = "";


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const upcoming =
        applications
            .filter(
                function(application) {

                    if (
                        !application.deadline
                    ) {

                        return false;

                    }


                    if (
                        application.status === "selected" ||
                        application.status === "rejected"
                    ) {

                        return false;

                    }


                    const deadline =
                        new Date(
                            application.deadline +
                            "T00:00:00"
                        );


                    return (
                        deadline >= today
                    );

                }
            )
            .sort(
                function(a, b) {

                    return (
                        new Date(a.deadline) -
                        new Date(b.deadline)
                    );

                }
            )
            .slice(0, 5);


    if (
        upcoming.length === 0
    ) {

        deadlineMessage.textContent =
            "You're all caught up! 🎉";


        deadlineList.innerHTML = `

            <div class="no-deadlines">

                No upcoming deadlines.

            </div>

        `;

        return;

    }


    deadlineMessage.textContent =
        upcoming.length +
        " upcoming";


    upcoming.forEach(
        function(application) {

            const deadline =
                new Date(
                    application.deadline +
                    "T00:00:00"
                );


            const difference =
                Math.ceil(
                    (
                        deadline -
                        today
                    ) /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                );


            let urgencyClass =
                "normal";


            let urgencyText =
                difference +
                " days left";


            if (
                difference === 0
            ) {

                urgencyClass =
                    "urgent";

                urgencyText =
                    "Due today";

            }

            else if (
                difference <= 3
            ) {

                urgencyClass =
                    "urgent";

            }

            else if (
                difference <= 7
            ) {

                urgencyClass =
                    "soon";

            }


            const deadlineItem =
                document.createElement("div");


            deadlineItem.className =
                "deadline-item " +
                urgencyClass;


            deadlineItem.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            application.company
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            application.role
                        )}
                    </span>

                </div>


                <div class="deadline-date">

                    ${formatDate(
                        application.deadline
                    )}

                    <small>
                        ${urgencyText}
                    </small>

                </div>

            `;


            deadlineList.appendChild(
                deadlineItem
            );

        }
    );

}


// =====================================================
// PROFILE
// =====================================================

let profile =
    JSON.parse(
        localStorage.getItem("profile")
    ) || {};


// =====================================================
// LOAD PROFILE
// =====================================================

function loadProfile() {

    profileName.value =
        profile.name || "";


    profileEmail.value =
        profile.email || "";


    profileDegree.value =
        profile.degree || "";


    profileBranch.value =
        profile.branch || "";


    profileCollege.value =
        profile.college || "";


    profileSkills.value =
        profile.skills || "";


    profileGithub.value =
        profile.github || "";


    profileLinkedin.value =
        profile.linkedin || "";

}


// =====================================================
// SAVE PROFILE
// =====================================================

profileForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        profile = {

            name:
                profileName.value.trim(),

            email:
                profileEmail.value.trim(),

            degree:
                profileDegree.value.trim(),

            branch:
                profileBranch.value.trim(),

            college:
                profileCollege.value.trim(),

            skills:
                profileSkills.value.trim(),

            github:
                profileGithub.value.trim(),

            linkedin:
                profileLinkedin.value.trim()

        };


        localStorage.setItem(
            "profile",
            JSON.stringify(profile)
        );


        profileMessage.textContent =
            "Profile saved successfully! ✓";


        setTimeout(
            function() {

                profileMessage.textContent =
                    "";

            },
            3000
        );

    }
);


// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener(
    "input",
    function() {

        displayApplications();

    }
);


// =====================================================
// FILTER
// =====================================================

filterStatus.addEventListener(
    "change",
    function() {

        displayApplications();

    }
);


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadProfile();

displayApplications();

updateStatistics();

updateDashboard();

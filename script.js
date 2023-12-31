function scrollToTop() {
// Scroll to the top of the page
document.querySelector('html, body').scrollTop = 0;
}

function scrollToOffset(offset) {
// Scroll to a specific offset from the top of the page
document.querySelector('html, body').scrollTop = offset;
}

function scrollToElement(elementId) {
// Scroll to a specific element
const element = document.getElementById(elementId);
if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
}

class Student {
constructor(course, id, name, midterm, final, gradingScale) {
    this.course = course;
    this.id = id;
    this.name = name;
    this.midterm = midterm;
    this.final = final;
    this.gradingScale = gradingScale;
    this.grade = this.calculateLetterGrade();
}

calculateLetterGrade() {
    if (this.gradingScale === "10Scale") {
        return this.calculateLetterGrade10Scale();
    } else if (this.gradingScale === "7Scale") {
        return this.calculateLetterGrade7Scale();
    } else {
        // Default to using 10Scale
        return this.calculateLetterGrade10Scale();
    }
}

calculateLetterGrade10Scale() {
    const weightedAverage = 0.4 * this.midterm + 0.6 * this.final;
    let letterGrade;

    if (weightedAverage >= 90) {
        letterGrade = "A";
    } else if (weightedAverage >= 80) {
        letterGrade = "B";
    } else if (weightedAverage >= 70) {
        letterGrade = "C";
    } else if (weightedAverage >= 60) {
        letterGrade = "D";
    } else {
        letterGrade = "F";
    }

    return letterGrade;
}

calculateLetterGrade7Scale() {
    const weightedAverage = 0.4 * this.midterm + 0.6 * this.final;
    let letterGrade;

    if (weightedAverage >= 93) {
        letterGrade = "A";
    } else if (weightedAverage >= 85) {
        letterGrade = "B";
    } else if (weightedAverage >= 77) {
        letterGrade = "C";
    } else if (weightedAverage >= 70) {
        letterGrade = "D";
    } else {
        letterGrade = "F";
    }

    return letterGrade;
}
}

function addStudent() {
const selectedCourseName = document.getElementById("selectedCourse").value;
const studentID = document.getElementById("studentID").value;
const studentName = document.getElementById("studentName").value;
const midtermScore = parseFloat(document.getElementById("midtermScore").value);
const finalScore = parseFloat(document.getElementById("finalScore").value);

// Check: Are scores between 0 and 100?
if (isNaN(midtermScore) || isNaN(finalScore) || midtermScore < 0 || midtermScore > 100 || finalScore < 0 || finalScore > 100) {
    alert("Midterm and final scores must be numbers between 0 and 100.");
    return;
}

const gradingScale = document.querySelector('input[name="gradingScale"]:checked').value;

// Find the selected course or create a new one if not found
let selectedCourse = courses.find(course => course.name === selectedCourseName);

if (!selectedCourse) {
    // If the course is not found, create a new one with a default value
    selectedCourse = {
        name: selectedCourseName,
        gradingScale: "Default Grading Scale", // Change to a default value
        students: []
    };
    courses.push(selectedCourse);
}

if (!selectedCourse.students) {
    selectedCourse.students = []; // Ensure 'students' array exists
}

// Check: Have we reached the maximum number of students?
if (selectedCourse.students.length >= 80) {
    alert("Maximum number of students reached for this course (80 students).");
    return;
}

// Calculate the letter grade for the new student
const newStudent = new Student(selectedCourseName, studentID, studentName, midtermScore, finalScore);

// Use the correct scale to calculate the letter grade
if (gradingScale === "10") {
    newStudent.grade = newStudent.calculateLetterGrade10Scale();
} else if (gradingScale === "7") {
    newStudent.grade = newStudent.calculateLetterGrade7Scale();
}

// Add the new student to the 'students' array
selectedCourse.students.push(newStudent);

updateStudentTable();
localStorage.setItem("courses", JSON.stringify(courses));
resetForm("studentForm");
}

const courses = JSON.parse(localStorage.getItem("courses")) || [];

function populateCourseDropdowns() {
const courseSelect = document.getElementById("selectedCourse");
const statCourseSelect = document.getElementById("statCourseSelect");

courseSelect.innerHTML = "";
statCourseSelect.innerHTML = "";

courses.forEach(course => {
    const option = document.createElement("option");
    option.value = course.name;
    option.textContent = course.name;
    courseSelect.appendChild(option);

    const statOption = document.createElement("option");
    statOption.value = course.name;
    statOption.textContent = course.name;
    statCourseSelect.appendChild(statOption);
});
}

function updateStudentTable() {
  const tableBody = document.getElementById("studentTable").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  const searchStudentID = document.getElementById("searchStudentID").value.toLowerCase();
  const searchStudentName = document.getElementById("searchStudentName").value.toLowerCase();
  const searchCourse = document.getElementById("searchCourse").value.toLowerCase();
  const searchPassedFailed = document.getElementById("searchPassedFailed").value.toLowerCase();

  courses.forEach(course => {
    if (course.students) {
      course.students.forEach(student => {
        const studentID = student.id.toLowerCase();
        const studentName = student.name.toLowerCase();
        const courseName = course.name.toLowerCase();
        const studentLetterGrade = student.grade;

        const isPassed = studentLetterGrade !== "F";
        const isFailed = !isPassed;

        if (
          studentID.includes(searchStudentID) &&
          studentName.includes(searchStudentName) &&
          courseName.includes(searchCourse) &&
          ((searchPassedFailed === "passed" && isPassed) || (searchPassedFailed === "failed" && isFailed) || searchPassedFailed === ""
          )
        ) {
          const row = tableBody.insertRow();
          row.insertCell(0).textContent = student.id;
          row.insertCell(1).textContent = student.name;
          row.insertCell(2).textContent = student.midterm;
          row.insertCell(3).textContent = student.final;
          row.insertCell(4).textContent = student.grade;

          // Add background color based on letter grade
          const bgColor = getBackgroundColorByGrade(student.grade);
          row.style.backgroundColor = bgColor;

          const actionCell = row.insertCell(5);
          const courseCell = row.insertCell(6);
          const editCell = row.insertCell(7);

          // Add a "Delete" button for each student
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.onclick = function () {
            deleteStudent(course, student.id);
          };
          actionCell.appendChild(deleteButton);

          // Set the Course cell value
          courseCell.textContent = course.name;

          // Add an "Edit" button for each student
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.onclick = function () {
            editStudent(course, student.id);
          };
          editCell.appendChild(editButton);
        }
      });
    }
  });
}

function editStudent(course, studentID) {
const student = course.students.find(student => student.id === studentID);
if (student) {
    const newMidterm = parseFloat(prompt("Enter new Midterm Score:"));
    const newFinal = parseFloat(prompt("Enter new Final Score:"));

    // Check: Are new scores between 0 and 100?
    if (isNaN(newMidterm) || isNaN(newFinal) || newMidterm < 0 || newMidterm > 100 || newFinal < 0 || newFinal > 100) {
        alert("Midterm and final scores must be numbers between 0 and 100.");
        return;
    }

    student.midterm = newMidterm;
    student.final = newFinal;

    // Check: Update letter grade using 'calculateLetterGrade' method
    if (typeof student.calculateLetterGrade === 'function') {
        student.grade = student.calculateLetterGrade();
    } else {
        alert("Error: calculateLetterGrade method not found.");
    }

    updateStudentTable();
    displayCourseStatistics();
    localStorage.setItem("courses", JSON.stringify(courses));
}
}

function deleteStudent(course, studentID) {
const index = course.students.findIndex(student => student.id === studentID);
if (index !== -1) {
    course.students.splice(index, 1);
    updateStudentTable();
    localStorage.setItem("courses", JSON.stringify(courses));
}
}

function resetForm(formId) {
document.getElementById(formId).reset();
}

function displayCourseStatistics() {
const statCourseSelect = document.getElementById("statCourseSelect");
const selectedCourseName = statCourseSelect.value;
const selectedCourse = courses.find(course => course.name === selectedCourseName);

if (!selectedCourse) {
    // alert("Please select a valid course for statistics.");
    return;
}

const courseStudentsDiv = document.getElementById("courseStudents");
courseStudentsDiv.innerHTML = "<h4>Students:</h4>";

if (selectedCourse.students) {
    const passFailStats = calculatePassFailStats(selectedCourse);

    courseStudentsDiv.innerHTML += `<p>Pass: ${passFailStats.passCount}, Fail: ${passFailStats.failCount}</p>`;

    // Display the list of students who passed
    if (passFailStats.passCount > 0) {
        courseStudentsDiv.innerHTML += "<h5>Passed Students:</h5>";
        selectedCourse.students.forEach(student => {
            if (student.grade === "A" || student.grade === "B" || student.grade === "C" || student.grade === "D") {
                courseStudentsDiv.innerHTML += `<p>${student.name} (${student.id}, ${student.grade})</p>`;
            }
        });
    }

    // Display the list of students who failed
    if (passFailStats.failCount > 0) {
        courseStudentsDiv.innerHTML += "<h5>Failed Students:</h5>";
        selectedCourse.students.forEach(student => {
            if (student.grade === "F") {
                courseStudentsDiv.innerHTML += `<p>${student.name} (${student.id}, ${student.grade})</p>`;
            }
        });
    }
}

const passFailStats = calculatePassFailStats(selectedCourse);
const meanScore = calculateMeanScore(selectedCourse);

document.getElementById("passFailStats").innerHTML = `
    <p>Pass: ${passFailStats.passCount}, Fail: ${passFailStats.failCount}</p>
`;

document.getElementById("meanScore").innerHTML = `
    <p>Mean Score: ${meanScore.toFixed(2)}</p>
`;
}

// Function to calculate pass and fail statistics for a given course
function calculatePassFailStats(course) {
let passCount = 0;
let failCount = 0;

if (course.students) {
course.students.forEach(student => {
  if (student.grade === "A" || student.grade === "B" || student.grade === "C" || student.grade === "D") {
    passCount++;
  } else {
    failCount++;
  }
});
}

return { passCount, failCount };
}

// Function to calculate the mean score for a given course
function calculateMeanScore(course) {
if (course.students && course.students.length > 0) {
const totalWeightedScore = course.students.reduce((acc, student) => {
  const weightedAverage = 0.4 * student.midterm + 0.6 * student.final;
  return acc + weightedAverage;
}, 0);

return totalWeightedScore / course.students.length;
}

return 0;
}

// Function to get background color based on letter grade
function getBackgroundColorByGrade(grade) {
switch (grade) {
case "A":
  return "#8FDD8F"; // Light green
case "B":
  return "#ADEBAD"; // Light teal
case "C":
  return "#FFD700"; // Gold
case "D":
  return "#FFA07A"; // Light salmon
case "F":
  return "#FF6347"; // Tomato
default:
  return "#FFFFFF"; // White (default)
}
}

// Function to add a specified number of random students to each course
function addRandomStudents() {
const numberOfStudentsPerCourse = 5;

// Clear the "randomStudentsAdded" key in localStorage
localStorage.removeItem("randomStudentsAdded");

// Iterate through courses
courses.forEach(course => {
// Check: Have we reached the maximum number of students?
if (course.students && course.students.length >= 80) {
  alert(`Maximum number of students reached for the course "${course.name}" (80 students).`);
  return;
}

for (let i = 0; i < numberOfStudentsPerCourse; i++) {
  // Generate random first and last names
  const randomFirstName = generateRandomName();
  const randomLastName = generateRandomName();

  // Generate a unique student ID
  const studentID = generateUniqueStudentID();

  // Generate random midterm and final scores
  const midtermScore = generateRandomScore();
  const finalScore = generateRandomScore();

  // Add the new student
  const newStudent = new Student(course.name, studentID, `${randomFirstName} ${randomLastName}`, midtermScore, finalScore);

  // Use the correct scale to calculate the letter grade
  if (course.gradingScale === "10Scale") {
    newStudent.grade = newStudent.calculateLetterGrade10Scale();
  } else if (course.gradingScale === "7Scale") {
    newStudent.grade = newStudent.calculateLetterGrade7Scale();
  }

  // Add the new student to the 'students' array
  if (!course.students) {
    course.students = [];
  }
  course.students.push(newStudent);
}
});

// Update the student table and statistics
updateStudentTable();
displayCourseStatistics();
localStorage.setItem("courses", JSON.stringify(courses));
}

// Function to generate a random name
function generateRandomName() {
const names = ["John", "Emma", "Michael", "Sophia", "William", "Olivia", "James", "Ava", "Ethan", "Isabella", "Daniel", "Michaelson", "Alexander", "Emily", "Benjamin"];
const randomName = names[Math.floor(Math.random() * names.length)];
return randomName;
}

// Function to generate a unique student ID
function generateUniqueStudentID() {
let studentID;
do {
// Generate a random ID
studentID = Math.floor(100000 + Math.random() * 900000).toString();
// Check if this ID has been used before
} while (isStudentIDExists(studentID));

return studentID;
}

// Function to check if a given student ID already exists
function isStudentIDExists(studentID) {
for (const course of courses) {
if (course.students) {
  const existingStudent = course.students.find(student => student.id === studentID);
  if (existingStudent) {
    return true;
  }
}
}
return false;
}

// Function to generate a random score
function generateRandomScore() {
return Math.floor(40 + Math.random() * 61); // Random number between 40 and 100
}

// Call this function to add example students
addRandomStudents();

// Function to initialize the application
function initialize() {
// If students have not been added before
if (!localStorage.getItem("studentsAdded")) {
// Call the function to add random students
addRandomStudents();
// Save in localStorage that students have been added
localStorage.setItem("studentsAdded", true);
}

// Update the student table and display statistics
updateStudentTable();
displayCourseStatistics();
}

// Function to add a new course
function addCourse() {
const courseName = document.getElementById("courseName").value;
const gradingScale = document.getElementById("gradingScale").value;

// Check if a course with the same name already exists
const existingCourse = courses.find(course => course.name === courseName);
if (existingCourse) {
alert("Course with the same name already exists!");
return;
}

// Create a new course object
const newCourse = {
name: courseName,
gradingScale: gradingScale,
students: [] // Initialize students array for the course
};

// Add the new course to the courses array
courses.push(newCourse);
localStorage.setItem("courses", JSON.stringify(courses));

// Reset the form and repopulate course dropdowns
document.getElementById("courseForm").reset();
populateCourseDropdowns();

alert("Course added successfully!");
updateStudentTable(); // Update the student table after adding a course
}

updateStudentTable();
populateCourseDropdowns();

window.generateResume = function () {
  // Get all form input values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const linkedin = document.getElementById("linkedin").value.trim();
  const github = document.getElementById("github").value.trim();
  const summary = document.getElementById("summary").value.trim();
  const education = document.getElementById("education").value.trim();
  const projects = document.getElementById("projects").value.trim();
  const experience = document.getElementById("experience").value.trim();
  const skills = document.getElementById("skills").value.trim();
  const template = document.getElementById("template").value;

  // Profile photo
  const photoInput = document.getElementById("photo");
  let photoHTML = "";
  if (photoInput.files.length > 0) {
    const photoURL = URL.createObjectURL(photoInput.files[0]);
    photoHTML = `<div class="photo"><img src="${photoURL}" alt="Profile Photo" /></div>`;
  }

  // Certificates
  const certInput = document.getElementById("certificates");
  let certHTML = "";
  if (certInput.files.length > 0) {
    certHTML += `<h3>Certificates</h3><div class="certificates">`;
    for (const file of certInput.files) {
      const fileURL = URL.createObjectURL(file);
      if (file.type.startsWith("image/")) {
        certHTML += `<img src="${fileURL}" class="cert-img" alt="Certificate Image" />`;
      } else {
        certHTML += `<a href="${fileURL}" target="_blank">📄 ${file.name}</a><br>`;
      }
    }
    certHTML += `</div>`;
  }

  // Assemble resume HTML
  const resumeHTML = `
    <div class="resume theme-${template}">
      ${photoHTML}
      <h2>${name}</h2>
      <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone}</p>
      <p><strong>LinkedIn:</strong> ${linkedin} | <strong>GitHub:</strong> ${github}</p>

      <h3>Career Objective</h3>
      <p>${summary}</p>

      <h3>Education</h3>
      <p>${education.replace(/\n/g, "<br>")}</p>

      <h3>Projects</h3>
      <p>${projects.replace(/\n/g, "<br>")}</p>

      <h3>Experience</h3>
      <p>${experience.replace(/\n/g, "<br>")}</p>

      <h3>Skills</h3>
      <p>${skills}</p>

      ${certHTML}
    </div>
  `;

  // Inject HTML into container
  document.getElementById("resumeContainer").innerHTML = resumeHTML;
};

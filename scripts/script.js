document.addEventListener('DOMContentLoaded', function() {
    // Initialize template selection
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            templateCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            previewTemplate(this.dataset.template);
        });
    });

    // Set default template
    if (templateCards.length > 0) {
        templateCards[0].click(); // Activate first template by default
    }
});

// Template preview function
function previewTemplate(template) {
    const previewDiv = document.getElementById('template-preview');
    previewDiv.className = `theme-${template}`;
    previewDiv.textContent = `Selected Template: ${template.charAt(0).toUpperCase() + template.slice(1)}`;
}

// Resume generation function
window.generateResume = function() {
    const form = document.getElementById('resume-form');
    const resumeContainer = document.getElementById('resumeContainer');
    const preview = document.getElementById('resumePreview');
    const photoInput = document.getElementById('photo');
    
    // Get active template
    const activeTemplate = document.querySelector('.template-card.active')?.dataset.template || 'modern';

    // Create photo HTML if uploaded
    let photoHTML = '';
    if (photoInput.files && photoInput.files[0]) {
        const photoURL = URL.createObjectURL(photoInput.files[0]);
        photoHTML = `
            <div class="photo">
                <img src="${photoURL}" alt="Profile photo" class="profile-photo">
            </div>
        `;
    }

    // Create resume HTML structure
    const resumeHTML = `
        <div class="resume theme-${activeTemplate}">
            <div class="resume-header">
                ${photoHTML}
                <div class="header-text">
                    <h1>${form.name.value || 'Your Name'}</h1>
                    <p class="summary">${form.summary.value || 'Professional summary...'}</p>
                </div>
            </div>
            
            <div class="contact-section">
                <h2>Contact Information</h2>
                <p>Email: ${form.email.value || 'N/A'}</p>
                <p>Phone: ${form.phone.value || 'N/A'}</p>
                ${form.linkedin.value ? `<p>LinkedIn: ${form.linkedin.value}</p>` : ''}
                ${form.github.value ? `<p>GitHub: ${form.github.value}</p>` : ''}
            </div>
            
            ${form.education.value ? `
            <div class="resume-section">
                <h2>Education</h2>
                <div>${form.education.value.replace(/\n/g, '<br>')}</div>
            </div>` : ''}
            
            ${form.experience.value ? `
            <div class="resume-section">
                <h2>Experience</h2>
                <div>${form.experience.value.replace(/\n/g, '<br>')}</div>
            </div>` : ''}
            
            ${form.projects.value ? `
            <div class="resume-section">
                <h2>Projects</h2>
                <div>${form.projects.value.replace(/\n/g, '<br>')}</div>
            </div>` : ''}
            
            ${form.skills.value ? `
            <div class="resume-section">
                <h2>Skills</h2>
                <ul>
                    ${form.skills.value.split(',').map(skill => `<li>${skill.trim()}</li>`).join('')}
                </ul>
            </div>` : ''}
            
            ${generateCertificateSection()}
        </div>
    `;

    // Populate both preview and hidden container
    preview.innerHTML = resumeHTML;
    resumeContainer.innerHTML = resumeHTML;
    
    alert('Resume generated successfully! Now you can download it as PDF.');
};

// Generate certificates section HTML
function generateCertificateSection() {
    const certificatesInput = document.getElementById('certificates');
    if (!certificatesInput.files || certificatesInput.files.length === 0) return '';
    
    const certificatesHTML = Array.from(certificatesInput.files).map(file => {
        const url = URL.createObjectURL(file);
        return file.type === 'application/pdf' 
            ? `<li>PDF Certificate: ${file.name}</li>`
            : `<li><img src="${url}" alt="Certificate ${file.name}" class="cert-img"></li>`;
    }).join('');
    
    return `
        <div class="resume-section">
            <h2>Certificates</h2>
            <ul class="certificates">${certificatesHTML}</ul>
        </div>
    `;
}

// PDF Export functionality
window.downloadPDF = function() {
    const resume = document.getElementById("resumeContainer");
    
    if (!resume.innerHTML.trim()) {
        alert("Please generate the resume first using the 'Generate Resume' button!");
        return;
    }

    // Make container visible temporarily
    const originalStyles = {
        position: resume.style.position,
        left: resume.style.left,
        top: resume.style.top,
        display: resume.style.display
    };
    
    resume.style.position = "static";
    resume.style.left = "auto";
    resume.style.top = "auto";
    resume.style.display = "block";

    // Wait for images to load (including profile photo and certificates)
    const images = resume.querySelectorAll("img");
    const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve) => {
            if (img.complete) resolve();
            else img.onload = img.onerror = resolve;
        });
    });

    Promise.all(imagePromises).then(() => {
        const opt = {
            margin: 0.5,
            filename: 'my_resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true,
                logging: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'in', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };

        // Generate PDF
        html2pdf().set(opt).from(resume).save().then(() => {
            // Restore original styles
            Object.assign(resume.style, originalStyles);
            
            // Clean up object URLs
            images.forEach(img => {
                if (img.src.startsWith('blob:')) {
                    URL.revokeObjectURL(img.src);
                }
            });
        });
    }).catch(error => {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF. Please check console for details.");
        Object.assign(resume.style, originalStyles);
    });
};

window.downloadPDF = function () {
  const resume = document.getElementById("resumeContainer");
  const opt = {
    margin: 0.3,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(resume).save();
};

window.jsPDF = window.jspdf.jsPDF;
window.html2canvas = html2canvas;

document.getElementById("print--button").addEventListener("click", function () {
  var imgData = document
    .getElementById("general-chart")
    .toDataURL("image/jpeg", 1.0);
  var doc = new jsPDF({ orientation: "landscape" });
  var width = doc.internal.pageSize.getWidth();
  var height = doc.internal.pageSize.getHeight();
  doc.addImage(imgData, "JPEG", 0, 0, width, height);
  doc.save("download.pdf");
  // const doc = new jsPDF();
  // let printable = document.getElementById("printable");
  // doc.html(printable, {
  //   callback: function () {
  //     doc.save("report.pdf");
  //   },
  // });
});

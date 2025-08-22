import { useParams } from "react-router-dom";
import { storeContext } from "../context/storeContext";
import { useContext, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Spinner from "../layout/Spinner";

function Project() {
  // Use the actual context in your app. This is for the example.
  const { isLoading, fetchProject, singleProject } = useContext(storeContext);
  const [isGenerating, setIsGenerating] = useState(false);
  const projectRef = useRef(null);

  const params = useParams();
  const projectId = params.projectId;

  useEffect(() => {
    if (fetchProject && projectId) {
      fetchProject(projectId); //fetch project from api
    }
  }, []);

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      // Ensure the project details are loaded
      if (!projectRef.current) {
        toast.error("Project details not found.");
        setIsGenerating(false);
        return;
      }

      // Use html2canvas to capture the content of the ref'd div
      const canvas = await html2canvas(projectRef.current, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Needed if the image is from a different origin
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Save the PDF with a dynamic filename
      pdf.save(`project-details-${projectId}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {singleProject === null ? (
        <h1 className="text-center-heading">Project not found</h1>
      ) : (
        <div className="project-container">
          <div className="project-details-card project-details-card-lg">
            <div ref={projectRef}>
              <h2 className="project-title">{singleProject.title}</h2>
              <p className="project-description">{singleProject.description}</p>
              <div className="project-meta">
                <p>
                  Price:
                  {Number(singleProject.price).toLocaleString()} NGN
                </p>
                <p>Status: {singleProject.status}</p>
              </div>
              <p className="project-description">
                This project is owned by {singleProject.user.profile.fullName}{" "}
                with the email {singleProject.user.email}
              </p>
            </div>
          </div>

          <div className="download-button-container">
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="download-button"
            >
              {isGenerating ? "Generating..." : "Download as PDF"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
export default Project;

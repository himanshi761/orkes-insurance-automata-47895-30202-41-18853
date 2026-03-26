import { useEffect, useState } from "react";

const DocumentsPage = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/claims", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const claims = await res.json();

      let allDocs = [];

      for (let claim of claims) {
        const docRes = await fetch(
          `http://localhost:8000/api/claims/${claim._id}/documents`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await docRes.json();
        allDocs = [...allDocs, ...data];
      }

      setDocs(allDocs);
    };

    fetchDocs();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Documents</h1>

      {docs.length === 0 ? (
        <p>No documents uploaded</p>
      ) : (
        docs.map((doc) => (
          <a
            key={doc._id}
            href={`http://localhost:8000/${doc.fileUrl}`}
            target="_blank"
            className="block text-blue-600 mb-2"
          >
            View Document
          </a>
        ))
      )}
    </div>
  );
};

export default DocumentsPage;
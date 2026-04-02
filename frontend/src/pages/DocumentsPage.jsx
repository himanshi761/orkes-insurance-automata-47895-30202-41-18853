// import { useEffect, useState } from "react";

// const DocumentsPage = () => {
//   const [docs, setDocs] = useState([]);

//   useEffect(() => {
//     const fetchDocs = async () => {
//       const token = localStorage.getItem("token");

//       const res = await fetch("http://localhost:8000/api/claims", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const claims = await res.json();

//       let allDocs = [];

//       for (let claim of claims) {
//         const docRes = await fetch(
//           `http://localhost:8000/api/claims/${claim._id}/documents`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const data = await docRes.json();
//         allDocs = [...allDocs, ...data];
//       }

//       setDocs(allDocs);
//     };

//     fetchDocs();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Documents</h1>

//       {docs.length === 0 ? (
//         <p>No documents uploaded</p>
//       ) : (
//         docs.map((doc) => (
//           <a
//             key={doc._id}
//             href={`http://localhost:8000/${doc.fileUrl}`}
//             target="_blank"
//             className="block text-blue-600 mb-2"
//           >
//             View Document
//           </a>
//         ))
//       )}
//     </div>
//   );
// };

// export default DocumentsPage;

// import { useEffect, useState } from "react";

// const DocumentsPage = () => {
//   const [docs, setDocs] = useState([]);

//   useEffect(() => {
//     const fetchDocs = async () => {
//       const token = localStorage.getItem("token");

//       const res = await fetch("http://localhost:8000/api/claims", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const claims = await res.json();

//       let allDocs = [];

//       for (let claim of claims) {
//         const docRes = await fetch(
//           `http://localhost:8000/api/claims/${claim._id}/documents`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const data = await docRes.json();
//         allDocs = [...allDocs, ...data];
//       }

//       setDocs(allDocs);
//     };

//     fetchDocs();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Documents</h1>

//       {docs.length === 0 ? (
//         <p>No documents uploaded</p>
//       ) : (
//         docs.map((doc) => (
//           <a
//             key={doc._id}
//             href={`http://localhost:8000/${doc.fileUrl}`}
//             target="_blank"
//             className="block text-blue-600 mb-2"
//           >
//             View Document
//           </a>
//         ))
//       )}
//     </div>
//   );
// };

// export default DocumentsPage;

// import { useEffect, useState } from "react";

// const DocumentsPage = () => {
//   const [docs, setDocs] = useState([]);

//   useEffect(() => {
//     const fetchDocs = async () => {
//       const token = localStorage.getItem("token");

//       const res = await fetch("http://localhost:8000/api/claims", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const claims = await res.json();

//       let allDocs = [];

//       for (let claim of claims) {
//         const docRes = await fetch(
//           `http://localhost:8000/api/claims/${claim._id}/documents`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const data = await docRes.json();
//         allDocs = [...allDocs, ...data];
//       }

//       setDocs(allDocs);
//     };

//     fetchDocs();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Documents</h1>

//       {docs.length === 0 ? (
//         <p>No documents uploaded</p>
//       ) : (
//         docs.map((doc) => (
//           <a
//             key={doc._id}
//             href={`http://localhost:8000/${doc.fileUrl}`}
//             target="_blank"
//             className="block text-blue-600 mb-2"
//           >
//             View Document
//           </a>
//         ))
//       )}
//     </div>
//   );
// };

// export default DocumentsPage;
import { useEffect, useState } from "react";
import { FileText, Eye } from "lucide-react";
import { API_BASE_URL, getDocumentUrl } from "@/lib/aiScreening";

const DocumentsPage = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); // 🔥 modal preview

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/api/claims`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const claims = await res.json();

        let allDocs = [];

        for (let claim of claims) {
          const docRes = await fetch(
            `${API_BASE_URL}/api/claims/${claim._id}/documents`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = await docRes.json();

          if (Array.isArray(data)) {
            allDocs = [...allDocs, ...data];
          }
        }

        setDocs(allDocs);
      } catch (err) {
        console.error(err);
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading documents...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-3xl font-bold">Documents</h1>

      {docs.length === 0 ? (
        <p className="text-gray-500 text-center">
          No documents uploaded
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {docs.map((doc) => {
            const fileUrl = getDocumentUrl(doc.fileUrl);
            const isImage = doc.fileType?.startsWith("image");
            const isPDF = doc.fileType?.includes("pdf");

            return (
              <div
                key={doc._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
            
                {/* 🔥 Preview Section */}
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt="doc"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FileText size={40} className="text-gray-500" />
                  )}
                </div>

                {/* 🔹 Info */}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-2">
                    {isPDF ? "PDF Document" : "Image Document"}
                  </p>

                  {/* 🔥 Actions */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setPreview(fileUrl)}
                      className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
                    >
                      <Eye size={16} /> Preview
                    </button>

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Open →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔥 MODAL PREVIEW */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 max-w-3xl w-full relative">
            
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-3 text-gray-600 text-xl"
            >
              ✕
            </button>

            {/* 🔥 Image or PDF */}
            {preview.endsWith(".pdf") ? (
              <iframe
                src={preview}
                className="w-full h-[500px]"
                title="PDF"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-[500px] object-contain"
              />
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DocumentsPage;

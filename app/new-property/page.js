"use client";
import AttachFileComponent from "@/components/AttachFileComponent";
import { useState } from "react";
import { BACKEND_URI } from "@/config";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [supply, setSupply] = useState(1000);
  const [price, setPrice] = useState(100);
  const [inscriptionId, setInscriptionId] = useState("");
  const [error, setError] = useState({
    title: "",
    description: "",
    supply: "",
    price: "",
    inscriptionId: "",
    publishError: "",
  });

  const handleCreateProperty = async () => {
    setError({
      title: "",
      description: "",
      supply: "",
      price: "",
      inscriptionId: "",
      file: "",
      publishError: "",
    });
    if (!title) {
      setError((prev) => ({ ...prev, title: "Title can not be empty" }));
    }
    if (!description) {
      setError((prev) => ({
        ...prev,
        description: "Description can not be empty",
      }));
    }
    if (!supply) {
      setError((prev) => ({ ...prev, supply: "Supply can not be empty" }));
    }
    if (!price) {
      setError((prev) => ({ ...prev, price: "Price can not be empty" }));
    }
    if (!inscriptionId) {
      setError((prev) => ({
        ...prev,
        inscriptionId: "Inscription Id can not be empty",
      }));
    }
    if (!file) {
      setError((prev) => ({
        ...prev,
        file: "File can not be empty",
      }));
    }

    // Create FormData and append fields
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("supply", supply);
    formData.append("price", price);
    formData.append("inscriptionId", inscriptionId);
    formData.append("sold", 0);
    formData.append("imageURL", ""); // Assuming you'll handle this in the backend
    formData.append("status", 1);
    formData.append("startsIn", Date.now());
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URI}/api/properties`, {
        method: "POST",
        body: formData,
      });
      const resJson = await res.json();

      if (resJson.msg == "OK") {
        toast.success("Property have been successfully added and published!");
        router.push("/");
      }
      setLoading(false);
    } catch (error) {
      setError((prev) => ({ ...prev, publishError: error }));
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-4">
      <div className="mx-auto w-full max-w-[700px]">
        <div className="mt-3">
          <div>Title*</div>
          <input
            type="text"
            id="title"
            className="p-2 rounded-md shadow-md w-full focus:outline-none hover:shadow-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error.title && (
            <div className="text-red-500 text-sm">{error.title}</div>
          )}
        </div>
        <div className="mt-3">
          <div>Description*</div>
          <textarea
            name=""
            id=""
            cols="30"
            rows="7"
            className="p-2 rounded-md shadow-md w-full focus:outline-none hover:shadow-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {error.description && (
            <div className="text-red-500 text-sm">{error.description}</div>
          )}
        </div>
        <div className="mt-3">
          <div>Parent Inscription Id*</div>
          <input
            type="text"
            id="title"
            className="p-2 rounded-md shadow-md w-full"
            value={inscriptionId}
            onChange={(e) => setInscriptionId(e.target.value)}
          />
          {error.inscriptionId && (
            <div className="text-red-500 text-sm">{error.inscriptionId}</div>
          )}
        </div>
        <div className="mt-3">
          <div>Attach Property Image*</div>
          <AttachFileComponent
            key={inscriptionId}
            setFile={setFile}
            file={file}
            inscriptionId={inscriptionId}
            setError={setError}
          />
          {error.file && (
            <div className="text-red-500 text-sm">{error.file}</div>
          )}
        </div>
        <div className="mt-3">
          <div>Supply*</div>
          <input
            type="number"
            id="title"
            className="p-2 rounded-md shadow-md w-full"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
          />
          {error.supply && (
            <div className="text-red-500 text-sm">{error.supply}</div>
          )}
        </div>
        <div className="mt-6">
          <div>Initial Sale Price*</div>
          <input
            type="number"
            id="title"
            className="p-2 rounded-md shadow-md w-full"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {error.price && (
            <div className="text-red-500 text-sm">{error.price}</div>
          )}
        </div>
        <div className="mt-4">
          <button
            disabled={loading}
            className="btn w-full bg-orange-300 border-orange-400 hover:bg-orange-400 hover:border-orange-500"
            onClick={handleCreateProperty}
          >
            {loading ? "Publishing..." : "Add & Publish"}
          </button>
          {error.publishError && (
            <div className="text-red-500 text-sm">
              {error.publishError.toString()}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

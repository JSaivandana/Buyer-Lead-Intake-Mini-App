"use client";

import { useState } from "react";

export default function ImportExportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    const handleUpload = async () => {
        if (!file) return;
        const text = await file.text();
        const res = await fetch("/api/buyers/import", {
            method: "POST",
            body: text,
        });
        const data = await res.json();
        setMessage(JSON.stringify(data, null, 2));
    };

    const handleExport = () => {
        window.location.href = "/api/buyers/export";
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold">Import / Export Buyers</h1>

            <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">
                Import CSV
            </button>

            <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded ml-2">
                Export CSV
            </button>

            <pre>{message}</pre>
        </div>
    );
}

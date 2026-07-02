"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
	Printer,
	ArrowLeft,
	Layers,
	ShieldAlert,
	Cpu,
	LayoutTemplate,
} from "lucide-react";

// Aapka original marksheet renderer component import
import MarksheetRenderer from "../templates/components/marksheetRenderer";

// 1. Move your core logic into a separate child component
function BulkEngineContent() {
	const searchParams = useSearchParams();
	const router = useRouter();

	// Yahan URL se aane wale template ko initial value banaya hai, par state me rakha hai taki dropdown se change ho sake
	const initialTemplateId = searchParams.get("template") || "cbse";
	const [selectedTemplate, setSelectedTemplate] = useState(initialTemplateId);

	const [globalLayoutConfig, setGlobalLayoutConfig] = useState({});
	const [datasetBatchStudentsList, setDatasetBatchStudentsList] = useState(
		[],
	);
	const [isProcessingEngineActive, setIsProcessingEngineActive] =
		useState(true);

	// Ye wahi exact templates hain jo aapke system me supported hain
	const availableTemplates = [
		{ id: "cbse", name: "CBSE Standard" },
		{ id: "modern", name: "Modern Minimal" },
		{ id: "oxeford", name: "Oxford Classic" },
		{ id: "kv", name: "Kendriya Vidyalaya" },
		{ id: "convent", name: "Convent Premium" },
	];

	useEffect(() => {
		// Dropdown change hote hi localStorage se us naye template ki configuration fetch hogi
		const storedStyleConfiguration = JSON.parse(
			localStorage.getItem(`saved_config_${selectedTemplate}`),
		) || {
			templateId: selectedTemplate,
			schoolName: "INSTITUTION BULK RECORD OVERRIDE",
			tagline: "System Stream Mode Engine Processing Matrix",
			themeColor: "#0f766e",
		};
		setGlobalLayoutConfig(storedStyleConfiguration);

		const masterBatchPipelineArray = [];
		for (
			let currentIncrementIndex = 1;
			currentIncrementIndex <= 50;
			currentIncrementIndex++
		) {
			masterBatchPipelineArray.push({
				id: `stu_${currentIncrementIndex}`,
				// ... yahan aap backend API se data fetch karke set karenge
			});
		}
		setDatasetBatchStudentsList(masterBatchPipelineArray);
		setIsProcessingEngineActive(false);
	}, [selectedTemplate]); // Dependency array me selectedTemplate daala hai

	return (
		<div className="min-h-screen bg-slate-200 flex flex-col font-sans">
			{/* TOP NAVIGATION / CONTROL BAR */}
			<div className="bg-white border-b border-slate-300 shadow-sm p-4 print:hidden flex items-center justify-between sticky top-0 z-50">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.back()}
						className="p-2 hover:bg-slate-100 rounded-full transition-colors"
					>
						<ArrowLeft className="text-slate-600" size={20} />
					</button>
					<div>
						<h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
							<Layers size={20} className="text-blue-600" />
							Batch Processing Engine
						</h1>
						<p className="text-xs text-slate-500 font-medium">
							Generating records for{" "}
							{datasetBatchStudentsList.length} students
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4">
					{/* NEW: LIVE TEMPLATE SELECTOR DROPDOWN */}
					<div className="flex items-center gap-2 border-r border-slate-200 pr-4">
						<LayoutTemplate size={18} className="text-slate-500" />
						<label className="text-sm font-semibold text-slate-600 hidden sm:block">
							Template:
						</label>
						<select
							value={selectedTemplate}
							onChange={(e) => {
								setSelectedTemplate(e.target.value);
								// URL ko bhi update kar dete hain taki page refresh karne par wahi rahe
								router.replace(`?template=${e.target.value}`, {
									scroll: false,
								});
							}}
							className="p-2 border border-slate-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer bg-slate-50"
						>
							{availableTemplates.map((tpl) => (
								<option key={tpl.id} value={tpl.id}>
									{tpl.name}
								</option>
							))}
						</select>
					</div>

					<button
						onClick={() => window.print()}
						disabled={isProcessingEngineActive}
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95"
					>
						<Printer size={18} />
						Initiate Batch Print
					</button>
				</div>
			</div>

			{/* RENDER AREA */}
			<div className="flex-1 overflow-auto p-8 print:p-0 flex flex-col items-center gap-12 print:gap-0">
				{isProcessingEngineActive ? (
					<div className="m-auto flex flex-col items-center gap-4 text-slate-400 mt-32">
						<Cpu size={48} className="animate-pulse" />
						<p className="text-lg font-mono tracking-widest animate-pulse">
							INITIALIZING BATCH RENDERER...
						</p>
					</div>
				) : (
					datasetBatchStudentsList.map(
						(individualStudentItem, recordLoopIndex) => (
							<div
								key={
									individualStudentItem.id || recordLoopIndex
								}
								className="w-[210mm] min-h-[297mm] mx-auto bg-white rounded-none shadow-2xl relative print:p-0 print:m-0 print:border-none print:shadow-none print:w-full print:block overflow-hidden"
								style={{
									pageBreakAfter: "always",
									breakAfter: "page",
								}}
							>
								<div className="absolute top-2 right-2 text-[10px] font-black tracking-widest bg-slate-100 text-slate-500 border border-slate-300 px-2 py-0.5 rounded uppercase print:hidden z-10">
									Batch Record Sheet #{recordLoopIndex + 1}
								</div>

								{/* DROPDOWN WALA TEMPLATE EXACTLY YAHAN PASS HOGA 👇 */}
								<MarksheetRenderer
									templateType={selectedTemplate}
									templateConfig={globalLayoutConfig}
									studentData={individualStudentItem}
									isBuilderMode={false}
								/>
							</div>
						),
					)
				)}
			</div>
		</div>
	);
}

// 2. Wrap the child component in a Suspense boundary for your default export
export default function MassiveBulkBatchProcessingGenerationEnginePage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
					<div className="flex flex-col items-center gap-3">
						<Layers className="animate-bounce" size={40} />
						<p className="font-mono text-sm tracking-widest">
							LOADING ENGINE...
						</p>
					</div>
				</div>
			}
		>
			<BulkEngineContent />
		</Suspense>
	);
}

"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
	ArrowLeft,
	Printer,
	Sparkles,
	User,
	FileCheck,
	Loader2,
} from "lucide-react";
import MarksheetRenderer from "../templates/components/marksheetRenderer";

// 1. Decoupled child component containing the useSearchParams logic
function ReportCardContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const templateParamId = searchParams.get("template") || "cbse";

	const [activeConfigData, setActiveConfigData] = useState({});
	const [studentObject, setStudentObject] = useState({
		name: "ARJUN KUMAR",
		rollNo: "22345678",
		motherName: "SUNITA DEVI",
		fatherName: "RAJESH KUMAR",
		marks: [
			{
				code: "301",
				name: "ENGLISH CORE",
				th: "075",
				pr: "019",
				total: "094",
				grade: "A1",
			},
			{
				code: "041",
				name: "MATHEMATICS",
				th: "082",
				pr: "020",
				total: "102",
				grade: "A1",
			},
			{
				code: "042",
				name: "PHYSICS",
				th: "065",
				pr: "028",
				total: "093",
				grade: "A1",
			},
			{
				code: "043",
				name: "CHEMISTRY",
				th: "068",
				pr: "029",
				total: "097",
				grade: "A1",
			},
			{
				code: "083",
				name: "COMPUTER SCIENCE",
				th: "069",
				pr: "030",
				total: "099",
				grade: "A1",
			},
		],
	});

	// Mobile layout wrapper processing variables
	const [scale, setScale] = useState(1);
	const [wrapperHeight, setWrapperHeight] = useState("auto");
	const rendererContainerFrameRef = useRef(null);

	useEffect(() => {
		const fetchedConfig = JSON.parse(
			localStorage.getItem(`saved_config_${templateParamId}`),
		) || {
			templateId: templateParamId,
			schoolName: "CAMBRIDGE PUBLIC SCHOOL",
			tagline: "A Senior Secondary Co-Education School",
			themeColor: "#b91c1c",
		};
		setActiveConfigData(fetchedConfig);
	}, [templateParamId]);

	useEffect(() => {
		const calculateLiveRescaleMatrix = () => {
			const windowWidthValue = window.innerWidth;
			const benchmarkWidthFrame = 900;

			if (windowWidthValue < benchmarkWidthFrame) {
				const calculatedScaleMatrix =
					(windowWidthValue - 24) / benchmarkWidthFrame;
				setScale(calculatedScaleMatrix);
				if (rendererContainerFrameRef.current) {
					setWrapperHeight(
						`${rendererContainerFrameRef.current.offsetHeight * calculatedScaleMatrix}px`,
					);
				}
			} else {
				setScale(1);
				setWrapperHeight("auto");
			}
		};

		calculateLiveRescaleMatrix();
		const delayTimer = setTimeout(calculateLiveRescaleMatrix, 200);
		window.addEventListener("resize", calculateLiveRescaleMatrix);
		return () => {
			window.removeEventListener("resize", calculateLiveRescaleMatrix);
			clearTimeout(delayTimer);
		};
	}, [activeConfigData, studentObject]);

	return (
		<div className="min-h-screen bg-slate-100 font-sans flex flex-col overflow-x-hidden print:bg-white print:p-0">
			{/* Action panel header controls layer - Auto hidden on standard operating system print engine configurations */}
			<div className="bg-white border-b border-slate-200 p-4 shadow-sm sticky top-0 z-50 print:hidden">
				<div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
							<FileCheck size={22} />
						</div>
						<div>
							<h1 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-1.5">
								Live Generation Node Workbench
							</h1>
							<p className="text-xs text-slate-400 font-medium">
								Verify system alignment variables schema map
								matching models before finalizing layout prints.
							</p>
						</div>
					</div>

					<div className="flex gap-2 w-full sm:w-auto">
						<button
							onClick={() => router.push("/my-templates")}
							className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition active:scale-95"
						>
							<ArrowLeft size={14} /> Back to Repository Folder
						</button>
						<button
							onClick={() => window.print()}
							className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md transition active:scale-95"
						>
							<Printer size={14} /> Print Document (PDF Export)
						</button>
					</div>
				</div>
			</div>

			{/* Workspace renderer viewport node layout mapping framework elements */}
			<div className="flex-1 w-full flex justify-center p-3 sm:p-8 print:p-0 print:block">
				<div
					style={{ height: wrapperHeight, width: "100%" }}
					className="flex justify-center overflow-hidden print:block print:h-auto print:w-auto"
				>
					<div
						ref={rendererContainerFrameRef}
						style={{
							width: "900px",
							minWidth: "900px",
							transform: `scale(${scale})`,
							transformOrigin: "top center",
						}}
						className="print:transform-none print:w-auto print:min-w-0 print:h-auto"
					>
						<MarksheetRenderer
							templateType={templateParamId}
							templateConfig={activeConfigData}
							studentData={studentObject}
							isBuilderMode={false}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// 2. Suspense boundary wrapper for the default export
export default function SingleStudentReportCardGeneratorPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500">
					<div className="flex flex-col items-center gap-3">
						<Loader2
							className="animate-spin text-indigo-600"
							size={32}
						/>
						<p className="font-bold tracking-wider text-sm uppercase">
							Loading Report Card Context...
						</p>
					</div>
				</div>
			}
		>
			<ReportCardContent />
		</Suspense>
	);
}

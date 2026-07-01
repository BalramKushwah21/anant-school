"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer, AlertTriangle, Loader2 } from "lucide-react";
import MarksheetRenderer from "../templates/components/marksheetRenderer"; // Sahi path fix karein

function SingleReportCardContent() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const studentId = searchParams.get("studentId");
	const templateParamId = searchParams.get("template") || "cbse";

	const [activeConfigData, setActiveConfigData] = useState({});
	const [studentObject, setStudentObject] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// Zoom Scale Logic (Just like your previous code)
	const [scale, setScale] = useState(1);
	const [wrapperHeight, setWrapperHeight] = useState("auto");
	const rendererContainerFrameRef = useRef(null);

	useEffect(() => {
		// 1. Load Layout Config from LocalStorage (Or DB in future)
		const storedConfig = JSON.parse(
			localStorage.getItem(`saved_config_${templateParamId}`),
		) || {
			schoolName: "DEFAULT SCHOOL NAME",
			themeColor: "#0f766e",
		};
		setActiveConfigData(storedConfig);

		// 2. Fetch Student Real Data
		const fetchStudentData = async () => {
			if (!studentId) {
				setError("Student ID is missing in URL");
				setIsLoading(false);
				return;
			}

			try {
				const res = await fetch(
					`/api/school/students/marksheet?studentId=${studentId}`,
				);
				if (!res.ok) throw new Error("Failed to fetch student data");
				const data = await res.json();
				setStudentObject(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStudentData();
	}, [studentId, templateParamId]);

	// Adjust Scale Logic for preview window
	useEffect(() => {
		if (!isLoading && studentObject) {
			const fitPreviewScreen = () => {
				const currentWidth = window.innerWidth;
				const baselineBounds = 900;
				if (currentWidth < baselineBounds + 60) {
					const ratio = (currentWidth - 40) / baselineBounds;
					setScale(ratio);
				} else {
					setScale(1);
				}
			};
			fitPreviewScreen();
			window.addEventListener("resize", fitPreviewScreen);
			return () => window.removeEventListener("resize", fitPreviewScreen);
		}
	}, [isLoading, studentObject]);

	useEffect(() => {
		if (rendererContainerFrameRef.current) {
			const exactHeight =
				rendererContainerFrameRef.current.getBoundingClientRect()
					.height;
			setWrapperHeight(
				exactHeight > 0 ? `${exactHeight + 50}px` : "auto",
			);
		}
	}, [scale, isLoading, studentObject]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
				<Loader2
					className="animate-spin text-indigo-600 mb-4"
					size={40}
				/>
				<p className="font-semibold animate-pulse">
					Fetching Student Records...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-red-500">
				<AlertTriangle size={50} className="mb-4" />
				<h2 className="text-xl font-bold">
					Error Generating Marksheet
				</h2>
				<p className="text-slate-600 mt-2">{error}</p>
				<button
					onClick={() => router.back()}
					className="mt-6 px-4 py-2 bg-slate-800 text-white rounded-md"
				>
					Go Back
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col font-sans">
			{/* Top Controller Ribbon */}
			<div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex justify-between items-center print:hidden sticky top-0 z-50 shadow-sm">
				<button
					onClick={() => router.back()}
					className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-semibold text-sm"
				>
					<ArrowLeft size={16} /> Back to Roster
				</button>
				<div className="flex gap-3">
					<button
						onClick={() => window.print()}
						className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md font-bold text-sm transition-all active:scale-95"
					>
						<Printer size={18} /> Print Marksheet
					</button>
				</div>
			</div>

			{/* Workspace Renderer */}
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
						className="print:transform-none print:w-auto print:min-w-0 print:h-auto print:m-0"
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

export default function SingleStudentReportCardGeneratorPage() {
	return (
		<Suspense
			fallback={
				<div className="h-screen w-full flex justify-center items-center">
					<Loader2 className="animate-spin text-indigo-600" />
				</div>
			}
		>
			<SingleReportCardContent />
		</Suspense>
	);
}

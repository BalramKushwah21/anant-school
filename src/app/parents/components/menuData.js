import {
	LayoutDashboard,
	User,
	BookOpen,
	CalendarDays,
	Trophy,
	Library,
	Download,
	UserCircle,
} from "lucide-react";

export const parentMenuData = [
	{
		name: "Dashboard",
		icon: LayoutDashboard,
		isDropdown: false,
		link: "/parents/dashboard",
	},
	{
		name: "My Child",
		icon: User,
		isDropdown: true,
		subItems: [
			{ label: "Student Profile", link: "/parents/pages/myChild/profile" },
			{
				label: "Academic Information",
				link: "/parents/child/academic-info",
			},
			{ label: "Class & Section", link: "/parents/child/class-section" },
			{ label: "Student Documents", link: "/parents/child/documents" },
		],
	},
	{
		name: "Academics",
		icon: BookOpen,
		isDropdown: true,
		subItems: [
			{ label: "Subjects", link: "/parents/academics/subjects" },
			{ label: "Syllabus", link: "/parents/academics/syllabus" },
			{ label: "Homework", link: "/parents/academics/homework" },
			{ label: "Assignments", link: "/parents/academics/assignments" },
			{
				label: "Study Materials",
				link: "/parents/academics/study-materials",
			},
		],
	},
	{
		name: "Attendance",
		icon: CalendarDays,
		isDropdown: true,
		subItems: [
			{
				label: "Attendance Summary",
				link: "/parents/pages/attendance/summary",
			},
			
		],
	},
	
	{
		name: "Services",
		icon: Library,
		isDropdown: true,
		subItems: [
			{ label: "Library Status", link: "/parents/services/library" },
			{ label: "Issued Books", link: "/parents/services/issued-books" },
			{ label: "Fine Details", link: "/parents/services/fines" },
		],
	},
	{
		name: "Downloads",
		icon: Download,
		isDropdown: true,
		subItems: [
			{ label: "Report Cards", link: "/parents/downloads/report-cards" },
			{ label: "Certificates", link: "/parents/downloads/certificates" },
			{ label: "Fee Receipts", link: "/parents/downloads/receipts" },
			{ label: "ID Card", link: "/parents/pages/downloads/id-cards" },
			{ label: "School Documents", link: "/parents/downloads/documents" },
		],
	},
	{
		name: "Account",
		icon: UserCircle,
		isDropdown: true,
		subItems: [
			{ label: "Profile", link: "/parents/account/profile" },
			{ label: "Settings", link: "/parents/account/settings" },
		],
	},
];

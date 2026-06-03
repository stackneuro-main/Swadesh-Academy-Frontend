import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  BookOpenText,
  BookUser,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Eye,
  ExternalLink,
  FilterX,
  GripVertical,
  GraduationCap,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import EmptyState from "../components/ui/EmptyState";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import LoadingState from "../components/ui/LoadingState";
import AuthPrompt from "../features/auth/components/AuthPrompt";
import {
  createAdminCourse,
  createAdminCourseCategory,
  createAdminTeacher,
  deleteAdminCourse,
  deleteAdminCourseCategory,
  deleteAdminTeacher,
  getAdminCourseCategories,
  getAdminCourses,
  getAdminEnrollments,
  getAdminPayments,
  getAdminTeachers,
  getAdminUsers,
  updateAdminCourseCategory,
  updateAdminCourse,
  assignAdminEnrollmentRequest,
  getAdminEnrollmentRequests,
  updateAdminTeacher,
  updateAdminEnrollmentRequestStatus,
  updateAdminUserRole,
} from "../features/admin/api/adminApi";
import AdminAreaChart from "../features/admin/components/AdminAreaChart";
import AdminSidebar from "../features/admin/components/AdminSidebar";
import AdminStatCard from "../features/admin/components/AdminStatCard";
import AdminTopbar from "../features/admin/components/AdminTopbar";
import { useAuth } from "../features/auth/useAuth";

const defaultTeacherForm = {
  name: "",
  email: "",
  phone: "",
  photo: "",
  job_title: "",
  experience_years: "",
};

const defaultCourseForm = {
  title: "",
  short_description: "",
  description: "",
  curriculum_items: [],
  prerequisites: [],
  actual_price: "",
  discounted_price: "",
  duration: "",
  start_date: "",
  course_type: "ongoing",
  category_id: "",
  level: "beginner",
  teacher_id: "",
  photo: "",
  banner_photo: "",
  syllabus_pdf_url: "",
  intro_video_url: "",
};

const defaultCategoryForm = {
  name: "",
};

const courseLevelOptions = ["beginner", "intermediate", "advanced"];

const roleOptions = ["student", "teacher", "admin"];

const adminMenu = [
  { id: "dashboard", label: "Dashboard", caption: "Overview & activity" },
  { id: "courses", label: "Courses", caption: "Catalog management" },
  { id: "students", label: "Students", caption: "Learner roles" },
  { id: "teachers", label: "Teachers", caption: "Faculty records" },
  { id: "enrollmentRequests", label: "Enrollment Requests", caption: "Student inquiries" },
  { id: "enrollments", label: "Enrollments", caption: "Enrollment activity" },
  { id: "payments", label: "Payments", caption: "Revenue and status" },
  { id: "reports", label: "Reports", caption: "Analytics insights" },
  { id: "settings", label: "Settings", caption: "Workspace preferences" },
  { id: "profile", label: "Profile", caption: "Admin account" },
];

const shellCardClasses =
  "rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]";

const inputClasses =
  "h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const textareaClasses =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const labelClasses = "grid gap-2 text-sm font-semibold text-slate-700";

const publicCourseStatuses = new Set(["ongoing", "upcoming", "completed"]);

function formatDateInput(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function formatReadableDate(value, options) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function calculateSavingsPercentage(actualPrice, discountedPrice) {
  const actual = Number(actualPrice);
  const discounted = Number(discountedPrice);

  if (!actual || !discounted || discounted >= actual) {
    return 0;
  }

  return Math.round(((actual - discounted) / actual) * 100);
}

function categorizeDuration(duration) {
  const value = (duration || "").toLowerCase();
  const numericMatch = value.match(/(\d+(?:\.\d+)?)/);
  const amount = numericMatch ? Number(numericMatch[1]) : null;

  if (!amount) {
    return "medium";
  }

  if (value.includes("day") || value.includes("week")) {
    return "short";
  }

  if (value.includes("year")) {
    return "long";
  }

  if (value.includes("month")) {
    if (amount <= 3) {
      return "short";
    }
    if (amount <= 6) {
      return "medium";
    }
    return "long";
  }

  return "medium";
}

function matchesPriceRange(discountedPrice, range) {
  const value = Number(discountedPrice || 0);
  if (range === "under-5000") {
    return value < 5000;
  }
  if (range === "5000-10000") {
    return value >= 5000 && value <= 10000;
  }
  if (range === "10000-plus") {
    return value > 10000;
  }
  return true;
}

function normalizeCourseStatusLabel(status) {
  return (status || "").replace(/^./, (char) => char.toUpperCase());
}

function normalizeCourseLevelLabel(level) {
  return (level || "beginner").replace(/^./, (char) => char.toUpperCase());
}

function normalizeListItems(items) {
  return Array.isArray(items) ? items.filter(Boolean) : [];
}

function countWords(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean).length;
}

function shouldShowInUserCatalog(course) {
  return publicCourseStatuses.has(course?.course_type);
}

function syncCourseList(courses, changedCourse, courseType = "all") {
  if (!Array.isArray(courses) || !changedCourse) {
    return courses;
  }

  const withoutChangedCourse = courses.filter((course) => course.id !== changedCourse.id);

  if (
    !shouldShowInUserCatalog(changedCourse) ||
    (courseType !== "all" && changedCourse.course_type !== courseType)
  ) {
    return withoutChangedCourse;
  }

  return [changedCourse, ...withoutChangedCourse].sort((left, right) => {
    const leftDate = new Date(left.start_date || left.created_at).getTime();
    const rightDate = new Date(right.start_date || right.created_at).getTime();
    return leftDate - rightDate;
  });
}

function removeCourseFromList(courses, courseId) {
  if (!Array.isArray(courses)) {
    return courses;
  }

  return courses.filter((course) => course.id !== courseId);
}

function syncPublicCourseCaches(queryClient, changedCourse) {
  ["all", "ongoing", "upcoming"].forEach((courseType) => {
    queryClient.setQueryData(["courses", courseType], (currentCourses) =>
      syncCourseList(currentCourses, changedCourse, courseType),
    );
  });
}

function removeCourseFromPublicCaches(queryClient, courseId) {
  ["all", "ongoing", "upcoming"].forEach((courseType) => {
    queryClient.setQueryData(["courses", courseType], (currentCourses) =>
      removeCourseFromList(currentCourses, courseId),
    );
  });
}

function getInitials(name) {
  return (name || "A")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function buildMonthlyEnrollmentData(enrollments) {
  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      value: 0,
    };
  });

  const bucket = new Map(months.map((item) => [item.key, item]));
  enrollments.forEach((item) => {
    const date = new Date(item.enrolled_at);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (bucket.has(key)) {
      bucket.get(key).value += 1;
    }
  });

  return months;
}

function buildRecentActivity(enrollments, payments) {
  const enrollmentActivities = enrollments.map((item) => ({
    id: `enrollment-${item.id}`,
    title: `${item.user.name} enrolled in ${item.course.title}`,
    meta: `Enrollment recorded on ${formatReadableDate(item.enrolled_at)}`,
    dateValue: new Date(item.enrolled_at).getTime(),
    tone: "bg-blue-50 text-blue-600",
  }));

  const paymentActivities = payments.map((item) => ({
    id: `payment-${item.id}`,
    title: `${item.user.name} made a ${item.status} payment`,
    meta: `${formatCurrency(item.amount)} via ${item.provider.replaceAll("_", " ")}`,
    dateValue: new Date(item.created_at).getTime(),
    tone:
      item.status === "success"
        ? "bg-emerald-50 text-emerald-600"
        : item.status === "failed"
          ? "bg-rose-50 text-rose-600"
          : "bg-amber-50 text-amber-600",
  }));

  return [...enrollmentActivities, ...paymentActivities]
    .sort((left, right) => right.dateValue - left.dateValue)
    .slice(0, 6);
}

export default function AdminPanel() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isAuthLoading, user, signOut } = useAuth();
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [teacherForm, setTeacherForm] = useState(defaultTeacherForm);
  const [courseForm, setCourseForm] = useState(defaultCourseForm);
  const [categoryForm, setCategoryForm] = useState(defaultCategoryForm);
  const [curriculumInput, setCurriculumInput] = useState("");
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [draggedCurriculumIndex, setDraggedCurriculumIndex] = useState(null);
  const [courseCatalogFilters, setCourseCatalogFilters] = useState({
    search: "",
    status: "all",
    categoryId: "all",
    level: "all",
    teacherId: "all",
    duration: "all",
    priceRange: "all",
  });
  const [enrollmentRequestFilters, setEnrollmentRequestFilters] = useState({
    courseId: "all",
    status: "all",
  });
  const [teacherFeedback, setTeacherFeedback] = useState({ type: "", message: "" });
  const [courseFeedback, setCourseFeedback] = useState({ type: "", message: "" });
  const [categoryFeedback, setCategoryFeedback] = useState({ type: "", message: "" });
  const [enrollmentRequestFeedback, setEnrollmentRequestFeedback] = useState({ type: "", message: "" });
  const [roleFeedback, setRoleFeedback] = useState({ type: "", message: "" });
  const [settingsState, setSettingsState] = useState({
    emailDigests: true,
    instantNotifications: true,
    maintenanceMode: false,
  });

  const teachersQuery = useQuery({
    queryKey: ["admin", "teachers"],
    queryFn: getAdminTeachers,
    enabled: isAuthenticated && user?.role === "admin",
  });

  const coursesQuery = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: getAdminCourses,
    enabled: isAuthenticated && user?.role === "admin",
  });

  const courseCategoriesQuery = useQuery({
    queryKey: ["admin", "course-categories"],
    queryFn: getAdminCourseCategories,
    enabled: isAuthenticated && user?.role === "admin",
  });

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
    enabled: isAuthenticated && user?.role === "admin",
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["admin", "enrollments"],
    queryFn: getAdminEnrollments,
    enabled: isAuthenticated && user?.role === "admin",
  });

  const enrollmentRequestsQuery = useQuery({
    queryKey: ["admin", "enrollment-requests"],
    queryFn: getAdminEnrollmentRequests,
    enabled: isAuthenticated && user?.role === "admin",
  });

  const paymentsQuery = useQuery({
    queryKey: ["admin", "payments"],
    queryFn: getAdminPayments,
    enabled: isAuthenticated && user?.role === "admin",
  });

  const teacherMutation = useMutation({
    mutationFn: (payload) =>
      editingTeacherId
        ? updateAdminTeacher(editingTeacherId, payload)
        : createAdminTeacher(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "teachers"] });
      setTeacherForm(defaultTeacherForm);
      setEditingTeacherId(null);
      setTeacherFeedback({
        type: "success",
        message: editingTeacherId ? "Teacher updated successfully." : "Teacher created successfully.",
      });
    },
    onError: (error) => {
      setTeacherFeedback({ type: "error", message: error.message });
    },
  });

  const courseMutation = useMutation({
    mutationFn: (payload) =>
      editingCourseId
        ? updateAdminCourse(editingCourseId, payload)
        : createAdminCourse(payload),
    onSuccess: async (savedCourse) => {
      syncPublicCourseCaches(queryClient, savedCourse);
      queryClient.setQueryData(["course", savedCourse.id], savedCourse);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
        queryClient.invalidateQueries({ queryKey: ["courses"] }),
        queryClient.invalidateQueries({ queryKey: ["course"] }),
        queryClient.invalidateQueries({ queryKey: ["course-search"] }),
      ]);
      setCourseForm(defaultCourseForm);
      setEditingCourseId(null);
      setCourseFeedback({
        type: "success",
        message: editingCourseId
          ? "Course updated successfully and synced to the user course panel."
          : "Course created successfully and synced to the user course panel.",
      });
    },
    onError: (error) => {
      setCourseFeedback({ type: "error", message: error.message });
    },
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: deleteAdminTeacher,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "teachers"] });
      setTeacherFeedback({ type: "success", message: "Teacher deleted successfully." });
    },
    onError: (error) => {
      setTeacherFeedback({ type: "error", message: error.message });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteAdminCourse,
    onSuccess: async (_data, deletedCourseId) => {
      removeCourseFromPublicCaches(queryClient, deletedCourseId);
      queryClient.removeQueries({ queryKey: ["course", deletedCourseId] });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
        queryClient.invalidateQueries({ queryKey: ["courses"] }),
        queryClient.invalidateQueries({ queryKey: ["course"] }),
        queryClient.invalidateQueries({ queryKey: ["course-search"] }),
      ]);
      setCourseFeedback({ type: "success", message: "Course deleted successfully and removed from the user panel." });
    },
    onError: (error) => {
      setCourseFeedback({ type: "error", message: error.message });
    },
  });

  const categoryMutation = useMutation({
    mutationFn: (payload) =>
      editingCategoryId
        ? updateAdminCourseCategory(editingCategoryId, payload)
        : createAdminCourseCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "course-categories"] });
      setCategoryForm(defaultCategoryForm);
      setEditingCategoryId(null);
      setCategoryFeedback({
        type: "success",
        message: editingCategoryId ? "Category updated successfully." : "Category created successfully.",
      });
    },
    onError: (error) => {
      setCategoryFeedback({ type: "error", message: error.message });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteAdminCourseCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "course-categories"] });
      setCategoryFeedback({ type: "success", message: "Category deleted successfully." });
    },
    onError: (error) => {
      setCategoryFeedback({ type: "error", message: error.message });
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateAdminUserRole(userId, role),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] }),
      ]);
      setRoleFeedback({ type: "success", message: "User role updated successfully." });
    },
    onError: (error) => {
      setRoleFeedback({ type: "error", message: error.message });
    },
  });

  const enrollmentRequestStatusMutation = useMutation({
    mutationFn: ({ requestId, status }) => updateAdminEnrollmentRequestStatus(requestId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "enrollment-requests"] });
      setEnrollmentRequestFeedback({ type: "success", message: "Enrollment request status updated." });
    },
    onError: (error) => {
      setEnrollmentRequestFeedback({ type: "error", message: error.message });
    },
  });

  const enrollmentRequestAssignMutation = useMutation({
    mutationFn: ({ requestId, courseId }) => assignAdminEnrollmentRequest(requestId, courseId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "enrollment-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "enrollments"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
      ]);
      setEnrollmentRequestFeedback({ type: "success", message: "Course assigned and enrollment created." });
    },
    onError: (error) => {
      setEnrollmentRequestFeedback({ type: "error", message: error.message });
    },
  });

  const teachers = useMemo(() => teachersQuery.data ?? [], [teachersQuery.data]);
  const courses = useMemo(() => coursesQuery.data ?? [], [coursesQuery.data]);
  const courseCategories = useMemo(() => courseCategoriesQuery.data ?? [], [courseCategoriesQuery.data]);
  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const enrollments = useMemo(() => enrollmentsQuery.data ?? [], [enrollmentsQuery.data]);
  const enrollmentRequests = useMemo(() => enrollmentRequestsQuery.data ?? [], [enrollmentRequestsQuery.data]);
  const payments = useMemo(() => paymentsQuery.data ?? [], [paymentsQuery.data]);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredTeachers = useMemo(
    () =>
      teachers.filter((teacher) =>
        [teacher.name, teacher.email, teacher.phone].some((field) =>
          field?.toLowerCase().includes(normalizedSearch),
        ),
      ),
    [teachers, normalizedSearch],
  );

  const filteredCourses = useMemo(
    () => {
      const courseSearchTerm = (courseCatalogFilters.search || searchTerm).trim().toLowerCase();

      return courses.filter((course) => {
        const matchesSearch =
          !courseSearchTerm ||
          [course.title, course.teacher?.name, course.course_type, course.category?.name, course.level].some((field) =>
            field?.toLowerCase().includes(courseSearchTerm),
          );
        const matchesStatus =
          courseCatalogFilters.status === "all" || course.course_type === courseCatalogFilters.status;
        const matchesCategory =
          courseCatalogFilters.categoryId === "all" ||
          String(course.category_id) === courseCatalogFilters.categoryId;
        const matchesLevel =
          courseCatalogFilters.level === "all" || course.level === courseCatalogFilters.level;
        const matchesTeacher =
          courseCatalogFilters.teacherId === "all" ||
          String(course.teacher_id) === courseCatalogFilters.teacherId;
        const matchesDuration =
          courseCatalogFilters.duration === "all" ||
          categorizeDuration(course.duration) === courseCatalogFilters.duration;
        const matchesPrice = matchesPriceRange(
          course.discounted_price,
          courseCatalogFilters.priceRange,
        );

        return matchesSearch && matchesStatus && matchesCategory && matchesLevel && matchesTeacher && matchesDuration && matchesPrice;
      });
    },
    [courseCatalogFilters, courses, searchTerm],
  );

  const filteredUsers = useMemo(
    () =>
      users.filter((account) =>
        [account.name, account.email, account.role].some((field) =>
          field?.toLowerCase().includes(normalizedSearch),
        ),
      ),
    [users, normalizedSearch],
  );

  const filteredEnrollments = useMemo(
    () =>
      enrollments.filter((item) =>
        [item.user.name, item.user.email, item.course.title, item.status].some((field) =>
          field?.toLowerCase().includes(normalizedSearch),
        ),
      ),
    [enrollments, normalizedSearch],
  );

  const filteredEnrollmentRequests = useMemo(
    () =>
      enrollmentRequests.filter((item) => {
        const matchesSearch =
          !normalizedSearch ||
          [item.full_name, item.email, item.phone, item.course?.title, item.status].some((field) =>
            field?.toLowerCase().includes(normalizedSearch),
          );
        const matchesCourse =
          enrollmentRequestFilters.courseId === "all" ||
          String(item.course_id) === enrollmentRequestFilters.courseId;
        const matchesStatus =
          enrollmentRequestFilters.status === "all" ||
          item.status === enrollmentRequestFilters.status;

        return matchesSearch && matchesCourse && matchesStatus;
      }),
    [enrollmentRequestFilters, enrollmentRequests, normalizedSearch],
  );

  const filteredPayments = useMemo(
    () =>
      payments.filter((item) =>
        [item.user.name, item.user.email, item.course.title, item.status, item.provider].some((field) =>
          field?.toLowerCase().includes(normalizedSearch),
        ),
      ),
    [payments, normalizedSearch],
  );

  const studentUsers = filteredUsers.filter((account) => account.role === "student");
  const teacherUsers = filteredUsers.filter((account) => account.role === "teacher");
  const adminUsers = filteredUsers.filter((account) => account.role === "admin");
  const totalRevenue = payments
    .filter((item) => item.status === "success")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalStudents = users.filter((account) => account.role === "student").length;
  const pendingPayments = payments.filter((item) => item.status === "pending").length;
  const successfulPayments = payments.filter((item) => item.status === "success").length;
  const enrollmentChartData = buildMonthlyEnrollmentData(enrollments);
  const recentActivity = buildRecentActivity(enrollments, payments);

  const topCourses = useMemo(() => {
    const enrollmentCounts = new Map();
    enrollments.forEach((item) => {
      enrollmentCounts.set(item.course_id, (enrollmentCounts.get(item.course_id) || 0) + 1);
    });

    return courses
      .map((course) => ({
        ...course,
        enrollmentCount: enrollmentCounts.get(course.id) || 0,
      }))
      .sort((left, right) => right.enrollmentCount - left.enrollmentCount)
      .slice(0, 5);
  }, [courses, enrollments]);

  const recentEnrollments = filteredEnrollments.slice(0, 6);
  const statCards = [
    {
      label: "Total Students",
      value: totalStudents.toLocaleString("en-IN"),
      note: `${teacherUsers.length} promoted teachers and ${adminUsers.length} admins are active in the workspace.`,
      icon: UsersRound,
      iconTone: "bg-violet-50 text-violet-600",
    },
    {
      label: "Total Courses",
      value: courses.length.toLocaleString("en-IN"),
      note: `${courses.filter((course) => course.course_type === "upcoming").length} upcoming batches ready for launch.`,
      icon: BookOpenText,
      iconTone: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Enrollments",
      value: enrollments.length.toLocaleString("en-IN"),
      note: `${recentEnrollments.length} recent enrollments visible in the live activity feed.`,
      icon: ClipboardList,
      iconTone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      note: `${successfulPayments} successful payments processed and ${pendingPayments} pending follow-ups.`,
      icon: CircleDollarSign,
      iconTone: "bg-orange-50 text-orange-500",
    },
  ];

  function handleTeacherInputChange(event) {
    const { name, value } = event.target;
    setTeacherForm((current) => ({ ...current, [name]: value }));
  }

  function handleCourseInputChange(event) {
    const { name, value } = event.target;
    setCourseForm((current) => ({ ...current, [name]: value }));
  }

  function handleCategoryInputChange(event) {
    const { name, value } = event.target;
    setCategoryForm((current) => ({ ...current, [name]: value }));
  }

  function handleCourseListItemChange(field, index, value) {
    setCourseForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  }

  function addCourseListItem(field, value, resetValue) {
    const nextValue = value.trim();
    if (!nextValue) {
      return;
    }

    setCourseForm((current) => ({
      ...current,
      [field]: [...current[field], nextValue],
    }));
    resetValue("");
  }

  function removeCourseListItem(field, index) {
    setCourseForm((current) => ({
      ...current,
      [field]: current[field].filter((_item, itemIndex) => itemIndex !== index),
    }));
  }

  function moveCourseListItem(field, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= courseForm[field].length) {
      return;
    }

    setCourseForm((current) => {
      const nextItems = [...current[field]];
      const [movedItem] = nextItems.splice(fromIndex, 1);
      nextItems.splice(toIndex, 0, movedItem);
      return { ...current, [field]: nextItems };
    });
  }

  function handleCurriculumDrop(targetIndex) {
    if (draggedCurriculumIndex === null || draggedCurriculumIndex === targetIndex) {
      setDraggedCurriculumIndex(null);
      return;
    }

    moveCourseListItem("curriculum_items", draggedCurriculumIndex, targetIndex);
    setDraggedCurriculumIndex(null);
  }

  function handleTeacherSubmit(event) {
    event.preventDefault();
    setTeacherFeedback({ type: "", message: "" });
    teacherMutation.mutate({
      ...teacherForm,
      photo: teacherForm.photo || null,
      job_title: teacherForm.job_title || null,
      experience_years: Number(teacherForm.experience_years || 0),
    });
  }

  function handleCategorySubmit(event) {
    event.preventDefault();
    setCategoryFeedback({ type: "", message: "" });

    if (!categoryForm.name.trim()) {
      setCategoryFeedback({ type: "error", message: "Category name is required." });
      return;
    }

    categoryMutation.mutate({ name: categoryForm.name.trim() });
  }

  function handleCourseSubmit(event, statusOverride) {
    event?.preventDefault();
    setCourseFeedback({ type: "", message: "" });

    const actualPrice = Number(courseForm.actual_price);
    const discountedPrice = Number(courseForm.discounted_price);
    const teacherId = Number(courseForm.teacher_id);
    const categoryId = Number(courseForm.category_id);
    const nextCourseType =
      statusOverride || (courseForm.course_type === "draft" ? "upcoming" : courseForm.course_type);

    if (
      !courseForm.title.trim() ||
      !courseForm.duration.trim() ||
      !courseForm.short_description.trim() ||
      !courseForm.description.trim() ||
      !courseForm.level ||
      !courseForm.start_date
    ) {
      setCourseFeedback({
        type: "error",
        message: "Please complete the course title, duration, short description, description, and start date.",
      });
      return;
    }

    if (countWords(courseForm.short_description) > 30) {
      setCourseFeedback({
        type: "error",
        message: "Course short description cannot exceed 30 words.",
      });
      return;
    }

    if (countWords(courseForm.description) > 140) {
      setCourseFeedback({
        type: "error",
        message: "Course full description cannot exceed 140 words.",
      });
      return;
    }

    if (!actualPrice || !discountedPrice || actualPrice <= 0 || discountedPrice <= 0) {
      setCourseFeedback({
        type: "error",
        message: "Actual price and discounted price must be greater than zero.",
      });
      return;
    }

    if (discountedPrice > actualPrice) {
      setCourseFeedback({
        type: "error",
        message: "Discounted price cannot be greater than actual price.",
      });
      return;
    }

    if (!teacherId) {
      setCourseFeedback({
        type: "error",
        message: "Please assign a teacher before saving the course.",
      });
      return;
    }

    if (!categoryId) {
      setCourseFeedback({
        type: "error",
        message: "Please select a course category before saving the course.",
      });
      return;
    }

    courseMutation.mutate({
      ...courseForm,
      curriculum_items: normalizeListItems(courseForm.curriculum_items),
      prerequisites: normalizeListItems(courseForm.prerequisites),
      actual_price: actualPrice,
      discounted_price: discountedPrice,
      teacher_id: teacherId,
      category_id: categoryId,
      course_type: nextCourseType,
      photo: courseForm.photo || null,
      banner_photo: courseForm.banner_photo || null,
      syllabus_pdf_url: courseForm.syllabus_pdf_url || null,
      intro_video_url: courseForm.intro_video_url || null,
    });
  }

  function startTeacherEdit(teacher) {
    setSelectedSection("teachers");
    setTeacherFeedback({ type: "", message: "" });
    setEditingTeacherId(teacher.id);
    setTeacherForm({
      name: teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      photo: teacher.photo || "",
      job_title: teacher.job_title || "",
      experience_years: teacher.experience_years?.toString() || "",
    });
  }

  function startCourseEdit(course) {
    setSelectedSection("courses");
    setCourseFeedback({ type: "", message: "" });
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title || "",
      short_description: course.short_description || "",
      description: course.description || "",
      curriculum_items: normalizeListItems(course.curriculum_items),
      prerequisites: normalizeListItems(course.prerequisites),
      actual_price: course.actual_price?.toString() || "",
      discounted_price: course.discounted_price?.toString() || "",
      duration: course.duration || "",
      start_date: formatDateInput(course.start_date),
      course_type: course.course_type || "ongoing",
      category_id: course.category_id?.toString() || "",
      level: course.level || "beginner",
      teacher_id: course.teacher_id?.toString() || "",
      photo: course.photo || "",
      banner_photo: course.banner_photo || "",
      syllabus_pdf_url: course.syllabus_pdf_url || "",
      intro_video_url: course.intro_video_url || "",
    });
  }

  function startCategoryEdit(category) {
    setCategoryFeedback({ type: "", message: "" });
    setEditingCategoryId(category.id);
    setCategoryForm({ name: category.name || "" });
  }

  function resetTeacherForm() {
    setEditingTeacherId(null);
    setTeacherForm(defaultTeacherForm);
    setTeacherFeedback({ type: "", message: "" });
  }

  function resetCourseForm() {
    setEditingCourseId(null);
    setCourseForm(defaultCourseForm);
    setCurriculumInput("");
    setPrerequisiteInput("");
    setCourseFeedback({ type: "", message: "" });
  }

  function resetCategoryForm() {
    setEditingCategoryId(null);
    setCategoryForm(defaultCategoryForm);
    setCategoryFeedback({ type: "", message: "" });
  }

  function handleCourseCatalogFilterChange(event) {
    const { name, value } = event.target;
    setCourseCatalogFilters((current) => ({ ...current, [name]: value }));
  }

  function resetCourseCatalogFilters() {
    setCourseCatalogFilters({
      search: "",
      status: "all",
      categoryId: "all",
      level: "all",
      teacherId: "all",
      duration: "all",
      priceRange: "all",
    });
  }

  function confirmDeleteTeacher(teacherId) {
    if (window.confirm("Delete this teacher record?")) {
      deleteTeacherMutation.mutate(teacherId);
    }
  }

  function confirmDeleteCourse(courseId) {
    if (window.confirm("Delete this course?")) {
      deleteCourseMutation.mutate(courseId);
    }
  }

  function confirmDeleteCategory(categoryId) {
    if (window.confirm("Delete this category? Courses must be reassigned first.")) {
      deleteCategoryMutation.mutate(categoryId);
    }
  }

  function toggleSetting(key) {
    setSettingsState((current) => ({ ...current, [key]: !current[key] }));
  }

  function moveToSection(sectionId) {
    setSelectedSection(sectionId);
    setMobileSidebarOpen(false);
  }

  if (isAuthLoading) {
    return <LoadingState label="Loading admin access..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <AuthPrompt
          title="Admin access requires sign in"
          description="Sign in with Google, then use an admin account to manage courses, teachers, students, enrollments, and reporting."
        />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <EmptyState
          title="Admin access only"
          description="This dashboard is available only for admin accounts. Update the user role first, then refresh and return here."
        />
      </div>
    );
  }

  const hasLoadingState =
    teachersQuery.isLoading ||
    courseCategoriesQuery.isLoading ||
    coursesQuery.isLoading ||
    usersQuery.isLoading ||
    enrollmentsQuery.isLoading ||
    enrollmentRequestsQuery.isLoading ||
    paymentsQuery.isLoading;

  if (hasLoadingState) {
    return <LoadingState label="Loading the Swadesh Academy admin dashboard..." />;
  }

  const queryError =
    teachersQuery.error ||
    courseCategoriesQuery.error ||
    coursesQuery.error ||
    usersQuery.error ||
    enrollmentsQuery.error ||
    enrollmentRequestsQuery.error ||
    paymentsQuery.error;

  function renderDashboardSection() {
    return (
      <div className="space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Welcome back, {user?.name?.split(" ")[0] || "Swadesh"}.
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
              Here&apos;s what&apos;s happening across Swadesh Academy today, from learner activity and
              payments to course and faculty operations.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {statCards.map((card) => (
            <AdminStatCard key={card.label} {...card} />
          ))}
        </section>

        <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
          <AdminAreaChart
            data={enrollmentChartData}
            title="Enrollments Overview"
            subtitle="A rolling view of enrollment growth across the most recent six-month window."
          />

          <div className={`${shellCardClasses} space-y-6`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-950">Recent activity</h2>
                <p className="mt-2 text-sm text-slate-500">Operational moments pulled from live enrollments and payments.</p>
              </div>
              <button
                type="button"
                onClick={() => moveToSection("reports")}
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View reports
              </button>
            </div>

            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <EmptyState
                  title="No recent activity yet"
                  description="As payments and enrollments happen, the latest events will appear here."
                />
              ) : (
                recentActivity.map((item) => (
                  <article key={item.id} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
                      <Sparkles size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.meta}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
          <div className={`${shellCardClasses} overflow-hidden`}>
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-950">Recent enrollments</h2>
                <p className="mt-2 text-sm text-slate-500">The latest learner confirmations across your active courses.</p>
              </div>
              <button
                type="button"
                onClick={() => moveToSection("enrollments")}
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View all
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              {recentEnrollments.length === 0 ? (
                <EmptyState
                  title="No enrollments yet"
                  description="This table will populate as new learners join the academy."
                />
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="py-3 pr-4 font-semibold">Student</th>
                      <th className="py-3 pr-4 font-semibold">Course</th>
                      <th className="py-3 pr-4 font-semibold">Date</th>
                      <th className="py-3 pr-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEnrollments.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                              {getInitials(item.user.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{item.user.name}</p>
                              <p className="text-xs text-slate-500">{item.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-slate-700">{item.course.title}</td>
                        <td className="py-4 pr-4 text-slate-500">{formatReadableDate(item.enrolled_at)}</td>
                        <td className="py-4 pr-4">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className={`${shellCardClasses} space-y-6`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-950">Top courses</h2>
                <p className="mt-2 text-sm text-slate-500">Most enrolled programs from your current course catalog.</p>
              </div>
              <button
                type="button"
                onClick={() => moveToSection("courses")}
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View courses
              </button>
            </div>

            <div className="space-y-4">
              {topCourses.length === 0 ? (
                <EmptyState
                  title="No top course data yet"
                  description="Once enrollments begin, your most popular programs will be highlighted here."
                />
              ) : (
                topCourses.map((course, index) => {
                  const maxEnrollments = Math.max(...topCourses.map((item) => item.enrollmentCount), 1);
                  const percent = (course.enrollmentCount / maxEnrollments) * 100;

                  return (
                    <article key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-900">{course.title}</span>
                        </div>
                        <span className="text-slate-500">{course.enrollmentCount} enrollments</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#2563eb,#0ea5e9)]"
                          style={{ width: `${Math.max(percent, 10)}%` }}
                        />
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          {[
            {
              title: "Course manager",
              description: "Launch a new course or update teacher assignments without leaving the dashboard.",
              action: "Go to Courses",
              target: "courses",
              icon: BookOpenText,
            },
            {
              title: "Teacher desk",
              description: "Add faculty profiles and keep contact details ready for upcoming batches.",
              action: "Open Teachers",
              target: "teachers",
              icon: GraduationCap,
            },
            {
              title: "Finance review",
              description: "Inspect recent transactions, payment statuses, and revenue health in one place.",
              action: "View Payments",
              target: "payments",
              icon: CreditCard,
            },
          ].map((widget) => {
            const Icon = widget.icon;
            return (
              <button
                key={widget.title}
                type="button"
                onClick={() => moveToSection(widget.target)}
                className="group rounded-[1.85rem] border border-slate-200/80 bg-white/95 p-5 text-left shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.1)]"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-heading font-bold text-slate-950">{widget.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{widget.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                  {widget.action}
                  <ArrowRight size={16} className="transition duration-300 group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </section>
      </div>
    );
  }

  function renderCoursesSection() {
    const courseSavings = calculateSavingsPercentage(
      courseForm.actual_price,
      courseForm.discounted_price,
    );
    const isCatalogLoading = coursesQuery.isLoading;
    const isCatalogError = coursesQuery.isError;
    const hasNoCourses = !isCatalogLoading && !isCatalogError && courses.length === 0;
    const hasNoFilteredCourses =
      !isCatalogLoading && !isCatalogError && courses.length > 0 && filteredCourses.length === 0;

    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(360px,0.4fr)_minmax(0,0.6fr)]">
        <section className={`${shellCardClasses} self-start`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">Course Management</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950">
                {editingCourseId ? "Update course" : "Create a new course"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Create or update courses once, and the user course panel will reflect those changes automatically.
              </p>
            </div>
            {editingCourseId ? (
              <button
                type="button"
                onClick={resetCourseForm}
                className="h-11 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <form onSubmit={handleCourseSubmit} className="mt-8 grid gap-7">
            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Basic Information</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClasses}>
                  Course Title
                  <input
                    name="title"
                    value={courseForm.title}
                    onChange={handleCourseInputChange}
                    placeholder="e.g. Core Java"
                    className={inputClasses}
                    required
                  />
                </label>
                <label className={labelClasses}>
                  Duration
                  <input
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleCourseInputChange}
                    placeholder="6 Months"
                    className={inputClasses}
                    required
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Course Description</p>
              <label className={labelClasses}>
                Short Description
                <textarea
                  name="short_description"
                  value={courseForm.short_description}
                  onChange={handleCourseInputChange}
                  placeholder="Write a concise summary for course cards and hero sections."
                  rows={3}
                  className={textareaClasses}
                  required
                />
                <span className={`text-xs font-medium ${countWords(courseForm.short_description) > 30 ? "text-rose-600" : "text-slate-400"}`}>
                  {countWords(courseForm.short_description)}/30 words
                </span>
              </label>
              <label className={labelClasses}>
                Full Description
                <textarea
                  name="description"
                  value={courseForm.description}
                  onChange={handleCourseInputChange}
                  placeholder="Write the complete course overview, outcomes, and syllabus summary."
                  rows={5}
                  className={textareaClasses}
                  required
                />
                <span className={`text-xs font-medium ${countWords(courseForm.description) > 140 ? "text-rose-600" : "text-slate-400"}`}>
                  {countWords(courseForm.description)}/140 words
                </span>
              </label>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Course Classification</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClasses}>
                  Course Category
                  <select
                    name="category_id"
                    value={courseForm.category_id}
                    onChange={handleCourseInputChange}
                    className={inputClasses}
                    required
                  >
                    <option value="">Select category</option>
                    {courseCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={labelClasses}>
                  Course Level
                  <select
                    name="level"
                    value={courseForm.level}
                    onChange={handleCourseInputChange}
                    className={inputClasses}
                    required
                  >
                    {courseLevelOptions.map((level) => (
                      <option key={level} value={level}>
                        {normalizeCourseLevelLabel(level)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                  <input
                    name="name"
                    value={categoryForm.name}
                    onChange={handleCategoryInputChange}
                    placeholder="Add or update category"
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    onClick={handleCategorySubmit}
                    disabled={categoryMutation.isPending}
                    className="h-14 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
                  >
                    {editingCategoryId ? "Update" : "Add"}
                  </button>
                  {editingCategoryId ? (
                    <button
                      type="button"
                      onClick={resetCategoryForm}
                      className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
                <FeedbackMessage type={categoryFeedback.type || "info"} message={categoryFeedback.message} />
                <div className="mt-4 flex flex-wrap gap-2">
                  {courseCategories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      {category.name}
                      <button type="button" onClick={() => startCategoryEdit(category)} className="text-indigo-600">
                        Edit
                      </button>
                      <button type="button" onClick={() => confirmDeleteCategory(category.id)} className="text-rose-600">
                        Delete
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Course Curriculum</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={curriculumInput}
                  onChange={(event) => setCurriculumInput(event.target.value)}
                  placeholder="Add curriculum item"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => addCourseListItem("curriculum_items", curriculumInput, setCurriculumInput)}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              <div className="grid gap-2">
                {courseForm.curriculum_items.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    draggable
                    onDragStart={() => setDraggedCurriculumIndex(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleCurriculumDrop(index)}
                    className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400">
                      <GripVertical size={16} />
                    </span>
                    <input
                      value={item}
                      onChange={(event) => handleCourseListItemChange("curriculum_items", index, event.target.value)}
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => moveCourseListItem("curriculum_items", index, index - 1)} className="rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600">
                        Up
                      </button>
                      <button type="button" onClick={() => moveCourseListItem("curriculum_items", index, index + 1)} className="rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600">
                        Down
                      </button>
                      <button type="button" onClick={() => removeCourseListItem("curriculum_items", index)} className="rounded-xl border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-600">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Prerequisites</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={prerequisiteInput}
                  onChange={(event) => setPrerequisiteInput(event.target.value)}
                  placeholder="Add prerequisite"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => addCourseListItem("prerequisites", prerequisiteInput, setPrerequisiteInput)}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              <div className="grid gap-2">
                {courseForm.prerequisites.map((item, index) => (
                  <div key={`${item}-${index}`} className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <input
                      value={item}
                      onChange={(event) => handleCourseListItemChange("prerequisites", index, event.target.value)}
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500"
                    />
                    <button type="button" onClick={() => removeCourseListItem("prerequisites", index)} className="rounded-xl border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-600">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pricing</p>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <BadgePercent size={14} />
                  You Save: {courseSavings}%
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClasses}>
                  Actual Price
                  <input
                    name="actual_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={courseForm.actual_price}
                    onChange={handleCourseInputChange}
                    placeholder="e.g. 7999"
                    className={inputClasses}
                    required
                  />
                </label>
                <label className={labelClasses}>
                  Discounted Price
                  <input
                    name="discounted_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={courseForm.discounted_price}
                    onChange={handleCourseInputChange}
                    placeholder="e.g. 4999"
                    className={inputClasses}
                    required
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Course Details</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClasses}>
                  Start Date
                  <input
                    name="start_date"
                    type="date"
                    value={courseForm.start_date}
                    onChange={handleCourseInputChange}
                    className={inputClasses}
                    required
                  />
                </label>
                <label className={labelClasses}>
                  Status
                  <select
                    name="course_type"
                    value={courseForm.course_type}
                    onChange={handleCourseInputChange}
                    className={inputClasses}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Resources</p>
              <label className={labelClasses}>
                Assign Teacher
                <select
                  name="teacher_id"
                  value={courseForm.teacher_id}
                  onChange={handleCourseInputChange}
                  className={inputClasses}
                  disabled={teachersQuery.isLoading || teachersQuery.isError}
                  required
                >
                  <option value="">
                    {teachersQuery.isLoading
                      ? "Loading teachers..."
                      : teachersQuery.isError
                        ? "Failed to load teachers"
                        : teachers.length === 0
                          ? "No teachers available"
                          : "Assign a teacher"}
                  </option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}{teacher.job_title ? ` - ${teacher.job_title}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              {teachersQuery.isError ? (
                <button
                  type="button"
                  onClick={() => teachersQuery.refetch()}
                  className="justify-self-start rounded-xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                >
                  Retry Teachers
                </button>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClasses}>
                  Course Preview Photo URL
                  <input
                    name="photo"
                    value={courseForm.photo}
                    onChange={handleCourseInputChange}
                    placeholder="https://..."
                    className={inputClasses}
                  />
                </label>
                <label className={labelClasses}>
                  Course Banner Photo URL
                  <input
                    name="banner_photo"
                    value={courseForm.banner_photo}
                    onChange={handleCourseInputChange}
                    placeholder="https://..."
                    className={inputClasses}
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClasses}>
                  Intro Video URL
                  <input
                    name="intro_video_url"
                    value={courseForm.intro_video_url}
                    onChange={handleCourseInputChange}
                    placeholder="https://..."
                    className={inputClasses}
                  />
                </label>
                <label className={labelClasses}>
                  Syllabus PDF URL
                  <input
                    name="syllabus_pdf_url"
                    value={courseForm.syllabus_pdf_url}
                    onChange={handleCourseInputChange}
                    placeholder="https://..."
                    className={inputClasses}
                  />
                </label>
              </div>
            </div>

            <FeedbackMessage type={courseFeedback.type || "info"} message={courseFeedback.message} />

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetCourseForm}
                className="h-12 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(event) => handleCourseSubmit(event, "draft")}
                disabled={courseMutation.isPending}
                className="h-12 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={courseMutation.isPending}
                className="h-12 rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.26)] transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {courseMutation.isPending
                  ? "Saving..."
                  : editingCourseId
                    ? "Update Course"
                    : "Publish Course"}
              </button>
            </div>
          </form>
        </section>

        <section className={`${shellCardClasses} min-w-0`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-950">Course catalog</h2>
              <p className="mt-2 text-sm text-slate-500">
                Live data from the admin API with searchable, filterable course records.
              </p>
            </div>
            <span className="self-start rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 sm:self-auto">
              {courses.length} total / {filteredCourses.length} shown
            </span>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="search"
                  value={courseCatalogFilters.search}
                  onChange={handleCourseCatalogFilterChange}
                  placeholder="Search course name, teacher, or status"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
                <select
                  name="status"
                  value={courseCatalogFilters.status}
                  onChange={handleCourseCatalogFilterChange}
                  className={inputClasses}
                >
                  <option value="all">All Statuses</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
                <select
                  name="teacherId"
                  value={courseCatalogFilters.teacherId}
                  onChange={handleCourseCatalogFilterChange}
                  className={inputClasses}
                  disabled={teachersQuery.isLoading || teachersQuery.isError}
                >
                  <option value="all">
                    {teachersQuery.isLoading
                      ? "Loading Teachers"
                      : teachersQuery.isError
                        ? "Teachers Failed"
                        : "All Teachers"}
                  </option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                <select
                  name="duration"
                  value={courseCatalogFilters.duration}
                  onChange={handleCourseCatalogFilterChange}
                  className={inputClasses}
                >
                  <option value="all">All Durations</option>
                  <option value="short">Short Term</option>
                  <option value="medium">Medium Term</option>
                  <option value="long">Long Term</option>
                </select>
                <select
                  name="priceRange"
                  value={courseCatalogFilters.priceRange}
                  onChange={handleCourseCatalogFilterChange}
                  className={inputClasses}
                >
                  <option value="all">All Prices</option>
                  <option value="under-5000">Under Rs. 5,000</option>
                  <option value="5000-10000">Rs. 5,000 - Rs. 10,000</option>
                  <option value="10000-plus">Above Rs. 10,000</option>
                </select>
                <button
                  type="button"
                  onClick={resetCourseCatalogFilters}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <FilterX size={16} />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            {isCatalogLoading ? (
              <div className="p-6">
                <LoadingState label="Loading courses..." />
              </div>
            ) : null}

            {isCatalogError ? (
              <div className="grid gap-4 p-6">
                <FeedbackMessage
                  type="error"
                  message={coursesQuery.error?.message || "Failed to load courses."}
                />
                <button
                  type="button"
                  onClick={() => coursesQuery.refetch()}
                  className="justify-self-start rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Retry Courses
                </button>
              </div>
            ) : null}

            {hasNoCourses ? (
              <div className="grid min-h-72 place-items-center p-6 text-center">
                <div>
                  <div className="text-4xl" aria-hidden="true">
                    📚
                  </div>
                  <h3 className="mt-4 text-xl font-heading font-bold text-slate-950">No Courses Yet</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Create your first course to start building the Swadesh Academy catalog.
                  </p>
                  <button
                    type="button"
                    onClick={resetCourseForm}
                    className="mt-5 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.22)] transition hover:bg-indigo-700"
                  >
                    Create Course
                  </button>
                </div>
              </div>
            ) : null}

            {hasNoFilteredCourses ? (
              <div className="p-6">
                <EmptyState
                  title="No courses found"
                  description="Adjust the search or filters to find matching records."
                />
              </div>
            ) : null}

            {!isCatalogLoading && !isCatalogError && filteredCourses.length > 0 ? (
              <>
                <div className="hidden max-h-[36rem] overflow-y-auto scroll-smooth md:block">
                  <table className="min-w-[1120px] table-fixed text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500">
                        <th className="w-[22%] px-4 py-4 font-semibold">Course</th>
                        <th className="w-[13%] px-4 py-4 font-semibold">Category</th>
                        <th className="w-[10%] px-4 py-4 font-semibold">Level</th>
                        <th className="w-[15%] px-4 py-4 font-semibold">Teacher</th>
                        <th className="w-[10%] px-4 py-4 font-semibold">Duration</th>
                        <th className="w-[11%] px-4 py-4 font-semibold">Actual Price</th>
                        <th className="w-[12%] px-4 py-4 font-semibold">Discounted</th>
                        <th className="w-[9%] px-4 py-4 font-semibold">Status</th>
                        <th className="w-[10%] px-4 py-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredCourses.map((course) => (
                        <tr key={course.id} className="transition hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {course.photo ? (
                                <img src={course.photo} alt={course.title} className="h-12 w-16 rounded-xl object-cover" />
                              ) : (
                                <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-slate-100 text-[10px] font-semibold text-slate-500">
                                  No image
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => setPreviewCourse(course)}
                                className="line-clamp-2 text-left font-semibold text-slate-900 transition hover:text-indigo-700"
                              >
                                {course.title}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-slate-600">{course.category?.name || "Unassigned"}</td>
                          <td className="px-4 py-4 text-slate-600 capitalize">{course.level || "beginner"}</td>
                          <td className="px-4 py-4 text-slate-600">{course.teacher?.name || "Not assigned"}</td>
                          <td className="px-4 py-4 text-slate-600">{course.duration}</td>
                          <td className="px-4 py-4 text-slate-500 line-through">
                            {formatCurrency(course.actual_price)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-slate-900">
                              {formatCurrency(course.discounted_price)}
                            </div>
                            <div className="text-xs font-medium text-emerald-600">
                              Save {course.savings_percentage}%
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                              {normalizeCourseStatusLabel(course.course_type)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewCourse(course)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
                                aria-label={`View ${course.title}`}
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => startCourseEdit(course)}
                                className="h-9 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => confirmDeleteCourse(course.id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                                aria-label={`Delete ${course.title}`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid max-h-[36rem] gap-4 overflow-y-auto p-4 scroll-smooth md:hidden">
                  {filteredCourses.map((course) => (
                    <article key={course.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      {course.photo ? (
                        <img src={course.photo} alt={course.title} className="mb-4 aspect-video w-full rounded-2xl object-cover" />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setPreviewCourse(course)}
                        className="text-left text-lg font-heading font-bold text-slate-950"
                      >
                        {course.title}
                      </button>
                      <div className="mt-3 grid gap-2 text-sm text-slate-600">
                        <p>Teacher: {course.teacher?.name || "Not assigned"}</p>
                        <p>Category: {course.category?.name || "Unassigned"}</p>
                        <p>Level: {normalizeCourseLevelLabel(course.level)}</p>
                        <p>Duration: {course.duration}</p>
                        <p>Actual Price: {formatCurrency(course.actual_price)}</p>
                        <p>Discounted Price: {formatCurrency(course.discounted_price)}</p>
                        <p>Status: {normalizeCourseStatusLabel(course.course_type)}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewCourse(course)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => startCourseEdit(course)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDeleteCourse(course.id)}
                          className="rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {previewCourse ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
              <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-700">Course Details</p>
                    <h3 className="mt-2 text-2xl font-heading font-bold text-slate-950">
                      {previewCourse.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewCourse(null)}
                    className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                    aria-label="Close course details"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="max-h-[calc(90vh-96px)] overflow-y-auto px-6 py-6">
                  <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                        {previewCourse.banner_photo || previewCourse.photo ? (
                          <img
                            src={previewCourse.banner_photo || previewCourse.photo}
                            alt={previewCourse.title}
                            className="h-56 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-56 items-center justify-center bg-[linear-gradient(135deg,#dbeafe,#eff6ff)] p-6 text-center text-sm font-semibold text-slate-600">
                            Course image not added yet
                          </div>
                        )}
                      </div>

                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Short Description</p>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {previewCourse.short_description || "No short description added."}
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Description</p>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{previewCourse.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Teacher</p>
                          <p className="mt-2 text-base font-semibold text-slate-900">
                            {previewCourse.teacher?.name || "Not assigned"}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {previewCourse.teacher?.job_title || "Job title not added"}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {(previewCourse.teacher?.experience_years || 0)}+ years experience
                          </p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</p>
                          <p className="mt-2 text-base font-semibold text-slate-900">
                            {normalizeCourseStatusLabel(previewCourse.course_type)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Created {formatReadableDate(previewCourse.created_at)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Updated {formatReadableDate(previewCourse.updated_at)}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Actual Price</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">
                            {formatCurrency(previewCourse.actual_price)}
                          </p>
                        </div>
                        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Discounted Price</p>
                          <p className="mt-2 text-lg font-semibold text-emerald-900">
                            {formatCurrency(previewCourse.discounted_price)}
                          </p>
                          <p className="mt-1 text-sm text-emerald-700">You save {previewCourse.savings_percentage}%</p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Duration</p>
                          <p className="mt-2 text-base font-semibold text-slate-900">{previewCourse.duration}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Start Date</p>
                          <p className="mt-2 text-base font-semibold text-slate-900">
                            {formatReadableDate(previewCourse.start_date)}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Category</p>
                          <p className="mt-2 text-base font-semibold text-slate-900">
                            {previewCourse.category?.name || "Unassigned"}
                          </p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Level</p>
                          <p className="mt-2 text-base font-semibold text-slate-900">
                            {normalizeCourseLevelLabel(previewCourse.level)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Curriculum</p>
                        <div className="mt-3 grid gap-2">
                          {normalizeListItems(previewCourse.curriculum_items).length ? (
                            normalizeListItems(previewCourse.curriculum_items).map((item, index) => (
                              <p key={`${item}-${index}`} className="text-sm text-slate-600">
                                {index + 1}. {item}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">No curriculum items added.</p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Prerequisites</p>
                        <div className="mt-3 grid gap-2">
                          {normalizeListItems(previewCourse.prerequisites).length ? (
                            normalizeListItems(previewCourse.prerequisites).map((item, index) => (
                              <p key={`${item}-${index}`} className="text-sm text-slate-600">
                                {item}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">No prerequisites added.</p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Syllabus PDF</p>
                          {previewCourse.syllabus_pdf_url ? (
                            <a
                              href={previewCourse.syllabus_pdf_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition hover:text-indigo-800"
                            >
                              Open syllabus
                              <ExternalLink size={14} />
                            </a>
                          ) : (
                            <p className="mt-2 text-sm text-slate-500">No syllabus URL provided.</p>
                          )}
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Intro Video</p>
                          {previewCourse.intro_video_url ? (
                            <a
                              href={previewCourse.intro_video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition hover:text-indigo-800"
                            >
                              Open intro video
                              <ExternalLink size={14} />
                            </a>
                          ) : (
                            <p className="mt-2 text-sm text-slate-500">No intro video URL provided.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    );
  }

  function renderTeachersSection() {
    return (
      <div className="grid gap-6 2xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.15fr)]">
        <section className={shellCardClasses}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Teacher Management</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950">
                {editingTeacherId ? "Update teacher" : "Create a teacher profile"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Keep faculty records clean so teacher assignments stay fast and consistent.
              </p>
            </div>
            {editingTeacherId ? (
              <button
                type="button"
                onClick={resetTeacherForm}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <form onSubmit={handleTeacherSubmit} className="mt-6 grid gap-4">
            <input
              name="name"
              value={teacherForm.name}
              onChange={handleTeacherInputChange}
              placeholder="Teacher name"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              required
            />
            <input
              name="email"
              type="email"
              value={teacherForm.email}
              onChange={handleTeacherInputChange}
              placeholder="Teacher email"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              required
            />
            <input
              name="phone"
              value={teacherForm.phone}
              onChange={handleTeacherInputChange}
              placeholder="Teacher phone"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              required
            />
            <input
              name="photo"
              value={teacherForm.photo}
              onChange={handleTeacherInputChange}
              placeholder="Teacher photo URL"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
            />
            <input
              name="job_title"
              value={teacherForm.job_title}
              onChange={handleTeacherInputChange}
              placeholder="Job title, e.g. Senior Java Developer"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
            />
            <input
              name="experience_years"
              type="number"
              min="0"
              value={teacherForm.experience_years}
              onChange={handleTeacherInputChange}
              placeholder="Years of experience"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
            />

            <FeedbackMessage type={teacherFeedback.type || "info"} message={teacherFeedback.message} />

            <button
              type="submit"
              disabled={teacherMutation.isPending}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {teacherMutation.isPending
                ? "Saving teacher..."
                : editingTeacherId
                  ? "Update Teacher"
                  : "Create Teacher"}
            </button>
          </form>
        </section>

        <section className={shellCardClasses}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-950">Faculty roster</h2>
              <p className="mt-2 text-sm text-slate-500">Teacher directory with quick edit and assignment context.</p>
            </div>
            <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
              {filteredTeachers.length} teachers
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            {filteredTeachers.length === 0 ? (
              <EmptyState
                title="No teachers found"
                description="Adjust your search or add a teacher record to begin assigning faculty."
              />
            ) : (
              filteredTeachers.map((teacher) => (
                <article
                  key={teacher.id}
                  className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      {teacher.photo ? (
                        <img src={teacher.photo} alt={teacher.name} className="h-14 w-14 rounded-2xl object-cover" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dbeafe,#c4b5fd)] text-sm font-semibold text-slate-700">
                          {getInitials(teacher.name)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">{teacher.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-violet-700">
                          {teacher.job_title || "Job title not added"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{teacher.email}</p>
                        <p className="mt-1 text-sm text-slate-400">{teacher.phone}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startTeacherEdit(teacher)}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDeleteTeacher(teacher.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                      {teacher.course_count} assigned courses
                    </span>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                      {(teacher.experience_years || 0)}+ years experience
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    );
  }

  function renderStudentsSection() {
    return (
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <AdminStatCard
            icon={UsersRound}
            iconTone="bg-blue-50 text-blue-600"
            label="Students"
            value={studentUsers.length.toLocaleString("en-IN")}
            note="All first-time users start as students by default."
          />
          <AdminStatCard
            icon={BookUser}
            iconTone="bg-violet-50 text-violet-600"
            label="Teacher Roles"
            value={teacherUsers.length.toLocaleString("en-IN")}
            note="Users promoted into teaching responsibilities."
          />
          <AdminStatCard
            icon={ShieldCheck}
            iconTone="bg-amber-50 text-amber-600"
            label="Admin Roles"
            value={adminUsers.length.toLocaleString("en-IN")}
            note="Core operators with access to the admin workspace."
          />
        </section>

        <section className={shellCardClasses}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Student Management</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950">Users and role control</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Promote students into teachers or admins as your operational team grows.
              </p>
            </div>
            <div className="w-full max-w-md">
              <FeedbackMessage type={roleFeedback.type || "info"} message={roleFeedback.message} />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <EmptyState
                title="No users match this search"
                description="Try a different keyword to find the account you want to manage."
              />
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">User</th>
                    <th className="py-3 pr-4 font-semibold">Current role</th>
                    <th className="py-3 pr-4 font-semibold">Joined</th>
                    <th className="py-3 pr-4 font-semibold">Update role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((account) => (
                    <tr key={account.id} className="border-t border-slate-100">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                            {getInitials(account.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{account.name}</p>
                            <p className="text-xs text-slate-500">{account.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                          {account.role}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-slate-500">{formatReadableDate(account.created_at)}</td>
                      <td className="py-4 pr-4">
                        <select
                          value={account.role}
                          onChange={(event) =>
                            roleMutation.mutate({
                              userId: account.id,
                              role: event.target.value,
                            })
                          }
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500"
                          disabled={roleMutation.isPending && roleMutation.variables?.userId === account.id}
                        >
                          {roleOptions.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    );
  }

  function renderEnrollmentRequestsSection() {
    const requestStatuses = ["new", "contacted", "approved", "assigned", "rejected"];
    const pendingCount = filteredEnrollmentRequests.filter((item) =>
      ["new", "contacted", "approved"].includes(item.status),
    ).length;

    return (
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <AdminStatCard
            icon={ClipboardList}
            iconTone="bg-blue-50 text-blue-600"
            label="Total Requests"
            value={filteredEnrollmentRequests.length.toLocaleString("en-IN")}
            note="Student course inquiries waiting for review and follow-up."
          />
          <AdminStatCard
            icon={BadgeCheck}
            iconTone="bg-emerald-50 text-emerald-600"
            label="Assigned"
            value={filteredEnrollmentRequests.filter((item) => item.status === "assigned").length.toLocaleString("en-IN")}
            note="Requests already converted into course access."
          />
          <AdminStatCard
            icon={UsersRound}
            iconTone="bg-violet-50 text-violet-600"
            label="Needs Action"
            value={pendingCount.toLocaleString("en-IN")}
            note="New, contacted, or approved requests that can still move forward."
          />
        </section>

        <section className={shellCardClasses}>
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Enrollment Requests</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950">Student request pipeline</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Review student details, qualify the request, and assign access after approval.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-[520px]">
              <select
                value={enrollmentRequestFilters.courseId}
                onChange={(event) =>
                  setEnrollmentRequestFilters((current) => ({ ...current, courseId: event.target.value }))
                }
                className={inputClasses}
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
              <select
                value={enrollmentRequestFilters.status}
                onChange={(event) =>
                  setEnrollmentRequestFilters((current) => ({ ...current, status: event.target.value }))
                }
                className={`${inputClasses} capitalize`}
              >
                <option value="all">All Statuses</option>
                {requestStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {enrollmentRequestFeedback.message ? (
            <div className="mt-5">
              <FeedbackMessage type={enrollmentRequestFeedback.type} message={enrollmentRequestFeedback.message} />
            </div>
          ) : null}

          <div className="mt-6 overflow-x-auto">
            {filteredEnrollmentRequests.length === 0 ? (
              <EmptyState
                title="No enrollment requests found"
                description="Requests submitted from course pages will appear here."
              />
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">Student</th>
                    <th className="py-3 pr-4 font-semibold">Requested Course</th>
                    <th className="py-3 pr-4 font-semibold">Request Date</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-4 font-semibold">Assign Course</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnrollmentRequests.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100 align-top">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-slate-900">{item.full_name}</div>
                        <div className="text-xs text-slate-500">{item.email}</div>
                        <div className="text-xs text-slate-500">{item.phone}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="font-medium text-slate-800">{item.course?.title || "Course removed"}</div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {item.course?.course_type || "request"}
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-slate-500">{formatReadableDate(item.created_at)}</td>
                      <td className="py-4 pr-4">
                        <select
                          value={item.status}
                          onChange={(event) =>
                            enrollmentRequestStatusMutation.mutate({
                              requestId: item.id,
                              status: event.target.value,
                            })
                          }
                          disabled={enrollmentRequestStatusMutation.isPending}
                          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                          {requestStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex min-w-[260px] gap-2">
                          <select
                            defaultValue={item.course_id}
                            onChange={(event) => {
                              event.currentTarget.dataset.selectedCourseId = event.target.value;
                            }}
                            data-selected-course-id={item.course_id}
                            className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          >
                            {courses.map((course) => (
                              <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            disabled={item.status === "assigned" || enrollmentRequestAssignMutation.isPending}
                            onClick={(event) => {
                              const select = event.currentTarget.parentElement.querySelector("select");
                              enrollmentRequestAssignMutation.mutate({
                                requestId: item.id,
                                courseId: Number(select?.dataset.selectedCourseId || item.course_id),
                              });
                            }}
                            className="rounded-xl bg-blue-700 px-4 text-xs font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            {item.status === "assigned" ? "Assigned" : "Assign"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    );
  }

  function renderEnrollmentsSection() {
    return (
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <AdminStatCard
            icon={ClipboardList}
            iconTone="bg-emerald-50 text-emerald-600"
            label="Active Enrollments"
            value={filteredEnrollments.filter((item) => item.status === "active").length.toLocaleString("en-IN")}
            note="Learners currently attached to active enrollment records."
          />
          <AdminStatCard
            icon={BookOpenText}
            iconTone="bg-cyan-50 text-cyan-600"
            label="Unique Courses"
            value={new Set(filteredEnrollments.map((item) => item.course_id)).size.toLocaleString("en-IN")}
            note="Programs represented inside the current filtered enrollment set."
          />
          <AdminStatCard
            icon={UsersRound}
            iconTone="bg-violet-50 text-violet-600"
            label="Unique Learners"
            value={new Set(filteredEnrollments.map((item) => item.user_id)).size.toLocaleString("en-IN")}
            note="Students participating across current enrollment activity."
          />
        </section>

        <section className={shellCardClasses}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Enrollment Management</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950">Enrollment records</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Review who enrolled, which course they joined, and the current enrollment state.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              {filteredEnrollments.length} records
            </span>
          </div>

          <div className="mt-6 overflow-x-auto">
            {filteredEnrollments.length === 0 ? (
              <EmptyState
                title="No enrollments found"
                description="Once students begin joining programs, those records will appear here."
              />
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">Student</th>
                    <th className="py-3 pr-4 font-semibold">Course</th>
                    <th className="py-3 pr-4 font-semibold">Enrolled on</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnrollments.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-slate-900">{item.user.name}</div>
                        <div className="text-xs text-slate-500">{item.user.email}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="font-medium text-slate-800">{item.course.title}</div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {item.course.course_type}
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-slate-500">{formatReadableDate(item.enrolled_at)}</td>
                      <td className="py-4 pr-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    );
  }

  function renderPaymentsSection() {
    return (
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <AdminStatCard
            icon={CircleDollarSign}
            iconTone="bg-orange-50 text-orange-500"
            label="Collected Revenue"
            value={formatCurrency(totalRevenue)}
            note="Successful transactions processed through the academy checkout flow."
          />
          <AdminStatCard
            icon={CreditCard}
            iconTone="bg-amber-50 text-amber-600"
            label="Pending Payments"
            value={pendingPayments.toLocaleString("en-IN")}
            note="Transactions that still require completion or follow-up."
          />
          <AdminStatCard
            icon={ShieldCheck}
            iconTone="bg-emerald-50 text-emerald-600"
            label="Success Rate"
            value={`${payments.length ? Math.round((successfulPayments / payments.length) * 100) : 0}%`}
            note="Percentage of successful payments in the current payment dataset."
          />
        </section>

        <section className={shellCardClasses}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Payments</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950">Payment operations</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Monitor transaction status, course context, and learner billing records.
              </p>
            </div>
            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
              {filteredPayments.length} payments
            </span>
          </div>

          <div className="mt-6 overflow-x-auto">
            {filteredPayments.length === 0 ? (
              <EmptyState
                title="No payments found"
                description="As students complete checkout, payment activity will appear here."
              />
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">Student</th>
                    <th className="py-3 pr-4 font-semibold">Course</th>
                    <th className="py-3 pr-4 font-semibold">Amount</th>
                    <th className="py-3 pr-4 font-semibold">Date</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-slate-900">{item.user.name}</div>
                        <div className="text-xs text-slate-500">{item.user.email}</div>
                      </td>
                      <td className="py-4 pr-4 text-slate-700">{item.course.title}</td>
                      <td className="py-4 pr-4 font-semibold text-slate-900">{formatCurrency(item.amount)}</td>
                      <td className="py-4 pr-4 text-slate-500">{formatReadableDate(item.created_at)}</td>
                      <td className="py-4 pr-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                            item.status === "success"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "failed"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    );
  }

  function renderReportsSection() {
    const paymentStatusCounts = {
      success: payments.filter((item) => item.status === "success").length,
      pending: payments.filter((item) => item.status === "pending").length,
      failed: payments.filter((item) => item.status === "failed").length,
    };
    const paymentMax = Math.max(...Object.values(paymentStatusCounts), 1);

    return (
      <div className="space-y-6">
        <AdminAreaChart
          data={enrollmentChartData}
          title="Learner growth analytics"
          subtitle="A visual view of how new enrollments are moving month over month."
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className={shellCardClasses}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Top performance</p>
                <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950">Course performance leaderboard</h2>
              </div>
              <button
                type="button"
                onClick={() => moveToSection("courses")}
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Manage courses
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {topCourses.length === 0 ? (
                <EmptyState
                  title="No reportable course data"
                  description="Once courses start receiving enrollments, they will appear in the leaderboard."
                />
              ) : (
                topCourses.map((course, index) => {
                  const maxValue = Math.max(...topCourses.map((item) => item.enrollmentCount), 1);
                  return (
                    <article key={course.id} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold text-slate-900">{course.title}</h3>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                              {course.teacher?.name || "Faculty pending"}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-slate-600">
                          {course.enrollmentCount} enrollments
                        </span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#2563eb,#0ea5e9)]"
                          style={{ width: `${Math.max((course.enrollmentCount / maxValue) * 100, 10)}%` }}
                        />
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          <div className={`${shellCardClasses} space-y-5`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Payment health</p>
              <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950">Transaction status distribution</h2>
            </div>

            {Object.entries(paymentStatusCounts).map(([status, count]) => (
              <article key={status} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold capitalize text-slate-800">{status}</span>
                  <span className="text-slate-500">{count} payments</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      status === "success"
                        ? "bg-emerald-500"
                        : status === "failed"
                          ? "bg-rose-500"
                          : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.max((count / paymentMax) * 100, count ? 12 : 0)}%` }}
                  />
                </div>
              </article>
            ))}

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">Operations note</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use this section to spot unhealthy payment trends quickly and move into the payments tab
                when you need record-level visibility.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  function renderSettingsSection() {
    const settingItems = [
      {
        key: "emailDigests",
        title: "Email digests",
        description: "Send compact daily summaries of admin activity to the operations team.",
      },
      {
        key: "instantNotifications",
        title: "Instant notifications",
        description: "Surface payment and enrollment alerts immediately in the workspace.",
      },
      {
        key: "maintenanceMode",
        title: "Maintenance mode",
        description: "Prepare the platform for scheduled updates without changing production config here.",
      },
    ];

    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)]">
        <section className={shellCardClasses}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700">Settings</p>
            <h2 className="mt-2 text-2xl font-heading font-bold text-slate-950">Workspace preferences</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              These controls shape the admin experience and reserve space for future production settings.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {settingItems.map((item) => (
              <article key={item.key} className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="max-w-xl">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSetting(item.key)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
                    settingsState[item.key] ? "bg-blue-600" : "bg-slate-300"
                  }`}
                  aria-pressed={settingsState[item.key]}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white transition ${
                      settingsState[item.key] ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className={shellCardClasses}>
          <h2 className="text-2xl font-heading font-bold text-slate-950">Environment snapshot</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Admin search behavior</p>
              <p className="mt-2 leading-6">
                Global search currently filters the data lists inside the active admin workspace view.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Expandable foundation</p>
              <p className="mt-2 leading-6">
                This layout is ready for future modules such as announcements, category management,
                advanced reporting, and more detailed operational settings.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  function renderProfileSection() {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)]">
        <section className={shellCardClasses}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="h-24 w-24 rounded-[1.75rem] object-cover shadow-md" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-[linear-gradient(135deg,#1e293b,#0f172a)] text-2xl font-semibold text-white shadow-md">
                {getInitials(user?.name)}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Profile Management</p>
              <h2 className="mt-2 text-3xl font-heading font-bold text-slate-950">{user?.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
              <div className="mt-3 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                {user?.role}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admin route</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                You are using the dedicated Swadesh Academy operations workspace.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Connected modules</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Courses, teachers, users, enrollments, payments, reports, and settings.
              </p>
            </div>
          </div>
        </section>

        <section className={`${shellCardClasses} flex flex-col justify-between`}>
          <div>
            <h2 className="text-2xl font-heading font-bold text-slate-950">Account actions</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Jump to your full profile page for personal details or sign out from the admin console.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <NavLink
              to="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1d4ed8,#0ea5e9)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(37,99,235,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(37,99,235,0.3)]"
            >
              Open profile page
              <ExternalLink size={16} />
            </NavLink>
            <button
              type="button"
              onClick={signOut}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign out
            </button>
          </div>
        </section>
      </div>
    );
  }

  const sectionTitleMap = {
    dashboard: "Dashboard overview",
    courses: "Course management",
    students: "Student management",
    teachers: "Teacher management",
    enrollmentRequests: "Enrollment requests",
    enrollments: "Enrollment management",
    payments: "Payments",
    reports: "Reports & analytics",
    settings: "Settings",
    profile: "Profile management",
  };

  function renderSection() {
    switch (selectedSection) {
      case "courses":
        return renderCoursesSection();
      case "students":
        return renderStudentsSection();
      case "teachers":
        return renderTeachersSection();
      case "enrollmentRequests":
        return renderEnrollmentRequestsSection();
      case "enrollments":
        return renderEnrollmentsSection();
      case "payments":
        return renderPaymentsSection();
      case "reports":
        return renderReportsSection();
      case "settings":
        return renderSettingsSection();
      case "profile":
        return renderProfileSection();
      case "dashboard":
      default:
        return renderDashboardSection();
    }
  }

  return (
    <section className="admin-shell min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#eff5ff_44%,#f8fafc_100%)]">
      <AdminSidebar
        items={adminMenu}
        selectedSection={selectedSection}
        onSelectSection={moveToSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-[92px]" : "lg:pl-[288px]"
        }`}
      >
        <AdminTopbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          notificationCount={pendingPayments}
          user={user}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onCreateCourse={() => {
            resetCourseForm();
            moveToSection("courses");
          }}
          onCreateTeacher={() => {
            resetTeacherForm();
            moveToSection("teachers");
          }}
        />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Swadesh Academy Admin</p>
              <h1 className="mt-2 text-2xl font-heading font-bold text-slate-950 sm:text-3xl">
                {sectionTitleMap[selectedSection]}
              </h1>
            </div>
            {queryError ? (
              <div className="w-full max-w-xl">
                <FeedbackMessage type="error" message={queryError.message} />
              </div>
            ) : null}
          </div>

          {renderSection()}
        </main>
      </div>
    </section>
  );
}

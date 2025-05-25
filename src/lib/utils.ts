import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getInitials = (name: string) => {
  return name.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getPaginationRange(current: number, total: number, siblingCount = 1): (number | string)[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (total <= totalPageNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(current - siblingCount, 1);
  const rightSiblingIndex = Math.min(current + siblingCount, total);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < total - 1;

  const range: (number | string)[] = [];

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
    return [...leftRange, '...', total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => total - (3 + 2 * siblingCount) + 1 + i);
    return [1, '...', ...rightRange];
  }

  if (showLeftEllipsis && showRightEllipsis) {
    const middleRange = Array.from({ length: 2 * siblingCount + 1 }, (_, i) => leftSiblingIndex + i);
    return [1, '...', ...middleRange, '...', total];
  }

  return [];
}


export const getBorrowStatus = (dueDateStr: string) => {
  const today = new Date();
  const dueDate = new Date(dueDateStr);

  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

  const diffInDays =
    (dueDateOnly.getTime() - todayDateOnly.getTime()) / (1000 * 60 * 60 * 24);

  if (diffInDays < 0) {
    return {
      message: `Overdue by ${Math.abs(diffInDays)} day${Math.abs(diffInDays) > 1 ? "s" : ""}`,
      isOverdue: true,
    };
  }

  return {
    message: `${diffInDays} day${diffInDays > 1 ? "s" : ""} left until due`,
    isOverdue: false,
  };
};


//Jan 20
export const getMonthAndDay = (borrow_date: Date) => {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const borrowDate = new Date(borrow_date);
  const formattedBorrowDate = `${monthNames[borrowDate.getMonth()]} ${borrowDate.getDate()}`;

  return formattedBorrowDate
}
export const getMonthAndDayAndYear = (date: Date) => {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const newDate = new Date(date);
  const formattedBorrowDate = `${monthNames[newDate.getMonth()]} ${newDate.getDate()} ${newDate.getFullYear()}`;

  return formattedBorrowDate
}



const fallbackColors = [
  "bg-amber-100",
  "bg-red-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-teal-100",
  "bg-yellow-100",
];

export const getColorForUser = (key: string) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbackColors.length;
  return fallbackColors[index];
};

export const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
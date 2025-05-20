'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  triggerPagination: (page: number) => void;
  textColor?: string;
  bgColor?: string;
  descColor?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  triggerPagination,
  textColor = 'text-black',
  bgColor = 'bg-white',
  descColor = 'text-white',
}: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => triggerPagination(-1)}
        disabled={!hasPrevPage}
        className={`${!hasPrevPage ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          size="icon"
          onClick={() => triggerPagination(page - currentPage)}
          className={`${page === currentPage ? '' : ''}`}
        >
          {page}
        </Button>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => triggerPagination(1)}
        disabled={!hasNextPage}
        className={`${!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
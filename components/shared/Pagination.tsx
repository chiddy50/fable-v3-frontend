'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
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
    const maxVisiblePages = 3; // Reduced to show fewer numbers, since we're adding first/last buttons

    if (totalPages <= maxVisiblePages + 2) { // +2 for first and last page
      // Show all pages if the total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return { pages, showLeftEllipsis: false, showRightEllipsis: false };
    } else {
      // Always include current page
      pages.push(currentPage);
      
      // Add page before current if it exists and isn't the first page
      if (currentPage - 1 > 1) {
        pages.unshift(currentPage - 1);
      }
      
      // Add page after current if it exists and isn't the last page
      if (currentPage + 1 < totalPages) {
        pages.push(currentPage + 1);
      }
      
      // Determine if ellipses are needed
      const showLeftEllipsis = currentPage > 2;
      const showRightEllipsis = currentPage < totalPages - 1;
      
      return { pages, showLeftEllipsis, showRightEllipsis };
    }
  };

  const { pages, showLeftEllipsis, showRightEllipsis } = getPageNumbers();

  // Function to go to first page
  const goToFirstPage = () => {
    triggerPagination(1 - currentPage);
  };

  // Function to go to last page
  const goToLastPage = () => {
    triggerPagination(totalPages - currentPage);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* First Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={goToFirstPage}
        disabled={currentPage === 1}
        className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label="Go to first page"
      >
        <ChevronsLeft className="w-5 h-5" />
      </Button>

      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => triggerPagination(-1)}
        disabled={!hasPrevPage}
        className={`${!hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* First Page Number (always show) */}
      {!pages.includes(1) && (
        <>
          <Button
            variant={currentPage === 1 ? 'default' : 'outline'}
            size="icon"
            onClick={goToFirstPage}
            className={`cursor-pointer ${currentPage === 1 ? 'bg-gradient-to-r from-[#33164C] to-[#AA4A41]' : ''}`}
          >
            1
          </Button>
          
          {/* Left Ellipsis */}
          {showLeftEllipsis && (
            <span className="flex items-center justify-center w-10 h-10">
              <MoreHorizontal className="w-5 h-5" />
            </span>
          )}
        </>
      )}

      {/* Middle Page Numbers */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          size="icon"
          onClick={() => triggerPagination(page - currentPage)}
          className={`cursor-pointer ${page === currentPage ? 'bg-gradient-to-r from-[#33164C] to-[#AA4A41]' : ''}`}
        >
          {page}
        </Button>
      ))}

      {/* Last Page Number (always show) */}
      {!pages.includes(totalPages) && (
        <>
          {/* Right Ellipsis */}
          {showRightEllipsis && (
            <span className="flex items-center justify-center w-10 h-10">
              <MoreHorizontal className="w-5 h-5" />
            </span>
          )}
          
          <Button
            variant={currentPage === totalPages ? 'default' : 'outline'}
            size="icon"
            onClick={goToLastPage}
            className={`cursor-pointer ${currentPage === totalPages ? 'bg-gradient-to-r from-[#33164C] to-[#AA4A41]' : ''}`}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => triggerPagination(1)}
        disabled={!hasNextPage}
        className={`${!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label="Go to next page"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Last Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={goToLastPage}
        disabled={currentPage === totalPages}
        className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label="Go to last page"
      >
        <ChevronsRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
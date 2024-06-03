import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/react-query-provider";
import { Endpoints } from "@/types/endpoint";

interface SearchBarProps {
  filterText: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
  refetch: () => void;
}

export function SearchBar({ filterText, setFilterText, refetch }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRefetch = () =>{
    refetch();
    queryClient.invalidateQueries({ queryKey: [Endpoints.SUMMARY] })
  }

  return (
    <>
      <div className="p-4 pb-0">
        <div
          className="flex cursor-text items-center rounded-lg border-2 px-2"
          onClick={handleDivClick}
        >
          <Search className="text-gray-500" size={20}></Search>
          <Input
            ref={inputRef}
            className="border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Search"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          ></Input>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 pb-0 capitalize">
        <p>All Mails</p>
        <Button onClick={handleRefetch} variant="ghost">
          <RefreshCcw size={16} className="mr-2"></RefreshCcw>
          Refresh
        </Button>
      </div>
    </>
  );
}

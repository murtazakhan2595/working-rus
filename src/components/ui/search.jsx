import React from 'react'; 
import { useState } from 'react';
import { Input } from "./input";
import { Search as SearchIcon } from 'lucide-react';


function SearchInput() {
    const [search, setSearch] = useState("")
    const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="relative">
      <SearchIcon className="absolute w-4 h-4 right-[16px] top-[13px] text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="py-2 pl-4 pr-8 bg-background"
      />
      
    </div>
  );
}

export default SearchInput;

import React, { useEffect, useMemo, useState } from "react";
import { LinkCard } from "./LinkCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownAZ, ArrowUpAZ, RefreshCw, Search } from "lucide-react";
import { ILink } from "@/types/link";
import { linkApi } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useQuery } from "@tanstack/react-query";

export const LinkList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponse<ILink[]>>({
    queryKey: ["links"],
    queryFn: () => linkApi.getLinks(),
  });

  // Debug what we're getting from the API
  useEffect(() => {
    if (apiResponse) {
      console.log("API Response:", apiResponse);
    }
  }, [apiResponse]);

  // Define links with a default empty array to prevent null/undefined issues
  const links = useMemo(() => {
    if (apiResponse?.status === "success" && Array.isArray(apiResponse.data)) {
      return apiResponse.data;
    }
    return [];
  }, [apiResponse]);

  const deleteLink = async (id: string) => {
    try {
      const response = await linkApi.deleteLink(id);
      if (response.status === "success") {
        return true;
      } else {
        console.error("Error deleting link:", response.error);
        return false;
      }
    } catch (err) {
      console.error("Exception when deleting link:", err);
      return false;
    }
  };

  const handleDeleteLink = async (id: string) => {
    const success = await deleteLink(id);
    if (success) {
      refetch();
    }
  };

  const filteredLinks = useMemo(() => {
    // Debug the links array
    console.log("Links before filtering:", links);
    
    // Make sure links is an array before filtering
    if (!Array.isArray(links) || links.length === 0) {
      return [];
    }
    
    // If no search term, return all links
    if (!searchTerm || searchTerm.trim() === "") {
      return links;
    }
    
    const filtered = links.filter(
      (link) =>
        link.destinationUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Debug filtered results
    console.log("Filtered links:", filtered);
    return filtered;
  }, [links, searchTerm]);

  const sortedLinks = useMemo(() => {
    // Debug the filtered links
    console.log("Filtered links before sorting:", filteredLinks);
    
    // Make sure filteredLinks is an array before sorting
    if (!Array.isArray(filteredLinks) || filteredLinks.length === 0) {
      return [];
    }
    
    const sorted = [...filteredLinks].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
    
    // Debug sorted results
    console.log("Sorted links:", sorted);
    return sorted;
  }, [filteredLinks, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "desc" ? "asc" : "desc");
  };

  // Debug the component state
  useEffect(() => {
    console.log("Component state:", {
      isLoading,
      linksLength: links.length,
      filteredLinksLength: filteredLinks.length,
      sortedLinksLength: sortedLinks.length,
      searchTerm,
      sortDirection
    });
  }, [isLoading, links, filteredLinks, sortedLinks, searchTerm, sortDirection]);

  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2 text-red-500">Error loading links</h3>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <h2 className="text-2xl font-bold">Your Links</h2>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search links..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleSortDirection}
            title={`Sort by date ${sortDirection === "desc" ? "oldest first" : "newest first"}`}
          >
            {sortDirection === "desc" ? (
              <ArrowDownAZ className="h-4 w-4" />
            ) : (
              <ArrowUpAZ className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
            title="Refresh links"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
          <h3 className="text-lg font-medium">Loading links...</h3>
        </div>
      ) : sortedLinks.length > 0 ? (
        <div className="grid gap-4">
          {sortedLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onDelete={() => handleDeleteLink(link.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-2">No links found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "No links match your search. Try a different search term."
              : "You haven't created any links yet. Create your first link above!"}
          </p>
        </div>
      )}
    </div>
  );
};
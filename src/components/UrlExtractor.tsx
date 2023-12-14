"use client";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

import { CopyIcon, FileJsonIcon, PlusIcon, XIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUrlStore } from "@/lib/stores";

export function CopyButton(props: { text: string }) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => navigator.clipboard.writeText(props.text)}
    >
      <CopyIcon className="h-4 w-4" />
    </Button>
  );
}

export function GlobalUrlOptions(props: { newUrls: string[] }) {
  const { urls, add, reset } = useUrlStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Global Url Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(urls.join("\n"))}
        >
          <CopyIcon className="mr-2 h-4 w-4" />
          <span>Copy All</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(JSON.stringify(urls))}
        >
          <FileJsonIcon className="mr-2 h-4 w-4" />
          <span>Copy JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            add(props.newUrls);
          }}
          disabled={props.newUrls.length < 1}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          <span>Add Urls</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            reset();
          }}
        >
          <XIcon className="mr-2 h-4 w-4" />
          <span>Reset Urls</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ShareButton(props: { urls: string[]; disabled?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={props.disabled}>
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(props.urls.join("\n"))}
        >
          <CopyIcon className="mr-2 h-4 w-4" />
          <span>Copy All</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(props.urls))
          }
        >
          <FileJsonIcon className="mr-2 h-4 w-4" />
          <span>Copy JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const extractUrls = (html: string): string[] => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const anchorTags = Array.from(doc.getElementsByTagName("a"));
  const urls = anchorTags.map((tag) => tag.href);
  return urls;
};

// extract urls from an html string
export default function UrlExtractor() {
  const [results, setResults] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  // Function to handle the change in textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Function to handle button click
  const handleClick = () => {
    const urls = extractUrls(input);
    setResults(urls);
    console.log(urls);
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full">
      <Textarea
        className=""
        rows={10}
        cols={50}
        placeholder="Paste HTML here"
        value={input}
        onChange={handleChange}
      />
      <div className="flex flex-row items-center justify-center w-full gap-4">
        <Button className="" onClick={handleClick}>
          Extract URLs
        </Button>
        <ShareButton urls={results} disabled={results.length < 1} />
        <GlobalUrlOptions newUrls={results} />
      </div>

      <div className="flex flex-col gap-2 justify-center items-center">
        {results.map((url, index) => (
          <div
            className="flex flex-row items-center justify-between w-full"
            key={index}
          >
            <a
              className="text-blue-500 hover:underline"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              {url}
            </a>
            <CopyButton text={url} />
          </div>
        ))}
      </div>
    </div>
  );
}

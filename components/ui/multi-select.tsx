"use client";

import * as React from "react";
import { X, ChevronRight, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

type Option = {
  label: string;
  value: string;
  children?: Option[];
};

type SelectedOption = {
  topic: string;
  subtopic: string | null;
};

type MultiSelectProps = {
  options: Option[];
  selected: SelectedOption[];
  onChange: (selected: SelectedOption[]) => void;
  placeholder?: string;
  className?: string;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [expandedTopics, setExpandedTopics] = React.useState<string[]>([]);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (topic: string, subtopic: string | null) => {
    let newSelected = [...selected];
    const topicIndex = newSelected.findIndex((item) => item.topic === topic);

    if (topicIndex > -1) {
      if (subtopic === null) {
        // If "All" is clicked, remove all subtopics for this topic
        newSelected = newSelected.filter((item) => item.topic !== topic);
        newSelected.push({ topic, subtopic: null });
      } else {
        // If a subtopic is clicked
        const existingSubtopic = newSelected[topicIndex].subtopic;
        if (existingSubtopic === null) {
          // If "All" was selected, replace it with the clicked subtopic
          newSelected[topicIndex] = { topic, subtopic };
        } else if (existingSubtopic === subtopic) {
          // If the same subtopic is clicked again, remove it
          newSelected.splice(topicIndex, 1);
        } else {
          // If a different subtopic is clicked, add it
          newSelected.push({ topic, subtopic });
        }
      }
    } else {
      // If the topic wasn't selected before, add it
      newSelected.push({ topic, subtopic });
    }

    onChange(newSelected);
  };

  const removeOption = (topic: string, subtopic: string | null) => {
    const newSelected = selected.filter(
      (item) => !(item.topic === topic && item.subtopic === subtopic),
    );
    onChange(newSelected);
  };

  const toggleExpanded = (topic: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(search.toLowerCase()) ||
      option.children?.some((child) =>
        child.label.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  const isTopicSelected = (topic: string) =>
    selected.some((item) => item.topic === topic);
  const isSubtopicSelected = (topic: string, subtopic: string) =>
    selected.some((item) => item.topic === topic && item.subtopic === subtopic);

  return (
    <div className="relative" ref={ref}>
      <div
        className={cn(
          "flex flex-wrap gap-2 min-h-[38px] items-center border border-input rounded-md p-1 cursor-text",
          className,
        )}
        onClick={() => setIsOpen(true)}
      >
        {selected.map(({ topic, subtopic }) => (
          <Badge
            key={`${topic}-${subtopic}`}
            variant="secondary"
            className="mr-1 rounded-xl"
          >
            {topic} {subtopic ? `> ${subtopic}` : "> All"}
            <button
              className="ml-1"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(topic, subtopic);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          type="text"
          className="flex-grow outline-none bg-transparent"
          placeholder={selected.length === 0 ? placeholder : ""}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-auto rounded-xl">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div key={option.value}>
                <div
                  className={`px-3 py-2 cursor-pointer hover:bg-[#E8F4FC] flex items-center justify-between rounded-xl ${
                    isTopicSelected(option.label) &&
                    !selected.some(
                      (item) =>
                        item.topic === option.label && item.subtopic !== null,
                    )
                      ? "bg-[#C8E6C9]"
                      : ""
                  }`}
                  onClick={() => {
                    toggleOption(option.label, null);
                    toggleExpanded(option.value);
                  }}
                >
                  <span>{option.label}</span>
                  {option.children &&
                    (expandedTopics.includes(option.value) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                </div>
                {expandedTopics.includes(option.value) && option.children && (
                  <div className="ml-4">
                    {option.children.map((child) => (
                      <div
                        key={child.value}
                        className={`px-3 py-2 cursor-pointer hover:bg-[#E8F4FC] rounded-xl ${
                          isSubtopicSelected(option.label, child.label)
                            ? "bg-[#C8E6C9]"
                            : ""
                        }`}
                        onClick={() => toggleOption(option.label, child.label)}
                      >
                        {child.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}

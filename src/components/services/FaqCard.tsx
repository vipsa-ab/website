import { useState } from "react";
import { cn } from "@/lib/utils";

interface FaqCardProps {
  question: string;
  answer: string;
}

export const FaqCard = ({ question, answer }: FaqCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6">
      <button
        onClick={toggleOpen}
        className="flex w-full cursor-pointer items-center justify-between font-bold"
      >
        {question}
        <svg
          width="1em"
          height="1em"
          className={cn(
            "text-primary size-6 transition-transform duration-300",
            isOpen ? "rotate-0" : "-rotate-180",
          )}
          data-icon="material-symbols:expand-more"
        >
          {" "}
          <symbol id="ai:material-symbols:expand-more" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m12 15.375l-6-6l1.4-1.4l4.6 4.6l4.6-4.6l1.4 1.4z"
            ></path>
          </symbol>
          <use href="#ai:material-symbols:expand-more"></use>{" "}
        </svg>
      </button>
      {isOpen && (
        <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
};
